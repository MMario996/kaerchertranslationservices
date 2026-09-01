/**
 * Upload.gs
 * - Project creation + file upload to Phrase TMS
 * - Chat: 2 separate messages on first submit (welcome + project confirmation)
 * - Chat: subsequent submits get only the project confirmation message
 * - apiAddJobNote / apiGetJobNotes via Phrase Conversations API
 * - Google Chat Bot triggers
 * FIX: Deadline guard added to prevent silent timeout on large files.
 * FIX: rememberChatUserFromEvent_ schreibt via saveChatUserResourceName_ ins Notifications-Sheet
 * FIX: onAddedToSpace tr?gt User beim App-Install automatisch mit ON ins Notifications-Sheet ein
 *      ? Sheet-Zugriff entfernt aus Bot-Kontext (kein SpreadsheetApp in doPost/onAddedToSpace)
 * FIX: Watcher-Benachrichtigung bei Projekt-Create
 *
 * HINWEIS: getStoredChatUserResourceName_() und saveChatUserResourceName_()
 * sind kanonisch in ChatToken.js definiert (Sheet-basiert, prim?r).
 * Duplikate hier entfernt ? die Property-Only-Versionen verhinderten
 * das Auffinden der Chat-IDs aus dem Notifications-Sheet.
 */

const PORTAL_URL_ = "https://sites.google.com/karcher.com/phrase";

// ??? Blocked file extensions for main files ???????????????????????????????????
const BLOCKED_MAIN_EXTENSIONS_ = [".pdf", ".doc"];

// ??? Deadline guard ???????????????????????????????????????????????????????????
const UPLOAD_DEADLINE_MS_ = 300 * 1000; // 5 minutes

// ??? Project Creation + Upload ????????????????????????????????????????????????

