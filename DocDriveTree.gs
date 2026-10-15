/**
 * DocDriveTree.gs
 * Findet den Projektordner unter dem konfigurierten Root und baut eine
 * read-only Baumstruktur (Sprachunterordner + XML-Dateien) - gemeinsam
 * genutzt von Import (Quelldateien) und Export (Zielort).
 *
 * Ablagestruktur: Root / <Auftrag, z.B. AW19869> / <Projekt> / <Sprache>.
 * Die alte flache Struktur Root / <Projekt> / <Sprache> wird weiter erkannt.
 *
 * Ordner-Zugriff läuft über zwei Wege:
 *  - per ID (apiGetDocDriveTreeById): das Frontend wählt den Ordner über die
 *    Such-Dropdown (apiSearchDocDriveFolders) aus und referenziert ihn danach
 *    ausschließlich über seine eindeutige Drive-ID. Das ist robust auch wenn
 *    später ein NEUER Ordner mit demselben Namen angelegt wird (z.B. dasselbe
 *    Projekt Monate später erneut).
 *  - per exaktem Namens-Match (docDriveFindProjectFolder_ / apiGetDocDriveTree):
 *    bleibt als Fallback/Kompatibilität erhalten (z.B. für Export, der bereits
 *    einen bekannten Projektnamen hat).
 */
var DOC_DRIVE_LANG_FOLDER_RE_ = /^[a-zA-Z]{2,3}-[a-zA-Z]{2,4}$/;
var DOC_DRIVE_IGNORE_EXT_ = [".dtd", ".dst", ".sdlftsettings"];

function docDriveFindProjectFolder_(projectName) {
  var name = String(projectName || "").trim();
  if (!name) return null;
  var root = docDriveGetRootFolder_();
  // Alte flache Struktur: Root/<Projekt>/<Sprache>
  var it = root.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  // Neue Struktur: Root/<Auftrag, z.B. AW19869>/<Projekt>/<Sprache>. Der
  // Projektname ist "<Projekt>" oder "<Auftrag> <Projekt>" (so befüllt der
  // Doc-Import das Namensfeld vor).
  var orders = root.getFolders();
  while (orders.hasNext()) {
    var order = orders.next();
    var prefix = order.getName() + " ";
    var sub = name.indexOf(prefix) === 0 ? name.slice(prefix.length).trim() : name;
    var hit = order.getFoldersByName(sub);
    if (hit.hasNext()) return hit.next();
  }
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
    if (!folderId) return { success: false, error: "Keine Ordner-ID übergeben." };
    var folder = DriveApp.getFolderById(folderId);
    var tree = docDriveBuildTree_(folder);
    return { success: true, found: true, tree: tree };
  } catch (e) {
    return { success: false, error: "Ordner nicht zugreifbar: " + (e.message || String(e)) };
  }
}

/**
 * Listet Drive-Ordner per Query (Drive-API v2), alle Seiten bis maxItems.
 */
function docDriveListFolders_(q, maxItems) {
  var out = [], token = null;
  do {
    var res = Drive.Files.list({ q: q, maxResults: 200, pageToken: token || undefined,
      supportsAllDrives: true, includeItemsFromAllDrives: true,
      fields: "nextPageToken,items(id,title,createdDate,parents(id))" });
    (res.items || []).forEach(function(f) { out.push(f); });
    token = res.nextPageToken;
  } while (token && out.length < maxItems);
  return out;
}

var DOC_DRIVE_FOLDER_MIME_Q_ = "mimeType = 'application/vnd.google-apps.folder' and trashed = false";
var DOC_DRIVE_SEARCH_LIMIT_ = 100;

/**
 * Durchsucht die Projektordner unter dem konfigurierten Root per
 * Namens-Teilstring (case-insensitive), für die Such-Dropdown im Frontend.
 *
 * Ablagestruktur:
 *   Root (TranslationPool_new) / <Auftrag, z.B. AW19869> / <Projekt, z.B. BTA PCL 6> / <Sprache, z.B. en-GB>
 * Projekte liegen also auf Ebene 2; angezeigt werden sie als
 * "AW19869 / BTA PCL 6". Der Suchbegriff trifft Auftrags- oder Projektnamen.
 * Liegen Sprachordner direkt in einem Ordner der Ebene 1 (alte, flache
 * Struktur Root/<Projekt>/<Sprache>), wird dieser Ordner selbst als Projekt
 * gelistet.
 * Nutzt die Drive-API v2 (in appsscript.json aktiviert), damit auch bei vielen
 * Ordnern serverseitig gefiltert wird.
 */
function apiSearchDocDriveFolders(query) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };
  try {
    var root = docDriveGetRootFolder_();
    var term = String(query || "").trim();
    var termLower = term.toLowerCase();

    var orders = docDriveListFolders_("'" + root.getId() + "' in parents and " + DOC_DRIVE_FOLDER_MIME_Q_, 5000);
    var orderById = {};
    orders.forEach(function(o) { orderById[o.id] = o; });

    // Unterordner der Auftragsordner in Blöcken abfragen (Query-Länge begrenzt)
    var subs = [];
    var CHUNK = 40;
    for (var i = 0; i < orders.length; i += CHUNK) {
      var parentQ = orders.slice(i, i + CHUNK).map(function(o) { return "'" + o.id + "' in parents"; }).join(" or ");
      subs = subs.concat(docDriveListFolders_("(" + parentQ + ") and " + DOC_DRIVE_FOLDER_MIME_Q_, 5000));
    }

    var items = [], seen = {};
    function add(f, orderName) {
      if (seen[f.id]) return;
      var label = orderName ? orderName + " / " + f.title : f.title;
      if (termLower && label.toLowerCase().indexOf(termLower) === -1) return;
      seen[f.id] = true;
      items.push({ id: f.id, name: label, projectName: f.title, orderName: orderName || "", createdDate: f.createdDate });
    }
    subs.forEach(function(f) {
      var parentId = (f.parents || []).map(function(p) { return p.id; }).filter(function(id) { return orderById[id]; })[0];
      var order = orderById[parentId];
      if (!order) return;
      if (DOC_DRIVE_LANG_FOLDER_RE_.test(f.title)) add(order, "");   // alte flache Struktur
      else add(f, order.title);
    });

    // Neueste zuerst, damit ohne Suchbegriff die aktuellen Projekte oben stehen
    items.sort(function(a, b) {
      return String(b.createdDate || "").localeCompare(String(a.createdDate || "")) || a.name.localeCompare(b.name);
    });
    return { success: true, folders: items.slice(0, DOC_DRIVE_SEARCH_LIMIT_) };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}
