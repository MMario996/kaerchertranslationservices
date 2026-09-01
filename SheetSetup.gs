/**
 * SheetSetup.gs
 *
 * Run setupSheetDocumentation() ONCE to add a "README" sheet to the
 * Admin/Access spreadsheet that explains every sheet and its purpose.
 *
 * ??? SHEET OVERVIEW ??????????????????????????????????????????????????????????
 *
 * ACCESS SHEET  (contains config, whitelists, templates)
 * ?????????????????????????????????????????????????????
 *  FetchTemplate-Prod    Templates imported from Phrase TMS (used in production).
 *                        Column "Active (Yes/No)" controls which templates users see.
 *                        Use "Sync Templates" in Admin Console to refresh.
 *
 *  Whitelist             Standard access list. Users here see the "New Request" tab.
 *                        Any user NOT listed here (and not Admin/Marketing) is blocked.
 *
 *  Whitelist_Marketing   Marketing-exclusive access. Users here see ONLY the
 *                        "Marketing Projects" tab. "New Request" is hidden for them.
 *
 *  Whitelist_<PageID>    One sheet per custom page (created via Admin Console).
 *                        Users here see ONLY that custom tab. Auto-named by page ID.
 *
 *  Custom_Pages          Registry of custom request pages created via Admin Console.
 *                        Columns: PageID (internal), PageName (shown as tab label).
 *
 *  Maintenance           Scheduled maintenance windows. If a row has Active=TRUE
 *                        and the current time is within Start?End, all non-admin
 *                        users see a lock screen.
 *
 *  TMS_USERS             Read-only user list synced from Phrase TMS.
 *                        Used for future "Sync Users" functionality.
 *
 *  FetchTemplate-Test    Sandbox template list for testing. Not used in production.
 *
 * OPS SHEET  (contains upload log / project submissions)
 * ??????????????????????????????????????????????????????
 *  Queue                 Every submitted project gets one row here.
 *                        This is the source of truth for "My Projects" tab
 *                        and the System Logs in Admin Console.
 *
 *                        Column layout:
 *                        A  Timestamp       When the project was submitted
 *                        B  User Email      Who submitted it
 *                        C  Project UID     Phrase TMS project ID
 *                        D  File ID         Google Drive ID (or "pc_upload")
 *                        E  File Name       Original filename
 *                        F  Mime Type       File content type
 *                        G  Target Lang     Comma-separated target languages
 *                        H  Status          UPLOADED / NOTIFIED / COMPLETED / etc.
 *                        I  Job UIDs        JSON array of Phrase job IDs
 *                        J  Async ID        (internal, usually empty)
 *                        K  Notification    Email that receives status updates
 *                        L  Project Name    Name shown in the portal
 *                        M  Due Date        ISO date string
 *                        N  CC Email        Optional second notification address
 *                        O  Analysis UID    (reserved)
 *                        P  Total Words     (reserved for future word count sync)
 *                        Q  Net Words       (reserved)
 *                        R  Shared With     Comma-sep emails with shared access
 *                        S  Template Name   Which template was used
 *
 *  ERRORS                Reserved for future error logging. Currently unused.
 */

/**
 * Run this once to insert a README sheet into the Access spreadsheet.
 * Safe to re-run ? it overwrites the sheet if it already exists.
 */
function setupSheetDocumentation() {
  const props    = PropertiesService.getScriptProperties();
  const accessId = props.getProperty("ACCESS_SHEET_ID");
  const opsId    = props.getProperty("OPS_SHEET_ID");

  if (!accessId) throw new Error("ACCESS_SHEET_ID missing from Script Properties.");
  if (!opsId)    throw new Error("OPS_SHEET_ID missing from Script Properties.");

  _writeReadme_(SpreadsheetApp.openById(accessId), "ACCESS");
  _writeReadme_(SpreadsheetApp.openById(opsId),    "OPS");

  return "? README sheets created in both spreadsheets.";
}

