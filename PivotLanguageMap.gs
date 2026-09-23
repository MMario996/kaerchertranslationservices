/**
 * PivotLanguageMap.gs
 *
 * Das Phrase-Custom-Field "Pivot languages" (MULTI_SELECT, Feld PROJECT)
 * hat eigene, kurze Options-Werte (z.B. "DE", "FR", "ES", "RU", "EN", ...),
 * die NICHT mit den echten Phrase-Sprachcodes uebereinstimmen, die im Rest
 * des Portals verwendet werden (z.B. "de", "en_gb", "fr"). Ohne Mapping
 * wuerde phraseSetProjectMultiSelectFieldByName_ (ProjectsApi.gs) fuer
 * praktisch jede Sprache "Option nicht gefunden" loggen und nichts setzen.
 *
 * Dieses Sheet ist eine einfache, globale 1:n-Zuordnung Sprachcode ->
 * Options-Wert (admin-gepflegt, in der "Pivot Templates"-Admin-Seite) -
 * KEINE Pflicht-Zuordnung fuer JEDE Phrase-Sprache, nur fuer die, die
 * tatsaechlich als Pivot-Zielsprache vorkommen sollen.
 *
 * Sheet: "PivotLanguageMap" in ACCESS_SHEET_ID
 * Spalten: Phrase Language Code | Pivot Field Option Value
 */
var PIVOT_LANG_MAP_SHEET_NAME_ = "PivotLanguageMap";
var PIVOT_LANGUAGES_FIELD_NAME_ = "Pivot languages";

function pivotLangMapSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(PIVOT_LANG_MAP_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(PIVOT_LANG_MAP_SHEET_NAME_);
    sh.appendRow(["Phrase Language Code", "Pivot Field Option Value"]);
    sh.getRange("A1:B1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function pivotLangMapReadAll_() {
  var sh = pivotLangMapSheet_();
  var values = sh.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var lang = String(values[i][0] || "").trim();
    var val  = String(values[i][1] || "").trim();
    if (!lang || !val) continue;
    rows.push({ rowNum: i + 1, langCode: lang, optionValue: val });
  }
  return rows;
}

/** { langCode: optionValue } - fuer den Upload-Flow (Upload.gs). */
function pivotLangMapAsObject_() {
  var map = {};
  pivotLangMapReadAll_().forEach(function (r) { map[r.langCode.toLowerCase()] = r.optionValue; });
  return map;
}

// ============================================================================
// Admin-CRUD (Admin-Console -> Pivot Templates -> Sprachen-Mapping)
// ============================================================================

function apiGetPivotLanguageMap() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "pivot")) return { success: false, error: "Not authorized. Admin only." };
  try {
    return { success: true, map: pivotLangMapReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Liefert die VOLLSTAENDIGE (nicht auf 5 abgeschnittene) Options-Liste des
 * "Pivot languages"-Custom-Fields, fuer das Auswahl-Dropdown in der
 * Admin-UI - nutzt denselben paginierten Options-Endpoint wie
 * phraseSetProjectMultiSelectFieldByName_ (ProjectsApi.gs), nicht die
 * truncatedOptions aus der Custom-Field-Liste.
 */
function apiGetPivotFieldOptionValues() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "pivot")) return { success: false, error: "Not authorized. Admin only." };
  try {
    var cfDefs = phraseGetCustomFieldDefinitionsMap_(); // { uid: name }
    var fieldUid = null;
    for (var uid in cfDefs) {
      if (cfDefs[uid] === PIVOT_LANGUAGES_FIELD_NAME_) { fieldUid = uid; break; }
    }
    if (!fieldUid) {
      return { success: false, error: "Custom Field '" + PIVOT_LANGUAGES_FIELD_NAME_ + "' wurde bei Phrase nicht gefunden." };
    }
    var optDefs = phraseGetCustomFieldOptionsMap_(fieldUid, true); // { value: uid }, immer frisch
    return { success: true, options: Object.keys(optDefs).sort() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiSetPivotLanguageMapping(langCode, optionValue) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "pivot")) return { success: false, error: "Not authorized. Admin only." };

  var lang = String(langCode || "").trim();
  var val  = String(optionValue || "").trim();
  if (!lang || !val) return { success: false, error: "Sprachcode und Options-Wert sind Pflicht." };

  try {
    var sh = pivotLangMapSheet_();
    var values = sh.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][0] || "").trim().toLowerCase() === lang.toLowerCase()) {
        sh.getRange(i + 1, 2).setValue(val);
        logAuditEvent_(caller, "PIVOT_LANGMAP_UPDATE", lang + " -> " + val);
        return { success: true, map: pivotLangMapReadAll_() };
      }
    }
    sh.appendRow([lang, val]);
    logAuditEvent_(caller, "PIVOT_LANGMAP_ADD", lang + " -> " + val);
    return { success: true, map: pivotLangMapReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiRemovePivotLanguageMapping(langCode) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "pivot")) return { success: false, error: "Not authorized. Admin only." };

  var lang = String(langCode || "").trim().toLowerCase();
  try {
    var sh = pivotLangMapSheet_();
    var values = sh.getDataRange().getValues();
    for (var i = values.length - 1; i >= 1; i--) {
      if (String(values[i][0] || "").trim().toLowerCase() === lang) {
        sh.deleteRow(i + 1);
        logAuditEvent_(caller, "PIVOT_LANGMAP_REMOVE", lang);
      }
    }
    return { success: true, map: pivotLangMapReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}
