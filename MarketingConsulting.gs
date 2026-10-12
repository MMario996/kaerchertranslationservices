/**
 * MarketingConsulting.gs
 * Marketing Projects: "Create Project" ODER "Ask for Consulting".
 *
 * Ask for Consulting: Der Einreicher fuellt das Formular wie gewohnt aus (auch
 * unvollstaendig), schreibt einen Kommentar fuer den Consultant und schickt die
 * Anfrage ab. Es wird KEIN Phrase-Projekt angelegt, sondern:
 *   - Dateien landen in einem Drive-Ordner je Anfrage (Deploy-Konto, Ordner-ID
 *     in Script Property CONSULTING_FOLDER_ID, wird bei Bedarf angelegt),
 *   - eine Zeile im Sheet "Consulting_Requests" (OPS-Sheet) mit Formular-Daten
 *     und Historie,
 *   - alle Consultants (Admin-Light-Bereich "consulting", AdminLight.gs) bekommen
 *     eine Chat-Nachricht, der Einreicher eine Eingangsbestaetigung.
 * Die Abstimmung selbst passiert ausserhalb des Tools. Der Consultant passt die
 * Anfrage danach im Unterreiter "Consulting" an und reicht sie ein: Das Projekt
 * wird im Namen des Einreichers angelegt (Eigentuemer = Einreicher, Queue-Spalte
 * "Created By" = Consultant, Upload.gs createProjectAndUploadAs_).
 *
 * Status: OPEN -> IN_PROGRESS (uebernommen) -> SUBMITTED | CLOSED.
 * Historie: jede Aktion als { at, by, action, text } in der Spalte "History".
 */
var CONSULT_SHEET_NAME_ = "Consulting_Requests";
var CONSULT_HEADERS_ = ["ID", "Created At", "Requester", "Status", "Assignee", "Project Name",
  "Template", "Target Langs", "Payload JSON", "Comment", "History JSON", "Project UIDs", "Updated At", "Folder ID"];
var CONSULT_COL_ = { id: 0, created: 1, requester: 2, status: 3, assignee: 4, name: 5, template: 6,
  targets: 7, payload: 8, comment: 9, history: 10, projects: 11, updated: 12, folder: 13 };
var CONSULT_STATUSES_ = ["OPEN", "IN_PROGRESS", "SUBMITTED", "CLOSED"];

// --- Rollen ---------------------------------------------------------------------

function isMarketingConsultant_(email) {
  var e = String(email || "").trim().toLowerCase();
  if (!e) return false;
  return isAdmin_(e) || isAdminLightWithAccess_(e, "consulting");
}

/** E-Mails aller Consultants (Admin-Light "consulting"); ohne welche: Admins. */
function marketingConsultants_() {
  var out = [];
  try {
    var sh = openAccessSS_().getSheetByName(ADMIN_LIGHT_SHEET_NAME_);
    if (sh) {
      var rows = sh.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        var email = String(rows[i][0] || "").trim().toLowerCase();
        var tabs = String(rows[i][1] || "").toLowerCase().split(",").map(function (s) { return s.trim(); });
        if (email && tabs.indexOf("consulting") >= 0 && out.indexOf(email) < 0) out.push(email);
      }
    }
  } catch (e) { console.warn("marketingConsultants_: " + e.message); }
  if (!out.length) {
    out = String(PropertiesService.getScriptProperties().getProperty("ADMIN_EMAILS") || "")
      .split(",").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
  }
  return out;
}

// --- Reine Helfer (getestet) -------------------------------------------------------

/**
 * Formular-Daten fuer die Ablage: nur bekannte Felder, Dateien ohne Inhalt.
 * files: bereits abgelegte Dateien [{ fileId, name, mimeType, kind: "main"|"ref" }].
 */
