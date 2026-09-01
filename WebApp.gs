function doGet(e) {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Translation-Services")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1");
}

function apiGetConfig(impersonateEmail) {
  return getConfig_(impersonateEmail);
}

function apiHandleUpload(payload) {
  payload = payload || {};

  ensurePhraseTokenAliases_();

  if (
    (!payload.mainFiles || !Array.isArray(payload.mainFiles) || payload.mainFiles.length === 0) &&
    Array.isArray(payload.allMainFiles) && payload.allMainFiles.length > 0
  ) {
    payload.mainFiles = payload.allMainFiles;
  }

  if (!payload.mainFiles || !Array.isArray(payload.mainFiles) || payload.mainFiles.length === 0) {
    const candidates = [
      payload.files, payload.mainFile, payload.main_files,
      payload.uploadFiles, payload.main_documents
    ];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length) { payload.mainFiles = c; break; }
      if (c && typeof c === "object")   { payload.mainFiles = [c]; break; }
    }
  }

  if (!payload.refFiles || !Array.isArray(payload.refFiles)) {
    const rc = payload.referenceFiles || payload.refs || payload.ref_files;
    if (Array.isArray(rc))             payload.refFiles = rc;
    else if (rc && typeof rc === "object") payload.refFiles = [rc];
    else payload.refFiles = payload.refFiles || [];
  }

  if (Array.isArray(payload.targetLangs) && payload.targetLangs.length && !payload.targetLang) {
    payload.targetLang = payload.targetLangs[0];
  }
  if (Array.isArray(payload.targets) && payload.targets.length && !payload.targetLang) {
    payload.targetLang = payload.targets[0];
  }

  return apiCreateProjectAndUpload(payload);
}

/* ==========================================================================
   HISTORY + DASHBOARD APIs
   ========================================================================== */

function apiGetMyProjects() {
  const ctx  = getUserContext_();
  const rows = readQueueRows_();

  const filtered = rows.filter(r => {
    if (ctx.isAdmin) return true;
    if (r.userEmail && r.userEmail.toLowerCase() === ctx.userEmail) return true;
    if (r.sharedWith && typeof r.sharedWith === "string") {
      const parts = r.sharedWith.split(/[;,]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
      if (parts.includes(ctx.userEmail)) return true;
    }
    return false;
  });

  filtered.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return tb - ta;
  });

  return { projects: filtered, email: ctx.userEmail };
}

