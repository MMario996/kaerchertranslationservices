/**
 * AdminManagers.gs
 *
 * Erweiterungen fuer User Manager und Template Manager (Admin -> Unterreiter):
 *  - Kennzahlen pro Nutzer: Portal-Bereiche, sichtbare Templates, Projekte,
 *    Chat-Verbindung; Detailansicht mit Aktivitaeten und Freischalt-Tipps
 *  - Mehrfachbearbeitung (ersetzen / hinzufuegen / entfernen) und
 *    "Zuordnung uebernehmen" von einem anderen Nutzer
 *  - Kennzahlen pro Template: fuer wie viele Nutzer sichtbar, fehlende
 *    Segmentierung, Nutzung (Projekte, zuletzt genutzt), Watcher, Pivot-Rolle
 *  - Anzeigename aendern, Mehrfach-Aktivieren (apiBatchSetTemplateActive)
 *
 * Rechte: Admin oder Admin-Light mit Bereich "users" bzw. "templates".
 * Portal-Bereiche (Whitelists) aendert weiterhin nur ein Admin
 * (apiSetAccessBulk in AdminAccess.gs).
 */

var USER_MGR_SHEET_ONLY_FIELDS_ = ["clients", "domains", "subdomains", "businessUnit", "sourceLangs", "targetLangs", "workflowSteps", "status"];
var USER_MGR_MULTI_FIELDS_ = ["clients", "domains", "subdomains", "businessUnit", "sourceLangs", "targetLangs", "workflowSteps"];
var SEGMENT_FIELDS_ = [["client", "Client"], ["domain", "Domain"], ["subDomain", "Subdomain"], ["businessUnit", "Business Unit"]];

function assertManager_(area) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, area)) throw new Error("Not authorized. Admin only.");
  return caller;
}

// --- Reine Helfer (getestet) --------------------------------------------------

