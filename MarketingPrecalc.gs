/**
 * MarketingPrecalc.gs
 * Marketing Projects -> Unterreiter "Vorab-Kalkulation": Kostenschaetzung ueber
 * Phrase mit den Translation Memories eines festen Kalkulationsprojekts.
 *
 * Es wird KEIN Projekt angelegt. Der Admin hinterlegt feste Phrase-Projekte
 * (z. B. eins fuer Home & Garden, eins fuer Professional), deren TMs, Termbases
 * und Preisliste die Kalkulation bestimmen. Ablauf (der Browser fragt alle paar
 * Sekunden apiPrecalcPoll ab, damit kein Aufruf die 6-Minuten-Grenze erreicht):
 *   1. START    Dateien als Jobs in das gewaehlte Kalkulationsprojekt hochladen
 *               (Dateiname mit Praefix "PRECALC-<ID>-", damit Reste erkennbar sind)
 *   2. IMPORT   warten, bis Phrase alle Dateien importiert hat
 *   3. ANALYSE  Analyse (PreAnalyse, mit TM) ueber diese Jobs anlegen und abwarten
 *   4. QUOTE    Quote aus Analyse + Preisliste -> Betrag
 *   5. CLEANUP  nur DIESE Jobs mit purge=true loeschen; das Projekt bleibt
 * Nichts davon landet in der Queue, im Chat oder in "Meine Projekte". Uebrig
 * bleibt eine Protokollzeile (Betrag, Woerter, Sprachen) im Sheet "Precalc_Log".
 * Haengengebliebene Jobs (Abbruch, Fehler, Browser zu) raeumt
 * precalcCleanupStale_ beim naechsten Start auf.
 *
 * Wichtig fuer die Kalkulationsprojekte in Phrase: keine automatische
 * Provider-Zuweisung/Benachrichtigung, sonst bekommen Uebersetzer Mails zu
 * den Kalkulations-Jobs.
 *
 * Script Properties:
 *   PRECALC_PROJECTS          Kalkulationsprojekte, eins pro Zeile oder durch ";" getrennt:
 *                             "Bezeichnung|Projekt-UID" oder "Bezeichnung|Projekt-UID|Preislisten-UID"
 *                             z. B. "Home & Garden|aBc123; Professional|xYz789"
 *   PRECALC_PROJECTS_SANDBOX  dasselbe fuer die Admin-Sandbox (Sandbox.gs)
 *   PRECALC_PRICE_LIST_UID    Preisliste, wenn weder Eintrag noch Projekt eine liefern
 *   PRECALC_ENABLED           "false" blendet den Unterreiter aus
 */
var PRECALC_SHEET_NAME_ = "Precalc_Log";
var PRECALC_HEADERS_ = ["ID", "Created At", "User", "Template", "Source", "Target Langs", "Files",
  "Status", "Words", "Amount", "Currency", "State JSON", "Finished At"];
var PRECALC_STALE_MS_ = 2 * 60 * 60 * 1000;
var PRECALC_TIMEOUT_MS_ = 45 * 60 * 1000;

function precalcEnabled_() {
  return String(PropertiesService.getScriptProperties().getProperty("PRECALC_ENABLED") || "").toLowerCase() !== "false";
}

function precalcAllowed_(email) {
  if (isMarketingConsultant_(email) || isMarketingUser_(email)) return true;
  try { return deputyPrincipalsOf_(email).some(function (p) { return isMarketingUser_(p); }); } catch (e) { return false; }
}

// --- Reine Helfer (getestet) ---------------------------------------------------------

/** "H&G|uid1|pl1; Professional|uid2" -> [{label, projectUid, priceListUid}] */
function precalcParseProjects_(raw) {
  var out = [];
  String(raw || "").split(/[\n;]+/).forEach(function (line) {
    var parts = line.split("|").map(function (x) { return x.trim(); });
    if (parts.length < 2 || !parts[0] || !/^[A-Za-z0-9_\-]+$/.test(parts[1])) return;
    if (out.some(function (p) { return p.projectUid === parts[1]; })) return;
    out.push({ label: parts[0].slice(0, 80), projectUid: parts[1], priceListUid: /^[A-Za-z0-9_\-]+$/.test(parts[2] || "") ? parts[2] : "" });
  });
  return out;
}

