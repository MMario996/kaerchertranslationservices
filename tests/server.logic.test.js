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

const ctx = load(['DocQueue.gs', 'DocQueueSync.gs', 'PivotProjects.gs', 'Upload.gs', 'DownloadZip.gs']);
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

test('Doku-Sheet-Sync: nur offene Projekte werden bei Phrase abgefragt', () => {
  const data = [
    ['Project UID', 'Target Lang', 'File Name', 'Status', 'Phrase Project Status'],
    ['P1', 'de_de', 'a_de.xml', 'UPLOADED', 'NEW'],
    ['P2', 'fr_fr', 'a_fr.xml', 'COMPLETED', 'COMPLETED'],
    ['P3', 'es_es', 'a_es.xml', 'UPLOADED', 'COMPLETED'],
    ['', 'it_it', 'x.xml', 'UPLOADED', '']
  ];
  const col = ctx.docSyncColumns_(data[0]);
  assert.deepEqual(plain(col), { uid: 0, status: 3, projectStatus: 4, lang: 1, file: 2 });
  assert.deepEqual(plain(ctx.docSyncOpenProjects_(data, col)), ['P1', 'P3']);
});

test('Doku-Sheet-Sync: Projekt- und Job-Status werden nur bei Aenderung geschrieben', () => {
  const data = [
    ['Project UID', 'Target Lang', 'File Name', 'Status', 'Phrase Project Status'],
    ['P1', 'de_de', 'a_de.xml', 'UPLOADED', 'NEW'],
    ['P1', 'fr_fr', 'a_fr.xml', 'COMPLETED', 'NEW'],
    ['P1', 'it_it', 'a_it.xml', 'NOTIFIED', 'NEW'],
    ['P2', 'en_gb', 'b.xml', 'UPLOADED', 'ASSIGNED']
  ];
  const col = ctx.docSyncColumns_(data[0]);
  const changes = ctx.docSyncPlanUpdates_(data, col, {
    P1: { status: 'ASSIGNED', jobs: [
      { targetLang: 'de_de', filename: 'a_de.xml', status: 'ACCEPTED' },
      { targetLang: 'fr_fr', filename: 'a_fr.xml', status: 'COMPLETED' },
      { targetLang: 'it_it', filename: 'a_it.xml', status: 'COMPLETED' }
    ] }
  });
  assert.deepEqual(plain(changes).map((c) => [c.row, c.col, c.value]), [
    [2, 5, 'ASSIGNED'], [2, 4, 'ACCEPTED'],
    [3, 5, 'ASSIGNED'],
    [4, 5, 'ASSIGNED']
  ], 'NOTIFIED bleibt, P2 ohne Phrase-Daten unveraendert');
});

