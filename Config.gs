const DEFAULT_ACCESS_SHEET_ID = "1mU8zWhR-E8_fmBcLtMh1qIwST9FibKT5UfH7oaivs0Q";
const DEFAULT_OPS_SHEET_ID = "1xi0ZtFxxurNu25URrhpHmfSLy8nld_SXm0KmkXxRCpQ";

const TEMPLATE_SHEET_NAME = "FetchTemplate-Prod";
const USERS_SHEET_NAME = "FetchTMS_USERS-Prod";
const MAINT_SHEET_NAME = "Maintenance";
const WHITELIST_SHEET_NAME = "Whitelist";
const MARKETING_WHITELIST_SHEET_NAME = "Whitelist_Marketing";
const KEC_WHITELIST_SHEET_NAME = "Whitelist_KeC";
const DOC_WHITELIST_SHEET_NAME = "Whitelist_Documentation";
const ARTICULATE_WHITELIST_SHEET_NAME = "Whitelist_Articulate";

// ?????????????????????????????????????????
// PUBLIC: getConfig_ (called by apiGetConfig in WebApp.gs)
// ?????????????????????????????????????????
function getConfig_(impersonateEmail) {
  const currentUser = getUserEmail_();
  const isAdmin = isAdmin_(currentUser);

  // Impersonation (admin only)
  let effectiveUser = currentUser;
  let isImpersonating = false;
  if (isAdmin && impersonateEmail && String(impersonateEmail).trim()) {
    effectiveUser = String(impersonateEmail).trim().toLowerCase();
    isImpersonating = true;
  }

  // ?? Whitelists ??
  const isMarketing = isMarketingUser_(effectiveUser);
  const isKeC = isKeCUser_(effectiveUser);
  const isDoc = isDocUser_(effectiveUser);
  const isArticulate = isArticulateUser_(effectiveUser);
  const isWoma = isWomaUser_(effectiveUser);
  const isCc = isCcUser_(effectiveUser);

  // ?? Custom pages the effective user can access ??
  let userCustomPages = [];
  try {
    const allPages = apiGetCustomPages();
    allPages.forEach(p => {
      const wl = getDynamicWhitelist_(p.id);
      if (wl.includes(effectiveUser)) {
        userCustomPages.push({ id: p.id, name: p.name });
      }
    });
  } catch(e) {
    console.warn("getConfig_: custom pages lookup error:", e.message);
  }

  const effectiveIsAdmin = isAdmin_(effectiveUser);
  const adminLightSubtabs = effectiveIsAdmin ? [] : getAdminLightSubtabs_(effectiveUser);
  // isExclusive: User sieht NUR den jeweiligen Spezial-Tab (kein "General Projects")
  const isExclusive = !effectiveIsAdmin && (isMarketing || isKeC || isDoc || isWoma || isCc || userCustomPages.length > 0);

  // ?? FETCH TEMPLATES AND FILTER ??
  const allTemplates = readTemplates_();
  const userData = getUserData_(effectiveUser);
  const allowedTemplates = {};

  for (let key in allTemplates) {
    const t = allTemplates[key];
    let hasAccess = true;
    
    // Filter anwenden, wenn der Nutzer KEIN Admin ist
    if (!effectiveIsAdmin) { 
      // Nutzer-Werte an Zeilenumbruch (\n) oder Komma splitten
      const uClients = userData.client.toLowerCase().split(/[\n,;]+/).map(s => s.trim());
      const uDomains = userData.domain.toLowerCase().split(/[\n,;]+/).map(s => s.trim());
      const uSubs = userData.subdomain.toLowerCase().split(/[\n,;]+/).map(s => s.trim());

      // Pr?fen, ob der Template-Wert in den Nutzer-Werten enthalten ist
      if (t.client !== "" && !uClients.includes(t.client.toLowerCase())) hasAccess = false;
      if (t.domain !== "" && !uDomains.includes(t.domain.toLowerCase())) hasAccess = false;
      if (t.subdomain !== "" && !uSubs.includes(t.subdomain.toLowerCase())) hasAccess = false;
    }
    
    if (hasAccess) {
      allowedTemplates[key] = t;
    }
  }

  const languages = buildLanguagesMap_(allowedTemplates);
  const maintenance = getMaintenanceConfig_();
  const sizeLimitMb = getSizeLimitMb_();

  return {
    templates: allowedTemplates,
    languages: languages,
    sizeLimitMb: sizeLimitMb,
    currentUser: currentUser,
    effectiveUser: effectiveUser,
    isImpersonating: isImpersonating,
    isAdmin: isAdmin, 
    effectiveIsAdmin: effectiveIsAdmin, 
    isMarketing: isMarketing,
    isKeC: isKeC,
    isDoc: isDoc,
    isArticulate: isArticulate,
    isWoma: isWoma,
    isCc: isCc,
    isExclusive: isExclusive,
    customPages: userCustomPages,
    maintenance: maintenance,
    adminLightSubtabs: adminLightSubtabs
  };
}

