/**
 * CampusBatch.gs
 *
 * "Campus Projects"-Batch-Post-Process: ersetzt den bisher manuellen Schritt,
 * bei dem eine aus Phrase heruntergeladene XLIFF-Datei per Drag&Drop auf
 * Drop_XLIFF_Here.bat gezogen wurde (process_xliff.exe), um fehlende
 * <target>-Elemente mit dem Quelltext zu befuellen (Platzhalter fuer den
 * Import in Articulate Storyline).
 *
 * Betroffen sind nur Projekte, die ueber eines der "Campus Template"-Templates
 * angelegt wurden. Die Zuordnung erfolgt ueber die "Template Name"-Spalte
 * (Index 18) im Queue-Sheet, da dort nur der Template-NAME protokolliert wird
 * (siehe Upload.gs/KeCProjects.gs queueRowsToAppend) - nicht die UID. Die UIDs
 * unten dienen nur der Dokumentation/dem Abgleich mit Phrase.
 *
 * Transform-Logik 1:1 uebernommen von process_xliff.py:
 *   Fuer jede trans-unit mit <source> aber ohne (befuelltes) <target>
 *   wird <source> per Deep-Clone dupliziert und in <target> umbenannt
 *   (Zieltext = Quelltext als Platzhalter). Das Original bleibt unveraendert;
 *   zusaetzlich entsteht "<name>_WithTargets.xlf".
 */

var CAMPUS_BATCH_TEMPLATE_NAMES_DEFAULT_ = [
  "Campus Template EN",
  "Campus Template DE",
  "Campus Template DE + GEMINI REVIEW",
  "Campus Template EN + GEMINI REVIEW"
];

// Nur zur Dokumentation / fuer einen Admin-Abgleich mit Phrase - der eigentliche
// Live-Check laeuft ueber den Namen (siehe Kommentar oben).
var CAMPUS_BATCH_TEMPLATE_UIDS_DEFAULT_ = [
  "2D38ScMITXp0lG0p90d2Wb",
  "yBaDS4sbrupw4tsUk9cAZ1",
  "EFgjHNmbS48t9ZKOEizVu3",
  "NpDab7UvGM8g61S5QuAWv2"
];

/**
 * Liefert die Liste der Campus-Template-Namen. Ueberschreibbar per Script
 * Property "CAMPUS_BATCH_TEMPLATE_NAMES" (JSON-Array), damit ein Admin neue
 * Campus-Templates ergaenzen kann, ohne Code zu deployen.
 */
function getCampusBatchTemplateNames_() {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty("CAMPUS_BATCH_TEMPLATE_NAMES");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed.map(String);
    }
  } catch (e) {
    console.warn("getCampusBatchTemplateNames_: invalid Script Property, using default. " + e.message);
  }
  return CAMPUS_BATCH_TEMPLATE_NAMES_DEFAULT_;
}

/** Kill-Switch per Script Property "CAMPUS_BATCH_ENABLED" = "false". Default: an. */
function _campusBatchEnabled_() {
  var v = PropertiesService.getScriptProperties().getProperty("CAMPUS_BATCH_ENABLED");
  return v !== "false";
}

/**
 * Sucht die zuletzt gespeicherte "Template Name"-Spalte (Index 18) im
 * Queue-Sheet fuer ein gegebenes Phrase-Projekt.
 */
function _queueTemplateNameForProject_(projectUid) {
  var uid = String(projectUid || "").trim();
  if (!uid) return "";
  try {
    var sh = getQueueSheet_();
    var data = sh.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (String(data[i][2] || "").trim() === uid) {
        return String(data[i][18] || "").trim();
      }
    }
  } catch (e) {
    console.warn("_queueTemplateNameForProject_ failed: " + e.message);
  }
  return "";
}

function isCampusBatchProject_(projectUid) {
  var tmplName = _queueTemplateNameForProject_(projectUid);
  if (!tmplName) return false;
  return getCampusBatchTemplateNames_().indexOf(tmplName) !== -1;
}

function _looksLikeXliffFile_(fileName) {
  return /\.(xlf|xliff)$/i.test(String(fileName || ""));
}

// --- XLIFF Transform (process_xliff.py-Logik, nativ in Apps Script) ----------
// Nutzt XmlService wie XliffParser.gs. getDescendantsByName_/firstChildByName_/
// elementHasContent_ sind dort definiert und global verfuegbar (Apps Script
// behandelt alle .gs-Dateien als einen gemeinsamen Namespace).

