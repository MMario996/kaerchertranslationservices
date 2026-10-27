'use strict';

// Marketing-Erweiterungen: Consulting (MarketingConsulting.gs), Vorab-Kalkulation
// (MarketingPrecalc.gs), Maximaltemplate (MaxTemplate.gs), Urlaubsvertretung
// (Deputies.gs) und die Beschriftung "Projekt erstellt/geteilt von" (JsProjects.html).
const test = require('node:test');
const assert = require('node:assert/strict');
const { load, browserStubs } = require('./lib/load');

const plain = (v) => JSON.parse(JSON.stringify(v));
const ctx = load(['Deputies.gs', 'MarketingConsulting.gs', 'MarketingPrecalc.gs', 'MaxTemplate.gs', 'MaxTemplateAdmin.gs']);

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

test('Consulting: Historie passt in eine Sheet-Zelle, erster Eintrag bleibt', () => {
  const h = [{ action: 'CREATED', text: 'start' }];
  for (let i = 0; i < 40; i++) h.push({ action: 'COMMENT', text: 'x'.repeat(2000) });
  const json = ctx.consultHistoryJson_(h);
  assert.ok(json.length <= 45000);
  const out = JSON.parse(json);
  assert.equal(out[0].text, 'start');
  assert.ok(out.length < h.length);
});

test('Vorab-Kalkulation: Gruppen, Async-Status, Woerter, Summe', () => {
  assert.deepEqual(plain(ctx.precalcParseProjects_('Home & Garden|aB1\n Professional | xY2 | pl9 ; kaputt ; Doppelt|aB1; Leer|')),
    [{ label: 'Home & Garden', projectUid: 'aB1', priceListUid: '', netRateSchemeUid: '' }, { label: 'Professional', projectUid: 'xY2', priceListUid: 'pl9', netRateSchemeUid: '' }]);
  assert.equal(ctx.precalcParseProjects_('A|p1||nrs7')[0].netRateSchemeUid, 'nrs7');
  assert.equal(ctx.precalcJobFileName_('P-1', 'a/b:c.docx'), 'PRECALC-P-1-a_b_c.docx');
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
  assert.deepEqual(s.extra, {}, 'ungueltige weitere Einstellungen verworfen');
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
  // Spalte C darf auch den Vorlagennamen enthalten.
  const byName = [rows[0], ['Flyer', 'Kurz.', 'Flyer DE [en], T7', '', 'yes']];
  assert.equal(ctx.maxTplParsePromptHub_(byName, 'Tx', 'flyer de [en]').forTemplate.name, 'Flyer');
});

test('Maximaltemplate: verknuepfter Prompt (Custom Field der Vorlage oder Prompt-Hub)', () => {
  const prompts = [{ name: 'Marketing DE', prompt: 'Du bist Texter.', link: 'https://hub/1', templateUids: [] }];
  assert.equal(ctx.maxTplLinkedPrompt_('marketing de', 'AI Prompt', prompts, null).prompt, 'Du bist Texter.', 'Name aus dem Hub');
  assert.equal(ctx.maxTplLinkedPrompt_('https://hub/1', 'AI Prompt', prompts, null).name, 'Marketing DE', 'Link aus dem Hub');
  assert.deepEqual(plain(ctx.maxTplLinkedPrompt_('Schreibe locker.', 'AI Prompt', prompts, null)),
    { name: 'AI Prompt', prompt: 'Schreibe locker.', templateUids: [], link: '', source: 'field' });
  assert.equal(ctx.maxTplLinkedPrompt_('https://other/x', 'AI Prompt', prompts, null).link, 'https://other/x');
  assert.equal(ctx.maxTplLinkedPrompt_('', 'AI Prompt', prompts, prompts[0]).source, 'hub');
  assert.equal(ctx.maxTplLinkedPrompt_('', 'AI Prompt', prompts, null), null);
});

