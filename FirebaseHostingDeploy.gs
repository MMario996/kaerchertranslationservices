/**
 * FirebaseHostingDeploy.gs
 *
 * Implementiert den offiziellen Firebase Hosting REST-API-Deploy-Flow:
 *   1. Neue Version anlegen
 *   2. Fuer jede Datei SHA256 des GZIP-komprimierten Inhalts berechnen
 *      und per populateFiles melden
 *   3. Nur die Dateien hochladen, die Firebase als "noch nicht bekannt"
 *      zurueckmeldet (Content-Hash-Dedupe, spart Zeit bei Wiederholungen)
 *   4. Version finalisieren
 *   5. Version als Release veroeffentlichen -> live unter der Hosting-URL
 *
 * Loggt bei jedem Zwischenschritt (inkl. jeder einzelnen Datei beim
 * Upload), damit man im Execution-Log live sieht, dass es vorangeht statt
 * zu haengen - das Log-Panel aktualisiert sich waehrend die Funktion noch
 * laeuft, man muss nicht bis zum Ende warten.
 *
 * WICHTIG - bekannte Grenzen von Apps Script:
 *   - UrlFetchApp: Payload-Limit ca. 50 MB pro Request
 *   - Skript-Laufzeit: 6 Minuten pro Ausfuehrung (laenger bei manchen
 *     Workspace-Business/Enterprise-Konten)
 */

var FIREBASE_HOSTING_API_ = "https://firebasehosting.googleapis.com/v1beta1";

/**
 * @param {string} siteId       Firebase-Hosting-Site-ID
 * @param {Array}  fileEntries  [{path, blob}, ...] - "path" ist der
 *                               VOLLSTAENDIGE relative Pfad, z.B.
 *                               "scormcontent/index.html"
 * @param {string} [pathPrefix]
 * @return {Object} {liveUrl, versionName, uploadedFileCount, totalFileCount}
 */
