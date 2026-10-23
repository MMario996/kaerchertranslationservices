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
 * den Script Properties (Service-Name "Cal_<hash>").
 *
 * Rueckleitung nach der Google-Freigabe: NICHT ueber /usercallback. Dessen
 * State-Token (ScriptApp.newStateToken) gilt nur fuer den Nutzer, der es
 * erzeugt hat - das ist bei "Execute as: Me" das Deploy-Konto, waehrend
 * /usercallback als der verbindende Nutzer laeuft. Fuer alle ausser dem
 * Deploy-Konto endete die Freigabe darum mit "Das State-Token ist ungueltig
 * oder abgelaufen". Stattdessen leitet Google auf die Web-App selbst (/exec,
 * doGet -> calendarHandleRedirect_), die E-Mail steckt in einem eigenen,
 * per HMAC signierten State (calSignState_/calVerifyState_).
 *
 * Einmalige Einrichtung (Admin):
 *  1. Im GCP-Projekt des Apps-Script-Projekts die "Google Calendar API"
 *     aktivieren.
 *  2. Auf dem OAuth-Zustimmungsbildschirm den Scope
 *     https://www.googleapis.com/auth/calendar.app.created ergaenzen.
 *  3. Client-ID/-Secret sind dieselben wie unter "Google Drive Export"
 *     (Admin-Bereich). Beim OAuth-Client in der Cloud Console zusaetzlich
 *     die URL der Web-App (endet auf /exec, siehe calRedirectUri_) unter
 *     "Authorized redirect URIs" eintragen. Weicht sie ab (z. B. andere
 *     Bereitstellung), die richtige in der Script Property CAL_REDIRECT_URI
 *     hinterlegen.
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
  de: { due: "Frist", done: "Fertig", cancelled: "Abgebrochen", status: "Status", langs: "Zielsprachen", template: "Vorlage", owner: "Auftraggeber", portal: "Im Portal öffnen", phrase: "In Phrase öffnen",
        project: "Projekt", uid: "Projekt-UID", deadline: "Fälligkeit", pivotLangs: "Pivot-Sprachen", file: "Datei", words: "Wörter (gesamt / netto)", jobs: "Jobs",
        created: "Hochgeladen", createdBy: "Angelegt von", shared: "Geteilt mit", pivot: "Pivot", downloaded: "Zuletzt heruntergeladen",
        secProject: "PROJEKT", secLangs: "SPRACHEN & JOBS", secPeople: "BETEILIGTE", secLinks: "LINKS", openJob: "Job öffnen", phraseProject: "Projekt in Phrase", wordsShort: "Wörter", net: "netto", stDone: "Abgeschlossen", stProgress: "In Bearbeitung", stNew: "Neu", ofDone: "{d} von {n} Sprachen fertig" },
  en: { due: "Due", done: "Done", cancelled: "Cancelled", status: "Status", langs: "Target languages", template: "Template", owner: "Requested by", portal: "Open in the portal", phrase: "Open in Phrase",
        project: "Project", uid: "Project UID", deadline: "Due date", pivotLangs: "Pivot languages", file: "File", words: "Words (total / net)", jobs: "Jobs",
        created: "Uploaded", createdBy: "Created by", shared: "Shared with", pivot: "Pivot", downloaded: "Last downloaded",
        secProject: "PROJECT", secLangs: "LANGUAGES & JOBS", secPeople: "PEOPLE", secLinks: "LINKS", openJob: "Open job", phraseProject: "Project in Phrase", wordsShort: "words", net: "net", stDone: "Completed", stProgress: "In progress", stNew: "New", ofDone: "{d} of {n} languages done" },
  fr: { due: "Échéance", done: "Terminé", cancelled: "Annulé", status: "Statut", langs: "Langues cibles", template: "Modèle", owner: "Demandeur", portal: "Ouvrir dans le portail", phrase: "Ouvrir dans Phrase",
        project: "Projet", uid: "UID du projet", deadline: "Échéance", pivotLangs: "Langues pivot", file: "Fichier", words: "Mots (total / net)", jobs: "Jobs",
        created: "Envoyé le", createdBy: "Créé par", shared: "Partagé avec", pivot: "Pivot", downloaded: "Dernier téléchargement",
        secProject: "PROJET", secLangs: "LANGUES & JOBS", secPeople: "PERSONNES", secLinks: "LIENS", openJob: "Ouvrir le job", phraseProject: "Projet dans Phrase", wordsShort: "mots", net: "net", stDone: "Terminé", stProgress: "En cours", stNew: "Nouveau", ofDone: "{d} sur {n} langues terminées" },
  es: { due: "Plazo", done: "Terminado", cancelled: "Cancelado", status: "Estado", langs: "Idiomas de destino", template: "Plantilla", owner: "Solicitante", portal: "Abrir en el portal", phrase: "Abrir en Phrase",
        project: "Proyecto", uid: "UID del proyecto", deadline: "Plazo", pivotLangs: "Idiomas pivote", file: "Archivo", words: "Palabras (total / netas)", jobs: "Jobs",
        created: "Subido", createdBy: "Creado por", shared: "Compartido con", pivot: "Pivote", downloaded: "Última descarga",
        secProject: "PROYECTO", secLangs: "IDIOMAS Y JOBS", secPeople: "PERSONAS", secLinks: "ENLACES", openJob: "Abrir job", phraseProject: "Proyecto en Phrase", wordsShort: "palabras", net: "netas", stDone: "Terminado", stProgress: "En curso", stNew: "Nuevo", ofDone: "{d} de {n} idiomas listos" },
  pt: { due: "Prazo", done: "Concluído", cancelled: "Cancelado", status: "Status", langs: "Idiomas de destino", template: "Modelo", owner: "Solicitante", portal: "Abrir no portal", phrase: "Abrir no Phrase",
        project: "Projeto", uid: "UID do projeto", deadline: "Prazo", pivotLangs: "Idiomas pivô", file: "Arquivo", words: "Palavras (total / líquidas)", jobs: "Jobs",
        created: "Enviado", createdBy: "Criado por", shared: "Compartilhado com", pivot: "Pivô", downloaded: "Último download",
        secProject: "PROJETO", secLangs: "IDIOMAS E JOBS", secPeople: "PESSOAS", secLinks: "LINKS", openJob: "Abrir job", phraseProject: "Projeto no Phrase", wordsShort: "palavras", net: "líquidas", stDone: "Concluído", stProgress: "Em andamento", stNew: "Novo", ofDone: "{d} de {n} idiomas prontos" },
  zh: { due: "截止", done: "已完成", cancelled: "已取消", status: "状态", langs: "目标语言", template: "模板", owner: "申请人", portal: "在门户中打开", phrase: "在 Phrase 中打开",
        project: "项目", uid: "项目 UID", deadline: "截止日期", pivotLangs: "中转语言", file: "文件", words: "字数（总计 / 净）", jobs: "任务",
        created: "上传时间", createdBy: "创建者", shared: "共享给", pivot: "中转", downloaded: "最近下载",
        secProject: "项目", secLangs: "语言与任务", secPeople: "相关人员", secLinks: "链接", openJob: "打开任务", phraseProject: "在 Phrase 中查看项目", wordsShort: "字", net: "净", stDone: "已完成", stProgress: "进行中", stNew: "新建", ofDone: "{n} 种语言中已完成 {d} 种" }
};