/** Dateiname fuer den Kalkulations-Job (Praefix macht Reste im Projekt erkennbar). */
function precalcJobFileName_(id, name) {
  return "PRECALC-" + id + "-" + String(name || "file").replace(/[\\/:*?"<>|]+/g, "_");
}

/** Ist ein Async-Request von Phrase fertig? -> "running" | "ok" | "error: ..." */
function precalcAsyncState_(res) {
  if (!res) return "running";
  var r = res.asyncResponse;
  if (!r) return "running";
  if (r.errorCode || r.errorDesc) return "error: " + (r.errorDesc || r.errorCode);
  return "ok";
}

/** Gesamtwoerter aus einer v3-Analyse (alle Sprachteile, Kategorie "all"). */
function precalcWordsFromAnalyse_(an) {
  var parts = (an && (an.analyseLanguageParts || an.languageParts)) || [];
  var sum = 0;
  parts.forEach(function (p) {
    var d = p && p.data;
    var w = d && d.all && (d.all.words != null ? d.all.words : d.all.wordCount);
    sum += Number(w) || 0;
  });
  return sum;
}

/** Summe mehrerer Quotes (gleiche Waehrung vorausgesetzt). */
function precalcSumQuotes_(quotes) {
  var amount = 0, currency = "";
  var mixed = false;
  (quotes || []).forEach(function (q) {
    amount += Number(q.totalPrice) || 0;
    var c = String(q.currency || "").trim();
    if (c && currency && c !== currency) mixed = true;
    if (c && !currency) currency = c;
  });
  return { amount: Math.round(amount * 100) / 100, currency: currency, mixedCurrency: mixed };
}

// --- Ablage ------------------------------------------------------------------------------

function precalcSheet_() {
  var ss = openOpsSpreadsheet_();
  var sh = ss.getSheetByName(PRECALC_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(PRECALC_SHEET_NAME_);
    sh.appendRow(PRECALC_HEADERS_);
    sh.getRange(1, 1, 1, PRECALC_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function precalcFind_(id) {
  var sh = precalcSheet_();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) !== String(id)) continue;
    var state = {};
    try { state = JSON.parse(String(data[i][11] || "{}")) || {}; } catch (e) {}
    return { rowNum: i + 1, user: String(data[i][2] || "").toLowerCase(), status: String(data[i][7] || ""), state: state, row: data[i] };
  }
  return null;
}

function precalcSave_(rec, patch) {
  var sh = precalcSheet_();
  Object.keys(patch || {}).forEach(function (k) {
    var col = { status: 8, words: 9, amount: 10, currency: 11, finishedAt: 13 }[k];
    if (col) sh.getRange(rec.rowNum, col).setValue(patch[k]);
  });
  sh.getRange(rec.rowNum, 12).setValue(JSON.stringify(rec.state));
}

// --- Kalkulationsprojekte ------------------------------------------------------------------

function precalcProjects_() {
  var props = PropertiesService.getScriptProperties();
  var sbx = typeof sandboxActive_ === "function" && sandboxActive_();
  return precalcParseProjects_(props.getProperty(sbx ? "PRECALC_PROJECTS_SANDBOX" : "PRECALC_PROJECTS"));
}

/** Quell-/Zielsprachen und Name eines Kalkulationsprojekts (1 h gecacht). */
function precalcProjectInfo_(projectUid) {
  var cache = phraseScriptCache_();
  var key = "precalc_proj_" + projectUid;
  var hit = cache.get(key);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var p = precalcPhrase_("get", phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)));
  var info = {
    name: String(p.name || ""),
    sourceLang: String(p.sourceLang || ""),
    targetLangs: Array.isArray(p.targetLangs) ? p.targetLangs : [],
    priceListUid: String((p.priceList && (p.priceList.uid || p.priceList.id)) || (p.financialSettings && p.financialSettings.priceList && (p.financialSettings.priceList.uid || p.financialSettings.priceList.id)) || "")
  };
  try { cache.put(key, JSON.stringify(info), 3600); } catch (e) {}
  return info;
}

// --- Phrase-Aufrufe ------------------------------------------------------------------------

function precalcPhrase_(method, url, body) {
  var opts = { method: method, headers: { Authorization: getPhraseAuthHeader_() } };
  if (body) { opts.contentType = "application/json"; opts.payload = JSON.stringify(body); }
  return phraseFetchJson_(url, opts);
}

function precalcDeleteProject_(uid) {
  try {
    precalcPhrase_("delete", phraseApiUrlV1_("/projects/" + encodeURIComponent(uid) + "?purge=true"));
    return true;
  } catch (e) {
    console.warn("Precalc: Loeschen von " + uid + " fehlgeschlagen: " + e.message);
    return false;
  }
}

