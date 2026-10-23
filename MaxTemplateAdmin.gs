/**
 * MaxTemplateAdmin.gs
 * Admin-Regeln fuer das Maximaltemplate (Admin -> Subtab "Maximaltemplate",
 * Oberflaeche in MaxTemplateUi.html):
 *
 * 1. Auswahl einschraenken: je Liste (Basis-Vorlagen, MT-Profile, Clients,
 *    Business Units, Domains, Subdomains, Kostenstellen, Workflow-Schritte,
 *    TMs, Termbases, Provider, Prompts) legt der Admin fest, welche Eintraege
 *    im Dialog waehlbar sind. Fehlt eine Liste (null), ist alles erlaubt.
 *
 * 2. Weitere Phrase-Einstellungen (generisch): je Bereich (File Import,
 *    Pre-translate, Analyse, QA, Access & Security, Financial, eigene) ein
 *    API-Pfad am Projekt. Der Admin liest die Felder aus einem Referenzprojekt
 *    (GET), hakt an, welche im Dialog aenderbar sind, und kann erlaubte Werte
 *    vorgeben. Beim Einreichen: GET am neuen Projekt, geaenderte Felder
 *    setzen, PUT zurueck - Felder, die niemand anfasst, bleiben wie in der
 *    Vorlage.
 *
 * Speicherort: Sheet "MaxTemplate_Config" in ACCESS_SHEET_ID - Zelle A2 die
 * Regeln (JSON), ab Zeile 4 je Bereich die ausgelesenen Felder (A Bereich,
 * B Felder-JSON; nur fuer die Admin-Ansicht, eine Zelle fasst 50.000 Zeichen).
 * Nur der Server prueft verbindlich (maxTplEnforceConfig_ beim Einreichen);
 * der Dialog blendet Nicht-Erlaubtes nur aus.
 */
var MAXTPL_CONFIG_SHEET_ = "MaxTemplate_Config";

/** Listen, die der Admin einschraenken kann: Schluessel -> Feld in den Dialog-Einstellungen. */
var MAXTPL_LIST_KEYS_ = ["baseTemplates", "mtSettings", "clients", "businessUnits", "domains", "subDomains", "costCenters",
  "workflowSteps", "tms", "tbs", "providers", "prompts"];

/** Vorbelegte Bereiche. Pfad mit {uid} = Projekt-UID; der Admin kann Pfad/Version aendern. */
var MAXTPL_DEFAULT_SECTIONS_ = [
  { key: "importSettings", label: "File Import Settings", version: "v1", path: "/projects/{uid}/importSettings" },
  { key: "preTranslate", label: "Pre-translate", version: "v4", path: "/projects/{uid}/preTranslateSettings" },
  { key: "analyse", label: "Analyse", version: "v1", path: "/projects/{uid}/analyseSettings" },
  { key: "qa", label: "QA", version: "v1", path: "/projects/{uid}/qaSettings" },
  { key: "access", label: "Access & Security", version: "v1", path: "/projects/{uid}/accessSettings" },
  { key: "financial", label: "Financial", version: "v1", path: "/projects/{uid}/financialSettings" }
];

// --- Reine Helfer (getestet) -------------------------------------------------------

function maxTplCfgStr_(v, max) { return String(v == null ? "" : v).trim().slice(0, max || 200); }
function maxTplCfgId_(v) { var s = maxTplCfgStr_(v, 120); return /^[A-Za-z0-9_\-.:]+$/.test(s) ? s : ""; }
function maxTplCfgPath_(v) { var s = maxTplCfgStr_(v, 200); return /^[A-Za-z0-9_$]+(\.[A-Za-z0-9_$]+)*$/.test(s) ? s : ""; }