function consultNormalizePayload_(p, files) {
  p = p || {};
  var str = function (v, max) { return String(v == null ? "" : v).trim().slice(0, max || 500); };
  var arr = function (v) { return (Array.isArray(v) ? v : []).map(function (x) { return str(x, 40); }).filter(Boolean); };
  var map = {};
  Object.keys(p.targetUidMap || {}).forEach(function (k) {
    var key = str(k, 40), val = str(p.targetUidMap[k], 80);
    if (key && val) map[key] = val;
  });
  var out = {
    templateGroup: str(p.templateGroup, 300),
    templateUid: str(p.templateUid, 80),
    templateName: str(p.templateName, 300),
    targetUidMap: map,
    sourceLang: str(p.sourceLang, 40),
    targetLangs: arr(p.targetLangs),
    pivotTargetLangs: arr(p.pivotTargetLangs),
    projectName: str(p.projectName, 250),
    dueDate: str(p.dueDate || p.dateDue, 40),
    note: str(p.note, 5000),
    files: (Array.isArray(files) ? files : []).map(function (f) {
      return { fileId: str(f.fileId, 120), name: str(f.name, 250), mimeType: str(f.mimeType, 120), kind: f.kind === "ref" ? "ref" : "main" };
    }).filter(function (f) { return f.fileId; })
  };
  if (p.maxSettings && typeof maxTplSanitize_ === "function") out.maxSettings = maxTplSanitize_(p.maxSettings);
  return out;
}

/** Felder, die ein Consultant aendern darf, uebernehmen; Liste der geaenderten Felder. */
function consultApplyPatch_(payload, patch) {
  var next = JSON.parse(JSON.stringify(payload || {}));
  var changed = [];
  if (!patch) return { payload: next, changed: changed };
  var clean = consultNormalizePayload_(Object.assign({}, next, patch), next.files);
  if (Array.isArray(patch.removeFileIds) && patch.removeFileIds.length) {
    clean.files = clean.files.filter(function (f) { return patch.removeFileIds.indexOf(f.fileId) < 0; });
  }
  ["templateGroup", "templateUid", "templateName", "targetUidMap", "sourceLang", "targetLangs", "pivotTargetLangs",
   "projectName", "dueDate", "note", "files", "maxSettings"].forEach(function (k) {
    if (JSON.stringify(clean[k]) !== JSON.stringify(next[k])) changed.push(k);
  });
  return { payload: clean, changed: changed };
}

/** Payload fuer createProjectAndUploadAs_ aus der abgelegten Anfrage. */
function consultBuildUploadPayload_(payload) {
  var p = payload || {};
  var main = (p.files || []).filter(function (f) { return f.kind !== "ref"; });
  var refs = (p.files || []).filter(function (f) { return f.kind === "ref"; });
  var out = {
    portalType: "marketing",
    templateUid: p.templateUid,
    targetUidMap: p.targetUidMap || {},
    templateName: p.templateName || p.templateGroup || "",
    projectName: p.projectName,
    sourceLang: p.sourceLang,
    targetLangs: p.targetLangs || [],
    pivotTargetLangs: p.pivotTargetLangs || [],
    dateDue: p.dueDate || "",
    note: p.note || "",
    mainFiles: main.map(function (f) { return { source: "drive", fileId: f.fileId, fileName: f.name }; }),
    refFiles: [],
    refDriveIds: refs.map(function (f) { return f.fileId; })
  };
  if (p.maxSettings) out.maxSettings = p.maxSettings;
  return out;
}

/** Was fehlt noch zum Einreichen? (leer = vollstaendig) */
function consultMissingFields_(payload) {
  var p = payload || {};
  var missing = [];
  if (!p.templateUid && !Object.keys(p.targetUidMap || {}).length) missing.push("template");
  if (!p.projectName) missing.push("projectName");
  if (!p.sourceLang) missing.push("sourceLang");
  if (!(p.targetLangs || []).length) missing.push("targetLangs");
  if (!(p.files || []).some(function (f) { return f.kind !== "ref"; })) missing.push("mainFiles");
  return missing;
}

/** Historie fuer die Sheet-Zelle (max. 50.000 Zeichen): aelteste Eintraege fallen zuerst weg, der erste bleibt. */
function consultHistoryJson_(history) {
  var h = (history || []).slice();
  var json = JSON.stringify(h);
  while (json.length > 45000 && h.length > 2) { h.splice(1, 1); json = JSON.stringify(h); }
  return json;
}

