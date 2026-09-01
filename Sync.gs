/**
 * Sync.gs
 * Smart Synchronization f?r Templates und User
 * + Notifications Sync: PROJECT_MANAGER / ADMIN ? Notifications Sheet mit OFF
 *
 * HINWEIS: apiTriggerManualSync() ist kanonisch in WebApp.js definiert
 * (inkl. 'chatmappings'). Duplikat hier entfernt ? verursachte
 * "Unknown sync type: chatmappings".
 */


/**
 * Returns true if the email belongs to an external/contractor account.
 * Excluded patterns:
 *   - *.contractor@...   e.g. max.mustermann.contractor@karcher.com
 *   - *.ext@...          e.g. max.mustermann.ext@karcher.com
 *   - *.XX@...           country-code suffix e.g. max.mustermann.de@karcher.com
 */
function isExternalUser_(email) {
  if (!email) return true;
  const e = String(email).trim().toLowerCase();
  if (!e.includes("@")) return true;
  const local = e.split("@")[0];
  if (/\.(contractor|ext)$/.test(local)) return true;  // .contractor or .ext
  if (/\.[a-z]{2}$/.test(local))         return true;  // 2-letter country code
  return false;
}

/**
 * Hilfsfunktion: Zieht den sauberen Text-Namen aus Phrase API Objekten
 */
function extractName_(data) {
  if (!data) return "";
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === "object" && item !== null) return item.name || item.uid || "";
      return String(item);
    }).filter(Boolean).join(", ");
  }
  if (typeof data === "object") return data.name || data.uid || "";
  return String(data);
}

/**
 * ----------------------------------------------------------------------
 * USER SYNC
 * Holt alle User, zieht die Deep-Details und schreibt sie ins Sheet.
 * Danach: Notifications Sync automatisch anstossen.
 * ----------------------------------------------------------------------
 */
