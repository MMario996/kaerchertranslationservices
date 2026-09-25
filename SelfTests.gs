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
  "JsUpload", "JsProjects", "JsDownload", "JsMisc",
  "GuideContent", "AdminConsole", "AdminScript", "PivotAdminConsole", "PivotAdminScript"
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
    }}
  ];
}