test('Doku-Sheet-Sync: Zuordnung ueber Sprache, bei mehreren Dateien ueber den Dateinamen', () => {
  const data = [
    ['Project UID', 'Target Lang', 'File Name', 'Status', 'Phrase Project Status'],
    ['P1', 'de-DE', 'x.xml', 'UPLOADED', 'NEW'],
    ['P1', 'fr_fr', 'f1.xml', 'UPLOADED', 'NEW'],
    ['P1', 'fr_fr', 'f2.xml', 'UPLOADED', 'NEW']
  ];
  const col = ctx.docSyncColumns_(data[0]);
  const changes = ctx.docSyncPlanUpdates_(data, col, {
    P1: { status: 'NEW', jobs: [
      { targetLang: 'de_de', filename: 'other.xml', status: 'COMPLETED' },
      { targetLang: 'fr_fr', filename: 'f1.xml', status: 'ACCEPTED' },
      { targetLang: 'fr_fr', filename: 'f2.xml', status: 'COMPLETED' }
    ] }
  });
  assert.deepEqual(plain(changes).map((c) => [c.row, c.value]), [[2, 'COMPLETED'], [3, 'ACCEPTED'], [4, 'COMPLETED']]);
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
  assert.deepEqual(out.home, { widgets: { kpis: true, focus: true, week: true, activity: true, tips: false }, tab: 'auto' });
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
  const web = load(['WebApp.gs', 'CalendarSync.gs'], {
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
  // Rueckleitung der Kalender-Freigabe landet nicht im Portal
  web.calendarHandleRedirect_ = (e) => ({ name: 'calendar', state: e.parameter.state });
  assert.equal(web.doGet({ parameter: { state: 'cal1.x.1.y', code: '4/abc' } }).name, 'calendar');
});

test('User Template Debugger: Vorschlaege zeigen, welcher eine Wert Templates freischaltet', () => {
  const cfg = load(['Config.gs']);
  const user = { client: 'KAG', domain: 'Marketing', subdomain: 'Web', businessUnit: 'PC' };
  const t = (client, domain, subdomain, businessUnit) => ({ client, domain, subdomain, businessUnit });
  const templates = {
    'Visible': t('KAG', 'Marketing', 'Web', 'PC'),
    'Needs Print A': t('KAG', 'Marketing', 'Print', 'PC'),
    'Needs Print B': t('kag', 'marketing', 'print', 'pc'),
    'Needs BU HC': t('KAG', 'Marketing', 'Web', 'HC'),
    'Two fields off': t('KNA', 'Marketing', 'Print', 'PC'),
    'Empty on template': t('KAG', '', 'Web', 'PC')
  };
  const s = plain(cfg.templateUnlockSuggestions_(templates, user));
  assert.deepEqual(s.map((x) => [x.field, x.value.toLowerCase(), x.unlocks]), [['Subdomain', 'print', 2], ['Business Unit', 'hc', 1]]);
  assert.deepEqual(s[0].templates, ['Needs Print A', 'Needs Print B']);
});

test('Phrase-Owner: Einreicher ist standardmaessig Owner, abschaltbar per Property', () => {
  const api = load(['ProjectsApi.gs']);
  assert.equal(api.realOwnerEnabled_(null), true);
  assert.equal(api.realOwnerEnabled_(''), true);
  assert.equal(api.realOwnerEnabled_('true'), true);
  assert.equal(api.realOwnerEnabled_(' FALSE '), false);
});

test('Phrase-Owner: wird fuer jeden Reiter gesetzt, Ergebnis landet im Protokoll', () => {
  const logged = [];
  const patched = [];
  const api = load(['ProjectsApi.gs'], {
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k === 'PHRASE_API_TOKEN' ? 't' : null) }) },
    UrlFetchApp: {
      fetch: (url, o) => {
        if (/\/users\?email=/.test(url)) return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ id: 42, uid: 'U', userName: 'anna', email: 'anna@x.de' }] }), getHeaders: () => ({}) };
        patched.push([url, o.method, o.payload]);
        return { getResponseCode: () => 200, getContentText: () => '{}' };
      }
    },
    logAuditEvent_: (u, a, d) => logged.push([u, a, d])
  });
  const r = api.phraseAssignSubmitterOwner_('P1', 'anna@x.de');
  assert.equal(r.ok, true);
  assert.equal(patched.length, 1);
  assert.equal(patched[0][1], 'patch');
  assert.deepEqual(JSON.parse(patched[0][2]), { owner: { id: 42 } });
  assert.deepEqual(logged, [['anna@x.de', 'PHRASE_OWNER_SET', 'P1 -> anna@x.de']]);
  // Upload setzt den Owner nicht mehr nur fuer WOMA/CC
  const upload = require('fs').readFileSync(require('path').join(__dirname, '..', 'Upload.gs'), 'utf8');
  assert.ok(!/setRealOwner/.test(upload));
  assert.ok(/phraseAssignSubmitterOwner_\(projectUid, userEmail\)/.test(upload));
});

test('Protokoll: Kategorien, Fehler-Markierung und Zusammenfuehren nach Zeit', () => {
  const log = load(['Auditlog.gs']);
  assert.equal(log.auditCategory_('CHAT_SENT'), 'messages');
  assert.equal(log.auditCategory_('PROJECT_CREATE'), 'projects');
  assert.equal(log.auditCategory_('PHRASE_OWNER_FAILED'), 'projects');
  assert.equal(log.auditCategory_('WHITELIST_ADD'), 'access');
  assert.equal(log.auditCategory_('PROP_EDIT'), 'system');
  assert.equal(log.auditLevel_('CHAT_FAILED', ''), 'error');
  assert.equal(log.auditLevel_('QUEUE_STATUS', 'Flyer | ERROR | P1'), 'error');
  assert.equal(log.auditLevel_('QUEUE_STATUS', 'Flyer | COMPLETED | P1'), 'ok');
  const m = plain(log.mergeLogEntries_(
    [{ ms: 1000, user: 'a', action: 'CHAT_SENT', details: 'x' }, { ms: 3000, user: 'b', action: 'PROP_EDIT', details: '' }],
    [{ ms: 2000, user: 'c', action: 'QUEUE_STATUS', details: 'P | ERROR' }], 10));
  assert.deepEqual(m.entries.map((e) => e.user), ['b', 'c', 'a']);
  assert.deepEqual(m.counts, { all: 3, projects: 1, messages: 1, access: 0, system: 1, error: 1 });
});

