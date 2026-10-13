#!/usr/bin/env node
/*
 * Postman-Generator (gleiche Datei in allen Kärcher-Translation-Repositories).
 *
 * Liest die .gs-Dateien des Repositories und postman/config.js und erzeugt:
 *   postman/<slug>.postman_collection.json   Collection (Postman v2.1)
 *   postman/<slug>.postman_environment.json  Environment mit allen Variablen
 *   postman/README.md                        Dokumentation inkl. Funktionskatalog
 *
 * Aufruf (im Repository-Wurzelordner):  node postman/generate.js
 * Nach Code-Änderungen erneut ausführen, damit die Collection aktuell bleibt.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const POSTMAN_DIR = __dirname;
const REPO = path.resolve(POSTMAN_DIR, '..');
const cfg = require(path.join(POSTMAN_DIR, 'config.js'));

const SCHEMA = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';
const RUN_URL = 'https://script.googleapis.com/v1/scripts/{{scriptId}}:run';
const DEFAULT_SKIP_DIRS = ['node_modules', 'dist', '.git', 'tests', 'tests-ui', 'tools', 'ci', 'docs', 'postman', 'apps-script', 'kb-src', 'wissensbasis'];

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

/** Stabile IDs, damit sich die Collection bei jedem Lauf nur dort ändert, wo sich etwas geändert hat. */
function stableId(s) {
  let h1 = 0x811c9dc5, h2 = 0x01000193;
  for (let i = 0; i < s.length; i++) {
    h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 ^ s.charCodeAt(i), 2246822519) >>> 0;
  }
  const hex = (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0') + (h1 ^ h2).toString(16).padStart(8, '0') + (h2 >>> 3).toString(16).padStart(8, '0'));
  return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-4' + hex.slice(13, 16) + '-a' + hex.slice(17, 20) + '-' + hex.slice(20, 32);
}

