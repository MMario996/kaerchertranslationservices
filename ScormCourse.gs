/**
 * ScormCourse.gs
 *
 * Erkennt, was fuer ein SCORM-Export in einem (entpackten) Drive-Ordner liegt,
 * und wo die Kursdaten stecken - Grundlage fuer Campus-Preview und
 * Firebase-Deploy (Articualtepreview.gs, Orchestration.gs, Articulateapi.gs).
 *
 * Unterstuetzt:
 *  - Rise 360, aktuelles Format: scormcontent/runtime-data.js mit
 *    __jsonp("runtime-data.js","<base64-JSON>")
 *  - Rise 360, aeltere Exporte: die Kursdaten stecken als Base64-JSON direkt
 *    in scormcontent/index.html (oder einem Skript unter scormcontent/),
 *    es gibt keine runtime-data.js - nur scormdriver/scormdriver.js
 *  - Ordner eine Ebene zu tief (Export liegt in einem Unterordner)
 *  - Articulate Storyline (story.html, story_content/, lms/scormdriver.js):
 *    Texte sind dort beim Veroeffentlichen fertig gesetzt und lassen sich
 *    nicht austauschen. Solche Kurse werden UNVERAENDERT gehostet (z. B. die
 *    in Storyline uebersetzte und neu veroeffentlichte Fassung).
 *
 * Alle Funktionen ohne Drive-Zugriff sind rein (getestet); sie arbeiten auf
 * Eintraegen { path, blob } bzw. { path, text }.
 */

var SCORM_ENTRY_RISE_ = "scormcontent/index.html";
var SCORM_MAX_SCAN_BYTES_ = 8 * 1024 * 1024;

/** Text einer Datei aus einem Eintrag ({text} oder {blob}). */
function scormEntryText_(entry) {
  if (entry.text != null) return String(entry.text);
  return entry.blob.getDataAsString("UTF-8");
}

function scormEntrySize_(entry) {
  if (entry.text != null) return String(entry.text).length;
  try { return entry.blob.getBytes().length; } catch (e) { return 0; }
}

/** Base64 -> UTF-8-Text (Apps Script); in Tests per scormDecodeBase64_-Stub ersetzbar. */
function scormDecodeBase64_(b64) {
  return Utilities.newBlob(Utilities.base64Decode(b64)).getDataAsString("UTF-8");
}

function scormEncodeBase64_(text) {
  return Utilities.base64Encode(Utilities.newBlob(text, "text/plain", "x").getBytes());
}

/**
 * Sucht in einem Text nach einem Base64-Literal, das Rise-Kursdaten
 * ({ course: { lessons: [...] } }) enthaelt.
 * @return {{start:number, end:number, data:Object}|null} start/end = Position des Base64-Inhalts
 */
