# Struktur-Standard aller Kärcher-Translation-Repositories

Vorbild ist der **Prompt Hub**. Seit dem Umbau (Branch `claude/practical-bohr-d9wt57`, Oktober 2026) sind alle zehn Repositories gleich aufgebaut. `tools/check-structure.js` (in jedem Repo identisch) prüft den Aufbau in der CI und in `npm run check`.

## Verzeichnisbaum

```
<repo>/
├── src/                  Apps-Script-Code inkl. appsscript.json (clasp rootDir)
├── tests/                Node-Tests, Einstieg tests/run-all.js
│   └── gas.syntax.test.js   Standard: Syntax jeder src/*.gs, Manifest, keine doppelten Top-Level-Namen
├── tests-ui/             (optional) Browser-Tests mit Playwright
├── tools/
│   ├── check-structure.js   Standard: prüft diesen Aufbau
│   └── check-encoding.js    Wächter gegen kaputte Umlaute (Altlasten in encoding-baseline.json)
├── docs/
│   ├── DOKUMENTATION.md     fachlich + Standard-Anhang A–E
│   ├── ENDPOINTS.md         alle Phrase- und sonstigen Endpunkte
│   ├── CI-CD.md             Pipeline, Secrets, Release
│   └── mockups/             (optional)
├── dist/                 (optional) Kopiervorlagen, nicht Teil des Apps-Script-Projekts
├── ui/, prompts/, kb-src/, gemini-gem/, workflows/, integration/   (repo-spezifische Quellen)
├── .github/
│   ├── workflows/ci.yml, workflows/deploy.yml
│   ├── actions/clasp-deploy/action.yml   clasp push (rootDir src) + optional clasp deploy
│   ├── dependabot.yml, CODEOWNERS, pull_request_template.md
├── .claspignore, .gitignore, .gitleaks.toml, eslint.config.js, package.json
└── README.md             mit Verweis auf docs/DOKUMENTATION.md und docs/ENDPOINTS.md
```

## Einheitliche Befehle

| Befehl | Zweck |
|---|---|
| `npm ci` | Abhängigkeiten |
| `npm test` | Logik-Tests (immer mindestens der Standard-Syntaxtest) |
| `npm run lint` | ESLint |
| `npm run check` | Struktur + Kodierung (+ repo-spezifisch: generierte Dateien, Design, AutoFix-Spiegel) |
| `npm run ci` | alles zusammen |
| `npm run test:ui` | Browser-Tests (wo vorhanden) |

## Was sich je Repository geändert hat

| Repository | Umbau |
|---|---|
| Prompt-hub | Vorbild; ergänzt `tools/check-structure.js`, `tests/gas.syntax.test.js`, `docs/ENDPOINTS.md`; `tools/check-mirror.js` findet AutoFix-Code unter `src/` |
| autofix-hub | Code → `src/`, `Doget patch.gs` → `dist/`, Pfade in Tests/Tools, Struktur-Check in der CI |
| Analysis-and-Quote | Code → `src/`, Kodierungs-Wächter, PR-Vorlage, CI-CD.md, Doku neu |
| terminologie-hub | Code → `src/`, Kopiervorlage `apps-script/` → `dist/`, Tests/Tools angepasst |
| kaerchertranslationservices | 73 `.gs` + HTML → `src/`, `Index additions.html` → `dist/`, CI in `ci.yml` + `deploy.yml` + Deploy-Aktion getrennt, ESLint neu, 13 doppelte Funktionsnamen dokumentiert |
| term-author-checker | Code → `src/`, `ci/` → `tests/`, `package.json` + ESLint neu, Deploy über die gemeinsame Aktion |
| k-rcher-translation-add-on | Code → `src/`, CI/CD + ESLint neu, Manifest-Name „Kärcher“ korrigiert |
| autolqa-hub, phrase-notification-hub, articulate-rise-patcher | Code → `src/`, erstmals Tests, ESLint, CI/CD, README und Doku |

## Hinweis zum Apps-Script→GitHub-Sync

autolqa-hub, phrase-notification-hub und articulate-rise-patcher wurden bisher per Sync aus dem Apps-Script-Editor befüllt (Commits „Sync: Update …“). Ein solcher Sync schreibt Dateien in den Wurzelordner und passt nicht zu `src/` – `tools/check-structure.js` schlägt dann an. Künftig: im Repo ändern, per CI/CD (`clasp push`) deployen.