/** Admin-Konfiguration bereinigen (nur bekannte Felder, Grenzen). */
function maxTplSanitizeConfig_(cfg) {
  cfg = cfg || {};
  var out = { lists: {}, sections: [], referenceProject: maxTplCfgId_(cfg.referenceProject) };
  var lists = cfg.lists || {};
  MAXTPL_LIST_KEYS_.forEach(function (k) {
    if (!Array.isArray(lists[k])) return;
    out.lists[k] = lists[k].slice(0, 500).map(function (x) {
      if (k === "prompts") { var n = maxTplCfgStr_(x && typeof x === "object" ? x.name : x, 200); return n ? { id: n, name: n } : null; }
      var id = maxTplCfgId_(x && typeof x === "object" ? (x.id || x.uid) : x);
      if (!id) return null;
      var e = { id: id, name: maxTplCfgStr_(x && x.name, 200) };
      if (k === "providers") e.type = x && x.type === "VENDOR" ? "VENDOR" : "USER";
      return e;
    }).filter(Boolean);
  });
  var seen = {};
  (Array.isArray(cfg.sections) ? cfg.sections : []).slice(0, 30).forEach(function (s) {
    var key = maxTplCfgId_(s && s.key);
    var path = maxTplCfgStr_(s && s.path, 200);
    if (!key || seen[key] || !/^\/projects\/\{uid\}(\/[A-Za-z0-9_\-]+)+$/.test(path)) return;
    seen[key] = true;
    var version = /^v[1-9]$/.test(String(s.version)) ? String(s.version) : "v1";
    var fields = {};
    Object.keys(s.fields || {}).slice(0, 400).forEach(function (p) {
      var path2 = maxTplCfgPath_(p), f = s.fields[p] || {};
      if (!path2 || !f.editable) return;
      fields[path2] = {
        editable: true,
        type: ["boolean", "number", "string", "json"].indexOf(f.type) >= 0 ? f.type : "string",
        sample: maxTplCfgStr_(f.sample, 120),
        label: maxTplCfgStr_(f.label, 120),
        values: (Array.isArray(f.values) ? f.values : []).slice(0, 100).map(function (v) { return maxTplCfgStr_(v, 200); }).filter(function (v) { return v !== ""; })
      };
    });
    var schema = (Array.isArray(s.schema) ? s.schema : []).slice(0, 400).map(function (x) {
      var p = maxTplCfgPath_(x && x.path);
      var t = ["boolean", "number", "string", "json"].indexOf(x && x.type) >= 0 ? x.type : "string";
      return p ? { path: p, type: t, sample: maxTplCfgStr_(x.sample, 80) } : null;
    }).filter(Boolean);
    out.sections.push({ key: key, label: maxTplCfgStr_(s.label, 80) || key, version: version, path: path,
      enabled: s.enabled !== false, fields: fields, schema: schema });
  });
  return out;
}

/** Objekt -> Liste der Blaetter [{path, type, sample}]; Arrays sind ein Blatt (json). */
function maxTplFlatten_(obj, prefix, out) {
  out = out || [];
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return out;
  Object.keys(obj).forEach(function (k) {
    if (!/^[A-Za-z0-9_$]+$/.test(k)) return;
    var p = prefix ? prefix + "." + k : k;
    var v = obj[k];
    if (v !== null && typeof v === "object" && !Array.isArray(v)) { maxTplFlatten_(v, p, out); return; }
    var type = typeof v === "boolean" ? "boolean" : typeof v === "number" ? "number" : Array.isArray(v) ? "json" : "string";
    out.push({ path: p, type: type, sample: v === null || v === undefined ? "" : (type === "json" ? JSON.stringify(v) : String(v)).slice(0, 80) });
  });
  return out;
}

/** Wert an einem Punkt-Pfad setzen (fehlende Zwischenobjekte werden angelegt). */
function maxTplSetPath_(obj, path, value) {
  var parts = String(path).split(".");
  var cur = obj;
  for (var i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] === null || typeof cur[parts[i]] !== "object" || Array.isArray(cur[parts[i]])) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  return obj;
}

