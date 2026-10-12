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

test('KeC Projects: Unterreiter Einstellungen - Namenszusatz, gesperrte Excel-Spalten, Puffer', async () => {
  const { page, errors } = await openApp(null, `{
    apiGetKecUserSettings: { success: true,
      settings: { nameParts: [], nameSep: ' - ', namePos: 'suffix', bufferHours: 2,
        xlsx: { enabled: false, sourceColumn: 'A', targetColumns: {}, contextColumn: '', startRow: 2 } },
      options: { nameParts: ['date', 'time', 'owner', 'creator', 'source', 'targets', 'template'], nameSeps: [' - ', '_', ' '], bufferHours: [2, 4, 8, 24, 48] } },
    apiSaveKecUserSettings: (s) => ({ success: true, settings: s })
  }`);
  await page.evaluate(() => { switchTab('kec'); switchKecSubtab('_kec', 'settings'); });
  await page.waitForFunction(() => document.getElementById('kecSetPreview'));
  const root = page.locator('#kecsub-settings_kec');
  assert.ok(await page.locator('#kecsub-import_kec').isHidden(), 'Import ausgeblendet');
  // Namenszusatz: Datum + Owner, Owner nach oben schieben
  await root.locator('.kecset-part', { hasText: /current date|datum/i }).locator('input').check();
  await root.locator('.kecset-part', { hasText: /owner/i }).locator('input').check();
  await root.locator('.kecset-part', { hasText: /owner/i }).locator('button').first().click();
  assert.match(await page.locator('#kecSetPreview').innerText(), / - Max Mustermann - \d{4}-\d\d-\d\d$/);
  // Excel-Bereich ist gesperrt, Entsperren braucht Bestaetigung
  assert.ok(await root.locator('input[placeholder="A"]').isDisabled(), 'gesperrt');
  await root.getByRole('button', { name: /Unlock|Entsperren/ }).click();
  await page.click('#customDialogConfirmBtn');
  await root.locator('input[type=checkbox]').last().check();
  await root.locator('[data-tc-lang="0"]').fill('de_de');
  await root.locator('[data-tc-col="0"]').fill('b');
  await root.locator('input[type=number]').fill('3');
  await root.locator('select').last().selectOption('8');
  await root.getByRole('button', { name: /Save settings|Einstellungen speichern/ }).click();
  // Aenderung an den Excel-Spalten muss bestaetigt werden
  await page.waitForFunction(() => document.getElementById('customDialogOverlay').style.display === 'flex');
  assert.match(await page.locator('#customDialogMessage').innerText(), /row: 2 → 3[\s\S]*de_de: - → B/);
  await page.click('#customDialogConfirmBtn');
  await page.waitForFunction(() => window.__calls.some((c) => c.fn === 'apiSaveKecUserSettings'));
  const saved = await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiSaveKecUserSettings').args[0]);
  assert.deepEqual(saved.nameParts, ['owner', 'date']);
  assert.deepEqual(saved.xlsx, { enabled: true, sourceColumn: 'A', targetColumns: { de_de: 'B' }, contextColumn: '', startRow: 3 });
  assert.equal(saved.bufferHours, 8);
  // Nach dem Speichern ist der Excel-Bereich wieder gesperrt
  await page.waitForFunction(() => !kecSet_.unlocked && kecSet_.saved.bufferHours === 8);
  assert.ok(await root.locator('input[placeholder="A"]').isDisabled(), 'wieder gesperrt');
  // Hinweis am Projektnamen im Import-Formular
  await page.evaluate(() => switchKecSubtab('_kec', 'import'));
  await page.fill('#projectName_kec', 'Flyer');
  assert.match(await page.locator('#kecNameHint_kec').innerText(), /Flyer - Max Mustermann - \d{4}-/);
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
  assert.equal(await page.locator('#prodGrid .h-tile').count(), man.products.length, 'eine Kachel je Produkt');
  assert.equal(await page.locator('#tabs .tab-btn[data-p]').count(), man.products.length, 'ein Reiter je Produkt');
  assert.ok(await page.locator('#tabs .tab-btn[data-p="Phrase-TMS"]').count() === 1, 'TMS-Reiter vorhanden');
  // Volltext: alle Pakete geladen, Suche nach einem Begriff aus dem Artikeltext (nicht nur Titel)
  await page.waitForFunction(() => document.getElementById('status').classList.contains('ready'), null, { timeout: 20000 });
  assert.equal(await page.evaluate(() => new Set(window.__kbCalls).size), man.chunks, 'jedes Paket einmal geladen');
  await page.fill('#q', 'Video localization hours');
  await page.waitForFunction(() => document.querySelectorAll('#results .res').length > 0);
  assert.match(await page.locator('#results .res').first().innerText(), /Video Localization Hours/);
  await page.fill('#q', 'runtime-data zzzz-nichts');
  await page.waitForFunction(() => /Keine Treffer|No results/.test(document.getElementById('view').innerText));
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
  // Produkt-Reiter
  await page.click('#tabs .tab-btn[data-p="Phrase-Studio"]');
  await page.waitForFunction(() => /Studio/.test((document.querySelector('#nav .section-title') || {}).textContent || ''));
  assert.match(await page.locator('#tabs .tab-btn.active').innerText(), /STUDIO/i);
  await page.click('#tabs .tab-btn[data-go="#/"]');
  await page.waitForFunction(() => document.getElementById('prodGrid'));
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

// --- Marketing-Erweiterungen ---------------------------------------------------
const MKT_CONFIG = {
  precalcEnabled: true, maxTemplatePortals: ['marketing'], maxTemplateName: 'Maximaltemplate',
  templates: { 'Flyer [en]': { uid: 'T1', source: 'en', targets: ['de_de', 'fr_fr'], targetUidMap: { de_de: 'T1', fr_fr: 'T1' } } },
  languages: { en: 'en', de_de: 'de_de', fr_fr: 'fr_fr', it_it: 'it_it' }
};

test('Marketing: Ask for Consulting schickt Formular + Kommentar, Consultant sieht Historie und reicht ein', async () => {
  const { page, errors } = await openApp(null, `{
    apiConsultingCreate: (p, c) => ({ success: true, id: 'C-1' }),
    apiConsultingList: { success: true, isConsultant: true, requests: [
      { id: 'C-1', createdAt: '2026-10-12T08:00:00Z', requester: 'req@kaercher.com', status: 'OPEN', assignee: '', projectName: 'Flyer Q4', templateName: 'Flyer', targetLangs: ['de_de'], files: 1, projectUids: [] }] },
    apiConsultingGet: { success: true, isConsultant: true, canEdit: true, canWithdraw: false,
      templates: { 'Flyer [en]': { uid: 'T1', source: 'en', targets: ['de_de', 'fr_fr'], targetUidMap: { de_de: 'T1', fr_fr: 'T1' } } },
      request: { id: 'C-1', createdAt: '2026-10-12T08:00:00Z', requester: 'req@kaercher.com', status: 'OPEN', assignee: '', missing: [], projectUids: [],
        payload: { templateGroup: 'Flyer', templateUid: 'T1', templateName: 'Flyer', sourceLang: 'en', targetLangs: ['de_de'], targetUidMap: { de_de: 'T1' }, projectName: 'Flyer Q4', note: '',
          files: [{ fileId: 'F1', name: 'flyer.docx', kind: 'main' }] },
        history: [{ at: '2026-10-12T08:00:00Z', by: 'req@kaercher.com', action: 'CREATED', text: 'Budget unklar' }] } },
    apiConsultingSubmit: (id, patch) => ({ success: true, projectUid: 'P1', allProjectUids: ['P1'], createdProjects: 1, errors: [] })
  }`, { configPatch: MKT_CONFIG });
  await page.evaluate(() => { switchTab('marketing'); });
  assert.ok(await page.locator('#mktSubNav').isVisible(), 'Unterreiter sichtbar');
  assert.ok(await page.locator('#mktsubBtn-precalc').isVisible(), 'Vorab-Kalkulation sichtbar');
  await page.fill('#projectName_marketing', 'Flyer Q4');
  await page.click('#consultBtn_marketing');
  await page.waitForSelector('#mktConsultComment');
  await page.fill('#mktConsultComment', 'Budget unklar');
  await page.click('.mkt-box [data-act=send]');
  await page.waitForFunction(() => window.__calls.some((c) => c.fn === 'apiConsultingCreate'));
  const call = await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiConsultingCreate').args);
  assert.equal(call[0].projectName, 'Flyer Q4');
  assert.equal(call[1], 'Budget unklar');
  await page.waitForFunction(() => document.getElementById('customDialogOverlay').style.display === 'flex');
  await page.click('#customDialogConfirmBtn');

  await page.evaluate(() => switchMktSubtab('consulting'));
  await page.waitForSelector('#mktConsList .mkt-item');
  await page.click('#mktConsList .mkt-item');
  await page.waitForSelector('#mktCdName');
  assert.match(await page.locator('#mktConsDetail').innerText(), /Budget unklar/);
  await page.locator('#mktCdTargets input[value=fr_fr]').check();
  await page.getByRole('button', { name: /Submit project|Projekt einreichen/ }).click();
  await page.click('#customDialogConfirmBtn');
  await page.waitForFunction(() => window.__calls.some((c) => c.fn === 'apiConsultingSubmit'));
  const sub = await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiConsultingSubmit').args);
  assert.equal(sub[0], 'C-1');
  assert.deepEqual(sub[1].targetLangs, ['de_de', 'fr_fr']);
  assert.deepEqual(sub[1].targetUidMap, { de_de: 'T1', fr_fr: 'T1' });
  assert.deepEqual(errors, []);
  await page.close();
});

test('Marketing: Vorab-Kalkulation zeigt den Betrag aus der Phrase-Quote', async () => {
  const { page, errors } = await openApp(null, `{
    apiPrecalcHistory: { success: true, all: false, rows: [] },
    apiPrecalcStart: (p) => ({ success: true, id: 'P-1', phase: 'IMPORT' }),
    apiPrecalcPoll: (id) => ({ success: true, phase: 'DONE', amount: 1234.5, currency: 'EUR', words: 2500, perTemplate: [], files: ['flyer.docx'] })
  }`, { configPatch: MKT_CONFIG });
  await page.evaluate(() => { switchTab('marketing'); switchMktSubtab('precalc'); });
  await page.waitForSelector('#mktPrecalcHead .card');
  assert.ok(await page.locator('#projectForm_precalc').isVisible(), 'Formular der Kalkulation');
  assert.ok(await page.locator('#settingsCard_precalc').isHidden(), 'ohne Frist/Notiz');
  await page.evaluate(() => mktPrecalcStart_('_precalc'));
  await page.waitForFunction(() => /1[.,]234[.,]50/.test((document.getElementById('mktPcBody') || {}).innerText || ''), null, { timeout: 15000 });
  assert.match(await page.locator('#mktPcBody').innerText(), /2[.,]?500/);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Maximaltemplate: XXL-Dialog setzt Basis, Sprachen, Prompt und liefert maxSettings', async () => {
  const { page, errors } = await openApp(null, `{
    apiMaxTplOptions: (uid) => ({ success: true,
      catalog: { workflowSteps: [{ id: 's1', name: 'Translation', order: 1 }, { id: 's2', name: 'Revision', order: 2 }], clients: [], businessUnits: [{ id: 'b1', name: 'Marketing' }], domains: [], subDomains: [], costCenters: [], mtSettings: [] },
      defaults: uid ? { uid: uid, sourceLang: 'en', targetLangs: ['de_de'], workflowSteps: ['s1'], businessUnit: 'b1', tms: [], tbs: [] } : null,
      prompts: [{ name: 'Marketing DE', prompt: 'Du bist Texter.', templateUids: ['T1'], link: '' }],
      templatePrompt: uid ? { name: 'Marketing DE', prompt: 'Du bist Texter.', templateUids: ['T1'], link: '' } : null,
      promptHubUrl: 'https://example.com/hub', promptField: 'AI Prompt' })
  }`, { configPatch: MKT_CONFIG });
  await page.evaluate(() => switchTab('marketing'));
  const opt = page.locator('#tmplOptionsList_marketing .tmpl-option-max');
  assert.equal(await opt.count(), 1, 'Maximaltemplate im Dropdown');
  await page.click('#tmplTrigger_marketing');
  await opt.click();
  await page.waitForSelector('#maxTplOverlay .mx-body select');
  await page.locator('#maxTplOverlay .mx-body select').first().selectOption('T1');
  await page.waitForFunction(() => maxTplDlg_ && maxTplDlg_.s.workflowSteps.length === 1 && document.querySelector('#mxLangs'));
  await page.locator('#mxLangs input[value=fr_fr]').check();
  await page.evaluate(() => maxTplShowSec_('workflow'));
  await page.locator('.mx-step input[type=checkbox]').nth(1).check();
  await page.evaluate(() => maxTplShowSec_('ai'));
  assert.equal(await page.locator('.mx-prompt').inputValue(), 'Du bist Texter.', 'Prompt der Vorlage vorbelegt');
  await page.getByRole('button', { name: /Apply settings|Einstellungen übernehmen/ }).click();
  await page.waitForFunction(() => !document.getElementById('maxTplOverlay'));
  assert.match(await page.locator('#tmplTriggerText_marketing').innerText(), /Maximaltemplate/);
  assert.ok(await page.locator('#maxTplEdit_marketing').isVisible(), 'Bearbeiten-Knopf');
  const payload = await page.evaluate(async () => { await new Promise((r) => setTimeout(r, 0)); const p = await collectFormPayload_('_marketing'); return p; });
  assert.deepEqual(payload.targetLangs.sort(), ['de_de', 'fr_fr']);
  assert.equal(payload.templateUid, 'T1');
  assert.deepEqual(payload.maxSettings.workflowSteps, ['s1', 's2']);
  assert.equal(payload.maxSettings.businessUnit, 'b1');
  assert.equal(payload.maxSettings.prompt, 'Du bist Texter.');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Einstellungen: Urlaubsvertretung speichern; Meine Projekte: "erstellt von" / "geteilt von" fett', async () => {
  const projects = JSON.stringify([
    { projectUid: 'c1', projectName: 'BY CONSULTANT', owner: ME, createdBy: 'consultant@kaercher.com', status: 'ASSIGNED', targetLangs: ['de'] },
    { projectUid: 's1', projectName: 'SHARED', owner: 'colleague@kaercher.com', sharedWith: ME, isShared: true, status: 'ASSIGNED', targetLangs: ['de'] },
    { projectUid: 'b1', projectName: 'BU PROJECT', owner: 'bu@kaercher.com', teamView: true, buCreated: true, status: 'ASSIGNED', targetLangs: ['de'] }
  ]);
  const { page, errors } = await openApp(null, `{
    apiGetMyProjects: { projects: ${projects}, email: '${ME}' },
    apiGetPrefsUi: ${JSON.stringify(parts.prefs.replace(/^\s*<!--[\s\S]*?-->\s*/, ''))},
    apiGetChatPreference: { enabled: true },
    apiGetTeamSettings: { success: true, team: {}, businessUnits: [], buColleagues: 0 },
    apiGetCalendarSyncStatus: { configured: false },
    apiGetDeputySettings: { success: true, deputy: { email: '', from: '', to: '', active: false }, activeNow: false, principals: [{ email: 'boss@kaercher.com', from: '', to: '', activeNow: true }] },
    apiSaveDeputySettings: (d) => ({ success: true, deputy: d, activeNow: true, principals: [] }),
    apiSaveUserPrefs: (p) => ({ success: true, prefs: p }),
    apiSetChatPreference: { success: true }
  }`);
  await page.evaluate(() => { switchTab('history'); });
  await page.waitForFunction(() => /BU PROJECT/.test(document.querySelector('#projectsTable').innerText));
  const html = await page.locator('#projectsTable').innerHTML();
  assert.match(html, /<b>(created|erstellt)<\/b>[^<]*consultant@kaercher\.com/);
  assert.match(html, /<b>(shared|geteilt)<\/b>[^<]*colleague@kaercher\.com/);
  assert.match(html, /<b>(created|erstellt)<\/b>[^<]*bu@kaercher\.com/);
  await page.selectOption('#ownershipFilter', 'bu');
  const buOnly = await page.locator('#projectsTable tbody').innerText();
  assert.match(buOnly, /BU PROJECT/);
  assert.doesNotMatch(buOnly, /BY CONSULTANT|SHARED/);

  await page.evaluate(() => openPreferences());
  await page.waitForSelector('#preferencesModal');
  await page.evaluate(() => prefsShowSec_('deputy'));
  await page.waitForFunction(() => /boss@kaercher\.com/.test(document.getElementById('prefDeputyPrincipals').innerText));
  await page.fill('#prefDeputyEmail', 'vertretung@kaercher.com');
  await page.fill('#prefDeputyFrom', '2026-10-20');
  await page.fill('#prefDeputyTo', '2026-10-31');
  await page.check('#prefDeputyActive');
  await page.locator('#preferencesModal .prefs-foot .btn-primary').click();
  await page.waitForFunction(() => window.__calls.some((c) => c.fn === 'apiSaveDeputySettings'));
  const dep = await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiSaveDeputySettings').args[0]);
  assert.deepEqual(dep, { email: 'vertretung@kaercher.com', from: '2026-10-20', to: '2026-10-31', active: true });
  const saved = await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiSaveUserPrefs').args[0]);
  assert.equal(saved.showBuProjects, true);
  assert.deepEqual(errors, []);
  await page.close();
});

test('Admin-Sandbox: Banner im Sandbox-Modus, Schalter nur fuer Admins in den Einstellungen', async () => {
  const { page, errors } = await openApp(null, `{
    apiGetPrefsUi: ${JSON.stringify(parts.prefs.replace(/^\s*<!--[\s\S]*?-->\s*/, ''))},
    apiGetChatPreference: { enabled: true },
    apiGetTeamSettings: { success: true, team: {}, businessUnits: [], buColleagues: 0 },
    apiGetCalendarSyncStatus: { configured: false },
    apiGetDeputySettings: { success: true, deputy: {}, principals: [] },
    apiGetSandboxStatus: { success: true, configured: true, active: true, baseUrl: 'https://sandbox.example/web', templateSheet: 'FetchTemplate-Test', opsSheetUrl: '', creatorField: false },
    apiSetSandboxMode: (on) => ({ success: true, active: on })
  }`, { configPatch: { sandbox: true } });
  assert.ok(await page.locator('#sandboxBanner').isVisible(), 'Banner sichtbar');
  await page.evaluate(() => openPreferences());
  await page.waitForSelector('#preferencesModal');
  assert.ok(await page.locator('#prefsNavSandbox').isVisible(), 'Admin sieht den Bereich');
  await page.evaluate(() => prefsShowSec_('sandbox'));
  await page.waitForFunction(() => /FetchTemplate-Test/.test(document.getElementById('prefSandboxInfo').innerText));
  await page.click('#prefSandboxBtn');
  await page.waitForFunction(() => window.__calls.some((c) => c.fn === 'apiSetSandboxMode'));
  assert.equal(await page.evaluate(() => window.__calls.find((c) => c.fn === 'apiSetSandboxMode').args[0]), false, 'aktiv -> beenden');
  assert.deepEqual(errors, []);
  await page.close();
});
