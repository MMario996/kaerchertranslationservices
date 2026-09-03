/**
 * AutoSync.gs
 * - Syncs project statuses every 15 min
 * - Notifies owner + shared users on completion (via thread reply)
 * - Sends deadline reminders 24h before due date
 * - recordDownloadTimestamp_ for archiving
 *
 * FIX: Shared users get completion as thread-reply (not new message)
 * FIX: Double completion notification prevented via CHAT_NOTIFIED__ property
 * FIX: Thread IDs cleared from Queue sheet after project completion/cancellation
 */

function apiToggleAutoSync(enable) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");
  if (enable) return setupAutoSyncTrigger_();
  else        return removeAutoSyncTrigger_();
}

function apiGetAutoSyncStatus() {
  var enabled = PropertiesService.getScriptProperties().getProperty("AUTO_SYNC_ENABLED") === "true";
  var triggers = ScriptApp.getProjectTriggers();
  var triggerExists = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "autoSyncProjectStatuses_") {
      triggerExists = true; break;
    }
  }
  var lastRun   = PropertiesService.getScriptProperties().getProperty("AUTO_SYNC_LAST_RUN") || "";
  var lastCount = PropertiesService.getScriptProperties().getProperty("AUTO_SYNC_LAST_UPDATED") || "0";
  return { enabled: enabled && triggerExists, lastRun: lastRun, lastUpdated: Number(lastCount) };
}

function setupAutoSyncTrigger_() {
  removeAutoSyncTrigger_();
  ScriptApp.newTrigger("autoSyncProjectStatuses_").timeBased().everyMinutes(15).create();
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "true");
  console.log("? Auto-sync trigger created (every 15 minutes).");
  return { success: true, msg: "Auto-sync enabled (every 15 minutes)." };
}

function removeAutoSyncTrigger_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "autoSyncProjectStatuses_") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "false");
  console.log("? Auto-sync trigger removed.");
  return { success: true, msg: "Auto-sync disabled." };
}

