'use strict';

// Reine Server-Logik (ohne Apps-Script-Dienste). Dieselben Faelle laufen im
// Admin-Bereich unter "Tests" auch in der echten Apps-Script-Umgebung
// (SelfTests.gs).
const test = require('node:test');
const assert = require('node:assert/strict');
// Objekte aus dem vm-Kontext stammen aus einem anderen Realm - fuer deepEqual
// erst in normale Daten umwandeln.
const plain = (v) => JSON.parse(JSON.stringify(v));
const { load } = require('./lib/load');

const ctx = load(['DocQueue.gs', 'PivotProjects.gs', 'Upload.gs', 'DownloadZip.gs']);
const j = (status) => ({ status });

test('docAggregateStatus_: Projekt ist so weit wie sein langsamster Job', () => {
  assert.equal(ctx.docAggregateStatus_([j('COMPLETED'), j('UPLOADED')], ''), 'UPLOADED');
  assert.equal(ctx.docAggregateStatus_([j('ACCEPTED'), j('COMPLETED'), j('DELIVERED')], ''), 'ACCEPTED');
});

test('docAggregateStatus_: abgebrochene Jobs zaehlen nicht mit', () => {
  assert.equal(ctx.docAggregateStatus_([j('COMPLETED'), j('CANCELLED')], ''), 'COMPLETED');
  assert.equal(ctx.docAggregateStatus_([j('CANCELLED'), j('REJECTED')], ''), 'CANCELLED');
});

test('docAggregateStatus_: ohne Jobs NEW, Phrase-Projektstatus gewinnt', () => {
  assert.equal(ctx.docAggregateStatus_([], ''), 'NEW');
  assert.equal(ctx.docAggregateStatus_([j('UPLOADED')], 'COMPLETED_BY_VENDOR'), 'COMPLETED');
  assert.equal(ctx.docAggregateStatus_([j('UPLOADED')], 'CANCELLED'), 'CANCELLED');
});

test('docAggregateStatus_: unbekannte Job-Status gelten als UPLOADED', () => {
  assert.equal(ctx.docAggregateStatus_([j('WHATEVER'), j('COMPLETED')], ''), 'UPLOADED');
});

test('Projektnotiz: Pivot-Marker bleibt beim Speichern erhalten und wird nicht angezeigt', () => {
  const withMarker = ctx.pivotBuildNote_('Bitte Glossar nutzen');
  assert.ok(withMarker.includes(ctx.PIVOT_NOTE_MARKER_));
  assert.equal(ctx.pivotBuildNote_(withMarker), withMarker, 'Marker nicht doppelt');
  assert.equal(ctx.noteStripPivotMarker_(withMarker), 'Bitte Glossar nutzen');
  assert.equal(ctx.noteStripPivotMarker_(''), '');
});

test('noteNormalizeJobUids_ akzeptiert Array, JSON und Listen', () => {
  assert.deepEqual(plain(ctx.noteNormalizeJobUids_(['a', ' b ', ''])), ['a', 'b']);
  assert.deepEqual(plain(ctx.noteNormalizeJobUids_('["a","b"]')), ['a', 'b']);
  assert.deepEqual(plain(ctx.noteNormalizeJobUids_('a; b,c')), ['a', 'b', 'c']);
  assert.deepEqual(plain(ctx.noteNormalizeJobUids_('')), []);
  assert.deepEqual(plain(ctx.noteNormalizeJobUids_(null)), []);
});

test('notePersonName_ bevorzugt vollen Namen', () => {
  assert.equal(ctx.notePersonName_({ firstName: 'Anna', lastName: 'Muster' }), 'Anna Muster');
  assert.equal(ctx.notePersonName_({ userName: 'amuster' }), 'amuster');
  assert.equal(ctx.notePersonName_(null), 'Unknown');
});

test('Zieldateiname: Sprache wird angehaengt, Endung bleibt', () => {
  assert.equal(ctx._buildTargetFileName_('Anleitung.docx', 'en_gb', '', '', ''), 'Anleitung_en_gb.docx');
  assert.equal(ctx._buildTargetFileName_('', 'de', '.xlsx', '', ''), 'translation_de.xlsx');
});

