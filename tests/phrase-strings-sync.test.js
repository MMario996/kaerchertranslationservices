'use strict';

// Rueckweg aus Phrase Strings (PhraseStringsSync.gs): Texte zurueckholen,
// pruefen, als Uebersteuerung speichern und beim Ausliefern darueberlegen.
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./lib/load');

const plain = (v) => JSON.parse(JSON.stringify(v));

/** Minimales Sheet im Speicher (nur was PhraseStringsSync.gs braucht). */
function memSheet() {
  const rows = [];
  const fmt = { setFontWeight: () => fmt, setBackground: () => fmt };
  const sh = {
    rows,
    appendRow: (r) => rows.push(r.slice()),
    getLastRow: () => rows.length,
    setFrozenRows() {},
    deleteRow: (i) => rows.splice(i - 1, 1),
    deleteRows: (i, n) => rows.splice(i - 1, n),
    getRange(r, c, nr, nc) {
      if (typeof r === 'string') return fmt;
      return {
        getValues: () => rows.slice(r - 1, r - 1 + nr).map((x) => x.slice(c - 1, c - 1 + nc)),
        setValues: (vals) => vals.forEach((v, i) => { rows[r - 1 + i] = v.slice(); })
      };
    }
  };
  return sh;
}

function stub(pulledByLocale) {
  const sheets = {};
  const cache = {};
  const props = { PHRASE_STRINGS_TOKEN: 'f'.repeat(64), PHRASE_STRINGS_PROJECT: 'P1' };
  const calls = [];
  const reply = (code, body) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(body) });
  const ctx = load(['PhraseStrings.gs', 'PhraseStringsSync.gs'], {
    UrlFetchApp: {
      fetch(url) {
        calls.push(url);
        const path = url.replace('https://api.phrase.com/v2', '');
        if (path === '/projects/P1') return reply(200, { id: 'P1', name: 'TranslationServices' });
        if (path.startsWith('/projects/P1/locales?')) return reply(200, [{ id: 'LDE', name: 'de', code: 'de' }, { id: 'LEN', name: 'en', code: 'en' }]);
        const m = path.match(/^\/projects\/P1\/locales\/(\w+)\/download\?file_format=simple_json&tags=([\w-]+)$/);
        if (m) return reply(200, (pulledByLocale[m[1]] || {})[m[2]] || {});
        return reply(404, { message: 'not found ' + path });
      }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache[k] || null, put: (k, v) => { cache[k] = v; }, remove: (k) => { delete cache[k]; } }) },
    Utilities: { sleep() {} },
    openAccessSS_: () => ({ getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => (sheets[n] = memSheet()) }),
    getUserEmail_: () => 'admin@kaercher.com',
    isAdmin_: (e) => e === 'admin@kaercher.com',
    I18N_DICTS_: {
      en: { hello: 'Hello', count: '{n} files', bold: 'Click <b>here</b>', only_en: 'Only EN' },
      de: { hello: 'Hallo', count: '{n} Dateien', bold: 'Klick <b>hier</b>' },
      fr: {}, es: {}, pt: {}, zh: {}
    },
    ADMIN_I18N_: { en: { adm: 'Admin' }, de: { adm: 'Admin' } }
  });
  return { ctx, sheets, cache, calls, props };
}

test('Pruefung: Platzhalter und HTML muessen zum Original passen', () => {
  const { ctx } = stub({});
  assert.equal(ctx.psValidateText_('{n} files', '{n} Dateien'), '');
  assert.match(ctx.psValidateText_('{n} files', 'Dateien'), /Platzhalter/);
  assert.match(ctx.psValidateText_('Hello', 'Hallo {x}'), /Platzhalter/);
  assert.equal(ctx.psValidateText_('Click <b>here</b>', 'Klick <b>hier</b>'), '');
  assert.match(ctx.psValidateText_('Hello', '<img src=x onerror=alert(1)>'), /HTML/);
  assert.match(ctx.psValidateText_('Click <b>here</b>', '<script>x</script>'), /HTML/);
  assert.match(ctx.psValidateText_('a < b', 'a <script>'), /HTML/);
  assert.match(ctx.psValidateText_('Hello', '  '), /leer/);
});