function splitMulti_(v) {
  return String(v || "").split(/[\n,;]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}

/**
 * Mehrfachwert (z. B. "KAG, KNA") aendern. mode: "replace" | "add" | "remove".
 * Gross-/Kleinschreibung beim Vergleich egal, Reihenfolge bleibt erhalten.
 */
function mergeMultiValue_(current, value, mode) {
  var cur = splitMulti_(current);
  var val = splitMulti_(value);
  var has = function (list, x) { return list.some(function (y) { return y.toLowerCase() === x.toLowerCase(); }); };
  if (mode === "add") {
    val.forEach(function (x) { if (!has(cur, x)) cur.push(x); });
    return cur.join(", ");
  }
  if (mode === "remove") return cur.filter(function (x) { return !has(val, x); }).join(", ");
  return val.join(", ");
}

/** User-Manager-Zeile -> Nutzerdaten fuer templateMatchesUser_. */
function userRowToUserData_(r) {
  return { client: r.clients || "", domain: r.domains || "", subdomain: r.subdomains || "", businessUnit: r.businessUnit || "" };
}

/** Template-Manager-Zeile -> Template fuer templateMatchesUser_. */
function tmplRowToTemplate_(t) {
  return { client: t.client || "", domain: t.domain || "", subdomain: t.subDomain || "", businessUnit: t.businessUnit || "" };
}

/** Welche Segmentierungsfelder am Template fehlen (dann sieht es niemand). */
function templateMissingFields_(t) {
  return SEGMENT_FIELDS_.filter(function (f) { return !String(t[f[0]] || "").trim(); }).map(function (f) { return f[1]; });
}

/** Projekte je Eigentuemer: { email: { total, open, last } }. */
function aggregateProjectsByOwner_(rows) {
  var done = { COMPLETED: 1, DELIVERED: 1, NOTIFIED: 1, CANCELLED: 1, CANCELED: 1, REJECTED: 1 };
  var out = {};
  (rows || []).forEach(function (r) {
    var e = String(r.owner || r.userEmail || "").toLowerCase().trim();
    if (!e) return;
    var o = out[e] = out[e] || { total: 0, open: 0, last: "" };
    o.total++;
    if (!done[String(r.status || "").toUpperCase().trim()]) o.open++;
    var ts = String(r.timestamp || "");
    if (ts > o.last) o.last = ts;
  });
  return out;
}

/**
 * Nutzung je Template: Queue speichert den Anzeigenamen (Dropdown-Text,
 * ggf. mit " [src]"). Treffer = Name beginnt mit dem Anzeigenamen.
 * @return {Object<uid,{count:number,last:string}>}
 */
function templateUsage_(queueRows, templates) {
  var names = (templates || []).map(function (t) { return { uid: t.uid, n: String(t.displayName || "").toLowerCase().trim() }; })
    .filter(function (x) { return x.n; })
    .sort(function (a, b) { return b.n.length - a.n.length; }); // laengster Name zuerst
  var out = {};
  (queueRows || []).forEach(function (r) {
    var tn = String(r.templateName || "").toLowerCase().trim();
    if (!tn) return;
    var hit = names.filter(function (x) { return tn === x.n || tn.indexOf(x.n + " [") === 0 || tn.indexOf(x.n) === 0; })[0];
    if (!hit) return;
    var o = out[hit.uid] = out[hit.uid] || { count: 0, last: "" };
    o.count++;
    var ts = String(r.timestamp || "");
    if (ts > o.last) o.last = ts;
  });
  return out;
}

// --- Datenquellen ------------------------------------------------------------

function mgrAreaMap_() {
  var map = {};
  try {
    accessAreas_().forEach(function (a) {
      var res = {};
      try { res = a.get() || {}; } catch (e) {}
      (res.emails || []).forEach(function (e) {
        var k = String(e || "").toLowerCase().trim();
        if (k) (map[k] = map[k] || []).push(a.id);
      });
    });
  } catch (e) {}
  try {
    var sh = openAccessSS_().getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (sh) sh.getDataRange().getValues().slice(1).forEach(function (r) {
      var k = String(r[0] || "").toLowerCase().trim();
      if (k && String(r[1] || "").trim()) (map[k] = map[k] || []).push("light");
    });
  } catch (e) {}
  return map;
}

function mgrChatMap_() {
  var map = {};
  try {
    var sh = openAccessSS_().getSheetByName("Notifications");
    if (sh) sh.getDataRange().getValues().slice(1).forEach(function (r) {
      var k = String(r[0] || "").toLowerCase().trim();
      if (!k) return;
      var on = String(r[1] || "").trim().toUpperCase();
      map[k] = { on: on === "ON" || on === "TRUE", linked: /^users\//.test(String(r[2] || "").trim()) };
    });
  } catch (e) {}
  return map;
}

function mgrQueueRows_() {
  try { return readQueueRows_(); } catch (e) { return []; }
}

function mgrAuditFor_(needle, limit) {
  var out = [];
  try {
    var sh = SpreadsheetApp.openById(getAccessSheetId_()).getSheetByName(AUDIT_SHEET_NAME_);
    if (!sh || sh.getLastRow() < 2) return out;
    var n = Math.min(sh.getLastRow() - 1, 3000);
    var q = String(needle || "").toLowerCase();
    var tz = Session.getScriptTimeZone();
    var rows = sh.getRange(sh.getLastRow() - n + 1, 1, n, 4).getValues();
    for (var i = rows.length - 1; i >= 0 && out.length < (limit || 20); i--) {
      var r = rows[i];
      if ((String(r[1]) + " " + String(r[3])).toLowerCase().indexOf(q) === -1) continue;
      var ms = auditTsToMs_(r[0], tz);
      out.push({ t: ms ? new Date(ms).toISOString() : "", user: String(r[1] || ""), action: String(r[2] || ""),
        details: String(r[3] || ""), category: auditCategory_(r[2]), level: auditLevel_(r[2], r[3]) });
    }
  } catch (e) {}
  return out;
}

// --- User Manager ------------------------------------------------------------

/**
 * Kennzahlen je Nutzer fuer die Tabelle (ein Aufruf, alles gebuendelt).
 * @return {{success:boolean, byEmail:Object, canEditAccess:boolean}}
 */
function apiGetUserManagerInsights() {
  var caller = assertManager_("users");
  var users = (apiGetUsersForManager().rows) || [];
  var areas = mgrAreaMap_();
  var chat = mgrChatMap_();
  var projects = aggregateProjectsByOwner_(mgrQueueRows_());
  var templates = {};
  try { templates = readTemplates_(); } catch (e) {}
  var tKeys = Object.keys(templates);

  var byEmail = {};
  users.forEach(function (u) {
    var e = String(u.email || "").toLowerCase().trim();
    if (!e) return;
    var ud = userRowToUserData_(u);
    var visible = 0;
    tKeys.forEach(function (k) { if (templateMatchesUser_(templates[k], ud)) visible++; });
    byEmail[e] = {
      areas: areas[e] || [],
      chat: chat[e] || { on: false, linked: false },
      projects: projects[e] || { total: 0, open: 0, last: "" },
      visibleTemplates: visible,
      admin: isAdmin_(e)
    };
  });
  return { success: true, byEmail: byEmail, templateTotal: tKeys.length, canEditAccess: isAdmin_(caller) };
}

/** Detailansicht eines Nutzers. */
function apiGetUserDetail(email) {
  assertManager_("users");
  email = String(email || "").trim().toLowerCase();
  if (!email) return { success: false, error: "E-Mail fehlt." };
  var row = ((apiGetUsersForManager().rows) || []).filter(function (u) { return String(u.email || "").toLowerCase() === email; })[0] || null;
  var ud = row ? userRowToUserData_(row) : getUserData_(email);
  var templates = {};
  try { templates = readTemplates_(); } catch (e) {}
  var allowed = Object.keys(templates).filter(function (k) { return templateMatchesUser_(templates[k], ud); }).sort();
  var recent = mgrQueueRows_().filter(function (r) {
    return String(r.owner || "").toLowerCase() === email || String(r.sharedWith || "").toLowerCase().indexOf(email) !== -1;
  }).sort(function (a, b) { return String(b.timestamp).localeCompare(String(a.timestamp)); }).slice(0, 10)
    .map(function (r) { return { uid: r.projectUid, name: r.projectName, status: r.status, ts: r.timestamp, template: r.templateName, own: r.owner === email }; });
  return {
    success: true,
    email: email,
    user: row,
    areas: mgrAreaMap_()[email] || [],
    chat: mgrChatMap_()[email] || { on: false, linked: false },
    templates: { allowed: allowed, total: Object.keys(templates).length, suggestions: templateUnlockSuggestions_(templates, ud).slice(0, 6) },
    projects: recent,
    activity: mgrAuditFor_(email, 15)
  };
}

/**
 * Ein Feld fuer mehrere Nutzer aendern (nur Felder, die ausschliesslich im
 * Sheet liegen - keine Phrase-Synchronisation).
 * @param {string[]} usernames
 * @param {string} field
 * @param {string} value
 * @param {string} mode "replace" | "add" | "remove"
 */
function apiBulkUpdateUserField(usernames, field, value, mode) {
  var caller = assertManager_("users");
  if (USER_MGR_SHEET_ONLY_FIELDS_.indexOf(field) === -1) return { success: false, error: "Feld nicht fuer Mehrfachbearbeitung freigegeben: " + field };
  if (field === "status") mode = "replace";
  if (USER_MGR_MULTI_FIELDS_.indexOf(field) === -1 && mode !== "replace") mode = "replace";
  var list = (Array.isArray(usernames) ? usernames : [usernames]).map(function (u) { return String(u || "").trim(); }).filter(Boolean);
  if (!list.length) return { success: false, error: "Keine Nutzer ausgewaehlt." };

  var sh = openUserSheetSS_().getSheetByName("FetchTMS_USERS-Prod");
  if (!sh) return { success: false, error: "Sheet FetchTMS_USERS-Prod nicht gefunden." };
  var data = sh.getDataRange().getValues();
  var colIdx = {};
  data[0].map(function (h) { return String(h).trim(); }).forEach(function (h, i) { if (USER_MGR_HEADER_MAP[h]) colIdx[USER_MGR_HEADER_MAP[h]] = i; });
  if (colIdx.username == null || colIdx[field] == null) return { success: false, error: "Spalte '" + field + "' nicht gefunden." };

  var want = {};
  list.forEach(function (u) { want[u] = true; });
  var changed = [];
  for (var i = 1; i < data.length; i++) {
    var u = String(data[i][colIdx.username] || "").trim();
    if (!want[u]) continue;
    var before = String(data[i][colIdx[field]] || "");
    var after = field === "status" ? String(value || "").toUpperCase() : mergeMultiValue_(before, value, mode);
    if (after === before) continue;
    sh.getRange(i + 1, colIdx[field] + 1).setValue(after);
    changed.push({ username: u, value: after });
  }
  logAuditEvent_(caller, "USER_FIELD_BULK", field + " (" + mode + " '" + value + "') fuer " + changed.length + " Nutzer: " +
    changed.map(function (c) { return c.username; }).join(", ").slice(0, 400));
  return { success: true, changed: changed };
}

/** Segmentierung (Client, Domain, Subdomain, BU) von einem Nutzer auf andere kopieren. */
function apiCopyUserSegmentation(fromUsername, toUsernames) {
  var caller = assertManager_("users");
  var rows = (apiGetUsersForManager().rows) || [];
  var src = rows.filter(function (r) { return r.username === String(fromUsername || "").trim(); })[0];
  if (!src) return { success: false, error: "Quell-Nutzer nicht gefunden." };
  var targets = (Array.isArray(toUsernames) ? toUsernames : [toUsernames]).filter(function (u) { return u && u !== src.username; });
  var total = 0;
  ["clients", "domains", "subdomains", "businessUnit"].forEach(function (f) {
    var r = apiBulkUpdateUserField(targets, f, src[f] || "", "replace");
    if (r.success) total += r.changed.length;
  });
  logAuditEvent_(caller, "USER_SEGMENT_COPY", src.username + " -> " + targets.join(", ").slice(0, 400));
  return { success: true, changedFields: total, from: src.username, to: targets };
}

// --- Template Manager ---------------------------------------------------------

/** Kennzahlen je Template fuer die Tabelle. */
function apiGetTemplateManagerInsights() {
  assertManager_("templates");
  var tmpls = (apiGetTemplatesForManager().rows) || [];
  var users = [];
  try { users = (apiGetUsersForManager().rows) || []; } catch (e) {}
  var usage = templateUsage_(mgrQueueRows_(), tmpls);
  var watchers = [];
  try { watchers = getWatcherConfig_(); } catch (e) {}
  var pivot = {};
  try {
    pivotLinksReadAll_().forEach(function (l) {
      (pivot[l.parentUid] = pivot[l.parentUid] || { parent: 0, child: 0 }).parent++;
      (pivot[l.childUid] = pivot[l.childUid] || { parent: 0, child: 0 }).child++;
    });
  } catch (e) {}

  var byUid = {};
  tmpls.forEach(function (t) {
    var tt = tmplRowToTemplate_(t);
    var visible = 0;
    users.forEach(function (u) {
      if (String(u.status || "ACTIVE").toUpperCase() !== "INACTIVE" && templateMatchesUser_(tt, userRowToUserData_(u))) visible++;
    });
    var dn = String(t.displayName || "").toLowerCase();
    byUid[t.uid] = {
      visibleUsers: visible,
      missing: templateMissingFields_(t),
      usage: usage[t.uid] || { count: 0, last: "" },
      watchers: watchers.filter(function (w) {
        return (w.templates || []).some(function (x) { var v = String(x).toLowerCase(); return v === String(t.uid).toLowerCase() || (dn && v === dn); });
      }).map(function (w) { return w.email; }),
      pivot: pivot[t.uid] ? (pivot[t.uid].parent ? "parent" : "child") : ""
    };
  });
  return { success: true, byUid: byUid, userTotal: users.length };
}

/** Detailansicht eines Templates: wer sieht es, letzte Projekte. */
function apiGetTemplateDetail(uid) {
  assertManager_("templates");
  uid = String(uid || "").trim();
  var t = ((apiGetTemplatesForManager().rows) || []).filter(function (x) { return x.uid === uid; })[0];
  if (!t) return { success: false, error: "Template nicht gefunden." };
  var users = [];
  try { users = (apiGetUsersForManager().rows) || []; } catch (e) {}
  var tt = tmplRowToTemplate_(t);
  var visible = users.filter(function (u) { return templateMatchesUser_(tt, userRowToUserData_(u)); })
    .map(function (u) { return { email: u.email, name: [u.firstName, u.lastName].filter(Boolean).join(" "), status: u.status }; });
  var dn = String(t.displayName || "").toLowerCase();
  var recent = mgrQueueRows_().filter(function (r) { var tn = String(r.templateName || "").toLowerCase(); return dn && tn.indexOf(dn) === 0; })
    .sort(function (a, b) { return String(b.timestamp).localeCompare(String(a.timestamp)); }).slice(0, 10)
    .map(function (r) { return { uid: r.projectUid, name: r.projectName, status: r.status, ts: r.timestamp, owner: r.owner }; });
  return { success: true, template: t, missing: templateMissingFields_(t), visibleUsers: visible, projects: recent };
}

/** Anzeigenamen eines Templates im Sheet aendern (Phrase-Name bleibt). */
function apiSetTemplateDisplayName(uid, name) {
  var caller = assertManager_("templates");
  uid = String(uid || "").trim();
  name = String(name || "").replace(/\s+/g, " ").trim();
  if (!uid || !name) return { success: false, error: "UID und Name sind Pflicht." };
  var sh = openAccessSS_().getSheetByName(TEMPLATE_SHEET_NAME);
  if (!sh) return { success: false, error: "Sheet " + TEMPLATE_SHEET_NAME + " nicht gefunden." };
  var data = sh.getDataRange().getValues();
  var h = data[0].map(function (x) { return String(x).trim().toLowerCase(); });
  var cUid = h.findIndex(function (x) { return x.indexOf("uid") !== -1; });
  var cName = h.findIndex(function (x) { return (x.indexOf("display") !== -1 || x.indexOf("anzeige") !== -1); });
  if (cName < 0) cName = h.findIndex(function (x) { return x.indexOf("name") !== -1 && x.indexOf("phrase") === -1; });
  if (cUid < 0 || cName < 0) return { success: false, error: "Spalten 'Template UID' / 'Display Name' nicht gefunden." };
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][cUid] || "").trim() !== uid) continue;
    var before = String(data[i][cName] || "");
    sh.getRange(i + 1, cName + 1).setValue(name);
    logAuditEvent_(caller, "TEMPLATE_RENAME", uid + ": '" + before + "' -> '" + name + "'");
    return { success: true, displayName: name };
  }
  return { success: false, error: "Template nicht im Sheet." };
}

