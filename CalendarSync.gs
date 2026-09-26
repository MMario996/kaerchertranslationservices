/**
 * CalendarSync.gs
 *
 * Projektfristen automatisch im EIGENEN Google Kalender des Nutzers.
 *
 * Warum kein CalendarApp: die Web-App laeuft mit "Execute as: Me"
 * (USER_DEPLOYING) - CalendarApp wuerde immer in den Kalender des
 * Deploy-Kontos schreiben. Deshalb derselbe Weg wie bei "In Google Drive
 * speichern" (DriveSaveConfig.gs): 3-legged OAuth ueber die OAuth2-Bibliothek
 * mit derselben OAuth-Client-ID/-Secret, nur mit dem Scope
 * "calendar.app.created". Damit darf die App NUR Kalender anlegen und
 * bearbeiten, die sie selbst erstellt hat - an die uebrigen Kalender des
 * Nutzers kommt sie nicht heran.
 *
 * Ablauf:
 *  - Nutzer klickt "Mit Google Kalender verbinden" -> Google-Freigabe.
 *  - Die App legt im Konto des Nutzers einen Kalender
 *    "Kärcher Translation Services" an und traegt jede Projektfrist als
 *    Termin ein (eigene + geteilte Projekte). Aenderungen (Frist, Name,
 *    Status) werden nachgezogen, abgebrochene Projekte entfernt.
 *  - Aktualisierung: stuendlicher Trigger (calendarSyncAllTrigger),
 *    sofort beim Aendern einer Frist/eines Namens/beim Teilen und ueber den
 *    Button "Jetzt synchronisieren".
 *
 * Tokens: anders als beim Drive-Export muss der stuendliche Trigger auch
 * ohne angemeldeten Nutzer an den Token kommen. Er liegt daher pro Nutzer in
 * den Script Properties (Service-Name "Cal_<hash>"), die E-Mail steckt
 * signiert im OAuth-State-Token.
 *
 * Einmalige Einrichtung (Admin):
 *  1. Im GCP-Projekt des Apps-Script-Projekts die "Google Calendar API"
 *     aktivieren.
 *  2. Auf dem OAuth-Zustimmungsbildschirm den Scope
 *     https://www.googleapis.com/auth/calendar.app.created ergaenzen.
 *  3. Client-ID/-Secret sind dieselben wie unter "Google Drive Export"
 *     (Admin-Bereich) - keine weitere Konfiguration noetig.
 *  4. Den stuendlichen Trigger legt die App beim ersten Einschalten selbst
 *     an (calendarEnsureTrigger_, als Deploy-Konto).
 *
 * Sheet: "CalendarSync" in ACCESS_SHEET_ID
 * Spalten: Email | Enabled | Calendar ID | Include Done | Lang | Last Sync | Last Result
 */
var CAL_SHEET_NAME_ = "CalendarSync";
var CAL_HEADERS_ = ["Email", "Enabled", "Calendar ID", "Include Done", "Lang", "Last Sync", "Last Result"];
var CAL_SCOPE_ = "https://www.googleapis.com/auth/calendar.app.created";
var CAL_API_ = "https://www.googleapis.com/calendar/v3";
var CAL_NAME_ = "Kärcher Translation Services";
var CAL_TRIGGER_FN_ = "calendarSyncAllTrigger";
var CAL_MAX_WRITES_PER_RUN_ = 200;

