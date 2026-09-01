/**
 * KeCProjects.gs
 * - Liefert offene Projekte live aus Phrase (Status NEW, Client AKW, Domain Marketing Content, BU MMV-P)
 * - FIX: Phrase v1 /projects ignoriert clientId/domainId/businessUnitId Query-Params still.
 *        L?sung: Alle NEW-Projekte paginiert laden, dann clientseitig filtern.
 * - FIX: Paginierung implementiert (war vorher pageSize=100 ohne Loop ? Projekte > Seite 1 fehlten)
 * - Pr?ft Workflow Steps PRO LEVEL (/jobs?workflowLevel=N, da /jobs sonst nur Level 1 liefert):
 *   Level 1 ("Translation" / MT) EGAL, ab Level 2 blockt jeder Job, der NICHT "NEW" oder "EMAILED" ist.
 * - Upload neuer Dateien in bestehendes Phrase-Projekt
 * - Einzelprojekt-Debugger f?r das Frontend
 *
 * FIX (Admin-Konfiguration): Client/Domain/Business-Unit IDs sind jetzt in Script
 * Properties gespeichert (KEC_CLIENT_ID, KEC_DOMAIN_ID, KEC_BUSINESS_UNIT_ID) statt
 * hartkodiert. Getter-Funktionen liefern Fallback auf die bisherigen Default-Werte,
 * damit nichts bricht solange die Properties noch nicht gesetzt sind.
 * Admin kann die Werte ?ber den "KeC Eligibility Settings" Admin-Card ?ndern
 * (gesperrt per Schloss-Icon, muss erst entsperrt werden).
 */

const KEC_UPLOAD_DEADLINE_MS_ = 300 * 1000; // 5 min

// Default-Werte (greifen, solange keine Script Property gesetzt ist)
var KEC_CLIENT_ID_DEFAULT_        = "620249"; // AKW
var KEC_DOMAIN_ID_DEFAULT_        = "23997";  // Marketing Content
var KEC_BUSINESS_UNIT_ID_DEFAULT_ = "56182";  // MMV-P

// ??? Getter: Client/Domain/BU IDs (Script Properties mit Fallback) ????????????

function getKecClientId_() {
  return String(PropertiesService.getScriptProperties().getProperty("KEC_CLIENT_ID") || KEC_CLIENT_ID_DEFAULT_).trim();
}
function getKecDomainId_() {
  return String(PropertiesService.getScriptProperties().getProperty("KEC_DOMAIN_ID") || KEC_DOMAIN_ID_DEFAULT_).trim();
}
function getKecBusinessUnitId_() {
  return String(PropertiesService.getScriptProperties().getProperty("KEC_BUSINESS_UNIT_ID") || KEC_BUSINESS_UNIT_ID_DEFAULT_).trim();
}

// ??? Admin API: Aktuelle Werte lesen ??????????????????????????????????????????

function apiGetKecEligibilitySettings() {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");
  return {
    clientId:       getKecClientId_(),
    domainId:       getKecDomainId_(),
    businessUnitId: getKecBusinessUnitId_()
  };
}

// ??? Admin API: Neue Werte speichern ??????????????????????????????????????????

function apiSaveKecEligibilitySettings(clientId, domainId, businessUnitId) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) throw new Error("Not authorized. Admin only.");

  clientId       = String(clientId       || "").trim();
  domainId       = String(domainId       || "").trim();
  businessUnitId = String(businessUnitId || "").trim();

  if (!clientId || !domainId || !businessUnitId) {
    throw new Error("Client-ID, Domain-ID und Business-Unit-ID d?rfen nicht leer sein.");
  }
  if (!/^\d+$/.test(clientId) || !/^\d+$/.test(domainId) || !/^\d+$/.test(businessUnitId)) {
    throw new Error("IDs m?ssen numerisch sein (z.B. 620249).");
  }

  const props = PropertiesService.getScriptProperties();
  props.setProperty("KEC_CLIENT_ID", clientId);
  props.setProperty("KEC_DOMAIN_ID", domainId);
  props.setProperty("KEC_BUSINESS_UNIT_ID", businessUnitId);

  logAuditEvent_(
    caller,
    "KEC_CONFIG_EDIT",
    "KeC Eligibility IDs ge?ndert ? Client: " + clientId + ", Domain: " + domainId + ", BU: " + businessUnitId
  );

  return { success: true };
}

