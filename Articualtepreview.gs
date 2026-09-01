/**
 * ArticulatePreview.gs
 *
 * Verbindet die uebersetzte Rise-XLIFF aus Phrase mit dem Firebase-Deploy
 * zu einer Live-Preview. Nutzt die BESTEHENDEN Kaercher-Funktionen fuer
 * Phrase (nichts doppelt implementiert):
 *   - phraseDownloadTargetFile_(projectUid, jobUid)  -> uebersetzte XLIFF
 *   - (indirekt) getPhraseAuthHeader_, phraseApiUrlV1_, phraseFetchJson_
 *
 * Der Fortschritt wird waehrend des Laufs in den ScriptCache geschrieben,
 * damit die UI ihn per Polling als Ladebalken anzeigen kann (siehe
 * ArticulatePreviewProgress_ / apiGetPreviewProgress).
 */

var PREVIEW_PROGRESS_CACHE_PREFIX_ = "artprev_progress_";

/**
 * Schreibt einen Fortschrittswert (0-100 + Text) fuer eine Preview-Session
 * in den Cache. sessionId identifiziert den konkreten Play-Klick.
 */
function setPreviewProgress_(sessionId, percent, message) {
  var payload = JSON.stringify({ percent: percent, message: message, ts: Date.now() });
  CacheService.getScriptCache().put(
    PREVIEW_PROGRESS_CACHE_PREFIX_ + sessionId,
    payload,
    300 // 5 Min TTL
  );
}

/**
 * Von der UI per Polling aufgerufen. Gibt {percent, message} zurueck.
 */
function apiGetPreviewProgress(sessionId) {
  var raw = CacheService.getScriptCache().get(
    PREVIEW_PROGRESS_CACHE_PREFIX_ + String(sessionId || "")
  );
  if (!raw) return { percent: 0, message: "Wird vorbereitet..." };
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { percent: 0, message: "..." };
  }
}

/**
 * DASHBOARD-EINSTIEGSPUNKT - das ist die Funktion, die der spaetere
 * Play-Button aufruft. Braucht nur die Registry-ID; alle weiteren
 * Parameter (projectUid, jobUid, Ordner, Firebase-Pfad) kommen aus dem
 * Zuordnungs-Sheet.
 *
 * @param {string} articulateProjectId  ID-Spalte aus dem Registry-Sheet
 * @param {string} [sessionId]          fuer Fortschritts-Polling
 */
function apiGenerateArticulatePreviewById(articulateProjectId, sessionId) {
  var project = getArticulateProjectById_(articulateProjectId);
  sessionId = sessionId || String(Date.now());

  try {
    var result = apiGenerateArticulatePreview({
      sessionId: sessionId,
      projectUid: project.projectUid,
      jobUid: project.jobUid,
      scormFolderId: project.driveFolderId,
      firebasePath: project.firebasePath,
      firebaseSiteId: project.firebaseSite,
    });

    updateArticulateDeployResult_(
      project.rowIndex,
      result.liveUrl,
      "OK (" + result.applied + " Segmente ?bersetzt)"
    );

    try {
      sendArticulateDeployedReply_(project, result);
    } catch (e) {
      console.warn("Deploy-Benachrichtigung fehlgeschlagen: " + e.message);
    }

    return result;
  } catch (e) {
    updateArticulateDeployResult_(project.rowIndex, "", "ERROR: " + e.message);
    setPreviewProgress_(sessionId, 100, "Fehler: " + e.message);
    throw e;
  }
}

/**
 * HAUPTFUNKTION - von der UI ueber den Play-Button aufgerufen.
 *
 * @param {Object} params
 * @param {string} params.sessionId     eindeutige ID dieses Klicks (fuer
 *                                       Fortschritts-Polling; von der UI
 *                                       generiert)
 * @param {string} params.projectUid    Phrase-Projekt-UID
 * @param {string} params.jobUid        Phrase-Job-UID (der uebersetzte
 *                                       Rise-XLIFF-Job)
 * @param {string} params.scormFolderId Drive-Ordner-ID des entpackten
 *                                       SCORM-Exports
 * @param {string} params.firebasePath  Pfad-Prefix auf der Firebase-Site
 *                                       (z.B. "growth-mindset/de-DE")
 * @param {string} params.firebaseSiteId Firebase-Hosting-Site-ID
 * @return {Object} {liveUrl, applied, unmatched, uploadedFileCount, ...}
 */