function autoSyncProjectStatuses_() {
  var startTime = new Date();
  console.log("? Auto-sync started at " + startTime.toISOString());

  var TERMINAL_STATUSES   = ["CANCELLED", "CANCELED", "REJECTED"];
  var COMPLETION_STATUSES = ["COMPLETED", "DELIVERED"];

  try {
    var sh   = getQueueSheet_();
    var data = sh.getDataRange().getValues();
    if (data.length < 2) { console.log("No rows to sync."); return; }

    var updated = 0, errors = 0, checked = 0;
    var now = new Date();
    var reminderWindowMs = 24 * 60 * 60 * 1000;
    var props = PropertiesService.getScriptProperties();

    for (var i = 1; i < data.length; i++) {
      var row           = data[i];
      var projectUid    = String(row[2]  || "").trim();
      var currentStatus = String(row[7]  || "").trim().toUpperCase();
      var threadMsgName = String(row[19] || "").trim();
      var rowUser       = String(row[1]  || "").toLowerCase().trim();
      var sharedWith    = String(row[17] || "").trim();
      var sharedThreads = _parseSharedThreads_(String(row[20] || "").trim());
      var dueDateRaw    = row[12];
      var projectName   = String(row[11] || row[4] || projectUid).trim();

      if (!projectUid) continue;
      if (TERMINAL_STATUSES.indexOf(currentStatus) !== -1) continue;

      checked++;

      // ?? 1. Status sync ??????????????????????????????????????????????????????
      try {
        var url    = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
        var result = phraseFetchJson_(url, {
          method:  "get",
          headers: { Authorization: getPhraseAuthHeader_() }
        });

        var newStatus = result && result.status ? String(result.status).toUpperCase() : "";
        var isNowDone = COMPLETION_STATUSES.indexOf(newStatus) !== -1;

        var notifiedKey = "CHAT_NOTIFIED__" + projectUid;
        var alreadyNotified = props.getProperty(notifiedKey) === "true";

        if (newStatus && (newStatus !== currentStatus || (isNowDone && !alreadyNotified))) {

          if (isNowDone && !alreadyNotified) {
            var phraseUrl = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
            var replyText = fillTemplate_(getMessageTemplate_("MSG_COMPLETED", "en"), {
              PROJECT_NAME: projectName,
              PHRASE_ID:    projectUid,
              STATUS:       newStatus,
              PHRASE_URL:   phraseUrl
            });

            // Owner benachrichtigen
            if (threadMsgName) {
              try { sendThreadReply_(rowUser, threadMsgName, replyText); } catch(e) {
                try { sendPrivateMessage_(rowUser, replyText); } catch(e2) {}
              }
            } else {
              try { sendPrivateMessage_(rowUser, replyText); } catch(e) {}
            }

            // FIX: Shared Users via Thread-Reply benachrichtigen
            _notifySharedUsers_(sharedWith, sharedThreads, replyText);

            // Status + notified Property setzen
            sh.getRange(i + 1, 8).setValue(newStatus);
            props.setProperty(notifiedKey, "true");
            try { docImportUpdateProjectStatusInKanban_(projectUid, newStatus); } catch (e) {}

            // FIX: Thread-IDs nach Completion aus Sheet l?schen
            _clearThreadIds_(sh, i + 1);

            updated++;
            console.log("  ? Completion notification sent for " + projectUid + ", status ? " + newStatus);
            currentStatus = newStatus;

          } else if (newStatus !== currentStatus) {
            sh.getRange(i + 1, 8).setValue(newStatus);
            try { docImportUpdateProjectStatusInKanban_(projectUid, newStatus); } catch (e) {}
            updated++;
            console.log("? " + projectUid + ": " + currentStatus + " ? " + newStatus);
            currentStatus = newStatus;

            // FIX: Bei Terminal-Status (Cancelled etc.) Thread-IDs auch l?schen
            if (TERMINAL_STATUSES.indexOf(newStatus) !== -1) {
              _clearThreadIds_(sh, i + 1);
            }
          }
        }
      } catch (e) {
        errors++;
        console.warn("  ? Sync failed for " + projectUid + ": " + e.message);
      }

      // ?? 2. Deadline reminder (24h) ??????????????????????????????????????????
      try {
        if (dueDateRaw && TERMINAL_STATUSES.indexOf(currentStatus) === -1 &&
            COMPLETION_STATUSES.indexOf(currentStatus) === -1) {

          var dueDate = dueDateRaw instanceof Date ? dueDateRaw : new Date(dueDateRaw);
          if (!isNaN(dueDate.getTime())) {
            var msUntilDue = dueDate.getTime() - now.getTime();

            var reminderSentKey = "REMINDER_SENT__" + projectUid;
            var reminderAlreadySent = props.getProperty(reminderSentKey);

            if (msUntilDue > 0 && msUntilDue <= reminderWindowMs && !reminderAlreadySent) {
              var formattedDue = dueDate.toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
              });
              var pUrl = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
              var reminderText = fillTemplate_(getMessageTemplate_("MSG_DEADLINE_REMINDER", "en"), {
                PROJECT_NAME: projectName,
                PHRASE_ID:    projectUid,
                STATUS:       currentStatus,
                DEADLINE:     formattedDue,
                PHRASE_URL:   pUrl
              });

              var reminderSent = false;
              if (threadMsgName) {
                try { sendThreadReply_(rowUser, threadMsgName, reminderText); reminderSent = true; } catch(e) {
                  try { sendPrivateMessage_(rowUser, reminderText); reminderSent = true; } catch(e2) {}
                }
              } else {
                try { sendPrivateMessage_(rowUser, reminderText); reminderSent = true; } catch(e) {}
              }

              _notifySharedUsers_(sharedWith, sharedThreads, reminderText);

              if (reminderSent) {
                props.setProperty(reminderSentKey, "true");
                console.log("  ?? Deadline reminder sent for " + projectUid);
              }
            }

            if (msUntilDue > reminderWindowMs && reminderAlreadySent) {
              props.deleteProperty(reminderSentKey);
            }
          }
        }
      } catch(reminderErr) {
        console.warn("  ?? Reminder check failed for " + projectUid + ": " + reminderErr.message);
      }
      if (checked % 10 === 0) Utilities.sleep(500);
    }
    if (updated > 0) SpreadsheetApp.flush();
    props.setProperty("AUTO_SYNC_LAST_RUN", new Date().toISOString());
    props.setProperty("AUTO_SYNC_LAST_UPDATED", String(updated));
  } catch (e) {
    console.error("? Auto-sync fatal error: " + e.message);
  }
}

/**
 * FIX: L?scht Thread-IDs (Spalten T und U) aus dem Queue Sheet nach Completion/Cancellation.
 * Spart Speicher und verhindert veraltete Thread-Referenzen.
 * @param {Sheet} sh  Queue Sheet
 * @param {number} rowNum  1-basierte Zeilennummer
 */
function _clearThreadIds_(sh, rowNum) {
  try {
    sh.getRange(rowNum, 20).setValue(""); // Spalte T: owner thread ID
    sh.getRange(rowNum, 21).setValue(""); // Spalte U: shared threads JSON
    console.log("  ? Thread IDs cleared for row " + rowNum);
  } catch(e) {
    console.warn("  ?? _clearThreadIds_ failed for row " + rowNum + ": " + e.message);
  }
}

function recordDownloadTimestamp_(projectUid) {
  try {
    var sh   = getQueueSheet_();
    var data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][2]).trim() === projectUid) {
        sh.getRange(i + 1, 22).setValue(new Date().toISOString());
        console.log("? Download timestamp recorded for:", projectUid);
        break;
      }
    }
  } catch (e) {
    console.warn("recordDownloadTimestamp_ failed:", e.message);
  }
}