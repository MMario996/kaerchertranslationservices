/**
 * Sheets.gs
 * Sheet-Zugriffe f?r Templates und Projekte.
 *
 * HINWEIS: openOpsSS_(), openAccessSS_(), getQueueSheet_() sind kanonisch
 * in WebApp.js / AutoSync.js definiert. Duplikate hier entfernt.
 */

function apiGetTemplates() {
  const ss = openAccessSS_();
  const sh =
    ss.getSheetByName("FetchTemplate-Prod") ||
    ss.getSheetByName("Templates") ||
    ss.getSheetByName("FetchTemplate-Test");

  if (!sh) return { templates: [], note: "No template sheet found." };

  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return { templates: [], note: "Template sheet empty." };

  const header = rows[0].map(h => String(h || "").trim());
  const idx = {};
  header.forEach((h, i) => idx[h.toLowerCase()] = i);

  const colUid     = idx["template uid"] ?? idx["templateuid"] ?? idx["uid"];
  const colName    = idx["template name"] ?? idx["templatename"] ?? idx["name"];
  const colSource  = idx["source"] ?? idx["source lang"] ?? idx["sourcelang"] ?? idx["source language"];
  const colTargets = idx["targets"] ?? idx["target langs"] ?? idx["targetlang"] ?? idx["target languages"];

  const templates = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const uid  = colUid  != null ? String(r[colUid]  || "").trim() : "";
    const name = colName != null ? String(r[colName] || "").trim() : uid;
    if (!uid) continue;

    const source     = colSource  != null ? String(r[colSource]  || "").trim() : "";
    const targetsRaw = colTargets != null ? String(r[colTargets] || "").trim() : "";
    const targets    = targetsRaw ? targetsRaw.split(/[,;]/).map(s => s.trim()).filter(Boolean) : [];

    templates.push({ uid, name, source, targets });
  }

  templates.sort((a, b) => a.name.localeCompare(b.name));
  return { templates };
}

/** API: list projects for MY PROJECTS */
function apiListMyProjects() {
  const user  = getUserEmail_().toLowerCase();
  const admin = isAdmin_(user);

  const sh   = getQueueSheet_();
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return { rows: [] };

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];

    const uploadTs   = r[0] || "";
    const userEmail  = String(r[1]  || "").toLowerCase().trim();
    const projectUid = String(r[2]  || "").trim();
    const fileName   = String(r[4]  || "").trim();
    const mime       = String(r[5]  || "").trim();
    const targetRaw  = String(r[6]  || "").trim();
    const status     = String(r[7]  || "").trim();
    const jobUidRaw  = String(r[8]  || "").trim();
    const projectName = String(r[11] || "").trim();
    const dueDate    = r[12] ? String(r[12]) : "";
    const sharedWith = String(r[17] || "").trim();

    if (!admin) {
      const isOwner  = userEmail === user;
      const isShared = sharedWith.toLowerCase().includes(user);
      if (!isOwner && !isShared) continue;
    }

    const targetLangs = targetRaw
      ? targetRaw.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    let jobUids = [];
    if (jobUidRaw) {
      try {
        const parsed = JSON.parse(jobUidRaw);
        if (Array.isArray(parsed)) jobUids = parsed.map(x => String(x || "").trim()).filter(Boolean);
        else if (parsed) jobUids = [String(parsed).trim()];
      } catch (e) {
        jobUids = jobUidRaw.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    out.push({
      rowIndex:    i + 1,
      projectName: projectName || fileName,
      projectUid,
      phraseUrl:   _phraseProjectUrl_(projectUid),
      uploadDate:  uploadTs,
      sourceLang:  "From Template",
      targetLang:  targetRaw,
      targetLangs,
      status,
      dueDate,
      sharedWith,
      jobUids,
      mime,
      fileName
    });
  }

  out.reverse();
  return { rows: out, isAdmin: admin, user };
}