function apiCreateProjectAndUpload(payload) {
  const _startTime = Date.now();

  const access = apiCheckAccess();
  if (!access.allowed) {
    if (access.reason === "maintenance") {
      return { ok: false, error: "Maintenance active", maintenance: access.maintenance };
    }
    return { ok: false, error: "Not authorized. Please request access." };
  }

  const userEmail = getUserEmail_();
  console.log("? Starting project creation for user:", userEmail);

  const portalType = String(payload.portalType || "").trim().toLowerCase();
  const setRealOwner = (portalType === "woma" || portalType === "cc");

  const templateUid = String(payload.templateUid || "").trim();
  const projectName = String(payload.projectName || "").trim();
  const sourceLang  = String(payload.sourceLang  || "").trim();

  let targetLangs = payload.targetLangs;
  if (!targetLangs) {
    const single = String(payload.targetLang || "").trim();
    targetLangs = single ? [single] : [];
  }
  if (!Array.isArray(targetLangs)) targetLangs = [targetLangs];

  const note    = String(payload.note    || "").trim();
  const dueDate = payload.dueDate || payload.dateDue || "";

  if (!templateUid && !payload.targetUidMap)    return { ok: false, error: "Template missing." };
  if (!projectName)                             return { ok: false, error: "Project name missing." };
  if (!sourceLang)                              return { ok: false, error: "Source language missing." };
  if (!targetLangs || targetLangs.length === 0) return { ok: false, error: "Target language missing." };

  const mainFiles = payload.mainFiles || payload.allMainFiles || [];
  if (!Array.isArray(mainFiles) || mainFiles.length === 0) return { ok: false, error: "Main file missing." };

  const refFiles = [...(payload.refFiles || [])];
  const refDriveIds = Array.isArray(payload.refDriveIds) ? payload.refDriveIds : [];
  refDriveIds.forEach(id => {
    if (id) refFiles.push({ source: "drive", id: id, name: "" });
  });

  // ?? Validate main file extensions ??????????????????????????????????????????
  for (const f of mainFiles) {
    const meta = resolveFileMeta_(f);
    const name = String(meta.fileName || "").toLowerCase();
    const blocked = BLOCKED_MAIN_EXTENSIONS_.find(ext => name.endsWith(ext));
    if (blocked) {
      return {
        ok: false,
        error: `Upload failed: "${meta.fileName}" cannot be used as a main file.\n\n` +
               `${blocked === ".pdf" ? "PDFs" : ".doc files (Word 97-2003)"} cannot be translated by Phrase TMS.\n` +
               `Please upload the editable source format (.docx, .xlsx, .pptx, .idml, etc.).`
      };
    }
  }

  // ?? Group target languages by their template UID ???????????????????????????
  const uidGroups = {};
  const targetUidMap = payload.targetUidMap || {};
  const fallbackUid = templateUid;

  targetLangs.forEach(lang => {
    const uid = targetUidMap[lang] || fallbackUid;
    if (!uidGroups[uid]) uidGroups[uid] = [];
    uidGroups[uid].push(lang);
  });

  const totalGroups = Object.keys(uidGroups).length;

  const overallProjectUids = [];
  const overallJobUids = [];
  const overallJobMapping = [];
  const overallMainResults = [];
  const overallRefResults = [];
  const overallErrors = [];
  let threadId = "";
  const queueRowsToAppend = [];

  // ?? Loop over template UID groups ?????????????????????????????????????????
  for (const uid of Object.keys(uidGroups)) {

    if (Date.now() - _startTime > UPLOAD_DEADLINE_MS_) {
      const timeoutMsg = "?? Upload is taking longer than expected. " +
        "The project may already have been created in Phrase TMS. " +
        "Please check 'My Projects' in a moment. " +
        "Remaining languages: " + uidGroups[uid].join(", ");
      overallErrors.push(timeoutMsg);
      console.warn("?? Deadline guard triggered for UID:", uid);
      break;
    }

    const groupLangs = uidGroups[uid];
    const groupProjectName = totalGroups > 1 ? `${projectName} (${groupLangs.join(', ')})` : projectName;

    try {
      console.log(`? Creating project from template (UID: ${uid}) for langs: ${groupLangs.join(', ')}`);
      const projectUid = phraseCreateProjectFromTemplate_(uid, {
        name:        groupProjectName,
        sourceLang:  sourceLang,
        targetLangs: groupLangs,
        note:        note,
        dateDue:     dueDate || undefined
      });
      phraseSetProjectCreator_(projectUid, userEmail);
      if (setRealOwner) phraseSetProjectOwner_(projectUid, userEmail);
      overallProjectUids.push(projectUid);
      console.log("? Project created:", projectUid);

      // Upload Reference Files
      const refResults = [];
      for (const f of refFiles) {
        if (Date.now() - _startTime > UPLOAD_DEADLINE_MS_) {
          console.warn("?? Deadline guard: skipping remaining reference files");
          break;
        }
        try {
          const blob    = resolveFileToBlob_(f);
          const refName = blob.getName() || resolveFileMeta_(f).fileName || "reference";
          phraseUploadReference_(projectUid, blob, refName);
          if (overallProjectUids.length === 1) refResults.push({ name: refName, ok: true });
        } catch (e) {
          console.warn("?? Reference upload failed:", e.message);
          const metaName = resolveFileMeta_(f).fileName || "reference";
          if (overallProjectUids.length === 1) refResults.push({ name: metaName, ok: false, error: String(e) });
        }
      }
      if (overallProjectUids.length === 1) overallRefResults.push(...refResults);

      // Upload Main Files
      const mainResults = [];
      const groupJobUids  = [];
      const groupJobMapping = [];

      for (let i = 0; i < mainFiles.length; i++) {
        if (Date.now() - _startTime > UPLOAD_DEADLINE_MS_) {
          console.warn("?? Deadline guard: skipping remaining main files");
          overallErrors.push("?? Some files were not uploaded due to time limit. Please re-submit remaining files.");
          break;
        }
        try {
          const blob         = resolveFileToBlob_(mainFiles[i]);
          const mainFileName = blob.getName();

          const up = phraseUploadJob_(projectUid, blob, mainFileName, groupLangs);

          const jobsArr = Array.isArray(up.jobs) ? up.jobs : [];
          const extractedUids = jobsArr.map(j => String(j.uid || "")).filter(Boolean);
          const asyncId = (up.asyncRequest && up.asyncRequest.id) ? up.asyncRequest.id : "";

          if (up.unsupportedFiles && up.unsupportedFiles.length > 0) {
            console.warn("?? Phrase rejected as unsupported:", up.unsupportedFiles.join(", "));
            mainResults.push({ name: mainFileName, jobUids: [], asyncId, unsupported: true, unsupportedFiles: up.unsupportedFiles });
            overallErrors.push(`"${mainFileName}" was rejected by Phrase TMS ? format not supported.`);
            continue;
          }

          mainResults.push({ name: mainFileName, jobUids: extractedUids, asyncId, targetLangs: groupLangs });
          groupJobUids.push(...extractedUids);
          jobsArr.forEach(j => {
            if (j.uid) groupJobMapping.push({ jobUid: j.uid, fileName: mainFileName, targetLang: j.targetLang || "" });
          });

        } catch (e) {
          throw new Error(`Upload failed for file ${i + 1}: ${e.message}`);
        }
      }

      overallJobUids.push(...groupJobUids);
      overallJobMapping.push(...groupJobMapping);
      overallMainResults.push(...mainResults);

      const ts           = new Date().toISOString();
      const firstMain    = resolveFileMeta_(mainFiles[0]);
      const fileIdSource = (firstMain.source === "drive" && firstMain.fileId) ? firstMain.fileId : "pc_upload";
      const fileName     = (mainResults[0] && mainResults[0].name) || firstMain.fileName || "unknown_file";
      const mimeType     = firstMain.mimeType || "";
      const targetLangStr = groupLangs.join(", ");

      queueRowsToAppend.push([
        ts, userEmail, projectUid, fileIdSource, fileName, mimeType,
        targetLangStr, "UPLOADED", JSON.stringify(groupJobUids), "",
        "", groupProjectName, dueDate || "", "", "", "", "", "",
        payload.templateName || "", "##THREAD_ID##",
        JSON.stringify(groupJobMapping), ""
      ]);

      logAuditEvent_(userEmail, "PROJECT_CREATE", `Created '${groupProjectName}' (${projectUid}) ? ${targetLangStr}`);

    } catch (error) {
      console.error(`? Project creation failed for UID ${uid}:`, error);
      overallErrors.push(`Failed for languages ${groupLangs.join(', ')}: ${error.message || String(error)}`);
    }
  }

  // ?? Chat Notifications ????????????????????????????????????????????????????
  if (overallProjectUids.length > 0) {
    const chatEnabled = getUserChatPreference_(userEmail);
    if (chatEnabled) {
      const phraseUrl = overallProjectUids.length === 1
          ? "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(overallProjectUids[0])
          : "https://cloud.memsource.com/web/project2/list";

      const props          = PropertiesService.getScriptProperties();
      const firstSubmitKey = "CHAT_FIRST_SUBMIT__" + normalizeEmail_(userEmail);
      const isFirstSubmit  = !props.getProperty(firstSubmitKey);
      if (isFirstSubmit) props.setProperty(firstSubmitKey, "true");

      const fileJobMap = {};
      overallMainResults.forEach(f => {
         if (!fileJobMap[f.name]) fileJobMap[f.name] = { unsupported: false, lines: [] };
         if (f.unsupported) {
           fileJobMap[f.name].unsupported = true;
         } else {
           (f.jobUids || []).forEach((jUid, idx) => {
              const tLang = (f.targetLangs && f.targetLangs[idx]) || "Target";
              const jobUrl = "https://cloud.memsource.com/web/job/" + encodeURIComponent(jUid) + "/translate";
              fileJobMap[f.name].lines.push(`   ? ${tLang}: ${jobUrl}`);
           });
         }
      });

      const filesBlockArr = [];
      for (const [fName, data] of Object.entries(fileJobMap)) {
         if (data.unsupported) filesBlockArr.push(`? *${fName}* ?? (Upload failed ? format not supported)`);
         else filesBlockArr.push(`? *${fName}*\n${data.lines.join('\n')}`);
      }
      let filesBlock = filesBlockArr.join("\n");

      if (overallRefResults && overallRefResults.length > 0) {
        filesBlock += "\n\n? *Reference Files*\n" +
          overallRefResults.map(r => "? " + r.name + (r.ok ? "" : " ?? (Upload failed)")).join("\n");
      }

      const noteLine = note ? "? *Note:* " + note + "\n" : "";

      const projectMsg = fillTemplate_(getMessageTemplate_("MSG_PROJECT_SUBMITTED", "en"), {
        PROJECT_NAME:  projectName + (totalGroups > 1 ? " (Multiple Projects)" : ""),
        TEMPLATE_NAME: payload.templateName || "Mixed",
        SOURCE_LANG:   sourceLang,
        TARGET_LANGS:  targetLangs.join(", "),
        DEADLINE:      dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "Not set",
        NOTE_LINE:     noteLine,
        FILES:         filesBlock,
        PHRASE_URL:    phraseUrl
      });

      try {
        if (isFirstSubmit) {
          const welcomeMsg = fillTemplate_(getMessageTemplate_("MSG_WELCOME", "en"), {});
          try { sendPrivateMessage_(userEmail, welcomeMsg); Utilities.sleep(500); } catch(e){}
        }
        const chatResponse = sendPrivateMessage_(userEmail, projectMsg);
        if (chatResponse && chatResponse.name) threadId = chatResponse.name;
      } catch (e) {
        console.error("Chat notification failed:", e.message);
      }

      // FIX: Watcher benachrichtigen
      try {
        notifyWatchers_(
        payload.templateName || "",
        projectName,
        userEmail,
        overallProjectUids[0],
        targetLangs,
        payload.templateUid || ""   // ? Template-UID erg?nzen
      );
      } catch(watcherErr) {
        console.warn("Watcher notification failed:", watcherErr.message);
      }
    }

    const sh = getQueueSheet_();
    queueRowsToAppend.forEach(row => {
      row[19] = threadId;
      sh.appendRow(row);
    });
  }

  if (overallProjectUids.length === 0) {
     return { success: false, error: "Failed to create any projects.\n" + overallErrors.join("\n") };
  }

  const hasTimeoutWarning = overallErrors.some(e => e.includes("??"));

  return {
    success:         true,
    timedOut:        hasTimeoutWarning,
    projectUid:      overallProjectUids[0],
    allProjectUids:  overallProjectUids,
    jobUids:         overallJobUids,
    jobMapping:      overallJobMapping,
    mainResults:     overallMainResults,
    refResults:      overallRefResults,
    createdProjects: overallProjectUids.length,
    errors:          overallErrors.length > 0 ? [...new Set(overallErrors)] : []
  };
}


