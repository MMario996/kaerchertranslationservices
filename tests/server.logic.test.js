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
