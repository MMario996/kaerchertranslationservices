/**
 * PivotProjects.gs
 * "Pivot" / Job-based-Trigger Parent-Child Projekte (Phrase Orchestrator).
 *
 * Hintergrund (siehe Phrase Orchestrator Workflow "Project-Based Trigger:
 * Child-Project-v3"):
 * - Ein PARENT-Projekt wird aus einem Template erstellt, dessen Name "pivot"
 *   enthaelt (Gross-/Kleinschreibung egal). Es hat ein Custom Field
 *   "Pivot languages" (MULTI_SELECT), das festlegt, in welche Sprachen nach
 *   Abschluss weiterpivotiert werden soll.
 * - Damit der Orchestrator ueberhaupt reagiert, MUSS das Projekt-Notizfeld
 *   ("note") den Text "Child Project Creation" enthalten (Trigger-Filter:
 *   project.note match "Child Project Creation" AND project.status = COMPLETED).
 * - Sobald das PARENT-Projekt auf COMPLETED springt, erstellt der Orchestrator
 *   automatisch ein CHILD-Projekt mit dem Namen "<Parent-Projektname> (a Child)"
 *   und befuellt es mit den Zieldateien fuer die Pivot-Sprachen.
 *
 * Diese Datei sorgt dafuer, dass unser Portal:
 * 1) beim Erstellen eines Parent-Projekts den Note-Marker nicht durch eine
 *    eigene Notiz des Einreichers ueberschreibt,
 * 2) im Chat-Thread eine eigene "Parent-Child project" Meldung sendet,
 * 3) bei Abschluss des Parent-Projekts (Source-Check) im selben Thread meldet
 *    UND den Thread offen haelt (statt ihn wie sonst ueblich zu loeschen),
 * 4) das automatisch erstellte Child-Projekt anhand der Namenskonvention
 *    findet, als eigene Queue-Zeile anlegt und weiterverfolgt,
 * 5) bei Abschluss des Child-Projekts (Translation) eine finale Meldung in
 *    demselben Thread sendet und den Thread erst dann schliesst.
 */

var PIVOT_CHILD_SUFFIX_  = " (a Child)";
var PIVOT_NOTE_MARKER_   = "Child Project Creation";

var PIVOT_COL_ROLE_  = "Pivot Role";   // "PARENT" | "CHILD"
var PIVOT_COL_LINK_  = "Pivot Link";   // Gegenstueck-Projekt-UID
var PIVOT_COL_STATE_ = "Pivot State";  // nur auf PARENT-Zeilen relevant

var PIVOT_STATE_WAITING_PARENT_ = "WAITING_PARENT"; // Source-Check laeuft noch
var PIVOT_STATE_WAITING_CHILD_  = "WAITING_CHILD";  // Source-Check fertig, Child wird gesucht
var PIVOT_STATE_CHILD_LINKED_   = "CHILD_LINKED";   // Child gefunden, Translation laeuft
var PIVOT_STATE_DONE_           = "DONE";           // Translation fertig, Thread geschlossen

// ============================================================================
// Template-Erkennung
// ============================================================================

/**
 * Ein Template gilt als "Pivot-Template" (Parent fuer einen Job-based
 * Trigger), wenn sein Name irgendwo "pivot" enthaelt - unabhaengig von
 * Gross-/Kleinschreibung.
 */
function isPivotTemplateName_(templateName) {
  return /pivot/i.test(String(templateName || ""));
}

/**
 * Stellt sicher, dass der an Phrase gesendete "note"-Wert den Marker
 * enthaelt, den der Orchestrator-Trigger erwartet - auch wenn der
 * Einreicher selbst eine Notiz eingegeben hat. Ohne diesen Marker wuerde
 * der automatische Child-Projekt-Workflow nie anspringen.
 */
function pivotBuildNote_(userNote) {
  var note = String(userNote || "").trim();
  if (note.indexOf(PIVOT_NOTE_MARKER_) !== -1) return note;
  return note ? (note + "\n\n" + PIVOT_NOTE_MARKER_) : PIVOT_NOTE_MARKER_;
}

