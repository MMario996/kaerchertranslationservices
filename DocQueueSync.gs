/**
 * DocQueueSync.gs
 * Gleicht das verlinkte Dokumentations-Queue-Sheet (DOC_QUEUE_SHEET_ID_) mit
 * Phrase ab - wie der Status-Sync der normalen Queue (AutoSync.gs), aber mit
 * eigenem Trigger (alle 15 Minuten) und eigenem Schalter im Admin-Bereich.
 *
 * Pro Projekt:
 *   - "Phrase Project Status" <- Status des Phrase-Projekts
 *   - "Status" jeder Sprach-Zeile <- Status des Jobs im letzten Workflow-Schritt
 *     (gleiche Sprache + Datei), damit die Sprach-Kaestchen in "Meine Projekte"
 *     den echten Fortschritt zeigen.
 * Projekte, die in Phrase und in allen Zeilen schon abgeschlossen sind, werden
 * uebersprungen. Chat-Benachrichtigungen verschickt weiterhin AutoSync.gs
 * ueber die zusammengefasste Zeile in der normalen Queue.
 */
var DOC_SYNC_HANDLER_         = "autoSyncDocQueueStatuses_";
var DOC_SYNC_MAX_RUNTIME_MS_  = 4.5 * 60 * 1000;
var DOC_SYNC_DONE_JOB_STATUS_ = ["COMPLETED", "DELIVERED", "NOTIFIED", "CANCELLED", "CANCELED", "REJECTED"];

/** Manueller Sync ueber den Button "Sync Status" in Dokumentation -> Meine Projekte. */
function apiSyncDocQueueStatuses() {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, message: "Not authorized." };
  return docQueueSyncStatuses_();
}

function apiToggleDocAutoSync(enable) {
  if (!isAdmin_(getUserEmail_())) throw new Error("Not authorized. Admin only.");
  return enable ? setupDocAutoSyncTrigger_() : removeDocAutoSyncTrigger_();
}

function apiGetDocAutoSyncStatus() {
  var props = PropertiesService.getScriptProperties();
  var exists = ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === DOC_SYNC_HANDLER_; });
  return {
    enabled: props.getProperty("DOC_AUTO_SYNC_ENABLED") === "true" && exists,
    lastRun: props.getProperty("DOC_AUTO_SYNC_LAST_RUN") || "",
    lastUpdated: Number(props.getProperty("DOC_AUTO_SYNC_LAST_UPDATED") || 0)
  };
}

function setupDocAutoSyncTrigger_() {
  removeDocAutoSyncTrigger_();
  ScriptApp.newTrigger(DOC_SYNC_HANDLER_).timeBased().everyMinutes(15).create();
  PropertiesService.getScriptProperties().setProperty("DOC_AUTO_SYNC_ENABLED", "true");
  console.log("• Doc-Queue-Sync trigger created (every 15 minutes).");
  return { success: true, msg: "Documentation sheet sync enabled (every 15 minutes)." };
}

function removeDocAutoSyncTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === DOC_SYNC_HANDLER_) ScriptApp.deleteTrigger(t);
  });
  PropertiesService.getScriptProperties().setProperty("DOC_AUTO_SYNC_ENABLED", "false");
  console.log("• Doc-Queue-Sync trigger removed.");
  return { success: true, msg: "Documentation sheet sync disabled." };
}

/** Trigger-Handler (alle 15 Minuten). */
function autoSyncDocQueueStatuses_() {
  var res = docQueueSyncStatuses_();
  if (!res.success) console.error("✗ Doc-Queue-Sync: " + res.message);
}

/**
 * Liest das Queue-Sheet, fragt Phrase pro offenem Projekt ab und schreibt nur
 * geaenderte Zellen zurueck. Script-Lock, damit Trigger, Button und Archivieren
 * (verschiebt Zeilen) sich nicht in die Quere kommen.
 */
function docQueueSyncStatuses_() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return { success: false, message: "Sync is already running - please try again shortly." };
  var started = Date.now();
  try {
    var sh = SpreadsheetApp.openById(DOC_QUEUE_SHEET_ID_).getSheetByName(DOC_QUEUE_SHEET_NAME_);
    if (!sh) return { success: false, message: "Queue sheet not found." };
    var lastRow = sh.getLastRow(), lastCol = sh.getLastColumn();
    if (lastRow < 2) return { success: true, updated: 0, checked: 0 };

    var data = sh.getRange(1, 1, lastRow, lastCol).getValues();
    var col = docSyncColumns_(data[0]);
    if (col.uid === -1 || col.projectStatus === -1 || col.status === -1) {
      return { success: false, message: "Queue sheet is missing 'Project UID', 'Status' or 'Phrase Project Status'." };
    }

    var groups = docSyncOpenProjects_(data, col);
    var phraseByUid = {};
    var errors = 0, partial = false;
    for (var k = 0; k < groups.length; k++) {
      if (Date.now() - started > DOC_SYNC_MAX_RUNTIME_MS_) { partial = true; break; }
      try {
        phraseByUid[groups[k]] = docSyncFetchPhrase_(groups[k]);
      } catch (e) {
        errors++;
        console.warn("  ⚠ Doc-Queue-Sync: " + groups[k] + ": " + e.message);
      }
    }

    var changes = docSyncPlanUpdates_(data, col, phraseByUid);
    changes.forEach(function(c) { sh.getRange(c.row, c.col).setValue(c.value); });
    if (changes.length) SpreadsheetApp.flush();

    var touched = {};
    changes.forEach(function(c) { touched[c.projectUid] = true; });
    var updated = Object.keys(touched).length;

    var props = PropertiesService.getScriptProperties();
    props.setProperty("DOC_AUTO_SYNC_LAST_RUN", new Date().toISOString());
    props.setProperty("DOC_AUTO_SYNC_LAST_UPDATED", String(updated));
    console.log("• Doc-Queue-Sync: " + groups.length + " checked, " + updated + " updated, " + changes.length + " cells, " + errors + " errors" + (partial ? " (time limit)" : ""));
    return { success: true, updated: updated, checked: groups.length, cells: changes.length, errors: errors, partial: partial };
  } catch (e) {
    return { success: false, message: e.message || String(e) };
  } finally {
    lock.releaseLock();
  }
}

