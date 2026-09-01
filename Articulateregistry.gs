/**
 * ArticulateRegistry.gs
 *
 * Verwaltet die Zuordnungstabelle fuer Articulate-Rise-Preview-Projekte:
 *   Kurs  <->  Phrase-Projekt/Job  <->  Drive-Ordner (SCORM)  <->  Firebase-Pfad
 *
 * Bewusst im Stil der bestehenden Translation-Services-Module gehalten
 * (apiXxx-Namenskonvention, Sheet als Datenquelle, Header-basierte
 * Spaltenaufloesung statt fester Indizes), damit die spaetere Uebernahme
 * ins Portal ohne Umbau moeglich ist.
 *
 * Sheet: "Projects" in ARTICULATE_SHEET_ID
 */

var ARTICULATE_SHEET_ID_ = "1V6oyZVw7-CPy8Bs5_sGl9Cg886b2T6r7FLGgp1gfBRY";
var ARTICULATE_SHEET_NAME_ = "Projects";

var ARTICULATE_HEADERS_ = [
  "ID",              // interne, stabile Zeilen-ID (UUID)
  "Course Name",     // Anzeigename im Dashboard
  "Target Lang",     // z.B. de-DE
  "Project UID",     // Phrase
  "Job UID",         // Phrase
  "Drive Folder ID", // entpackter SCORM-Export
  "Firebase Site",   // z.B. kaercher-course-preview
  "Firebase Path",   // z.B. growth-mindset/de-DE
  "Live URL",        // zuletzt erzeugter Link
  "Last Deploy",     // Zeitstempel des letzten erfolgreichen Deploys
  "Last Status",     // OK / ERROR + Kurzinfo
  "Created By",      // E-Mail
  "Created At",
  "Chat Thread",
  "Last Job Status",
  "Deploy Msg"
];

/**
 * Oeffnet das Articulate-Sheet und legt es bei Bedarf mit Headern an.
 */
