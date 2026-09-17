/**
 * DriveSaveConfig.gs
 * Admin-konfigurierbare OAuth-Client-ID für "In Google Drive speichern" (Save to Drive).
 *
 * Der Upload in die EIGENE "Meine Ablage" (My Drive) des jeweiligen Nutzers läuft
 * rein client-seitig über Google Identity Services (GIS) ? NICHT über Apps Script
 * selbst. Grund: Diese Web-App läuft mit "Execute as: Me" (siehe appsscript.json,
 * webapp.executeAs = USER_DEPLOYING). Jeder Drive-Zugriff aus Apps-Script-Code
 * heraus (DriveApp / Drive Advanced Service) läuft daher IMMER unter dem Konto,
 * das die Web-App deployed hat ? nicht unter dem Konto des gerade zugreifenden
 * Nutzers. Ein Server-seitiger "Speichere in MEIN Drive"-Aufruf würde die Datei
 * also fälschlicherweise im Drive des Deploy-Accounts ablegen.
 *
 * Um wirklich in das Drive des tatsächlichen Nutzers zu schreiben, holt sich das
 * Frontend daher per Google Identity Services einen kurzlebigen Access-Token
 * (Scope: drive.file) direkt im Browser des Nutzers und lädt die Datei per
 * Drive REST API selbst hoch (siehe saveFilesToGoogleDrive() in Index.html).
 *
 * Einmalige Einrichtung (Admin, einmalig nötig):
 *  1. Google Cloud Console öffnen (Projekt, das mit diesem Apps-Script-Projekt
 *     verknüpft ist ? "Ressourcen" > "Cloud-Plattform-Projekt anzeigen").
 *  2. "APIs & Dienste" > "Anmeldedaten" > "Anmeldedaten erstellen" > "OAuth-Client-ID".
 *  3. Anwendungstyp "Webanwendung" wählen, die Portal-URL (die *.script.google.com
 *     bzw. Sites-Einbettungs-URL) unter "Autorisierte JavaScript-Quellen" eintragen.
 *  4. Die erzeugte Client-ID unten im Admin-Bereich unter "Google Drive Export" eintragen.
 * Ohne konfigurierte Client-ID bleibt der "In Google Drive speichern"-Button
 * für alle Nutzer inaktiv (mit Hinweistext), der normale Download bleibt unberührt.
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

  // Google meldet eine falsch eingetragene ID erst im Browser des Nutzers als
  // "Error 401: invalid_client - The OAuth client was not found". Das ist weit weg
  // von der Stelle, an der der Wert eingegeben wurde, deshalb hier die Formpruefung.
  if (id && !/^[0-9]+-[A-Za-z0-9_]+\.apps\.googleusercontent\.com$/.test(id)) {
    return {
      success: false,
      error: "Das sieht nicht nach einer OAuth-Client-ID aus. Erwartet wird die Form " +
             "123456789012-abc123.apps.googleusercontent.com (Typ \"Webanwendung\"). " +
             "Haeufige Verwechslungen: Client-Secret, Projektnummer oder API-Schluessel."
    };
  }

  PropertiesService.getScriptProperties().setProperty(DRIVE_SAVE_CLIENT_ID_PROP_, id);
  try { logAuditEvent_(caller, "DRIVE_SAVE_CLIENT_ID_EDIT", "Updated Drive Save OAuth Client ID"); } catch (e) {}
  return { success: true };
}