// ============================================================================
// OAuth2 (ein Service pro Nutzer, Token in den Script Properties)
// ============================================================================

function calServiceName_(email) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, String(email || "").toLowerCase().trim());
  return "Cal_" + digest.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("").slice(0, 20);
}

var CAL_STATE_PREFIX_ = "cal1";
var CAL_STATE_TTL_MS_ = 60 * 60 * 1000;

/** Ziel der Google-Rueckleitung: die Web-App selbst (laeuft als Deploy-Konto). */
function calRedirectUri_() {
  var custom = PropertiesService.getScriptProperties().getProperty("CAL_REDIRECT_URI");
  return String(custom || ScriptApp.getService().getUrl() || "").trim();
}

function calOAuthService_(email) {
  var props = PropertiesService.getScriptProperties();
  return OAuth2.createService(calServiceName_(email))
    .setAuthorizationBaseUrl("https://accounts.google.com/o/oauth2/auth")
    .setTokenUrl("https://oauth2.googleapis.com/token")
    .setClientId(props.getProperty(DRIVE_SAVE_CLIENT_ID_PROP_) || "")
    .setClientSecret(props.getProperty(DRIVE_SAVE_CLIENT_SECRET_PROP_) || "")
    // Pflichtangabe der Bibliothek fuer getAuthorizationUrl; aufgerufen wird
    // es nicht, weil die Rueckleitung ueber calRedirectUri_ laeuft.
    .setCallbackFunction("calendarOAuthCallback_")
    .setRedirectUri(calRedirectUri_())
    .setPropertyStore(PropertiesService.getScriptProperties())
    .setScope(CAL_SCOPE_)
    .setParam("access_type", "offline")
    .setParam("prompt", "consent")
    .setParam("login_hint", String(email || ""));
}

