/**
 * DownloadZip.gs
 *
 * FIX 1: Extension aus Blob Content-Type als Fallback
 * FIX 2: Multi-file download uses jobMapping for correct filenames
 * FIX 3: Blob-Namen werden auf reinen Dateinamen reduziert (kein Pfad)
 * FIX 4: Records download timestamp for archiving
 * FIX 5: Extension aus jobMapping.fileName als harte Priorit?t
 * FIX 6: Deduplizierung von Blob-Namen vor Utilities.zip()
 * FIX 7: Echtes Max-Level via Projekt-Metadaten ermitteln (V1 API)
 * FIX 8: Echter Dateiname aus Phrase Jobs API holen wenn jobMapping.fileName generisch ist
 * FIX 9: Vollst?ndige Paginierung (while-Schleife) f?r Jobs (verhindert Abschneiden bei >50 Jobs)
 * FIX 10: Doppelte Funktionsdeklaration bereinigt
 */

// ??? Phrase Download ??????????????????????????????????????????????????????????

function phraseDownloadTargetFile_(projectUid, jobUid) {
  const url = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid) +
    "/jobs/" + encodeURIComponent(jobUid) + "/targetFile");
  console.log("? Downloading target file for job:", jobUid);
  const res = UrlFetchApp.fetch(url, {
    method: "get", muteHttpExceptions: true,
    headers: { Authorization: getPhraseAuthHeader_() }
  });
  const code = res.getResponseCode();
  if (code >= 400) {
    let msg = res.getContentText();
    try { const j = JSON.parse(msg); msg = j.errorDescription || j.message || msg; } catch (e) {}
    throw new Error("Target file download failed (" + code + "): " + msg);
  }
  return res.getBlob();
}

/**
 * Ermittelt das h?chste Workflow-Level ?ber die Projekt-API (serverseitig),
 * und l?dt dann ALLE Jobs dieses exakten Levels ?ber Paginierung herunter.
 *
 * @param {string}   projectUid  Phrase Projekt-UID
 * @param {string[]} jobUids     Gespeicherte Job-UIDs aus Queue-Sheet (Level-1-UIDs)
 * @returns {{ maxLevel: number, jobsForDownload: Array }}
 */
function phraseGetJobsForMaxLevel_(projectUid, jobUids) {
  try {
    const authHeader = { Authorization: getPhraseAuthHeader_() };

    // 1. H?chstes Workflow-Level aus den Projekt-Metadaten ermitteln
    let maxLevel = 1;
    const projUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
    const projRes = phraseFetchJson_(projUrl, { method: "get", headers: authHeader });
    
    if (projRes && Array.isArray(projRes.workflowSteps) && projRes.workflowSteps.length > 0) {
      const levels = projRes.workflowSteps.map(step => Number(step.workflowLevel)).filter(l => !isNaN(l));
      if (levels.length > 0) {
        maxLevel = Math.max(...levels);
      }
    }
    console.log("? H?chstes Workflow-Level im Projekt ermittelt:", maxLevel);

    // 2. Alle Jobs dieses Levels via API V2 holen (mit Paginierung!)
    let allJobs = [];
    let pageNumber = 0;
    let hasMorePages = true;

    while (hasMorePages) {
      const jobsUrl = phraseApiUrlV2_(
        "/projects/" + encodeURIComponent(projectUid) + 
        "/jobs?workflowLevel=" + maxLevel + 
        "&pageSize=50&pageNumber=" + pageNumber
      );
      
      const res = phraseFetchJson_(jobsUrl, { method: "get", headers: authHeader });
      const jobsBatch = (res && Array.isArray(res.content)) ? res.content : [];
      
      if (jobsBatch.length > 0) {
        allJobs = allJobs.concat(jobsBatch);
        pageNumber++;
        if (jobsBatch.length < 50) {
          hasMorePages = false; // Letzte Seite erreicht
        }
      } else {
        hasMorePages = false; // Keine Jobs mehr
      }
    }

    if (!allJobs.length) {
      console.warn("?? Keine Jobs auf Level " + maxLevel + " gefunden. Verwende ?bergebene UIDs direkt (Fallback).");
      return {
        maxLevel: 1,
        jobsForDownload: jobUids.map(uid => ({ uid, fileName: "", targetLang: "", workflowLevel: 1 }))
      };
    }

    // 3. Ergebnis formatieren
    const jobsForDownload = allJobs.map(j => ({
      uid:           String(j.uid || ""),
      fileName:      String(j.filename || j.originalFile || ""),
      targetLang:    String(j.targetLang || ""),
      status:        String(j.status || "").toUpperCase(),
      workflowLevel: maxLevel
    }));

    console.log("? " + jobsForDownload.length + " Jobs auf Level " + maxLevel + " f?r Download verifiziert.");
    return { maxLevel, jobsForDownload };

  } catch (e) {
    console.warn("phraseGetJobsForMaxLevel_ fehlgeschlagen:", e.message);
    // Sicherheits-Fallback auf Original-Level 1
    return {
      maxLevel: 1,
      jobsForDownload: jobUids.map(uid => ({ uid, fileName: "", targetLang: "", workflowLevel: 1 }))
    };
  }
}