// ??? B: Job Notes via Phrase Conversations API ????????????????????????????????

function apiAddJobNote(projectUid, jobUidRaw, noteText) {
  const caller = getUserEmail_();

  let jobUid = jobUidRaw;
  if (Array.isArray(jobUid)) jobUid = jobUid[0];
  if (typeof jobUid !== "string") jobUid = String(jobUid || "").trim();
  jobUid = jobUid.replace(/[\[\]"]/g, "").trim();

  if (!jobUid) return { success: false, error: "No valid job UID provided." };
  if (!noteText || !String(noteText).trim()) return { success: false, error: "Note text is required." };

  try {
    const sh   = getQueueSheet_();
    const data = sh.getDataRange().getValues();
    let authorized = false;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() === projectUid) {
        const owner      = String(data[i][1]).toLowerCase().trim();
        const sharedWith = String(data[i][17] || "").toLowerCase();
        if (isAdmin_(caller) || owner === caller || sharedWith.includes(caller)) {
          authorized = true;
          const existingNotes = String(data[i][22] || "").trim();
          const noteEntry = new Date().toISOString().slice(0, 16) + " [" + caller + "]: " + noteText;
          const newNotes  = existingNotes ? existingNotes + "\n" + noteEntry : noteEntry;
          sh.getRange(i + 1, 23).setValue(newNotes);
        }
        break;
      }
    }

    if (!authorized) return { success: false, error: "Not authorized." };

  } catch (e) {
    console.warn("Queue lookup failed:", e.message);
  }

  try {
    const url = phraseApiUrlV3_("/jobs/" + encodeURIComponent(jobUid) + "/conversations/plains");
    const result = phraseFetchJson_(url, {
      method:      "post",
      contentType: "application/json",
      headers:     { Authorization: getPhraseAuthHeader_() },
      payload:     JSON.stringify({
        refs:     [],
        comments: [{ text: String(noteText).trim() }]
      })
    });

    console.log("? Job note added to Phrase:", jobUid);
    logAuditEvent_(caller, "JOB_NOTE", "Note added to job " + jobUid + " in project " + projectUid);
    return { success: true, conversationId: result && result.id };

  } catch (e) {
    console.error("? Phrase job note failed:", e.message);
    return { success: false, error: e.message };
  }
}

