/**
 * PhraseApi.gs (stable auth)
 * - Uses Authorization: Bearer <token> (matches your working reference)
 * - Centralizes URL building for v1/v2/v3
 * - Provides: phraseCreateProjectFromTemplate_, phraseUploadJob_, phraseUploadReference_
 * - Utility: phraseFetchJson_ (with 429 retry + exponential backoff)
 *
 * REMOVED: phraseSetProjectOwner_ ? Funktionsuser bleibt Owner (keine Phrase-Mails an Einreicher)
 * NEW:     phraseSetProjectCreator_ ? überschreibt CF "Project Creator" (Default "SET VALUE")
 *          via GET (Instanz-UID holen) + PUT updateInstances (Wert setzen)
 *          Custom Field UID: rP6yDs6jzepIbpoxiknpN1 (STRING, allowedEntities: PROJECT)
 */

// --- Custom Field UID ? Project Creator (Feld-Definition-UID, nicht Instanz-UID) ??
var CF_PROJECT_CREATOR_UID_ = "rP6yDs6jzepIbpoxiknpN1";

function getPhraseWebBaseUrl_() {
  const props = PropertiesService.getScriptProperties();
  const v = String(props.getProperty("PHRASE_API_BASE_URL") || "").trim() || "https://cloud.memsource.com/web";
  return v.replace(/\/+$/, "");
}

function phraseApiUrlV1_(path) {
  const p = String(path || "");
  return getPhraseWebBaseUrl_() + "/api2/v1" + (p.startsWith("/") ? p : "/" + p);
}
function phraseApiUrlV2_(path) {
  const p = String(path || "");
  return getPhraseWebBaseUrl_() + "/api2/v2" + (p.startsWith("/") ? p : "/" + p);
}
function phraseApiUrlV3_(path) {
  const p = String(path || "");
  return getPhraseWebBaseUrl_() + "/api2/v3" + (p.startsWith("/") ? p : "/" + p);
}

function getPhraseToken_() {
  const props = PropertiesService.getScriptProperties();
  const token =
    String(props.getProperty("PHRASE_API_TOKEN") || "").trim() ||
    String(props.getProperty("PHRASE_TOKEN") || "").trim() ||
    String(props.getProperty("GLOBAL_PHRASE_TOKEN") || "").trim();

  if (!token) throw new Error("No Phrase token found. Set PHRASE_API_TOKEN (or GLOBAL_PHRASE_TOKEN).");
  return token;
}

function getPhraseAuthHeader_() {
  return "Bearer " + getPhraseToken_();
}

/**
 * Utility: JSON call with error handling + 429 retry (exponential backoff)
 */
function phraseFetchJson_(url, options) {
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 2000;

  for (var attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    var res = UrlFetchApp.fetch(url, Object.assign({ muteHttpExceptions: true }, options || {}));
    var code = res.getResponseCode();
    var text = res.getContentText();

    if (code === 429) {
      if (attempt === MAX_RETRIES) {
        throw new Error("Phrase API Rate Limit (429) nach " + MAX_RETRIES + " Versuchen. URL: " + url);
      }
      var retryAfterHeader = res.getHeaders()["Retry-After"] || res.getHeaders()["retry-after"];
      var waitMs;
      if (retryAfterHeader && !isNaN(Number(retryAfterHeader))) {
        waitMs = Number(retryAfterHeader) * 1000;
      } else {
        waitMs = BASE_DELAY_MS * Math.pow(2, attempt);
      }
      console.warn("\u26A0 Phrase 429 Rate Limit ? Warte " + (waitMs / 1000) + "s (Versuch " + (attempt + 1) + "/" + MAX_RETRIES + ")");
      Utilities.sleep(waitMs);
      continue;
    }

    if (code >= 400) {
      var msg = text;
      try {
        var j = JSON.parse(text);
        msg = j.errorDescription || j.message || j.errorCode || text;
      } catch (e) {}
      throw new Error("Phrase API Error (" + code + ") @ " + url + ": " + msg);
    }

    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }

  throw new Error("Phrase API: Unerreichter Zustand nach Retry-Schleife.");
}

