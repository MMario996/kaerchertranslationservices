# Styleguide – Kärcher Translation Tools

Verbindliche Regeln für **Dokumentation, Code, Oberfläche und Betrieb** aller Repositories
rund um Kärcher Translation Services. Abgeleitet aus dem Portal `kaerchertranslationservices`,
dem ausgereiftesten Projekt. Bei Widersprüchen zwischen einem Repository und diesem
Styleguide gilt der Styleguide. Weicht ein Projekt bewusst ab, steht das in seiner
`docs/ARCHITEKTUR-UND-DATEN.md` unter „Abweichungen vom Styleguide“.

Geltungsbereich: `kaerchertranslationservices`, `autofix-hub`, `Prompt-hub`, `autolqa-hub`,
`Analysis-and-Quote`, `terminologie-hub`, `term-author-checker`, `eventcodes-debugger`,
`k-rcher-translation-add-on`.

> Quelle dieser Datei: `kaerchertranslationservices/docs/STYLEGUIDE.md`. In den anderen
> Repositories liegt eine Kopie. Änderungen immer zuerst hier machen und dann kopieren.

---

## 1. Grundprinzip

1. **Ohne Quellcode arbeitsfähig.** Die Dokumentation beschreibt ein Projekt so, dass ein Mensch
   **oder ein KI-Modell** (NotebookLM, Gemini Gem, Claude) damit arbeiten kann: Oberfläche
   bedienen und erweitern, Endpunkte aufrufen, Berechtigungen verstehen, typische Fehler vermeiden.
2. **Aus dem Code abgeleitet.** Jede Aussage stammt aus dem Code auf `main`. Jedes Dokumentpaket
   nennt den Stand (Commit). Bei Widersprüchen gilt der Code.
3. **Ehrlich.** Bekannte Fehler, Lücken und Risiken werden aufgeschrieben, nicht verschwiegen
   (`AUFFAELLIGKEITEN.md`). Unsicheres ist mit „(prüfen)“ markiert.
4. **Keine Zugangsdaten.** Token, Schlüssel, Passwörter und Client-Secrets stehen nie in Doku,
   Code, Tests oder Prompts – nur in den Script Properties. Namen von Properties dürfen
   genannt werden, Werte nie.
5. **Ein Muster für alle.** Gleiche Dateinamen, gleiche Abschnitte, gleiche Begriffe. Wer ein
   Projekt kennt, findet sich in jedem anderen sofort zurecht.

---

## 2. Dokumentation

### 2.1 Pflichtdateien je Repository

| Datei | Inhalt | Pflicht |
|---|---|---|
| `README.md` | Was das Projekt ist (1–3 Sätze), Oberfläche in einer Tabelle, Aufbau, Entwicklung (`npm`-Befehle), CI/CD in Kurzform, Link auf `docs/` | ja |
| `docs/README.md` | Inhaltsverzeichnis der Doku, Stand (Commit), Abschnitt „Einem Modell übergeben“ mit Einstiegs-Prompt | ja |
| `docs/ARCHITEKTUR-UND-DATEN.md` | Was die App ist, Systembild, Laufzeit-Eigenschaften, harte Grenzen, Dateien, Datenmodell (Sheets/Tabs/Spalten), Script Properties (nur Namen), Trigger, Deploy und Tests, Zusammenhang mit anderen Projekten | ja |
| `docs/API.md` | Aufrufmodell, Authentifizierung und Rollen, Berechtigungsmuster, Endpunkt-Katalog mit Recht je Funktion, HTTP-Einstiege, externe Dienste und ihre Authentifizierung | ja |
| `docs/UI-UX.md` | Zielgruppe und Grundsätze, Designsystem, Informationsarchitektur, Bildschirme, Zustände, Sprachen, Tastatur/Barrierefreiheit, Regeln für Änderungen | ja, wenn es eine Oberfläche gibt |
| `docs/AUFFAELLIGKEITEN.md` | Funde aus der Code-Analyse mit Schweregrad, Wirkung und Vorschlag | ja |
| `docs/SCHAUBILD.svg` + `docs/SCHAUBILD.png` | Architekturbild des Projekts (siehe 2.4) | ja |
| `docs/STYLEGUIDE.md` | Kopie dieses Styleguides | ja |
| `docs/CI-CD.md` | Pipeline im Detail | ja, wenn es eine Pipeline gibt |
| `docs/mockups/*.png` | Bildschirmfotos aus der echten Oberfläche (`npm run mockups`) | empfohlen |
| weitere Fachdateien | z. B. `PROMPT-MUSTER.md` (Prompt Hub), `USER-GUIDE.md` (Analysis Hub) | nach Bedarf |

