/**
 * KnowledgebaseApi.gs
 *
 * Knowledge Base (?page=kb, Knowledgebase.html) mit der Phrase-Dokumentation
 * (TMS, Strings, Orchestrator, Portal, Studio, Global). Die Seite enthaelt nur
 * Inhaltsverzeichnis und Suche; die Artikel liegen in Paketen KbData1..N.html
 * (erzeugt von tools/build-kb.js aus kb-src/*.md) und werden hier einzeln
 * ausgeliefert - eine einzige Seite mit allen Artikeln (>1,4 MB) waere weit
 * ueber der Apps-Script-Grenze.
 *
 * Offen fuer alle Domain-Nutzer: es handelt sich um oeffentliche
 * Phrase-Hilfeartikel.
 */

// Wird von tools/build-kb.js gesetzt.
var KB_CHUNK_COUNT_ = 35;

/** Ein Artikel-Paket als JSON-Text ({ artikelId: html }). */
function apiKbChunk(n) {
  n = Number(n);
  if (!(n >= 1 && n <= KB_CHUNK_COUNT_ && Math.floor(n) === n)) throw new Error("Unknown knowledge base chunk: " + n);
  return HtmlService.createHtmlOutputFromFile("KbData" + n).getContent();
}