// ============================================================================
// API: Liste offener Projekte f?r das KeC-Dropdown
// ============================================================================

function apiGetEligibleKeCProjects() {
  const caller = getUserEmail_();
  if (!caller) return { success: false, error: "Not logged in", projects: [] };

  try {
    const kecClientId = getKecClientId_();
    const kecDomainId = getKecDomainId_();
    const kecBuId     = getKecBusinessUnitId_();

    // Phrase v1 /projects ignoriert clientId/domainId/businessUnitId Query-Params.
    // Daher: Alle NEW-Projekte paginiert laden, dann clientseitig filtern.
    const authHeader = { Authorization: getPhraseAuthHeader_() };
    let allProjects = [];
    let pageNumber  = 0;
    const pageSize  = 50;

    while (true) {
      const url = phraseApiUrlV1_(
        "/projects?statuses=NEW&pageNumber=" + pageNumber + "&pageSize=" + pageSize
      );
      const res = phraseFetchJson_(url, { method: "get", headers: authHeader });

      // v1 gibt Array direkt zur?ck (kein .content)
      const page = Array.isArray(res) ? res : (res && res.content ? res.content : []);

      if (!page.length) break;
      allProjects = allProjects.concat(page);

      // Weniger als pageSize ? letzte Seite
      if (page.length < pageSize) break;

      pageNumber++;

      // Sicherheitslimit: max 20 Seiten = 1000 Projekte
      if (pageNumber >= 20) {
        console.warn("KeC: Paginierungslimit (20 Seiten) erreicht.");
        break;
      }
    }

    console.log("KeC: " + allProjects.length + " NEW-Projekte geladen. Filtere nach AKW/Marketing Content/MMV-P...");

    if (!allProjects.length) {
      return { success: true, projects: [] };
    }

    // Clientseitiger Filter: Client AKW + Domain Marketing Content + BU MMV-P
    const matching = allProjects.filter(p => {
      const clientId = String((p.client       && p.client.id)       || "");
      const domainId = String((p.domain       && p.domain.id)       || "");
      const buId     = String((p.businessUnit && p.businessUnit.id) || "");

      const clientOk = clientId === kecClientId
                    || (p.client && p.client.name === "AKW");
      const domainOk = domainId === kecDomainId
                    || (p.domain && p.domain.name === "Marketing Content");
      const buOk     = buId === kecBuId
                    || (p.businessUnit && p.businessUnit.name === "MMV-P");

      return clientOk && domainOk && buOk;
    });

    console.log("KeC: " + matching.length + " Projekte nach Metadaten-Filter. Pr?fe Workflow-Zust?nde...");

    if (!matching.length) {
      return { success: true, projects: [] };
    }

    // Workflow-Eligibility pr?fen
    const eligible = [];

    for (const p of matching) {
      try {
        const eligibilityInfo = _kecCheckProjectEligibility_(p.uid);
        if (!eligibilityInfo.eligible) {
          console.log("KeC: " + p.name + " ? nicht eligible: " + eligibilityInfo.reason);
          continue;
        }

        const sourceLang  = String(p.sourceLang || "").trim();
        const targetLangs = eligibilityInfo.targetLangs.length
          ? eligibilityInfo.targetLangs
          : (Array.isArray(p.targetLangs) ? p.targetLangs : []);

        eligible.push({
          projectUid:  String(p.uid  || "").trim(),
          projectName: String(p.name || p.uid || "").trim(),
          sourceLang:  sourceLang,
          targetLangs: targetLangs,
          dueDate:     p.dateDue || ""
        });

        console.log("KeC Match: " + p.name);

      } catch (innerErr) {
        console.warn("KeC: Workflow-Check ?bersprungen f?r " + p.uid + ": " + innerErr.message);
      }
    }

    eligible.sort((a, b) => a.projectName.localeCompare(b.projectName));
    console.log("KeC: " + eligible.length + " finale Projekte an Frontend ?bergeben.");
    return { success: true, projects: eligible };

  } catch (e) {
    console.error("apiGetEligibleKeCProjects failed:", e);
    return { success: false, error: e.message, projects: [] };
  }
}

