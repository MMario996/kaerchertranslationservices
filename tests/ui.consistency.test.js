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
const uiFiles = ['Index.html', ...jsFiles, ...lazyUserFiles, 'AdminConsole.html', 'AdminScript.html', 'PivotAdminConsole.html', 'PivotAdminScript.html', 'TranslateUi.html'];

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
  [...jsFiles, 'HomeUi.html', 'AdminScript.html', 'PivotAdminScript.html', 'TranslateUi.html'].forEach((f) => {
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
  const code = [index, ...jsFiles.map(read), ...lazyUserFiles.map(read)].join('\n');
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
  assert.ok(Buffer.byteLength(kb, 'utf8') < 400000, 'unter der Apps-Script-Grenze');
  assert.doesNotThrow(() => new vm.Script(scriptsOf('Knowledgebase.html')));
  const ids = new Set([...kb.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const markup = kb.replace(/<script>[\s\S]*?<\/script>/g, '');
  const broken = [...markup.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]).filter((id) => !ids.has(id));
  assert.deepEqual(broken, [], 'interne Links zeigen auf vorhandene Abschnitte');
});
