# Architektur, Datenmodell und Betrieb

## Was die App ist

Ein internes Portal, über das Kärcher-Mitarbeitende Übersetzungsprojekte in **Phrase TMS**
(früher Memsource) anlegen, verfolgen, teilen und herunterladen – ohne selbst Phrase-Zugang zu
brauchen. Dazu kommen Spezialbereiche (Marketing, KeC, Dokumentation, WOMA, Competence Center,
Campus/Articulate), eine Startseite, ein Analytics-Dashboard, Google-Chat-Benachrichtigungen,
Kalender-Sync und eine Admin-Konsole.

```
Browser (Google Sites / Direkt-URL)
   │  HtmlService-Seite im Apps-Script-Sandbox-Iframe
   │  google.script.run.apiXyz(...)      ← kein REST, sondern RPC
   ▼
Google Apps Script (V8), Web-App "Execute as: USER_DEPLOYING", Zugriff: DOMAIN
   ├── Google Sheets  (Access-Sheet, Ops-Sheet, Doku-Sheets) = Datenbank
   ├── Script Properties / Cache / User Properties
   ├── Phrase TMS REST API  (api2/v1, v2, v3)     – Projekte, Jobs, Downloads
   ├── Phrase Strings API   (api.phrase.com/v2)   – UI-Texte übersetzen
   ├── Google Chat API      (Service Account)     – Benachrichtigungen, Slash-Commands
   ├── Google Drive         (DriveApp + 3-legged OAuth pro Nutzer)
   ├── Google Calendar API  (3-legged OAuth pro Nutzer)
   ├── Firebase Hosting API (Service Account)     – Articulate/Rise-Vorschauen
   └── Gemini (über Apigee-Proxy)                 – Chat-Bot mit Function Calling
```

### Wichtige Eigenschaften der Laufzeit

- **Execute as: USER_DEPLOYING.** Jeder Server-Code läuft mit den Rechten des Kontos, das die
  Web-App bereitgestellt hat. `DriveApp`, `SpreadsheetApp`, `CalendarApp` greifen also auf die
  Ressourcen **dieses Kontos** zu, nicht auf die des Nutzers. Deshalb gibt es für „In mein Drive
  speichern“ und „Kalender-Sync“ eigene OAuth-Flows pro Nutzer (siehe `API.md`).
- **Identität:** `Session.getActiveUser().getEmail()` liefert die E-Mail des angemeldeten
  Nutzers (gleiche Workspace-Domain). Sie ist die einzige Grundlage aller Berechtigungen.
  In Chat-Events und Triggern ist sie **leer** – dort wird die E-Mail aus dem Event übergeben
  (`callerOverride`).
- **Kein Build-Schritt.** Alle `.gs`-Dateien teilen sich einen globalen Namensraum. Zwei
  Funktionen mit gleichem Namen überschreiben sich still (siehe `AUFFAELLIGKEITEN.md`).
- **Ausführungszeit:** max. 6 Minuten pro Aufruf. Upload hat eine eigene 5-Minuten-Grenze
  (`UPLOAD_DEADLINE_MS_`) und meldet danach `timedOut`.
- **Zeitzone:** `Europe/Berlin` (`appsscript.json`).

## Harte Grenzen (bei jeder Änderung beachten)

1. **Größe des Startdokuments ≈ 600 KB.** Apps Script schneidet größere HTML-Ausgaben mitten im
   `<script>` ab – danach startet die App nicht mehr. Deshalb werden Startseite, Einstellungen,
   Anleitung, Admin, Pivot-Admin, Translate UI, Dark Mode und das Campus-Skript **nachgeladen**.
   `include()` entfernt Einrückungen; `tests/ui.consistency.test.js` prüft die Größe. Neue große
   Bereiche immer nachladen, nie in `Index.html` einbetten.
2. **Nachgeladene Payloads ≈ 144 KB.** Auch einzelne `apiGet*Content()`-Antworten wurden bei
   dieser Größe abgeschnitten – große Bereiche weiter aufteilen.
3. **Jede Datei muss im Apps-Script-Projekt existieren.** Fehlt eine per `include()`
   eingebundene Datei, startet die Seite nicht. Admin → Tests prüft das.
4. **Nach CSS-Änderungen** `node tools/gen-dark-theme.js` ausführen (erzeugt `DarkTheme.html`).
5. **Jede Browser-aufrufbare Funktion ist öffentlich.** Jede globale Funktion ohne `_` am Ende
   kann jeder Domain-Nutzer per `google.script.run` aufrufen. Berechtigungen gehören in die
   Funktion selbst.