/** Preisliste: aus PRECALC_PROJECTS, sonst die des Projekts, sonst PRECALC_PRICE_LIST_UID. */
function precalcPriceListUid_(projectUid, configured) {
  if (configured) return configured;
  try {
    var own = precalcProjectInfo_(projectUid).priceListUid;
    if (own) return own;
  } catch (e) { console.warn("Precalc: Preisliste des Projekts: " + e.message); }
  return String(PropertiesService.getScriptProperties().getProperty("PRECALC_PRICE_LIST_UID") || "").trim();
}

/** Nur die Kalkulations-Jobs loeschen (DELETE v1/projects/{uid}/jobs/batch?purge=true). */
function precalcDeleteJobs_(projectUid, jobUids) {
  if (!jobUids || !jobUids.length) return true;
  try {
    precalcPhrase_("delete", phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/jobs/batch?purge=true"),
      { jobs: jobUids.map(function (u) { return { uid: u }; }) });
    return true;
  } catch (e) {
    console.warn("Precalc: Jobs in " + projectUid + " nicht geloescht: " + e.message);
    return false;
  }
}

/** Aufraeumen einer Gruppe: feste Projekte -> Jobs loeschen; alte temporaere Projekte -> Projekt loeschen. */
function precalcCleanupGroup_(g) {
  if (g.deleted || !g.projectUid) return true;
  return g.fixedProject ? precalcDeleteJobs_(g.projectUid, g.jobUids) : precalcDeleteProject_(g.projectUid);
}

/** Projekte ohne Abschluss (Abbruch, Fehler, Browser zu) nach PRECALC_STALE_MS_ loeschen. */
function precalcCleanupStale_() {
  try {
    var sh = precalcSheet_();
    var data = sh.getDataRange().getValues();
    var now = Date.now();
    for (var i = 1; i < data.length; i++) {
      var status = String(data[i][7] || "");
      if (status === "DONE" || status === "CLEANED") continue;
      var created = data[i][1] instanceof Date ? data[i][1].getTime() : new Date(data[i][1]).getTime();
      if (!created || now - created < PRECALC_STALE_MS_) continue;
      var state = {};
      try { state = JSON.parse(String(data[i][11] || "{}")) || {}; } catch (e) {}
      var allGone = (state.groups || []).every(function (g) { return precalcCleanupGroup_(g); });
      if (allGone) {
        sh.getRange(i + 1, 8).setValue(status.indexOf("ERROR") === 0 ? status : "CLEANED");
        sh.getRange(i + 1, 13).setValue(new Date());
      }
    }
  } catch (e) {
    console.warn("precalcCleanupStale_: " + e.message);
  }
}

// --- Endpunkte ---------------------------------------------------------------------------------

/** Kalkulationsprojekte fuer die Auswahl im Formular. */
function apiPrecalcOptions() {
  var access = apiCheckAccess();
  var caller = getUserEmail_();
  if (!access.allowed || !precalcAllowed_(caller)) return { success: false, error: "Not authorized." };
  var list = precalcProjects_().map(function (p) {
    try {
      var info = precalcProjectInfo_(p.projectUid);
      return { label: p.label, projectUid: p.projectUid, sourceLang: info.sourceLang, targetLangs: info.targetLangs };
    } catch (e) {
      return { label: p.label, projectUid: p.projectUid, error: e.message, sourceLang: "", targetLangs: [] };
    }
  });
  return { success: true, enabled: precalcEnabled_(), projects: list };
}