test('Protokoll: jede Chat-Nachricht wird mit erster Textzeile erfasst', () => {
  const logged = [];
  const log = load(['Auditlog.gs'], { logAuditEvent_: (u, a, d) => logged.push([u, a, d]) });
  // logAuditEvent_ aus Auditlog.gs ueberschreibt den Stub - erneut setzen
  log.logAuditEvent_ = (u, a, d) => logged.push([u, a, d]);
  log.logChatMessage_('anna@x.de', true, '<users/123> ✅ *Project submitted*\nmore');
  log.logChatMessage_('ben@x.de', false, 'Hi', 'Kein Direktchat');
  assert.deepEqual(logged, [['anna@x.de', 'CHAT_SENT', '✅ Project submitted'], ['ben@x.de', 'CHAT_FAILED', 'Hi | Kein Direktchat']]);
});

test('User Manager: Mehrfachwerte ersetzen, ergaenzen, entfernen', () => {
  const m = load(['AdminManagers.gs']);
  assert.equal(m.mergeMultiValue_('KAG, KNA', 'kna; KFR', 'add'), 'KAG, KNA, KFR');
  assert.equal(m.mergeMultiValue_('KAG, KNA\nKFR', 'kna', 'remove'), 'KAG, KFR');
  assert.equal(m.mergeMultiValue_('KAG', 'X, Y', 'replace'), 'X, Y');
  assert.equal(m.mergeMultiValue_('', '', 'replace'), '');
});

test('Manager-Kennzahlen: Projekte je Eigentuemer, Template-Nutzung, fehlende Segmentierung', () => {
  const m = load(['AdminManagers.gs']);
  const rows = [
    { owner: 'a@x.de', status: 'NEW', timestamp: '2026-09-01T00:00:00Z', templateName: 'Marketing Flyer [en]' },
    { owner: 'a@x.de', status: 'COMPLETED', timestamp: '2026-09-10T00:00:00Z', templateName: 'Marketing Flyer Express [en]' },
    { owner: 'b@x.de', status: 'CANCELLED', timestamp: '2026-08-01T00:00:00Z', templateName: 'Other' }
  ];
  assert.deepEqual(plain(m.aggregateProjectsByOwner_(rows)), {
    'a@x.de': { total: 2, open: 1, last: '2026-09-10T00:00:00Z' },
    'b@x.de': { total: 1, open: 0, last: '2026-08-01T00:00:00Z' }
  });
  const usage = plain(m.templateUsage_(rows, [{ uid: 'T1', displayName: 'Marketing Flyer' }, { uid: 'T2', displayName: 'Marketing Flyer Express' }]));
  assert.deepEqual(usage, { T1: { count: 1, last: '2026-09-01T00:00:00Z' }, T2: { count: 1, last: '2026-09-10T00:00:00Z' } }, 'laengster Name gewinnt');
  assert.deepEqual(plain(m.templateMissingFields_({ client: 'KAG', domain: '', subDomain: 'Web', businessUnit: '' })), ['Domain', 'Business Unit']);
});

test('Knowledge Base: apiKbChunk liefert nur bekannte Pakete', () => {
  const kb = load(['KnowledgebaseApi.gs'], {
    HtmlService: { createHtmlOutputFromFile: (n) => ({ getContent: () => '{"' + n + '":1}' }) }
  });
  const count = kb.KB_CHUNK_COUNT_;
  assert.ok(count > 0);
  assert.equal(kb.apiKbChunk(1), '{"KbData1":1}');
  assert.equal(kb.apiKbChunk(String(count)), '{"KbData' + count + '":1}');
  assert.throws(() => kb.apiKbChunk(0));
  assert.throws(() => kb.apiKbChunk(count + 1));
  assert.throws(() => kb.apiKbChunk('1; x'));
  assert.throws(() => kb.apiKbChunk(1.5));
});

