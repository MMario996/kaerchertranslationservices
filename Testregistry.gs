/**
 * TestRegistry.gs
 *
 * Manuelle Testfunktionen fuer die Registry + den kompletten
 * Preview-Durchlauf - solange es noch kein Frontend gibt.
 * Reihenfolge: 1) testCreateArticulateProject  2) testListArticulateProjects
 *              3) testGeneratePreviewById (mit der ID aus Schritt 2)
 */

/**
 * SCHRITT 1: Legt einen Projekt-Eintrag im Zuordnungs-Sheet an.
 * Vorher die vier Werte unten ausfuellen.
 */
function testCreateArticulateProject() {
  var result = apiCreateArticulateProject({
    courseName: "Growth Mindset unlock the power of openness",
    targetLang: "de-DE",
    projectUid: "FFDYdblS1Thbu2eghjyMh0",
    jobUid: "fUbKbz7MHUV02yIWOrRH40",
    driveFolderUrl: "1n6OXBnrC2i--M7yLaUeJRE6RthjZ1hTg",
    firebaseSite: "kaercher-course-preview",
  });

  Logger.log("Angelegt. ID: " + result.id);
  Logger.log("Firebase-Pfad: " + result.firebasePath);
}

/**
 * SCHRITT 2: Zeigt alle Eintraege inkl. ihrer IDs.
 */
function testListArticulateProjects() {
  var listing = apiListArticulateProjects();
  Logger.log("Eintraege: " + listing.rows.length);
  listing.rows.forEach(function (r) {
    Logger.log(
      "- [" + r.id + "] " + r.courseName + " (" + r.targetLang + ")" +
      " | Job: " + r.jobUid +
      " | Pfad: " + r.firebasePath +
      " | Letzter Deploy: " + (r.lastDeploy || "-") +
      " | Status: " + (r.lastStatus || "-") +
      (r.liveUrl ? " | URL: " + r.liveUrl : "")
    );
  });
}

/**
 * SCHRITT 3: Kompletter Durchlauf - holt die aktuelle Uebersetzung aus
 * Phrase, patcht den Kurs und deployt ihn live zu Firebase.
 * ID aus Schritt 2 unten eintragen.
 */
function testGeneratePreviewById() {
  var ARTICULATE_PROJECT_ID = "62cdac4b-a565-4634-bd92-12f95ef5da95";

  var result = apiGenerateArticulatePreviewById(ARTICULATE_PROJECT_ID);

  Logger.log("Uebersetzte Segmente eingesetzt: " + result.applied);
  Logger.log("Nicht zuordenbar: " + result.unmatched);
  Logger.log(
    "Dateien hochgeladen: " + result.uploadedFileCount + " / " + result.totalFileCount
  );
  Logger.log("Uebersprungen (Videos etc.): " + result.skippedFiles);
  Logger.log("LIVE-LINK: " + result.liveUrl);
}

/**
 * Nur den XLIFF-Parser gegen einen echten Phrase-Job testen, ohne Deploy.
 * Nuetzlich, um zu pruefen, wie viele Segmente aktuell uebersetzt sind,
 * bevor man einen kompletten Deploy anstoesst.
 */
function testParseXliffFromPhrase() {
  var PROJECT_UID = "FFDYdblS1Thbu2eghjyMh0";
  var JOB_UID = "fUbKbz7MHUV02yIWOrRH40";

  var blob = phraseDownloadTargetFile_(PROJECT_UID, JOB_UID);
  var xliffText = blob.getDataAsString("UTF-8");

  var withTarget = parseTranslatedXliffToPatches_(xliffText, {
    useSourceIfNoTarget: false,
  });
  var withFallback = parseTranslatedXliffToPatches_(xliffText, {
    useSourceIfNoTarget: true,
  });

  Logger.log("Dateigroesse: " + xliffText.length + " Zeichen");
  Logger.log("Segmente MIT Uebersetzung (<target>): " + withTarget.length);
  Logger.log("Segmente gesamt: " + withFallback.length);

  if (withTarget.length > 0) {
    Logger.log("Beispiel-Uebersetzung:");
    Logger.log("  scopeId: " + withTarget[0].scopeId);
    Logger.log("  path: " + withTarget[0].path);
    Logger.log("  text: " + withTarget[0].text.substring(0, 200));
  } else {
    Logger.log(
      "WARNUNG: keine <target>-Segmente gefunden - ist der Job schon " +
      "uebersetzt/bestaetigt? Ohne Targets bleibt der Kurs komplett " +
      "im Originaltext."
    );
  }
}