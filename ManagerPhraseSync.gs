/**
 * ManagerPhraseSync.gs
 * Nutzer- und Template-Verwaltung (Admin) mit Werten aus Phrase:
 *  - apiGetManagerCatalog: Auswahllisten (Clients, Domains, Subdomains,
 *    Business Units, Workflow-Schritte, Sprachen) live aus Phrase (gecacht)
 *  - Aenderungen an Nutzern/Templates werden ins Sheet UND live nach Phrase
 *    geschrieben: GET des vollstaendigen Objekts, nur das eine Feld aendern,
 *    PUT zurueck (so gehen keine anderen Einstellungen verloren), danach
 *    erneut lesen und pruefen, ob Phrase den Wert uebernommen hat.
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
  var detail = maxTplGet_(url) || {};
  var body = mgrEditBody_(detail);
  if (prepare) prepare(body, detail);
  body[phraseField] = wanted;
  mgrPut_(url, body);
  var after = maxTplGet_(url) || {};
  if (!mgrSameValue_(after[phraseField], wanted)) {
    throw new Error("Phrase hat " + phraseField + " nicht uebernommen (jetzt: " + JSON.stringify(after[phraseField] || null) + ").");
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
