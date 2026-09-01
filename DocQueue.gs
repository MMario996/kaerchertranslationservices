/**
 * DocQueue.gs
 * Gemeinsame Datenquelle f?r Documentation Import-Board und Export-Tab.
 * Liest das Queue-Sheet EINMAL komplett (kein Phrase-API-Call), gruppiert
 * pro Projekt (Project UID) und liefert alle Sheet-Spalten f?r Filterung.
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