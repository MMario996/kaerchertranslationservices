/**
 * AdminMarketing.gs
 * Verwaltet die Marketing Projects Whitelist
 * 
 * Sheet: "Whitelist_Marketing" in ACCESS_SHEET_ID
 * Spalte A: Email
 */

/**
 * Liest Marketing Whitelist aus Sheet
 */
function apiGetMarketingWhitelist() {
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Marketing");
  
  if (!sh) {
    // Sheet existiert nicht -> erstellen
    const newSh = ss.insertSheet("Whitelist_Marketing");
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

/**
 * F?gt User zur Marketing Whitelist hinzu
 */
function apiAddMarketingWhitelist(emailToAdd) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");

  const add = String(emailToAdd || "").trim().toLowerCase();
  if (!add || !add.includes("@")) throw new Error("Invalid email.");

  const ss = openAccessSS_();
  let sh = ss.getSheetByName("Whitelist_Marketing");
  
  if (!sh) {
    sh = ss.insertSheet("Whitelist_Marketing");
    sh.appendRow(["Email"]);
  }

  const existing = apiGetMarketingWhitelist().emails;
  if (!existing.includes(add)) {
    sh.appendRow([add]);
  }

  return apiGetMarketingWhitelist();
}

/**
 * Entfernt User von Marketing Whitelist
 */
function apiRemoveMarketingWhitelist(emailToRemove) {
  const email = getUserEmail_();
  if (!isAdmin_(email)) throw new Error("Not authorized.");

  const rem = String(emailToRemove || "").trim().toLowerCase();
  if (!rem) return apiGetMarketingWhitelist();

  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Whitelist_Marketing");
  if (!sh) return { emails: [] };

  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
      sh.deleteRow(i + 1);
    }
  }
  
  return apiGetMarketingWhitelist();
}

/**
 * Pr?ft ob User in Marketing Whitelist ist
 */
function isMarketingUser_(email) {
  const wl = apiGetMarketingWhitelist().emails;
  return wl.includes(String(email || "").trim().toLowerCase());
}