function apiGetDashboardData() {
  const projects = apiGetMyProjects().projects;
  const now = new Date();

  let totalProjects = projects.length, completed = 0, overdue = 0, active = 0;
  const templateCount = {};

  projects.forEach(p => {
    const status     = String(p.status || "").toUpperCase();
    const isDone     = ["COMPLETED","DELIVERED","DONE","FINISHED"].includes(status);
    const isCancelled = ["CANCELLED","CANCELED"].includes(status);

    let due = null;
    if (p.dueDate) { const d = new Date(p.dueDate); if (!isNaN(d)) due = d; }

    if (isDone) {
      if (!due || due >= now) completed++; else overdue++;
    } else if (!isCancelled) {
      active++;
      if (due && due < now) overdue++;
    }

    const tpl = (p.templateName || p.projectName || "Unknown").toString().trim();
    templateCount[tpl] = (templateCount[tpl] || 0) + 1;
  });

  const topTemplates = Object.keys(templateCount)
    .map(name => ({ name, count: templateCount[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { totalProjects, completed, overdue, active, topTemplates };
}

/* ==========================================================================
   ADMIN APIs
   ========================================================================== */

function apiGetAdminDashboardData() { return getAdminDashboardData_(); }

function apiSaveAdminSettings(sizeLimitMb) {
  const mb = Number(sizeLimitMb);
  if (!isFinite(mb) || mb <= 0) throw new Error("Invalid sizeLimitMb");
  PropertiesService.getScriptProperties().setProperty("MAX_FILE_SIZE_MB", String(mb));
  return { success: true };
}

function apiSaveMaintenanceConfig(startIso, endIso, message) {
  const caller = getUserEmail_();
  const props = PropertiesService.getScriptProperties();
  props.setProperty("MAINT_START", String(startIso || ""));
  props.setProperty("MAINT_END",   String(endIso  || ""));
  props.setProperty("MAINT_MSG",   String(message  || ""));
  logAuditEvent_(caller, "MAINT_ON", "Maintenance activated: " + startIso + " to " + endIso);
  return { success: true };
}

function apiClearMaintenanceConfig() {
  const caller = getUserEmail_();
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty("MAINT_START");
  props.deleteProperty("MAINT_END");
  props.deleteProperty("MAINT_MSG");
  logAuditEvent_(caller, "MAINT_OFF", "Maintenance deactivated");
  return { success: true };
}

function apiAddAdmin(emailToAdd) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) return { success: false, error: "Invalid email." };
  const props = PropertiesService.getScriptProperties();
  const current = (props.getProperty("ADMIN_EMAILS") || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!current.includes(add)) {
    current.push(add);
    props.setProperty("ADMIN_EMAILS", current.join(","));
  }
  logAuditEvent_(caller, "ADMIN_ADD", "Added admin: " + add);
  return { success: true };
}

function apiRemoveAdmin(emailToRemove) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  const rem = String(emailToRemove || "").trim().toLowerCase();
  const props = PropertiesService.getScriptProperties();
  const current = (props.getProperty("ADMIN_EMAILS") || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  props.setProperty("ADMIN_EMAILS", current.filter(e => e !== rem).join(","));
  logAuditEvent_(caller, "ADMIN_REMOVE", "Removed admin: " + rem);
  return { success: true };
}

/* ==========================================================================
   SHARE PROJECT
   ========================================================================== */

function apiShareProject(projectUid, shareWithEmail) {
  var caller = getUserEmail_().toLowerCase();
  var share  = String(shareWithEmail || "").trim().toLowerCase();
  if (!share || !share.includes("@")) return { success: false, error: "Invalid email." };

  try {
    var sh   = getQueueSheet_();
    var data = sh.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() !== projectUid) continue;

      var owner = String(data[i][1]).toLowerCase().trim();
      if (!isAdmin_(caller) && owner !== caller) return { success: false, error: "Not authorized." };

      var current = String(data[i][17] || "").trim();
      var parts   = current ? current.split(",").map(function(s) { return s.trim(); }).filter(Boolean) : [];
      if (!parts.includes(share)) parts.push(share);
      sh.getRange(i + 1, 18).setValue(parts.join(","));

      var projectName   = String(data[i][11] || data[i][4] || projectUid).trim();
      var phraseUrl     = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
      var threadMsgName = String(data[i][19] || "").trim();

      var sharedUserThreadId = "";
      try {
        var shareMsg = fillTemplate_(getMessageTemplate_("MSG_SHARED", "en"), {
          PROJECT_NAME: projectName,
          PHRASE_ID:    projectUid,
          SHARED_BY:    caller,
          PHRASE_URL:   phraseUrl
        });
        var chatResponse = sendPrivateMessage_(share, shareMsg);
        if (chatResponse && chatResponse.name) {
          sharedUserThreadId = chatResponse.name;
        }
      } catch(chatErr) {
        console.warn("Share Chat notification failed for " + share + ": " + chatErr.message);
      }

      var existingThreads = {};
      try {
        var raw = String(data[i][20] || "").trim();
        if (raw) existingThreads = JSON.parse(raw);
      } catch(e) {}

      if (sharedUserThreadId) {
        existingThreads[share] = sharedUserThreadId;
        sh.getRange(i + 1, 21).setValue(JSON.stringify(existingThreads));
      }

      if (threadMsgName) {
        try {
          var confirmMsg = fillTemplate_(getMessageTemplate_("MSG_SHARE_CONFIRM", "en"), {
            SHARED_BY: share
          });
          sendThreadReply_(owner, threadMsgName, confirmMsg);
        } catch(e) {
          console.warn("Owner thread reply failed: " + e.message);
        }
      }

      logAuditEvent_(caller, "PROJECT_SHARE", "Shared '" + projectName + "' (" + projectUid + ") with " + share);
      return { success: true };
    }

    return { success: false, error: "Project not found." };

  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* ==========================================================================
   CANCEL PROJECT
   ========================================================================== */

function apiCancelProject(projectUid) {
  const caller = getUserEmail_().toLowerCase();
  const isAdm  = isAdmin_(caller);
  try {
    const sh   = getQueueSheet_();
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() !== projectUid) continue;
      const owner      = String(data[i][1]).toLowerCase().trim();
      if (!isAdm && owner !== caller) return { success: false, error: "Not authorized." };

      sh.getRange(i + 1, 8).setValue("CANCELLED");

      const projectName   = String(data[i][11] || data[i][4] || projectUid).trim();
      const phraseUrl     = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
      const threadId      = String(data[i][19] || "").trim();
      const sharedWith    = String(data[i][17] || "").trim();
      const sharedThreads = _parseSharedThreads_(String(data[i][20] || "").trim());

      const cancelMsg = fillTemplate_(getMessageTemplate_("MSG_CANCELLED", "en"), {
        PROJECT_NAME: projectName,
        PHRASE_ID:    projectUid,
        UPDATED_BY:   caller,
        PHRASE_URL:   phraseUrl
      });

      if (threadId) {
        try { sendThreadReply_(owner, threadId, cancelMsg); } catch(e) {
          console.warn("Cancel notify owner failed:", e.message);
        }
      }

      _notifySharedUsers_(sharedWith, sharedThreads, cancelMsg);

      sh.getRange(i + 1, 20).setValue("");
      sh.getRange(i + 1, 21).setValue("");

      logAuditEvent_(caller, "PROJECT_CANCEL", "Cancelled project: " + projectUid);
      return { success: true };
    }
    return { success: false, error: "Project not found." };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function apiTriggerManualSync(type, mode) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Admin only." };
  mode = (mode === 'add_only') ? 'add_only' : 'full';
  try {
    if (type === "templates")     { return syncTemplatesSmart_(mode); }
    if (type === "users")         { return syncUsersSmart_(mode); }
    if (type === "notifications") { return syncNotificationsFromUsers_(); }
    if (type === "chatmappings")  { return apiResolveChatMappings(); }
    return { success: false, error: "Unknown sync type: " + type };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* ==========================================================================
   STATUS SYNC
   ========================================================================== */

function apiSyncProjectStatuses() {
  const caller = getUserEmail_().toLowerCase();
  const isAdm  = isAdmin_(caller);
  const terminalStatuses   = ["COMPLETED","DELIVERED","CANCELLED","CANCELED","REJECTED"];
  const completionStatuses = ["COMPLETED","DELIVERED","NOTIFIED"];

  try {
    const sh   = getQueueSheet_();
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return { success: true, updated: 0, message: "No rows to sync." };

    let updated = 0;
    const props = PropertiesService.getScriptProperties();

    for (let i = 1; i < data.length; i++) {
      const row           = data[i];
      const projectUid    = String(row[2] || "").trim();
      const rowUser       = String(row[1] || "").toLowerCase().trim();
      const currentStatus = String(row[7] || "").trim().toUpperCase();
      const threadMsgName = String(row[19] || "").trim();
      const sharedWith    = String(row[17] || "").trim();
      const sharedThreads = _parseSharedThreads_(String(row[20] || "").trim());

      if (!projectUid)                              continue;
      if (terminalStatuses.includes(currentStatus)) continue;
      if (!isAdm && rowUser !== caller)             continue;

      try {
        const url    = phraseApiUrlV1_(`/projects/${encodeURIComponent(projectUid)}`);
        const result = phraseFetchJson_(url, {
          method:  "get",
          headers: { Authorization: getPhraseAuthHeader_() }
        });

        const newStatus = result && result.status ? String(result.status).toUpperCase() : "";
        if (!newStatus || newStatus === currentStatus) continue;

        sh.getRange(i + 1, 8).setValue(newStatus);
        updated++;

        const notifiedKey = "CHAT_NOTIFIED__" + projectUid;
        const alreadyNotified = props.getProperty(notifiedKey) === "true";

        if (completionStatuses.includes(newStatus) && !completionStatuses.includes(currentStatus) && !alreadyNotified) {
          const projectName = String(row[11] || row[4] || projectUid).trim();
          const phraseUrl   = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

          const replyText = fillTemplate_(getMessageTemplate_("MSG_COMPLETED", "en"), {
            PROJECT_NAME: projectName,
            PHRASE_ID:    projectUid,
            STATUS:       newStatus,
            PHRASE_URL:   phraseUrl
          });

          if (threadMsgName) {
            try { sendThreadReply_(rowUser, threadMsgName, replyText); } catch(e) {
              console.warn("Thread reply failed for " + projectUid + ": " + e.message);
            }
          }

          _notifySharedUsers_(sharedWith, sharedThreads, replyText);

          props.setProperty(notifiedKey, "true");
          sh.getRange(i + 1, 20).setValue("");
          sh.getRange(i + 1, 21).setValue("");
        }

        if (["CANCELLED","CANCELED","REJECTED"].includes(newStatus)) {
          sh.getRange(i + 1, 20).setValue("");
          sh.getRange(i + 1, 21).setValue("");
        }

      } catch(e) {
        console.warn(`Status sync skipped for ${projectUid}:`, e.message);
      }
    }

    if (updated > 0) SpreadsheetApp.flush();
    return { success: true, updated, message: `${updated} project(s) updated.` };

  } catch(e) {
    return { success: false, error: e.message };
  }
}

/* ==========================================================================
   MARKETING WHITELIST APIs
   ========================================================================== */

function apiAddMarketingWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const add = String(email || "").trim().toLowerCase();
    if (!add || !add.includes("@")) return { success: false, error: "Invalid email." };
    const ss = openAccessSS_();
    let sh = ss.getSheetByName("Whitelist_Marketing");
    if (!sh) { sh = ss.insertSheet("Whitelist_Marketing"); sh.appendRow(["Email"]); }
    const existing = apiGetMarketingWhitelist().emails;
    if (!existing.includes(add)) {
      sh.appendRow([add]);
      logAuditEvent_(currentUser, "WHITELIST_ADD", "Added to Marketing Whitelist: " + add);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiRemoveMarketingWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const rem = String(email || "").trim().toLowerCase();
    if (!rem) return { success: true };
    const ss = openAccessSS_();
    const sh = ss.getSheetByName("Whitelist_Marketing");
    if (!sh) return { success: true };
    const rows = sh.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
        sh.deleteRow(i + 1);
        logAuditEvent_(currentUser, "WHITELIST_REMOVE", "Removed from Marketing Whitelist: " + rem);
      }
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiGetMarketingWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Marketing");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  const emails = [];
  for (let i = 1; i < rows.length; i++) {
    const v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails };
}

/* ==========================================================================
   KEC WHITELIST APIs
   ========================================================================== */

function apiAddKeCWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const add = String(email || "").trim().toLowerCase();
    if (!add || !add.includes("@")) return { success: false, error: "Invalid email." };
    const ss = openAccessSS_();
    let sh = ss.getSheetByName("Whitelist_KeC");
    if (!sh) { sh = ss.insertSheet("Whitelist_KeC"); sh.appendRow(["Email"]); }
    const existing = apiGetKeCWhitelist().emails;
    if (!existing.includes(add)) {
      sh.appendRow([add]);
      logAuditEvent_(currentUser, "WHITELIST_ADD", "Added to KeC Whitelist: " + add);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiRemoveKeCWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const rem = String(email || "").trim().toLowerCase();
    if (!rem) return { success: true };
    const ss = openAccessSS_();
    const sh = ss.getSheetByName("Whitelist_KeC");
    if (!sh) return { success: true };
    const rows = sh.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
        sh.deleteRow(i + 1);
        logAuditEvent_(currentUser, "WHITELIST_REMOVE", "Removed from KeC Whitelist: " + rem);
      }
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiGetKeCWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_KeC");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  const emails = [];
  for (let i = 1; i < rows.length; i++) {
    const v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails };
}

/* ==========================================================================
   DOCUMENTATION WHITELIST APIs
   ========================================================================== */

function apiAddDocWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const add = String(email || "").trim().toLowerCase();
    if (!add || !add.includes("@")) return { success: false, error: "Invalid email." };
    const ss = openAccessSS_();
    let sh = ss.getSheetByName("Whitelist_Documentation");
    if (!sh) { sh = ss.insertSheet("Whitelist_Documentation"); sh.appendRow(["Email"]); }
    const existing = apiGetDocWhitelist().emails;
    if (!existing.includes(add)) {
      sh.appendRow([add]);
      logAuditEvent_(currentUser, "WHITELIST_ADD", "Added to Documentation Whitelist: " + add);
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiRemoveDocWhitelist(email) {
  const currentUser = getUserEmail_();
  if (!isAdmin_(currentUser)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const rem = String(email || "").trim().toLowerCase();
    if (!rem) return { success: true };
    const ss = openAccessSS_();
    const sh = ss.getSheetByName("Whitelist_Documentation");
    if (!sh) return { success: true };
    const rows = sh.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
        sh.deleteRow(i + 1);
        logAuditEvent_(currentUser, "WHITELIST_REMOVE", "Removed from Documentation Whitelist: " + rem);
      }
    }
    return { success: true };
  } catch (e) { return { success: false, error: e.message || String(e) }; }
}

function apiGetDocWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Documentation");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  const emails = [];
  for (let i = 1; i < rows.length; i++) {
    const v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails };
}

/* ==========================================================================
   HEALTH CHECK
   ========================================================================== */

function apiHealthCheck() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { authorized: false };

  const checks = [];

  try {
    const token = String(PropertiesService.getScriptProperties().getProperty("PHRASE_API_TOKEN") || "").trim();
    checks.push({ name: "Phrase API Token", status: token.length > 10 ? "ok" : "error", message: token ? `Set (${token.length} chars)` : "? PHRASE_API_TOKEN not set!" });
  } catch(e) { checks.push({ name: "Phrase API Token", status: "error", message: e.message }); }

  try {
    const url = getPhraseWebBaseUrl_() + "/api2/v1/projects?pageSize=1";
    const res = UrlFetchApp.fetch(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() }, muteHttpExceptions: true });
    const code = res.getResponseCode();
    checks.push({ name: "Phrase Connectivity", status: code < 400 ? "ok" : "error", message: code < 400 ? `Connected (HTTP ${code}) ?` : `Error HTTP ${code}` });
  } catch(e) { checks.push({ name: "Phrase Connectivity", status: "error", message: e.message }); }

  try {
    const id = PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID");
    if (!id) throw new Error("ACCESS_SHEET_ID not set");
    const ss = SpreadsheetApp.openById(id);
    const sh = ss.getSheetByName("FetchTemplate-Prod");
    const count = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
    checks.push({ name: "Access Sheet", status: sh ? "ok" : "error", message: sh ? `FetchTemplate-Prod: ${count} templates` : "? FetchTemplate-Prod not found!" });
  } catch(e) { checks.push({ name: "Access Sheet", status: "error", message: e.message }); }

  try {
    const id = PropertiesService.getScriptProperties().getProperty("OPS_SHEET_ID");
    if (!id) throw new Error("OPS_SHEET_ID not set");
    const ss = SpreadsheetApp.openById(id);
    const sh = ss.getSheetByName("Queue");
    const count = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
    checks.push({ name: "OPS Sheet", status: sh ? "ok" : "error", message: sh ? `Queue: ${count} entries` : "? Queue sheet not found!" });
  } catch(e) { checks.push({ name: "OPS Sheet", status: "error", message: e.message }); }

  const admins = (PropertiesService.getScriptProperties().getProperty("ADMIN_EMAILS") || "").split(",").map(s => s.trim()).filter(Boolean);
  checks.push({ name: "Admin Config", status: admins.length > 0 ? "ok" : "warning", message: `${admins.length} admin(s) configured` });

  const chatEmail = PropertiesService.getScriptProperties().getProperty("CHAT_CLIENT_EMAIL") || "";
  const chatKey   = PropertiesService.getScriptProperties().getProperty("CHAT_PRIVATE_KEY")  || "";
  checks.push({ name: "Chat Bot", status: (chatEmail && chatKey) ? "ok" : "warning", message: chatEmail ? `Configured (${chatEmail})` : "Not configured (optional)" });

  return { authorized: true, checks: checks, timestamp: new Date().toISOString() };
}

