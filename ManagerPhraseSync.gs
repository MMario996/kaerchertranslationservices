/**
 * ManagerPhraseSync.gs
 * Nutzer- und Template-Verwaltung (Admin) mit Werten aus Phrase:
 *  - apiGetManagerCatalog: Auswahllisten (Clients, Domains, Subdomains,
 *    Business Units, Workflow-Schritte, Sprachen) live aus Phrase (gecacht)
 *  - Aenderungen an Nutzern/Templates werden ins Sheet UND live nach Phrase
 *    geschrieben: GET des vollstaendigen Objekts, nur das eine Feld aendern,
 *    PUT zurueck (so gehen keine anderen Einstellungen verloren), danach
 *    erneut lesen und pruefen, ob Phrase den Wert uebernommen hat.
 *  - apiRenameTemplate: Template live in Phrase umbenennen, Sheet zieht nach
 *  - apiCopyUserFromExample: Nutzer 1:1 wie einen Beispiel-User einstellen
 *    (Rolle, Segmentierung, Sprachen, Workflow-Schritte; optional Bereiche)
 *
 * Im Sheet stehen weiterhin Namen (z. B. "AKW, KNA") - darauf filtert die
 * Template-Sichtbarkeit (templateMatchesUser_). Nach Phrase gehen IDs.
 *
 * Phrase-Endpunkte (Phrase TMS API):
 *   Nutzer:    GET/PUT /api2/v3/users/{userUid}
 *   Templates: GET/PUT /api2/v1/projectTemplates/{templateUid}
 */

/** Sheet-Feld (User Manager) -> Feld in Phrase. */
var MGR_USER_PHRASE_FIELDS_ = {
  firstName: "firstName", lastName: "lastName", role: "role",
  clients: "clients", domains: "domains", subdomains: "subDomains", businessUnit: "businessUnit",
  sourceLangs: "sourceLangs", targetLangs: "targetLangs", workflowSteps: "workflowSteps"
};

/** Sheet-Feld (Template Manager) -> Feld in Phrase. */
var MGR_TEMPLATE_PHRASE_FIELDS_ = {
  sourceLang: "sourceLang", targetLangs: "targetLangs",
  client: "client", domain: "domain", subDomain: "subDomain", businessUnit: "businessUnit"
};

/** Felder, die Phrase nur liest - werden beim PUT nicht zurueckgeschickt. */
var MGR_READ_ONLY_KEYS_ = ["uid", "id", "internalId", "dateCreated", "createdBy", "dateModified", "modifiedBy",
  "dateDeleted", "lastLoginDate", "owner", "isPublic", "userUid"];

// --- Reine Helfer (getestet) --------------------------------------------------

/**
 * Sheet-Wert -> Wert fuer Phrase.
 * cat: { clients, domains, subDomains, businessUnits, workflowSteps: [{id, name}] }
 * Wirft bei unbekannten Namen (damit nichts stillschweigend wegfaellt).
 */
function mgrPhraseValue_(phraseField, value, cat) {
  var parts = splitMulti_(value);
  var listKey = { clients: "clients", client: "clients", domains: "domains", domain: "domains",
    subDomains: "subDomains", subDomain: "subDomains", businessUnit: "businessUnits", workflowSteps: "workflowSteps" }[phraseField];
  if (listKey) {
    var list = (cat && cat[listKey]) || [];
    var refs = parts.map(function (p) {
      var hit = list.filter(function (x) { return String(x.id) === p || String(x.name).toLowerCase() === p.toLowerCase(); })[0];
      if (!hit) throw new Error('"' + p + '" ist in Phrase unbekannt (' + phraseField + ").");
      return { id: String(hit.id) };
    });
    var single = ["client", "domain", "subDomain", "businessUnit"].indexOf(phraseField) >= 0;
    if (single) {
      if (refs.length > 1) throw new Error(phraseField + ": nur ein Wert moeglich.");
      return refs[0] || null;
    }
    return refs;
  }
  if (phraseField === "sourceLangs" || phraseField === "targetLangs") return parts.map(function (p) { return p.toLowerCase(); });
  if (phraseField === "sourceLang") return parts[0] ? parts[0].toLowerCase() : null;
  return String(value == null ? "" : value).trim();
}

