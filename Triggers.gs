/**
 * SetupTriggers.gs
 * Einmalig ausführen im Apps Script Editor ? Funktion "setupAllTriggers" ? Run
 * Setzt alle nötigen Trigger für das Translation Hub Projekt.
 */

function setupAllTriggers() {
  console.log("\u2022 Starte Trigger-Setup...");

  // Alle bestehenden Trigger löschen (sauberer Start)
  const existing = ScriptApp.getProjectTriggers();
  existing.forEach(t => {
    ScriptApp.deleteTrigger(t);
    console.log("\u26A0 Gelöscht: " + t.getHandlerFunction());
  });

  // ?? 1. AutoSync ? alle 15 Minuten ----------------------------------------
  ScriptApp.newTrigger("autoSyncProjectStatuses_")
    .timeBased()
    .everyMinutes(15)
    .create();
  console.log("\u2022 AutoSync: alle 15 Minuten");

  // ?? 2. Chat-Property-Cleanup ? täglich 03:00 -----------------------------
  ScriptApp.newTrigger("cleanupChatDedupProperties_")
    .timeBased()
    .atHour(3)
    .everyDays(1)
    .create();
  console.log("\u2022 Chat-Cleanup: täglich 03:00");

  // Script Property setzen damit der Toggle in der UI korrekt angezeigt wird
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "true");

  // ?? Übersicht aller gesetzten Trigger ------------------------------------
  console.log("--------------------------------");
  console.log("\u2713 Trigger-Setup abgeschlossen!");
  console.log("--------------------------------");
  ScriptApp.getProjectTriggers().forEach(t => {
    console.log("\u2022 " + t.getHandlerFunction() + " (" + t.getTriggerSource() + ")");
  });

  return "\u2022 Alle Trigger gesetzt.";
}

/**
 * Zeigt alle aktuell gesetzten Trigger ? zum überprüfen.
 * Ausführen: Funktion "listAllTriggers" ? Run
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  if (!triggers.length) {
    console.log("\u26A0 Keine Trigger gesetzt.");
    return;
  }
  console.log("--------------------------------");
  console.log("Aktuelle Trigger (" + triggers.length + "):");
  triggers.forEach(t => {
    console.log("\u2022 " + t.getHandlerFunction()
      + " | Source: " + t.getTriggerSource()
      + " | Type: " + t.getEventType());
  });
  console.log("--------------------------------");
}

/**
 * Löscht alle Trigger ? zum Zurücksetzen.
 * Ausführen: Funktion "removeAllTriggers" ? Run
 */
function removeAllTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => {
    ScriptApp.deleteTrigger(t);
    console.log("\u26A0 Gelöscht: " + t.getHandlerFunction());
  });
  PropertiesService.getScriptProperties().setProperty("AUTO_SYNC_ENABLED", "false");
  console.log("\u2022 Alle Trigger entfernt.");
}
/**
 * Löscht CHAT_NOTIFIED__-Properties von Projekten, die terminal sind
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
    // Löschen wenn: nicht mehr in Queue ODER terminal
    if (status === undefined || terminal.indexOf(status) !== -1) {
      props.deleteProperty(key);
      deleted++;
    }
  });

  console.log("cleanupChatDedupProperties_: " + deleted + " CHAT_NOTIFIED__ Keys gelöscht.");
  return { deleted: deleted };
}

/**
 * Täglicher Trigger (03:00) für die Property-Bereinigung.
 * Einmal im Editor ausführen.
 */
function setupChatCleanupTrigger_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "cleanupChatDedupProperties_") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("cleanupChatDedupProperties_")
    .timeBased().atHour(3).everyDays(1).create();
  console.log("\u2022 Cleanup-Trigger gesetzt (täglich 03:00).");
  return "OK";
}