function consultHistoryEntry_(by, action, text) {
  return { at: new Date().toISOString(), by: String(by || ""), action: action, text: String(text || "").slice(0, 5000) };
}

// --- Ablage ------------------------------------------------------------------------

function consultSheet_() {
  var ss = openOpsSpreadsheet_();
  var sh = ss.getSheetByName(CONSULT_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(CONSULT_SHEET_NAME_);
    sh.appendRow(CONSULT_HEADERS_);
    sh.getRange(1, 1, 1, CONSULT_HEADERS_.length).setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function consultRootFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = String(props.getProperty("CONSULTING_FOLDER_ID") || "").trim();
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { console.warn("CONSULTING_FOLDER_ID: " + e.message); } }
  var folder = DriveApp.createFolder("KTS Marketing Consulting Requests");
  props.setProperty("CONSULTING_FOLDER_ID", folder.getId());
  return folder;
}

/** Dateien aus dem Formular in den Anfrage-Ordner legen (PC: Inhalt, Drive: Kopie). */
function consultStoreFiles_(folder, mainFiles, refFiles, refDriveIds) {
  var stored = [];
  var put = function (f, kind) {
    var blob = resolveFileToBlob_(f);
    var name = blob.getName() || resolveFileMeta_(f).fileName || "file";
    var file = folder.createFile(blob.setName(name));
    stored.push({ fileId: file.getId(), name: name, mimeType: blob.getContentType() || "", kind: kind });
  };
  (mainFiles || []).forEach(function (f) { put(f, "main"); });
  (refFiles || []).forEach(function (f) { put(f, "ref"); });
  (refDriveIds || []).forEach(function (id) { if (id) put({ source: "drive", id: id }, "ref"); });
  return stored;
}

function consultReadAll_() {
  var sh = consultSheet_();
  var data = sh.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!String(r[CONSULT_COL_.id] || "").trim()) continue;
    out.push(consultRowToObj_(r, i + 1));
  }
  return out;
}

function consultRowToObj_(r, rowNum) {
  var parse = function (v, def) { try { return JSON.parse(String(v || "")) || def; } catch (e) { return def; } };
  var iso = function (v) { return v instanceof Date ? v.toISOString() : String(v || ""); };
  return {
    rowNum: rowNum,
    id: String(r[CONSULT_COL_.id]),
    createdAt: iso(r[CONSULT_COL_.created]),
    requester: String(r[CONSULT_COL_.requester] || "").toLowerCase(),
    status: String(r[CONSULT_COL_.status] || "OPEN").toUpperCase(),
    assignee: String(r[CONSULT_COL_.assignee] || "").toLowerCase(),
    projectName: String(r[CONSULT_COL_.name] || ""),
    templateName: String(r[CONSULT_COL_.template] || ""),
    targetLangs: String(r[CONSULT_COL_.targets] || ""),
    payload: parse(r[CONSULT_COL_.payload], {}),
    comment: String(r[CONSULT_COL_.comment] || ""),
    history: parse(r[CONSULT_COL_.history], []),
    projectUids: String(r[CONSULT_COL_.projects] || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean),
    updatedAt: iso(r[CONSULT_COL_.updated]),
    folderId: String(r[CONSULT_COL_.folder] || "")
  };
}

function consultFind_(id) {
  var key = String(id || "").trim();
  if (!key) return null;
  return consultReadAll_().filter(function (r) { return r.id === key; })[0] || null;
}

function consultWrite_(req) {
  var sh = consultSheet_();
  var p = req.payload || {};
  var row = [req.id, req.createdAt ? new Date(req.createdAt) : new Date(), req.requester, req.status, req.assignee,
    p.projectName || "", p.templateName || p.templateGroup || "", (p.targetLangs || []).join(", "),
    JSON.stringify(p), req.comment || "", consultHistoryJson_(req.history), (req.projectUids || []).join(","),
    new Date(), req.folderId || ""];
  if (req.rowNum > 0) sh.getRange(req.rowNum, 1, 1, row.length).setValues([row]);
  else { sh.appendRow(row); req.rowNum = sh.getLastRow(); }
}

