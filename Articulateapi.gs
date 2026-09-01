/**
 * ArticulateApi.gs
 *
 * API-Schicht zwischen der Translation-Services-UI und den
 * Articulate-Preview-Modulen (ArticulateRegistry.gs / ArticulatePreview.gs).
 *
 * Folgt bewusst den bestehenden Projektkonventionen:
 *   - apiXxx-Namen fuer alles, was das Frontend per google.script.run ruft
 *   - Whitelist-Sheet analog zu "Whitelist_Marketing"
 *   - Fehler werden als Exception geworfen (Frontend faengt sie im
 *     withFailureHandler ab, wie ueberall sonst auch)
 */

var ARTICULATE_WHITELIST_SHEET_ = "Whitelist_Articulate";

/* ==========================================================================
   WHITELIST
   ========================================================================== */

function apiGetArticulateWhitelist() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(ARTICULATE_WHITELIST_SHEET_);
  if (!sh) {
    var newSh = ss.insertSheet(ARTICULATE_WHITELIST_SHEET_);
    newSh.appendRow(["Email"]);
    return { emails: [] };
  }
  var rows = sh.getDataRange().getValues();
  var emails = [];
  for (var i = 1; i < rows.length; i++) {
    var v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails: emails };
}

function apiAddArticulateWhitelist(emailToAdd) {
  var email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  var add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || add.indexOf("@") === -1) throw new Error("Invalid email.");
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(ARTICULATE_WHITELIST_SHEET_);
  if (!sh) {
    sh = ss.insertSheet(ARTICULATE_WHITELIST_SHEET_);
    sh.appendRow(["Email"]);
  }
  var existing = apiGetArticulateWhitelist().emails;
  if (existing.indexOf(add) === -1) sh.appendRow([add]);
  return apiGetArticulateWhitelist();
}

function apiRemoveArticulateWhitelist(emailToRemove) {
  var email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  var rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetArticulateWhitelist();
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(ARTICULATE_WHITELIST_SHEET_);
  if (!sh) return { emails: [] };
  var rows = sh.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
    }
  }
  return apiGetArticulateWhitelist();
}

function isArticulateUser_(email) {
  var wl = apiGetArticulateWhitelist().emails;
  return wl.indexOf(String(email || "").trim().toLowerCase()) !== -1;
}

/* ==========================================================================
   PROJEKTLISTE FUER DAS DASHBOARD
   ========================================================================== */

/**
 * Liefert die Articulate-Projekte fuer die UI-Tabelle.
 * Nicht-Admins sehen nur ihre eigenen Eintraege - gleiche Logik wie bei
 * apiListMyProjects().
 */
function apiListArticulateProjectsForUi() {
  var user = getUserEmail_().toLowerCase();
  var admin = isAdmin_(user);
  var listing = apiListArticulateProjects();
  var rows = listing.rows.filter(function (r) {
    if (admin) return true;
    return String(r.createdBy || "").toLowerCase() === user;
  });
  return { rows: rows, isAdmin: admin, user: user };
}

/* ==========================================================================
   VALIDIERUNG ? in ArticulateApi.gs einfuegen (ersetzt die alte
   apiCreateArticulateProjectFromUi)
   ========================================================================== */

/**
 * Prueft alle Eingaben BEVOR gespeichert wird, damit Fehler sofort im
 * Formular auftauchen statt erst beim Play-Klick.
 *
 * Geprueft wird:
 *   1. Phrase-Projekt existiert?
 *   2. Job existiert in DIESEM Projekt? (nicht nur irgendwo)
 *   3. Drive-Ordner existiert, lesbar, und enthaelt runtime-data.js?
 *   3b. Passt der Job inhaltlich zu DIESEM Kurs? (SCORM-Match-Check)
 *   4. Gibt es bereits einen Eintrag mit gleichem Firebase-Pfad?
 *      (der wuerde sonst still ueberschrieben)
 *
 * Gibt {ok:true, info:{...}} oder wirft einen Fehler mit klarer Meldung.
 */
