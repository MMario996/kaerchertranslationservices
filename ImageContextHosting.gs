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
 * Ablauf:
 *  1. apiHostSheetImagesForContextNotes() liest die ueber Zellen "schwebenden"
 *     Bilder aus einem Google Sheet (SpreadsheetApp getImages() - deshalb
 *     muss die Quelle ein Google Sheet sein, keine reine .xlsx-Datei; eine
 *     hochgeladene .xlsx laesst sich dafuer einmalig in Sheets importieren).
 *  2. Jedes Bild wird unter einem eigenen, nicht erratbaren Pfad
 *     (context-images/{zufaelliges Token}/...) auf Firebase Hosting
 *     veroeffentlicht.
 *  3. Die oeffentliche URL wird in dieselbe Zeile, gewaehlte Spalte des
 *     Sheets zurueckgeschrieben.
 */

var IMAGE_HOSTING_FOLDER_PREFIX_ = "context-images";

/**
 * @param {string} spreadsheetId Google-Sheet-ID (aus der Sheet-URL)
 * @param {string} [sheetName]   Tabellenblatt-Name; leer = erstes Blatt
 * @param {string} siteId        Firebase-Hosting-Site-ID (z.B. "kaercher-course-preview")
 * @param {number} [urlColumn]   1-basierte Zielspalte fuer die URLs; leer = naechste freie Spalte
 * @return {Object} {success, count, column, results:[{row, imageUrl}], error}
 */
function apiHostSheetImagesForContextNotes(spreadsheetId, sheetName, siteId, urlColumn) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };

  if (!spreadsheetId) return { success: false, error: "spreadsheetId missing." };
  if (!siteId) return { success: false, error: "siteId missing." };

  try {
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getSheets()[0];
    if (!sheet) return { success: false, error: "Sheet '" + sheetName + "' not found." };

    var images = sheet.getImages();
    if (!images.length) {
      return { success: false, error: "No embedded (over-cell) images found on sheet '" + sheet.getName() + "'." };
    }

    var folderToken = Utilities.getUuid().replace(/-/g, "").substring(0, 12);
    var pathPrefix = IMAGE_HOSTING_FOLDER_PREFIX_ + "/" + folderToken;

    var fileEntries = [];
    var rowForImage = [];
    images.forEach(function (img, idx) {
      var row = img.getAnchorCell().getRow();
      var blob = img.getBlob();
      var ext = _imgExtFromContentType_(blob.getContentType());
      var fileName = "row" + row + "_" + (idx + 1) + ext;
      fileEntries.push({ path: fileName, blob: blob });
      rowForImage.push({ row: row, fileName: fileName });
    });

    var accessToken = getFirebaseAccessToken_();
    var deployResult = _deployBlobsToFirebaseHostingPlain_(accessToken, siteId, fileEntries, pathPrefix);

    var col = urlColumn || (sheet.getLastColumn() + 1);
    var headerCell = sheet.getRange(1, col);
    if (!String(headerCell.getValue() || "").trim()) headerCell.setValue("Screenshot URL");

    var results = [];
    rowForImage.forEach(function (entry) {
      var url = "https://" + siteId + ".web.app/" + pathPrefix + "/" + entry.fileName;
      sheet.getRange(entry.row, col).setValue(url);
      results.push({ row: entry.row, imageUrl: url });
    });

    logAuditEvent_(caller, "IMAGE_CONTEXT_HOSTING",
      "Hosted " + results.length + " image(s) from sheet " + spreadsheetId + " (" + sheet.getName() + ") -> column " + col);

    return { success: true, count: results.length, column: col, results: results, deploy: deployResult };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function _imgExtFromContentType_(ct) {
  ct = String(ct || "").toLowerCase();
  if (ct.indexOf("png")  !== -1) return ".png";
  if (ct.indexOf("jpeg") !== -1 || ct.indexOf("jpg") !== -1) return ".jpg";
  if (ct.indexOf("gif")  !== -1) return ".gif";
  if (ct.indexOf("webp") !== -1) return ".webp";
  return ".png";
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

/**
 * Test-/Editor-Funktion fuer Phrase-Ticket #243154: mit der von Mario
 * verlinkten Google-Sheet-Kopie der SINGLELANG_TranslationWB_TESTING_MARIO.xlsx.
 * SiteId identisch zur bestehenden SCORM-Preview-Site (Test.gs).
 */
function testHostContextImagesTicket243154() {
  var result = apiHostSheetImagesForContextNotes(
    "1p7rfYZjPgqif9o0Bk-etUZSPKgGqyFcTARS2v5f79GE",
    null,
    "kaercher-course-preview",
    null
  );
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
