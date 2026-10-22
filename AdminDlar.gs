/**
 * AdminDlar.gs
 * Verwaltet die [DLA-R] Digital Services Robotics Projects Whitelist ? exklusiver Tab,
 * funktional 1:1 identisch zu "General Projects" (Standard-Template-Set,
 * keine eigene Client/Domain/BU-Filterung).
 *
 * Sheet: "Whitelist_DLAR" in ACCESS_SHEET_ID
 * Spalte A: Email
 */
function apiGetDlarWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_DLAR");
  if (!sh) {
    const newSh = ss.insertSheet("Whitelist_DLAR");
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
function apiAddDlarWhitelist(emailToAdd) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) throw new Error("Invalid email.");
  const ss = openAccessSS_();
  let sh = ss.getSheetByName("Whitelist_DLAR");
  if (!sh) { sh = ss.insertSheet("Whitelist_DLAR"); sh.appendRow(["Email"]); }
  const existing = apiGetDlarWhitelist().emails;
  if (!existing.includes(add)) {
    sh.appendRow([add]);
    logAuditEvent_(email, "WHITELIST_ADD", "Added to DLA-R Digital Services Robotics Whitelist: " + add);
  }
  return apiGetDlarWhitelist();
}
function apiRemoveDlarWhitelist(emailToRemove) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");
  const rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetDlarWhitelist();
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_DLAR");
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
      logAuditEvent_(email, "WHITELIST_REMOVE", "Removed from DLA-R Digital Services Robotics Whitelist: " + rem);
    }
  }
  return apiGetDlarWhitelist();
}
function isDlarUser_(email) {
  try {
    const wl = apiGetDlarWhitelist().emails;
    return wl.includes(String(email || "").trim().toLowerCase());
  } catch(e) { return false; }
}