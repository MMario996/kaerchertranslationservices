# UI und UX

Wie das Portal aussieht, wie es sich bedient und nach welchen Regeln die Oberfläche gebaut und
erweitert wird. Technische Details der Server-Aufrufe stehen in `API.md`.

## 1. Zielgruppe und Grundsätze

- **Nutzer:** Kärcher-Mitarbeitende aus Fachbereichen (Marketing, Technische Dokumentation,
  Training/Campus, WOMA, Competence Center, KeC …), die Übersetzungen bestellen – keine
  Übersetzungsprofis, meist ohne Phrase-Kenntnisse. Dazu Admins des Übersetzungsteams.
- **Aufgaben in Häufigkeitsreihenfolge:** Status meiner Projekte sehen → fertige Übersetzung
  herunterladen → neues Projekt einreichen → Frist/Notiz ändern, teilen.
- **Grundsätze**
  1. *Nur zeigen, was die Person darf.* Reiter und Bereiche erscheinen je nach Rolle
     (siehe `API.md` → Rollen). Nutzer eines exklusiven Bereichs sehen nur diesen.
  2. *Phrase verstecken.* Fachbegriffe wie Workflow-Schritt, Job oder Template werden in
     einfache Sprache übersetzt; die Phrase-ID bleibt sichtbar, weil Support und Chat-Befehle
     sie nutzen.
  3. *Rückmeldung über mehrere Kanäle:* Toast im Portal, Glocke, Google-Chat-Nachricht,
     optional Kalendereintrag.
  4. *Fehler verständlich erklären* (z. B. „PDFs können nicht übersetzt werden, bitte das
     bearbeitbare Quellformat hochladen“) statt technischer Meldungen.
  5. *Schnell starten:* Das Startdokument ist klein; alles, was nicht sofort gebraucht wird,
     lädt nach (Startseite, Einstellungen, Anleitung, Admin, dunkler Modus, Campus).

## 2. Designsystem „Kaercher Glass“