/** Ein Dialog-Wert passend zum Feldtyp; undefined = ungueltig. */
function maxTplCoerce_(type, v) {
  if (type === "boolean") return v === true || v === "true" ? true : v === false || v === "false" ? false : undefined;
  if (type === "number") { var n = Number(v); return v !== "" && v !== null && isFinite(n) ? n : undefined; }
  if (type === "json") {
    if (typeof v !== "string") return v === undefined ? undefined : v;
    try { return JSON.parse(v); } catch (e) { return undefined; }
  }
  return v === undefined || v === null ? undefined : String(v).slice(0, 2000);
}

/**
 * Dialog-Einstellungen gegen die Admin-Regeln pruefen. Nicht Erlaubtes wird
 * entfernt (dann gilt die Vorlage); removed nennt, was entfernt wurde.
 * ms muss schon durch maxTplSanitize_ gelaufen sein.
 */
function maxTplEnforceConfig_(ms, cfg) {
  var removed = [];
  var lists = (cfg && cfg.lists) || {};
  var ids = function (k) { return Array.isArray(lists[k]) ? lists[k].map(function (x) { return String(x.id); }) : null; };
  var only = function (k) { var a = ids(k); return function (v) { return !a || a.indexOf(String(v)) >= 0; }; };
  var single = function (field, listKey) {
    if (ms[field] && !only(listKey)(ms[field])) { removed.push(field); ms[field] = ""; }
  };
  single("mtSettingsUid", "mtSettings");
  single("client", "clients");
  single("businessUnit", "businessUnits");
  single("domain", "domains");
  single("subDomain", "subDomains");
  single("costCenter", "costCenters");
  if (ms.baseTemplateUid && !only("baseTemplates")(ms.baseTemplateUid)) removed.push("baseTemplateUid");
  var stepOk = only("workflowSteps");
  if (ms.workflowSteps.some(function (s) { return !stepOk(s); })) {
    removed.push("workflowSteps");
    ms.workflowSteps = ms.workflowSteps.filter(stepOk);
    Object.keys(ms.stepDue).forEach(function (s) { if (!stepOk(s)) delete ms.stepDue[s]; });
    Object.keys(ms.providers).forEach(function (s) { if (!stepOk(s)) delete ms.providers[s]; });
  }
  var provOk = only("providers");
  Object.keys(ms.providers).forEach(function (s) {
    Object.keys(ms.providers[s]).forEach(function (l) {
      var keep = ms.providers[s][l].filter(function (p) { return provOk(p.id); });
      if (keep.length !== ms.providers[s][l].length) removed.push("providers");
      if (keep.length) ms.providers[s][l] = keep; else delete ms.providers[s][l];
    });
    if (!Object.keys(ms.providers[s]).length) delete ms.providers[s];
  });
  var tmOk = only("tms"), tbOk = only("tbs");
  if (ms.tms.some(function (t) { return !tmOk(t.uid); })) { removed.push("tms"); ms.tms = ms.tms.filter(function (t) { return tmOk(t.uid); }); }
  if (ms.tbs.some(function (t) { return !tbOk(t.id); })) { removed.push("tbs"); ms.tbs = ms.tbs.filter(function (t) { return tbOk(t.id); }); }
  if (ms.promptName && !only("prompts")(ms.promptName)) { removed.push("prompt"); ms.prompt = ""; ms.promptName = ""; }

  // Weitere Phrase-Einstellungen: nur freigegebene Felder, Typ und erlaubte Werte.
  var extra = {};
  var secs = {};
  ((cfg && cfg.sections) || []).forEach(function (s) { if (s.enabled) secs[s.key] = s; });
  Object.keys(ms.extra || {}).forEach(function (key) {
    var sec = secs[key];
    var vals = ms.extra[key] || {};
    Object.keys(vals).forEach(function (p) {
      var f = sec && sec.fields[p];
      var v = f ? maxTplCoerce_(f.type, vals[p]) : undefined;
      var ok = v !== undefined && (!f.values.length || f.values.indexOf(typeof v === "object" ? JSON.stringify(v) : String(v)) >= 0);
      if (!ok) { removed.push(key + "." + p); return; }
      (extra[key] = extra[key] || {})[p] = v;
    });
  });
  ms.extra = extra;
  return { ms: ms, removed: removed.filter(function (x, i, a) { return a.indexOf(x) === i; }) };
}