// ============================================================================
// Queue-Sheet: Pivot-Spalten (per Header-Name, selbstheilend)
// ============================================================================

/**
 * Liefert die 1-basierten Spaltennummern fuer die drei Pivot-Spalten und legt
 * sie am Sheet-Ende an, falls sie noch nicht existieren. Nutzt Header-Namen
 * statt fester Positionsindizes, damit bestehende Spalten unangetastet
 * bleiben (Queue-Sheet-Layout ist an anderer Stelle bereits positionsbasiert
 * gewachsen und teils uneindeutig - hier bewusst robust dagegen).
 */
// Einfacher In-Memory-Cache fuer die Spaltenpositionen, gueltig fuer die
// Dauer EINER Script-Ausfuehrung (globale Variablen werden bei jedem neuen
// Trigger-/Request-Lauf von Apps Script frisch initialisiert). Vermeidet,
// dass bei hunderten Queue-Zeilen pro Sync-Lauf fuer jede Zeile erneut die
// Kopfzeile gelesen wird.
var _pivotColsCache_ = null;
var _pivotColsCacheSheetId_ = null;

function pivotColumnsCached_(sh) {
  var sheetId = sh.getSheetId();
  if (!_pivotColsCache_ || _pivotColsCacheSheetId_ !== sheetId) {
    _pivotColsCache_ = pivotColumns_(sh);
    _pivotColsCacheSheetId_ = sheetId;
  }
  return _pivotColsCache_;
}

function pivotColumns_(sh) {
  var lastCol = Math.max(sh.getLastColumn(), 1);
  var header  = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || "").trim();
  });

  function findOrCreate(name) {
    for (var i = 0; i < header.length; i++) {
      if (header[i] === name) return i + 1;
    }
    header.push(name);
    var col = header.length;
    sh.getRange(1, col).setValue(name);
    return col;
  }

  return {
    role:  findOrCreate(PIVOT_COL_ROLE_),
    link:  findOrCreate(PIVOT_COL_LINK_),
    state: findOrCreate(PIVOT_COL_STATE_)
  };
}

function pivotReadRow_(sh, rowNum, cols) {
  var vals = sh.getRange(rowNum, 1, 1, Math.max(sh.getLastColumn(), cols.state)).getValues()[0];
  return {
    role:  String(vals[cols.role  - 1] || "").trim(),
    link:  String(vals[cols.link  - 1] || "").trim(),
    state: String(vals[cols.state - 1] || "").trim()
  };
}

function pivotWriteRow_(sh, rowNum, cols, data) {
  if (data.role  !== undefined) sh.getRange(rowNum, cols.role).setValue(data.role);
  if (data.link  !== undefined) sh.getRange(rowNum, cols.link).setValue(data.link);
  if (data.state !== undefined) sh.getRange(rowNum, cols.state).setValue(data.state);
}

/**
 * Vom Upload-Flow aufgerufen, direkt nachdem die neue Parent-Projekt-Zeile
 * angehaengt wurde. Markiert die Zeile als Pivot-Parent.
 */
function pivotTagNewParentRow_(sh, rowNum) {
  var cols = pivotColumnsCached_(sh);
  pivotWriteRow_(sh, rowNum, cols, { role: "PARENT", link: "", state: PIVOT_STATE_WAITING_PARENT_ });
}

// ============================================================================
// Status-Wechsel-Hook (von AutoSync.gs UND vom manuellen Sync in WebApp.gs
// aufgerufen). Gibt true zurueck, wenn die Zeile eine Pivot-Zeile war und die
// komplette Benachrichtigungs-/Status-Logik hier bereits erledigt wurde -
// der Aufrufer soll dann seine eigene (normale) Logik fuer diese Zeile
// ueberspringen.
// ============================================================================