function syncUsersSmart_(mode) {
  mode = mode || 'full';
  console.log("? Starte Sync f?r Users (mode=" + mode + ")...");

  // 1. Basis-Liste aller User aus Phrase holen (inkl. Paginierung)
  let pageNumber = 0;
  let allUsers = [];

  while (true) {
    const url = phraseApiUrlV1_(`/users?pageNumber=${pageNumber}&pageSize=50`);
    const res = phraseFetchJson_(url, {
      method: "get",
      headers: { 
        "Authorization": getPhraseAuthHeader_(),
        "Accept": "application/json"
      }
    });

    if (res && res.content && res.content.length > 0) {
      allUsers = allUsers.concat(res.content);
      if (res.content.length < 50) break;
    } else {
      break;
    }
    pageNumber++;
  }

  // 2. Irrelevante Rollen + externe User filtern
  const excludedRoles = ["PORTAL_MEMBER", "LINGUIST", "SUBMITTER", "GUEST"];
  const filteredUsers = allUsers.filter(u => {
    const role = String(u.role || "").toUpperCase();
    if (excludedRoles.includes(role)) return false;
    if (isExternalUser_(u.email))     return false;
    return true;
  });

  // 3. Full Details abrufen (Parallel-Fetch)
  const requests = filteredUsers.map(u => ({
    url: phraseApiUrlV1_(`/users/${u.uid}`),
    method: "get",
    headers: {
      "Authorization": getPhraseAuthHeader_(),
      "Accept": "application/json"
    },
    muteHttpExceptions: true
  }));

  const detailedUsers = [];
  const chunkSize = 20;
  for (let i = 0; i < requests.length; i += chunkSize) {
    const chunk = requests.slice(i, i + chunkSize);
    const responses = UrlFetchApp.fetchAll(chunk);
    responses.forEach((res, idx) => {
      const originalUser = filteredUsers[i + idx];
      if (res.getResponseCode() === 200) {
        try {
          detailedUsers.push(JSON.parse(res.getContentText()));
        } catch(e) {
          detailedUsers.push(originalUser);
        }
      } else {
        detailedUsers.push(originalUser);
      }
    });
  }

  // 4. Header
  const header = [
    "Username", "First Name", "Last Name", "Email", "Role", "Status",
    "Clients", "Domains", "Subdomains", "Business Unit",
    "Source Langs", "Target Langs", "Workflow Steps"
  ];
  const rows = [header];

  // 5. Daten mappen
  detailedUsers.forEach(u => {
    const status = u.active ? "ACTIVE" : "INACTIVE";
    rows.push([
      u.userName || "",
      u.firstName || "",
      u.lastName || "",
      u.email || "",
      u.role || "",
      status,
      extractName_(u.clients),
      extractName_(u.domains),
      extractName_(u.subDomains),
      extractName_(u.businessUnits || u.businessUnit),
      extractName_(u.sourceLangs),
      extractName_(u.targetLangs),
      extractName_(u.workflowSteps)
    ]);
  });

  // 6. In Sheet schreiben
  const ss = openAccessSS_();
  let sh = ss.getSheetByName("FetchTMS_USERS-Prod");
  if (!sh) sh = ss.insertSheet("FetchTMS_USERS-Prod");

  if (mode === 'add_only') {
    const existing = sh.getDataRange().getValues();
    const existingEmails = new Set(
      existing.slice(1).map(r => String(r[3] || "").toLowerCase().trim())
    );
    const newRows = rows.slice(1).filter(r => !existingEmails.has(String(r[3] || "").toLowerCase().trim()));
    if (existing.length === 0) sh.getRange(1, 1, 1, header.length).setValues([header]);
    if (newRows.length > 0) {
      sh.getRange(sh.getLastRow() + 1, 1, newRows.length, header.length).setValues(newRows);
    }
    const notifResult = syncNotificationsFromUsers_(detailedUsers);
    return { success: true, msg: `${newRows.length} neue User erg?nzt. Bestehende Zeilen unver?ndert. ${notifResult.msg}` };
  }

  sh.clearContents();
  if (rows.length > 0) {
    sh.getRange(1, 1, rows.length, header.length).setValues(rows);
  }

  // 7. Notifications Sync automatisch anstossen
  const notifResult = syncNotificationsFromUsers_(detailedUsers);
  console.log("? Notifications Sync: " + notifResult.msg);

  return {
    success: true,
    msg: `User Sync erfolgreich! ${rows.length - 1} User synchronisiert. ${notifResult.msg}`
  };
}

/**
 * ----------------------------------------------------------------------
 * NOTIFICATIONS SYNC
 * Tr?gt alle USER mit Rolle PROJECT_MANAGER oder ADMIN ins Sheet
 * "Notifications" ein ? falls noch nicht vorhanden, mit Wert "OFF".
 * Bestehende Eintr?ge (auch ON) werden NICHT ?berschrieben.
 *
 * Kann direkt aufgerufen werden (Admin Button) oder von syncUsersSmart_().
 * Parameter detailedUsers: optional ? wenn nicht ?bergeben, wird
 * FetchTMS_USERS-Prod Sheet gelesen.
 * ----------------------------------------------------------------------
 */
