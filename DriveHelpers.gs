/**
 * DriveHelpers.gs  (v5 ? Shortcut-Rekursionsschutz)
 *
 * ??  This must be the ONLY file defining apiBrowseDrive().
 *     DELETE: DriveIntegration.gs (entire file)
 *     DELETE: apiBrowseDrive stub in WebApp.gs
 *
 * Drive Advanced Service = v2 only in Apps Script.
 * In v2, Shared Drives are called "Team Drives":
 *   Drive.Teamdrives.list()  (not Drive.Drives.list)
 */

function apiBrowseDrive(folderId) {
  var contents = [];
  var currentName = "Google Drive";
  var currentId = folderId || "home";
  var parentId = null;

  try {
    // ?? HOME SCREEN ??????????????????????????????????????????
    if (!folderId || folderId === "home") {
      var homeContents = [
        { id: "root", name: "My Drive", type: "folder" }
      ];

      try {
        if (typeof Drive !== "undefined" && Drive.Teamdrives && Drive.Teamdrives.list) {
          homeContents.push({ id: "::shared-drives-root::", name: "Shared Drives", type: "folder" });
        }
      } catch (e) {
        console.log("Shared Drives check skipped: " + e.message);
      }

      return {
        ok: true,
        currentId: "home",
        currentName: "Google Drive",
        parentId: null,
        contents: homeContents
      };
    }

    // ?? SHARED DRIVES ROOT ???????????????????????????????????
    if (folderId === "::shared-drives-root::") {
      if (typeof Drive === "undefined" || !Drive.Teamdrives || !Drive.Teamdrives.list) {
        return {
          ok: true,
          currentId: "::shared-drives-root::",
          currentName: "Shared Drives",
          parentId: "home",
          contents: [{
            id: "__info__",
            name: "Shared Drives require the Drive API Advanced Service to be enabled.",
            type: "info"
          }]
        };
      }

      try {
        var pageToken = null;
        do {
          var resp = Drive.Teamdrives.list({
            pageToken: pageToken || undefined,
            maxResults: 100
          });

          if (resp && resp.items) {
            resp.items.forEach(function(drv) {
              contents.push({
                id: drv.id,
                name: drv.name || "Shared Drive",
                type: "folder"
              });
            });
          }
          pageToken = resp ? resp.nextPageToken : null;
        } while (pageToken);

        contents.sort(function(a, b) { return String(a.name).localeCompare(String(b.name)); });

      } catch (e) {
        console.error("Shared Drives list error:", e.message);
        contents = [{
          id: "__info__",
          name: "Could not load Shared Drives: " + e.message,
          type: "info"
        }];
      }

      return {
        ok: true,
        currentId: "::shared-drives-root::",
        currentName: "Shared Drives",
        parentId: "home",
        contents: contents
      };
    }

    // ?? NORMAL FOLDER BROWSE (My Drive or Shared Drive folder) ??
    var folder;
    if (folderId === "root") {
      folder = DriveApp.getRootFolder();
      currentName = "My Drive";
      currentId = "root";
      parentId = "home";
    } else {
      folder = DriveApp.getFolderById(folderId);
      currentName = folder.getName();
      currentId = folder.getId();

      var parents = folder.getParents();
      if (parents.hasNext()) {
        parentId = parents.next().getId();
      } else {
        parentId = "::shared-drives-root::";
      }
    }

    // 1) Subfolders
    var subFolders = folder.getFolders();
    while (subFolders.hasNext()) {
      var sf = subFolders.next();
      contents.push({ id: sf.getId(), name: sf.getName(), type: "folder" });
    }

    // 2) Files
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      contents.push({ id: file.getId(), name: file.getName(), type: "file", mimeType: file.getMimeType() });
    }

    contents.sort(function(a, b) {
      if (a.type === b.type) return String(a.name).localeCompare(String(b.name));
      return a.type === "folder" ? -1 : 1;
    });

    return {
      ok: true,
      currentId: currentId,
      currentName: currentName,
      parentId: parentId,
      contents: contents
    };

  } catch (e) {
    console.error("apiBrowseDrive ERROR for folderId=" + folderId + ":", e);
    return {
      ok: false,
      error: String(e && e.message ? e.message : e),
      currentId: folderId || "home",
      currentName: "Google Drive",
      parentId: "home",
      contents: []
    };
  }
}


/**
 * Converts Google-native files to Office formats for Phrase upload.
 * - Shortcuts werden automatisch aufgel?st (max. 3 Ebenen tief)
 * - Google Docs/Sheets/Slides werden zu docx/xlsx/pptx exportiert
 * - Echte Office-Dateien (.xlsx, .docx etc.) werden direkt als Blob zur?ckgegeben
 *
 * Primary export: DriveApp.getAs() ? robuster als UrlFetchApp REST
 * Fallback export: UrlFetchApp + Drive v3 REST API
 *
 * @param {GoogleAppsScript.Drive.File} driveFile
 * @param {number} [_depth] Interne Rekursionstiefe ? nicht von aussen setzen
 */
