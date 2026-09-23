/**
 * ImageContextHosting.gs
 *
 * Workaround fuer Phrase-Support-Ticket #243154 (Phrase-intern: DISC-790):
 * Phrase TMS rendert in Excel/Word eingebettete Raster-Bilder (PNG/JPG) nicht
 * im In-Context-Preview des CAT-Editors, egal welcher Import-Filter genutzt
 * wird. Phrase-Support-Option 2: Screenshots extern hosten, die URL statt
 * des Bildes in eine Spalte schreiben, diese Spalte beim Multilingual-Excel-
 * Import als Context-Note-Spalte zuordnen. Voraussetzung (schon erledigt):
 * "Allow loading of external content in editors" unter Access and Security.
 *
 * Nutzt fuer das Hosting dieselbe Firebase-Hosting-Infrastruktur wie
 * FirebaseHostingDeploy.gs (SCORM-Previews, Service-Account-Token aus
 * FirebaseAuth.gs), aber ueber eine eigene, schlanke Deploy-Funktion ohne den
 * dortigen SCORM-spezifischen index.html-Guard/404-Fallback - die bestehende
 * SCORM-Funktion bleibt unangetastet.
 *
 * BILD-EXTRAKTION: SpreadsheetApp.OverGridImage hat KEIN getBlob() (live
 * getestet -> "img.getBlob is not a function"). Apps Script bietet darueber
 * keinen Weg an die Roh-Bytes eines ueber Zellen liegenden Bildes. Deshalb
 * wird das Sheet stattdessen kurz als XLSX exportiert (Drive-Export-Endpoint,
 * mit dem ohnehin vorhandenen Spreadsheets-OAuth-Scope), das XLSX als ZIP
 * entpackt und Bilder + Zeilen-Anker direkt aus den OOXML-Drawing-XMLs
 * (xl/drawings/drawing*.xml + zugehoerige .rels) gelesen - das ist dieselbe
 * Struktur, die auch die echte, hochgeladene .xlsx-Datei hat, das Ergebnis
 * ist also identisch zu einer direkten .xlsx-Verarbeitung.
 *
 * Ablauf:
 *  1. apiHostSheetImagesForContextNotes() exportiert das Google Sheet als
 *     XLSX, extrahiert daraus Bilder + deren Zeilen-Anker.
 *  2. Jedes Bild wird unter einem eigenen, nicht erratbaren Pfad
 *     (context-images/{zufaelliges Token}/...) auf Firebase Hosting
 *     veroeffentlicht.
 *  3. Die oeffentliche URL wird in dieselbe Zeile, gewaehlte Spalte des
 *     LIVE Google Sheets zurueckgeschrieben (SpreadsheetApp, unabhaengig
 *     vom XLSX-Export).
 */

var IMAGE_HOSTING_FOLDER_PREFIX_ = "context-images";
var XDR_NS_ = XmlService.getNamespace("xdr", "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing");
var XDRA_NS_ = XmlService.getNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main");
var XDRR_NS_ = XmlService.getNamespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");

var CONTEXT_IMAGE_FIREBASE_SITE_ = "kaercher-course-preview";

/**
 * Admin-gategter Wrapper um _hostSheetImagesForContextNotes_ - fuer manuelle
 * Tests/Debugging im Apps-Script-Editor (siehe testHostContextImagesTicket243154
 * unten). Der eigentliche, automatische Aufruf beim Projekt-Einreichen (siehe
 * maybeInjectContextImageNotes_ in Upload.gs) laeuft fuer normale Nutzer und
 * ruft deshalb direkt die interne Funktion ohne Admin-Check auf.
 */
function apiHostSheetImagesForContextNotes(spreadsheetId, sheetName, siteId, urlColumn) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  return _hostSheetImagesForContextNotes_(spreadsheetId, sheetName, siteId, urlColumn, caller);
}

