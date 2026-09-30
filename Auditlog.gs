/**
 * AuditLog.gs
 * Centralized audit/activity logging for the Translation Hub.
 *
 * Logs are written to a sheet called "AuditLog" in the ACCESS spreadsheet.
 * Each row: [Timestamp, UserEmail, Action, Details]
 *
 * Actions logged:
 *  - PROJECT_CREATE, PROJECT_CANCEL, PROJECT_SHARE
 *  - PROP_EDIT, PROP_DELETE, PROP_ADD
 *  - ADMIN_ADD, ADMIN_REMOVE
 *  - WHITELIST_ADD, WHITELIST_REMOVE
 *  - MAINT_ON, MAINT_OFF
 *  - SYNC_TEMPLATES, SYNC_USERS
 *  - AUTO_SYNC_ON, AUTO_SYNC_OFF
 *  - LOGIN (first visit per session)
 *  - AUDIT_PURGE (wenn alte Einträge gelöscht werden)
 *
 * Admin API:
 *  - apiGetAuditLog(limit)        ? returns last N entries
 *  - apiPurgeOldAuditEntries(days) ? deletes entries older than N days
 */

var AUDIT_SHEET_NAME_ = "AuditLog";

// --- Core logging function ----------------------------------------------------

function logAuditEvent_(userEmail, action, details) {
  try {
    var ss = SpreadsheetApp.openById(getAccessSheetId_());
    var sh = ss.getSheetByName(AUDIT_SHEET_NAME_);

    if (!sh) {
      sh = ss.insertSheet(AUDIT_SHEET_NAME_);
      sh.appendRow(["Timestamp", "User", "Action", "Details"]);
      sh.getRange("A1:D1").setFontWeight("bold").setBackground("#FFED00");
      sh.setFrozenRows(1);
      sh.setColumnWidth(1, 180);
      sh.setColumnWidth(2, 250);
      sh.setColumnWidth(3, 180);
      sh.setColumnWidth(4, 500);
    }

    var ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    sh.appendRow([ts, String(userEmail || "system"), String(action || ""), String(details || "")]);

  } catch (e) {
    // Audit logging should never break the main flow
    console.warn("AuditLog write failed: " + e.message);
  }
}

// --- Admin API: Read audit log ------------------------------------------------

function apiGetAuditLog(limit) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  limit = Number(limit) || 50;

  try {
    var ss = SpreadsheetApp.openById(getAccessSheetId_());
    var sh = ss.getSheetByName(AUDIT_SHEET_NAME_);
    if (!sh) return { entries: [], total: 0 };

    var lastRow = sh.getLastRow();
    if (lastRow < 2) return { entries: [], total: 0 };

    var count = Math.min(lastRow - 1, limit);
    var startRow = lastRow - count + 1;
    var data = sh.getRange(startRow, 1, count, 4).getValues();

    var entries = data.reverse().map(function(row) {
      return {
        timestamp: row[0] ? String(row[0]) : "",
        user:      String(row[1] || ""),
        action:    String(row[2] || ""),
        details:   String(row[3] || "")
      };
    });

    return { entries: entries, total: lastRow - 1 };

  } catch (e) {
    return { entries: [], total: 0, error: e.message };
  }
}

// --- Admin API: Purge old audit log entries -----------------------------------

/**
 * Löscht alle AuditLog-Einträge, die älter als `days` Tage sind.
 *
 * Vorgehen: Alle Zeilen lesen, alte Zeilen identifizieren, rückwärts löschen
 * (rückwärts, damit sich die Zeilennummern beim Löschen nicht verschieben).
 *
 * @param {number} days  Einträge älter als diese Anzahl Tage werden gelöscht.
 *                       Minimum: 30 Tage (Sicherheitsgrenze).
 * @returns {{ success: boolean, deleted: number, remaining: number, msg: string }}
 */
function apiPurgeOldAuditEntries(days) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  days = Number(days);
  if (!isFinite(days) || days < 30) {
    throw new Error("Minimum Aufbewahrungsdauer: 30 Tage. Angegeben: " + days);
  }

  try {
    var ss = SpreadsheetApp.openById(getAccessSheetId_());
    var sh = ss.getSheetByName(AUDIT_SHEET_NAME_);
    if (!sh) return { success: true, deleted: 0, remaining: 0, msg: "AuditLog sheet not found." };

    var lastRow = sh.getLastRow();
    if (lastRow < 2) return { success: true, deleted: 0, remaining: 0, msg: "No entries to purge." };

    var data = sh.getRange(2, 1, lastRow - 1, 4).getValues();
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    // Rückwärts iterieren, um Zeilennummern beim Löschen stabil zu halten
    var deletedCount = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      var rawTs = data[i][0];
      var entryDate = (rawTs instanceof Date) ? rawTs : new Date(rawTs);

      if (!isNaN(entryDate.getTime()) && entryDate < cutoff) {
        sh.deleteRow(i + 2); // +2: 1 für Header, 1 für 0-Indexed
        deletedCount++;
      }
    }

    var remaining = Math.max(0, sh.getLastRow() - 1);
    var msg = "AuditLog bereinigt: " + deletedCount + " Einträge älter als " + days + " Tage gelöscht. " +
              remaining + " Einträge verbleiben.";

    // Den Purge selbst auch loggen
    logAuditEvent_(caller, "AUDIT_PURGE", msg);

    return { success: true, deleted: deletedCount, remaining: remaining, msg: msg };

  } catch (e) {
    return { success: false, deleted: 0, remaining: -1, msg: e.message };
  }
}
// --- Gemeinsames Protokoll (Aktivitaeten + Queue + Chat-Nachrichten) ----------

