#!/usr/bin/env node
'use strict';

// Baut aus Index.html eine statische Vorschau (include() aufgeloest,
// google.script.run durch einen Mock ersetzt). Grundlage der Browser-Tests in
// tests-ui/ - und lokal zum Anschauen: node tools/build-preview.js > preview.html
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, 'src', f), 'utf8');

// Mock: google.script.run.withSuccessHandler(..).withFailureHandler(..).apiX(args)
// antwortet mit window.__mock[apiX] (Wert oder Funktion); window.__calls protokolliert.
const MOCK = `<script>
window.__calls = [];
window.__mock = window.__mock || {};
(function () {
  function runner() {
    var ok = null, fail = null;
    var p = new Proxy({}, { get: function (t, k) {
      if (k === 'withSuccessHandler') return function (h) { ok = h; return p; };
      if (k === 'withFailureHandler') return function (h) { fail = h; return p; };
      if (k === 'withUserObject') return function () { return p; };
      return function () {
        var args = Array.prototype.slice.call(arguments);
        window.__calls.push({ fn: k, args: args });
        var m = window.__mock[k];
        if (m === undefined) return;
        setTimeout(function () {
          try { var r = typeof m === 'function' ? m.apply(null, args) : m; if (ok) ok(r); }
          catch (e) { if (fail) fail(e); }
        }, 0);
      };
    } });
    return p;
  }
  window.google = { script: {
    run: new Proxy({}, { get: function (t, k) { return runner()[k]; } }),
    url: { getLocation: function (cb) { setTimeout(function () { cb({ parameter: {}, hash: '' }); }, 0); } },
    host: { close: function () {} }
  } };
})();
</script>`;

function buildPreview() {
  let html = read('Index.html')
    .replace(/<\?!=\s*include\('([^']+)'\);?\s*\?>/g, (m, n) => read(n + '.html'))
    .replace(/<\?[\s\S]*?\?>/g, '');
  html = html.replace('<head>', '<head>' + MOCK);
  return html;
}

function lazyParts() {
  const split = (f) => {
    const src = read(f);
    return { html: src.replace(/<script>[\s\S]*<\/script>/, ''), js: (src.match(/<script>([\s\S]*)<\/script>/) || ['', ''])[1] };
  };
  const vm = require('vm');
  const dicts = vm.runInNewContext(read('I18nDicts.gs') + ';I18N_DICTS_');
  const adminDicts = vm.runInNewContext(read('AdminI18n.gs') + ';ADMIN_I18N_');
  return {
    i18n: dicts,
    adminI18n: adminDicts,
    lazy: {
      JsCampus: (read('JsCampus.html').match(/<script>([\s\S]*)<\/script>/) || ['', ''])[1],
      AdminManagersUi: (read('AdminManagersUi.html').match(/<script>([\s\S]*)<\/script>/) || ['', ''])[1]
    },
    admin: { html: read('AdminConsole.html'), js: read('AdminScript.html').replace(/^\s*<script>|<\/script>\s*$/g, '') },
    home: read('HomeUi.html'),
    prefs: read('PrefsUi.html'),
    translate: split('TranslateUi.html')
  };
}

module.exports = { buildPreview, lazyParts };

if (require.main === module) process.stdout.write(buildPreview());
