/**
 * DriveSaveConfig.gs
 * "In Google Drive speichern" (Save to Drive) - Upload in die EIGENE
 * "Meine Ablage" (My Drive) des jeweiligen Nutzers.
 *
 * Diese Web-App laeuft mit "Execute as: Me" (appsscript.json, webapp.
 * executeAs = USER_DEPLOYING). Jeder Drive-Zugriff aus Apps-Script-Code
 * heraus (DriveApp / Drive Advanced Service) laeuft daher IMMER unter dem
 * Konto, das die Web-App deployed hat - nicht unter dem Konto des gerade
 * zugreifenden Nutzers. Ein einfacher serverseitiger "Speichere in MEIN
 * Drive"-Aufruf wuerde die Datei also faelschlicherweise im Drive des
 * Deploy-Accounts ablegen.
 *
 * FRUEHERER ANSATZ (verworfen): clientseitiger Google-Identity-Services
 * (GIS) initTokenClient()-Aufruf direkt im Browser. Das schlaegt bei dieser
 * Web-App strukturell fehl: sie laeuft eingebettet in Google Sites in einem
 * Apps-Script-eigenen Sandbox-Iframe (Origin "https://n-xxxx...-0lu-script.
 * googleusercontent.com"), und *.googleusercontent.com laesst sich in der
 * Google Cloud Console NICHT als "Authorized JavaScript origin" eintragen
 * ("Invalid Origin: Uses a forbidden domain") - live getestet, Error 400:
 * origin_mismatch bzw. "no registered origin".
 *
 * AKTUELLER ANSATZ: serverseitiger Authorization-Code-Flow ueber die
 * "OAuth2 for Apps Script"-Bibliothek (dieselbe, die auch der Chat-Bot fuer
 * den Service-Account nutzt, hier aber als 3-legged User-Flow). Der Token
 * wird pro Nutzer in PropertiesService.getUserProperties() gespeichert -
 * das ist IMMER auf den tatsaechlichen End-Nutzer skopiert, unabhaengig
 * vom "Execute as"-Deploy-Konto. Der eigentliche Drive-Upload passiert
 * danach ebenfalls serverseitig (siehe apiSaveProjectToDrive unten), der
 * Browser bekommt keine Access Tokens mehr zu Gesicht.
 *
 * Einmalige Einrichtung (Admin, einmalig noetig):
 *  1. Google Cloud Console oeffnen (das mit diesem Apps-Script-Projekt
 *     verknuepfte GCP-Projekt - Apps-Script-Editor -> Project Settings ->
 *     "Google Cloud Platform (GCP) Project" zeigt, welches das ist).
 *  2. "APIs & Dienste" > "Anmeldedaten" > "Anmeldedaten erstellen" >
 *     "OAuth-Client-ID", Typ "Webanwendung".
 *  3. Unter "Authorized redirect URIs" eintragen:
 *     https://script.google.com/macros/d/{SCRIPT_ID}/usercallback
 *     (SCRIPT_ID: Apps-Script-Editor -> Project Settings -> "Script ID").
 *     ("Authorized JavaScript origins" wird NICHT gebraucht.)
 *  4. Client-ID UND Client-Secret unten im Admin-Bereich unter
 *     "Google Drive Export" eintragen.
 * Ohne konfigurierte Client-ID/-Secret bleibt der "In Google Drive
 * speichern"-Button fuer alle Nutzer inaktiv (mit Hinweistext), der normale
 * Download bleibt unberuehrt.
 */
var DRIVE_SAVE_CLIENT_ID_PROP_     = "DRIVE_SAVE_OAUTH_CLIENT_ID";
var DRIVE_SAVE_CLIENT_SECRET_PROP_ = "DRIVE_SAVE_OAUTH_CLIENT_SECRET";

function apiGetDriveSaveConfig() {
  var props = PropertiesService.getScriptProperties();
  var clientId = props.getProperty(DRIVE_SAVE_CLIENT_ID_PROP_) || "";
  var hasSecret = !!props.getProperty(DRIVE_SAVE_CLIENT_SECRET_PROP_);
  return { success: true, clientId: clientId, configured: !!(clientId && hasSecret) };
}