/** Phrase-Objekt (GET) -> Body fuer PUT: Referenzen auf {id}, Nur-Lese-Felder weg. */
function mgrEditBody_(detail) {
  var conv = function (v) {
    if (Array.isArray(v)) return v.map(conv);
    if (v && typeof v === "object") {
      if (v.id !== undefined || v.uid !== undefined) return { id: String(v.id !== undefined ? v.id : v.uid) };
      var o = {};
      Object.keys(v).forEach(function (k) { o[k] = conv(v[k]); });
      return o;
    }
    return v;
  };
  var body = {};
  Object.keys(detail || {}).forEach(function (k) {
    if (MGR_READ_ONLY_KEYS_.indexOf(k) >= 0) return;
    body[k] = conv(detail[k]);
  });
  return body;
}

/** Hat Phrase den Wert uebernommen? (IDs bzw. Sprachcodes, Reihenfolge egal) */
function mgrSameValue_(actual, wanted) {
  var norm = function (v) {
    if (v === null || v === undefined || v === "") return [];
    var arr = Array.isArray(v) ? v : [v];
    return arr.map(function (x) {
      if (x && typeof x === "object") return String(x.id !== undefined ? x.id : x.uid);
      return String(x).toLowerCase();
    }).sort();
  };
  return JSON.stringify(norm(actual)) === JSON.stringify(norm(wanted));
}

// --- Kataloge -----------------------------------------------------------------

function mgrLanguages_() {
  return maxTplCached_("mgr_langs_v1", 21600, function () {
    try {
      var res = maxTplGet_(phraseApiUrlV1_("/languages"));
      var list = (res && res.languages) || (Array.isArray(res) ? res : []);
      return list.map(function (l) { return l && l.code ? { id: String(l.code).toLowerCase(), name: String(l.name || l.code) } : null; })
        .filter(Boolean).sort(function (a, b) { return a.name.localeCompare(b.name); });
    } catch (e) {
      console.warn("Phrase-Sprachen: " + e.message);
      return [];
    }
  });
}

function mgrCatalog_() {
  var cat = maxTplCatalog_();
  var named = function (list) { return (list || []).map(function (x) { return { id: String(x.id), name: String(x.name || x.id) }; }); };
  return {
    clients: named(cat.clients), domains: named(cat.domains), subDomains: named(cat.subDomains),
    businessUnits: named(cat.businessUnits), workflowSteps: named(cat.workflowSteps), languages: mgrLanguages_()
  };
}

/** Auswahllisten fuer Nutzer- und Template-Verwaltung. */
function apiGetManagerCatalog() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "users") && !isAdminLightWithAccess_(caller, "templates")) {
    throw new Error("Not authorized. Admin only.");
  }
  return Object.assign({ success: true }, mgrCatalog_());
}

// --- Live nach Phrase -----------------------------------------------------------

function mgrPut_(url, body) {
  return phraseFetchJson_(url, { method: "put", contentType: "application/json",
    headers: { Authorization: getPhraseAuthHeader_() }, payload: JSON.stringify(body) });
}

/** GET, ein Feld setzen, PUT, pruefen. Wirft mit verstaendlicher Meldung. */
function mgrPhraseEdit_(url, phraseField, wanted, prepare) {
  var one = {};
  one[phraseField] = wanted;
  mgrPhraseEditMany_(url, one, prepare);
}

/**
 * Wie mgrPhraseEdit_, aber mehrere Felder in EINEM PUT (GET, Felder setzen,
 * PUT, erneut lesen, jedes Feld pruefen).
 * readKey: optional { phraseField: Feldname im GET } (z. B. name -> templateName).
 */
function mgrPhraseEditMany_(url, wantedByField, prepare, readKey) {
  var fields = Object.keys(wantedByField || {});
  if (!fields.length) return;
  var detail = maxTplGet_(url) || {};
  var body = mgrEditBody_(detail);
  if (prepare) prepare(body, detail);
  fields.forEach(function (f) { body[f] = wantedByField[f]; });
  mgrPut_(url, body);
  var after = maxTplGet_(url) || {};
  var bad = fields.filter(function (f) {
    var k = (readKey && readKey[f]) || f;
    return !mgrSameValue_(after[k], wantedByField[f]);
  });
  if (bad.length) {
    throw new Error("Phrase hat " + bad.join(", ") + " nicht uebernommen (jetzt: " +
      bad.map(function (f) { return f + "=" + JSON.stringify(after[(readKey && readKey[f]) || f] || null); }).join("; ") + ").");
  }
}

/** Phrase-UID eines Nutzers ueber den Benutzernamen. */
function mgrPhraseUserUid_(username) {
  var res = maxTplGet_(phraseApiUrlV1_("/users?userName=" + encodeURIComponent(username)));
  var match = ((res && res.content) || []).filter(function (u) { return u.userName === username; })[0];
  if (!match) throw new Error("User '" + username + "' nicht in Phrase gefunden.");
  return String(match.uid || match.id);
}