test('Google-Format nur fuer docx/xlsx/pptx', () => {
  assert.equal(ctx._googleMimeForExt_('.docx'), 'application/vnd.google-apps.document');
  assert.equal(ctx._googleMimeForExt_('.XLSX'), 'application/vnd.google-apps.spreadsheet');
  assert.equal(ctx._googleMimeForExt_('.pptx'), 'application/vnd.google-apps.presentation');
  assert.equal(ctx._googleMimeForExt_('.pdf'), '');
});

// --- Persoenliche Einstellungen / Kalender-Sync ------------------------------
const crypto = require('crypto');
const personal = load(['UserPrefs.gs', 'CalendarSync.gs'], {
  Utilities: {
    DigestAlgorithm: { MD5: 'md5' },
    computeDigest: (alg, s) => [...crypto.createHash(alg).update(String(s), 'utf8').digest()].map((b) => (b > 127 ? b - 256 : b)),
    base64Encode: (bytes) => Buffer.from(bytes.map((b) => b & 0xff)).toString('base64')
  },
  PORTAL_URL_: 'https://portal.example',
  console
});

test('sanitizeClientPrefs_: nur erlaubte Werte, E-Mails bereinigt', () => {
  const out = plain(personal.sanitizeClientPrefs_({
    theme: 'neon', fontScale: '1.2', startPage: false,
    team: { enabled: 1, mode: 'custom', emails: 'A@x.de, a@x.de; kaputt, b@y.com' }, other: 'x'
  }));
  assert.deepEqual(out, { theme: 'light', fontScale: 1.2, startPage: false, team: { enabled: true, mode: 'custom', emails: ['a@x.de', 'b@y.com'] } });
  assert.deepEqual(plain(personal.sanitizeClientPrefs_({ team: { mode: 'x' } }).team), { enabled: false, mode: 'bu', emails: [] });
});

test('sanitizeClientPrefs_: neue Einstellungen (Anrede, Dichte, Startseite, Glocke, Anheften)', () => {
  const out = plain(personal.sanitizeClientPrefs_({
    displayName: '  <b>Max</b>\n  Muster ', density: 'tiny', reduceMotion: 'yes', startTab: 'history',
    home: { widgets: { tips: false, quick: 0, evil: false }, tab: 'nope' },
    pinned: ['A1', 'A1', 'bad uid', 'x'.repeat(65), 'B_2-c'], notifTypes: ['completed', 'hack', 'shared'],
    notifToast: false, shortcuts: 0
  }));
  assert.equal(out.displayName, 'bMax/b Muster');
  assert.equal(out.density, 'comfortable');
  assert.equal(out.reduceMotion, false);
  assert.equal(out.startTab, 'history');
  assert.deepEqual(out.home, { widgets: { quick: true, kpis: true, focus: true, week: true, activity: true, tips: false }, tab: 'auto' });
  assert.deepEqual(out.pinned, ['A1', 'B_2-c']);
  assert.deepEqual(out.notifTypes, ['completed', 'shared']);
  assert.equal(out.notifToast, false);
  assert.equal(out.shortcuts, true);
  assert.equal(personal.sanitizeClientPrefs_({ displayName: 'x'.repeat(80) }).displayName.length, 40);
  assert.deepEqual(plain(personal.sanitizeClientPrefs_({ home: { tab: 'pinned' } }).home).tab, 'pinned');
  assert.deepEqual(Object.keys(plain(personal.sanitizeClientPrefs_({ foo: 1 }))), []);
});

test('Kalender: Termin-IDs sind gueltig (base32hex) und stabil', () => {
  const id = personal.calEventId_('AbC123-xyz');
  assert.match(id, /^[a-v0-9]{5,1024}$/);
  assert.equal(id, personal.calEventId_('AbC123-xyz'));
  assert.notEqual(id, personal.calEventId_('AbC123-xyz2'));
  assert.match(personal.calServiceName_('Max@Kaercher.com'), /^Cal_[0-9a-f]{20}$/);
  assert.equal(personal.calServiceName_('Max@Kaercher.com'), personal.calServiceName_('max@kaercher.com'));
});