// ??? Helpers ??????????????????????????????????????????????????????????????????

function _normalizeToBlob_(maybeBlob) {
  if (maybeBlob && typeof maybeBlob.getBytes === "function") return maybeBlob;
  if (maybeBlob && maybeBlob.blob && typeof maybeBlob.blob.getBytes === "function") return maybeBlob.blob;
  throw new Error("Download did not return a Blob. Got: " + JSON.stringify(maybeBlob));
}

function _getExt_(name) {
  name = String(name || "").trim();
  const m = name.match(/(\.[A-Za-z0-9]{1,10})$/);
  return m ? m[1] : "";
}

function _stripExt_(name) {
  name = String(name || "").trim();
  const ext = _getExt_(name);
  return ext ? name.slice(0, -ext.length) : name;
}

function _flattenBlobName_(name) {
  if (!name) return name;
  const parts = String(name).replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] || name;
}

/**
 * Pr?ft ob ein Dateiname generisch/unbekannt ist.
 * "Drive-Datei (14-ypgP1..." oder leer ? generisch
 */
function _isGenericFileName_(name) {
  if (!name) return true;
  const n = String(name).trim().toLowerCase();
  if (!n) return true;
  if (n.startsWith("drive-datei")) return true;
  if (n.startsWith("drive file")) return true;
  if (n === "unknown" || n === "upload" || n === "file") return true;
  return false;
}

/**
 * MIME ? Extension.
 */
