# CI/CD

Gleicher Aufbau wie in allen Kärcher-Translation-Repositories (Vorbild: Prompt Hub). Der Apps-Script-Code liegt unter `src/` und wird per `clasp` (rootDir `src`) hochgeladen.

```
Pull Request ─────────► CI
nachts ───────────────► CI
push auf main ────────► CI ──► Deploy (clasp push + optional deploy)
manuell (Actions) ────► CI ──► Deploy
```

| Workflow | Datei | Auslöser |
|---|---|---|
| CI | `.github/workflows/ci.yml` | Pull Requests, nachts, manuell, von CD aufgerufen |
| CD | `.github/workflows/deploy.yml` | Push auf `main`, manuell |
| Deploy-Aktion | `.github/actions/clasp-deploy/` | `clasp push --force`, optional `clasp deploy --deploymentId` |
| Dependabot | `.github/dependabot.yml` | wöchentliche Updates für npm und Actions |

## Was CI prüft

| Job | Befehl | Prüft |
|---|---|---|
| Lint & Qualität | `npm run lint`, `npm run check` | ESLint, Struktur, Zeichenkodierung |
| Logik-Tests | `npm test` | Server-Logik, Konsistenz Oberfläche/Server, Knowledge Base, Standard-Syntaxtest (Node 20/22) |
| Oberfläche | `npm run test:ui` | Start ohne JS-Fehler, Startseite, Admin-Kacheln, Template-Debugger, Knowledge Base (Chromium) |
| Sicherheit | gitleaks, `npm audit` | keine Secrets, keine bekannten Lücken |

Lokal vor jedem Push:

```bash
npm ci
npm run ci
```

## Einrichtung (einmalig)

1. **Apps Script API einschalten** für das Deploy-Konto: <https://script.google.com/home/usersettings>.
2. **clasp-Anmeldung** lokal: `npx @google/clasp@2.4.2 login`, Inhalt von `~/.clasprc.json` als Secret `CLASPRC_JSON`.
3. **Secrets:**

   | Secret | Wo | Inhalt |
   |---|---|---|
   | `CLASPRC_JSON` | Repository | Inhalt von `~/.clasprc.json` |
   | `APPS_SCRIPT_ID` | Repository | Script-ID des Portal-Projekts |
   | `APPS_SCRIPT_DEPLOYMENT_ID` | Repository (optional) | Web-App-Bereitstellung, die auf die neue Version zeigen soll |

Fehlen die Secrets, wird der Deploy mit einem Hinweis übersprungen statt fehlzuschlagen.

> **Achtung:** `clasp push` ersetzt den kompletten Code im Apps-Script-Projekt. Änderungen, die nur im Online-Editor gemacht wurden, gehen verloren. Ein Sync „Apps Script → GitHub“, der Dateien in den Wurzelordner schreibt, passt nicht mehr zur Struktur mit `src/`; `tools/check-structure.js` schlägt dann an.