/**
 * Ermittelt Phrase-User (id, uid, userName) anhand der E-Mail.
 * GET /api2/v1/users?email={email}
 */
function phraseGetUserByEmail_(email) {
  if (!email) return null;
  try {
    const url = phraseApiUrlV1_("/users?email=" + encodeURIComponent(email) + "&pageSize=10");
    const result = phraseFetchJson_(url, {
      method: "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });

    const users = (result && result.content) ? result.content : (Array.isArray(result) ? result : []);
    for (const u of users) {
      if (u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()) {
        console.log("\u2022 Phrase User gefunden: " + email + " ? userName: " + u.userName);
        return { id: u.id, uid: u.uid, userName: u.userName };
      }
    }
    console.warn("\u26A0 Phrase User nicht gefunden für E-Mail: " + email);
    return null;
  } catch (e) {
    console.warn("\u26A0 phraseGetUserByEmail_ fehlgeschlagen für " + email + ": " + e.message);
    return null;
  }
}

/**
 * Legacy-Alias für Abwärtskompatibilität.
 */
function phraseGetUserIdByEmail_(email) {
  const u = phraseGetUserByEmail_(email);
  return u ? u.id : null;
}

/**
 * Schreibt den Phrase-Username des Einreichers in CF "Project Creator".
 *
 * Das Template setzt "Project Creator" per Default auf "SET VALUE".
 * Daher: Nicht POST (create), sondern:
 *   1. GET  /api2/v1/projects/{uid}/customFields
 *      ? findet die vorhandene Instanz-UID des "Project Creator"-Feldes
 *   2. PUT  /api2/v1/projects/{uid}/customFields
 *      ? updateInstances: [{ customFieldInstance: { uid: instanceUid }, value: username }]
 *
 * Falls keine Instanz vorhanden (Template ohne Default) ? addInstances (POST-Variante via PUT).
 *
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 * Muss NACH phraseCreateProjectFromTemplate_ aufgerufen werden.
 *
 * @param {string} projectUid  Phrase Projekt-UID
 * @param {string} userEmail   E-Mail des Einreichers
 */
function phraseSetProjectCreator_(projectUid, userEmail) {
  if (!projectUid || !userEmail) return;

  try {
    // 1. Phrase-Username auflösen (Fallback: E-Mail)
    const phraseUser = phraseGetUserByEmail_(userEmail);
    const creatorValue = (phraseUser && phraseUser.userName)
      ? phraseUser.userName
      : userEmail;

    // 2. Vorhandene CF-Instanzen des Projekts holen
    const getUrl = phraseApiUrlV1_(
      "/projects/" + encodeURIComponent(projectUid) + "/customFields?pageSize=50"
    );
    const getRes = phraseFetchJson_(getUrl, {
      method:  "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });

    const instances = (getRes && Array.isArray(getRes.content)) ? getRes.content
                    : (Array.isArray(getRes) ? getRes : []);

    // 3. Instanz des "Project Creator"-Feldes finden
    let instanceUid = null;
    for (const inst of instances) {
      const fieldUid = inst.customField && (inst.customField.uid || "");
      if (fieldUid === CF_PROJECT_CREATOR_UID_) {
        instanceUid = inst.uid;
        console.log("\u2022 Project Creator Instanz gefunden: " + instanceUid + " (Wert: '" + inst.value + "')");
        break;
      }
    }

    // 4. PUT: updateInstances (Instanz vorhanden) oder addInstances (keine Instanz)
    const putUrl = phraseApiUrlV1_(
      "/projects/" + encodeURIComponent(projectUid) + "/customFields"
    );

    let putPayload;
    if (instanceUid) {
      // Vorhandene Instanz überschreiben (z.B. "SET VALUE" ? Username)
      putPayload = {
        updateInstances: [
          {
            customFieldInstance: { uid: instanceUid },
            customField:         { uid: CF_PROJECT_CREATOR_UID_ },
            value:               creatorValue
          }
        ]
      };
    } else {
      // Noch keine Instanz vorhanden ? neu anlegen via addInstances
      putPayload = {
        addInstances: [
          {
            customField: { uid: CF_PROJECT_CREATOR_UID_ },
            value:       creatorValue
          }
        ]
      };
    }

    const putRes = UrlFetchApp.fetch(putUrl, {
      method:             "put",
      contentType:        "application/json",
      headers:            { Authorization: getPhraseAuthHeader_() },
      payload:            JSON.stringify(putPayload),
      muteHttpExceptions: true
    });

    const putCode = putRes.getResponseCode();
    if (putCode >= 400) {
      console.warn("\u26A0 phraseSetProjectCreator_ PUT HTTP " + putCode + ": " + putRes.getContentText().substring(0, 200));
    } else {
      console.log("\u2022 Project Creator gesetzt: " + projectUid + " ? '" + creatorValue + "'");
    }

  } catch (e) {
    console.warn("\u26A0 phraseSetProjectCreator_ fehlgeschlagen für " + projectUid + ": " + e.message);
  }
}

/**
 * Setzt den ECHTEN Phrase-Owner des Projekts auf den Einreicher.
 * NUR für WOMA und Competence Center genutzt (siehe apiCreateProjectAndUpload).
 * Bei allen anderen Templates bleibt der Funktionsuser (DE10E20592) Owner,
 * damit keine ungewollten Phrase-Systemmails an Einreicher gehen.
 *
 * Getestet: PATCH /api2/v1/projects/{uid} erwartet {"owner":{"id": <numerische ID>}}.
 * Mit "uid" statt "id" antwortet Phrase mit 404 ResourceNotFound.
 *
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 * Muss NACH phraseCreateProjectFromTemplate_ aufgerufen werden.
 *
 * @param {string} projectUid  Phrase Projekt-UID
 * @param {string} userEmail   E-Mail des Einreichers
 */
function phraseSetProjectOwner_(projectUid, userEmail) {
  if (!projectUid || !userEmail) return;

  try {
    const phraseUser = phraseGetUserByEmail_(userEmail);
    if (!phraseUser || !phraseUser.id) {
      console.warn("\u26A0 phraseSetProjectOwner_: Kein Phrase-User für " + userEmail + " gefunden ? Owner bleibt unverändert.");
      return;
    }

    const url = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
    const res = UrlFetchApp.fetch(url, {
      method:             "patch",
      contentType:        "application/json",
      headers:            { Authorization: getPhraseAuthHeader_() },
      payload:            JSON.stringify({ owner: { id: phraseUser.id } }),
      muteHttpExceptions: true
    });

    const code = res.getResponseCode();
    if (code >= 400) {
      console.warn("\u26A0 phraseSetProjectOwner_ PUT HTTP " + code + ": " + res.getContentText().substring(0, 200));
    } else {
      console.log("\u2022 Project Owner gesetzt: " + projectUid + " ? " + userEmail + " (Phrase id: " + phraseUser.id + ")");
    }
  } catch (e) {
    console.warn("\u26A0 phraseSetProjectOwner_ fehlgeschlagen für " + projectUid + ": " + e.message);
  }
}

/**
 * Setzt ein Custom Field am Projekt anhand des Feldnamens statt UID.
 * Gleiches GET-dann-PUT-Muster wie phraseSetProjectCreator_.
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 */
function phraseSetProjectCustomFieldByName_(projectUid, fieldName, value) {
  if (!projectUid || !fieldName || value === undefined || value === null || value === "") return;

  try {
    var cfDefs = phraseGetCustomFieldDefinitionsMap_(); // { uid: name }
    var fieldUid = null;
    for (var uid in cfDefs) {
      if (cfDefs[uid] === fieldName) { fieldUid = uid; break; }
    }
    if (!fieldUid) {
      // Cache kann bis zu 6h alt sein - bei neu angelegten Custom Fields
      // einmal mit erzwungenem Refresh nachschlagen, bevor aufgegeben wird.
      cfDefs = phraseGetCustomFieldDefinitionsMap_(true);
      for (var uid2 in cfDefs) {
        if (cfDefs[uid2] === fieldName) { fieldUid = uid2; break; }
      }
    }
    if (!fieldUid) {
      console.warn("phraseSetProjectCustomFieldByName_: Custom Field '" + fieldName + "' nicht gefunden.");
      return;
    }

    var getUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/customFields?pageSize=50");
    var getRes = phraseFetchJson_(getUrl, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var instances = (getRes && Array.isArray(getRes.content)) ? getRes.content : (Array.isArray(getRes) ? getRes : []);

    var instanceUid = null;
    for (var i = 0; i < instances.length; i++) {
      var instFieldUid = instances[i].customField && instances[i].customField.uid;
      if (instFieldUid === fieldUid) { instanceUid = instances[i].uid; break; }
    }

    var putUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/customFields");
    var putPayload = instanceUid
      ? { updateInstances: [{ customFieldInstance: { uid: instanceUid }, customField: { uid: fieldUid }, value: value }] }
      : { addInstances: [{ customField: { uid: fieldUid }, value: value }] };

    var putRes = UrlFetchApp.fetch(putUrl, {
      method: "put",
      contentType: "application/json",
      headers: { Authorization: getPhraseAuthHeader_() },
      payload: JSON.stringify(putPayload),
      muteHttpExceptions: true
    });

    var putCode = putRes.getResponseCode();
    if (putCode >= 400) {
      console.warn("phraseSetProjectCustomFieldByName_ PUT HTTP " + putCode + " (" + fieldName + "): " + putRes.getContentText().substring(0, 200));
    } else {
      console.log("Custom Field gesetzt: " + fieldName + " = '" + value + "' (" + projectUid + ")");
    }
  } catch (e) {
    console.warn("phraseSetProjectCustomFieldByName_ fehlgeschlagen (" + fieldName + "): " + e.message);
  }
}

/**
 * Liefert { optionValue: optionUid } fuer ein Custom Field (SINGLE_SELECT /
 * MULTI_SELECT). Gleiches Cache-Muster wie phraseGetCustomFieldDefinitionsMap_,
 * da /customFields (Liste) die Options-Liste je Feld auf 5 Eintraege
 * abschneidet ("truncatedOptions") - hier wird stattdessen der dedizierte
 * Options-Endpoint mit voller Pagination abgefragt.
 */
function phraseGetCustomFieldOptionsMap_(fieldUid, forceRefresh) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "phrase_cf_opts_" + fieldUid;
  if (!forceRefresh) {
    var cached = cache.get(cacheKey);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
  }
  var map = {};
  var pageNumber = 0;
  while (true) {
    var url = phraseApiUrlV1_(
      "/customFields/" + encodeURIComponent(fieldUid) + "/options?pageNumber=" + pageNumber + "&pageSize=50"
    );
    var res = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var content = (res && res.content) || [];
    content.forEach(function(o) {
      if (o.uid && o.value) map[o.value] = o.uid;
    });
    if (content.length < 50) break;
    pageNumber++;
    if (pageNumber >= 10) break;
  }
  try { cache.put(cacheKey, JSON.stringify(map), 21600); } catch (e) {}
  return map;
}

/**
 * Setzt ein SINGLE_SELECT (bzw. MULTI_SELECT) Custom Field am Projekt anhand
 * des Feldnamens UND des Options-Textes (nicht der UID) - beides wird live
 * gegen Phrase aufgeloest. Gleiches GET-dann-PUT-Muster wie
 * phraseSetProjectCustomFieldByName_, nutzt aber "selectedOptions" statt
 * "value" (laut Phrase-API-Schema ist "value" nur fuer STRING/NUMBER/URL-
 * Felder vorgesehen, SELECT-Felder erwarten eine UidReference-Liste).
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 */
function phraseSetProjectSingleSelectFieldByName_(projectUid, fieldName, optionValue) {
  if (!projectUid || !fieldName || !optionValue) return;

  try {
    var cfDefs = phraseGetCustomFieldDefinitionsMap_(); // { uid: name }
    var fieldUid = null;
    for (var uid in cfDefs) {
      if (cfDefs[uid] === fieldName) { fieldUid = uid; break; }
    }
    if (!fieldUid) {
      // Cache kann bis zu 6h alt sein - bei neu angelegten Custom Fields
      // einmal mit erzwungenem Refresh nachschlagen, bevor aufgegeben wird.
      cfDefs = phraseGetCustomFieldDefinitionsMap_(true);
      for (var uid2 in cfDefs) {
        if (cfDefs[uid2] === fieldName) { fieldUid = uid2; break; }
      }
    }
    if (!fieldUid) {
      console.warn("phraseSetProjectSingleSelectFieldByName_: Custom Field '" + fieldName + "' nicht gefunden.");
      return;
    }

    var optDefs = phraseGetCustomFieldOptionsMap_(fieldUid);
    var optionUid = optDefs[optionValue];
    if (!optionUid) {
      optDefs = phraseGetCustomFieldOptionsMap_(fieldUid, true);
      optionUid = optDefs[optionValue];
    }
    if (!optionUid) {
      console.warn("phraseSetProjectSingleSelectFieldByName_: Option '" + optionValue + "' auf Feld '" + fieldName + "' nicht gefunden.");
      return;
    }

    var getUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/customFields?pageSize=50");
    var getRes = phraseFetchJson_(getUrl, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var instances = (getRes && Array.isArray(getRes.content)) ? getRes.content : (Array.isArray(getRes) ? getRes : []);

    var instanceUid = null;
    for (var i = 0; i < instances.length; i++) {
      var instFieldUid = instances[i].customField && instances[i].customField.uid;
      if (instFieldUid === fieldUid) { instanceUid = instances[i].uid; break; }
    }

    var putUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/customFields");
    var putPayload = instanceUid
      ? { updateInstances: [{ customFieldInstance: { uid: instanceUid }, customField: { uid: fieldUid }, selectedOptions: [{ uid: optionUid }] }] }
      : { addInstances: [{ customField: { uid: fieldUid }, selectedOptions: [{ uid: optionUid }] }] };

    var putRes = UrlFetchApp.fetch(putUrl, {
      method: "put",
      contentType: "application/json",
      headers: { Authorization: getPhraseAuthHeader_() },
      payload: JSON.stringify(putPayload),
      muteHttpExceptions: true
    });

    var putCode = putRes.getResponseCode();
    if (putCode >= 400) {
      console.warn("phraseSetProjectSingleSelectFieldByName_ PUT HTTP " + putCode + " (" + fieldName + "): " + putRes.getContentText().substring(0, 200));
    } else {
      console.log("Custom Field gesetzt: " + fieldName + " = '" + optionValue + "' (" + projectUid + ")");
    }
  } catch (e) {
    console.warn("phraseSetProjectSingleSelectFieldByName_ fehlgeschlagen (" + fieldName + "): " + e.message);
  }
}

/**
 * Setzt ein JOB-basiertes Custom Field anhand des Feldnamens (z.B. "SCORM
 * File-URL"). Gleiches GET-dann-PUT-Muster wie phraseSetProjectCustomFieldByName_,
 * nur auf Job- statt Projekt-Ebene:
 *   1. GET  /api2/v1/projects/{projectUid}/jobs/{jobUid}/customFields
 *   2. PUT  /api2/v1/projects/{projectUid}/jobs/{jobUid}/customFields
 * Non-blocking: Fehler werden nur geloggt, nie geworfen.
 */
function phraseSetJobCustomFieldByName_(projectUid, jobUid, fieldName, value) {
  if (!projectUid || !jobUid || !fieldName || value === undefined || value === null || value === "") {
    return { ok: false, error: "Fehlende Parameter." };
  }

  try {
    var cfDefs = phraseGetCustomFieldDefinitionsMap_(); // { uid: name }
    var fieldUid = null;
    for (var uid in cfDefs) {
      if (cfDefs[uid] === fieldName) { fieldUid = uid; break; }
    }
    if (!fieldUid) {
      // Cache kann bis zu 6h alt sein - bei neu angelegten Custom Fields
      // einmal mit erzwungenem Refresh nachschlagen, bevor aufgegeben wird.
      cfDefs = phraseGetCustomFieldDefinitionsMap_(true);
      for (var uid2 in cfDefs) {
        if (cfDefs[uid2] === fieldName) { fieldUid = uid2; break; }
      }
    }
    if (!fieldUid) {
      var notFoundMsg = "Custom Field '" + fieldName + "' nicht gefunden (Name prüfen / Feld existiert nicht).";
      console.warn("phraseSetJobCustomFieldByName_: " + notFoundMsg);
      return { ok: false, error: notFoundMsg };
    }

    var basePath = "/projects/" + encodeURIComponent(projectUid) +
      "/jobs/" + encodeURIComponent(jobUid) + "/customFields";

    var getUrl = phraseApiUrlV1_(basePath + "?pageSize=50");
    var getRes = phraseFetchJson_(getUrl, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var instances = (getRes && Array.isArray(getRes.content)) ? getRes.content : (Array.isArray(getRes) ? getRes : []);

    var instanceUid = null;
    for (var i = 0; i < instances.length; i++) {
      var instFieldUid = instances[i].customField && instances[i].customField.uid;
      if (instFieldUid === fieldUid) { instanceUid = instances[i].uid; break; }
    }

    var putUrl = phraseApiUrlV1_(basePath);
    var putPayload = instanceUid
      ? { updateInstances: [{ customFieldInstance: { uid: instanceUid }, customField: { uid: fieldUid }, value: value }] }
      : { addInstances: [{ customField: { uid: fieldUid }, value: value }] };

    var putRes = UrlFetchApp.fetch(putUrl, {
      method: "put",
      contentType: "application/json",
      headers: { Authorization: getPhraseAuthHeader_() },
      payload: JSON.stringify(putPayload),
      muteHttpExceptions: true
    });

    var putCode = putRes.getResponseCode();
    if (putCode >= 400) {
      var putErr = "PUT HTTP " + putCode + ": " + putRes.getContentText().substring(0, 200);
      console.warn("phraseSetJobCustomFieldByName_ " + putErr + " (" + fieldName + ")");
      return { ok: false, error: putErr };
    }
    console.log("Job Custom Field gesetzt: " + fieldName + " = '" + value + "' (Job " + jobUid + ")");
    return { ok: true };
  } catch (e) {
    console.warn("phraseSetJobCustomFieldByName_ fehlgeschlagen (" + fieldName + "): " + e.message);
    return { ok: false, error: e.message };
  }
}

/**
 * Create project from template (v2)
 * POST /api2/v2/projects/applyTemplate/{templateUid}
 */
function phraseCreateProjectFromTemplate_(templateUid, options) {
  const payload = { name: String((options && options.name) || "").trim() };
  if (!payload.name) throw new Error("phraseCreateProjectFromTemplate_: options.name missing");

  if (options && options.note) payload.note = String(options.note);
  if (options && options.sourceLang) payload.sourceLang = String(options.sourceLang);
  if (options && options.dateDue) payload.dateDue = options.dateDue;
  if (options && Array.isArray(options.targetLangs) && options.targetLangs.length) {
    payload.targetLangs = options.targetLangs;
  }

  const url = phraseApiUrlV2_("/projects/applyTemplate/" + encodeURIComponent(templateUid));

  console.log("\u2022 Phrase: Create project from template");
  console.log("   URL:", url);
  console.log("   Payload:", JSON.stringify(payload));

  const result = phraseFetchJson_(url, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: getPhraseAuthHeader_() },
    payload: JSON.stringify(payload)
  });

  const projectUid = result && (result.uid || (result.project && result.project.uid));
  if (!projectUid) throw new Error("Project created but no UID returned: " + JSON.stringify(result));

  return projectUid;
}

/**
 * Upload main file as job (v1)
 * POST /api2/v1/projects/{projectUid}/jobs
 */
function phraseUploadJob_(projectUid, blob, fileName, targetLangs, dueIsoOptional) {
  const mem = {
    targetLangs: Array.isArray(targetLangs) ? targetLangs : String(targetLangs || "").split(",").map(s => s.trim()).filter(Boolean)
  };
  if (dueIsoOptional) mem.due = dueIsoOptional;

  const url = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) + "/jobs");

  console.log("\u2022 Phrase: Upload job");
  console.log("   URL:", url);
  console.log("   targetLangs:", mem.targetLangs.join(", "));
  console.log("   fileName:", fileName);

  const res = UrlFetchApp.fetch(url, {
    method: "post",
    muteHttpExceptions: true,
    headers: {
      Authorization: getPhraseAuthHeader_(),
      Memsource: JSON.stringify(mem),
      "Content-Disposition": "filename*=UTF-8''" + encodeURIComponent(String(fileName || "file")),
      "Content-Type": "application/octet-stream"
    },
    payload: blob.getBytes()
  });

  const code = res.getResponseCode();
  const text = res.getContentText();

  if (code >= 400) {
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j.errorDescription || j.message || j.errorCode || text;
    } catch (e) {}
    throw new Error("Upload Failed (" + code + "): " + msg);
  }

  return JSON.parse(text);
}

/**
 * Upload reference file (v2)
 * POST /api2/v2/projects/{projectUid}/references
 */
function phraseUploadReference_(projectUid, blob, fileName) {
  const boundary = "----PhraseRefBoundary" + Date.now();
  const eol      = "\r\n";
  const name     = String(fileName || "reference");

  let mimeType = blob.getContentType() || "";
  if (!mimeType || mimeType === "application/octet-stream") {
    const ext = name.split(".").pop().toLowerCase();
    const mimeMap = {
      "txt":  "text/plain",
      "pdf":  "application/pdf",
      "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "xml":  "application/xml",
      "html": "text/html",
      "idml": "application/octet-stream"
    };
    mimeType = mimeMap[ext] || "application/octet-stream";
  }

  const encodedName = encodeURIComponent(name);
  const head =
    "--" + boundary + eol +
    'Content-Disposition: form-data; name="file"; filename="' + name + '"; filename*=UTF-8\'\'' + encodedName + eol +
    "Content-Type: " + mimeType + eol + eol;

  const tail = eol + "--" + boundary + "--" + eol;

  const bytes = []
    .concat(Utilities.newBlob(head).getBytes())
    .concat(blob.getBytes())
    .concat(Utilities.newBlob(tail).getBytes());

  const url = phraseApiUrlV2_("/projects/" + encodeURIComponent(projectUid) + "/references");

  console.log("\u2022 Phrase: Upload reference (v2)");
  console.log("   URL:", url);
  console.log("   fileName:", name, "| mimeType:", mimeType);

  const res = UrlFetchApp.fetch(url, {
    method:             "post",
    muteHttpExceptions: true,
    headers: {
      Authorization:  getPhraseAuthHeader_(),
      "Content-Type": "multipart/form-data; boundary=" + boundary
    },
    payload: bytes
  });

  const code = res.getResponseCode();
  const text = res.getContentText();

  if (code >= 400) {
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j.errorDescription || j.message || j.errorCode || text;
    } catch (e) {}
    throw new Error("Reference upload failed (" + code + "): " + msg);
  }

  try { return JSON.parse(text); } catch (e) { return text || { ok: true }; }
}