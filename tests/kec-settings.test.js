'use strict';

// KeC Projects -> Einstellungen (KecSettings.gs): Bereinigung, Projektname,
// Excel-Import-Settings, Puffer fuer verlinkte Projekte.
const test = require('node:test');
const assert = require('node:assert/strict');
const plain = (v) => JSON.parse(JSON.stringify(v));
const { load } = require('./lib/load');

const ctx = load(['KecSettings.gs']);
const fmt = (d, tz, f) => (f === 'yyyy-MM-dd' ? '2026-10-07' : '14:30');

test('Bereinigung: Defaults, unbekannte Werte fallen weg', () => {
  const d = plain(ctx.kecSanitizeSettings_(null));
  assert.deepEqual(d.nameParts, []);
  assert.equal(d.bufferHours, 2);
  assert.equal(d.xlsx.enabled, false);
  const s = plain(ctx.kecSanitizeSettings_({
    nameParts: ['time', 'evil', 'date', 'time'], nameSep: '|', namePos: 'prefix', bufferHours: 3,
    xlsx: { enabled: true, sourceColumn: 'b', targetColumns: { 'DE-de': 'c', 'x y': 'D', fr_fr: '1' }, contextColumn: 'zz', startRow: '0' }
  }));
  assert.deepEqual(s.nameParts, ['time', 'date']);
  assert.equal(s.nameSep, ' - ');
  assert.equal(s.namePos, 'prefix');
  assert.equal(s.bufferHours, 2, 'nur 2/4/8/24/48');
  assert.deepEqual(s.xlsx, { enabled: true, sourceColumn: 'B', targetColumns: { de_de: 'C' }, contextColumn: 'ZZ', startRow: 2 });
  assert.equal(ctx.kecSanitizeSettings_({ bufferHours: '48' }).bufferHours, 48);
});

test('Projektname: Zusaetze in Reihenfolge, hinten oder vorne, leere ausgelassen', () => {
  const s = ctx.kecSanitizeSettings_({ nameParts: ['date', 'time', 'owner', 'creator'] });
  const c = { formatDate: fmt, owner: 'Max Mustermann', creator: '' };
  assert.equal(ctx.kecBuildProjectName_('Flyer', s, c), 'Flyer - 2026-10-07 - 14:30 - Max Mustermann');
  const p = ctx.kecSanitizeSettings_({ nameParts: ['targets', 'date'], nameSep: '_', namePos: 'prefix' });
  assert.equal(ctx.kecBuildProjectName_('Flyer', p, { formatDate: fmt, targetLangs: ['de_de', 'fr_fr'] }), 'de_de,fr_fr_2026-10-07_Flyer');
  assert.equal(ctx.kecBuildProjectName_('Flyer', ctx.kecSanitizeSettings_({}), {}), 'Flyer', 'ohne Auswahl unveraendert');
});

test('Excel-Import-Settings: Zielspalten nur fuer Job-Sprachen, Startzeile als Bereich', () => {
  const x = ctx.kecSanitizeSettings_({ xlsx: { enabled: true, sourceColumn: 'A', targetColumns: { de_de: 'B', fr_fr: 'C' }, contextColumn: 'D', startRow: 3 } }).xlsx;
  const r = plain(ctx.kecBuildXlsxImportSettings_(x, ['de_DE', 'it_it']));
  assert.deepEqual(r.settings, {
    fileFormat: 'multiling_xls',
    multilingualXls: { sourceColumn: 'A', targetColumns: { de_DE: 'B' }, segmentation: true, contextNoteColumn: 'D', importRows: '3-1048576' }
  });
  assert.deepEqual(r.missingLangs, ['it_it']);
  const noCtx = plain(ctx.kecBuildXlsxImportSettings_(Object.assign({}, x, { contextColumn: '', startRow: 1 }), ['fr_fr']));
  assert.equal(noCtx.settings.multilingualXls.contextNoteColumn, undefined);
  assert.equal(noCtx.settings.multilingualXls.importRows, undefined, 'ab Zeile 1 = alle Zeilen');
  assert.ok(ctx.kecIsExcelFile_('a.XLSX') && ctx.kecIsExcelFile_('a.xls') && !ctx.kecIsExcelFile_('a.docx'));
});

test('Puffer: Erstellungszeitpunkt + Stunden, ohne Datum nicht blockieren', () => {
  const created = '2026-10-07T10:00:00.000Z';
  const at = (iso) => new Date(iso).getTime();
  assert.equal(ctx.kecBufferCheck_(created, 2, at('2026-10-07T11:59:00Z')).ok, true);
  assert.equal(ctx.kecBufferCheck_(created, 2, at('2026-10-07T12:00:00Z')).ok, true);
  const late = ctx.kecBufferCheck_(created, 2, at('2026-10-07T12:01:00Z'));
  assert.equal(late.ok, false);
  assert.equal(late.until, '2026-10-07T12:00:00.000Z');
  assert.ok(late.reason.includes('2 h'));
  assert.equal(ctx.kecBufferCheck_(created, 48, at('2026-10-09T09:00:00Z')).ok, true);
  assert.equal(ctx.kecBufferCheck_('', 2).ok, true);
});
