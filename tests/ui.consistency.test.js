'use strict';

// Querschnitts-Pruefungen ueber alle Oberflaechen-Dateien. Fangen genau die
// Fehlerklassen ab, die hier schon vorkamen: fehlende Include-Datei nach dem
// Aufteilen, Button ruft nicht existierende Funktion auf ("Show Archive"),
// fehlende Uebersetzungsschluessel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { REPO_ROOT, read, scriptsOf } = require('./lib/load');

const index = read('Index.html');
const includes = [...index.matchAll(/<\?!= include\('(\w+)'\); \?>/g)].map((m) => m[1]);
const jsFiles = includes.filter((n) => n.startsWith('Js')).map((n) => n + '.html');
// Nachgeladene Teile der Nutzeroberflaeche (nicht im Startdokument, siehe UserPrefs.gs).
const lazyUserFiles = ['HomeUi.html', 'PrefsUi.html'];
// Nachgeladene Skripte (apiGetLazyScript, WebApp.gs).
const lazyScripts = ['JsCampus.html'];
// Nachgeladene Admin-Skripte (ebenfalls apiGetLazyScript, Texte aus ADMIN_I18N_).
const lazyAdminScripts = ['AdminManagersUi.html'];
const uiFiles = ['Index.html', ...jsFiles, ...lazyScripts, ...lazyAdminScripts, ...lazyUserFiles, 'AdminConsole.html', 'AdminScript.html', 'PivotAdminConsole.html', 'PivotAdminScript.html', 'TranslateUi.html'];

test('Index.html bindet Styles und alle Js-Dateien ein, jede Datei existiert', () => {
  assert.ok(includes.includes('Styles'));
  assert.ok(jsFiles.length >= 5, 'Js-Module eingebunden');
  includes.forEach((n) => assert.ok(fs.existsSync(path.join(REPO_ROOT, n + '.html')), n + '.html fehlt'));
});

test('SelfTests.gs kennt alle eingebundenen und nachgeladenen Dateien', () => {
  const selfTests = read('SelfTests.gs');
  [...includes, ...lazyUserFiles.map((f) => f.replace('.html', ''))].forEach((n) => assert.ok(selfTests.includes('"' + n + '"'), n + ' fehlt in SELF_TEST_INCLUDE_FILES_'));
});

test('Nachgeladene Nutzer-Teile: Datei existiert und hat eine Server-Funktion', () => {
  const prefs = read('UserPrefs.gs');
  assert.ok(prefs.includes('createHtmlOutputFromFile("HomeUi")') && prefs.includes('function apiGetHomeUi('));
  assert.ok(prefs.includes('createHtmlOutputFromFile("PrefsUi")') && prefs.includes('function apiGetPrefsUi('));
  assert.ok(/<style>[\s\S]*<\/style>\s*<script>[\s\S]*<\/script>/.test(read('HomeUi.html')), 'HomeUi.html: <style> + <script>');
  assert.ok(!/<script/.test(read('PrefsUi.html')), 'PrefsUi.html ist reines Markup (Skripte liefen per innerHTML nicht)');
  assert.ok(/^\s*<!--[\s\S]*?-->\s*<div id="preferencesModal"/.test(read('PrefsUi.html')), 'PrefsUi.html: ein Wurzelelement');
});

test('Index.html enthaelt keine Template-Scriptlets ausser include()', () => {
  const rest = index.replace(/<\?!= include\('\w+'\); \?>/g, '');
  assert.ok(!/<\?/.test(rest), 'unerwartetes <? in Index.html');
});

test('Alle Skripte sind syntaktisch gueltig', () => {
  [...jsFiles, ...lazyScripts, ...lazyAdminScripts, 'HomeUi.html', 'AdminScript.html', 'PivotAdminScript.html', 'TranslateUi.html'].forEach((f) => {
    assert.doesNotThrow(() => new vm.Script(scriptsOf(f), { filename: f }), f);
  });
  fs.readdirSync(REPO_ROOT).filter((f) => f.endsWith('.gs')).forEach((f) => {
    assert.doesNotThrow(() => new vm.Script(read(f), { filename: f }), f);
  });
});