Die Projektübergreifende Sicht liegt nur im Portal-Repository unter `docs/gesamt/`
(`GESAMTUEBERSICHT.md`, `SYSTEMLANDKARTE.svg/.png`).

### 2.2 Feste Abschnitte

**`docs/README.md`**

```markdown
# Dokumentation – <Produktname>
<1 Absatz: wofür diese Dokumente da sind>
Stand: aus dem Code auf `main` abgeleitet (Commit `abc1234`). Bei Widersprüchen gilt der Code.
| Datei | Inhalt | Wann lesen |
## Einem Modell übergeben
> Du arbeitest an <Produkt>, einer Google-Apps-Script-<Web-App|Add-on> … (Einstiegs-Prompt)
Keine dieser Dateien enthält Zugangsdaten …
```

**`ARCHITEKTUR-UND-DATEN.md`**: Was die App ist · Systembild (ASCII-Baum) · Wichtige
Eigenschaften der Laufzeit · Harte Grenzen · Dateien · Datenmodell · Script Properties ·
Trigger · Deploy und Tests · Zusammenhang mit anderen Projekten · Abweichungen vom Styleguide.

**`API.md`**: 1. Aufrufmodell · 2. Authentifizierung und Rollen · 3. Endpunkt-Katalog
(Tabellen `Funktion | Recht | Zweck`) · 4. HTTP-Einstiege · 5. Externe Dienste.

**`UI-UX.md`**: 1. Zielgruppe und Grundsätze · 2. Designsystem · 3. Informationsarchitektur ·
4. Bildschirme · 5. Zustände und Rückmeldungen · 6. Sprachen · 7. Tastatur und
Barrierefreiheit · 8. Aufbau der Oberflächen-Dateien · 9. Regeln für Änderungen.

**`AUFFAELLIGKEITEN.md`**: Einleitung („Nicht behoben – Arbeitsgrundlage“) · Schweregrad-Legende ·
Sicherheit/Berechtigungen (`S1…`) · Namenskonflikte (`N1…`) · Fehler/Inkonsistenzen (`F1…`) ·
Betrieb/Wartbarkeit (`B1…`). Behobenes steht kurz darüber oder wird gestrichen.

### 2.3 Schreibregeln

| Regel | Beispiel |
|---|---|
| Deutsch, kurze Sätze, aktiv | „Der Poller holt alle 10 Minuten den nächsten Job.“ |
| Tabellen statt Fließtext, wo immer etwas aufgezählt wird | Endpunkte, Tabs, Properties, Rollen |
| Code-Namen in Backticks, exakt wie im Code | `apiHubRunNow`, `AUTOFIX_DB_SHEET_ID`, Tab `Run Log` |
| Oberflächen-Begriffe in Anführungszeichen, wie sie auf dem Bildschirm stehen | Reiter „Warteschlange“, Knopf „Veröffentlichen“ |
| Pfeile für Abläufe | Admin → Konfiguration → Webhook |
| Schweregrad mit Symbol | 🔴 hoch · 🟠 mittel · 🟡 niedrig |
| Unsicheres markieren | „… liest als Deploy-Konto. (prüfen)“ |
| Zahlen mit Einheit und Herkunft | „max. 6 Minuten pro Aufruf (Apps Script)“ |
| Phrase-Begriffe englisch lassen | Job, Workflow Step, Custom Field, Termbase, Quote |
| Keine Marketing-Sprache, keine Emojis im Fließtext | – |
| Diagramme als ASCII oder Mermaid **plus** Bilddatei | NotebookLM liest kein Mermaid, aber Bilder |

**Sheet-IDs, Phrase-UIDs und interne Links** dürfen genannt werden (sie sind ohne Berechtigung
nutzlos), machen die Doku aber **intern**: nur innerhalb von Kärcher teilen.

### 2.4 Schaubild

- Jedes Projekt hat ein `docs/SCHAUBILD.svg` und ein daraus erzeugtes `docs/SCHAUBILD.png`.
- Aufbau immer gleich, von links nach rechts: **Nutzer und Einstiege** → **die App** (mit ihren
  Bausteinen) → **externe Dienste**; darunter die **Datenablage** (Sheets, Properties, Drive).