test('Maximaltemplate: Vorlagen-Suche (alle Filter von GET projectTemplates)', () => {
  const q = ctx.maxTplTemplatesQuery_({ name: 'GUI 02', clientName: 'Kä', clientId: '12', costCenterId: 'x', ownerUid: 'u-1', createdByUid: 'bad uid',
    domainName: 'Mkt', subDomainName: 'Web', costCenterName: 'CC', businessUnitName: 'BU', sourceLangs: 'en, de', targetLangs: ['de_de', '<x>'],
    createdInLastHours: '24', sort: 'clientName', direction: 'asc', pageNumber: 2, pageSize: 500 });
  assert.equal(q, 'name=GUI%2002&clientName=K%C3%A4&domainName=Mkt&subDomainName=Web&costCenterName=CC&businessUnitName=BU&ownerUid=u-1&clientId=12' +
    '&sourceLangs=en&sourceLangs=de&targetLangs=de_de&createdInLastHours=24&sort=clientName&direction=asc&pageNumber=2&pageSize=50');
  assert.equal(ctx.maxTplTemplatesQuery_({ sort: 'evil' }), 'sort=dateCreated&direction=desc&pageNumber=0&pageSize=50');
  const t = plain(ctx.maxTplMapTemplate_({ uid: 'U1', id: 5, templateName: 'GUI02', sourceLang: 'en', targetLangs: ['de_de'],
    client: { name: 'KAG' }, domain: { name: 'Marketing' }, owner: { firstName: 'A', lastName: 'B', userName: 'ab' }, createdBy: { userName: 'cd' },
    dateCreated: '2026-01-01T00:00:00Z', workflowSteps: [{ workflowStep: { name: 'Translation' } }] }));
  assert.equal(t.name, 'GUI02');
  assert.equal(t.client, 'KAG');
  assert.equal(t.owner, 'A B (ab)');
  assert.equal(t.createdBy, 'cd');
  assert.deepEqual(t.workflowSteps, ['Translation']);
  assert.equal(ctx.maxTplMapTemplate_({}), null);
});

test('Meine Projekte: "Projekt **geteilt** von" fett und escaped', () => {
  const b = load(['JsCore.html', 'JsMisc.html', 'JsProjects.html'], browserStubs());
  b.tr_ = (key, fallback) => ({ pl_shared_by: 'Projekt **geteilt** von {name}' })[key] || fallback;
  assert.equal(b.projByLabel_('pl_shared_by', '', 'a<b@x.de'), 'Projekt <b>geteilt</b> von a&lt;b@x.de');
  assert.equal(b.projByLabel_('pl_created_by', 'Project **created** by {name}', 'x@y.de'), 'Project <b>created</b> by x@y.de');
});

test('Download: nur eingereichte Sprachen, keine abgebrochenen Jobs, nie leer', () => {
  const dl = load(['DownloadZip.gs', 'PivotProjects.gs']);
  const jobs = [
    { uid: '1', targetLang: 'de_DE', status: 'COMPLETED' },
    { uid: '2', targetLang: 'fr_fr', status: 'COMPLETED' },
    { uid: '3', targetLang: 'it-IT', status: 'COMPLETED' },
    { uid: '4', targetLang: 'de_de', status: 'CANCELLED' }
  ];
  assert.deepEqual(plain(dl.dlFilterJobs_(jobs, ['de_de', 'it_it'])).map((j) => j.uid), ['1', '3']);
  assert.deepEqual(plain(dl.dlFilterJobs_(jobs, ['de'])).map((j) => j.uid), ['1'], '"de" passt zu "de_DE"');
  assert.deepEqual(plain(dl.dlFilterJobs_(jobs, [])).map((j) => j.uid), ['1', '2', '3'], 'ohne Sprachen: alle aktiven');
  assert.deepEqual(plain(dl.dlFilterJobs_(jobs, ['ja_jp'])).map((j) => j.uid), ['1', '2', '3'], 'kein Treffer: nicht leer');
  assert.deepEqual(plain(dl.pivotLangsForOptionValues_(['DE', 'fr'], [{ langCode: 'de_de', optionValue: 'DE' }, { langCode: 'fr_fr', optionValue: 'FR' }, { langCode: 'it_it', optionValue: 'IT' }])), ['de_de', 'fr_fr']);
});

test('Sandbox: Cache-Schluessel getrennt je Umgebung', () => {
  const s = load(['Sandbox.gs']);
  assert.equal(s.sandboxCacheKey_('phrase_cf_defs_map', false), 'phrase_cf_defs_map');
  assert.equal(s.sandboxCacheKey_('phrase_cf_defs_map', true), 'sbx_phrase_cf_defs_map');
});