6. **Übersetzungen:** jeder sichtbare Text bekommt einen i18n-Schlüssel; Tests prüfen, dass jeder
   verwendete Schlüssel existiert.

## Dateien

### Server (`.gs`)

| Bereich | Dateien |
|---|---|
| Einstieg, Konfiguration, Zugriff | `WebApp.gs` (doGet, include, viele APIs), `Code.gs` (Kontext, Whitelist, Wartung), `Config.gs` (Config, Rollen, Templates), `Apialiases.gs`, `KecWhitelistAliases.gs` |
| Rollen/Whitelists | `AdminAccess.gs` (Matrix), `AdminLight.gs`, `AdminMarketing.gs`, `AdminWoma.gs`, `AdminCc.gs`, `Articulateapi.gs` (Campus-Whitelist) |
| Projekte anlegen | `Upload.gs` (Upload, Notizen, Chat-Bot-Grundlagen), `ProjectsApi.gs` (Phrase-Client), `KeCProjects.gs`, `DocImport.gs`, `Xliffparser.gs` |
| Projekte verfolgen | `WebApp.gs` (Meine Projekte, Dashboard, Teilen, Abbrechen, Frist, Name, Fortschritt), `AutoSync.gs`, `Sync.gs`, `NotificationCenter.gs`, `Watchers.gs` |
| Download/Export | `DownloadZip.gs`, `DownloadTargetFile.gs`, `DriveSaveConfig.gs`, `DriveHelpers.gs`, `DriveFolderUtils.gs`, `DocExport.gs` |
| Dokumentation | `DocQueue.gs`, `DocBoard.gs`, `DocArchive.gs`, `DocDriveConfig.gs`, `DocDriveTree.gs` |
| Pivot-Workflow | `PivotProjects.gs`, `PivotAdmin.gs`, `PivotTemplateLinks.gs`, `PivotLanguageMap.gs` |
| Campus/Articulate | `Articulateapi.gs`, `Articulateregistry.gs`, `Articualtepreview.gs`, `ArticulateChat.gs`, `RisePatcher.gs`, `ScormPatcher.gs`, `CampusBatch.gs`, `FirebaseAuth.gs`, `FirebaseHostingDeploy.gs` |
| Google Chat | `Upload.gs` (Senden, doPost), `ChatToken.gs` (Nutzer-Mapping), `ChatCommands.gs` (Slash-Commands), `Chatbot.gs` (Gemini), `Messagetemplates.gs` |
| Persönlich | `UserPrefs.gs`, `Presets.gs`, `CalendarSync.gs`, `Announcements.gs`, `GermanHolidays.gs` |
| Übersetzung der UI | `I18nDicts.gs` (App: de/en/fr/es/pt/zh), `AdminI18n.gs`, `PhraseStrings.gs`, `PhraseStringsSync.gs` |
| Knowledge Base | `Knowledgebase.gs` (`apiKbChunk`), `Knowledgebase.html`, `KbData*.html` (erzeugt), Quelle `kb-src/*.md`, Build `tools/build-kb.js` |
| Admin-Manager | `AdminManagers.gs` (Kennzahlen, Mehrfachbearbeitung, Details), `AdminManagers.html` (nachgeladen) |
| Betrieb | `Auditlog.gs` (inkl. gemeinsames Protokoll `apiGetUnifiedLog`), `Adminadvanced.gs` (Script Properties), `SelfTests.gs`, `Triggers.gs`, `SheetSetup.gs`, `HeaderRepair.gs`, `Debug.gs`, `Test.gs`, `Testregistry.gs`, `Kecdebugscan.gs` |

### Oberfläche (`.html`)

Siehe `UI-UX.md` → „Aufbau der Oberflächen-Dateien“.

## Datenmodell (Google Sheets)

Es gibt keine Datenbank; Sheets sind die Datenhaltung. Spalten werden meist **über den
Kopfzeilen-Namen** gesucht (tolerant gegenüber Groß-/Kleinschreibung und Varianten), an einigen
Stellen aber **per festem Index** geschrieben – Spalten nie umsortieren.

### Access-Sheet (`ACCESS_SHEET_ID`)