test('Jeder onclick/onchange-Aufruf zeigt auf eine vorhandene Funktion', () => {
  const allCode = uiFiles.map(read).join('\n');
  const defined = new Set([
    ...[...allCode.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map((m) => m[1]),
    ...[...allCode.matchAll(/window\.([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1])
  ]);
  const builtins = new Set(['if', 'event', 'this', 'return', 'document', 'window', 'setTimeout', 'alert', 'confirm']);
  const missing = new Set();
  uiFiles.forEach((f) => {
    for (const m of read(f).matchAll(/\bon(?:click|change|input|keyup|keydown|submit)=["']\s*([A-Za-z_$][\w$]*)\s*\(/g)) {
      if (!defined.has(m[1]) && !builtins.has(m[1])) missing.add(f + ': ' + m[1]);
    }
  });
  assert.deepEqual([...missing], []);
});

test('Jeder verwendete Uebersetzungsschluessel existiert auf Deutsch und Englisch', () => {
  // Die Woerterbuecher liegen serverseitig (I18nDicts.gs), nicht mehr im Startdokument.
  const vm = require('vm');
  const dictCtx = {};
  vm.createContext(dictCtx);
  vm.runInContext(read('I18nDicts.gs') + '\n;this.__dicts = I18N_DICTS_;', dictCtx);
  const dictKeys = (lang) => new Set(Object.keys(dictCtx.__dicts[lang] || {}));
  const en = dictKeys('en');
  const de = dictKeys('de');
  const code = [index, ...jsFiles.map(read), ...lazyScripts.map(read), ...lazyUserFiles.map(read)].join('\n');
  const used = new Set([
    ...[...code.matchAll(/data-i18n(?:-placeholder|-title)?="([a-z0-9_]+)"/g)].map((m) => m[1]),
    ...[...code.matchAll(/\btr_\('([a-z0-9_]+)'/g)].map((m) => m[1]),
    ...[...code.matchAll(/t_i18n_\(currentLang, '([a-z0-9_]+)'/g)].map((m) => m[1])
  ]);
  assert.ok(en.size > 100 && de.size > 100, 'Woerterbuecher gefunden');
  const missingEn = [...used].filter((k) => !k.endsWith('_') && !en.has(k));
  const missingDe = [...used].filter((k) => !k.endsWith('_') && !de.has(k));
  assert.deepEqual(missingEn, [], 'fehlt in en');
  assert.deepEqual(missingDe, [], 'fehlt in de');
});

test('Ausgeliefertes Startdokument bleibt unter der Apps-Script-Grenze', () => {
  // Apps Script schneidet die Seite ab ca. 600 KB mitten im <script> ab (590 KB
  // liefen noch, 652 KB nicht mehr). Groesseres gehoert in nachgeladene Teile
  // (GuideContent, Admin, DarkTheme, Woerterbuecher in I18nDicts.gs).
  const page = index.replace(/<\?!= include\('(\w+)'\); \?>/g, (m, n) => read(n + '.html').replace(/^[ \t]+/gm, ''));
  const bytes = Buffer.byteLength(page, 'utf8');
  assert.ok(bytes < 560000, 'Startdokument ist ' + bytes + ' Bytes gross (Grenze 560000)');
});

test('Jeder <script>-Block parst noch, nachdem Apps Script "//"-Kommentare entfernt hat', () => {
  // Apps Script entfernt beim Ausliefern Kommentare zeilenweise - auch ein
  // "//" mitten in einem String ('PRODID:-//Kaercher//...'). Der String war
  // dann offen, der ganze JsPersonal-Block brach mit "Invalid or unexpected
  // token" ab: Startseite leer, Glocke und Einstellungen ohne Funktion.
  // Nachgebildet: alles ab "//" entfernen, ausser nach ":" (URLs wie https://).
  const page = index.replace(/<\?!= include\('(\w+)'\); \?>/g, (m, n) => read(n + '.html').replace(/^[ \t]+/gm, ''));
  const stripped = page.split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
  const blocks = [...stripped.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.ok(blocks.length >= 5, 'Script-Bloecke gefunden');
  blocks.forEach((code, i) => assert.doesNotThrow(() => new vm.Script(code), 'Block ' + (i + 1) + ': ' + code.slice(0, 80)));
});

test('HomeUi.html parst noch, nachdem Apps Script "//"-Kommentare entfernt hat', () => {
  const stripped = scriptsOf('HomeUi.html').split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
  assert.doesNotThrow(() => new vm.Script(stripped), 'HomeUi.html');
});

test('Knowledge Base ist eine eigenstaendige Seite ohne Scriptlets und externe Skripte', () => {
  const kb = read('Knowledgebase.html');
  assert.ok(/^<!DOCTYPE html>/i.test(kb));
  assert.ok(!/<\?/.test(kb), 'keine Apps-Script-Scriptlets');
  assert.ok(!/<script[^>]+src=/.test(kb), 'keine externen Skripte');
  assert.ok(!/fonts\.googleapis|<link[^>]+stylesheet/.test(kb), 'keine externen Schriften/Styles');
  assert.ok(Buffer.byteLength(kb, 'utf8') < 400000, 'unter der Apps-Script-Grenze');
  const code = [...kb.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n;\n');
  const stripped = code.split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
  assert.doesNotThrow(() => new vm.Script(stripped), 'parst auch nach Entfernen von "//"-Kommentaren');
});

test('Knowledge Base: Manifest und Artikel-Pakete passen zusammen (npm run build:kb)', () => {
  const kb = read('Knowledgebase.html');
  const m = /<script type="application\/json" id="kbManifest">([\s\S]*?)<\/script>/.exec(kb);
  assert.ok(m, 'Manifest vorhanden');
  assert.ok(!/\/\//.test(m[1]) && !/</.test(m[1]), 'Manifest ohne "//" und "<" (Apps Script)');
  const man = JSON.parse(m[1]);
  const count = Number((read('KnowledgebaseApi.gs').match(/var KB_CHUNK_COUNT_ = (\d+);/) || [])[1]);
  assert.equal(man.chunks, count, 'KB_CHUNK_COUNT_ passt zum Manifest');
  const files = fs.readdirSync(REPO_ROOT).filter((f) => /^KbData\d+\.html$/.test(f));
  assert.equal(files.length, count, 'eine Datei je Paket');
  assert.ok(read('.claspignore').includes('!*.html'), 'Pakete werden mit clasp hochgeladen');
  const ids = new Set();
  for (let n = 1; n <= count; n++) {
    const raw = read('KbData' + n + '.html');
    assert.ok(!/\/\//.test(raw) && !/</.test(raw), 'KbData' + n + ' ohne "//" und "<"');
    assert.ok(Buffer.byteLength(raw, 'utf8') < 150000, 'KbData' + n + ' klein genug');
    Object.keys(JSON.parse(raw)).forEach((id) => ids.add(id));
  }
  const missing = man.articles.filter((a) => !ids.has(a.id)).map((a) => a.id);
  assert.deepEqual(missing, [], 'jeder Artikel steckt in einem Paket');
  man.articles.forEach((a) => assert.ok(a.c >= 1 && a.c <= count, a.id + ': Paketnummer'));
  // Alle Produkte aus kb-src sind enthalten, jede Exportdatei vollstaendig
  const src = fs.readdirSync(path.join(REPO_ROOT, 'kb-src')).filter((f) => f.endsWith('.md'));
  assert.equal(man.products.length, src.length);
  src.forEach((f) => {
    const expected = Number((read('kb-src/' + f).match(/Artikel: (\d+)/) || [])[1]);
    const pi = man.products.findIndex((p) => p.key === f.replace('.md', ''));
    assert.equal(man.articles.filter((a) => a.p === pi).length, expected, f + ': alle Artikel uebernommen');
  });
});


test('Nachgeladene Skripte: nicht im Startdokument, vom Server erlaubt, in SelfTests bekannt', () => {
  const web = read('WebApp.gs');
  const allowed = (web.match(/var LAZY_SCRIPTS_ = \[([^\]]*)\]/) || ['', ''])[1];
  lazyScripts.forEach((f) => {
    const n = f.replace('.html', '');
    assert.ok(!includes.includes(n), n + ' steckt noch im Startdokument');
    assert.ok(allowed.includes('"' + n + '"'), n + ' fehlt in LAZY_SCRIPTS_');
    assert.ok(read('SelfTests.gs').includes('"' + n + '"'), n + ' fehlt in SELF_TEST_INCLUDE_FILES_');
  });
});

test('Nachgeladene Admin-Skripte: erlaubt, in SelfTests bekannt, Texte in ADMIN_I18N_, parsen ohne "//"-Kommentare', () => {
  const allowed = (read('WebApp.gs').match(/var LAZY_SCRIPTS_ = \[([^\]]*)\]/) || ['', ''])[1];
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(read('AdminI18n.gs') + '\n;this.__a = ADMIN_I18N_;', ctx);
  lazyAdminScripts.forEach((f) => {
    const n = f.replace('.html', '');
    assert.ok(!includes.includes(n), n + ' steckt im Startdokument');
    assert.ok(allowed.includes('"' + n + '"'), n + ' fehlt in LAZY_SCRIPTS_');
    assert.ok(read('SelfTests.gs').includes('"' + n + '"'), n + ' fehlt in SELF_TEST_INCLUDE_FILES_');
    const code = scriptsOf(f);
    const stripped = code.split('\n').map((l) => l.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
    assert.doesNotThrow(() => new vm.Script(stripped), f + ' nach Kommentar-Entfernung');
    const keys = [...code.matchAll(/\b(?:tr_\(|\[')'?((?:umx|tmx|mgrx)_[a-z_]+)'/g)].map((m) => m[1]);
    assert.ok(keys.length > 20, 'Schluessel gefunden');
    ['de', 'en', 'fr', 'es', 'pt', 'zh'].forEach((l) => {
      const missing = [...new Set(keys)].filter((k) => !(k in ctx.__a[l]));
      assert.deepEqual(missing, [], f + ': fehlt in ADMIN_I18N_.' + l);
    });
  });
});

test('Kein Dateiname doppelt (Apps Script erlaubt z. B. nicht X.gs und X.html zugleich)', () => {
  const names = fs.readdirSync(REPO_ROOT).filter((f) => /\.(gs|html)$/.test(f) && f !== 'preview.html').map((f) => f.replace(/\.(gs|html)$/, '').toLowerCase());
  const dups = names.filter((n, i) => names.indexOf(n) !== i);
  assert.deepEqual(dups, [], 'doppelte Namen: ' + dups.join(', '));
});