test('Sprachen: Kuerzel ohne Flaggen, in Listen als Kaestchen wie bei Dokumentationsprojekten', () => {
  const b = load(['JsCore.html', 'JsMisc.html', 'JsForms.html'], browserStubs());
  assert.equal(b.langShortCode_('es_es'), 'ES');
  assert.equal(b.langShortCode_('en_gb'), 'EN-GB');
  assert.equal(b.langShortCode_('zh_hans_cn'), 'ZH-CN');
  assert.equal(b.langShort_('es_ES'), 'ES');
  assert.equal(b.langShort_('es_mx'), 'ES-MX');
  assert.equal(b.langsShort_('de_de, en_gb'), 'DE, EN-GB');
  assert.equal(b.getPrettyLangName('es_es'), 'ES · Spanish (Spain)');
  assert.equal(b.tplDisplayLabel_('[ES] Flyer'), 'ES · Flyer');
  assert.equal(b.tplDisplayLabel_('[MKT] Flyer DE>FR'), 'Flyer DE>FR');
  assert.equal(b.tplDisplayLabel_('Marketing Express'), 'Marketing Express', 'normale Woerter bleiben');
  const flags = /[\u{1F1E6}-\u{1F1FF}]/u;
  const html = b.langBadgesHtml_('de_de, fr_fr', 'COMPLETED');
  assert.equal((html.match(/class="doc-job-badge"/g) || []).length, 2, 'ein Kaestchen pro Sprache');
  assert.ok(html.includes('>de_de<') && html.includes('#2e7d32'), 'Sprachcode wie im Sheet, gruen wenn fertig');
  assert.ok(!flags.test(html) && !flags.test(b.getPrettyLangName('de_de')), 'keine Flaggen');
  assert.ok(b.langBadgesHtml_('es', 'ASSIGNED').includes('#b08d00'), 'offen = gelb');
  assert.ok(!b.langBadgesHtml_('x<script>').includes('<script>'), 'escaped');
  assert.equal(b.langBadgesHtml_(''), '-');
});

test('Kalkulationsprojekte: Editor-Zeilen werden sauber gespeichert', () => {
  assert.equal(ctx.precalcProjectsToProperty_([
    { label: 'Home & Garden', projectUid: 'aB1', priceListUid: '' },
    { label: 'Pro|fessional; X', projectUid: 'xY2', priceListUid: 'pl9' },
    { label: '', projectUid: 'leer' },
    { label: 'Doppelt', projectUid: 'aB1' }
  ]), 'Home & Garden|aB1\nPro fessional  X|xY2|pl9');
  assert.equal(ctx.precalcProjectsToProperty_([{ label: 'A', projectUid: 'p1', priceListUid: '', netRateSchemeUid: 'n1' }]), 'A|p1||n1');
});

test('Vorab-Kalkulation: Analyse- und Quote-Body mit Net Rate Scheme und Projekt', () => {
  const a = plain(ctx.precalcAnalyseBody_('P-1', ['j1', 'j2'], { id: '232', uid: 'nU' }));
  assert.deepEqual(a.jobs, [{ uid: 'j1' }, { uid: 'j2' }]);
  assert.deepEqual(a.netRateScheme, { id: '232' });
  assert.equal(plain(ctx.precalcAnalyseBody_('P-1', ['j1'], null)).netRateScheme, undefined);
  assert.deepEqual(plain(ctx.precalcQuoteBody_('P-1', 'proj', 77, 'pl', { id: '232', uid: 'nU' })),
    { name: 'Precalc P-1', project: { uid: 'proj' }, analyse: { id: '77' }, priceList: { uid: 'pl' }, netRateScheme: { uid: 'nU' } });
  assert.equal(plain(ctx.precalcQuoteBody_('P-1', 'proj', 77, 'pl', null)).netRateScheme, undefined);
});

test('Vertretungsgruppen: bereinigen (Name Pflicht, gueltige E-Mails, keine Doppelten)', () => {
  const g = plain(ctx.deputyGroupsSanitize_([
    { name: ' MAT-D OUTDOOR ', members: 'A@k.com, b@k.com\nkaputt; a@k.com' },
    { name: 'MAT-D INDOOR', members: ['c@k.com'] },
    { name: 'mat-d outdoor', members: 'd@k.com' },
    { name: '', members: 'e@k.com' },
    { name: 'Leer', members: '' }
  ]));
  assert.deepEqual(g, [{ name: 'MAT-D OUTDOOR', members: ['a@k.com', 'b@k.com'] }, { name: 'MAT-D INDOOR', members: ['c@k.com'] }]);
});

test('Maximaltemplate-Regeln: Konfiguration wird bereinigt, Felder behalten Typ', () => {
  const cfg = plain(ctx.maxTplSanitizeConfig_({
    lists: { mtSettings: [{ id: 'mt1', name: 'DeepL' }, { id: 'bad id!' }], clients: null, evil: [1], prompts: ['Flyer'] },
    sections: [
      { key: 'qa', label: 'QA', version: 'v1', path: '/projects/{uid}/qaSettings', fields: { 'a.b': { editable: true, type: 'boolean', values: ['true'] }, 'x': { editable: false } } },
      { key: 'bad', path: 'https://evil.example/x' },
      { key: 'qa', path: '/projects/{uid}/dup' }
    ]
  }));
  assert.deepEqual(cfg.lists, { mtSettings: [{ id: 'mt1', name: 'DeepL' }], prompts: [{ id: 'Flyer', name: 'Flyer' }] });
  assert.equal(cfg.sections.length, 1);
  assert.deepEqual(cfg.sections[0].fields, { 'a.b': { editable: true, type: 'boolean', sample: '', label: '', values: ['true'] } });
});

