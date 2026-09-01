/**
 * SetupTriggers.gs
 * Einmalig ausf?hren im Apps Script Editor ? Funktion "setupAllTriggers" ? Run
 * Setzt alle n?tigen Trigger f?r das Translation Hub Projekt.
 */

function setupAllTriggers() {
  console.log("? Starte Trigger-Setup...");

  // Alle bestehenden Trigger l?schen (sauberer Start)
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach(t => {
    ScriptApp.deleteTrigger(t);
    console.log("?? Gel?scht: " + t.getHandlerFunction());
  });

  // ?? 1. AutoSync ? alle 15 Minuten ????????????????????????????????????????
  ScriptApp.newTrigger("autoSyncProjectStatuses_")
    .timeBased()
    .everyMinutes(15)
    .create();
  console.log("? AutoSync: alle 15 Minuten");

  // ?? 2. Chat-Property-Cleanup ? t?glich 03:00 ?????????????????????????????
  ScriptApp.newTrigger("cleanupChatDedupProperties_")
    .timeBased()
    .atHour(3)
    .everyDays(1)
    .create();
  console.log("? Chat-Cleanup: t?glich 03:00");

  // Script Property setzen damit der Toggle in der UI korrekt angezeigt wird
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "true");

  // ?? ?bersicht aller gesetzten Trigger ????????????????????????????????????
  console.log("????????????????????????????????");
  console.log("? Trigger-Setup abgeschlossen!");
  console.log("????????????????????????????????");
  ScriptApp.getProjectTriggers().forEach(t => {
    console.log("? " + t.getHandlerFunction() + " (" + t.getTriggerSource() + ")");
  });

  return "? Alle Trigger gesetzt.";
}

/**
 * Zeigt alle aktuell gesetzten Trigger ? zum ?berpr?fen.
 * Ausf?hren: Funktion "listAllTriggers" ? Run
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  if (!triggers.length) {
    console.log("?? Keine Trigger gesetzt.");
    return;
  }
  console.log("????????????????????????????????");
  console.log("Aktuelle Trigger (" + triggers.length + "):");
  triggers.forEach(t => {
    console.log("? " + t.getHandlerFunction()
      + " | Source: " + t.getTriggerSource()
      + " | Type: " + t.getEventType());
  });
  console.log("????????????????????????????????");
}

/**
 * L?scht alle Trigger ? zum Zur?cksetzen.
 * Ausf?hren: Funktion "removeAllTriggers" ? Run
 */
function removeAllTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    ScriptApp.deleteTrigger(t);
    console.log("?? Gel?scht: " + t.getHandlerFunction());
  });
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "false");
  console.log("? Alle Trigger entfernt.");
}
/**
 * L?scht CHAT_NOTIFIED__-Properties von Projekten, die terminal sind
 * (COMPLETED/DELIVERED/CANCELLED/etc.) oder nicht mehr in der Queue stehen.
 * CHAT_FIRST_SUBMIT__ und CHAT_PREF_ON__ bleiben unangetastet.
 */
function cleanupChatDedupProperties_() {
  var props = PropertiesService.getScriptProperties();
  var all = props.getProperties();
  var terminal = ["COMPLETED", "DELIVERED", "CANCELLED", "CANCELED", "REJECTED"];

  // Aktuelle Projekt-Status aus der Queue einlesen
  var statusByUid = {};
  try {
    var sh = getQueueSheet_();
    var data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var uid = String(data[i][2] || "").trim();
      if (uid) statusByUid[uid] = String(data[i][7] || "").trim().toUpperCase();
    }
  } catch (e) {
    console.warn("cleanupChatDedupProperties_: Queue nicht lesbar: " + e.message);
    return { deleted: 0, error: e.message };
  }

  var deleted = 0;
  Object.keys(all).forEach(function (key) {
    if (key.indexOf("CHAT_NOTIFIED__") !== 0) return;
    var uid = key.substring("CHAT_NOTIFIED__".length);
    var status = statusByUid[uid];
    // L?schen wenn: nicht mehr in Queue ODER terminal
    if (status === undefined || terminal.indexOf(status) !== -1) {
      props.deleteProperty(key);
      deleted++;
    }
  });

  console.log("cleanupChatDedupProperties_: " + deleted + " CHAT_NOTIFIED__ Keys gel?scht.");
  return { deleted: deleted };
}

/**
 * T?glicher Trigger (03:00) f?r die Property-Bereinigung.
 * Einmal im Editor ausf?hren.
 */
function setupChatCleanupTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "cleanupChatDedupProperties_") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("cleanupChatDedupProperties_")
    .timeBased().atHour(3).everyDays(1).create();
  console.log("? Cleanup-Trigger gesetzt (t?glich 03:00).");
  return "OK";
}