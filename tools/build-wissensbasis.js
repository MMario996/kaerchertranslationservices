#!/usr/bin/env node
// Fasst die Wissensbasis (wissensbasis/00-08) und die Fachdokumente des Portals
// (docs/*.md) zu wissensbasis/KOMPLETT.md zusammen - eine Datei zum Hochladen
// in einen Gemini Gem. Aufruf: node tools/build-wissensbasis.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const kb = path.join(root, 'wissensbasis');

const chapters = fs.readdirSync(kb).filter((f) => /^\d\d-.+\.md$/.test(f)).sort();
const appendix = ['ARCHITEKTUR-UND-DATEN.md', 'API.md', 'UI-UX.md', 'AUFFAELLIGKEITEN.md'];

// Überschriften um eine Ebene tiefer setzen, damit jede Quelle unter ihrem eigenen # steht.
const demote = (text) => text.replace(/^(#{1,5}) /gm, '#$1 ');

let out = '# Kärcher Translation Tools – Wissensbasis (komplett)\n\n' +
  'Automatisch erzeugt aus `wissensbasis/*.md` und `docs/*.md` im Repo `kaerchertranslationservices` ' +
  '(`node tools/build-wissensbasis.js`). Nicht von Hand bearbeiten.\n\n' +
  '## Inhalt\n\n' +
  chapters.map((f) => '- ' + f).join('\n') + '\n' +
  appendix.map((f) => '- Anhang Translation Services: ' + f).join('\n') + '\n\n---\n\n';

for (const f of chapters) {
  out += '# Datei: ' + f + '\n\n' + demote(fs.readFileSync(path.join(kb, f), 'utf8').trim()) + '\n\n---\n\n';
}
for (const f of appendix) {
  out += '# Anhang Translation Services: docs/' + f + '\n\n' +
    demote(fs.readFileSync(path.join(root, 'docs', f), 'utf8').trim()) + '\n\n---\n\n';
}

fs.writeFileSync(path.join(kb, 'KOMPLETT.md'), out.trimEnd() + '\n');
console.log('wissensbasis/KOMPLETT.md: ' + Math.round(out.length / 1024) + ' KB aus ' + (chapters.length + appendix.length) + ' Dateien');