| Tabellenblatt | Zweck | Spalten (Auszug) |
|---|---|---|
| `Whitelist` | Zugang „General Projects“ | Email |
| `Whitelist_Marketing`, `Whitelist_KeC`, `Whitelist_Documentation`, `Whitelist_Woma`, `Whitelist_CC`, `Whitelist_Articulate` | Exklusive Spezialbereiche | Email |
| `Whitelist_AdminLight` | Teil-Admin-Rechte | Email \| Subtabs (`users,templates,pivot,tests,dashboard`) |
| `FetchTemplate-Prod` | Phrase-Projektvorlagen (per Sync aus Phrase) | Display Name, Template UID, Source, Targets, Active (yes/no), Client, Domain, Subdomain, Business Unit |
| `FetchTMS_USERS-Prod` | Nutzer-Zuordnung (per Sync aus Phrase) | Email, Client, Domain, Subdomain, Business Unit (mehrere Werte durch `,` `;` oder Zeilenumbruch) |
| `Maintenance` | Wartungsfenster (Alternative zu Script Properties) | ID, StartTime, EndTime, Message, Active |
| `Notifications` | Chat-Einstellung + Chat-User-ID | Email \| ON/OFF \| `users/…` |
| `UserPrefs` | Persönliche Einstellungen | Email \| Prefs JSON \| Updated At |
| `CalendarSync` | Kalender-Sync-Status | Email, Enabled, Calendar ID, Include Done, Lang, Last Sync, Last Result |
| `User_Presets` | Gespeicherte Formular-Vorlagen | (pro Nutzer: Template, Sprachen, Notiz) |
| `Announcements` | Banner/Chat-Ankündigungen | Zielgruppe, Zeitraum, Text, aktiv |
| `NotificationLog` | Einträge der Glocke | Zeit, Empfänger, Typ, Projekt … |
| `AuditLog` | Gemeinsames Protokoll: Admin-/Projektaktionen, Phrase-Owner, jede Chat-Nachricht (`CHAT_SENT`/`CHAT_FAILED`) | Zeit, Nutzer (bei Nachrichten: Empfänger), Aktion, Details |
| `Message_Templates` | Texte der Chat-Nachrichten (DE/EN) | Key, Text DE, Text EN |
| `Watchers` | Wer bei neuen Projekten einer Vorlage informiert wird | Konfiguration |
| `PivotTemplateLinks`, `PivotLanguageMap` | Pivot-Workflow | Parent/Child-Template, Sprache → Options-Wert |

### Ops-Sheet (`OPS_SHEET_ID`) – Blatt `Queue`

Eine Zeile pro angelegtem Phrase-Projekt (bei mehreren Template-UIDs mehrere Zeilen).
**Zeilen nie löschen – Status auf `CANCELLED` setzen.**

| Spalte | Inhalt | Hinweis |
|---|---|---|
| A | Timestamp | |
| B | User Email (Eigentümer) | Grundlage der Eigentümer-Prüfung |
| C | Project UID (Phrase) | Schlüssel für fast alle Projekt-APIs |
| D | File ID (Source) | |
| E | File Name | |
| F | Mime Type | |
| G | Target Lang(s) | kommagetrennt |
| H | Status | Phrase-Status in Großbuchstaben (s. u.) |
| I | Job UIDs | JSON-Array oder kommagetrennt |
| J | Async ID | |
| K | Notification Email | |
| L | Project Name | |
| M | Due Date | |
| N | CC Email | |
| O | Analysis UID | |
| P | Total Words | |
| Q | Net Words | |
| R | Shared With | kommagetrennte E-Mails |
| S | Template Name | |
| T | Chat-Thread (Message-Name) | für Antworten im selben Chat-Thread |
| U | Chat-Threads der Geteilten (JSON `{email: thread}`) | wird beim Abschluss geleert |
| V | Downloaded At | letzter Download, für das Archiv |
| (Kopfzeile) | `JobMapping`, `Pivot Role`, `Pivot Link` | nur per Kopfzeilen-Name |

**Status-Werte:** `NEW`, `QUEUED_UPLOAD`, `UPLOADED`, `ASSIGNED`, `ACCEPTED`, `COMPLETED`,
`NOTIFIED`, `DELIVERED`, `CANCELLED`/`CANCELED`, `REJECTED`, Pivot: `WAITING_CHILD`.
Terminal: `COMPLETED`, `DELIVERED`, `CANCELLED`, `CANCELED`, `REJECTED`.
Als „erledigt“ gelten `COMPLETED`, `DELIVERED`, `NOTIFIED`.

### Weitere Sheets

- Dokumentations-Queue, `Board`, `Archive` (eigene Sheet-IDs in `DocQueue.gs`, `DocBoard.gs`).
- Articulate-Registry `Projects` (`Articulateregistry.gs`).

## Script Properties (nur Namen – Werte nie in Prompts oder Doku)

