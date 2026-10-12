'use strict';

// Marketing-Erweiterungen: Consulting (MarketingConsulting.gs), Vorab-Kalkulation
// (MarketingPrecalc.gs), Maximaltemplate (MaxTemplate.gs), Urlaubsvertretung
// (Deputies.gs) und die Beschriftung "Projekt erstellt/geteilt von" (JsProjects.html).
const test = require('node:test');
const assert = require('node:assert/strict');
const { load, browserStubs } = require('./lib/load');

const plain = (v) => JSON.parse(JSON.stringify(v));
const ctx = load(['Deputies.gs', 'MarketingConsulting.gs', 'MarketingPrecalc.gs', 'MaxTemplate.gs']);

test('Vertretung: Eingabe bereinigen', () => {
  assert.deepEqual(plain(ctx.deputySanitize_({ email: ' Kollegin@Kaercher.com ', from: '2026-10-20', to: '2026-10-31', active: true }, 'me@kaercher.com')),
    { ok: true, value: { email: 'kollegin@kaercher.com', from: '2026-10-20', to: '2026-10-31', active: true } });
  assert.equal(ctx.deputySanitize_({ email: 'me@kaercher.com', active: true }, 'ME@kaercher.com').error, 'self');
  assert.equal(ctx.deputySanitize_({ email: 'kein-mail' }, 'me@x.de').error, 'invalid_email');
  assert.equal(ctx.deputySanitize_({ email: 'a@x.de', from: '2026-10-31', to: '2026-10-01' }, 'me@x.de').error, 'range');
  const off = ctx.deputySanitize_({ email: '', active: true }, 'me@x.de');
  assert.equal(off.ok, true);
  assert.equal(off.value.active, false, 'ohne Vertretung nie aktiv');
  assert.equal(ctx.deputySanitize_({ email: 'a@x.de', from: 'morgen' }, 'me@x.de').value.from, '', 'ungueltiges Datum faellt weg');
});

test('Vertretung: Zeitraum', () => {
  const e = { deputy: 'a@x.de', active: true, from: '2026-10-20', to: '2026-10-31' };
  assert.equal(ctx.deputyIsActive_(e, '2026-10-19'), false);
  assert.equal(ctx.deputyIsActive_(e, '2026-10-20'), true);
  assert.equal(ctx.deputyIsActive_(e, '2026-10-31'), true);
  assert.equal(ctx.deputyIsActive_(e, '2026-11-01'), false);
  assert.equal(ctx.deputyIsActive_({ deputy: 'a@x.de', active: true, from: '', to: '' }, '2030-01-01'), true, 'ohne Datum: solange aktiv');
  assert.equal(ctx.deputyIsActive_(Object.assign({}, e, { active: false }), '2026-10-25'), false);
});

test('Consulting: Formular ablegen ohne Dateiinhalt, Patch, Upload-Payload', () => {
  const files = [{ fileId: 'f1', name: 'flyer.docx', mimeType: 'x', kind: 'main' }, { fileId: 'r1', name: 'ref.pdf', kind: 'ref' }, { fileId: '', name: 'leer' }];
  const p = plain(ctx.consultNormalizePayload_({
    templateGroup: '[MKT] Flyer', templateUid: 'T1', templateName: 'Flyer', targetUidMap: { de_de: 'T1', fr_fr: 'T2' },
    sourceLang: 'en', targetLangs: ['de_de', 'fr_fr'], projectName: ' Flyer Q4 ', dateDue: '2026-11-01T11:00:00.000Z', note: 'n',
    allMainFiles: [{ source: 'pc', data: 'AAAA' }], evil: 1
  }, files));
  assert.equal(p.projectName, 'Flyer Q4');
  assert.equal(p.dueDate, '2026-11-01T11:00:00.000Z');
  assert.equal(p.files.length, 2, 'Dateien ohne ID fallen weg');
  assert.equal(p.evil, undefined);
  assert.equal(JSON.stringify(p).indexOf('AAAA'), -1, 'kein Base64 in der Ablage');
  assert.deepEqual(plain(ctx.consultMissingFields_(p)), []);

  const r = plain(ctx.consultApplyPatch_(p, { projectName: 'Flyer Q4 final', removeFileIds: ['r1'], targetLangs: ['de_de', 'fr_fr'] }));
  assert.deepEqual(r.changed.sort(), ['files', 'projectName']);
  assert.equal(r.payload.files.length, 1);

  const up = plain(ctx.consultBuildUploadPayload_(p));
  assert.equal(up.portalType, 'marketing');
  assert.deepEqual(up.mainFiles, [{ source: 'drive', fileId: 'f1', fileName: 'flyer.docx' }]);
  assert.deepEqual(up.refDriveIds, ['r1']);
  assert.deepEqual(up.targetUidMap, { de_de: 'T1', fr_fr: 'T2' });

  assert.deepEqual(plain(ctx.consultMissingFields_(ctx.consultNormalizePayload_({}, []))), ['template', 'projectName', 'sourceLang', 'targetLangs', 'mainFiles']);
});