test('Kalender: Termin aus Projekt - offen, fertig, abgebrochen', () => {
  const row = { email: 'me@x.de', includeDone: true, lang: 'de' };
  const p = { projectUid: 'P1', projectName: 'Flyer', status: 'NEW', dueDate: '2026-10-01T10:00:00.000Z', targetLangs: ['fr'], owner: 'boss@x.de' };
  const ev = personal.calBuildEvent_(p, row);
  assert.ok(ev.summary.includes('Frist') && ev.summary.includes('Flyer'));
  assert.equal(ev.end.dateTime, '2026-10-01T10:00:00.000Z');
  assert.equal(ev.start.dateTime, '2026-10-01T09:30:00.000Z');
  assert.ok(ev.description.includes('boss@x.de'));
  assert.equal(ev.extendedProperties.private.projectUid, 'P1');
  const done = personal.calBuildEvent_(Object.assign({}, p, { status: 'COMPLETED' }), row);
  assert.ok(done.summary.includes('Fertig'));
  assert.notEqual(done.extendedProperties.private.fp, ev.extendedProperties.private.fp);
  assert.equal(personal.calBuildEvent_(Object.assign({}, p, { status: 'COMPLETED' }), Object.assign({}, row, { includeDone: false })), null);
  assert.equal(personal.calBuildEvent_(Object.assign({}, p, { status: 'CANCELLED' }), row), null);
  assert.equal(personal.calBuildEvent_(Object.assign({}, p, { dueDate: 'kaputt' }), row), null);
});

test('Startseite: Fortschritt = erledigte / relevante Phrase-Jobs', () => {
  const web = load(['WebApp.gs']);
  const s = (status) => ({ status });
  assert.deepEqual(plain(web.projectProgress_([s('COMPLETED'), s('DELIVERED'), s('NEW'), s('ACCEPTED'), s('CANCELLED')])), { done: 2, total: 4 });
  assert.deepEqual(plain(web.projectProgress_([])), { done: 0, total: 0 });
});

test('User Template Debugger: Gruende passen zur Sichtbarkeitsregel', () => {
  const cfg = load(['Config.gs']);
  const user = { client: 'KAG, KNA', domain: 'Marketing', subdomain: '', businessUnit: 'PC' };
  const ok = { client: 'kna', domain: 'marketing', subdomain: 'x', businessUnit: 'pc' };
  assert.equal(cfg.templateMatchesUser_(ok, user), false, 'Subdomain fehlt beim Nutzer');
  assert.deepEqual(plain(cfg.explainTemplateMismatch_(ok, user)), ["Subdomain fehlt beim Nutzer (Template: 'x')"]);
  const full = Object.assign({}, user, { subdomain: 'x' });
  assert.equal(cfg.templateMatchesUser_(ok, full), true);
  assert.deepEqual(plain(cfg.explainTemplateMismatch_(ok, full)), [], 'sichtbar = keine Gruende');
  assert.deepEqual(plain(cfg.explainTemplateMismatch_({ client: 'KA', domain: 'marketing', subdomain: 'x', businessUnit: '' }, full)),
    ["Client: Template 'KA' nicht in Nutzer 'KAG, KNA'", 'Business Unit fehlt am Template'], 'kein Teilstring-Treffer');
});

test('doGet: ?page=kb liefert die Knowledge Base (einbettbar), sonst das Portal', () => {
  const calls = [];
  const out = (kind, name) => {
    const o = { kind, name, xfo: null };
    o.setTitle = () => o; o.addMetaTag = () => o; o.evaluate = () => o;
    o.setXFrameOptionsMode = (m) => { o.xfo = m; return o; };
    return o;
  };
  const web = load(['WebApp.gs'], {
    HtmlService: {
      XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
      createHtmlOutputFromFile: (n) => { calls.push(n); return out('file', n); },
      createTemplateFromFile: (n) => { calls.push(n); return out('template', n); }
    }
  });
  const kb = web.doGet({ parameter: { page: 'KB' } });
  assert.equal(kb.name, 'Knowledgebase');
  assert.equal(kb.xfo, 'ALLOWALL');
  assert.equal(web.doGet({ parameter: { page: 'knowledgebase' } }).name, 'Knowledgebase');
  assert.equal(web.doGet({ parameter: {} }).name, 'Index');
  assert.equal(web.doGet(undefined).name, 'Index');
});
