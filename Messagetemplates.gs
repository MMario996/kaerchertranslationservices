/**
 * MessageTemplates.gs
 * Sheet-basierte Chat Message Templates.
 * Sheet "Message_Templates" in ACCESS_SHEET_ID
 * Columns: KEY | TEXT_DE | TEXT_EN
 *
 * Placeholders: {{PROJECT_NAME}}, {{PHRASE_ID}}, {{SOURCE_LANG}},
 *   {{TARGET_LANGS}}, {{DEADLINE}}, {{TEMPLATE_NAME}}, {{STATUS}},
 *   {{PHRASE_URL}}, {{PORTAL_URL}}, {{SHARED_BY}}, {{UPDATED_BY}},
 *   {{NEW_DATE}}, {{NOTE}}, {{FILES}}
 *
 * Campus-/Articulate-Templates zusaetzlich:
 *   {{COURSE_NAME}}, {{JOB_FILE}}, {{FOLDER_NAME}}, {{PREVIEW_PATH}},
 *   {{SEGMENTS}}, {{FILE_COUNT}}, {{SKIPPED}}, {{LIVE_URL}}, {{TIMESTAMP}}
 */
var MSG_SHEET_NAME_ = "Message_Templates";
var PORTAL_URL_MSG_ = "https://sites.google.com/karcher.com/phrase";
// ??? Default templates ????????????????????????????????????????????????????????
var DEFAULT_TEMPLATES_ = {
  MSG_WELCOME: {
    de: [
      "? *Willkommen bei Translation Services!*",
      "",
      "Du erh?ltst hier automatische Benachrichtigungen wenn:",
      "? Dein Projekt erfolgreich eingereicht wurde",
      "? Deine ?bersetzung zum Download bereit ist",
      "? Ein Kollege ein Projekt mit dir geteilt hat",
      "? Eine Deadline in 24h abl?uft",
      "",
      "? Dies ist ein reiner Benachrichtigungskanal ? nutze das Portal f?r alle Aktionen.",
      "? {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "? *Welcome to Translation Services!*",
      "",
      "You will receive automatic notifications here when:",
      "? Your project has been submitted successfully",
      "? Your translation is ready to download",
      "? A colleague shares a project with you",
      "? A deadline is approaching (24h reminder)",
      "",
      "? This is a read-only notification channel ? use the Portal for all actions.",
      "? {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_PROJECT_SUBMITTED: {
    de: [
      "? *Projekt erfolgreich eingereicht!*",
      "",
      "? *Projektdetails*",
      "? *Name:* {{PROJECT_NAME}}",
      "? *Template:* {{TEMPLATE_NAME}}",
      "? *Sprachen:* {{SOURCE_LANG}} ? {{TARGET_LANGS}}",
      "? *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "? *Dateien & Jobs*",
      "{{FILES}}",
      "",
      "? *In Phrase TMS ?ffnen:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Du erh?ltst hier eine Antwort sobald deine ?bersetzung fertig ist._"
    ].join("\n"),
    en: [
      "? *Project submitted successfully!*",
      "",
      "? *Project Details*",
      "? *Name:* {{PROJECT_NAME}}",
      "? *Template:* {{TEMPLATE_NAME}}",
      "? *Languages:* {{SOURCE_LANG}} ? {{TARGET_LANGS}}",
      "? *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "? *Files & Jobs*",
      "{{FILES}}",
      "",
      "? *Open in Phrase TMS:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_You'll receive a reply here when your translation is ready._"
    ].join("\n")
  },
  MSG_COMPLETED: {
    de: [
      "? *?bersetzung fertig ? bereit zum Download!*",
      "",
      "? *Projekt:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Status:* {{STATUS}}",
      "",
      "Gehe zu *Meine Projekte* im Translation Services Portal um deine Dateien herunterzuladen.",
      "",
      "? *In Phrase TMS ?ffnen:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "? *Translation complete ? ready to download!*",
      "",
      "? *Project:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Status:* {{STATUS}}",
      "",
      "Go to *My Projects* in the Translation Services Portal to download your files.",
      "",
      "? *Open in Phrase TMS:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_SHARED: {
    de: [
      "? *Ein Projekt wurde mit dir geteilt*",
      "",
      "? *Projekt:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Geteilt von:* {{SHARED_BY}}",
      "",
      "Du kannst jetzt den Status verfolgen und die fertigen Dateien herunterladen im *Translation Services Portal* (Tab: Meine Projekte).",
      "",
      "? *In Phrase TMS ?ffnen:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Du erh?ltst hier eine Antwort sobald die ?bersetzung fertig ist._"
    ].join("\n"),
    en: [
      "? *A project has been shared with you*",
      "",
      "? *Project:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Shared by:* {{SHARED_BY}}",
      "",
      "You can now track the status and download the final files in the *Translation Services Portal* (My Projects tab).",
      "",
      "? *Open in Phrase TMS:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_You'll receive a reply here when the translation is ready to download._"
    ].join("\n")
  },
  MSG_CANCELLED: {
    de: [
      "? *Projekt storniert*",
      "",
      "? *Projekt:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Storniert von:* {{UPDATED_BY}}",
      "",
      "Das Projekt wurde in Phrase TMS und im Translation Services Portal storniert.",
      "",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "? *Project cancelled*",
      "",
      "? *Project:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Cancelled by:* {{UPDATED_BY}}",
      "",
      "The project has been cancelled in Phrase TMS and in the Translation Services Portal.",
      "",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_DUE_DATE_UPDATED: {
    de: [
      "? *Deadline aktualisiert*",
      "",
      "? *Projekt:* {{PROJECT_NAME}}",
      "? *Neue Deadline:* {{NEW_DATE}}",
      "? *Aktualisiert von:* {{UPDATED_BY}}",
      "",
      "? {{PHRASE_URL}}",
      "? {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "? *Due Date Updated*",
      "",
      "? *Project:* {{PROJECT_NAME}}",
      "? *New Due Date:* {{NEW_DATE}}",
      "? *Updated by:* {{UPDATED_BY}}",
      "",
      "? {{PHRASE_URL}}",
      "? {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_DEADLINE_REMINDER: {
    de: [
      "?? *Deadline-Erinnerung ? Handlungsbedarf*",
      "",
      "Dein Projekt ist morgen f?llig und noch in Bearbeitung.",
      "",
      "? *Projekt:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Status:* {{STATUS}}",
      "? *Deadline:* {{DEADLINE}}",
      "",
      "? *M?chtest du die Deadline verl?ngern?*",
      "1?? Translation Services Portal ?ffnen (Link unten)",
      "2?? Gehe zu *Meine Projekte*",
      "3?? Klicke auf das ? Kalender-Icon neben deinem Projekt",
      "4?? W?hle ein neues Datum ? es wird automatisch in Phrase TMS ?bernommen",
      "",
      "? *In Phrase TMS ?ffnen:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "?? *Deadline Reminder ? Action Required*",
      "",
      "Your project is due tomorrow and is still in progress.",
      "",
      "? *Project:* {{PROJECT_NAME}}",
      "? *Phrase ID:* {{PHRASE_ID}}",
      "? *Status:* {{STATUS}}",
      "? *Due:* {{DEADLINE}}",
      "",
      "? *Would you like to extend the deadline?*",
      "1?? Open the Translation Services Portal (link below)",
      "2?? Go to *My Projects*",
      "3?? Click the ? calendar icon next to your project",
      "4?? Select a new due date ? it will update automatically in Phrase TMS",
      "",
      "? *Open in Phrase TMS:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_SHARE_CONFIRM: {
    de: [
      "? *Projekt geteilt* mit {{SHARED_BY}}",
      "Sie k?nnen jetzt den Status verfolgen und Dateien herunterladen."
    ].join("\n"),
    en: [
      "? *Project shared* with {{SHARED_BY}}",
      "They can now view and download files from this project."
    ].join("\n")
  },

  // ??? CAMPUS / ARTICULATE PREVIEW ???????????????????????????????????????????

  MSG_ARTICULATE_SUBMITTED: {
    de: [
      "? *Campus-Preview eingerichtet!*",
      "",
      "? *Kurs:* {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? *Phrase-Projekt:* {{PROJECT_NAME}}",
      "? *Job-Datei:* {{JOB_FILE}}",
      "? *Drive-Ordner:* {{FOLDER_NAME}}",
      "? *Preview-Pfad:* {{PREVIEW_PATH}}",
      "",
      "????????????????????",
      "*So funktioniert die Live-Preview*",
      "",
      "1?? Die ?bersetzer arbeiten wie gewohnt im Phrase-Editor.",
      "2?? Wann immer du den aktuellen Stand sehen willst: im Portal auf ? *Preview* klicken.",
      "3?? Der Kurs wird mit den aktuellen ?bersetzungen neu erzeugt und ?ffnet sich automatisch.",
      "",
      "?? Noch nicht ?bersetzte Segmente bleiben im Originaltext ? die Preview funktioniert also auch mitten in der ?bersetzung.",
      "?? Videos werden aus Performance-Gr?nden weggelassen; das Vorschaubild bleibt sichtbar.",
      "",
      "? *Phrase-Projekt ?ffnen:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Jede neue Preview-Version wird als Antwort in diesem Thread gemeldet._"
    ].join("\n"),
    en: [
      "? *Campus preview set up!*",
      "",
      "? *Course:* {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? *Phrase project:* {{PROJECT_NAME}}",
      "? *Job file:* {{JOB_FILE}}",
      "? *Drive folder:* {{FOLDER_NAME}}",
      "? *Preview path:* {{PREVIEW_PATH}}",
      "",
      "????????????????????",
      "*How the live preview works*",
      "",
      "1?? Translators work in the Phrase editor as usual.",
      "2?? Whenever you want to see the current state: click ? *Preview* in the portal.",
      "3?? The course is rebuilt with the latest translations and opens automatically.",
      "",
      "?? Segments that aren't translated yet keep their original text ? so the preview works mid-translation too.",
      "?? Videos are skipped for performance; the poster image stays visible.",
      "",
      "? *Open Phrase project:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Every new preview version will be reported as a reply in this thread._"
    ].join("\n")
  },
  MSG_ARTICULATE_DEPLOYED: {
    de: [
      "? *Neue Preview-Version ver?ffentlicht*",
      "",
      "? {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? {{TIMESTAMP}}",
      "? *Segmente ?bersetzt:* {{SEGMENTS}}",
      "? *Dateien:* {{FILE_COUNT}} ? {{SKIPPED}} ?bersprungen (Videos)",
      "",
      "?? *Preview ?ffnen:* {{LIVE_URL}}",
      "",
      "_Der Link bleibt immer derselbe ? er zeigt stets die neueste Version._"
    ].join("\n"),
    en: [
      "? *New preview version published*",
      "",
      "? {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? {{TIMESTAMP}}",
      "? *Segments translated:* {{SEGMENTS}}",
      "? *Files:* {{FILE_COUNT}} ? {{SKIPPED}} skipped (videos)",
      "",
      "?? *Open preview:* {{LIVE_URL}}",
      "",
      "_The link never changes ? it always shows the latest version._"
    ].join("\n")
  },
  MSG_ARTICULATE_COMPLETED: {
    de: [
      "? *?bersetzung fertig ? finale Preview ist online!*",
      "",
      "? {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? {{TIMESTAMP}}",
      "? *Segmente ?bersetzt:* {{SEGMENTS}}",
      "",
      "Der Job ist in Phrase auf *abgeschlossen* gesprungen ? die Preview wurde automatisch mit dem finalen Stand neu erzeugt.",
      "",
      "?? *Finale Preview ?ffnen:* {{LIVE_URL}}",
      "? *Phrase-Projekt:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "? *Translation complete ? final preview is live!*",
      "",
      "? {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "? {{TIMESTAMP}}",
      "? *Segments translated:* {{SEGMENTS}}",
      "",
      "The job moved to *completed* in Phrase ? the preview was rebuilt automatically with the final state.",
      "",
      "?? *Open final preview:* {{LIVE_URL}}",
      "? *Phrase project:* {{PHRASE_URL}}",
      "? *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  }
};
// ??? Get message template (sheet first, fallback to default) ??????????????????
function getMessageTemplate_(key, lang) {
  var l = (lang === "de") ? "de" : "en";
  try {
    var ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
    );
    var sh = ss.getSheetByName(MSG_SHEET_NAME_);
    if (sh) {
      var data = sh.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === key) {
          var text = String(data[i][l === "de" ? 1 : 2] || "").trim();
          if (text) return text;
        }
      }
    }
  } catch (e) {
    console.warn("MessageTemplates: Sheet read failed, using default:", e.message);
  }
  // Fallback to hardcoded default
  var def = DEFAULT_TEMPLATES_[key];
  if (!def) return "";
  return def[l] || def["en"] || "";
}
/**
 * Fill placeholders in a template string.
 * vars: object with keys matching placeholder names (without {{}})
 */
function fillTemplate_(template, vars) {
  var result = String(template || "");
  var v = vars || {};
  // Always replace PORTAL_URL
  result = result.replace(/\{\{PORTAL_URL\}\}/g, PORTAL_URL_MSG_);
  Object.keys(v).forEach(function(k) {
    var re = new RegExp("\\{\\{" + k + "\\}\\}", "g");
    result = result.replace(re, String(v[k] || ""));
  });
  // Clean up any remaining unfilled placeholders
  result = result.replace(/\{\{[A-Z_]+\}\}/g, "");
  // Clean up NOTE_LINE if empty
  result = result.replace(/\n\n\n/g, "\n\n");
  return result;
}
// ??? Admin APIs ???????????????????????????????????????????????????????????????
function apiGetMessageTemplates() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized.");
  var defaults = [];
  Object.keys(DEFAULT_TEMPLATES_).forEach(function(key) {
    defaults.push({ key: key });
  });
  // Read from sheet
  var sheetData = {};
  try {
    var ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
    );
    var sh = ss.getSheetByName(MSG_SHEET_NAME_);
    if (sh) {
      var data = sh.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var key = String(data[i][0]).trim();
        if (key) {
          sheetData[key] = {
            key: key,
            de: String(data[i][1] || ""),
            en: String(data[i][2] || "")
          };
        }
      }
    }
  } catch (e) {
    console.warn("apiGetMessageTemplates sheet read error:", e.message);
  }
  var result = Object.keys(DEFAULT_TEMPLATES_).map(function(key) {
    return {
      key: key,
      de: (sheetData[key] && sheetData[key].de) || DEFAULT_TEMPLATES_[key].de || "",
      en: (sheetData[key] && sheetData[key].en) || DEFAULT_TEMPLATES_[key].en || "",
      isCustomized: !!sheetData[key]
    };
  });
  return { success: true, templates: result };
}
function apiSaveMessageTemplate(key, textDe, textEn) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized.");
  if (!key || !DEFAULT_TEMPLATES_[key]) throw new Error("Invalid template key: " + key);
  var ss = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
  );
  var sh = ss.getSheetByName(MSG_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(MSG_SHEET_NAME_);
    sh.appendRow(["KEY", "TEXT_DE", "TEXT_EN"]);
    sh.getRange("A1:C1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 220);
    sh.setColumnWidth(2, 500);
    sh.setColumnWidth(3, 500);
  }
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === key) {
      sh.getRange(i + 1, 2).setValue(String(textDe || ""));
      sh.getRange(i + 1, 3).setValue(String(textEn || ""));
      logAuditEvent_(caller, "MSG_TEMPLATE_EDIT", "Updated message template: " + key);
      return { success: true, updated: true };
    }
  }
  sh.appendRow([key, String(textDe || ""), String(textEn || "")]);
  logAuditEvent_(caller, "MSG_TEMPLATE_EDIT", "Created message template: " + key);
  return { success: true, updated: false };
}
function apiResetMessageTemplate(key) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized.");
  try {
    var ss = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty("ACCESS_SHEET_ID")
    );
    var sh = ss.getSheetByName(MSG_SHEET_NAME_);
    if (!sh) return { success: true };
    var data = sh.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]).trim() === key) {
        sh.deleteRow(i + 1);
      }
    }
    logAuditEvent_(caller, "MSG_TEMPLATE_RESET", "Reset template to default: " + key);
  } catch (e) {
    return { success: false, error: e.message };
  }
  return { success: true };
}