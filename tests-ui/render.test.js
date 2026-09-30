'use strict';

// Browser-Tests der echten Oberflaeche (Chromium via Playwright): die App
// startet mit gemocktem google.script.run (tools/build-preview.js) und wird
// wie ein Nutzer bedient. Prueft Layout-Regeln, die reine Logik-Tests nicht
// sehen: klebende Kopfzeile, Admin-Kachelraster, Startseite, Debugger.
// Lokal: npm run test:ui
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { buildPreview, lazyParts } = require('../tools/build-preview');

const ME = 'admin@kaercher.com';
const PROJECTS = [
  { projectUid: 'own1', projectName: 'OWN PROJECT', owner: ME, status: 'ASSIGNED', targetLangs: ['de'] },
  { projectUid: 'shared1', projectName: 'SHARED PROJECT', owner: 'colleague@kaercher.com', sharedWith: ME, status: 'ASSIGNED', targetLangs: ['es'] },
  { projectUid: 'x1', projectName: 'FOREIGN PROJECT', owner: 'someone@kaercher.com', status: 'ASSIGNED', targetLangs: ['fr'] }
];

let browser;
let file;
let parts;

test.before(async () => {
  parts = lazyParts();
  file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'kts-ui-')), 'index.html');
  fs.writeFileSync(file, buildPreview());
  browser = await chromium.launch();
});
test.after(async () => { if (browser) await browser.close(); });

// extraMocks: Quelltext eines Objekt-Literals (Funktionen lassen sich nicht
// serialisiert in die Seite reichen).
async function openApp(viewport, extraMocks, opts) {
  const page = await browser.newPage({ viewport: viewport || { width: 1440, height: 800 } });
  if (opts && opts.blockFonts) await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(({ L, me, projects, extra, patch }) => {
    const homeCss = (L.home.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];
    const homeJs = (L.home.match(/<script>([\s\S]*?)<\/script>/) || ['', ''])[1];
    window.__mock = Object.assign({
      apiGetI18nDict: (l) => L.i18n[l] || null,
      apiGetAdminI18n: (l) => ({ lang: l, dict: L.adminI18n[l] || L.adminI18n.en, en: L.adminI18n.en }),
      apiGetConfig: { i18nEn: L.i18n.en, currentUser: me, effectiveUser: me, isAdmin: true, effectiveIsAdmin: true, templates: {}, languages: {}, sizeLimitMb: 100 },
      apiGetHomeUi: { css: homeCss, js: homeJs },
      apiGetMyProjects: { projects: projects, email: me },
      apiGetAdminContent: L.admin,
      apiGetTranslateUiContent: L.translate,
      apiGetLazyScript: (n) => L.lazy[n]
    }, extra ? (0, eval)('(' + extra + ')') : {});
    if (patch) Object.assign(window.__mock.apiGetConfig, patch);
  }, { L: parts, me: ME, projects: PROJECTS, extra: extraMocks || '', patch: (opts && opts.configPatch) || null });
  await page.goto('file://' + file);
  await page.waitForFunction(() => document.querySelector('#homeRoot .h-hero'), null, { timeout: 15000 });
  return { page, errors };
}

async function openAdmin(page, group) {
  await page.evaluate(() => switchTab('admin'));
  await page.waitForFunction(() => document.getElementById('adminGridContainer'));
  if (group) await page.evaluate((g) => switchConsoleGroup(g), group);
}

test('App startet ohne JavaScript-Fehler', async () => {
  const { page, errors } = await openApp();
  await openAdmin(page, 'system');
  await page.waitForTimeout(300);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Startseite zeigt nur eigene und geteilte Projekte - auch fuer Admins', async () => {
  const { page } = await openApp();
  const text = await page.locator('#homeRoot').innerText();
  assert.match(text, /OWN PROJECT/);
  assert.match(text, /SHARED PROJECT/);
  assert.doesNotMatch(text, /FOREIGN PROJECT/);
  await page.close();
});

test('Kein gelber Farbschleier im Seitenhintergrund und im Startbereich', async () => {
  const { page } = await openApp();
  const bg = await page.evaluate(() => ({
    body: getComputedStyle(document.body).backgroundImage,
    hero: getComputedStyle(document.querySelector('#homeRoot .h-hero')).backgroundImage
  }));
  assert.equal(bg.body, 'none');
  assert.equal(bg.hero, 'none');
  await page.close();
});

