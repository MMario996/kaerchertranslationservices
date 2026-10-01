# Mention Digest (Repo `phrase-notification-hub`)

> Kurz: Web-App mit Zeit-Triggern, die Kommentare in Phrase-TMS-Jobs überwacht und Personen per **Google Chat** benachrichtigt, wenn sie mit **@Erwähnung** angesprochen werden – sofort, im Intervall, täglich oder wöchentlich. Dazu Abwesenheitsvertretung und Projekt-Regeln („informiere bei Projekt X immer Person A und B“). Nutzt denselben Chat-Bot („Phrase Chatbot“) wie Kärcher Translation Services.

---

## 1. Steckbrief

| Eigenschaft | Wert |
|---|---|
| Typ | Web-App, `executeAs: USER_ACCESSING`, `access: DOMAIN`; Titel „Mention Digest“ |
| Datenbank | Google Sheet, ID in Script Property `MENTION_SHEET_ID` |
| Zweites Sheet | Script Property `ACCESS_SHEET_ID` (Access-Sheet des Portals) – nur Tab `Notifications` als Fallback für Chat-IDs |
| Phrase | `PHRASE_API_TOKEN`, `PHRASE_API_BASE_URL` (Standard `https://cloud.memsource.com/web`) |
| Chat | Service Account `CHAT_CLIENT_EMAIL`, `CHAT_PRIVATE_KEY` (OAuth2-Bibliothek, Service „MentionDigestBot“, Scope `chat.bot`); nur ausgehend, kein `doPost` |
| Chat-App im Marketplace | `https://workspace.google.com/marketplace/app/phrase_chatbot/175040441162` – muss jeder Nutzer einmal öffnen |
| Admins | Script Property `ADMIN_EMAILS` |
| Erweiterte Dienste | Admin Directory (Chat-User-ID aus E-Mail), Bibliothek OAuth2 v43 |

## 2. Welche Projekte werden gescannt?

Nur aktive Projekte (nicht COMPLETED/CANCELLED) mit dem Custom Field **„Mention Digest“** (`AxFjBOkLFMEx9VW5H0hwN1`) auf **True** (Option `BHRFl72Ug1nt8iU3FR0Xy1`). Das Flag wird je Projekt 6 h gecacht (`MENTION_CF__<projectUid>`). Jobs im Status DELIVERED/COMPLETED/CANCELLED/REJECTED/DECLINED werden übersprungen; gescannt werden die Workflow-Stufen aus `SCAN_WORKFLOW_LEVELS` (Standard 1–5).

## 3. Ablauf

```mermaid
flowchart TD
  T[Trigger alle 5 min: mentionScanRun_] --> F{FEATURE_ENABLED = yes?}
  F -- nein --> X[Ende]
  F -- ja --> P[Markierte aktive Projekte<br/>ab SCAN_CURSOR_INDEX,<br/>max. SCAN_PROJECTS_PER_RUN = 25, max. 4,5 min]
  P --> J[Alle Jobs, Kommentare seit<br/>MENTION_LAST_SEEN__&lt;projekt&gt;]
  J --> M[@Erwähnungen parsen]
  M --> A{Empfänger abwesend?}
  A -- ja --> V[an Vertretung umleiten]
  A -- nein --> E[Empfänger]
  V & E --> S{Modus des Empfängers}
  S -- immediate --> C[sofort Chat-Nachricht]
  S -- interval/daily/weekly --> B[(Pending_Mentions puffern)]
  S -- off --> O[nichts]
  J --> R[Projekt-Regeln:<br/>mentions_only / all_comments]
  R --> C
  B --> I[intervalDigestRun_ 5 min /<br/>dailyDigestRun_ / weeklyDigestRun_]
  I --> C
```

- `ignoreOwn`: eigene Kommentare werden nicht gemeldet (Standard ja).
- Nachrichten gruppiert nach Projekt und Datei, mit Link direkt aufs Segment bzw. den Kommentar in Phrase.
- Vor dem ersten Aktivieren `DEBUG_setBaseline()` ausführen, sonst werden alle alten Erwähnungen auf einmal gemeldet.

## 4. Benachrichtigungsmodi (je Nutzer)

| Modus | Wirkung |
|---|---|
| `immediate` | sofort nach dem nächsten Scan (≤ 5 min) |
| `interval` | gesammelt alle `IntervalMin` Minuten (15–480) |
| `daily_digest` | einmal täglich zur `DAILY_DIGEST_HOUR` (Standard 8 Uhr) |
| `weekly_digest` | montags zur `DAILY_DIGEST_HOUR` |
| `off` | keine Nachrichten |

Abwesenheit: gespeichert als Script Property `ABSENCE__<email>` = `{ active, until, substitute }`; Nachrichten gehen bis zum Datum an die Vertretung.

## 5. Datenbank-Tabs (`MENTION_SHEET_ID`)

| Tab | Spalten |
|---|---|
| `User_Settings` | Email, Mode, IntervalMin, Lang, IgnoreOwn, UpdatedAt |
| `Pending_Mentions` | Id, ProjectUID, ProjectName, JobUID, SegmentId, AuthorEmail, AuthorName, MentionedEmail, CommentText, CommentedText, DateCreated, SentMode, FileName, ThreadUid, CommentUid |
| `Global_Settings` | Key, Value, Description |
| `Mention_Templates` | Key, Text_DE, Text_EN (Nachrichtentexte mit Platzhaltern wie `{{PROJECT_NAME}}`, `{{AUTHOR}}`, `{{COMMENT}}`, `{{SEGMENT_LINK}}`) |
| `Run_Log` | Timestamp, Message (max. 200 Zeilen) |
| `Notification_Rules` | RuleId, CreatedBy, ProjectUID, ProjectName, NotifyEmails, TriggerType (`mentions_only`/`all_comments`), Active, CreatedAt |

