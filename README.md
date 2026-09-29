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
  auf, jeder Übersetzungsschlüssel existiert). Läuft automatisch bei jedem Pull Request
  (`.github/workflows/tests.yml`).
- **In der App:** Admin → **Tests** (`SelfTests.gs`). Prüft in der echten Apps-Script-Umgebung
  Logik, Script Properties, Oberflächen-Dateien, Übersetzungen, Sheets sowie Phrase- und
  Drive-Anbindung. Nur lesend. Für Admin-Light-Nutzer über das Recht „Tests“ freigebbar.
