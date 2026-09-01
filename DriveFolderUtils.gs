/**
 * DriveFolderUtils.gs
 *
 * Liest einen manuell nach Drive hochgeladenen, bereits entpackten
 * SCORM-Ordner rekursiv ein. Umgeht damit das ~50MB-Limit von
 * Utilities.unzip()/zip() (das auf dem GESAMTEN entpackten Inhalt liegt,
 * nicht pro Datei) - jede einzelne Datei wird separat als Blob gelesen.
 *
 * Erwartete Ordnerstruktur (= das, was beim Entpacken der Original-ZIP
 * entsteht): der uebergebene Ordner enthaelt direkt "scormcontent/",
 * "scormdriver/" etc.
 */

/**
 * @param {Folder} folder         Drive-Ordner (Startpunkt)
 * @param {string} [relativePath] intern fuer Rekursion, nicht von aussen
 *                                setzen
 * @return {Array} [{path, blob}, ...] - path ist der volle relative Pfad
 *                 ab dem Startordner, z.B. "scormcontent/index.html"
 */
/**
 * Filtert eine Liste von {path, blob}-Eintraegen: laesst Videos (per
 * Dateiendung) sowie generell zu grosse Einzeldateien weg. Fuer eine
 * schnelle, "ungefaehr erkennbare" Live-Preview reicht das voellig -
 * Rise legt fuer jedes Video ohnehin ein eigenes Standbild (Poster-JPG)
 * ab, das unabhaengig vom eigentlichen <video>-Element angezeigt wird,
 * also auch ohne die .mp4-Datei sichtbar bleibt.
 *
 * @param {Array}  fileEntries        [{path, blob}, ...]
 * @param {Object} [options]
 * @param {Array}  [options.excludeExtensions] Default: Video-Formate
 * @param {number} [options.maxFileSizeBytes]  Default: 15 MB - alles
 *                 Groessere wird uebersprungen, unabhaengig vom Typ
 * @return {Object} {kept, skipped} - skipped enthaelt {path, sizeBytes, reason}
 */
function filterFileEntriesForPreview_(fileEntries, options) {
  options = options || {};
  var excludeExtensions = options.excludeExtensions || [
    ".mp4",
    ".mov",
    ".webm",
    ".avi",
    ".m4v",
  ];
  var maxFileSizeBytes = options.maxFileSizeBytes || 15 * 1024 * 1024;

  var kept = [];
  var skipped = [];

  fileEntries.forEach(function (entry) {
    var lowerPath = entry.path.toLowerCase();
    var hasExcludedExt = excludeExtensions.some(function (ext) {
      return lowerPath.substr(-ext.length) === ext;
    });
    var sizeBytes = entry.blob.getBytes().length;

    if (hasExcludedExt) {
      skipped.push({ path: entry.path, sizeBytes: sizeBytes, reason: "video" });
    } else if (sizeBytes > maxFileSizeBytes) {
      skipped.push({ path: entry.path, sizeBytes: sizeBytes, reason: "zu gross" });
    } else {
      kept.push(entry);
    }
  });

  return { kept: kept, skipped: skipped };
}

function collectFileEntriesRecursive_(folder, relativePath) {
  relativePath = relativePath || "";
  var entries = [];

  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var path = relativePath ? relativePath + "/" + file.getName() : file.getName();
    entries.push({ path: path, blob: file.getBlob(), driveFile: file });
  }

  var subFolders = folder.getFolders();
  while (subFolders.hasNext()) {
    var subFolder = subFolders.next();
    var subPath = relativePath
      ? relativePath + "/" + subFolder.getName()
      : subFolder.getName();
    entries = entries.concat(collectFileEntriesRecursive_(subFolder, subPath));
  }

  return entries;
}

/**
 * Findet den Eintrag fuer runtime-data.js innerhalb einer Liste von
 * {path, blob}-Eintraegen (siehe collectFileEntriesRecursive_).
 */
function findRuntimeDataEntry_(fileEntries) {
  for (var i = 0; i < fileEntries.length; i++) {
    if (fileEntries[i].path.indexOf("runtime-data.js") !== -1) {
      return { index: i, entry: fileEntries[i] };
    }
  }
  throw new Error(
    "Konnte runtime-data.js im Ordner nicht finden. Ist das wirklich " +
      "der entpackte Rise-SCORM-Export (mit scormcontent/-Unterordner)?"
  );
}