function apiGenerateArticulatePreview(params) {
  params = params || {};
  var sessionId = params.sessionId || String(Date.now());

  setPreviewProgress_(sessionId, 5, "Hole aktuelle ?bersetzung aus Phrase...");

  // 1) Uebersetzte XLIFF aus Phrase holen (bestehende Kaercher-Funktion)
  var xliffBlob = phraseDownloadTargetFile_(params.projectUid, params.jobUid);
  var xliffText = xliffBlob.getDataAsString("UTF-8");

  setPreviewProgress_(sessionId, 20, "?bersetzung wird ausgewertet...");

  // 2) XLIFF -> Patches. Im echten Betrieb useSourceIfNoTarget:false, damit
  // noch nicht uebersetzte Segmente ihren Originaltext im Kurs behalten.
  var patches = parseTranslatedXliffToPatches_(xliffText, {
    useSourceIfNoTarget: false,
  });

  setPreviewProgress_(
    sessionId,
    30,
    patches.length + " ?bersetzte Segmente gefunden. Kurs wird zusammengebaut..."
  );

  // 3) Patchen + zu Firebase deployen. Wir rufen die bestehende
  // Folder-Deploy-Funktion, geben ihr aber die frisch aus Phrase
  // geholten Patches statt Testdaten.
  var result = patchAndDeployScormFolderToFirebase_withProgress_(
    params.scormFolderId,
    patches,
    params.firebaseSiteId,
    params.firebasePath,
    sessionId
  );

  setPreviewProgress_(sessionId, 100, "Fertig!");

  return {
    liveUrl: result.liveUrl,
    applied: result.applied,
    unmatched: (result.unmatched || []).length,
    uploadedFileCount: result.uploadedFileCount,
    totalFileCount: result.totalFileCount,
    skippedFiles: (result.skippedFiles || []).length,
  };
}

/**
 * Wie patchAndDeployScormFolderToFirebase(), aber meldet Zwischenschritte
 * an den Fortschritts-Cache. Umschliesst die bestehende Deploy-Logik.
 */
function patchAndDeployScormFolderToFirebase_withProgress_(
  scormFolderId, patches, siteId, pathPrefix, sessionId
) {
  var folder = DriveApp.getFolderById(scormFolderId);
  setPreviewProgress_(sessionId, 40, "Kursdateien werden gelesen...");
  var allEntries = collectFileEntriesRecursive_(folder, "");

  var filterResult = filterFileEntriesForPreview_(allEntries, null);
  var fileEntries = filterResult.kept;

  var found = findRuntimeDataEntry_(fileEntries);
  var jsText = found.entry.blob.getDataAsString("UTF-8");

  setPreviewProgress_(sessionId, 55, "?bersetzungen werden eingesetzt...");
  var patchResult = patchRuntimeDataJs_(jsText, patches);

  var patchedBlob = Utilities.newBlob(
    patchResult.patchedJs,
    "application/javascript",
    "runtime-data.js"
  );
  fileEntries[found.index] = { path: found.entry.path, blob: patchedBlob };

  setPreviewProgress_(sessionId, 65, "Preview wird zu Firebase hochgeladen...");
  var deployResult = deployBlobsToFirebaseHosting(siteId, fileEntries, pathPrefix);

  return {
    liveUrl: deployResult.liveUrl,
    applied: patchResult.applied,
    unmatched: patchResult.unmatched,
    uploadedFileCount: deployResult.uploadedFileCount,
    totalFileCount: deployResult.totalFileCount,
    skippedFiles: filterResult.skipped,
  };
}