/** Nutzerfeld (Sheet-Name) live nach Phrase. */
function mgrSyncUserField_(username, field, value) {
  var phraseField = MGR_USER_PHRASE_FIELDS_[field];
  if (!phraseField) return;
  var wanted = mgrPhraseValue_(phraseField, value, mgrCatalog_());
  var uid = mgrPhraseUserUid_(username);
  mgrPhraseEdit_(phraseApiUrlV3_("/users/" + encodeURIComponent(uid)), phraseField, wanted);
}

/** Templatefeld (Sheet-Name) live nach Phrase. */
function mgrSyncTemplateField_(templateUid, field, value) {
  var phraseField = MGR_TEMPLATE_PHRASE_FIELDS_[field];
  if (!phraseField) return;
  var wanted = mgrPhraseValue_(phraseField, value, mgrCatalog_());
  mgrPhraseEdit_(phraseApiUrlV1_("/projectTemplates/" + encodeURIComponent(templateUid)), phraseField, wanted, function (body, detail) {
    // Edit-DTO erwartet "name", GET liefert "templateName".
    if (!body.name && detail.templateName) body.name = detail.templateName;
  });
}

/**
 * Template-Feld im Sheet aendern und live nach Phrase schreiben.
 * field: sourceLang | targetLangs | client | domain | subDomain | businessUnit
 */
function apiUpdateTemplateField(templateUid, field, value) {
  var caller = assertManager_("templates");
  var uid = String(templateUid || "").trim();
  if (!uid || !MGR_TEMPLATE_PHRASE_FIELDS_[field]) throw new Error("Ungueltiges Feld.");
  var val = splitMulti_(value).join(", ");
  var sh = openAccessSS_().getSheetByName(templateSheetName_());
  if (!sh) throw new Error("Sheet " + templateSheetName_() + " nicht gefunden.");
  var data = sh.getDataRange().getValues();
  var h = data[0].map(function (x) { return String(x).trim().toLowerCase(); });
  var col = {
    sourceLang: h.findIndex(function (x) { return x.indexOf("source") >= 0; }),
    targetLangs: h.findIndex(function (x) { return x.indexOf("target") >= 0; }),
    client: h.findIndex(function (x) { return x.indexOf("client") >= 0; }),
    domain: h.findIndex(function (x) { return x.indexOf("domain") >= 0 && x.indexOf("sub") < 0; }),
    subDomain: h.findIndex(function (x) { return x.indexOf("subdomain") >= 0 || x.indexOf("sub-domain") >= 0 || x.indexOf("sub domain") >= 0; }),
    businessUnit: h.findIndex(function (x) { return x.indexOf("business") >= 0; })
  }[field];
  var cUid = h.findIndex(function (x) { return x.indexOf("uid") >= 0; });
  if (col < 0 || cUid < 0) throw new Error("Spalte fuer '" + field + "' nicht im Template-Sheet gefunden.");
  var rows = [];
  for (var i = 1; i < data.length; i++) if (String(data[i][cUid] || "").trim() === uid) rows.push(i + 1);
  if (!rows.length) throw new Error("Template nicht im Sheet gefunden.");
  // Phrase zuerst: schlaegt es fehl, bleibt das Sheet unveraendert (kein Auseinanderlaufen).
  var result = { success: true, value: val };
  try {
    mgrSyncTemplateField_(uid, field, val);
  } catch (e) {
    return { success: false, error: "Phrase: " + e.message };
  }
  rows.forEach(function (r) { sh.getRange(r, col + 1).setValue(val); });
  logAuditEvent_(caller, "TEMPLATE_FIELD_UPDATE", uid + "." + field + " = " + val);
  return result;
}

// --- Template in Phrase umbenennen ---------------------------------------------

/** Neuen Template-Namen pruefen/normalisieren. Wirft bei ungueltigem Namen. */
function mgrCleanTemplateName_(name) {
  var n = String(name == null ? "" : name).replace(/\s+/g, " ").trim();
  if (!n) throw new Error("Name darf nicht leer sein.");
  if (n.length > 255) throw new Error("Name ist zu lang (max. 255 Zeichen).");
  return n;
}

/**
 * Template in Phrase umbenennen (live) und danach im Sheet die Spalte
 * "Phrase Name" nachziehen. Den Anzeigenamen im Portal ebenfalls setzen, wenn
 * alsoDisplayName true ist oder er bisher dem alten Phrase-Namen entsprach.
 * Reihenfolge wie bei apiUpdateTemplateField: erst Phrase, dann Sheet.
 */
