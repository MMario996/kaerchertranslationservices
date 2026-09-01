/**
 * Watchers.gs
 * Benachrichtigt konfigurierte Watcher-Emails wenn ein Projekt aus einem
 * bestimmten Template erstellt wird.
 *
 * Konfiguration im OPS Sheet (Tab "Watchers"):
 * Spalte A = Email
 * Spalte B = Templates (kommagetrennt ? Name oder UID)
 *
 * Admin APIs:
 *   apiGetWatcherConfig()
 *   apiSaveWatcherConfig(config)
 */

var WATCHERS_SHEET_NAME_ = "Watchers";

// ??? Sheet holen / anlegen ????????????????????????????????????????????????????

function getWatchersSheet_() {
  const ss = openOpsSpreadsheet_();
  let sh = ss.getSheetByName(WATCHERS_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(WATCHERS_SHEET_NAME_);
    sh.appendRow(["Email", "Templates (comma-separated: Name or UID)"]);
    sh.getRange("A1:B1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 280);
    sh.setColumnWidth(2, 600);
    console.log("? Watchers sheet created.");
  }
  return sh;
}

// ??? Config lesen ?????????????????????????????????????????????????????????????

function getWatcherConfig_() {
  try {
    const sh   = getWatchersSheet_();
    const data = sh.getDataRange().getValues();
    const config = [];

    for (let i = 1; i < data.length; i++) {
      const email        = String(data[i][0] || "").trim().toLowerCase();
      const templatesRaw = String(data[i][1] || "").trim();
      if (!email) continue;

      const templates = templatesRaw
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);

      config.push({ email, templates });
    }

    return config;
  } catch(e) {
    console.warn("getWatcherConfig_ error:", e.message);
    return [];
  }
}

// ??? Watcher f?r ein Template ermitteln ??????????????????????????????????????

function getWatchersForTemplate_(templateName, templateUid) {
  if (!templateName && !templateUid) return [];
  const config  = getWatcherConfig_();
  const watchers = [];
  const tName   = String(templateName || "").trim().toLowerCase();
  const tUid    = String(templateUid  || "").trim();

  config.forEach(entry => {
    if (!entry.email || !Array.isArray(entry.templates)) return;
    const matches = entry.templates.some(t => {
      const val      = String(t).trim();
      const valLower = val.toLowerCase();
      return val === tUid ||                    // exakte UID
             valLower === tName ||              // exakter Name
             tName.includes(valLower) ||        // Name enth?lt Eintrag
             valLower.includes(tName);          // Eintrag enth?lt Name
    });
    if (matches) watchers.push(entry.email);
  });

  return [...new Set(watchers)];
}

// ??? Watcher benachrichtigen ?????????????????????????????????????????????????

function notifyWatchers_(templateName, projectName, submitterEmail, projectUid, targetLangs, templateUid) {
  const watchers = getWatchersForTemplate_(templateName, templateUid);
  if (!watchers.length) return;

  const phraseUrl = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);

  const msg = [
    "?? *New project submitted*",
    "",
    "? *Project:* " + projectName,
    "? *Template:* " + templateName,
    "? *Submitted by:* " + submitterEmail,
    "? *Target languages:* " + (Array.isArray(targetLangs) ? targetLangs.join(", ") : targetLangs),
    "? *Phrase ID:* " + projectUid,
    "",
    "? *Open in Phrase TMS:* " + phraseUrl,
    "? *Translation Services Portal:* " + PORTAL_URL_
  ].join("\n");

  watchers.forEach(watcherEmail => {
    if (watcherEmail === String(submitterEmail || "").toLowerCase()) return;
    try {
      sendPrivateMessage_(watcherEmail, msg);
      console.log("? Watcher notified:", watcherEmail, "for template:", templateName);
    } catch(e) {
      console.warn("?? Watcher notification failed for " + watcherEmail + ": " + e.message);
    }
  });
}

// ??? Admin APIs ???????????????????????????????????????????????????????????????

function apiGetWatcherConfig() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");
  return { success: true, config: getWatcherConfig_() };
}

function apiSaveWatcherConfig(configArray) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  if (!Array.isArray(configArray)) throw new Error("Config must be an array.");

  configArray.forEach((entry, i) => {
    if (!entry.email || !entry.email.includes("@")) throw new Error("Invalid email at index " + i);
    if (!Array.isArray(entry.templates)) throw new Error("Templates must be array at index " + i);
  });

  const sh = getWatchersSheet_();

  // Alle Datenzeilen l?schen (ab Zeile 2)
  const lastRow = sh.getLastRow();
  if (lastRow > 1) {
    sh.getRange(2, 1, lastRow - 1, 2).clearContent();
  }

  // Neu schreiben
  if (configArray.length > 0) {
    const rows = configArray.map(entry => [
      entry.email,
      entry.templates.join(", ")
    ]);
    sh.getRange(2, 1, rows.length, 2).setValues(rows);
  }

  logAuditEvent_(caller, "WATCHER_CONFIG_SAVE", "Saved watcher config: " + configArray.length + " entries");
  return { success: true };
}
function testWatcherNotification() {
  notifyWatchers_(
    "Machine Translation",           // templateName ? exakt wie in Queue
    "Test Projekt",                  // projectName
    "mario.magliano@karcher.com",          // submitterEmail ? NICHT du selbst!
    "CaiuDf2pgUanbNT96XwHp2",       // projectUid
    ["en_gb"],                       // targetLangs
    ""                               // templateUid (optional)
  );
}