for (const vp of [{ width: 1440, height: 800 }, { width: 390, height: 780 }]) {
  test(`Kopfzeile klebt randlos oben, kein Inhalt scheint durch (${vp.width}px)`, async () => {
    const { page } = await openApp(vp);
    await openAdmin(page, 'system');
    const box = await page.evaluate(() => {
      const nav = document.getElementById('mainTabNav');
      const c = nav.parentElement;
      c.scrollTop = 500;
      const n = nav.getBoundingClientRect();
      const r = c.getBoundingClientRect();
      const bg = getComputedStyle(nav).backgroundColor;
      return { scrolled: c.scrollTop, navTop: n.top, navLeft: n.left, navRight: n.right, cTop: r.top, cLeft: r.left, cRight: r.left + c.clientWidth, bg, stuck: nav.classList.contains('is-stuck') };
    });
    assert.ok(box.scrolled > 0, 'Inhalt ist scrollbar');
    assert.ok(Math.abs(box.navTop - box.cTop) <= 1, `Leiste bündig oben (${box.navTop} vs ${box.cTop})`);
    assert.ok(box.navLeft <= box.cLeft + 1 && box.navRight >= box.cRight - 1, 'Leiste deckt die volle Breite');
    assert.notEqual(box.bg, 'rgba(0, 0, 0, 0)', 'Leiste hat einen deckenden Hintergrund');
    await page.waitForFunction(() => document.getElementById('mainTabNav').classList.contains('is-stuck'));
    await page.close();
  });
}

for (const width of [1440, 1000]) {
  test(`Admin-Kacheln: jede Reihe ist voll belegt (${width}px)`, async () => {
    const { page } = await openApp({ width, height: 900 });
    await openAdmin(page);
    for (const g of ['access', 'system', 'comms', 'logs']) {
      const rows = await page.evaluate((grp) => {
        switchConsoleGroup(grp);
        const grid = document.getElementById('adminGridContainer');
        const gr = grid.getBoundingClientRect();
        const byRow = {};
        Array.from(grid.children).filter((c) => c.offsetParent !== null).forEach((c) => {
          const r = c.getBoundingClientRect();
          const k = Math.round(r.top);
          (byRow[k] = byRow[k] || []).push({ left: r.left, right: r.right });
        });
        return Object.values(byRow).map((cells) => ({
          left: Math.min(...cells.map((x) => x.left)) - gr.left,
          right: gr.right - Math.max(...cells.map((x) => x.right))
        }));
      }, g);
      assert.ok(rows.length > 0, g + ': Kacheln sichtbar');
      rows.forEach((r, i) => assert.ok(r.left < 2 && r.right < 2, `${g}: Reihe ${i + 1} nicht voll (${JSON.stringify(r)})`));
      const overflow = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('#adminGridContainer > .card').forEach((card) => {
          if (card.offsetParent === null) return;
          const cr = card.getBoundingClientRect();
          card.querySelectorAll('button, .btn, input, select').forEach((el) => {
            if (el.offsetParent === null || el.closest('[style*="overflow"], .acc-table-wrap, table')) return;
            const r = el.getBoundingClientRect();
            if (r.right > cr.right + 1) out.push((el.textContent || el.id || el.tagName).trim().slice(0, 30));
          });
        });
        return out;
      });
      assert.deepEqual(overflow, [], g + ': Elemente ragen aus der Kachel');
    }
    await page.close();
  });
}