function syncNotificationsFromUsers_(detailedUsers) {
  const NOTIFICATION_ROLES = ["PROJECT_MANAGER", "ADMINISTRATOR", "ADMIN"];

  try {
    const ss = openAccessSS_();

    // Notifications Sheet sicherstellen
    let notifSh = ss.getSheetByName("Notifications");
    if (!notifSh) {
      notifSh = ss.insertSheet("Notifications");
      notifSh.appendRow(["Email", "Chat_Enabled"]);
      notifSh.getRange("A1:B1").setFontWeight("bold").setBackground("#FFED00");
      notifSh.setFrozenRows(1);
      console.log("? Notifications sheet created.");
    }

    // Bestehende Eintr?ge lesen
    const notifData   = notifSh.getDataRange().getValues();
    const existingMap = {}; // email ? row index (1-based)
    for (let i = 1; i < notifData.length; i++) {
      const email = String(notifData[i][0] || "").trim().toLowerCase();
      if (email) existingMap[email] = i + 1;
    }

    // User-Liste bestimmen
    let users = detailedUsers || [];
    if (!users.length) {
      // Aus Sheet lesen
      const userSh = ss.getSheetByName("FetchTMS_USERS-Prod");
      if (!userSh || userSh.getLastRow() < 2) {
        return { success: false, msg: "FetchTMS_USERS-Prod Sheet leer oder nicht vorhanden." };
      }
      const userData = userSh.getDataRange().getValues();
      const hdr      = userData[0].map(h => String(h).trim().toLowerCase());
      const colEmail = hdr.findIndex(h => h.includes("email"));
      const colRole  = hdr.findIndex(h => h.includes("role"));
      if (colEmail === -1 || colRole === -1) {
        return { success: false, msg: "Email oder Role Spalte nicht gefunden." };
      }
      for (let i = 1; i < userData.length; i++) {
        users.push({
          email: String(userData[i][colEmail] || "").trim().toLowerCase(),
          role:  String(userData[i][colRole]  || "").trim().toUpperCase()
        });
      }
    }

    // Neue User eintragen
    let added = 0;
    users.forEach(u => {
      const email = String(u.email || "").trim().toLowerCase();
      const role  = String(u.role  || "").trim().toUpperCase();

      if (!email || !email.includes("@")) return;
      if (isExternalUser_(email))              return;  // skip contractor/ext/country accounts
      if (!NOTIFICATION_ROLES.includes(role))  return;
      if (existingMap[email])                  return; // bereits vorhanden ? nicht ?berschreiben

      notifSh.appendRow([email, "OFF"]);
      existingMap[email] = true; // Duplikate verhindern falls User doppelt vorkommt
      added++;
      console.log("? Notifications: added " + email + " (" + role + ")");
    });

    if (added > 0) SpreadsheetApp.flush();

    const msg = added > 0
      ? `${added} neue(r) User in Notifications eingetragen (OFF).`
      : "Keine neuen User ? alle bereits vorhanden.";

    logAuditEvent_("system", "NOTIFICATIONS_SYNC", msg);
    return { success: true, msg: msg, added: added };

  } catch (e) {
    console.error("Notifications Sync Error:", e.message);
    return { success: false, msg: "Fehler: " + e.message };
  }
}

/**
 * Admin API ? manueller Notifications Sync via Button
 */
function apiSyncNotifications() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  return syncNotificationsFromUsers_();
}

/**
 * ----------------------------------------------------------------------
 * TEMPLATE SYNC
 * ----------------------------------------------------------------------
 */