function openArticulateSheet_() {
  var ss = SpreadsheetApp.openById(ARTICULATE_SHEET_ID_);
  var sh = ss.getSheetByName(ARTICULATE_SHEET_NAME_);

  if (!sh) {
    sh = ss.insertSheet(ARTICULATE_SHEET_NAME_);
  }

  // Header schreiben, falls Sheet leer ist oder die erste Zeile nicht passt.
  if (sh.getLastRow() === 0) {
    sh.appendRow(ARTICULATE_HEADERS_);
    sh.getRange(1, 1, 1, ARTICULATE_HEADERS_.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }

  return sh;
}

/**
 * Baut eine Map {headerNameLowerCase: spaltenIndex} aus der Kopfzeile.
 * Header-basiert statt fester Indizes, damit spaeteres Umsortieren/
 * Ergaenzen von Spalten im Sheet den Code nicht bricht.
 */
function articulateHeaderIndex_(sh) {
  var lastCol = Math.max(sh.getLastColumn(), ARTICULATE_HEADERS_.length);
  var header = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var idx = {};
  header.forEach(function (h, i) {
    var key = String(h || "").trim().toLowerCase();
    if (key) idx[key] = i;
  });
  return idx;
}

function articulateRowToObject_(row, idx, rowIndex) {
  function val(headerName) {
    var i = idx[headerName.toLowerCase()];
    return i != null ? String(row[i] || "").trim() : "";
  }
  return {
    rowIndex: rowIndex,
    id: val("ID"),
    courseName: val("Course Name"),
    targetLang: val("Target Lang"),
    projectUid: val("Project UID"),
    jobUid: val("Job UID"),
    driveFolderId: val("Drive Folder ID"),
    firebaseSite: val("Firebase Site"),
    firebasePath: val("Firebase Path"),
    liveUrl: val("Live URL"),
    lastDeploy: val("Last Deploy"),
    lastStatus: val("Last Status"),
    createdBy: val("Created By"),
    createdAt: val("Created At"),
    chatThread: val("Chat Thread"),
    lastJobStatus: val("Last Job Status"),
    deployMsgName: val("Deploy Msg"),
    phraseUrl: val("Project UID")
      ? "https://cloud.memsource.com/web/project/show/" +
        encodeURIComponent(val("Project UID"))
      : ""
  };
}

/**
 * API: Alle Articulate-Projekte auflisten (fuer das spaetere Dashboard).
 */
function apiListArticulateProjects() {
  var sh = openArticulateSheet_();
  var lastRow = sh.getLastRow();
  if (lastRow < 2) return { rows: [] };

  var idx = articulateHeaderIndex_(sh);
  var values = sh.getRange(2, 1, lastRow - 1, sh.getLastColumn()).getValues();

  var out = [];
  for (var i = 0; i < values.length; i++) {
    var obj = articulateRowToObject_(values[i], idx, i + 2);
    if (!obj.id && !obj.courseName) continue; // Leerzeile ueberspringen
    out.push(obj);
  }

  out.reverse(); // neueste zuerst, wie bei apiListMyProjects
  return { rows: out };
}

/**
 * API: Neues Articulate-Projekt anlegen.
 *
 * @param {Object} p
 * @param {string} p.courseName
 * @param {string} p.targetLang
 * @param {string} p.projectUid
 * @param {string} p.jobUid
 * @param {string} p.driveFolderId   ODER p.driveFolderUrl
 * @param {string} [p.driveFolderUrl] volle Drive-URL (ID wird extrahiert)
 * @param {string} [p.firebaseSite]  Default: kaercher-course-preview
 * @param {string} [p.firebasePath]  Default: automatisch aus Kursname+Sprache
 */
function apiCreateArticulateProject(p) {
  p = p || {};

  var courseName = String(p.courseName || "").trim();
  var targetLang = String(p.targetLang || "").trim();
  var projectUid = String(p.projectUid || "").trim();
  var jobUid = String(p.jobUid || "").trim();

  var driveFolderId = String(p.driveFolderId || "").trim();
  if (!driveFolderId && p.driveFolderUrl) {
    driveFolderId = extractDriveFolderId_(String(p.driveFolderUrl));
  }

  if (!courseName) throw new Error("Course Name fehlt.");
  if (!targetLang) throw new Error("Target Lang fehlt.");
  if (!projectUid) throw new Error("Phrase Project UID fehlt.");
  if (!jobUid) throw new Error("Phrase Job UID fehlt.");
  if (!driveFolderId) throw new Error("Drive-Ordner-ID/URL fehlt oder ungueltig.");

  var firebaseSite = String(p.firebaseSite || "").trim() || "kaercher-course-preview";
  var firebasePath =
    String(p.firebasePath || "").trim() ||
    slugifyForPath_(courseName) + "/" + slugifyForPath_(targetLang);

  var sh = openArticulateSheet_();
  var idx = articulateHeaderIndex_(sh);

  var id = Utilities.getUuid();
  var createdBy = "";
  try {
    createdBy = Session.getActiveUser().getEmail() || "";
  } catch (e) {
    // In manchen Ausfuehrungskontexten nicht verfuegbar - unkritisch.
  }

  var row = new Array(Math.max(sh.getLastColumn(), ARTICULATE_HEADERS_.length)).fill("");
  function put(headerName, value) {
    var i = idx[headerName.toLowerCase()];
    if (i != null) row[i] = value;
  }

  put("ID", id);
  put("Course Name", courseName);
  put("Target Lang", targetLang);
  put("Project UID", projectUid);
  put("Job UID", jobUid);
  put("Drive Folder ID", driveFolderId);
  put("Firebase Site", firebaseSite);
  put("Firebase Path", firebasePath);
  put("Created By", createdBy);
  put("Created At", new Date());

  sh.appendRow(row);

  return { ok: true, id: id, firebasePath: firebasePath };
}

/**
 * API: Projekt-Eintrag anhand der internen ID holen.
 */
function getArticulateProjectById_(id) {
  var listing = apiListArticulateProjects();
  var wanted = String(id || "").trim();
  for (var i = 0; i < listing.rows.length; i++) {
    if (listing.rows[i].id === wanted) return listing.rows[i];
  }
  throw new Error("Kein Articulate-Projekt mit ID " + wanted + " gefunden.");
}

/**
 * Schreibt Deploy-Ergebnis (URL, Zeitstempel, Status) in die Zeile zurueck.
 */
function updateArticulateDeployResult_(rowIndex, liveUrl, status) {
  var sh = openArticulateSheet_();
  var idx = articulateHeaderIndex_(sh);

  function setCell(headerName, value) {
    var i = idx[headerName.toLowerCase()];
    if (i != null) sh.getRange(rowIndex, i + 1).setValue(value);
  }

  if (liveUrl) setCell("Live URL", liveUrl);
  setCell("Last Deploy", new Date());
  setCell("Last Status", status || "");
}

/**
 * API: Projekt-Eintrag loeschen.
 */
function apiDeleteArticulateProject(id) {
  var project = getArticulateProjectById_(id);
  var sh = openArticulateSheet_();
  sh.deleteRow(project.rowIndex);
  return { ok: true };
}

/**
 * Extrahiert die Ordner-ID aus einer Drive-URL.
 * Unterstuetzt /folders/<ID> sowie ?id=<ID>. Ist der Input bereits eine
 * blanke ID, wird sie unveraendert zurueckgegeben.
 */
function extractDriveFolderId_(urlOrId) {
  var s = String(urlOrId || "").trim();
  if (!s) return "";

  var m = s.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];

  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];

  // Keine URL-Struktur erkannt -> als blanke ID behandeln.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(s)) return s;

  return "";
}

/**
 * Macht aus "Growth Mindset: unlock..." -> "growth-mindset-unlock"
 * (URL-taugliches Pfadsegment fuer Firebase Hosting).
 */
function slugifyForPath_(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[????]/g, function (c) {
      return { "?": "ae", "?": "oe", "?": "ue", "?": "ss" }[c];
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60) || "kurs";
}