test('User Template Debugger zeigt Ergebnis und Fehler an', async () => {
  const { page, errors } = await openApp(null, `{
    apiDebugUserTemplates: (email) => email === 'fail@kaercher.com'
      ? { success: false, error: 'Template sheet not found' }
      : { success: true, email, userFound: true, userData: { client: 'KAG', domain: 'Marketing', subdomain: 'Web', businessUnit: 'PC' },
          allowed: [{ name: 'Tpl OK' }], denied: [{ name: 'Tpl <b>X</b>', reasons: ['Domain fehlt am Template'] }],
          suggestions: [{ field: 'Subdomain', value: 'Print', unlocks: 3, templates: ['A', 'B', 'C'] }] },
    apiDebugListUsers: ['a@kaercher.com', 'b@kaercher.com']
  }`);
  await openAdmin(page, 'logs');
  await page.fill('#debugEmail', 'user@kaercher.com');
  await page.evaluate(() => runUserTemplatesDebug());
  await page.waitForFunction(() => /Tpl OK/.test(document.getElementById('debugResultContainer').innerText));
  const out = await page.locator('#debugResultContainer').innerText();
  assert.match(out, /BU: PC/);
  assert.match(out, /Tpl <b>X<\/b>/, 'Namen werden escaped');
  assert.match(out, /Domain fehlt am Template/);
  assert.match(await page.locator('#debugSuggestions').innerText(), /Print[\s\S]*3/);
  await page.focus('#debugEmail');
  await page.waitForFunction(() => document.querySelectorAll('#debugEmailList option').length === 2);
  await page.fill('#debugEmail', 'fail@kaercher.com');
  await page.evaluate(() => runUserTemplatesDebug());
  await page.waitForFunction(() => /Template sheet not found/.test(document.getElementById('debugResultContainer').innerText));
  assert.deepEqual(errors, []);
  await page.close();
});

