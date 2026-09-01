/**
 * DocArchive.gs
 * Archiviert ein Documentation-Projekt: verschiebt alle zugeh?rigen Zeilen
 * vom Queue-Sheet ins Archive-Sheet (identische Spaltenreihenfolge, daher
 * positional-copy) und sendet die "Translation Complete"-Chat-Notification
 * an den urspr?nglichen Einreicher (Notification Email aus der Zeile).
 */
function apiArchiveDocQueueProject(projectUid, projectName) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var ss = SpreadsheetApp.openById(DOC_QUEUE_SHEET_ID_);
    var queueSh = ss.getSheetByName(DOC_QUEUE_SHEET_NAME_);
    var archiveSh = ss.getSheetByName("Archive");
    if (!queueSh) return { success: false, error: "Queue-Sheet nicht gefunden." };
    if (!archiveSh) return { success: false, error: "Archive-Sheet nicht gefunden." };

    var lastRow = queueSh.getLastRow();
    var lastCol = queueSh.getLastColumn();
    if (lastRow < 2) return { success: false, error: "Queue-Sheet ist leer." };

    var data = queueSh.getRange(1, 1, lastRow, lastCol).getValues();
    var headers = data[0].map(function(h) { return String(h || "").trim(); });
    var idxProjectUid = headers.indexOf("Project UID");
    var idxProjectName = headers.indexOf("Project Name");
    var idxNotifEmail = headers.indexOf("Notification Email");

    var uidStr = String(projectUid || "").trim();
    var nameStr = String(projectName || "").trim();

    var matchedRowIndices = [];
    var notificationEmail = "";
    for (var r = 1; r < data.length; r++) {
      var rowUid = idxProjectUid !== -1 ? String(data[r][idxProjectUid] || "").trim() : "";
      var rowName = idxProjectName !== -1 ? String(data[r][idxProjectName] || "").trim() : "";
      var isMatch = uidStr ? (rowUid === uidStr) : (rowName === nameStr);
      if (isMatch) {
        matchedRowIndices.push(r);
        if (!notificationEmail && idxNotifEmail !== -1 && data[r][idxNotifEmail]) {
          notificationEmail = String(data[r][idxNotifEmail]).trim();
        }
      }
    }

    if (!matchedRowIndices.length) {
      return { success: false, error: "Keine passenden Zeilen im Queue-Sheet gefunden." };
    }

    // Zeilen an Archive anh?ngen (positional copy, gleiche Spaltenreihenfolge)
    var rowsToArchive = matchedRowIndices.map(function(r) { return data[r]; });
    archiveSh.getRange(archiveSh.getLastRow() + 1, 1, rowsToArchive.length, lastCol).setValues(rowsToArchive);

    // Aus Queue l?schen ? von unten nach oben (1-indexiert, +1 wegen Header-Zeile)
    for (var i = matchedRowIndices.length - 1; i >= 0; i--) {
      queueSh.deleteRow(matchedRowIndices[i] + 1);
    }

    // ?? Chat Notification: "Translation Complete" an den Einreicher ??
    var notifyWarning = null;
    if (notificationEmail) {
      try {
        var chatEnabled = getUserChatPreference_(notificationEmail);
        if (chatEnabled) {
          var phraseUrl = uidStr ? "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(uidStr) : "";
          var msg = fillTemplate_(getMessageTemplate_("MSG_COMPLETED", "en"), {
            PROJECT_NAME: nameStr,
            PHRASE_ID: uidStr,
            STATUS: "COMPLETED",
            PHRASE_URL: phraseUrl,
            PORTAL_URL: "https://sites.google.com/karcher.com/phrase"
          });
          sendPrivateMessage_(notificationEmail, msg);
        }
      } catch (chatErr) {
        notifyWarning = chatErr.message || String(chatErr);
      }
    }

    return {
      success: true,
      archivedRows: rowsToArchive.length,
      notified: !!notificationEmail,
      notifyWarning: notifyWarning
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}