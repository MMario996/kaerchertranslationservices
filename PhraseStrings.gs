/**
 * PhraseStrings.gs
 *
 * Admin-Reiter "Translate UI": laedt die UI-Woerterbuecher der App
 * (I18N_DICTS_ aus I18nDicts.gs) und des Admin-Bereichs (ADMIN_I18N_ aus
 * AdminI18n.gs) per Phrase-Strings-API in ein Strings-Projekt.
 *
 * - Pro Sprache und Woerterbuch ein Upload im Format "simple_json" (flaches
 *   { key: text }). Phrase legt fehlende Keys an und fuellt leere
 *   Uebersetzungen; vorhandene Uebersetzungen werden nur ueberschrieben, wenn
 *   "overwrite" gesetzt ist (update_translations).
 * - Fehlende Sprachen (Locales) werden im Projekt angelegt.
 * - Die Keys bekommen die Tags "ui-app" bzw. "ui-admin" - so lassen sich die
 *   beiden Woerterbuecher in Phrase filtern.
 *
 * Konfiguration (Script Properties, im Reiter gepflegt):
 *   PHRASE_STRINGS_TOKEN    Access Token (Phrase: Profil > Access Tokens, Scope read+write)
 *   PHRASE_STRINGS_PROJECT  Projekt-ID, Slug oder Name (z.B. "translationservices")
 *   PHRASE_STRINGS_REGION   "eu" (api.phrase.com) oder "us" (api.us.app.phrase.com)
 * Der Token getrennt vom Phrase-TMS-Token (PHRASE_API_TOKEN): anderes Produkt.
 */
var PS_TOKEN_PROP_   = "PHRASE_STRINGS_TOKEN";
var PS_PROJECT_PROP_ = "PHRASE_STRINGS_PROJECT";
var PS_REGION_PROP_  = "PHRASE_STRINGS_REGION";
var PS_LANGS_        = ["de", "en", "fr", "es", "pt", "zh"];
var PS_DICTS_        = { app: "ui-app", admin: "ui-admin" };

function psAssertAdmin_() {
  if (!isAdmin_(getUserEmail_())) throw new Error("Not authorized.");
}

function psBaseUrl_(region) {
  return region === "us" ? "https://api.us.app.phrase.com/v2" : "https://api.phrase.com/v2";
}

function psSettings_() {
  var props = PropertiesService.getScriptProperties();
  return {
    token:   String(props.getProperty(PS_TOKEN_PROP_) || "").trim(),
    project: String(props.getProperty(PS_PROJECT_PROP_) || "").trim(),
    region:  String(props.getProperty(PS_REGION_PROP_) || "eu").trim() === "us" ? "us" : "eu"
  };
}

/** Das Woerterbuch einer Sprache als { key: text } (nur Strings, sortiert). */
function psDict_(which, lang) {
  var src = which === "admin"
    ? (typeof ADMIN_I18N_ !== "undefined" ? ADMIN_I18N_ : {})
    : (typeof I18N_DICTS_ !== "undefined" ? I18N_DICTS_ : {});
  var d = src[lang] || {};
  var out = {};
  Object.keys(d).sort().forEach(function (k) {
    if (typeof d[k] === "string") out[k] = d[k];
  });
  return out;
}

/**
 * Passende Phrase-Locale fuer einen Sprachcode: zuerst exakt (Name oder Code),
 * dann Regionalvariante ("de-DE", "zh_CN"). Reine Funktion (getestet).
 */
function psFindLocale_(locales, lang) {
  var l = String(lang || "").toLowerCase();
  var norm = function (s) { return String(s || "").toLowerCase().replace("_", "-"); };
  var list = locales || [];
  var exact = list.filter(function (x) { return norm(x.code) === l || norm(x.name) === l; })[0];
  if (exact) return exact;
  return list.filter(function (x) {
    return norm(x.code).indexOf(l + "-") === 0 || norm(x.name).indexOf(l + "-") === 0;
  })[0] || null;
}

function psFetch_(s, method, path, payload, isJson) {
  var opts = {
    method: method,
    muteHttpExceptions: true,
    headers: { Authorization: "token " + s.token, "User-Agent": "Kaercher Translation Services (Apps Script)" }
  };
  if (payload) {
    if (isJson) { opts.contentType = "application/json"; opts.payload = JSON.stringify(payload); }
    else opts.payload = payload; // Objekt mit Blob -> multipart/form-data
  }
  for (var attempt = 0; attempt < 4; attempt++) {
    var res = UrlFetchApp.fetch(psBaseUrl_(s.region) + path, opts);
    var code = res.getResponseCode();
    if (code === 429) { Utilities.sleep(2000 * Math.pow(2, attempt)); continue; }
    var text = res.getContentText();
    var body = null;
    try { body = text ? JSON.parse(text) : null; } catch (e) { body = null; }
    if (code >= 400) {
      var msg = (body && (body.message || (body.errors && JSON.stringify(body.errors)))) || text || ("HTTP " + code);
      var err = new Error("Phrase Strings " + code + ": " + String(msg).slice(0, 300));
      err.httpCode = code;
      throw err;
    }
    return body;
  }
  throw new Error("Phrase Strings: Rate Limit (429) - bitte spaeter erneut versuchen.");
}

