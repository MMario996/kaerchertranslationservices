/**
 * DocDriveTree.gs
 * Findet den Projektordner unter dem konfigurierten Root (exakter Name-Match)
 * und baut eine read-only Baumstruktur (Sprachunterordner + XML-Dateien) ?
 * gemeinsam genutzt von Import (Quelldateien) und Export (Zielort).
 */
var DOC_DRIVE_LANG_FOLDER_RE_ = /^[a-zA-Z]{2,3}-[a-zA-Z]{2,4}$/;
var DOC_DRIVE_IGNORE_EXT_ = [".dtd", ".dst", ".sdlftsettings"];

function docDriveFindProjectFolder_(projectName) {
  var name = String(projectName || "").trim();
  if (!name) return null;
  var root = docDriveGetRootFolder_();
  var it = root.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return null;
}

function docDriveShouldIgnoreFile_(fileName) {
  var lower = String(fileName || "").toLowerCase();
  return DOC_DRIVE_IGNORE_EXT_.some(function(ext) { return lower.endsWith(ext); });
}

function docDriveBuildTree_(projectFolder) {
  var langFolders = [];
  var subFolders = projectFolder.getFolders();
  while (subFolders.hasNext()) {
    var sub = subFolders.next();
    var folderName = sub.getName();
    if (!DOC_DRIVE_LANG_FOLDER_RE_.test(folderName)) continue;

    var xmlFileId = null, xmlFileName = null;
    var fileIt = sub.getFiles();
    while (fileIt.hasNext()) {
      var f = fileIt.next();
      var fName = f.getName();
      if (docDriveShouldIgnoreFile_(fName)) continue;
      // Bevorzugt eine echte .xml-Datei; falls keine gefunden, erste nicht-ignorierte Datei nehmen
      if (fName.toLowerCase().endsWith(".xml")) {
        xmlFileId = f.getId();
        xmlFileName = fName;
        break;
      }
      if (!xmlFileId) {
        xmlFileId = f.getId();
        xmlFileName = fName;
      }
    }

    langFolders.push({
      lang: folderName,
      folderId: sub.getId(),
      xmlFileId: xmlFileId,
      xmlFileName: xmlFileName
    });
  }
  langFolders.sort(function(a, b) { return a.lang.localeCompare(b.lang); });
  return {
    folderId: projectFolder.getId(),
    folderUrl: projectFolder.getUrl(),
    langFolders: langFolders
  };
}

function apiGetDocDriveTree(projectName) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var folder = docDriveFindProjectFolder_(projectName);
    if (!folder) return { success: true, found: false };
    var tree = docDriveBuildTree_(folder);
    return { success: true, found: true, tree: tree };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}