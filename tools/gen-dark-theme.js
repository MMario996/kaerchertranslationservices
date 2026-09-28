#!/usr/bin/env node
'use strict';

// Erzeugt den dunklen Modus (html[data-theme="dark"]) fuer Styles.html.
//
// Die Oberflaeche hat ueber die Jahre viele feste Farben bekommen (in CSS-Regeln
// und als style="..." direkt im Markup/JS). Statt jede Stelle von Hand
// nachzuziehen, liest dieses Skript alle Farben aus und leitet dunkle
// Gegenstuecke ab:
//   - helle Hintergruende  -> dunkle Flaechen (Farbton bleibt als Tönung)
//   - dunkle Schrift       -> helle Schrift
//   - helle Rahmen         -> dunkle Rahmen
// Kraeftige Farben (Kaercher-Gelb, Statusfarben) bleiben unveraendert.
//
// Aufruf nach CSS-Aenderungen:  node tools/gen-dark-theme.js
// Der erzeugte Block steht in Styles.html zwischen den DARK-THEME-Markern und
// wird bei jedem Lauf komplett ersetzt - dort nichts von Hand aendern,
// Handkorrekturen gehoeren in DARK_BASE_ unten.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const STYLES = path.join(ROOT, 'Styles.html');
const BEGIN = '/* DARK-THEME:BEGIN - generiert von tools/gen-dark-theme.js, nicht von Hand aendern */';
const END = '/* DARK-THEME:END */';
const D = 'html[data-theme="dark"]';

// --- Farben -------------------------------------------------------------------
const NAMED = { white: '#ffffff', black: '#000000' };