/* ==========================================================================
   CHAT NOTIFICATION PREFERENCES
   ========================================================================== */

function getUserChatPreference_(email) {
  if (!email) return true;
  try {
    const ss = openAccessSS_();
    const sh = ss.getSheetByName("Notifications");
    if (sh) {
      const data = sh.getDataRange().getValues();
      const searchEmail = String(email).trim().toLowerCase();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim().toLowerCase() === searchEmail) {
          const pref = String(data[i][1]).trim().toUpperCase();
          return (pref !== "OFF" && pref !== "FALSE");
        }
      }
    }
  } catch (e) {
    console.warn("Fehler beim Lesen der Chat Preferences aus dem Sheet:", e);
  }

  const prefKey = "CHAT_PREF_ON__" + String(email).trim().toLowerCase();
  const fromProps = PropertiesService.getScriptProperties().getProperty(prefKey);
  if (fromProps === "true") return true;

  return true; // Default: ON
}

function apiGetChatPreference() {
  const email = getUserEmail_();
  return { enabled: getUserChatPreference_(email) };
}

function apiSetChatPreference(enabled) {
  const email = getUserEmail_();
  if (!email) throw new Error("No user email found.");

  const ss = openAccessSS_();
  let sh = ss.getSheetByName("Notifications");

  if (!sh) {
    sh = ss.insertSheet("Notifications");
    sh.appendRow(["Email", "Chat_Enabled"]);
    sh.getRange("A1:B1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }

  const data = sh.getDataRange().getValues();
  const searchEmail = String(email).trim().toLowerCase();
  const prefValue = enabled ? "ON" : "OFF";
  let found = false;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === searchEmail) {
      sh.getRange(i + 1, 2).setValue(prefValue);
      found = true;
      break;
    }
  }

  if (!found) {
    sh.appendRow([searchEmail, prefValue]);
  }

  return { success: true, enabled: !!enabled };
}

