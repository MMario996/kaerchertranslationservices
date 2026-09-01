/**
 * ChatHelpers.gs
 * Chat User Mapping ? Sheet-basiert (Notifications Sheet, Spalte C)
 * Script Properties nur noch als Legacy-Fallback
 */

// ??? Mapping lesen ????????????????????????????????????????????????????????????

function getStoredChatUserResourceName_(userEmail) {
  const email = normalizeEmail_(userEmail);
  
  // 1. Notifications Sheet pr?fen (prim?r)
  try {
    const ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
    );
    const sh = ss.getSheetByName("Notifications");
    if (sh) {
      const rows = sh.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0] || "").trim().toLowerCase() === email) {
          const chatId = String(rows[i][2] || "").trim();
          if (chatId && chatId.startsWith("users/")) return chatId;
        }
      }
    }
  } catch(e) {
    console.warn("Sheet lookup fehlgeschlagen:", e.message);
  }

  // 2. Script Properties als Legacy-Fallback
  const fromProps = PropertiesService.getScriptProperties()
    .getProperty("CHAT_USER_MAP__" + email);
  if (fromProps) return fromProps;

  return "";
}

// ??? Mapping speichern ????????????????????????????????????????????????????????

function saveChatUserResourceName_(userEmail, userResourceName) {
  const email    = normalizeEmail_(userEmail);
  const userName = String(userResourceName || "").trim();
  if (!email || !/^users\/.+/.test(userName)) return;

  // Ins Notifications Sheet schreiben (prim?r)
  try {
    const ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
    );
    const sh = ss.getSheetByName("Notifications");
    if (sh) {
      const rows = sh.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0] || "").trim().toLowerCase() === email) {
          sh.getRange(i + 1, 3).setValue(userName);
          return;
        }
      }
      // User noch nicht im Sheet ? neue Zeile anh?ngen
      sh.appendRow([email, "ON", userName]);
      return;
    }
  } catch(e) {
    console.warn("Sheet save fehlgeschlagen:", e.message);
  }

  // Fallback: Script Properties
  PropertiesService.getScriptProperties()
    .setProperty("CHAT_USER_MAP__" + email, userName);
}

// ??? Bulk Resolve: Emails aus Sheet ? Chat IDs via People API ????????????????

function copyPropsToSheet() {
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
  );
  const sh = ss.getSheetByName("Notifications");
  if (!sh) { console.log("? Notifications Sheet nicht gefunden"); return; }

  const rows  = sh.getDataRange().getValues();
  const props = PropertiesService.getScriptProperties().getProperties();
  let written = 0;

  for (let i = 1; i < rows.length; i++) {
    const email = String(rows[i][0] || "").trim().toLowerCase();
    if (!email) continue;

    const chatId = props["CHAT_USER_MAP__" + email];
    if (chatId && chatId.startsWith("users/")) {
      sh.getRange(i + 1, 3).setValue(chatId);
      console.log("?", email, "?", chatId);
      written++;
    }
  }

  SpreadsheetApp.flush();
  console.log("???????????????????????????");
  console.log("? Gesamt ins Sheet geschrieben:", written);
  return { written };
}