test('Knowledge Base: Produkte, Navigation, Volltextsuche, Artikel mit Markierung, mobil ohne Scrollen', async () => {
  const root = path.join(__dirname, '..');
  const kbFile = path.join(path.dirname(file), 'kb.html');
  fs.writeFileSync(kbFile, fs.readFileSync(path.join(root, 'Knowledgebase.html'), 'utf8'));
  const chunks = {};
  fs.readdirSync(root).filter((f) => /^KbData\d+\.html$/.test(f)).forEach((f) => { chunks[f.match(/\d+/)[0]] = fs.readFileSync(path.join(root, f), 'utf8'); });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/^https?:/, (r) => r.abort()); // Bilder von support.phrase.com nicht laden
  await page.addInitScript((C) => {
    window.__kbCalls = [];
    function runner() {
      let ok = null, fail = null;
      const p = new Proxy({}, { get: (t, k) => {
        if (k === 'withSuccessHandler') return (h) => { ok = h; return p; };
        if (k === 'withFailureHandler') return (h) => { fail = h; return p; };
        return (n) => { window.__kbCalls.push(n); setTimeout(() => (C[n] ? ok(C[n]) : fail(new Error('no chunk'))), 5); };
      } });
      return p;
    }
    window.google = { script: { run: new Proxy({}, { get: (t, k) => runner()[k] }) } };
  }, chunks);
  await page.goto('file://' + kbFile);
  const man = await page.evaluate(() => JSON.parse(document.getElementById('kbManifest').textContent));
  assert.equal(await page.locator('#prodGrid .pcard').count(), man.products.length, 'eine Karte je Produkt');
  assert.equal(await page.locator('#nav details.prod').count(), man.products.length);
  // Volltext: alle Pakete geladen, Suche nach einem Begriff aus dem Artikeltext (nicht nur Titel)
  await page.waitForFunction(() => document.getElementById('status').classList.contains('ready'), null, { timeout: 20000 });
  assert.equal(await page.evaluate(() => new Set(window.__kbCalls).size), man.chunks, 'jedes Paket einmal geladen');
  await page.fill('#q', 'Video localization hours');
  await page.waitForFunction(() => document.querySelectorAll('#results .res').length > 0);
  assert.match(await page.locator('#results .res').first().innerText(), /Video Localization Hours/);
  await page.fill('#q', 'runtime-data zzzz-nichts');
  await page.waitForFunction(() => /Keine Treffer|No results/.test(document.getElementById('main').innerText));
  await page.fill('#q', 'MTU consumption limits');
  await page.waitForFunction(() => document.querySelectorAll('#results .res').length > 0);
  await page.press('#q', 'Enter');
  await page.waitForFunction(() => document.querySelector('#content mark'));
  assert.match(await page.locator('article.doc h1').innerText(), /Phrase Portal/);
  assert.ok(await page.locator('#content .callout').count() > 0, 'Hinweisboxen gerendert');
  // Interner Link auf einen anderen Artikel oeffnet ihn in der Knowledge Base
  const internal = await page.locator('#content a[data-kb]').first().getAttribute('href');
  await page.evaluate((h) => { location.hash = h; }, internal);
  await page.waitForFunction((id) => document.querySelector('#nav a.active') && document.querySelector('#nav a.active').dataset.id === id, internal.split('/')[2]);
  // Produktfilter
  await page.click('#chips .chip[data-p="Phrase-Studio"]');
  assert.equal(await page.locator('#nav details.prod').count(), 1);
  await page.click('#chips .chip[data-p=""]');
  await page.setViewportSize({ width: 390, height: 780 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  assert.ok(overflow <= 1, 'kein horizontales Scrollen auf dem Handy (' + overflow + 'px)');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Translate UI: Laden aus Phrase zeigt Ergebnis, Abdeckung und Nacht-Abgleich', async () => {
  const { page, errors } = await openApp(null, `{
    apiPsGetConfig: { project: 'P1', region: 'eu', hasToken: true, langs: ['de', 'en'], counts: { app: { de: 3, en: 3 }, admin: { de: 1, en: 1 } }, nightly: true, lastPull: '' },
    apiPsCoverage: { app: { de: { total: 3, missing: 1, sample: ['only_en'], overrides: 0 }, en: { total: 3, missing: 0, sample: [], overrides: 0 } },
                     admin: { de: { total: 1, missing: 0, sample: [], overrides: 0 }, en: { total: 1, missing: 0, sample: [], overrides: 0 } } },
    apiPsPull: (sel) => ({ projectName: 'P1', results: [
      { lang: 'de', dict: 'app', state: 'success', received: 3, overrides: 2, rejectedCount: 1, rejected: [{ key: 'count', reason: 'Platzhalter <x>' }] },
      { lang: 'en', dict: 'app', state: 'no-locale' }] })
  }`);
  await openAdmin(page);
  await page.evaluate(() => switchAdminSubtab('translate'));
  await page.waitForFunction(() => document.querySelector('#psCoverage table'));
  assert.equal(await page.isChecked('#psNightly'), true);
  assert.match(await page.locator('#psCoverage').innerText(), /1/);
  await page.click('#psPullBtn');
  await page.waitForFunction(() => document.querySelector('#psPullResults table'));
  const txt = await page.locator('#psPullResults').innerText();
  assert.match(txt, /DE/);
  assert.match(await page.locator('#psPullStatus').innerText(), /2/);
  const calls = await page.evaluate(() => __calls.filter((c) => c.fn === 'apiPsPull').map((c) => c.args[0]));
  assert.deepEqual(calls[0], { dicts: ['app', 'admin'], langs: ['de', 'en'] });
  assert.equal(await page.locator('#psPullResults details div').innerHTML(), 'count: Platzhalter &lt;x&gt;', 'Gruende escaped');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Icon-Schrift blockiert: keine Icon-Namen als Text sichtbar', async () => {
  const { page, errors } = await openApp({ width: 1440, height: 800 }, null, { blockFonts: true });
  await page.waitForFunction(() => document.documentElement.classList.contains('no-icon-font'), null, { timeout: 15000 });
  await openAdmin(page, 'system');
  await page.waitForTimeout(300);
  const words = await page.evaluate(() => Array.from(document.querySelectorAll('.material-icons-outlined, .material-icons'))
    .filter((el) => el.offsetParent !== null && /^[a-z0-9_]{3,}$/.test(el.textContent.trim()))
    .map((el) => el.textContent.trim()));
  assert.deepEqual(words, []);
  const close = await page.evaluate(() => { const s = document.createElement('span'); s.className = 'material-icons-outlined'; s.textContent = 'close'; document.body.appendChild(s); return new Promise((r) => setTimeout(() => r(s.textContent), 100)); });
  assert.equal(close, '\u2715', 'spaeter eingefuegte Icons werden ebenfalls ersetzt');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Campus-Skript wird erst beim Oeffnen des Reiters geladen', async () => {
  const { page, errors } = await openApp(null, null, { configPatch: { isAdmin: false, effectiveIsAdmin: false, isArticulate: false } });
  assert.equal(await page.evaluate(() => typeof switchArtSubtab), 'undefined', 'nicht im Startdokument');
  await page.evaluate(() => { document.getElementById('btn-nav-articulate').style.display = ''; switchTab('articulate'); });
  await page.waitForFunction(() => typeof switchArtSubtab === 'function');
  const loads = await page.evaluate(() => __calls.filter((c) => c.fn === 'apiGetLazyScript').length);
  assert.equal(loads, 1);
  await page.evaluate(() => { switchTab('home'); switchTab('articulate'); });
  assert.equal(await page.evaluate(() => __calls.filter((c) => c.fn === 'apiGetLazyScript').length), 1, 'nur einmal geladen');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Protokoll: eine Liste mit Kategorien, Nachrichten-Filter, Fehler rot, Suche', async () => {
  const { page, errors } = await openApp(null, `{
    apiGetUnifiedLog: { success: true, warnings: [], counts: { all: 3, projects: 1, messages: 2, access: 0, system: 0, error: 1 }, entries: [
      { t: '2026-09-30T10:00:00.000Z', user: 'anna@kaercher.com', action: 'CHAT_SENT', details: 'Project submitted', category: 'messages', level: 'ok' },
      { t: '2026-09-30T09:00:00.000Z', user: 'ben@kaercher.com', action: 'CHAT_FAILED', details: 'Hi | Kein Direktchat', category: 'messages', level: 'error' },
      { t: '2026-09-30T08:00:00.000Z', user: 'anna@kaercher.com', action: 'PROJECT_CREATE', details: 'Flyer', category: 'projects', level: 'ok' } ] }
  }`);
  await openAdmin(page, 'logs');
  await page.waitForFunction(() => document.querySelectorAll('#unifiedLogContainer tbody tr').length === 3);
  assert.equal(await page.locator('#auditLogContainer').count(), 0, 'altes Aktivitaetsprotokoll entfernt');
  await page.evaluate(() => setUnifiedLogCat_('messages'));
  assert.equal(await page.locator('#unifiedLogContainer tbody tr').count(), 2);
  assert.equal(await page.locator('#unifiedLogContainer tr.lvl-error').count(), 1);
  await page.fill('#logSearch', 'direktchat');
  await page.waitForFunction(() => document.querySelectorAll('#unifiedLogContainer tbody tr').length === 1);
  await page.evaluate(() => toggleUnifiedLogFull_());
  assert.equal(await page.evaluate(() => getComputedStyle(document.getElementById('logCard')).position), 'fixed');
  assert.deepEqual(errors, []);
  await page.close();
});

const MGR_MOCKS = `{
  apiGetUsersForManager: { success: true, rows: [
    { username: 'anna', firstName: 'Anna', lastName: 'A', email: 'anna@kaercher.com', role: 'SUBMITTER', status: 'ACTIVE', clients: 'KAG', domains: 'Marketing', subdomains: 'Web', businessUnit: 'PC' },
    { username: 'ben', firstName: 'Ben', lastName: 'B', email: 'ben@kaercher.com', role: 'SUBMITTER', status: 'ACTIVE', clients: '', domains: '', subdomains: '', businessUnit: '' },
    { username: 'cara', firstName: 'Cara', lastName: 'C', email: 'cara@kaercher.com', role: 'GUEST', status: 'INACTIVE', clients: 'KAG', domains: 'Marketing', subdomains: 'Web', businessUnit: 'PC' } ] },
  apiGetUserManagerInsights: { success: true, canEditAccess: true, templateTotal: 4, byEmail: {
    'anna@kaercher.com': { areas: ['general', 'marketing'], chat: { on: true, linked: true }, projects: { total: 3, open: 1, last: '2026-09-01' }, visibleTemplates: 2 },
    'ben@kaercher.com': { areas: [], chat: { on: false, linked: false }, projects: { total: 0, open: 0, last: '' }, visibleTemplates: 0 },
    'cara@kaercher.com': { areas: ['general'], chat: { on: false, linked: true }, projects: { total: 0, open: 0, last: '' }, visibleTemplates: 2 } } },
  apiBulkUpdateUserField: (names, field, value, mode) => ({ success: true, changed: names.map((n) => ({ username: n, value: 'PC, HC' })) }),
  apiGetUserDetail: (email) => ({ success: true, email, user: { username: 'anna', firstName: 'Anna', lastName: 'A', role: 'SUBMITTER', status: 'ACTIVE', clients: 'KAG' },
    areas: ['general'], chat: { on: true, linked: true }, templates: { allowed: ['Flyer [en]'], total: 4, suggestions: [{ field: 'Subdomain', value: 'Print', unlocks: 2 }] },
    projects: [{ uid: 'P1', name: 'Flyer 2026', status: 'NEW', ts: '2026-09-01', own: true }], activity: [{ t: '2026-09-01T10:00:00Z', action: 'CHAT_SENT', details: 'Project submitted', level: 'ok' }] }),
  apiGetTemplatesForManager: { success: true, rows: [
    { uid: 'T1', displayName: 'Flyer', phraseName: 'MKT Flyer', sourceLang: 'en', targetLangs: 'de_de', client: 'KAG', domain: 'Marketing', subDomain: 'Web', businessUnit: 'PC', active: true },
    { uid: 'T2', displayName: 'Orphan', phraseName: 'X', sourceLang: 'en', targetLangs: 'fr_fr', client: 'KAG', domain: '', subDomain: 'Web', businessUnit: 'PC', active: false } ] },
  apiGetTemplateManagerInsights: { success: true, userTotal: 3, byUid: {
    T1: { visibleUsers: 2, missing: [], usage: { count: 5, last: '2026-09-20' }, watchers: ['boss@kaercher.com'], pivot: 'parent' },
    T2: { visibleUsers: 0, missing: ['Domain'], usage: { count: 0, last: '' }, watchers: [], pivot: '' } } },
  apiBatchSetTemplateActive: { success: true, changed: 2 },
  apiGetTemplateDetail: (uid) => ({ success: true, template: { uid, displayName: 'Orphan', phraseName: 'X', active: false, client: 'KAG', domain: '', subDomain: 'Web', businessUnit: 'PC' },
    missing: ['Domain'], visibleUsers: [], projects: [] }),
  apiSetTemplateDisplayName: (uid, name) => ({ success: true, displayName: name })
}`;

test('User Manager: Kennzahlen-Filter, Mehrfachbearbeitung und Detailansicht', async () => {
  const { page, errors } = await openApp(null, MGR_MOCKS);
  await openAdmin(page);
  await page.evaluate(() => switchAdminSubtab('users'));
  await page.waitForFunction(() => /2 templ/i.test(document.querySelector('#userMgrTable tbody').innerText));
  assert.match(await page.locator('#umxBar').innerText(), /3/);
  await page.evaluate(() => umxSetQuick_('noaccess'));
  assert.equal(await page.locator('#userMgrTable tbody tr[data-username]').count(), 1, 'nur Ben ohne Zugriff');
  await page.evaluate(() => umxSetQuick_(''));
  await page.locator('#userMgrTable tbody tr[data-username="anna"] input[type=checkbox]').first().check();
  await page.locator('#userMgrTable tbody tr[data-username="cara"] input[type=checkbox]').first().check();
  await page.waitForFunction(() => document.getElementById('umxBatch').classList.contains('on'));
  await page.selectOption('#umxField', 'businessUnit');
  await page.selectOption('#umxMode', 'add');
  await page.fill('#umxValue', 'HC');
  await page.evaluate(() => umxApplyBulk_());
  await page.click('#customDialogConfirmBtn');
  await page.waitForFunction(() => __calls.some((c) => c.fn === 'apiBulkUpdateUserField'));
  const call = await page.evaluate(() => __calls.find((c) => c.fn === 'apiBulkUpdateUserField').args);
  assert.deepEqual(call, [['anna', 'cara'], 'businessUnit', 'HC', 'add']);
  await page.evaluate(() => umxOpenDetail_('anna@kaercher.com'));
  await page.waitForFunction(() => /Flyer 2026/.test(document.getElementById('mgrxPanel').innerText));
  assert.match(await page.locator('#mgrxPanel').innerText(), /Print/);
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(() => document.getElementById('mgrxDrawer').classList.contains('open')), false);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Template Manager: unsichtbare Templates finden, Mehrfach-Aktivieren, Anzeigename', async () => {
  const { page, errors } = await openApp(null, MGR_MOCKS);
  await openAdmin(page);
  await page.evaluate(() => switchAdminSubtab('templates'));
  await page.waitForFunction(() => /0 Nutzer|0 users/.test(document.querySelector('#tmplMgrTable tbody').innerText));
  await page.evaluate(() => tmxSetQuick_('nobody'));
  assert.equal(await page.locator('#tmplMgrTable tbody tr').count(), 1);
  assert.match(await page.locator('#tmplMgrTable tbody').innerText(), /Orphan/);
  await page.evaluate(() => tmxSetQuick_(''));
  await page.evaluate(() => { tmplMgrToggleOne('T1', true); tmplMgrToggleOne('T2', true); batchSetTemplateActive(true); });
  await page.click('#customDialogConfirmBtn');
  await page.waitForFunction(() => __calls.some((c) => c.fn === 'apiBatchSetTemplateActive'));
  assert.deepEqual(await page.evaluate(() => __calls.find((c) => c.fn === 'apiBatchSetTemplateActive').args), [['T1', 'T2'], true]);
  await page.evaluate(() => tmxOpenDetail_('T2'));
  await page.waitForFunction(() => document.getElementById('tmxName'));
  await page.fill('#tmxName', 'Orphan (neu)');
  await page.evaluate(() => tmxSaveName_('T2'));
  await page.waitForFunction(() => /Orphan \(neu\)/.test(document.querySelector('#tmplMgrTable tbody').innerText));
  assert.deepEqual(errors, []);
  await page.close();
});