/** Spaltenpositionen (0-basiert, -1 = fehlt) aus der Kopfzeile. */
function docSyncColumns_(header) {
  var h = header.map(function(x) { return String(x || "").trim(); });
  return {
    uid: h.indexOf("Project UID"),
    status: h.indexOf("Status"),
    projectStatus: h.indexOf("Phrase Project Status"),
    lang: h.indexOf("Target Lang"),
    file: h.indexOf("File Name")
  };
}

/**
 * Project UIDs, die noch abgeglichen werden muessen: Phrase-Projekt noch
 * nicht COMPLETED/CANCELLED oder mindestens eine Sprache noch nicht fertig.
 */
function docSyncOpenProjects_(data, col) {
  var state = {}, order = [];
  for (var r = 1; r < data.length; r++) {
    var uid = String(data[r][col.uid] || "").trim();
    if (!uid) continue;
    if (!state[uid]) { state[uid] = { projectDone: false, jobsOpen: false }; order.push(uid); }
    var ps = String(data[r][col.projectStatus] || "").trim().toUpperCase();
    if (ps.indexOf("COMPLETED") === 0 || ps === "CANCELLED") state[uid].projectDone = true;
    var js = String(data[r][col.status] || "").trim().toUpperCase();
    if (DOC_SYNC_DONE_JOB_STATUS_.indexOf(js) === -1) state[uid].jobsOpen = true;
  }
  return order.filter(function(uid) { return !state[uid].projectDone || state[uid].jobsOpen; });
}

/** Projektstatus + Jobs des letzten Workflow-Schritts aus Phrase. */
function docSyncFetchPhrase_(projectUid) {
  var auth = { Authorization: getPhraseAuthHeader_() };
  var proj = phraseFetchJson_(phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)), { method: "get", headers: auth });
  var maxLevel = 1;
  ((proj && proj.workflowSteps) || []).forEach(function(s) {
    var l = Number(s.workflowLevel);
    if (!isNaN(l) && l > maxLevel) maxLevel = l;
  });
  var jobs = [];
  for (var page = 0; page < 40; page++) {
    var res = phraseFetchJson_(phraseApiUrlV2_("/projects/" + encodeURIComponent(projectUid) + "/jobs?workflowLevel=" + maxLevel + "&pageSize=50&pageNumber=" + page), { method: "get", headers: auth });
    var content = (res && res.content) || [];
    content.forEach(function(j) { jobs.push({ targetLang: j.targetLang || "", filename: j.filename || "", status: j.status || "" }); });
    if (content.length < 50) break;
  }
  return { status: proj && proj.status ? String(proj.status).toUpperCase() : "", jobs: jobs };
}

/**
 * Rein (ohne Apps-Script-Dienste, siehe tests/): welche Zellen sich aendern.
 * Job-Zuordnung ueber Sprache + Dateiname, sonst nur Sprache (eindeutig).
 * "NOTIFIED" ist ein eigener Endstatus der Queue und wird nicht ueberschrieben.
 * @return {Array<{row:number, col:number, value:string, projectUid:string}>} 1-basiert
 */
function docSyncPlanUpdates_(data, col, phraseByUid) {
  var norm = function(v) { return String(v || "").trim().toLowerCase().replace(/-/g, "_"); };
  var changes = [];
  for (var r = 1; r < data.length; r++) {
    var uid = String(data[r][col.uid] || "").trim();
    var ph = uid && phraseByUid[uid];
    if (!ph) continue;

    var curPs = String(data[r][col.projectStatus] || "").trim().toUpperCase();
    if (ph.status && ph.status !== curPs) changes.push({ row: r + 1, col: col.projectStatus + 1, value: ph.status, projectUid: uid });

    var lang = col.lang === -1 ? "" : norm(data[r][col.lang]);
    if (!lang) continue;
    var file = col.file === -1 ? "" : String(data[r][col.file] || "").trim();
    var sameLang = ph.jobs.filter(function(j) { return norm(j.targetLang) === lang; });
    var match = sameLang.filter(function(j) { return file && j.filename === file; })[0] || (sameLang.length === 1 ? sameLang[0] : null);
    if (!match || !match.status) continue;

    var newJs = String(match.status).toUpperCase();
    var curJs = String(data[r][col.status] || "").trim().toUpperCase();
    if (newJs !== curJs && curJs !== "NOTIFIED") changes.push({ row: r + 1, col: col.status + 1, value: newJs, projectUid: uid });
  }
  return changes;
}