// ?????????????????????????????????????????
// PUBLIC: getAdminDashboardData_
// ?????????????????????????????????????????
function getAdminDashboardData_() {
  const props = PropertiesService.getScriptProperties();
  const adminEmails = (props.getProperty("ADMIN_EMAILS") || "")
    .split(",").map(s => s.trim()).filter(Boolean);

  const whitelist = readEmailListFromSheet_(getAccessSheetId_(), WHITELIST_SHEET_NAME, 1);
  const marketingWhitelist = readEmailListFromSheet_(getAccessSheetId_(), MARKETING_WHITELIST_SHEET_NAME, 1);
  const kecWhitelist = readEmailListFromSheet_(getAccessSheetId_(), KEC_WHITELIST_SHEET_NAME, 1);
  const docWhitelist = readEmailListFromSheet_(getAccessSheetId_(), DOC_WHITELIST_SHEET_NAME, 1);
  const sizeLimit = getSizeLimitMb_();

  let customPages = [];
  try {
    const allPages = apiGetCustomPages();
    allPages.forEach(p => {
      const users = getDynamicWhitelist_(p.id);
      customPages.push({ id: p.id, name: p.name, users: users });
    });
  } catch(e) {
    console.warn("getAdminDashboardData_: custom pages error:", e.message);
  }

  let logs = [];
  try { logs = getRecentQueueLogs_(20); } catch(e) { logs = ["? Error loading logs: " + e.message]; }

  return {
    sizeLimit: sizeLimit,
    whitelist: whitelist,
    marketingWhitelist: marketingWhitelist,
    kecWhitelist: kecWhitelist,
    docWhitelist: docWhitelist,
    admins: adminEmails,
    customPages: customPages,
    logs: logs
  };
}

// ?????????????????????????????????????????
// PRIVATE: read last N queue rows as log lines
// ?????????????????????????????????????????
function getRecentQueueLogs_(limit) {
  const opsId = getOpsSheetId_();
  const ss = SpreadsheetApp.openById(opsId);
  const sh = ss.getSheetByName("Queue");
  if (!sh) return ["Queue sheet not found."];

  const last = sh.getLastRow();
  if (last < 2) return ["No uploads recorded yet."];

  const count = Math.min(last - 1, limit);
  const start = last - count + 1;
  const data = sh.getRange(start, 1, count, 19).getValues();

  const tz = Session.getScriptTimeZone();

  return data.reverse().map(row => {
    let ts = "??:??";
    try {
      const d = row[0] instanceof Date ? row[0] : new Date(row[0]);
      if (!isNaN(d)) ts = Utilities.formatDate(d, tz, "dd.MM.yy HH:mm");
    } catch(e) {}

    const user = String(row[1] || "?").split("@")[0];
    const project = String(row[11] || row[4] || "?").substring(0, 40);
    const status = String(row[7] || "?");
    const uid = String(row[2] || "").substring(0, 8);

    return `[${ts}] ${user} | ${project} | ${status}${uid ? " | " + uid + "?" : ""}`;
  });
}

// ?????????????????????????????????????????
// HELPERS
// ?????????????????????????????????????????

function getUserEmail_() {
  return (Session.getActiveUser().getEmail() || "").toLowerCase();
}

function isAdmin_(email) {
  const props = PropertiesService.getScriptProperties();
  const list = (props.getProperty("ADMIN_EMAILS") || "")
    .toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  return list.includes(String(email || "").toLowerCase());
}

