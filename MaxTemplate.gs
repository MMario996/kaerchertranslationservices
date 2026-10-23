/**
 * MaxTemplate.gs
 * "Maximaltemplate": eigener Eintrag im Vorlagen-Dropdown (Marketing Projects).
 * Statt einer festen Phrase-Vorlage oeffnet sich ein XXL-Dialog
 * (MaxTemplateUi.html, nachgeladen), in dem alles einstellbar ist:
 *   - Basis-Vorlage (liefert die Standardwerte; applyTemplate braucht eine Vorlage)
 *   - Workflow-Schritte (an/aus) und Frist je Schritt
 *   - Provider je Schritt und Zielsprache (Phrase-User oder Vendor)
 *   - Projekt-Einstellungen: Client, Business Unit, Domain, Subdomain, Cost Center
 *   - Translation Memories (lesen/schreiben/Penalty) und Termbases (lesen/schreiben/QA)
 *   - Maschinelle Uebersetzung (MT-Einstellung)
 *   - Prompt: bestehender Prompt der Vorlage aus dem Prompt-Hub einblenden,
 *     anderen Prompt waehlen oder frei bearbeiten; Link zum Prompt-Hub.
 *
 * Angewendet wird das beim Einreichen (Upload.gs createProjectAndUploadAs_):
 *   maxTplApplyTemplateFields_   -> Felder fuer POST v2/projects/applyTemplate
 *   maxTplJobWorkflowSettings_   -> Provider im Memsource-Header beim Job-Upload
 *   maxTplApplyProjectSettings_  -> TMs, TBs, MT, Prompt nach dem Anlegen
 * Fehler einzelner Einstellungen blockieren die Einreichung nicht, sie stehen
 * als Hinweis im Ergebnis (errors) und im Protokoll.
 *
 * Prompt-Hub: Sheet "Prompt_Hub" in ACCESS_SHEET_ID
 *   Spalten: Name | Prompt | Template UIDs (kommagetrennt, optional) | Link | Active (yes/no)
 * Script Properties:
 *   PROMPT_HUB_URL       Link "Prompt-Hub oeffnen" im Dialog
 *   MAXTPL_PROMPT_FIELD  Custom Field fuer den Prompt (Standard "AI Prompt");
 *                        fehlt das Feld in Phrase, wird der Prompt an die Projektnotiz gehaengt
 *   MAXTPL_PORTALS       Bereiche mit Maximaltemplate (Standard "marketing")
 * Admin-Regeln (erlaubte Werte, weitere Phrase-Einstellungen): MaxTemplateAdmin.gs
 */
var MAXTPL_NAME_ = "Maximaltemplate";
var PROMPT_HUB_SHEET_NAME_ = "Prompt_Hub";

function maxTplPortals_() {
  return String(PropertiesService.getScriptProperties().getProperty("MAXTPL_PORTALS") || "marketing")
    .toLowerCase().split(/[\s,;]+/).filter(Boolean);
}

// --- Reine Helfer (getestet) -------------------------------------------------------

