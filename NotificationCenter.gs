/**
 * NotificationCenter.gs
 *
 * Verlauf fuer die Benachrichtigungs-Glocke in der App - zusaetzlich zu den
 * Google-Chat-Nachrichten. Jede Stelle, die einen Nutzer per Chat informiert
 * (fertig, geteilt, Frist geaendert ...), schreibt ueber notifyUser_() auch
 * einen Eintrag hierher. Texte werden NICHT gespeichert, sondern nur Typ +
 * Parameter; die App baut daraus den Text in der Sprache des Nutzers.
 *
 * Sheet: "NotificationLog" in ACCESS_SHEET_ID  ("Notifications" ist schon
 * durch die Chat-Einstellung belegt)
 * Spalten: Timestamp | Email | Type | Project UID | Project Name | Data JSON
 *
 * Typen: completed, shared, due_changed, due_soon, renamed, cancelled,
 *        pivot_step, submitted, created
 * Gelesen-Status: pro Nutzer ein Zeitstempel (UserPrefs.notifSeenAt).
 */
var NOTIF_SHEET_NAME_ = "NotificationLog";
var NOTIF_HEADERS_ = ["Timestamp", "Email", "Type", "Project UID", "Project Name", "Data JSON"];
var NOTIF_KEEP_ROWS_ = 5000;
var NOTIF_SCAN_ROWS_ = 3000;

var notifSheetCache_ = null; // pro Ausfuehrung (AutoSync schreibt oft mehrere Eintraege)

function notifSheet_() {
  if (notifSheetCache_) return notifSheetCache_;
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(NOTIF_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(NOTIF_SHEET_NAME_);
    sh.appendRow(NOTIF_HEADERS_);
    sh.getRange(1, 1, 1, NOTIF_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  notifSheetCache_ = sh;
  return sh;
}

/** Schreibt einen Eintrag. Wirft nie - Benachrichtigungen duerfen nichts blockieren. */
function notifyUser_(email, type, projectUid, projectName, data) {
  try {
    var to = String(email || "").trim().toLowerCase();
    if (!to || to.indexOf("@") < 0) return;
    var sh = notifSheet_();
    sh.appendRow([new Date(), to, String(type || "info"), String(projectUid || ""),
      String(projectName || ""), JSON.stringify(data || {})]);
    var last = sh.getLastRow();
    if (last > NOTIF_KEEP_ROWS_ + 500) sh.deleteRows(2, last - NOTIF_KEEP_ROWS_);
  } catch (e) {
    console.warn("notifyUser_ failed for " + email + ": " + e.message);
  }
}

/** Owner + alle, mit denen geteilt wurde (optional ohne skipEmail). */
function notifyProjectParticipants_(owner, sharedWith, type, projectUid, projectName, data, skipEmail) {
  var skip = String(skipEmail || "").toLowerCase().trim();
  var seen = {};
  [owner].concat(String(sharedWith || "").split(/[,;]+/)).forEach(function (e) {
    var m = String(e || "").trim().toLowerCase();
    if (!m || seen[m] || m === skip) return;
    seen[m] = true;
    notifyUser_(m, type, projectUid, projectName, data);
  });
}

function apiGetNotifications() {
  var email = String(getUserEmail_() || "").toLowerCase();
  try {
    var sh = notifSheet_();
    var last = sh.getLastRow();
    var items = [];
    if (last >= 2) {
      var start = Math.max(2, last - NOTIF_SCAN_ROWS_ + 1);
      var values = sh.getRange(start, 1, last - start + 1, NOTIF_HEADERS_.length).getValues();
      for (var i = values.length - 1; i >= 0 && items.length < 60; i--) {
        var r = values[i];
        if (String(r[1]).toLowerCase() !== email) continue;
        var data = {};
        try { data = JSON.parse(String(r[5] || "{}")) || {}; } catch (e) {}
        var ts = r[0] instanceof Date ? r[0] : new Date(r[0]);
        items.push({
          ts: isNaN(ts.getTime()) ? "" : ts.toISOString(),
          type: String(r[2] || "info"),
          projectUid: String(r[3] || ""),
          projectName: String(r[4] || ""),
          data: data
        });
      }
    }
    var seenAt = userPrefsGet_(email).notifSeenAt || "";
    var seenMs = seenAt ? new Date(seenAt).getTime() : 0;
    var unread = items.filter(function (n) { return n.ts && new Date(n.ts).getTime() > seenMs; }).length;
    return { success: true, items: items, seenAt: seenAt, unread: unread };
  } catch (e) {
    return { success: false, error: e.message, items: [], unread: 0 };
  }
}

function apiMarkNotificationsRead() {
  try {
    var now = new Date().toISOString();
    userPrefsMerge_(getUserEmail_(), { notifSeenAt: now });
    return { success: true, seenAt: now };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