function isMarketingUser_(email) {
  try {
    const wl = apiGetMarketingWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}

function isKeCUser_(email) {
  try {
    const wl = apiGetKeCWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}

function isDocUser_(email) {
  try {
    const wl = apiGetDocWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}

function getAccessSheetId_() {
  return PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID") || DEFAULT_ACCESS_SHEET_ID;
}

function getOpsSheetId_() {
  return PropertiesService.getScriptProperties().getProperty("OPS_SHEET_ID") || DEFAULT_OPS_SHEET_ID;
}

function getSizeLimitMb_() {
  const raw = PropertiesService.getScriptProperties().getProperty("MAX_FILE_SIZE_MB");
  const mb = Number(raw || "100");
  return isFinite(mb) && mb > 0 ? mb : 100;
}

/** Holt Nutzerdaten robust inkl. Gro?-/Kleinschreibungs-Toleranz */
function getUserData_(email) {
  const empty = { client: "", domain: "", subdomain: "" };
  if (!email) return empty;
  
  try {
    const ss = SpreadsheetApp.openById(getAccessSheetId_());
    const sh = ss.getSheetByName(USERS_SHEET_NAME);
    if (!sh) return empty;
    
    const data = sh.getDataRange().getValues();
    if (data.length < 2) return empty;
    
    const headers = data[0].map(h => String(h || "").trim());
    const idx = indexByHeader_(headers);
    
    const iEmail = pickIdx_(idx, ["email", "e-mail", "user email"]);
    const iClient = pickIdx_(idx, ["client", "clients"]);
    const iDomain = pickIdx_(idx, ["domain", "domains"]);
    const iSub = pickIdx_(idx, ["subdomain", "subdomains", "sub-domain"]);
    
    if (iEmail === -1) return empty;
    
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][iEmail]).trim().toLowerCase() === email.toLowerCase()) {
        return {
          client: iClient !== -1 ? String(data[r][iClient]).trim() : "",
          domain: iDomain !== -1 ? String(data[r][iDomain]).trim() : "",
          subdomain: iSub !== -1 ? String(data[r][iSub]).trim() : ""
        };
      }
    }
  } catch (e) {
    console.warn("getUserData_ error:", e.message);
  }
  return empty;
}

function readTemplates_() {
  const ss = SpreadsheetApp.openById(getAccessSheetId_());
  const sh = ss.getSheetByName(TEMPLATE_SHEET_NAME);
  if (!sh) throw new Error("Template sheet not found: " + TEMPLATE_SHEET_NAME);

  const values = sh.getDataRange().getValues();
  if (!values || values.length < 2) return {};

  const headers = values[0].map(h => String(h || "").trim());
  const idx = indexByHeader_(headers);

  const colName = pickIdx_(idx, ["Display Name", "anzeigename", "template name", "name", "template"]);
  const colUid = pickIdx_(idx, ["template uid", "uid", "templateuid"]);
  const colSource = pickIdx_(idx, ["source", "source lang", "sourcelang", "source_language"]);
  const colTargets = pickIdx_(idx, ["targets", "target langs", "targetlang"]);
  const colActive = pickIdx_(idx, ["active", "active (yes/no)", "active?"]);
  
  const colClient = pickIdx_(idx, ["client", "clients"]);
  const colDomain = pickIdx_(idx, ["domain", "domains"]);
  const colSub = pickIdx_(idx, ["subdomain", "subdomains", "sub-domain"]);

  if (colName === -1 || colUid === -1) {
    throw new Error("Template sheet: missing 'Template Name' or 'Template UID' columns.");
  }

  const out = {};
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    if (colActive !== -1) {
      if (String(row[colActive] || "").trim().toLowerCase() !== "yes") continue;
    }
    const name = String(row[colName] || "").trim();
    const uid = String(row[colUid] || "").trim();
    if (!name || !uid) continue;

    const source = colSource !== -1 ? normalizeLang_(row[colSource]) : "default";
    const targets = colTargets !== -1 ? parseTargets_(row[colTargets]) : [];
    
    const client = colClient !== -1 ? String(row[colClient] || "").trim() : "";
    const domain = colDomain !== -1 ? String(row[colDomain] || "").trim() : "";
    const subdomain = colSub !== -1 ? String(row[colSub] || "").trim() : "";

    const key = `${name} [${source}]`;
    
    if (!out[key]) {
      out[key] = { uid, source, targets: [], client, domain, subdomain, targetUidMap: {} };
    }
    
    // Zielsprachen aggregieren und die UID pro Sprache mappen
    targets.forEach(t => {
      if (!out[key].targets.includes(t)) {
        out[key].targets.push(t);
      }
      out[key].targetUidMap[t] = uid;
    });
  }
  return out;
}

function buildLanguagesMap_(templates) {
  const map = {};
  Object.keys(templates || {}).forEach(k => {
    const t = templates[k];
    if (t && t.source) map[t.source] = t.source;
    (t.targets || []).forEach(code => { map[code] = code; });
  });
  return map;
}

