/**
 * AdminLight.gs
 * "Admin-Light" Rolle: Zugriff auf einzelne Admin-Subtabs (User Manager,
 * Template Manager) ohne vollen Admin-Zugriff (kein Console-Tab, keine
 * Whitelists/Maintenance/Script-Properties etc.).
 * Sheet: "Whitelist_AdminLight" in ACCESS_SHEET_ID
 * Spalten: Email | Subtabs (z.B. "users,templates")
 */
var ADMIN_LIGHT_SHEET_NAME_ = "Whitelist_AdminLight";
var ADMIN_LIGHT_VALID_SUBTABS_ = ["users", "templates"];

function getAdminLightSubtabs_(email) {
  if (!email) return [];
  try {
    const ss = openAccessSS_();
    const sh = ss.getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (!sh) return [];
    const rows = sh.getDataRange().getValues();
    const search = String(email).trim().toLowerCase();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0] || "").trim().toLowerCase() === search) {
        const raw = String(rows[i][1] || "").trim();
        if (!raw) return [];
        return raw.split(",").map(s => s.trim().toLowerCase()).filter(s => ADMIN_LIGHT_VALID_SUBTABS_.includes(s));
      }
    }
  } catch (e) {
    console.warn("getAdminLightSubtabs_ error:", e.message);
  }
  return [];
}

function isAdminLightWithAccess_(email, subtab) {
  return getAdminLightSubtabs_(email).includes(subtab);
}

function apiGetAdminLightUsers() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    const ss = openAccessSS_();
    const sh = ss.getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (!sh) return { success: true, users: [] };
    const rows = sh.getDataRange().getValues();
    const users = [];
    for (let i = 1; i < rows.length; i++) {
      const email = String(rows[i][0] || "").trim().toLowerCase();
      if (!email) continue;
      const subtabs = String(rows[i][1] || "").trim().split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      users.push({ email, subtabs });
    }
    return { success: true, users };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiAddAdminLightUser(email, subtabs) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  const add = String(email || "").trim().toLowerCase();
  if (!add || !add.includes("@")) return { success: false, error: "Invalid email." };
  const cleanSubtabs = (Array.isArray(subtabs) ? subtabs : [])
    .map(s => String(s).trim().toLowerCase())
    .filter(s => ADMIN_LIGHT_VALID_SUBTABS_.includes(s));
  if (!cleanSubtabs.length) return { success: false, error: "Mindestens ein Subtab (users/templates) angeben." };
  try {
    const ss = openAccessSS_();
    let sh = ss.getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (!sh) {
      sh = ss.insertSheet(ADMIN_LIGHT_SHEET_NAME_);
      sh.appendRow(["Email", "Subtabs"]);
      sh.getRange("A1:B1").setFontWeight("bold").setBackground("#FFED00");
      sh.setFrozenRows(1);
    }
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0] || "").trim().toLowerCase() === add) {
        sh.getRange(i + 1, 2).setValue(cleanSubtabs.join(","));
        logAuditEvent_(caller, "ADMIN_LIGHT_UPDATE", add + " ? " + cleanSubtabs.join(","));
        return { success: true };
      }
    }
    sh.appendRow([add, cleanSubtabs.join(",")]);
    logAuditEvent_(caller, "ADMIN_LIGHT_ADD", add + " ? " + cleanSubtabs.join(","));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiRemoveAdminLightUser(email) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  const rem = String(email || "").trim().toLowerCase();
  try {
    const ss = openAccessSS_();
    const sh = ss.getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (!sh) return { success: true };
    const rows = sh.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][0] || "").trim().toLowerCase() === rem) {
        sh.deleteRow(i + 1);
        logAuditEvent_(caller, "ADMIN_LIGHT_REMOVE", "Removed: " + rem);
      }
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}