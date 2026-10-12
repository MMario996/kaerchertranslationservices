/**
 * Deputies.gs
 * Urlaubsvertretung: Jeder Nutzer kann in den Einstellungen (Reiter
 * "Vertretung") eine Person festlegen, die waehrend seiner Abwesenheit
 *   - eine Kopie aller Chat-Nachrichten des Portals bekommt (sendPrivateMessage_,
 *     sendThreadReply_ in Upload.gs) und
 *   - die gleichen Rechte hat: sieht seine Projekte in "Meine Projekte", darf sie
 *     wie der Eigentuemer bearbeiten (Frist, Name, Notiz, Teilen, Abbrechen) und
 *     bekommt seine Bereiche/Vorlagen (Config.gs, Code.gs apiCheckAccess).
 * Zeitraum optional: ohne Von/Bis gilt die Vertretung, solange sie aktiv ist.
 *
 * Sheet: "Deputies" in ACCESS_SHEET_ID
 * Spalten: Email | Deputy | From | To | Active | Updated At
 */
var DEPUTY_SHEET_NAME_ = "Deputies";
var DEPUTY_HEADERS_ = ["Email", "Deputy", "From", "To", "Active", "Updated At"];
var DEPUTY_CACHE_KEY_ = "deputies_v1";

/** Reine Funktion (getestet): bereinigt eine Eingabe aus dem Einstellungsdialog. */
function deputySanitize_(input, ownEmail) {
  input = input || {};
  var email = String(input.email || "").trim().toLowerCase();
  var day = function (v) {
    var s = String(v || "").trim().slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
  };
  var out = { email: email, from: day(input.from), to: day(input.to), active: input.active === true };
  if (!email) { out.active = false; return { ok: true, value: out }; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "invalid_email" };
  if (email === String(ownEmail || "").trim().toLowerCase()) return { ok: false, error: "self" };
  if (out.from && out.to && out.to < out.from) return { ok: false, error: "range" };
  return { ok: true, value: out };
}

/** Reine Funktion (getestet): gilt die Vertretung am Tag today ("yyyy-MM-dd")? */
function deputyIsActive_(entry, today) {
  if (!entry || !entry.active || !entry.deputy) return false;
  if (entry.from && today < entry.from) return false;
  if (entry.to && today > entry.to) return false;
  return true;
}

function deputyToday_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "Europe/Berlin", "yyyy-MM-dd");
}

function deputySheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(DEPUTY_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(DEPUTY_SHEET_NAME_);
    sh.appendRow(DEPUTY_HEADERS_);
    sh.getRange(1, 1, 1, DEPUTY_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function deputyCellDay_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return Utilities.formatDate(v, Session.getScriptTimeZone() || "Europe/Berlin", "yyyy-MM-dd");
  return String(v || "").trim().slice(0, 10);
}

/** Alle Eintraege (kurz gecacht - wird bei jedem Chat-Versand gelesen). */
function deputyReadAll_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(DEPUTY_CACHE_KEY_);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }
  var list = [];
  try {
    var ss = openAccessSS_();
    var sh = ss.getSheetByName(DEPUTY_SHEET_NAME_);
    if (sh) {
      var data = sh.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var email = String(data[i][0] || "").trim().toLowerCase();
        if (!email) continue;
        list.push({
          email: email,
          deputy: String(data[i][1] || "").trim().toLowerCase(),
          from: deputyCellDay_(data[i][2]),
          to: deputyCellDay_(data[i][3]),
          active: String(data[i][4]).toUpperCase() === "TRUE" || data[i][4] === true
        });
      }
    }
  } catch (e) {
    console.warn("deputyReadAll_: " + e.message);
  }
  try { cache.put(DEPUTY_CACHE_KEY_, JSON.stringify(list), 120); } catch (e) {}
  return list;
}

/** Aktive Vertretung von email ("" = keine). */
function deputyFor_(email) {
  var key = String(email || "").trim().toLowerCase();
  if (!key) return "";
  var today = deputyToday_();
  var hit = deputyReadAll_().filter(function (d) { return d.email === key && deputyIsActive_(d, today); })[0];
  return hit ? hit.deputy : "";
}