function _phraseProjectUrl_(projectUid) {
  if (!projectUid) return "";
  return "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
}
/* ==========================================================================
   TEMPLATE MANAGER (Admin)
   ========================================================================== */

/**
 * Liefert alle Templates aus dem Sheet FetchTemplate-Prod (schnell).
 * KEIN Live-Phrase-Abruf ? das Sheet ist durch den Sync bereits bef?llt.
 */
function apiGetTemplatesForManager() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, 'templates')) throw new Error("Not authorized. Admin only.");

  const ss = openAccessSS_();
  const sh = ss.getSheetByName("FetchTemplate-Prod");
  if (!sh) return { success: true, rows: [] };

  const data = sh.getDataRange().getValues();
  if (data.length < 2) return { success: true, rows: [] };

  const hLower = data[0].map(h => String(h).trim().toLowerCase());
  const find = (...keys) => hLower.findIndex(h => keys.some(k => h.includes(k)));
  const cUid    = find("uid");
  const cActive = find("active");
  const cName   = hLower.findIndex(h => (h.includes("name") || h.includes("display") || h.includes("anzeige")) && !h.includes("phrase"));
  const cPhrase = hLower.findIndex(h => h.includes("phrase name") || h.includes("original"));
  const cSource = find("source");
  const cTarget = find("target");
  const cClient = find("client");
  const cDomain = hLower.findIndex(h => h.includes("domain") && !h.includes("sub"));
  const cSub    = find("subdomain");
  const cBu     = find("business");

  const g = (row, c) => (c >= 0 ? String(row[c] || "").trim() : "");
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const uid = g(data[i], cUid);
    if (!uid) continue;
    rows.push({
      uid,
      displayName:  g(data[i], cName) || g(data[i], cPhrase),
      phraseName:   g(data[i], cPhrase),
      sourceLang:   g(data[i], cSource),
      targetLangs:  g(data[i], cTarget),
      client:       g(data[i], cClient),
      domain:       g(data[i], cDomain),
      subDomain:    g(data[i], cSub),
      businessUnit: g(data[i], cBu),
      active:       cActive < 0 ? true : (g(data[i], cActive).toLowerCase() !== "no")
    });
  }
  rows.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return { success: true, rows };
}

/**
 * Setzt Active yes/no f?r ein einzelnes Template im Sheet.
 * Legt die Zeile an, falls das Template noch nicht im Sheet steht.
 */
function apiSetTemplateActive(templateUid, active) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, 'templates')) throw new Error("Not authorized. Admin only.");

  const uid = String(templateUid || "").trim();
  if (!uid) throw new Error("Template UID fehlt.");
  const newVal = active ? "yes" : "no";

  const ss = openAccessSS_();
  let sh = ss.getSheetByName("FetchTemplate-Prod");
  if (!sh) throw new Error("Sheet FetchTemplate-Prod nicht gefunden.");

  const data = sh.getDataRange().getValues();
  const hLower = data[0].map(h => String(h).trim().toLowerCase());
  let cUid    = hLower.findIndex(h => h.includes("uid"));
  let cActive = hLower.findIndex(h => h.includes("active"));

  if (cUid < 0) throw new Error("Spalte 'Template UID' nicht gefunden.");
  // Active-Spalte anlegen, falls sie fehlt
  if (cActive < 0) {
    cActive = data[0].length;
    sh.getRange(1, cActive + 1).setValue("Active (yes/no)");
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][cUid] || "").trim() === uid) {
      sh.getRange(i + 1, cActive + 1).setValue(newVal);
      logAuditEvent_(caller, "TEMPLATE_ACTIVE", uid + " ? " + newVal);
      return { success: true, active: active };
    }
  }

  // Template noch nicht im Sheet ? minimale Zeile anlegen
  const newRow = new Array(sh.getLastColumn()).fill("");
  newRow[cUid] = uid;
  newRow[cActive] = newVal;
  sh.appendRow(newRow);
  logAuditEvent_(caller, "TEMPLATE_ACTIVE", uid + " ? " + newVal + " (Zeile neu angelegt)");
  return { success: true, active: active };
}
function DEBUG_tmplMgr() {
  var t0 = Date.now();
  var phrase = fetchAllTemplatesFromPhrase_();
  console.log("Phrase-Templates geladen: " + phrase.length + " in " + (Date.now()-t0) + "ms");
  var t1 = Date.now();
  var res = apiGetTemplatesForManager();
  console.log("apiGetTemplatesForManager: " + res.rows.length + " rows in " + (Date.now()-t1) + "ms");
}

