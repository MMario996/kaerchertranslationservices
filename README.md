# kaerchertranslationservices
Kärcher Translation Services – Google-Apps-Script-Web-App (Portal für Übersetzungsprojekte über Phrase TMS).

## Aufbau der Oberfläche

`Index.html` ist nur noch das Gerüst. Styles und Skripte liegen in eigenen Dateien und werden
serverseitig über `include()` (`WebApp.gs`) eingebunden:

| Datei | Inhalt |
|---|---|
| `Styles.html` | alle Styles |
| `JsCore.html` | Globale Variablen, Dialoge, Übersetzungen (DE/EN), Start |
| `JsForms.html` | Projektformulare, Navigation, Templates, Sprachen |
| `JsCampus.html` | Campus/Articulate |
| `JsNavigation.html` | Reiterwechsel, nachgeladene Bereiche (Anleitung, Admin) |
| `JsDocumentation.html` | Dokumentation: Import und Meine Projekte |
| `JsUpload.html` | Dateiauswahl, Drive-Picker, Absenden |
| `JsProjects.html` | Meine Projekte, Kalender, Detailansicht, Dashboard |
| `JsDownload.html` | Download-Dialog, Drive-Speichern, Notizen, Termin |
| `JsMisc.html` | Vorlagen, Admin-Hilfen, Tour, Selbsttest-Anzeige |
| `JsPersonal.html` | Einstellungen, Glocke, Tastenkürzel, Team-Ansicht, Kalender, Lader der Startseite |

Nachgeladen (nicht im Startdokument, das an der Apps-Script-Größengrenze liegt):

| Datei | Inhalt | Server |
|---|---|---|
| `HomeUi.html` | Startseite: Styles + Skript (Suche/Befehle, Schnellstart, Kennzahlen, Meine Arbeit, nächste Frist, 7 Tage, Aktivitäten, Tipps) | `apiGetHomeUi()` |
| `PrefsUi.html` | Markup des Einstellungsdialogs | `apiGetPrefsUi()` |
| `GuideContent.html`, `AdminConsole.html`/`AdminScript.html`, `DarkTheme.html` | Anleitung, Admin, dunkler Modus | siehe `WebApp.gs`/`UserPrefs.gs` |

**Design:** „Kaercher Glass“ (Ende von `Styles.html`) überträgt die Prinzipien von
[plass-ui](https://github.com/MMario996/plass-ui) auf die Kärcher-CI: Gedrücktes ist eine getönte
Fläche (Verlauf Gelb, Schatten in Gelb), Inhalt liegt auf klarem Glas (durchscheinend, Weichzeichner,
weiße Haarlinie), Tiefe entsteht nur über Licht und Schatten. Nach CSS-Änderungen
`node tools/gen-dark-theme.js` ausführen.

**Wichtig beim Synchronisieren nach Apps Script:** alle diese Dateien müssen im Apps-Script-Projekt
existieren. Fehlt eine, startet die Seite nicht. Der Selbsttest (Admin → Tests) prüft das.

Weitere Übersetzungen (fr/es/pt/zh) liegen in `I18nDicts.gs`.

## Tests

- **Lokal / GitHub:** `npm test` (Node ≥ 18, keine Abhängigkeiten). Prüft die Logik (Status,
  Archiv, Fristen, Kalender, Download-Auswahl, Notizen, Dateinamen) und die Konsistenz der
  Oberfläche (alle eingebundenen Dateien vorhanden, jeder Button ruft eine existierende Funktion
  auf, jeder Übersetzungsschlüssel existiert).
- **Oberfläche im Browser:** `npm ci && npm run test:ui` (Playwright/Chromium). Startet die echte
  Seite mit gemocktem `google.script.run` (`tools/build-preview.js`) und prüft: Start ohne
  JS-Fehler, Startseite zeigt nur eigene/geteilte Projekte, kein gelber Farbschleier, Kopfzeile klebt
  randlos oben, jede Reihe der Admin-Kacheln ist voll, User Template Debugger zeigt Ergebnis/Fehler.
  Vorschau zum Anschauen: `npm run preview` → `preview.html`.
- **CI/CD** (`.github/workflows/ci.yml`): beide Testläufe bei jedem Pull Request und auf `main`.
  Nach grünem CI auf `main` schiebt der Deploy-Job den Code per `clasp push` ins Apps-Script-Projekt
  (Dateiauswahl: `.claspignore`) und aktualisiert optional die Web-App-Bereitstellung. Dafür in
  GitHub → Settings → Secrets anlegen: `CLASPRC_JSON` (Inhalt von `~/.clasprc.json` nach
  `clasp login`), `APPS_SCRIPT_ID` (Projekteinstellungen → Script-ID), optional
  `APPS_SCRIPT_DEPLOYMENT_ID`. Ohne Secrets wird der Deploy übersprungen.
- **In der App:** Admin → **Tests** (`SelfTests.gs`). Prüft in der echten Apps-Script-Umgebung
  Logik, Script Properties, Oberflächen-Dateien, Übersetzungen, Sheets sowie Phrase- und
  Drive-Anbindung. Nur lesend. Für Admin-Light-Nutzer über das Recht „Tests“ freigebbar.

## Knowledge Base (`?page=kb`)

Eigenständige Seite mit der kompletten Phrase-Dokumentation (TMS, Strings, Orchestrator, Portal, Studio,
Global), einbettbar in Google Sites, voll durchsuchbar. Quelle sind die Markdown-Exporte in
`kb-src/*.md`. Nach einer Änderung dort (oder einem neuen Export):

```
npm ci && npm run build:kb
```

Das Skript (`tools/build-kb.js`) schreibt das Inhaltsverzeichnis in `Knowledgebase.html` und die
Artikel in Pakete `KbData1.html … KbDataN.html` (je ~120 KB, ein sehr langer Artikel ggf. allein; wegen der Apps-Script-Größengrenze).
Die Seite lädt die Pakete per `apiKbChunk(n)` (`KnowledgebaseApi.gs`) im Hintergrund nach; danach
läuft die Volltextsuche im Browser. Alle erzeugten Dateien committen – `clasp push` nimmt sie mit.
Links auf andere Phrase-Hilfeartikel zeigen, wenn der Artikel im Export ist, in die Knowledge Base.

## Phrase-Owner

Der Einreicher wird in allen Reitern (und Dokumentation, Pivot-Folgeprojekt) als **Owner** des
Phrase-Projekts gesetzt, der API-Funktionsuser bleibt nur Ersteller. Abschalten: Script Property
`PHRASE_SET_REAL_OWNER` = `false`. Ergebnis steht im Admin-Protokoll (`PHRASE_OWNER_SET` /
`PHRASE_OWNER_FAILED`, z. B. wenn der Einreicher keinen Phrase-User hat).

## Phrase Strings (Admin → Translate UI)

Token aus **Phrase Platform → Profil → Access tokens** (Dienst „Strings“, z. B.
`eu.phrase.com/idm-ui/settings/access-tokens`) sind Plattform-Token: sie werden automatisch am
IDM-Endpunkt (`https://eu.phrase.com/idm/oauth/token`, bzw. `us.` für die US-Region) gegen ein
JWT (ca. 4 h gültig, gecacht) getauscht und als `Bearer` gesendet. Klassische Strings-Token
(64 Hex-Zeichen) werden weiterhin direkt verwendet. „Verbindung prüfen“ zeigt die erkannte Art an.