/** Fuer wen vertritt email gerade? (Liste von E-Mails) */
function deputyPrincipalsOf_(email) {
  var key = String(email || "").trim().toLowerCase();
  if (!key) return [];
  var today = deputyToday_();
  return deputyReadAll_()
    .filter(function (d) { return d.deputy === key && deputyIsActive_(d, today); })
    .map(function (d) { return d.email; });
}

/** Darf caller als Vertretung fuer owner handeln? */
function deputyActsFor_(caller, owner) {
  var o = String(owner || "").trim().toLowerCase();
  if (!o) return false;
  try { return deputyPrincipalsOf_(caller).indexOf(o) >= 0; } catch (e) { return false; }
}

/**
 * Kopie einer Chat-Nachricht an die aktive Vertretung des Empfaengers.
 * Nie rekursiv (die Vertretung der Vertretung bekommt nichts), Fehler nur geloggt.
 */
function deputyForwardChat_(userEmail, messageText) {
  try {
    var deputy = deputyFor_(userEmail);
    if (!deputy) return;
    var head = fillTemplate_(getMessageTemplate_("MSG_DEPUTY_COPY", "en"), { USER: normalizeEmail_(userEmail) });
    var text = head + "\n\n" + String(messageText || "");
    try {
      sendPrivateMessageRaw_(deputy, text);
      logChatMessage_(deputy, true, text);
    } catch (e) {
      logChatMessage_(deputy, false, text, e.message);
    }
  } catch (e) {
    console.warn("deputyForwardChat_: " + e.message);
  }
}

// --- Endpunkte (Einstellungen -> Vertretung) ----------------------------------

function apiGetDeputySettings() {
  var email = String(getUserEmail_() || "").toLowerCase();
  if (!email) return { success: false, error: "No user email found." };
  var all = deputyReadAll_();
  var mine = all.filter(function (d) { return d.email === email; })[0] || { deputy: "", from: "", to: "", active: false };
  var today = deputyToday_();
  return {
    success: true,
    deputy: { email: mine.deputy || "", from: mine.from || "", to: mine.to || "", active: !!mine.active },
    activeNow: deputyIsActive_(mine, today),
    principals: all.filter(function (d) { return d.deputy === email && d.active; }).map(function (d) {
      return { email: d.email, from: d.from, to: d.to, activeNow: deputyIsActive_(d, today) };
    })
  };
}

function apiSaveDeputySettings(input) {
  var email = String(getUserEmail_() || "").toLowerCase();
  if (!email) return { success: false, error: "No user email found." };
  var clean = deputySanitize_(input, email);
  if (!clean.ok) return { success: false, error: clean.error };
  var v = clean.value;
  var before = deputyFor_(email);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = deputySheet_();
    var data = sh.getDataRange().getValues();
    var row = [email, v.email, v.from, v.to, v.active, new Date()];
    var found = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0] || "").trim().toLowerCase() === email) { found = i + 1; break; }
    }
    if (found > 0) sh.getRange(found, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    // Datumszellen als Text, damit Sheets sie nicht umdeutet.
    var r = found > 0 ? found : sh.getLastRow();
    sh.getRange(r, 3, 1, 2).setNumberFormat("@").setValues([[v.from, v.to]]);
  } finally {
    lock.releaseLock();
  }
  CacheService.getScriptCache().remove(DEPUTY_CACHE_KEY_);
  logAuditEvent_(email, "DEPUTY_SET", v.email ? (v.email + " " + (v.active ? "aktiv" : "inaktiv") + " " + (v.from || "…") + " – " + (v.to || "…")) : "entfernt");

  // Die neue Vertretung einmal informieren.
  var after = deputyFor_(email);
  if (after && after !== before) {
    try {
      sendPrivateMessage_(after, fillTemplate_(getMessageTemplate_("MSG_DEPUTY_ASSIGNED", "en"), {
        USER: email, FROM: v.from || "-", TO: v.to || "-", PORTAL_URL: PORTAL_URL_
      }));
    } catch (e) { console.warn("Deputy notify failed: " + e.message); }
  }
  return apiGetDeputySettings();
}
