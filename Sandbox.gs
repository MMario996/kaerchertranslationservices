/**
 * Sandbox.gs
 * Admin-Sandbox: Ein Admin kann sein Portal (nur fuer sich, nur in seiner
 * eigenen Sitzung) auf die Phrase-Sandbox umschalten und dort alles testen,
 * ohne Produktivdaten anzufassen.
 *
 * Umgeschaltet wird, solange der Sandbox-Modus des angemeldeten Admins an ist:
 *   - Phrase-Token und Basis-URL      (getPhraseToken_, getPhraseWebBaseUrl_ in ProjectsApi.gs)
 *   - Vorlagen-Sheet                   (templateSheetName_: Vorlagenliste, Template Manager, Template-Sync)
 *   - OPS-Spreadsheet (Queue, Consulting_Requests, Precalc_Log)  -> eigenes Spreadsheet
 *   - Phrase-Caches (Custom Fields, Vorlagen-Details, Maximaltemplate-Kataloge, Pivot)
 *   - Custom Field "Project Creator" (UID unterscheidet sich je Phrase-Umgebung)
 *   - Chat-Nachrichten bekommen den Praefix "[SANDBOX]"
 * NICHT umgeschaltet: Nutzer-Sheet (FetchTMS_USERS-Prod), Whitelists, Einstellungen,
 * Dokumentations-Queues. Der Nutzer-Sync ist im Sandbox-Modus gesperrt, damit die
 * Produktiv-Nutzerliste nicht mit Sandbox-Nutzern ueberschrieben wird.
 * Zeitgesteuerte Trigger (Auto-Sync) laufen ohne angemeldeten Nutzer und damit
 * immer gegen die Produktion; Sandbox-Projekte werden ueber "Status
 * synchronisieren" in "Meine Projekte" abgeglichen.
 *
 * Script Properties:
 *   PHRASE_SANDBOX_API_TOKEN            Token der Sandbox (Pflicht, sonst ist der Modus nicht verfuegbar)
 *   PHRASE_SANDBOX_BASE_URL             Basis-URL (Standard wie PHRASE_API_BASE_URL)
 *   SANDBOX_TEMPLATE_SHEET              Vorlagen-Sheet im Access-Sheet (Standard "FetchTemplate-Test")
 *   SANDBOX_OPS_SHEET_ID                OPS-Spreadsheet der Sandbox (wird beim ersten Einschalten angelegt)
 *   PHRASE_SANDBOX_CF_PROJECT_CREATOR_UID  UID des Custom Fields "Project Creator" in der Sandbox
 *   SANDBOX_ON__<email>                 Laufzeit: Modus pro Admin (gesetzt ueber apiSetSandboxMode)
 */
var SANDBOX_PREFIX_PROP_ = "SANDBOX_ON__";
var sandboxActiveMemo_ = null; // pro Ausfuehrung (Apps Script setzt Globals je Aufruf neu)

function sandboxConfigured_() {
  return !!String(PropertiesService.getScriptProperties().getProperty("PHRASE_SANDBOX_API_TOKEN") || "").trim();
}

/** Ist fuer den angemeldeten Nutzer gerade der Sandbox-Modus an? (Trigger/Chat: nie) */
function sandboxActive_() {
  if (sandboxActiveMemo_ !== null) return sandboxActiveMemo_;
  var on = false;
  try {
    var email = String(Session.getActiveUser().getEmail() || "").trim().toLowerCase();
    if (email && sandboxConfigured_()) {
      var props = PropertiesService.getScriptProperties();
      on = props.getProperty(SANDBOX_PREFIX_PROP_ + email) === "1" && isAdmin_(email);
    }
  } catch (e) { on = false; }
  sandboxActiveMemo_ = on;
  return on;
}

function templateSheetName_() {
  if (!sandboxActive_()) return TEMPLATE_SHEET_NAME;
  return String(PropertiesService.getScriptProperties().getProperty("SANDBOX_TEMPLATE_SHEET") || "").trim() || "FetchTemplate-Test";
}

/** OPS-Spreadsheet-ID der Sandbox ("" = noch keins). */
function sandboxOpsSheetId_() {
  return String(PropertiesService.getScriptProperties().getProperty("SANDBOX_OPS_SHEET_ID") || "").trim();
}

/** Reine Funktion (getestet): Cache-Schluessel getrennt je Umgebung. */
function sandboxCacheKey_(key, active) {
  return active ? "sbx_" + key : key;
}

