/**
 * DocBoard.gs
 * Liest die "Board"-Kanban-Ansicht live aus dem externen Documentation-Sheet
 * und liefert sie strukturiert ans Frontend. Google Sheets l?sst sich nicht
 * per iframe einbetten (CSP), daher bauen wir die Kanban-Ansicht selbst nach.
 */
var DOC_BOARD_SHEET_ID_   = "1_EFW_ItawRvutiVrcNIamKTSYPFsA5XFGR1s6PctYxs";
var DOC_BOARD_SHEET_NAME_ = "Board";

function apiGetDocBoardData() {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  try {
    var ss = SpreadsheetApp.openById(DOC_BOARD_SHEET_ID_);
    var sh = ss.getSheetByName(DOC_BOARD_SHEET_NAME_);
    if (!sh) return { success: false, error: "Board sheet nicht gefunden." };

    var lastRow = sh.getLastRow();
    var lastCol = sh.getLastColumn();
    if (lastRow < 3) return { success: true, columns: [] };

    var data = sh.getRange(1, 1, lastRow, lastCol).getValues();

    var headerRowIdx = -1, headerColIdx = -1;
    for (var r = 0; r < data.length; r++) {
      for (var c = 0; c < data[r].length; c++) {
        if (String(data[r][c]).trim().toUpperCase() === "NEW") {
          headerRowIdx = r; headerColIdx = c; break;
        }
      }
      if (headerRowIdx !== -1) break;
    }
    if (headerRowIdx === -1) {
      return { success: false, error: "Konnte Kanban-Header (NEW/UPLOADED/COMPLETED) im Board-Sheet nicht finden." };
    }

    var colNames = [];
    for (var cc = headerColIdx; cc < Math.min(headerColIdx + 6, lastCol); cc++) {
      var name = String(data[headerRowIdx][cc] || "").trim();
      if (!name) break;
      colNames.push({ name: name, colIdx: cc });
    }

    var countRowIdx = headerRowIdx + 1;
    var counts = colNames.map(function(cn) {
      var v = data[countRowIdx] ? data[countRowIdx][cn.colIdx] : "";
      return Number(v) || 0;
    });

    var columns = colNames.map(function(cn, i) {
      return { name: cn.name, count: counts[i], cards: [] };
    });

    for (var rr = countRowIdx + 1; rr < data.length; rr++) {
      var rowHasContent = false;
      colNames.forEach(function(cn, i) {
        var cellVal = data[rr][cn.colIdx];
        if (cellVal && String(cellVal).trim()) {
          rowHasContent = true;
          var lines = String(cellVal).split("\n");
          columns[i].cards.push({
            projectName: (lines[0] || "").trim(),
            fileName:    (lines[1] || "").trim()
          });
        }
      });
      if (!rowHasContent) break;
    }

    return { success: true, columns: columns, fetchedAt: new Date().toISOString() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function phraseGetCustomFieldDefinitionsMap_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get("phrase_cf_defs_map");
  if (cached) {
    try { return JSON.parse(cached); } catch (e) {}
  }
  var map = {};
  var pageNumber = 0;
  while (true) {
    var url = phraseApiUrlV1_("/customFields?pageNumber=" + pageNumber + "&pageSize=50");
    var res = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var content = (res && res.content) || [];
    content.forEach(function(f) {
      if (f.uid) map[f.uid] = f.name || f.uid;
    });
    if (content.length < 50) break;
    pageNumber++;
    if (pageNumber >= 10) break;
  }
  try { cache.put("phrase_cf_defs_map", JSON.stringify(map), 21600); } catch (e) {}
  return map;
}

function apiGetPhraseProjectMetaByName(projectName) {
  var access = apiCheckAccess();
  if (!access.allowed) return { success: false, error: "Not authorized." };

  var name = String(projectName || "").trim();
  if (!name) return { success: true, found: false };

  try {
    var url = phraseApiUrlV1_("/projects?name=" + encodeURIComponent(name) + "&pageSize=50");
    var result = phraseFetchJson_(url, {
      method: "get",
      headers: { Authorization: getPhraseAuthHeader_() }
    });

    var list = Array.isArray(result) ? result : (result && result.content ? result.content : []);
    var exact = list.filter(function(p) {
      return String(p.name || "").trim() === name;
    });
    var candidates = exact.length ? exact : list;

    if (!candidates.length) {
      return { success: true, found: false };
    }

    candidates.sort(function(a, b) {
      var da = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
      var db = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
      return db - da;
    });
    var p = candidates[0];

    var full = p;
    try {
      full = phraseFetchJson_(phraseApiUrlV1_("/projects/" + encodeURIComponent(p.uid)), {
        method: "get", headers: { Authorization: getPhraseAuthHeader_() }
      });
    } catch (e) { /* Fallback auf Listen-Objekt */ }

    var createdByName = "?";
    if (full.createdBy) {
      var cbFull = ((full.createdBy.firstName || "") + " " + (full.createdBy.lastName || "")).trim();
      createdByName = cbFull || full.createdBy.userName || "?";
    }
    var ownerName = "?";
    if (full.owner) {
      var ownFull = ((full.owner.firstName || "") + " " + (full.owner.lastName || "")).trim();
      ownerName = full.owner.userName || ownFull || "?";
    }

    var customFields = [];
    try {
      var cfDefs = phraseGetCustomFieldDefinitionsMap_();
      var cfUrl = phraseApiUrlV1_("/projects/" + encodeURIComponent(p.uid) + "/customFields?pageSize=50");
      var cfRes = phraseFetchJson_(cfUrl, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
      var cfList = (cfRes && Array.isArray(cfRes.content)) ? cfRes.content : (Array.isArray(cfRes) ? cfRes : []);
      cfList.forEach(function(inst) {
        var fieldUid = inst.customField && inst.customField.uid;
        var fieldName = (fieldUid && cfDefs[fieldUid]) || (inst.customField && inst.customField.name) || fieldUid || "";
        if (fieldName) {
          var val = inst.value;
          customFields.push({
            name: fieldName,
            value: (val === null || val === undefined || val === "") ? "?" : String(val)
          });
        }
      });
    } catch (e) { /* Custom Fields optional ? kein harter Fehler */ }

    return {
      success: true,
      found: true,
      ambiguous: candidates.length > 1,
      matchCount: candidates.length,
      projectUid: p.uid,
      internalId: full.internalId || "?",
      status: full.status || "?",
      createdBy: createdByName,
      dateCreated: full.dateCreated || "",
      dateDue: full.dateDue || "",
      sourceLang: full.sourceLang || "?",
      targetLangs: Array.isArray(full.targetLangs) ? full.targetLangs.join(", ") : "?",
      owner: ownerName,
      domain: (full.domain && full.domain.name) || "?",
      subDomain: (full.subDomain && full.subDomain.name) || "?",
      client: (full.client && full.client.name) || "?",
      businessUnit: (full.businessUnit && full.businessUnit.name) || "?",
      customFields: customFields,
      phraseUrl: "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(p.uid)
    };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}