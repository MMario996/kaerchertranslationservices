/**
 * Announcements.gs
 *
 * Ankuendigungen der Admins (Neuerung, geplanter Ausfall, Hinweis ...), die
 * Nutzern als Banner oben in der App angezeigt und auf Wunsch zusaetzlich
 * per Google-Chat-Direktnachricht verschickt werden.
 *
 * Sheet: "Announcements" in ACCESS_SHEET_ID
 * Spalten: ID | Type | Title DE | Text DE | Title EN | Text EN | Start | End |
 *          Audience | Active | Created By | Created At | Chat Sent At
 * Type: info | success | warning | critical
 * Audience: "all" oder kommagetrennte Bereiche (general, marketing, woma, cc,
 *           kec, documentation, campus, admin) - siehe AdminAccess.gs
 */
var ANNOUNCEMENTS_SHEET_NAME_ = "Announcements";
var ANNOUNCEMENT_HEADERS_ = ["ID", "Type", "Title DE", "Text DE", "Title EN", "Text EN", "Start", "End",
  "Audience", "Active", "Created By", "Created At", "Chat Sent At"];
var ANNOUNCEMENT_TYPES_ = ["info", "success", "warning", "critical"];

function announcementsSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(ANNOUNCEMENTS_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(ANNOUNCEMENTS_SHEET_NAME_);
    sh.appendRow(ANNOUNCEMENT_HEADERS_);
    sh.getRange(1, 1, 1, ANNOUNCEMENT_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function annIso_(v) {
  if (!v) return "";
  var d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

function announcementsReadAll_() {
  var values = announcementsSheet_().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    var id = String(r[0] || "").trim();
    if (!id) continue;
    out.push({
      rowNum: i + 1,
      id: id,
      type: ANNOUNCEMENT_TYPES_.indexOf(String(r[1])) >= 0 ? String(r[1]) : "info",
      titleDe: String(r[2] || ""), textDe: String(r[3] || ""),
      titleEn: String(r[4] || ""), textEn: String(r[5] || ""),
      start: annIso_(r[6]), end: annIso_(r[7]),
      audience: String(r[8] || "all").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      active: String(r[9]).toLowerCase() !== "no" && r[9] !== false,
      createdBy: String(r[10] || ""), createdAt: annIso_(r[11]), chatSentAt: annIso_(r[12])
    });
  }
  return out;
}

/** Bereiche eines Nutzers aus den Flags von getConfig_(). */
function announcementAreasFromFlags_(f) {
  var areas = [];
  if (f.isGeneral) areas.push("general");
  if (f.isMarketing) areas.push("marketing");
  if (f.isWoma) areas.push("woma");
  if (f.isCc) areas.push("cc");
  if (f.isKeC) areas.push("kec");
  if (f.isDoc) areas.push("documentation");
  if (f.isArticulate) areas.push("campus");
  if (f.effectiveIsAdmin) areas.push("admin");
  return areas;
}

function announcementIsLive_(a, now) {
  if (!a.active) return false;
  if (a.start && new Date(a.start).getTime() > now) return false;
  if (a.end && new Date(a.end).getTime() < now) return false;
  return true;
}

/** Aktuell sichtbare Ankuendigungen fuer einen Nutzer (fuer getConfig_). */
function announcementsForUser_(flags) {
  try {
    var areas = announcementAreasFromFlags_(flags || {});
    var now = Date.now();
    return announcementsReadAll_().filter(function (a) {
      if (!announcementIsLive_(a, now)) return false;
      if (a.audience.indexOf("all") >= 0 || !a.audience.length) return true;
      return a.audience.some(function (x) { return areas.indexOf(x) >= 0; });
    }).map(function (a) {
      return { id: a.id, type: a.type, titleDe: a.titleDe, textDe: a.textDe, titleEn: a.titleEn, textEn: a.textEn, start: a.start, end: a.end };
    });
  } catch (e) {
    console.warn("announcementsForUser_: " + e.message);
    return [];
  }
}

function apiAdminListAnnouncements() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    var now = Date.now();
    var list = announcementsReadAll_().map(function (a) { a.live = announcementIsLive_(a, now); return a; });
    list.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
    return { success: true, announcements: list };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/** Legt eine Ankuendigung an (ohne id) oder aktualisiert sie (mit id). */
function apiAdminSaveAnnouncement(a) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  a = a || {};
  var titleDe = String(a.titleDe || "").trim(), textDe = String(a.textDe || "").trim();
  var titleEn = String(a.titleEn || "").trim(), textEn = String(a.textEn || "").trim();
  if (!(titleDe || textDe || titleEn || textEn)) return { success: false, error: "Titel oder Text ist Pflicht." };
  var type = ANNOUNCEMENT_TYPES_.indexOf(a.type) >= 0 ? a.type : "info";
  var audience = (Array.isArray(a.audience) && a.audience.length) ? a.audience.join(",") : "all";
  var start = a.start ? new Date(a.start) : "";
  var end = a.end ? new Date(a.end) : "";
  if (start && end && end.getTime() < start.getTime()) return { success: false, error: "Das Ende liegt vor dem Start." };

  try {
    var sh = announcementsSheet_();
    if (a.id) {
      var row = announcementsReadAll_().filter(function (x) { return x.id === a.id; })[0];
      if (!row) return { success: false, error: "Ankuendigung nicht gefunden." };
      sh.getRange(row.rowNum, 2, 1, 9).setValues([[type, titleDe, textDe, titleEn, textEn, start, end, audience, a.active === false ? "no" : "yes"]]);
      logAuditEvent_(caller, "ANNOUNCEMENT_UPDATE", a.id + " " + (titleDe || titleEn));
    } else {
      var id = "A" + Utilities.getUuid().replace(/-/g, "").slice(0, 10);
      sh.appendRow([id, type, titleDe, textDe, titleEn, textEn, start, end, audience, a.active === false ? "no" : "yes", caller, new Date(), ""]);
      logAuditEvent_(caller, "ANNOUNCEMENT_ADD", id + " " + (titleDe || titleEn));
    }
    return apiAdminListAnnouncements();
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiAdminSetAnnouncementActive(id, active) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  var row = announcementsReadAll_().filter(function (x) { return x.id === id; })[0];
  if (!row) return { success: false, error: "Ankuendigung nicht gefunden." };
  announcementsSheet_().getRange(row.rowNum, 10).setValue(active ? "yes" : "no");
  logAuditEvent_(caller, active ? "ANNOUNCEMENT_ON" : "ANNOUNCEMENT_OFF", id);
  return apiAdminListAnnouncements();
}

function apiAdminDeleteAnnouncement(id) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  var row = announcementsReadAll_().filter(function (x) { return x.id === id; })[0];
  if (!row) return { success: false, error: "Ankuendigung nicht gefunden." };
  announcementsSheet_().deleteRow(row.rowNum);
  logAuditEvent_(caller, "ANNOUNCEMENT_DELETE", id);
  return apiAdminListAnnouncements();
}

/**
 * Verschickt eine Ankuendigung als Chat-Direktnachricht an alle Nutzer der
 * Zielgruppe (aus den Whitelists). Nutzer ohne Chat-Verbindung werden
 * uebersprungen und gezaehlt. Bricht nach ~4,5 Minuten ab, um das
 * Apps-Script-Zeitlimit nicht zu reissen; ein erneuter Aufruf schickt dann
 * erneut an alle (daher vorher bestaetigen lassen).
 */
function apiAdminSendAnnouncementChat(id) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  var a = announcementsReadAll_().filter(function (x) { return x.id === id; })[0];
  if (!a) return { success: false, error: "Ankuendigung nicht gefunden." };

  var matrix = apiGetAccessMatrix();
  if (!matrix.success) return matrix;
  var all = a.audience.indexOf("all") >= 0 || !a.audience.length;
  var recipients = matrix.users.filter(function (u) {
    return all ? Object.keys(u.areas).length > 0 : a.audience.some(function (x) { return u.areas[x]; });
  }).map(function (u) { return u.email; });

  var icons = { info: "ℹ️", success: "✅", warning: "⚠️", critical: "🚨" };
  var text = function () {
    var parts = [];
    if (a.titleDe || a.textDe) parts.push((a.titleDe ? "*" + a.titleDe + "*\n" : "") + a.textDe);
    if (a.titleEn || a.textEn) parts.push((a.titleEn ? "*" + a.titleEn + "*\n" : "") + a.textEn);
    return (icons[a.type] || "") + " " + parts.join("\n\n———\n\n");
  }();

  var started = Date.now();
  var sent = 0, skipped = 0, pending = 0;
  for (var i = 0; i < recipients.length; i++) {
    if (Date.now() - started > 270000) { pending = recipients.length - i; break; }
    try { sendPrivateMessage_(recipients[i], text); sent++; }
    catch (e) { skipped++; }
  }
  announcementsSheet_().getRange(a.rowNum, 13).setValue(new Date());
  logAuditEvent_(caller, "ANNOUNCEMENT_CHAT", id + ": " + sent + " gesendet, " + skipped + " ohne Chat, " + pending + " offen");
  return { success: true, recipients: recipients.length, sent: sent, skipped: skipped, pending: pending };
}
