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
  await page.addInitScript(({ L, me, projects, extra }) => {
    const homeCss = (L.home.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];
    const homeJs = (L.home.match(/<script>([\s\S]*?)<\/script>/) || ['', ''])[1];
    window.__mock = Object.assign({
      apiGetI18nDict: (l) => L.i18n[l] || null,
      apiGetAdminI18n: (l) => ({ lang: l, dict: L.adminI18n[l] || L.adminI18n.en, en: L.adminI18n.en }),
      apiGetConfig: { i18nEn: L.i18n.en, currentUser: me, effectiveUser: me, isAdmin: true, effectiveIsAdmin: true, templates: {}, languages: {}, sizeLimitMb: 100 },
      apiGetHomeUi: { css: homeCss, js: homeJs },
      apiGetMyProjects: { projects: projects, email: me },
      apiGetAdminContent: L.admin,
      apiGetTranslateUiContent: L.translate
    }, extra ? (0, eval)('(' + extra + ')') : {});
  }, { L: parts, me: ME, projects: PROJECTS, extra: extraMocks || '' });
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

test('Knowledge Base: Inhaltsverzeichnis, Suche mit Treffern, keine Fehler', async () => {
  const kbFile = path.join(path.dirname(file), 'kb.html');
  fs.writeFileSync(kbFile, fs.readFileSync(path.join(__dirname, '..', 'Knowledgebase.html'), 'utf8'));
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + kbFile);
  const tocCount = await page.locator('#tocList > li').count();
  const sections = await page.locator('section.kb').count();
  assert.equal(tocCount, sections);
  await page.fill('#q', 'Child Project Creation');
  await page.waitForFunction(() => document.querySelectorAll('mark').length > 0);
  const visible = await page.locator('section.kb:not(.hidden)').count();
  assert.ok(visible > 0 && visible < sections, 'Suche blendet Abschnitte aus');
  await page.fill('#q', 'zzzz-nichts');
  await page.waitForFunction(() => getComputedStyle(document.getElementById('noHits')).display === 'block');
  await page.fill('#q', '');
  await page.waitForFunction((n) => document.querySelectorAll('section.kb:not(.hidden)').length === n, sections);
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
