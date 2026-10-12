/**
 * MarketingPrecalc.gs
 * Marketing Projects -> Unterreiter "Vorab-Kalkulation": einmalige Kosten-
 * schaetzung ueber Phrase, ohne dass ein echtes Projekt entsteht.
 *
 * Ablauf (der Browser fragt alle paar Sekunden apiPrecalcPoll ab, damit kein
 * Aufruf die 6-Minuten-Grenze von Apps Script erreicht):
 *   1. START    temporaeres Projekt je Vorlage ("[PRECALC] ...") + Jobs hochladen
 *   2. IMPORT   warten, bis Phrase alle Dateien importiert hat
 *   3. ANALYSE  Analyse (PreAnalyse) ueber alle Jobs anlegen und abwarten
 *   4. QUOTE    Quote aus Analyse + Preisliste anlegen -> Betrag
 *   5. CLEANUP  temporaere Projekte mit purge=true loeschen (Dateien weg)
 * Nichts davon landet in der Queue, im Chat oder in "Meine Projekte". Uebrig
 * bleibt nur eine Protokollzeile (Betrag, Woerter, Sprachen) im Sheet
 * "Precalc_Log" (OPS-Sheet). Haengengebliebene Projekte (Abbruch, Fehler,
 * geschlossener Browser) raeumt precalcCleanupStale_ beim naechsten Start auf.
 *
 * Script Properties:
 *   PRECALC_PRICE_LIST_UID  Preisliste fuer die Quote (sonst die des Projekts/der Vorlage)
 *   PRECALC_ENABLED         "false" blendet den Unterreiter aus
 */
var PRECALC_SHEET_NAME_ = "Precalc_Log";
var PRECALC_HEADERS_ = ["ID", "Created At", "User", "Template", "Source", "Target Langs", "Files",
  "Status", "Words", "Amount", "Currency", "State JSON", "Finished At"];
var PRECALC_STALE_MS_ = 2 * 60 * 60 * 1000;
var PRECALC_TIMEOUT_MS_ = 45 * 60 * 1000;
var PRECALC_NAME_PREFIX_ = "[PRECALC] ";

function precalcEnabled_() {
  return String(PropertiesService.getScriptProperties().getProperty("PRECALC_ENABLED") || "").toLowerCase() !== "false";
}

function precalcAllowed_(email) {
  if (isMarketingConsultant_(email) || isMarketingUser_(email)) return true;
  try { return deputyPrincipalsOf_(email).some(function (p) { return isMarketingUser_(p); }); } catch (e) { return false; }
}

// --- Reine Helfer (getestet) ---------------------------------------------------------

/** Sprachen nach Vorlage gruppieren (wie Upload.gs). */
function precalcGroupLangs_(templateUid, targetUidMap, targetLangs) {
  var groups = {};
  (targetLangs || []).forEach(function (l) {
    var uid = (targetUidMap || {})[l] || templateUid;
    if (!uid) return;
    (groups[uid] = groups[uid] || []).push(l);
  });
  return groups;
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

function precalcPriceListUid_(projectUid) {
  var prop = String(PropertiesService.getScriptProperties().getProperty("PRECALC_PRICE_LIST_UID") || "").trim();
  if (prop) return prop;
  try {
    var p = precalcPhrase_("get", phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)));
    var pl = (p && (p.priceList || (p.financialSettings && p.financialSettings.priceList))) || null;
    if (pl && (pl.uid || pl.id)) return String(pl.uid || pl.id);
  } catch (e) { console.warn("Precalc: Preisliste des Projekts: " + e.message); }
  return "";
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
      var allGone = (state.groups || []).every(function (g) { return g.deleted || !g.projectUid || precalcDeleteProject_(g.projectUid); });
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

/** Schritt 1: temporaere Projekte anlegen und Dateien hochladen. */
function apiPrecalcStart(payload) {
  var access = apiCheckAccess();
  var caller = getUserEmail_();
  if (!access.allowed || !precalcAllowed_(caller)) return { success: false, error: "Not authorized." };
  if (!precalcEnabled_()) return { success: false, error: "Pre-calculation is switched off." };
  payload = payload || {};
  var templateUid = String(payload.templateUid || "").trim();
  var sourceLang = String(payload.sourceLang || "").trim();
  var targetLangs = Array.isArray(payload.targetLangs) ? payload.targetLangs : [];
  var mainFiles = payload.mainFiles || payload.allMainFiles || [];
  if (!templateUid && !payload.targetUidMap) return { success: false, error: "Template missing." };
  if (!sourceLang) return { success: false, error: "Source language missing." };
  if (!targetLangs.length) return { success: false, error: "Target language missing." };
  if (!mainFiles.length) return { success: false, error: "Main file missing." };

  precalcCleanupStale_();

  var id = "P-" + Utilities.formatDate(new Date(), "Europe/Berlin", "yyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
  var groupsMap = precalcGroupLangs_(templateUid, payload.targetUidMap, targetLangs);
  var state = { phase: "IMPORT", startedAt: Date.now(), groups: [], files: [] };
  var sh = precalcSheet_();
  sh.appendRow([id, new Date(), caller, String(payload.templateName || ""), sourceLang, targetLangs.join(", "), "",
    "RUNNING", "", "", "", JSON.stringify(state), ""]);
  var rec = { rowNum: sh.getLastRow(), state: state };

  try {
    var blobs = mainFiles.map(function (f) { return resolveFileToBlob_(f); });
    state.files = blobs.map(function (b) { return b.getName(); });
    sh.getRange(rec.rowNum, 7).setValue(state.files.join(", "));
    Object.keys(groupsMap).forEach(function (uid) {
      var langs = groupsMap[uid];
      var name = PRECALC_NAME_PREFIX_ + (String(payload.projectName || "").trim() || state.files[0] || id) + " (" + id + ")";
      var projectUid = phraseCreateProjectFromTemplate_(uid, { name: name, sourceLang: sourceLang, targetLangs: langs });
      var group = { templateUid: uid, langs: langs, projectUid: projectUid, jobUids: [], asyncIds: [] };
      state.groups.push(group);
      precalcSave_(rec, {}); // Projekt-UID sofort sichern (fuer das Aufraeumen)
      blobs.forEach(function (blob) {
        var up = phraseUploadJob_(projectUid, blob, blob.getName(), langs);
        (up.jobs || []).forEach(function (j) { if (j.uid) group.jobUids.push(j.uid); });
        if (up.asyncRequest && up.asyncRequest.id) group.asyncIds.push(String(up.asyncRequest.id));
      });
    });
    precalcSave_(rec, {});
    logAuditEvent_(caller, "PRECALC_START", id + " " + state.files.join(", ") + " -> " + targetLangs.join(", "));
    return { success: true, id: id, phase: state.phase };
  } catch (e) {
    precalcFail_(rec, e.message);
    return { success: false, error: e.message };
  }
}

function precalcFail_(rec, msg) {
  (rec.state.groups || []).forEach(function (g) { if (g.projectUid && !g.deleted) g.deleted = precalcDeleteProject_(g.projectUid); });
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
        var priceList = precalcPriceListUid_(g.projectUid);
        if (!priceList) throw new Error("No price list: set Script Property PRECALC_PRICE_LIST_UID.");
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
      st.groups.forEach(function (g) { if (!g.deleted) g.deleted = precalcDeleteProject_(g.projectUid); });
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
