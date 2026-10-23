/**
 * SelfTests.gs
 * Automatische Selbsttests, ausfuehrbar im Admin-Bereich (Subtab "Tests").
 *
 * - Rein lesend: es wird nichts geschrieben, kein Projekt angelegt, keine
 *   Nachricht verschickt. Deshalb auch fuer Admin-Light-Nutzer mit dem Recht
 *   "tests" freigebbar (siehe AdminLight.gs).
 * - Zeigt keine Geheimnisse (Tokens, IDs), nur ob etwas gesetzt/erreichbar ist.
 * - Die Logik-Tests pruefen dieselben reinen Funktionen wie tests/ im Repo
 *   (npm test), hier aber in der echten Apps-Script-Laufzeit.
 */

var SELF_TEST_INCLUDE_FILES_ = [
  "Styles", "JsCore", "JsForms", "JsCampus", "JsNavigation", "JsDocumentation",
  "JsUpload", "JsProjects", "JsDownload", "JsMisc", "JsPersonal",
  "GuideContent", "DarkTheme", "AdminConsole", "AdminScript", "PivotAdminConsole", "PivotAdminScript", "TranslateUi", "HomeUi", "PrefsUi", "Knowledgebase", "AdminManagersUi", "KecSettingsUi", "MarketingUi", "MaxTemplateUi"
];

function apiRunSelfTests() {
  var caller = String(getUserEmail_() || "").toLowerCase();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "tests")) {
    return { authorized: false };
  }

  var results = [];
  selfTestRegistry_().forEach(function (t) {
    var started = Date.now();
    var r;
    try {
      r = t.fn() || { status: "ok", message: "" };
    } catch (e) {
      r = { status: "error", message: e && e.message ? e.message : String(e) };
    }
    results.push({ group: t.group, name: t.name, status: r.status, message: r.message || "", ms: Date.now() - started });
  });

  var summary = { ok: 0, warning: 0, error: 0 };
  results.forEach(function (r) { summary[r.status] = (summary[r.status] || 0) + 1; });
  return { authorized: true, results: results, summary: summary, timestamp: new Date().toISOString() };
}

// --- Hilfen ---------------------------------------------------------------------

function selfTestAssertEqual_(actual, expected, label) {
  var a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) throw new Error(label + ": erwartet " + e + ", erhalten " + a);
}

/**
 * Dateien, deren <script>-Inhalt im selben Browserfenster landet (Startdokument
 * und Nachgeladenes). Steht ein let/const/class auf oberster Ebene zweimal darin
 * (z. B. nach doppeltem Einfuegen beim Kopieren ins Apps-Script-Projekt), bricht
 * der Browser den ganzen Block mit "Identifier ... has already been declared"
 * ab - die Seite bleibt bis auf die Kopfzeile leer.
 */
var SELF_TEST_WINDOW_SCRIPTS_ = [
  "Index", "JsCore", "JsForms", "JsNavigation", "JsDocumentation", "JsUpload", "JsProjects",
  "JsDownload", "JsMisc", "JsPersonal", "JsCampus", "AdminConsole", "AdminScript",
  "PivotAdminConsole", "PivotAdminScript", "AdminManagersUi", "KecSettingsUi", "MarketingUi",
  "MaxTemplateUi", "HomeUi", "TranslateUi", "PrefsUi", "DarkTheme", "GuideContent"
];

/** {Datei: Inhalt} -> ["name (DateiA, DateiB)"] fuer doppelte Top-Level-Deklarationen. */
function findDuplicateTopLevelDecls_(sources) {
  var seen = {};
  Object.keys(sources).forEach(function (file) {
    var re = /^(?:let|const|class)\s+([A-Za-z_$][\w$]*)/gm;
    var m;
    while ((m = re.exec(sources[file]))) (seen[m[1]] = seen[m[1]] || []).push(file);
  });
  return Object.keys(seen).filter(function (n) { return seen[n].length > 1; })
    .map(function (n) { return n + " (" + seen[n].join(", ") + ")"; });
}