function parseColor(v) {
  v = String(v).trim().toLowerCase();
  if (NAMED[v]) v = NAMED[v];
  let m = v.match(/^#([0-9a-f]{3})$/);
  if (m) return m[1].split('').map((c) => parseInt(c + c, 16));
  m = v.match(/^#([0-9a-f]{6})$/);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = v.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (m) return [1, 2, 3].map((i) => Number(m[i]));
  return null;
}

function toHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function toHex([h, s, l]) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

/** Heller Hintergrund -> dunkle Flaeche; sonst null (Farbe bleibt). */
function darkBg(v) {
  const rgb = parseColor(v);
  if (!rgb) return null;
  const [h, s, l] = toHsl(rgb);
  if (l < 0.6) return null;
  if (s > 0.85 && l < 0.75) return null; // kraeftige Farben (z. B. Gelb) bleiben
  return toHex([h, Math.min(s, 1) * 0.45, 0.1 + (1 - l) * 0.55]);
}

/** Dunkle Schrift -> helle Schrift; sonst null. */
function lightText(v) {
  const rgb = parseColor(v);
  if (!rgb) return null;
  const [h, s, l] = toHsl(rgb);
  if (s < 0.25 && l <= 0.6) return toHex([h, s, Math.max(0.55, 0.93 - l * 0.7)]);
  if (s >= 0.25 && l < 0.48) return toHex([h, Math.min(s, 0.8), Math.max(0.68, Math.min(0.8, 1 - l * 0.6))]);
  return null;
}

/** Heller Rahmen -> dunkler Rahmen; sonst null. */
function darkBorder(v) {
  const rgb = parseColor(v);
  if (!rgb) return null;
  const [h, s, l] = toHsl(rgb);
  if (l < 0.72 || (s > 0.85 && l < 0.8)) return null;
  return toHex([h, s * 0.4, 0.2 + (1 - l) * 0.45]);
}

const COLOR_RE = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|\bwhite\b|\bblack\b|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;

function mapValue(value, fn) {
  let changed = false;
  const out = value.replace(COLOR_RE, (c) => {
    const n = fn(c);
    if (n) { changed = true; return n; }
    return c;
  });
  return changed ? out : null;
}

// --- CSS lesen ----------------------------------------------------------------
function stripComments(css) { return css.replace(/\/\*[\s\S]*?\*\//g, ''); }

/** Liefert [{ media, selector, decls: [[prop, value], ...] }] (nur eine @media-Ebene). */
function parseRules(css) {
  const rules = [];
  let i = 0;
  const walk = (media, endAt) => {
    while (i < css.length) {
      const open = css.indexOf('{', i);
      const close = css.indexOf('}', i);
      if (close !== -1 && (open === -1 || close < open)) { i = close + 1; if (endAt) return; continue; }
      if (open === -1) { i = css.length; return; }
      const head = css.slice(i, open).trim();
      i = open + 1;
      if (/^@media/i.test(head)) { walk(head, true); continue; }
      if (/^@/.test(head)) { // @keyframes etc. ueberspringen
        let depth = 1;
        while (i < css.length && depth) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; i++; }
        continue;
      }
      const end = css.indexOf('}', i);
      const body = css.slice(i, end);
      i = end + 1;
      const decls = body.split(';').map((d) => {
        const k = d.indexOf(':');
        return k === -1 ? null : [d.slice(0, k).trim().toLowerCase(), d.slice(k + 1).trim()];
      }).filter(Boolean);
      rules.push({ media, selector: head, decls });
    }
  };
  walk(null, false);
  return rules;
}

function prefixSelector(sel) {
  return sel.split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
    if (/^:root\b/.test(s)) return D;
    if (/^html\b/.test(s)) return s.replace(/^html/, D);
    if (/^body\b/.test(s)) return D + ' ' + s;
    return D + ' ' + s;
  }).join(', ');
}

// Bereiche, die bewusst dunkel gestaltet sind oder eigene Farben tragen.
const SKIP_SELECTOR = /home-hero|ctx-help-pop|maintenance-overlay|#slidesModal|\.btn-black|lang-btn\.active/;

function isLightBgValue(v) {
  // Nur Flaechen, die hell BLEIBEN (Gelb & Co.), behalten ihre dunkle Schrift.
  if (/primary-yellow/i.test(v)) return true;
  const m = v.match(COLOR_RE);
  if (!m) return false;
  const rgb = parseColor(m[0]);
  if (!rgb || darkBg(m[0])) return false;
  return toHsl(rgb)[2] >= 0.45;
}

function isDarkBgValue(v) {
  if (/primary-black/.test(v)) return true;
  const m = v.match(COLOR_RE);
  if (!m) return false;
  const rgb = parseColor(m[0]);
  return !!rgb && toHsl(rgb)[2] < 0.3;
}

function convertRule(rule) {
  if (SKIP_SELECTOR.test(rule.selector)) return [];
  const out = [];
  const bgDecl = rule.decls.find(([p]) => p === 'background' || p === 'background-color');
  const bgKeepsDarkText = bgDecl && isLightBgValue(bgDecl[1]);
  const bgIsDark = bgDecl && isDarkBgValue(bgDecl[1]);
  rule.decls.forEach(([prop, value]) => {
    let nv = null;
    if (prop === 'background' || prop === 'background-color') {
      if (/url\(/.test(value)) return;
      nv = mapValue(value, darkBg);
    } else if (prop === 'color') {
      if (bgKeepsDarkText || bgIsDark) return;
      nv = /var\(--primary-black\)/.test(value) ? '#f0f0f0' : mapValue(value, lightText);
    } else if (/^border(-top|-bottom|-left|-right)?(-color)?$/.test(prop) || prop === 'outline') {
      nv = mapValue(value, darkBorder);
    } else if (prop.startsWith('--')) {
      if (/bg|soft|surface|line|border/.test(prop)) nv = mapValue(value, (c) => (/line|border/.test(prop) ? darkBorder(c) : darkBg(c)));
      else if (/text|ink|muted|sub|main/.test(prop)) nv = mapValue(value, lightText);
    }
    if (nv) out.push(`${prop}:${nv}`);
  });
  if (!out.length) return [];
  const sel = prefixSelector(rule.selector);
  const css = `${sel} { ${out.join('; ')}; }`;
  return [{ media: rule.media, css }];
}

// --- Inline-Styles aus Markup und JS ------------------------------------------
function inlineRules() {
  const files = fs.readdirSync(ROOT).filter((f) => /\.html$/.test(f) && f !== 'Styles.html' && !/ /.test(f));
  const seen = { bg: new Set(), color: new Set(), border: new Set() };
  files.forEach((f) => {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/(?:^|[;"'\s`])(background(?:-color)?)\s*:\s*(#[0-9a-fA-F]{3,6}\b|white)/g)) seen.bg.add(m[2].toLowerCase());
    for (const m of src.matchAll(/(?:^|[;"'\s`])color\s*:\s*(#[0-9a-fA-F]{3,6}\b)/g)) seen.color.add(m[1].toLowerCase());
    for (const m of src.matchAll(/(?:^|[;"'\s`])(border(?:-top|-bottom|-left|-right)?)\s*:\s*[^;"']*?(#[0-9a-fA-F]{3,6}\b)/g)) seen.border.add(m[1] + '|' + m[2].toLowerCase());
  });
  const byLen = (a, b) => a.length - b.length || (a < b ? -1 : 1);
  const variants = (prop, val) => {
    const rgb = parseColor(val);
    const list = [`${prop}:${val}`, `${prop}: ${val}`, `${prop}:${val.toUpperCase()}`, `${prop}: ${val.toUpperCase()}`];
    if (rgb) list.push(`${prop}: rgb(${rgb.join(', ')})`);
    return [...new Set(list)];
  };
  const out = [];
  // Kuerzere Werte zuerst, damit z. B. "#fff" nicht spaetere "#fff8e1"-Regeln ueberschreibt.
  [...seen.bg].sort(byLen).forEach((v) => {
    const n = darkBg(v);
    if (!n) return;
    const sels = ['background', 'background-color'].flatMap((p) => variants(p, v)).map((x) => `${D} [style*="${x}"]`);
    out.push(`${sels.join(', ')} { background-color:${n} !important; }`);
  });
  [...seen.color].sort(byLen).forEach((v) => {
    const n = lightText(v);
    if (!n) return;
    const sels = variants('color', v).map((x) => `${D} [style*="${x}"]:not([style*="primary-yellow"]):not([style*="FFED00"]):not([style*="ffed00"])`);
    out.push(`${sels.join(', ')} { color:${n} !important; }`);
  });
  [...seen.border].sort(byLen).forEach((pv) => {
    const [p, v] = pv.split('|');
    const n = darkBorder(v);
    if (!n) return;
    const colorProp = p === 'border' ? 'border-color' : p + '-color';
    const sels = [`${D} [style*="${p}:"][style*="${v}"]`, `${D} [style*="${p}: "][style*="${v}"]`];
    out.push(`${sels.join(', ')} { ${colorProp}:${n} !important; }`);
  });
  return out;
}

// Grundregeln und Handkorrekturen fuer Stellen, die sich nicht aus Farben ableiten lassen.
const DARK_BASE_ = `
  ${D} { color-scheme: dark; --text-main:#e4e4e4; --text-sub:#a9a9a9; --bg-gray:#1d1f22; --border-light:#34373c;
    --k-surface:#1b1d20; --k-surface-2:#24272b; --k-ink:#ececec; --k-ink-2:#a3a3a3; --k-line:#34373c; --k-shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px rgba(0,0,0,.35); }
  ${D} body { background-color:#131416; color:#e4e4e4; }
  ${D} input, ${D} select, ${D} textarea { background-color:#1f2124; color:#ececec; border-color:#3b3f45; }
  ${D} input::placeholder, ${D} textarea::placeholder { color:#80858c; }
  ${D} input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(1); }
  ${D} table, ${D} th, ${D} td { border-color:#2f3237; }
  ${D} th { background-color:#1f2124; color:#d6d6d6; }
  ${D} tr:hover td { background-color:rgba(255,255,255,.03); }
  ${D} a { color:#8ab4f8; }
  ${D} .tab-btn.active { color:#ffffff; }
  ${D} .tab-btn:hover { background-color:#1f2124; color:#ffffff; }
  ${D} .btn-primary, ${D} .btn-primary * { color:#000 !important; }
  ${D} .btn-secondary { background-color:#24272b; color:#e4e4e4; border-color:#3b3f45; }
  ${D} .btn-secondary:hover { background-color:#2d3035; }
  ${D} .lang-btn { background-color:#24272b; color:#bdbdbd; }
  ${D} .hdr-icon-btn, ${D} #prefsBtn { color:#bdbdbd !important; }
  ${D} .hdr-icon-btn:hover { background:rgba(255,255,255,.08); color:#fff; }
  ${D} .loader { border-color:#2c2f33; border-top-color:var(--primary-yellow); }
  ${D} .material-icons-outlined { color:inherit; }
  ${D} .notif-item.unread { background:rgba(255,237,0,.07); }
  ${D} .notif-ico.n-ok { background:#173522; color:#81c995; } ${D} .notif-ico.n-info { background:#172a45; color:#8ab4f8; }
  ${D} .notif-ico.n-warn { background:#3a2e10; color:#fdd663; } ${D} .notif-ico.n-bad { background:#3d1a18; color:#f28b82; }
  ${D} .home-kpi .material-icons-outlined { filter:saturate(1.1); }
  ${D} .home-kpi.k-open .material-icons-outlined { background:#172a45; color:#8ab4f8; }
  ${D} .home-kpi.k-week .material-icons-outlined { background:#3a3410; color:#fdd663; }
  ${D} .home-kpi.k-over .material-icons-outlined { background:#26282c; color:#8a8a8a; }
  ${D} .home-kpi.k-over.hot .material-icons-outlined { background:#3d1a18; color:#f28b82; } ${D} .home-kpi.k-over.hot .home-kpi-n { color:#f28b82; }
  ${D} .home-kpi.k-done .material-icons-outlined, ${D} .home-card-done .home-card-ico { background:#173522; color:#81c995; }
  ${D} .home-due.due-soon { background:#3a3410; color:#fdd663; } ${D} .home-due.due-overdue { background:#3d1a18; color:#f28b82; }
  ${D} .home-hero { background:linear-gradient(120deg, #0b0b0c 0%, #1f2124 100%); box-shadow:inset 0 0 0 1px #2a2d31; }
  ${D} .ksync-ok { background:#173522; color:#a8dab5; } ${D} .ksync-err { background:#3d1a18; color:#f6aea9; }
  ${D} .ksync-warn { background:#3a2e10; color:#fde293; } ${D} .ksync-info { background:#172a45; color:#aecbfa; }
  ${D} .ctx-help-q { background:#34373c; color:#d0d0d0; }
  ${D} .seg button.active { background:#34373c; }
  ${D} .prefs-check input, ${D} .prefs-check-inline input { accent-color:var(--primary-yellow); }
  ${D} .team-badge { background:#172a45; color:#aecbfa; }
  ${D} tr.row-team td { background:rgba(138,180,248,.05); }
  ${D} img:not([src*=".svg"]) { filter:brightness(.92); }
`;

function build() {
  const styles = fs.readFileSync(STYLES, 'utf8');
  const b = styles.indexOf(BEGIN);
  const e = styles.indexOf(END);
  const withoutBlock = b !== -1 && e !== -1 ? styles.slice(0, b) + styles.slice(e + END.length) : styles;
  const cssStart = withoutBlock.indexOf('<style>') + '<style>'.length;
  const cssEnd = withoutBlock.lastIndexOf('</style>');
  const css = stripComments(withoutBlock.slice(cssStart, cssEnd));

  const converted = parseRules(css).flatMap(convertRule);
  const plain = converted.filter((r) => !r.media).map((r) => '  ' + r.css);
  const byMedia = {};
  converted.filter((r) => r.media).forEach((r) => { (byMedia[r.media] = byMedia[r.media] || []).push('    ' + r.css); });
  const media = Object.keys(byMedia).map((m) => `  ${m} {\n${byMedia[m].join('\n')}\n  }`);

  const block = [BEGIN, ...plain, ...media, '  /* Inline-Styles aus Markup/JS */', ...inlineRules().map((l) => '  ' + l),
    '  /* Grundregeln + Handkorrekturen (DARK_BASE_) */', DARK_BASE_.replace(/^\n/, '').replace(/\n$/, ''), '  ' + END].join('\n');

  const insertAt = withoutBlock.lastIndexOf('</style>');
  const next = withoutBlock.slice(0, insertAt).replace(/\s*$/, '\n') + '  ' + block + '\n' + withoutBlock.slice(insertAt);
  fs.writeFileSync(STYLES, next);
  return { rules: converted.length, inline: inlineRules().length };
}

if (require.main === module) {
  const r = build();
  console.log(`Dark theme: ${r.rules} CSS rules, ${r.inline} inline rules -> Styles.html`);
}

module.exports = { build, darkBg, lightText, darkBorder };
