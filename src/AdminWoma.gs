/**
 * AdminWoma.gs
 * Verwaltet die WOMA Projects Whitelist ? exklusiver Tab, funktional 1:1
 * identisch zu "General Projects" (Standard-Template-Set, keine eigene
 * Client/Domain/BU-Filterung).
 *
 * Sheet: "Whitelist_Woma" in ACCESS_SHEET_ID
 * Spalte A: Email
 */
function apiGetWomaWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Woma");
  if (!sh) {
    const newSh = ss.insertSheet("Whitelist_Woma");
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
function apiAddWomaWhitelist(emailToAdd) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) throw new Error("Invalid email.");
  const ss = openAccessSS_();
  let sh = ss.getSheetByName("Whitelist_Woma");
  if (!sh) { sh = ss.insertSheet("Whitelist_Woma"); sh.appendRow(["Email"]); }
  const existing = apiGetWomaWhitelist().emails;
  if (!existing.includes(add)) {
    sh.appendRow([add]);
    logAuditEvent_(email, "WHITELIST_ADD", "Added to WOMA Whitelist: " + add);
  }
  return apiGetWomaWhitelist();
}
function apiRemoveWomaWhitelist(emailToRemove) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetWomaWhitelist();
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Woma");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
      logAuditEvent_(email, "WHITELIST_REMOVE", "Removed from WOMA Whitelist: " + rem);
    }
  }
  return apiGetWomaWhitelist();
}
function isWomaUser_(email) {
  try {
    const wl = apiGetWomaWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}