function apiRenameTemplate(templateUid, newName, alsoDisplayName) {
  var caller = assertManager_("templates");
  var uid = String(templateUid || "").trim();
  if (!uid) return { success: false, error: "Template UID fehlt." };
  var name;
  try { name = mgrCleanTemplateName_(newName); } catch (e) { return { success: false, error: e.message }; }

  var sh = openAccessSS_().getSheetByName(templateSheetName_());
  if (!sh) return { success: false, error: "Sheet " + templateSheetName_() + " nicht gefunden." };
  var data = sh.getDataRange().getValues();
  var h = data[0].map(function (x) { return String(x).trim().toLowerCase(); });
  var cUid = h.findIndex(function (x) { return x.indexOf("uid") >= 0; });
  var cPhrase = h.findIndex(function (x) { return x.indexOf("phrase name") >= 0 || x.indexOf("original") >= 0; });
  var cDisp = h.findIndex(function (x) { return (x.indexOf("name") >= 0 || x.indexOf("display") >= 0 || x.indexOf("anzeige") >= 0) && x.indexOf("phrase") < 0 && x.indexOf("original") < 0; });
  if (cUid < 0) return { success: false, error: "Spalte 'Template UID' nicht gefunden." };

  var url = phraseApiUrlV1_("/projectTemplates/" + encodeURIComponent(uid));
  var oldName = "";
  try {
    mgrPhraseEditMany_(url, { name: name }, function (body, detail) {
      oldName = String(detail.templateName || detail.name || "");
    }, { name: "templateName" });
  } catch (e) {
    return { success: false, error: "Phrase: " + e.message };
  }

  var displayName = "";
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][cUid] || "").trim() !== uid) continue;
    if (cPhrase >= 0) sh.getRange(i + 1, cPhrase + 1).setValue(name);
    if (cDisp >= 0) {
      var curDisp = String(data[i][cDisp] || "").trim();
      if (alsoDisplayName || !curDisp || curDisp === oldName) {
        sh.getRange(i + 1, cDisp + 1).setValue(name);
        displayName = name;
      } else {
        displayName = curDisp;
      }
    }
  }
  try { phraseScriptCache_().remove("phrase_tmpl_details_" + uid); } catch (e) {}
  logAuditEvent_(caller, "TEMPLATE_RENAME_PHRASE", uid + ": '" + oldName + "' -> '" + name + "'");
  return { success: true, phraseName: name, displayName: displayName || name, oldName: oldName };
}

// --- Nutzer 1:1 nach Beispiel-User -----------------------------------------------

/** Felder, die "1:1 uebernehmen" kopiert (Name, E-Mail, Status bleiben). */
var MGR_USER_COPY_FIELDS_ = ["role", "clients", "domains", "subdomains", "businessUnit",
  "sourceLangs", "targetLangs", "workflowSteps"];

/** Portal-Bereiche, die beim Kopieren nie angefasst werden (Rechte-Eskalation). */
var MGR_USER_COPY_SKIP_AREAS_ = ["admin", "light"];

/**
 * Was muss sich an target aendern, damit es src entspricht?
 * Liefert [{ field, from, to }] nur fuer abweichende Felder. Vergleich bei
 * Mehrfachfeldern ohne Ruecksicht auf Reihenfolge/Gross-Klein.
 */
function mgrUserCopyPlan_(src, target) {
  var norm = function (v) { return splitMulti_(v).map(function (x) { return x.toLowerCase(); }).sort().join("|"); };
  return MGR_USER_COPY_FIELDS_.map(function (f) {
    var to = f === "role" ? String(src[f] || "").trim() : splitMulti_(src[f]).join(", ");
    var from = String(target[f] || "");
    var same = f === "role" ? to.toUpperCase() === from.trim().toUpperCase() : norm(to) === norm(from);
    return same ? null : { field: f, from: from, to: to };
  }).filter(Boolean);
}

/** Portal-Bereiche angleichen: { grant: [...], revoke: [...] } ohne Admin/Admin-Light. */
function mgrAreaDiff_(srcAreas, targetAreas) {
  var ok = function (a) { return MGR_USER_COPY_SKIP_AREAS_.indexOf(a) < 0; };
  var s = (srcAreas || []).filter(ok);
  var t = (targetAreas || []).filter(ok);
  return {
    grant: s.filter(function (a) { return t.indexOf(a) < 0; }),
    revoke: t.filter(function (a) { return s.indexOf(a) < 0; })
  };
}

