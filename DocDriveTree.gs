/**
 * DocDriveTree.gs
 * Findet den Projektordner unter dem konfigurierten Root und baut eine
 * read-only Baumstruktur (Sprachunterordner + XML-Dateien) - gemeinsam
 * genutzt von Import (Quelldateien) und Export (Zielort).
 *
 * Ordner-Zugriff l?uft ?ber zwei Wege:
 *  - per ID (apiGetDocDriveTreeById): das Frontend w?hlt den Ordner ?ber die
 *    Such-Dropdown (apiSearchDocDriveFolders) aus und referenziert ihn danach
 *    ausschlie?lich ?ber seine eindeutige Drive-ID. Das ist robust auch wenn
 *    sp?ter ein NEUER Ordner mit demselben Namen angelegt wird (z.B. dasselbe
 *    Projekt Monate sp?ter erneut).
 *  - per exaktem Namens-Match (docDriveFindProjectFolder_ / apiGetDocDriveTree):
 *    bleibt als Fallback/Kompatibilit?t erhalten (z.B. f?r Export, der bereits
 *    einen bekannten Projektnamen hat).
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

/**
 * Wie apiGetDocDriveTree, aber per eindeutiger Ordner-ID statt Namens-Match.
 * Wird vom neuen Such-Dropdown im Doc-Import-Formular genutzt.
 */
function apiGetDocDriveTreeById(folderId) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    if (!folderId) return { success: false, error: "Keine Ordner-ID ?bergeben." };
    var folder = DriveApp.getFolderById(folderId);
    var tree = docDriveBuildTree_(folder);
    return { success: true, found: true, tree: tree };
  } catch (e) {
    return { success: false, error: "Ordner nicht zugreifbar: " + (e.message || String(e)) };
  }
}

/**
 * Durchsucht die direkten Unterordner des konfigurierten Root-Ordners per
 * Namens-Teilstring (case-insensitive), f?r die Such-Dropdown im Frontend.
 * Nutzt die Drive-API v2 (in appsscript.json aktiviert) statt alle Unterordner
 * client-seitig zu iterieren, damit auch bei vielen Projektordnern schnell
 * gefiltert werden kann.
 */
function apiSearchDocDriveFolders(query) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var root = docDriveGetRootFolder_();
    var q = "'" + root.getId() + "' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
    var term = String(query || "").trim();
    if (term) {
      var escaped = term.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      q += " and title contains '" + escaped + "'";
    }
    var res = Drive.Files.list({ q: q, maxResults: 50, fields: "items(id,title,createdDate)" });
    var items = (res.items || []).map(function(f) {
      return { id: f.id, name: f.title, createdDate: f.createdDate };
    });
    items.sort(function(a, b) { return a.name.localeCompare(b.name); });
    return { success: true, folders: items };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}