| Property | Zweck |
|---|---|
| `ADMIN_EMAILS` | Kommagetrennte Admin-Liste |
| `ACCESS_SHEET_ID`, `OPS_SHEET_ID` | Sheet-IDs (Fallback-IDs stehen in `Config.gs`) |
| `PHRASE_API_TOKEN` (Aliase `PHRASE_TOKEN`, `GLOBAL_PHRASE_TOKEN`) | Phrase-TMS-API-Token |
| `PHRASE_API_BASE_URL` | Standard `https://cloud.memsource.com/web` |
| `PHRASE_STRINGS_TOKEN`, `PHRASE_STRINGS_PROJECT`, `PHRASE_STRINGS_REGION` | Phrase Strings (Translate UI) |
| `PHRASE_STRINGS_NIGHTLY`, `PHRASE_STRINGS_LAST_PULL` | nächtlicher Abgleich |
| `CHAT_CLIENT_EMAIL`, `CHAT_PRIVATE_KEY` | Service Account des Chat-Bots |
| `SERVICE_ACCOUNT_JSON` | Service Account für Firebase Hosting |
| `DRIVE_SAVE_OAUTH_CLIENT_ID`, `DRIVE_SAVE_OAUTH_CLIENT_SECRET` | OAuth-Client für Drive-Export und Kalender |
| `GEMINI_API_KEY` | Chat-Bot (Gemini) |
| `MAX_FILE_SIZE_MB` | Upload-Limit (Standard 100) |
| `PHRASE_SET_REAL_OWNER` | `false` = API-Funktionsuser bleibt Phrase-Owner (Standard: Einreicher wird Owner) |
| `MAINT_START`, `MAINT_END`, `MAINT_MSG` | Wartungsmodus |
| `KEC_CLIENT_ID`, `KEC_DOMAIN_ID`, `KEC_BUSINESS_UNIT_ID` | Welche Phrase-Projekte als KeC gelten |
| `AUTO_SYNC_ENABLED`, `AUTO_SYNC_LAST_RUN` … | Status-Autosync |
| `CAMPUS_BATCH_ENABLED`, `CAMPUS_BATCH_TEMPLATE_NAMES` | Campus-Batch-Nachbearbeitung |
| `TERMBASE_UID` | Termbase für `/termsearch` |
| dynamisch: `CHAT_USER_MAP__<email>`, `CHAT_NOTIFIED__<uid>`, `CHAT_PREF_ON__<email>`, `oauth2.*`, `Cal_*` | Laufzeitdaten |

Admin → Console → System zeigt Properties an; Werte mit `token`, `key`, `secret`, `password`,
`private` im Namen werden **nie** angezeigt, nur überschrieben (`Adminadvanced.gs`).

## Zeitgesteuerte Trigger

| Funktion | Takt | Zweck |
|---|---|---|
| `autoSyncProjectStatuses_` | alle 15 min | Status aus Phrase holen, Chat/Glocke benachrichtigen, Pivot-Kinder verfolgen |
| `calendarSyncAllTrigger` | stündlich | Fristen in die Kalender der Nutzer |
| `psNightlySync_` | täglich ~02:00 | UI-Texte aus Phrase Strings zurückholen |
| `cleanupChatDedupProperties_` | täglich ~03:00 | Aufräumen der Chat-Dedup-Properties |

Einrichtung: `Triggers.gs`, bzw. Schalter im Admin (Auto-Sync, Nightly) und beim ersten
Kalender-Sync. Trigger laufen als Deploy-Konto **ohne** angemeldeten Nutzer.

## Deploy und Tests

- **Lokal/CI:** `npm test` (Node ≥ 18, ohne Abhängigkeiten: Logik + UI-Konsistenz),
  `npm run test:ui` (Playwright/Chromium gegen gemocktes `google.script.run`, siehe
  `tools/build-preview.js`). Vorschau: `npm run preview` → `preview.html`.
- **CD:** `.github/workflows/ci.yml` – nach grünem CI auf `main` `clasp push` (Dateiauswahl
  `.claspignore`: nur `*.gs`, `*.html`, `appsscript.json`) und optional `clasp deploy`.
  Secrets: `CLASPRC_JSON`, `APPS_SCRIPT_ID`, optional `APPS_SCRIPT_DEPLOYMENT_ID`.
- **In der App:** Admin → Tests (`SelfTests.gs`), nur lesend.
- **Health:** Admin-Reiter „Health“ (`apiHealthCheck`).

## Externe Links im Portal

- Portal-URL für Chat-Nachrichten: `PORTAL_URL_` in `Upload.gs` (Google Site).
- Phrase-Projekt: `https://cloud.memsource.com/web/project/show/<projectUid>`
- Phrase-Job: `https://cloud.memsource.com/web/job/<jobUid>/translate`
- Knowledge Base: Web-App-URL + `?page=kb` (auch `knowledgebase`, `knowledge-base`, `wissen`).
- Support-Formulare: Taskbox (Jira Service Desk) – Links im Reiter „Help & Support“.