function bulkResolveFromSheet() {
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
  );
  const sh = ss.getSheetByName("Notifications");
  if (!sh) { console.log("? Notifications Sheet nicht gefunden"); return; }

  const rows  = sh.getDataRange().getValues();
  const token = ScriptApp.getOAuthToken();
  let resolved = 0;
  let skipped  = 0;
  let failed   = [];

  for (let i = 1; i < rows.length; i++) {
    const email = String(rows[i][0] || "").trim().toLowerCase();
    if (!email || !email.includes("@")) continue;

    // Bereits in Spalte C ? ?berspringen
    const colC = String(rows[i][2] || "").trim();
    if (colC && colC.startsWith("users/")) {
      skipped++;
      continue;
    }

    try {
      const url = "https://people.googleapis.com/v1/people:searchDirectoryPeople"
        + "?query=" + encodeURIComponent(email)
        + "&readMask=emailAddresses,metadata"
        + "&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE";

      const res  = UrlFetchApp.fetch(url, {
        headers: { Authorization: "Bearer " + token },
        muteHttpExceptions: true
      });
      const data = JSON.parse(res.getContentText());

      if (data.people && data.people.length) {
        const chatId = data.people[0].resourceName.replace("people/", "users/");
        sh.getRange(i + 1, 3).setValue(chatId);
        console.log("?", email, "?", chatId);
        resolved++;
      } else {
        failed.push(email);
        sh.getRange(i + 1, 3).setValue("? nicht gefunden");
        console.warn("?? Nicht gefunden:", email);
      }
    } catch(e) {
      if (e.message.includes("Bandwidth")) {
        console.warn("? Bandwidth limit ? warte 5s:", email);
        Utilities.sleep(5000);
        try {
          const url = "https://people.googleapis.com/v1/people:searchDirectoryPeople"
            + "?query=" + encodeURIComponent(email)
            + "&readMask=emailAddresses,metadata"
            + "&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE";
          const res  = UrlFetchApp.fetch(url, {
            headers: { Authorization: "Bearer " + token },
            muteHttpExceptions: true
          });
          const data = JSON.parse(res.getContentText());
          if (data.people && data.people.length) {
            const chatId = data.people[0].resourceName.replace("people/", "users/");
            sh.getRange(i + 1, 3).setValue(chatId);
            console.log("? (retry)", email, "?", chatId);
            resolved++;
          } else {
            failed.push(email);
            sh.getRange(i + 1, 3).setValue("? nicht gefunden");
          }
        } catch(e2) {
          failed.push(email);
          sh.getRange(i + 1, 3).setValue("? " + e2.message);
          console.warn("? (retry failed)", email, ":", e2.message);
        }
      } else {
        failed.push(email);
        sh.getRange(i + 1, 3).setValue("? " + e.message);
        console.warn("?", email, ":", e.message);
      }
    }

    Utilities.sleep(1500);
  }

  SpreadsheetApp.flush();
  console.log("???????????????????????????");
  console.log("?? Skipped:", skipped);
  console.log("? Resolved:", resolved);
  console.log("? Failed:", failed.length);
  if (failed.length) console.log("Failed:", failed.join(", "));
  return { resolved, skipped, failed: failed.length, failedEmails: failed };
}

// ??? Admin API: Bulk Resolve via Button in Admin Console ?????????????????????

function apiResolveChatMappings() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized." };
  try {
    const result = bulkResolveFromSheet();
    return { success: true, ...result };
  } catch(e) {
    return { success: false, error: e.message };
  }
}

// ??? Script Properties bereinigen ????????????????????????????????????????????

function cleanupChatMappingsFromProperties() {
  const props   = PropertiesService.getScriptProperties().getProperties();
  let deleted   = 0;

  Object.keys(props).forEach(key => {
    if (key.startsWith("CHAT_USER_MAP__")) {
      PropertiesService.getScriptProperties().deleteProperty(key);
      deleted++;
      console.log("?? Gel?scht:", key);
    }
  });

  console.log("???????????????????????????");
  console.log("? Gesamt gel?scht:", deleted, "Chat Mappings aus Script Properties");
  return { deleted };
}

// ??? Einzelne Email nachschlagen ??????????????????????????????????????????????

function findIdForEmail() {
  const email = "thilo.parg@karcher.com"; // ? Email ?ndern
  
  const token = ScriptApp.getOAuthToken();
  const url   = "https://people.googleapis.com/v1/people:searchDirectoryPeople"
    + "?query=" + encodeURIComponent(email)
    + "&readMask=emailAddresses,metadata"
    + "&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE";

  const res  = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + token },
    muteHttpExceptions: true
  });
  const data = JSON.parse(res.getContentText());

  if (!data.people || !data.people.length) {
    console.log("? Nicht gefunden:", email);
    return;
  }

  const chatId = data.people[0].resourceName.replace("people/", "users/");
  console.log("? Email:", email);
  console.log("? Chat ID:", chatId);
  return chatId;
}

// ??? Debug Funktionen ?????????????????????????????????????????????????????????

