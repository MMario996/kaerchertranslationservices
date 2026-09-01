/**
 * DocDriveConfig.gs
 * Admin-konfigurierbarer Root-Ordner in Google Drive f?r Documentation
 * Import/Export. Nicht-Admins sehen keine Ordner-Auswahl-UI ? die App findet
 * automatisch den Unterordner, dessen Name exakt dem Projektnamen entspricht.
 */
var DOC_DRIVE_ROOT_PROP_ = "DOC_DRIVE_ROOT_FOLDER_ID";

function docDriveExtractFolderId_(idOrUrl) {
  var s = String(idOrUrl || "").trim();
  if (!s) return "";
  var m = s.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{10,}$/.test(s)) return s;
  return "";
}

function apiGetDocDriveRootSettings() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var id = PropertiesService.getScriptProperties().getProperty(DOC_DRIVE_ROOT_PROP_) || "";
  var name = "";
  if (id) {
    try { name = DriveApp.getFolderById(id).getName(); } catch (e) { name = "?? Ordner nicht gefunden/zugreifbar"; }
  }
  return { success: true, folderId: id, folderName: name };
}

function apiSaveDocDriveRootSettings(idOrUrl) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  var id = docDriveExtractFolderId_(idOrUrl);
  if (!id) return { success: false, error: "Ung?ltige Ordner-ID oder -URL." };
  try {
    var folder = DriveApp.getFolderById(id);
    PropertiesService.getScriptProperties().setProperty(DOC_DRIVE_ROOT_PROP_, id);
    logAuditEvent_(caller, "DOC_DRIVE_ROOT_EDIT", "Set Documentation Drive root to: " + folder.getName() + " (" + id + ")");
    return { success: true, folderName: folder.getName() };
  } catch (e) {
    return { success: false, error: "Ordner nicht zugreifbar: " + e.message };
  }
}

function docDriveGetRootFolder_() {
  var id = PropertiesService.getScriptProperties().getProperty(DOC_DRIVE_ROOT_PROP_) || "";
  if (!id) throw new Error("Kein Documentation-Drive-Root konfiguriert. Bitte Admin kontaktieren.");
  return DriveApp.getFolderById(id);
}