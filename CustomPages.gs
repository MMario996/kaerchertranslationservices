/**
 * CustomPages.gs
 *
 * Admin-verwaltete zusaetzliche Reiter (Tabs) - ganz ohne Code-Deploy anlegbar:
 * Name, ein Baukasten aus optionalen Formular-Bausteinen, und eine eigene
 * Whitelist. Persistiert im Sheet "CustomPages" (Access-Spreadsheet).
 *
 * WICHTIG: Es wird KEIN Code generiert. Jeder Reiter nutzt dasselbe generische
 * Anfrageformular (Template/Quellsprache/Zielsprache/Projektname/Hauptdateien
 * sind immer Pflicht, da ohne die kein Phrase-Projekt entstehen kann) - der
 * "Baukasten" speichert nur, welche der optionalen Bausteine (Vorlagen,
 * Wunschtermin, Notiz, Referenzdateien) fuer diesen Reiter sichtbar sein
 * sollen. Der bestehende Renderer (initForm()/renderFormFromTemplate() in
 * Index.html) blendet den Rest anhand dieser Konfiguration zur Laufzeit aus.
 *
 * Die Sichtbarkeit je Reiter laeuft ueber dasselbe Muster wie Marketing/KeC/Doc/...:
 * ein eigenes Sheet "Whitelist_<ID>" (siehe getDynamicWhitelist_ in WebApp.gs),
 * das getConfig_() bereits konsumiert (config.customPages).
 *
 * Berechtigung: volle Admins ODER Admin-Light-User mit Subtab "custompages"
 * (siehe AdminLight.gs) duerfen Reiter anlegen/verwalten.
 */
const CUSTOM_PAGES_SHEET_NAME = "CustomPages";
const RESERVED_PAGE_IDS_ = [
  "request", "marketing", "woma", "cc", "kec", "documentation", "articulate",
  "history", "dashboard", "admin", "health", "guide", "help"
];
const CUSTOM_PAGE_FIELD_KEYS_ = ["presets", "dueDate", "note", "refFiles"];
const CUSTOM_PAGE_DEFAULT_FIELDS_ = { presets: true, dueDate: true, note: true, refFiles: true };

function normalizePageId_(raw) {
  return String(raw || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canManageCustomPages_(email) {
  return isAdmin_(email) || isAdminLightWithAccess_(email, "custompages");
}

/** Nur bekannte Feld-Keys, als bool - unbekannte Keys werden verworfen, fehlende bleiben Default (an). */
function sanitizeCustomPageFields_(fields) {
  const out = {};
  CUSTOM_PAGE_FIELD_KEYS_.forEach(k => {
    out[k] = (fields && typeof fields === "object" && k in fields) ? !!fields[k] : CUSTOM_PAGE_DEFAULT_FIELDS_[k];
  });
  return out;
}

function getCustomPagesSheet_() {
  const ss = SpreadsheetApp.openById(getAccessSheetId_());
  let sh = ss.getSheetByName(CUSTOM_PAGES_SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(CUSTOM_PAGES_SHEET_NAME);
    sh.appendRow(["ID", "Name", "Active (yes/no)", "Created", "Fields (JSON)"]);
  }
  return sh;
}

function readCustomPagesRows_() {
  const sh = getCustomPagesSheet_();
  const data = sh.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const id = String(data[i][0] || "").trim();
    if (!id) continue;
    let fields = CUSTOM_PAGE_DEFAULT_FIELDS_;
    const rawFields = String(data[i][4] || "").trim();
    if (rawFields) {
      try { fields = sanitizeCustomPageFields_(JSON.parse(rawFields)); } catch (e) { /* Default beibehalten */ }
    }
    rows.push({
      rowIndex: i + 1,
      id: id,
      name: String(data[i][1] || "").trim() || id,
      active: String(data[i][2] || "").trim().toLowerCase() !== "no",
      fields: fields
    });
  }
  return rows;
}

function findCustomPageRow_(id) {
  const cleanId = String(id || "").trim();
  return readCustomPagesRows_().find(p => p.id === cleanId);
}

/**
 * Wird von getConfig_() fuer JEDEN eingeloggten User aufgerufen (nicht nur
 * Admins) - deshalb bewusst ohne Admin-Check, liefert aber nur aktive Seiten.
 */
function apiGetCustomPages() {
  return readCustomPagesRows_()
    .filter(p => p.active)
    .map(p => ({ id: p.id, name: p.name, fields: p.fields }));
}

function apiAdminListCustomPages() {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) return { success: false, error: "Not authorized. Admin only." };
  const pages = readCustomPagesRows_().map(p => ({
    id: p.id,
    name: p.name,
    active: p.active,
    fields: p.fields,
    userCount: getDynamicWhitelist_(p.id).length
  }));
  return { success: true, pages: pages };
}