/** Geheimnis fuer die State-Signatur (einmalig erzeugt, Script Properties). */
function calStateSecret_() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty("CAL_STATE_SECRET");
  if (!secret) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty("CAL_STATE_SECRET", secret);
  }
  return secret;
}

function calStateSig_(payload, secret) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret)).replace(/=+$/, "");
}

/** State fuer die Google-Freigabe: "cal1.<email>.<ablauf>.<hmac>" (E-Mail web-safe Base64). */
function calSignState_(email, secret, nowMs) {
  var exp = (typeof nowMs === "number" ? nowMs : Date.now()) + CAL_STATE_TTL_MS_;
  var payload = CAL_STATE_PREFIX_ + "." +
    Utilities.base64EncodeWebSafe(String(email || "").toLowerCase().trim()).replace(/=+$/, "") + "." + exp;
  return payload + "." + calStateSig_(payload, secret);
}

/** Prueft Signatur und Ablauf; liefert die E-Mail oder "". */
function calVerifyState_(state, secret, nowMs) {
  var parts = String(state || "").split(".");
  if (parts.length !== 4 || parts[0] !== CAL_STATE_PREFIX_) return "";
  var payload = parts.slice(0, 3).join(".");
  if (calStateSig_(payload, secret) !== parts[3]) return "";
  if (Number(parts[2]) < (typeof nowMs === "number" ? nowMs : Date.now())) return "";
  var b64 = parts[1] + "===".slice((parts[1].length + 3) % 4);
  try {
    return Utilities.newBlob(Utilities.base64DecodeWebSafe(b64)).getDataAsString();
  } catch (e) {
    return "";
  }
}

function calIsOAuthRedirect_(e) {
  var p = (e && e.parameter) || {};
  return String(p.state || "").indexOf(CAL_STATE_PREFIX_ + ".") === 0 && !!(p.code || p.error);
}

/**
 * Rueckleitung von Google (doGet, laeuft als Deploy-Konto): State pruefen,
 * Code gegen Token tauschen, Token unter dem Nutzer speichern. Einschalten
 * und erster Abgleich passieren danach wie bisher ueber die Web-App
 * (apiSetCalendarSyncOptions).
 */