var CAL_TEXT_ = {
  de: { due: "Frist", done: "Fertig", cancelled: "Abgebrochen", status: "Status", langs: "Zielsprachen", template: "Vorlage", owner: "Auftraggeber", portal: "Im Portal öffnen", phrase: "In Phrase öffnen" },
  en: { due: "Due", done: "Done", cancelled: "Cancelled", status: "Status", langs: "Target languages", template: "Template", owner: "Requested by", portal: "Open in the portal", phrase: "Open in Phrase" },
  fr: { due: "Échéance", done: "Terminé", cancelled: "Annulé", status: "Statut", langs: "Langues cibles", template: "Modèle", owner: "Demandeur", portal: "Ouvrir dans le portail", phrase: "Ouvrir dans Phrase" },
  es: { due: "Plazo", done: "Terminado", cancelled: "Cancelado", status: "Estado", langs: "Idiomas de destino", template: "Plantilla", owner: "Solicitante", portal: "Abrir en el portal", phrase: "Abrir en Phrase" },
  pt: { due: "Prazo", done: "Concluído", cancelled: "Cancelado", status: "Status", langs: "Idiomas de destino", template: "Modelo", owner: "Solicitante", portal: "Abrir no portal", phrase: "Abrir no Phrase" },
  zh: { due: "截止", done: "已完成", cancelled: "已取消", status: "状态", langs: "目标语言", template: "模板", owner: "申请人", portal: "在门户中打开", phrase: "在 Phrase 中打开" }
};

// ============================================================================
// OAuth2 (ein Service pro Nutzer, Token in den Script Properties)
// ============================================================================

function calServiceName_(email) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(email || "").toLowerCase().trim());
  return "Cal_" + digest.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("").slice(0, 20);
}

function calOAuthService_(email) {
  var props = PropertiesService.getScriptProperties();
  return OAuth2.createService(calServiceName_(email))
    .setAuthorizationBaseUrl("https://accounts.google.com/o/oauth2/auth")
    .setTokenUrl("https://oauth2.googleapis.com/token")
    .setClientId(props.getProperty(DRIVE_SAVE_CLIENT_ID_PROP_) || "")
    .setClientSecret(props.getProperty(DRIVE_SAVE_CLIENT_SECRET_PROP_) || "")
    .setCallbackFunction("calendarOAuthCallback_")
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope(CAL_SCOPE_)
    .setParam("access_type", "offline")
    .setParam("prompt", "consent")
    .setParam("login_hint", String(email || ""));
}

/** Callback der OAuth2-Bibliothek; die E-Mail kommt signiert aus dem State-Token. */
function calendarOAuthCallback_(request) {
  var email = String((request && request.parameter && request.parameter.calEmail) || "").toLowerCase();
  var ok = false;
  try { ok = !!email && calOAuthService_(email).handleCallback(request); } catch (e) { ok = false; }
  // Achtung: /usercallback laeuft als der zugreifende Nutzer, nicht als
  // Deploy-Konto - hier also KEINE Sheets/Trigger anfassen. Das Einschalten
  // und der erste Abgleich passieren danach ueber die Web-App
  // (apiSetCalendarSyncOptions), die als Deploy-Konto laeuft.
  var body = ok
    ? "<p style=\"font-size:40px;margin:0\">📅</p><p><b>Google Calendar connected.</b></p>" +
      "<p>Go back to the Translation Services portal - your deadlines are synced into the calendar \"" + CAL_NAME_ + "\" automatically.<br>" +
      "You can close this tab.</p>" +
      "<script>setTimeout(function(){ window.close(); }, 2500);</" + "script>"
    : "<p>⚠️ Authorization denied or failed.</p><p>You can close this tab and try again.</p>";
  return HtmlService.createHtmlOutput("<html><body style=\"font-family:sans-serif;padding:30px;text-align:center;\">" + body + "</body></html>");
}

// ============================================================================
// Sheet mit dem Sync-Status pro Nutzer
// ============================================================================

function calSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(CAL_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(CAL_SHEET_NAME_);
    sh.appendRow(CAL_HEADERS_);
    sh.getRange(1, 1, 1, CAL_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function calRowFromValues_(v, rowNum) {
  var last = v[5] instanceof Date ? v[5] : (v[5] ? new Date(v[5]) : null);
  return {
    rowNum: rowNum,
    email: String(v[0] || "").trim().toLowerCase(),
    enabled: String(v[1]).toUpperCase() === "TRUE" || v[1] === true,
    calendarId: String(v[2] || "").trim(),
    includeDone: !(String(v[3]).toUpperCase() === "FALSE" || v[3] === false),
    lang: String(v[4] || "en"),
    lastSync: last && !isNaN(last.getTime()) ? last.toISOString() : "",
    lastResult: String(v[6] || "")
  };
}

function calRowsAll_() {
  var values = calSheet_().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var r = calRowFromValues_(values[i], i + 1);
    if (r.email) out.push(r);
  }
  return out;
}

function calRowGet_(email) {
  var key = String(email || "").toLowerCase();
  var rows = calRowsAll_();
  for (var i = 0; i < rows.length; i++) if (rows[i].email === key) return rows[i];
  return null;
}

function calRowUpsert_(email, patch) {
  var key = String(email || "").toLowerCase().trim();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = calSheet_();
    var cur = calRowGet_(key) || { rowNum: -1, email: key, enabled: false, calendarId: "", includeDone: true, lang: "en", lastSync: "", lastResult: "" };
    Object.keys(patch || {}).forEach(function (k) { cur[k] = patch[k]; });
    var row = [key, cur.enabled ? "TRUE" : "FALSE", cur.calendarId || "", cur.includeDone ? "TRUE" : "FALSE",
      cur.lang || "en", cur.lastSync ? new Date(cur.lastSync) : "", String(cur.lastResult || "").slice(0, 500)];
    if (cur.rowNum > 0) sh.getRange(cur.rowNum, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return cur;
  } finally {
    lock.releaseLock();
  }
}

function calendarEnsureTrigger_() {
  var exists = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === CAL_TRIGGER_FN_; });
  if (!exists) ScriptApp.newTrigger(CAL_TRIGGER_FN_).timeBased().everyHours(1).create();
}

// ============================================================================
// Client-APIs
// ============================================================================

function apiGetCalendarSyncStatus() {
  var email = getUserEmail_();
  var cfg = apiGetDriveSaveConfig();
  var row = calRowGet_(email);
  var authorized = false;
  try { authorized = cfg.configured && calOAuthService_(email).hasAccess(); } catch (e) {}
  return {
    success: true,
    configured: !!cfg.configured,
    authorized: authorized,
    enabled: !!(row && row.enabled && authorized),
    includeDone: row ? row.includeDone : true,
    calendarId: row ? row.calendarId : "",
    lastSync: row ? row.lastSync : "",
    lastResult: row ? row.lastResult : ""
  };
}