/** Darf caller die Anfrage sehen / als Einreicher handeln? */
function consultIsRequesterSide_(req, caller) {
  return req.requester === caller || deputyActsFor_(caller, req.requester);
}

function consultNotify_(email, key, vars) {
  if (!email) return;
  try {
    if (!getUserChatPreference_(email)) return;
    sendPrivateMessage_(email, fillTemplate_(getMessageTemplate_(key, "en"), vars));
  } catch (e) { console.warn("Consulting chat to " + email + " failed: " + e.message); }
}

/** Vorlagen, die der Einreicher sehen darf (gleiche Regel wie getConfig_). */
function templatesForUser_(email) {
  var all = readTemplates_();
  var data = getUserData_(email);
  var isAdm = isAdmin_(email);
  var out = {};
  Object.keys(all).forEach(function (k) { if (isAdm || templateMatchesUser_(all[k], data)) out[k] = all[k]; });
  return out;
}

// --- Endpunkte -----------------------------------------------------------------------

/** "Ask for Consulting": Anfrage anlegen statt Projekt. */
function apiConsultingCreate(payload, comment) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: access.reason === "maintenance" ? "Maintenance active" : "Not authorized." };
  var caller = getUserEmail_();
  payload = payload || {};
  comment = String(comment || "").trim().slice(0, 5000);
  var mainFiles = payload.mainFiles || payload.allMainFiles || [];
  if (!String(payload.projectName || "").trim() && !mainFiles.length && !comment) {
    return { success: false, error: "Please enter at least a project name, a file or a comment." };
  }
  try {
    var id = "C-" + Utilities.formatDate(new Date(), "Europe/Berlin", "yyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    var folder = consultRootFolder_().createFolder(id + " " + String(payload.projectName || caller).slice(0, 80));
    var files = consultStoreFiles_(folder, mainFiles, payload.refFiles, payload.refDriveIds);
    // Consultants duerfen die abgelegten Dateien oeffnen (sonst nur das Deploy-Konto).
    try { folder.addViewers(marketingConsultants_()); } catch (e) { console.warn("Consulting folder sharing: " + e.message); }
    var req = {
      rowNum: -1, id: id, createdAt: new Date().toISOString(), requester: caller, status: "OPEN", assignee: "",
      payload: consultNormalizePayload_(payload, files), comment: comment,
      history: [consultHistoryEntry_(caller, "CREATED", comment)], projectUids: [], folderId: folder.getId()
    };
    consultWrite_(req);
    logAuditEvent_(caller, "CONSULTING_REQUEST", id + " '" + req.payload.projectName + "'");

    var vars = {
      REQUESTER: caller, PROJECT_NAME: req.payload.projectName || "-",
      TEMPLATE_NAME: req.payload.templateName || req.payload.templateGroup || "-",
      TARGET_LANGS: (req.payload.targetLangs || []).join(", ") || "-", NOTE: comment || "-"
    };
    marketingConsultants_().forEach(function (c) { consultNotify_(c, "MSG_CONSULTING_REQUEST", vars); });
    consultNotify_(caller, "MSG_CONSULTING_RECEIVED", vars);
    return { success: true, id: id };
  } catch (e) {
    console.error("apiConsultingCreate: " + e.message);
    return { success: false, error: e.message };
  }
}

