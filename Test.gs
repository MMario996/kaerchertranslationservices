/**
 * Manueller Testlauf (ZIP-Download-Variante). Funktioniert nur bei
 * kleinen Kursen (Utilities.unzip()-Limit ~50MB Gesamtinhalt).
 */
function testPatchDemo() {
  var SCORM_ZIP_FILE_ID = "1_qD1Me64jNdxDKfU_jv8-MYxWawVhIf2";

  var result = generatePatchedScormZip(SCORM_ZIP_FILE_ID, TEST_PATCHES_, {
    outputFileName: "growth-mindset_LIVE-PREVIEW.zip",
  });

  Logger.log("Angewendete Patches: " + result.applied);
  Logger.log("Nicht gefunden: " + JSON.stringify(result.unmatched));
  Logger.log("Gepatchte ZIP: " + result.fileUrl);
  Logger.log("Direkter Download-Link: " + result.downloadUrl);
}

/**
 * Manueller Testlauf (Firebase-Hosting-Live-Variante, ZIP-basiert).
 * FUNKTIONIERT NUR bei kleinen Kursen ohne grosse Videos - siehe
 * testFirebaseDeployFromFolderDemo() fuer den robusten Weg.
 */
function testFirebaseDeployDemo() {
  var SCORM_ZIP_FILE_ID = "1_qD1Me64jNdxDKfU_jv8-MYxWawVhIf2";
  var FIREBASE_SITE_ID = "kaercher-course-preview";

  var result = patchAndDeployScormToFirebase(
    SCORM_ZIP_FILE_ID,
    TEST_PATCHES_,
    FIREBASE_SITE_ID,
    "growth-mindset-deutsch"
  );

  Logger.log("Angewendete Patches: " + result.applied);
  Logger.log("Nicht gefunden: " + JSON.stringify(result.unmatched));
  Logger.log(
    "Hochgeladene Dateien: " +
      result.uploadedFileCount +
      " / " +
      result.totalFileCount
  );
  Logger.log("LIVE-LINK: " + result.liveUrl);
}

/**
 * Manueller Testlauf (Firebase-Hosting-Live-Variante, ORDNER-basiert).
 * Umgeht das Utilities.unzip()-Groessenlimit - dafuer musst du den
 * SCORM-Export vorher LOKAL entpacken und den entstandenen Ordner
 * (enthaelt scormcontent/, scormdriver/ etc.) nach Drive hochladen.
 *
 * FOLDER_ID aus der URL des hochgeladenen Ordners kopieren:
 * https://drive.google.com/drive/folders/DIESER_TEIL
 */
function testFirebaseDeployFromFolderDemo() {
  var SCORM_FOLDER_ID = "1n6OXBnrC2i--M7yLaUeJRE6RthjZ1hTg";
  var FIREBASE_SITE_ID = "kaercher-course-preview";

  var result = patchAndDeployScormFolderToFirebase(
    SCORM_FOLDER_ID,
    TEST_PATCHES_,
    FIREBASE_SITE_ID,
    "growth-mindset-deutsch"
  );

  Logger.log("Angewendete Patches: " + result.applied);
  Logger.log("Nicht gefunden: " + JSON.stringify(result.unmatched));
  Logger.log(
    "Hochgeladene Dateien: " +
      result.uploadedFileCount +
      " / " +
      result.totalFileCount
  );
  Logger.log("Uebersprungene Dateien: " + result.skippedFiles.length);
  Logger.log("LIVE-LINK: " + result.liveUrl);
}

// Dieselben Testpatches wie im urspruenglichen Python-Prototyp - bewusst
// auffaellig markiert, damit man im Browser sofort sieht: das ist gepatcht.
var TEST_PATCHES_ = [
  {
    scopeId: "course",
    path: "title",
    text: "? GAS-TEST: Growth Mindset (LIVE-PREVIEW-DEMO)",
  },
  {
    scopeId: "8thYMbDR4u6h5je6SlqhlKCsLyqsn9UK",
    path: "title",
    text: "? GAS-TEST: Lektion 1 - gepatcht via Apps Script",
  },
  {
    scopeId: "8thYMbDR4u6h5je6SlqhlKCsLyqsn9UK",
    path:
      "items|id:cmb0jpgrt0036357ci7e2vrdd|items|id:cmb0jpgrt0037357cey3kvexg|caption",
    text: "<div><p>? GAS-TEST-UEBERSETZUNG: Dieser Text kommt aus Apps Script.</p></div>",
  },
];

/**
 * Nur die Patch-Logik testen, ohne Drive/ZIP.
 */
function testPatchLogicOnly(runtimeDataJsText) {
  var data = decodeRuntimeData_(runtimeDataJsText);
  var index = buildIndex_(data);

  var total = 0;
  Object.keys(index).forEach(function (scope) {
    total += Object.keys(index[scope]).length;
  });

  Logger.log("Scopes gefunden: " + Object.keys(index).length);
  Logger.log("Uebersetzbare Felder gesamt: " + total);
  Logger.log("Scope-IDs: " + Object.keys(index).join(", "));

  return index;
}