test('Vorab-Kalkulation: Gruppen, Async-Status, Woerter, Summe', () => {
  assert.deepEqual(plain(ctx.precalcGroupLangs_('T1', { fr_fr: 'T2' }, ['de_de', 'fr_fr', 'it_it'])), { T1: ['de_de', 'it_it'], T2: ['fr_fr'] });
  assert.equal(ctx.precalcAsyncState_({ asyncResponse: null }), 'running');
  assert.equal(ctx.precalcAsyncState_({ asyncResponse: { dateCreated: 'x' } }), 'ok');
  assert.equal(ctx.precalcAsyncState_({ asyncResponse: { errorCode: 'X', errorDesc: 'kaputt' } }), 'error: kaputt');
  assert.equal(ctx.precalcWordsFromAnalyse_({ analyseLanguageParts: [{ data: { all: { words: 120 } } }, { data: { all: { words: 80 } } }] }), 200);
  assert.deepEqual(plain(ctx.precalcSumQuotes_([{ totalPrice: 10.105, currency: 'EUR' }, { totalPrice: '5', currency: 'EUR' }])), { amount: 15.11, currency: 'EUR', mixedCurrency: false });
  assert.equal(ctx.precalcSumQuotes_([{ totalPrice: 1, currency: 'EUR' }, { totalPrice: 1, currency: 'USD' }]).mixedCurrency, true);
});

test('Maximaltemplate: Bereinigung', () => {
  const s = plain(ctx.maxTplSanitize_({
    baseTemplateUid: 'TPL1', workflowSteps: ['s1', 's2', 'bad id!'], stepDue: { s1: '2026-11-01', s9: '2026-11-02' },
    providers: { s1: { DE_DE: [{ type: 'USER', id: 'u1', name: 'A' }, { type: 'X', id: 'v1' }], 'x y': [{ id: 'u2' }] }, s9: { de_de: [{ id: 'u3' }] } },
    client: '12', tms: [{ uid: 'tm1', write: true, penalty: 150 }, { uid: 'tm2', write: true }], tbs: [{ id: 'tb1', qa: true }],
    tmsOverride: true, prompt: 'Sei freundlich.', extra: 'x'
  }));
  assert.deepEqual(s.workflowSteps, ['s1', 's2']);
  assert.deepEqual(s.stepDue, { s1: '2026-11-01' }, 'nur gewaehlte Schritte');
  assert.deepEqual(s.providers, { s1: { de_de: [{ type: 'USER', id: 'u1', name: 'A' }, { type: 'USER', id: 'v1', name: '' }] } });
  assert.equal(s.tms[0].penalty, 100);
  assert.equal(s.tms[1].write, false, 'nur ein schreibendes TM');
  assert.equal(s.tbs[0].read, true);
  assert.equal(s.extra, undefined);
});

test('Maximaltemplate: applyTemplate-Felder, Provider im Job-Header, TM/TB-Bodies', () => {
  const ms = ctx.maxTplSanitize_({ workflowSteps: ['s1', 's2'], stepDue: { s2: '2026-11-03' }, client: 'c1', businessUnit: 'b1',
    providers: { s1: { de_de: [{ type: 'VENDOR', id: 'v1' }] } } });
  assert.deepEqual(plain(ctx.maxTplApplyTemplateFields_({ name: 'P' }, ms)),
    { name: 'P', workflowSteps: [{ id: 's1' }, { id: 's2' }], client: { id: 'c1' }, businessUnit: { id: 'b1' } });
  const wf = plain(ctx.maxTplJobWorkflowSettings_(ms, ['de_DE', 'fr_fr']));
  assert.deepEqual(wf[0], { id: 's1', assignments: [{ targetLang: 'de_DE', providers: [{ type: 'VENDOR', id: 'v1' }] }] });
  assert.equal(wf[1].id, 's2');
  assert.ok(/^2026-11-03T/.test(wf[1].due));
  assert.deepEqual(plain(ctx.maxTplTmBody_([{ uid: 't', read: true, write: false, penalty: 5 }])),
    { dataPerContext: [{ transMemories: [{ transMemory: { uid: 't' }, readMode: true, writeMode: false, penalty: 5, applyPenaltyTo101Only: false }], orderEnabled: true }] });
  assert.deepEqual(plain(ctx.maxTplTbBody_([{ id: 'a', read: true, write: true, qa: false }, { id: 'b', read: false, write: false, qa: true }])),
    { readTermBases: [{ id: 'a' }], qualityAssuranceTermBases: [{ id: 'b' }], writeTermBase: { id: 'a' } });
});

test('Maximaltemplate: Prompt-Hub', () => {
  const rows = [['Name', 'Prompt', 'Template UIDs', 'Link', 'Active'],
    ['Marketing DE', 'Du bist Texter.', 'T1, T2', 'https://hub/1', 'yes'],
    ['Alt', 'x', 'T1', '', 'no'],
    ['Allgemein', 'Neutral.', '', '', '']];
  const hub = plain(ctx.maxTplParsePromptHub_(rows, 'T2'));
  assert.deepEqual(hub.prompts.map((p) => p.name), ['Marketing DE', 'Allgemein']);
  assert.equal(hub.forTemplate.name, 'Marketing DE');
  assert.equal(ctx.maxTplParsePromptHub_(rows, 'T9').forTemplate, null);
});

test('Meine Projekte: "Projekt **geteilt** von" fett und escaped', () => {
  const b = load(['JsCore.html', 'JsMisc.html', 'JsProjects.html'], browserStubs());
  b.tr_ = (key, fallback) => ({ pl_shared_by: 'Projekt **geteilt** von {name}' })[key] || fallback;
  assert.equal(b.projByLabel_('pl_shared_by', '', 'a<b@x.de'), 'Projekt <b>geteilt</b> von a&lt;b@x.de');
  assert.equal(b.projByLabel_('pl_created_by', 'Project **created** by {name}', 'x@y.de'), 'Project <b>created</b> by x@y.de');
});