function apiSaveDriveSaveClientId(clientId, clientSecret) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var id = String(clientId || "").trim();
  var secret = String(clientSecret || "").trim();

  // Google meldet eine falsch eingetragene ID erst im Browser des Nutzers, weit
  // weg von der Stelle, an der der Wert eingegeben wurde - deshalb hier die Formpruefung.
  if (id && !/^[0-9]+-[A-Za-z0-9_]+\.apps\.googleusercontent\.com$/.test(id)) {
    return {
      success: false,
      error: "Das sieht nicht nach einer OAuth-Client-ID aus. Erwartet wird die Form " +
             "123456789012-abc123.apps.googleusercontent.com (Typ \"Webanwendung\"). " +
             "Haeufige Verwechslungen: Client-Secret, Projektnummer oder API-Schluessel."
    };
  }

  var props = PropertiesService.getScriptProperties();
  props.setProperty(DRIVE_SAVE_CLIENT_ID_PROP_, id);
  if (secret) props.setProperty(DRIVE_SAVE_CLIENT_SECRET_PROP_, secret);

  // Bestehende gespeicherte Nutzer-Tokens sind an die alte Client-ID gebunden -
  // beim Wechsel der Konfiguration muessen alle sich neu autorisieren.
  try { getDriveSaveOAuthService_().reset(); } catch (e) {}

  try { logAuditEvent_(caller, "DRIVE_SAVE_CLIENT_ID_EDIT", "Updated Drive Save OAuth config"); } catch (e) {}
  return { success: true };
}

// ============================================================================
// OAuth2-Service (3-legged, pro Nutzer) - siehe https://github.com/googleworkspace/apps-script-oauth2
// ============================================================================

function getDriveSaveOAuthService_() {
  var props = PropertiesService.getScriptProperties();
  var clientId = props.getProperty(DRIVE_SAVE_CLIENT_ID_PROP_) || "";
  var clientSecret = props.getProperty(DRIVE_SAVE_CLIENT_SECRET_PROP_) || "";

  return OAuth2.createService("DriveSave")
    .setAuthorizationBaseUrl("https://accounts.google.com/o/oauth2/auth")
    .setTokenUrl("https://oauth2.googleapis.com/token")
    .setClientId(clientId)
    .setClientSecret(clientSecret)
    .setCallbackFunction("driveSaveOAuthCallback_")
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope("https://www.googleapis.com/auth/drive.file")
    .setParam("access_type", "offline")
    .setParam("prompt", "consent");
}

/** Callback-Ziel der OAuth2-Bibliothek (https://script.google.com/macros/d/{SCRIPT_ID}/usercallback). */
function driveSaveOAuthCallback_(request) {
  var service = getDriveSaveOAuthService_();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput(
      "<html><body style=\"font-family:sans-serif;padding:30px;text-align:center;\">" +
      "<p>✅ Google Drive access granted.</p>" +
      "<p>You can close this tab and go back to the Translation Services portal.</p>" +
      "<script>setTimeout(function(){ window.close(); }, 1200);</" + "script>" +
      "</body></html>"
    );
  }
  return HtmlService.createHtmlOutput(
    "<html><body style=\"font-family:sans-serif;padding:30px;text-align:center;\">" +
    "<p>⚠️ Authorization denied or failed.</p>" +
    "<p>You can close this tab and try again.</p></body></html>"
  );
}

function apiCheckDriveAuthStatus() {
  try {
    return { authorized: getDriveSaveOAuthService_().hasAccess() };
  } catch (e) {
    return { authorized: false, error: e.message };
  }
}

