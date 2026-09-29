/**
 * PhraseStringsSync.gs
 *
 * Rueckweg fuer "Translate UI" (PhraseStrings.gs): Uebersetzungen, die in
 * Phrase Strings bearbeitet wurden, zurueck ins Portal holen - ohne neues
 * Deployment. Aehnlich dem OTA-Prinzip von Phrase: die Texte im Code
 * (I18N_DICTS_ / ADMIN_I18N_) bleiben die Grundlage, abweichende Texte aus
 * Phrase liegen als Uebersteuerung im Sheet "UiTranslations" (ACCESS) und
 * werden beim Ausliefern der Woerterbuecher darueber gelegt (psMergedDict_).
 *
 * Schutz: nur bekannte Keys (die im englischen Woerterbuch existieren), und
 * ein Text wird abgelehnt, wenn er Platzhalter wie {n} verliert/erfindet
 * oder HTML-Tags enthaelt, die der Originaltext nicht hat. So kann ein
 * Tippfehler in Phrase die App nicht kaputt machen oder Code einschleusen.
 *
 * Sheet "UiTranslations": Dict | Lang | Key | Text | Updated
 * Script Properties: PHRASE_STRINGS_NIGHTLY ("true" = naechtlicher Abgleich),
 *                    PHRASE_STRINGS_LAST_PULL (ISO-Zeitpunkt)
 */
var PS_OVR_SHEET_      = "UiTranslations";
var PS_OVR_CACHE_KEY_  = "ps_ovr_v1";
var PS_NIGHTLY_PROP_   = "PHRASE_STRINGS_NIGHTLY";
var PS_LAST_PULL_PROP_ = "PHRASE_STRINGS_LAST_PULL";
var PS_NIGHTLY_FN_     = "psNightlySync_";

// --- Reine Hilfsfunktionen (getestet) ----------------------------------------

/** Platzhalter wie {n}, {name} eines Textes (sortiert, ohne Duplikate). */
function psPlaceholders_(text) {
  var m = String(text || "").match(/\{[A-Za-z0-9_]+\}/g) || [];
  return m.filter(function (x, i) { return m.indexOf(x) === i; }).sort();
}

/** HTML-Tag-Namen eines Textes (klein, ohne Duplikate). */
function psTags_(text) {
  var out = [];
  String(text || "").replace(/<\/?\s*([A-Za-z][A-Za-z0-9-]*)/g, function (m, t) {
    t = t.toLowerCase();
    if (out.indexOf(t) < 0) out.push(t);
    return m;
  });
  return out.sort();
}

/**
 * Prueft einen Text aus Phrase gegen den Referenztext (englisches Original).
 * @return {string} "" = ok, sonst Grund der Ablehnung
 */
function psValidateText_(reference, value) {
  if (typeof value !== "string" || !value.trim()) return "leer";
  if (psPlaceholders_(reference).join() !== psPlaceholders_(value).join()) {
    return "Platzhalter passen nicht (erwartet: " + (psPlaceholders_(reference).join(" ") || "keine") + ")";
  }
  var allowed = psTags_(reference);
  var extra = psTags_(value).filter(function (t) { return allowed.indexOf(t) < 0; });
  if (extra.length) return "nicht erlaubtes HTML: <" + extra.join(">, <") + ">";
  if (/[<>]/.test(value) && !/[<>]/.test(reference)) return "nicht erlaubtes HTML";
  return "";
}

/**
 * Ermittelt die Uebersteuerungen fuer eine Sprache.
 * @param {Object} builtin  eingebautes Woerterbuch der Sprache
 * @param {Object} en       englisches Woerterbuch (bekannte Keys + Referenz)
 * @param {Object} pulled   aus Phrase geladenes { key: text }
 * @return {{overrides:Object, rejected:Array, unknown:number, received:number}}
 */
function psDiffOverrides_(builtin, en, pulled) {
  var res = { overrides: {}, rejected: [], unknown: 0, received: 0 };
  Object.keys(pulled || {}).forEach(function (k) {
    var v = pulled[k];
    if (typeof v !== "string") return;
    res.received++;
    if (!Object.prototype.hasOwnProperty.call(en || {}, k)) { res.unknown++; return; }
    if (v === (builtin || {})[k]) return;
    var why = psValidateText_(en[k], v);
    if (why) { res.rejected.push({ key: k, reason: why }); return; }
    res.overrides[k] = v;
  });
  return res;
}