function apiGetJobNotes(projectUid, jobUidRaw) {
  let jobUid = jobUidRaw;
  if (Array.isArray(jobUid)) jobUid = jobUid[0];
  if (typeof jobUid !== "string") jobUid = String(jobUid || "").trim();
  jobUid = jobUid.replace(/[\[\]"]/g, "").trim();

  if (!jobUid) return { success: false, error: "No valid job UID.", notes: [] };

  try {
    const url    = phraseApiUrlV1_("/jobs/" + encodeURIComponent(jobUid) + "/conversations/plains");
    const result = phraseFetchJson_(url, {
      method:  "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });

    const conversations = result && result.content ? result.content : (Array.isArray(result) ? result : []);
    const notes = conversations.map(c => ({
      id:       c.id,
      created:  c.dateCreated,
      author:   c.author && (c.author.fullName || c.author.email) || "Unknown",
      comments: (c.comments || []).map(cm => cm.text || "").filter(Boolean)
    }));

    return { success: true, notes };
  } catch (e) {
    return { success: false, error: e.message, notes: [] };
  }
}

function phraseApiUrlV3_(path) {
  const p = String(path || "");
  return getPhraseWebBaseUrl_() + "/api2/v3" + (p.startsWith("/") ? p : "/" + p);
}

// ??? File Resolvers ???????????????????????????????????????????????????????????

function resolveFileToBlob_(f) {
  const meta = resolveFileMeta_(f);

  if (meta.source === "pc") {
    let b64 = String(meta.base64 || "");
    if (b64.includes(",")) b64 = b64.split(",")[1];
    try {
      const bytes = Utilities.base64Decode(b64);
      return Utilities.newBlob(bytes, meta.mimeType || "application/octet-stream", meta.fileName || "upload.file");
    } catch (e) {
      throw new Error("Failed to process uploaded file: " + e.message);
    }
  }

  if (meta.source === "drive") {
    if (!meta.fileId) throw new Error("Drive file ID missing.");
    try {
      const file = DriveApp.getFileById(meta.fileId);
      return getProcessedDriveFileBlobForUpload_(file);
    } catch (e) {
      throw new Error("Failed to fetch from Google Drive: " + e.message);
    }
  }

  // FIX: Drive-Link als dritte Upload-Option (source: "drivelink")
  if (meta.source === "drivelink") {
    if (!meta.fileId) throw new Error("Drive link file ID missing.");
    try {
      const file = DriveApp.getFileById(meta.fileId);
      return getProcessedDriveFileBlobForUpload_(file);
    } catch (e) {
      throw new Error(
        "Failed to fetch from Google Drive Link: " + e.message +
        "\n\nBitte stelle sicher dass du Editor-Rechte auf die Datei hast."
      );
    }
  }

  throw new Error("Unknown file source: " + meta.source);
}

function resolveFileMeta_(f) {
  if (!f) return { source: "", fileId: "", fileName: "", mimeType: "", base64: "" };
  let source   = String(f.source || f.type || "").trim().toLowerCase();
  const fileId   = String(f.fileId || f.id   || "").trim();
  const fileName = String(f.fileName || f.name || "").trim();
  const mimeType = String(f.mimeType || f.mime || "").trim();
  const base64   = String(f.base64 || f.data  || "");
  if (!source) {
    if (base64 && base64.length > 0)      source = "pc";
    else if (fileId && fileId.length > 0) source = "drive";
  }
  return { source, fileId, fileName, mimeType, base64 };
}

// =============================================================================
// GOOGLE CHAT BOT
// =============================================================================

var CHAT_USER_MAP_PREFIX_ = "CHAT_USER_MAP__";

function getChatBotService_() {
  const props = PropertiesService.getScriptProperties();
  const clientEmail = props.getProperty("CHAT_CLIENT_EMAIL");
  let privateKey    = props.getProperty("CHAT_PRIVATE_KEY");
  if (!clientEmail || !privateKey) return null;
  privateKey = privateKey.replace(/\\n/g, "\n");
  return OAuth2.createService("TranslationChatBot_v3")
    .setTokenUrl("https://oauth2.googleapis.com/token")
    .setPrivateKey(privateKey)
    .setIssuer(clientEmail)
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope("https://www.googleapis.com/auth/chat.bot");
}

function requireChatBotService_() {
  const service = getChatBotService_();
  if (!service) throw new Error("Chat Bot nicht eingerichtet.");
  if (!service.hasAccess()) throw new Error("Chat Bot Auth fehlgeschlagen: " + (service.getLastError() || "Unknown error"));
  return service;
}

function sendPrivateMessage_(userEmail, messageText) {
  const normalizedEmail  = normalizeEmail_(userEmail);
  if (!normalizedEmail) throw new Error("Ung?ltige Empf?nger-E-Mail.");
  const service          = requireChatBotService_();
  const token            = service.getAccessToken();
  const userResourceName = resolveChatUserResourceName_(normalizedEmail);
  const spaceName        = findDirectMessageSpaceName_(token, userResourceName);
  const result           = postChatMessage_(token, spaceName, messageText);
  console.log("? Chat DM sent to " + normalizedEmail);
  return result;
}

function updateChatMessage_(messageName, newText) {
  const service = requireChatBotService_();
  const token = service.getAccessToken();
  const url = "https://chat.googleapis.com/v1/" + messageName + "?updateMask=text";
  const res = UrlFetchApp.fetch(url, {
    method: "patch",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    payload: JSON.stringify({ text: String(newText || "") }),
    muteHttpExceptions: true
  });
  if (res.getResponseCode() >= 400) { console.warn("Message update failed:", res.getContentText()); return null; }
  try { return JSON.parse(res.getContentText()); } catch(e) { return null; }
}

function sendThreadReply_(userEmail, threadMessageName, replyText) {
  if (!threadMessageName) return null;
  const service = requireChatBotService_();
  const token   = service.getAccessToken();

  let spaceName  = "";
  let threadName = threadMessageName;

  if (threadMessageName.includes("/messages/")) {
    spaceName  = threadMessageName.split("/messages/")[0];
    threadName = threadMessageName.replace("/messages/", "/threads/").split(".")[0];
  } else if (threadMessageName.includes("/threads/")) {
    spaceName = threadMessageName.split("/threads/")[0];
  } else {
    console.warn("Ung?ltiges Thread-Format:", threadMessageName);
    return null;
  }

  let mentionTag = "";
  if (userEmail) {
    try {
      const userResName = resolveChatUserResourceName_(userEmail);
      if (userResName) mentionTag = "<" + userResName + ">\n";
    } catch (e) {
      console.warn("User-Tag fehlgeschlagen:", e.message);
    }
  }

  const url = "https://chat.googleapis.com/v1/" + spaceName +
              "/messages?messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD";

  const res = UrlFetchApp.fetch(url, {
    method:             "post",
    headers:            { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    payload:            JSON.stringify({ text: mentionTag + String(replyText || ""), thread: { name: threadName } }),
    muteHttpExceptions: true
  });

  const code = res.getResponseCode();
  const body = res.getContentText();
  if (code >= 400) { console.warn("Thread reply failed (" + code + "):", body); return null; }
  try { return JSON.parse(body); } catch(e) { return null; }
}

function postChatMessage_(token, spaceName, messageText) {
  const url = "https://chat.googleapis.com/v1/" + spaceName + "/messages";
  const res = UrlFetchApp.fetch(url, {
    method:             "post",
    headers:            { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    payload:            JSON.stringify({ text: String(messageText || "") }),
    muteHttpExceptions: true
  });
  const code = res.getResponseCode();
  const body = res.getContentText();
  if (code >= 400) throw new Error("Fehler beim Senden: " + body);
  try { return JSON.parse(body || "{}"); } catch(e) { return {}; }
}

function findDirectMessageSpaceName_(token, userResourceName) {
  const url = "https://chat.googleapis.com/v1/spaces:findDirectMessage?name=" + encodeURIComponent(userResourceName);
  const res = UrlFetchApp.fetch(url, { method: "get", headers: { Authorization: "Bearer " + token }, muteHttpExceptions: true });
  const code = res.getResponseCode();
  const body = res.getContentText();
  if (code === 404) throw new Error("Kein Direktchat. Der Nutzer muss den Bot 'Translation-Services' einmal ?ffnen und eine Nachricht schreiben.");
  if (code >= 400)  throw new Error("Fehler beim Suchen des Direktchats: " + body);
  const data = JSON.parse(body || "{}");
  if (!data.name) throw new Error("Direktchat gefunden, aber kein Space-Name.");
  return data.name;
}

function resolveChatUserResourceName_(userEmail) {
  const cached = getStoredChatUserResourceName_(userEmail);
  if (cached) return cached;
  const fallback = tryResolveChatUserResourceNameViaDirectory_(userEmail);
  if (fallback) { saveChatUserResourceName_(userEmail, fallback); return fallback; }
  throw new Error("Kein Chat-User-Mapping f?r " + userEmail + ". Der Nutzer muss den Bot 'Translation-Services' einmal ?ffnen.");
}

function tryResolveChatUserResourceNameViaDirectory_(userEmail) {
  try {
    if (typeof AdminDirectory === "undefined" || !AdminDirectory.Users || !AdminDirectory.Users.get) return "";
    const user = AdminDirectory.Users.get(userEmail);
    if (user && user.id) return "users/" + user.id;
  } catch(e) { console.warn("Directory fallback failed:", e); }
  return "";
}

// ??? Chat Triggers ????????????????????????????????????????????????????????????

function onAddedToSpace(e) {
  try {
    const userInfo = rememberChatUserFromEvent_(e);

    const props = PropertiesService.getScriptProperties();
    const welcomeKey = "CHAT_WELCOMED__" + normalizeEmail_(userInfo.userEmail);
    const alreadyWelcomed = props.getProperty(welcomeKey);

    // FIX: User beim App-Install in Script Properties als "Notifications ON" markieren
    // Sheet-Zugriff hier nicht m?glich (Bot-Kontext hat keinen SpreadsheetApp-Scope)
    // Die Notifications-Sheet-Eintragung passiert beim ersten apiSetChatPreference-Aufruf
    // oder via Admin "Sync Notifications"
    if (userInfo.userEmail) {
      const prefKey = "CHAT_PREF_ON__" + userInfo.userEmail;
      if (!props.getProperty(prefKey)) {
        props.setProperty(prefKey, "true");
        console.log("? Chat pref ON gesetzt in Script Properties f?r:", userInfo.userEmail);
      }
    }

    if (!alreadyWelcomed && userInfo.userEmail) {
      props.setProperty(welcomeKey, "true");
      const welcomeText = [
        "? Welcome to *Translation-Services*" + (userInfo.displayName ? ", " + userInfo.displayName : "") + "!",
        "",
        "You are now registered and will receive automatic notifications when:",
        "? ? Your project has been submitted",
        "? ? Your translation is ready to download",
        "? ? A colleague shares a project with you",
        "? ?? A deadline is approaching (24h reminder)",
        "",
        "? *Next step:* Submit your first project in the portal ? you'll receive a confirmation here.",
        "",
        "? " + PORTAL_URL_,
        "",
        "? *Note:* This is a read-only notification channel. Please use the Portal for all actions."
      ].join("\n");
      return { text: welcomeText };
    }

    return { text: "? *Translation-Services* ? Notifications active.\n\n? " + PORTAL_URL_ };

  } catch(err) {
    return { text: "? *Translation-Services* ? Notification bot active.\n\n? " + PORTAL_URL_ };
  }
}

function onMessage(e) {
  rememberChatUserFromEvent_(e);
  return {
    text: [
      "? *Translation-Services Bot*",
      "",
      "This is a read-only notification channel. I cannot process commands or answer questions.",
      "",
      "? *What you can do in the Portal:*",
      "? Submit new translation projects",
      "? Track project status in 'My Projects'",
      "? Download completed translations",
      "? Share projects with colleagues",
      "",
      "? *Open Portal:* " + PORTAL_URL_
    ].join("\n")
  };
}

function onAppCommand(e) {
  return { text: "? *Translation-Services* ? Read-only notification bot.\n\n? " + PORTAL_URL_ };
}

function onRemovedFromSpace(e) { return; }

function doPost(e) {
  try {
    const event = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    rememberChatUserFromEvent_(event);
    const type = String(event.type || "").trim();
    if (type === "ADDED_TO_SPACE") return createChatJsonResponse_(onAddedToSpace(event));
    if (type === "MESSAGE")        return createChatJsonResponse_(onMessage(event));
    if (type === "APP_COMMAND")    return createChatJsonResponse_(onAppCommand(event));
    return createChatJsonResponse_({});
  } catch(err) {
    return createChatJsonResponse_({
      text: "?? *Translation-Services Bot* ? An error occurred. Please use the Portal.\n\n? " + PORTAL_URL_
    });
  }
}

function createChatJsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj || {})).setMimeType(ContentService.MimeType.JSON);
}

function rememberChatUserFromEvent_(event) {
  if (!event) return { userName: "", userEmail: "", displayName: "" };
  const user = event.user || {};
  let userName    = String(user.name        || "").trim();
  let userEmail   = normalizeEmail_(user.email       || "");
  let displayName = String(user.displayName || "").trim();

  if (!userEmail && event.message && event.message.sender) {
    const s = event.message.sender;
    userName    = userName    || String(s.name        || "").trim();
    userEmail   = userEmail   || normalizeEmail_(s.email       || "");
    displayName = displayName || String(s.displayName || "").trim();
  }

  if (userEmail && /^users\/.+/.test(userName)) {
    // FIX: Nur Script Properties ? kein Sheet-Zugriff im Bot-Kontext
    try {
      saveChatUserResourceName_(userEmail, userName);
    } catch(e) {
      PropertiesService.getScriptProperties()
        .setProperty(CHAT_USER_MAP_PREFIX_ + userEmail, userName);
    }
  }
  return { userName, userEmail, displayName };
}

function apiTestChatBot(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  const normalizedEmail = normalizeEmail_(email);
  if (!normalizedEmail || normalizedEmail.indexOf("@") === -1) return { success: false, error: "Ung?ltige E-Mail." };
  try {
    sendPrivateMessage_(normalizedEmail, [
      "? *Translation-Services ? Connection Test*",
      "",
      "If you can read this, your Chat Bot setup is working correctly.",
      "",
      "? " + PORTAL_URL_
    ].join("\n"));
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

function normalizeEmail_(email) {
  return String(email || "").trim().toLowerCase();
}