function validateArticulateInputs_(projectUid, jobUid, driveFolderId, firebasePath, ignoreId) {
  var info = {};

  // ?? 1) Projekt ??????????????????????????????????????????????????????????
  var project;
  try {
    project = phraseFetchJson_(
      phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)),
      { method: "get", headers: { Authorization: getPhraseAuthHeader_() } }
    );
  } catch (e) {
    throw new Error(
      "Phrase-Projekt '" + projectUid + "' konnte nicht geladen werden. " +
      "Stimmt die Projekt-URL/UID? (" + e.message + ")"
    );
  }
  if (!project || !project.uid) {
    throw new Error("Phrase-Projekt '" + projectUid + "' existiert nicht.");
  }
  info.projectName = project.name || "";
  info.sourceLang = project.sourceLang || "";

  // ?? 2) Job ? muss zu genau diesem Projekt gehoeren ??????????????????????
  var job;
  try {
    job = phraseFetchJson_(
      phraseApiUrlV1_(
        "/projects/" + encodeURIComponent(projectUid) +
        "/jobs/" + encodeURIComponent(jobUid)
      ),
      { method: "get", headers: { Authorization: getPhraseAuthHeader_() } }
    );
  } catch (e) {
    throw new Error(
      "Job '" + jobUid + "' wurde im Projekt '" + (project.name || projectUid) +
      "' nicht gefunden. Gehoert der Job wirklich zu diesem Projekt? " +
      "(" + e.message + ")"
    );
  }
  if (!job || !job.uid) {
    throw new Error("Job '" + jobUid + "' existiert nicht in diesem Projekt.");
  }
  info.jobFileName = job.filename || "";
  info.jobTargetLang = job.targetLang || "";
  info.jobStatus = job.status || "";
  // Warnung (kein harter Fehler): XLIFF erwartet
  info.looksLikeXliff = /\.(xlf|xliff)$/i.test(info.jobFileName);

  // ?? 3) Drive-Ordner ?????????????????????????????????????????????????????
  var folder;
  try {
    folder = DriveApp.getFolderById(driveFolderId);
    folder.getName(); // erzwingt echten Zugriff
  } catch (e) {
    throw new Error(
      "Drive-Ordner konnte nicht geoeffnet werden. Ist die ID/URL korrekt " +
      "und hast du Zugriff darauf? (" + e.message + ")"
    );
  }
  info.folderName = folder.getName();

  // Enthaelt der Ordner ueberhaupt einen SCORM-Export?
  var runtimeDataBlob = null;
  try {
    var entries = collectFileEntriesRecursive_(folder, "");
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].path.indexOf("runtime-data.js") !== -1) {
        runtimeDataBlob = entries[i].blob;
        break;
      }
    }
    info.fileCount = entries.length;
  } catch (e) {
    throw new Error("Drive-Ordner konnte nicht gelesen werden: " + e.message);
  }
  if (!runtimeDataBlob) {
    throw new Error(
      "Im Ordner '" + info.folderName + "' wurde keine 'runtime-data.js' " +
      "gefunden. Wurde der SCORM-Export wirklich ENTPACKT hochgeladen " +
      "(nicht als ZIP-Datei)? Der Ordner muss einen Unterordner " +
      "'scormcontent' enthalten."
    );
  }

  // ?? 3b) TEST: Passt der Job inhaltlich zu DIESEM Kurs? ??????????????????
  // Baut denselben Index wie beim echten Patchen auf (buildIndex_ aus
  // RisePatcher.gs) und prueft, wie viele Textstellen der XLIFF im Kurs
  // ueberhaupt vorkommen. Faengt genau den Fehler ab, dass im Batch
  // versehentlich Job A mit dem SCORM-Ordner von Kurs B verknuepft wird.
  info.scormMatchRatio = null;
  info.scormMatchedSegments = null;
  info.scormTotalSegments = null;
  info.scormMatchWarning = "";
  try {
    var runtimeJsText = runtimeDataBlob.getDataAsString("UTF-8");
    var scormData = decodeRuntimeData_(runtimeJsText);
    var scormIndex = buildIndex_(scormData);

    var xliffBlobForCheck = phraseDownloadTargetFile_(projectUid, jobUid);
    var xliffTextForCheck = xliffBlobForCheck.getDataAsString("UTF-8");

    // useSourceIfNoTarget:true, damit auch noch nicht uebersetzte Jobs
    // geprueft werden koennen ? es geht hier nur um die STRUKTUR (welche
    // Trans-Unit-IDs existieren), nicht um den Uebersetzungsinhalt.
    var checkPatches = parseTranslatedXliffToPatches_(xliffTextForCheck, {
      useSourceIfNoTarget: true
    });

    var matched = 0;
    checkPatches.forEach(function (p) {
      var scopeIdx = scormIndex[p.scopeId];
      if (scopeIdx && scopeIdx[p.path]) matched++;
    });

    var total = checkPatches.length;
    info.scormMatchedSegments = matched;
    info.scormTotalSegments = total;
    info.scormMatchRatio = total ? Math.round((matched / total) * 100) : null;

    if (total > 0 && matched / total < 0.3) {
      info.scormMatchWarning =
        "Nur " + matched + " von " + total + " Textstellen (" + info.scormMatchRatio +
        "%) aus dem Job passen zum Kurs in diesem Drive-Ordner. Der Job geh?rt " +
        "vermutlich zu einem ANDEREN Rise-Kurs ? bitte Job/Ordner-Zuordnung pr?fen, " +
        "bevor du fortf?hrst.";
    }
  } catch (e) {
    console.warn("SCORM-Kompatibilitaets-Check uebersprungen: " + e.message);
  }

  // ?? 4) Doppelter Firebase-Pfad? ?????????????????????????????????????????
  var existing = apiListArticulateProjects().rows;
  for (var j = 0; j < existing.length; j++) {
    if (existing[j].id === ignoreId) continue;
    if (existing[j].firebasePath === firebasePath) {
      throw new Error(
        "Es gibt bereits einen Kurs mit demselben Preview-Pfad ('" +
        firebasePath + "'): \"" + existing[j].courseName + " (" +
        existing[j].targetLang + ")\". Bitte Kursname oder Zielsprache " +
        "aendern ? sonst wuerden sich die beiden Previews gegenseitig " +
        "ueberschreiben."
      );
    }
  }

  return { ok: true, info: info };
}