/** Einstellungen aus dem Dialog bereinigen (nur bekannte Felder, Grenzen). */
function maxTplSanitize_(ms) {
  ms = ms || {};
  var str = function (v, max) { return String(v == null ? "" : v).trim().slice(0, max || 120); };
  var id = function (v) { var s = str(v, 120); return /^[A-Za-z0-9_\-.:]+$/.test(s) ? s : ""; };
  var lang = function (v) { var s = str(v, 20).toLowerCase(); return /^[a-z]{2,3}([_-][a-z0-9]{2,8})*$/.test(s) ? s : ""; };
  var day = function (v) { var s = str(v, 30); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s : ""; };
  var out = {
    baseTemplateUid: id(ms.baseTemplateUid),
    workflowSteps: (Array.isArray(ms.workflowSteps) ? ms.workflowSteps : []).map(id).filter(Boolean).slice(0, 20),
    stepDue: {},
    providers: {},
    client: id(ms.client), businessUnit: id(ms.businessUnit), domain: id(ms.domain),
    subDomain: id(ms.subDomain), costCenter: id(ms.costCenter),
    tmsOverride: ms.tmsOverride === true,
    tms: (Array.isArray(ms.tms) ? ms.tms : []).slice(0, 20).map(function (t) {
      var p = Math.max(0, Math.min(100, Number(t && t.penalty) || 0));
      return { uid: id(t && t.uid), name: str(t && t.name, 200), read: !(t && t.read === false), write: !!(t && t.write), penalty: p };
    }).filter(function (t) { return t.uid; }),
    tbsOverride: ms.tbsOverride === true,
    tbs: (Array.isArray(ms.tbs) ? ms.tbs : []).slice(0, 20).map(function (t) {
      return { id: id(t && t.id), name: str(t && t.name, 200), read: !(t && t.read === false), write: !!(t && t.write), qa: !!(t && t.qa) };
    }).filter(function (t) { return t.id; }),
    mtSettingsUid: id(ms.mtSettingsUid),
    prompt: str(ms.prompt, 20000),
    promptName: str(ms.promptName, 200),
    extra: maxTplSanitizeExtra_(ms.extra)
  };
  Object.keys(ms.stepDue || {}).forEach(function (k) {
    var s = id(k), d = day(ms.stepDue[k]);
    if (s && d && out.workflowSteps.indexOf(s) >= 0) out.stepDue[s] = d;
  });
  Object.keys(ms.providers || {}).forEach(function (step) {
    var s = id(step);
    if (!s || out.workflowSteps.indexOf(s) < 0) return;
    var perLang = ms.providers[step] || {};
    Object.keys(perLang).forEach(function (l) {
      var lc = lang(l);
      if (!lc) return;
      var list = (Array.isArray(perLang[l]) ? perLang[l] : []).slice(0, 10).map(function (p) {
        return { type: p && p.type === "VENDOR" ? "VENDOR" : "USER", id: id(p && p.id), name: str(p && p.name, 200) };
      }).filter(function (p) { return p.id; });
      if (!list.length) return;
      (out.providers[s] = out.providers[s] || {})[lc] = list;
    });
  });
  // Nur ein schreibendes TM/TB.
  var w = false;
  out.tms.forEach(function (t) { if (t.write) { if (w) t.write = false; w = true; } });
  w = false;
  out.tbs.forEach(function (t) { if (t.write) { if (w) t.write = false; w = true; } });
  return out;
}

/** Felder fuer applyTemplate (v2). Uebersteuern die Basis-Vorlage. */
function maxTplApplyTemplateFields_(payload, ms) {
  if (!ms) return payload;
  if (ms.workflowSteps && ms.workflowSteps.length) payload.workflowSteps = ms.workflowSteps.map(function (s) { return { id: s }; });
  ["client", "businessUnit", "domain", "subDomain", "costCenter"].forEach(function (k) {
    if (ms[k]) payload[k] = { id: ms[k] };
  });
  return payload;
}

/** workflowSettings fuer den Memsource-Header beim Job-Upload (Provider, Frist je Schritt). */
function maxTplJobWorkflowSettings_(ms, langs) {
  if (!ms) return [];
  var want = (langs || []).map(function (l) { return String(l).toLowerCase(); });
  var out = [];
  (ms.workflowSteps || []).forEach(function (step) {
    var entry = { id: step };
    var perLang = (ms.providers || {})[step] || {};
    var assignments = [];
    (langs || []).forEach(function (l, i) {
      var list = perLang[want[i]];
      if (list && list.length) assignments.push({ targetLang: l, providers: list.map(function (p) { return { type: p.type, id: p.id }; }) });
    });
    if (assignments.length) entry.assignments = assignments;
    if ((ms.stepDue || {})[step]) entry.due = new Date(ms.stepDue[step].length === 10 ? ms.stepDue[step] + "T12:00:00" : ms.stepDue[step]).toISOString();
    if (entry.assignments || entry.due) out.push(entry);
  });
  return out;
}

