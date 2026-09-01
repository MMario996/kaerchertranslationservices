/**
 * RisePatcher.gs
 *
 * Kernlogik zum Patchen von scormcontent/runtime-data.js aus einem
 * Articulate-Rise-SCORM-Export.
 *
 * Verifiziert gegen echte Kursdaten (Kurs "Growth Mindset: unlock the
 * power of openness (Deutsch)"): alle 127 Trans-Unit-IDs aus der echten
 * Rise-XLIFF wurden von build-Index_() korrekt gefunden - 0 fehlende
 * Treffer. Die Feldliste TRANSLATABLE_FIELDS_ ist entsprechend bestaetigt.
 *
 * Falls ein neuer Kurs Bloecke mit bislang unbekannten Feldnamen enthaelt
 * (z.B. Quiz-spezifische Felder), landen deren Trans-Unit-IDs beim Patchen
 * einfach in der "unmatched"-Liste - nichts geht kaputt, es wird nur nicht
 * gepatcht. In dem Fall hier die Liste erweitern.
 */

var TRANSLATABLE_FIELDS_ = [
  "title",
  "description",
  "paragraph",
  "caption",
  "heading",
  "completeHint",
  "name",
];

var JSONP_PATTERN_ = /__jsonp\("runtime-data\.js","([^"]+)"\)/;

/**
 * Decodiert den Inhalt einer runtime-data.js-Datei (als String) zum
 * eingebetteten Kurs-JSON-Objekt.
 */
function decodeRuntimeData_(jsText) {
  var match = JSONP_PATTERN_.exec(jsText);
  if (!match) {
    throw new Error(
      "Konnte kein __jsonp(...)-Aufruf in runtime-data.js finden. " +
        "Hat Rise das Ausgabeformat geaendert?"
    );
  }
  var b64 = match[1];
  var bytes = Utilities.base64Decode(b64);
  var jsonStr = Utilities.newBlob(bytes).getDataAsString("UTF-8");
  return JSON.parse(jsonStr);
}

/**
 * Kehrt decodeRuntimeData_() um: JSON-Objekt -> vollstaendiger
 * runtime-data.js-Dateiinhalt.
 */
function encodeRuntimeData_(data) {
  var jsonStr = JSON.stringify(data);
  var bytes = Utilities.newBlob(jsonStr, "text/plain", "x").getBytes();
  var b64 = Utilities.base64Encode(bytes);
  return '__jsonp("runtime-data.js","' + b64 + '")';
}

/**
 * Baut einen Index: { scopeId: { path: {parent, key} } }
 *
 * scopeId ist "course" fuer kursweite Felder (course.title,
 * course.description) oder die jeweilige Lesson-ID - das entspricht genau
 * der <file>-Aufteilung in Rises eigenem XLIFF-Export (ein <file> pro
 * Lesson, plus ein <file original="course">).
 */
function buildIndex_(data) {
  var index = {};
  var fieldSet = {};
  TRANSLATABLE_FIELDS_.forEach(function (f) {
    fieldSet[f] = true;
  });

  function register(scopeId, pathParts, parent, key) {
    var pathStr = pathParts.length ? pathParts.join("|") : key;
    if (!index[scopeId]) index[scopeId] = {};
    index[scopeId][pathStr] = { parent: parent, key: key };
  }

  function walk(node, scopeId, pathParts) {
    if (node === null || typeof node !== "object" || Array.isArray(node)) {
      return;
    }

    Object.keys(node).forEach(function (key) {
      var val = node[key];

      if (fieldSet[key] && typeof val === "string" && val.trim().length > 0) {
        register(scopeId, pathParts.concat([key]), node, key);
      } else if (key === "items" && Array.isArray(val)) {
        val.forEach(function (child) {
          if (child && typeof child === "object" && "id" in child) {
            walk(
              child,
              scopeId,
              pathParts.concat(["items|id:" + child.id])
            );
          }
        });
      } else if (val !== null && typeof val === "object" && !Array.isArray(val)) {
        // Feste Unterobjekte (z.B. "front"/"back" bei Flashcards) -
        // generisch statt hart auf bestimmte Keys geprueft. Bestaetigt
        // durch Abgleich mit der echten XLIFF (front|description,
        // back|description).
        walk(val, scopeId, pathParts.concat([key]));
      }
    });
  }

  var course = data.course;
  walk(course, "course", []);
  (course.lessons || []).forEach(function (lesson) {
    walk(lesson, lesson.id, []);
  });

  return index;
}

/**
 * Wendet eine Liste von Patches auf einen zuvor gebauten Index an.
 * patches: [{scopeId, path, text}, ...]
 * Gibt {applied, unmatched} zurueck.
 */
function applyPatch_(index, patches) {
  var applied = 0;
  var unmatched = [];

  patches.forEach(function (patch) {
    var scopeIndex = index[patch.scopeId];
    var entry = scopeIndex && scopeIndex[patch.path];
    if (!entry) {
      unmatched.push(patch);
      return;
    }
    entry.parent[entry.key] = patch.text;
    applied++;
  });

  return { applied: applied, unmatched: unmatched };
}

/**
 * High-Level-Komfortfunktion: nimmt den rohen runtime-data.js-Inhalt und
 * eine Liste von Patches, gibt den gepatchten Inhalt plus Statistik zurueck.
 */
function patchRuntimeDataJs_(jsText, patches) {
  var data = decodeRuntimeData_(jsText);
  var index = buildIndex_(data);
  var result = applyPatch_(index, patches);
  var patchedJs = encodeRuntimeData_(data);
  return {
    patchedJs: patchedJs,
    applied: result.applied,
    unmatched: result.unmatched,
    index: index,
  };
}