var PIVOT_COMPLETION_STATUSES_ = ["COMPLETED", "DELIVERED"];

function pivotHandleStatusChange_(sh, rowNum, row, newStatus, currentStatus) {
  var cols = pivotColumnsCached_(sh);
  var info = pivotReadRow_(sh, rowNum, cols);
  if (info.role !== "PARENT" && info.role !== "CHILD") return false;

  // Status in jedem Fall in Spalte H (8) spiegeln, wie die normale Logik es
  // auch tun wuerde - Pivot-Zeilen sollen in "My Projects" trotzdem den
  // aktuellen Phrase-Status zeigen.
  sh.getRange(rowNum, 8).setValue(newStatus);

  if (info.role === "CHILD") {
    // Child-Zeilen haben keinen eigenen Thread. Abschluss wird ueber die
    // PARENT-Zeile gemeldet.
    try { pivotHandleChildCompletion_(sh, rowNum, row, newStatus, currentStatus); } catch (e) {
      console.warn("⚠ pivotHandleChildCompletion_ failed: " + e.message);
    }
    return true;
  }

  // --- PARENT-Zeile -----------------------------------------------------
  var isNowDone = PIVOT_COMPLETION_STATUSES_.indexOf(newStatus) !== -1;
  var wasDone   = PIVOT_COMPLETION_STATUSES_.indexOf(currentStatus) !== -1;
  if (!isNowDone || wasDone) return true; // nichts Neues fuer uns zu tun

  if (info.state !== PIVOT_STATE_WAITING_PARENT_) return true; // schon behandelt

  var projectUid  = String(row[2]  || "").trim();
  var projectName = String(row[11] || row[4] || projectUid).trim();
  var rowUser      = String(row[1]  || "").toLowerCase().trim();
  var sharedWith    = String(row[17] || "").trim();
  var sharedThreads = _parseSharedThreads_(String(row[20] || "").trim());
  var threadMsgName = String(row[19] || "").trim();
  var phraseUrl     = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

  var msg = fillTemplate_(getMessageTemplate_("MSG_PIVOT_PARENT_COMPLETED", "en"), {
    PROJECT_NAME: projectName,
    PHRASE_ID:    projectUid,
    STATUS:       newStatus,
    PHRASE_URL:   phraseUrl
  });

  if (threadMsgName) {
    try { sendThreadReply_(rowUser, threadMsgName, msg); } catch (e) {
      try { sendPrivateMessage_(rowUser, msg); } catch (e2) {}
    }
  } else {
    try { sendPrivateMessage_(rowUser, msg); } catch (e) {}
  }
  _notifySharedUsers_(sharedWith, sharedThreads, msg);

  // WICHTIG: Thread NICHT loeschen (anders als normale Projekte) - wir
  // brauchen ihn noch fuer die Child-Completion-Meldung.
  pivotWriteRow_(sh, rowNum, cols, { state: PIVOT_STATE_WAITING_CHILD_ });

  console.log("• Pivot: Parent " + projectUid + " fertig, warte auf Child-Projekt (\"" +
    projectName + PIVOT_CHILD_SUFFIX_ + "\").");

  return true;
}

// ============================================================================
// Child-Projekt-Discovery (per Sync-Lauf einmal aufgerufen)
// ============================================================================

/**
 * Sucht fuer alle PARENT-Zeilen im Status WAITING_CHILD das vom Orchestrator
 * automatisch erstellte Child-Projekt (Name = "<Parent-Name> (a Child)") und
 * legt bei Fund eine eigene Queue-Zeile dafuer an.
 */
