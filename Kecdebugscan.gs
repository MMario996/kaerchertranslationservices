/**
 * KeCDebugScan.gs ? TEMPOR?RE Debug-Datei
 *
 * Im Apps Script Editor ausf?hren: Funktion "DEBUG_kecScanTrace" ? Run
 * Dann Logs (Ausf?hrungsprotokoll) anschauen.
 *
 * Zeigt Schritt f?r Schritt, wo "Test Mario KeC" (482NuiLb8kUGfJbHYIXKm2)
 * im Scan-Flow rausf?llt.
 *
 * Nach dem Debugging: Datei wieder l?schen.
 */

function DEBUG_kecScanTrace() {
  const TARGET_UID = "nwC8uSIdSGE7fRwURueGP1"; // Test Mario KeC
  const authHeader = { Authorization: getPhraseAuthHeader_() };

  console.log("???????????????????????????????????????????");
  console.log("KeC SCAN TRACE f?r UID:", TARGET_UID);
  console.log("???????????????????????????????????????????");

  // ?? SCHRITT 1: Paginierte NEW-Projekt-Liste laden ??????????????????????
  let allProjects = [];
  let pageNumber  = 0;
  const pageSize  = 50;
  let foundOnPage = -1;

  while (true) {
    const url = phraseApiUrlV1_(
      "/projects?statuses=NEW&pageNumber=" + pageNumber + "&pageSize=" + pageSize
    );
    let res;
    try {
      res = phraseFetchJson_(url, { method: "get", headers: authHeader });
    } catch(e) {
      console.log("? Seite " + pageNumber + " Fehler:", e.message);
      break;
    }

    const page = Array.isArray(res) ? res : (res && res.content ? res.content : []);
    console.log("? Seite " + pageNumber + ": " + page.length + " Projekte" +
                (res && res.totalElements != null ? " (totalElements: " + res.totalElements + ")" : ""));

    // Ist das Zielprojekt auf dieser Seite?
    const hit = page.find(p => p.uid === TARGET_UID);
    if (hit) {
      foundOnPage = pageNumber;
      console.log("   ? ZIELPROJEKT auf Seite " + pageNumber + " gefunden!");
      console.log("      name:", hit.name);
      console.log("      status:", hit.status);
      console.log("      client:", hit.client ? (hit.client.name + " / " + hit.client.id) : "FEHLT");
      console.log("      domain:", hit.domain ? (hit.domain.name + " / " + hit.domain.id) : "FEHLT");
      console.log("      businessUnit:", hit.businessUnit ? (hit.businessUnit.name + " / " + hit.businessUnit.id) : "FEHLT");
    }

    allProjects = allProjects.concat(page);
    if (page.length < pageSize) break;
    pageNumber++;
    if (pageNumber >= 20) { console.log("?? Pagination-Limit erreicht"); break; }
  }

  console.log("???????????????????????????????????????????");
  console.log("GESAMT NEW-Projekte geladen:", allProjects.length);
  console.log("Zielprojekt in Liste?", foundOnPage >= 0 ? ("JA (Seite " + foundOnPage + ")") : "? NEIN");

  if (foundOnPage < 0) {
    console.log("");
    console.log("? PROBLEM IDENTIFIZIERT: Das Projekt ist NICHT in der /projects?statuses=NEW Liste.");
    console.log("   ? M?glicher Grund: Projekt-Status ist NICHT mehr 'NEW' in der Listen-Ansicht,");
    console.log("     oder die Liste zeigt nur Projekte mit bestimmtem Zugriff.");
    console.log("");
    console.log("   Teste jetzt Direktzugriff per UID...");
    try {
      const direct = phraseFetchJson_(phraseApiUrlV1_("/projects/" + TARGET_UID), { method: "get", headers: authHeader });
      console.log("   Direktzugriff status:", direct.status);
      console.log("   Direktzugriff name:", direct.name);
    } catch(e) {
      console.log("   Direktzugriff fehlgeschlagen:", e.message);
    }
    return;
  }

  // ?? SCHRITT 2: Metadaten-Filter testen ?????????????????????????????????
  console.log("???????????????????????????????????????????");
  console.log("SCHRITT 2: Metadaten-Filter");
  const p = allProjects.find(x => x.uid === TARGET_UID);
  const clientId = String((p.client && p.client.id) || "");
  const domainId = String((p.domain && p.domain.id) || "");
  const buId     = String((p.businessUnit && p.businessUnit.id) || "");

  const clientOk = clientId === KEC_CLIENT_ID_ || (p.client && p.client.name === "AKW");
  const domainOk = domainId === KEC_DOMAIN_ID_ || (p.domain && p.domain.name === "Marketing Content");
  const buOk     = buId === KEC_BUSINESS_UNIT_ID_ || (p.businessUnit && p.businessUnit.name === "MMV-P");

  console.log("clientId:", clientId, "=== '" + KEC_CLIENT_ID_ + "' ?", clientOk);
  console.log("domainId:", domainId, "=== '" + KEC_DOMAIN_ID_ + "' ?", domainOk);
  console.log("buId:", buId, "=== '" + KEC_BUSINESS_UNIT_ID_ + "' ?", buOk);
  console.log("Metadaten-Filter gesamt:", (clientOk && domainOk && buOk) ? "? BESTANDEN" : "? FAILED");

  if (!(clientOk && domainOk && buOk)) {
    console.log("? PROBLEM: Metadaten-Filter blockt das Projekt.");
    return;
  }

  // ?? SCHRITT 3: Workflow-Eligibility ????????????????????????????????????
  console.log("???????????????????????????????????????????");
  console.log("SCHRITT 3: Workflow-Eligibility");
  const elig = _kecCheckProjectEligibility_(TARGET_UID);
  console.log("eligible:", elig.eligible);
  console.log("reason:", elig.reason || "(keine)");
  console.log("targetLangs:", JSON.stringify(elig.targetLangs));

  console.log("???????????????????????????????????????????");
  if (elig.eligible) {
    console.log("? ALLE 3 SCHRITTE BESTANDEN ? Projekt SOLLTE im Dropdown erscheinen!");
    console.log("   Falls es trotzdem nicht erscheint: Frontend-Caching / Deployment-Problem.");
  } else {
    console.log("? PROBLEM: Workflow-Eligibility blockt: " + elig.reason);
  }
}