function debugChatAuth() {
  const service = getChatBotService_();
  if (!service) {
    console.log("? Service ist null ? Keys fehlen");
    return;
  }
  console.log("Has Access:", service.hasAccess());
  console.log("Last Error:", service.getLastError());
  if (service.hasAccess()) {
    console.log("? Token OK:", service.getAccessToken().substring(0, 20) + "...");
  }
}

function fixCorruptChatToken() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty("oauth2.TranslationChatBot_v3");
  props.deleteProperty("oauth2.GoogleChatBot");
  console.log("? Korrupte Token gel?scht");

  const service = getChatBotService_();
  if (!service) { console.log("? Service null ? Keys fehlen"); return; }
  console.log("Has Access:", service.hasAccess());
  if (service.hasAccess()) console.log("? Neuer Token erfolgreich generiert!");
}

function testChatMessage() {
  sendPrivateMessage_(
    "axel.ruecker@karcher.com",
    "? Test ? Bot ist wieder online!"
  );
  console.log("? Gesendet");
}

function setChatUserMappingManually() {
  saveChatUserResourceName_(
    "axel.ruecker@karcher.com",
    "users/102946247320120215267"
  );
  console.log("? Mapping gesetzt");
}
function setChatBotKeys() {
  PropertiesService.getScriptProperties().setProperties({
    "CHAT_CLIENT_EMAIL": "sa-automation@p-ak-phrase-tms-bot.iam.gserviceaccount.com",
    "CHAT_PRIVATE_KEY": ""
  });
  console.log("? Keys gesetzt");
}
function DEBUG_checkMapping() {
  const email = "mario.magliano@karcher.com";
  const result = getStoredChatUserResourceName_(email);
  console.log("getStoredChatUserResourceName_ Ergebnis:", JSON.stringify(result));

  // Direkt Sheet pr?fen
  const ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
  );
  const sh = ss.getSheetByName("Notifications");
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === email) {
      console.log("Sheet Row " + i + " ? Spalte C:", JSON.stringify(rows[i][2]));
      break;
    }
  }
}
function DEBUG_checkMapping2() {
  const email = "mario.magliano@karcher.com";

  const accessId = PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID");
  console.log("ACCESS_SHEET_ID:", accessId);

  const ss = SpreadsheetApp.openById(accessId);
  const sh = ss.getSheetByName("Notifications");
  if (!sh) { console.log("? Notifications Sheet NICHT gefunden"); return; }

  const rows = sh.getDataRange().getValues();
  console.log("Zeilen gesamt:", rows.length);

  for (let i = 0; i < Math.min(rows.length, 3); i++) {
    console.log("Row " + i + ":", JSON.stringify(rows[i]));
  }

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === email) {
      console.log("? Gefunden Row " + i);
      console.log("  Spalte A:", JSON.stringify(rows[i][0]));
      console.log("  Spalte B:", JSON.stringify(rows[i][1]));
      console.log("  Spalte C:", JSON.stringify(rows[i][2]));
      return;
    }
  }
  console.log("? Email nicht in Sheet gefunden");
}
function DEBUG_findAxelProp() {
  const v = PropertiesService.getScriptProperties()
    .getProperty("CHAT_USER_MAP__axel.ruecker@karcher.com");
  console.log("Axel Property:", v || "(nicht vorhanden)");
}

function findIdForEmail() {
  const email = "thilo.parg@karcher.com";
  
  const token = ScriptApp.getOAuthToken();
  const url   = "https://people.googleapis.com/v1/people:searchDirectoryPeople"
    + "?query=" + encodeURIComponent(email)
    + "&readMask=emailAddresses,metadata"
    + "&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE";

  const res  = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + token },
    muteHttpExceptions: true
  });
  console.log("HTTP-Code:", res.getResponseCode());
  console.log("Rohantwort:", res.getContentText());
  const data = JSON.parse(res.getContentText());

  if (!data.people || !data.people.length) {
    console.log("? Nicht gefunden:", email);
    return;
  }

  const chatId = data.people[0].resourceName.replace("people/", "users/");
  console.log("? Email:", email);
  console.log("? Chat ID:", chatId);
  return chatId;
}