/** Dialog-Werte fuer "Weitere Einstellungen" grob bereinigen (vor maxTplEnforceConfig_). */
function maxTplSanitizeExtra_(extra) {
  var out = {};
  Object.keys(extra || {}).slice(0, 30).forEach(function (key) {
    var k = maxTplCfgId_(key);
    if (!k || !extra[key] || typeof extra[key] !== "object") return;
    Object.keys(extra[key]).slice(0, 200).forEach(function (p) {
      var path = maxTplCfgPath_(p);
      var v = extra[key][p];
      if (!path || v === undefined || v === null || v === "") return;
      if (typeof v === "object") v = JSON.stringify(v);
      (out[k] = out[k] || {})[path] = typeof v === "string" ? v.slice(0, 5000) : v;
    });
  });
  return out;
}

/** Was der Dialog von der Konfiguration braucht (ohne Schema-Ballast). */
function maxTplDialogConfig_(cfg) {
  var secs = (cfg.sections || []).filter(function (s) { return s.enabled && Object.keys(s.fields).length; }).map(function (s) {
    return {
      key: s.key, label: s.label,
      fields: Object.keys(s.fields).map(function (p) {
        var f = s.fields[p];
        return { path: p, label: f.label || p, type: f.type, sample: f.sample, values: f.values };
      })
    };
  });
  return { lists: cfg.lists || {}, sections: secs };
}

// --- Speichern / Laden ----------------------------------------------------------------

function maxTplConfigSheet_(create) {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(MAXTPL_CONFIG_SHEET_);
  if (!sh && create) { sh = ss.insertSheet(MAXTPL_CONFIG_SHEET_); sh.getRange(1, 1).setValue("Config JSON (Admin -> Maximaltemplate)"); }
  return sh;
}

/** Gespeicherte Konfiguration (ohne Feldlisten); ohne Eintrag: keine Einschraenkung, Standard-Bereiche. */
function maxTplLoadConfig_() {
  var raw = "";
  try { var sh = maxTplConfigSheet_(false); if (sh) raw = String(sh.getRange(2, 1).getValue() || ""); } catch (e) { console.warn("MaxTemplate config: " + e.message); }
  var cfg = null;
  if (raw) { try { cfg = JSON.parse(raw); } catch (e) { console.warn("MaxTemplate config JSON: " + e.message); } }
  if (!cfg) cfg = { lists: {}, sections: MAXTPL_DEFAULT_SECTIONS_.map(function (s) { return Object.assign({ enabled: true, fields: {}, schema: [] }, s); }) };
  return maxTplSanitizeConfig_(cfg);
}

function maxTplRequireAdmin_() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized.");
  return caller;
}

/** Admin-Ansicht: Konfiguration + vollstaendige Kataloge zum Auswaehlen. */
/** Ausgelesene Felder je Bereich (Zeilen ab 4). */
function maxTplLoadSchemas_() {
  var out = {};
  try {
    var sh = maxTplConfigSheet_(false);
    if (!sh || sh.getLastRow() < 4) return out;
    sh.getRange(4, 1, sh.getLastRow() - 3, 2).getValues().forEach(function (r) {
      var k = String(r[0] || "").trim();
      if (!k) return;
      try { out[k] = JSON.parse(String(r[1] || "[]")); } catch (e) {}
    });
  } catch (e) { console.warn("MaxTemplate schemas: " + e.message); }
  return out;
}

