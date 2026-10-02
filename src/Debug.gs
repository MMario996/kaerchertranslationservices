/**
 * Debug.gs
 *
 * V4: Alle öffentlich aufrufbaren Debug-Funktionen erfordern Admin-Rechte.
 *     Ohne Admin-Check waren diese Funktionen über google.script.run
 *     für jeden authentifizierten User aufrufbar.
 */

function debugEnvironment() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  const result = {};

  // Script identity
  result.scriptId = ScriptApp.getScriptId();
  result.time = new Date().toISOString();

  // Active user (kann in manchen Setups leer sein)
  try {
    result.activeUser = Session.getActiveUser().getEmail() || "";
  } catch (e) {
    result.activeUser = "";
    result.activeUserError = String(e);
  }

  // Script Properties
  const scriptPropsSvc = PropertiesService.getScriptProperties();
  const scriptProps = scriptPropsSvc ? scriptPropsSvc.getProperties() : {};
  result.scriptPropertiesKeys = Object.keys(scriptProps);

  // Token check (ohne Token-Wert zu loggen, nur Länge/Status)
  const token = (scriptProps.PHRASE_API_TOKEN || "").trim();
  result.tokenFound = !!token;
  result.tokenLength = token.length;

  // Other common config keys
  result.hasAccessSheetId = !!(scriptProps.ACCESS_SHEET_ID || "").trim();
  result.hasOpsSheetId = !!(scriptProps.OPS_SHEET_ID || "").trim();
  result.hasAdminEmails = !!(scriptProps.ADMIN_EMAILS || "").trim();
  result.apiBaseUrl = (scriptProps.PHRASE_API_BASE_URL || "").trim();
  result.webAppUrlProp = (scriptProps.WEB_APP_URL || "").trim();

  // User Properties (immer verfügbar)
  try {
    const userProps = PropertiesService.getUserProperties().getProperties();
    result.userPropertiesKeys = Object.keys(userProps);
    // Token mal aus UserProps prüfen (falls versehentlich dort abgelegt)
    const userToken = (userProps.PHRASE_API_TOKEN || "").trim();
    result.userTokenFound = !!userToken;
    result.userTokenLength = userToken.length;
  } catch (e) {
    result.userPropertiesKeys = [];
    result.userPropsError = String(e);
  }

  // Document Properties (kann in Standalone = null sein)
  try {
    const docPropsSvc = PropertiesService.getDocumentProperties();
    if (docPropsSvc && typeof docPropsSvc.getProperties === "function") {
      const docProps = docPropsSvc.getProperties();
      result.documentPropertiesKeys = Object.keys(docProps);
      const docToken = (docProps.PHRASE_API_TOKEN || "").trim();
      result.docTokenFound = !!docToken;
      result.docTokenLength = docToken.length;
    } else {
      result.documentPropertiesKeys = null;
      result.documentPropertiesNote = "No DocumentProperties (standalone project) ? OK";
    }
  } catch (e) {
    result.documentPropertiesKeys = null;
    result.documentPropsError = String(e);
  }

  // Final status
  if (!result.tokenFound) {
    result.tokenStatus = "\u2022 PHRASE_API_TOKEN not found in Script Properties";
  } else if (result.tokenLength < 10) {
    result.tokenStatus = "\u26A0 PHRASE_API_TOKEN found but very short";
  } else {
    result.tokenStatus = "\u2022 PHRASE_API_TOKEN found in Script Properties";
  }

  console.log("===== DEBUG ENVIRONMENT =====");
  console.log(JSON.stringify(result, null, 2));

  return result;
}

/**
 * Gibt die Token-Länge zurück (ohne den Token selbst zu loggen)
 * ? sicher für Logs/Compliance.
 */
function debugTokenLengthOnly() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  const token = (PropertiesService.getScriptProperties().getProperty("PHRASE_API_TOKEN") || "").trim();
  const info = { found: !!token, length: token.length };
  console.log("debugTokenLengthOnly:", JSON.stringify(info));
  return info;
}

/**
 * Listet Script Properties KEYS (nicht Werte!) ? sicher.
 */