function pivotDiscoverAndTrackChildren_() {
  var sh = getQueueSheet_();
  var data = sh.getDataRange().getValues();
  if (data.length < 2) return;

  var cols = pivotColumnsCached_(sh);
  var waiting = [];
  for (var i = 1; i < data.length; i++) {
    var role  = String(data[i][cols.role  - 1] || "").trim();
    var state = String(data[i][cols.state - 1] || "").trim();
    if (role === "PARENT" && state === PIVOT_STATE_WAITING_CHILD_) {
      waiting.push({ rowNum: i + 1, row: data[i] });
    }
  }
  if (!waiting.length) return;

  waiting.forEach(function (entry) {
    try {
      pivotTryLinkChild_(sh, cols, entry.rowNum, entry.row);
    } catch (e) {
      console.warn("⚠ pivotTryLinkChild_ failed for row " + entry.rowNum + ": " + e.message);
    }
  });
}

function pivotTryLinkChild_(sh, cols, rowNum, row) {
  var parentUid  = String(row[2]  || "").trim();
  var parentName = String(row[11] || row[4] || parentUid).trim();
  var childName  = parentName + PIVOT_CHILD_SUFFIX_;

  var child = pivotFindProjectByExactName_(childName);
  if (!child) return; // Child existiert (noch) nicht - naechster Sync-Lauf versucht es erneut

  var rowUser      = String(row[1]  || "").toLowerCase().trim();
  var sharedWith    = String(row[17] || "").trim();
  var templateName  = String(row[18] || "").trim();
  var dueDate       = row[12] || "";

  pivotCreateChildQueueRow_(sh, {
    ownerEmail:   rowUser,
    sharedWith:   sharedWith,
    templateName: templateName,
    dueDate:      dueDate,
    parentUid:    parentUid
  }, child);

  pivotWriteRow_(sh, rowNum, cols, { link: child.uid, state: PIVOT_STATE_CHILD_LINKED_ });

  console.log("• Pivot: Child-Projekt gefunden fuer Parent " + parentUid + " ? " + child.uid + " (\"" + childName + "\")");
}

/**
 * Legt eine neue Queue-Zeile fuer das automatisch erstellte Child-Projekt an,
 * damit es in "My Projects" auftaucht (Status, Download etc. laufen danach
 * ueber die normalen Mechanismen). Kein Chat-Thread auf dieser Zeile - alle
 * Meldungen laufen ueber die Parent-Zeile.
 */
function pivotCreateChildQueueRow_(sh, parentInfo, child) {
  var targetLangs = Array.isArray(child.targetLangs) ? child.targetLangs.join(", ") : "";

  var row = [
    new Date().toISOString(),       // Timestamp
    parentInfo.ownerEmail,          // User
    child.uid,                      // Project UID
    "pivot_child",                  // File-ID-Quelle (kein echter Upload)
    child.name,                     // Dateiname (Fallback)
    "",                             // Mime
    targetLangs,                    // Target Langs
    String(child.status || "NEW"),  // Status
    "[]",                           // Job UIDs (werden bei Bedarf ueber Phrase nachgeladen)
    "",                             // (frei)
    "",                             // (frei)
    child.name,                     // Project Name
    parentInfo.dueDate || "",       // Due Date
    "", "", "", "",                 // (frei)
    parentInfo.sharedWith || "",    // Shared With
    parentInfo.templateName || "",  // Template Name
    "",                             // Thread-ID (keine eigene - laeuft ueber Parent)
    "[]",                           // Job Mapping
    ""                              // (frei)
  ];
  sh.appendRow(row);

  var newRowNum = sh.getLastRow();
  var cols = pivotColumnsCached_(sh);
  pivotWriteRow_(sh, newRowNum, cols, { role: "CHILD", link: parentInfo.parentUid, state: "" });
}

/**
 * Sucht ein Phrase-Projekt mit EXAKT passendem Namen. Nutzt v2 /projects mit
 * dem "name"-Filter als (best-effort) Server-Vorfilter und prueft das
 * Ergebnis zusaetzlich clientseitig auf exakte Gleichheit, falls der Filter
 * von Phrase nur als Teilstring-Suche behandelt wird.
 */
