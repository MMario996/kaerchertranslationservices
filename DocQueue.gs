/**
 * DocQueue.gs
 * Gemeinsame Datenquelle für Documentation Import-Board und Export-Tab.
 * Liest das Queue-Sheet EINMAL komplett (kein Phrase-API-Call), gruppiert
 * pro Projekt (Project UID) und liefert alle Sheet-Spalten für Filterung.
 * Phrase-Zusatzdaten (Owner, Domain, Client, Custom Fields...) werden erst
 * beim Aufklappen einer Karte per apiGetPhraseProjectMetaByName() nachgeladen.
 */
var DOC_QUEUE_SHEET_ID_   = "1_EFW_ItawRvutiVrcNIamKTSYPFsA5XFGR1s6PctYxs";
var DOC_QUEUE_SHEET_NAME_ = "Queue";

function apiGetDocQueueProjects() {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var ss = SpreadsheetApp.openById(DOC_QUEUE_SHEET_ID_);
    var sh = ss.getSheetByName(DOC_QUEUE_SHEET_NAME_);
    if (!sh) return { success: false, error: "Queue-Sheet nicht gefunden." };
    var lastRow = sh.getLastRow();
    var lastCol = sh.getLastColumn();
    if (lastRow < 2) return { success: true, projects: [] };

    var data = sh.getRange(1, 1, lastRow, lastCol).getValues();
    var headers = data[0].map(function(h) { return String(h || "").trim(); });
    var idx = {};
    headers.forEach(function(h, i) { idx[h] = i; });

    function val(row, name) {
      var i = idx[name];
      return (i === undefined) ? "" : row[i];
    }
    function toIso(v) {
      if (!v) return "";
      try { return new Date(v).toISOString(); } catch (e) { return ""; }
    }

    var projectsMap = {};
    var order = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var projectUid  = String(val(row, "Project UID") || "").trim();
      var projectName = String(val(row, "Project Name") || "").trim();
      if (!projectUid && !projectName) continue;

      var key = projectUid || ("NAME::" + projectName);
      if (!projectsMap[key]) {
        projectsMap[key] = {
          projectUid: projectUid,
          projectName: projectName,
          templateName: String(val(row, "Template Name") || ""),
          dueDate: toIso(val(row, "Due Date")),
          comments: String(val(row, "Comments") || ""),
          orderNumber: String(val(row, "Order Number") || "").trim(),
          iaNumber: String(val(row, "IA Number") || "").trim(),
          userID: String(val(row, "User ID") || "").trim(),
          notificationEmail: String(val(row, "Notification Email") || ""),
          phraseProjectStatus: String(val(row, "Phrase Project Status") || "").trim(),
          timestamp: toIso(val(row, "Timestamp")),
          phraseUrl: projectUid ? "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid) : "",
          jobs: []
        };
        order.push(key);
      }
      var p = projectsMap[key];

      var iaVal = String(val(row, "IA Number") || "").trim();
      if (iaVal && !p.iaNumber) p.iaNumber = iaVal;
      var orderVal = String(val(row, "Order Number") || "").trim();
      if (orderVal && !p.orderNumber) p.orderNumber = orderVal;
      var psVal = String(val(row, "Phrase Project Status") || "").trim();
      if (psVal) p.phraseProjectStatus = psVal;

      var fileName   = String(val(row, "File Name") || "").trim();
      var targetLang = String(val(row, "Target Lang") || "").trim();
      var status     = String(val(row, "Status") || "").trim().toUpperCase();
      var jobUid     = String(val(row, "Job UID") || "").trim();
      if (fileName || targetLang) {
        p.jobs.push({ fileName: fileName, targetLang: targetLang, status: status, jobUid: jobUid });
      }
    }

    var projects = order.map(function(k) { return projectsMap[k]; });
    projects.sort(function(a, b) { return a.projectName.localeCompare(b.projectName); });

    return { success: true, projects: projects, fetchedAt: new Date().toISOString() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}
