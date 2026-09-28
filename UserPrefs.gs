/**
 * UserPrefs.gs
 *
 * Persoenliche Einstellungen pro Nutzer (Darstellung, Startseite, Team-Ansicht,
 * Lesestand der Benachrichtigungen). Alles liegt als JSON in einer Zeile pro
 * Nutzer, damit neue Einstellungen ohne Sheet-Umbau dazukommen koennen.
 *
 * Sheet: "UserPrefs" in ACCESS_SHEET_ID
 * Spalten: Email | Prefs JSON | Updated At
 *
 * Bekannte Schluessel:
 *   theme        "light" | "dark" | "auto"
 *   fontScale    1 | 1.1 | 1.2
 *   startPage    true/false  (Startseite beim Oeffnen zeigen)
 *   team         { enabled: bool, mode: "bu" | "custom", emails: [..] }
 *   notifSeenAt  ISO-Zeitpunkt, bis zu dem die Glocke als gelesen gilt
 */
var USER_PREFS_SHEET_NAME_ = "UserPrefs";
var USER_PREFS_HEADERS_ = ["Email", "Prefs JSON", "Updated At"];
var USER_PREFS_CLIENT_KEYS_ = ["theme", "fontScale", "startPage", "team"];

function userPrefsSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(USER_PREFS_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(USER_PREFS_SHEET_NAME_);
    sh.appendRow(USER_PREFS_HEADERS_);
    sh.getRange(1, 1, 1, USER_PREFS_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function userPrefsFind_(sh, email) {
  var key = String(email || "").trim().toLowerCase();
  if (!key) return { row: -1, prefs: {} };
  var values = sh.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() !== key) continue;
    var prefs = {};
    try { prefs = JSON.parse(String(values[i][1] || "{}")) || {}; } catch (e) { prefs = {}; }
    return { row: i + 1, prefs: prefs };
  }
  return { row: -1, prefs: {} };
}

function userPrefsGet_(email) {
  try { return userPrefsFind_(userPrefsSheet_(), email).prefs; } catch (e) { return {}; }
}

/** Fuehrt patch in die gespeicherten Einstellungen ein (flach, pro Schluessel). */
function userPrefsMerge_(email, patch) {
  var key = String(email || "").trim().toLowerCase();
  if (!key) throw new Error("No user email found.");
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = userPrefsSheet_();
    var found = userPrefsFind_(sh, key);
    var prefs = found.prefs;
    Object.keys(patch || {}).forEach(function (k) { prefs[k] = patch[k]; });
    var row = [key, JSON.stringify(prefs), new Date()];
    if (found.row > 0) sh.getRange(found.row, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return prefs;
  } finally {
    lock.releaseLock();
  }
}

function sanitizeClientPrefs_(p) {
  var out = {};
  p = p || {};
  if (p.hasOwnProperty("theme")) out.theme = ["light", "dark", "auto"].indexOf(p.theme) >= 0 ? p.theme : "light";
  if (p.hasOwnProperty("fontScale")) {
    var f = Number(p.fontScale);
    out.fontScale = [1, 1.1, 1.2].indexOf(f) >= 0 ? f : 1;
  }
  if (p.hasOwnProperty("startPage")) out.startPage = p.startPage !== false;
  if (p.hasOwnProperty("team")) {
    var t = p.team || {};
    var emails = (Array.isArray(t.emails) ? t.emails : String(t.emails || "").split(/[\s,;]+/))
      .map(function (e) { return String(e || "").trim().toLowerCase(); })
      .filter(function (e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); });
    out.team = {
      enabled: !!t.enabled,
      mode: t.mode === "custom" ? "custom" : "bu",
      emails: emails.filter(function (e, i) { return emails.indexOf(e) === i; }).slice(0, 100)
    };
  }
  return out;
}

/** Einstellungen des angemeldeten Nutzers (nie die eines simulierten Nutzers). */
function apiGetUserPrefs() {
  var prefs = userPrefsGet_(getUserEmail_());
  var out = {};
  USER_PREFS_CLIENT_KEYS_.forEach(function (k) { if (prefs.hasOwnProperty(k)) out[k] = prefs[k]; });
  return { success: true, prefs: out };
}