- Farben: App = Kärcher-Gelb `#FFED00` mit schwarzer Schrift; externe Dienste = Weiß mit grauer
  Linie; Datenablagen = Hellgrau `#F5F5F5` als Zylinder; Pfeile dunkelgrau `#3a3a3a`,
  beschriftet mit dem, was fließt.
- Schrift Helvetica/Arial, Titel in Großbuchstaben. Keine Logos, keine Fotos.
- Das Gesamtbild aller Projekte ist `docs/gesamt/SYSTEMLANDKARTE.svg` im Portal-Repository.

### 2.5 Aktuell halten

Die Doku wird **im selben Pull Request** angepasst, der das Verhalten ändert:

| Änderung im Code | Datei(en) anpassen |
|---|---|
| neuer oder geänderter Endpunkt, neues Recht | `API.md` |
| neues Sheet, neuer Tab, neue Spalte, neue Script Property, neuer Trigger | `ARCHITEKTUR-UND-DATEN.md` |
| neuer Bildschirm, neuer Reiter, neue Komponente | `UI-UX.md`, Mockups |
| neue Abhängigkeit zu einem anderen Projekt oder Dienst | `ARCHITEKTUR-UND-DATEN.md`, `SCHAUBILD.*`, `docs/gesamt/` im Portal |
| Fund behoben | Eintrag in `AUFFAELLIGKEITEN.md` streichen oder als „Behoben“ vermerken |

Danach den Stand (Commit) in `docs/README.md` aktualisieren.

### 2.6 Paket für NotebookLM / Gemini Gem

Je Projekt ein Ordner bzw. ZIP mit: `README.md`, allen Dateien aus `docs/` (ohne Mockups),
`SCHAUBILD.png`, `STYLEGUIDE.md`, dazu `GESAMTUEBERSICHT.md` und `SYSTEMLANDKARTE.png` aus dem
Portal. In NotebookLM jede Datei einzeln als Quelle hochladen (bessere Quellenangaben als eine
große Datei).

---

## 3. Repository-Struktur

Ziel-Struktur (neue Projekte sofort so, bestehende bei Gelegenheit):

```
src/        Apps-Script-Code (.gs, .html, appsscript.json) – clasp rootDir
ui/         Quelle der Oberfläche (shell.html, base.css, app.css, i18n.js, app.js)
            → wird zu src/Index.html gebaut (npm run build), nie Index.html von Hand ändern
tests/      Node-Tests mit simulierten Google-Diensten (tests/run-all.js)
tests-ui/   Browser-Tests (Playwright/Chromium) gegen die echte Oberfläche mit Mock-Backend
tools/      Build-, Vorschau-, Mockup- und Prüfskripte
docs/       Dokumentation nach Abschnitt 2, mockups/
.github/    workflows/ci.yml, workflows/deploy.yml, actions/clasp-deploy/, dependabot.yml,
            pull_request_template.md, CODEOWNERS
.claspignore, .gitleaks.toml, eslint.config.js, package.json
```

Projekte ohne `src/` (Code im Wurzelverzeichnis) schreiben das in „Abweichungen vom Styleguide“.

---

## 4. Code-Konventionen (Google Apps Script)

### 4.1 Namen und Sichtbarkeit

| Regel | Warum |
|---|---|
| Vom Browser aufrufbare Funktionen heißen `api…` (bzw. `apiHub…` in den Hubs) | sofort erkennbar, was öffentlich ist |
| **Interne Helfer enden auf `_`** | Apps Script macht jede globale Funktion ohne `_` per `google.script.run` für jeden Nutzer der Web-App aufrufbar |
| Konstanten in `GROSS_MIT_UNTERSTRICH_` | Konvention aller Projekte |
| **Kein Funktionsname doppelt** – über alle Dateien | alle `.gs` teilen einen globalen Namensraum; bei Doppelten gewinnt still die zuletzt geladene Datei |
| Dateinamen ohne Leerzeichen und Tippfehler | Kopiervorlagen (`Doget patch.gs`) und Tippfehler (`Articualtepreview.gs`) führen zu Fehlern beim Einspielen |

### 4.2 Berechtigungen