function deployBlobsToFirebaseHosting(siteId, fileEntries, pathPrefix) {
  // Guard: sicherstellen, dass scormcontent/index.html wirklich am erwarteten
  // Pfad liegt ? sonst wird zwar erfolgreich deployt, aber die liveUrl 404t.
  var hasIndex = fileEntries.some(function (e) {
    return /(^|\/)scormcontent\/index\.html$/.test(String(e.path || ""));
  });
  if (!hasIndex) {
    var samplePaths = fileEntries.slice(0, 8).map(function (e) { return e.path; }).join("\n  ");
    throw new Error(
      "Deploy abgebrochen: Es wurde kein 'scormcontent/index.html' auf der " +
      "erwarteten Pfad-Ebene gefunden. Der Drive-Ordner ist vermutlich eine " +
      "Ebene zu tief verschachtelt.\n\n" +
      "Erwartet: der ausgew?hlte Ordner enth?lt DIREKT 'scormcontent/'.\n\n" +
      "Gefundene Pfade (Auszug):\n  " + samplePaths
    );
  }

  // 404-Fallback mitdeployen, damit ein Pfad-Mismatch nicht die nackte
  // Firebase-Standardseite zeigt, sondern einen Hinweis mit Direktlink.
  var idxPath = "/scormcontent/index.html";
  if (pathPrefix) idxPath = "/" + pathPrefix.replace(/^\/|\/$/g, "") + idxPath;
  var notFoundHtml =
    '<!doctype html><meta charset="utf-8"><title>Preview nicht gefunden</title>' +
    '<div style="font-family:sans-serif;max-width:600px;margin:60px auto;padding:0 20px;">' +
    '<h2>Preview-Pfad nicht gefunden</h2>' +
    '<p>Die Kurs-Preview liegt unter einem anderen Pfad. Versuche den Direktlink:</p>' +
    '<p><a href="' + idxPath + '">' + idxPath + '</a></p></div>';
  fileEntries = fileEntries.concat([{
    path: "404.html",
    blob: Utilities.newBlob(notFoundHtml, "text/html", "404.html")
  }]);

  var accessToken = getFirebaseAccessToken_();
  Logger.log("[1/6] Access-Token geholt.");

  // 1) Version anlegen
  var versionResp = fbFetch_(
    accessToken,
    "post",
    "/sites/" + siteId + "/versions",
    {}
  );
  var versionName = versionResp.name;
  Logger.log("[2/6] Version angelegt: " + versionName);

  // 2) Hashes berechnen (SHA256 des gzip-komprimierten Inhalts)
  var hashToBlob = {};
  var pathToHash = {};
  var hashToPath = {};

  fileEntries.forEach(function (entry) {
    var relativePath = normalizeFirebasePath_(entry.path, pathPrefix);
    var gzipped = Utilities.gzip(entry.blob);
    var digestBytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      gzipped.getBytes()
    );
    var hash = bytesToHex_(digestBytes);

    pathToHash[relativePath] = hash;
    hashToBlob[hash] = gzipped;
    hashToPath[hash] = relativePath;
  });
  Logger.log("[3/6] Hashes berechnet fuer " + fileEntries.length + " Dateien.");

  // 3) populateFiles - Firebase sagt uns, welche Hashes es noch NICHT kennt
  var populateResp = fbFetch_(
    accessToken,
    "post",
    "/" + versionName + ":populateFiles",
    { files: pathToHash }
  );

  var requiredHashes = populateResp.uploadRequiredHashes || [];
  var uploadUrl = populateResp.uploadUrl;
  Logger.log(
    "[4/6] " +
      requiredHashes.length +
      " von " +
      fileEntries.length +
      " Dateien muessen hochgeladen werden (Rest kennt Firebase schon)."
  );

  requiredHashes.forEach(function (hash, i) {
    var gzBlob = hashToBlob[hash];
    var uploadResp = UrlFetchApp.fetch(uploadUrl + "/" + hash, {
      method: "post",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/octet-stream",
      },
      payload: gzBlob.getBytes(),
      muteHttpExceptions: true,
    });
    if (uploadResp.getResponseCode() >= 300) {
      throw new Error(
        "Upload fehlgeschlagen fuer Hash " +
          hash +
          ": " +
          uploadResp.getContentText()
      );
    }
    Logger.log(
      "  hochgeladen " + (i + 1) + "/" + requiredHashes.length + ": " + hashToPath[hash]
    );
  });
  Logger.log("[5/6] Alle Uploads fertig.");

  // 4) Version finalisieren
  fbFetch_(
    accessToken,
    "patch",
    "/" + versionName + "?updateMask=status",
    { status: "FINALIZED" }
  );
  Logger.log("[6/6] Version finalisiert, veroeffentliche jetzt...");

  // 5) Als Release veroeffentlichen -> jetzt live
  fbFetch_(
    accessToken,
    "post",
    "/sites/" + siteId + "/releases?versionName=" + encodeURIComponent(versionName),
    null
  );
  Logger.log("FERTIG - Release ist live.");

  var basePath = pathPrefix ? "/" + pathPrefix.replace(/^\/|\/$/g, "") : "";
  var liveUrl = "https://" + siteId + ".web.app" + basePath + "/scormcontent/index.html";

  return {
    liveUrl: liveUrl,
    versionName: versionName,
    uploadedFileCount: requiredHashes.length,
    totalFileCount: fileEntries.length,
  };
}

function normalizeFirebasePath_(relativePath, pathPrefix) {
  var path = relativePath.replace(/^\/+/, "");
  // 404.html geh?rt immer in den Site-Root, nie unter den pathPrefix.
  if (path === "404.html") return "/404.html";
  if (pathPrefix) {
    var prefix = pathPrefix.replace(/^\/|\/$/g, "");
    path = prefix + "/" + path;
  }
  return "/" + path;
}

function bytesToHex_(bytes) {
  return bytes
    .map(function (b) {
      var unsigned = b < 0 ? b + 256 : b;
      var hex = unsigned.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}

function fbFetch_(accessToken, method, path, payload) {
  var options = {
    method: method,
    headers: { Authorization: "Bearer " + accessToken },
    muteHttpExceptions: true,
  };
  if (payload !== null) {
    options.contentType = "application/json";
    options.payload = JSON.stringify(payload);
  }
  var response = UrlFetchApp.fetch(FIREBASE_HOSTING_API_ + path, options);
  var code = response.getResponseCode();
  var text = response.getContentText();
  if (code >= 300) {
    throw new Error(
      "Firebase Hosting API Fehler (" + code + ") bei " + path + ": " + text
    );
  }
  return text ? JSON.parse(text) : {};
}