test('Maximaltemplate-Regeln: maxTplFlatten_ und maxTplSetPath_', () => {
  assert.deepEqual(plain(ctx.maxTplFlatten_({ a: true, b: { c: 3, d: null }, e: ['x'], 'bad-key': 1 })), [
    { path: 'a', type: 'boolean', sample: 'true' },
    { path: 'b.c', type: 'number', sample: '3' },
    { path: 'b.d', type: 'string', sample: '' },
    { path: 'e', type: 'json', sample: '["x"]' }
  ]);
  assert.deepEqual(plain(ctx.maxTplSetPath_({ a: { b: 1 } }, 'a.c.d', 'x')), { a: { b: 1, c: { d: 'x' } } });
});

test('Maximaltemplate-Regeln: maxTplEnforceConfig_ entfernt Nicht-Freigegebenes', () => {
  const cfg = ctx.maxTplSanitizeConfig_({
    lists: { mtSettings: [{ id: 'mt1' }], workflowSteps: [{ id: 's1' }], tms: [{ id: 'tm1' }], providers: [{ id: 'u1', type: 'USER' }] },
    sections: [{ key: 'qa', path: '/projects/{uid}/qaSettings', fields: {
      'checks.enabled': { editable: true, type: 'boolean' }, 'level': { editable: true, type: 'string', values: ['low', 'high'] }, 'n': { editable: true, type: 'number' } } }]
  });
  const ms = ctx.maxTplSanitize_({
    workflowSteps: ['s1', 's2'], stepDue: { s2: '2026-11-01' }, mtSettingsUid: 'mt2', client: 'c9',
    providers: { s1: { de_de: [{ type: 'USER', id: 'u1' }, { type: 'VENDOR', id: 'v9' }] } },
    tmsOverride: true, tms: [{ uid: 'tm1' }, { uid: 'tm2' }],
    extra: { qa: { 'checks.enabled': 'false', level: 'medium', n: '5', hidden: 'x' }, other: { a: 1 } }
  });
  const r = plain(ctx.maxTplEnforceConfig_(ms, cfg));
  assert.deepEqual(r.ms.workflowSteps, ['s1']);
  assert.deepEqual(r.ms.stepDue, {});
  assert.equal(r.ms.mtSettingsUid, '');
  assert.equal(r.ms.client, 'c9', 'Clients nicht eingeschraenkt');
  assert.deepEqual(r.ms.providers, { s1: { de_de: [{ type: 'USER', id: 'u1', name: '' }] } });
  assert.deepEqual(r.ms.tms.map((t) => t.uid), ['tm1']);
  assert.deepEqual(r.ms.extra, { qa: { 'checks.enabled': false, n: 5 } });
  assert.deepEqual(r.removed.sort(), ['mtSettingsUid', 'other.a', 'providers', 'qa.hidden', 'qa.level', 'tms', 'workflowSteps'].sort());
});

test('Maximaltemplate-Regeln: Kataloge und Dialog-Konfiguration', () => {
  const cat = { clients: [{ id: 'c1' }, { id: 'c2' }], mtSettings: [{ uid: 'm1' }, { uid: 'm2' }], workflowSteps: [{ id: 's1' }] };
  const f = plain(ctx.maxTplFilterCatalog_(cat, { clients: [{ id: 'c2' }], mtSettings: [] }));
  assert.deepEqual(f.clients, [{ id: 'c2' }]);
  assert.deepEqual(f.mtSettings, []);
  assert.deepEqual(f.workflowSteps, [{ id: 's1' }]);
  const cfg = ctx.maxTplSanitizeConfig_({ sections: [
    { key: 'qa', label: 'QA', path: '/projects/{uid}/qaSettings', fields: { a: { editable: true, type: 'number', sample: '3', label: 'Schwelle' } } },
    { key: 'off', path: '/projects/{uid}/x', enabled: false, fields: { a: { editable: true } } },
    { key: 'empty', path: '/projects/{uid}/y' }
  ] });
  assert.deepEqual(plain(ctx.maxTplDialogConfig_(cfg)).sections, [{ key: 'qa', label: 'QA', fields: [{ path: 'a', label: 'Schwelle', type: 'number', sample: '3', values: [] }] }]);
});