Überträgt die Prinzipien von [plass-ui](https://github.com/MMario996/plass-ui) auf die
Kärcher-CI (Gelb/Schwarz). Definiert am Ende von `Styles.html`.

- **Gedrückt / Aktion = getönte Fläche:** Primärbuttons haben einen gelben Verlauf und einen
  gelblichen Schatten.
- **Inhalt = klares Glas:** Karten, Navigation und Panels sind halbtransparent weiß mit
  Weichzeichner und weißer Haarlinie.
- **Tiefe nur über Licht und Schatten.** Bedienelemente bewegen sich beim Hover nicht (kein
  Verschieben/Skalieren), sie werden heller bzw. bekommen mehr Schatten.

### Tokens

| Token | Wert | Verwendung |
|---|---|---|
| `--primary-yellow` | `#FFED00` | Kärcher-Gelb: aktive Reiter, Akzentkanten, Fortschritt |
| `--primary-black` | `#000000` | Text auf Gelb, aktive Segmente |
| `--kg-fill` | Verlauf `#FFED00 → #FFD500` | Primärbuttons, Download-Button |
| `--kg-ink` | Verlauf `#1c1c1c → #3b3b3b` | schwarze Buttons, aktives Segment (Text gelb) |
| `--kg-tint` / `--kg-tint-hi` | gelber Schatten | Primärbutton normal / Hover |
| `--kg-glass` / `--kg-glass-hi` | Weiß 70 % / 86 % | Sekundärbuttons, Navigation, Glocke |
| `--kg-hair` | Weiß 75 % | Haarlinie um Glasflächen |
| `--kg-blur` | `blur(20px) saturate(160%)` | `backdrop-filter` für Glas |
| `--kg-elev` / `--kg-elev-hi` | weiche Doppelschatten | Karten / Hover |
| `--kg-ring` | `0 0 0 3px rgba(255,221,0,.6)` | Fokusring (Tastatur) |
| `--kg-r` / `--kg-r-lg` | 12 px / 18 px | Radius Buttons / Karten |
| `--kg-ease` | `cubic-bezier(.16,.9,.3,1)` | Übergänge |
| `--kg-wash` | `#f4f4f0` | Seitenhintergrund |
| `--k-surface`, `--k-surface-2` | `#fff`, `#f7f7f5` | Flächen |
| `--k-ink`, `--k-ink-2` | `#1a1a1a`, `#6b6b6b` | Text, Sekundärtext |
| `--k-line` | `#e8e8e4` | Linien, Rahmen |
| `--text-main`, `--text-sub`, `--border-light`, `--bg-gray` | `#333`, `#666`, `#e0e0e0`, `#F5F5F5` | ältere Tokens, noch verbreitet |

**Statusfarben:** offen = Gelb (`#e6c200` / `#fffbe0`), erledigt = Grün (`#8bc34a` / `#f1f8e9`),
abgebrochen = Rot hell (`#e57373` / `#ffebee`, Text grau), überfällig = Rot (`#c62828`, fett).
Toasts: Standard gelbe Kante, Erfolg grün, Fehler rot. Admin-Reiter aktiv = rote Unterkante
(`#d93025`) als Warnsignal. Warnbanner (Wartung): `#fff3cd` / `#856404`.

### Typografie und Icons

- Schrift: `"Helvetica Neue", Helvetica, Arial, sans-serif`; Eingaben 16 px (verhindert Zoom auf
  iOS), Tabellen 13–14 px.
- Abschnittstitel (`.section-title`) und Buttons: **Großbuchstaben, fett (700–800)**, leichtes
  Letter-Spacing – typisch Kärcher.
- Icons: **Material Icons Outlined** (Google Fonts). Ist die Icon-Schrift blockiert, schaltet
  `initIconFallback_` (JsCore) auf Zeichen um (`.no-icon-font`), damit keine Wörter wie
  „refresh“ im Button stehen.

### Komponenten

| Komponente | Klasse(n) | Regeln |
|---|---|---|
| Primärbutton | `.btn.btn-primary` | eine Hauptaktion pro Ansicht („Einreichen“, „Speichern & benachrichtigen“) |
| Sekundärbutton | `.btn.btn-secondary` | Glas; Toolbar-Aktionen (Aktualisieren, CSV, Kalender, Archiv) |
| Schwarzer Button | `.btn-black` | starke Nebenaktion |
| Download | `.btn-download` | gelb, in Tabellenzeilen |
| Karte | `.card` | Radius 18 px, weicher Schatten; Formulare bestehen aus Karten im `.card-grid` |
| Hauptreiter | `.tab-nav .tab-btn` | klebt oben; aktiv = gelbe 3-px-Unterkante |
| Bereichszeile | `.portal-nav` | segmentierte Glas-Leiste; aktiv = schwarz mit gelbem Text; nur sichtbar unter „Neues Projekt“ und nur bei > 1 Bereich |
| Unterreiter | `.docsub-nav`, `.admin-subtabs` | segmentiert |
| Modal | `.modal-backdrop` + `.modal-content`, bzw. feste Overlays | **6 px gelbe Oberkante**, Titel in Großbuchstaben mit Icon, Schließen-X oben rechts, Aktionen rechts unten (Abbrechen links vom Primärbutton), Hintergrund abgedunkelt + Blur |
| Dialoge | `showCustomAlert`, `showCustomConfirm`, `showCustomPrompt` (JsCore) | statt `alert/confirm/prompt` verwenden |
| Toast | `.toast-host` / `.toast`, `-ok`, `-err` | unten rechts, dunkel, optional mit Link („Öffnen“) |
| Status | `.status-badge` | Pille, Großbuchstaben, 10–11.5 px |
| Status-Chips | `#statusChips` | Filter nach Status über der Tabelle |
| Tabelle | `.history-table` | sortierbare Spalten mit Filterfeld im Kopf; horizontal scrollbar |
| Auswahl mit Suche | `.tmpl-dropdown-*`, `.multiselect-*` | Vorlagen- und Sprachwahl; Suchfeld oben im Panel |
| Dropzone | `.dropzone` | Ziehen oder Klicken; daneben „PC Upload“, „Drive“, „Drive Link“ |
| Seitenpanel | `.drawer`, `.pd-*` | Projektdetails mit Schritt-Anzeige |
| Banner | `#maintenanceBanner`, `#announceHost`, `#simulationBanner` | Wartung, Ankündigungen, Admin-Simulation |

### Layout und Responsivität

- `.container` mit Innenabstand 25 px (≤ 900 px: 10 px, ≤ 700 px: 12 px); die Hauptnavigation
  klebt randlos oben und bekommt beim Scrollen einen Schatten (`.is-stuck`).
- Breakpoints im Code: 1350, 1300, 1200, 1100, 1000, 900, 820, 720, 700 px. Unter 700 px:
  Karten einspaltig, Toasts volle Breite, Dashboard einspaltig, Button-Beschriftungen teils nur
  Icon.
- `viewport-fit=cover` + `safe-area-inset` für iPhone.
- Die Seite läuft meist **eingebettet in Google Sites** (Iframe). Links öffnen mit
  `<base target="_top">` bzw. `target="_blank"`.

### Darstellungsoptionen (pro Nutzer)

| Option | Umsetzung |
|---|---|
| Hell / Dunkel / Automatisch | `html[data-theme="dark"]`; CSS aus `DarkTheme.html` (generiert), zwischengespeichert in `localStorage.kts_dark_css`, wird vor dem ersten Rendern gesetzt (kein Aufblitzen) |
| Schriftgröße 100 / 110 / 120 % | `html[data-font]` |
| Dichte komfortabel / kompakt | `html[data-density="compact"]` |
| Bewegung reduzieren | `html[data-motion="reduce"]` + `prefers-reduced-motion` |

## 3. Informationsarchitektur

```
Kopf: Sprachwahl · Glocke · Einstellungen (Zahnrad/„tune“) · Hilfe-Link (Knowledge Base)
Hauptreiter (klebt oben):
  Start │ Neues Projekt │ Meine Projekte │ Dashboard* │ Anleitung │ Hilfe & Support │ Admin* │ Health*
    └─ Neues Projekt → Bereichszeile (nur erlaubte):
         General │ Marketing │ WOMA │ Competence Center │ KeC │ Dokumentation │ Campus
* nur mit Recht: Dashboard (Admin, Light:dashboard), Admin (Admin, beliebiges Light-Recht), Health (Admin)
```

- **Startbereich:** Startseite, wenn in den Einstellungen aktiv; sonst „Neues Projekt“ bzw.
  „Meine Projekte“ (`startTab`). Exklusive Nutzer landen in ihrem Bereich. `?tab=history` öffnet
  direkt „Meine Projekte“ (Links aus Chat-Nachrichten).
- **„Neues Projekt“** öffnet den zuletzt genutzten Bereich (`localStorage.lastPortalTab`).

## 4. Bildschirme

### Start und Zugang

- **Start-Overlay** mit Ladeanimation, bis `apiGetConfig` antwortet. Beim Sprachwechsel ein
  kurzes Overlay mit freundlichen Texten in der Zielsprache.
- **Zugriff verweigert** (Vollbild): Icon, Erklärung, Button „Zugriff beantragen“ (Taskbox).
- **Wartung:** gelber Laufbanner; im Wartungsfenster sind Aktionen für Nicht-Admins gesperrt.
- **Ankündigungen:** Banner je Zielgruppe (Admin pflegt sie, optional auch als Chat-Nachricht).
- **Simulation (Admin):** Banner mit der simulierten E-Mail (`#simulationBanner`) und Beenden.
- **Chat-Willkommen** (einmalig, abschaltbar): erklärt die Chat-Benachrichtigungen in 3 Schritten.

### Startseite (`HomeUi.html`, nachgeladen)

Begrüßung mit Namen, darunter Widgets (einzeln abschaltbar):
- **Suche/Befehle** (Combobox, `Strg/⌘+K` oder `/`): findet Projekte und Aktionen.
- **Schnellstart** (`quick`): Bereiche und gespeicherte Presets als Kacheln.
- **Kennzahlen** (`kpis`): offen, überfällig, diese Woche, erledigt – Kachel = Filter.
- **Meine Arbeit** (`focus`): Reiter überfällig / diese Woche / offen / erledigt / angeheftet,
  mit Fortschrittsbalken aus Phrase (erledigte/alle Jobs).
- **Nächste Frist** und **7 Tage** (`week`).
- **Aktivitäten** (`activity`): letzte Ereignisse.
- **Tipp** (`tips`).
Die Startseite zeigt nur eigene und geteilte Projekte – auch für Admins.

### Neues Projekt (Formular je Bereich)

Aufbau als Karten:
1. **Projektinfo:** Vorlage (durchsuchbares Dropdown; nur Vorlagen, die zur Nutzerzuordnung
   passen), Quellsprache (aus der Vorlage), Zielsprachen (Mehrfachauswahl), Projektname.
   Campus zusätzlich: Review-Typ (Pflicht) und optional SCORM-Ordner für automatische Vorschau.
   Pivot-Vorlagen zusätzlich: Sprachen des Übersetzungsschritts.
2. **Einstellungen:** Frist (Datum; Wochenenden/Feiertage werden geprüft, Express-Vorlagen
   verlangen ≤ 72 h und Bestätigung des Aufschlags), Notiz für Übersetzer.
3. **Hauptdateien:** Dropzone + „PC Upload“ / „Drive“ (Drive-Browser) / „Drive Link“.
   `.pdf` und `.doc` werden mit Erklärung abgelehnt. Größenlimit aus `sizeLimitMb`.
4. **Referenzdateien** (optional).
- **Presets:** aktuelle Auswahl speichern/laden (ohne Name und Frist).
- **Absenden:** Button rechts unten, Fortschritts-Overlay; danach Erfolgsdialog mit Phrase-ID
  und Hinweis auf die Chat-Nachricht. Bei Zeitüberschreitung: „Projekt wurde evtl. schon
  angelegt, bitte in ‚Meine Projekte‘ prüfen“.
- **Dokumentation** hat ein eigenes Formular: Vorlage, Quellsprache, IA-Nummer (Pflicht, nur
  Ziffern), Frist, Notiz, **Drive-Ordner mit Sprach-Unterordnern** (Suche; Warnung bei schon
  importierten Ordnern; Validierung pro Sprache), Referenzdateien (PDF, XLSX, JPG).
- **KeC:** Dateien zu einem bestehenden Phrase-Projekt hinzufügen.
- **Marketing:** Seitenleiste mit eingebetteter Google-Slides-Anleitung (einklappbar).

### Meine Projekte

- **Toolbar:** Aktualisieren · Status synchronisieren · CSV-Export · Kalender · Archiv zeigen
  (erledigte Projekte älter als 30 Tage) · Filter (alle / meine / mit mir geteilt / Team) ·
  Suche · Umschalter Tabelle ↔ Kalender.
- **Status-Chips** filtern nach Status.
- **Tabelle:** Projektname, Phrase-ID, Upload-Datum, Quelle, Zielsprachen, Status, Frist,
  Geteilt?, Download, Aktionen. Sortier- und Filterfelder im Spaltenkopf.
- **Aktionen je Zeile:** Details, Frist ändern, Umbenennen, Notizen, Teilen, Abbrechen,
  Anheften. Team-Projekte sind nur lesbar.
- **Detailansicht (Drawer):** Schritt-Anzeige NEW → UPLOADED → ASSIGNED → ACCEPTED → COMPLETED →
  DELIVERED, Metadaten, Aktionen, Link zu Phrase.
- **Download-Dialog:** Auswahl der Sprachen/Dateien, Einzeldatei oder ZIP; „In Google Drive
  speichern“ (einmalige Google-Freigabe in neuem Tab; Option „in Google-Format umwandeln“;
  bei Pivot: Unterordner „Source-Check“).
- **Kalenderansicht:** Monat/Woche, Heute, Legende (offen, erledigt, abgebrochen, überfällig).
- **Frist-Dialog:** Datum + Hinweis „Phrase wird aktualisiert, alle Beteiligten werden per Chat
  informiert“, Button „Speichern & benachrichtigen“.
- **Notizen-Dialog:** Projektnotiz (in Phrase für Übersetzer sichtbar), editierbar für
  Berechtigte.

### Dashboard

Kopf mit Aktualisieren, CSV, „Anpassen“ (Widgets konfigurieren). Filter: Zeitraum
(7 T, 30 T, 90 T, 12 M, YTD, alle, benutzerdefiniert), Status, Vorlage, Sprache, Nutzer, Suche;
aktive Filter als Chips. Kennzahlen mit Sparklines, Diagramme, Tooltips. Berechnung komplett im
Browser auf den Rohzeilen von `apiGetDashboardData`.

### Campus (Articulate/Rise)

Unterreiter **Projekt anlegen** (Formular wie oben) und **Preview-Generator** in 3 Schritten:
Phrase-Projekt & Job → SCORM-Ordner (entpackter Rise-Export) → Kursname & Zielsprache;
„Eingaben prüfen“ / „Preview erzeugen“, Fortschrittsmodal mit Prozent und ETA, Batch für alle
Jobs eines Projekts. Rechts „Gespeicherte Kurse“ mit Suche und Vollbild-Tabelle.

### Anleitung, Hilfe & Support, Knowledge Base

- Anleitung und FAQ werden beim ersten Öffnen nachgeladen (`GuideContent.html`).
- Hilfe & Support: Kacheln zu Taskbox-Formularen (Problem melden, Berechtigung beantragen,
  Beratung zu Phrase) und E-Learnings.
- Knowledge Base: eigene Seite unter `?page=kb`, einbettbar in Google Sites, mit der kompletten
  Phrase-Dokumentation (TMS, Strings, Orchestrator, Portal, Studio, Global; 414 Artikel). Aufbau wie
  das Portal: Sprachleiste (6 Sprachen, `appLang`) und Hell/Dunkel oben rechts, Reiterleiste mit
  **Start + einem Reiter je Produkt**, Start wie die Portal-Startseite (Hero mit Suche, Produkt-
  Kacheln, Kennzahlen, „Zuletzt aktualisiert“, Suchtipps). Produkt-Reiter: Seitenleiste mit den
  Bereichen, Bereichs-Karten mit Artikelliste. Artikel: Brotkrumen, „Auf dieser Seite“,
  Hinweisboxen, Zurück/Weiter, Link zum Original. Volltextsuche (`/`, `Strg/⌘+K`, Pfeiltasten +
  Enter) mit Produktfilter und gelber Markierung im Artikel; mobil mit Menü-Schublade.

### Einstellungen (Dialog, `PrefsUi.html`)

Linke Navigation, rechts Gruppen: Darstellung (Theme, Schriftgröße, Dichte, Bewegung),
Startseite (an/aus, Widgets, Standard-Reiter, Anrede), Startbereich, Team-Ansicht (Business
Unit oder eigene E-Mail-Liste), Benachrichtigungen (Chat an/aus, Arten in der Glocke, Toast),
Kalender-Sync (verbinden, erledigte einbeziehen, jetzt synchronisieren, trennen),
Tastenkürzel an/aus. Gespeichert pro Nutzer im Sheet `UserPrefs`.

Gespeicherte Schlüssel: `theme`, `fontScale`, `startPage`, `team {enabled, mode, emails}`,
`displayName`, `density`, `reduceMotion`, `startTab`, `home {widgets, tab}`, `pinned`,
`notifTypes`, `notifToast`, `shortcuts`.

### Glocke (Benachrichtigungen)

Glas-Panel mit Ereignissen: `completed`, `shared`, `due_changed`, `due_soon`, `renamed`,
`cancelled`, `pivot_step`, `submitted`. „Alle gelesen“ setzt `notifSeenAt`. Neue Ereignisse
optional als Toast.

### Admin

Unterreiter: **Console** (Gruppen: Zugriffe · System · Kommunikation · Protokolle & Diagnose),
**User Manager**, **Template Manager**, **Pivot Templates**, **Tests**, **Translate UI**.

- **Protokoll** (Console → Protokolle & Diagnose): eine Liste statt System- und Aktivitätsprotokoll;
  Filter-Chips Alle/Projekte/Nachrichten/Zugriffe & Rechte/System/Fehler, Suche, CSV, Vollbild;
  Fehler rot; versendete Chat-Nachrichten mit Empfänger und erster Textzeile.
- **User Manager:** Kennzahlen-Chips (aktiv, inaktiv, ohne Segmentierung, keine Templates sichtbar,
  ohne Portal-Zugriff, Chat nicht verbunden, offene Projekte), Spalte „Portal & Nutzung“,
  Mehrfachauswahl mit Feld ändern (hinzufügen/entfernen/ersetzen), „Zuordnung übernehmen von …“,
  Zugriff geben/entziehen, Detail-Schublade (Profil, Bereiche, sichtbare Templates mit
  Freischalt-Tipps, letzte Projekte, Aktivitäten, „Als Nutzer ansehen“), CSV.
- **Template Manager:** Kennzahlen-Chips (für niemanden sichtbar, Segmentierung unvollständig, nie
  genutzt, Pivot, mit Watchern), Spalte „Sichtbarkeit & Nutzung“, Detail-Schublade (Anzeigename
  ändern, aktiv, wer sieht es, letzte Projekte), Mehrfach-Aktivieren, CSV.
Admin-Light sieht nur freigegebene Unterreiter. Console-Kacheln u. a.: Zugriffs-Übersicht
(Matrix Nutzer × Bereich, Mehrfachänderung), User View Simulator, Wartungsmodus,
Systemkonfiguration, Google Drive Export, Whitelists, Administratoren, Admin-Light,
KeC-/Doku-Einstellungen, System-Logs, User Template Debugger, Ankündigungen, Chat-Bot-Tester,
Nachrichtenvorlagen, Watcher, Audit-Log. Kachelreihen müssen voll sein (UI-Test prüft das).

## 5. Zustände und Rückmeldungen

| Zustand | Muster |
|---|---|
| Laden | `.loader` + Text („Lade deine Projekte …“), Buttons während Aktionen deaktiviert |
| Leer | zentrierter grauer Text mit Icon („Keine Projekte gefunden“, „Noch keine Kurse gespeichert“) |
| Erfolg | Toast `-ok` oder kurzer grüner Text im Dialog („✓ Frist aktualisiert“) |
| Fehler | `showCustomAlert` mit verständlicher Meldung; Server-`error` wird angezeigt |
| Keine Berechtigung | Vollbild „Zugriff verweigert“ bzw. Element ausgeblendet |
| Lange Vorgänge | Fortschrittsbalken in Gelb mit Prozent/ETA, Polling |
| Zeitüberschreitung | Hinweis, dass die Aktion evtl. trotzdem erfolgreich war, mit Weg zur Kontrolle |

## 6. Sprachen (i18n)

- UI-Sprachen: **de, en, fr, es, pt, zh** (`SUPPORTED_LANGS_`). Fallback Englisch.
- Markup: `data-i18n="key"`, `data-i18n-placeholder`, `data-i18n-title`; im Skript
  `tr_('key', 'Fallback')`.
- Wörterbücher: `I18N_DICTS_` (`I18nDicts.gs`, App), `ADMIN_I18N_` (`AdminI18n.gs`, Admin);
  de/en liegen zusätzlich im Browser, die übrigen reisen mit `apiGetConfig` (kein Flackern,
  kein Extra-Aufruf).
- Texte können über Admin → Translate UI mit **Phrase Strings** übersetzt und zurückgeholt
  werden (Überschreibungen, nächtlicher Abgleich).
- Chat-Nachrichten und Kalendertexte haben eigene Textquellen (`Message_Templates`,
  `CAL_TEXT_`).
- Datumsformat im Chat `en-GB`; Frist als ISO an den Server.

## 7. Bedienung per Tastatur und Barrierefreiheit

| Taste | Aktion |
|---|---|
| `Strg/⌘ + K` oder `/` | Suche auf der Startseite |
| `N` | Neues Projekt |
| `H` | Startseite |
| `P` | Meine Projekte |
| `?` | Übersicht der Tastenkürzel |
| `Esc` | Dialog/Panel schließen |

Kürzel greifen nicht in Eingabefeldern oder bei offenen Dialogen und sind abschaltbar.
Vorhanden: sichtbarer Fokusring (`--kg-ring`), Combobox-ARIA bei der Suche, `aria-live` für
Ankündigungen, reduzierte Bewegung. **Lücken:** viele Inline-Styles und Icon-Buttons nur mit
`title`, Modals ohne Fokusfalle, Kontraste der grauen Hinweistexte teils knapp – bei
Überarbeitungen verbessern.

## 8. Aufbau der Oberflächen-Dateien

`Index.html` ist nur das Gerüst; Styles und Skripte werden per `include()` eingebunden.

| Datei | Inhalt |
|---|---|
| `Styles.html` | alle Styles (Kaercher Glass am Ende) |
| `JsCore.html` | globale Variablen, Dialoge, i18n, Start (`loadAppConfig`) |
| `JsForms.html` | Formulare, Bereichsnavigation, Vorlagen, Sprachen (`initForm`) |
| `JsNavigation.html` | `switchTab`, Nachladen (Anleitung, Admin, Skripte) |
| `JsDocumentation.html` | Doku-Import und Doku-Projekte |
| `JsUpload.html` | Dateiauswahl, Drive-Picker, Absenden |
| `JsProjects.html` | Meine Projekte, Kalender, Details, Dashboard |
| `JsDownload.html` | Download-Dialog, Drive-Speichern, Notizen, Frist |
| `JsMisc.html` | Presets, Admin-Hilfen, Tour, Selbsttest-Anzeige |
| `JsPersonal.html` | Einstellungen, Glocke, Tastenkürzel, Team, Startseiten-Lader |
| `JsCampus.html` | Campus/Articulate – **nachgeladen** (`apiGetLazyScript`) |
| `HomeUi.html`, `PrefsUi.html`, `GuideContent.html`, `AdminConsole.html` + `AdminScript.html`, `PivotAdminConsole.html` + `PivotAdminScript.html`, `TranslateUi.html`, `DarkTheme.html` | nachgeladen |
| `Knowledgebase.html` | eigenständige Seite `?page=kb` |

## 9. Regeln für Änderungen an der Oberfläche

1. **Größe:** Nichts Großes in `Index.html` oder die `Js*`-Startdateien. Neue Bereiche als
   eigene Datei + `apiGet…Content()` nachladen (Muster: `apiGetHomeUi`). Der Test prüft die
   Gesamtgröße.
2. **Tokens statt Farben:** `--kg-*` / `--k-*` verwenden, keine neuen Hex-Werte oder
   Inline-Styles. Danach `node tools/gen-dark-theme.js` für den dunklen Modus.
3. **Jeder Text übersetzt:** neuer Schlüssel in `I18nDicts.gs` (bzw. `AdminI18n.gs`) für alle
   sechs Sprachen, Markup mit `data-i18n`, Skript mit `tr_()`.
4. **Jeder Button ruft eine existierende Funktion** – `tests/ui.consistency.test.js` prüft
   `onclick`-Ziele.
5. **Dialoge** über `showCustomAlert/Confirm/Prompt` oder das Modal-Muster (gelbe Oberkante),
   nie Browser-`alert`.
6. **Rechte doppelt:** Elemente für Rollen im Browser ausblenden **und** im Server-Endpunkt
   prüfen – Ausblenden allein schützt nichts.
7. **HTML escapen:** Nutzerdaten nur über `escapeHtml()` in `innerHTML`.
8. **Mobile prüfen** (≤ 700 px) und den Playwright-Test laufen lassen
   (`npm run test:ui`); Vorschau mit `npm run preview`.
9. **Kein Framework, kein Build:** reines HTML/CSS/JS im Apps-Script-Template; externe Assets
   nur Google Fonts (Material Icons).