// ============================================================================
// Workflow-Eligibility Check (ZENTRALE WORKFLOW REGEL - FINAL FIX)
// ============================================================================

/**
 * REGEL:
 * - Level 1 ("Translation" / MT): EGAL ob offen, COMPLETED oder DELIVERED -> kein Blocker!
 * - Level 2+ ("Review AKW" etc.): Solange KEIN Job dort in aktiver Bearbeitung oder 
 *   abgeschlossen ist, bleibt das Projekt offen f?r neue Uploads.
 */
function _kecCheckProjectEligibility_(projectUid) {
  const authHeader = { Authorization: getPhraseAuthHeader_() };
  const MAX_LEVEL  = 5;

  // Diese Status auf Level 2+ bedeuten: "Hier arbeitet schon jemand / ist schon fertig" -> BLOCKIEREN!
  // Alle anderen Status (NEW, EMAILED, CREATED, leer, etc.) sind ERLAUBT!
  const BLOCKING_STATUSES_LEVEL2_PLUS = [
    "ACCEPTED", "ASSIGNED", "COMPLETED", "DELIVERED", 
    "DECLINED", "REJECTED", "CANCELLED", "CANCELED"
  ];

  const targetLangsSet = {};
  let   highestLevelSeen = 0;

  for (let level = 1; level <= MAX_LEVEL; level++) {
    const jobsUrl = phraseApiUrlV2_(
      "/projects/" + encodeURIComponent(projectUid) +
      "/jobs?workflowLevel=" + level + "&pageSize=100"
    );

    let jobsRes;
    try {
      jobsRes = phraseFetchJson_(jobsUrl, { method: "get", headers: authHeader });
    } catch (e) {
      break; // Level existiert nicht -> Schleife abbrechen
    }

    const jobs = (jobsRes && Array.isArray(jobsRes.content)) ? jobsRes.content
               : (Array.isArray(jobsRes) ? jobsRes : []);

    if (!jobs.length) break;

    highestLevelSeen = level;

    // Zielsprachen ?ber ALLE Levels sammeln
    for (const j of jobs) {
      const tl = String(j.targetLang || "").trim();
      if (tl) targetLangsSet[tl] = true;
    }

    // LEVEL 1 (Translation / MT) KOMPLETT IGNORIEREN!
    if (level === 1) continue;

    // AB LEVEL 2: Blockieren, sobald ein Job einen der echten Blocker-Status hat
    const blockingJobs = jobs.filter(j => {
      const s = String(j.status || "").trim().toUpperCase();
      return BLOCKING_STATUSES_LEVEL2_PLUS.indexOf(s) !== -1;
    });

    if (blockingJobs.length > 0) {
      const foundStatuses = blockingJobs.map(j => String(j.status).toUpperCase());
      return {
        eligible:    false,
        sourceLang:  "",
        targetLangs: Object.keys(targetLangsSet),
        reason:      "Workflow auf Schritt " + level + " bereits aktiv/fertig. Blockierende Status gefunden: " + [...new Set(foundStatuses)].join(", ")
      };
    }
  }

  const targetLangs = Object.keys(targetLangsSet);

  if (highestLevelSeen === 0) {
    return { eligible: true, sourceLang: "", targetLangs: [], reason: "" };
  }

  // Level 1 egal, Level 2+ sauber -> Projekt ist ELIGIBLE!
  return { eligible: true, sourceLang: "", targetLangs: targetLangs, reason: "" };
}

// ============================================================================
// API: Einzelprojekt-Debugger (nutzt jetzt 1:1 _kecCheckProjectEligibility_)
// ============================================================================