function debugListScriptPropertyKeys() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  const props = PropertiesService.getScriptProperties().getProperties();
  const keys = Object.keys(props);
  console.log("Script property keys:", keys);
  return keys;
}

/**
 * Zeigt, ob häufige Vertipper existieren (z.B. PHRASE_API_TOKN).
 */
function debugCheckCommonTypos() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  const props = PropertiesService.getScriptProperties().getProperties();
  const candidates = [
    "PHRASE_API_TOKEN",
    "PHRASE_API_TOKN",
    "PHRASE_TOKEN",
    "MEMSOURCE_API_TOKEN",
    "API_TOKEN"
  ];

  const out = {};
  candidates.forEach(k => {
    const v = (props[k] || "").trim();
    out[k] = { exists: k in props, foundNonEmpty: !!v, length: v.length };
  });

  console.log("debugCheckCommonTypos:", JSON.stringify(out, null, 2));
  return out;
}
function DEBUG_checkChatPref() {
  const result = apiGetChatPreference();
  console.log("Result:", JSON.stringify(result));
  
  const ss = openAccessSS_();
  const sh = ss.getSheetByName("Notifications");
  if (!sh) { console.log("ERROR: Notifications sheet nicht gefunden!"); return; }
  const data = sh.getDataRange().getValues();
  console.log("Sheet Notifications Inhalt:");
  data.forEach((row, i) => console.log("Row " + i + ":", JSON.stringify(row)));
}
function DEBUG_testDeadlineReminder() {
  const userEmail = "mario.magliano@karcher.com";
  
  // Deinen aktuellen Thread-ID aus dem Queue Sheet holen
  // öffne OPS Sheet ? Queue ? Spalte T (Index 19) bei deinem Testprojekt
  const threadId  = "spaces/g7I02SAAAAE/messages/iqi8SArMLW4.iqi8SArMLW4"; // ? anpassen
  const projectUid = "fc7uwq2HFtpOb50CIyqqC5";              // ? anpassen
  
  const projectName = "TESTPROJEKT MARIO";
  const dueDate     = new Date(Date.now() + 2 * 60 * 60 * 1000); // in 2 Stunden
  const formattedDue = dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const phraseUrl   = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

  const reminderText = [
    "\u26A0 *Deadline Reminder ? Action Required*",
    "",
    "Your project is due *tomorrow* and is still in progress.",
    "",
    "\u2022 *Project:* " + projectName,
    "\u2022 *Phrase ID:* " + projectUid,
    "\u2713 *Status:* UPLOADED",
    "\u2022 *Due:* " + formattedDue,
    "",
    "\u2022 *Would you like to extend the deadline?*",
    "Here is how:",
    "1?? Open the *Translation Hub* (link below)",
    "2?? Go to *My Projects*",
    "3?? Click the ? calendar icon next to your project",
    "4?? Select a new due date ? it will update automatically in Phrase TMS",
    "",
    "\u2022 *Open in Phrase TMS:* " + phraseUrl,
    "\u2022 *Open in Translation Hub:* https://sites.google.com/karcher.com/phrase"
  ].join("\n");

  try {
    sendThreadReply_(userEmail, threadId, reminderText);
    console.log("\u2022 Reminder sent!");
  } catch(e) {
    console.log("\u2717 Error:", e.message);
  }
}
/**
 * DEBUG: Sendet manuell die Completion-Notification für ein bestehendes Projekt.
 * Einmal ausführen im Apps Script Editor ? Funktion "DEBUG_sendCompletionNotification" ? Run
 * Danach diese Funktion wieder löschen.
 */