/** Liste: Consultants alle, sonst eigene (und die der vertretenen Personen). */
function apiConsultingList() {
  var caller = getUserEmail_();
  var consultant = isMarketingConsultant_(caller);
  try {
    var rows = consultReadAll_().filter(function (r) { return consultant || consultIsRequesterSide_(r, caller); });
    rows.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
    return {
      success: true,
      isConsultant: consultant,
      requests: rows.map(function (r) {
        return {
          id: r.id, createdAt: r.createdAt, updatedAt: r.updatedAt, requester: r.requester, status: r.status,
          assignee: r.assignee, projectName: r.payload.projectName || r.projectName,
          templateName: r.payload.templateName || r.payload.templateGroup || "",
          targetLangs: r.payload.targetLangs || [], files: (r.payload.files || []).length,
          projectUids: r.projectUids, lastAction: (r.history[r.history.length - 1] || {}).action || ""
        };
      })
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** Details inkl. Historie; fuer Consultants auch die Vorlagen des Einreichers. */
function apiConsultingGet(id) {
  var caller = getUserEmail_();
  var req = consultFind_(id);
  if (!req) return { success: false, error: "Request not found." };
  var consultant = isMarketingConsultant_(caller);
  if (!consultant && !consultIsRequesterSide_(req, caller)) return { success: false, error: "Not authorized." };
  var open = req.status === "OPEN" || req.status === "IN_PROGRESS";
  var out = {
    success: true,
    request: {
      id: req.id, createdAt: req.createdAt, updatedAt: req.updatedAt, requester: req.requester, status: req.status,
      assignee: req.assignee, comment: req.comment, payload: req.payload, history: req.history, projectUids: req.projectUids,
      folderUrl: req.folderId ? "https://drive.google.com/drive/folders/" + req.folderId : "",
      missing: consultMissingFields_(req.payload)
    },
    canEdit: consultant && open,
    canWithdraw: !consultant && open && consultIsRequesterSide_(req, caller),
    isConsultant: consultant
  };
  if (consultant) {
    try { out.templates = templatesForUser_(req.requester); } catch (e) { out.templates = {}; }
  }
  return out;
}

/** Consultant uebernimmt die Anfrage. */
function apiConsultingAssign(id) {
  var caller = getUserEmail_();
  if (!isMarketingConsultant_(caller)) return { success: false, error: "Not authorized." };
  var req = consultFind_(id);
  if (!req) return { success: false, error: "Request not found." };
  if (req.status === "SUBMITTED" || req.status === "CLOSED") return { success: false, error: "Request is already finished." };
  req.assignee = caller;
  req.status = "IN_PROGRESS";
  req.history.push(consultHistoryEntry_(caller, "ASSIGNED", ""));
  consultWrite_(req);
  consultNotify_(req.requester, "MSG_CONSULTING_UPDATE", {
    STATUS: "IN PROGRESS", PROJECT_NAME: req.payload.projectName || req.id, UPDATED_BY: caller, NOTE: ""
  });
  return apiConsultingGet(id);
}

/** Consultant speichert Aenderungen (ohne einzureichen). */
function apiConsultingUpdate(id, patch) {
  var caller = getUserEmail_();
  if (!isMarketingConsultant_(caller)) return { success: false, error: "Not authorized." };
  var req = consultFind_(id);
  if (!req) return { success: false, error: "Request not found." };
  if (req.status === "SUBMITTED" || req.status === "CLOSED") return { success: false, error: "Request is already finished." };
  var res = consultApplyPatch_(req.payload, patch);
  if (!res.changed.length) return apiConsultingGet(id);
  req.payload = res.payload;
  if (!req.assignee) req.assignee = caller;
  if (req.status === "OPEN") req.status = "IN_PROGRESS";
  req.history.push(consultHistoryEntry_(caller, "EDITED", res.changed.join(", ")));
  consultWrite_(req);
  return apiConsultingGet(id);
}

/** Kommentar in die Historie (Consultant oder Einreicher); die andere Seite wird informiert. */
function apiConsultingComment(id, text) {
  var caller = getUserEmail_();
  var req = consultFind_(id);
  if (!req) return { success: false, error: "Request not found." };
  var consultant = isMarketingConsultant_(caller);
  if (!consultant && !consultIsRequesterSide_(req, caller)) return { success: false, error: "Not authorized." };
  text = String(text || "").trim();
  if (!text) return { success: false, error: "Empty comment." };
  req.history.push(consultHistoryEntry_(caller, "COMMENT", text));
  consultWrite_(req);
  var vars = { STATUS: "COMMENT", PROJECT_NAME: req.payload.projectName || req.id, UPDATED_BY: caller, NOTE: text };
  if (consultIsRequesterSide_(req, caller)) {
    (req.assignee ? [req.assignee] : marketingConsultants_()).forEach(function (c) { if (c !== caller) consultNotify_(c, "MSG_CONSULTING_UPDATE", vars); });
  } else {
    consultNotify_(req.requester, "MSG_CONSULTING_UPDATE", vars);
  }
  return apiConsultingGet(id);
}

/** Consultant reicht ein: Projekt im Namen des Einreichers anlegen. */
function apiConsultingSubmit(id, patch) {
  var caller = getUserEmail_();
  if (!isMarketingConsultant_(caller)) return { success: false, error: "Not authorized." };
  var maint = getMaintenanceStatus_();
  if (maint.active && !isAdmin_(caller)) return { success: false, error: "Maintenance active" };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { success: false, error: "Busy, please try again." };
  var req;
  try {
    req = consultFind_(id);
    if (!req) return { success: false, error: "Request not found." };
    if (req.status === "SUBMITTED" || req.status === "CLOSED") return { success: false, error: "Request is already finished." };
    var res = consultApplyPatch_(req.payload, patch);
    req.payload = res.payload;
    var missing = consultMissingFields_(req.payload);
    if (missing.length) {
      if (res.changed.length) { req.history.push(consultHistoryEntry_(caller, "EDITED", res.changed.join(", "))); consultWrite_(req); }
      return { success: false, error: "Missing: " + missing.join(", "), missing: missing };
    }
    req.status = "IN_PROGRESS";
    req.assignee = req.assignee || caller;
    req.history.push(consultHistoryEntry_(caller, "SUBMITTING", res.changed.length ? res.changed.join(", ") : ""));
    consultWrite_(req);
  } finally {
    lock.releaseLock();
  }

  var result;
  try {
    result = createProjectAndUploadAs_(consultBuildUploadPayload_(req.payload), req.requester, { createdBy: caller });
  } catch (e) {
    result = { success: false, error: e.message };
  }
  req = consultFind_(id) || req;
  if (result && result.success) {
    req.status = "SUBMITTED";
    req.projectUids = result.allProjectUids || [result.projectUid];
    req.history.push(consultHistoryEntry_(caller, "SUBMITTED", req.projectUids.join(", ")));
    consultWrite_(req);
    consultNotify_(req.requester, "MSG_CONSULTING_UPDATE", {
      STATUS: "SUBMITTED", PROJECT_NAME: req.payload.projectName, UPDATED_BY: caller,
      NOTE: "Phrase: " + req.projectUids.join(", ")
    });
  } else {
    var err = (result && (result.error || (result.errors || []).join("; "))) || "Unknown error";
    req.history.push(consultHistoryEntry_(caller, "SUBMIT_FAILED", err));
    consultWrite_(req);
  }
  return Object.assign({}, result, { requestId: id });
}

/** Schliessen (Consultant) bzw. zurueckziehen (Einreicher). */
function apiConsultingClose(id, reason) {
  var caller = getUserEmail_();
  var req = consultFind_(id);
  if (!req) return { success: false, error: "Request not found." };
  var consultant = isMarketingConsultant_(caller);
  if (!consultant && !consultIsRequesterSide_(req, caller)) return { success: false, error: "Not authorized." };
  if (req.status === "SUBMITTED" || req.status === "CLOSED") return { success: false, error: "Request is already finished." };
  req.status = "CLOSED";
  req.history.push(consultHistoryEntry_(caller, consultant ? "CLOSED" : "WITHDRAWN", String(reason || "").trim()));
  consultWrite_(req);
  var vars = { STATUS: "CLOSED", PROJECT_NAME: req.payload.projectName || req.id, UPDATED_BY: caller, NOTE: String(reason || "") };
  if (consultant) consultNotify_(req.requester, "MSG_CONSULTING_UPDATE", vars);
  else if (req.assignee) consultNotify_(req.assignee, "MSG_CONSULTING_UPDATE", vars);
  return apiConsultingGet(id);
}