function apiSaveUserPrefs(patch) {
  try {
    var prefs = userPrefsMerge_(getUserEmail_(), sanitizeClientPrefs_(patch));
    var out = {};
    USER_PREFS_CLIENT_KEYS_.forEach(function (k) { if (prefs.hasOwnProperty(k)) out[k] = prefs[k]; });
    return { success: true, prefs: out };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// Team-Ansicht: Projekte der eigenen Business Unit bzw. einer selbst gewaehlten
// Kollegenliste, nur lesend. Ein-/ausschaltbar und einstellbar pro Nutzer.
// ============================================================================

function teamBuTokens_(bu) {
  return String(bu || "").toLowerCase().split(/[\n,;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}

/** E-Mails aller Nutzer, die mindestens eine Business Unit mit email teilen. */
function teamEmailsForBusinessUnit_(email) {
  var mine = teamBuTokens_(getUserData_(email).businessUnit);
  if (!mine.length) return { units: [], emails: [] };
  var sh = SpreadsheetApp.openById(getAccessSheetId_()).getSheetByName(USERS_SHEET_NAME);
  if (!sh) return { units: mine, emails: [] };
  var data = sh.getDataRange().getValues();
  var idx = indexByHeader_(data[0].map(function (h) { return String(h || "").trim(); }));
  var iEmail = pickIdx_(idx, ["email", "e-mail", "user email"]);
  var iBu = pickIdx_(idx, ["business unit", "business units", "businessunit"]);
  if (iEmail === -1 || iBu === -1) return { units: mine, emails: [] };
  var out = [];
  for (var r = 1; r < data.length; r++) {
    var e = String(data[r][iEmail] || "").trim().toLowerCase();
    if (!e || out.indexOf(e) >= 0) continue;
    var theirs = teamBuTokens_(data[r][iBu]);
    if (theirs.some(function (t) { return mine.indexOf(t) >= 0; })) out.push(e);
  }
  return { units: mine, emails: out };
}

function teamMemberEmails_(email, team) {
  if (team.mode === "custom") return { units: [], emails: team.emails || [] };
  return teamEmailsForBusinessUnit_(email);
}

/** Einstellungen + Vorschau fuer den Einstellungsdialog. */
function apiGetTeamSettings() {
  var email = getUserEmail_();
  var prefs = userPrefsGet_(email);
  var team = sanitizeClientPrefs_({ team: prefs.team || {} }).team;
  var bu = { units: [], emails: [] };
  try { bu = teamEmailsForBusinessUnit_(email); } catch (e) {}
  return {
    success: true,
    team: team,
    businessUnits: bu.units,
    buColleagues: bu.emails.filter(function (e) { return e !== email.toLowerCase(); }).length
  };
}

/**
 * Projekte der Team-Mitglieder (ohne eigene/geteilte, die liefert
 * apiGetMyProjects). Bewusst schlanke Felder: nur lesen, kein Download.
 */
function apiGetTeamProjects() {
  var email = String(getUserEmail_() || "").toLowerCase();
  var team = sanitizeClientPrefs_({ team: userPrefsGet_(email).team || {} }).team;
  if (!team.enabled) return { success: true, enabled: false, projects: [] };

  var members = teamMemberEmails_(email, team).emails.filter(function (e) { return e !== email; });
  if (!members.length) return { success: true, enabled: true, projects: [], members: 0 };

  var set = {};
  members.forEach(function (e) { set[e] = true; });
  var projects = readQueueRows_().filter(function (r) {
    if (!set[r.owner]) return false;
    var shared = String(r.sharedWith || "").toLowerCase().split(/[;,]+/).map(function (s) { return s.trim(); });
    return shared.indexOf(email) < 0;
  }).map(function (r) {
    return {
      projectUid: r.projectUid, projectName: r.projectName, owner: r.owner, userEmail: r.userEmail,
      timestamp: r.timestamp, uploadDate: r.uploadDate, templateName: r.templateName,
      sourceLang: r.sourceLang, targetLang: r.targetLang, targetLangs: r.targetLangs,
      status: r.status, dueDate: r.dueDate instanceof Date ? r.dueDate.toISOString() : r.dueDate,
      pivotRole: r.pivotRole, pivotLink: r.pivotLink, phraseUrl: r.phraseUrl,
      sharedWith: "", isShared: false, teamView: true
    };
  });
  projects.sort(function (a, b) { return new Date(b.timestamp || 0) - new Date(a.timestamp || 0); });
  return { success: true, enabled: true, members: members.length, projects: projects.slice(0, 500) };
}