function _fallbackExtFromMime_(mimeType) {
  const m = String(mimeType || "").toLowerCase().trim();
  if (!m) return "";
  if (m === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return ".docx";
  if (m === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return ".pptx";
  if (m === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return ".xlsx";
  if (m === "application/vnd.google-apps.document")     return ".docx";
  if (m === "application/vnd.google-apps.presentation") return ".pptx";
  if (m === "application/vnd.google-apps.spreadsheet")  return ".xlsx";
  if (m === "text/plain")      return ".txt";
  if (m === "application/pdf") return ".pdf";
  if (m === "application/xml" || m === "text/xml") return ".xml";
  if (m === "text/html")       return ".html";
  if (m.indexOf("idml") !== -1) return ".idml";
  return "";
}

/**
 * Baut den finalen Ausgabe-Dateinamen.
 * Priorit?t: sourceExt > getExt(orig) > fallbackExt > getExt(blobName)
 */
function _buildTargetFileName_(originalFileName, lang, fallbackExt, blobName, sourceExt) {
  const flatBlob = _flattenBlobName_(String(blobName || ""));
  const orig = String(originalFileName || "").trim() || flatBlob || "translation";

  let ext = sourceExt || "";
  if (!ext) ext = _getExt_(orig);
  if (!ext) ext = String(fallbackExt || "");
  if (!ext) ext = _getExt_(flatBlob);

  const base = _stripExt_(_flattenBlobName_(orig)) || "translation";
  const safeLang = String(lang || "").trim().replace(/[^a-zA-Z0-9_\-]/g, "_");
  const outBase  = safeLang ? base + "_" + safeLang : base;

  return ext ? outBase + ext : outBase;
}

function _mimeFromExt_(ext) {
  ext = String(ext || "").toLowerCase();
  switch (ext) {
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".idml": return "application/octet-stream";
    case ".txt":  return "text/plain";
    case ".xml":  return "application/xml";
    case ".html": return "text/html";
    case ".pdf":  return "application/pdf";
    default: return "application/octet-stream";
  }
}

function _setBlobNameSafe_(blob, name) {
  if (blob && typeof blob.setName === "function" && name) {
    try { blob.setName(name); } catch (e) {}
  }
}

/**
 * FIX 6: Dedupliziert Blob-Namen im Array in-place.
 */
function _deduplicateBlobNames_(blobs) {
  const seen = {};
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const rawName = (blob.getName && blob.getName()) || "file_" + i;
    const key = rawName.toLowerCase();
    if (!seen[key]) {
      seen[key] = 1;
    } else {
      seen[key]++;
      const count = seen[key];
      const ext  = _getExt_(rawName);
      const base = _stripExt_(rawName);
      const newName = base + "_v" + count + ext;
      _setBlobNameSafe_(blob, newName);
      console.log("  ? Dedupliziert: '" + rawName + "' ? '" + newName + "'");
    }
  }
}

// ??? Smart Download (entry point from frontend) ???????????????????????????????

function apiSmartDownload(projectUid, jobUids, projectName, targetLangs, fileName, targetLang, mimeType, jobMapping) {
  if (!Array.isArray(jobUids)) jobUids = [jobUids];
  jobUids = jobUids.filter(j => j && String(j).trim());
  if (jobUids.length === 0) return { success: false, error: "No job UIDs provided" };

  if (jobMapping && typeof jobMapping === "string") {
    try { jobMapping = JSON.parse(jobMapping); } catch(e) { jobMapping = null; }
  }

  console.log("? Ermittle h?chstes Workflow-Level f?r Projekt: " + projectUid);
  const { maxLevel, jobsForDownload } = phraseGetJobsForMaxLevel_(projectUid, jobUids);

  const filteredJobUids = jobsForDownload.map(j => j.uid).filter(Boolean);
  if (filteredJobUids.length === 0) {
    return { success: false, error: "Keine downloadbaren Jobs gefunden (Level " + maxLevel + ")." };
  }

  // jobMapping mit echten Dateinamen aus Phrase API anreichern
  const enrichedMapping = filteredJobUids.map((uid, index) => {
    // 1. Aus API-Daten
    const apiJob = jobsForDownload.find(j => j.uid === uid);
    const apiFileName = apiJob && apiJob.fileName ? String(apiJob.fileName).trim() : "";
    const apiLang = apiJob && apiJob.targetLang ? String(apiJob.targetLang).trim() : "";

    // 2. Aus gespeichertem jobMapping
    let mappingFileName = "";
    let mappingLang = "";
    if (Array.isArray(jobMapping)) {
      // Wenn wir nur Level 1 UIDs im Mapping haben, aber die API Level 4 UIDs zur?ckgibt,
      // mappen wir anhand des Index, da die Reihenfolge der Files meist identisch ist.
      const m = jobMapping.find(m => m.jobUid === uid) || jobMapping[index];
      if (m) {
        mappingFileName = String(m.fileName || "").trim();
        mappingLang     = String(m.targetLang || "").trim();
      }
    }

    // Priorit?t: gespeichertes Mapping (wenn nicht generisch) > API-Dateiname
    const bestFileName = (!_isGenericFileName_(mappingFileName) ? mappingFileName : null)
                      || (!_isGenericFileName_(apiFileName)     ? apiFileName     : null)
                      || projectName || "translation";

    const bestLang = mappingLang || apiLang ||
      (Array.isArray(targetLangs) ? targetLangs[index] : "") || targetLang || "";

    return { jobUid: uid, fileName: bestFileName, targetLang: bestLang };
  });

  if (filteredJobUids.length === 1) {
    const m = enrichedMapping[0];
    return apiUserDownloadFromPhrase(projectUid, m.jobUid, m.fileName, m.targetLang, mimeType);
  }

  return apiDownloadAllJobsAsZip(projectUid, filteredJobUids, projectName, null, null, mimeType, enrichedMapping);
}

// ??? Single job download ??????????????????????????????????????????????????????

function apiUserDownloadFromPhrase(projectUid, jobUid, fileName, targetLang, mimeType) {
  const access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  try {
    const raw  = phraseDownloadTargetFile_(String(projectUid).trim(), String(jobUid).trim());
    const blob = _normalizeToBlob_(raw);

    const blobContentType = (blob.getContentType && blob.getContentType()) || "";
    const blobName        = _flattenBlobName_((blob.getName && blob.getName()) || "");

    const sourceExt   = _getExt_(String(fileName || ""));
    const fallbackExt = _fallbackExtFromMime_(mimeType) || _fallbackExtFromMime_(blobContentType);

    const outName = _buildTargetFileName_(fileName, targetLang, fallbackExt, blobName, sourceExt);
    _setBlobNameSafe_(blob, outName);

    const bytes = blob.getBytes();
    const b64   = Utilities.base64Encode(bytes);
    const ext   = _getExt_(outName);
    const mime  = sourceExt ? _mimeFromExt_(sourceExt) : (blobContentType || _mimeFromExt_(ext));

    recordDownloadTimestamp_(projectUid);
    console.log("? Download successful:", outName, "| mime:", mime);
    return { success: true, fileName: outName, mimeType: mime, base64: b64, isZip: false, downloadedCount: 1, totalJobs: 1, errors: [] };

  } catch (e) {
    console.error("? Download failed:", e);
    return { success: false, error: e.message || String(e) };
  }
}

// ??? Multi-job ZIP download ???????????????????????????????????????????????????

function apiDownloadAllJobsAsZip(projectUid, jobUids, projectName, targetLangs, originalFileName, mimeType, jobMapping) {
  const access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  try {
    if (!Array.isArray(jobUids) || jobUids.length === 0) throw new Error("No job UIDs provided");

    const blobs  = [];
    const errors = [];

    for (let i = 0; i < jobUids.length; i++) {
      const jobUid = String(jobUids[i] || "").trim();
      if (!jobUid) continue;

      let jobFileName = originalFileName || projectName;
      let jobLang     = (targetLangs && targetLangs[i]) ? String(targetLangs[i]).trim() : "";

      if (Array.isArray(jobMapping) && jobMapping.length > 0) {
        const match = jobMapping.find(m => m.jobUid === jobUid) || jobMapping[i];
        if (match) {
          if (match.fileName && !_isGenericFileName_(match.fileName)) {
            jobFileName = match.fileName;
          }
          if (match.targetLang) jobLang = match.targetLang;
        }
      }

      console.log("? Job " + (i+1) + "/" + jobUids.length + ": " + jobUid + " (" + jobLang + ") ? " + jobFileName);

      try {
        const raw  = phraseDownloadTargetFile_(String(projectUid).trim(), jobUid);
        const blob = _normalizeToBlob_(raw);

        const blobContentType = (blob.getContentType && blob.getContentType()) || "";
        const blobName        = _flattenBlobName_((blob.getName && blob.getName()) || "");

        const sourceExt   = _getExt_(String(jobFileName || ""));
        const fallbackExt = _fallbackExtFromMime_(mimeType) || _fallbackExtFromMime_(blobContentType);

        const outName = _buildTargetFileName_(jobFileName, jobLang, fallbackExt, blobName, sourceExt);
        _setBlobNameSafe_(blob, outName);

        if (sourceExt && typeof blob.setContentType === "function") {
          try { blob.setContentType(_mimeFromExt_(sourceExt)); } catch(e) {}
        }

        blobs.push(blob);
        console.log("  ?", outName);
      } catch (e) {
        console.warn("  ?? Job " + jobUid + " failed:", e.message);
        errors.push({ jobUid, error: e.message });
      }
    }

    if (blobs.length === 0) throw new Error("No files could be downloaded. All jobs failed.");

    _deduplicateBlobNames_(blobs);
    recordDownloadTimestamp_(projectUid);

    if (blobs.length === 1) {
      const b       = blobs[0];
      const outName = (typeof b.getName === "function" && b.getName()) || "translation";
      const bytes   = b.getBytes();
      const b64     = Utilities.base64Encode(bytes);
      const ext     = _getExt_(outName);
      const mime    = _mimeFromExt_(ext) || (b.getContentType && b.getContentType()) || "application/octet-stream";
      return { success: true, fileName: outName, mimeType: mime, base64: b64, isZip: false, downloadedCount: 1, totalJobs: jobUids.length, errors };
    }

    const zipName = String(projectName || "translations").trim() + ".zip";
    const zipBlob = Utilities.zip(blobs, zipName);
    const zipB64  = Utilities.base64Encode(zipBlob.getBytes());

    return { success: true, fileName: zipName, mimeType: "application/zip", base64: zipB64, isZip: true, downloadedCount: blobs.length, totalJobs: jobUids.length, errors };

  } catch (e) {
    console.error("? Multi-download failed:", e);
    return { success: false, error: e.message || String(e) };
  }
}

/** Legacy / Explicit single download: returns base64 + filename so UI can download without Drive */
function apiDownloadTargetFile(projectUid, jobUid) {
  const access = apiCheckAccess();
  if (!access.allowed) throw new Error("Not authorized.");

  const blob = phraseDownloadTargetFile_(String(projectUid).trim(), String(jobUid).trim());
  const bytes = blob.getBytes();
  const name  = _flattenBlobName_(blob.getName()) || ("target_" + jobUid);
  const ext   = _getExt_(name);
  
  return {
    ok: true,
    fileName: name,
    mimeType: _mimeFromExt_(ext) || blob.getContentType() || "application/octet-stream",
    base64: Utilities.base64Encode(bytes)
  };
}