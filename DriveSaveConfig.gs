/**
 * DriveSaveConfig.gs
 * Admin-konfigurierbare OAuth-Client-ID f?r "In Google Drive speichern" (Save to Drive).
 *
 * Der Upload in die EIGENE "Meine Ablage" (My Drive) des jeweiligen Nutzers l?uft
 * rein client-seitig ?ber Google Identity Services (GIS) ? NICHT ?ber Apps Script
 * selbst. Grund: Diese Web-App l?uft mit "Execute as: Me" (siehe appsscript.json,
 * webapp.executeAs = USER_DEPLOYING). Jeder Drive-Zugriff aus Apps-Script-Code
 * heraus (DriveApp / Drive Advanced Service) l?uft daher IMMER unter dem Konto,
 * das die Web-App deployed hat ? nicht unter dem Konto des gerade zugreifenden
 * Nutzers. Ein Server-seitiger "Speichere in MEIN Drive"-Aufruf w?rde die Datei
 * also f?lschlicherweise im Drive des Deploy-Accounts ablegen.
 *
 * Um wirklich in das Drive des tats?chlichen Nutzers zu schreiben, holt sich das
 * Frontend daher per Google Identity Services einen kurzlebigen Access-Token
 * (Scope: drive.file) direkt im Browser des Nutzers und l?dt die Datei per
 * Drive REST API selbst hoch (siehe saveFilesToGoogleDrive() in Index.html).
 *
 * Einmalige Einrichtung (Admin, einmalig n?tig):
 *  1. Google Cloud Console ?ffnen (Projekt, das mit diesem Apps-Script-Projekt
 *     verkn?pft ist ? "Ressourcen" > "Cloud-Plattform-Projekt anzeigen").
 *  2. "APIs & Dienste" > "Anmeldedaten" > "Anmeldedaten erstellen" > "OAuth-Client-ID".
 *  3. Anwendungstyp "Webanwendung" w?hlen, die Portal-URL (die *.script.google.com
 *     bzw. Sites-Einbettungs-URL) unter "Autorisierte JavaScript-Quellen" eintragen.
 *  4. Die erzeugte Client-ID unten im Admin-Bereich unter "Google Drive Export" eintragen.
 * Ohne konfigurierte Client-ID bleibt der "In Google Drive speichern"-Button
 * f?r alle Nutzer inaktiv (mit Hinweistext), der normale Download bleibt unber?hrt.
 */
var DRIVE_SAVE_CLIENT_ID_PROP_ = "DRIVE_SAVE_OAUTH_CLIENT_ID";

function apiGetDriveSaveConfig() {
  var clientId = PropertiesService.getScriptProperties().getProperty(DRIVE_SAVE_CLIENT_ID_PROP_) || "";
  return { success: true, clientId: clientId, configured: !!clientId };
}

function apiSaveDriveSaveClientId(clientId) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var id = String(clientId || "").trim();
  PropertiesService.getScriptProperties().setProperty(DRIVE_SAVE_CLIENT_ID_PROP_, id);
  try { logAuditEvent_(caller, "DRIVE_SAVE_CLIENT_ID_EDIT", "Updated Drive Save OAuth Client ID"); } catch (e) {}
  return { success: true };
}
