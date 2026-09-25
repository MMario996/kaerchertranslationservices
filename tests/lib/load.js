'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const REPO_ROOT = path.join(__dirname, '..', '..');

function read(fileName) {
  return fs.readFileSync(path.join(REPO_ROOT, fileName), 'utf8');
}

/** Inhalt aller <script>-Bloecke einer HTML-Datei. */
function scriptsOf(fileName) {
  const src = read(fileName);
  const out = [];
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out.join('\n;\n');
}

/**
 * Laedt .gs- und .html-Dateien (bei .html nur die <script>-Bloecke) nacheinander
 * in einen gemeinsamen vm-Kontext - wie Apps Script bzw. der Browser es tut:
 * Top-Level-Funktionen und let/const sind dateiuebergreifend sichtbar.
 */
function load(fileNames, globals) {
  const context = Object.assign({ console }, globals || {});
  vm.createContext(context);
  fileNames.forEach((fileName) => {
    const code = fileName.endsWith('.html') ? scriptsOf(fileName) : read(fileName);
    vm.runInContext(code, context, { filename: fileName });
  });
  return context;
}

/** Minimaler Browser-Ersatz: genug, damit die Js*.html-Dateien laden. */
function browserStubs() {
  const noop = () => {};
  const store = {};
  const element = () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, addEventListener: noop, setAttribute: noop, querySelector: () => null, querySelectorAll: () => [], appendChild: noop });
  const document = {
    addEventListener: noop,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: element,
    body: element()
  };
  const window = { addEventListener: noop, matchMedia: () => ({ matches: false }) };
  return {
    document,
    window,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    navigator: { language: 'de-DE' },
    requestAnimationFrame: (fn) => fn(),
    MutationObserver: function () { this.observe = noop; },
    setTimeout: noop,
    setInterval: noop,
    clearTimeout: noop,
    google: { script: { run: new Proxy({}, { get: () => () => ({}) }) } }
  };
}

module.exports = { REPO_ROOT, read, scriptsOf, load, browserStubs };