function syncTemplatesSmart_(mode) {
  mode = mode || 'full';
  console.log("? Starte Smart Sync f?r Templates (mode=" + mode + ")...");

  const phraseTemplates = fetchAllTemplatesFromPhrase_();
  const tmsMap = {};
  phraseTemplates.forEach(t => { if (t.uid) tmsMap[t.uid] = t; });

  const ss = openAccessSS_();
  let sh = ss.getSheetByName("FetchTemplate-Prod");
  if (!sh) {
    sh = ss.getSheetByName("Templates");
    if (!sh) sh = ss.insertSheet("FetchTemplate-Prod");
  }

  const data = sh.getDataRange().getValues();
  let header = data.length > 0 ? data[0] : [];
  if (header.length === 0) {
    header = ["Display Name", "Template UID", "Source Lang", "Target Langs", "Active (yes/no)"];
    data.push(header);
  }

  const hLower = header.map(h => String(h).trim().toLowerCase());

  let colName   = hLower.findIndex(h => (h.includes("name") || h.includes("anzeige") || h.includes("display")) && !h.includes("phrase"));
  let colUid    = hLower.findIndex(h => h.includes("uid"));
  let colSource = hLower.findIndex(h => h.includes("source"));
  let colTarget = hLower.findIndex(h => h.includes("target"));
  let colActive = hLower.findIndex(h => h.includes("active"));
  let colClient = hLower.findIndex(h => h.includes("client"));
  let colDomain = hLower.findIndex(h => h.includes("domain") && !h.includes("sub"));
  let colSub    = hLower.findIndex(h => h.includes("subdomain"));
  let colBu     = hLower.findIndex(h => h.includes("business"));
  let colPhrase = hLower.findIndex(h => h.includes("phrase name") || h.includes("original"));

  if (colName === -1)   { colName   = header.length; header.push("Display Name"); }
  if (colUid === -1)    { colUid    = header.length; header.push("Template UID"); }
  if (colSource === -1) { colSource = header.length; header.push("Source Lang"); }
  if (colTarget === -1) { colTarget = header.length; header.push("Target Langs"); }
  if (colClient === -1) { colClient = header.length; header.push("Client"); }
  if (colDomain === -1) { colDomain = header.length; header.push("Domain"); }
  if (colSub === -1)    { colSub    = header.length; header.push("Subdomain"); }
  if (colBu === -1)     { colBu     = header.length; header.push("Business Unit"); }
  if (colActive === -1) { colActive = header.length; header.push("Active (yes/no)"); }
  if (colPhrase === -1) { colPhrase = header.length; header.push("Phrase Name (Auto-Sync)"); }

  const existingRowsMap = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const uid = row[colUid];
    if (uid) existingRowsMap[uid] = { rowIndex: i + 1, row: row };
  }

  let added = 0, updated = 0;
  const newRowsToAppend = [];
  const rowUpdates = [];

  for (const uid in tmsMap) {
    const t = tmsMap[uid];

    if (existingRowsMap[uid]) {
      if (mode === 'add_only') continue;

      const row = existingRowsMap[uid].row.slice();
      while (row.length < header.length) row.push("");
      if (!row[colName] || String(row[colName]).trim() === "") row[colName] = t.name || t.templateName || "";
      row[colPhrase] = t.name || t.templateName || "";
      row[colSource] = t.sourceLang || "";
      row[colTarget] = (t.targetLangs || []).join(", ");
      row[colClient] = extractName_(t.client);
      row[colDomain] = extractName_(t.domain);
      row[colSub]    = extractName_(t.subDomain);
      row[colBu]     = extractName_(t.businessUnit);
      rowUpdates.push({ rowIndex: existingRowsMap[uid].rowIndex, values: row });
      updated++;
    } else {
      const row = new Array(header.length).fill("");
      row[colUid]    = uid;
      row[colActive] = "yes";
      row[colName]   = t.name || t.templateName || "";
      row[colPhrase] = t.name || t.templateName || "";
      row[colSource] = t.sourceLang || "";
      row[colTarget] = (t.targetLangs || []).join(", ");
      row[colClient] = extractName_(t.client);
      row[colDomain] = extractName_(t.domain);
      row[colSub]    = extractName_(t.subDomain);
      row[colBu]     = extractName_(t.businessUnit);
      newRowsToAppend.push(row);
      added++;
    }
  }

  sh.getRange(1, 1, 1, header.length).setValues([header]);
  rowUpdates.forEach(u => sh.getRange(u.rowIndex, 1, 1, header.length).setValues([u.values]));
  if (newRowsToAppend.length > 0) {
    sh.getRange(sh.getLastRow() + 1, 1, newRowsToAppend.length, header.length).setValues(newRowsToAppend);
  }

  const msg = mode === 'add_only'
    ? `${added} neue Templates erg?nzt. Bestehende Zeilen wurden nicht ver?ndert.`
    : `${added} neue Templates erg?nzt, ${updated} bestehende aktualisiert.`;
  return { success: true, msg: msg };
}

function fetchAllTemplatesFromPhrase_() {
  let pageNumber = 0;
  let allTemplates = [];

  while (true) {
    const url = phraseApiUrlV1_(`/projectTemplates?pageNumber=${pageNumber}&pageSize=50`);
    const res = phraseFetchJson_(url, {
      method: "get",
      headers: { 
        "Authorization": getPhraseAuthHeader_(),
        "Accept": "application/json"
      }
    });

    if (res && res.content && res.content.length > 0) {
      allTemplates = allTemplates.concat(res.content);
      if (res.content.length < 50) break;
    } else {
      break;
    }
    pageNumber++;
  }

  return allTemplates;
}