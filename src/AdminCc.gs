/**
 * AdminCc.gs
 * Verwaltet die Competence Center (CC) Projects Whitelist ? exklusiver Tab,
 * funktional 1:1 identisch zu "General Projects" (Standard-Template-Set,
 * keine eigene Client/Domain/BU-Filterung).
 *
 * Sheet: "Whitelist_CC" in ACCESS_SHEET_ID
 * Spalte A: Email
 */
function apiGetCcWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_CC");
  if (!sh) {
    const newSh = ss.insertSheet("Whitelist_CC");
    newSh.appendRow(["Email"]);
    return { emails: [] };
  }
  const rows = sh.getDataRange().getValues();
  const emails = [];
  for (let i = 1; i < rows.length; i++) {
    const v = String(rows[i][0] || "").trim().toLowerCase();
    if (v) emails.push(v);
  }
  return { emails };
}
function apiAddCcWhitelist(emailToAdd) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) throw new Error("Invalid email.");
  const ss = openAccessSS_();
  let sh = ss.getSheetByName("Whitelist_CC");
  if (!sh) { sh = ss.insertSheet("Whitelist_CC"); sh.appendRow(["Email"]); }
  const existing = apiGetCcWhitelist().emails;
  if (!existing.includes(add)) {
    sh.appendRow([add]);
    logAuditEvent_(email, "WHITELIST_ADD", "Added to Competence Center Whitelist: " + add);
  }
  return apiGetCcWhitelist();
}
function apiRemoveCcWhitelist(emailToRemove) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetCcWhitelist();
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_CC");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
      logAuditEvent_(email, "WHITELIST_REMOVE", "Removed from Competence Center Whitelist: " + rem);
    }
  }
  return apiGetCcWhitelist();
}
function isCcUser_(email) {
  try {
    const wl = apiGetCcWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}