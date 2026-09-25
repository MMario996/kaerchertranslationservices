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
