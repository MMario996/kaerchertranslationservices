/**
 * KecSettings.gs
 *
 * Persoenliche Einstellungen fuer den Reiter "KeC Projects" (Unterreiter
 * "Einstellungen", Oberflaeche in KecSettingsUi.html). Liegen pro Nutzer im
 * UserPrefs-Sheet unter dem Schluessel "kec" (siehe UserPrefs.gs).
 *
 *   nameParts    Zusaetze zum Projektnamen in der gewaehlten Reihenfolge,
 *                z.B. ["date", "time", "owner"] (KEC_NAME_PARTS_)
 *   nameSep      Trenner zwischen Name und Zusaetzen (KEC_NAME_SEPS_)
 *   namePos      "suffix" (hinten) | "prefix" (vorne)
 *   xlsx         Multilinguale Excel-Dateien:
 *                { enabled, sourceColumn, targetColumns: {sprache: spalte},
 *                  contextColumn, startRow }
 *   bufferHours  Bis wie viele Stunden nach Erstellung eines Projekts noch
 *                Dateien ueber "Add to Existing Open Project" hinzukommen
 *                duerfen (KEC_BUFFER_HOURS_)
 */

var KEC_NAME_PARTS_   = ["date", "time", "owner", "creator", "source", "targets", "template"];
var KEC_NAME_SEPS_    = [" - ", "_", " "];
var KEC_BUFFER_HOURS_ = [2, 4, 8, 24, 48];
var KEC_BUFFER_HOURS_DEFAULT_ = 2;
// Excel hat hoechstens 1.048.576 Zeilen - "ab Zeile N" wird als Bereich N-1048576 an Phrase gegeben.
var KEC_XLSX_MAX_ROW_ = 1048576;

function kecDefaultSettings_() {
  return {
    nameParts: [],
    nameSep: " - ",
    namePos: "suffix",
    xlsx: { enabled: false, sourceColumn: "A", targetColumns: {}, contextColumn: "", startRow: 2 },
    bufferHours: KEC_BUFFER_HOURS_DEFAULT_
  };
}

/** Spaltenbuchstabe(n) A..XFD, sonst "". */
function kecColumn_(v) {
  var c = String(v || "").trim().toUpperCase();
  return /^[A-Z]{1,3}$/.test(c) ? c : "";
}

/** Bringt gespeicherte oder vom Client gesendete Werte in eine gueltige Form. */
function kecSanitizeSettings_(s) {
  var d = kecDefaultSettings_();
  s = s || {};
  var parts = Array.isArray(s.nameParts) ? s.nameParts : [];
  d.nameParts = parts.filter(function (p, i) { return KEC_NAME_PARTS_.indexOf(p) >= 0 && parts.indexOf(p) === i; });
  if (KEC_NAME_SEPS_.indexOf(s.nameSep) >= 0) d.nameSep = s.nameSep;
  if (s.namePos === "prefix") d.namePos = "prefix";

  var x = s.xlsx || {};
  var targets = {};
  var tc = x.targetColumns || {};
  Object.keys(tc).slice(0, 60).forEach(function (lang) {
    var code = String(lang || "").trim().toLowerCase().replace(/-/g, "_");
    var col = kecColumn_(tc[lang]);
    if (/^[a-z]{2,3}(_[a-z0-9]{2,8})*$/.test(code) && col) targets[code] = col;
  });
  var row = parseInt(x.startRow, 10);
  d.xlsx = {
    enabled: x.enabled === true,
    sourceColumn: kecColumn_(x.sourceColumn) || "A",
    targetColumns: targets,
    contextColumn: kecColumn_(x.contextColumn),
    startRow: row >= 1 && row <= KEC_XLSX_MAX_ROW_ ? row : 2
  };

  var h = Number(s.bufferHours);
  if (KEC_BUFFER_HOURS_.indexOf(h) >= 0) d.bufferHours = h;
  return d;
}

/** Einstellungen eines Nutzers (mit Defaults, falls noch nichts gespeichert ist). */
function kecSettingsFor_(email) {
  var prefs = {};
  try { prefs = userPrefsGet_(email) || {}; } catch (e) { prefs = {}; }
  return kecSanitizeSettings_(prefs.kec);
}

