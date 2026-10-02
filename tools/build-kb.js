#!/usr/bin/env node
'use strict';

// Baut die Knowledge Base (?page=kb) aus den Markdown-Exporten der Phrase-
// Dokumentation in kb-src/*.md:
//   - Knowledgebase.html: Inhaltsverzeichnis (Manifest) zwischen den Markern
//     <!--KB_MANIFEST--> ... <!--/KB_MANIFEST--> wird ersetzt, der Rest der
//     Seite (Oberflaeche) bleibt unveraendert
//   - KbData1.html ... KbDataN.html: Artikel-HTML in Paketen (~120 KB), die die
//     Seite per google.script.run.apiKbChunk(n) nachlaedt (Apps-Script-Grenze
//     fuer eine ausgelieferte Seite liegt bei ~600 KB, die Doku hat >1,4 MB)
//
// Aufruf: npm run build:kb   (danach committen - clasp pusht KbData*.html mit)
// Neue Exporte (z. B. Phrase-TMS.md) einfach nach kb-src/ legen und neu bauen.

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'kb-src');
const APP = path.join(ROOT, 'src'); // Apps-Script-Code
const CHUNK_BYTES = 120000; // nach Escaping gemessen, deutlich unter den Apps-Script-Grenzen
// Reihenfolge der Produkte in der Navigation; unbekannte Dateien folgen alphabetisch.
const ORDER = ['Phrase-TMS', 'Phrase-Strings', 'Phrase-Orchestrator', 'Phrase-Portal', 'Phrase-Studio', 'Global'];
const CALLOUTS = { note: 'note', tip: 'tip', important: 'important', warning: 'important', caution: 'important' };
const ARTICLE_RE = /^https:\/\/support\.phrase\.com\/hc\/[a-z-]+\/articles\/(\d+)/;
const SECTION_RE = /^Quelle:\s*(https:\/\/support\.phrase\.com\/hc\/[a-z-]+\/sections\/\S+)/;