/* ==========================================================================
   USER MANAGER (Admin)
   ========================================================================== */

/**
 * ?ffnet das Spreadsheet, in dem FetchTMS_USERS-Prod liegt.
 * TODO: Falls ihr daf?r bereits eine Script-Property analog ACCESS_SHEET_ID/
 * OPS_SHEET_ID habt, hier ersetzen durch:
 * PropertiesService.getScriptProperties().getProperty('USER_SHEET_ID')
 */
function openUserSheetSS_() {
  return SpreadsheetApp.openById('1mU8zWhR-E8_fmBcLtMh1qIwST9FibKT5UfH7oaivs0Q');
}

const USER_MGR_COLS = ['username','firstName','lastName','email','role','status',
  'clients','domains','subdomains','businessUnit','sourceLangs','targetLangs','workflowSteps'];

const USER_MGR_HEADER_MAP = {
  'Username': 'username', 'First Name': 'firstName', 'Last Name': 'lastName',
  'Email': 'email', 'Role': 'role', 'Status': 'status', 'Clients': 'clients',
  'Domains': 'domains', 'Subdomains': 'subdomains', 'Business Unit': 'businessUnit',
  'Source Langs': 'sourceLangs', 'Target Langs': 'targetLangs', 'Workflow Steps': 'workflowSteps'
};

function apiGetUsersForManager() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, 'users')) throw new Error("Not authorized. Admin only.");
  const ss = openUserSheetSS_();
  const sh = ss.getSheetByName("FetchTMS_USERS-Prod");
  if (!sh) return { success: true, rows: [] };
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return { success: true, rows: [] };
  const header = data[0].map(h => String(h).trim());
  const colIdx = {};
  header.forEach((h, i) => { if (USER_MGR_HEADER_MAP[h]) colIdx[USER_MGR_HEADER_MAP[h]] = i; });
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const username = colIdx.username != null ? String(row[colIdx.username] || '').trim() : '';
    if (!username) continue;
    const obj = {};
    USER_MGR_COLS.forEach(f => {
      obj[f] = colIdx[f] != null ? String(row[colIdx[f]] || '').trim() : '';
    });
    rows.push(obj);
  }
  rows.sort((a, b) => a.username.localeCompare(b.username));
  return { success: true, rows };
}

/**
 * Schreibt ein Feld f?r einen User ins Sheet und optional (live) nach Phrase.
 * Sheet-Write passiert IMMER zuerst und unabh?ngig vom Phrase-Ergebnis ?
 * geht der Phrase-Call schief, bleibt das Sheet trotzdem korrekt und die
 * Funktion gibt eine Warnung statt eines Fehlers zur?ck.
 */
