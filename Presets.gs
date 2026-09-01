/**
 * Presets.gs
 * F: User project presets (saved form configurations)
 *
 * Sheet: "User_Presets" in ACCESS_SHEET_ID
 * Columns: PresetId | UserEmail | PresetName | TemplateUid | TemplateName | SourceLang | TargetLangs | Note | ProjectName | CreatedAt
 */

var PRESETS_SHEET_NAME_ = "User_Presets";

function getPresetsSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(PRESETS_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(PRESETS_SHEET_NAME_);
    sh.appendRow(["PresetId","UserEmail","PresetName","TemplateUid","TemplateName","SourceLang","TargetLangs","Note","ProjectName","CreatedAt"]);
    sh.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

/**
 * Save a new preset for the current user.
 * Saves: templateUid, templateName, sourceLang, targetLangs, note, projectName
 * dueDate intentionally excluded ? would be stale on next load.
 */
function apiSavePreset(presetData) {
  var caller = getUserEmail_();
  if (!caller) return { success: false, error: "Not authenticated." };

  var name        = String(presetData.presetName   || "").trim();
  var templateUid = String(presetData.templateUid  || "").trim();
  var tmplName    = String(presetData.templateName  || "").trim();
  var sourceLang  = String(presetData.sourceLang    || "").trim();
  var targetLangs = Array.isArray(presetData.targetLangs)
    ? presetData.targetLangs.join(",")
    : String(presetData.targetLangs || "");
  var note        = String(presetData.note         || "").trim();
  var projectName = String(presetData.projectName  || "").trim();

  if (!name)        return { success: false, error: "Preset name required." };
  if (!templateUid) return { success: false, error: "Template required." };

  var sh      = getPresetsSheet_();
  var data    = sh.getDataRange().getValues();
  var presetId = "preset_" + Date.now();
  var now      = new Date().toISOString();

  // Overwrite if same name for same user
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase() === caller && String(data[i][2]) === name) {
      sh.getRange(i + 1, 1, 1, 10).setValues([[
        data[i][0], caller, name, templateUid, tmplName,
        sourceLang, targetLangs, note, projectName, now
      ]]);
      logAuditEvent_(caller, "PRESET_SAVE", "Updated preset: " + name);
      return { success: true, presetId: data[i][0], updated: true };
    }
  }

  sh.appendRow([presetId, caller, name, templateUid, tmplName, sourceLang, targetLangs, note, projectName, now]);
  logAuditEvent_(caller, "PRESET_SAVE", "Created preset: " + name);
  return { success: true, presetId: presetId, updated: false };
}

/**
 * Load all presets for the current user
 */
function apiLoadPresets() {
  var caller = getUserEmail_();
  if (!caller) return { success: false, presets: [] };

  try {
    var sh   = getPresetsSheet_();
    var data = sh.getDataRange().getValues();
    var out  = [];

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][1]).toLowerCase() !== caller) continue;
      out.push({
        presetId:     String(data[i][0]),
        presetName:   String(data[i][2]),
        templateUid:  String(data[i][3]),
        templateName: String(data[i][4]),
        sourceLang:   String(data[i][5]),
        targetLangs:  String(data[i][6]).split(",").map(function(s) { return s.trim(); }).filter(Boolean),
        note:         String(data[i][7]),
        projectName:  String(data[i][8] || ""),
        createdAt:    String(data[i][9] || "")
      });
    }

    return { success: true, presets: out };
  } catch (e) {
    return { success: false, error: e.message, presets: [] };
  }
}

/**
 * Delete a preset by ID
 */
function apiDeletePreset(presetId) {
  var caller = getUserEmail_();
  if (!caller) return { success: false, error: "Not authenticated." };

  try {
    var sh   = getPresetsSheet_();
    var data = sh.getDataRange().getValues();

    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]) === presetId && String(data[i][1]).toLowerCase() === caller) {
        var name = String(data[i][2]);
        
        sh.deleteRow(i + 1);
        SpreadsheetApp.flush(); // WICHTIG: Zwingt Google Sheets zum sofortigen Speichern!
        
        logAuditEvent_(caller, "PRESET_DELETE", "Deleted preset: " + name);
        return { success: true };
      }
    }

    return { success: false, error: "Preset not found." };
  } catch (e) {
    return { success: false, error: e.message };
  }
}