/**
 * ERSETZT die bisherige Fassung: validiert jetzt vor dem Speichern.
 */
function apiCreateArticulateProjectFromUi(payload) {
  payload = payload || {};

  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) {
    throw new Error("Not authorized for Articulate projects.");
  }

  var projectUid = extractPhraseProjectUid_(payload.projectUidOrUrl);
  var jobUid = extractPhraseJobUid_(payload.jobUidOrUrl);
  var driveFolderId = extractDriveFolderId_(payload.driveFolderUrl || payload.driveFolderId);

  if (!projectUid) {
    throw new Error(
      "Phrase Project UID konnte nicht aus der Eingabe gelesen werden. " +
      "Bitte die Projekt-URL (cloud.memsource.com/web/project2/show/...) " +
      "oder die reine UID eintragen."
    );
  }
  if (!jobUid) {
    throw new Error(
      "Phrase Job UID konnte nicht aus der Eingabe gelesen werden. " +
      "Bitte die Job-URL (cloud.memsource.com/web/job/.../translate) " +
      "oder die reine UID eintragen."
    );
  }
  if (!driveFolderId) {
    throw new Error(
      "Drive-Ordner-ID konnte nicht gelesen werden. Bitte den Ordner-Link " +
      "(drive.google.com/drive/folders/...) einfuegen."
    );
  }

  var courseName = String(payload.courseName || "").trim();
  var targetLang = String(payload.targetLang || "").trim();
  if (!courseName) throw new Error("Kursname fehlt.");
  if (!targetLang) throw new Error("Zielsprache fehlt.");

  var firebaseSite = String(payload.firebaseSite || "").trim() || "kaercher-course-preview";
  var firebasePath =
    String(payload.firebasePath || "").trim() ||
    slugifyForPath_(courseName) + "/" + slugifyForPath_(targetLang);

  // >>> Validierung gegen Phrase + Drive <
  var validation = validateArticulateInputs_(
    projectUid, jobUid, driveFolderId, firebasePath, null
  );

  var created = apiCreateArticulateProject({
    courseName: courseName,
    targetLang: targetLang,
    projectUid: projectUid,
    jobUid: jobUid,
    driveFolderId: driveFolderId,
    firebaseSite: firebaseSite,
    firebasePath: firebasePath
  });

  // Info zurueckgeben, damit die UI bestaetigen kann, was gefunden wurde
  created.validation = validation.info;
  try {
    var newProject = getArticulateProjectById_(created.id);
    sendArticulateSubmittedMessage_(newProject, validation.info);
  } catch (e) {
    console.warn("Campus-Chat fehlgeschlagen: " + e.message);
  }
  return created;
}