function scormFindCourseLiteral_(text) {
  var re = /(["'])([A-Za-z0-9+\/]{200,}={0,2})\1/g;
  var m;
  while ((m = re.exec(text))) {
    var b64 = m[2];
    var json;
    try { json = scormDecodeBase64_(b64); } catch (e) { continue; }
    if (!json || json.charAt(0) !== "{") continue;
    var data;
    try { data = JSON.parse(json); } catch (e) { continue; }
    if (data && data.course && typeof data.course === "object") {
      var start = m.index + 1;
      return { start: start, end: start + b64.length, data: data };
    }
  }
  return null;
}

/** Normalisiert Pfade (Backslashes, fuehrende Slashes). */
function scormNormPath_(p) {
  return String(p || "").replace(/\\/g, "/").replace(/^\/+/, "");
}

/**
 * Analysiert die Dateiliste eines entpackten Exports.
 * @param {Array<{path:string}>} entries
 * @return {{kind:string, root:string, entryHtml:string, reason:string, roots:Array}}
 *   kind: "rise" | "storyline" | "unknown"; root: Pfad-Praefix des Exports
 *   ("" = direkt im gewaehlten Ordner); entryHtml relativ zu root.
 */
function scormDetectLayout_(entries) {
  var paths = (entries || []).map(function (e) { return scormNormPath_(e.path); });
  var riseRoots = {}, storyRoots = {};
  paths.forEach(function (p) {
    var lp = p.toLowerCase();
    if (lp === "scormcontent/index.html" || /\/scormcontent\/index\.html$/.test(lp)) {
      riseRoots[p.slice(0, lp.lastIndexOf("scormcontent/index.html")).replace(/\/$/, "")] = true;
    }
    var s = /^(.*?)(story(?:_html5)?\.html)$/i.exec(p);
    if (s && (s[1] === "" || /\/$/.test(s[1]))) {
      var root = s[1].replace(/\/$/, "");
      if (paths.some(function (x) { return x.indexOf((root ? root + "/" : "") + "story_content/") === 0 || x.indexOf((root ? root + "/" : "") + "html5/") === 0; })) {
        storyRoots[root] = storyRoots[root] || s[2];
      }
    }
  });
  var rise = Object.keys(riseRoots).sort(function (a, b) { return a.length - b.length; });
  var story = Object.keys(storyRoots).sort(function (a, b) { return a.length - b.length; });
  if (rise.length > 1) {
    return { kind: "unknown", root: "", entryHtml: "", roots: rise,
      reason: "Der Ordner enthaelt mehrere Rise-Kurse (" + rise.map(function (r) { return "'" + (r || "/") + "'"; }).join(", ") + "). Bitte genau den Ordner eines Kurses waehlen." };
  }
  if (rise.length === 1) return { kind: "rise", root: rise[0], entryHtml: SCORM_ENTRY_RISE_, roots: rise, reason: "" };
  if (story.length > 1) {
    return { kind: "unknown", root: "", entryHtml: "", roots: story,
      reason: "Der Ordner enthaelt mehrere Storyline-Kurse (" + story.map(function (r) { return "'" + (r || "/") + "'"; }).join(", ") + "). Bitte genau den Ordner eines Kurses waehlen." };
  }
  if (story.length === 1) {
    var sr = story[0];
    var lms = (sr ? sr + "/" : "") + "index_lms.html";
    var entry = paths.indexOf(lms) !== -1 ? "index_lms.html" : storyRoots[sr];
    return { kind: "storyline", root: sr, entryHtml: entry, roots: story, reason: "" };
  }
  return { kind: "unknown", root: "", entryHtml: "", roots: [], reason: scormDescribeFolder_(paths) };
}

/** Verstaendliche Erklaerung, was im Ordner liegt (fuer Fehlermeldungen). */
function scormDescribeFolder_(paths) {
  paths = paths || [];
  if (!paths.length) return "Der Ordner ist leer.";
  var zips = paths.filter(function (p) { return /\.zip$/i.test(p); });
  var top = {};
  paths.forEach(function (p) { top[p.split("/")[0]] = true; });
  var topList = Object.keys(top).sort().slice(0, 12).join(", ");
  var hasDriver = paths.some(function (p) { return /(^|\/)scormdriver\.js$/i.test(p); });
  var parts = [];
  if (zips.length) parts.push("Im Ordner liegen ZIP-Dateien (" + zips.slice(0, 3).join(", ") + ") - bitte den ENTPACKTEN Inhalt hochladen.");
  if (hasDriver) parts.push("Gefunden wurde nur der SCORM-Treiber (scormdriver.js), aber kein Kursinhalt: weder 'scormcontent/index.html' (Rise 360) noch 'story.html' mit 'story_content/' (Storyline).");
  else parts.push("Es wurde weder 'scormcontent/index.html' (Rise 360) noch 'story.html' (Storyline) gefunden.");
  parts.push("Inhalt des Ordners (oberste Ebene): " + topList + ".");
  return parts.join(" ");
}

/**
 * Sucht die Kursdaten eines Rise-Exports.
 * Reihenfolge: runtime-data.js, index.html, dann alle Skripte unter scormcontent/.
 * @return {{index:number, path:string, format:string, start:number, end:number, data:Object}|null}
 */
function scormLocateRiseData_(entries, root) {
  var base = (root ? root + "/" : "") + "scormcontent/";
  var cands = [];
  (entries || []).forEach(function (e, i) {
    var p = scormNormPath_(e.path);
    if (p.indexOf(base) !== 0 || !/\.(js|html?)$/i.test(p)) return;
    var rel = p.slice(base.length);
    var prio = /(^|\/)runtime-data\.js$/i.test(rel) ? 0 : (rel.toLowerCase() === "index.html" ? 1 : (/^lib\//i.test(rel) ? 3 : 2));
    cands.push({ i: i, p: p, prio: prio });
  });
  cands.sort(function (a, b) { return a.prio - b.prio || a.p.localeCompare(b.p); });
  for (var k = 0; k < cands.length; k++) {
    var e = entries[cands[k].i];
    if (scormEntrySize_(e) > SCORM_MAX_SCAN_BYTES_) continue;
    var text;
    try { text = scormEntryText_(e); } catch (err) { continue; }
    var hit = scormFindCourseLiteral_(text);
    if (hit) {
      return { index: cands[k].i, path: cands[k].p, format: cands[k].prio === 0 ? "runtime-data" : "embedded",
        start: hit.start, end: hit.end, data: hit.data, text: text };
    }
  }
  return null;
}

/** Ersetzt die Kursdaten im Dateitext (gleiches Literal, gleiche Datei). */
function scormWriteCourseData_(located, data) {
  var b64 = scormEncodeBase64_(JSON.stringify(data));
  return located.text.slice(0, located.start) + b64 + located.text.slice(located.end);
}

/**
 * Pfade auf den Export-Ordner umstellen (root abschneiden), Dateien ausserhalb weglassen.
 * @return {Array<{path, blob}>}
 */
function scormRebaseEntries_(entries, root) {
  if (!root) return entries.map(function (e) { return { path: scormNormPath_(e.path), blob: e.blob, text: e.text }; });
  var pre = root + "/";
  return entries.filter(function (e) { return scormNormPath_(e.path).indexOf(pre) === 0; })
    .map(function (e) { return { path: scormNormPath_(e.path).slice(pre.length), blob: e.blob, text: e.text }; });
}

/**
 * Komplett-Analyse fuer Validierung und Preview.
 * @return {{ok:boolean, kind:string, root:string, entryHtml:string, located:Object|null,
 *           patchable:boolean, error:string, warning:string}}
 */
function scormInspect_(entries) {
  var layout = scormDetectLayout_(entries);
  var out = { ok: false, kind: layout.kind, root: layout.root, entryHtml: layout.entryHtml, located: null, patchable: false, error: "", warning: "" };
  if (layout.kind === "unknown") { out.error = layout.reason; return out; }
  if (layout.kind === "storyline") {
    out.ok = true;
    out.warning = "Storyline-Export erkannt: Storyline setzt die Texte beim Veroeffentlichen fest, Uebersetzungen aus Phrase " +
      "koennen nicht eingesetzt werden. Die Preview zeigt den Kurs so, wie er im Ordner liegt - fuer eine uebersetzte Preview " +
      "die Uebersetzung in Storyline importieren (Datei > Uebersetzung > Import), neu veroeffentlichen und diesen Export hochladen.";
    return out;
  }
  var located = scormLocateRiseData_(entries, layout.root);
  if (!located) {
    out.error = "Rise-Export gefunden" + (layout.root ? " (im Unterordner '" + layout.root + "')" : "") +
      ", aber die Kursdaten wurden nicht gefunden: weder 'scormcontent/runtime-data.js' noch eingebettete Kursdaten in " +
      "'scormcontent/index.html'. Bitte den Export in Rise neu erzeugen (Export > LMS > SCORM 1.2/2004) und entpackt hochladen.";
    return out;
  }
  out.ok = true;
  out.patchable = true;
  out.located = located;
  if (layout.root) out.warning = "Der Kurs liegt im Unterordner '" + layout.root + "' - wird automatisch verwendet.";
  return out;
}

/**
 * Patcht (bei Rise) die Kursdaten und liefert die zu deployenden Eintraege
 * relativ zum Export-Ordner.
 * @return {{entries:Array, entryHtml:string, applied:number, unmatched:Array, kind:string, warning:string, index:Object}}
 */
function scormPrepareDeploy_(entries, patches) {
  var info = scormInspect_(entries);
  if (!info.ok) throw new Error(info.error);
  var result = { entries: null, entryHtml: info.entryHtml, applied: 0, unmatched: [], kind: info.kind, warning: info.warning, index: null };
  var list = entries.slice();
  if (info.patchable) {
    var loc = info.located;
    var index = buildIndex_(loc.data);
    var r = applyPatch_(index, patches || []);
    var name = loc.path.split("/").pop();
    var mime = /\.html?$/i.test(name) ? "text/html" : "application/javascript";
    list[loc.index] = { path: loc.path, blob: Utilities.newBlob(scormWriteCourseData_(loc, loc.data), mime, name) };
    result.applied = r.applied;
    result.unmatched = r.unmatched;
    result.index = index;
  } else {
    result.unmatched = patches || [];
  }
  result.entries = scormRebaseEntries_(list, info.root);
  return result;
}