function pivotFindProjectByExactName_(exactName) {
  var authHeader = { Authorization: getPhraseAuthHeader_() };
  var pageNumber = 0;
  var pageSize   = 50;
  var maxPages   = 20; // Sicherheitslimit, siehe KeCProjects.gs fuer das gleiche Muster

  while (pageNumber < maxPages) {
    var url = phraseApiUrlV2_(
      "/projects?name=" + encodeURIComponent(exactName) +
      "&pageNumber=" + pageNumber + "&pageSize=" + pageSize
    );
    var res;
    try {
      res = phraseFetchJson_(url, { method: "get", headers: authHeader });
    } catch (e) {
      console.warn("⚠ pivotFindProjectByExactName_ fehlgeschlagen: " + e.message);
      return null;
    }

    var page = (res && Array.isArray(res.content)) ? res.content : (Array.isArray(res) ? res : []);
    if (!page.length) break;

    for (var i = 0; i < page.length; i++) {
      if (String(page[i].name || "").trim() === exactName) {
        return {
          uid:         page[i].uid,
          name:        page[i].name,
          status:      page[i].status,
          targetLangs: Array.isArray(page[i].targetLangs) ? page[i].targetLangs : []
        };
      }
    }

    if (page.length < pageSize) break;
    pageNumber++;
  }
  return null;
}

// ============================================================================
// Child-Completion: finale Meldung ueber die Parent-Zeile
// ============================================================================

/**
 * Wird nach pivotHandleStatusChange_ fuer CHILD-Zeilen zusaetzlich
 * aufgerufen: sobald das Child fertig ist, wird die Abschluss-Meldung in den
 * Thread der PARENT-Zeile geschrieben und der Thread danach geschlossen.
 */
function pivotHandleChildCompletion_(sh, childRowNum, childRow, newStatus, currentStatus) {
  var isNowDone = PIVOT_COMPLETION_STATUSES_.indexOf(newStatus) !== -1;
  var wasDone   = PIVOT_COMPLETION_STATUSES_.indexOf(currentStatus) !== -1;
  if (!isNowDone || wasDone) return;

  var cols = pivotColumnsCached_(sh);
  var childInfo = pivotReadRow_(sh, childRowNum, cols);
  var parentUid = childInfo.link;
  if (!parentUid) return;

  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2] || "").trim() !== parentUid) continue;

    var parentRowNum = i + 1;
    var parentInfo = pivotReadRow_(sh, parentRowNum, cols);
    if (parentInfo.state === PIVOT_STATE_DONE_) return; // schon gemeldet

    var parentRow      = data[i];
    var childProjectUid  = String(childRow[2]  || "").trim();
    var childProjectName = String(childRow[11] || childRow[4] || childProjectUid).trim();
    var rowUser        = String(parentRow[1]  || "").toLowerCase().trim();
    var sharedWith      = String(parentRow[17] || "").trim();
    var sharedThreads   = _parseSharedThreads_(String(parentRow[20] || "").trim());
    var threadMsgName   = String(parentRow[19] || "").trim();
    var phraseUrl        = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(childProjectUid);

    var msg = fillTemplate_(getMessageTemplate_("MSG_PIVOT_CHILD_COMPLETED", "en"), {
      PROJECT_NAME: childProjectName,
      PHRASE_ID:    childProjectUid,
      STATUS:       newStatus,
      PHRASE_URL:   phraseUrl
    });

    if (threadMsgName) {
      try { sendThreadReply_(rowUser, threadMsgName, msg); } catch (e) {
        try { sendPrivateMessage_(rowUser, msg); } catch (e2) {}
      }
    } else {
      try { sendPrivateMessage_(rowUser, msg); } catch (e) {}
    }
    _notifySharedUsers_(sharedWith, sharedThreads, msg);

    pivotWriteRow_(sh, parentRowNum, cols, { state: PIVOT_STATE_DONE_ });
    _clearThreadIds_(sh, parentRowNum);

    console.log("• Pivot: Child " + childProjectUid + " fertig - Parent-Thread abgeschlossen (" + parentUid + ").");
    return;
  }
}