function getProcessedDriveFileBlobForUpload_(driveFile, _depth) {
  // ?? Rekursionsschutz: max. 3 Ebenen (Shortcut ? Shortcut ? Shortcut ? Fehler) ??
  var depth = typeof _depth === "number" ? _depth : 0;
  var MAX_SHORTCUT_DEPTH = 3;

  var mime = driveFile.getMimeType();
  var id   = driveFile.getId();
  var name = driveFile.getName();

  console.log("Processing Drive file (depth=" + depth + "):", { name: name, mime: mime, id: id });

  // ?? 1) Shortcut aufl?sen ??????????????????????????????????
  if (mime === "application/vnd.google-apps.shortcut") {
    if (depth >= MAX_SHORTCUT_DEPTH) {
      throw new Error(
        "Die Datei \"" + name + "\" ist ein verschachtelter Shortcut (Tiefe > " + MAX_SHORTCUT_DEPTH + ").\n" +
        "Bitte navigiere im Drive-Browser direkt zur Originaldatei statt zu einer Verkn?pfung."
      );
    }

    console.log("? Shortcut erkannt (Tiefe " + depth + "), folge dem Ziel-File...");
    try {
      var token = ScriptApp.getOAuthToken();
      var metaUrl = "https://www.googleapis.com/drive/v3/files/" + id
                  + "?fields=shortcutDetails(targetId,targetMimeType)";
      var metaResp = UrlFetchApp.fetch(metaUrl, {
        headers: { Authorization: "Bearer " + token },
        muteHttpExceptions: true
      });

      if (metaResp.getResponseCode() !== 200) {
        throw new Error("Drive API HTTP " + metaResp.getResponseCode());
      }

      var meta = JSON.parse(metaResp.getContentText());
      var targetId = meta.shortcutDetails && meta.shortcutDetails.targetId;
      if (!targetId) throw new Error("Shortcut hat kein targetId.");

      console.log("? Shortcut zeigt auf targetId: " + targetId + " (Tiefe " + depth + ")");
      var targetFile = DriveApp.getFileById(targetId);

      // Rekursiver Aufruf mit erh?hter Tiefe
      return getProcessedDriveFileBlobForUpload_(targetFile, depth + 1);

    } catch (e) {
      // Verschachtelte Shortcut-Fehlermeldung direkt durchreichen
      if (e.message && e.message.indexOf("verschachtelter Shortcut") !== -1) throw e;

      throw new Error(
        "Die Datei \"" + name + "\" ist eine Drive-Verkn?pfung (Shortcut) " +
        "und konnte nicht aufgel?st werden.\n" +
        "Bitte navigiere im Drive-Browser direkt zur Originaldatei.\n\n" +
        "Fehler: " + e.message
      );
    }
  }

  // ?? 2) Google-native Formate exportieren ??????????????????
  var exportMap = {
    "application/vnd.google-apps.document": {
      ext: ".docx",
      exportMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    "application/vnd.google-apps.spreadsheet": {
      ext: ".xlsx",
      exportMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    "application/vnd.google-apps.presentation": {
      ext: ".pptx",
      exportMime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    }
  };

  if (exportMap[mime]) {
    var setting = exportMap[mime];
    var exportName = name;
    if (!exportName.toLowerCase().endsWith(setting.ext)) exportName += setting.ext;

    // Prim?r: DriveApp.getAs()
    try {
      var blob = driveFile.getAs(setting.exportMime);
      blob.setName(exportName);
      console.log("? Export via DriveApp.getAs() erfolgreich: " + exportName);
      return blob;
    } catch (e1) {
      console.warn("?? DriveApp.getAs() fehlgeschlagen, versuche UrlFetchApp Fallback: " + e1.message);
    }

    // Fallback: UrlFetchApp + Drive v3 REST
    try {
      var url   = "https://www.googleapis.com/drive/v3/files/" + id
                + "/export?mimeType=" + encodeURIComponent(setting.exportMime);
      var oauthToken = ScriptApp.getOAuthToken();

      var resp = UrlFetchApp.fetch(url, {
        headers: { Authorization: "Bearer " + oauthToken },
        muteHttpExceptions: true
      });

      if (resp.getResponseCode() !== 200) {
        throw new Error("HTTP " + resp.getResponseCode() + ": " + resp.getContentText().substring(0, 200));
      }

      var fallbackBlob = resp.getBlob();
      fallbackBlob.setName(exportName);
      console.log("? Export via UrlFetchApp Fallback erfolgreich: " + exportName);
      return fallbackBlob;

    } catch (e2) {
      var fileType = mime.indexOf("spreadsheet") !== -1 ? "Google Sheets"
                   : mime.indexOf("document")    !== -1 ? "Google Docs"
                   : "Google Pr?sentation";

      throw new Error(
        "Die Datei \"" + name + "\" ist ein " + fileType + "-Dokument und konnte nicht " +
        "zu " + setting.ext + " konvertiert werden.\n\n" +
        "L?sung: Lade die Datei in Google Drive als " + setting.ext + " herunter " +
        "(Datei ? Herunterladen ? " + setting.ext.toUpperCase().replace(".", "") + ") " +
        "und lade diese lokale Datei dann per 'PC Upload' hoch.\n\n" +
        "Technischer Fehler: " + e2.message
      );
    }
  }

  // ?? 3) Echte Office-/sonstige Dateien direkt zur?ckgeben ??
  // .xlsx, .docx, .pptx, .idml, .txt etc. brauchen keinen Export
  var directBlob = driveFile.getBlob();
  directBlob.setName(name);
  console.log("? Direkt-Blob (kein Export n?tig): " + name + " [" + mime + "]");
  return directBlob;
}