```js
function apiDoSomething(arg) {
  return api_(function () {             // fängt Fehler, liefert { success:false, error }
    var email = requireRole_('editor'); // 1. Wer ruft auf? Darf er das? Sonst throw
    validate_(arg);                     // 2. Eingaben prüfen (Typ, Länge, erlaubte Werte)
    var res = doTheWork_(arg);          // 3. Arbeit in einem Helfer mit _
    audit_(email, 'AKTION', '…');       // 4. Wichtige Änderungen protokollieren
    return { result: res };             // 5. Antwort ohne Geheimnisse
  });
}
```

- **Jede** öffentliche Funktion prüft das Recht **selbst**. Ausblenden im Browser schützt nichts.
- Identität nur über `Session.getActiveUser().getEmail()` (in Triggern und Chat-Events leer – dort
  die E-Mail aus dem Event übergeben).
- „Offener Modus“ (kein Admin eingetragen = alle dürfen alles) nur als Übergang und mit
  sichtbarem Hinweis in der App.
- Rollen und Zugriffslisten: in einer Script Property (JSON) oder einem Tab, nie im Code.

### 4.3 Antworten

- Einheitlich `{ success: true, … }` bzw. `{ success: false, error: "verständliche Meldung" }`.
- Keine Mischformen (`ok` / `success`) in neuem Code; Altbestand in `API.md` dokumentieren.
- Nur serialisierbare Werte (Strings, Zahlen, Booleans, Arrays, einfache Objekte); Datum als
  ISO-String; Dateien als Base64 oder Drive-ID.

### 4.4 Konfiguration und Geheimnisse

| Was | Wo |
|---|---|
| Token, API-Keys, Service-Account-Schlüssel | Script Properties, nur schreibbar in der Oberfläche, Anzeige maskiert |
| Sheet-IDs, Ordner-IDs, Webhooks | Script Properties oder Settings-Tab; ein Standardwert im Code ist erlaubt, wenn er in `ARCHITEKTUR-UND-DATEN.md` steht |
| Fachliche Einstellungen | Tab `Settings` (Key/Value) bzw. JSON-Property `<APP>_CONFIG` |
| Persönliche Einstellungen | User Properties oder Tab `UserPrefs` |

Fehlertexte von Phrase oder dem Gemini-Proxy vor der Anzeige von gespiegelten Schlüsseln
befreien (Muster: `_redactSecrets_()` in TermCheck).

### 4.5 Laufzeit und Stabilität

- **6 Minuten pro Aufruf** (Add-ons: 30 Sekunden). Lange Arbeit in Etappen aufteilen: der
  Browser ruft Datei für Datei bzw. Schritt für Schritt auf; Fortschritt über `CacheService`.
- Zeitgesteuerte Läufe mit `LockService` und einer Lauf-Sperre mit Zeitlimit absichern.
- **Trigger im Apps-Script-Editor anlegen**, nicht aus der Web-App: Aus der Web-App angelegte
  Trigger bleiben an die damalige Bereitstellungsversion gebunden.
- Externe Aufrufe mit `muteHttpExceptions: true`, Wiederholung bei 429/5xx mit wachsender Pause,
  parallel nur über `UrlFetchApp.fetchAll` in kleinen Paketen.
- Script Properties sind auf ca. 500 KB begrenzt: keine wachsenden Listen dort ablegen
  (oder regelmäßig bereinigen).
- Sheets: Spalten über die Kopfzeile suchen, nicht über feste Indizes; Werte, die mit
  `= + - @` beginnen, mit `'` speichern.

### 4.6 Zeichenkodierung

Alle Dateien UTF-8. Umlaute im Code und in Prompts sind erlaubt und erwünscht
(„Kärcher“, nicht „Karcher“ und nie mit `?` statt `ä`). Der Kodierungs-Wächter
(`tools/check-encoding.js`, Basislinie `tools/encoding-baseline.json`) lässt keine neuen kaputten
Zeichen zu.

### 4.7 Externe Dienste – gemeinsame Werte

| Dienst | Basis | Authentifizierung |
|---|---|---|
| Phrase TMS | `https://cloud.memsource.com/web/api2/v1` (`v2`, `v3` je nach Endpunkt) | `Authorization: Bearer <PHRASE_API_TOKEN>` |
| Gemini | Kärcher-Proxy `https://34-111-99-134.nip.io/gemini/v1beta/models/<modell>:generateContent` | Header `x-api-key: <GEMINI_API_KEY>` |
| Google Chat | Webhook (`https://chat.googleapis.com/…`) oder Service Account (`chat.bot`) | Webhook-URL bzw. `CHAT_CLIENT_EMAIL`/`CHAT_PRIVATE_KEY` |
| Mail | `MailApp`/`GmailApp` | Konto, unter dem das Skript läuft |

