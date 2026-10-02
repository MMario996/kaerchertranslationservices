/**
 * AdminAccess.gs
 *
 * Zugriffs-Tabelle fuer die Admin-Console: alle Nutzer x alle Bereiche
 * (Whitelists + Admins) in einer Ansicht. Liest und schreibt ueber die
 * bestehenden Whitelist-Funktionen, damit deren Pruefungen, Sheets und
 * Audit-Eintraege unveraendert gelten.
 */

/** Bereiche in Anzeige-Reihenfolge: id -> {get, add, remove}. */
function accessAreas_() {
  return [
    { id: "general",       get: apiGetWhitelist,           add: apiAddWhitelist,           remove: apiRemoveWhitelist },
    { id: "marketing",     get: apiGetMarketingWhitelist,  add: apiAddMarketingWhitelist,  remove: apiRemoveMarketingWhitelist },
    { id: "woma",          get: apiGetWomaWhitelist,       add: apiAddWomaWhitelist,       remove: apiRemoveWomaWhitelist },
    { id: "cc",            get: apiGetCcWhitelist,         add: apiAddCcWhitelist,         remove: apiRemoveCcWhitelist },
    { id: "kec",           get: apiGetKeCWhitelist,        add: apiAddKeCWhitelist,        remove: apiRemoveKeCWhitelist },
    { id: "documentation", get: apiGetDocWhitelist,        add: apiAddDocWhitelist,        remove: apiRemoveDocWhitelist },
    { id: "campus",        get: apiGetArticulateWhitelist, add: apiAddArticulateWhitelist, remove: apiRemoveArticulateWhitelist },
    { id: "admin",         get: function () { return { emails: adminEmails_() }; }, add: apiAddAdmin, remove: apiRemoveAdmin }
  ];
}

function adminEmails_() {
  return String(PropertiesService.getScriptProperties().getProperty("ADMIN_EMAILS") || "")
    .split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
}

/** Alle Nutzer mit ihren Bereichen, dazu Admin-Light-Bereiche (nur lesend). */
function apiGetAccessMatrix() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    var users = {};
    var touch = function (email) {
      var e = String(email || "").trim().toLowerCase();
      if (!e) return null;
      return users[e] = users[e] || { email: e, areas: {}, light: [] };
    };
    var areaIds = [];
    accessAreas_().forEach(function (a) {
      areaIds.push(a.id);
      var res = {};
      try { res = a.get() || {}; } catch (e) { console.warn("apiGetAccessMatrix " + a.id + ": " + e.message); }
      (res.emails || []).forEach(function (e) { var u = touch(e); if (u) u.areas[a.id] = true; });
    });
    try {
      var light = apiGetAdminLightUsers();
      ((light && light.users) || []).forEach(function (l) { var u = touch(l.email); if (u) u.light = l.subtabs || []; });
    } catch (e) {}
    var list = Object.keys(users).sort().map(function (k) { return users[k]; });
    return { success: true, areas: areaIds, users: list, me: String(caller || "").toLowerCase() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Setzt oder entzieht Bereiche fuer mehrere Nutzer.
 * @param {string[]} emails
 * @param {string[]} areaIds
 * @param {boolean} grant true = hinzufuegen, false = entfernen
 */
function apiSetAccessBulk(emails, areaIds, grant) {
  var caller = String(getUserEmail_() || "").toLowerCase();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  var list = (Array.isArray(emails) ? emails : [emails])
    .map(function (e) { return String(e || "").trim().toLowerCase(); })
    .filter(function (e) { return e && e.indexOf("@") > 0; });
  var ids = Array.isArray(areaIds) ? areaIds : [areaIds];
  if (!list.length || !ids.length) return { success: false, error: "E-Mail und Bereich sind Pflicht." };

  var areas = {};
  accessAreas_().forEach(function (a) { areas[a.id] = a; });
  var errors = [];
  var done = 0;
  ids.forEach(function (id) {
    var a = areas[id];
    if (!a) { errors.push("Unbekannter Bereich: " + id); return; }
    list.forEach(function (email) {
      if (!grant && id === "admin" && email === caller) { errors.push("Eigenen Admin-Zugang kann man nicht selbst entfernen."); return; }
      try {
        var r = grant ? a.add(email) : a.remove(email);
        if (r && r.success === false) errors.push(email + " / " + id + ": " + (r.error || "Fehler"));
        else done++;
      } catch (e) {
        errors.push(email + " / " + id + ": " + (e.message || e));
      }
    });
  });
  return { success: !errors.length || done > 0, changed: done, errors: errors };
}
