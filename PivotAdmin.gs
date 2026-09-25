/**
 * PivotAdmin.gs
 *
 * Server-Seite der ueberarbeiteten Admin-Seite "Pivot Templates":
 *  - alle Phrase-Projekt-Templates fuer die Suche im Browser (statt UIDs
 *    von Hand einzutippen), gecacht
 *  - Verknuepfungen im Paket anlegen / entfernen (Batch, Massen-Import)
 *  - Namen und Sprachen aller Verknuepfungen aus Phrase aktualisieren
 *  - Sprachen-Mapping im Paket speichern
 *
 * Die Datenhaltung (Sheets "PivotTemplateLinks" / "PivotLanguageMap") bleibt
 * unveraendert, siehe PivotTemplateLinks.gs und PivotLanguageMap.gs.
 */
var PIVOT_TPL_CACHE_KEY_ = "pivot_all_templates_v1";
var PIVOT_TPL_CACHE_CHUNK_ = 90000; // CacheService: max. 100 KB je Eintrag

function canManagePivot_(email) {
  return isAdmin_(email) || isAdminLightWithAccess_(email, "pivot");
}

/** Liest die Template-Liste aus dem (in Stuecke geteilten) Script-Cache. */
function pivotTplCacheGet_() {
  var cache = CacheService.getScriptCache();
  var head = cache.get(PIVOT_TPL_CACHE_KEY_ + "_n");
  if (!head) return null;
  var n = Number(head);
  var keys = [];
  for (var i = 0; i < n; i++) keys.push(PIVOT_TPL_CACHE_KEY_ + "_" + i);
  var parts = cache.getAll(keys);
  var json = "";
  for (var k = 0; k < n; k++) {
    var part = parts[PIVOT_TPL_CACHE_KEY_ + "_" + k];
    if (part === undefined || part === null) return null;
    json += part;
  }
  try { return JSON.parse(json); } catch (e) { return null; }
}

function pivotTplCachePut_(list) {
  var json = JSON.stringify(list);
  var map = {};
  var n = Math.ceil(json.length / PIVOT_TPL_CACHE_CHUNK_) || 1;
  for (var i = 0; i < n; i++) map[PIVOT_TPL_CACHE_KEY_ + "_" + i] = json.substr(i * PIVOT_TPL_CACHE_CHUNK_, PIVOT_TPL_CACHE_CHUNK_);
  map[PIVOT_TPL_CACHE_KEY_ + "_n"] = String(n);
  try { CacheService.getScriptCache().putAll(map, 21600); } catch (e) { console.warn("pivotTplCachePut_: " + e.message); }
}

/** Alle Projekt-Templates aus Phrase als schlanke Liste (gecacht, 6 h). */
function pivotAllTemplates_(forceRefresh) {
  if (!forceRefresh) {
    var cached = pivotTplCacheGet_();
    if (cached) return cached;
  }
  var list = fetchAllTemplatesFromPhrase_().map(function (t) {
    return {
      uid: String(t.uid || t.id || ""),
      name: String(t.templateName || t.name || ""),
      sourceLang: String(t.sourceLang || ""),
      targetLangs: Array.isArray(t.targetLangs) ? t.targetLangs : []
    };
  }).filter(function (t) { return t.uid; });
  list.sort(function (a, b) { return a.name.localeCompare(b.name); });
  pivotTplCachePut_(list);
  return list;
}

