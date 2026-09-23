/**
 * PivotTemplateLinks.gs
 *
 * Admin-gepflegte Verknuepfung zwischen einem Pivot-PARENT-Template
 * ("Source Check") und den CHILD-Templates ("Translation"), die der Phrase
 * Orchestrator dafuer anbieten kann. Phrase selbst entscheidet serverseitig
 * (ueber den dort konfigurierten "Project-Based Trigger"-Workflow), welches
 * Child-Template beim Abschluss des Parents tatsaechlich instanziiert wird -
 * diese Verknuepfung hier dient NUR unserem eigenen Upload-Formular dazu, zu
 * wissen, welche Zielsprachen bei einem gegebenen Parent-Template ueberhaupt
 * ueberhaupt zur Auswahl stehen duerfen (siehe PivotProjects.gs).
 *
 * Ein Parent kann mehrere Children haben (mehrere Zielsprachen/Templates)
 * und dasselbe Child-Template kann unter mehreren Parents verlinkt sein -
 * daher eine flache Tabelle statt einer 1:1-Zuordnung.
 *
 * Sheet: "PivotTemplateLinks" in ACCESS_SHEET_ID
 * Spalten: Parent Template UID | Parent Template Name | Child Template UID |
 *          Child Template Name | Child Source Lang | Child Target Langs
 */
var PIVOT_LINKS_SHEET_NAME_ = "PivotTemplateLinks";

function pivotLinksSheet_() {
  var ss = openAccessSS_();
  var sh = ss.getSheetByName(PIVOT_LINKS_SHEET_NAME_);
  if (!sh) {
    sh = ss.insertSheet(PIVOT_LINKS_SHEET_NAME_);
    sh.appendRow(["Parent Template UID", "Parent Template Name", "Child Template UID", "Child Template Name", "Child Source Lang", "Child Target Langs"]);
    sh.getRange("A1:F1").setFontWeight("bold").setBackground("#FFED00");
    sh.setFrozenRows(1);
  }
  return sh;
}

function pivotLinksReadAll_() {
  var sh = pivotLinksSheet_();
  var values = sh.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    var parentUid = String(r[0] || "").trim();
    var childUid  = String(r[2] || "").trim();
    if (!parentUid || !childUid) continue;
    rows.push({
      rowNum:          i + 1,
      parentUid:       parentUid,
      parentName:      String(r[1] || "").trim(),
      childUid:        childUid,
      childName:       String(r[3] || "").trim(),
      childSourceLang: String(r[4] || "").trim(),
      childTargetLangs: String(r[5] || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean)
    });
  }
  return rows;
}

// ============================================================================
// Admin-CRUD (Admin-Console -> Pivot Templates)
// ============================================================================

function apiGetPivotTemplateLinks() {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  try {
    return { success: true, links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiAddPivotTemplateLink(parentTemplateUid, childTemplateUid) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };

  var parentUid = String(parentTemplateUid || "").trim();
  var childUid  = String(childTemplateUid || "").trim();
  if (!parentUid || !childUid) return { success: false, error: "Parent- und Child-Template-UID sind Pflicht." };

  var parentDetails = phraseGetProjectTemplateDetails_(parentUid, true);
  if (!parentDetails) return { success: false, error: "Parent-Template-UID '" + parentUid + "' wurde bei Phrase nicht gefunden." };
  var childDetails = phraseGetProjectTemplateDetails_(childUid, true);
  if (!childDetails) return { success: false, error: "Child-Template-UID '" + childUid + "' wurde bei Phrase nicht gefunden." };
  if (!childDetails.targetLangs.length) {
    return { success: false, error: "Child-Template '" + childDetails.name + "' hat keine Zielsprache(n) hinterlegt." };
  }

  try {
    var sh = pivotLinksSheet_();
    var existing = pivotLinksReadAll_();
    var dup = existing.some(function (r) { return r.parentUid === parentUid && r.childUid === childUid; });
    if (dup) return { success: false, error: "Diese Verknuepfung existiert bereits." };

    sh.appendRow([
      parentUid, parentDetails.name,
      childUid, childDetails.name,
      childDetails.sourceLang, childDetails.targetLangs.join(", ")
    ]);
    logAuditEvent_(caller, "PIVOT_LINK_ADD", parentDetails.name + " (" + parentUid + ") -> " + childDetails.name + " (" + childUid + ")");
    return { success: true, links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

function apiRemovePivotTemplateLink(parentTemplateUid, childTemplateUid) {
  var caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };

  var parentUid = String(parentTemplateUid || "").trim();
  var childUid  = String(childTemplateUid || "").trim();

  try {
    var sh = pivotLinksSheet_();
    var values = sh.getDataRange().getValues();
    for (var i = values.length - 1; i >= 1; i--) {
      if (String(values[i][0] || "").trim() === parentUid && String(values[i][2] || "").trim() === childUid) {
        sh.deleteRow(i + 1);
        logAuditEvent_(caller, "PIVOT_LINK_REMOVE", parentUid + " -> " + childUid);
      }
    }
    return { success: true, links: pivotLinksReadAll_() };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

// ============================================================================
// Upload-Formular: verfuegbare Pivot-Zielsprachen fuer ein Parent-Template
// ============================================================================

/**
 * Liefert die Zielsprachen, die im Upload-Formular fuer ein gewaehltes
 * Pivot-Parent-Template zur Auswahl stehen sollen - die Vereinigung der
 * Zielsprachen aller admin-verlinkten Child-Templates. Fragt die Child-
 * Sprachen LIVE bei Phrase ab (gecacht, siehe phraseGetProjectTemplateDetails_),
 * damit eine nachtraegliche Aenderung am Child-Template in Phrase (neue
 * Zielsprache) nicht erst manuell im Sheet nachgepflegt werden muss.
 * @return {{ok:boolean, sourceLang:string, targets:string[], childUidMap:Object, error:string}}
 */
function apiGetPivotChildLanguageOptions(parentTemplateUid) {
  var caller = getUserEmail_();
  if (!caller) return { ok: false, error: "Not logged in." };

  var parentUid = String(parentTemplateUid || "").trim();
  if (!parentUid) return { ok: false, error: "Parent-Template-UID fehlt." };

  try {
    var links = pivotLinksReadAll_().filter(function (r) { return r.parentUid === parentUid; });
    if (!links.length) {
      return { ok: false, error: "Fuer dieses Template sind noch keine Ziel-Templates in den Admin-Einstellungen (Pivot Templates) hinterlegt." };
    }

    // Die "Ausgangssprache" fuer die Translation-Sprachauswahl wird vom
    // PARENT-Template (Source Check) kopiert, nicht von den Children - der
    // Nutzer soll sie im Formular nur angezeigt (gesperrt), nie waehlen.
    var parentDetails = phraseGetProjectTemplateDetails_(parentUid);
    var sourceLang = (parentDetails && parentDetails.sourceLang) || "";

    var targets = [];
    var childUidMap = {}; // Sprache -> Child-Template-UID (erster gefundener Treffer)

    links.forEach(function (link) {
      var details = phraseGetProjectTemplateDetails_(link.childUid);
      var childTargets = (details && details.targetLangs.length) ? details.targetLangs : link.childTargetLangs;

      childTargets.forEach(function (lang) {
        if (targets.indexOf(lang) === -1) targets.push(lang);
        if (!childUidMap[lang]) childUidMap[lang] = link.childUid;
      });
    });

    if (!targets.length) {
      return { ok: false, error: "Keine Zielsprachen bei den verlinkten Child-Templates gefunden." };
    }

    return { ok: true, sourceLang: sourceLang, targets: targets, childUidMap: childUidMap };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
}
