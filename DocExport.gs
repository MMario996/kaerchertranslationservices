/**
 * DocExport.gs
 * Liest den Live-Status eines Phrase-Projekts (per exaktem Namens-Match) und
 * schreibt fertige (COMPLETED) ?bersetzungen direkt in den passenden
 * Drive-Projektordner zur?ck ? Dateiname 1:1 identisch zum Import (per
 * externem Queue-Sheet nachgeschlagen, nicht aus Phrase).
 */
function apiGetDocExportStatus(projectName) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  var name = String(projectName || "").trim();
  if (!name) return { success: false, error: "Kein Projektname ?bergeben." };

  try {
    var url = phraseApiUrlV1_("/projects?name=" + encodeURIComponent(name) + "&pageSize=50");
    var result = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var list = Array.isArray(result) ? result : (result && result.content ? result.content : []);
    var exact = list.filter(function(p) { return String(p.name || "").trim() === name; });
    var candidates = exact.length ? exact : list;

    if (!candidates.length) return { success: true, found: false };

    candidates.sort(function(a, b) {
      var da = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
      var db = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
      return db - da;
    });
    var p = candidates[0];

    var levelInfo = phraseGetJobsForMaxLevel_(p.uid, []);
    var jobs = (levelInfo.jobsForDownload || []).map(function(j) {
      return {
        jobUid: j.uid,
        targetLang: j.targetLang,
        fileName: j.fileName,
        status: j.status
      };
    });

    return {
      success: true,
      found: true,
      ambiguous: candidates.length > 1,
      matchCount: candidates.length,
      projectUid: p.uid,
      phraseUrl: "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(p.uid),
      jobs: jobs
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Sucht im externen Queue-Sheet die Original-Dateinamen f?r ein Projekt,
 * gemappt nach Zielsprache. Quelle der Wahrheit f?r den Export-Dateinamen
 * (NICHT der Phrase-Jobname, der kann technisch abweichen).
 */
function docExportGetQueueFileNames_(projectUid) {
  var ss = SpreadsheetApp.openById(DOC_IMPORT_SHEET_ID_);
  var sh = ss.getSheetByName(DOC_IMPORT_SHEET_NAME_);
  if (!sh) return {};
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h || "").trim().toLowerCase().replace(/[^a-z0-9]/g, ""); });
  var uidCol = headers.indexOf("projectuid");
  var langCol = headers.indexOf("targetlang");
  var nameCol = headers.indexOf("filename");
  if (uidCol === -1 || langCol === -1 || nameCol === -1) return {};
  var map = {};
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][uidCol]).trim() === projectUid) {
      var lang = String(data[i][langCol]).trim();
      map[lang.toLowerCase().replace(/_/g, "-")] = String(data[i][nameCol]).trim();
    }
  }
  return map;
}

function docExportFindOrCreateLangFolder_(projectFolder, targetLang) {
  var normalized = String(targetLang || "").toLowerCase().replace(/_/g, "-");
  var it = projectFolder.getFolders();
  while (it.hasNext()) {
    var f = it.next();
    if (f.getName().toLowerCase() === normalized) return f;
  }
  var parts = normalized.split("-");
  var prettyName = parts.length === 2 ? (parts[0] + "-" + parts[1].toUpperCase()) : normalized;
  return projectFolder.createFolder(prettyName);
}

function docExportWriteFile_(langFolder, fileName, blob) {
  var existing = langFolder.getFilesByName(fileName);
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }
  blob.setName(fileName);
  langFolder.createFile(blob);
}

