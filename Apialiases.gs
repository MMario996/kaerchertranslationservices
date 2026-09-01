/**
 * ApiAliases.js
 *
 * L?st zwei Probleme:
 *
 * 1) DUPLICATE FUNCTIONS:
 * getUserEmail_(), isAdmin_(), openAccessSS_(), openOpsSS_(), getQueueSheet_()
 * sind in mehreren Dateien definiert. Apps Script wirft bei Duplikaten keinen
 * harten Fehler, aber das Verhalten ist undefiniert.
 *
 * 2) MISSING FUNCTION NAMES:
 * Das Frontend ruft via google.script.run Funktionsnamen auf, die im
 * Backend anders hei?en oder gar nicht existieren. Diese Datei registriert
 * alle fehlenden Namen als d?nne Wrapper.
 *
 * NEU: KeC Whitelist Aliases (Frontend nutzt kleines 'c', Backend hat gro?es 'C')
 */

// =============================================================================
// FEHLENDE ADMIN API ALIASES
// =============================================================================

function apiGetAdmins() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var props = PropertiesService.getScriptProperties();
  var admins = (props.getProperty("ADMIN_EMAILS") || "")
    .split(",").map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
  return { success: true, admins: admins };
}

function apiGetRecentLogs() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return [];
  try {
    var ss = openOpsSpreadsheet_();
    var sh = ss.getSheetByName("Queue");
    if (!sh) return [{ date: "-", user: "-", project: "Queue sheet not found", status: "ERROR" }];
    var lastRow = sh.getLastRow();
    if (lastRow < 2) return [{ date: "-", user: "-", project: "No entries yet", status: "-" }];
    var count = Math.min(lastRow - 1, 20);
    var start = lastRow - count + 1;
    var data  = sh.getRange(start, 1, count, 19).getValues();
    var tz    = Session.getScriptTimeZone();
    return data.reverse().map(function(row) {
      var d = row[0] instanceof Date ? row[0] : new Date(row[0]);
      var dateStr = "-";
      try { if (!isNaN(d)) dateStr = Utilities.formatDate(d, tz, "dd.MM.yy HH:mm"); } catch(e) {}
      return {
        date:    dateStr,
        user:    String(row[1]  || "?").split("@")[0],
        project: String(row[11] || row[4] || "?").substring(0, 50),
        status:  String(row[7]  || "?")
      };
    });
  } catch(e) {
    return [{ date: "-", user: "-", project: "Error: " + e.message, status: "ERROR" }];
  }
}

function apiSetFileSizeLimit(mb) {
  return apiSaveAdminSettings(mb);
}

function apiSetMaintenance(start, end, msg) {
  return apiSaveMaintenanceConfig(start, end, msg);
}

function apiClearMaintenance() {
  return apiClearMaintenanceConfig();
}

function apiRunHealthCheck() {
  return apiHealthCheck();
}

function apiGetDashboardStats() {
  return apiGetDashboardData();
}

function apiGetUserPresets() {
  return apiLoadPresets();
}

function apiUpdateScriptProperty(key, value) {
  return apiSetScriptProperty(key, value);
}

function apiDownloadMultipleTargets(projectUid, jobUids, projectName, targetLangs, fileName, mimeType, jobMapping) {
  return apiDownloadAllJobsAsZip(projectUid, jobUids, projectName, targetLangs, fileName, mimeType, jobMapping);
}

// =============================================================================
// KEC WHITELIST ALIASES
// Frontend nutzt lowercase 'c': apiGetKecWhitelist / apiAddKecWhitelist / apiRemoveKecWhitelist
// Backend hat uppercase 'C':   apiGetKeCWhitelist / apiAddKeCWhitelist / apiRemoveKeCWhitelist
// =============================================================================

function apiGetKecWhitelist() {
  return apiGetKeCWhitelist();
}

function apiAddKecWhitelist(email) {
  return apiAddKeCWhitelist(email);
}

function apiRemoveKecWhitelist(email) {
  return apiRemoveKeCWhitelist(email);
}

// =============================================================================
// ADMIN DASHBOARD ? fehlende Felder absichern
// loadAdminDashboardData() im Frontend versucht configData.sizeLimitMb,
// adminFileSize, adminMaintStart etc. zu lesen ? diese kommen aus apiGetAdminDashboardData.
// Sicherstellen dass apiGetAdminDashboardData alle n?tigen Felder liefert.
// =============================================================================

/**
 * Erweiterter Admin Dashboard Data Wrapper.
 * Gibt zus?tzlich sizeLimitMb zur?ck, das Config.gs nicht immer liefert.
 */
function apiGetAdminDashboardDataExtended() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var data = getAdminDashboardData_();
  // Sicherstellen dass sizeLimitMb vorhanden ist
  if (typeof data.sizeLimitMb === "undefined") {
    var raw = PropertiesService.getScriptProperties().getProperty("MAX_FILE_SIZE_MB");
    data.sizeLimitMb = Number(raw || "100");
  }
  return data;
}

// =============================================================================
// PRESET ALIASES
// Frontend ruft apiLoadPresets() ? Presets.js hat apiLoadPresets definiert.
// WebApp.js hat apiSavePreset/apiDeletePreset. Sicherstellen dass beide erreichbar.
// =============================================================================

// apiLoadPresets ist in Presets.js definiert ? kein Alias n?tig.
// apiSavePreset und apiDeletePreset sind in Presets.js definiert.
// WebApp.js definiert nochmal apiSavePreset/apiDeletePreset via UserProperties.
// Presets.js (Sheet-basiert) hat Priorit?t ? Duplikat in WebApp.js entfernen wenn m?glich.
// F?r jetzt: Alias der Sheet-basierten Version sicherstellen.

function apiSavePresetSheet(presetData) {
  // Ruft Presets.js Version auf (Sheet-basiert, robuster)
  return apiSavePreset(presetData);
}