Standardmodell für neue Funktionen: `gemini-3.6-flash` (über den Proxy sicher freigeschaltet).

---

## 5. Oberfläche: Designsystem „Kaercher Glass“

Überträgt die Prinzipien von [plass-ui](https://github.com/MMario996/plass-ui) auf die Kärcher-CI
(Gelb/Schwarz). Referenz: Ende von `Styles.html` im Portal; in den Hubs `ui/base.css`
(gemeinsame Basis, in allen Hubs **byte-gleich**) plus `ui/app.css` (Glass-Schicht).

### 5.1 Prinzipien

1. **Aktion = getönte Fläche.** Primärbuttons haben einen gelben Verlauf und einen gelblichen
   Schatten. Eine Hauptaktion pro Ansicht.
2. **Inhalt = klares Glas.** Karten, Navigation und Panels sind halbtransparent weiß mit
   Weichzeichner und weißer Haarlinie.
3. **Tiefe nur über Licht und Schatten.** Nichts verschiebt oder vergrößert sich beim Hover; es
   wird heller oder bekommt mehr Schatten.
4. **Ruhig.** Eingebettet in Google Sites: kein eigenes Logo, keine zweite Kopfzeile,
   in den Hubs keine Icon-Schrift (Text statt Icons; Ausnahme Glocke und Einstellungen).
5. **Nur zeigen, was die Person darf.** Reiter und Knöpfe je Rolle ausblenden – und auf dem
   Server trotzdem prüfen.

### 5.2 Tokens

**Glass-Schicht (`--kg-*`, Portal und Hubs)**

| Token | Wert | Verwendung |
|---|---|---|
| `--primary-yellow` / `--yellow` | `#FFED00` | Kärcher-Gelb: aktive Reiter, Akzentkanten, Fortschritt |
| `--primary-black` | `#000000` | Text auf Gelb, aktive Segmente |
| `--kg-fill` | Verlauf `#FFED00 → #FFD500` | Primärbuttons |
| `--kg-ink` | Verlauf `#1c1c1c → #3b3b3b` | schwarze Buttons, aktives Segment (Text gelb) |
| `--kg-tint` / `--kg-tint-hi` | gelber Schatten | Primärbutton normal / Hover |
| `--kg-glass` / `--kg-glass-hi` | Weiß 70 % / 86 % | Sekundärbuttons, Navigation |
| `--kg-hair` | Weiß 75 % | Haarlinie um Glasflächen |
| `--kg-blur` | `blur(20px) saturate(160%)` | `backdrop-filter` |
| `--kg-elev` / `--kg-elev-hi` | weiche Doppelschatten | Karten / Hover |
| `--kg-ring` | `0 0 0 3px rgba(255,221,0,.6)` | Fokusring |
| `--kg-r` / `--kg-r-lg` | 12 px / 18 px | Radius Buttons / Karten |
| `--kg-ease` | `cubic-bezier(.16,.9,.3,1)` | Übergänge |
| `--kg-wash` | `#f4f4f0` | Seitenhintergrund |

**Basis (`ui/base.css` der Hubs)**

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--ink`, `--ink-2`, `--ink-3` | `#333`, `#666`, `#888` | `#c9c9c9`, `#a6a6a6`, `#8f8f8f` | Text, Sekundärtext, Hinweise |
| `--surface` … `--surface-4` | `#fff` … `#e0e0e0` | `#1a1a1a` … `#333` | Flächen |
| `--line`, `--line-h` | `#e0e0e0`, `#ccc` | `#414141`, `#4a4a4a` | Linien |
| `--ok` / `--ok-bg` | `#0d652d` / `#e6f4ea` | `#9fd5ae` / `#1e3326` | Erfolg |
| `--bad` / `--bad-bg` | `#d93025` / `#fce8e6` | `#f2a3a3` / `#3a1d1d` | Fehler |
| `--warn` / `--warn-bg` | `#856404` / `#fff3cd` | `#ecd98f` / `#3a3212` | Warnung, Wartung |
| `--info` / `--info-bg` | `#174ea6` / `#e8f0fe` | `#a8c7fa` / `#1b2638` | Hinweis |
| `--ins-*` / `--del-*` | grün / rot | grün / rot | Diff: eingefügt / gelöscht |

Keine neuen Hex-Werte im Code: Farben nur über Tokens. Nach CSS-Änderungen im Portal
`node tools/gen-dark-theme.js`; in den Hubs gilt der Dunkelmodus über `html[data-theme="dark"]`.

### 5.3 Typografie

- Schrift `"Helvetica Neue", Helvetica, Arial, sans-serif`; Monospace
  `"SFMono-Regular", Menlo, Consolas, monospace`.
- Grundgröße 14 px, Eingabefelder 16 px (kein Zoom auf iOS), Tabellen 13–14 px.
- **Abschnittstitel, Reiter und Buttons in Großbuchstaben, fett (700–800), leichtes
  Letter-Spacing** – typisch Kärcher.

### 5.4 Komponenten

| Komponente | Regel |
|---|---|
| Hauptreiter | kleben oben; aktiv = gelbe 3-px-Unterkante; Admin-Reiter aktiv = rote Unterkante |
| Unterreiter / Segmente | Glas-Leiste; aktiv = schwarz mit gelbem Text |
| Karte | Radius 18 px, weicher Schatten; Formulare bestehen aus Karten im Raster |
| Primärbutton | gelb (`--kg-fill`), eine pro Ansicht |
| Sekundärbutton | Glas; Toolbar-Aktionen (Aktualisieren, Export) |
| Schwarzer Button | starke Nebenaktion |
| Modal | **6 px gelbe Oberkante**, Titel in Großbuchstaben, Schließen-X oben rechts, Aktionen rechts unten (Abbrechen links vom Primärbutton), Hintergrund abgedunkelt mit Blur |
| Dialoge | eigene `showCustomAlert/Confirm/Prompt`, **nie** Browser-`alert/confirm/prompt` |
| Toast | unten rechts, dunkel; Erfolg grüne, Fehler rote Kante; optional Link „Öffnen“ |
| Status | Pille in Großbuchstaben, 10–11.5 px; offen = Gelb, erledigt = Grün, abgebrochen = Rot hell, überfällig = Rot fett |
| Tabelle | sortierbare Spalten, Filter im Kopf, horizontal scrollbar, große Mengen gekappt (Rest im Export) |
| Kennzahl-Kachel | große Zahl, kleine Beschriftung in Großbuchstaben darunter |
| Diff | Wort-Diff mit `--ins-*` / `--del-*` |
| Banner | Wartung (`--warn`), offener Modus, Simulation „Ansicht als“ |

### 5.5 Zustände

| Zustand | Muster |
|---|---|
| Laden | Ladeanzeige mit Text („Lade Projekte …“); Knöpfe während der Aktion deaktiviert |
| Leer | zentrierter grauer Text, was zu tun ist („Noch keine Läufe. Lauf starten?“) |
| Erfolg | Toast oder kurzer grüner Text im Dialog |
| Fehler | Dialog mit verständlicher Meldung **und** dem Weg zur Lösung |
| Kein Zugriff | Vollbild-Hinweis mit Antrag auf Zugang (Benachrichtigung der Admins per Chat/Mail) |
| Lange Vorgänge | gelber Fortschrittsbalken mit Prozent bzw. „Datei 3 von 12“ |
| Wartung | Banner oben, Aktionen gesperrt |

### 5.6 Layout

- Volle Breite, Innenabstand 25 px (≤ 900 px: 10–12 px).
- Mobil ab 390 px nutzbar: Karten einspaltig, Toasts volle Breite, Tabellen scrollen.
- Läuft meist **eingebettet in Google Sites**: `setXFrameOptionsMode(ALLOWALL)`, Links mit
  `target="_top"` oder `_blank`.
- Darstellungsoptionen je Person: Hell/Dunkel/System, Schriftgröße, Dichte, Bewegung reduzieren.

### 5.7 Workspace-Add-ons (Karten)

Add-ons (Translation Add-on, TermCheck) nutzen `CardService`: Farben `primaryColor #FFED00`,
`secondaryColor #3A3A3A`; Kopf mit Produktname, eine Hauptaktion je Karte, Fehler als eigene
Karte mit Ursache, Lösung und „Technische Details“; Laufzeit unter 30 Sekunden halten
(Etappen, eigene Web-App-Fenster für lange Arbeit).

---

## 6. Texte und Sprache in der Oberfläche

- **Du-Form**, freundlich und knapp: „Lade deine Projekte …“, „Bitte wähle eine Datei.“
- Phrase-Fachbegriffe für Nicht-Profis übersetzen (Workflow-Schritt → „Bearbeitungsschritt“),
  IDs aber sichtbar lassen (Support braucht sie).
- Fehlermeldungen sagen **was passiert ist, warum und was zu tun ist**:
  „PDFs können nicht übersetzt werden. Bitte die bearbeitbare Quelldatei hochladen.“
- **Jeder sichtbare Text hat einen i18n-Schlüssel** (`data-i18n`, `tr_()`); mindestens Deutsch und
  Englisch, im Portal zusätzlich fr, es, pt, zh. Tests prüfen, dass jeder Schlüssel existiert.
- Datum für Menschen `TT.MM.JJJJ` bzw. `en-GB`, an den Server immer ISO.
- „Kärcher“ immer mit Umlaut.

---

## 7. Tastatur und Barrierefreiheit

| Taste | Aktion (wo vorhanden) |
|---|---|
| `Strg/⌘ + K` oder `/` | Suche/Befehle |
| `N` | Neu (Projekt, Vorschlag) |
| `H` | Start |
| `?` | Übersicht der Tastenkürzel |
| `Esc` | Dialog/Panel schließen |
| `Strg/⌘ + S` | Speichern im Editor |

Kürzel greifen nicht in Eingabefeldern. Sichtbarer Fokusring (`--kg-ring`), `aria-live` für
Meldungen, `prefers-reduced-motion` beachten, Icon-Buttons mit Text oder `aria-label`.

---

## 8. Tests und CI/CD

Standard-Pipeline (Vorbild AutoFix Hub / Prompt Hub, Details je Repo in `docs/CI-CD.md`):

| Stufe | Befehl | Prüft |
|---|---|---|
| Lint & Qualität | `npm run lint`, `npm run check` | ESLint; generierte Dateien aktuell (`Index.html`); Zeichenkodierung; Design-Wächter (keine Icon-Schriften, Logos, externen Skripte; Tokens vorhanden) |
| Logik | `npm test` | Server-Logik mit simulierten Google-Diensten: Rollen, Schutz jeder öffentlichen Funktion, Einstellungen, Konsistenz Oberfläche ↔ Server (jeder Aufruf existiert, jeder Text übersetzt) |
| Oberfläche | `npm run test:ui` | echte Seite in Chromium mit Mock-Backend: Start ohne JS-Fehler, alle Reiter, Rollen, Dark Mode, mobil 390 px |
| Mockups | `npm run mockups` | Bildschirmfotos als Artefakt an jedem Lauf |
| Sicherheit | gitleaks, `npm audit` | keine Secrets, keine bekannten Lücken ab „high“ |
| Deploy | `deploy.yml` | Push auf `main` → Staging; Tag `v*.*.*` → Produktion nach Freigabe; `clasp push` + `clasp deploy` + Gegenprobe |

Secrets in GitHub: `CLASPRC_JSON`, `STAGING_SCRIPT_ID`, `STAGING_DEPLOYMENT_ID`,
`PROD_SCRIPT_ID`, `PROD_DEPLOYMENT_ID` (Portal: `APPS_SCRIPT_ID`,
`APPS_SCRIPT_DEPLOYMENT_ID`). Fehlen sie, wird übersprungen statt fehlzuschlagen.
**GitHub ist die Code-Quelle:** `clasp push` ersetzt den Code im Apps-Script-Projekt vollständig;
Änderungen nie nur im Editor machen.

---

## 9. Checkliste für jeden Pull Request

- [ ] Jede neue öffentliche Funktion prüft das Recht selbst; interne Helfer enden auf `_`.
- [ ] Kein Funktionsname doppelt (`npm test` bzw. Konsistenztest).
- [ ] Antwortformat `{ success, error }`.
- [ ] Keine Zugangsdaten im Code, in Tests, Doku oder Logs.
- [ ] Farben nur über Tokens, Dialoge über die eigenen Dialog-Funktionen, Nutzerdaten escaped.
- [ ] Jeder neue Text übersetzt.
- [ ] `npm run lint`, `npm test`, `npm run test:ui` grün; Mockups angesehen.
- [ ] Doku im selben PR angepasst (Tabelle in 2.5), Stand in `docs/README.md` aktualisiert.
- [ ] Neue Abhängigkeit zu einem anderen Projekt → Schaubild und `docs/gesamt/` im Portal.