function apiGetKecUserSettings() {
  var email = getUserEmail_();
  if (!email) return { success: false, error: "Not logged in" };
  return {
    success: true,
    settings: kecSettingsFor_(email),
    options: { nameParts: KEC_NAME_PARTS_, nameSeps: KEC_NAME_SEPS_, bufferHours: KEC_BUFFER_HOURS_ }
  };
}

function apiSaveKecUserSettings(settings) {
  var email = getUserEmail_();
  if (!email) return { success: false, error: "Not logged in" };
  try {
    var before = kecSettingsFor_(email);
    var clean = kecSanitizeSettings_(settings);
    userPrefsMerge_(email, { kec: clean });
    try {
      if (JSON.stringify(before.xlsx) !== JSON.stringify(clean.xlsx) || before.bufferHours !== clean.bufferHours) {
        logAuditEvent_(email, "KEC_SETTINGS_EDIT",
          "Excel: " + JSON.stringify(clean.xlsx) + " | Puffer: " + clean.bufferHours + " h");
      }
    } catch (e) {}
    return { success: true, settings: clean };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============================================================================
// Projektname
// ============================================================================

/**
 * Haengt die gewaehlten Zusaetze an den Projektnamen (oder stellt sie voran).
 * ctx: { now: Date, tz, owner, creator, sourceLang, targetLangs: [], templateName }
 * Leere Werte (z.B. kein Phrase-User) werden ausgelassen.
 */
function kecBuildProjectName_(baseName, settings, ctx) {
  var base = String(baseName || "").trim();
  var s = settings || kecDefaultSettings_();
  ctx = ctx || {};
  var now = ctx.now || new Date();
  var tz = ctx.tz || "Europe/Berlin";
  var fmt = ctx.formatDate || function (d, z, f) { return Utilities.formatDate(d, z, f); };
  var values = {
    date:     function () { return fmt(now, tz, "yyyy-MM-dd"); },
    time:     function () { return fmt(now, tz, "HH:mm"); },
    owner:    function () { return ctx.owner || ""; },
    creator:  function () { return ctx.creator || ""; },
    source:   function () { return ctx.sourceLang || ""; },
    targets:  function () { return (ctx.targetLangs || []).join(","); },
    template: function () { return ctx.templateName || ""; }
  };
  var extras = (s.nameParts || [])
    .map(function (p) { return values[p] ? String(values[p]() || "").trim() : ""; })
    .filter(Boolean);
  if (!extras.length) return base;
  var add = extras.join(s.nameSep);
  if (!base) return add;
  return s.namePos === "prefix" ? add + s.nameSep + base : base + s.nameSep + add;
}

/** Owner/Creator-Werte fuer den Namen: Phrase-User des Einreichers (Fallback: E-Mail). */
function kecNameContextFor_(email, settings) {
  var parts = settings.nameParts || [];
  var ctx = { now: new Date(), tz: Session.getScriptTimeZone() };
  if (parts.indexOf("owner") >= 0 || parts.indexOf("creator") >= 0) {
    var u = phraseGetUserByEmail_(email);
    var local = String(email || "").split("@")[0];
    var fullName = u ? [u.firstName, u.lastName].filter(Boolean).join(" ") : "";
    ctx.owner = fullName || local.split(/[._-]+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
    ctx.creator = (u && u.userName) || email;
  }
  return ctx;
}

// ============================================================================
// Multilinguale Excel-Dateien
// ============================================================================

function kecIsExcelFile_(fileName) {
  return /\.xlsx?$/i.test(String(fileName || ""));
}

/**
 * Phrase-Import-Settings (FileImportSettingsCreateDto) fuer eine multilinguale
 * Excel-Datei. Zielspalten nur fuer die Sprachen des Jobs; Schluessel exakt wie
 * der Phrase-Sprachcode des Jobs (Gross-/Kleinschreibung, "-" vs "_" egal).
 */
function kecBuildXlsxImportSettings_(xlsx, targetLangs) {
  var targets = {};
  var missing = [];
  (targetLangs || []).forEach(function (lang) {
    var col = xlsx.targetColumns[String(lang).toLowerCase().replace(/-/g, "_")];
    if (col) targets[lang] = col; else missing.push(lang);
  });
  var ml = { sourceColumn: xlsx.sourceColumn, targetColumns: targets, segmentation: true };
  if (xlsx.contextColumn) ml.contextNoteColumn = xlsx.contextColumn;
  if (xlsx.startRow > 1) ml.importRows = xlsx.startRow + "-" + KEC_XLSX_MAX_ROW_;
  return { settings: { fileFormat: "multiling_xls", multilingualXls: ml }, missingLangs: missing };
}

/**
 * Legt die Import-Settings einmalig in Phrase an (POST /importSettings) und
 * merkt sich die UID pro Inhalt in den Script Properties - gleiche Einstellungen
 * erzeugen keine neuen Eintraege in Phrase.
 */
function kecImportSettingsUid_(fileImportSettings) {
  var json = JSON.stringify(fileImportSettings);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, json, Utilities.Charset.UTF_8);
  var hash = digest.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
  var key = "KEC_IMPSET_" + hash;
  var props = PropertiesService.getScriptProperties();
  var cached = props.getProperty(key);
  if (cached) return cached;
  var res = phraseFetchJson_(phraseApiUrlV1_("/importSettings"), {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: getPhraseAuthHeader_() },
    payload: JSON.stringify({ name: "KTS KeC multilingual Excel " + hash.slice(0, 8), fileImportSettings: fileImportSettings })
  });
  var uid = res && res.uid ? String(res.uid) : "";
  if (!uid) throw new Error("Phrase hat keine UID fuer die Import-Settings geliefert.");
  props.setProperty(key, uid);
  return uid;
}

/**
 * Laedt eine Hauptdatei als Job hoch. Bei Excel-Dateien und aktivierter
 * Einstellung mit den Spalten des Nutzers, sonst mit den Projekt-Settings.
 * Schlaegt der Import mit den eigenen Settings fehl, wird mit den
 * Projekt-Settings wiederholt; Hinweise landen in warnings.
 */
function kecUploadJob_(projectUid, blob, fileName, targetLangs, settings, warnings) {
  var xlsx = settings && settings.xlsx;
  if (!xlsx || !xlsx.enabled || !kecIsExcelFile_(fileName)) {
    return phraseUploadJob_(projectUid, blob, fileName, targetLangs);
  }
  var built = kecBuildXlsxImportSettings_(xlsx, targetLangs);
  if (built.missingLangs.length) {
    warnings.push('"' + fileName + '": keine Zielspalte fuer ' + built.missingLangs.join(", ") +
      " hinterlegt (KeC Projects -> Einstellungen).");
  }
  var uid;
  try {
    uid = kecImportSettingsUid_(built.settings);
  } catch (e) {
    warnings.push('"' + fileName + '": Excel-Spalteneinstellungen konnten nicht angelegt werden (' + e.message +
      "), es gelten die Projekt-Einstellungen.");
    return phraseUploadJob_(projectUid, blob, fileName, targetLangs);
  }
  try {
    return phraseUploadJob_(projectUid, blob, fileName, targetLangs, null, { importSettingsUid: uid });
  } catch (e) {
    warnings.push('"' + fileName + '": Import mit den Excel-Spalteneinstellungen fehlgeschlagen (' + e.message +
      "), erneut mit den Projekt-Einstellungen hochgeladen.");
    return phraseUploadJob_(projectUid, blob, fileName, targetLangs);
  }
}

// ============================================================================
// Puffer fuer "Add to Existing Open Project"
// ============================================================================

/**
 * Prueft, ob ein Projekt noch innerhalb des Puffers nach seiner Erstellung
 * liegt. Ohne Erstellungsdatum wird nichts blockiert.
 * @return {{ok:boolean, until:string, reason:string}}
 */
function kecBufferCheck_(dateCreated, bufferHours, nowMs) {
  var created = new Date(dateCreated || "").getTime();
  if (!dateCreated || isNaN(created)) return { ok: true, until: "", reason: "" };
  var hours = Number(bufferHours) || KEC_BUFFER_HOURS_DEFAULT_;
  var untilMs = created + hours * 3600 * 1000;
  var now = typeof nowMs === "number" ? nowMs : Date.now();
  var until = new Date(untilMs).toISOString();
  if (now <= untilMs) return { ok: true, until: until, reason: "" };
  return {
    ok: false,
    until: until,
    reason: "Puffer abgelaufen: Projekt wurde am " + new Date(created).toISOString() + " erstellt, Uploads waren bis " +
      until + " moeglich (" + hours + " h, KeC Projects -> Einstellungen)."
  };
}
