'use strict';

// Admin-Reiter "Translate UI" (PhraseStrings.gs): Woerterbuecher per
// Phrase-Strings-API hochladen. UrlFetchApp & Co. sind hier nachgebaut.
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./lib/load');

const plain = (v) => JSON.parse(JSON.stringify(v));

function phraseStub(existingLocales, token, hooks) {
  const calls = [];
  const cache = {};
  let jwtN = 0;
  const props = { PHRASE_STRINGS_TOKEN: token || 'plat_Wk9abc3p5', PHRASE_STRINGS_PROJECT: 'translationservices' };
  const reply = (code, body) => ({ getResponseCode: () => code, getContentText: () => JSON.stringify(body) });
  const UrlFetchApp = {
    fetch(url, opts) {
      calls.push({ url, opts });
      if (url === 'https://eu.phrase.com/idm/oauth/token') {
        jwtN++;
        return reply(200, { access_token: 'JWT' + jwtN, token_type: 'Bearer', expires_in: 14399 });
      }
      if (hooks && hooks.api) { const r = hooks.api(url, opts, reply); if (r) return r; }
      const path = url.replace('https://api.phrase.com/v2', '');
      if (path === '/projects/translationservices') return reply(200, { id: 'P1', name: 'TranslationServices', slug: 'translationservices' });
      if (path.startsWith('/projects/P1/locales?')) return reply(200, existingLocales);
      if (path === '/projects/P1/locales') return reply(201, { id: 'L-' + JSON.parse(opts.payload).code, name: JSON.parse(opts.payload).name });
      if (path === '/projects/P1/uploads') return reply(201, { id: 'U' + calls.length, state: 'success', summary: { translation_keys_created: 2 } });
      return reply(404, { message: 'not found ' + path });
    }
  };
  const ctx = load(['PhraseStrings.gs'], {
    UrlFetchApp,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null, setProperty: (k, v) => { props[k] = v; } }) },
    Utilities: { sleep() {}, newBlob: (text, type, name) => ({ text, type, name }), computeDigest: (a, v) => Array.from(Buffer.from(String(v))), base64EncodeWebSafe: (b) => Buffer.from(b).toString('base64url'), DigestAlgorithm: { SHA_256: 'sha256' } },
    CacheService: { getScriptCache: () => ({ get: (k) => cache[k] || null, put: (k, v) => { cache[k] = v; } }) },
    getUserEmail_: () => 'admin@kaercher.com',
    isAdmin_: () => true,
    I18N_DICTS_: { de: { b: 'Zwei', a: 'Eins' }, en: { a: 'One', b: 'Two' }, fr: {}, es: {}, pt: {}, zh: {} },
    ADMIN_I18N_: { de: { x: 'Admin' }, en: { x: 'Admin' } }
  });
  return { ctx, calls };
}

test('Translate UI: passende Phrase-Locale finden (exakt vor Regionalvariante)', () => {
  const { ctx } = phraseStub([]);
  const locales = [{ id: '1', name: 'de-DE', code: 'de-DE' }, { id: '2', name: 'en', code: 'en' }, { id: '3', name: 'zh_CN', code: 'zh-CN' }, { id: '4', name: 'de', code: 'de' }];
  assert.equal(ctx.psFindLocale_(locales, 'de').id, '4');
  assert.equal(ctx.psFindLocale_(locales, 'en').id, '2');
  assert.equal(ctx.psFindLocale_(locales, 'zh').id, '3');
  assert.equal(ctx.psFindLocale_(locales.slice(0, 1), 'de').id, '1');
  assert.equal(ctx.psFindLocale_(locales, 'pt'), null);
});