function selfTestDuplicateDecls_() {
  var sources = {};
  SELF_TEST_WINDOW_SCRIPTS_.forEach(function (n) {
    try { sources[n] = HtmlService.createHtmlOutputFromFile(n).getContent(); } catch (e) {}
  });
  var dups = findDuplicateTopLevelDecls_(sources);
  if (dups.length) return { status: "error", message: "Doppelt deklariert: " + dups.join("; ") };
  return selfTestOk_(Object.keys(sources).length + " Dateien ohne Doppelungen");
}

/**
 * Im Apps-Script-Editor ausfuehrbar (Funktion "pruefeOberflaeche" waehlen,
 * "Ausfuehren"), auch wenn die Web-App leer bleibt und der Admin-Bereich
 * deshalb nicht erreichbar ist. Ergebnis steht im Ausfuehrungsprotokoll.
 */
function pruefeOberflaeche() {
  var missing = SELF_TEST_INCLUDE_FILES_.filter(function (n) {
    try { HtmlService.createHtmlOutputFromFile(n); return false; } catch (e) { return true; }
  });
  var dup = selfTestDuplicateDecls_();
  var lines = [
    missing.length ? "FEHLER - fehlende Dateien: " + missing.join(", ") : "OK - alle " + SELF_TEST_INCLUDE_FILES_.length + " Oberflaechen-Dateien vorhanden",
    (dup.status === "ok" ? "OK - " : "FEHLER - ") + dup.message
  ];
  if (dup.status !== "ok") lines = lines.concat(describeDuplicateFiles_());
  var wrong = checkFileSignatures_();
  lines.push(wrong.length ? "FEHLER - falscher Inhalt:\n" + wrong.join("\n") : "OK - jede Datei hat ihren eigenen Inhalt");
  Logger.log(lines.join("\n"));
  return lines;
}

/**
 * Erkennungsmerkmal je Datei (erste eigene Funktion). Fehlt es, wurde beim
 * Kopieren ins Apps-Script-Projekt vermutlich der Inhalt einer anderen Datei
 * eingefuegt - die Meldung nennt dann, wessen Inhalt tatsaechlich drinsteht.
 */
var SELF_TEST_FILE_SIGNATURES_ = {
  JsCore: "function showCustomAlert(", JsForms: "function initForm(", JsNavigation: "function loadGuideContent_(",
  JsDocumentation: "function mountHistoryView_(", JsUpload: "function switchKecSubtab(", JsProjects: "function loadMyProjects(",
  JsDownload: "function ensureDriveSaveConfig_(", JsMisc: "function extractDriveFileId_(", JsPersonal: "function fmt_(",
  JsCampus: "function t_(", AdminScript: "function loadDocDriveRootSettings(", PivotAdminScript: "function pvTemplateUrl_(",
  AdminManagersUi: "function mgrxCsv_(", KecSettingsUi: "function kecSetEsc_(", MarketingUi: "function mktEsc_(",
  MaxTemplateUi: "function mxEsc_(", HomeUi: "function homeRender_(", TranslateUi: "function psLoad_("
};

/** {Datei: Inhalt} -> ["JsUpload: enthaelt Inhalt von JsProjects (1338 Zeilen)"]. */
function wrongFileContents_(sources) {
  var sig = SELF_TEST_FILE_SIGNATURES_;
  return Object.keys(sig).filter(function (f) {
    return sources[f] !== undefined && sources[f].indexOf(sig[f]) === -1;
  }).map(function (f) {
    var actual = Object.keys(sig).filter(function (o) { return sources[f].indexOf(sig[o]) !== -1; });
    return f + ": enthaelt " + (actual.length ? "Inhalt von " + actual.join(" + ") : "unbekannten Inhalt") +
      " (" + sources[f].split("\n").length + " Zeilen) - Datei aus dem Repo neu einfuegen";
  });
}

function checkFileSignatures_() {
  var sources = {};
  Object.keys(SELF_TEST_FILE_SIGNATURES_).forEach(function (n) {
    try { sources[n] = HtmlService.createHtmlOutputFromFile(n).getContent(); } catch (e) {}
  });
  return wrongFileContents_(sources);
}

/**
 * Details fuer pruefeOberflaeche(): je betroffener Datei Zeilenzahl, die
 * Kopfzeilen-Kommentare ("// JsX.html - eingebunden ...", verraten, welcher
 * Inhalt tatsaechlich in der Datei steckt) und die Zeilen der Doppelungen.
 */