/** Fehlende Uebersetzungen: Keys aus en, die in dict fehlen oder leer sind. */
function psMissingKeys_(en, dict) {
  return Object.keys(en || {}).filter(function (k) {
    return typeof en[k] === "string" && !(typeof (dict || {})[k] === "string" && dict[k].trim());
  }).sort();
}

// --- Uebersteuerungen lesen / schreiben -----------------------------------------

function psBuiltinDict_(which, lang) {
  var src = which === "admin"
    ? (typeof ADMIN_I18N_ !== "undefined" ? ADMIN_I18N_ : {})
    : (typeof I18N_DICTS_ !== "undefined" ? I18N_DICTS_ : {});
  return src[lang] || null;
}

function psOvrSheet_(create) {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(PS_OVR_SHEET_);
  if (!sh && create) {
    sh = ss.insertSheet(PS_OVR_SHEET_);
    sh.appendRow(["Dict", "Lang", "Key", "Text", "Updated"]);
    sh.getRange("A1:E1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Alle Uebersteuerungen { app: { de: {k:v} }, admin: {...} } (gecacht). */
function psReadOverrides_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(PS_OVR_CACHE_KEY_);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var out = { app: {}, admin: {} };
  var sh = psOvrSheet_(false);
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues().forEach(function (r) {
      var which = String(r[0] || "").trim(), lang = String(r[1] || "").trim(), key = String(r[2] || "").trim();
      if (!out[which] || !lang || !key || typeof r[3] !== "string" || !r[3]) return;
      (out[which][lang] = out[which][lang] || {})[key] = r[3];
    });
  }
  var json = JSON.stringify(out);
  if (json.length < 95000) { try { cache.put(PS_OVR_CACHE_KEY_, json, 21600); } catch (e) {} }
  return out;
}

/** Ersetzt die Uebersteuerungen einer Sprache eines Woerterbuchs. */
function psWriteOverrides_(which, lang, overrides) {
  var sh = psOvrSheet_(true);
  var last = sh.getLastRow();
  if (last > 1) {
    var rows = sh.getRange(2, 1, last - 1, 2).getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      if (String(rows[i][0]) === which && String(rows[i][1]) === lang) sh.deleteRow(i + 2);
    }
  }
  var now = new Date().toISOString();
  var add = Object.keys(overrides).sort().map(function (k) { return [which, lang, k, overrides[k], now]; });
  if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, 5).setValues(add);
  CacheService.getScriptCache().remove(PS_OVR_CACHE_KEY_);
}

/**
 * Woerterbuch inkl. Uebersteuerungen aus Phrase. Faellt bei jedem Fehler
 * still auf das eingebaute zurueck - die App muss immer starten.
 */
function psMergedDict_(which, lang) {
  var base = psBuiltinDict_(which, lang);
  if (!base) return null;
  try {
    var ovr = (psReadOverrides_()[which] || {})[lang];
    if (ovr && Object.keys(ovr).length) {
      var merged = {};
      Object.keys(base).forEach(function (k) { merged[k] = base[k]; });
      Object.keys(ovr).forEach(function (k) { merged[k] = ovr[k]; });
      return merged;
    }
  } catch (e) {
    console.warn("psMergedDict_: " + e.message);
  }
  return base;
}

// --- API fuer den Reiter ---------------------------------------------------------

/**
 * Laedt die Texte aus Phrase und speichert Abweichungen als Uebersteuerung.
 * @param {{dicts:string[], langs:string[]}} opts
 */
