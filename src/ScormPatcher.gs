/**
 * ScormPatcher.gs
 *
 * Nimmt ein SCORM-ZIP (Rise-Export), das als Datei in Drive liegt, patcht
 * darin runtime-data.js mit aktuellen Uebersetzungen und speichert das
 * Ergebnis wieder als ZIP in Drive - bei erneuten Laeufen unter DERSELBEN
 * Datei-ID (also demselben Link), sofern man eine outputFileId mitgibt.
 *
 * Wichtig: fuer das Ueberschreiben unter gleicher Datei-ID wird der
 * Advanced Drive Service benoetigt (Drive.Files.update). Im Editor unter
 * "Dienste" (+) -> "Drive API" hinzufuegen, bevor generatePatchedScormZip()
 * mit outputFileId aufgerufen wird. Ohne Advanced Service faellt der Code
 * automatisch auf "neue Datei anlegen" zurueck (Link aendert sich dann bei
 * jedem Lauf).
 */

/**
 * Sucht innerhalb der entpackten Blobs die runtime-data.js-Datei.
 * Gibt {index, blob} zurueck oder wirft einen Fehler.
 */
function findRuntimeDataBlob_(blobs) {
  for (var i = 0; i < blobs.length; i++) {
    if (blobs[i].getName().indexOf("runtime-data.js") !== -1) {
      return { index: i, blob: blobs[i] };
    }
  }
  throw new Error(
    "Konnte runtime-data.js im ZIP nicht finden. Ist das wirklich ein " +
      "Rise-SCORM-Export (Ordnerstruktur scormcontent/...)?"
  );
}

/**
 * Legt einen Blob entweder als NEUE Drive-Datei an, oder aktualisiert
 * (bei vorhandener Advanced Drive Service Berechtigung) den Inhalt einer
 * bestehenden Datei unter gleichbleibender ID/Link.
 */
function saveOrUpdateDriveFile_(blob, existingFileId, targetFolder) {
  if (existingFileId) {
    try {
      // Advanced Drive Service (v3): Inhalt einer bestehenden Datei
      // ersetzen, Datei-ID und Link bleiben unveraendert.
      Drive.Files.update({}, existingFileId, blob);
      return DriveApp.getFileById(existingFileId);
    } catch (e) {
      Logger.log(
        "Konnte bestehende Datei nicht aktualisieren (" +
          e +
          "), lege stattdessen neue Datei an. " +
          "Falls das ungewollt ist: Advanced Drive Service im Editor " +
          "aktivieren (Dienste -> Drive API)."
      );
    }
  }
  var folder = targetFolder || DriveApp.getRootFolder();
  return folder.createFile(blob);
}

/**
 * Hauptfunktion.
 *
 * @param {string} scormZipFileId  Drive-Datei-ID des Original-SCORM-ZIPs
 * @param {Array}  patches         [{scopeId, path, text}, ...]
 * @param {Object} [options]
 * @param {string} [options.outputFileId]     bestehende Datei-ID zum
 *                                             Ueberschreiben (fuer stabilen
 *                                             Link ueber mehrere Laeufe)
 * @param {string} [options.outputFolderId]   Ziel-Ordner, falls keine
 *                                             outputFileId angegeben ist
 * @param {string} [options.outputFileName]   Dateiname der neuen ZIP
 *
 * @return {Object} {fileId, fileUrl, downloadUrl, applied, unmatched}
 */
function generatePatchedScormZip(scormZipFileId, patches, options) {
  options = options || {};

  var zipFile = DriveApp.getFileById(scormZipFileId);
  var blobs = Utilities.unzip(zipFile.getBlob());

  var found = findRuntimeDataBlob_(blobs);
  var originalName = found.blob.getName();
  var jsText = found.blob.getDataAsString("UTF-8");

  var patchResult = patchRuntimeDataJs_(jsText, patches);

  // Gleicher Dateiname/Pfad innerhalb des ZIPs, nur Inhalt ersetzt.
  var patchedBlob = Utilities.newBlob(
    patchResult.patchedJs,
    "application/javascript",
    originalName
  );
  blobs[found.index] = patchedBlob;

  var outputZipName =
    options.outputFileName ||
    zipFile.getName().replace(/\.zip$/i, "") + "_patched.zip";
  var newZipBlob = Utilities.zip(blobs, outputZipName);

  var targetFolder = null;
  if (options.outputFolderId) {
    targetFolder = DriveApp.getFolderById(options.outputFolderId);
  } else {
    var parents = zipFile.getParents();
    targetFolder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  }

  var outputFile = saveOrUpdateDriveFile_(
    newZipBlob,
    options.outputFileId,
    targetFolder
  );

  return {
    fileId: outputFile.getId(),
    fileUrl: outputFile.getUrl(),
    downloadUrl:
      "https://drive.google.com/uc?export=download&id=" + outputFile.getId(),
    applied: patchResult.applied,
    unmatched: patchResult.unmatched,
  };
}