function calendarHandleRedirect_(e) {
  var p = e.parameter;
  var email = calVerifyState_(p.state, calStateSecret_());
  var ok = false;
  var reason = "";
  if (!email) {
    reason = "Link expired or invalid.";
  } else {
    var viewer = "";
    try { viewer = String(Session.getActiveUser().getEmail() || "").toLowerCase(); } catch (err) {}
    if (viewer && viewer !== email) {
      reason = "Signed in as " + viewer + ", but the request was started for " + email + ".";
    } else {
      try { ok = calOAuthService_(email).handleCallback({ parameter: { code: p.code, error: p.error } }); }
      catch (err) { reason = err.message; }
      if (!ok && !reason) reason = "Access was not granted.";
    }
  }
  try { logAuditEvent_(email || "unknown", ok ? "CALENDAR_CONNECTED" : "CALENDAR_CONNECT_FAILED", ok ? "" : reason); } catch (err) {}
  return calendarResultPage_(ok, reason);
}

/** Frueheres Ziel unter /usercallback - bleibt fuer bereits geoeffnete alte Links. */
function calendarOAuthCallback_(request) {
  return calendarResultPage_(false, "Please start the connection again in the Translation Services portal.");
}

function calendarResultPage_(ok, reason) {
  var esc = function (t) { return String(t || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); };
  var body = ok
    ? "<p style=\"font-size:40px;margin:0\">📅</p><p><b>Google Calendar connected.</b></p>" +
      "<p>Go back to the Translation Services portal - your deadlines are synced into the calendar \"" + CAL_NAME_ + "\" automatically.<br>" +
      "You can close this tab.</p>" +
      "<script>setTimeout(function(){ window.close(); }, 2500);</" + "script>"
    : "<p>⚠️ Authorization denied or failed.</p><p>" + esc(reason) + "</p><p>You can close this tab and try again.</p>";
  return HtmlService.createHtmlOutput("<html><body style=\"font-family:sans-serif;padding:30px;text-align:center;\">" + body + "</body></html>")
    .setTitle("Google Calendar - Translation Services");
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
    var service = calOAuthService_(email).setParam("state", calSignState_(email, calStateSecret_()));
    return { success: true, url: service.getAuthorizationUrl() };
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

/** Sprachkuerzel wie im Portal (langShortCode_): "de_de" -> "DE", "en_gb" -> "EN-GB". */
function calLangShort_(code) {
  var p = String(code || "").toLowerCase().replace(/-/g, "_").split("_").filter(Boolean);
  if (!p.length) return "";
  var region = p.length > 1 && /^[a-z]{2}$/.test(p[p.length - 1]) ? p[p.length - 1] : "";
  return (region && region !== p[0] ? p[0] + "-" + region : p[0]).toUpperCase();
}

/** Link zum Job im Phrase-Editor. */
function calJobUrl_(jobUid) {
  return "https://cloud.memsource.com/web/job/" + encodeURIComponent(jobUid) + "/translate";
}

/**
 * Je Zielsprache ein Eintrag {lang, state, jobUid}. state: done | progress | new | "" (unbekannt).
 * phraseJobs: Jobs aus Phrase (alle Workflow-Schritte) oder null - dann nur die Job-UIDs aus der Queue.
 * Link: der aktuelle Job (erster nicht fertige Schritt, sonst der letzte).
 */
function calLangJobs_(p, phraseJobs) {
  var DONE = { COMPLETED: 1, COMPLETED_BY_LINGUIST: 1, DELIVERED: 1 };
  var SKIP = { CANCELLED: 1, DECLINED: 1, REJECTED: 1 };
  var norm = function (l) { return String(l || "").toLowerCase().replace(/-/g, "_"); };
  var order = [];
  var by = {};
  var add = function (lang) { var k = norm(lang); if (k && !by[k]) { by[k] = { lang: k, state: "", jobUid: "", jobs: [] }; order.push(k); } return by[k]; };
  (p.targetLangs || []).forEach(add);
  (p.jobMapping || []).forEach(function (m) { var e = m && m.targetLang ? add(m.targetLang) : null; if (e && !e.jobUid && m.jobUid) e.jobUid = String(m.jobUid); });
  if (phraseJobs) {
    phraseJobs.forEach(function (j) {
      var st = String((j && j.status) || "").toUpperCase();
      if (!j || !j.uid || SKIP[st]) return;
      add(j.targetLang).jobs.push({ uid: String(j.uid), level: Number(j.workflowLevel) || 1, done: !!DONE[st], started: st !== "NEW" });
    });
  }
  var projectDone = calStatusGroup_(p.status) === "done";
  return order.map(function (k) {
    var e = by[k];
    if (e.jobs.length) {
      e.jobs.sort(function (a, b) { return a.level - b.level; });
      var open = e.jobs.filter(function (j) { return !j.done; });
      e.state = !open.length ? "done" : (e.jobs.some(function (j) { return j.started || j.done; }) ? "progress" : "new");
      e.jobUid = (open[0] || e.jobs[e.jobs.length - 1]).uid;
    } else if (projectDone) {
      e.state = "done";
    }
    return { lang: e.lang, state: e.state, jobUid: e.jobUid };
  });
}

/**
 * Beschreibung des Termins (Google Kalender zeigt einfaches HTML): Abschnitte
 * Projekt, Sprachen & Jobs, Beteiligte, Links. Leere Felder entfallen.
 * langJobs: Ergebnis von calLangJobs_.
 */
function calDescription_(p, T, langJobs) {
  var tz = typeof Session !== "undefined" ? Session.getScriptTimeZone() : "Europe/Berlin";
  var esc = function (v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var link = function (href, text) { return '<a href="' + esc(href) + '">' + esc(text) + "</a>"; };
  var mail = function (list) {
    return String(list || "").split(/[;,]+/).map(function (s) { return s.trim(); }).filter(Boolean)
      .map(function (m) { return link("mailto:" + m, m); }).join(", ");
  };
  var fmt = function (v) {
    var d = v instanceof Date ? v : (v ? new Date(v) : null);
    if (!d || isNaN(d.getTime())) return v ? String(v) : "";
    return typeof Utilities !== "undefined" ? Utilities.formatDate(d, tz, "dd.MM.yyyy HH:mm") : d.toISOString();
  };
  var line = function (label, html) { return html ? "<b>" + esc(label) + ":</b> " + html + "<br>" : ""; };
  langJobs = langJobs || calLangJobs_(p, null);

  var nDone = langJobs.filter(function (l) { return l.state === "done"; }).length;
  var known = langJobs.some(function (l) { return l.state; });
  var status = esc(p.status || "-") + (known && langJobs.length ? " (" + esc(T.ofDone.replace("{d}", nDone).replace("{n}", langJobs.length)) + ")" : "");
  var file = p.fileName && p.fileName !== p.projectName ? esc(p.fileName) : "";
  var words = p.totalWords ? Number(p.totalWords).toLocaleString("de-DE") + " " + esc(T.wordsShort) + (p.netWords ? " (" + esc(T.net) + " " + Number(p.netWords).toLocaleString("de-DE") + ")" : "") : "";
  var html = "<b>📋 " + esc(T.secProject) + "</b><br>" +
    line(T.status, status) +
    line(T.deadline, esc(fmt(p.dueDate))) +
    line(T.template, esc(p.templateName)) +
    line(T.file, [file, words].filter(Boolean).join(" · ")) +
    line(T.pivot, p.pivotRole ? esc(p.pivotRole) + (p.pivotLangs && p.pivotLangs.length ? " · " + esc(p.pivotLangs.join(", ").toUpperCase()) : "") : "") +
    line(T.created, esc(fmt(p.timestamp || p.uploadDate))) +
    line(T.downloaded, esc(fmt(p.downloadedAt)));

  if (langJobs.length) {
    var icon = { done: "✅", progress: "⏳", "new": "🆕" };
    var label = { done: T.stDone, progress: T.stProgress, "new": T.stNew };
    html += "<br><b>🌍 " + esc(T.secLangs) + "</b><ul>" + langJobs.map(function (l) {
      var parts = ["<b>" + esc(calLangShort_(l.lang)) + "</b>"];
      if (l.state) parts.push(icon[l.state] + " " + esc(label[l.state]));
      if (l.jobUid) parts.push(link(calJobUrl_(l.jobUid), T.openJob));
      return "<li>" + parts.join(" – ") + "</li>";
    }).join("") + "</ul>";
  }

  var people = line(T.owner, mail(p.owner)) +
    line(T.createdBy, p.createdBy && p.createdBy !== p.owner ? mail(p.createdBy) : "") +
    line(T.shared, mail(p.sharedWith));
  if (people) html += "<b>👤 " + esc(T.secPeople) + "</b><br>" + people + "<br>";

  html += "<b>🔗 " + esc(T.secLinks) + "</b><br>" +
    [p.phraseUrl ? link(p.phraseUrl, T.phraseProject) : "", link(PORTAL_URL_, T.portal)].filter(Boolean).join(" · ");
  return html;
}

/**
 * Phrase-Jobs je Projekt (nur offene Projekte; 30 Minuten gecacht, parallel).
 * Fehler -> Projekt fehlt im Ergebnis, der Termin zeigt dann nur die Job-Links.
 * @return {Object<string, Array>} projectUid -> Jobs
 */
function calFetchJobs_(projects) {
  var out = {};
  var want = (projects || []).filter(function (p) { return p.projectUid && calStatusGroup_(p.status) === "open"; })
    .map(function (p) { return String(p.projectUid); });
  if (!want.length) return out;
  var cache = CacheService.getScriptCache();
  var hit = cache.getAll(want.map(function (u) { return "calj_" + u; }));
  var missing = want.filter(function (u) {
    var c = hit["calj_" + u];
    if (c) { try { out[u] = JSON.parse(c); return false; } catch (e) {} }
    return true;
  });
  var auth = getPhraseAuthHeader_();
  for (var i = 0; i < missing.length; i += 30) {
    var batch = missing.slice(i, i + 30);
    var res;
    try {
      res = UrlFetchApp.fetchAll(batch.map(function (u) {
        return { url: phraseApiUrlV2_("/projects/" + encodeURIComponent(u) + "/jobs") + "?pageSize=100&pageNumber=0",
          headers: { Authorization: auth }, muteHttpExceptions: true };
      }));
    } catch (e) { console.warn("Calendar jobs: " + e.message); break; }
    var put = {};
    batch.forEach(function (u, k) {
      if (res[k].getResponseCode() !== 200) return;
      try {
        out[u] = (JSON.parse(res[k].getContentText()).content || []).map(function (j) {
          return { uid: j.uid, status: j.status, targetLang: j.targetLang, workflowLevel: j.workflowLevel };
        });
        put["calj_" + u] = JSON.stringify(out[u]);
      } catch (e) {}
    });
    try { if (Object.keys(put).length) cache.putAll(put, 1800); } catch (e) {}
  }
  return out;
}

/** Gewuenschter Termin fuer ein Projekt oder null (kein Termin). phraseJobs: Jobs aus Phrase (optional). */
function calBuildEvent_(p, row, phraseJobs) {
  var due = p.dueDate instanceof Date ? p.dueDate : new Date(p.dueDate);
  if (isNaN(due.getTime())) return null;
  var group = calStatusGroup_(p.status);
  if (group === "cancelled") return null;
  if (group === "done" && !row.includeDone) return null;

  var T = CAL_TEXT_[row.lang] || CAL_TEXT_.en;
  var prefix = group === "done" ? "✅ " + T.done : "⏰ " + T.due;
  var start = new Date(due.getTime() - 30 * 60000);
  var description = calDescription_(p, T, calLangJobs_(p, phraseJobs || null));

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
    var projects = calProjectsForUser_(email, rows);
    var jobs = calFetchJobs_(projects);
    projects.forEach(function (p) {
      var ev = calBuildEvent_(p, row, jobs[p.projectUid]);
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
      var ev = p.dueDate && p.pivotRole !== "CHILD" ? calBuildEvent_(p, row, calFetchJobs_([p])[p.projectUid]) : null;
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