function _writeReadme_(ss, type) {
  let sh = ss.getSheetByName("? README");
  if (sh) ss.deleteSheet(sh);
  sh = ss.insertSheet("? README", 0); // insert as first sheet

  sh.setTabColor("#FFED00");

  if (type === "ACCESS") {
    const rows = [
      ["TRANSLATION HUB ? ACCESS & CONFIG SPREADSHEET", "", ""],
      ["", "", ""],
      ["This spreadsheet controls who can use the portal and which templates are shown.", "", ""],
      ["", "", ""],
      ["SHEET NAME", "PURPOSE", "EDIT VIA"],
      ["FetchTemplate-Prod", "Active templates from Phrase TMS. Set 'Active' column to Yes/No to show/hide templates in the portal.", "Admin Console ? Sync Templates, or edit directly"],
      ["Whitelist", "Standard access. Users here see the 'New Request' tab.", "Admin Console ? User Whitelist"],
      ["Whitelist_Marketing", "Marketing-exclusive access. Users here see ONLY 'Marketing Projects' tab. 'New Request' is hidden.", "Admin Console ? Marketing Projects Whitelist"],
      ["Whitelist_<PageID>", "Custom page access. One sheet per custom page. Users here see ONLY that tab.", "Admin Console ? (page card)"],
      ["Custom_Pages", "Registry of custom request tabs created in the portal. Do not edit manually.", "Admin Console ? Add Custom Request Page"],
      ["Maintenance", "Scheduled downtime. If Active=TRUE and current time is within the window, all non-admin users are locked out.", "Admin Console ? Maintenance Mode"],
      ["TMS_USERS", "User list synced from Phrase TMS. Read-only. Used for future user sync.", "Admin Console ? Sync Users"],
      ["FetchTemplate-Test", "Test/sandbox templates. Not used in production.", "Manual"],
      ["", "", ""],
      ["IMPORTANT", "", ""],
      ["Admin emails are stored in Script Properties (ADMIN_EMAILS), not in any sheet.", "", ""],
      ["Do NOT rename any sheet ? the application code references sheets by their exact name.", "", ""],
    ];
    sh.getRange(1, 1, rows.length, 3).setValues(rows);

    // Formatting
    sh.getRange("A1").setFontSize(14).setFontWeight("bold");
    sh.getRange("A5:C5").setFontWeight("bold").setBackground("#FFED00");
    sh.getRange("A15:C15").setFontWeight("bold").setBackground("#f5f5f5");
    sh.setColumnWidth(1, 250);
    sh.setColumnWidth(2, 500);
    sh.setColumnWidth(3, 280);

  } else if (type === "OPS") {
    const rows = [
      ["TRANSLATION HUB ? UPLOADS / OPS SPREADSHEET", ""],
      ["", ""],
      ["This spreadsheet is the live database of all submitted translation projects.", ""],
      ["", ""],
      ["SHEET NAME", "PURPOSE"],
      ["Queue", "One row per submitted project. Source of truth for 'My Projects' tab and System Logs."],
      ["ERRORS", "Reserved for future error logging. Currently unused."],
      ["", ""],
      ["QUEUE COLUMN REFERENCE", ""],
      ["A  Timestamp",      "When the project was submitted (ISO 8601)"],
      ["B  User Email",     "Who submitted it"],
      ["C  Project UID",    "Phrase TMS project ID (click to open in Phrase)"],
      ["D  File ID",        "Google Drive file ID, or 'pc_upload' for direct uploads"],
      ["E  File Name",      "Original filename"],
      ["F  Mime Type",      "File content type (e.g. application/pdf)"],
      ["G  Target Lang",    "Comma-separated target languages (e.g. fr, es, it)"],
      ["H  Status",         "UPLOADED ? ASSIGNED ? NOTIFIED ? COMPLETED"],
      ["I  Job UIDs",       "JSON array of Phrase job IDs ? needed for file download"],
      ["J  Async ID",       "Internal Phrase async request ID (usually empty after completion)"],
      ["K  Notification",   "Email address that receives status update notifications"],
      ["L  Project Name",   "Display name shown in the portal"],
      ["M  Due Date",       "Requested delivery date"],
      ["N  CC Email",       "Optional second notification email"],
      ["O  Analysis UID",   "Reserved for future word count analysis"],
      ["P  Total Words",    "Reserved"],
      ["Q  Net Words",      "Reserved"],
      ["R  Shared With",    "Comma-sep emails that were granted shared view access"],
      ["S  Template Name",  "Which Phrase template was used"],
      ["", ""],
      ["Do NOT delete rows ? set Status to CANCELLED instead.", ""],
    ];
    sh.getRange(1, 1, rows.length, 2).setValues(rows);

    sh.getRange("A1").setFontSize(14).setFontWeight("bold");
    sh.getRange("A5:B5").setFontWeight("bold").setBackground("#FFED00");
    sh.getRange("A9:B9").setFontWeight("bold").setBackground("#f5f5f5");
    sh.setColumnWidth(1, 200);
    sh.setColumnWidth(2, 600);
  }

  // Freeze top row
  sh.setFrozenRows(1);
  console.log(`? README written to "${ss.getName()}" (${type})`);
}

/**
 * Also fix the Queue sheet header to match the 19-column format the code actually writes.
 * Run fixQueueHeader() if your Queue sheet has the old 13-column header.
 */
function fixQueueHeader() {
  const props = PropertiesService.getScriptProperties();
  const opsId = props.getProperty("OPS_SHEET_ID");
  if (!opsId) throw new Error("OPS_SHEET_ID missing.");

  const ss = SpreadsheetApp.openById(opsId);
  const sh = ss.getSheetByName("Queue");
  if (!sh) throw new Error("Queue sheet not found.");

  const correctHeader = [
    "Timestamp",        // A
    "User Email",       // B
    "Project UID",      // C
    "File ID (Source)", // D
    "File Name",        // E
    "Mime Type",        // F
    "Target Lang",      // G
    "Status",           // H
    "Job UIDs",         // I  (JSON array)
    "Async ID",         // J
    "Notification Email", // K
    "Project Name",     // L
    "Due Date",         // M
    "CC Email",         // N
    "Analysis UID",     // O
    "Total Words",      // P
    "Net Words",        // Q
    "Shared With",      // R
    "Template Name"     // S
  ];

  // Only update the header row, never touch data
  const current = sh.getRange(1, 1, 1, 19).getValues()[0];
  const isEmpty  = current.every(c => !c);
  const isTooShort = current.filter(Boolean).length < 19;

  if (isEmpty || isTooShort) {
    sh.getRange(1, 1, 1, correctHeader.length).setValues([correctHeader]);
    sh.getRange(1, 1, 1, correctHeader.length)
      .setFontWeight("bold")
      .setBackground("#FFED00");
    sh.setFrozenRows(1);
    return "? Queue header updated to 19 columns.";
  }

  return "?? Queue header already has data ? not changed. Review manually.";
}