function apiDebugSingleKeCProject(projectUid) {
  const caller = getUserEmail_();
  if (!caller) return { success: false, error: "Not logged in" };

  const kecClientId = getKecClientId_();
  const kecDomainId = getKecDomainId_();
  const kecBuId     = getKecBusinessUnitId_();

  const report = {
    uid: projectUid,
    exists: false,
    statusOk: false,
    clientOk: false,
    domainOk: false,
    buOk: false,
    workflowOk: false,
    details: {}
  };

  try {
    // Direkter Zugriff per UID
    let project = null;
    try {
      const url = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
      project = phraseFetchJson_(url, {
        method: "get",
        headers: { Authorization: getPhraseAuthHeader_() }
      });
      report.exists = true;
    } catch(e1) {
      // Fallback: paginiert suchen
      try {
        let pageNumber = 0;
        outer:
        while (pageNumber < 20) {
          const listUrl = phraseApiUrlV1_("/projects?statuses=NEW&pageNumber=" + pageNumber + "&pageSize=50");
          const listRes = phraseFetchJson_(listUrl, {
            method: "get",
            headers: { Authorization: getPhraseAuthHeader_() }
          });
          const page = Array.isArray(listRes) ? listRes : (listRes && listRes.content ? listRes.content : []);
          if (!page.length) break;
          for (const p of page) {
            if (p.uid === projectUid) { project = p; report.exists = true; break outer; }
          }
          if (page.length < 50) break;
          pageNumber++;
        }
      } catch(e2) {
        report.details.existence = "Projekt nicht gefunden: " + e2.message;
        return { success: true, report: report };
      }
    }

    if (!project) {
      report.details.existence = "Projekt nicht in Phrase TMS gefunden oder kein Lesezugriff.";
      return { success: true, report: report };
    }

    // GATE 2: Status
    const currentStatus = String(project.status || "").toUpperCase();
    report.details.actualStatus = currentStatus;
    report.statusOk = currentStatus === "NEW";
    if (!report.statusOk) {
      report.details.statusError = "Status ist '" + currentStatus + "' ? erwartet: NEW.";
    }

    // GATE 3-5: Metadaten
    const actualClientId   = project.client       ? String(project.client.id       || "") : "";
    const actualClientName = project.client       ? String(project.client.name     || "") : "";
    const actualDomainId   = project.domain       ? String(project.domain.id       || "") : "";
    const actualDomainName = project.domain       ? String(project.domain.name     || "") : "";
    const actualBuId       = project.businessUnit ? String(project.businessUnit.id || "") : "";
    const actualBuName     = project.businessUnit ? String(project.businessUnit.name|| "") : "";

    report.details.client = actualClientName + " (ID: " + actualClientId + ")";
    report.details.domain = actualDomainName + " (ID: " + actualDomainId + ")";
    report.details.bu     = actualBuName     + " (ID: " + actualBuId     + ")";

    report.clientOk = actualClientId === kecClientId  || actualClientName === "AKW";
    report.domainOk = actualDomainId === kecDomainId  || actualDomainName === "Marketing Content";
    report.buOk     = actualBuId === kecBuId || actualBuName === "MMV-P";

    // GATE 6: Workflow (exakter Abgleich zur zentralen Pr?flogik)
    const eligibility = _kecCheckProjectEligibility_(projectUid);
    if (eligibility.eligible) {
      report.workflowOk = true;
    } else {
      report.workflowOk = false;
      report.details.workflowError = eligibility.reason;
    }

    return { success: true, report: report };

  } catch (e) {
    console.error("apiDebugSingleKeCProject failed:", e);
    return { success: false, error: e.message };
  }
}

// ============================================================================
// API: Upload in bestehendes Projekt
// ============================================================================