/**
 * Nutzer 1:1 wie einen Beispiel-User einstellen: Rolle, Clients, Domains,
 * Subdomains, Business Unit, Quell-/Zielsprachen, Workflow-Schritte.
 * Pro Nutzer erst Phrase (ein GET/PUT mit allen Feldern, danach Pruefung),
 * erst bei Erfolg das Sheet - so laufen Sheet und Phrase nicht auseinander.
 * includeAreas (nur Admin): Portal-Bereiche ebenfalls angleichen
 * (Admin und Admin-Light werden nie kopiert).
 */
function apiCopyUserFromExample(fromUsername, toUsernames, includeAreas) {
  var caller = assertManager_("users");
  var srcName = String(fromUsername || "").trim();
  var sh = openUserSheetSS_().getSheetByName("FetchTMS_USERS-Prod");
  if (!sh) return { success: false, error: "Sheet FetchTMS_USERS-Prod nicht gefunden." };
  var data = sh.getDataRange().getValues();
  var colIdx = {};
  data[0].map(function (x) { return String(x).trim(); }).forEach(function (x, i) { if (USER_MGR_HEADER_MAP[x]) colIdx[USER_MGR_HEADER_MAP[x]] = i; });
  if (colIdx.username == null) return { success: false, error: "Spalte 'Username' nicht gefunden." };
  var rowOf = function (r) {
    var o = {};
    Object.keys(colIdx).forEach(function (f) { o[f] = String(r[colIdx[f]] == null ? "" : r[colIdx[f]]).trim(); });
    return o;
  };
  var src = null;
  for (var i = 1; i < data.length; i++) if (String(data[i][colIdx.username] || "").trim() === srcName) src = rowOf(data[i]);
  if (!src) return { success: false, error: "Beispiel-User '" + srcName + "' nicht gefunden." };

  var want = {};
  (Array.isArray(toUsernames) ? toUsernames : [toUsernames]).forEach(function (u) {
    u = String(u || "").trim();
    if (u && u !== srcName) want[u] = true;
  });
  if (!Object.keys(want).length) return { success: false, error: "Keine Ziel-Nutzer ausgewaehlt." };

  var cat = null;
  var results = [];
  var errors = [];
  var targets = [];
  for (var r = 1; r < data.length; r++) {
    var uname = String(data[r][colIdx.username] || "").trim();
    if (!want[uname]) continue;
    var tgt = rowOf(data[r]);
    targets.push(tgt);
    var plan = mgrUserCopyPlan_(src, tgt).filter(function (p) { return colIdx[p.field] != null; });
    if (!plan.length) { results.push({ username: uname, changed: [] }); continue; }
    try {
      var wanted = {};
      plan.forEach(function (p) {
        var pf = MGR_USER_PHRASE_FIELDS_[p.field];
        if (!pf) return;
        if (!cat) cat = mgrCatalog_();
        wanted[pf] = mgrPhraseValue_(pf, p.to, cat);
      });
      var uid = mgrPhraseUserUid_(uname);
      mgrPhraseEditMany_(phraseApiUrlV3_("/users/" + encodeURIComponent(uid)), wanted);
    } catch (e) {
      errors.push(uname + ": Phrase: " + e.message);
      continue;
    }
    plan.forEach(function (p) { sh.getRange(r + 1, colIdx[p.field] + 1).setValue(p.to); });
    results.push({ username: uname, changed: plan });
  }

  var areaChanges = 0;
  if (includeAreas && isAdmin_(caller)) {
    var areas = mgrAreaMap_();
    var srcAreas = areas[String(src.email || "").toLowerCase()] || [];
    targets.forEach(function (t) {
      var email = String(t.email || "").toLowerCase();
      if (!email) return;
      var d = mgrAreaDiff_(srcAreas, areas[email] || []);
      [[d.grant, true], [d.revoke, false]].forEach(function (x) {
        if (!x[0].length) return;
        var res = apiSetAccessBulk([email], x[0], x[1]) || {};
        areaChanges += res.changed || 0;
        (res.errors || []).forEach(function (e) { errors.push(t.username + ": " + e); });
      });
    });
  }

  logAuditEvent_(caller, "USER_COPY_FROM_EXAMPLE", srcName + " -> " +
    results.map(function (x) { return x.username + "(" + x.changed.length + ")"; }).join(", ").slice(0, 400) +
    (errors.length ? " | Fehler: " + errors.length : ""));
  return { success: results.length > 0 || !errors.length, from: srcName, results: results, areaChanges: areaChanges, errors: errors };
}