test('Knowledge-Base-Build: Hinweis-Ueberschriften werden zu Callouts, Code bleibt unberuehrt', () => {
  const { preprocess, safeJson } = require('../tools/build-kb.js');
  const out = preprocess('#### Title\n\n##### Note\n\nBeware.\n\n```\n# not a heading\n```');
  assert.match(out, /^### Title/m);
  assert.match(out, /^> \[!note\]\n>\n> Beware\./m);
  assert.match(out, /^# not a heading$/m);
  assert.equal(safeJson({ u: 'https://x/</a>' }), '{"u":"https:\\/\\/x\\/\\u003c\\/a>"}');
});

test('findDuplicateTopLevelDecls_: doppeltes let/const/class wird gemeldet, eingerueckte nicht', () => {
  const st = load(['SelfTests.gs']);
  assert.deepEqual(plain(st.findDuplicateTopLevelDecls_({
    JsCore: 'let a = 1;\nconst b = 2;\nfunction f() {\n  let a = 3;\n}',
    JsMisc: 'let userPrefs_ = {};\nclass K {}',
    JsPersonal: 'let userPrefs_ = {};\nvar b = 4;'
  })), ['userPrefs_ (JsMisc, JsPersonal)']);
  assert.deepEqual(plain(st.findDuplicateTopLevelDecls_({ JsPersonal: 'let x = 1;\nlet x = 2;' })), ['x (JsPersonal, JsPersonal)']);
});

test('Browser-Code im Repo: keine doppelte Top-Level-Deklaration (SELF_TEST_WINDOW_SCRIPTS_)', () => {
  const fs = require('fs');
  const path = require('path');
  const st = load(['SelfTests.gs']);
  const sources = {};
  st.SELF_TEST_WINDOW_SCRIPTS_.forEach((n) => { sources[n] = fs.readFileSync(path.join(__dirname, '..', n + '.html'), 'utf8'); });
  assert.deepEqual(plain(st.findDuplicateTopLevelDecls_(sources)), []);
});

test('Erkennungsmerkmale: jede Datei enthaelt genau ihr eigenes; vertauschter Inhalt wird benannt', () => {
  const fs = require('fs');
  const path = require('path');
  const st = load(['SelfTests.gs']);
  const sources = {};
  Object.keys(st.SELF_TEST_FILE_SIGNATURES_).forEach((n) => { sources[n] = fs.readFileSync(path.join(__dirname, '..', n + '.html'), 'utf8'); });
  assert.deepEqual(plain(st.wrongFileContents_(sources)), []);
  Object.keys(sources).forEach((n) => {
    const owners = Object.keys(sources).filter((o) => sources[o].includes(st.SELF_TEST_FILE_SIGNATURES_[n]));
    assert.deepEqual(owners, [n], n + ': Merkmal eindeutig');
  });
  sources.JsUpload = sources.JsProjects;
  assert.deepEqual(plain(st.wrongFileContents_(sources)), ['JsUpload: enthaelt Inhalt von JsProjects (1339 Zeilen) - Datei aus dem Repo neu einfuegen']);
});

test('Nutzer/Templates nach Phrase: Werte, PUT-Body, Pruefung', () => {
  const m = load(['AdminManagers.gs', 'ManagerPhraseSync.gs']);
  const cat = { clients: [{ id: '1', name: 'AKW' }, { id: '2', name: 'KNA' }], domains: [{ id: 'd', name: 'Technical Content' }], subDomains: [],
    businessUnits: [{ id: 'b9', name: 'OTC' }], workflowSteps: [{ id: 's1', name: 'Translation' }] };
  assert.deepEqual(plain(m.mgrPhraseValue_('clients', 'akw, KNA', cat)), [{ id: '1' }, { id: '2' }]);
  assert.deepEqual(plain(m.mgrPhraseValue_('businessUnit', 'OTC', cat)), { id: 'b9' });
  assert.equal(m.mgrPhraseValue_('businessUnit', '', cat), null);
  assert.deepEqual(plain(m.mgrPhraseValue_('targetLangs', 'DE_DE; fr_fr', cat)), ['de_de', 'fr_fr']);
  assert.equal(m.mgrPhraseValue_('sourceLang', 'EN', cat), 'en');
  assert.throws(() => m.mgrPhraseValue_('clients', 'Unbekannt', cat), /unbekannt/);
  assert.throws(() => m.mgrPhraseValue_('client', 'AKW, KNA', cat), /nur ein Wert/);
  assert.deepEqual(plain(m.mgrEditBody_({ uid: 'U', id: '7', userName: 'x', role: 'LINGUIST', clients: [{ id: 1, name: 'AKW' }],
    businessUnit: { uid: 'b9', name: 'OTC' }, createdBy: { id: 3 }, settings: { a: { id: 5 }, b: 2 } })),
    { userName: 'x', role: 'LINGUIST', clients: [{ id: '1' }], businessUnit: { id: 'b9' }, settings: { a: { id: '5' }, b: 2 } });
  assert.equal(m.mgrSameValue_([{ id: 2, name: 'KNA' }, { id: 1 }], [{ id: '1' }, { id: '2' }]), true);
  assert.equal(m.mgrSameValue_(['DE_DE'], ['de_de']), true);
  assert.equal(m.mgrSameValue_(null, []), true);
  assert.equal(m.mgrSameValue_({ id: 1 }, { id: '2' }), false);
});