/* ==========================================================================
   DUE DATE UPDATE
   ========================================================================== */

function apiUpdateDueDate(projectUid, newDateIso) {
  const caller = getUserEmail_().toLowerCase();

  if (!projectUid) return { success: false, error: "Project UID missing." };
  if (!newDateIso) return { success: false, error: "New date missing." };

  let isoDate;
  try {
    const d = new Date(newDateIso);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    d.setHours(12, 0, 0, 0);
    isoDate = d.toISOString();
  } catch(e) {
    return { success: false, error: "Invalid date format: " + newDateIso };
  }

  try {
    const sh   = getQueueSheet_();
    const data = sh.getDataRange().getValues();
    let rowIdx = -1, owner = "", projectName = "", threadId = "", sharedWith = "";

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() !== projectUid) continue;
      owner       = String(data[i][1]).toLowerCase().trim();
      sharedWith  = String(data[i][17] || "").toLowerCase();
      projectName = String(data[i][11] || data[i][4] || projectUid).trim();
      threadId    = String(data[i][19] || "").trim();
      rowIdx      = i;
      break;
    }

    if (rowIdx === -1) return { success: false, error: "Project not found." };

    const isOwner  = owner === caller;
    const isShared = sharedWith.split(/[,;]+/).map(s => s.trim()).includes(caller);
    if (!isAdmin_(caller) && !isOwner && !isShared) {
      return { success: false, error: "Not authorized." };
    }

    sh.getRange(rowIdx + 1, 13).setValue(isoDate);

    let phraseWarning = null;
    try {
      const phraseUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
      const phraseRes = UrlFetchApp.fetch(phraseUrl, {
        method:      "patch",
        contentType: "application/json",
        headers:     { Authorization: getPhraseAuthHeader_() },
        payload:     JSON.stringify({ dateDue: isoDate }),
        muteHttpExceptions: true
      });
      const code = phraseRes.getResponseCode();
      if (code >= 400) {
        phraseWarning = "Phrase update failed (HTTP " + code + "): " + phraseRes.getContentText().substring(0, 200);
      }
    } catch(phraseErr) {
      phraseWarning = "Phrase unreachable: " + phraseErr.message;
    }

    const formattedDate = new Date(isoDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    });
    const phraseProjectUrl = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

    const chatMsg = fillTemplate_(getMessageTemplate_("MSG_DUE_DATE_UPDATED", "en"), {
      PROJECT_NAME: projectName,
      PHRASE_ID:    projectUid,
      NEW_DATE:     formattedDate,
      UPDATED_BY:   caller,
      PHRASE_URL:   phraseProjectUrl
    });

    if (threadId) {
      try { sendThreadReply_(owner, threadId, chatMsg); } catch(e) {
        console.warn("Due date chat thread reply failed:", e.message);
        try { sendPrivateMessage_(owner, chatMsg); } catch(e2) {}
      }
    } else {
      try { sendPrivateMessage_(owner, chatMsg); } catch(e) {
        console.warn("Due date chat DM to owner failed:", e.message);
      }
    }

    const sharedThreads = _parseSharedThreads_(String(data[rowIdx][20] || "").trim());
    _notifySharedUsers_(sharedWith, sharedThreads, chatMsg, caller);

    logAuditEvent_(caller, "DUE_DATE_UPDATE",
      "Updated due date for '" + projectName + "' (" + projectUid + ") ? " + formattedDate);

    return { success: true, newDate: isoDate, formattedDate, phraseWarning: phraseWarning || null };

  } catch(e) {
    console.error("? apiUpdateDueDate failed:", e.message);
    return { success: false, error: e.message };
  }
}