function apiUpdateUserField(username, field, value, syncToPhrase) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, 'users')) throw new Error("Not authorized. Admin only.");
  if (!username) throw new Error("Username fehlt.");

  const ss = openUserSheetSS_();
  const sh = ss.getSheetByName("FetchTMS_USERS-Prod");
  if (!sh) throw new Error("Sheet FetchTMS_USERS-Prod nicht gefunden.");

  const data = sh.getDataRange().getValues();
  const header = data[0].map(h => String(h).trim());
  const colIdx = {};
  header.forEach((h, i) => { if (USER_MGR_HEADER_MAP[h]) colIdx[USER_MGR_HEADER_MAP[h]] = i; });

  const usernameCol = colIdx.username;
  const targetCol = colIdx[field];
  if (usernameCol == null || targetCol == null) {
    throw new Error("Spalte '" + field + "' oder 'Username' nicht im Sheet gefunden.");
  }

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][usernameCol] || '').trim() === username) { rowIndex = i; break; }
  }
  if (rowIndex < 0) throw new Error("User '" + username + "' nicht im Sheet gefunden.");

  // 1) Sheet immer schreiben
  sh.getRange(rowIndex + 1, targetCol + 1).setValue(value);
  logAuditEvent_(caller, "USER_FIELD_UPDATE", username + "." + field + " ? " + value);

  const result = { success: true };

  // 2) Optional live zu Phrase
  if (syncToPhrase) {
    try {
      _syncUserFieldToPhrase_(username, field, value);
    } catch (e) {
      result.phraseWarning = e.message;
    }
  }
  return result;
}

/**
 * Schreibt firstName/lastName/role live in Phrase TMS.
 * Sucht zuerst die interne Phrase-userUid per userName-Lookup.
 *
 * ANNAHME (nicht live getestet ? vor Rollout mit einem Test-User pr?fen):
 * - Auth-Header: "Bearer " + PHRASE_API_TOKEN (wie in eurem ?brigen Code verwendet)
 * - GET  /web/api2/v1/users?userName=... liefert { content: [ {id, userName, ...} ] }
 * - PUT  /web/api2/v1/users/{uid}  nimmt { firstName / lastName / role } entgegen
 *
 * Falls ihr schon einen zentralen Helper f?r Phrase-Header habt (z.B. eine
 * Funktion wie getPhraseHeaders_()), den hier statt der Inline-Konstruktion nutzen.
 */
function _syncUserFieldToPhrase_(username, field, value) {
  const token = PropertiesService.getScriptProperties().getProperty('PHRASE_API_TOKEN');
  if (!token) throw new Error("PHRASE_API_TOKEN fehlt in Script Properties.");
  const headers = { Authorization: "Bearer " + token };
  const base = "https://cloud.memsource.com/web/api2/v1";

  // 1) Phrase-UID per userName-Lookup ermitteln
  const searchUrl = base + "/users?userName=" + encodeURIComponent(username);
  const searchRes = UrlFetchApp.fetch(searchUrl, { headers: headers, muteHttpExceptions: true });
  if (searchRes.getResponseCode() !== 200) {
    throw new Error("Phrase User-Lookup fehlgeschlagen (" + searchRes.getResponseCode() + "): " + searchRes.getContentText());
  }
  const searchData = JSON.parse(searchRes.getContentText());
  const match = (searchData.content || []).find(function(u) { return u.userName === username; });
  if (!match) throw new Error("User '" + username + "' nicht in Phrase gefunden (userName-Lookup leer).");
  const phraseUid = match.id;

  // 2) Feld-Mapping App ? Phrase-API
  const fieldMap = { firstName: 'firstName', lastName: 'lastName', role: 'role' };
  const phraseField = fieldMap[field];
  if (!phraseField) throw new Error("Feld '" + field + "' ist nicht f?r Phrase-Sync vorgesehen.");

  const body = {};
  body[phraseField] = value;

  const editUrl = base + "/users/" + phraseUid;
  const editRes = UrlFetchApp.fetch(editUrl, {
    method: "put",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });
  if (editRes.getResponseCode() >= 300) {
    throw new Error("Phrase-Update fehlgeschlagen (" + editRes.getResponseCode() + "): " + editRes.getContentText());
  }
}

function DEBUG_userMgr() {
  var t0 = Date.now();
  var res = apiGetUsersForManager();
  console.log("apiGetUsersForManager: " + res.rows.length + " rows in " + (Date.now()-t0) + "ms");
  if (res.rows.length) console.log(JSON.stringify(res.rows[0], null, 2));
}