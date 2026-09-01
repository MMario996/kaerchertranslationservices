function repairQueueDataAlignment() {
  const props = PropertiesService.getScriptProperties();
  const opsId = String(props.getProperty("OPS_SHEET_ID") || "").trim();
 
  if (!opsId) {
    throw new Error("OPS_SHEET_ID fehlt in Script Properties.");
  }


  const ss = SpreadsheetApp.openById(opsId);
  const sh = ss.getSheetByName("Queue");
 
  if (!sh) {
    throw new Error("Queue sheet nicht gefunden.");
  }


  const lastRow = sh.getLastRow();
 
  if (lastRow < 2) {
    return { ok: true, message: "Keine Daten zum Reparieren." };
  }


  // Alle Daten lesen
  const data = sh.getRange(1, 1, lastRow, 19).getValues();
  const header = data[0];
 
  console.log("? Checking queue data alignment...");
 
  let repairedCount = 0;
  const repairedRows = [header]; // Header behalten
 
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
   
    // Check if first column (Timestamp) looks wrong
    const firstCol = String(row[0] || "").trim();
   
    // Timestamp sollte ISO format sein oder leer
    const isValidTimestamp = !firstCol ||
                            firstCol.includes("T") ||
                            firstCol.match(/^\d{4}-\d{2}-\d{2}/);
   
    if (!isValidTimestamp && firstCol.length > 0) {
      // Daten sind verschoben! Reparieren:
      console.log(`?? Row ${i+1} needs repair. First col: "${firstCol}"`);
     
      // Neue Zeile mit korrekter Ausrichtung
      const repairedRow = [
        new Date().toISOString(),  // A: Timestamp (neu generieren)
        "",                         // B: User Email (unbekannt, aus Project-Creator ableiten)
        firstCol,                   // C: Project UID (war in Spalte A)
        row[1] || "",              // D: File ID (war in Spalte B)
        row[2] || "",              // E: File Name (war in Spalte C)
        row[3] || "",              // F: Mime Type (war in Spalte D)
        row[4] || "",              // G: Target Lang (war in Spalte E)
        row[5] || "UPLOADED",      // H: Status (war in Spalte F)
        row[6] || "",              // I: Job UID (war in Spalte G)
        row[7] || "",              // J: Async ID
        row[8] || "",              // K: Notification Email
        row[9] || "",              // L: Project Name
        row[10] || "",             // M: Due Date
        row[11] || "",             // N: CC Email
        row[12] || "",             // O: Analysis UID
        row[13] || "",             // P: Total Words
        row[14] || "",             // Q: Net Words
        row[15] || "",             // R: Shared With
        row[16] || ""              // S: Template Name
      ];
     
      repairedRows.push(repairedRow);
      repairedCount++;
     
    } else {
      // Zeile ist OK, behalten
      repairedRows.push(row);
    }
  }
 
  if (repairedCount > 0) {
    console.log(`? Repairing ${repairedCount} rows...`);
   
    // Backup erstellen
    const backupName = `Queue_Backup_${new Date().toISOString().slice(0,10)}`;
    sh.copyTo(ss).setName(backupName);
    console.log(`? Backup created: ${backupName}`);
   
    // Reparierte Daten schreiben
    sh.clear();
    sh.getRange(1, 1, repairedRows.length, 19).setValues(repairedRows);
   
    return {
      ok: true,
      message: `${repairedCount} rows repaired. Backup: ${backupName}`
    };
   
  } else {
    return {
      ok: true,
      message: "All rows are correctly aligned. No repair needed."
    };
  }
}


/**
 * Alternative: Spezifische Zeile reparieren
 */
function repairSpecificProject(projectIdentifier) {
  const props = PropertiesService.getScriptProperties();
  const opsId = String(props.getProperty("OPS_SHEET_ID") || "").trim();
  const ss = SpreadsheetApp.openById(opsId);
  const sh = ss.getSheetByName("Queue");
 
  const data = sh.getDataRange().getValues();
 
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
   
    // Suche nach Project Name oder UID
    if (String(row[0]).includes(projectIdentifier) ||
        String(row[9]).includes(projectIdentifier)) {
     
      console.log(`Found project at row ${i+1}:`, row.slice(0, 5));
     
      // Zeige die Job UIDs
      const jobUidCol = String(row[6] || "").trim(); // Sollte in Spalte I sein (Index 8), aber ist in G (Index 6)
      console.log("Job UIDs (current position):", jobUidCol);
     
      return {
        rowIndex: i + 1,
        projectName: row[0],
        currentJobUids: jobUidCol,
        needsRepair: !String(row[0]).match(/^\d{4}-\d{2}-\d{2}/)
      };
    }
  }
 
  return { ok: false, message: "Project not found" };
}


/**
 * Debug: Zeige erste 3 Zeilen der Queue
 */
function debugQueueData() {
  const props = PropertiesService.getScriptProperties();
  const opsId = String(props.getProperty("OPS_SHEET_ID") || "").trim();
  const ss = SpreadsheetApp.openById(opsId);
  const sh = ss.getSheetByName("Queue");
 
  const data = sh.getRange(1, 1, Math.min(4, sh.getLastRow()), 19).getValues();
 
  console.log("=== Queue Data Debug ===");
  data.forEach((row, i) => {
    console.log(`Row ${i}:`);
    console.log("  A (Timestamp):", row[0]);
    console.log("  B (User):", row[1]);
    console.log("  C (Project UID):", row[2]);
    console.log("  I (Job UIDs):", row[8]);
    console.log("  L (Project Name):", row[11]);
    console.log("---");
  });
 
  return { ok: true, rowCount: data.length };
}