function apiGetCalendarAuthUrl(lang) {
  var email = getUserEmail_();
  if (!apiGetDriveSaveConfig().configured) return { success: false, error: "not_configured" };
  try {
    calRowUpsert_(email, { lang: CAL_TEXT_[lang] ? lang : "en" });
    return { success: true, url: calOAuthService_(email).getAuthorizationUrl({ calEmail: email.toLowerCase() }) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function apiSetCalendarSyncOptions(opts) {
  var email = getUserEmail_();
  opts = opts || {};
  var patch = {};
  if (opts.hasOwnProperty("includeDone")) patch.includeDone = !!opts.includeDone;
  if (opts.hasOwnProperty("enabled")) patch.enabled = !!opts.enabled;
  if (opts.lang && CAL_TEXT_[opts.lang]) patch.lang = opts.lang;
  calRowUpsert_(email, patch);
  if (patch.enabled) calendarEnsureTrigger_();
  if (patch.enabled !== false) {
    try { return apiCalendarSyncNow(); } catch (e) { return { success: false, error: e.message }; }
  }
  return apiGetCalendarSyncStatus();
}

function apiCalendarSyncNow() {
  var email = getUserEmail_();
  var res = calendarSyncUser_(email);
  var status = apiGetCalendarSyncStatus();
  status.result = res;
  if (!res.success) { status.success = false; status.error = res.error; }
  return status;
}

/** Trennt die Verbindung. deleteCalendar=true entfernt auch den App-Kalender samt Terminen. */
function apiDisconnectCalendar(deleteCalendar) {
  var email = getUserEmail_();
  var row = calRowGet_(email);
  var service = calOAuthService_(email);
  if (deleteCalendar && row && row.calendarId && service.hasAccess()) {
    try { calFetch_(service.getAccessToken(), "delete", "/calendars/" + encodeURIComponent(row.calendarId)); } catch (e) {}
  }
  try {
    var token = service.hasAccess() ? service.getAccessToken() : "";
    if (token) UrlFetchApp.fetch("https://oauth2.googleapis.com/revoke?token=" + encodeURIComponent(token), { method: "post", muteHttpExceptions: true });
  } catch (e) {}
  service.reset();
  calRowUpsert_(email, { enabled: false, calendarId: deleteCalendar ? "" : (row ? row.calendarId : ""), lastResult: "disconnected" });
  return apiGetCalendarSyncStatus();
}

// ============================================================================
// Sync-Logik
// ============================================================================

function calFetch_(token, method, path, body) {
  var opts = { method: method, headers: { Authorization: "Bearer " + token }, muteHttpExceptions: true };
  if (body) { opts.contentType = "application/json"; opts.payload = JSON.stringify(body); }
  var res = UrlFetchApp.fetch(CAL_API_ + path, opts);
  var code = res.getResponseCode();
  var text = res.getContentText() || "";
  var data = {};
  try { data = text ? JSON.parse(text) : {}; } catch (e) {}
  return { code: code, data: data };
}

/** Deterministische Termin-ID aus der Projekt-UID (erlaubt: a-v, 0-9). */
function calEventId_(projectUid) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, "kts:" + projectUid);
  return "kts" + digest.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}

function calProjectsForUser_(email, rows) {
  var key = String(email || "").toLowerCase();
  return (rows || readQueueRows_()).filter(function (r) {
    if (!r.projectUid || !r.dueDate) return false;
    if (r.pivotRole === "CHILD") return false;
    if (r.owner === key) return true;
    return String(r.sharedWith || "").toLowerCase().split(/[;,]+/).map(function (s) { return s.trim(); }).indexOf(key) >= 0;
  });
}

function calStatusGroup_(status) {
  var s = String(status || "").toUpperCase();
  if (["COMPLETED", "DELIVERED", "NOTIFIED"].indexOf(s) >= 0) return "done";
  if (["CANCELLED", "CANCELED", "REJECTED", "ERROR"].indexOf(s) >= 0) return "cancelled";
  return "open";
}

/** Gewuenschter Termin fuer ein Projekt oder null (kein Termin). */
function calBuildEvent_(p, row) {
  var due = p.dueDate instanceof Date ? p.dueDate : new Date(p.dueDate);
  if (isNaN(due.getTime())) return null;
  var group = calStatusGroup_(p.status);
  if (group === "cancelled") return null;
  if (group === "done" && !row.includeDone) return null;

  var T = CAL_TEXT_[row.lang] || CAL_TEXT_.en;
  var prefix = group === "done" ? "✅ " + T.done : "⏰ " + T.due;
  var start = new Date(due.getTime() - 30 * 60000);
  var langs = (p.targetLangs || []).join(", ") || p.targetLang || "-";
  var description = [
    T.status + ": " + (p.status || "-"),
    T.langs + ": " + langs,
    p.templateName ? T.template + ": " + p.templateName : "",
    p.owner && p.owner !== row.email ? T.owner + ": " + p.owner : "",
    "",
    T.portal + ": " + PORTAL_URL_,
    p.phraseUrl ? T.phrase + ": " + p.phraseUrl : ""
  ].filter(function (l, i) { return l !== "" || i === 4; }).join("\n");

  var ev = {
    summary: prefix + ": " + (p.projectName || p.projectUid),
    description: description,
    start: { dateTime: start.toISOString() },
    end: { dateTime: due.toISOString() },
    colorId: group === "done" ? "2" : "5",
    transparency: "transparent",
    source: { title: "Translation Services", url: PORTAL_URL_ },
    reminders: group === "done" ? { useDefault: false, overrides: [] }
      : { useDefault: false, overrides: [{ method: "popup", minutes: 24 * 60 }, { method: "popup", minutes: 60 }] },
    extendedProperties: { private: { kts: "1", projectUid: String(p.projectUid) } }
  };
  ev.extendedProperties.private.fp = calFingerprint_(ev);
  return ev;
}

function calFingerprint_(ev) {
  var raw = JSON.stringify([ev.summary, ev.description, ev.start, ev.end, ev.colorId, ev.reminders]);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, raw);
  return Utilities.base64Encode(digest).slice(0, 16);
}