function apiPsPull(opts) {
  psAssertAdmin_();
  opts = opts || {};
  var s = psSettings_();
  var dicts = (opts.dicts || []).filter(function (d) { return PS_DICTS_[d]; });
  var langs = (opts.langs || []).filter(function (l) { return PS_LANGS_.indexOf(l) >= 0; });
  if (!dicts.length || !langs.length) throw new Error("Bitte mindestens ein Woerterbuch und eine Sprache waehlen.");
  var project = psResolveProject_(s);
  var pid = encodeURIComponent(project.id);
  var locales = psListLocales_(s, project.id);
  var results = [];
  langs.forEach(function (lang) {
    var loc = psFindLocale_(locales, lang);
    dicts.forEach(function (which) {
      var row = { lang: lang, dict: which, locale: loc ? loc.name : "" };
      results.push(row);
      if (!loc) { row.state = "no-locale"; return; }
      try {
        var pulled = psFetch_(s, "get", "/projects/" + pid + "/locales/" + encodeURIComponent(loc.id) +
          "/download?file_format=simple_json&tags=" + encodeURIComponent(PS_DICTS_[which])) || {};
        var d = psDiffOverrides_(psBuiltinDict_(which, lang) || {}, psBuiltinDict_(which, "en") || {}, pulled);
        psWriteOverrides_(which, lang, d.overrides);
        row.state = "success";
        row.received = d.received;
        row.overrides = Object.keys(d.overrides).length;
        row.rejected = d.rejected.slice(0, 20);
        row.rejectedCount = d.rejected.length;
      } catch (e) {
        row.state = "error";
        row.error = e.message;
      }
    });
  });
  PropertiesService.getScriptProperties().setProperty(PS_LAST_PULL_PROP_, new Date().toISOString());
  try { logAuditEvent_(getUserEmail_(), "PHRASE_STRINGS_PULL", dicts.join(",") + " / " + langs.join(",")); } catch (e) {}
  return { projectName: project.name, results: results };
}

/** Abdeckung pro Woerterbuch und Sprache (lokal, ohne Phrase-Aufruf). */
function apiPsCoverage() {
  psAssertAdmin_();
  var ovr = {};
  try { ovr = psReadOverrides_(); } catch (e) {}
  var out = {};
  Object.keys(PS_DICTS_).forEach(function (which) {
    var en = psBuiltinDict_(which, "en") || {};
    out[which] = {};
    PS_LANGS_.forEach(function (lang) {
      var missing = psMissingKeys_(en, psMergedDict_(which, lang) || {});
      out[which][lang] = {
        total: Object.keys(en).length,
        missing: missing.length,
        sample: missing.slice(0, 25),
        overrides: Object.keys((ovr[which] || {})[lang] || {}).length
      };
    });
  });
  return out;
}

/** Alle Uebersteuerungen verwerfen (zurueck zu den Texten im Code). */
function apiPsClearOverrides() {
  psAssertAdmin_();
  var sh = psOvrSheet_(false);
  if (sh && sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
  CacheService.getScriptCache().remove(PS_OVR_CACHE_KEY_);
  try { logAuditEvent_(getUserEmail_(), "PHRASE_STRINGS_CLEAR", "UiTranslations geleert"); } catch (e) {}
  return true;
}

/** Naechtlichen Abgleich ein-/ausschalten (taeglich ca. 02:00). */
function apiPsSetNightly(enabled) {
  psAssertAdmin_();
  psRemoveNightlyTrigger_();
  if (enabled) ScriptApp.newTrigger(PS_NIGHTLY_FN_).timeBased().atHour(2).everyDays(1).create();
  PropertiesService.getScriptProperties().setProperty(PS_NIGHTLY_PROP_, enabled ? "true" : "false");
  return psNightlyEnabled_();
}

function psRemoveNightlyTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === PS_NIGHTLY_FN_) ScriptApp.deleteTrigger(t);
  });
}

function psNightlyEnabled_() {
  if (PropertiesService.getScriptProperties().getProperty(PS_NIGHTLY_PROP_) !== "true") return false;
  return ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === PS_NIGHTLY_FN_; });
}

/**
 * Trigger: neue Keys hochladen (ohne Ueberschreiben), dann fertige
 * Uebersetzungen zurueckholen. Laeuft als Deploy-Konto, daher ohne
 * Admin-Pruefung ueber die internen Funktionen.
 */
function psNightlySync_() {
  var s = psSettings_();
  if (!s.token || !s.project) return;
  var all = { dicts: Object.keys(PS_DICTS_), langs: PS_LANGS_.slice() };
  // Beide Schritte unabhaengig: ein fehlgeschlagener Upload soll das
  // Zurueckholen fertiger Uebersetzungen nicht verhindern.
  psSystemRun_ = true;
  try {
    try { apiPsPush({ dicts: all.dicts, langs: all.langs, overwrite: false }); }
    catch (e) { console.error("Phrase Strings (naechtlich): Upload fehlgeschlagen: " + e.message); }
    try { apiPsPull(all); }
    catch (e) { console.error("Phrase Strings (naechtlich): Zurueckholen fehlgeschlagen: " + e.message); }
  } finally {
    psSystemRun_ = false;
  }
}
