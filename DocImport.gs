/**
 * DocImport.gs
 * Google-Drive-basierter XML-Batch-Import f?r Documentation Projects.
 * Quelldateien liegen in Drive unter dem Admin-konfigurierten Root-Ordner
 * (DocDriveConfig.gs); der Unterordner-Name muss exakt dem Projektnamen
 * entsprechen (DocDriveTree.gs). Erstellt EIN Phrase-Projekt aus dem
 * gew?hlten Template und l?dt pro erkannter Zielsprache eine eigene XML-Datei
 * als separaten Job hoch. 
 * Schreibt das Projekt in das externe MAT-D Kanban-Sheet (aufgeteilt pro Sprache)
 * UND in das interne Standard-OPS-Queue-Sheet (als EINE zusammengefasste Projekt-Zeile),
 * damit es in "My Projects" korrekt als ein Projekt sichtbar ist und
 * automatisiert vom Chatbot/AutoSync ?berwacht wird.
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

function docImportGetQueueSheet_() {
  var ss = SpreadsheetApp.openById(DOC_IMPORT_SHEET_ID_);
  var sh = ss.getSheetByName(DOC_IMPORT_SHEET_NAME_);
  if (!sh) throw new Error("Queue-Sheet '" + DOC_IMPORT_SHEET_NAME_ + "' nicht gefunden.");
  return sh;
}

function docImportGetHeaderMap_(sh) {
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  headers.forEach(function(h, i) {
    map[String(h || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "")] = i;
  });
  return { map: map, lastCol: lastCol };
}

/**
 * Legt die Spalte "Drive Folder ID" im Queue-Sheet an, falls sie noch nicht
 * existiert. Notwendig f?r die Duplikat-Erkennung beim Doc Import - ohne
 * manuellen Eingriff im Sheet.
 */
function docImportEnsureFolderIdColumn_(sh) {
  var info = docImportGetHeaderMap_(sh);
  if (info.map.hasOwnProperty("drivefolderid")) return;
  sh.getRange(1, info.lastCol + 1).setValue("Drive Folder ID");
}

function docImportAppendQueueRow_(rowValuesByHeader) {
  var sh = docImportGetQueueSheet_();
  docImportEnsureFolderIdColumn_(sh);
  var info = docImportGetHeaderMap_(sh);
  var row = new Array(info.lastCol).fill("");
  Object.keys(rowValuesByHeader).forEach(function(key) {
    var normKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    var idx = info.map[normKey];
    if (idx !== undefined) row[idx] = rowValuesByHeader[key];
  });
  sh.appendRow(row);
}

/**
 * Liefert alle bisherigen Import-Zeilen f?r eine Drive-Ordner-ID (dedupliziert
 * nach Timestamp+Projektname), damit das Frontend vor einem erneuten Import
 * warnen kann.
 */
function docImportGetFolderImportHistory_(folderId) {
  if (!folderId) return [];
  var sh = docImportGetQueueSheet_();
  docImportEnsureFolderIdColumn_(sh);
  var info = docImportGetHeaderMap_(sh);
  var folderIdx = info.map["drivefolderid"];
  var lastRow = sh.getLastRow();
  if (lastRow < 2 || folderIdx === undefined) return [];
  var data = sh.getRange(2, 1, lastRow - 1, info.lastCol).getValues();
  var projIdx = info.map["projectname"];
  var tsIdx = info.map["timestamp"];
  var userIdx = info.map["userid"];
  var seen = {};
  var out = [];
  data.forEach(function(row) {
    var fid = String(row[folderIdx] || "").trim();
    if (!fid || fid !== String(folderId).trim()) return;
    var ts = tsIdx !== undefined ? row[tsIdx] : "";
    var proj = projIdx !== undefined ? row[projIdx] : "";
    var key = String(ts) + "|" + proj;
    if (seen[key]) return;
    seen[key] = true;
    out.push({ timestamp: ts, projectName: proj, userId: userIdx !== undefined ? row[userIdx] : "" });
  });
  return out;
}

/**
 * API: Import-Historie f?r einen Drive-Ordner abfragen (f?r die proaktive
 * Warnung direkt nach Ordnerauswahl im Frontend).
 */
