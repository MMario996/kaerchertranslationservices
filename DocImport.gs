/**
 * DocImport.gs
 * Google-Drive-basierter XML-Batch-Import f?r Documentation Projects.
 * Quelldateien liegen in Drive unter dem Admin-konfigurierten Root-Ordner
 * (DocDriveConfig.gs); der Unterordner-Name muss exakt dem Projektnamen
 * entsprechen (DocDriveTree.gs). Erstellt EIN Phrase-Projekt aus dem
 * gew?hlten Template und l?dt pro erkannter Zielsprache eine eigene XML-Datei
 * als separaten Job hoch. Schreibt NUR ins externe MAT-D Queue-Sheet ? NICHT
 * ins interne OPS-Sheet, Projekte erscheinen daher absichtlich nicht unter
 * "My Projects".
 */
var DOC_IMPORT_SHEET_ID_   = "1_EFW_ItawRvutiVrcNIamKTSYPFsA5XFGR1s6PctYxs";
var DOC_IMPORT_SHEET_NAME_ = "Queue";
var DOC_IMPORT_QUEUE_GID_  = 2102542301;

function apiGetDocImportTemplateLangs(templateUid) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  if (!templateUid) return { success: false, error: "templateUid fehlt." };
  try {
    var url = phraseApiUrlV1_("/projectTemplates/" + encodeURIComponent(templateUid));
    var res = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    return {
      success: true,
      sourceLang: res.sourceLang || "",
      targetLangs: Array.isArray(res.targetLangs) ? res.targetLangs : []
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function docImportGetCallerEmail_() {
  try {
    var e = Session.getActiveUser().getEmail();
    if (e) return e;
  } catch (err) {}
  try {
    return Session.getEffectiveUser().getEmail();
  } catch (err) {
    return "";
  }
}

function docImportAppendQueueRow_(rowValuesByHeader) {
  var ss = SpreadsheetApp.openById(DOC_IMPORT_SHEET_ID_);
  var sh = ss.getSheetByName(DOC_IMPORT_SHEET_NAME_);
  if (!sh) throw new Error("Queue-Sheet '" + DOC_IMPORT_SHEET_NAME_ + "' nicht gefunden.");
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
    return String(h || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  });
  var row = new Array(lastCol).fill("");
  Object.keys(rowValuesByHeader).forEach(function(key) {
    var normKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    var idx = headers.indexOf(normKey);
    if (idx !== -1) row[idx] = rowValuesByHeader[key];
  });
  sh.appendRow(row);
}

/**
 * Baut eine kompakte Datei-Zusammenfassung f?r die Chat-Notification:
 * einmal der Dateiname als generisches Muster ({LANG} statt konkretem
 * Sprachcode) + eine Liste aller Zielsprachen ? statt jede Datei einzeln.
 */
function docImportBuildFilesSummary_(results) {
  var successList = results.filter(function(r) { return r.success; });
  if (!successList.length) return "";
  var sample = successList[0];
  var pattern = sample.fileName;
  var langInFile = sample.targetLang || "";
  if (langInFile) {
    var escaped = langInFile.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    var re = new RegExp(escaped, "i");
    if (re.test(pattern)) pattern = pattern.replace(re, "{LANG}");
  }
  var langs = successList.map(function(r) { return r.targetLang; }).join(", ");
  return "? " + pattern + "\n? " + langs;
}

/**
 * payload = {
 *   templateUid, templateName, sourceLang, projectName, iaNumber,
 *   dueDate (ISO|null), note,
 *   files: [{ targetLang, fileId, fileName }]
 * }
 */
function apiUploadDocXmlBatch(payload) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  try {
    if (!payload || !payload.templateUid) return { success: false, error: "Kein Template ausgew?hlt." };
    if (!payload.projectName || !payload.projectName.trim()) return { success: false, error: "Projektname fehlt." };
    if (!payload.iaNumber || !/^[0-9]+$/.test(String(payload.iaNumber).trim())) {
      return { success: false, error: "IA Number ist Pflicht und muss numerisch sein." };
    }
    if (!Array.isArray(payload.files) || !payload.files.length) {
      return { success: false, error: "Keine XML-Dateien im Drive-Ordner gefunden." };
    }

    // ?? Referenzdatei-Pflichtpr?fung (PDF, XLSX, JPG, JPEG) ??????????????????????
    var refFiles = Array.isArray(payload.refFiles) ? payload.refFiles : [];
    var refDriveIds = Array.isArray(payload.refDriveIds) ? payload.refDriveIds : [];
    if (!refFiles.length && !refDriveIds.length) {
      return { success: false, error: "Referenzdatei fehlt: Bei Documentation Projects muss mindestens eine Referenzdatei (PDF, XLSX oder JPG) hochgeladen werden." };
    }

    var allowedRefExtensions = [".pdf", ".xlsx", ".jpg", ".jpeg"];
    for (var rIdx = 0; rIdx < refFiles.length; rIdx++) {
      var rName = String(refFiles[rIdx].name || refFiles[rIdx].fileName || "").toLowerCase();
      var isAllowed = allowedRefExtensions.some(function(ext) { return rName.endsWith(ext); });
      if (rName && !isAllowed) {
        return { success: false, error: "Ung?ltiges Format bei Referenzdatei '" + refFiles[rIdx].name + "'. Erlaubte Formate: PDF, XLSX, JPG, JPEG." };
      }
    }

    var callerEmail = docImportGetCallerEmail_();
    var targetLangs = payload.files.map(function(f) { return f.targetLang; });

    var projectUid = phraseCreateProjectFromTemplate_(payload.templateUid, {
      name: payload.projectName.trim(),
      sourceLang: payload.sourceLang || undefined,
      dateDue: payload.dueDate || undefined,
      note: payload.note || undefined,
      targetLangs: targetLangs
    });

    try { phraseSetProjectCreator_(projectUid, callerEmail); } catch (e) { /* ignore */ }

    var phraseUser = phraseGetUserByEmail_(callerEmail);
    var userIdForSheet = (phraseUser && phraseUser.userName) ? phraseUser.userName : callerEmail;

    var results = [];
    var errors = [];
    var timestamp = new Date().toISOString();

    payload.files.forEach(function(f) {
      try {
        if (!f.fileId) throw new Error("Keine Drive-Datei-ID.");
        var blob = DriveApp.getFileById(f.fileId).getBlob();
        blob.setName(f.fileName);

        var jobRes = phraseUploadJob_(projectUid, blob, f.fileName, [f.targetLang], payload.dueDate || null);
        var jobUid = (jobRes && Array.isArray(jobRes.jobs) && jobRes.jobs[0] && jobRes.jobs[0].uid) || "";
        var asyncId = (jobRes && jobRes.asyncRequest && jobRes.asyncRequest.id) || "";

        docImportAppendQueueRow_({
          "Timestamp": timestamp,
          "User ID": userIdForSheet,
          "Project UID": projectUid,
          "File Name": f.fileName,
          "Mime Type": "xml",
          "Target Lang": f.targetLang,
          "Status": "UPLOADED",
          "Job UID": jobUid,
          "Async ID": asyncId,
          "Notification Email": callerEmail,
          "Project Name": payload.projectName.trim(),
          "Due Date": payload.dueDate || "",
          "Template Name": payload.templateName || "",
          "Comments": payload.note || "",
          "IA Number": String(payload.iaNumber).trim(),
          "Order Number": "",
          "Phrase Project Status": "NEW"
        });

        results.push({ targetLang: f.targetLang, fileName: f.fileName, jobUid: jobUid, success: true });
      } catch (e) {
        errors.push(f.targetLang + " (" + f.fileName + "): " + e.message);
        results.push({ targetLang: f.targetLang, fileName: f.fileName, success: false, error: e.message });
      }
    });

    // ?? Google Chat Notification (gleicher Mechanismus wie Standard-Upload) ??
    if (results.some(function(r) { return r.success; })) {
      try {
        var chatEnabled = getUserChatPreference_(callerEmail);
        if (chatEnabled) {
          var phraseUrl = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
          var filesBlock = docImportBuildFilesSummary_(results);
          var props = PropertiesService.getScriptProperties();
          var firstSubmitKey = "CHAT_FIRST_SUBMIT__" + normalizeEmail_(callerEmail);
          var isFirstSubmit = !props.getProperty(firstSubmitKey);
          if (isFirstSubmit) props.setProperty(firstSubmitKey, "true");
          var msg = fillTemplate_(getMessageTemplate_("MSG_PROJECT_SUBMITTED", "en"), {
            PROJECT_NAME: payload.projectName.trim(),
            TEMPLATE_NAME: payload.templateName || "",
            SOURCE_LANG: payload.sourceLang || "",
            TARGET_LANGS: targetLangs.join(", "),
            DEADLINE: payload.dueDate ? new Date(payload.dueDate).toLocaleDateString("en-GB") : "Not set",
            NOTE_LINE: payload.note ? "? *Note:* " + payload.note + "\n" : "",
            FILES: filesBlock,
            PHRASE_URL: phraseUrl
          });
          if (isFirstSubmit) {
            try {
              sendPrivateMessage_(callerEmail, fillTemplate_(getMessageTemplate_("MSG_WELCOME", "en"), {}));
              Utilities.sleep(500);
            } catch (e0) {}
          }
          sendPrivateMessage_(callerEmail, msg);
          try {
            notifyWatchers_(payload.templateName || "", payload.projectName.trim(), callerEmail, projectUid, targetLangs, payload.templateUid || "");
          } catch (e2) {}
        }
      } catch (chatErr) {
        console.warn("Doc Import chat notification failed:", chatErr.message);
      }
    }

    return {
      success: true,
      projectUid: projectUid,
      createdCount: results.filter(function(r) { return r.success; }).length,
      totalCount: payload.files.length,
      errors: errors,
      sheetUrl: "https://docs.google.com/spreadsheets/d/" + DOC_IMPORT_SHEET_ID_ + "/edit?gid=" + DOC_IMPORT_QUEUE_GID_
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}