/** Projekt ueber ID/Slug oder Namen finden. */
function psResolveProject_(s) {
  if (!s.token) throw new Error("Kein Phrase-Strings-Token gespeichert.");
  if (!s.project) throw new Error("Kein Phrase-Strings-Projekt angegeben.");
  try {
    return psFetch_(s, "get", "/projects/" + encodeURIComponent(s.project));
  } catch (e) {
    if (e.httpCode !== 404) throw e;
  }
  var want = s.project.toLowerCase();
  var list = psFetch_(s, "get", "/projects?per_page=100&q=" + encodeURIComponent("name:" + s.project)) || [];
  var hit = list.filter(function (p) {
    return String(p.name || "").toLowerCase() === want || String(p.slug || "").toLowerCase() === want;
  })[0] || (list.length === 1 ? list[0] : null);
  if (!hit) throw new Error("Projekt \"" + s.project + "\" nicht gefunden (ID, Slug oder exakter Name).");
  return hit;
}

function psListLocales_(s, projectId) {
  var all = [];
  for (var page = 1; page <= 10; page++) {
    var batch = psFetch_(s, "get", "/projects/" + encodeURIComponent(projectId) + "/locales?per_page=100&page=" + page) || [];
    all = all.concat(batch);
    if (batch.length < 100) break;
  }
  return all;
}

// --- API fuer den Reiter -----------------------------------------------------

function apiPsGetConfig() {
  psAssertAdmin_();
  var s = psSettings_();
  var counts = {};
  Object.keys(PS_DICTS_).forEach(function (which) {
    counts[which] = {};
    PS_LANGS_.forEach(function (l) { counts[which][l] = Object.keys(psDict_(which, l)).length; });
  });
  return { project: s.project, region: s.region, hasToken: !!s.token, langs: PS_LANGS_, counts: counts };
}

function apiPsSaveConfig(project, region, token) {
  psAssertAdmin_();
  var props = PropertiesService.getScriptProperties();
  props.setProperty(PS_PROJECT_PROP_, String(project || "").trim());
  props.setProperty(PS_REGION_PROP_, region === "us" ? "us" : "eu");
  if (String(token || "").trim()) props.setProperty(PS_TOKEN_PROP_, String(token).trim());
  return apiPsGetConfig();
}

/** Verbindung pruefen: Projekt + vorhandene Sprachen + Zuordnung. */
function apiPsCheck() {
  psAssertAdmin_();
  var s = psSettings_();
  var project = psResolveProject_(s);
  var locales = psListLocales_(s, project.id);
  var mapping = PS_LANGS_.map(function (l) {
    var loc = psFindLocale_(locales, l);
    return { lang: l, locale: loc ? (loc.name + (loc.code && loc.code !== loc.name ? " (" + loc.code + ")" : "")) : "" };
  });
  return { projectId: project.id, projectName: project.name, locales: locales.length, mapping: mapping };
}

/**
 * Laedt die Woerterbuecher hoch.
 * @param {{dicts:string[], langs:string[], overwrite:boolean}} opts
 */
function apiPsPush(opts) {
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
    var created = false;
    if (!loc) {
      loc = psFetch_(s, "post", "/projects/" + pid + "/locales", { name: lang, code: lang }, true);
      locales.push(loc);
      created = true;
    }
    dicts.forEach(function (which) {
      var dict = psDict_(which, lang);
      var n = Object.keys(dict).length;
      var row = { lang: lang, dict: which, locale: loc.name, localeCreated: created, keys: n };
      results.push(row);
      if (!n) { row.state = "skipped"; return; }
      var blob = Utilities.newBlob(JSON.stringify(dict, null, 2), "application/json", which + "-" + lang + ".json");
      try {
        var up = psFetch_(s, "post", "/projects/" + pid + "/uploads", {
          file: blob,
          file_format: "simple_json",
          locale_id: loc.id,
          tags: PS_DICTS_[which],
          update_translations: opts.overwrite ? "true" : "false",
          skip_upload_tags: "true",
          skip_automated_job_creation: "true"
        });
        row.uploadId = up.id;
        row.state = up.state;
        row.summary = up.summary || null;
      } catch (e) {
        row.state = "error";
        row.error = e.message;
      }
    });
  });

  // Uploads laufen bei Phrase asynchron - kurz auf das Ergebnis warten.
  var deadline = Date.now() + 60000;
  var pending = function () { return results.filter(function (r) { return r.uploadId && (r.state === "initialized" || r.state === "processing"); }); };
  while (pending().length && Date.now() < deadline) {
    Utilities.sleep(2000);
    pending().forEach(function (r) {
      try {
        var u = psFetch_(s, "get", "/projects/" + pid + "/uploads/" + encodeURIComponent(r.uploadId));
        r.state = u.state;
        r.summary = u.summary || r.summary;
        if (u.error_message) r.error = u.error_message;
      } catch (e) { r.error = e.message; }
    });
  }
  try { logAuditEvent_(getUserEmail_(), "PHRASE_STRINGS_PUSH", dicts.join(",") + " / " + langs.join(",")); } catch (e) {}
  return { projectName: project.name, projectId: project.id, results: results };
}

/** Admin-Reiter "Translate UI" (HTML + JS), nachgeladen wie Pivot Templates. */
function apiGetTranslateUiContent() {
  psAssertAdmin_();
  return {
    html: HtmlService.createHtmlOutputFromFile("TranslateUi").getContent()
      .replace(/<script>[\s\S]*<\/script>/, ""),
    js: (HtmlService.createHtmlOutputFromFile("TranslateUi").getContent().match(/<script>([\s\S]*)<\/script>/) || ["", ""])[1]
  };
}