/** Mehrere Templates aktivieren/deaktivieren (vom Template Manager genutzt). */
function apiBatchSetTemplateActive(uids, active) {
  var caller = assertManager_("templates");
  var list = (Array.isArray(uids) ? uids : [uids]).map(function (u) { return String(u || "").trim(); }).filter(Boolean);
  if (!list.length) return { success: false, error: "Keine Templates ausgewaehlt." };
  var sh = openAccessSS_().getSheetByName(TEMPLATE_SHEET_NAME);
  if (!sh) throw new Error("Sheet " + TEMPLATE_SHEET_NAME + " nicht gefunden.");
  var data = sh.getDataRange().getValues();
  var h = data[0].map(function (x) { return String(x).trim().toLowerCase(); });
  var cUid = h.findIndex(function (x) { return x.indexOf("uid") !== -1; });
  var cActive = h.findIndex(function (x) { return x.indexOf("active") !== -1; });
  if (cUid < 0) throw new Error("Spalte 'Template UID' nicht gefunden.");
  if (cActive < 0) { cActive = data[0].length; sh.getRange(1, cActive + 1).setValue("Active (yes/no)"); }
  var want = {};
  list.forEach(function (u) { want[u] = true; });
  var val = active ? "yes" : "no";
  var done = 0;
  for (var i = 1; i < data.length; i++) {
    if (!want[String(data[i][cUid] || "").trim()]) continue;
    sh.getRange(i + 1, cActive + 1).setValue(val);
    done++;
  }
  logAuditEvent_(caller, "TEMPLATE_ACTIVE", done + " Templates -> " + val);
  return { success: true, changed: done };
}
