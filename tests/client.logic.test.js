'use strict';

// Oberflaechen-Logik aus den Js*.html-Dateien, geladen mit einem minimalen
// Browser-Ersatz (kein echtes DOM noetig).
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('vm');
// Objekte aus dem vm-Kontext stammen aus einem anderen Realm - fuer deepEqual
// erst in normale Daten umwandeln.
const plain = (v) => JSON.parse(JSON.stringify(v));
const { load, browserStubs } = require('./lib/load');

const JS_FILES = ['JsCore', 'JsForms', 'JsCampus', 'JsNavigation', 'JsDocumentation', 'JsUpload', 'JsProjects', 'JsDownload', 'JsMisc'].map((n) => n + '.html');
const ctx = load(JS_FILES, browserStubs());
const run = (code) => vm.runInContext(code, ctx);
const DAY = 86400000;

test('statusGroup_ ordnet Phrase-Status den Filtern zu', () => {
  assert.equal(ctx.statusGroup_('COMPLETED'), 'done');
  assert.equal(ctx.statusGroup_('notified'), 'done');
  assert.equal(ctx.statusGroup_('CANCELLED'), 'cancelled');
  assert.equal(ctx.statusGroup_('ERROR'), 'cancelled');
  assert.equal(ctx.statusGroup_('ASSIGNED'), 'open');
  assert.equal(ctx.statusGroup_(''), 'open');
});

test('dueClass_ markiert nur offene Projekte', () => {
  const past = new Date(Date.now() - DAY).toISOString();
  const soon = new Date(Date.now() + 10 * 3600000).toISOString();
  const later = new Date(Date.now() + 10 * DAY).toISOString();
  assert.equal(ctx.dueClass_({ status: 'UPLOADED', dueDate: past }), 'due-overdue');
  assert.equal(ctx.dueClass_({ status: 'UPLOADED', dueDate: soon }), 'due-soon');
  assert.equal(ctx.dueClass_({ status: 'UPLOADED', dueDate: later }), '');
  assert.equal(ctx.dueClass_({ status: 'COMPLETED', dueDate: past }), '');
  assert.equal(ctx.dueClass_({ status: 'UPLOADED' }), '');
});

test('isArchived_: nur fertige Projekte nach 30 Tagen, letzter Download zaehlt', () => {
  const old = new Date(Date.now() - 40 * DAY).toISOString();
  const recent = new Date(Date.now() - 5 * DAY).toISOString();
  assert.equal(ctx.isArchived_({ status: 'COMPLETED', timestamp: old }), true);
  assert.equal(ctx.isArchived_({ status: 'COMPLETED', timestamp: old, downloadedAt: recent }), false);
  assert.equal(ctx.isArchived_({ status: 'UPLOADED', timestamp: old }), false);
  assert.equal(ctx.isArchived_({ status: 'CANCELLED', timestamp: old }), true);
});

test('Kalender: Woche beginnt am Montag, Tagesschluessel lokal', () => {
  const sunday = new Date(2026, 8, 27); // So 27.09.2026
  const monday = ctx.calStartOfWeek_(sunday);
  assert.equal(monday.getDay(), 1);
  assert.equal(ctx.calDayKey_(monday), '2026-09-21');
  assert.equal(ctx.calDayKey_(ctx.calStartOfWeek_(new Date(2026, 8, 21))), '2026-09-21');
});

test('Kalender: Projekte werden nach Faelligkeitstag gruppiert', () => {
  const byDay = ctx.calProjectsByDay_([
    { projectName: 'B', dueDate: new Date(2026, 8, 30, 10).toISOString() },
    { projectName: 'A', dueDate: new Date(2026, 8, 30, 12).toISOString() },
    { projectName: 'X' }
  ]);
  assert.deepEqual(Object.keys(byDay), ['2026-09-30']);
  assert.deepEqual(plain(byDay['2026-09-30'].map((p) => p.projectName)), ['A', 'B']);
});

test('Dokumentation: Sprach-Badges sind escaped und farbig nach Status', () => {
  const html = ctx.docJobBadges_({ docJobs: [{ targetLang: 'de<script>', status: 'COMPLETED', fileName: 'x' }] });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('#2e7d32'));
  assert.equal(ctx.docJobBadges_({ docJobs: [] }), '-');
});

test('Download: Pivot-Projekte liefern die gewaehlten Teile', () => {
  run(`globalProjects = [
    { projectUid: 'P', pivotRole: 'PARENT', status: 'COMPLETED' },
    { projectUid: 'C', pivotRole: 'CHILD', pivotLink: 'P', status: 'COMPLETED' }
  ];`);
  const parent = run("globalProjects[0]");
  const pick = (value) => {
    ctx.document.querySelector = (sel) => (sel.includes('saveToDrivePart') ? { value } : null);
    return ctx.getSelectedDownloadParts_(parent).map((p) => p.label);
  };
  assert.deepEqual(plain(pick('both')), ['Source-Check', 'Translation']);
  assert.deepEqual(plain(pick('source')), ['Source-Check']);
  assert.deepEqual(plain(pick('target')), ['Translation']);
  const single = ctx.getSelectedDownloadParts_({ projectUid: 'S', status: 'COMPLETED' });
  assert.equal(single.length, 1);
  assert.equal(single[0].subFolder, null);
});

test('escapeHtml / escapeJs', () => {
  assert.equal(ctx.escapeHtml('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
  assert.ok(!ctx.escapeJs("it's").includes("'") || ctx.escapeJs("it's").includes("\\'"));
});