/** Legt den App-Kalender an, falls er fehlt oder vom Nutzer geloescht wurde. */
function calEnsureCalendar_(token, row) {
  if (row.calendarId) {
    var chk = calFetch_(token, "get", "/calendars/" + encodeURIComponent(row.calendarId));
    if (chk.code === 200) return row.calendarId;
  }
  var created = calFetch_(token, "post", "/calendars", { summary: CAL_NAME_, description: "Project deadlines from the Kärcher Translation Services portal. " + PORTAL_URL_, timeZone: Session.getScriptTimeZone() });
  if (!created.data || !created.data.id) {
    throw new Error((created.data && created.data.error && created.data.error.message) || ("Could not create calendar (HTTP " + created.code + ")."));
  }
  // Kaercher-Gelb als Farbe in der Kalenderliste des Nutzers.
  calFetch_(token, "patch", "/users/me/calendarList/" + encodeURIComponent(created.data.id) + "?colorRgbFormat=true",
    { backgroundColor: "#FFED00", foregroundColor: "#000000", selected: true });
  calRowUpsert_(row.email, { calendarId: created.data.id });
  row.calendarId = created.data.id;
  return created.data.id;
}

function calListEvents_(token, calendarId) {
  var out = {};
  var pageToken = "";
  do {
    var path = "/calendars/" + encodeURIComponent(calendarId) + "/events?maxResults=2500&showDeleted=false" +
      "&privateExtendedProperty=" + encodeURIComponent("kts=1") + (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : "");
    var res = calFetch_(token, "get", path);
    if (res.code !== 200) throw new Error((res.data.error && res.data.error.message) || ("Calendar list failed (HTTP " + res.code + ")."));
    (res.data.items || []).forEach(function (e) { out[e.id] = e; });
    pageToken = res.data.nextPageToken || "";
  } while (pageToken);
  return out;
}

function calUpsertEvent_(token, calendarId, id, ev, exists) {
  var base = "/calendars/" + encodeURIComponent(calendarId) + "/events";
  if (exists) {
    var upd = calFetch_(token, "put", base + "/" + id, ev);
    if (upd.code === 200) return true;
    if (upd.code !== 404 && upd.code !== 410) throw new Error((upd.data.error && upd.data.error.message) || ("HTTP " + upd.code));
  }
  var body = JSON.parse(JSON.stringify(ev));
  body.id = id;
  var ins = calFetch_(token, "post", base, body);
  if (ins.code === 200) return true;
  // 409: ID existiert schon (z.B. frueher geloeschter Termin) -> per PUT wiederbeleben.
  if (ins.code === 409) {
    ev.status = "confirmed";
    var put = calFetch_(token, "put", base + "/" + id, ev);
    if (put.code === 200) return true;
    throw new Error((put.data.error && put.data.error.message) || ("HTTP " + put.code));
  }
  throw new Error((ins.data.error && ins.data.error.message) || ("HTTP " + ins.code));
}