function getMaintenanceConfig_() {
  const props = PropertiesService.getScriptProperties();
  const start = props.getProperty("MAINT_START");
  const end = props.getProperty("MAINT_END");
  const msg = props.getProperty("MAINT_MSG") || "";
  if (start && end) return { start, end, message: msg };

  try {
    const ss = SpreadsheetApp.openById(getAccessSheetId_());
    const sh = ss.getSheetByName(MAINT_SHEET_NAME);
    if (!sh) return { start: "", end: "", message: "" };
    const values = sh.getDataRange().getValues();
    if (!values || values.length < 2) return { start: "", end: "", message: "" };

    const headers = values[0].map(h => String(h || "").trim().toLowerCase());
    const iStart = headers.indexOf("starttime") !== -1 ? headers.indexOf("starttime") : headers.indexOf("start");
    const iEnd = headers.indexOf("endtime") !== -1 ? headers.indexOf("endtime") : headers.indexOf("end");
    const iMsg = headers.indexOf("message");
    const iActive = headers.indexOf("active");

    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const active = iActive !== -1 ? String(row[iActive]).toLowerCase() === "true" : true;
      if (!active) continue;
      const startIso = toIsoIfDate_(iStart !== -1 ? row[iStart] : "");
      const endIso = toIsoIfDate_(iEnd !== -1 ? row[iEnd] : "");
      const m = iMsg !== -1 ? String(row[iMsg] || "") : "";
      if (startIso && endIso) return { start: startIso, end: endIso, message: m };
    }
  } catch(e) {}
  return { start: "", end: "", message: "" };
}

function readEmailListFromSheet_(spreadsheetId, sheetName, col1Based) {
  try {
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sh = ss.getSheetByName(sheetName);
    if (!sh) return [];
    const last = sh.getLastRow();
    if (last < 2) return [];
    return sh.getRange(2, col1Based, last - 1, 1).getValues()
      .map(r => String(r[0] || "").trim().toLowerCase())
      .filter(e => e);
  } catch(e) { return []; }
}

function normalizeLang_(v) {
  const s = String(v || "").trim().toLowerCase();
  return s ? s.replace("-", "_") : "default";
}

function parseTargets_(cell) {
  if (Array.isArray(cell)) return cell.map(normalizeLang_).filter(Boolean);
  const s = String(cell || "").trim();
  if (!s) return [];
  return s.split(/[,;|\n]/g).map(normalizeLang_).filter(Boolean);
}

function toIsoIfDate_(v) {
  if (!v) return "";
  if (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v.getTime())) return v.toISOString();
  const s = String(v).trim();
  return (s.includes("T") && s.includes("Z")) ? s : "";
}

function indexByHeader_(headers) {
  const idx = {};
  headers.forEach((h, i) => { idx[String(h || "").trim().toLowerCase()] = i; });
  return idx;
}

function pickIdx_(idxMap, names) {
  for (const n of names) {
    const key = String(n).trim().toLowerCase();
    if (key in idxMap) return idxMap[key];
  }
  return -1;
}

function apiDebugUserTemplates(email) {
  const adminEmail = getUserEmail_();
  if (!isAdmin_(adminEmail)) return { success: false, error: "Not authorized. Admin only." };

  email = String(email).trim().toLowerCase();
  const userData = getUserData_(email); 
  const allTemplates = readTemplates_(); 
  
  const allowed = [];
  const denied = [];

  const uClients = userData.client.toLowerCase().split(/[\n,;]+/).map(s => s.trim());
  const uDomains = userData.domain.toLowerCase().split(/[\n,;]+/).map(s => s.trim());
  const uSubs = userData.subdomain.toLowerCase().split(/[\n,;]+/).map(s => s.trim());

  for (let key in allTemplates) {
    const t = allTemplates[key];
    let hasAccess = true;
    let reasons = [];

    if (t.client !== "" && !uClients.includes(t.client.toLowerCase())) {
      hasAccess = false; 
      reasons.push(`Client mismatch (Template: '${t.client}' vs User: '${userData.client}')`);
    }
    if (t.domain !== "" && !uDomains.includes(t.domain.toLowerCase())) {
      hasAccess = false; 
      reasons.push(`Domain mismatch (Template: '${t.domain}' vs User: '${userData.domain}')`);
    }
    if (t.subdomain !== "" && !uSubs.includes(t.subdomain.toLowerCase())) {
      hasAccess = false; 
      reasons.push(`Subdomain mismatch (Template: '${t.subdomain}' vs User: '${userData.subdomain}')`);
    }

    if (hasAccess) {
      allowed.push({ name: key, info: "Matched successfully" });
    } else {
      denied.push({ name: key, reasons: reasons.join(" | ") });
    }
  }

  return {
    success: true,
    email: email,
    userData: userData,
    allowed: allowed,
    denied: denied
  };
}

function apiGetCustomPages() {
  return [];
}