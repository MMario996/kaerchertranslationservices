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
// --- Default templates --------------------------------------------------------
var DEFAULT_TEMPLATES_ = {
  MSG_WELCOME: {
    de: [
      "\u2022 *Willkommen bei Translation Services!*",
      "",
      "Du erhältst hier automatische Benachrichtigungen wenn:",
      "\u2713 Dein Projekt erfolgreich eingereicht wurde",
      "\u2022 Deine Übersetzung zum Download bereit ist",
      "\u2022 Ein Kollege ein Projekt mit dir geteilt hat",
      "\u2022 Eine Deadline in 24h abläuft",
      "",
      "\u2022 Dies ist ein reiner Benachrichtigungskanal ? nutze das Portal für alle Aktionen.",
      "\u2022 {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u2022 *Welcome to Translation Services!*",
      "",
      "You will receive automatic notifications here when:",
      "\u2713 Your project has been submitted successfully",
      "\u2022 Your translation is ready to download",
      "\u2022 A colleague shares a project with you",
      "\u2022 A deadline is approaching (24h reminder)",
      "",
      "\u2022 This is a read-only notification channel ? use the Portal for all actions.",
      "\u2022 {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_PROJECT_SUBMITTED: {
    de: [
      "\u2713 *Projekt erfolgreich eingereicht!*",
      "",
      "\u2022 *Projektdetails*",
      "\u2022 *Name:* {{PROJECT_NAME}}",
      "\u2022 *Template:* {{TEMPLATE_NAME}}",
      "\u2022 *Sprachen:* {{SOURCE_LANG}} ? {{TARGET_LANGS}}",
      "\u2022 *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "\u2022 *Dateien & Jobs*",
      "{{FILES}}",
      "",
      "\u2022 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Du erhältst hier eine Antwort sobald deine Übersetzung fertig ist._"
    ].join("\n"),
    en: [
      "\u2713 *Project submitted successfully!*",
      "",
      "\u2022 *Project Details*",
      "\u2022 *Name:* {{PROJECT_NAME}}",
      "\u2022 *Template:* {{TEMPLATE_NAME}}",
      "\u2022 *Languages:* {{SOURCE_LANG}} ? {{TARGET_LANGS}}",
      "\u2022 *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "\u2022 *Files & Jobs*",
      "{{FILES}}",
      "",
      "\u2022 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_You'll receive a reply here when your translation is ready._"
    ].join("\n")
  },
  MSG_COMPLETED: {
    de: [
      "\u2713 *Übersetzung fertig ? bereit zum Download!*",
      "",
      "\u2022 *Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Status:* {{STATUS}}",
      "",
      "Gehe zu *Meine Projekte* im Translation Services Portal um deine Dateien herunterzuladen.",
      "",
      "\u2022 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u2022 *Translation complete ? ready to download!*",
      "",
      "\u2022 *Project:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Status:* {{STATUS}}",
      "",
      "Go to *My Projects* in the Translation Services Portal to download your files.",
      "",
      "\u2022 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_PIVOT_PROJECT_SUBMITTED: {
    de: [
      "✅ *Projekt erfolgreich eingereicht!*",
      "🔗 _Zweistufiges Projekt: zuerst Source-Check, danach wird automatisch die Translation erstellt._",
      "",
      "📊 *Projektdetails*",
      "• *Name:* {{PROJECT_NAME}}",
      "• *Template:* {{TEMPLATE_NAME}}",
      "• *Sprachen:* {{SOURCE_LANG}} → {{TARGET_LANGS}}",
      "• *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "📁 *Dateien & Jobs*",
      "{{FILES}}",
      "",
      "🌐 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Du erhältst hier eine Antwort sobald der Source-Check fertig ist, und danach nochmal sobald die Translation fertig ist._"
    ].join("\n"),
    en: [
      "✅ *Project submitted successfully!*",
      "🔗 _Two-step project: Source-Check first, then Translation is created automatically._",
      "",
      "📊 *Project Details*",
      "• *Name:* {{PROJECT_NAME}}",
      "• *Template:* {{TEMPLATE_NAME}}",
      "• *Languages:* {{SOURCE_LANG}} → {{TARGET_LANGS}}",
      "• *Deadline:* {{DEADLINE}}",
      "{{NOTE_LINE}}",
      "📁 *Files & Jobs*",
      "{{FILES}}",
      "",
      "🌐 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_You'll get a reply here once the Source-Check is done, and another once the Translation is ready._"
    ].join("\n")
  },
  MSG_PIVOT_PARENT_COMPLETED: {
    de: [
      "✅ *Source-Check fertig!*",
      "",
      "📊 *Projekt:* {{PROJECT_NAME}}",
      "• *Phrase ID:* {{PHRASE_ID}}",
      "• *Status:* {{STATUS}}",
      "",
      "Die Translation für die weiteren Zielsprachen wird jetzt automatisch erstellt. Du bekommst in diesem Thread Bescheid, sobald auch diese fertig ist.",
      "",
      "🌐 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "✅ *Source-Check done!*",
      "",
      "📊 *Project:* {{PROJECT_NAME}}",
      "• *Phrase ID:* {{PHRASE_ID}}",
      "• *Status:* {{STATUS}}",
      "",
      "The Translation for the remaining target languages is now being created automatically. You'll get another message in this thread once that's ready too.",
      "",
      "🌐 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_PIVOT_CHILD_COMPLETED: {
    de: [
      "✅ *Übersetzung fertig – bereit zum Download!*",
      "",
      "Beide Schritte (Source-Check und Translation) sind jetzt abgeschlossen.",
      "",
      "📊 *Translation-Projekt:* {{PROJECT_NAME}}",
      "• *Phrase ID:* {{PHRASE_ID}}",
      "• *Status:* {{STATUS}}",
      "",
      "Gehe zu *Meine Projekte* im Translation Services Portal, um deine Dateien herunterzuladen – klappe den Projekt-Container auf, um Source-Check und Translation getrennt zu sehen.",
      "",
      "🌐 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "✅ *Translation complete – ready to download!*",
      "",
      "Both steps (Source-Check and Translation) are now finished.",
      "",
      "📊 *Translation project:* {{PROJECT_NAME}}",
      "• *Phrase ID:* {{PHRASE_ID}}",
      "• *Status:* {{STATUS}}",
      "",
      "Go to *My Projects* in the Translation Services Portal to download your files – expand the project container to see the Source-Check and Translation steps separately.",
      "",
      "🌐 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "🌐 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_SHARED: {
    de: [
      "\u2022 *Ein Projekt wurde mit dir geteilt*",
      "",
      "\u2022 *Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Geteilt von:* {{SHARED_BY}}",
      "",
      "Du kannst jetzt den Status verfolgen und die fertigen Dateien herunterladen im *Translation Services Portal* (Tab: Meine Projekte).",
      "",
      "\u2022 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Du erhältst hier eine Antwort sobald die Übersetzung fertig ist._"
    ].join("\n"),
    en: [
      "\u2022 *A project has been shared with you*",
      "",
      "\u2022 *Project:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Shared by:* {{SHARED_BY}}",
      "",
      "You can now track the status and download the final files in the *Translation Services Portal* (My Projects tab).",
      "",
      "\u2022 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_You'll receive a reply here when the translation is ready to download._"
    ].join("\n")
  },
  MSG_CANCELLED: {
    de: [
      "\u2022 *Projekt storniert*",
      "",
      "\u2022 *Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2713 *Storniert von:* {{UPDATED_BY}}",
      "",
      "Das Projekt wurde in Phrase TMS und im Translation Services Portal storniert.",
      "",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u2022 *Project cancelled*",
      "",
      "\u2022 *Project:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2713 *Cancelled by:* {{UPDATED_BY}}",
      "",
      "The project has been cancelled in Phrase TMS and in the Translation Services Portal.",
      "",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_DUE_DATE_UPDATED: {
    de: [
      "\u2022 *Deadline aktualisiert*",
      "",
      "\u2022 *Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Neue Deadline:* {{NEW_DATE}}",
      "\u2713 *Aktualisiert von:* {{UPDATED_BY}}",
      "",
      "\u2022 {{PHRASE_URL}}",
      "\u2022 {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u2713 *Due Date Updated*",
      "",
      "\u2022 *Project:* {{PROJECT_NAME}}",
      "\u2022 *New Due Date:* {{NEW_DATE}}",
      "\u2713 *Updated by:* {{UPDATED_BY}}",
      "",
      "\u2022 {{PHRASE_URL}}",
      "\u2022 {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_DEADLINE_REMINDER: {
    de: [
      "\u26A0 *Deadline-Erinnerung ? Handlungsbedarf*",
      "",
      "Dein Projekt ist morgen fällig und noch in Bearbeitung.",
      "",
      "\u2022 *Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Status:* {{STATUS}}",
      "\u2022 *Deadline:* {{DEADLINE}}",
      "",
      "\u2022 *Möchtest du die Deadline verlängern?*",
      "1?? Translation Services Portal öffnen (Link unten)",
      "2?? Gehe zu *Meine Projekte*",
      "3?? Klicke auf das ? Kalender-Icon neben deinem Projekt",
      "4?? Wähle ein neues Datum ? es wird automatisch in Phrase TMS übernommen",
      "",
      "\u2022 *In Phrase TMS öffnen:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u26A0 *Deadline Reminder ? Action Required*",
      "",
      "Your project is due tomorrow and is still in progress.",
      "",
      "\u2022 *Project:* {{PROJECT_NAME}}",
      "\u2022 *Phrase ID:* {{PHRASE_ID}}",
      "\u2022 *Status:* {{STATUS}}",
      "\u2022 *Due:* {{DEADLINE}}",
      "",
      "\u2022 *Would you like to extend the deadline?*",
      "1?? Open the Translation Services Portal (link below)",
      "2?? Go to *My Projects*",
      "3?? Click the ? calendar icon next to your project",
      "4?? Select a new due date ? it will update automatically in Phrase TMS",
      "",
      "\u2022 *Open in Phrase TMS:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  },
  MSG_SHARE_CONFIRM: {
    de: [
      "\u2022 *Projekt geteilt* mit {{SHARED_BY}}",
      "Sie können jetzt den Status verfolgen und Dateien herunterladen."
    ].join("\n"),
    en: [
      "\u2022 *Project shared* with {{SHARED_BY}}",
      "They can now view and download files from this project."
    ].join("\n")
  },

  // --- CAMPUS / ARTICULATE PREVIEW -------------------------------------------

  MSG_ARTICULATE_SUBMITTED: {
    de: [
      "\u2022 *Campus-Preview eingerichtet!*",
      "",
      "\u2022 *Kurs:* {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 *Phrase-Projekt:* {{PROJECT_NAME}}",
      "\u2022 *Job-Datei:* {{JOB_FILE}}",
      "\u2022 *Drive-Ordner:* {{FOLDER_NAME}}",
      "\u2022 *Preview-Pfad:* {{PREVIEW_PATH}}",
      "",
      "--------------------",
      "*So funktioniert die Live-Preview*",
      "",
      "1?? Die Übersetzer arbeiten wie gewohnt im Phrase-Editor.",
      "2?? Wann immer du den aktuellen Stand sehen willst: im Portal auf ? *Preview* klicken.",
      "3?? Der Kurs wird mit den aktuellen Übersetzungen neu erzeugt und öffnet sich automatisch.",
      "",
      "\u26A0 Noch nicht übersetzte Segmente bleiben im Originaltext ? die Preview funktioniert also auch mitten in der Übersetzung.",
      "\u26A0 Videos werden aus Performance-Gründen weggelassen; das Vorschaubild bleibt sichtbar.",
      "",
      "\u2022 *Phrase-Projekt öffnen:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Jede neue Preview-Version wird als Antwort in diesem Thread gemeldet._"
    ].join("\n"),
    en: [
      "\u2022 *Campus preview set up!*",
      "",
      "\u2022 *Course:* {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 *Phrase project:* {{PROJECT_NAME}}",
      "\u2022 *Job file:* {{JOB_FILE}}",
      "\u2022 *Drive folder:* {{FOLDER_NAME}}",
      "\u2022 *Preview path:* {{PREVIEW_PATH}}",
      "",
      "--------------------",
      "*How the live preview works*",
      "",
      "1?? Translators work in the Phrase editor as usual.",
      "2?? Whenever you want to see the current state: click ? *Preview* in the portal.",
      "3?? The course is rebuilt with the latest translations and opens automatically.",
      "",
      "\u26A0 Segments that aren't translated yet keep their original text ? so the preview works mid-translation too.",
      "\u26A0 Videos are skipped for performance; the poster image stays visible.",
      "",
      "\u2022 *Open Phrase project:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}",
      "",
      "_Every new preview version will be reported as a reply in this thread._"
    ].join("\n")
  },
  MSG_ARTICULATE_DEPLOYED: {
    de: [
      "\u2022 *Neue Preview-Version veröffentlicht*",
      "",
      "\u2022 {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 {{TIMESTAMP}}",
      "\u2022 *Segmente übersetzt:* {{SEGMENTS}}",
      "\u2022 *Dateien:* {{FILE_COUNT}} ? {{SKIPPED}} übersprungen (Videos)",
      "",
      "\u26A0 *Preview öffnen:* {{LIVE_URL}}",
      "",
      "_Der Link bleibt immer derselbe ? er zeigt stets die neueste Version._"
    ].join("\n"),
    en: [
      "\u2022 *New preview version published*",
      "",
      "\u2022 {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 {{TIMESTAMP}}",
      "\u2022 *Segments translated:* {{SEGMENTS}}",
      "\u2022 *Files:* {{FILE_COUNT}} ? {{SKIPPED}} skipped (videos)",
      "",
      "\u26A0 *Open preview:* {{LIVE_URL}}",
      "",
      "_The link never changes ? it always shows the latest version._"
    ].join("\n")
  },
  MSG_ARTICULATE_COMPLETED: {
    de: [
      "\u2713 *Übersetzung fertig ? finale Preview ist online!*",
      "",
      "\u2022 {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 {{TIMESTAMP}}",
      "\u2022 *Segmente übersetzt:* {{SEGMENTS}}",
      "",
      "Der Job ist in Phrase auf *abgeschlossen* gesprungen ? die Preview wurde automatisch mit dem finalen Stand neu erzeugt.",
      "",
      "\u26A0 *Finale Preview öffnen:* {{LIVE_URL}}",
      "\u2022 *Phrase-Projekt:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n"),
    en: [
      "\u2022 *Translation complete ? final preview is live!*",
      "",
      "\u2022 {{COURSE_NAME}} ({{TARGET_LANGS}})",
      "\u2022 {{TIMESTAMP}}",
      "\u2022 *Segments translated:* {{SEGMENTS}}",
      "",
      "The job moved to *completed* in Phrase ? the preview was rebuilt automatically with the final state.",
      "",
      "\u26A0 *Open final preview:* {{LIVE_URL}}",
      "\u2022 *Phrase project:* {{PHRASE_URL}}",
      "\u2022 *Translation Services Portal:* {{PORTAL_URL}}"
    ].join("\n")
  }
};
// --- Get message template (sheet first, fallback to default) ------------------
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
// --- Admin APIs ---------------------------------------------------------------
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