/**
 * Legt mehrere Articulate-Kurse (Registry-Eintr?ge) auf einmal an ?
 * ein Aufruf pro Job im Projekt. Ruft intern die bestehende Einzel-
 * Anlegefunktion (inkl. Validierung + Chat-Nachricht) auf, damit keine
 * Logik doppelt gepflegt werden muss.
 */
function apiBatchCreateArticulateProjectsFromUi(payloads) {
  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) {
    throw new Error("Not authorized for Articulate projects.");
  }
  var results = [];
  (payloads || []).forEach(function (p) {
    try {
      var res = apiCreateArticulateProjectFromUi(p);
      results.push({ success: true, id: res.id, courseName: p.courseName });
    } catch (e) {
      results.push({ success: false, error: e.message, courseName: p.courseName });
    }
  });
  return { results: results };
}

/**
 * Reine Vorab-Pruefung ohne Speichern ? fuer einen "Pruefen"-Button.
 */
function apiValidateArticulateInputs(payload) {
  payload = payload || {};

  var projectUid = extractPhraseProjectUid_(payload.projectUidOrUrl);
  var jobUid = extractPhraseJobUid_(payload.jobUidOrUrl);
  var driveFolderId = extractDriveFolderId_(payload.driveFolderUrl || payload.driveFolderId);

  if (!projectUid) throw new Error("Phrase-Projekt-URL/UID unlesbar.");
  if (!jobUid) throw new Error("Phrase-Job-URL/UID unlesbar.");
  if (!driveFolderId) throw new Error("Drive-Ordner-URL/ID unlesbar.");

  var courseName = String(payload.courseName || "").trim() || "kurs";
  var targetLang = String(payload.targetLang || "").trim() || "xx";
  var firebasePath = slugifyForPath_(courseName) + "/" + slugifyForPath_(targetLang);

  var validation = validateArticulateInputs_(
    projectUid, jobUid, driveFolderId, firebasePath, null
  );

  validation.info.firebasePath = firebasePath;
  return validation.info;
}

function apiDeleteArticulateProjectFromUi(id) {
  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) {
    throw new Error("Not authorized.");
  }
  return apiDeleteArticulateProject(id);
}

/* ==========================================================================
   PREVIEW ERZEUGEN (Play-Button)
   ========================================================================== */

/**
 * Vom Play-Button aufgerufen. Laeuft laenger (Download aus Phrase +
 * Patchen + Upload zu Firebase); die UI pollt parallel
 * apiGetPreviewProgress(sessionId) fuer den Ladebalken.
 */
function apiRunArticulatePreview(articulateProjectId, sessionId) {
  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) {
    throw new Error("Not authorized.");
  }
  return apiGenerateArticulatePreviewById(articulateProjectId, sessionId);
}

/* ==========================================================================
   URL-PARSER
   ========================================================================== */

