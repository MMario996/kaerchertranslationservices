# Schnittstellen: Kärcher Translation Services (Portal)

> Alle Endpunkte, die diese Anwendung aufruft oder anbietet, aus dem Code abgeleitet (Stand 2026-10-02).
> Gesamtübersicht aller Anwendungen: [`ENDPOINTS-GESAMT.md`](https://github.com/MMario996/kaerchertranslationservices/blob/main/docs/gesamt/ENDPOINTS-GESAMT.md) (Ordner `docs/gesamt/` im Repository kaerchertranslationservices).

## 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN (Bearer), Basis aus PHRASE_API_BASE_URL |
| Aufruf-Helfer | `phraseFetchJson_` in `src/ProjectsApi.gs` (429-Retry, max. 3, `Retry-After` oder 2 s · 2ⁿ) |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| POST | v2 | `/projects/applyTemplate/{templateUid}` | Projekt aus Vorlage anlegen (name, note, sourceLang, dateDue, targetLangs) | ProjectsApi.gs |
| POST | v1 | `/projects/{projectUid}/jobs` | Datei als Job hochladen (Header `Memsource`, `Content-Disposition`) | ProjectsApi.gs |
| POST | v2 | `/projects/{projectUid}/references` | Referenzdatei (multipart) | ProjectsApi.gs |
| GET | v1 | `/projects/{projectUid}` | Status, Frist, Owner, Notiz lesen | AutoSync.gs, WebApp.gs, KeCProjects.gs, DownloadZip.gs, ChatCommands.gs, Articulateapi.gs u. a. |
| PATCH | v1 | `/projects/{projectUid}` | Owner, Name, Frist, Notiz ändern | ProjectsApi.gs, WebApp.gs, Upload.gs |
| GET | v1 | `/projects?name=…&pageSize=50` | Projekt per Namen (Doku-Board, Export) | DocBoard.gs, DocExport.gs |
| GET | v1 | `/projects?statuses=NEW&pageNumber=…` | KeC-Projekte, Pivot-Kinder | KeCProjects.gs, PivotProjects.gs |
| GET | v1 | `/projects?pageSize=1` | Verbindungstest (Admin, Selbsttest) | WebApp.gs, SelfTests.gs |
| GET | v2 | `/projects/{projectUid}/jobs[?workflowLevel=…]` | Jobs, Fortschritt, höchster Workflow-Schritt für den Download | DownloadZip.gs, KeCProjects.gs, Upload.gs, Articulateapi.gs, WebApp.gs |
| GET | v2 | `/projects/{projectUid}/jobs/{jobUid}` | Job-Details (`/jobstats`) | ChatCommands.gs |
| GET | v1 | `/projects/{projectUid}/jobs?targetLang=…` | Jobs einer Sprache (Slash-Commands) | ChatCommands.gs |
| GET | v1 | `/projects/{projectUid}/jobs/{jobUid}/targetFile` | Zieldatei herunterladen (Download, ZIP, Rise-XLIFF) | DownloadZip.gs, DownloadTargetFile.gs |
| PUT | v1 | `/projects/{projectUid}/jobs/{jobUid}/providers` | Linguist zuweisen (`/assignlinguist`) | ChatCommands.gs |
| GET/PUT | v1 | `/projects/{projectUid}/customFields` | Custom Fields „Project Creator“, „Pivot languages“ u. a. | ProjectsApi.gs, DocBoard.gs |
| GET/PUT | v1 | `/projects/{projectUid}/jobs/{jobUid}/customFields` | Job-Custom-Fields | ProjectsApi.gs |
| GET | v1 | `/customFields?pageNumber=…` | Definitionen aller Custom Fields | DocBoard.gs |
| GET | v1 | `/customFields/{fieldUid}/options` | Optionen eines Auswahlfelds | ProjectsApi.gs |
| GET | v2 | `/projects/{projectUid}/quotes` | Angebotsstatus (`/quotestatus`) | ChatCommands.gs |
| GET | v1 | `/projectTemplates?pageNumber=…` | Vorlagen-Sync ins Access-Sheet | Sync.gs |
| GET | v1 | `/projectTemplates/{templateUid}` | Sprachen/Details einer Vorlage (6 h Cache) | ProjectsApi.gs, DocImport.gs |
| GET | v1 | `/users?pageNumber=…` | Nutzer-Sync | Sync.gs |
| GET | v1 | `/users/{uid}` | Nutzer-Details | Sync.gs |
| GET | v1 | `/users?email=… / ?userName=…` | Phrase-ID zu E-Mail/Benutzername | ProjectsApi.gs, Sheets.gs, Debug.gs |
| PUT | v1 | `/users/{uid}` | Vor-/Nachname, Rolle ändern (User Manager) | Sheets.gs |
| GET | v1 | `/clients[/{id}\|?name=…]` | Eligibility-IDs für Vorlagen-Sichtbarkeit (Client) | DocExport.gs, Help-ListDomainClientBusinessunit.gs |
| GET | v1 | `/domains[/{id}\|?name=…]` | Eligibility-IDs für Vorlagen-Sichtbarkeit (Domain) | DocExport.gs, Help-ListDomainClientBusinessunit.gs |
| GET | v1 | `/subDomains[/{id}\|?name=…]` | Eligibility-IDs für Vorlagen-Sichtbarkeit (Subdomain) | DocExport.gs, Help-ListDomainClientBusinessunit.gs |
| GET | v1 | `/businessUnits[/{id}\|?name=…]` | Eligibility-IDs für Vorlagen-Sichtbarkeit (Business Unit) | DocExport.gs, Help-ListDomainClientBusinessunit.gs |
| POST | v1 | `/termBases/{termBaseUid}/searchTerm` | Termbase-Suche (`/termsearch`, `TERMBASE_UID`) | ChatCommands.gs |
| GET | v1 | `/jobs/{jobUid}/conversations/plains` | Job-Notizen (`apiGetJobNotes`) | Upload.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

## 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) | Chat-Bot mit Function Calling (`gemini-2.0-flash`, nur lesende Tools) | GEMINI_API_KEY |
| Phrase Strings | GET/POST https://api.phrase.com/v2/projects[/{id}/locales\|/uploads\|/locales/{id}/download] (US: api.us.app.phrase.com) | UI-Texte des Portals pflegen (nächtlicher Sync) | PHRASE_STRINGS_TOKEN; Plattform-Token per OAuth Token Exchange an https://{eu\|us}.phrase.com/idm/oauth/token |
| Google Chat | GET https://chat.googleapis.com/v1/spaces:findDirectMessage?name=users/{id} | 1:1-Space des Nutzers finden | Service Account `CHAT_CLIENT_EMAIL`/`CHAT_PRIVATE_KEY`, Scope chat.bot (OAuth2-Bibliothek) |
| Google Chat | POST https://chat.googleapis.com/v1/{space}/messages · PATCH …/{message}?updateMask=text | Benachrichtigungen, Antworten im Thread | wie oben |
| Google OAuth | POST https://oauth2.googleapis.com/token · https://accounts.google.com/o/oauth2/auth · revoke | Service-Account-JWT (Firebase), Nutzer-OAuth (Drive/Kalender) | SERVICE_ACCOUNT_JSON, DRIVE_SAVE_OAUTH_CLIENT_ID/SECRET |
| Google Drive REST | GET/POST https://www.googleapis.com/drive/v3/files … · POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart | „In mein Drive speichern“ (pro Nutzer, Scope drive.file), Dateimetadaten | OAuth je Nutzer |
| Google Calendar | https://www.googleapis.com/calendar/v3 (calendars, events) | Fristen in den eigenen App-Kalender | OAuth je Nutzer, Scope calendar.app.created |
| People API | GET https://people.googleapis.com/v1/people:searchDirectoryPeople | Personen im Verzeichnis suchen (Teilen, Chat-ID) | Deploy-Konto |
| Firebase Hosting | https://firebasehosting.googleapis.com/v1beta1/sites/{site}/versions · :populateFiles · Upload · PATCH finalize · POST releases | Rise-Kursvorschau veröffentlichen (Campus) | SERVICE_ACCOUNT_JSON (JWT RS256) |
| Apps-Script-Dienste | SpreadsheetApp, DriveApp, AdminDirectory, GmailApp/MailApp, CacheService, LockService | Datenbanken, Dateien, Nutzer, Mails | Deploy-Konto |

## 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Portal; `?page=kb` Knowledge Base, `?tab=history` Meine Projekte |
| POST <Web-App-URL> (`doPost`) | Google Chat | Chat-Events, 10 Slash-Commands (`/projectstatus`, `/termsearch`, `/quotestatus` …) |
| `google.script.run.api…` | Oberfläche | rund 150 Server-Funktionen, vollständiger Katalog in `docs/API.md` |
| …/usercallback | Google OAuth | Rückruf für Drive-Export und Kalender |
| Zeit-Trigger | Apps Script | `autoSyncProjectStatuses_` (15 min), `calendarSyncAllTrigger` (stündlich), `psNightlySync_` (täglich), `cleanupChatDedupProperties_` (täglich) |