function apiAdminCreateCustomPage(name, idHint, fields) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");

  const cleanName = String(name || "").trim();
  if (!cleanName) throw new Error("Bitte einen Namen fuer den Reiter angeben.");

  const id = normalizePageId_(idHint || cleanName);
  if (!id) throw new Error("Ungueltige ID - bitte einen Namen mit Buchstaben oder Zahlen verwenden.");
  if (RESERVED_PAGE_IDS_.indexOf(id) !== -1) {
    throw new Error('"' + id + '" ist ein reservierter Reiter-Name und kann nicht verwendet werden.');
  }
  if (findCustomPageRow_(id)) {
    throw new Error('Ein Reiter mit der ID "' + id + '" existiert bereits.');
  }

  const cleanFields = sanitizeCustomPageFields_(fields);
  const sh = getCustomPagesSheet_();
  sh.appendRow([id, cleanName, "yes", new Date().toISOString(), JSON.stringify(cleanFields)]);

  // Whitelist-Sheet sofort anlegen, damit Admins direkt danach Nutzer eintragen
  // koennen, ohne dass getDynamicWhitelist_ zuvor "Sheet nicht gefunden" liefert.
  const ss = SpreadsheetApp.openById(getAccessSheetId_());
  if (!ss.getSheetByName("Whitelist_" + id)) {
    ss.insertSheet("Whitelist_" + id).appendRow(["Email"]);
  }

  logAuditEvent_(caller, "CUSTOM_PAGE_CREATE", id + ' ("' + cleanName + '") fields=' + JSON.stringify(cleanFields));
  return { success: true, id: id, name: cleanName, fields: cleanFields };
}

function apiAdminRenameCustomPage(id, newName) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");
  const cleanName = String(newName || "").trim();
  if (!cleanName) throw new Error("Name darf nicht leer sein.");

  const row = findCustomPageRow_(id);
  if (!row) throw new Error("Reiter nicht gefunden.");
  getCustomPagesSheet_().getRange(row.rowIndex, 2).setValue(cleanName);
  logAuditEvent_(caller, "CUSTOM_PAGE_RENAME", row.id + ' -> "' + cleanName + '"');
  return { success: true };
}

function apiAdminUpdateCustomPageFields(id, fields) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");

  const row = findCustomPageRow_(id);
  if (!row) throw new Error("Reiter nicht gefunden.");
  const cleanFields = sanitizeCustomPageFields_(fields);
  getCustomPagesSheet_().getRange(row.rowIndex, 5).setValue(JSON.stringify(cleanFields));
  logAuditEvent_(caller, "CUSTOM_PAGE_FIELDS", row.id + " -> " + JSON.stringify(cleanFields));
  return { success: true, fields: cleanFields };
}

function apiAdminSetCustomPageActive(id, active) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");

  const row = findCustomPageRow_(id);
  if (!row) throw new Error("Reiter nicht gefunden.");
  getCustomPagesSheet_().getRange(row.rowIndex, 3).setValue(active ? "yes" : "no");
  logAuditEvent_(caller, "CUSTOM_PAGE_ACTIVE", row.id + " -> " + (active ? "yes" : "no"));
  return { success: true };
}

function apiAdminDeleteCustomPage(id) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");

  const row = findCustomPageRow_(id);
  if (!row) throw new Error("Reiter nicht gefunden.");
  getCustomPagesSheet_().deleteRow(row.rowIndex);
  logAuditEvent_(caller, "CUSTOM_PAGE_DELETE", row.id);
  // Whitelist-Sheet bewusst NICHT loeschen: wird der Reiter spaeter mit
  // derselben ID neu angelegt, bleiben die bisherigen Nutzer erhalten.
  return { success: true };
}

function apiGetCustomPageWhitelist(id) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) return { emails: [] };
  return { emails: getDynamicWhitelist_(String(id || "").trim()) };
}

function apiAddCustomPageWhitelist(id, email) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");
  const cleanId = String(id || "").trim();
  const add = String(email || "").trim().toLowerCase();
  if (!add || add.indexOf("@") === -1) throw new Error("Invalid email.");

  const ss = SpreadsheetApp.openById(getAccessSheetId_());
  const sheetName = "Whitelist_" + cleanId;
  let sh = ss.getSheetByName(sheetName);
  if (!sh) { sh = ss.insertSheet(sheetName); sh.appendRow(["Email"]); }

  const existing = getDynamicWhitelist_(cleanId);
  if (existing.indexOf(add) === -1) sh.appendRow([add]);
  return { emails: getDynamicWhitelist_(cleanId) };
}

function apiRemoveCustomPageWhitelist(id, email) {
  const caller = getUserEmail_();
  if (!canManageCustomPages_(caller)) throw new Error("Not authorized. Admin only.");
  const cleanId = String(id || "").trim();
  const rem = String(email || "").trim().toLowerCase();

  const ss = SpreadsheetApp.openById(getAccessSheetId_());
  const sh = ss.getSheetByName("Whitelist_" + cleanId);
  if (!sh) return { emails: [] };
  const rows = sh.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0] || "").trim().toLowerCase() === rem) sh.deleteRow(i + 1);
  }
  return { emails: getDynamicWhitelist_(cleanId) };
}