const slug = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'x';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const decode = (s) => String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** JSON, das Apps Script unbeschadet uebersteht: kein "//" (Kommentar-Entfernung), kein "<". */
function safeJson(obj) {
  return JSON.stringify(obj).replace(/\//g, '\\/').replace(/</g, '\\u003c')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028').replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
}

function nextNonEmpty(lines, i) {
  for (let j = i + 1; j < lines.length && j < i + 8; j++) if (lines[j].trim()) return { line: lines[j], idx: j };
  return { line: '', idx: -1 };
}

/** Eine Exportdatei -> { product, sections, articles }. */
function parseFile(file) {
  const key = path.basename(file, '.md');
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const product = { key, name: key.replace(/-/g, ' '), desc: '', url: '' };
  let i = 0;
  const h1 = lines.findIndex((l) => /^# /.test(l));
  if (h1 >= 0) {
    product.name = lines[h1].slice(2).trim();
    for (i = h1 + 1; i < lines.length && !/^## /.test(lines[i]); i++) {
      const l = lines[i].trim();
      if (!l) continue;
      if (/^Quelle:/.test(l)) product.url = (l.match(/https?:\/\/\S+/) || [''])[0];
      else if (/^Exportiert:/.test(l)) continue;
      else if (!product.desc) product.desc = l;
    }
  }
  // Inhaltsverzeichnis des Exports ueberspringen (bis zum ersten "---").
  if (/^## Inhaltsverzeichnis/.test(lines[i] || '')) {
    while (i < lines.length && lines[i].trim() !== '---') i++;
    i++;
  }

  const sections = [];
  const articles = [];
  const stack = []; // [{level, idx}]
  let cur = null;
  let sectionDesc = null;

  const flush = () => {
    if (!cur) return;
    while (cur.body.length && /^(\s*|---)$/.test(cur.body[cur.body.length - 1])) cur.body.pop();
    articles.push(cur);
    cur = null;
  };

  for (; i < lines.length; i++) {
    const l = lines[i];
    const hm = /^(#{2,6}) (.+?)\s*$/.exec(l);
    if (hm) {
      const nx = nextNonEmpty(lines, i);
      let isSection = false;
      for (let j = i + 1; j < lines.length && j < i + 6 && !/^#{1,6} /.test(lines[j]); j++) {
        if (SECTION_RE.test(lines[j].trim())) { isSection = true; break; }
      }
      if (isSection) {
        flush();
        const level = hm[1].length;
        while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
        const parent = stack.length ? sections[stack[stack.length - 1].idx] : null;
        let url = '';
        let j = i + 1;
        const desc = [];
        for (; j < lines.length && j < i + 6; j++) {
          const t = lines[j].trim();
          const m = SECTION_RE.exec(t);
          if (m) { url = m[1]; break; }
          if (t) desc.push(t);
        }
        const title = hm[2].trim();
        sections.push({ title, url, desc: desc.join(' '), path: parent ? parent.path.concat([title]) : [title] });
        stack.push({ level, idx: sections.length - 1 });
        sectionDesc = sections[sections.length - 1];
        i = j;
        continue;
      }
      if (/^> Quelle:/.test(nx.line)) {
        flush();
        const meta = { url: '', updated: '', labels: '' };
        let j = nx.idx;
        for (; j < lines.length && /^>/.test(lines[j]); j++) {
          const t = lines[j].replace(/^>\s?/, '').trim();
          let m;
          if ((m = /^Quelle:\s*(\S+)/.exec(t))) meta.url = m[1];
          else if ((m = /^Zuletzt aktualisiert:\s*(\S+)/.exec(t))) meta.updated = m[1];
          else if ((m = /^Labels:\s*(.*)$/.exec(t))) meta.labels = m[1];
        }
        const idM = ARTICLE_RE.exec(meta.url);
        const sec = stack.length ? stack[stack.length - 1].idx : -1;
        cur = { id: idM ? idM[1] : product.key + '-' + slug(hm[2]), title: hm[2].trim(), url: meta.url, updated: meta.updated, section: sec, body: [] };
        sectionDesc = null;
        i = j - 1;
        continue;
      }
    }
    if (cur) cur.body.push(l);
    else if (sectionDesc && l.trim() && l.trim() !== '---') sectionDesc.desc = (sectionDesc.desc ? sectionDesc.desc + ' ' : '') + l.trim();
  }
  flush();
  return { product, sections, articles };
}

/** Markdown-Vorverarbeitung: Hinweis-Ueberschriften -> Callouts, Ueberschriften-Ebenen. */
function preprocess(md) {
  const lines = md.split('\n');
  const out = [];
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) fence = !fence;
    const m = fence ? null : /^(\s*)(#{1,6}) (.+?)\s*$/.exec(lines[i]);
    if (!m) { out.push(lines[i]); continue; }
    const indent = m[1];
    const kind = CALLOUTS[m[3].trim().toLowerCase()];
    if (kind) {
      // Naechsten Block (bis Leerzeile) als Callout-Blockquote uebernehmen.
      let j = i + 1;
      while (j < lines.length && !lines[j].trim()) j++;
      const block = [];
      for (; j < lines.length && lines[j].trim(); j++) block.push(lines[j].slice(Math.min(indent.length, lines[j].search(/\S|$/))));
      out.push(indent + '> [!' + kind + ']');
      out.push(indent + '>');
      block.forEach((b) => out.push(indent + '> ' + b));
      i = j - 1;
      continue;
    }
    // Artikel-Ueberschriften beginnen bei ####; im Artikel werden daraus h3...h6.
    const n = m[2].length;
    const level = n >= 4 ? n - 1 : 3;
    out.push(indent + '#'.repeat(level) + ' ' + m[3]);
  }
  return out.join('\n');
}

function build() {
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md'))
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.replace('.md', '')), ib = ORDER.indexOf(b.replace('.md', ''));
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
    });
  const parsed = files.map((f) => parseFile(path.join(SRC, f)));

  // Globale Verzeichnisse fuer die Link-Umschreibung.
  const byId = {};
  const byTitle = {};
  parsed.forEach((p) => p.articles.forEach((a) => {
    byId[a.id] = a;
    byTitle[a.title.toLowerCase()] = byTitle[a.title.toLowerCase()] || { id: a.id, anchor: '' };
  }));
  // Ueberschriften innerhalb der Artikel (fuer Links der Form support.phrase.com#UUID "Titel").
  const headingTarget = {};
  parsed.forEach((p) => p.articles.forEach((a) => {
    let fence = false;
    a.body.forEach((l) => {
      if (/^\s*```/.test(l)) fence = !fence;
      const m = fence ? null : /^\s*#{4,6} (.+?)\s*$/.exec(l);
      if (m && !CALLOUTS[m[1].toLowerCase()]) {
        const k = m[1].toLowerCase();
        if (!headingTarget[k]) headingTarget[k] = { id: a.id, anchor: slug(m[1]) };
      }
    });
  }));

  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = 'h-' + slug(decode(text.replace(/<[^>]+>/g, '')));
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  renderer.table = function (token) {
    const cell = (c, tag) => `<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
    const head = '<tr>' + token.header.map((c) => cell(c, 'th')).join('') + '</tr>';
    const body = token.rows.map((r) => '<tr>' + r.map((c) => cell(c, 'td')).join('') + '</tr>').join('');
    return `<div class="tbl"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
  };
  renderer.blockquote = function ({ tokens }) {
    const inner = this.parser.parse(tokens);
    const m = /^<p>\[!(note|tip|important)\]\s*(?:<\/p>)?/.exec(inner);
    if (m) {
      const label = { note: 'Note', tip: 'Tip', important: 'Important' }[m[1]];
      return `<div class="callout ${m[1]}"><div class="callout-t">${label}</div>${inner.slice(m[0].length).replace(/^\s*<\/p>/, '')}</div>\n`;
    }
    return `<blockquote>${inner}</blockquote>\n`;
  };
  renderer.image = function ({ href, title, text }) {
    return `<img src="${esc(href)}" alt="${esc(text || '')}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" referrerpolicy="no-referrer">`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const h = String(href || '');
    const am = ARTICLE_RE.exec(h);
    let target = null;
    if (am && byId[am[1]]) target = { id: am[1], anchor: '' };
    if (!target && /^https:\/\/support\.phrase\.com\/?#/.test(h) && title) target = headingTarget[title.toLowerCase()] || byTitle[title.toLowerCase()] || null;
    if (!target && am && title) target = byTitle[title.toLowerCase()] || null;
    if (target) return `<a href="#/a/${target.id}${target.anchor ? '/' + target.anchor : ''}" data-kb="${target.id}">${text}</a>`;
    if (/^https:\/\/support\.phrase\.com\/?#/.test(h)) return `<span class="xref">${text}</span>`;
    if (/^https?:/.test(h)) return `<a href="${esc(h)}" target="_blank" rel="noopener noreferrer"${title ? ` title="${esc(title)}"` : ''}>${text}</a>`;
    return text;
  };
  marked.use({ renderer, gfm: true });

  const manifest = { built: new Date().toISOString().slice(0, 10), products: [], articles: [] };
  const chunks = [];
  let chunk = {};
  let chunkSize = 0;
  const pushChunk = () => { if (Object.keys(chunk).length) { chunks.push(chunk); chunk = {}; chunkSize = 0; } };

  parsed.forEach((p, pi) => {
    const exported = p.articles.length;
    manifest.products.push({
      key: p.product.key, name: p.product.name, desc: p.product.desc, url: p.product.url,
      sections: p.sections.map((s) => ({ t: s.path.join(' › '), d: s.desc, u: s.url }))
    });
    p.articles.forEach((a) => {
      const html = marked.parse(preprocess(a.body.join('\n')));
      const heads = [...html.matchAll(/<h([34]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map((m) => [Number(m[1]), m[2], decode(m[3].replace(/<[^>]+>/g, ''))]);
      const bytes = Buffer.byteLength(safeJson({ [a.id]: html }), 'utf8');
      if (chunkSize + bytes > CHUNK_BYTES) pushChunk();
      chunk[a.id] = html;
      chunkSize += bytes;
      manifest.articles.push({
        id: a.id, p: pi, s: a.section, t: a.title, u: a.url, d: (a.updated || '').slice(0, 10),
        c: chunks.length + 1, h: heads.filter((x) => x[0] === 3).map((x) => [x[1], x[2]])
      });
    });
    if (!exported) console.warn('Keine Artikel in ' + p.product.key);
  });
  pushChunk();

  // Alte Pakete entfernen, neue schreiben.
  fs.readdirSync(APP).filter((f) => /^KbData\d+\.html$/.test(f)).forEach((f) => fs.unlinkSync(path.join(APP, f)));
  chunks.forEach((c, i) => fs.writeFileSync(path.join(APP, 'KbData' + (i + 1) + '.html'), safeJson(c)));
  manifest.chunks = chunks.length;

  const kbFile = path.join(APP, 'Knowledgebase.html');
  const kb = fs.readFileSync(kbFile, 'utf8');
  const re = /<!--KB_MANIFEST-->[\s\S]*?<!--\/KB_MANIFEST-->/;
  if (!re.test(kb)) throw new Error('Marker <!--KB_MANIFEST--> fehlt in Knowledgebase.html');
  const block = '<!--KB_MANIFEST--><script type="application/json" id="kbManifest">' + safeJson(manifest) + '</script><!--/KB_MANIFEST-->';
  fs.writeFileSync(kbFile, kb.replace(re, () => block));

  // Anzahl Pakete auch serverseitig (apiKbChunk erlaubt nur 1..N).
  const gsFile = path.join(APP, 'KnowledgebaseApi.gs');
  const gs = fs.readFileSync(gsFile, 'utf8').replace(/var KB_CHUNK_COUNT_ = \d+;/, 'var KB_CHUNK_COUNT_ = ' + chunks.length + ';');
  fs.writeFileSync(gsFile, gs);

  const total = manifest.articles.length;
  console.log(`Knowledge Base: ${manifest.products.length} Produkte, ${total} Artikel, ${chunks.length} Pakete`);
  manifest.products.forEach((p, i) => console.log('  ' + p.name + ': ' + manifest.articles.filter((a) => a.p === i).length + ' Artikel, ' + p.sections.length + ' Bereiche'));
  return manifest;
}

module.exports = { parseFile, preprocess, safeJson, build };

if (require.main === module) build();