function lines(s) { return s.split('\n'); }
function pad2(n) { return String(n).padStart(2, '0'); }
function mdEscape(s) { return String(s || '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' '); }

function walk(dir, skipDirs, out) {
  out = out || [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (skipDirs.includes(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, skipDirs, out);
    else out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. Code einlesen: öffentliche Funktionen, Kommentare, Admin-Prüfungen, UI-Nutzung
// ---------------------------------------------------------------------------

const skipDirs = DEFAULT_SKIP_DIRS.concat(cfg.skipDirs || []);
const allFiles = walk(REPO, skipDirs);
const gsFiles = allFiles.filter(f => f.endsWith('.gs') && !(cfg.skipFiles || []).includes(path.basename(f)));
const uiFiles = allFiles.filter(f => /\.(html|js)$/.test(f) && !f.startsWith(POSTMAN_DIR) && !/eslint\.config\.js$/.test(f));
const uiText = uiFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const allGsText = gsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

/** Kommentarblock direkt über einer Funktion (JSDoc oder //-Zeilen). */
function leadingComment(ls, idx) {
  let i = idx - 1;
  while (i >= 0 && ls[i].trim() === '') i--;
  if (i < 0) return '';
  const out = [];
  if (/\*\/\s*$/.test(ls[i])) {
    while (i >= 0) {
      out.unshift(ls[i]);
      if (/^\s*\/\*/.test(ls[i])) break;
      i--;
    }
  } else {
    while (i >= 0 && /^\s*\/\//.test(ls[i])) { out.unshift(ls[i]); i--; }
  }
  return out.join('\n')
    .replace(/^\s*\/\*\*?/gm, '').replace(/\*\/\s*$/gm, '').replace(/^\s*\*\s?/gm, '').replace(/^\s*\/\/\s?/gm, '')
    .split('\n').map(s => s.trim())
    .filter(s => s && !/^[=\-─━_*#]{4,}$/.test(s) && !/^@(param|returns?|return)\b/.test(s))
    .join(' ')
    .replace(/[=─━]{3,}/g, ' ').replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?=[^a-zäöüß]*$).*$/, ''); // reine Abschnittsüberschriften in Großbuchstaben (z. B. „DEBUG“) sind keine Beschreibung
}

function functionBody(ls, idx) {
  // Bis zur nächsten Funktion auf oberster Ebene; reicht für die Admin-Erkennung.
  const out = [];
  for (let i = idx + 1; i < ls.length; i++) {
    if (/^(async\s+)?function\s/.test(ls[i])) break;
    out.push(ls[i]);
  }
  return out.join('\n');
}

const fnMap = new Map(); // name -> info (letzte Definition gewinnt, wie in Apps Script)
const duplicates = {};
for (const f of gsFiles) {
  const rel = path.relative(REPO, f).split(path.sep).join('/');
  const ls = lines(fs.readFileSync(f, 'utf8'));
  ls.forEach((l, i) => {
    const m = l.match(/^(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)/);
    if (!m) return;
    const name = m[1];
    if (name.endsWith('_')) return; // private Helfer: nicht aufrufbar
    const params = m[2].split(',').map(s => s.replace(/=.*$/, '').replace(/\/\*.*?\*\//g, '').trim()).filter(Boolean);
    const body = functionBody(ls, i);
    if (fnMap.has(name)) {
      duplicates[name] = (duplicates[name] || [fnMap.get(name).file]).concat(rel);
    }
    fnMap.set(name, {
      name, params, file: rel, line: i + 1,
      comment: leadingComment(ls, i),
      perm: cfg.permissionPattern ? ((body.match(cfg.permissionPattern) || [])[1] || '') : '',
      admin: (cfg.adminPattern || /isAdmin|requireAdmin|assertAdmin|requireHubAdmin|isHubAdmin|_requireAdmin|ensureAdmin|canManage|isAdminLight|checkAdmin|adminOnly|Admin only/i).test(body),
    });
  });
}

/** Zweck-Spalten aus vorhandenen Markdown-Tabellen (z. B. docs/API.md) übernehmen. */
const docPurpose = {};
const docRight = {};
const mdFiles = walk(REPO, skipDirs.filter(d => d !== 'docs')).filter(f => f.endsWith('.md') && !f.startsWith(POSTMAN_DIR));
for (const f of mdFiles) {
  for (const row of lines(fs.readFileSync(f, 'utf8'))) {
    if (!/^\|/.test(row)) continue;
    const cells = row.split(/(?<!\\)\|/).slice(1, -1).map(c => c.trim());
    if (cells.length < 2) continue;
    const fnNames = c => (c.match(/`([A-Za-z0-9_$]+)\s*(\(|`)/g) || []).map(s => s.replace(/[`(\s]/g, ''));
    let names = fnNames(cells[0]);
    let purpose, right;
    if (names.length) {
      purpose = cells[cells.length - 1].replace(/`/g, '').replace(/⚠️/g, '').trim();
      right = cells.length >= 3 ? cells[1].replace(/`/g, '').replace(/⚠️/g, '').trim() : '';
    } else if (cells.length === 3 && (names = fnNames(cells[1])).length) {
      // Tabellen der Form | Bereich | Funktionen | Recht |
      purpose = 'Bereich „' + cells[0].replace(/`/g, '').trim() + '“ (siehe Dokumentation).';
      right = cells[2].replace(/`/g, '').replace(/⚠️/g, '').trim();
    } else continue;
    for (const n of names) {
      if (!docPurpose[n] && purpose && purpose.length > 3) docPurpose[n] = purpose;
      if (!docRight[n] && right && right.length < 60) docRight[n] = right;
    }
  }
}

function usedByUi(name) {
  const re = new RegExp('(\\.' + name + '\\s*\\(|[\'"]' + name + '[\'"])');
  return re.test(uiText);
}

function triggerFunctions() {
  const set = new Set();
  const re = /newTrigger\(\s*['"]([A-Za-z0-9_$]+)['"]/g;
  let m;
  while ((m = re.exec(allGsText))) set.add(m[1]);
  return set;
}
const TRIGGERS = triggerFunctions();

// ---------------------------------------------------------------------------
// 2. Einordnen: Bereich, Lesen/Schreiben, ausgeschlossen
// ---------------------------------------------------------------------------

const READ_VERBS = ['get', 'list', 'load', 'search', 'find', 'check', 'browse', 'preview', 'validate', 'debug', 'health',
  'kb', 'status', 'poll', 'options', 'coverage', 'is', 'fetch', 'parse', 'compute', 'count', 'read', 'describe', 'analyze',
  'dashboard', 'queue', 'prompts', 'benchmark', 'drift', 'glossary', 'database', 'bootstrap', 'filter', 'system', 'admin'];

function verbOf(name) {
  let n = name.replace(/^api/, '');
  const m = n.match(/^(Hub|PromptEditor|Admin|Ps|Consulting|Precalc|MaxTpl|ArtPicker|PdfWeb|Pivot)(?=[A-Z])/);
  if (m && name.startsWith('api')) n = n.slice(m[1].length);
  const w = (n.match(/^[A-Za-z][a-z0-9]*/) || [''])[0].toLowerCase();
  return w;
}

function isExcluded(fi) {
  const o = (cfg.overrides || {})[fi.name] || {};
  if (o.exclude) return o.exclude;
  if (fi.name === 'doGet' || fi.name === 'doPost' || fi.name === 'include') return 'HTTP-Einstieg bzw. Template-Helfer, wird im Ordner „Web-App“ getestet.';
  if (/^on[A-Z]/.test(fi.name)) return 'Ereignis-Handler (Add-on/Chat/Editor). Braucht ein echtes Ereignisobjekt bzw. ein geöffnetes Dokument und liefert Karten/UI, die die Apps Script API nicht serialisieren kann.';
  if ((cfg.cardHandlerPattern || /^(handle[A-Z]|show[A-Z])/).test(fi.name)) return 'Karten-/Dialog-Handler des Add-ons. Läuft nur im Kontext eines geöffneten Dokuments.';
  if (fi.params.length === 1 && fi.params[0] === 'e' && cfg.excludeEventFunctions !== false) return 'Erwartet ein Add-on-Ereignisobjekt (e) und läuft nur im Seitenbereich eines geöffneten Dokuments bzw. in Drive.';
  return null;
}

function classify(fi) {
  const o = (cfg.overrides || {})[fi.name] || {};
  const ui = usedByUi(fi.name);
  let write;
  if (typeof o.write === 'boolean') write = o.write;
  else if (TRIGGERS.has(fi.name)) write = true;
  else if (/^(DEBUG_|debug)/.test(fi.name) && !/(fix|repair|set|send|clear|reset)/i.test(fi.name)) write = false;
  else write = !READ_VERBS.includes(verbOf(fi.name));
  if (/^(test|DEBUG_test)/.test(fi.name) && typeof o.write !== 'boolean') write = true; // Testfunktionen senden/erzeugen oft etwas
  const maintenance = o.area ? false : (o.maintenance === true || (!ui && cfg.maintenanceForNonUi !== false));
  return { ui, write, maintenance, trigger: TRIGGERS.has(fi.name) };
}

// ---------------------------------------------------------------------------
// 3. Parameter -> Beispielwerte
// ---------------------------------------------------------------------------

const envVars = new Map(); // key -> {value, desc, users:Set}
function useVar(key, value, desc, user) {
  if (!envVars.has(key)) envVars.set(key, { value: value == null ? '' : value, desc: desc || '', users: new Set() });
  const v = envVars.get(key);
  if (desc && !v.desc) v.desc = desc;
  if (user) v.users.add(user);
  return '{{' + key + '}}';
}

const BOOL_PARAMS = /^(force|forceRefresh|enable|enabled|active|approve|makeAdmin|grant|doExport|compareLive|includeGlobal|applyGlobal|convertToGoogle|deleteCalendar|syncToPhrase|useProjectTB|rulesOnly|dryRun)$/;
const NUM_PARAMS = /^(limit|n|days|mins|mb|sizeLimitMb|pageNumber|pageSize|intervalMinutes|threshold|maxChars|maxSegmentsOverride|years|version)$/;
const ARRAY_PARAMS = /^(uids|jobUids|emails|ids|rows|issues|pairs|entries|targetLangs|issueIds|tbUids|suggestionIds|usernames|toUsernames|areaIds|payloads|violations|typeKeys|rules|newRules|assignments|history|configArray|fileEntries|types|patches|years)$/;
const OBJ_PARAMS = /^(payload|data|settings|patch|filters|opts|options|p|a|entry|profile|presetData|input|fields|testCase|overrides|absence|params|fileObj|stats|pixelLimits|stdWidths|ttlWidths|mqmDetails|reportData|jobMapping|oldParsed|newParsed|filterOptions|updatedRules|imageData|job|jobs|e|scopeRef|stateJson|changesJson)$/;

function exampleFor(param, fnName) {
  if (BOOL_PARAMS.test(param)) return false;
  if (NUM_PARAMS.test(param)) {
    if (param === 'years') return [new Date().getFullYear()];
    return ({ limit: 20, n: 1, days: 90, mins: 10, mb: 50, sizeLimitMb: 50, pageNumber: 0, pageSize: 20, intervalMinutes: 10, threshold: 3, maxChars: 5000, maxSegmentsOverride: 5, version: 1 })[param] || 0;
  }
  if (ARRAY_PARAMS.test(param)) return [];
  if (OBJ_PARAMS.test(param)) return {};
  // Zeichenketten: Environment-Variable gleichen Namens, damit zusammengehörige Aufrufe denselben Wert nutzen.
  return useVar(param, (cfg.varDefaults || {})[param] || '', (cfg.varDocs || {})[param] || '', fnName);
}

// ---------------------------------------------------------------------------
// 4. Test-Skripte
// ---------------------------------------------------------------------------

function testScriptRun(fnName, opts) {
  const s = [];
  s.push("// Automatisch erzeugt: prüft Transport (Apps Script API), Skriptfehler und das Ergebnisformat der App.");
  s.push("pm.test('HTTP 200 – Apps Script API hat den Aufruf angenommen', function () { pm.response.to.have.status(200); });");
  s.push("const body = pm.response.json();");
  if (opts.expectError) {
    s.push("pm.test(" + JSON.stringify('Erwartet: Fehler – ' + opts.expectError) + ", function () {");
    s.push("  const r = body.response && body.response.result;");
    s.push("  const appErr = r && (r.success === false || r.ok === false || r.authorized === false || r.error);");
    s.push("  pm.expect(!!(body.error || appErr), 'Es kam kein Fehler zurück – Schutz/Validierung prüfen').to.equal(true);");
    s.push("});");
    return s;
  }
  s.push("const err = body.error && body.error.details && body.error.details[0];");
  s.push("pm.test('Kein Skriptfehler in " + fnName + "', function () {");
  s.push("  pm.expect(body.error, err ? (err.errorType + ': ' + err.errorMessage) : JSON.stringify(body.error)).to.be.undefined;");
  s.push("});");
  s.push("const result = body.response ? body.response.result : undefined;");
  s.push("pm.test('Ergebnis meldet keinen App-Fehler (success/ok/authorized ≠ false)', function () {");
  s.push("  if (result && typeof result === 'object' && !Array.isArray(result)) {");
  s.push("    pm.expect(result.success, result.error || result.message).to.not.equal(false);");
  s.push("    pm.expect(result.ok, result.error || result.message).to.not.equal(false);");
  s.push("    pm.expect(result.authorized, 'Keine Berechtigung für dieses Konto').to.not.equal(false);");
  s.push("  }");
  s.push("});");
  if (opts.expectType) {
    s.push("pm.test('Ergebnis hat den erwarteten Typ (" + opts.expectType + ")', function () {");
    if (opts.expectType === 'array') s.push("  pm.expect(result).to.be.an('array');");
    else s.push("  pm.expect(result).to.be.a(" + JSON.stringify(opts.expectType) + ");");
    s.push("});");
  }
  for (const k of opts.expectKeys || []) {
    s.push("pm.test('Ergebnis enthält das Feld „" + k + "“', function () { pm.expect(result).to.have.property(" + JSON.stringify(k) + "); });");
  }
  for (const [label, expr] of opts.checks || []) {
    s.push("pm.test(" + JSON.stringify(label) + ", function () { pm.expect((function (result) { return " + expr + "; })(result), " + JSON.stringify(expr) + ").to.equal(true); });");
  }
  for (const [varName, expr] of Object.entries(opts.capture || {})) {
    s.push("// Wert für Folgeaufrufe merken (nur wenn noch leer)");
    s.push("try {");
    s.push("  const v = (function (result) { return " + expr + "; })(result);");
    s.push("  if (v !== undefined && v !== null && v !== '' && !pm.environment.get(" + JSON.stringify(varName) + ")) {");
    s.push("    pm.environment.set(" + JSON.stringify(varName) + ", String(v));");
    s.push("    console.log('Gemerkt: " + varName + " = ' + v);");
    s.push("  }");
    s.push("} catch (e) { console.log('Konnte " + varName + " nicht übernehmen: ' + e.message); }");
  }
  s.push("console.log('" + fnName + " →', String(JSON.stringify(result)).slice(0, 2000));");
  return s;
}

const WRITE_GUARD = [
  "// Sicherheitsschalter: Schreibende Aufrufe laufen nur mit allowWrites = true im Environment.",
  "if (String(pm.environment.get('allowWrites') || pm.collectionVariables.get('allowWrites')) !== 'true') {",
  "  console.warn('Übersprungen (allowWrites ist nicht true): ' + pm.info.requestName);",
  "  pm.execution.skipRequest();",
  "}"
];

const MAINT_GUARD = [
  "// Wartungsfunktionen (Editor/Trigger) laufen nur mit allowWrites = true UND allowMaintenance = true.",
  "if (String(pm.environment.get('allowWrites')) !== 'true' || String(pm.environment.get('allowMaintenance')) !== 'true') {",
  "  console.warn('Übersprungen (allowWrites/allowMaintenance nicht true): ' + pm.info.requestName);",
  "  pm.execution.skipRequest();",
  "}"
];

const NONADMIN_GUARD = [
  "// Schutzregel-Test: nur mit testAsNonAdmin = true (Token eines Kontos OHNE Admin-Rechte).",
  "// Mit Admin-Token würde die Funktion sonst wirklich ausgeführt.",
  "if (String(pm.environment.get('testAsNonAdmin')) !== 'true') {",
  "  console.warn('Übersprungen (testAsNonAdmin ist nicht true): ' + pm.info.requestName);",
  "  pm.execution.skipRequest();",
  "}"
];

// ---------------------------------------------------------------------------
// 5. Request-Bausteine
// ---------------------------------------------------------------------------

function ev(listen, exec) { return { listen, script: { type: 'text/javascript', exec } }; }

function runRequest(fi, cls) {
  const o = (cfg.overrides || {})[fi.name] || {};
  const args = o.args !== undefined ? o.args : fi.params.map(p => exampleFor(p, fi.name));
  // Strings mit {{var}} in curated args ebenfalls als Variablen registrieren
  JSON.stringify(args).replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, k) => { useVar(k, (cfg.varDefaults || {})[k] || '', (cfg.varDocs || {})[k] || '', fi.name); return ''; });
  const bodyObj = { function: fi.name, parameters: args, devMode: '__DEVMODE__' };
  const raw = JSON.stringify(bodyObj, null, 2).replace('"__DEVMODE__"', '{{devMode}}');

  const purpose = o.desc || (cfg.descs || {})[fi.name] || docPurpose[fi.name] || fi.comment || '';
  const tags = [];
  if (cls.write) tags.push('✏️ schreibt/löst aus');
  else tags.push('🔍 nur lesen');
  if (typeof o.admin === 'boolean' ? o.admin : fi.admin) tags.push('🔒 Admin');
  if (fi.perm) tags.push('🔑 Recht ' + fi.perm);
  if (cls.trigger) tags.push('⏰ Zeit-Trigger');
  if (o.costs) tags.push(o.costs);
  if (o.danger) tags.push('⚠️ kritisch');
  const right = o.right || docRight[fi.name];

  const d = [];
  d.push('**' + fi.name + '(' + fi.params.join(', ') + ')** — `' + fi.file + ':' + fi.line + '`');
  d.push('');
  d.push(tags.join(' · ') + (right ? ' · Recht laut Doku: ' + right : ''));
  d.push('');
  d.push(purpose ? purpose : '_Im Code ist keine Beschreibung hinterlegt._');
  if (fi.params.length) {
    d.push('');
    d.push('**Parameter** (Reihenfolge = `parameters`-Array im Body):');
    fi.params.forEach((p, i) => {
      const val = JSON.stringify(args[i]);
      d.push('- `' + p + '` = `' + (val === undefined ? '–' : val.slice(0, 120)) + '`' + ((o.paramDocs || {})[p] ? ' – ' + o.paramDocs[p] : ''));
    });
  }
  if (o.note) { d.push(''); d.push('> ' + o.note); }
  if (duplicates[fi.name]) {
    d.push('');
    d.push('> ⚠️ Diese Funktion ist mehrfach definiert (' + duplicates[fi.name].join(', ') + '). Apps Script nimmt die zuletzt geladene Datei – getestet wird also genau diese.');
  }
  if (cls.write) {
    d.push('');
    d.push(cls.maintGuard
      ? '> Wartungsfunktion: läuft nur mit `allowWrites` = `true` **und** `allowMaintenance` = `true`. Vorher den Code der Funktion lesen – viele haben fest eingetragene Werte.'
      : o.danger ? '> ⚠️ Kritische Aktion: läuft nur mit `allowWrites` = `true` **und** `allowMaintenance` = `true`. ' + (typeof o.danger === 'string' ? o.danger : '')
      : '> Läuft nur, wenn im Environment `allowWrites` = `true` steht. Vorher die Parameter auf Testdaten setzen.');
  }
  d.push('');
  d.push('**Geprüft wird:** HTTP 200, kein Skriptfehler (`error`), kein `success:false` / `ok:false` / `authorized:false`' +
    (o.expectKeys ? ', Felder ' + o.expectKeys.map(k => '`' + k + '`').join(', ') : '') +
    (o.checks ? ', fachlich: ' + o.checks.map(c => '„' + c[0] + '“').join(', ') : '') +
    (o.capture ? '. Merkt sich ' + Object.keys(o.capture).map(k => '`' + k + '`').join(', ') + ' für Folgeaufrufe.' : '.'));

  const events = [ev('test', testScriptRun(fi.name, { expectKeys: o.expectKeys, expectType: o.expectType, capture: o.capture, checks: o.checks }))];
  const strong = cls.maintGuard || (cls.write && o.danger);
  if (cls.write) events.unshift(ev('prerequest', strong ? MAINT_GUARD : WRITE_GUARD));

  const label = (cls.write ? (o.danger ? '⚠️ ' : '✏️ ') : '') + fi.name + (o.title ? ' – ' + o.title : (shortPurpose(purpose) ? ' – ' + shortPurpose(purpose) : ''));
  return {
    id: stableId(cfg.slug + ':' + fi.name),
    name: label,
    event: events,
    request: {
      method: 'POST',
      header: [{ key: 'Content-Type', value: 'application/json' }],
      body: { mode: 'raw', raw, options: { raw: { language: 'json' } } },
      url: rawUrl(RUN_URL),
      description: d.join('\n'),
    },
    response: [],
  };
}

function shortPurpose(p) {
  if (!p) return '';
  let s = p.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.split(/(?<=[.!?])\s|;\s| – | - |: /)[0];
  if (s.length > 70) s = s.slice(0, 67).replace(/\s+\S*$/, '') + ' …';
  return s.replace(/[.:]$/, '');
}

/** Postman-URL-Objekt aus einer URL mit {{Variablen}}. */
function rawUrl(raw) {
  const u = { raw };
  const m = raw.match(/^(https?):\/\/([^/?#]+)([^?#]*)(\?[^#]*)?/);
  if (m) {
    u.protocol = m[1];
    u.host = m[2].split('.');
    u.path = m[3].split('/').filter(Boolean);
    if (m[4]) u.query = m[4].slice(1).split('&').filter(Boolean).map(kv => { const i = kv.indexOf('='); return i < 0 ? { key: kv, value: null } : { key: kv.slice(0, i), value: kv.slice(i + 1) }; });
  } else if (/^\{\{/.test(raw)) {
    const q = raw.indexOf('?');
    const base = q < 0 ? raw : raw.slice(0, q);
    u.host = [base.split('/')[0]];
    u.path = base.split('/').slice(1).filter(Boolean);
    if (q >= 0) u.query = raw.slice(q + 1).split('&').filter(Boolean).map(kv => { const i = kv.indexOf('='); return i < 0 ? { key: kv, value: null } : { key: kv.slice(0, i), value: kv.slice(i + 1) }; });
  }
  return u;
}

/** Allgemeiner HTTP-Request aus der Konfiguration (Phrase, Gemini, Web-App, …). */
function httpRequest(r, folderKey) {
  JSON.stringify(r).replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, k) => { useVar(k, (cfg.varDefaults || {})[k] || '', (cfg.varDocs || {})[k] || '', r.name); return ''; });
  const req = {
    method: r.method || 'GET',
    header: (r.headers || []).map(h => ({ key: h[0], value: h[1] })),
    url: rawUrl(r.url),
    description: r.desc || '',
  };
  if (r.body !== undefined) {
    const raw = typeof r.body === 'string' ? r.body : JSON.stringify(r.body, null, 2);
    req.body = { mode: 'raw', raw, options: { raw: { language: 'json' } } };
    if (!req.header.some(h => /content-type/i.test(h.key))) req.header.push({ key: 'Content-Type', value: 'application/json' });
  }
  if (r.auth) req.auth = r.auth;
  const events = [];
  const pre = [].concat(r.write ? WRITE_GUARD : [], r.pre || []);
  if (pre.length) events.push(ev('prerequest', pre));
  if (r.tests) events.push(ev('test', r.tests));
  return { id: stableId(cfg.slug + ':' + folderKey + ':' + r.name), name: (r.write ? '✏️ ' : '') + r.name, event: events, request: req, response: [], protocolProfileBehavior: r.behavior };
}

function folder(name, description, items, key) {
  return { id: stableId(cfg.slug + ':folder:' + (key || name)), name, description, item: items };
}

// ---------------------------------------------------------------------------
// 6. Gemeinsame Ordner: Start, Web-App, externe Dienste, Negativtests
// ---------------------------------------------------------------------------

const NOAUTH = { type: 'noauth' };
const PHRASE_AUTH = { type: 'bearer', bearer: [{ key: 'token', value: '{{phraseToken}}', type: 'string' }] };

const T = {
  status200: "pm.test('HTTP 200', function () { pm.response.to.have.status(200); });",
  json: "let j; pm.test('Antwort ist JSON', function () { j = pm.response.json(); });",
};

function startFolder() {
  const items = [];
  items.push(httpRequest({
    name: 'Google-Token prüfen (Konto, Scopes, Ablauf)',
    method: 'GET',
    url: 'https://oauth2.googleapis.com/tokeninfo?access_token={{googleAccessToken}}',
    auth: NOAUTH,
    pre: [
      "// Nimmt den Token aus der Variablen googleAccessToken. Wer den OAuth-Dialog der Collection nutzt,",
      "// kopiert den Token nach dem Abholen einmal in diese Variable (siehe README, Schritt 4).",
      "if (!pm.environment.get('googleAccessToken')) { console.warn('googleAccessToken ist leer – erst eine Apps-Script-Anfrage senden oder Token eintragen (README, Schritt 4).'); pm.execution.skipRequest(); }",
    ],
    tests: [
      T.status200, T.json,
      "pm.test('Token ist noch mindestens 5 Minuten gültig', function () { pm.expect(Number(j.expires_in)).to.be.above(300); });",
      "const need = String(pm.collectionVariables.get('googleScopes') || '').split(/\\s+/).filter(Boolean);",
      "const have = String(j.scope || '').split(/\\s+/);",
      "const missing = need.filter(s => have.indexOf(s) < 0);",
      "pm.test('Alle benötigten Scopes sind im Token' + (missing.length ? ' – es fehlen: ' + missing.join(', ') : ''), function () { pm.expect(missing).to.have.length(0); });",
      "if (j.email) { pm.environment.set('currentUserEmail', j.email); console.log('Angemeldet als ' + j.email); }",
    ],
    desc: 'Prüft, ob der Google-Token gültig ist, wem er gehört und ob er **alle Scopes** enthält, die das Skript braucht (Variable `googleScopes`). Fehlende Scopes sind die häufigste Ursache für `PERMISSION_DENIED` bei der Apps Script API.',
  }, 'start'));
  items.push(httpRequest({
    name: 'Apps-Script-Projekt erreichbar (Metadaten)',
    method: 'GET',
    url: 'https://script.googleapis.com/v1/projects/{{scriptId}}',
    tests: [
      T.status200, T.json,
      "pm.test('Projekt gefunden', function () { pm.expect(j.scriptId).to.eql(pm.environment.get('scriptId')); });",
      "console.log('Projekt: ' + j.title + ' | GCP-Projekt: ' + (j.parentId || '–'));",
    ],
    desc: 'Liest Titel und Metadaten des Apps-Script-Projekts über die Apps Script API. Schlägt das fehl (403/404), stimmt die `scriptId` nicht, die Apps Script API ist im Google-Konto nicht eingeschaltet (https://script.google.com/home/usersettings) oder dem Konto fehlt der Zugriff auf das Projekt.\n\nBenötigt zusätzlich den Scope `https://www.googleapis.com/auth/script.projects.readonly` (in `googleScopes` enthalten).',
  }, 'start'));
  items.push(httpRequest({
    name: 'Bereitstellungen: API-Executable vorhanden?',
    method: 'GET',
    url: 'https://script.googleapis.com/v1/projects/{{scriptId}}/deployments',
    tests: [
      T.status200, T.json,
      "const deps = j.deployments || [];",
      "const api = deps.filter(d => (d.entryPoints || []).some(e => e.entryPointType === 'EXECUTION_API'));",
      "const web = deps.filter(d => (d.entryPoints || []).some(e => e.entryPointType === 'WEB_APP'));",
      "pm.test('Es gibt eine Bereitstellung vom Typ „API-Executable“ (für alle :run-Aufrufe nötig)', function () { pm.expect(api.length, 'Bereitstellen > Neue Bereitstellung > Typ „API-Executable“').to.be.above(0); });",
      "web.forEach(d => (d.entryPoints || []).forEach(e => { if (e.webApp) console.log('Web-App: ' + e.webApp.url + ' (Version ' + (d.deploymentConfig.versionNumber || 'HEAD') + ')'); }));",
      "if (!pm.environment.get('webAppUrl') && web.length) {",
      "  const e = web[web.length - 1].entryPoints.find(x => x.webApp);",
      "  if (e) { pm.environment.set('webAppUrl', e.webApp.url); console.log('webAppUrl gesetzt: ' + e.webApp.url); }",
      "}",
    ],
    desc: 'Listet alle Bereitstellungen. `scripts.run` (alle Anfragen in den Funktionsordnern) funktioniert nur, wenn das Projekt als **API-Executable** bereitgestellt ist. Ist `webAppUrl` noch leer, übernimmt der Test die URL der neuesten Web-App-Bereitstellung.',
  }, 'start'));
  items.push(runRequestRaw('Ping: einfachste Lese-Funktion aufrufen', cfg.pingFunction, [], 'start',
    'Ruft die harmloseste Lese-Funktion (`' + cfg.pingFunction + '`) über die Apps Script API auf. Klappt dieser Aufruf, funktionieren Token, Bereitstellung und GCP-Verknüpfung – alle weiteren Ordner können laufen.\n\nTypische Fehler:\n- `403 PERMISSION_DENIED` → OAuth-Client gehört nicht zum selben GCP-Projekt wie das Skript, oder Scopes fehlen.\n- `404` → `scriptId` falsch oder keine API-Executable-Bereitstellung.\n- `error.details[0].errorMessage` → Fehler im Skript selbst.'));
  return folder('00 · Start hier – Verbindung, Token & Bereitstellung prüfen',
    'Prüft Schritt für Schritt alles, was die übrigen Ordner brauchen – zuerst ausführen. Prüft Schritt für Schritt alles, was für die übrigen Tests nötig ist: gültiger Google-Token mit den richtigen Scopes, erreichbares Apps-Script-Projekt, eine Bereitstellung als **API-Executable** und ein erster echter Funktionsaufruf.', items, 'start');
}

function runRequestRaw(name, fn, params, key, desc, testOpts) {
  const raw = JSON.stringify({ function: fn, parameters: params, devMode: '__DEVMODE__' }, null, 2).replace('"__DEVMODE__"', '{{devMode}}');
  return {
    id: stableId(cfg.slug + ':' + key + ':' + name),
    name,
    event: [ev('test', testScriptRun(fn, testOpts || {}))],
    request: { method: 'POST', header: [{ key: 'Content-Type', value: 'application/json' }], body: { mode: 'raw', raw, options: { raw: { language: 'json' } } }, url: rawUrl(RUN_URL), description: desc },
    response: [],
  };
}

function webAppFolder(n) {
  if (!cfg.webApp) return null;
  const items = [];
  for (const p of cfg.webApp.pages || []) {
    useVar('webAppUrl', '', 'URL der Web-App-Bereitstellung (…/exec). Wird von „Bereitstellungen“ automatisch gesetzt, wenn leer.', 'Web-App');
    const tests = [
      "pm.test('HTTP 200 (Seite ausgeliefert, Anmeldung hat geklappt)', function () { pm.response.to.have.status(200); });",
      "const html = pm.response.text();",
      "pm.test('Keine Google-Anmeldeseite (Token wurde akzeptiert)', function () { pm.expect(html).to.not.include('accounts.google.com/v3/signin'); pm.expect(html).to.not.include('ServiceLogin'); });",
      "pm.test('Kein Apps-Script-Fehlerbild („Skriptfunktion nicht gefunden“, „Fehler“)', function () { pm.expect(html).to.not.match(/Script function not found|Skriptfunktion nicht gefunden|TypeError:|ReferenceError:/); });",
    ];
    for (const t of p.expect || []) tests.push("pm.test('Seite enthält " + t.replace(/'/g, "\\'") + "', function () { pm.expect(html).to.include(" + JSON.stringify(t) + "); });");
    tests.push("pm.test('Antwortzeit unter 20 s', function () { pm.expect(pm.response.responseTime).to.be.below(20000); });");
    items.push(httpRequest({
      name: p.name,
      method: 'GET',
      url: '{{webAppUrl}}' + (p.query ? '?' + p.query : ''),
      tests,
      desc: p.desc + '\n\n**Wie?** Apps-Script-Web-Apps mit Zugriff „Domain“ akzeptieren einen OAuth-Token im Header `Authorization: Bearer …`, wenn er den Scope `drive.readonly` (oder `drive`) enthält. Postman folgt der Weiterleitung auf `script.googleusercontent.com` automatisch.',
    }, 'web'));
  }
  for (const p of cfg.webApp.posts || []) {
    items.push(httpRequest(Object.assign({ method: 'POST', url: '{{webAppUrl}}' }, p), 'web'));
  }
  return folder(pad2(n) + ' · Web-App öffnen – Seiten laden (doGet' + ((cfg.webApp.posts || []).length ? ' / doPost' : '') + ')',
    'Ruft die Web-App wie ein Browser auf (mit Ihrem Google-Token) und prüft, dass die Seite ohne Fehler ausgeliefert wird. ' + (cfg.webApp.folderDesc || ''), items, 'web');
}

function phraseFolder(n) {
  if (!cfg.phrase) return null;
  const items = [];
  items.push(httpRequest({
    name: 'Login – Phrase-Token holen und merken',
    method: 'POST',
    url: '{{phraseBaseUrl}}/v1/auth/login',
    auth: NOAUTH,
    body: { userName: '{{phraseUserName}}', password: '{{phrasePassword}}' },
    pre: ["if (pm.environment.get('phraseToken') && !pm.environment.get('phrasePassword')) { console.log('phraseToken vorhanden, Login übersprungen.'); pm.execution.skipRequest(); }"],
    tests: [T.status200, T.json,
      "pm.test('Token erhalten', function () { pm.expect(j.token).to.be.a('string').and.not.empty; });",
      "pm.environment.set('phraseToken', j.token);",
      "console.log('Phrase-Token gültig bis ' + j.expires);"],
    desc: 'Meldet sich mit `phraseUserName` / `phrasePassword` bei Phrase TMS an und speichert den Token in `phraseToken`. Wer schon einen Token hat (z. B. den Wert der Script Property `PHRASE_API_TOKEN` bzw. des Service-Kontos), trägt ihn direkt in `phraseToken` ein und lässt das Passwort leer – dann wird dieser Schritt übersprungen.',
  }, 'phrase'));
  items.push(httpRequest({
    name: 'whoAmI – wer ist angemeldet?',
    method: 'GET', url: '{{phraseBaseUrl}}/v1/auth/whoAmI', auth: PHRASE_AUTH,
    tests: [T.status200, T.json, "pm.test('Benutzer erkannt', function () { pm.expect(j.user).to.be.an('object'); });", "console.log('Phrase-Benutzer: ' + (j.user && j.user.userName) + ' | Rolle: ' + (j.user && j.user.role));"],
    desc: 'Prüft, ob der Phrase-Token gültig ist und welchem Benutzer er gehört. Das ist genau der Aufruf, den die App in ihrem Verbindungstest benutzt.',
  }, 'phrase'));
  for (const r of cfg.phrase.requests || []) {
    const tests = r.tests || [T.status200, T.json];
    items.push(httpRequest(Object.assign({ auth: PHRASE_AUTH }, r, {
      url: r.url.replace(/^\//, '{{phraseBaseUrl}}/'),
      tests,
    }), 'phrase'));
  }
  items.push(httpRequest({
    name: 'Negativtest: ungültiger Token → 401',
    method: 'GET', url: '{{phraseBaseUrl}}/v1/auth/whoAmI',
    auth: { type: 'bearer', bearer: [{ key: 'token', value: 'ungueltiger-token', type: 'string' }] },
    tests: ["pm.test('Phrase lehnt ungültigen Token ab (401)', function () { pm.response.to.have.status(401); });"],
    desc: 'Stellt sicher, dass Phrase einen falschen Token ablehnt – so erkennt man im Fehlerfall, ob die App einen abgelaufenen Token benutzt.',
  }, 'phrase'));
  return folder(pad2(n) + ' · Externe Schnittstelle: Phrase TMS direkt testen',
    'Ruft die Phrase-Endpunkte, die die App intern benutzt, **direkt** auf – ohne Apps Script. So lässt sich unterscheiden, ob ein Fehler in Phrase (Token, Rechte, Daten) oder in der App liegt. Basis-URL: `{{phraseBaseUrl}}`.', items, 'phrase');
}

function geminiFolder(n) {
  if (!cfg.gemini) return null;
  const hdr = [['x-api-key', '{{geminiApiKey}}'], ['Accept', 'application/json']];
  const g = cfg.gemini;
  const items = [];
  items.push(httpRequest({
    name: 'Gateway erreichbar – kurze Antwort („Hi“)',
    method: 'POST', url: '{{geminiBaseUrl}}/{{geminiModel}}:generateContent', auth: NOAUTH, headers: hdr,
    body: { contents: [{ parts: [{ text: 'Antworte nur mit dem Wort OK.' }] }], generationConfig: { temperature: 0, maxOutputTokens: 20 } },
    tests: [T.status200, T.json,
      "const text = (((j.candidates || [])[0] || {}).content || {}).parts ? j.candidates[0].content.parts.map(p => p.text || '').join('') : '';",
      "pm.test('Modell hat Text geliefert', function () { pm.expect(text).to.not.be.empty; });",
      "pm.test('Antwortzeit unter 30 s', function () { pm.expect(pm.response.responseTime).to.be.below(30000); });",
      "console.log('Gemini: ' + text + ' | Tokens: ' + JSON.stringify(j.usageMetadata || {}));"],
    desc: 'Minimaler Aufruf über das Kärcher-Gemini-Gateway mit dem Header `x-api-key` – genau wie die App (`' + (g.where || 'UrlFetchApp') + '`). Prüft Schlüssel, Modellname und Erreichbarkeit.',
  }, 'gemini'));
  items.push(httpRequest({
    name: 'Strukturierte JSON-Antwort (wie die App sie erwartet)',
    method: 'POST', url: '{{geminiBaseUrl}}/{{geminiModel}}:generateContent', auth: NOAUTH, headers: hdr,
    body: g.jsonBody || { contents: [{ parts: [{ text: 'Gib ein JSON-Objekt {"ok": true, "lang": "de"} zurück.' }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } },
    tests: [T.status200, T.json,
      "const text = j.candidates[0].content.parts.map(p => p.text || '').join('');",
      "let parsed; pm.test('Modellantwort ist gültiges JSON', function () { parsed = JSON.parse(text.replace(/^```json\\s*|```\\s*$/g, '')); });",
      ...(g.jsonExpectKeys || []).map(k => "pm.test('JSON enthält „" + k + "“', function () { pm.expect(parsed).to.have.property(" + JSON.stringify(k) + "); });"),
      "console.log(text);"],
    desc: g.jsonDesc || 'Die App lässt sich von Gemini JSON liefern und liest es maschinell aus. Dieser Test prüft, dass das Modell mit `responseMimeType: application/json` sauber parsbares JSON zurückgibt.',
  }, 'gemini'));
  for (const r of g.requests || []) items.push(httpRequest(Object.assign({ method: 'POST', url: '{{geminiBaseUrl}}/{{geminiModel}}:generateContent', auth: NOAUTH, headers: hdr }, r), 'gemini'));
  items.push(httpRequest({
    name: 'Negativtest: falscher API-Key → 401/403',
    method: 'POST', url: '{{geminiBaseUrl}}/{{geminiModel}}:generateContent', auth: NOAUTH, headers: [['x-api-key', 'falscher-schluessel'], ['Accept', 'application/json']],
    body: { contents: [{ parts: [{ text: 'Hi' }] }] },
    tests: ["pm.test('Gateway lehnt falschen Schlüssel ab (4xx)', function () { pm.expect(pm.response.code).to.be.within(400, 499); });"],
    desc: 'Das Gateway muss einen falschen Schlüssel ablehnen.',
  }, 'gemini'));
  items.push(httpRequest({
    name: 'Negativtest: unbekanntes Modell → 404',
    method: 'POST', url: '{{geminiBaseUrl}}/gibt-es-nicht-1.0:generateContent', auth: NOAUTH, headers: hdr,
    body: { contents: [{ parts: [{ text: 'Hi' }] }] },
    tests: ["pm.test('Unbekanntes Modell wird abgelehnt (4xx)', function () { pm.expect(pm.response.code).to.be.within(400, 499); });"],
    desc: 'Zeigt, welche Fehlermeldung ein falscher/abgekündigter Modellname liefert (vgl. „no longer available to new users“ im AutoFix-Code).',
  }, 'gemini'));
  return folder(pad2(n) + ' · Externe Schnittstelle: Gemini-Gateway direkt testen',
    'Ruft das Gemini-Gateway (`{{geminiBaseUrl}}`) direkt auf – unabhängig von Apps Script. Hilft bei der Frage „liegt es am Schlüssel/Modell oder an der App?“. **Achtung:** Jeder Aufruf verbraucht Gemini-Tokens.', items, 'gemini');
}

function sheetsFolder(n) {
  if (!cfg.sheets) return null;
  const items = [];
  for (const s of cfg.sheets) {
    items.push(httpRequest({
      name: s.name,
      method: 'GET',
      url: 'https://sheets.googleapis.com/v4/spreadsheets/{{' + s.var + '}}?fields=properties.title,sheets.properties(title,gridProperties)',
      tests: [T.status200, T.json,
        "const tabs = (j.sheets || []).map(s => s.properties.title);",
        "console.log('Datei: ' + j.properties.title + ' | Reiter: ' + tabs.join(', '));",
        "const expected = " + JSON.stringify(s.tabs) + ";",
        "expected.forEach(function (t) { pm.test('Reiter „' + t + '“ vorhanden', function () { pm.expect(tabs).to.include(t); }); });"],
      desc: s.desc + '\n\nErwartete Reiter: ' + s.tabs.map(t => '`' + t + '`').join(', ') + '. Fehlt ein Reiter, legt die App ihn meist beim ersten Zugriff an – ein roter Test heißt dann „noch nie benutzt“ oder „umbenannt“. Die Liste steht im Test-Skript und lässt sich dort anpassen.',
    }, 'sheets'));
  }
  return folder(pad2(n) + ' · Datenbank prüfen – Google-Sheets-Struktur',
    'Liest die Google Sheets, die der App als Datenbank dienen, über die Sheets API und prüft, ob die erwarteten Reiter vorhanden sind. Nur lesend.', items, 'sheets');
}

function negativeFolder(n, sampleRead) {
  const items = [];
  items.push(runRequestRaw('Unbekannte Funktion → Fehler „Script function not found“', 'gibtEsNicht_PostmanTest', [], 'neg',
    'Ruft eine Funktion auf, die es nicht gibt. Erwartet wird ein sauberer Fehler der Apps Script API – kein Absturz, keine Antwort mit Daten.', { expectError: 'Funktion existiert nicht' }));
  if (cfg.privateFunction) {
    items.push(runRequestRaw('Private Funktion (endet auf _) ist von außen nicht aufrufbar', cfg.privateFunction, [], 'neg',
      'Funktionen mit `_` am Ende sind in Apps Script privat. Die API darf sie **nicht** ausführen – das schützt interne Helfer wie `' + cfg.privateFunction + '` (z. B. Token- oder Sheet-Zugriff).', { expectError: 'private Funktion' }));
  }
  items.push(httpRequest({
    name: 'Ohne Token → 401',
    method: 'POST', url: RUN_URL, auth: NOAUTH,
    body: { function: sampleRead, parameters: [] },
    tests: ["pm.test('Ohne Anmeldung wird abgelehnt (401)', function () { pm.response.to.have.status(401); });"],
    desc: 'Ohne Google-Token darf nichts ausgeführt werden.',
  }, 'neg'));
  items.push(httpRequest({
    name: 'Falsche scriptId → 404',
    method: 'POST', url: 'https://script.googleapis.com/v1/scripts/GIBT-ES-NICHT-123:run',
    body: { function: sampleRead, parameters: [] },
    tests: ["pm.test('Unbekanntes Projekt wird abgelehnt (4xx)', function () { pm.expect(pm.response.code).to.be.within(400, 499); });"],
    desc: 'Kontrolle, dass ein Tippfehler in der scriptId eindeutig erkennbar ist.',
  }, 'neg'));
  for (const t of cfg.negative || []) {
    const r = runRequestRaw(t.name, t.fn, t.args, 'neg', t.desc, { expectError: t.expect });
    JSON.stringify(t.args).replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, k) => { useVar(k, (cfg.varDefaults || {})[k] || '', (cfg.varDocs || {})[k] || '', t.fn); return ''; });
    const pre = [];
    if (t.guard === 'nonAdmin' || /Nicht-Admin/.test(t.name)) {
      pre.push.apply(pre, NONADMIN_GUARD);
      r.request.description += '\n\n> Läuft nur mit `testAsNonAdmin = true` – und dann bitte mit dem Token eines Kontos **ohne** Admin-Rechte.';
    }
    if (t.guard === 'writes') {
      pre.push.apply(pre, WRITE_GUARD);
      r.request.description += '\n\n> Läuft nur mit `allowWrites = true`, weil bei einem Fehler im Schutz echte Daten geändert würden.';
    }
    if (pre.length) r.event.unshift(ev('prerequest', pre));
    items.push(r);
  }
  if (cfg.webApp && (cfg.webApp.pages || []).length) {
    items.push(httpRequest({
      name: 'Web-App ohne Anmeldung → keine App-Inhalte',
      method: 'GET', url: '{{webAppUrl}}', auth: NOAUTH,
      behavior: { followRedirects: false },
      tests: [
        "pm.test('Ohne Anmeldung keine App-Seite (Weiterleitung zur Anmeldung oder 401/403)', function () {",
        "  const ok = [301, 302, 303, 401, 403].indexOf(pm.response.code) >= 0 || /accounts\\.google\\.com|ServiceLogin|signin/i.test(pm.response.text());",
        "  pm.expect(ok, 'Status ' + pm.response.code).to.equal(true);",
        "});"],
      desc: 'Die Web-App ist auf die Domain beschränkt. Ohne Token muss Google auf die Anmeldung umleiten (oder ablehnen) – sonst wäre die App öffentlich.',
    }, 'neg'));
  }
  return folder(pad2(n) + ' · Negativtests – Fehlerfälle, Schutz & Berechtigungen',
    'Prüft, dass falsche oder unberechtigte Aufrufe **sauber abgelehnt** werden: unbekannte und private Funktionen, fehlender Token, falsche IDs, ungültige Eingaben' + (cfg.negative && cfg.negative.length ? ' und app-spezifische Schutzregeln' : '') + '. Alle Tests hier sind grün, wenn ein Fehler zurückkommt. Für die Admin-Schutztests das Collection mit einem **Nicht-Admin-Konto** ausführen.', items, 'neg');
}

// ---------------------------------------------------------------------------
// 7. Collection zusammenbauen
// ---------------------------------------------------------------------------

const areas = cfg.areas || [];
function areaOf(fi, cls) {
  const o = (cfg.overrides || {})[fi.name] || {};
  if (o.area) return o.area;
  // 1. Namensmuster eines Bereichs gewinnt immer, 2. sonst Editor-/Trigger-Funktionen -> Wartung, 3. sonst Datei des Bereichs.
  for (const a of areas) if (a.match && a.match.test(fi.name)) return a.key;
  if (cls.maintenance) return '__maint__';
  for (const a of areas) {
    if ((a.files || []).includes(fi.file) || (a.files || []).includes(path.basename(fi.file))) return a.key;
  }
  return '__other__';
}

const catalog = []; // für README
const excluded = [];
const byArea = new Map();
for (const fi of [...fnMap.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
  const why = isExcluded(fi);
  if (why) { excluded.push({ fi, why }); continue; }
  const cls = classify(fi);
  const key = areaOf(fi, cls);
  if (!byArea.has(key)) byArea.set(key, []);
  byArea.get(key).push({ fi, cls });
}

const items = [];
let num = 0;
items.push(startFolder()); num++;
const web = webAppFolder(num); if (web) { items.push(web); num++; }

function areaFolder(key, title, desc, entries) {
  if (key === '__maint__') entries.forEach(e => { e.cls.maintGuard = true; });
  const reads = entries.filter(e => !e.cls.write);
  const writes = entries.filter(e => e.cls.write);
  const sub = [];
  const folderName = pad2(num) + ' · ' + title;
  if (reads.length) sub.push(folder('🔍 Lesen – ändert nichts (' + reads.length + ')', 'Nur lesende Aufrufe. Gefahrlos, auch gegen die Produktion.', reads.map(e => runRequest(e.fi, e.cls)), key + ':r'));
  if (writes.length) sub.push(folder('✏️ Schreiben & Auslösen – ändert Daten (' + writes.length + ')', (key === '__maint__' ? '**Zusätzlich gesichert mit `allowMaintenance = true`.** Diese Funktionen sind für den Apps-Script-Editor gedacht – einzeln und bewusst ausführen, nie als Sammellauf. ' : '') + 'Diese Aufrufe **ändern Daten, senden Nachrichten, legen Projekte an oder starten Läufe**. Sie laufen nur mit `allowWrites = true`. Vorher die Parameter auf Testdaten setzen – am besten gegen eine Test-Bereitstellung (`devMode = true` als Projektinhaber).', writes.map(e => runRequest(e.fi, e.cls)), key + ':w'));
  for (const e of entries) catalog.push({ folder: folderName, fi: e.fi, cls: e.cls });
  items.push(folder(folderName, desc, sub, key));
  num++;
}

for (const a of areas) {
  const entries = byArea.get(a.key);
  if (!entries || !entries.length) continue;
  areaFolder(a.key, a.title, a.desc, entries);
}
if (byArea.get('__other__')) areaFolder('__other__', 'Weitere Funktionen der Oberfläche', 'Von der Oberfläche genutzte Funktionen, die keinem der Bereiche oben zugeordnet sind.', byArea.get('__other__'));
if (byArea.get('__maint__')) areaFolder('__maint__', 'Wartung & Diagnose – Editor-Funktionen und Trigger', cfg.maintenanceDesc || 'Funktionen, die die Oberfläche **nicht** aufruft: Einrichtungs-, Debug- und Reparaturfunktionen für den Apps-Script-Editor sowie Zeit-Trigger. Viele davon schreiben Script Properties, legen Trigger an oder senden Testnachrichten – deshalb fast alle hinter `allowWrites`. Ideal, um Diagnosefunktionen ohne Editor aufzurufen und die Ausgabe (`Logger.log`) im Ausführungsprotokoll zu sehen.', byArea.get('__maint__'));

for (const f of [phraseFolder, geminiFolder, sheetsFolder]) { const x = f(num); if (x) { items.push(x); num++; } }
for (const xf of cfg.extraFolders || []) {
  items.push(folder(pad2(num) + ' · ' + xf.title, xf.desc, xf.requests.map(r => httpRequest(r, 'x' + num)), 'extra:' + xf.title));
  num++;
}
items.push(negativeFolder(num, cfg.pingFunction)); num++;

// Scopes
const scopes = Array.from(new Set([].concat(cfg.scopes || [], [
  'https://www.googleapis.com/auth/script.projects.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
])));

const collection = {
  info: {
    _postman_id: stableId(cfg.slug + ':collection'),
    name: cfg.appName + ' – API-Tests',
    description: collectionDescription(),
    schema: SCHEMA,
  },
  auth: {
    type: 'oauth2',
    oauth2: [
      { key: 'accessToken', value: '{{googleAccessToken}}', type: 'string' },
      { key: 'tokenType', value: 'Bearer', type: 'string' },
      { key: 'addTokenTo', value: 'header', type: 'string' },
      { key: 'tokenName', value: 'Google – ' + cfg.appName, type: 'string' },
      { key: 'grant_type', value: 'authorization_code_with_pkce', type: 'string' },
      { key: 'authUrl', value: 'https://accounts.google.com/o/oauth2/v2/auth', type: 'string' },
      { key: 'accessTokenUrl', value: 'https://oauth2.googleapis.com/token', type: 'string' },
      { key: 'clientId', value: '{{googleClientId}}', type: 'string' },
      { key: 'clientSecret', value: '{{googleClientSecret}}', type: 'string' },
      { key: 'scope', value: '{{googleScopes}}', type: 'string' },
      { key: 'useBrowser', value: true, type: 'boolean' },
      { key: 'client_authentication', value: 'body', type: 'string' },
      { key: 'authRequestParams', value: [{ key: 'access_type', value: 'offline', enabled: true, send_as: 'request_url' }, { key: 'prompt', value: 'consent', enabled: true, send_as: 'request_url' }], type: 'any' },
    ],
  },
  event: [
    ev('prerequest', [
      "// Gemeinsame Vorprüfung für alle Anfragen dieser Collection.",
      "const url = pm.request.url.toString();",
      "if (url.indexOf('script.googleapis.com') >= 0 && url.indexOf('GIBT-ES-NICHT') < 0 && !pm.environment.get('scriptId')) {",
      "  throw new Error('Variable scriptId ist leer – bitte im Environment eintragen (README, Schritt 3).');",
      "}",
    ]),
    ev('test', [
      "// Für jede Anfrage: Laufzeit protokollieren, bei Apps-Script-Fehlern den Stacktrace ausgeben.",
      "// Google-Token aus dem OAuth-Dialog in googleAccessToken übernehmen (für Token-Test und Newman).",
      "try {",
      "  const a = pm.request.headers.get('Authorization');",
      "  if (a && /^Bearer ya29\\./.test(a) && pm.environment.get('googleAccessToken') !== a.slice(7)) pm.environment.set('googleAccessToken', a.slice(7));",
      "} catch (e) { /* nicht verfügbar */ }",
      "pm.test('Antwortzeit unter ' + (pm.environment.get('maxResponseMs') || 360000) + ' ms (Apps-Script-Limit 6 min)', function () {",
      "  pm.expect(pm.response.responseTime).to.be.below(Number(pm.environment.get('maxResponseMs') || 360000));",
      "});",
      "try {",
      "  const b = pm.response.json();",
      "  if (b && b.error && b.error.details && b.error.details[0] && b.error.details[0].scriptStackTraceElements) {",
      "    console.error('Skriptfehler: ' + b.error.details[0].errorMessage);",
      "    b.error.details[0].scriptStackTraceElements.forEach(function (s) { console.error('  at ' + s.function + ' (Zeile ' + s.lineNumber + ')'); });",
      "  }",
      "} catch (e) { /* keine JSON-Antwort, z. B. HTML der Web-App */ }",
    ]),
  ],
  variable: [
    { key: 'googleScopes', value: scopes.join(' '), type: 'string', description: 'Scopes für den Google-Token: alle Scopes des Skripts (appsscript.json bzw. vom Code benötigt) plus Lesezugriff für Projekt-, Drive- und Sheets-Prüfungen.' },
    { key: 'allowWrites', value: 'false', type: 'string', description: 'Fallback, falls das Environment den Schalter nicht setzt.' },
  ],
  item: items,
};

// Environment
const baseEnv = [
  ['scriptId', '', 'Skript-ID des Apps-Script-Projekts (Editor > Projekteinstellungen > IDs > Skript-ID).'],
  ['devMode', 'false', '`true` = neuesten gespeicherten Code (HEAD) ausführen statt der API-Executable-Version. Nur für Projektinhaber/Bearbeiter.'],
  ['allowWrites', 'false', 'Sicherheitsschalter. Nur bei `true` laufen Anfragen, die Daten ändern, Nachrichten senden oder Läufe starten (✏️).'],
  ['allowMaintenance', 'false', 'Zweiter Schalter für den Ordner „Wartung & Diagnose“ und ⚠️ kritische Aktionen: laufen nur mit allowWrites = true UND allowMaintenance = true.'],
  ['testAsNonAdmin', 'false', 'Nur auf `true` setzen, wenn der aktuelle Token zu einem Konto OHNE Admin-Rechte gehört. Schaltet die Negativtests „als Nicht-Admin“ frei.'],
  ['googleAccessToken', '', 'Google-OAuth-Token (wird über „Get New Access Token“ der Collection erzeugt und hier eingetragen). Läuft nach 60 Minuten ab.'],
  ['googleClientId', '', 'OAuth-Client-ID (Typ „Webanwendung“) aus DEMSELBEN Google-Cloud-Projekt, mit dem das Apps-Script-Projekt verknüpft ist.'],
  ['googleClientSecret', '', 'Client-Secret zur Client-ID. Nicht teilen, nicht committen.'],
  ['currentUserEmail', '', 'Wird vom Token-Test automatisch gesetzt.'],
  ['maxResponseMs', '360000', 'Grenze für die Antwortzeit-Prüfung in Millisekunden.'],
];
if (cfg.phrase) baseEnv.push(
  ['phraseBaseUrl', 'https://cloud.memsource.com/web/api2', 'Basis-URL der Phrase-TMS-API (ohne /v1).'],
  ['phraseUserName', '', 'Phrase-Benutzername für den Login-Request (optional, alternativ phraseToken direkt setzen).'],
  ['phrasePassword', '', 'Phrase-Passwort (nur lokal speichern).'],
  ['phraseToken', '', 'Phrase-API-Token (wird vom Login gesetzt oder direkt eingetragen).']);
if (cfg.gemini) baseEnv.push(
  ['geminiBaseUrl', 'https://34-111-99-134.nip.io/gemini/v1beta/models', 'Kärcher-Gemini-Gateway (ohne Schrägstrich am Ende).'],
  ['geminiModel', cfg.gemini.model || 'gemini-3.6-flash', 'Modellname wie in den Einstellungen der App.'],
  ['geminiApiKey', '', 'Schlüssel für das Gateway (Header x-api-key). Entspricht der Script Property ' + (cfg.gemini.keyProp || 'GEMINI_API_KEY') + '.']);

const envValues = [];
const seen = new Set();
for (const [k, v, d] of baseEnv) { envValues.push({ key: k, value: v, type: /Secret|Password|Token|ApiKey/.test(k) ? 'secret' : 'default', enabled: true, description: d }); seen.add(k); }
for (const [k, v] of [...envVars.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  if (seen.has(k)) continue;
  const users = [...v.users];
  envValues.push({ key: k, value: v.value, type: 'default', enabled: true, description: (v.desc ? v.desc + ' ' : '') + 'Benutzt von: ' + users.slice(0, 8).join(', ') + (users.length > 8 ? ' …' : '') });
  seen.add(k);
}
const environment = {
  id: stableId(cfg.slug + ':env'),
  name: cfg.appName + ' – Umgebung',
  values: envValues,
  _postman_variable_scope: 'environment',
};

// ---------------------------------------------------------------------------
// 8. Dokumentation
// ---------------------------------------------------------------------------

function collectionDescription() {
  return [
    '# ' + cfg.appName + ' – API-Tests',
    '',
    cfg.summary,
    '',
    '**Wie wird getestet?** Apps-Script-Apps haben keine REST-API; die Oberfläche ruft Server-Funktionen über `google.script.run` auf. Diese Collection ruft **dieselben Funktionen** über die offizielle [Apps Script API](https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run) (`scripts.run`) auf – mit Ihrem Google-Konto, also mit Ihren Rechten. Dazu kommen die Web-App-Seiten selbst und die externen Dienste (Phrase, Gemini, Google Sheets), die die App benutzt.',
    '',
    '**Ordner:** `00` zuerst ausführen (Verbindung). Funktionsordner sind nach Bereichen der App benannt und in **🔍 Lesen** und **✏️ Schreiben & Auslösen** geteilt. Schreibende Anfragen laufen nur mit `allowWrites = true`.',
    '',
    'Vollständige Anleitung: `postman/README.md` im Repository.',
  ].join('\n');
}

function readme() {
  const L = [];
  const colFile = cfg.slug + '.postman_collection.json';
  const envFile = cfg.slug + '.postman_environment.json';
  const fnCount = catalog.length;
  const writeCount = catalog.filter(c => c.cls.write).length;
  L.push('# Postman-Tests: ' + cfg.appName);
  L.push('');
  L.push('> Automatisch erzeugt von `postman/generate.js` aus dem Code und `postman/config.js`. Nicht von Hand ändern – nach Code-Änderungen `node postman/generate.js` ausführen.');
  L.push('');
  L.push(cfg.summary);
  L.push('');
  L.push('| Datei | Inhalt |');
  L.push('|---|---|');
  L.push('| [`' + colFile + '`](' + colFile + ') | Collection: ' + fnCount + ' Server-Funktionen (' + (fnCount - writeCount) + ' lesend, ' + writeCount + ' schreibend) plus Verbindungs-, Web-App-, Schnittstellen- und Negativtests |');
  L.push('| [`' + envFile + '`](' + envFile + ') | Environment mit allen Variablen (IDs, Schalter, Schlüssel) |');
  L.push('| [`config.js`](config.js) | Bereiche, Beispielwerte, Zusatztests – hier wird die Collection angepasst |');
  L.push('| [`generate.js`](generate.js) | Generator (in allen Kärcher-Translation-Repositories gleich) |');
  L.push('');
  L.push('## Wie die Tests funktionieren');
  L.push('');
  L.push('Die App ist ein Google-Apps-Script-Projekt. Es gibt keine klassische REST-API: Die Oberfläche ruft Server-Funktionen per `google.script.run` auf. Postman kann diese Funktionen trotzdem aufrufen – über die **Apps Script API**:');
  L.push('');
  L.push('```http');
  L.push('POST https://script.googleapis.com/v1/scripts/{{scriptId}}:run');
  L.push('Authorization: Bearer <Google-Token>');
  L.push('');
  L.push('{ "function": "' + cfg.pingFunction + '", "parameters": [], "devMode": false }');
  L.push('```');
  L.push('');
  L.push('Die Funktion läuft dann mit **Ihrem** Google-Konto – genau wie beim Klick in der Oberfläche. Admin-Funktionen funktionieren also nur, wenn Ihr Konto Admin ist; mit einem Nicht-Admin-Konto lassen sich umgekehrt die Schutzregeln testen.');
  L.push('');
  L.push('Die Antwort sieht so aus:');
  L.push('');
  L.push('```jsonc');
  L.push('// Erfolg');
  L.push('{ "done": true, "response": { "@type": "type.googleapis.com/google.apps.script.v1.ExecutionResponse", "result": { /* Rückgabewert der Funktion */ } } }');
  L.push('// Fehler im Skript (HTTP trotzdem 200)');
  L.push('{ "done": true, "error": { "code": 3, "details": [{ "errorMessage": "…", "errorType": "ScriptError", "scriptStackTraceElements": [ … ] }] } }');
  L.push('```');
  L.push('');
  L.push('Jede Anfrage prüft automatisch: **HTTP 200**, **kein Skriptfehler**, **kein `success: false` / `ok: false` / `authorized: false`** im Ergebnis und die **Antwortzeit**. Bei Skriptfehlern steht der Stacktrace in der Postman-Konsole. Einige Anfragen prüfen zusätzlich bestimmte Felder und merken sich IDs (z. B. die erste Projekt-UID) für die nächsten Anfragen.');
  L.push('');
  L.push('## Ordnerstruktur – was wird wo getestet?');
  L.push('');
  L.push('| Ordner | Was wird getestet |');
  L.push('|---|---|');
  for (const it of items) L.push('| **' + mdEscape(it.name) + '** | ' + mdEscape(firstSentence(it.description)) + ' |');
  L.push('');
  L.push('In jedem Funktionsordner:');
  L.push('');
  L.push('- **🔍 Lesen – ändert nichts:** gefahrlos, auch gegen die Produktion.');
  L.push('- **✏️ Schreiben & Auslösen – ändert Daten:** ändert Sheets/Properties, sendet Chat/E-Mail, legt Projekte an, startet Läufe oder verbraucht Gemini-Tokens. Läuft nur mit `allowWrites = true`.');
  L.push('');
  L.push('Kennzeichen im Namen bzw. in der Beschreibung: ✏️ schreibt/löst aus · ⚠️ kritisch (zusätzlich `allowMaintenance`) · 🔒 Admin (Funktion prüft Admin-Rechte)' + (cfg.permissionPattern ? ' · 🔑 benötigtes Rollenrecht' : '') + ' · ⏰ Zeit-Trigger.');
  L.push('');
  L.push('## Einrichtung (einmalig)');
  L.push('');
  L.push('**1. Apps Script API einschalten** – im eigenen Konto unter https://script.google.com/home/usersettings „Google Apps Script API“ auf **An**.');
  L.push('');
  L.push('**2. Skript mit einem Google-Cloud-Projekt verknüpfen und als API-Executable bereitstellen**');
  L.push('');
  L.push('1. Apps-Script-Editor > Projekteinstellungen > *Google Cloud Platform-Projekt* > **Projekt ändern** und die Projektnummer eines Standard-GCP-Projekts eintragen (nicht das automatische Standardprojekt – `scripts.run` braucht ein eigenes).');
  L.push('2. Im GCP-Projekt: **APIs & Dienste > Bibliothek** – „Apps Script API“ aktivieren, ' + (cfg.sheets ? '„Google Sheets API“ und ' : '') + '„Google Drive API“ ebenfalls.');
  L.push('3. **Bereitstellen > Neue Bereitstellung > Typ „API-Executable“**, Zugriff „Jeder in der Domain“ bzw. „Nur ich“. ' + (cfg.webApp ? 'Die bestehende Web-App-Bereitstellung bleibt unverändert.' : ''));
  L.push('');
  L.push('**3. OAuth-Client anlegen** (im selben GCP-Projekt): **APIs & Dienste > Anmeldedaten > OAuth-Client-ID > Webanwendung**, autorisierte Weiterleitungs-URI `https://oauth.pstmn.io/v1/callback`. Client-ID und -Secret ins Environment (`googleClientId`, `googleClientSecret`). Ist der OAuth-Zustimmungsbildschirm „Intern“, dürfen alle Konten der Domain.');
  L.push('');
  L.push('**4. In Postman importieren und Token holen**');
  L.push('');
  L.push('1. *Import* → beide JSON-Dateien aus diesem Ordner.');
  L.push('2. Environment „' + environment.name + '“ auswählen, mindestens `scriptId` eintragen' + (cfg.phrase ? ', für Phrase `phraseToken` (oder Benutzer/Passwort)' : '') + (cfg.gemini ? ', für Gemini `geminiApiKey`' : '') + '.');
  L.push('3. Collection öffnen > Reiter **Authorization** > **Get New Access Token** > mit dem Google-Konto anmelden > **Use Token**. Der Token gilt 60 Minuten; danach erneut holen. Nach der ersten Apps-Script-Anfrage steht er automatisch auch in `googleAccessToken` (für den Token-Test und Newman); sonst einmal von Hand dort eintragen.');
  L.push('4. Ordner **00 · Start hier** ausführen. Sind alle Tests grün, funktioniert alles Weitere.');
  L.push('');
  L.push('**Benötigte Scopes** (Variable `googleScopes` der Collection; der Token muss **alle** Scopes enthalten, die das Skript benutzt, sonst `PERMISSION_DENIED`):');
  L.push('');
  for (const s of scopes) L.push('- `' + s + '`');
  L.push('');
  if (cfg.scopeNote) { L.push(cfg.scopeNote); L.push(''); }
  L.push('## Ausführen');
  L.push('');
  L.push('- **Einzeln:** Anfrage öffnen, Parameter im Body prüfen, *Send*. Ergebnis unter *Test Results*, Details in der Postman-Konsole.');
  L.push('- **Ganzer Ordner / ganze Collection:** Rechtsklick > *Run* (Collection Runner). Mit `allowWrites = false` laufen nur lesende Aufrufe; schreibende werden übersprungen.');
  L.push('- **Kommandozeile / CI** mit [Newman](https://www.npmjs.com/package/newman):');
  L.push('');
  L.push('```bash');
  L.push('npx newman run postman/' + colFile + ' \\');
  L.push('  -e postman/' + envFile + ' \\');
  L.push('  --env-var scriptId=<SKRIPT-ID> --env-var googleAccessToken=<TOKEN> \\');
  L.push('  --env-var allowWrites=false \\');
  L.push('  --folder "00 · Start hier – Verbindung, Token & Bereitstellung prüfen"   # optional: nur ein Ordner');
  L.push('```');
  L.push('');
  L.push('Ein Token für Newman lässt sich z. B. mit `gcloud auth login --enable-gdrive-access` und eigenem OAuth-Client oder über den Postman-Dialog erzeugen; er muss vom OAuth-Client desselben GCP-Projekts stammen.');
  L.push('');
  L.push('### Sicherheitsschalter');
  L.push('');
  L.push('Standardmäßig ist alles aus, was Daten ändern kann. Ein Sammellauf über die ganze Collection ist damit gefahrlos.');
  L.push('');
  L.push('| Schalter | Standard | Wirkung |');
  L.push('|---|---|---|');
  L.push('| `allowWrites` | `false` | ✏️-Anfragen (Daten ändern, Nachrichten senden, Läufe starten, Gemini-Tokens verbrauchen) werden übersprungen. |');
  L.push('| `allowMaintenance` | `false` | Schreibende Funktionen im Ordner „Wartung & Diagnose“ und als ⚠️ kritisch markierte Aktionen (z. B. Schlüssel löschen, Wartungsfenster setzen, Nachricht an alle) laufen nur, wenn **zusätzlich** dieser Schalter `true` ist. Einzeln ausführen, nie als Sammellauf. |');
  L.push('| `testAsNonAdmin` | `false` | Schaltet die Negativtests „als Nicht-Admin“ frei. Nur setzen, wenn der Token zu einem Konto **ohne** Admin-Rechte gehört – mit Admin-Token würden diese Funktionen wirklich ausgeführt. |');
  L.push('');
  L.push('### Empfohlene Reihenfolge');
  L.push('');
  L.push('1. `allowWrites = false`: komplette Collection laufen lassen → alle Lese-Funktionen, Seiten, Schnittstellen und Negativtests.');
  L.push('2. Testdaten in die Variablen eintragen (z. B. eine Test-Projekt-UID), `allowWrites = true`, dann **einzelne** Schreib-Ordner gezielt ausführen.');
  L.push('3. Mit einem **Nicht-Admin-Konto** (neuer Token) und `testAsNonAdmin = true` den Ordner **Negativtests** ausführen: Die Tests „als Nicht-Admin“ sind grün, wenn der Schutz greift. Zusätzlich die Lese-Ordner ausführen: 🔒-Anfragen müssen dann rot sein (Berechtigungsfehler) – ein grüner 🔒-Test mit Nicht-Admin-Token wäre eine Sicherheitslücke.');
  L.push('');
  L.push('## Variablen');
  L.push('');
  L.push('| Variable | Bedeutung |');
  L.push('|---|---|');
  for (const v of envValues) L.push('| `' + v.key + '` | ' + mdEscape(v.description) + (v.value && v.type !== 'secret' ? ' (Standard: `' + mdEscape(v.value) + '`)' : '') + ' |');
  L.push('');
  L.push('Objekt-, Listen-, Zahlen- und Ja/Nein-Parameter stehen direkt im Body der jeweiligen Anfrage (mit Beispielwerten); Text-Parameter kommen aus gleichnamigen Variablen, damit zusammengehörige Aufrufe dieselbe ID benutzen.');
  L.push('');
  if (cfg.extraDocs) { L.push(cfg.extraDocs.trim()); L.push(''); }
  L.push('## Grenzen');
  L.push('');
  L.push('- `scripts.run` hat dieselben Limits wie das Skript (6 Minuten Laufzeit, Kontingente für UrlFetch/Mail). Lange Läufe zeigen dasselbe Verhalten wie in der Oberfläche.');
  L.push('- Rückgabewerte müssen serialisierbar sein. Funktionen, die HTML-Ausgaben, Karten oder Blobs liefern, sind unten als „nicht über die API testbar“ aufgeführt.');
  L.push('- `Session.getActiveUser()` liefert das Konto des Tokens. Funktionen, die ein geöffnetes Dokument oder einen Seitenbereich brauchen (`DocumentApp.getActiveDocument()` usw.), laufen über die API nicht.');
  L.push('- Mit `devMode = false` läuft die Version der API-Executable-Bereitstellung. Nach Code-Änderungen also neue Version bereitstellen oder `devMode = true` (nur Bearbeiter).');
  L.push('');
  L.push('## Funktionskatalog');
  L.push('');
  L.push('Alle öffentlichen Server-Funktionen (ohne `_` am Ende), wie sie in der Collection stehen.');
  L.push('');
  let cur = null;
  for (const c of catalog) {
    if (c.folder !== cur) {
      cur = c.folder;
      L.push('');
      L.push('### ' + cur);
      L.push('');
      L.push('| Funktion | Art | Datei | Zweck |');
      L.push('|---|---|---|---|');
    }
    const o = (cfg.overrides || {})[c.fi.name] || {};
    const art = (c.cls.write ? (o.danger ? '⚠️ kritisch' : '✏️ schreibt') : '🔍 liest') + ((typeof o.admin === 'boolean' ? o.admin : c.fi.admin) ? ' · 🔒' : '') + (c.fi.perm ? ' · 🔑 ' + c.fi.perm : '') + (c.cls.trigger ? ' · ⏰' : '');
    L.push('| `' + c.fi.name + '(' + c.fi.params.join(', ') + ')` | ' + art + ' | `' + c.fi.file + ':' + c.fi.line + '` | ' + mdEscape(truncate(o.desc || (cfg.descs || {})[c.fi.name] || docPurpose[c.fi.name] || c.fi.comment || '–', 220)) + ' |');
  }
  L.push('');
  if (excluded.length) {
    L.push('### Nicht über die API testbar');
    L.push('');
    L.push('| Funktion | Datei | Grund |');
    L.push('|---|---|---|');
    for (const x of excluded) L.push('| `' + x.fi.name + '(' + x.fi.params.join(', ') + ')` | `' + x.fi.file + ':' + x.fi.line + '` | ' + mdEscape(x.why) + ' |');
    L.push('');
  }
  const dups = Object.keys(duplicates);
  if (dups.length) {
    L.push('### Mehrfach definierte Funktionen');
    L.push('');
    L.push('Diese Namen sind in mehreren Dateien definiert. Apps Script verwendet die zuletzt geladene Definition; das ist fehleranfällig und sollte bereinigt werden.');
    L.push('');
    for (const d of dups) L.push('- `' + d + '`: ' + duplicates[d].map(f => '`' + f + '`').join(', '));
    L.push('');
  }
  return L.join('\n');
}

function firstSentence(s) {
  s = String(s || '').replace(/\*\*/g, '').replace(/\n+/g, ' ');
  const m = s.match(/^(.+?[.!?])(\s|$)/);
  return truncate(m ? m[1] : s, 260);
}
function truncate(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + ' …' : s; }

// ---------------------------------------------------------------------------
// 9. Schreiben
// ---------------------------------------------------------------------------

fs.writeFileSync(path.join(POSTMAN_DIR, cfg.slug + '.postman_collection.json'), JSON.stringify(collection, null, 2) + '\n');
fs.writeFileSync(path.join(POSTMAN_DIR, cfg.slug + '.postman_environment.json'), JSON.stringify(environment, null, 2) + '\n');
fs.writeFileSync(path.join(POSTMAN_DIR, 'README.md'), readme() + '\n');

if (process.env.LIST_MISSING) for (const c of catalog) { const o = (cfg.overrides || {})[c.fi.name] || {}; if (!(o.desc || (cfg.descs || {})[c.fi.name] || docPurpose[c.fi.name] || c.fi.comment)) console.log('ohne Beschreibung: ' + c.fi.name + '(' + c.fi.params.join(', ') + ') ' + c.fi.file); }
const reqCount = JSON.stringify(collection).split('"request"').length - 1;
console.log(cfg.appName + ': ' + reqCount + ' Anfragen in ' + items.length + ' Ordnern, ' + catalog.length + ' Funktionen (' + excluded.length + ' nicht testbar), ' + envValues.length + ' Variablen.');