function apiMaxTplAdminLoad() {
  try {
    maxTplRequireAdmin_();
    var cfg = maxTplLoadConfig_();
    var schemas = maxTplLoadSchemas_();
    cfg.sections.forEach(function (s) { s.schema = maxTplSanitizeConfig_({ sections: [{ key: s.key, path: s.path, schema: schemas[s.key] || [] }] }).sections[0].schema; });
    var tpls = readTemplates_();
    var bases = Object.keys(tpls).sort().map(function (k) { return { id: tpls[k].uid, name: k }; });
    var seen = {};
    bases = bases.filter(function (b) { if (seen[b.id]) return false; seen[b.id] = true; return true; });
    return {
      success: true,
      config: cfg,
      defaultSections: MAXTPL_DEFAULT_SECTIONS_,
      catalog: maxTplCatalog_(),
      baseTemplates: bases,
      prompts: maxTplPromptHub_("").prompts.map(function (p) { return { id: p.name, name: p.name }; })
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function apiMaxTplAdminSave(cfg) {
  try {
    var caller = maxTplRequireAdmin_();
    var clean = maxTplSanitizeConfig_(cfg);
    var schemaRows = clean.sections.map(function (s) {
      var json = JSON.stringify(s.schema);
      while (json.length > 49000 && s.schema.length) { s.schema = s.schema.slice(0, Math.floor(s.schema.length * 0.8)); json = JSON.stringify(s.schema); }
      return [s.key, json];
    });
    var rules = JSON.parse(JSON.stringify(clean));
    rules.sections.forEach(function (s) { s.schema = []; });
    var json = JSON.stringify(rules);
    if (json.length > 49000) return { success: false, error: "Regeln zu gross (" + json.length + " Zeichen). Bitte weniger Eintraege freigeben." };
    var sh = maxTplConfigSheet_(true);
    sh.getRange(2, 1).setValue(json);
    if (sh.getLastRow() >= 4) sh.getRange(4, 1, sh.getLastRow() - 3, 2).clearContent();
    sh.getRange(3, 1, 1, 2).setValues([["Bereich", "Felder aus dem Referenzprojekt (JSON)"]]);
    if (schemaRows.length) sh.getRange(4, 1, schemaRows.length, 2).setValues(schemaRows);
    try { logAuditEvent_(caller, "MAXTPL_CONFIG", "Maximaltemplate-Regeln gespeichert"); } catch (e) {}
    return { success: true, config: clean };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** Felder aus dem Referenzprojekt lesen: je Bereich {ok, error, schema}. */
function apiMaxTplAdminScan(projectUid, sections) {
  try {
    maxTplRequireAdmin_();
    var uid = maxTplCfgId_(projectUid);
    if (!uid) return { success: false, error: "Projekt-UID fehlt." };
    var clean = maxTplSanitizeConfig_({ sections: sections }).sections;
    var out = {};
    clean.forEach(function (s) {
      try {
        var res = maxTplGet_(maxTplSectionUrl_(s, uid));
        out[s.key] = { ok: true, schema: maxTplFlatten_(res).slice(0, 400) };
      } catch (e) {
        out[s.key] = { ok: false, error: e.message };
      }
    });
    return { success: true, results: out };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function maxTplSectionUrl_(s, projectUid) {
  var path = s.path.replace("{uid}", encodeURIComponent(projectUid));
  return getPhraseWebBaseUrl_() + "/api2/" + s.version + path;
}

/** Nach dem Anlegen: freigegebene Felder je Bereich setzen (GET, aendern, PUT). */
function maxTplApplyExtraSections_(projectUid, ms, put, warn) {
  var extra = ms.extra || {};
  if (!Object.keys(extra).length) return;
  var cfg = maxTplLoadConfig_();
  cfg.sections.forEach(function (s) {
    var vals = extra[s.key];
    if (!s.enabled || !vals || !Object.keys(vals).length) return;
    try {
      var url = maxTplSectionUrl_(s, projectUid);
      var cur = maxTplGet_(url) || {};
      Object.keys(vals).forEach(function (p) { maxTplSetPath_(cur, p, vals[p]); });
      put(url, cur);
    } catch (e) { warn(s.label, e); }
  });
}
