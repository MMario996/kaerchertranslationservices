/**
 * Orchestration.gs
 *
 * Verbindet das Patchen der Rise-Kursdaten (ScormCourse.gs / RisePatcher.gs) mit dem
 * Live-Deploy nach Firebase Hosting (FirebaseHostingDeploy.gs) - ohne
 * Umweg ueber eine heruntergeladene ZIP.
 */

/**
 * @param {string} scormZipFileId  Drive-Datei-ID des Original-SCORM-ZIPs
 * @param {Array}  patches         [{scopeId, path, text}, ...]
 * @param {string} siteId          Firebase-Hosting-Site-ID
 * @param {string} [pathPrefix]    z.B. "growth-mindset-deutsch", damit
 *                                 mehrere Kurse auf derselben Site
 *                                 nebeneinander existieren
 * @return {Object} {liveUrl, applied, unmatched, uploadedFileCount, totalFileCount}
 */
function patchAndDeployScormToFirebase(scormZipFileId, patches, siteId, pathPrefix) {
  var zipFile = DriveApp.getFileById(scormZipFileId);
  var blobs = Utilities.unzip(zipFile.getBlob());

  // Pfade aus den ZIP-Blob-Namen; Erkennung + Patch wie beim Ordner-Weg (ScormCourse.gs)
  var prep = scormPrepareDeploy_(blobs.map(function (blob) { return { path: blob.getName(), blob: blob }; }), patches);
  var deployResult = deployBlobsToFirebaseHosting(siteId, prep.entries, pathPrefix, prep.entryHtml);
  var patchResult = { applied: prep.applied, unmatched: prep.unmatched };

  return {
    liveUrl: deployResult.liveUrl,
    applied: patchResult.applied,
    unmatched: patchResult.unmatched,
    uploadedFileCount: deployResult.uploadedFileCount,
    totalFileCount: deployResult.totalFileCount,
  };
}

/**
 * Wie patchAndDeployScormToFirebase(), aber liest aus einem bereits
 * ENTPACKTEN, nach Drive hochgeladenen Ordner statt aus einer ZIP-Datei.
 * Umgeht damit das ~50MB-Gesamtgroessenlimit von Utilities.unzip() -
 * empfohlener Weg fuer Kurse mit Videos/vielen Assets.
 *
 * @param {string} scormFolderId  Drive-ORDNER-ID (nicht Datei-ID!) des
 *                                entpackten SCORM-Exports (enthaelt direkt
 *                                scormcontent/, scormdriver/ etc.)
 */
function patchAndDeployScormFolderToFirebase(scormFolderId, patches, siteId, pathPrefix, filterOptions) {
  Logger.log("Lese Ordner-Struktur aus Drive...");
  var folder = DriveApp.getFolderById(scormFolderId);
  var allEntries = collectFileEntriesRecursive_(folder, "");
  Logger.log(allEntries.length + " Dateien im Ordner gefunden.");

  var filterResult = filterFileEntriesForPreview_(allEntries, filterOptions);
  var fileEntries = filterResult.kept;
  Logger.log(fileEntries.length + " Dateien werden deployt (nach Filter).");

  if (filterResult.skipped.length > 0) {
    var totalSkippedMb = filterResult.skipped.reduce(function (sum, s) {
      return sum + s.sizeBytes;
    }, 0) / (1024 * 1024);
    Logger.log(
      "Uebersprungen (" +
        filterResult.skipped.length +
        " Dateien, " +
        totalSkippedMb.toFixed(1) +
        " MB gesamt): " +
        filterResult.skipped
          .map(function (s) {
            return s.path + " (" + s.reason + ")";
          })
          .join(", ")
    );
  }

  var prep = scormPrepareDeploy_(fileEntries, patches);
  var deployResult = deployBlobsToFirebaseHosting(siteId, prep.entries, pathPrefix, prep.entryHtml);
  var patchResult = { applied: prep.applied, unmatched: prep.unmatched };

  return {
    liveUrl: deployResult.liveUrl,
    applied: patchResult.applied,
    unmatched: patchResult.unmatched,
    uploadedFileCount: deployResult.uploadedFileCount,
    totalFileCount: deployResult.totalFileCount,
    skippedFiles: filterResult.skipped,
  };
}