/**
 * Akzeptiert:
 *   https://cloud.memsource.com/web/project2/show/FFDYdblS1Thbu2eghjyMh0
 *   https://cloud.memsource.com/web/project/show/FFDYdblS1Thbu2eghjyMh0
 *   FFDYdblS1Thbu2eghjyMh0
 */
function extractPhraseProjectUid_(input) {
  var s = String(input || "").trim();
  if (!s) return "";
  var m = s.match(/\/project2?\/show\/([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  // Blanke UID (keine URL-Struktur erkannt)
  if (s.indexOf("/") === -1 && /^[A-Za-z0-9_-]{10,}$/.test(s)) return s;
  return "";
}

/**
 * Akzeptiert:
 *   https://cloud.memsource.com/web/job/fUbKbz7MHUV02yIWOrRH40/translate
 *   fUbKbz7MHUV02yIWOrRH40
 */
function extractPhraseJobUid_(input) {
  var s = String(input || "").trim();
  if (!s) return "";
  var m = s.match(/\/job\/([A-Za-z0-9_-]+)/);
  if (m) return m[1];
  if (s.indexOf("/") === -1 && /^[A-Za-z0-9_-]{10,}$/.test(s)) return s;
  return "";
}

/* ==========================================================================
   KURS PREVIEW GENERATOR ? Projekt-/Job-Picker aus Phrase (dynamische Dropdowns)
   ========================================================================== */

// Feste Filter-IDs (nicht UIDs!) ? aus deinem Execution-Log
var ART_PICKER_DOMAIN_ID_        = 24144;   // General Content
var ART_PICKER_CLIENT_ID_        = 620249;  // AKW
var ART_PICKER_BUSINESS_UNIT_ID_ = 56159;   // FTC-D

/**
 * Liefert alle Phrase-Projekte, die zu Domain "General Content",
 * Client "AKW" und Business Unit "FTC-D" geh?ren.
 * @return {Array<{uid:string,name:string,targetLangs:string[]}>}
 */
function apiArtPickerListProjects() {
  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) throw new Error("Not authorized.");

  var projects = [];
  var page = 0;
  while (true) {
    var url = phraseApiUrlV1_("/projects") +
      "?domainId=" + ART_PICKER_DOMAIN_ID_ +
      "&clientId=" + ART_PICKER_CLIENT_ID_ +
      "&businessUnitId=" + ART_PICKER_BUSINESS_UNIT_ID_ +
      "&pageNumber=" + page +
      "&pageSize=50&sort=DATE_CREATED&order=DESC&includeArchived=false";
    var result = phraseFetchJson_(url, {
      method: "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });
    var content = (result && result.content) || [];
    content.forEach(function (p) {
      projects.push({ uid: p.uid, name: p.name, targetLangs: p.targetLangs || [] });
    });
    if (content.length < 50) break;   // weniger als pageSize -> letzte Seite
    page++;
    if (page >= 40) break;            // Sicherheitslimit
  }
  return projects;
}

/**
 * Liefert alle Jobs eines Phrase-Projekts.
 * @param {string} projectUid
 * @return {Array<{uid:string,filename:string,targetLang:string,status:string}>}
 */
function apiArtPickerListJobs(projectUid) {
  var email = getUserEmail_();
  if (!isArticulateUser_(email) && !isAdmin_(email)) throw new Error("Not authorized.");

  var pUid = String(projectUid || "").trim();
  if (!pUid) throw new Error("projectUid fehlt.");

  var jobs = [];
  var page = 0;
  while (true) {
    var url = phraseApiUrlV2_("/projects/" + encodeURIComponent(pUid) + "/jobs") +
      "?pageNumber=" + page + "&pageSize=50";
    var result = phraseFetchJson_(url, {
      method: "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });
    var content = (result && result.content) || [];
    content.forEach(function (j) {
      jobs.push({
        uid: j.uid,
        filename: j.filename || "",
        targetLang: j.targetLang || "",
        status: j.status || ""
      });
    });
    if (content.length < 50) break;   // weniger als pageSize -> letzte Seite
    page++;
    if (page >= 40) break;            // Sicherheitslimit
  }
  return jobs;
}