/**
 * Script-Cache fuer Phrase-Daten: dieselbe Schnittstelle wie CacheService, aber
 * im Sandbox-Modus mit eigenem Schluessel-Praefix (Custom-Field-UIDs, Vorlagen
 * usw. unterscheiden sich zwischen Produktion und Sandbox).
 */
function phraseScriptCache_() {
  var cache = CacheService.getScriptCache();
  var active = sandboxActive_();
  var k = function (key) { return sandboxCacheKey_(key, active); };
  return {
    get: function (key) { return cache.get(k(key)); },
    put: function (key, val, ttl) { return ttl === undefined ? cache.put(k(key), val) : cache.put(k(key), val, ttl); },
    remove: function (key) { return cache.remove(k(key)); },
    getAll: function (keys) {
      var raw = cache.getAll(keys.map(k));
      var out = {};
      keys.forEach(function (key) { if (raw[k(key)] !== undefined) out[key] = raw[k(key)]; });
      return out;
    },
    putAll: function (map, ttl) {
      var m = {};
      Object.keys(map).forEach(function (key) { m[k(key)] = map[key]; });
      return ttl === undefined ? cache.putAll(m) : cache.putAll(m, ttl);
    },
    removeAll: function (keys) { return cache.removeAll(keys.map(k)); }
  };
}

/** Kopiert die Kopfzeile der produktiven Queue in ein neues Sandbox-OPS-Spreadsheet. */
function sandboxEnsureOpsSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = sandboxOpsSheetId_();
  if (id) { try { SpreadsheetApp.openById(id); return id; } catch (e) { console.warn("SANDBOX_OPS_SHEET_ID ungueltig: " + e.message); } }
  var prodId = String(props.getProperty("OPS_SHEET_ID") || "").trim();
  var ss = SpreadsheetApp.create("KTS Sandbox OPS");
  var q = ss.getSheets()[0].setName("Queue");
  try {
    var prodQ = SpreadsheetApp.openById(prodId).getSheetByName("Queue");
    var header = prodQ.getRange(1, 1, 1, prodQ.getLastColumn()).getValues()[0];
    q.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold").setBackground("#FF9800");
    q.setFrozenRows(1);
  } catch (e) { console.warn("Sandbox-Queue ohne Kopfzeile angelegt: " + e.message); }
  props.setProperty("SANDBOX_OPS_SHEET_ID", ss.getId());
  return ss.getId();
}

// --- Endpunkte (Admin) -----------------------------------------------------------

function apiGetSandboxStatus() {
  var email = getUserEmail_();
  if (!isAdmin_(email)) return { success: false, error: "Not authorized. Admin only." };
  var props = PropertiesService.getScriptProperties();
  var opsId = sandboxOpsSheetId_();
  return {
    success: true,
    configured: sandboxConfigured_(),
    active: sandboxActive_(),
    baseUrl: String(props.getProperty("PHRASE_SANDBOX_BASE_URL") || props.getProperty("PHRASE_API_BASE_URL") || "https://cloud.memsource.com/web"),
    templateSheet: String(props.getProperty("SANDBOX_TEMPLATE_SHEET") || "").trim() || "FetchTemplate-Test",
    opsSheetUrl: opsId ? "https://docs.google.com/spreadsheets/d/" + opsId + "/edit" : "",
    creatorField: !!String(props.getProperty("PHRASE_SANDBOX_CF_PROJECT_CREATOR_UID") || "").trim()
  };
}

function apiSetSandboxMode(enabled) {
  var email = getUserEmail_();
  if (!isAdmin_(email)) return { success: false, error: "Not authorized. Admin only." };
  if (enabled && !sandboxConfigured_()) return { success: false, error: "PHRASE_SANDBOX_API_TOKEN is not set (Admin → System → Script Properties)." };
  var props = PropertiesService.getScriptProperties();
  if (enabled) {
    sandboxEnsureOpsSheet_();
    props.setProperty(SANDBOX_PREFIX_PROP_ + email, "1");
  } else {
    props.deleteProperty(SANDBOX_PREFIX_PROP_ + email);
  }
  sandboxActiveMemo_ = null;
  logAuditEvent_(email, enabled ? "SANDBOX_ON" : "SANDBOX_OFF", "");
  return apiGetSandboxStatus();
}