function apiExportDocProjectToDrive(projectUid, projectName, jobs) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  if (!projectUid) return { success: false, error: "Keine Projekt-UID ?bergeben." };
  if (!Array.isArray(jobs) || !jobs.length) return { success: false, error: "Keine Jobs ?bergeben." };

  try {
    var projectFolder = docDriveFindProjectFolder_(projectName);
    if (!projectFolder) {
      return { success: false, error: "Kein Drive-Ordner mit dem Namen '" + projectName + "' unter dem konfigurierten Root gefunden." };
    }
    var fileNameMap = docExportGetQueueFileNames_(projectUid);

    var written = 0;
    var errors = [];

    jobs.forEach(function(job) {
      try {
        var normLang = String(job.targetLang || "").toLowerCase().replace(/_/g, "-");
        var fileName = fileNameMap[normLang] || job.fileName || (job.targetLang + ".xml");

        var dl = apiDownloadTargetFile(projectUid, job.jobUid);
        if (!dl || !dl.ok) throw new Error((dl && dl.error) || "Download fehlgeschlagen");

        var bytes = Utilities.base64Decode(dl.base64);
        var blob = Utilities.newBlob(bytes, dl.mimeType || "application/xml", fileName);

        var langFolder = docExportFindOrCreateLangFolder_(projectFolder, job.targetLang);
        docExportWriteFile_(langFolder, fileName, blob);

        written++;
      } catch (e) {
        errors.push(job.targetLang + ": " + e.message);
      }
    });

    return {
      success: true,
      writtenCount: written,
      totalCount: jobs.length,
      errors: errors,
      folderUrl: projectFolder.getUrl()
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Exportiert exakt EINEN Job nach Drive (f?r sauberes Live-Logging im Frontend).
 * F?ngt Phrase 404 und BATCH-Fehler ab und ?bersetzt sie in verst?ndlichen Text.
 */
function apiExportSingleJobToDrive(projectUid, projectName, job) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  
  if (String(projectUid).startsWith("BATCH-")) {
    return { success: false, error: "Projekt in Phrase nicht gefunden (Ung?ltige BATCH-UID). Bitte warte, bis der Import abgeschlossen ist." };
  }

  try {
    var projectFolder = docDriveFindProjectFolder_(projectName);
    if (!projectFolder) {
      return { success: false, error: "Kein Drive-Ordner mit dem Namen '" + projectName + "' gefunden." };
    }
    
    var fileNameMap = docExportGetQueueFileNames_(projectUid);
    var normLang = String(job.targetLang || "").toLowerCase().replace(/_/g, "-");
    var fileName = fileNameMap[normLang] || job.fileName || (job.targetLang + ".xml");

    var dl = apiDownloadTargetFile(projectUid, job.jobUid);
    if (!dl || !dl.ok) throw new Error((dl && dl.error) || "Download fehlgeschlagen");

    var bytes = Utilities.base64Decode(dl.base64);
    var blob = Utilities.newBlob(bytes, dl.mimeType || "application/xml", fileName);

    var langFolder = docExportFindOrCreateLangFolder_(projectFolder, job.targetLang);
    docExportWriteFile_(langFolder, fileName, blob);

    return { success: true, fileName: fileName, folderUrl: projectFolder.getUrl() };
    
  } catch (e) {
    var msg = e.message;
    if (msg.includes("404") && msg.includes("not imported correctly")) {
      msg = "Job ist in Phrase noch nicht vollst?ndig importiert/bereit. Bitte sp?ter nochmal versuchen.";
    } else if (msg.includes("404")) {
      msg = "Job in Phrase nicht gefunden (404).";
    }
    return { success: false, error: msg };
  }
}

// ??? EXPORT ELIGIBILITY (Client/Domain/Subdomain/Business Unit) ?????????????
var DOC_EXPORT_ELIG_PROP_CLIENT_    = 'DOC_EXPORT_ELIG_CLIENT_ID';
var DOC_EXPORT_ELIG_PROP_DOMAIN_    = 'DOC_EXPORT_ELIG_DOMAIN_ID';
var DOC_EXPORT_ELIG_PROP_SUBDOMAIN_ = 'DOC_EXPORT_ELIG_SUBDOMAIN_ID';
var DOC_EXPORT_ELIG_PROP_BU_        = 'DOC_EXPORT_ELIG_BU_ID';

function docExportGetEligibilitySettings_() {
  var props = PropertiesService.getScriptProperties();
  return {
    clientId:       props.getProperty(DOC_EXPORT_ELIG_PROP_CLIENT_)       || "",
    domainId:       props.getProperty(DOC_EXPORT_ELIG_PROP_DOMAIN_)       || "",
    subDomainId:    props.getProperty(DOC_EXPORT_ELIG_PROP_SUBDOMAIN_)  || "",
    businessUnitId: props.getProperty(DOC_EXPORT_ELIG_PROP_BU_)         || ""
  };
}

function apiGetDocExportEligibilitySettings() {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  var s = docExportGetEligibilitySettings_();
  return { success: true, clientId: s.clientId, domainId: s.domainId, subDomainId: s.subDomainId, businessUnitId: s.businessUnitId };
}

function apiSaveDocExportEligibilitySettings(clientId, domainId, subDomainId, businessUnitId) {
  var access = apiCheckAccess();
  if (!access.allowed || !access.isAdmin) return { success: false, error: "Not authorized." };
  try {
    var props = PropertiesService.getScriptProperties();
    props.setProperty(DOC_EXPORT_ELIG_PROP_CLIENT_, String(clientId || '').trim());
    props.setProperty(DOC_EXPORT_ELIG_PROP_DOMAIN_, String(domainId || '').trim());
    props.setProperty(DOC_EXPORT_ELIG_PROP_SUBDOMAIN_, String(subDomainId || '').trim());
    props.setProperty(DOC_EXPORT_ELIG_PROP_BU_, String(businessUnitId || '').trim());
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Liefert alle Phrase-Projekte, die zu den konfigurierten Eligibility-IDs passen
 * inkl. Job-Liste mit Status pro Projekt.
 */
function apiGetDocExportEligibleProjects() {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var s = docExportGetEligibilitySettings_();
    if (!s.clientId || !s.domainId || !s.subDomainId || !s.businessUnitId) {
      return { success: false, error: "Documentation Export Eligibility Settings sind nicht vollst?ndig konfiguriert (Admin-Bereich)." };
    }

    var authHeader = { Authorization: getPhraseAuthHeader_() };

    // 1. Aufl?sung der UIDs in Klarnamen ?ber die jeweiligen Einzel-Endpunkte
    var clientName = phraseFetchJson_(phraseApiUrlV1_("/clients/" + encodeURIComponent(s.clientId)), { method: "get", headers: authHeader }).name;
    var domainName = phraseFetchJson_(phraseApiUrlV1_("/domains/" + encodeURIComponent(s.domainId)), { method: "get", headers: authHeader }).name;
    var subDomainName = phraseFetchJson_(phraseApiUrlV1_("/subDomains/" + encodeURIComponent(s.subDomainId)), { method: "get", headers: authHeader }).name;
    var buName = phraseFetchJson_(phraseApiUrlV1_("/businessUnits/" + encodeURIComponent(s.businessUnitId)), { method: "get", headers: authHeader }).name;

    // 2. Query mit den Klarnamen bauen
    var qs = [
      "pageSize=50",
      "clientName=" + encodeURIComponent(clientName),
      "domainName=" + encodeURIComponent(domainName),
      "subDomainName=" + encodeURIComponent(subDomainName),
      "businessUnitName=" + encodeURIComponent(buName)
    ].join("&");

    var allProjects = [];
    var page = 0;
    while (page < 20) {
      var url = phraseApiUrlV1_("/projects?" + qs + "&pageNumber=" + page);
      var result = phraseFetchJson_(url, { method: "get", headers: authHeader });
      var list = (result && result.content) ? result.content : [];
      allProjects = allProjects.concat(list);
      var total = (result && result.totalElements) || 0;
      if (!list.length || allProjects.length >= total) break;
      page++;
    }

    allProjects.sort(function(a, b) {
      var da = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
      var db = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
      return db - da;
    });

    var projects = allProjects.map(function(p) {
      var jobs = [];
      try {
        var levelInfo = phraseGetJobsForMaxLevel_(p.uid, []);
        jobs = (levelInfo.jobsForDownload || []).map(function(j) {
          return { jobUid: j.uid, targetLang: j.targetLang, fileName: j.fileName, status: j.status };
        });
      } catch (e) { /* Projekt ohne lesbare Jobs -> leere Liste */ }

      var completedCount = jobs.filter(function(j) { return j.status === "COMPLETED"; }).length;

      return {
        projectUid: p.uid,
        projectName: p.name,
        status: p.status,
        dateCreated: p.dateCreated,
        phraseUrl: "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(p.uid),
        jobs: jobs,
        totalCount: jobs.length,
        completedCount: completedCount,
        allCompleted: jobs.length > 0 && completedCount === jobs.length
      };
    });

    return { success: true, projects: projects };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}