/** Body fuer PUT v3/projects/{uid}/transMemories. */
function maxTplTmBody_(tms) {
  return {
    dataPerContext: [{
      transMemories: (tms || []).map(function (t) {
        return { transMemory: { uid: t.uid }, readMode: t.read, writeMode: t.write, penalty: t.penalty, applyPenaltyTo101Only: false };
      }),
      orderEnabled: true
    }]
  };
}

/** Body fuer PUT v1/projects/{uid}/termBases. */
function maxTplTbBody_(tbs) {
  var body = {
    readTermBases: (tbs || []).filter(function (t) { return t.read; }).map(function (t) { return { id: t.id }; }),
    qualityAssuranceTermBases: (tbs || []).filter(function (t) { return t.qa; }).map(function (t) { return { id: t.id }; })
  };
  var w = (tbs || []).filter(function (t) { return t.write; })[0];
  if (w) body.writeTermBase = { id: w.id };
  return body;
}

/** Prompt-Hub-Zeilen -> Eintraege; Vorlagen-Prompt = erster Eintrag mit passender UID. */
function maxTplParsePromptHub_(rows, templateUid) {
  var prompts = [];
  var forTemplate = null;
  (rows || []).forEach(function (r, i) {
    if (i === 0) return;
    var name = String(r[0] || "").trim();
    var text = String(r[1] || "").trim();
    if (!name || !text) return;
    if (r.length > 4 && String(r[4] || "").trim() && String(r[4]).trim().toLowerCase() !== "yes") return;
    var uids = String(r[2] || "").split(/[\s,;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    var p = { name: name, prompt: text, templateUids: uids, link: String(r[3] || "").trim() };
    prompts.push(p);
    if (!forTemplate && templateUid && uids.indexOf(templateUid) >= 0) forTemplate = p;
  });
  return { prompts: prompts, forTemplate: forTemplate };
}

// --- Phrase-Kataloge (gecacht) ------------------------------------------------------------

function maxTplGet_(url) {
  return phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
}

function maxTplCached_(key, seconds, fn) {
  var cache = phraseScriptCache_();
  var hit = cache.get(key);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var val = fn();
  try { cache.put(key, JSON.stringify(val), seconds); } catch (e) {}
  return val;
}

function maxTplList_(path, mapFn) {
  try {
    var res = maxTplGet_(phraseApiUrlV1_(path + (path.indexOf("?") >= 0 ? "&" : "?") + "pageSize=50"));
    var items = (res && Array.isArray(res.content)) ? res.content : (Array.isArray(res) ? res : []);
    return items.map(mapFn).filter(Boolean);
  } catch (e) {
    console.warn("MaxTemplate " + path + ": " + e.message);
    return [];
  }
}

var MAXTPL_NAMED_ = function (x) { return x && (x.id || x.uid) ? { id: String(x.id || x.uid), uid: String(x.uid || x.id), name: String(x.name || "") } : null; };

function maxTplCatalog_() {
  return maxTplCached_("maxtpl_catalog_v1", 21600, function () {
    return {
      workflowSteps: maxTplList_("/workflowSteps", function (s) {
        return s && s.id ? { id: String(s.id), name: String(s.name || ""), order: Number(s.order) || 0, abbr: String(s.abbr || "") } : null;
      }).sort(function (a, b) { return a.order - b.order; }),
      clients: maxTplList_("/clients", MAXTPL_NAMED_),
      businessUnits: maxTplList_("/businessUnits", MAXTPL_NAMED_),
      domains: maxTplList_("/domains", MAXTPL_NAMED_),
      subDomains: maxTplList_("/subDomains", MAXTPL_NAMED_),
      costCenters: maxTplList_("/costCenters", MAXTPL_NAMED_),
      mtSettings: maxTplList_("/machineTranslateSettings", function (m) {
        return m && (m.uid || m.id) ? { uid: String(m.uid || m.id), name: String(m.name || ""), type: String(m.type || "") } : null;
      })
    };
  });
}

/** Liste auf die vom Admin freigegebenen Eintraege kuerzen (allowed null = alle). */
function maxTplFilterList_(items, allowed, idKey) {
  if (!Array.isArray(allowed)) return items || [];
  var ok = allowed.map(function (x) { return String(x.id); });
  return (items || []).filter(function (x) { return ok.indexOf(String(x[idKey || "id"])) >= 0; });
}

/** Kataloge fuer den Dialog nach den Admin-Regeln filtern. */
function maxTplFilterCatalog_(cat, lists) {
  lists = lists || {};
  var out = {};
  Object.keys(cat || {}).forEach(function (k) { out[k] = cat[k]; });
  ["clients", "businessUnits", "domains", "subDomains", "costCenters", "workflowSteps"].forEach(function (k) { out[k] = maxTplFilterList_(cat[k], lists[k], "id"); });
  out.mtSettings = maxTplFilterList_(cat.mtSettings, lists.mtSettings, "uid");
  return out;
}

/** Standardwerte der Basis-Vorlage: Schritte, Zuordnung, TMs, TBs, MT. */
function maxTplTemplateDefaults_(uid) {
  return maxTplCached_("maxtpl_tpl_" + uid, 3600, function () {
    var out = { uid: uid, name: "", sourceLang: "", targetLangs: [], workflowSteps: [], client: "", businessUnit: "", domain: "",
      subDomain: "", costCenter: "", mtSettingsUid: "", tms: [], tbs: [] };
    var t = {};
    try { t = maxTplGet_(phraseApiUrlV1_("/projectTemplates/" + encodeURIComponent(uid))) || {}; } catch (e) { out.error = e.message; return out; }
    var ref = function (o) { return o && (o.id || o.uid) ? String(o.id || o.uid) : ""; };
    out.name = String(t.templateName || t.name || "");
    out.sourceLang = String(t.sourceLang || "");
    out.targetLangs = Array.isArray(t.targetLangs) ? t.targetLangs : [];
    out.workflowSteps = (t.workflowSteps || []).map(function (s) { return String((s.workflowStep && s.workflowStep.id) || s.id || ""); }).filter(Boolean);
    out.client = ref(t.client); out.businessUnit = ref(t.businessUnit); out.domain = ref(t.domain);
    out.subDomain = ref(t.subDomain); out.costCenter = ref(t.costCenter);
    out.mtSettingsUid = String((t.machineTranslateSettings && (t.machineTranslateSettings.uid || t.machineTranslateSettings.id)) || "");
    try {
      var tm = maxTplGet_(phraseApiUrlV2_("/projectTemplates/" + encodeURIComponent(uid) + "/transMemories"));
      var ctx = (tm && tm.transMemories) || ((tm && tm.dataPerContext && tm.dataPerContext[0] && tm.dataPerContext[0].transMemories)) || [];
      out.tms = ctx.map(function (x) {
        var m = x.transMemory || x;
        return { uid: String(m.uid || m.id || ""), name: String(m.name || ""), read: x.readMode !== false, write: !!x.writeMode, penalty: Number(x.penalty) || 0 };
      }).filter(function (x) { return x.uid; });
    } catch (e) { console.warn("MaxTemplate TMs: " + e.message); }
    try {
      var tb = maxTplGet_(phraseApiUrlV1_("/projectTemplates/" + encodeURIComponent(uid) + "/termBases"));
      var list = (tb && tb.termBases) || [];
      out.tbs = list.map(function (x) {
        var b = x.termBase || x;
        return { id: String(b.id || b.uid || ""), name: String(b.name || ""), read: x.readMode !== false, write: !!x.writeMode, qa: !!x.qualityAssurance };
      }).filter(function (x) { return x.id; });
    } catch (e) { console.warn("MaxTemplate TBs: " + e.message); }
    return out;
  });
}

function maxTplPromptHub_(templateUid) {
  try {
    var sh = openAccessSS_().getSheetByName(PROMPT_HUB_SHEET_NAME_);
    if (!sh) return { prompts: [], forTemplate: null };
    return maxTplParsePromptHub_(sh.getDataRange().getValues(), templateUid);
  } catch (e) {
    console.warn("Prompt-Hub: " + e.message);
    return { prompts: [], forTemplate: null };
  }
}

// --- Endpunkte -----------------------------------------------------------------------------------

function maxTplAllowed_(email) {
  return isAdmin_(email) || isMarketingConsultant_(email) || precalcAllowed_(email);
}

/** Alles fuer den Dialog: Kataloge, Standardwerte der Basis-Vorlage, Prompt-Hub. */
function apiMaxTplOptions(baseTemplateUid) {
  var caller = getUserEmail_();
  var access = apiCheckAccess();
  if (!access.allowed || !maxTplAllowed_(caller)) return { success: false, error: "Not authorized." };
  var uid = String(baseTemplateUid || "").trim();
  try {
    var hub = maxTplPromptHub_(uid);
    var cfg = maxTplLoadConfig_();
    return {
      success: true,
      catalog: maxTplFilterCatalog_(maxTplCatalog_(), cfg.lists),
      rules: maxTplDialogConfig_(cfg),
      defaults: uid ? maxTplTemplateDefaults_(uid) : null,
      prompts: maxTplFilterList_(hub.prompts, cfg.lists.prompts, "name"),
      templatePrompt: hub.forTemplate && maxTplFilterList_([hub.forTemplate], cfg.lists.prompts, "name").length ? hub.forTemplate : null,
      promptHubUrl: String(PropertiesService.getScriptProperties().getProperty("PROMPT_HUB_URL") || ""),
      promptField: String(PropertiesService.getScriptProperties().getProperty("MAXTPL_PROMPT_FIELD") || "AI Prompt")
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** Suche fuer Provider (users/vendors), TMs und TBs (Name enthaelt q); vom Admin eingeschraenkt nur die freigegebenen. */
function apiMaxTplSearch(kind, query, unrestricted) {
  var caller = getUserEmail_();
  if (!maxTplAllowed_(caller)) return { success: false, error: "Not authorized." };
  // unrestricted: Admin-Ansicht (Regeln pflegen) sucht in ganz Phrase.
  var useRules = !(unrestricted && isAdmin_(caller));
  var q = String(query || "").trim().slice(0, 80);
  var enc = encodeURIComponent(q);
  var items = [];
  var lists = maxTplLoadConfig_().lists;
  var listKey = { users: "providers", vendors: "providers", tms: "tms", tbs: "tbs" }[kind];
  if (useRules && listKey && Array.isArray(lists[listKey])) {
    // Vom Admin eingeschraenkt: nur diese Eintraege, Suche im Namen.
    var ql = q.toLowerCase();
    items = lists[listKey].filter(function (x) {
      if (listKey === "providers" && x.type !== (kind === "vendors" ? "VENDOR" : "USER")) return false;
      return !ql || String(x.name || x.id).toLowerCase().indexOf(ql) >= 0;
    }).map(function (x) {
      if (kind === "tms") return { uid: x.id, name: x.name || x.id };
      if (kind === "tbs") return { id: x.id, name: x.name || x.id };
      return { type: x.type, id: x.id, name: x.name || x.id };
    });
    return { success: true, items: items.slice(0, 50) };
  }
  if (kind === "users") {
    items = maxTplList_("/users?name=" + enc, function (u) {
      if (!u || !u.uid || u.active === false) return null;
      return { type: "USER", id: String(u.uid), name: ((u.firstName || "") + " " + (u.lastName || "")).trim() + (u.userName ? " (" + u.userName + ")" : ""), role: String(u.role || "") };
    });
  } else if (kind === "vendors") {
    items = maxTplList_("/vendors?name=" + enc, function (v) {
      return v && (v.uid || v.id) ? { type: "VENDOR", id: String(v.uid || v.id), name: String(v.name || "") } : null;
    });
  } else if (kind === "tms") {
    items = maxTplList_("/transMemories?name=" + enc, function (t) {
      return t && (t.uid || t.id) ? { uid: String(t.uid || t.id), name: String(t.name || ""), langs: [t.sourceLang].concat(t.targetLangs || []).filter(Boolean).join(", ") } : null;
    });
  } else if (kind === "tbs") {
    items = maxTplList_("/termBases?name=" + enc, function (t) {
      return t && (t.id || t.uid) ? { id: String(t.id || t.uid), name: String(t.name || ""), langs: (t.langs || []).join(", ") } : null;
    });
  } else {
    return { success: false, error: "Unknown kind." };
  }
  return { success: true, items: items.slice(0, 50) };
}

/** Nach dem Anlegen: TMs, TBs, MT, Prompt. Fehler -> errors (nicht blockierend). */
function maxTplApplyProjectSettings_(projectUid, ms, langs, errors) {
  var put = function (url, body) {
    return phraseFetchJson_(url, { method: "put", contentType: "application/json",
      headers: { Authorization: getPhraseAuthHeader_() }, payload: JSON.stringify(body) });
  };
  var warn = function (what, e) {
    var msg = "Maximaltemplate – " + what + ": " + (e && e.message ? e.message : e);
    console.warn(msg);
    if (errors) errors.push(msg);
  };
  var base = "/projects/" + encodeURIComponent(projectUid);
  if (ms.tmsOverride) {
    try { put(phraseApiUrlV3_(base + "/transMemories"), maxTplTmBody_(ms.tms)); } catch (e) { warn("Translation Memories", e); }
  }
  if (ms.tbsOverride) {
    try { put(phraseApiUrlV1_(base + "/termBases"), maxTplTbBody_(ms.tbs)); } catch (e) { warn("Termbases", e); }
  }
  if (ms.mtSettingsUid) {
    try { put(phraseApiUrlV1_(base + "/mtSettings"), { machineTranslateSettings: { uid: ms.mtSettingsUid } }); } catch (e) { warn("MT", e); }
  }
  maxTplApplyExtraSections_(projectUid, ms, put, warn);
  if (ms.prompt) {
    var field = String(PropertiesService.getScriptProperties().getProperty("MAXTPL_PROMPT_FIELD") || "AI Prompt");
    var exists = false;
    try {
      var defs = phraseGetCustomFieldDefinitionsMap_();
      exists = Object.keys(defs).some(function (k) { return defs[k] === field; });
    } catch (e) {}
    if (exists) {
      phraseSetProjectCustomFieldByName_(projectUid, field, ms.prompt);
    } else {
      try {
        var cur = noteReadProjectNote_(projectUid);
        var block = "\n\n--- AI Prompt" + (ms.promptName ? " (" + ms.promptName + ")" : "") + " ---\n" + ms.prompt;
        var res = noteWriteProjectNote_(projectUid, (cur.note + block).trim(), cur.hadMarker);
        if (!res.success) warn("Prompt", res.error);
      } catch (e) { warn("Prompt", e); }
    }
  }
}

/**
 * Darf email mit diesem Maximaltemplate einreichen? Rolle + Basis-Vorlage muss
 * eine sein, die die Person (oder die von ihr vertretene) sehen darf.
 */
function maxTplCheckAllowed_(email, payload) {
  if (!maxTplAllowed_(email)) return { ok: false, error: "Maximaltemplate: not authorized." };
  var allowedBases = maxTplLoadConfig_().lists.baseTemplates;
  if (Array.isArray(allowedBases) && !allowedBases.some(function (b) { return b.id === String(payload.templateUid || ""); })) {
    return { ok: false, error: "Maximaltemplate: base template not released by the admin." };
  }
  if (isAdmin_(email)) return { ok: true };
  var uids = [String(payload.templateUid || "")].concat(Object.keys(payload.targetUidMap || {}).map(function (k) { return String(payload.targetUidMap[k]); }))
    .filter(Boolean);
  var visible = {};
  var add = function (tpls) {
    Object.keys(tpls).forEach(function (k) {
      var t = tpls[k];
      if (t.uid) visible[t.uid] = true;
      Object.keys(t.targetUidMap || {}).forEach(function (l) { visible[t.targetUidMap[l]] = true; });
    });
  };
  add(templatesForUser_(email));
  deputyPrincipalsOf_(email).forEach(function (p) { add(templatesForUser_(p)); });
  var bad = uids.filter(function (u) { return !visible[u]; });
  return bad.length ? { ok: false, error: "Maximaltemplate: base template not available for you." } : { ok: true };
}