function apiGetDriveAuthUrl() {
  try {
    return { success: true, url: getDriveSaveOAuthService_().getAuthorizationUrl() };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// Upload (serverseitig, mit dem pro-Nutzer-Token der obigen OAuth2-Service)
// ============================================================================

/**
 * Holt die Zieldateien des Projekts (wie apiGetFilesForDriveExport es schon
 * fuer den frueheren clientseitigen Ansatz tat) und laedt sie direkt vom
 * Server aus in "Meine Ablage" des aufrufenden Nutzers hoch.
 */
function apiSaveProjectToDrive(projectUid, jobUids, projectName, targetLangs, jobMapping, convertToGoogle) {
  var service = getDriveSaveOAuthService_();
  if (!service.hasAccess()) {
    return { success: false, needsAuth: true, error: "Not authorized for Google Drive yet." };
  }
  var token = service.getAccessToken();

  var filesResult = apiGetFilesForDriveExport(projectUid, jobUids, projectName, targetLangs, jobMapping);
  if (!filesResult.success) return filesResult;

  try {
    var rootId = _driveFindOrCreateFolder_(token, "Translation Services", null);
    var projectFolderId = _driveFindOrCreateFolder_(token, projectName || "Project", rootId);

    var successCount = 0;
    var errors = [];
    filesResult.files.forEach(function (f) {
      try {
        _driveUploadFile_(token, projectFolderId, f, convertToGoogle);
        successCount++;
      } catch (e) {
        errors.push(f.fileName + ": " + e.message);
      }
    });

    return {
      success:   true,
      uploaded:  successCount,
      total:     filesResult.files.length,
      folderUrl: "https://drive.google.com/drive/folders/" + projectFolderId,
      errors:    errors
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function _driveFindOrCreateFolder_(token, name, parentId) {
  var safeName = String(name).replace(/'/g, "\\'");
  var q = "name='" + safeName + "' and mimeType='application/vnd.google-apps.folder' and trashed=false and '" +
    (parentId || "root") + "' in parents";
  var listUrl = "https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent(q) + "&fields=files(id,name)";
  var listRes = UrlFetchApp.fetch(listUrl, {
    headers: { Authorization: "Bearer " + token },
    muteHttpExceptions: true
  });
  var listData = JSON.parse(listRes.getContentText() || "{}");
  if (listData.files && listData.files.length) return listData.files[0].id;

  var metadata = { name: name, mimeType: "application/vnd.google-apps.folder" };
  if (parentId) metadata.parents = [parentId];
  var createRes = UrlFetchApp.fetch("https://www.googleapis.com/drive/v3/files", {
    method:             "post",
    contentType:        "application/json",
    headers:            { Authorization: "Bearer " + token },
    payload:            JSON.stringify(metadata),
    muteHttpExceptions: true
  });
  var createData = JSON.parse(createRes.getContentText() || "{}");
  if (!createData.id) throw new Error((createData.error && createData.error.message) || "Could not create Drive folder.");
  return createData.id;
}

function _driveUploadFile_(token, folderId, file, convertToGoogle) {
  var useGoogleFormat = convertToGoogle && file.canConvertToGoogle && file.googleMimeType;
  var metadata = { name: file.fileName, parents: [folderId] };
  if (useGoogleFormat) metadata.mimeType = file.googleMimeType;

  var blob = Utilities.newBlob(Utilities.base64Decode(file.base64), file.mimeType, file.fileName);
  var boundary = "-------314159265358979323846";
  var payload = _driveBuildMultipartBody_(boundary, metadata, blob);

  var res = UrlFetchApp.fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name", {
    method:             "post",
    contentType:        "multipart/related; boundary=" + boundary,
    headers:            { Authorization: "Bearer " + token },
    payload:            payload,
    muteHttpExceptions: true
  });
  var data = JSON.parse(res.getContentText() || "{}");
  if (!data.id) throw new Error((data.error && data.error.message) || "Upload failed.");
  return data.id;
}

/** Baut den rohen multipart/related-Body fuer den Drive-Upload (UrlFetchApp hat dafuer keinen eingebauten Helfer). */
function _driveBuildMultipartBody_(boundary, metadata, blob) {
  var metadataPart = "--" + boundary + "\r\n" +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) + "\r\n";
  var mediaPartHeader = "--" + boundary + "\r\n" +
    "Content-Type: " + (blob.getContentType() || "application/octet-stream") + "\r\n\r\n";
  var closeDelim = "\r\n--" + boundary + "--";

  return Utilities.newBlob(metadataPart).getBytes()
    .concat(Utilities.newBlob(mediaPartHeader).getBytes())
    .concat(blob.getBytes())
    .concat(Utilities.newBlob(closeDelim).getBytes());
}