/**
 * @param {string} spreadsheetId Google-Sheet-ID (aus der Sheet-URL)
 * @param {string} [sheetName]   Tabellenblatt-Name; leer = erstes Blatt (Tab-Reihenfolge)
 * @param {string} siteId        Firebase-Hosting-Site-ID (z.B. "kaercher-course-preview")
 * @param {number} [urlColumn]   1-basierte Zielspalte fuer die URLs; leer = naechste freie Spalte
 * @param {string} [auditEmail]  Fuer's Audit-Log; faellt sonst auf getUserEmail_() zurueck
 * @return {Object} {success, count, column, results:[{row, imageUrl}], error}
 */
function _hostSheetImagesForContextNotes_(spreadsheetId, sheetName, siteId, urlColumn, auditEmail) {
  if (!spreadsheetId) return { success: false, error: "spreadsheetId missing." };
  if (!siteId) return { success: false, error: "siteId missing." };

  try {
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var targetSheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    if (!targetSheet) return { success: false, error: "Sheet '" + sheetName + "' not found." };

    var xlsxBlob = _exportSpreadsheetAsXlsx_(spreadsheetId);
    var images = _xlsxExtractImagesForSheet_(xlsxBlob, targetSheet.getName());
    if (!images.length) {
      return { success: false, error: "No embedded images found for sheet '" + targetSheet.getName() + "'." };
    }

    var folderToken = Utilities.getUuid().replace(/-/g, "").substring(0, 12);
    var pathPrefix = IMAGE_HOSTING_FOLDER_PREFIX_ + "/" + folderToken;

    var fileEntries = [];
    images.forEach(function (img, idx) {
      var ext = _imgExtFromContentType_(img.blob.getContentType());
      img.fileName = "row" + img.row + "_" + (idx + 1) + ext;
      fileEntries.push({ path: img.fileName, blob: img.blob });
    });

    var accessToken = getFirebaseAccessToken_();
    var deployResult = _deployBlobsToFirebaseHostingPlain_(accessToken, siteId, fileEntries, pathPrefix);

    var col = urlColumn || (targetSheet.getLastColumn() + 1);
    var headerCell = targetSheet.getRange(1, col);
    if (!String(headerCell.getValue() || "").trim()) headerCell.setValue("Screenshot URL");

    var results = [];
    images.forEach(function (img) {
      var url = "https://" + siteId + ".web.app/" + pathPrefix + "/" + img.fileName;
      targetSheet.getRange(img.row, col).setValue(url);
      results.push({ row: img.row, imageUrl: url });
    });

    var colLetter = _columnToLetter_(col);

    logAuditEvent_(auditEmail || getUserEmail_(), "IMAGE_CONTEXT_HOSTING",
      "Hosted " + results.length + " image(s) from sheet " + spreadsheetId + " (" + targetSheet.getName() + ") -> column " + colLetter);

    return { success: true, count: results.length, column: col, columnLetter: colLetter, results: results, deploy: deployResult };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/** 1-basierte Spaltennummer -> Buchstabe(n), z.B. 9 -> "I", 27 -> "AA" (wie Phrase's "Identify ... column"-Felder es erwarten). */
function _columnToLetter_(col) {
  var letter = "";
  while (col > 0) {
    var rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

function _imgExtFromContentType_(ct) {
  ct = String(ct || "").toLowerCase();
  if (ct.indexOf("png")  !== -1) return ".png";
  if (ct.indexOf("jpeg") !== -1 || ct.indexOf("jpg") !== -1) return ".jpg";
  if (ct.indexOf("gif")  !== -1) return ".gif";
  if (ct.indexOf("webp") !== -1) return ".webp";
  return ".png";
}

function _exportSpreadsheetAsXlsx_(spreadsheetId) {
  var url = "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(spreadsheetId) + "/export?format=xlsx";
  var res = UrlFetchApp.fetch(url, {
    headers:             { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions:  true
  });
  if (res.getResponseCode() >= 300) {
    throw new Error("Could not export spreadsheet as XLSX (HTTP " + res.getResponseCode() + ").");
  }
  return res.getBlob().setContentType("application/zip");
}

/**
 * Extrahiert alle ueber Zellen verankerten Bilder EINES Tabellenblatts aus
 * den Rohdaten einer .xlsx-Datei, inkl. 1-basierter Zeilennummer.
 * @param {Blob} xlsxBlob
 * @param {string} sheetName Name des Tabs, wie er im Google Sheet steht.
 * @return {Array<{row:number, blob:Blob}>}
 */
function _xlsxExtractImagesForSheet_(xlsxBlob, sheetName) {
  var files = Utilities.unzip(xlsxBlob);
  var byName = {};
  files.forEach(function (f) { byName[f.getName()] = f; });

  var worksheetFile = _xlsxFindWorksheetFileForName_(byName, sheetName);
  if (!worksheetFile) return [];

  var sheetFileName = worksheetFile.getName(); // "xl/worksheets/sheetN.xml"
  var sheetIndexMatch = sheetFileName.match(/sheet(\d+)\.xml$/);
  if (!sheetIndexMatch) return [];
  var sheetIndex = sheetIndexMatch[1];

  var sheetRelsFile = byName["xl/worksheets/_rels/sheet" + sheetIndex + ".xml.rels"];
  if (!sheetRelsFile) return []; // kein Drawing fuer dieses Blatt verknuepft

  var sheetRelsRoot = XmlService.parse(sheetRelsFile.getDataAsString()).getRootElement();
  var relNs = sheetRelsRoot.getNamespace();
  var drawingRel = sheetRelsRoot.getChildren("Relationship", relNs).filter(function (r) {
    return /\/drawing$/.test(r.getAttribute("Type").getValue());
  })[0];
  if (!drawingRel) return [];

  var drawingTarget = drawingRel.getAttribute("Target").getValue(); // z.B. "../drawings/drawing1.xml"
  var drawingPath = _xlsxResolveRelativePath_("xl/worksheets/", drawingTarget);
  var drawingFile = byName[drawingPath];
  if (!drawingFile) return [];

  var drawingIndexMatch = drawingPath.match(/drawing(\d+)\.xml$/);
  var drawingIndex = drawingIndexMatch ? drawingIndexMatch[1] : "1";
  var drawingRelsFile = byName["xl/drawings/_rels/drawing" + drawingIndex + ".xml.rels"];

  var ridToMedia = {};
  if (drawingRelsFile) {
    var drRelsRoot = XmlService.parse(drawingRelsFile.getDataAsString()).getRootElement();
    var drRelNs = drRelsRoot.getNamespace();
    drRelsRoot.getChildren("Relationship", drRelNs).forEach(function (r) {
      var target = r.getAttribute("Target").getValue();
      ridToMedia[r.getAttribute("Id").getValue()] = _xlsxResolveRelativePath_("xl/drawings/", target);
    });
  }

  var drawRoot = XmlService.parse(drawingFile.getDataAsString()).getRootElement();
  var anchors = drawRoot.getChildren("twoCellAnchor", XDR_NS_)
    .concat(drawRoot.getChildren("oneCellAnchor", XDR_NS_));

  var results = [];
  anchors.forEach(function (anchor) {
    var from = anchor.getChild("from", XDR_NS_);
    if (!from) return;
    var rowEl = from.getChild("row", XDR_NS_);
    var row0 = rowEl ? parseInt(rowEl.getText(), 10) : 0;

    var pic = anchor.getChild("pic", XDR_NS_);
    if (!pic) return;
    var blipFill = pic.getChild("blipFill", XDR_NS_);
    if (!blipFill) return;
    var blip = blipFill.getChild("blip", XDRA_NS_);
    if (!blip) return;
    var embedAttr = blip.getAttribute("embed", XDRR_NS_);
    if (!embedAttr) return;

    var mediaPath = ridToMedia[embedAttr.getValue()];
    if (!mediaPath || !byName[mediaPath]) return;

    results.push({ row: row0 + 1, blob: byName[mediaPath].copyBlob() });
  });

  return results;
}

/** Findet die xl/worksheets/sheetN.xml-Datei, die zum gegebenen Tab-Namen gehoert. */
function _xlsxFindWorksheetFileForName_(byName, sheetName) {
  var workbookFile = byName["xl/workbook.xml"];
  var workbookRelsFile = byName["xl/_rels/workbook.xml.rels"];
  if (!workbookFile || !workbookRelsFile) return null;

  var wbRoot = XmlService.parse(workbookFile.getDataAsString()).getRootElement();
  var wbNs = wbRoot.getNamespace();
  var rNs = XmlService.getNamespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
  var sheetsEl = wbRoot.getChild("sheets", wbNs);
  if (!sheetsEl) return null;

  var sheetEl = sheetsEl.getChildren("sheet", wbNs).filter(function (s) {
    return s.getAttribute("name").getValue() === sheetName;
  })[0];
  if (!sheetEl) sheetEl = sheetsEl.getChildren("sheet", wbNs)[0]; // Fallback: erstes Blatt
  if (!sheetEl) return null;

  var rIdAttr = sheetEl.getAttribute("id", rNs);
  if (!rIdAttr) return null;
  var rId = rIdAttr.getValue();

  var relsRoot = XmlService.parse(workbookRelsFile.getDataAsString()).getRootElement();
  var relNs = relsRoot.getNamespace();
  var rel = relsRoot.getChildren("Relationship", relNs).filter(function (r) {
    return r.getAttribute("Id").getValue() === rId;
  })[0];
  if (!rel) return null;

  var target = rel.getAttribute("Target").getValue(); // z.B. "worksheets/sheet1.xml"
  var path = _xlsxResolveRelativePath_("xl/", target);
  return byName[path] || null;
}

/** Loest ein relatives OOXML-Target (z.B. "../media/image1.png") gegen ein Basisverzeichnis auf. */
function _xlsxResolveRelativePath_(baseDir, target) {
  var parts = baseDir.replace(/\/$/, "").split("/").concat(target.split("/"));
  var resolved = [];
  parts.forEach(function (p) {
    if (p === "" || p === ".") return;
    if (p === "..") resolved.pop();
    else resolved.push(p);
  });
  return resolved.join("/");
}

/**
 * Schlanke Variante von deployBlobsToFirebaseHosting() (FirebaseHostingDeploy.gs):
 * derselbe offizielle 5-Schritte-Ablauf (Version -> Hashes -> populateFiles ->
 * Upload fehlender Hashes -> finalisieren -> Release), aber ohne den dortigen
 * SCORM-spezifischen index.html-Pflicht-Check und ohne 404.html-Fallback -
 * fuer beliebige statische Dateien (hier: Bilder) unter einem eigenen Pfad.
 */
function _deployBlobsToFirebaseHostingPlain_(accessToken, siteId, fileEntries, pathPrefix) {
  var hashToBlob = {};
  var pathToHash = {};
  var prefix = String(pathPrefix || "").replace(/^\/|\/$/g, "");

  fileEntries.forEach(function (entry) {
    var relativePath = "/" + prefix + "/" + String(entry.path || "").replace(/^\/+/, "");
    var gzipped = Utilities.gzip(entry.blob);
    var digestBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, gzipped.getBytes());
    var hash = bytesToHex_(digestBytes);
    pathToHash[relativePath] = hash;
    hashToBlob[hash] = gzipped;
  });

  var versionResp = fbFetch_(accessToken, "post", "/sites/" + siteId + "/versions", {});
  var versionName = versionResp.name;

  var populateResp = fbFetch_(accessToken, "post", "/" + versionName + ":populateFiles", { files: pathToHash });
  var requiredHashes = populateResp.uploadRequiredHashes || [];
  var uploadUrl = populateResp.uploadUrl;

  requiredHashes.forEach(function (hash) {
    var uploadResp = UrlFetchApp.fetch(uploadUrl + "/" + hash, {
      method:             "post",
      headers:            { Authorization: "Bearer " + accessToken, "Content-Type": "application/octet-stream" },
      payload:            hashToBlob[hash].getBytes(),
      muteHttpExceptions: true
    });
    if (uploadResp.getResponseCode() >= 300) {
      throw new Error("Upload failed for hash " + hash + ": " + uploadResp.getContentText());
    }
  });

  fbFetch_(accessToken, "patch", "/" + versionName + "?updateMask=status", { status: "FINALIZED" });
  fbFetch_(accessToken, "post", "/sites/" + siteId + "/releases?versionName=" + encodeURIComponent(versionName), null);

  return { versionName: versionName, uploadedFileCount: requiredHashes.length, totalFileCount: fileEntries.length };
}

// ============================================================================
// Automatischer Einsatz beim Einreichen (Upload.gs -> apiCreateProjectAndUpload)
// ============================================================================

/**
 * Ein Template gilt als "Context-Image-Template" (Phrase-Ticket #243154-
 * Workaround), wenn sein Name das Tag "[CH]" enthaelt - analog zu
 * isPivotTemplateName_() in PivotProjects.gs.
 */
function isContextImageTemplateName_(templateName) {
  return /\[CH\]/i.test(String(templateName || ""));
}

/**
 * Wird von apiCreateProjectAndUpload() (Upload.gs) VOR dem eigentlichen
 * Datei-Upload aufgerufen. Fuer jede Hauptdatei, die als per Drive
 * ausgewaehltes Google Sheet vorliegt (nicht: PC-Upload, nicht: fertige
 * .xlsx-Datei aus Drive), werden die eingebetteten Screenshots gehostet und
 * die URL-Spalte direkt in dieses Sheet geschrieben - BEVOR der normale
 * Upload-Code das Sheet als .xlsx exportiert und an Phrase schickt. Der
 * Nutzer bekommt davon nichts mit; die Datei selbst wird nicht ausgetauscht,
 * nur ihr Inhalt (eine zusaetzliche Spalte) vor dem Export ergaenzt.
 *
 * Fail-safe: Jeder Fehler wird nur geloggt, NIE geworfen - eine kaputte
 * Bilder-Extraktion darf eine normale Projekt-Einreichung nicht blockieren.
 */
function maybeInjectContextImageNotes_(mainFiles, templateName) {
  if (!isContextImageTemplateName_(templateName)) return;
  if (!Array.isArray(mainFiles)) return;

  mainFiles.forEach(function (f) {
    try {
      var meta = resolveFileMeta_(f);
      if (meta.source !== "drive" && meta.source !== "drivelink") return; // nur Drive-Dateien betroffen
      if (!meta.fileId) return;

      var driveFile = DriveApp.getFileById(meta.fileId);
      if (driveFile.getMimeType() !== MimeType.GOOGLE_SHEETS) return; // PC-Uploads/fertige .xlsx bleiben unveraendert

      var result = _hostSheetImagesForContextNotes_(
        meta.fileId, null, CONTEXT_IMAGE_FIREBASE_SITE_, null, "system:" + (meta.fileName || meta.fileId)
      );
      if (result.success) {
        console.log("• Context images auto-hosted for '" + driveFile.getName() + "': " +
          result.count + " image(s) → column " + result.columnLetter);
      } else {
        console.log("• Context-image auto-injection skipped for '" + driveFile.getName() + "': " + result.error);
      }
    } catch (e) {
      console.warn("⚠ Context-image auto-injection failed (submitting file unchanged): " + e.message);
    }
  });
}

/**
 * Test-/Editor-Funktion fuer Phrase-Ticket #243154: mit der von Mario
 * verlinkten Google-Sheet-Kopie der SINGLELANG_TranslationWB_TESTING_MARIO.xlsx.
 */
function testHostContextImagesTicket243154() {
  var result = apiHostSheetImagesForContextNotes(
    "1p7rfYZjPgqif9o0Bk-etUZSPKgGqyFcTARS2v5f79GE",
    null,
    CONTEXT_IMAGE_FIREBASE_SITE_,
    null
  );
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