function apiPivotListTemplates(forceRefresh) {
  var caller = getUserEmail_();
  if (!canManagePivot_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    return { success: true, templates: pivotAllTemplates_(!!forceRefresh) };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/** Template-Details: zuerst aus der gecachten Liste, sonst direkt aus Phrase. */
function pivotTplDetails_(uid, byUid) {
  if (byUid[uid]) return byUid[uid];
  var d = phraseGetProjectTemplateDetails_(uid, true);
  if (d) byUid[uid] = d;
  return d;
}

/**
 * Legt mehrere Verknuepfungen auf einmal an.
 * @param {Array<{parentUid:string, childUid:string}>} pairs
 * @return {{success:boolean, results:Array, links:Array}}
 */
function apiAddPivotTemplateLinksBatch(pairs) {
  var caller = getUserEmail_();
  if (!canManagePivot_(caller)) return { success: false, error: "Not authorized. Admin only." };
  if (!Array.isArray(pairs) || !pairs.length) return { success: false, error: "Keine Verknuepfungen uebergeben." };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var byUid = {};
    try { pivotAllTemplates_(false).forEach(function (t) { byUid[t.uid] = t; }); } catch (e) {}

    var existing = pivotLinksReadAll_();
    var seen = {};
    existing.forEach(function (r) { seen[r.parentUid + "|" + r.childUid] = true; });

    var rowsToAppend = [];
    var results = pairs.map(function (p) {
      var parentUid = String((p && p.parentUid) || "").trim();
      var childUid = String((p && p.childUid) || "").trim();
      var res = { parentUid: parentUid, childUid: childUid, ok: false, error: "" };
      if (!parentUid || !childUid) { res.error = "Parent und Child sind Pflicht."; return res; }
      if (parentUid === childUid) { res.error = "Parent und Child sind identisch."; return res; }
      if (seen[parentUid + "|" + childUid]) { res.error = "Existiert bereits."; return res; }
      var parent = pivotTplDetails_(parentUid, byUid);
      if (!parent) { res.error = "Parent-Template nicht in Phrase gefunden."; return res; }
      var child = pivotTplDetails_(childUid, byUid);
      if (!child) { res.error = "Child-Template nicht in Phrase gefunden."; return res; }
      if (!child.targetLangs.length) { res.error = "Child-Template hat keine Zielsprachen."; return res; }
      seen[parentUid + "|" + childUid] = true;
      rowsToAppend.push([parentUid, parent.name, childUid, child.name, child.sourceLang, child.targetLangs.join(", ")]);
      res.ok = true;
      res.parentName = parent.name;
      res.childName = child.name;
      return res;
    });

    if (rowsToAppend.length) {
      var sh = pivotLinksSheet_();
      sh.getRange(sh.getLastRow() + 1, 1, rowsToAppend.length, 6).setValues(rowsToAppend);
      logAuditEvent_(caller, "PIVOT_LINK_ADD_BATCH", rowsToAppend.length + " Verknuepfung(en): " +
        rowsToAppend.map(function (r) { return r[1] + " -> " + r[3]; }).join("; ").slice(0, 900));
    }
    return { success: true, results: results, added: rowsToAppend.length, links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  } finally {
    lock.releaseLock();
  }
}

/** Entfernt mehrere Verknuepfungen auf einmal. */
function apiRemovePivotTemplateLinksBatch(pairs) {
  var caller = getUserEmail_();
  if (!canManagePivot_(caller)) return { success: false, error: "Not authorized. Admin only." };
  if (!Array.isArray(pairs) || !pairs.length) return { success: false, error: "Keine Verknuepfungen uebergeben." };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var drop = {};
    pairs.forEach(function (p) { drop[String(p.parentUid || "").trim() + "|" + String(p.childUid || "").trim()] = true; });
    var sh = pivotLinksSheet_();
    var values = sh.getDataRange().getValues();
    var removed = 0;
    for (var i = values.length - 1; i >= 1; i--) {
      var key = String(values[i][0] || "").trim() + "|" + String(values[i][2] || "").trim();
      if (drop[key]) { sh.deleteRow(i + 1); removed++; }
    }
    if (removed) logAuditEvent_(caller, "PIVOT_LINK_REMOVE_BATCH", removed + " Verknuepfung(en) entfernt");
    return { success: true, removed: removed, links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Holt Namen, Ausgangs- und Zielsprachen aller verknuepften Templates frisch
 * aus Phrase und schreibt sie ins Sheet. Liefert die UIDs, die Phrase nicht
 * mehr kennt.
 */
function apiRefreshPivotLinkDetails() {
  var caller = getUserEmail_();
  if (!canManagePivot_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    var byUid = {};
    pivotAllTemplates_(true).forEach(function (t) { byUid[t.uid] = t; });
    var sh = pivotLinksSheet_();
    var values = sh.getDataRange().getValues();
    var missing = {};
    var updated = 0;
    for (var i = 1; i < values.length; i++) {
      var parentUid = String(values[i][0] || "").trim();
      var childUid = String(values[i][2] || "").trim();
      if (!parentUid || !childUid) continue;
      var p = byUid[parentUid], c = byUid[childUid];
      if (!p) missing[parentUid] = true;
      if (!c) missing[childUid] = true;
      var row = [
        parentUid, p ? p.name : values[i][1],
        childUid, c ? c.name : values[i][3],
        c ? c.sourceLang : values[i][4], c ? c.targetLangs.join(", ") : values[i][5]
      ];
      var changed = row.some(function (v, k) { return String(v) !== String(values[i][k]); });
      if (changed) { sh.getRange(i + 1, 1, 1, 6).setValues([row]); updated++; }
    }
    return { success: true, updated: updated, missing: Object.keys(missing), links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Speichert mehrere Sprach-Zuordnungen auf einmal. Ein leerer Options-Wert
 * entfernt die Zuordnung.
 * @param {Array<{langCode:string, optionValue:string}>} entries
 */
function apiSetPivotLanguageMappingsBatch(entries) {
  var caller = getUserEmail_();
  if (!canManagePivot_(caller)) return { success: false, error: "Not authorized. Admin only." };
  if (!Array.isArray(entries)) return { success: false, error: "Ungueltige Daten." };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var wanted = {};
    entries.forEach(function (e) {
      var lang = String((e && e.langCode) || "").trim();
      if (lang) wanted[lang.toLowerCase()] = { lang: lang, value: String(e.optionValue || "").trim() };
    });
    var sh = pivotLangMapSheet_();
    var values = sh.getDataRange().getValues();
    var changes = [];
    for (var i = values.length - 1; i >= 1; i--) {
      var key = String(values[i][0] || "").trim().toLowerCase();
      if (!wanted[key]) continue;
      var w = wanted[key];
      if (!w.value) { sh.deleteRow(i + 1); changes.push(w.lang + " -> (entfernt)"); }
      else if (String(values[i][1] || "").trim() !== w.value) { sh.getRange(i + 1, 2).setValue(w.value); changes.push(w.lang + " -> " + w.value); }
      delete wanted[key];
    }
    var appendRows = [];
    Object.keys(wanted).forEach(function (k) {
      if (wanted[k].value) { appendRows.push([wanted[k].lang, wanted[k].value]); changes.push(wanted[k].lang + " -> " + wanted[k].value); }
    });
    if (appendRows.length) sh.getRange(sh.getLastRow() + 1, 1, appendRows.length, 2).setValues(appendRows);
    if (changes.length) logAuditEvent_(caller, "PIVOT_LANGMAP_BATCH", changes.join("; ").slice(0, 900));
    return { success: true, changed: changes.length, map: pivotLangMapReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  } finally {
    lock.releaseLock();
  }
}