/** Vollabgleich fuer einen Nutzer. rows optional (Trigger liest die Queue nur einmal). */
function calendarSyncUser_(email, rows) {
  email = String(email || "").toLowerCase();
  var row = calRowGet_(email);
  if (!row || !row.enabled) return { success: false, error: "not_enabled" };
  var service = calOAuthService_(email);
  if (!service.hasAccess()) {
    calRowUpsert_(email, { lastResult: "needs_auth" });
    return { success: false, error: "needs_auth" };
  }
  try {
    var token = service.getAccessToken();
    var calendarId = calEnsureCalendar_(token, row);
    var existing = calListEvents_(token, calendarId);
    var wanted = {};
    calProjectsForUser_(email, rows).forEach(function (p) {
      var ev = calBuildEvent_(p, row);
      if (ev) wanted[calEventId_(p.projectUid)] = ev;
    });

    var stats = { created: 0, updated: 0, deleted: 0, unchanged: 0, errors: 0 };
    var writes = 0;
    Object.keys(wanted).forEach(function (id) {
      var cur = existing[id];
      var ev = wanted[id];
      if (cur && cur.extendedProperties && cur.extendedProperties.private &&
          cur.extendedProperties.private.fp === ev.extendedProperties.private.fp) { stats.unchanged++; return; }
      if (writes >= CAL_MAX_WRITES_PER_RUN_) return;
      writes++;
      try { calUpsertEvent_(token, calendarId, id, ev, !!cur); stats[cur ? "updated" : "created"]++; }
      catch (e) { stats.errors++; console.warn("Calendar upsert failed (" + email + "): " + e.message); }
    });
    Object.keys(existing).forEach(function (id) {
      if (wanted[id] || writes >= CAL_MAX_WRITES_PER_RUN_) return;
      writes++;
      var del = calFetch_(token, "delete", "/calendars/" + encodeURIComponent(calendarId) + "/events/" + id);
      if (del.code === 204 || del.code === 200 || del.code === 404 || del.code === 410) stats.deleted++;
      else stats.errors++;
    });

    var summary = "ok: +" + stats.created + " ~" + stats.updated + " -" + stats.deleted + " =" + stats.unchanged +
      (stats.errors ? " errors " + stats.errors : "");
    calRowUpsert_(email, { lastSync: new Date().toISOString(), lastResult: summary });
    return { success: true, stats: stats, events: Object.keys(wanted).length };
  } catch (e) {
    calRowUpsert_(email, { lastSync: new Date().toISOString(), lastResult: "error: " + e.message });
    return { success: false, error: e.message };
  }
}

/** Nach Frist-/Namens-/Freigabe-Aenderung: nur diesen einen Termin bei allen Beteiligten nachziehen. */
function calendarRefreshProject_(projectUid) {
  var uid = String(projectUid || "").trim();
  if (!uid) return;
  var enabled = calRowsAll_().filter(function (r) { return r.enabled; });
  if (!enabled.length) return;
  var p = readQueueRows_().filter(function (r) { return r.projectUid === uid; })[0];
  if (!p) return;
  var involved = [p.owner].concat(String(p.sharedWith || "").toLowerCase().split(/[;,]+/).map(function (s) { return s.trim(); }));
  enabled.forEach(function (row) {
    if (involved.indexOf(row.email) < 0 || !row.calendarId) return;
    try {
      var service = calOAuthService_(row.email);
      if (!service.hasAccess()) return;
      var token = service.getAccessToken();
      var id = calEventId_(uid);
      var ev = p.dueDate && p.pivotRole !== "CHILD" ? calBuildEvent_(p, row) : null;
      if (ev) calUpsertEvent_(token, row.calendarId, id, ev, true);
      else calFetch_(token, "delete", "/calendars/" + encodeURIComponent(row.calendarId) + "/events/" + id);
    } catch (e) {
      console.warn("calendarRefreshProject_ failed for " + row.email + ": " + e.message);
    }
  });
}

/** Stuendlicher Trigger: alle aktiven Nutzer, am laengsten nicht synchronisierte zuerst. */
function calendarSyncAllTrigger() {
  var started = Date.now();
  var rows = calRowsAll_().filter(function (r) { return r.enabled; });
  if (!rows.length) return;
  rows.sort(function (a, b) { return new Date(a.lastSync || 0) - new Date(b.lastSync || 0); });
  var queue = readQueueRows_();
  for (var i = 0; i < rows.length; i++) {
    if (Date.now() - started > 4.5 * 60000) break;
    try { calendarSyncUser_(rows[i].email, queue); } catch (e) { console.warn("Calendar sync failed for " + rows[i].email + ": " + e.message); }
  }
}
