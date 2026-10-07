'use strict';

// Kalender-Freigabe (CalendarSync.gs): eigener, signierter State statt des
// ScriptApp-State-Tokens, das nur fuer das Deploy-Konto gueltig war.
const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { load } = require('./lib/load');

const webSafe = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
const Utilities = {
  base64EncodeWebSafe: (v) => webSafe(Buffer.from(typeof v === 'string' ? v : v)),
  base64DecodeWebSafe: (s) => [...Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')],
  computeHmacSha256Signature: (value, key) => [...crypto.createHmac('sha256', key).update(value).digest()],
  newBlob: (bytes) => ({ getDataAsString: () => Buffer.from(bytes).toString('utf8') })
};
const ctx = load(['CalendarSync.gs'], { Utilities });
const SECRET = 'geheim';
const NOW = Date.UTC(2026, 9, 7, 9, 0);

test('State: signiert, liefert die E-Mail zurueck', () => {
  const st = ctx.calSignState_('Andrea.Heidrich@karcher.com', SECRET, NOW);
  assert.match(st, /^cal1\.[A-Za-z0-9_-]+\.\d+\.[A-Za-z0-9_-]+$/, 'nur URL-sichere Zeichen');
  assert.equal(ctx.calVerifyState_(st, SECRET, NOW + 1000), 'andrea.heidrich@karcher.com');
});

test('State: falsches Geheimnis, veraendert oder abgelaufen -> leer', () => {
  const st = ctx.calSignState_('a@karcher.com', SECRET, NOW);
  assert.equal(ctx.calVerifyState_(st, 'anderes', NOW), '');
  const parts = st.split('.');
  parts[1] = Buffer.from('b@karcher.com').toString('base64').replace(/=+$/, '');
  assert.equal(ctx.calVerifyState_(parts.join('.'), SECRET, NOW), '', 'andere E-Mail');
  assert.equal(ctx.calVerifyState_(st, SECRET, NOW + 61 * 60 * 1000), '', 'nach 1 h abgelaufen');
  assert.equal(ctx.calVerifyState_('', SECRET, NOW), '');
  assert.equal(ctx.calVerifyState_('ADHSGDJ-ScriptApp-Token', SECRET, NOW), '');
});

test('doGet erkennt nur die Kalender-Rueckleitung', () => {
  assert.equal(ctx.calIsOAuthRedirect_({ parameter: { state: 'cal1.x.1.y', code: '4/abc' } }), true);
  assert.equal(ctx.calIsOAuthRedirect_({ parameter: { state: 'cal1.x.1.y', error: 'access_denied' } }), true);
  assert.equal(ctx.calIsOAuthRedirect_({ parameter: { page: 'kb' } }), false);
  assert.equal(ctx.calIsOAuthRedirect_({ parameter: { state: 'other', code: 'x' } }), false);
  assert.equal(ctx.calIsOAuthRedirect_(undefined), false);
});