function apiUploadToExistingProject(payload) {
  const _startTime = Date.now();

  const access = apiCheckAccess();
  if (!access.allowed) {
    if (access.reason === "maintenance") {
      return { ok: false, error: "Maintenance active", maintenance: access.maintenance };
    }
    return { ok: false, error: "Not authorized. Please request access." };
  }

  const userEmail = getUserEmail_();
  payload = payload || {};

  const projectUid = String(payload.existingProjectUid || "").trim();
  if (!projectUid) return { success: false, error: "Existing project UID missing." };

  let mainFiles = payload.mainFiles || payload.allMainFiles || [];
  if (!Array.isArray(mainFiles)) mainFiles = [mainFiles];
  if (mainFiles.length === 0) return { success: false, error: "Main file missing." };

  const refFiles    = [...(payload.refFiles || [])];
  const refDriveIds = Array.isArray(payload.refDriveIds) ? payload.refDriveIds : [];
  refDriveIds.forEach(id => {
    if (id) refFiles.push({ source: "drive", id: id, name: "" });
  });

  // Extension Check
  for (const f of mainFiles) {
    const meta    = resolveFileMeta_(f);
    const name    = String(meta.fileName || "").toLowerCase();
    const blocked = BLOCKED_MAIN_EXTENSIONS_.find(ext => name.endsWith(ext));
    if (blocked) {
      return {
        success: false,
        error: `Upload failed: "${meta.fileName}" cannot be used as a main file.\n\n` +
               `${blocked === ".pdf" ? "PDFs" : ".doc files"} cannot be translated by Phrase TMS.\n` +
               `Please upload the editable source format (.docx, .xlsx, .pptx, .idml, etc.).`
      };
    }
  }

  try {
    // Eligibility nochmal pr?fen
    const eligibility = _kecCheckProjectEligibility_(projectUid);
    if (!eligibility.eligible) {
      return {
        success: false,
        error: "Projekt ist nicht mehr f?r zus?tzliche Uploads geeignet.\n\nGrund: " + eligibility.reason
      };
    }

    // Projektdaten holen
    let project = null;
    try {
      project = phraseFetchJson_(phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid)), {
        method: "get",
        headers: { Authorization: getPhraseAuthHeader_() }
      });
    } catch(e) {
      console.warn("Direkter Projekt-Zugriff fehlgeschlagen, fahre ohne Metadaten fort:", e.message);
      project = {};
    }

    const targetLangs = eligibility.targetLangs.length
      ? eligibility.targetLangs
      : (Array.isArray(project.targetLangs) ? project.targetLangs : []);

    if (!targetLangs.length) {
      return { success: false, error: "Projekt hat keine Zielsprachen." };
    }

    const queueProjectName = payload.projectName || String((project && project.name) || projectUid).trim();
    const sourceLang       = String((project && project.sourceLang) || "");
    const dueDate          = (project && project.dateDue) ? project.dateDue : "";

    // Reference Files
    const refResults = [];
    for (const f of refFiles) {
      if (Date.now() - _startTime > KEC_UPLOAD_DEADLINE_MS_) {
        console.warn("?? KeC Deadline guard: skipping remaining reference files");
        break;
      }
      try {
        const blob    = resolveFileToBlob_(f);
        const refName = blob.getName() || resolveFileMeta_(f).fileName || "reference";
        phraseUploadReference_(projectUid, blob, refName);
        refResults.push({ name: refName, ok: true });
      } catch (e) {
        refResults.push({ name: resolveFileMeta_(f).fileName || "reference", ok: false, error: String(e) });
      }
    }

    // Main Files
    const mainResults   = [];
    const newJobUids    = [];
    const newJobMapping = [];
    const overallErrors = [];

    for (let i = 0; i < mainFiles.length; i++) {
      if (Date.now() - _startTime > KEC_UPLOAD_DEADLINE_MS_) {
        overallErrors.push("?? Some files were not uploaded due to time limit.");
        break;
      }
      try {
        const blob          = resolveFileToBlob_(mainFiles[i]);
        const mainFileName  = blob.getName();
        const up            = phraseUploadJob_(projectUid, blob, mainFileName, targetLangs);
        const jobsArr       = Array.isArray(up.jobs) ? up.jobs : [];
        const extractedUids = jobsArr.map(j => String(j.uid || "")).filter(Boolean);

        if (up.unsupportedFiles && up.unsupportedFiles.length > 0) {
          mainResults.push({ name: mainFileName, jobUids: [], unsupported: true });
          overallErrors.push(`"${mainFileName}" wurde von Phrase TMS abgelehnt ? Format nicht unterst?tzt.`);
          continue;
        }

        mainResults.push({ name: mainFileName, jobUids: extractedUids, targetLangs });
        newJobUids.push(...extractedUids);
        jobsArr.forEach(j => {
          if (j.uid) newJobMapping.push({ jobUid: j.uid, fileName: mainFileName, targetLang: j.targetLang || "" });
        });

      } catch (e) {
        overallErrors.push(`Upload fehlgeschlagen f?r Datei ${i + 1}: ${e.message}`);
      }
    }

    if (newJobUids.length === 0 && overallErrors.length > 0) {
      return { success: false, error: "Upload fehlgeschlagen.\n" + overallErrors.join("\n") };
    }

    // Chat Notification
    let threadId = "";
    if (getUserChatPreference_(userEmail)) {
      const phraseUrl    = "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
      const filesBlock   = mainResults.map(f =>
        f.unsupported
          ? `? *${f.name}* ?? (Format nicht unterst?tzt)`
          : `? *${f.name}*\n` + (f.jobUids || []).map((jUid, idx) =>
              `   ? ${(f.targetLangs && f.targetLangs[idx]) || "Target"}: https://cloud.memsource.com/web/job/${encodeURIComponent(jUid)}/translate`
            ).join("\n")
      ).join("\n");

      const noteLine   = payload.note ? "? *Notiz:* " + payload.note + "\n" : "";
      const projectMsg = fillTemplate_(getMessageTemplate_("MSG_PROJECT_SUBMITTED", "en"), {
        PROJECT_NAME:  queueProjectName + " (additional jobs)",
        TEMPLATE_NAME: "Existing KeC Project",
        SOURCE_LANG:   sourceLang,
        TARGET_LANGS:  targetLangs.join(", "),
        DEADLINE:      dueDate ? new Date(dueDate).toLocaleDateString("de-DE") : "Nicht gesetzt",
        NOTE_LINE:     noteLine,
        FILES:         filesBlock,
        PHRASE_URL:    phraseUrl
      });

      try {
        const chatResponse = sendPrivateMessage_(userEmail, projectMsg);
        if (chatResponse && chatResponse.name) threadId = chatResponse.name;
      } catch (e) {
        console.error("Chat Benachrichtigung fehlgeschlagen:", e.message);
      }
    }

    // Queue Eintrag
    const sh = getQueueSheet_();
    sh.appendRow([
      new Date().toISOString(), userEmail, projectUid,
      (resolveFileMeta_(mainFiles[0]).source === "drive" && resolveFileMeta_(mainFiles[0]).fileId)
        ? resolveFileMeta_(mainFiles[0]).fileId : "pc_upload",
      (mainResults[0] && mainResults[0].name) || resolveFileMeta_(mainFiles[0]).fileName || "unknown_file",
      resolveFileMeta_(mainFiles[0]).mimeType || "",
      targetLangs.join(", "), "UPLOADED", JSON.stringify(newJobUids), "",
      "", queueProjectName + " (KeC additional)", dueDate || "", "", "", "", "", "",
      payload.templateName || "KeC: Existing Project Upload", threadId,
      JSON.stringify(newJobMapping), ""
    ]);

    logAuditEvent_(userEmail, "KEC_ADDITIONAL_UPLOAD",
      `Uploaded ${mainResults.length} file(s) to '${queueProjectName}' (${projectUid})`);

    return {
      success:         true,
      timedOut:        overallErrors.some(e => e.includes("??")),
      projectUid:      projectUid,
      allProjectUids:  [projectUid],
      jobUids:         newJobUids,
      jobMapping:      newJobMapping,
      mainResults:     mainResults,
      refResults:      refResults,
      createdProjects: 1,
      errors:          overallErrors.length ? [...new Set(overallErrors)] : []
    };

  } catch (e) {
    console.error("apiUploadToExistingProject failed:", e);
    return { success: false, error: e.message };
  }
}

function testKeCFrontend() {
  const result = apiGetEligibleKeCProjects();
  console.log("success:", result.success);
  console.log("error:", result.error);
  console.log("projects:", result.projects.length);
  result.projects.forEach(p => console.log(" -", p.projectUid, p.projectName));
}