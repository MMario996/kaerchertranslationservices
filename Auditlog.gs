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
 *  - AUDIT_PURGE (wenn alte Eintr?ge gel?scht werden)
 *
 * Admin API:
 *  - apiGetAuditLog(limit)        ? returns last N entries
 *  - apiPurgeOldAuditEntries(days) ? deletes entries older than N days
 */

var AUDIT_SHEET_NAME_ = "AuditLog";

// ??? Core logging function ????????????????????????????????????????????????????

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

// ??? Admin API: Read audit log ????????????????????????????????????????????????

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

// ??? Admin API: Purge old audit log entries ???????????????????????????????????

/**
 * L?scht alle AuditLog-Eintr?ge, die ?lter als `days` Tage sind.
 *
 * Vorgehen: Alle Zeilen lesen, alte Zeilen identifizieren, r?ckw?rts l?schen
 * (r?ckw?rts, damit sich die Zeilennummern beim L?schen nicht verschieben).
 *
 * @param {number} days  Eintr?ge ?lter als diese Anzahl Tage werden gel?scht.
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

    // R?ckw?rts iterieren, um Zeilennummern beim L?schen stabil zu halten
    var deletedCount = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      var rawTs = data[i][0];
      var entryDate = (rawTs instanceof Date) ? rawTs : new Date(rawTs);

      if (!isNaN(entryDate.getTime()) && entryDate < cutoff) {
        sh.deleteRow(i + 2); // +2: 1 f?r Header, 1 f?r 0-Indexed
        deletedCount++;
      }
    }

    var remaining = Math.max(0, sh.getLastRow() - 1);
    var msg = "AuditLog bereinigt: " + deletedCount + " Eintr?ge ?lter als " + days + " Tage gel?scht. " +
              remaining + " Eintr?ge verbleiben.";

    // Den Purge selbst auch loggen
    logAuditEvent_(caller, "AUDIT_PURGE", msg);

    return { success: true, deleted: deletedCount, remaining: remaining, msg: msg };

  } catch (e) {
    return { success: false, deleted: 0, remaining: -1, msg: e.message };
  }
}