function describeDuplicateFiles_() {
  var sources = {};
  SELF_TEST_WINDOW_SCRIPTS_.forEach(function (n) {
    try { sources[n] = HtmlService.createHtmlOutputFromFile(n).getContent(); } catch (e) {}
  });
  var where = {};
  Object.keys(sources).forEach(function (file) {
    sources[file].split("\n").forEach(function (l, i) {
      var m = /^(?:let|const|class)\s+([A-Za-z_$][\w$]*)/.exec(l);
      if (m) (where[m[1]] = where[m[1]] || []).push({ file: file, line: i + 1 });
    });
  });
  var files = {};
  Object.keys(where).forEach(function (n) {
    if (where[n].length < 2) return;
    where[n].forEach(function (w) { (files[w.file] = files[w.file] || []).push(n + " Z. " + w.line); });
  });
  return Object.keys(files).map(function (file) {
    var lines = sources[file].split("\n");
    var heads = [];
    lines.forEach(function (l, i) { if (/^\/\/ \w+\.html - /.test(l)) heads.push("Z. " + (i + 1) + ": " + l.slice(3, 60)); });
    return "DATEI " + file + ": " + lines.length + " Zeilen; Kopfzeilen: " + (heads.join(" | ") || "-") +
      "; doppelt: " + files[file].slice(0, 5).join(", ") + (files[file].length > 5 ? " ..." : "");
  });
}

/** Globales Objekt (Apps Script V8: alle Top-Level-Funktionen). */
function selfTestGlobal_() { return typeof globalThis !== "undefined" ? globalThis : (function () { return this; })(); }

function selfTestOk_(message) { return { status: "ok", message: message || "" }; }
function selfTestWarn_(message) { return { status: "warning", message: message || "" }; }

// --- Tests ----------------------------------------------------------------------