/**
 * Dokumentationsprojekte im selben Format wie apiGetMyProjects(), damit der
 * Reiter "Dokumentation -> Meine Projekte" 1:1 dieselbe Oberflaeche nutzt
 * (Tabelle, Status-Chips, Kalender, Download-Dialog, Notizen).
 *
 * Projektstatus: COMPLETED/CANCELLED aus "Phrase Project Status" gewinnt;
 * sonst der am wenigsten fortgeschrittene nicht abgebrochene Job (ein
 * Projekt ist erst fertig, wenn alle Sprachen fertig sind).
 */
function apiGetDocProjectsForHistory() {
  var res = apiGetDocQueueProjects();
  if (!res.success) return { error: res.error, projects: [] };

  var order = ["NEW", "UPLOADED", "ASSIGNED", "ACCEPTED", "COMPLETED", "DELIVERED", "NOTIFIED"];
  var tz = Session.getScriptTimeZone();

  var projects = res.projects.map(function(p) {
    var jobs = p.jobs || [];
    var active = jobs.filter(function(j) { return ["CANCELLED", "CANCELED", "REJECTED"].indexOf(j.status) === -1; });
    var status;
    var ps = String(p.phraseProjectStatus || "").toUpperCase();
    if (ps.indexOf("COMPLETED") === 0) status = "COMPLETED";
    else if (ps === "CANCELLED") status = "CANCELLED";
    else if (!active.length) status = jobs.length ? "CANCELLED" : "NEW";
    else {
      var minIdx = order.length - 1;
      active.forEach(function(j) {
        var i = order.indexOf(j.status);
        if (i === -1) i = 1;
        if (i < minIdx) minIdx = i;
      });
      status = order[minIdx];
    }

    var langs = [];
    jobs.forEach(function(j) { if (j.targetLang && langs.indexOf(j.targetLang) === -1) langs.push(j.targetLang); });
    var ts = p.timestamp ? new Date(p.timestamp) : null;
    var owner = String(p.notificationEmail || p.userID || "").toLowerCase().trim();

    return {
      timestamp:    p.timestamp || "",
      uploadDate:   ts && !isNaN(ts.getTime()) ? Utilities.formatDate(ts, tz, "yyyy-MM-dd HH:mm") : "",
      userEmail:    owner,
      owner:        owner,
      isShared:     false,
      sharedWith:   "",
      phraseUrl:    p.phraseUrl,
      projectUid:   p.projectUid,
      jobUid:       "",
      jobUids:      jobs.map(function(j) { return j.jobUid; }).filter(Boolean),
      targetLangs:  langs,
      targetLang:   langs.join(", "),
      projectName:  p.projectName,
      templateName: p.templateName,
      sourceLang:   "From Template",
      status:       status,
      dueDate:      p.dueDate || "",
      jobMapping:   jobs.filter(function(j) { return j.jobUid; }).map(function(j) {
        return { jobUid: j.jobUid, fileName: j.fileName, targetLang: j.targetLang };
      }),
      pivotRole:    "",
      pivotLink:    "",
      downloadedAt: "",
      iaNumber:     p.iaNumber,
      docProject:   true,
      docJobs:      jobs
    };
  });

  projects.sort(function(a, b) { return String(b.timestamp).localeCompare(String(a.timestamp)); });
  return { projects: projects, email: getUserEmail_() };
}

/** Queue-Zeile eines Dokumentationsprojekts (fuer Notiz-Berechtigung), sonst null. */
function docQueueFindProjectOwner_(projectUid) {
  try {
    var sh = SpreadsheetApp.openById(DOC_QUEUE_SHEET_ID_).getSheetByName(DOC_QUEUE_SHEET_NAME_);
    if (!sh) return null;
    var data = sh.getDataRange().getValues();
    var headers = data[0].map(function(h) { return String(h || "").trim(); });
    var iUid = headers.indexOf("Project UID");
    var iMail = headers.indexOf("Notification Email");
    var iUser = headers.indexOf("User ID");
    if (iUid === -1) return null;
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][iUid]).trim() !== projectUid) continue;
      var mail = iMail !== -1 ? String(data[r][iMail] || "") : "";
      var user = iUser !== -1 ? String(data[r][iUser] || "") : "";
      return { owner: (mail || user).toLowerCase().trim() };
    }
  } catch (e) {
    console.warn("docQueueFindProjectOwner_ failed:", e.message);
  }
  return null;
}