function apiGetDocImportFolderHistory(folderId) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    return { success: true, history: docImportGetFolderImportHistory_(folderId) };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
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

    // -- Due Date ist Pflichtfeld ---------------------------------------------
    if (!payload.dueDate) {
      return { success: false, error: "Due Date ist ein Pflichtfeld." };
    }
    var dueDateObj_ = new Date(payload.dueDate);
    if (isNaN(dueDateObj_.getTime())) {
      return { success: false, error: "Due Date ist ung?ltig." };
    }

    // -- Wochenende / bundesweiter deutscher Feiertag -------------------------
    var nonWorking_ = checkGermanNonWorkingDay_(dueDateObj_);
    if (nonWorking_.blocked) {
      return { success: false, error: "Due Date f?llt auf " + nonWorking_.reason + ". Bitte ein anderes Datum w?hlen." };
    }

    // -- Express-Vorlage: Due Date max. 72h in der Zukunft + Aufschlag best?tigt --
    var isExpress_ = /express/i.test(String(payload.templateName || ""));
    if (isExpress_) {
      var hoursUntilDue_ = (dueDateObj_.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntilDue_ < 0 || hoursUntilDue_ > 72) {
        return { success: false, error: "Bei Express-Vorlagen muss das Due Date innerhalb der n?chsten 72 Stunden liegen." };
      }
      if (!payload.expressSurchargeConfirmed) {
        return { success: false, error: "Bitte best?tigen Sie den 15%-Express-Aufschlag.", needsExpressConfirmation: true };
      }
    }

    // -- Duplikat-Check: wurde dieser Drive-Ordner schon einmal importiert? ---
    if (!payload.driveFolderId) {
      return { success: false, error: "Kein Drive-Ordner ausgew?hlt." };
    }
    if (!payload.confirmDuplicate) {
      var history_ = docImportGetFolderImportHistory_(payload.driveFolderId);
      if (history_.length) {
        return {
          success: false,
          needsConfirmation: true,
          error: "Dieser Drive-Ordner wurde bereits importiert.",
          history: history_
        };
      }
    }

    // -- Referenzdatei-Pflichtpr?fung (PDF, XLSX, JPG, JPEG) ----------------------
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
    try { phraseSetProjectCustomFieldByName_(projectUid, "IA Number", String(payload.iaNumber).trim()); } catch (e) { /* ignore */ }

    // -- Referenzdateien an Phrase hochladen ---------------------------------
    var refUploadResults = [];
    refFiles.forEach(function(rf) {
      try {
        var refBlob = resolveFileToBlob_(rf);
        var refName = refBlob.getName() || rf.name || rf.fileName || "reference";
        phraseUploadReference_(projectUid, refBlob, refName);
        refUploadResults.push({ name: refName, ok: true });
      } catch (e) {
        console.warn("Doc Import: Referenzdatei-Upload fehlgeschlagen: " + e.message);
        refUploadResults.push({ name: rf.name || rf.fileName || "reference", ok: false, error: e.message });
      }
    });
    refDriveIds.forEach(function(fid) {
      try {
        var driveFile = DriveApp.getFileById(fid);
        var refBlob2 = driveFile.getBlob();
        phraseUploadReference_(projectUid, refBlob2, driveFile.getName());
        refUploadResults.push({ name: driveFile.getName(), ok: true });
      } catch (e) {
        console.warn("Doc Import: Referenzdatei (Drive) Upload fehlgeschlagen: " + e.message);
        refUploadResults.push({ name: fid, ok: false, error: e.message });
      }
    });

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

        // 1. In das Kanban-Sheet eintragen (Einzeleintr?ge pro Sprache/Datei)
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
          "Phrase Project Status": "NEW",
          "Drive Folder ID": payload.driveFolderId || ""
        });

        results.push({ targetLang: f.targetLang, fileName: f.fileName, jobUid: jobUid, asyncId: asyncId, success: true });
      } catch (e) {
        errors.push(f.targetLang + " (" + f.fileName + "): " + e.message);
        results.push({ targetLang: f.targetLang, fileName: f.fileName, success: false, error: e.message });
      }
    });

    // 2. Dual-Write: EXACTLY ONE ROW into standard OPS-Queue-Sheet f?r AutoSync & Chat
    var successfulJobs = results.filter(function(r) { return r.success; });
    if (successfulJobs.length > 0) {
      try {
        var allJobUids = successfulJobs.map(function(r) { return r.jobUid; });
        var allFileNames = successfulJobs.map(function(r) { return r.fileName; }).join(", ");
        var allTargetLangs = successfulJobs.map(function(r) { return r.targetLang; }).join(", ");
        var firstAsyncId = successfulJobs[0].asyncId || "";

        var mainQueueSh = getQueueSheet_();
        var mainQueueRowIndex = mainQueueSh.getLastRow() + 1;
        mainQueueSh.appendRow([
          timestamp,                    // A: Timestamp
          callerEmail,                  // B: User Email
          projectUid,                   // C: Project UID
          "",                           // D: File ID (F?r Download im Standard-Tab nicht mehr relevant, da DriveDoc Export genutzt wird)
          allFileNames,                 // E: File Name
          "xml",                        // F: Mime Type
          allTargetLangs,               // G: Target Lang
          "UPLOADED",                   // H: Status
          JSON.stringify(allJobUids),   // I: Job UID
          firstAsyncId,                 // J: Async ID
          callerEmail,                  // K: Notification Email
          payload.projectName.trim(),   // L: Project Name
          payload.dueDate || "",        // M: Due Date
          "",                           // N: CC Email
          "",                           // O: Analysis UID
          "",                           // P: Total Words
          "",                           // Q: Net Words
          "",                           // R: Shared With
          payload.templateName || ""    // S: Template Name
        ]);
      } catch (queueErr) {
        console.warn("DocImport: Failed to write to internal main Queue sheet: ", queueErr);
      }
    }

    // -- Google Chat Notification (gleicher Mechanismus wie Standard-Upload) --
    if (successfulJobs.length > 0) {
      try {
        var chatEnabled = getUserChatPreference_(callerEmail);
        if (chatEnabled) {
          var phraseUrl = "[https://cloud.memsource.com/web/project/show/](https://cloud.memsource.com/web/project/show/)" + encodeURIComponent(projectUid);
          var filesBlock = docImportBuildFilesSummary_(results);
          if (refUploadResults.length > 0) {
            filesBlock += "\n\nReference Files:\n" + refUploadResults.map(function(r) {
              return "- " + r.name + (r.ok ? "" : " (Upload failed)");
            }).join("\n");
          }
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
            NOTE_LINE: payload.note ? "\n*Note:* " + payload.note + "\n" : "",
            FILES: filesBlock,
            PHRASE_URL: phraseUrl
          });
          if (isFirstSubmit) {
            try {
              sendPrivateMessage_(callerEmail, fillTemplate_(getMessageTemplate_("MSG_WELCOME", "en"), {}));
              Utilities.sleep(500);
            } catch (e0) {}
          }
          var chatResp = sendPrivateMessage_(callerEmail, msg);
          if (chatResp && chatResp.name && typeof mainQueueRowIndex !== "undefined") {
            try { mainQueueSh.getRange(mainQueueRowIndex, 20).setValue(chatResp.name); } catch (e3) {}
          }
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
      createdCount: successfulJobs.length,
      totalCount: payload.files.length,
      errors: errors,
      sheetUrl: "[https://docs.google.com/spreadsheets/d/](https://docs.google.com/spreadsheets/d/)" + DOC_IMPORT_SHEET_ID_ + "/edit?gid=" + DOC_IMPORT_QUEUE_GID_
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Schreibt den aktuellen Phrase Projekt-Status in alle passenden Zeilen
 * des externen MAT-D Kanban-Sheets zur?ck (Spalte "Phrase Project Status").
 * Wird von autoSyncProjectStatuses_ nach jedem Statuswechsel aufgerufen.
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 */
function docImportUpdateProjectStatusInKanban_(projectUid, newStatus) {
  if (!projectUid || !newStatus) return;
  try {
    var sh = docImportGetQueueSheet_();
    var info = docImportGetHeaderMap_(sh);
    var uidIdx = info.map["projectuid"];
    var statusIdx = info.map["phraseprojectstatus"];
    if (uidIdx === undefined || statusIdx === undefined) return;

    var lastRow = sh.getLastRow();
    if (lastRow < 2) return;

    var data = sh.getRange(2, 1, lastRow - 1, info.lastCol).getValues();
    var updated = false;
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][uidIdx]).trim() === String(projectUid).trim()) {
        sh.getRange(i + 2, statusIdx + 1).setValue(newStatus);
        updated = true;
      }
    }
    if (updated) console.log("Doc Import: Phrase Project Status im MAT-D Sheet aktualisiert -> " + newStatus + " (" + projectUid + ")");
  } catch (e) {
    console.warn("docImportUpdateProjectStatusInKanban_ fehlgeschlagen: " + e.message);
  }
}