/**
 * Kategorie eines Protokolleintrags fuer die Filter im Admin-Protokoll.
 * Reine Funktion (getestet).
 */
function auditCategory_(action) {
  var a = String(action || "").toUpperCase();
  if (a === "CHAT_SENT" || a === "CHAT_FAILED" || a === "ANNOUNCEMENT_CHAT") return "messages";
  if (/^(PROJECT_|DUE_DATE_|JOB_NOTE|KEC_|PHRASE_OWNER_|QUEUE_STATUS|PRESET_|CHAT_ASSIGN_|CHAT_CHANGE_)/.test(a)) return "projects";
  if (/^(WHITELIST_|ADMIN_|ACCESS_|LOGIN|USER_FIELD_|TEMPLATE_)/.test(a)) return "access";
  return "system";
}

/** "error" fuer fehlgeschlagene Aktionen, sonst "ok". Reine Funktion (getestet). */
function auditLevel_(action, details) {
  var a = String(action || "").toUpperCase();
  if (/(FAILED|ERROR)$/.test(a)) return "error";
  if (a === "QUEUE_STATUS" && /\b(ERROR|FAILED)\b/i.test(String(details || ""))) return "error";
  return "ok";
}

/**
 * Protokolliert eine ausgehende Google-Chat-Nachricht (Erfolg oder Fehler).
 * Details = erste Textzeile ohne Markdown, damit man sieht, WAS rausging.
 */
function logChatMessage_(recipient, ok, text, error) {
  var first = String(text || "").replace(/<users\/[^>]+>\s*/g, "").replace(/[*_`]/g, "")
    .split("\n").map(function (l) { return l.trim(); }).filter(Boolean)[0] || "";
  var details = first.slice(0, 140) + (ok ? "" : " | " + String(error || "").slice(0, 200));
  logAuditEvent_(recipient || "?", ok ? "CHAT_SENT" : "CHAT_FAILED", details);
}

/**
 * Fuehrt AuditLog-Eintraege und Queue-Zeilen zu einer zeitlich sortierten
 * Liste zusammen (neueste zuerst). Eintraege brauchen { ms, user, action, details }.
 * Reine Funktion (getestet).
 */
function mergeLogEntries_(audit, queue, limit) {
  var all = [].concat(audit || [], queue || []).map(function (e) {
    return {
      t: isFinite(e.ms) && e.ms > 0 ? new Date(e.ms).toISOString() : "",
      ms: isFinite(e.ms) ? e.ms : 0,
      user: String(e.user || ""),
      action: String(e.action || ""),
      details: String(e.details || ""),
      category: auditCategory_(e.action),
      level: auditLevel_(e.action, e.details)
    };
  });
  all.sort(function (a, b) { return b.ms - a.ms; });
  var counts = { all: all.length, projects: 0, messages: 0, access: 0, system: 0, error: 0 };
  all.forEach(function (e) { counts[e.category]++; if (e.level === "error") counts.error++; });
  return { entries: all.slice(0, limit || all.length), counts: counts };
}

/** Zeitstempel aus dem Sheet (Date oder "yyyy-MM-dd HH:mm:ss" in Script-Zeitzone) -> ms. */
function auditTsToMs_(v, tz) {
  if (v instanceof Date) return v.getTime();
  var s = String(v || "").trim();
  if (!s) return 0;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
    try { return Utilities.parseDate(s, tz, "yyyy-MM-dd HH:mm:ss").getTime(); } catch (e) {}
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

/**
 * Admin-Protokoll: AuditLog (inkl. Chat-Nachrichten) + aktueller Stand der
 * letzten Queue-Zeilen (frueheres "Systemprotokoll") in einer Liste.
 * @param {{limit?:number}} opts
 */
function apiGetUnifiedLog(opts) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  opts = opts || {};
  var limit = Math.min(Math.max(Number(opts.limit) || 400, 50), 2000);
  var tz = Session.getScriptTimeZone();
  var audit = [], queue = [], warnings = [];

  try {
    var sh = SpreadsheetApp.openById(getAccessSheetId_()).getSheetByName(AUDIT_SHEET_NAME_);
    if (sh && sh.getLastRow() >= 2) {
      var n = Math.min(sh.getLastRow() - 1, limit);
      sh.getRange(sh.getLastRow() - n + 1, 1, n, 4).getValues().forEach(function (r) {
        audit.push({ ms: auditTsToMs_(r[0], tz), user: r[1], action: r[2], details: r[3] });
      });
    }
  } catch (e) { warnings.push("AuditLog: " + e.message); }

  try {
    var q = getQueueSheet_();
    if (q && q.getLastRow() >= 2) {
      var m = Math.min(q.getLastRow() - 1, 100);
      q.getRange(q.getLastRow() - m + 1, 1, m, 19).getValues().forEach(function (r) {
        var uid = String(r[2] || "").trim();
        queue.push({
          ms: auditTsToMs_(r[0], tz),
          user: String(r[1] || ""),
          action: "QUEUE_STATUS",
          details: String(r[11] || r[4] || "?") + " | " + String(r[7] || "?") + (uid ? " | " + uid : "")
        });
      });
    }
  } catch (e) { warnings.push("Queue: " + e.message); }

  var merged = mergeLogEntries_(audit, queue, limit);
  return { success: true, entries: merged.entries, counts: merged.counts, warnings: warnings };
}