function DEBUG_sendCompletionNotification() {
  // ? Anpassen falls nötig
  const projectUid  = "7rwVmqjodCUPaNkguKWkV2";
  const userEmail   = "mario.magliano@karcher.com";
  const threadId    = "spaces/g7I02SAAAAE/messages/lnlCumVYBIg.lnlCumVYBIg";
  const projectName = "FOR TESTING of Kaercher_Amazon_CV 38_2 Adv";
  const status      = "COMPLETED";
  const phraseUrl   = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

  const msg = fillTemplate_(getMessageTemplate_("MSG_COMPLETED", "en"), {
    PROJECT_NAME: projectName,
    PHRASE_ID:    projectUid,
    STATUS:       status,
    PHRASE_URL:   phraseUrl
  });

  console.log("\u2022 Sending to thread:", threadId);
  console.log("\u2022 Message:", msg);

  try {
    const result = sendThreadReply_(userEmail, threadId, msg);
    console.log("\u2022 Sent! Result:", JSON.stringify(result));
  } catch(e) {
    console.log("\u2717 Thread reply failed:", e.message);
    console.log("\u2022 Trying DM fallback...");
    try {
      const result2 = sendPrivateMessage_(userEmail, msg);
      console.log("\u2022 DM sent! Result:", JSON.stringify(result2));
    } catch(e2) {
      console.log("\u2717 DM also failed:", e2.message);
    }
  }
}
function forceAuth() {
  UrlFetchApp.fetch("https://www.google.com");
}

function DEBUG_testSetProjectOwner() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) { console.log("\u2022 Nur Admin darf das testen."); return; }

  var projectUid = "rXYa7rzz9mGz9pco6xTH43";
  var targetUsername = "AW19869";

  // 1) Vorher-Zustand loggen
  var before = phraseFetchJson_(
    phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)),
    { method: "get", headers: { Authorization: getPhraseAuthHeader_() } }
  );
  console.log("VORHER ? Owner:", JSON.stringify(before.owner || {}));

  // 2) Phrase-User-UID für AW19869 per Username-Lookup holen
  var lookupUrl = phraseApiUrlV1_("/users?userName=" + encodeURIComponent(targetUsername) + "&pageSize=10");
  var lookupRes = phraseFetchJson_(lookupUrl, {
    method: "get",
    headers: { Authorization: getPhraseAuthHeader_() }
  });
  var users = (lookupRes && lookupRes.content) ? lookupRes.content : [];
  var match = users.find(function(u) { return u.userName === targetUsername; });

  if (!match) {
    console.log("\u2022 User '" + targetUsername + "' nicht gefunden. Gefundene Kandidaten:", JSON.stringify(users.map(function(u){return u.userName;})));
    return;
  }
  console.log("\u2022 User gefunden. uid:", match.uid, "| id:", match.id, "| userName:", match.userName);

  // 3) PATCH versuchen ? owner als {uid: ...}
  var patchUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
  var patchPayload = { owner: { uid: match.uid } };

  console.log("\u2022 PATCH Payload:", JSON.stringify(patchPayload));

  var patchRes = UrlFetchApp.fetch(patchUrl, {
    method: "patch",
    contentType: "application/json",
    headers: { Authorization: getPhraseAuthHeader_() },
    payload: JSON.stringify(patchPayload),
    muteHttpExceptions: true
  });

  var code = patchRes.getResponseCode();
  var body = patchRes.getContentText();
  console.log("PATCH HTTP-Code:", code);
  console.log("PATCH Response:", body.substring(0, 500));

  if (code >= 400) {
    console.log("\u2717 PATCH fehlgeschlagen. Versuche Fallback-Payload mit 'id' statt 'uid'...");
    var patchPayload2 = { owner: { id: match.id } };
    var patchRes2 = UrlFetchApp.fetch(patchUrl, {
      method: "patch",
      contentType: "application/json",
      headers: { Authorization: getPhraseAuthHeader_() },
      payload: JSON.stringify(patchPayload2),
      muteHttpExceptions: true
    });
    console.log("Fallback HTTP-Code:", patchRes2.getResponseCode());
    console.log("Fallback Response:", patchRes2.getContentText().substring(0, 500));
  }

  // 4) Nachher-Zustand loggen
  var after = phraseFetchJson_(
    phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)),
    { method: "get", headers: { Authorization: getPhraseAuthHeader_() } }
  );
  console.log("NACHHER ? Owner:", JSON.stringify(after.owner || {}));
}