test('Knowledge Base in Apps Script: Links bleiben in der Seite (kein Sprung ins leere Sandbox-Fenster)', async () => {
  const root = path.join(__dirname, '..');
  const kbFile = path.join(path.dirname(file), 'kb2.html');
  fs.writeFileSync(kbFile, fs.readFileSync(path.join(root, 'Knowledgebase.html'), 'utf8'));
  const chunks = {};
  fs.readdirSync(root).filter((f) => /^KbData\d+\.html$/.test(f)).forEach((f) => { chunks[f.match(/\d+/)[0]] = fs.readFileSync(path.join(root, f), 'utf8'); });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/^https?:/, (r) => r.abort());
  await page.addInitScript((C) => {
    window.__pushes = [];
    function runner() {
      let ok = null;
      const p = new Proxy({}, { get: (t, k) => {
        if (k === 'withSuccessHandler') return (h) => { ok = h; return p; };
        if (k === 'withFailureHandler') return () => p;
        return (n) => setTimeout(() => ok(C[n]), 5);
      } });
      return p;
    }
    window.google = { script: {
      run: new Proxy({}, { get: (t, k) => runner()[k] }),
      history: { push: (s, q, h) => window.__pushes.push(h), replace: () => {}, setChangeHandler: (f) => { window.__histHandler = f; } },
      url: { getLocation: (cb) => setTimeout(() => cb({ hash: '/a/22916939527196', parameter: { page: 'kb' } }), 0) }
    } };
  }, chunks);
  await page.goto('file://' + kbFile);
  const startUrl = page.url();
  await page.waitForFunction(() => /Video Localization Hours/.test((document.querySelector('article.doc h1') || {}).textContent || ''), null, { timeout: 15000 });
  assert.equal(await page.locator('base').count(), 0, 'kein <base target=_top>');
  await page.click('#nav a[data-id="21177186715420"]');
  await page.waitForFunction(() => /Audio Transcription/.test((document.querySelector('article.doc h1') || {}).textContent || ''));
  assert.equal(page.url(), startUrl, 'Seite nicht verlassen');
  assert.deepEqual(await page.evaluate(() => window.__pushes), ['/a/21177186715420']);
  await page.evaluate(() => window.__histHandler({ state: { h: '#/a/22916939527196' } }));
  await page.waitForFunction(() => /Video Localization Hours/.test((document.querySelector('article.doc h1') || {}).textContent || ''));
  assert.deepEqual(errors, []);
  await page.close();
});