/** Schritt 1: Dateien als Jobs in das Kalkulationsprojekt hochladen. */
function apiPrecalcStart(payload) {
  var access = apiCheckAccess();
  var caller = getUserEmail_();
  if (!access.allowed || !precalcAllowed_(caller)) return { success: false, error: "Not authorized." };
  if (!precalcEnabled_()) return { success: false, error: "Pre-calculation is switched off." };
  payload = payload || {};
  var cfg = precalcProjects_().filter(function (p) { return p.projectUid === String(payload.calcProjectUid || ""); })[0];
  if (!cfg) return { success: false, error: "Unknown calculation project." };
  var mainFiles = payload.mainFiles || payload.allMainFiles || [];
  if (!mainFiles.length) return { success: false, error: "Main file missing." };
  var info;
  try { info = precalcProjectInfo_(cfg.projectUid); } catch (e) { return { success: false, error: e.message }; }
  var allowed = info.targetLangs.map(function (l) { return String(l).toLowerCase(); });
  var targetLangs = (Array.isArray(payload.targetLangs) ? payload.targetLangs : [])
    .filter(function (l) { return allowed.indexOf(String(l).toLowerCase()) >= 0; });
  if (!targetLangs.length) return { success: false, error: "Target language missing." };

  precalcCleanupStale_();

  var id = "P-" + Utilities.formatDate(new Date(), "Europe/Berlin", "yyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
  var state = { phase: "IMPORT", startedAt: Date.now(), groups: [], files: [], label: cfg.label };
  var sh = precalcSheet_();
  sh.appendRow([id, new Date(), caller, cfg.label, info.sourceLang, targetLangs.join(", "), "",
    "RUNNING", "", "", "", JSON.stringify(state), ""]);
  var rec = { rowNum: sh.getLastRow(), state: state };
  var group = { fixedProject: true, projectUid: cfg.projectUid, priceListUid: cfg.priceListUid, langs: targetLangs, jobUids: [], asyncIds: [] };
  state.groups.push(group);

  try {
    mainFiles.forEach(function (f) {
      var blob = resolveFileToBlob_(f);
      state.files.push(blob.getName());
      var up = phraseUploadJob_(cfg.projectUid, blob, precalcJobFileName_(id, blob.getName()), targetLangs);
      (up.jobs || []).forEach(function (j) { if (j.uid) group.jobUids.push(j.uid); });
      if (up.asyncRequest && up.asyncRequest.id) group.asyncIds.push(String(up.asyncRequest.id));
      precalcSave_(rec, {}); // Job-UIDs sofort sichern (fuer das Aufraeumen)
    });
    sh.getRange(rec.rowNum, 7).setValue(state.files.join(", "));
    logAuditEvent_(caller, "PRECALC_START", id + " [" + cfg.label + "] " + state.files.join(", ") + " -> " + targetLangs.join(", "));
    return { success: true, id: id, phase: state.phase };
  } catch (e) {
    precalcFail_(rec, e.message);
    return { success: false, error: e.message };
  }
}

function precalcFail_(rec, msg) {
  (rec.state.groups || []).forEach(function (g) { if (!g.deleted) g.deleted = precalcCleanupGroup_(g); });
  rec.state.phase = "ERROR";
  rec.state.error = String(msg || "");
  precalcSave_(rec, { status: "ERROR: " + String(msg || "").slice(0, 200), finishedAt: new Date() });
}

/** Schritte 2-5: einen Schritt weiter, Zustand zurueck. */
function apiPrecalcPoll(id) {
  var caller = getUserEmail_();
  var rec = precalcFind_(id);
  if (!rec) return { success: false, error: "Not found." };
  if (rec.user !== caller && !isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var st = rec.state;
  if (st.phase === "DONE") return precalcResult_(rec);
  if (st.phase === "ERROR") return { success: false, phase: "ERROR", error: st.error || rec.status };
  if (Date.now() - (st.startedAt || 0) > PRECALC_TIMEOUT_MS_) {
    precalcFail_(rec, "Timeout");
    return { success: false, phase: "ERROR", error: "Timeout" };
  }
  try {
    if (st.phase === "IMPORT") {
      var running = false;
      st.groups.forEach(function (g) {
        g.asyncIds.forEach(function (aid) {
          var s = precalcAsyncState_(precalcPhrase_("get", phraseApiUrlV1_("/async/" + encodeURIComponent(aid))));
          if (s === "running") running = true;
          else if (s !== "ok") throw new Error("Import: " + s.replace(/^error: /, ""));
        });
      });
      if (!running) {
        st.groups.forEach(function (g) {
          var res = precalcPhrase_("post", phraseApiUrlV2_("/analyses"), {
            jobs: g.jobUids.map(function (u) { return { uid: u }; }),
            type: "PreAnalyse",
            name: "Precalc " + id,
            includeFuzzyRepetitions: true, includeConfirmedSegments: true, includeNumbers: true,
            includeLockedSegments: true, countSourceUnits: true, includeTransMemory: true,
            analyzeByLanguage: true
          });
          var item = (res && (res.asyncRequests || res.analyses) || [])[0] || {};
          var an = item.analyse || {};
          g.analyseId = String(an.id || an.uid || "");
          g.analyseUid = String(an.uid || an.id || "");
          g.analyseAsync = item.asyncRequest && item.asyncRequest.id ? String(item.asyncRequest.id) : "";
          if (!g.analyseId) throw new Error("Phrase returned no analysis.");
        });
        st.phase = "ANALYSE";
      }
    } else if (st.phase === "ANALYSE") {
      var waiting = st.groups.some(function (g) {
        if (!g.analyseAsync) return false;
        var s = precalcAsyncState_(precalcPhrase_("get", phraseApiUrlV1_("/async/" + encodeURIComponent(g.analyseAsync))));
        if (s !== "running" && s !== "ok") throw new Error("Analysis: " + s.replace(/^error: /, ""));
        return s === "running";
      });
      if (!waiting) st.phase = "QUOTE";
    } else if (st.phase === "QUOTE") {
      var quotes = [];
      var words = 0;
      st.groups.forEach(function (g) {
        var priceList = precalcPriceListUid_(g.projectUid, g.priceListUid);
        if (!priceList) throw new Error("No price list: add it to PRECALC_PROJECTS (Label|ProjectUID|PriceListUID) or set PRECALC_PRICE_LIST_UID.");
        var q = precalcPhrase_("post", phraseApiUrlV2_("/quotes"), {
          analyse: { id: g.analyseId }, priceList: { uid: priceList }, name: "Precalc " + id
        });
        g.quote = { totalPrice: Number(q.totalPrice) || 0, currency: String(q.currency || (q.priceList && q.priceList.currencyCode) || "") };
        quotes.push(g.quote);
        try {
          words += precalcWordsFromAnalyse_(precalcPhrase_("get", phraseApiUrlV3_("/analyses/" + encodeURIComponent(g.analyseUid))));
        } catch (e) { console.warn("Precalc: Woerter nicht lesbar: " + e.message); }
      });
      var sum = precalcSumQuotes_(quotes);
      st.result = { amount: sum.amount, currency: sum.currency, mixedCurrency: sum.mixedCurrency, words: words,
        perTemplate: st.groups.map(function (g) { return { langs: g.langs, amount: g.quote.totalPrice, currency: g.quote.currency }; }) };
      st.phase = "CLEANUP";
      precalcSave_(rec, { words: words, amount: sum.amount, currency: sum.currency });
    } else if (st.phase === "CLEANUP") {
      st.groups.forEach(function (g) { if (!g.deleted) g.deleted = precalcCleanupGroup_(g); });
      if (st.groups.every(function (g) { return g.deleted; })) {
        st.phase = "DONE";
        precalcSave_(rec, { status: "DONE", finishedAt: new Date() });
        logAuditEvent_(rec.user, "PRECALC_DONE", id + " " + st.result.amount + " " + st.result.currency);
        return precalcResult_(rec);
      }
    }
    precalcSave_(rec, {});
    return { success: true, phase: st.phase };
  } catch (e) {
    precalcFail_(rec, e.message);
    return { success: false, phase: "ERROR", error: e.message };
  }
}

function precalcResult_(rec) {
  var r = rec.state.result || {};
  return { success: true, phase: "DONE", amount: r.amount, currency: r.currency, mixedCurrency: !!r.mixedCurrency,
    words: r.words, perTemplate: r.perTemplate || [], files: rec.state.files || [] };
}

/** Abbrechen: temporaere Projekte sofort loeschen. */
function apiPrecalcCancel(id) {
  var caller = getUserEmail_();
  var rec = precalcFind_(id);
  if (!rec) return { success: false, error: "Not found." };
  if (rec.user !== caller && !isAdmin_(caller)) return { success: false, error: "Not authorized." };
  if (rec.state.phase === "DONE") return { success: true };
  precalcFail_(rec, "Cancelled");
  return { success: true };
}

/** Letzte Kalkulationen (eigene; Admins/Consultants alle). */
function apiPrecalcHistory() {
  var caller = getUserEmail_();
  var all = isMarketingConsultant_(caller);
  try {
    var data = precalcSheet_().getDataRange().getValues();
    var out = [];
    for (var i = data.length - 1; i >= 1 && out.length < 30; i--) {
      var user = String(data[i][2] || "").toLowerCase();
      if (!all && user !== caller) continue;
      out.push({
        id: String(data[i][0]), createdAt: data[i][1] instanceof Date ? data[i][1].toISOString() : String(data[i][1] || ""),
        user: user, template: String(data[i][3] || ""), targetLangs: String(data[i][5] || ""), files: String(data[i][6] || ""),
        status: String(data[i][7] || ""), words: Number(data[i][8]) || 0, amount: data[i][9] === "" ? null : Number(data[i][9]),
        currency: String(data[i][10] || "")
      });
    }
    return { success: true, all: all, rows: out };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
