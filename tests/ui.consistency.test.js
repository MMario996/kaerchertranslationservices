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
const uiFiles = ['Index.html', ...jsFiles, 'AdminConsole.html', 'AdminScript.html', 'PivotAdminConsole.html', 'PivotAdminScript.html'];

test('Index.html bindet Styles und alle Js-Dateien ein, jede Datei existiert', () => {
  assert.ok(includes.includes('Styles'));
  assert.ok(jsFiles.length >= 5, 'Js-Module eingebunden');
  includes.forEach((n) => assert.ok(fs.existsSync(path.join(REPO_ROOT, n + '.html')), n + '.html fehlt'));
});

test('SelfTests.gs kennt alle eingebundenen Dateien', () => {
  const selfTests = read('SelfTests.gs');
  includes.forEach((n) => assert.ok(selfTests.includes('"' + n + '"'), n + ' fehlt in SELF_TEST_INCLUDE_FILES_'));
});

test('Index.html enthaelt keine Template-Scriptlets ausser include()', () => {
  const rest = index.replace(/<\?!= include\('\w+'\); \?>/g, '');
  assert.ok(!/<\?/.test(rest), 'unerwartetes <? in Index.html');
});

test('Alle Skripte sind syntaktisch gueltig', () => {
  [...jsFiles, 'AdminScript.html', 'PivotAdminScript.html'].forEach((f) => {
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
  const core = scriptsOf('JsCore.html');
  const dictKeys = (lang) => {
    const start = core.search(new RegExp('\\n\\s*' + lang + '\\s*:\\s*\\{'));
    const block = core.slice(start, core.indexOf('\n  },', start) > 0 ? core.indexOf('\n  },', start) : undefined);
    return new Set([...block.matchAll(/^\s*"([a-z0-9_]+)"\s*:/gm)].map((m) => m[1]));
  };
  const en = dictKeys('en');
  const de = dictKeys('de');
  const code = [index, ...jsFiles.map(read)].join('\n');
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