function _xliffCloneContent_(content) {
  var type = content.getType();
  if (type === XmlService.ContentTypes.TEXT) {
    return XmlService.createText(content.asText().getText());
  }
  if (type === XmlService.ContentTypes.CDATA) {
    return XmlService.createCdata(content.asCdata().getText());
  }
  if (type === XmlService.ContentTypes.ELEMENT) {
    var el = content.asElement();
    return _xliffDeepCloneElement_(el, el.getName());
  }
  // Comments/Processing Instructions etc. kommen in <source> praktisch nicht vor.
  return XmlService.createText("");
}

function _xliffDeepCloneElement_(el, newLocalName) {
  var clone = XmlService.createElement(newLocalName, el.getNamespace());
  var attrs = el.getAttributes();
  for (var i = 0; i < attrs.length; i++) {
    var a = attrs[i];
    clone.setAttribute(a.getName(), a.getValue(), a.getNamespace());
  }
  var kids = el.getAllContent();
  for (var j = 0; j < kids.length; j++) {
    clone.addContent(_xliffCloneContent_(kids[j]));
  }
  return clone;
}

/**
 * Fuellt fuer jede trans-unit mit <source> aber ohne (befuelltes) <target>
 * ein <target> mit dem geklonten Inhalt von <source> (Platzhalter = Quelltext).
 * Bereits befuellte <target>-Elemente bleiben unangetastet.
 */
function xliffFillMissingTargets_(xliffText) {
  var doc = XmlService.parse(xliffText);
  var root = doc.getRootElement();
  var transUnits = getDescendantsByName_(root, "trans-unit");

  var filledCount = 0;
  for (var i = 0; i < transUnits.length; i++) {
    var tu = transUnits[i];
    var sourceEl = firstChildByName_(tu, "source");
    if (!sourceEl) continue;

    var targetEl = firstChildByName_(tu, "target");
    if (targetEl && elementHasContent_(targetEl)) continue; // schon uebersetzt

    var newTarget = _xliffDeepCloneElement_(sourceEl, "target");

    var contents = tu.getAllContent();
    var insertIdx = contents.length;
    for (var k = 0; k < contents.length; k++) {
      var c = contents[k];
      if (c.getType() === XmlService.ContentTypes.ELEMENT && c.asElement() === sourceEl) {
        insertIdx = k + 1;
        break;
      }
    }

    if (targetEl) tu.removeContent(targetEl);
    tu.addContent(insertIdx, newTarget);
    filledCount++;
  }

  return {
    xml: XmlService.getRawFormat().format(doc),
    filledCount: filledCount,
    totalUnits: transUnits.length
  };
}

/**
 * Haupteinstiegspunkt fuer die Download-Funktionen in DownloadZip.gs:
 * Wenn das Projekt eines der Campus-Templates nutzt UND die Datei wie XLIFF
 * aussieht, wird zusaetzlich eine "<name>_WithTargets.xlf"-Blob erzeugt.
 * Das Original bleibt unveraendert - genau wie beim bisherigen manuellen
 * Drag&Drop auf Drop_XLIFF_Here.bat.
 *
 * @param {string} projectUid
 * @param {string} outName  Finaler Dateiname des Originals (fuer Ext./Basename)
 * @param {GoogleAppsScript.Base.Blob} blob  Original-Blob (unveraendert)
 * @returns {{ blobs: GoogleAppsScript.Base.Blob[], applied: boolean, error: (string|null) }}
 */
function applyCampusBatchIfNeeded_(projectUid, outName, blob) {
  var result = { blobs: [blob], applied: false, error: null };

  if (!_campusBatchEnabled_()) return result;
  if (!_looksLikeXliffFile_(outName)) return result;

  try {
    if (!isCampusBatchProject_(projectUid)) return result;

    var xliffText = blob.getDataAsString("UTF-8");
    var processed = xliffFillMissingTargets_(xliffText);

    var base = _stripExt_(outName);
    var ext  = _getExt_(outName) || ".xlf";
    var newName = base + "_WithTargets" + ext;

    var newBlob = Utilities.newBlob(processed.xml, "application/xml", newName);
    console.log("Campus batch: " + outName + " -> " + newName +
      " (" + processed.filledCount + "/" + processed.totalUnits + " targets filled)");

    result.blobs = [blob, newBlob];
    result.applied = true;
  } catch (e) {
    console.error("Campus batch post-process failed for " + outName + ": " + e.message);
    result.error = e.message;
  }

  return result;
}