test('Diff: nur bekannte, geaenderte und gueltige Texte werden Uebersteuerung', () => {
  const { ctx } = stub({});
  const en = { hello: 'Hello', count: '{n} files', gone: 'x' };
  const de = { hello: 'Hallo', count: '{n} Dateien' };
  const d = plain(ctx.psDiffOverrides_(de, en, { hello: 'Servus', count: 'Dateien', unknown_key: 'x', gone: 'Weg', same: 1 }));
  assert.deepEqual(d.overrides, { hello: 'Servus', gone: 'Weg' });
  assert.equal(d.rejected.length, 1);
  assert.equal(d.rejected[0].key, 'count');
  assert.equal(d.unknown, 1);
  assert.deepEqual(plain(ctx.psDiffOverrides_(de, en, { hello: 'Hallo' })).overrides, {}, 'unveraendert = keine Uebersteuerung');
});

test('Pull speichert Uebersteuerungen, ausgelieferte Woerterbuecher enthalten sie', () => {
  const s = stub({ LDE: { 'ui-app': { hello: 'Moin', count: 'kaputt', only_en: 'Nur EN' } } });
  const r = plain(s.ctx.apiPsPull({ dicts: ['app'], langs: ['de', 'fr'] }));
  const de = r.results.find((x) => x.lang === 'de');
  assert.equal(de.state, 'success');
  assert.equal(de.overrides, 2);
  assert.equal(de.rejectedCount, 1);
  assert.equal(r.results.find((x) => x.lang === 'fr').state, 'no-locale');
  assert.ok(s.calls.some((u) => u.includes('/locales/LDE/download?file_format=simple_json&tags=ui-app')));
  assert.equal(s.sheets.UiTranslations.rows.length, 3, 'Kopfzeile + 2 Uebersteuerungen');
  const merged = plain(s.ctx.psMergedDict_('app', 'de'));
  assert.equal(merged.hello, 'Moin');
  assert.equal(merged.count, '{n} Dateien', 'abgelehnter Text bleibt beim Original');
  assert.equal(merged.only_en, 'Nur EN');
  assert.equal(s.ctx.psMergedDict_('app', 'en').hello, 'Hello', 'andere Sprachen unberuehrt');
  assert.equal(s.ctx.psDict_('app', 'de').hello, 'Moin', 'Upload nutzt die zurueckgeholten Texte');

  // Erneuter Pull ersetzt die Uebersteuerungen der Sprache, statt sie anzuhaengen.
  s.ctx.apiPsPull({ dicts: ['app'], langs: ['de'] });
  assert.equal(s.sheets.UiTranslations.rows.length, 3);
  s.ctx.apiPsClearOverrides();
  assert.equal(s.ctx.psMergedDict_('app', 'de').hello, 'Hallo', 'nach dem Leeren wieder Original');
});

test('Abdeckung zaehlt fehlende Keys pro Sprache', () => {
  const s = stub({ LDE: { 'ui-app': { only_en: 'Nur EN' } } });
  let cov = plain(s.ctx.apiPsCoverage());
  assert.equal(cov.app.de.total, 4);
  assert.equal(cov.app.de.missing, 1);
  assert.deepEqual(cov.app.de.sample, ['only_en']);
  assert.equal(cov.app.fr.missing, 4);
  s.ctx.apiPsPull({ dicts: ['app'], langs: ['de'] });
  cov = plain(s.ctx.apiPsCoverage());
  assert.equal(cov.app.de.missing, 0);
  assert.equal(cov.app.de.overrides, 1);
});

test('Nur Admins; der naechtliche Trigger laeuft ohne angemeldeten Admin', () => {
  const s = stub({});
  s.ctx.getUserEmail_ = () => 'user@kaercher.com';
  assert.throws(() => s.ctx.apiPsPull({ dicts: ['app'], langs: ['de'] }), /Not authorized/);
  assert.throws(() => s.ctx.apiPsCoverage(), /Not authorized/);
  s.ctx.psNightlySync_();
  assert.ok(s.calls.some((u) => u.includes('/download?')), 'Pull lief im Trigger');
  assert.equal(s.ctx.psSystemRun_, false, 'Flag danach wieder aus');
  assert.throws(() => s.ctx.apiPsPull({ dicts: ['app'], langs: ['de'] }), /Not authorized/);
});