function selfTestRegistry_() {
  return [
    // Logik (ohne externe Dienste)
    { group: "Logik", name: "Status von Dokumentationsprojekten", fn: function () {
      var j = function (s) { return { status: s }; };
      selfTestAssertEqual_(docAggregateStatus_([j("COMPLETED"), j("UPLOADED")], ""), "UPLOADED", "langsamster Job");
      selfTestAssertEqual_(docAggregateStatus_([j("COMPLETED"), j("CANCELLED")], ""), "COMPLETED", "abgebrochene ignoriert");
      selfTestAssertEqual_(docAggregateStatus_([j("CANCELLED")], ""), "CANCELLED", "nur abgebrochen");
      selfTestAssertEqual_(docAggregateStatus_([], ""), "NEW", "keine Jobs");
      selfTestAssertEqual_(docAggregateStatus_([j("UPLOADED")], "COMPLETED_BY_VENDOR"), "COMPLETED", "Phrase-Status gewinnt");
      return selfTestOk_("5 Fälle");
    }},
    { group: "Logik", name: "Projektnotiz (Pivot-Marker)", fn: function () {
      var withMarker = pivotBuildNote_("Bitte Glossar nutzen");
      if (withMarker.indexOf(PIVOT_NOTE_MARKER_) === -1) throw new Error("Marker fehlt");
      selfTestAssertEqual_(noteStripPivotMarker_(withMarker), "Bitte Glossar nutzen", "Marker entfernt");
      selfTestAssertEqual_(pivotBuildNote_(withMarker), withMarker, "Marker nicht doppelt");
      selfTestAssertEqual_(noteNormalizeJobUids_('["a","b"]'), ["a", "b"], "Job-UIDs aus JSON");
      selfTestAssertEqual_(noteNormalizeJobUids_("a; b"), ["a", "b"], "Job-UIDs aus Liste");
      return selfTestOk_("5 Fälle");
    }},
    { group: "Logik", name: "Dateinamen und Google-Formate", fn: function () {
      selfTestAssertEqual_(_buildTargetFileName_("Anleitung.docx", "en_gb", "", "", ""), "Anleitung_en_gb.docx", "Zieldateiname");
      selfTestAssertEqual_(_googleMimeForExt_(".xlsx"), "application/vnd.google-apps.spreadsheet", "xlsx -> Sheets");
      selfTestAssertEqual_(_googleMimeForExt_(".pdf"), "", "pdf bleibt");
      return selfTestOk_("3 Fälle");
    }},

    // Konfiguration
    { group: "Konfiguration", name: "Script Properties", fn: function () {
      var props = PropertiesService.getScriptProperties();
      var missing = ["PHRASE_API_TOKEN", "ACCESS_SHEET_ID", "OPS_SHEET_ID"].filter(function (k) {
        return !String(props.getProperty(k) || "").trim();
      });
      if (missing.length) return { status: "error", message: "Fehlt: " + missing.join(", ") };
      return selfTestOk_("Alle Pflicht-Properties gesetzt");
    }},
    { group: "Konfiguration", name: "Oberflächen-Dateien (include)", fn: function () {
      var missing = SELF_TEST_INCLUDE_FILES_.filter(function (n) {
        try { HtmlService.createHtmlOutputFromFile(n); return false; } catch (e) { return true; }
      });
      if (missing.length) return { status: "error", message: "Fehlt im Apps-Script-Projekt: " + missing.join(", ") };
      return selfTestOk_(SELF_TEST_INCLUDE_FILES_.length + " Dateien vorhanden");
    }},
    { group: "Konfiguration", name: "Browser-Code ohne doppelte Deklarationen", fn: selfTestDuplicateDecls_ },
    { group: "Oberfläche", name: "Knowledge Base: alle Artikel-Pakete lesbar", fn: function () {
      var bad = [];
      var articles = 0;
      for (var n = 1; n <= KB_CHUNK_COUNT_; n++) {
        try { articles += Object.keys(JSON.parse(apiKbChunk(n))).length; } catch (e) { bad.push("KbData" + n + " (" + e.message + ")"); }
      }
      if (!KB_CHUNK_COUNT_) return { status: "error", message: "Keine Pakete (npm run build:kb ausführen)" };
      if (bad.length) return { status: "error", message: "Fehlt/defekt: " + bad.join(", ") };
      return selfTestOk_(KB_CHUNK_COUNT_ + " Pakete, " + articles + " Artikel");
    }},
    { group: "Konfiguration", name: "Übersetzungen vollständig", fn: function () {
      var core = HtmlService.createHtmlOutputFromFile("JsCore").getContent();
      var enBlock = core.slice(core.search(/\n\s*en\s*:\s*\{/));
      var enKeys = {};
      (enBlock.match(/^\s*"([a-z0-9_]+)"\s*:/gm) || []).forEach(function (l) { enKeys[l.replace(/^\s*"|"\s*:$/g, "")] = true; });
      var total = Object.keys(enKeys).length;
      var gaps = [];
      Object.keys(I18N_DICTS_).forEach(function (lang) {
        var dict = I18N_DICTS_[lang] || {};
        var missing = Object.keys(enKeys).filter(function (k) { return !(k in dict); }).length;
        if (missing) gaps.push(lang + ": " + missing);
      });
      if (!total) return { status: "error", message: "Englisches Wörterbuch nicht gefunden" };
      if (gaps.length) return selfTestWarn_(total + " Schlüssel; fehlend (fällt auf Englisch zurück) - " + gaps.join(", "));
      return selfTestOk_(total + " Schlüssel in allen Sprachen");
    }},

    // Daten
    { group: "Daten", name: "Queue-Sheet (Projekte)", fn: function () {
      var sh = getQueueSheet_();
      if (!sh) return { status: "error", message: "Sheet 'Queue' nicht gefunden" };
      return selfTestOk_(Math.max(0, sh.getLastRow() - 1) + " Zeilen, " + sh.getLastColumn() + " Spalten");
    }},
    { group: "Daten", name: "Dokumentations-Queue", fn: function () {
      var sh = SpreadsheetApp.openById(DOC_QUEUE_SHEET_ID_).getSheetByName(DOC_QUEUE_SHEET_NAME_);
      if (!sh) return { status: "error", message: "Sheet nicht gefunden" };
      var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
      var needed = ["Project UID", "Project Name", "Status", "Target Lang", "Job UID"];
      var missing = needed.filter(function (h) { return headers.indexOf(h) === -1; });
      if (missing.length) return { status: "error", message: "Spalten fehlen: " + missing.join(", ") };
      return selfTestOk_(Math.max(0, sh.getLastRow() - 1) + " Zeilen, alle Pflichtspalten vorhanden");
    }},
    { group: "Daten", name: "Access-Sheet (Whitelists)", fn: function () {
      var ss = openAccessSS_();
      return selfTestOk_(ss.getSheets().length + " Tabellenblätter");
    }},

    // Integrationen
    { group: "Integrationen", name: "Phrase TMS erreichbar", fn: function () {
      var res = UrlFetchApp.fetch(getPhraseWebBaseUrl_() + "/api2/v1/projects?pageSize=1", {
        method: "get", headers: { Authorization: getPhraseAuthHeader_() }, muteHttpExceptions: true
      });
      var code = res.getResponseCode();
      return code < 400 ? selfTestOk_("HTTP " + code) : { status: "error", message: "HTTP " + code };
    }},
    { group: "Integrationen", name: "Speichern in Google Drive", fn: function () {
      return apiGetDriveSaveConfig().configured
        ? selfTestOk_("OAuth-Client eingerichtet")
        : selfTestWarn_("Nicht eingerichtet - 'In Drive speichern' ist für Nutzer ausgeblendet");
    }},
    { group: "Integrationen", name: "Automatische Status-Synchronisierung", fn: function () {
      var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === "autoSyncProjectStatuses_"; });
      return exists ? selfTestOk_("Trigger aktiv (alle 15 Minuten)") : selfTestWarn_("Kein Trigger - Status nur per 'Status synchronisieren'");
    }},
    { group: "Integrationen", name: "Zeitgesteuerte Trigger zeigen auf vorhandene Funktionen", fn: function () {
      var g = selfTestGlobal_();
      var triggers = ScriptApp.getProjectTriggers();
      var dead = triggers.map(function (t) { return t.getHandlerFunction(); }).filter(function (h) { return typeof g[h] !== "function"; });
      if (dead.length) return { status: "error", message: "Funktion fehlt: " + dead.join(", ") };
      return selfTestOk_(triggers.length + " Trigger in Ordnung");
    }},
    { group: "Integrationen", name: "Phrase-Kataloge (Clients, Domains, Workflow, MT)", fn: function () {
      var c = maxTplCatalog_();
      var counts = ["clients", "domains", "subDomains", "businessUnits", "workflowSteps", "mtSettings"].map(function (k) { return k + " " + (c[k] || []).length; });
      if (!(c.workflowSteps || []).length) return selfTestWarn_("Keine Workflow-Schritte geladen - " + counts.join(", "));
      return selfTestOk_(counts.join(", "));
    }},
    { group: "Integrationen", name: "Phrase-Sprachliste", fn: function () {
      var n = mgrLanguages_().length;
      return n ? selfTestOk_(n + " Sprachen") : selfTestWarn_("Keine Sprachen geladen - Auswahl in der Nutzerverwaltung fällt auf Textfelder zurück");
    }},
    { group: "Integrationen", name: "E-Mail-Kontingent", fn: function () {
      var left = MailApp.getRemainingDailyQuota();
      return left > 20 ? selfTestOk_(left + " Mails heute übrig") : selfTestWarn_("Nur noch " + left + " Mails heute");
    }},

    // Weitere Logik und Daten
    { group: "Logik", name: "Mehrfachwerte (hinzufügen / entfernen / ersetzen)", fn: function () {
      selfTestAssertEqual_(mergeMultiValue_("KAG, KNA", "kna, HC", "add"), "KAG, KNA, HC", "hinzufügen");
      selfTestAssertEqual_(mergeMultiValue_("KAG, KNA", "kag", "remove"), "KNA", "entfernen");
      selfTestAssertEqual_(mergeMultiValue_("KAG", "X; Y", "replace"), "X, Y", "ersetzen");
      return selfTestOk_("3 Fälle");
    }},
    { group: "Logik", name: "Nutzer-/Template-Werte für Phrase", fn: function () {
      var cat = { clients: [{ id: "1", name: "AKW" }], businessUnits: [{ id: "b", name: "OTC" }] };
      selfTestAssertEqual_(mgrPhraseValue_("clients", "akw", cat), [{ id: "1" }], "Clients per Name");
      selfTestAssertEqual_(mgrPhraseValue_("businessUnit", "OTC", cat), { id: "b" }, "Business Unit");
      selfTestAssertEqual_(mgrPhraseValue_("targetLangs", "DE_DE, fr_fr", cat), ["de_de", "fr_fr"], "Sprachen");
      selfTestAssertEqual_(mgrEditBody_({ uid: "U", clients: [{ id: 1, name: "AKW" }] }), { clients: [{ id: "1" }] }, "PUT-Body");
      return selfTestOk_("4 Fälle");
    }},
    { group: "Logik", name: "Maximaltemplate-Regeln", fn: function () {
      var cfg = maxTplSanitizeConfig_({ lists: { mtSettings: [{ id: "m1" }] }, sections: [{ key: "qa", path: "/projects/{uid}/qaSettings", fields: { a: { editable: true, type: "boolean" } } }] });
      var r = maxTplEnforceConfig_(maxTplSanitize_({ mtSettingsUid: "m2", extra: { qa: { a: "true", b: "x" } } }), cfg);
      selfTestAssertEqual_(r.ms.mtSettingsUid, "", "MT-Profil nicht freigegeben");
      selfTestAssertEqual_(r.ms.extra, { qa: { a: true } }, "nur freigegebene Felder");
      return selfTestOk_("2 Fälle");
    }},
    { group: "Konfiguration", name: "Browser-Dateien mit eigenem Inhalt", fn: function () {
      var wrong = checkFileSignatures_();
      return wrong.length ? { status: "error", message: wrong.join("; ") } : selfTestOk_(Object.keys(SELF_TEST_FILE_SIGNATURES_).length + " Dateien geprüft");
    }},
    { group: "Konfiguration", name: "Startdokument unter der Apps-Script-Grenze", fn: function () {
      var len = HtmlService.createTemplateFromFile("Index").evaluate().getContent().length;
      if (len > 590000) return { status: "error", message: len + " Zeichen - die Seite wird abgeschnitten" };
      return len > 560000 ? selfTestWarn_(len + " Zeichen - knapp an der Grenze (~600.000)") : selfTestOk_(len + " Zeichen");
    }},
    { group: "Konfiguration", name: "Maximaltemplate-Regeln", fn: function () {
      var cfg = maxTplLoadConfig_();
      var lists = Object.keys(cfg.lists).length;
      var fields = cfg.sections.reduce(function (n, s) { return n + (s.enabled ? Object.keys(s.fields).length : 0); }, 0);
      return selfTestOk_(lists + " eingeschränkte Listen, " + cfg.sections.length + " Bereiche, " + fields + " freigegebene Felder");
    }},
    { group: "Daten", name: "Template-Sheet (sichtbare Vorlagen)", fn: function () {
      var n = Object.keys(readTemplates_()).length;
      return n ? selfTestOk_(n + " aktive Vorlagen") : selfTestWarn_("Keine aktiven Vorlagen - Nutzer sehen nichts im Dropdown");
    }},
    { group: "Daten", name: "Nutzer-Sheet (FetchTMS_USERS-Prod)", fn: function () {
      var sh = openUserSheetSS_().getSheetByName("FetchTMS_USERS-Prod");
      if (!sh) return { status: "error", message: "Sheet nicht gefunden" };
      var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
      var missing = Object.keys(USER_MGR_HEADER_MAP).filter(function (h) { return headers.indexOf(h) === -1; });
      if (missing.length) return selfTestWarn_("Spalten fehlen: " + missing.join(", "));
      return selfTestOk_(Math.max(0, sh.getLastRow() - 1) + " Nutzer, alle Spalten vorhanden");
    }},
    { group: "Daten", name: "Whitelists aller Bereiche lesbar", fn: function () {
      var bad = [];
      var total = 0;
      accessAreas_().forEach(function (a) {
        try { total += (a.get().emails || []).length; } catch (e) { bad.push(a.id + " (" + e.message + ")"); }
      });
      return bad.length ? { status: "error", message: bad.join("; ") } : selfTestOk_(accessAreas_().length + " Bereiche, " + total + " Einträge");
    }},
    { group: "Daten", name: "Prompt-Hub", fn: function () {
      var n = maxTplPromptHub_("").prompts.length;
      return n ? selfTestOk_(n + " Prompts") : selfTestWarn_("Kein Prompt im Sheet 'Prompt_Hub'");
    }}
  ];
}