`setupSheets()` legt alle Tabs mit Kopfzeile (gelb) an; `MIGRATE_addPendingColumns()` ergänzt FileName/ThreadUid/CommentUid.

### Global Settings

| Key | Standard | Bedeutung |
|---|---|---|
| `DAILY_DIGEST_HOUR` | 8 | Stunde für Tages-/Wochen-Digest |
| `DEFAULT_MODE` | immediate | Modus neuer Nutzer |
| `DEFAULT_LANG` | en | Sprache (de/en) |
| `DEFAULT_IGNORE_OWN` | yes | eigene Kommentare ignorieren |
| `MIN_INTERVAL_MIN` / `MAX_INTERVAL_MIN` | 15 / 480 | Intervallgrenzen |
| `FEATURE_ENABLED` | yes | Hauptschalter |
| `SCAN_WORKFLOW_LEVELS` | 1,2,3,4,5 | gescannte Workflow-Stufen |
| `SCAN_PROJECTS_PER_RUN` | 25 | Projekte pro Lauf (Cursor über Läufe) |
| `HUB_URL` | leer | Link zum Translation-Services-Portal |

## 6. Trigger (`setupAllTriggers()` einmal ausführen)

| Funktion | Takt |
|---|---|
| `mentionScanRun_` | alle 5 min |
| `intervalDigestRun_` | alle 5 min |
| `dailyDigestRun_` | täglich zur `DAILY_DIGEST_HOUR` |
| `weeklyDigestRun_` | montags zur `DAILY_DIGEST_HOUR` |
| `warmProjectCache_` | alle 10 min (Projektliste für das Regel-Dropdown, Cache `ACTIVE_PROJECTS_CACHE`, 10 min) |

## 7. Script Properties

`MENTION_SHEET_ID`, `ACCESS_SHEET_ID`, `PHRASE_API_TOKEN`, `PHRASE_API_BASE_URL`, `CHAT_CLIENT_EMAIL`, `CHAT_PRIVATE_KEY`, `ADMIN_EMAILS`; dynamisch: `MENTION_LAST_SEEN__<projectUid>`, `MENTION_CF__<projectUid>`, `SCAN_CURSOR_INDEX`, `INTERVAL_LAST_SENT__<email>`, `ABSENCE__<email>`, `INTRO_SEEN__<email>`.

## 8. Oberfläche

Begrüßungs-Popup beim ersten Besuch, Einstellungen (Modus-Karten, Intervall, Sprache, eigene Kommentare), Abwesenheit mit Vertretung, eigene Projekt-Regeln (Projekt aus Dropdown, Empfänger, Auslöser), Benutzerhandbuch (DE/EN), Hilfe & Support (Taskbox 4019/2916/4030, E-Learnings, Smartbox-FAQ). Admins: globale Einstellungen, Nachrichtenvorlagen, Run Log, Trigger-Status, alle Regeln und Nutzereinstellungen, manueller Scan, Simulation.

Server-Endpunkte: `apiGetContext`, `apiMarkIntroSeen`, `apiGetMySettings`, `apiSaveMySettings`, `apiGetMyAbsence`, `apiSaveMyAbsence`, `apiGetMyRules`, `apiAddRule`, `apiRemoveRule`, `apiToggleRule`, `apiGetActiveProjectsDropdown`; Admin: `apiGetAllRules`, `apiGetAllUserSettings`, `apiGetGlobalSettings`, `apiSaveGlobalSetting`, `apiGetMentionTemplates`, `apiSaveMentionTemplate`, `apiResetMentionTemplate`, `apiGetRunLog`, `apiGetTriggerStatus`, `apiManualScanNow`, `apiGetPendingMentions`, `apiGetFlaggedProjects`, `apiClearMentionFlagCache`, `apiSimulateScan`, `apiTestChatMessage`.

## 9. Dateien

| Datei | Inhalt |
|---|---|
| `Config.gs` | Sheet-Namen, Identität, Properties, Sheet-Zugriff, Global Settings, Run Log, `setupSheets` |
| `Phraseapi.gs` | Phrase-Aufrufe, Mention-Flag, Jobs, Kommentare, Erwähnungen parsen |
| `Mentiondigest.gs` | Scan, Regeln, Digests, Nachrichten bauen |
| `Notificationrules.gs` | Projekt-Regeln |
| `Usersettings.gs` | Nutzereinstellungen, Abwesenheit |
| `Adminsettings.gs` | Standard-Nachrichtenvorlagen, Admin-Endpunkte |
| `Chatbot.gs` | Chat-Versand über Service Account |
| `Triggers.gs`, `Webapp.gs` | Trigger, Einstieg |
| `Debug.gs`, `Debug setbaseline.gs` | Diagnose, Baseline setzen |
| `Hub snippet mentiondigest.gs` | **Kein Projektcode**: Schnipsel für das Portal (Glocken-Button in „Meine Projekte“, öffnet `<Mention-Digest-URL>?project=<uid>`) |
| `Index.html` | Oberfläche |

## 10. Einrichtung

1. Sheet anlegen, ID als `MENTION_SHEET_ID`; `ACCESS_SHEET_ID`, `PHRASE_API_TOKEN`, `CHAT_CLIENT_EMAIL`, `CHAT_PRIVATE_KEY`, `ADMIN_EMAILS` setzen.
2. `setupSheets()` ausführen.
3. `DEBUG_setBaseline()` ausführen.
4. `setupAllTriggers()` ausführen.
5. Als Web-App bereitstellen; in Phrase das Custom Field „Mention Digest“ an Projekten setzen.