test('Translate UI: Upload legt fehlende Sprache an, taggt Keys, ueberschreibt nur auf Wunsch', () => {
  const { ctx, calls } = phraseStub([{ id: 'LDE', name: 'de', code: 'de' }]);
  const r = plain(ctx.apiPsPush({ dicts: ['app', 'admin'], langs: ['de', 'en'], overwrite: false }));
  const uploads = calls.filter((c) => c.url.endsWith('/uploads'));
  assert.equal(uploads.length, 4);
  const first = uploads[0].opts.payload;
  assert.equal(first.file_format, 'simple_json');
  assert.equal(first.locale_id, 'LDE');
  assert.equal(first.tags, 'ui-app');
  assert.equal(first.update_translations, 'false');
  assert.deepEqual(Object.keys(JSON.parse(first.file.text)), ['a', 'b'], 'sortiert, flach');
  assert.equal(uploads[1].opts.payload.tags, 'ui-admin');
  assert.equal(uploads[0].opts.headers.Authorization, 'Bearer JWT1');
  assert.equal(calls.filter((c) => c.url.includes('/idm/oauth/token')).length, 1, 'Plattform-Token nur einmal getauscht');
  const created = calls.filter((c) => c.url.endsWith('/locales') && c.opts.method === 'post');
  assert.equal(created.length, 1, 'nur "en" fehlte');
  assert.equal(uploads[2].opts.payload.locale_id, 'L-en');
  assert.ok(r.results.every((x) => x.state === 'success'));
  assert.equal(r.results.find((x) => x.lang === 'en').localeCreated, true);

  const again = phraseStub([{ id: 'LDE', name: 'de', code: 'de' }]);
  again.ctx.apiPsPush({ dicts: ['app'], langs: ['de'], overwrite: true });
  assert.equal(again.calls.find((c) => c.url.endsWith('/uploads')).opts.payload.update_translations, 'true');
});

test('Translate UI: leere Woerterbuecher werden uebersprungen', () => {
  const { ctx, calls } = phraseStub([{ id: 'LFR', name: 'fr', code: 'fr' }]);
  const r = plain(ctx.apiPsPush({ dicts: ['admin'], langs: ['fr'] }));
  assert.equal(r.results[0].state, 'skipped');
  assert.equal(calls.filter((c) => c.url.endsWith('/uploads')).length, 0);
});

test('Translate UI: Token-Art erkennen', () => {
  const { ctx } = phraseStub([]);
  assert.equal(ctx.psAuthKind_('a'.repeat(64)), 'legacy');
  assert.equal(ctx.psAuthKind_('eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxIn0.sig-_x'), 'jwt');
  assert.equal(ctx.psAuthKind_('Wk9xxxxxxxxxxxx3p5'), 'platform');
  const p = plain(ctx.psExchangePayload_(' abc ', ''));
  assert.deepEqual(p, { grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange', subject_token: 'abc' });
});

test('Translate UI: Plattform-Token wird getauscht, klassischer Token direkt genutzt', () => {
  const plat = phraseStub([{ id: 'LDE', name: 'de', code: 'de' }]);
  const r = plain(plat.ctx.apiPsCheck());
  assert.equal(r.auth, 'platform');
  const ex = plat.calls.find((c) => c.url.includes('/idm/oauth/token'));
  assert.equal(ex.opts.method, 'post');
  assert.equal(ex.opts.payload.subject_token, 'plat_Wk9abc3p5');
  assert.ok(plat.calls.filter((c) => c.url.startsWith('https://api.phrase.com')).every((c) => c.opts.headers.Authorization === 'Bearer JWT1'));

  const legacy = phraseStub([{ id: 'LDE', name: 'de', code: 'de' }], 'f'.repeat(64));
  legacy.ctx.apiPsCheck();
  assert.equal(legacy.calls.filter((c) => c.url.includes('/idm/')).length, 0);
  assert.equal(legacy.calls[0].opts.headers.Authorization, 'token ' + 'f'.repeat(64));
});

test('Translate UI: abgelaufenes JWT wird nach 401 einmal neu getauscht', () => {
  let first = true;
  const { ctx, calls } = phraseStub([{ id: 'LDE', name: 'de', code: 'de' }], null, {
    api: (url, opts, reply) => {
      if (first) { first = false; return reply(401, { message: 'Unauthorized' }); }
      return null;
    }
  });
  const r = plain(ctx.apiPsCheck());
  assert.equal(r.projectName, 'TranslationServices');
  assert.equal(calls.filter((c) => c.url.includes('/idm/oauth/token')).length, 2);
  assert.equal(calls.filter((c) => c.url.startsWith('https://api.phrase.com')).pop().opts.headers.Authorization, 'Bearer JWT2');
});