/* ==========================================================================
   INTERNAL HELPERS
   ========================================================================== */

function getUserContext_() {
  const userEmailRaw = Session.getActiveUser().getEmail() || "";
  const userEmail    = userEmailRaw.trim().toLowerCase();
  const adminStr     = String(PropertiesService.getScriptProperties().getProperty("ADMIN_EMAILS") || "");
  const admins       = adminStr.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const isAdmin      = admins.includes(userEmail);
  return { userEmail, isAdmin };
}

function openAccessSS_() {
  const id = String(PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID") || "").trim();
  if (!id) throw new Error("ACCESS_SHEET_ID fehlt in Script Properties.");
  return SpreadsheetApp.openById(id);
}

function readQueueRows_() {
  const ss = openOpsSpreadsheet_();
  const sh = ss.getSheetByName("Queue");
  if (!sh) throw new Error("OPS Sheet: 'Queue' nicht gefunden.");

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  const header = values[0].map(h => String(h || "").trim());
  const idx    = {};
  header.forEach((h, i) => { if (h) idx[h.toLowerCase()] = i; });

  const pick = (row, headerNames, fallbackIndex) => {
    for (const name of headerNames) {
      const k = name.toLowerCase();
      if (idx.hasOwnProperty(k)) return row[idx[k]];
    }
    if (typeof fallbackIndex === "number") return row[fallbackIndex];
    return "";
  };

  const rows = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (!row || row.join("").trim() === "") continue;

    const timestamp   = pick(row, ["timestamp","upload date","uploaddate","created","datecreated"], 0);
    const userEmail   = pick(row, ["user","useremail","requester","email"], 1);
    const projectUid  = pick(row, ["projectuid","project uid","phrase project uid"], 2);
    const fileName    = pick(row, ["filename","file","sourcefile"], 4);
    const mimeType    = pick(row, ["mimetype","mime","contenttype"], 5);
    const targetLang  = pick(row, ["targetlang","target lang","target"], 6);
    const status      = pick(row, ["status"], 7);
    const jobUid      = pick(row, ["jobuid","job uid"], 8);
    const projectName = pick(row, ["projectname","project name","name"], 11);
    const dueDate     = pick(row, ["duedate","due date","deadline"], 12);
    const sharedWith  = pick(row, ["sharedwith","shared with","shared"], 17);
    const templateName = pick(row, ["templatename","template name","template"], null);

    const jobMappingRaw = pick(row, ["jobmapping"], 20);
    const jobMapping = (() => {
      const raw = String(jobMappingRaw || "").trim();
      if (!raw) return [];
      try { return JSON.parse(raw); } catch(e) { return []; }
    })();

    const tsDate     = (timestamp instanceof Date) ? timestamp : (timestamp ? new Date(timestamp) : null);
    const uploadDate = (tsDate && !isNaN(tsDate.getTime()))
      ? Utilities.formatDate(tsDate, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm")
      : (timestamp ? String(timestamp) : "");

    const jobUids = (() => {
      const raw = String(jobUid || "").trim();
      if (!raw) return [];
      if (raw[0] === "[") { try { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr.map(x => String(x||"").trim()).filter(Boolean); } catch(e){} }
      if (raw.includes(",") || raw.includes(";")) return raw.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      return [raw];
    })();

    const targetLangs = (() => {
      const raw = String(targetLang || "").trim();
      if (!raw) return [];
      if (raw.includes(",") || raw.includes(";")) return raw.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      return [raw];
    })();

    const projectUidStr = String(projectUid || "").trim();
    const phraseUrl = projectUidStr ? `https://cloud.memsource.com/web/project/show/${encodeURIComponent(projectUidStr)}` : "";

    rows.push({
      timestamp:    tsDate && !isNaN(tsDate.getTime()) ? tsDate.toISOString() : (timestamp || ""),
      uploadDate:   uploadDate || "",
      userEmail:    String(userEmail || ""),
      owner:        String(userEmail || "").toLowerCase().trim(),
      isShared:     !!String(sharedWith || "").trim(),
      phraseUrl,
      projectUid:   projectUidStr,
      jobUid:       String(jobUid || ""),
      jobUids,
      targetLangs,
      projectName:  String(projectName || fileName || ""),
      templateName: String(templateName || ""),
      fileName:     String(fileName || ""),
      mimeType:     String(mimeType || ""),
      sourceLang:   "From Template",
      targetLang:   String(targetLang || ""),
      status:       String(status || ""),
      dueDate:      dueDate || "",
      sharedWith:   String(sharedWith || "").trim(),
      jobMapping:   jobMapping
    });
  }

  return rows;
}

function openOpsSpreadsheet_() {
  const id = String(PropertiesService.getScriptProperties().getProperty("OPS_SHEET_ID") || "").trim();
  if (!id) throw new Error("OPS_SHEET_ID fehlt in Script Properties.");
  return SpreadsheetApp.openById(id);
}

function ensurePhraseTokenAliases_() {
  const props = PropertiesService.getScriptProperties();
  const token = String(props.getProperty("PHRASE_API_TOKEN") || "").trim();
  if (!token) throw new Error("PHRASE_API_TOKEN fehlt in Script Properties.");
  ["PHRASE_TOKEN","MEMSOURCE_API_TOKEN","API_TOKEN","TOKEN","PHRASE_APIKEY","PHRASE_API_KEY"].forEach(k => {
    if (!String(props.getProperty(k) || "").trim()) props.setProperty(k, token);
  });
}

function _parseSharedThreads_(raw) {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch(e) { return {}; }
}

function _notifySharedUsers_(sharedWithStr, sharedThreads, message, skipEmail) {
  if (!sharedWithStr) return;
  const skip = skipEmail ? skipEmail.toLowerCase() : null;
  sharedWithStr.split(/[,;]+/).map(s => s.trim().toLowerCase()).filter(Boolean).forEach(email => {
    if (skip && email === skip) return;
    try {
      const threadId = sharedThreads && sharedThreads[email];
      if (threadId) {
        sendThreadReply_(email, threadId, message);
      } else {
        sendPrivateMessage_(email, message);
      }
    } catch(e) {
      console.warn("Notify shared user failed for " + email + ": " + e.message);
    }
  });
}

function getQueueSheet_() {
  return openOpsSpreadsheet_().getSheetByName("Queue");
}

function openOpsSS_() {
  return openOpsSpreadsheet_();
}

function getDynamicWhitelist_(pageId) {
  try {
    const ss = openAccessSS_();
    const sh = ss.getSheetByName("Whitelist_" + String(pageId || ""));
    if (!sh) return [];
    const rows = sh.getDataRange().getValues();
    const emails = [];
    for (let i = 1; i < rows.length; i++) {
      const v = String(rows[i][0] || "").trim().toLowerCase();
      if (v) emails.push(v);
    }
    return emails;
  } catch(e) {
    console.warn("getDynamicWhitelist_ failed for pageId=" + pageId + ": " + e.message);
    return [];
  }
}