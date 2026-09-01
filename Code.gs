/**
 * Code.gs
 *
 * Entry point f?r die Web App.
 *
 * HINWEIS: getUserEmail_(), isAdmin_(), openAccessSS_(), openOpsSS_()
 * sind kanonisch in Config.js und WebApp.js definiert.
 * Duplikate hier entfernt um Konflikte zu vermeiden.
 */
function apiGetContext() {
  const email = getUserEmail_();
  const admin = isAdmin_(email);
  const maint = getMaintenanceStatus_();
  return { email, isAdmin: admin, maintenance: maint };
}
function getMaintenanceStatus_() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Maintenance");
  if (!sh) return { active: false, message: "", startTime: "", endTime: "" };
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const active = String(rows[i][4]).toUpperCase() === "TRUE";
    if (active) {
      return {
        active: true,
        startTime: rows[i][1] ? String(rows[i][1]) : "",
        endTime: rows[i][2] ? String(rows[i][2]) : "",
        message: rows[i][3] ? String(rows[i][3]) : "Maintenance active"
      };
    }
  }
  return { active: false, message: "", startTime: "", endTime: "" };
}
function apiGetMaintenance() {
  return getMaintenanceStatus_();
}
function apiSetMaintenance(payload) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Maintenance") || ss.insertSheet("Maintenance");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["ID", "StartTime", "EndTime", "Message", "Active"]);
  }
  const rng = sh.getDataRange();
  const vals = rng.getValues();
  for (let i = 1; i < vals.length; i++) vals[i][4] = "FALSE";
  if (vals.length > 1) rng.setValues(vals);
  if (payload && payload.active) {
    const id = String(Date.now());
    sh.appendRow([id, payload.startTime || "", payload.endTime || "", payload.message || "", "TRUE"]);
  }
  return apiGetMaintenance();
}
function apiGetWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  const emails = [];
  for (let i = 1; i < rows.length; i++) {
    const v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails };
}
function apiAddWhitelist(emailToAdd) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) throw new Error("Invalid email.");
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist") || ss.insertSheet("Whitelist");
  if (sh.getLastRow() === 0) sh.appendRow(["Email"]);
  const existing = apiGetWhitelist().emails;
  if (!existing.includes(add)) sh.appendRow([add]);
  return apiGetWhitelist();
}
function apiRemoveWhitelist(emailToRemove) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetWhitelist();
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
    }
  }
  return apiGetWhitelist();
}
function apiCheckAccess() {
  const user = getUserEmail_().toLowerCase();
  const admin = isAdmin_(user);
  if (admin) return { allowed: true, reason: "admin" };
  const maint = getMaintenanceStatus_();
  if (maint.active) return { allowed: false, reason: "maintenance", maintenance: maint };
  const wl = apiGetWhitelist().emails;
  if (wl.includes(user)) return { allowed: true, reason: "whitelisted" };
  try {
    const mktWl = apiGetMarketingWhitelist().emails;
    if (mktWl.includes(user)) return { allowed: true, reason: "marketing_whitelisted" };
  } catch(e) {}
  try {
    const kecWl = apiGetKeCWhitelist().emails;
    if (kecWl.includes(user)) return { allowed: true, reason: "kec_whitelisted" };
  } catch(e) {}
  try {
    const docWl = apiGetDocWhitelist().emails;
    if (docWl.includes(user)) return { allowed: true, reason: "doc_whitelisted" };
  } catch(e) {}
  try {
    const womaWl = apiGetWomaWhitelist().emails;
    if (womaWl.includes(user)) return { allowed: true, reason: "woma_whitelisted" };
  } catch(e) {}
  try {
    const ccWl = apiGetCcWhitelist().emails;
    if (ccWl.includes(user)) return { allowed: true, reason: "cc_whitelisted" };
  } catch(e) {}
  try {
    const artWl = apiGetArticulateWhitelist().emails;
    if (artWl.includes(user)) return { allowed: true, reason: "articulate_whitelisted" };
  } catch(e) {}
  return { allowed: false, reason: "not_whitelisted" };
}
function DEBUG_checkChatKeyFormat() {
  var raw = PropertiesService.getScriptProperties().getProperty("CHAT_PRIVATE_KEY");
  if (!raw) { console.log("? CHAT_PRIVATE_KEY ist leer/nicht gesetzt."); return; }
  console.log("L?nge gesamt:", raw.length);
  console.log("Beginnt mit (erste 30 Zeichen, ungef?hrlich):", raw.substring(0, 30));
  console.log("Endet mit (letzte 30 Zeichen):", raw.substring(raw.length - 30));
  console.log("Enth?lt literales '\\\\n' (Backslash-n als Text):", raw.indexOf("\\n") !== -1);
  console.log("Enth?lt echte Zeilenumbr?che (\\n):", raw.indexOf("\n") !== -1);
  console.log("Anzahl Zeilenumbr?che gesamt:", (raw.match(/\n/g) || []).length);
  console.log("Korrekter BEGIN-Header (5 Striche)?:", raw.indexOf("-----BEGIN PRIVATE KEY-----") === 0);
  console.log("Enth?lt korrekten END-Header (5 Striche)?:", raw.indexOf("-----END PRIVATE KEY-----") !== -1);
}
function DEBUG_repairChatPrivateKeyFormat() {
  var props = PropertiesService.getScriptProperties();
  var raw = props.getProperty("CHAT_PRIVATE_KEY");
  if (!raw) { console.log("? Kein CHAT_PRIVATE_KEY vorhanden."); return; }
  var beginMarker = "-----BEGIN PRIVATE KEY-----";
  var endMarker = "-----END PRIVATE KEY-----";
  if (raw.indexOf(beginMarker) !== 0 || raw.indexOf(endMarker) === -1) {
    console.log("? BEGIN/END Marker nicht wie erwartet gefunden. Abbruch ? bitte nicht weiter automatisch reparieren.");
    return;
  }
  var body = raw.substring(beginMarker.length, raw.indexOf(endMarker)).trim();
  // Base64-Inhalt in PEM-Standard-Zeilen von 64 Zeichen umbrechen
  var lines = [];
  for (var i = 0; i < body.length; i += 64) {
    lines.push(body.substring(i, i + 64));
  }
  var repaired = beginMarker + "\n" + lines.join("\n") + "\n" + endMarker + "\n";
  console.log("Neue Gesamtl?nge:", repaired.length);
  console.log("Neue Anzahl Zeilenumbr?che:", (repaired.match(/\n/g) || []).length);
  props.setProperty("CHAT_PRIVATE_KEY", repaired);
  console.log("? CHAT_PRIVATE_KEY neu formatiert und gespeichert.");
}
function fixCorruptChatToken() {
     const props = PropertiesService.getScriptProperties();
     props.deleteProperty("oauth2.TranslationChatBot_v3");
     props.deleteProperty("oauth2.GoogleChatBot");
     const service = getChatBotService_();
     if (!service) { console.log("? Service null ? Keys fehlen"); return; }
     console.log("Has Access:", service.hasAccess());
     if (service.hasAccess()) console.log("? Neuer Token erfolgreich generiert!");
   }