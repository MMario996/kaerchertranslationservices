# Kärcher Translation Tools – alle Endpunkte

> Welche Anwendung spricht welchen Phrase-Endpunkt und welche anderen Dienste an. Aus dem Code aller 10 Repositories abgeleitet (Stand 2026-10-02, Branch `claude/practical-bohr-d9wt57`).

## 1. Phrase TMS – Matrix Endpunkt × Anwendung

Basis `https://cloud.memsource.com/web/api2/<version>`. ● = wird aufgerufen.

| Methode | Version | Ressource | Portal | AutoFix | Analysis | LQA | Mention | Add-on | TermCheck | TermHub | Rise |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| POST | v2 | `/analyses` |  |  | ● |  |  |  |  |  |  |
| GET | v3 | `/analyses/{id}` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/analyses/{id}/download` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/auth/whoAmI` |  | ● |  |  |  |  |  |  |  |
| POST | v2 | `/bilingualFiles` |  | ● |  |  |  |  |  |  |  |
| GET | v1 | `/businessUnits` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/clients` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/customFields` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/customFields/{id}/options` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/domains` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/emailTemplates/{id}` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/glossaries` |  |  |  |  |  |  |  | ● |  |
| GET | v1 | `/glossaries/{id}` |  |  |  |  |  |  |  | ● |  |
| POST | v1 | `/glossaries/{id}/upload` |  |  |  |  |  |  |  | ● |  |
| GET | v1 | `/jobs/{id}` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/jobs/{id}/conversations/plains` | ● |  |  |  | ● |  |  |  |  |
| POST | v1 | `/jobs/{id}/conversations/plains` |  |  |  |  |  |  |  | ● |  |
| POST | v1 | `/jobs/conversations/searchByProject` |  |  |  |  | ● |  |  |  |  |
| GET | v1 | `/lqa/assessments/{id}` |  |  |  | ● |  |  |  |  |  |
| POST | v1 | `/lqa/assessments/{id}` |  |  |  | ● |  |  |  |  |  |
| PUT | v1 | `/lqa/assessments/{id}/scorings` |  |  |  | ● |  |  |  |  |  |
| POST | v1 | `/machineTranslations/{id}/translate` |  |  |  |  |  | ● |  |  |  |
| GET | v1 | `/memsourceTranslateProfiles` |  |  |  |  |  | ● |  |  |  |
| GET | v1 | `/priceLists/{id}` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/projects` | ● | ● | ● | ● | ● |  |  |  |  |
| GET | v1 | `/projects/{id}` | ● | ● | ● | ● | ● |  |  | ● |  |
| PATCH | v1 | `/projects/{id}` | ● |  |  |  |  |  |  |  |  |
| GET | v3 | `/projects/{id}/analyses` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/projects/{id}/customFields` | ● | ● | ● |  | ● |  |  |  |  |
| PUT | v1 | `/projects/{id}/customFields` | ● | ● |  |  |  |  |  |  |  |
| PUT | v1 | `/projects/{id}/importSettings` |  |  |  |  |  |  |  | ● |  |
| GET | v1 | `/projects/{id}/jobs` | ● | ● | ● | ● |  |  |  |  |  |
| GET | v2 | `/projects/{id}/jobs` | ● |  |  |  | ● |  |  | ● |  |
| POST | v1 | `/projects/{id}/jobs` | ● |  |  |  |  |  |  | ● |  |
| GET | v2 | `/projects/{id}/jobs/{id}` | ● |  |  |  |  |  |  |  |  |
| POST | v1 | `/projects/{id}/jobs/{id}/conversations/lqa` |  |  |  | ● |  |  |  |  |  |
| GET | v1 | `/projects/{id}/jobs/{id}/customFields` | ● |  |  |  |  |  |  |  |  |
| PUT | v1 | `/projects/{id}/jobs/{id}/customFields` | ● |  |  |  |  |  |  |  |  |
| GET | v2 | `/projects/{id}/jobs/{id}/downloadTargetFile/{id}` |  |  |  |  |  |  |  | ● |  |
| PUT | v1 | `/projects/{id}/jobs/{id}/providers` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/projects/{id}/jobs/{id}/segments` |  |  |  | ● |  |  |  | ● |  |
| POST | v1 | `/projects/{id}/jobs/{id}/segments/{id}/comments` |  |  |  | ● |  |  |  |  |  |
| GET | v1 | `/projects/{id}/jobs/{id}/targetFile` | ● |  |  |  |  |  |  |  | ● |
| PUT | v2 | `/projects/{id}/jobs/{id}/targetFile` |  |  |  |  |  |  |  | ● |  |
| POST | v2 | `/projects/{id}/jobs/{id}/termBases/searchInTextByJob` |  | ● |  | ● |  |  |  |  |  |
| POST | v3 | `/projects/{id}/jobs/{id}/transMemories/search` |  |  |  | ● |  |  |  |  |  |
| PUT | v1 | `/projects/{id}/jobs/batch` |  |  | ● |  |  |  |  |  |  |
| POST | v1 | `/projects/{id}/jobs/bilingualFile` |  | ● |  |  |  |  |  |  |  |
| GET | v1 | `/projects/{id}/quotes` |  |  | ● |  |  |  |  |  |  |
| GET | v2 | `/projects/{id}/quotes` | ● |  |  |  |  |  |  |  |  |
| POST | v2 | `/projects/{id}/references` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/projects/{id}/termBases/relevant` |  |  |  | ● |  |  |  |  |  |
| POST | v2 | `/projects/applyTemplate/{id}` | ● |  |  |  |  |  |  | ● |  |
| GET | v1 | `/projectTemplates` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/projectTemplates/{id}` | ● |  |  |  |  |  | ● | ● |  |
| POST | v1 | `/quotes` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/quotes/{id}` |  |  | ● |  |  |  |  |  |  |
| POST | v1 | `/quotes/email` |  |  | ● |  |  |  |  |  |  |
| GET | v1 | `/subDomains` | ● |  |  |  |  |  |  | ● |  |
| GET | v1 | `/termBases` |  |  |  | ● |  |  | ● | ● |  |
| GET | v1 | `/termBases/{id}` |  |  |  |  |  |  |  | ● |  |
| POST | v1 | `/termBases/{id}/browse` |  |  |  |  |  |  | ● | ● |  |
| GET | v1 | `/termBases/{id}/concepts` |  |  |  |  |  |  |  | ● |  |
| POST | v1 | `/termBases/{id}/concepts` |  |  |  |  |  |  |  | ● |  |
| PUT | v1 | `/termBases/{id}/concepts/{id}` |  |  |  |  |  |  |  | ● |  |
| GET | v1 | `/termBases/{id}/export` |  |  |  |  |  |  |  | ● |  |
| POST | v1 | `/termBases/{id}/searchTerm` | ● |  |  |  |  |  |  |  |  |
| POST | v1 | `/termBases/{id}/terms` |  |  |  |  |  |  |  | ● |  |
| DELETE | v1 | `/termBases/{id}/terms/{id}` |  |  |  |  |  |  |  | ● |  |
| PUT | v1 | `/termBases/{id}/terms/{id}` |  |  |  |  |  |  |  | ● |  |
| GET | v1 | `/users` | ● |  |  |  |  |  |  |  |  |
| GET | v1 | `/users/{id}` | ● |  |  |  |  |  |  |  |  |
| PUT | v1 | `/users/{id}` | ● |  |  |  |  |  |  |  |  |

**Summe:** 73 unterschiedliche Methoden/Ressourcen. Prompt Hub ruft Phrase nicht auf; der Rise Patcher nutzt die Download-Funktion des Portals.

### Ressourcen nach Häufigkeit

| Ressource | genutzt von |
|---|---|
| `/projects` | Portal, AutoFix, Analysis Hub, AutoLQA, Mention Digest, Terminology Hub, Rise Patcher |
| `/jobs` | Analysis Hub, Portal, Mention Digest, Terminology Hub |
| `/termBases` | AutoLQA, TermCheck, Terminology Hub, Portal |
| `/projectTemplates` | Portal, TermCheck, Terminology Hub |
| `/subDomains` | Portal, Terminology Hub |
| `/analyses` | Analysis Hub |
| `/auth` | AutoFix |
| `/bilingualFiles` | AutoFix |
| `/businessUnits` | Portal |
| `/clients` | Portal |
| `/customFields` | Portal |
| `/domains` | Portal |
| `/emailTemplates` | Analysis Hub |
| `/glossaries` | Terminology Hub |
| `/lqa` | AutoLQA |
| `/machineTranslations` | Translation Add-on |
| `/memsourceTranslateProfiles` | Translation Add-on |
| `/priceLists` | Analysis Hub |
| `/quotes` | Analysis Hub |
| `/users` | Portal |

## 2. Phrase-Token und Basis-URL je Anwendung

| Anwendung | Token / Basis | Aufruf-Helfer |
|---|---|---|
| Kärcher Translation Services (Portal) | PHRASE_API_TOKEN (Bearer), Basis aus PHRASE_API_BASE_URL | `phraseFetchJson_` in `src/ProjectsApi.gs` (429-Retry, max. 3, `Retry-After` oder 2 s · 2ⁿ) |
| AutoFix Hub | PHRASE_API_TOKEN (Bearer) | `phraseFetch_` in `src/Code.gs` (GET, wenn keine Optionen) |
| Prompt Hub | – (kein Phrase-Zugriff) | – |
| Analysis Hub (Analysis & Quotes) | PHRASE_TOKEN (Bearer), Basis aus `App_Config.PHRASE_BASE_URL` | `phraseRequest_(path, method, body)` in `src/Code.gs` (Retry `HTTP_MAX_RETRIES`, Basis `HTTP_RETRY_BASE_MS`) |
| AutoLQA Hub | PHRASE_API_TOKEN | `phraseFetch_` in `src/Code.gs` |
| Mention Digest (Phrase Notification Hub) | PHRASE_API_TOKEN, Basis aus Property `PHRASE_API_BASE_URL` (Standard `https://cloud.memsource.com/web`) | `phraseFetch_`, `phraseUrlV1_`/`phraseUrlV2_` in `src/Phraseapi.gs`/`src/Config.gs` |
| Kärcher Translation Add-on | PHRASE_API_TOKEN | `callApi_(url, method, body)` in `src/Api.gs` (Retry) |
| Kärcher TermCheck | PHRASE_API_TOKEN (Präfix `ApiToken`/`Bearer` wird entfernt) | `_phraseFetch_` in `src/Code.gs` |
| Kärcher Terminology Hub | PHRASE_API_TOKEN (Präfix `ApiToken`/`Bearer` wird entfernt) | `_phraseFetch_` in `src/Terminologyapi.gs`, direkte `UrlFetchApp.fetch/fetchAll` in `src/Termcheckhub.gs` |
| Articulate Rise Patcher | – (nutzt die Portal-Funktionen `phraseDownloadTargetFile_`, `getPhraseAuthHeader_`) | – |

## 3. Andere Dienste × Anwendung

| Dienst | Portal | AutoFix | Prompt | Analysis | LQA | Mention | Add-on | TermCheck | TermHub | Rise |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Admin Directory |  |  |  |  |  | ● |  |  |  |  |
| Apps Script API |  |  | ● |  |  |  |  | ● |  |  |
| Apps-Script-Dienste | ● |  |  |  |  |  |  |  |  |  |
| CDN |  |  |  |  |  |  |  |  | ● |  |
| Docs/Sheets/Slides/Drive |  |  |  |  |  |  | ● |  |  |  |
| Firebase Hosting | ● |  |  |  |  |  |  |  |  | ● |
| Gemini (Apigee-Proxy) | ● | ● | ● |  | ● |  | ● | ● | ● |  |
| Gemini Gems |  |  |  |  |  |  |  | ● |  |  |
| GmailApp |  |  |  | ● |  |  |  |  |  |  |
| Google Calendar | ● |  |  |  |  |  |  |  |  |  |
| Google Chat | ● |  |  |  |  | ● |  |  |  |  |
| Google Chat Webhook |  | ● | ● | ● |  |  |  |  |  |  |
| Google Drive |  |  |  |  |  |  |  |  |  | ● |
| Google Drive REST | ● |  |  |  |  |  |  | ● |  |  |
| Google OAuth | ● |  |  |  |  |  |  |  |  |  |
| Google Sheets |  | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| MailApp |  | ● | ● | ● |  |  |  | ● | ● |  |
| People API | ● |  |  |  |  |  |  |  |  |  |
| Phrase Strings | ● |  |  |  |  |  |  |  |  |  |

Gemini läuft bei allen über denselben Kärcher-Apigee-Proxy `https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent` mit Header `x-api-key`.

## 4. Endpunkte je Anwendung

### Kärcher Translation Services (Portal) (`kaerchertranslationservices`)


#### 1. Phrase TMS (REST)

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

#### 2. Weitere ausgehende Schnittstellen

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

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Portal; `?page=kb` Knowledge Base, `?tab=history` Meine Projekte |
| POST <Web-App-URL> (`doPost`) | Google Chat | Chat-Events, 10 Slash-Commands (`/projectstatus`, `/termsearch`, `/quotestatus` …) |
| `google.script.run.api…` | Oberfläche | rund 150 Server-Funktionen, vollständiger Katalog in `docs/API.md` |
| …/usercallback | Google OAuth | Rückruf für Drive-Export und Kalender |
| Zeit-Trigger | Apps Script | `autoSyncProjectStatuses_` (15 min), `calendarSyncAllTrigger` (stündlich), `psNightlySync_` (täglich), `cleanupChatDedupProperties_` (täglich) |

### AutoFix Hub (`autofix-hub`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN (Bearer) |
| Aufruf-Helfer | `phraseFetch_` in `src/Code.gs` (GET, wenn keine Optionen) |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/auth/whoAmI` | Verbindungstest | Code.gs |
| GET | v1 | `/projects?pageSize=50&statuses=ASSIGNED&statuses=NEW&sort=DATE_CREATED&order=DESC` | Kandidaten für den Poller (15 min Cache) | Code.gs |
| GET | v1 | `/projects?pageSize=5&sort=DATE_CREATED&order=DESC` | Diagnose (letzte Projekte) | Code.gs |
| GET | v1 | `/projects/{projectUid}` | Projekt, Workflow-Schritte (Level von „PE Gemini“) | Code.gs |
| GET | v1 | `/projects/{projectUid}/customFields` | Custom Field „AutoFix“ lesen (Option → Prompt Space) | Code.gs |
| PUT | v1 | `/projects/{projectUid}/customFields` | Flag nach dem Lauf zurücksetzen (`markDoneAfterFix`) | Code.gs |
| GET | v1 | `/projects/{projectUid}/jobs?pageSize=50&workflowLevel={n}` | Jobs im Schritt „PE Gemini“ (NEW/ACCEPTED) | Code.gs |
| POST | v1 | `/projects/{projectUid}/jobs/bilingualFile?format=MXLF&preview=false` | MXLIFF herunterladen | Code.gs |
| POST | v2 | `/projects/{projectUid}/jobs/{jobUid}/termBases/searchInTextByJob` | Termbase-Treffer je Segment | Code.gs |
| POST | v2 | `/bilingualFiles?saveToTransMemory=Confirmed&setCompleted=true` | Korrigierte MXLIFF hochladen, Job abschließen (auch Re-Push) | Code.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) | Post-Editing (`primaryModel`, Fallback-Modelle), MQM-Klassifikation, Glossar-Vorschläge, Test im alten Prompt Editor | GEMINI_API_KEY |
| Google Chat Webhook | POST https://chat.googleapis.com/v1/spaces/…/messages?key=… (`AUTOFIX_HUB_CONFIG.chatWebhookUrl`) | Zugriffsanträge an Admins | Webhook-URL |
| MailApp | – | Zugriffsanträge per E-Mail | Ausführender Nutzer |
| Google Sheets | SpreadsheetApp.openById(`AUTOFIX_DB_SHEET_ID`) | Settings, Run Log, Audit Log, Prompt Spaces | Ausführender Nutzer |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Hub-Oberfläche; `?page=prompts` alter Prompt Editor |
| `google.script.run.apiHub…` | Oberfläche | Funktionen in `src/HubApi.gs`, jede mit Rollenprüfung |
| Zeit-Trigger | Apps Script | `autoFixPoller` (5/10/30 min, je Tick ein Job) |

### Prompt Hub (`Prompt-hub`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | – (kein Phrase-Zugriff) |
| Aufruf-Helfer | – |

Diese Anwendung ruft Phrase nicht direkt auf.

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) | Live-Test mit den Produktionsparametern von AutoFix | GEMINI_API_KEY |
| Google Sheets | SpreadsheetApp.openById(`PH_CONFIG.autofixSheetId`, Standard `1LFoBCuz…`) | Prompt in `Settings!peInstructions_<space>` veröffentlichen, Tab `Prompt Spaces`, `PH_*`-Tabs | Skript-Eigentümer |
| Apps Script API | POST https://script.googleapis.com/v1/projects · PUT …/v1/projects/{scriptId}/content | Ein-Datei-Installer `dist/Installer.gs`: Projektinhalt schreiben | Scope script.projects |
| Google Chat Webhook | POST https://chat.googleapis.com/v1/spaces/… | Anträge (Space, Zugriff) an Admins | Webhook-URL |
| MailApp | – | Anträge per E-Mail | Skript-Eigentümer |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Prompt-Hub-Oberfläche |
| `google.script.run.api…` | Oberfläche | Funktionen in `src/Api.gs` und `src/Styleguides.gs`, jede mit Rechteprüfung |

### Analysis Hub (Analysis & Quotes) (`Analysis-and-Quote`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_TOKEN (Bearer), Basis aus `App_Config.PHRASE_BASE_URL` |
| Aufruf-Helfer | `phraseRequest_(path, method, body)` in `src/Code.gs` (Retry `HTTP_MAX_RETRIES`, Basis `HTTP_RETRY_BASE_MS`) |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/projects?statuses=NEW&statuses=ASSIGNED&createdInLastHours={h}&pageSize=50&pageNumber=…` | Scan: aktive Projekte (`SCAN_PROJECT_STATUSES`, Lookback `PROJECT_SCAN_LOOKBACK_HOURS`) | Code.gs |
| GET | v1 | `/projects?statuses=COMPLETED&createdInLastHours={h}&pageSize=50` | Completed-Scan: fertige Projekte | CompletedScan.gs |
| GET | v1 | `/projects/{projectUid}` | Projekt, Owner (Provider), Sprachen | Code.gs, CompletedScan.gs |
| GET | v1 | `/projects/{projectUid}/customFields` | Custom Field „Analysis Type“ (`CF_ANALYSIS_TYPE_UID`) → DL-Routing | Code.gs |
| GET | v1 | `/projects/{projectUid}/jobs?pageSize=…&pageNumber=…` | Jobs für die Analyse / Completed-Prüfung | Code.gs, CompletedScan.gs |
| PUT | v1 | `/projects/{projectUid}/jobs/batch` | Workflow-Schritt 1 auf COMPLETED setzen, sobald die Quote freigegeben ist | Code.gs |
| GET | v1 | `/jobs/{jobUid}` | Job-Details | Code.gs |
| POST | v2 | `/analyses` | Analyse anlegen (`PreAnalyse` o. a., bis `ANALYSE_CREATION_MAX_JOBS` Jobs), liefert asyncRequest | Code.gs |
| GET | v3 | `/projects/{projectUid}/analyses?order=desc` | Analysen eines Projekts | Code.gs |
| GET | v3 | `/analyses/{analysisUid}` | Analyse-Details (Sprachpaare, Netto-Wörter) | Code.gs |
| GET | v1 | `/analyses/{analysisUid}/download?format=CSV` | Analyse als CSV (Download in der App) | Code.gs |
| POST | v1 | `/quotes` | Quote aus Analyse + Preisliste + Net Rate Scheme + Workflow-Schritt + Provider | Code.gs |
| GET | v1 | `/quotes/{quoteUid}` | Quote-Detail; Status für die Script-Property-Bereinigung (`fetchAll`, 20 parallel) | Code.gs, PropsCleanup.gs |
| GET | v1 | `/projects/{projectUid}/quotes?pageSize=50` | Quotes eines Projekts (Freigabe erkennen) | Code.gs |
| GET | v1 | `/priceLists/{priceListUid}` | Preisliste für die Quote-Ansicht | Code.gs |
| GET | v1 | `/emailTemplates/{templateUid}` | Phrase-Mailvorlage der Quote (`quoteEmailTemplateUid`) | Code.gs |
| POST | v1 | `/quotes/email` | Quote-Mail an den Dienstleister versenden | Code.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| GmailApp | – | Interne Mail „Quote approved“, Completion-Mail, Testmail je DL-Routing | Deploy-Konto (USER_DEPLOYING) |
| MailApp | – | Zugriffsanträge | Deploy-Konto |
| Google Chat Webhook | POST https://chat.googleapis.com/v1/spaces/… (`ANALYSIS_HUB_CONFIG.chatWebhookUrl`) | Zugriffsanträge an Admins | Webhook-URL |
| Google Sheets | SpreadsheetApp.openById(`1Jedm88GqXBp1-QxQCD-hgfQZO1007YVIdgXA_GOpiEY`) | App_Config, App_Routing, App_OptionMapping, Webhook_Analysen_v2, Webhook_Queue, Webhook_Log, Archiv_*, App_Audit | Deploy-Konto |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Hub-Oberfläche |
| `google.script.run.apiHub…` | Oberfläche | Funktionen in `src/HubApi.gs`, jede mit Rollenprüfung |
| Zeit-Trigger | Apps Script | `scheduledScan` (`SCAN_INTERVAL_MINUTES`, Standard 5), `scheduledCompletedScan` (15/30 min) |

### AutoLQA Hub (`autolqa-hub`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN |
| Aufruf-Helfer | `phraseFetch_` in `src/Code.gs` |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/projects?pageSize={n}&sort=DATE_CREATED&order=DESC[&sourceLang=…&statuses=…]` | Projektliste | Code.gs |
| GET | v1 | `/projects/{projectUid}` | Projekt | Code.gs |
| GET | v1 | `/projects/{projectUid}/jobs?pageSize=50` | Jobs | Code.gs |
| GET | v1 | `/projects/{projectUid}/jobs/{jobUid}/segments?beginIndex=…&endIndex=…` | Segmente (Seiten à 200) | Code.gs |
| GET | v1 | `/projects/{projectUid}/termBases/relevant` | Termbanken des Projekts | Code.gs |
| GET | v1 | `/termBases?pageSize=50` | Alle Termbanken (Fallback) | Code.gs |
| POST | v3 | `/projects/{projectUid}/jobs/{jobUid}/transMemories/search` | TM-Kontext je Segment | Code.gs |
| POST | v2 | `/projects/{projectUid}/jobs/{jobUid}/termBases/searchInTextByJob` | Termbase-Treffer je Segment | Code.gs |
| POST | v1 | `/projects/{projectUid}/jobs/{jobUid}/segments/{segmentId}/comments` | Befund als Segment-Kommentar | Code.gs |
| GET | v1 | `/lqa/assessments/{jobUid}` | LQA-Profil des Jobs (`lqaEnabled`, Kategorien/Schweregrade) | Code.gs |
| POST | v1 | `/lqa/assessments/{jobUid}` | LQA-Assessment starten | Code.gs |
| POST | v1 | `/projects/{projectUid}/jobs/{jobUid}/conversations/lqa` | Befund als LQA-Eintrag (errorCategoryId, severityId) | Code.gs |
| PUT | v1 | `/lqa/assessments/{jobUid}/scorings` | Assessment abschließen | Code.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) | LQA nach DQF-MQM (`primaryModel`, Standard `gemini-2.5-pro`), optional zweiter Durchgang | GEMINI_API_KEY |
| Google Sheets | SpreadsheetApp.openById(`DB_SHEET_ID`) | Settings, Profiles, Reports, Issues, Audit Log, Run History, LQA Export | Eigentümer |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | nur der Eigentümer (`access: MYSELF`) | AutoLQA-Oberfläche |
| `google.script.run.…` | Oberfläche | Funktionen in `src/Code.gs`, `src/Database.gs`, `src/Settings.gs` |

### Mention Digest (Phrase Notification Hub) (`phrase-notification-hub`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN, Basis aus Property `PHRASE_API_BASE_URL` (Standard `https://cloud.memsource.com/web`) |
| Aufruf-Helfer | `phraseFetch_`, `phraseUrlV1_`/`phraseUrlV2_` in `src/Phraseapi.gs`/`src/Config.gs` |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/projects?pageSize=…&pageNumber=…` | Projekte (mit Flag „Mention Digest“) finden, Cache fürs Regel-Dropdown | Phraseapi.gs |
| GET | v1 | `/projects/{projectUid}` | Projekt | Phraseapi.gs |
| GET | v1 | `/projects/{projectUid}/customFields?pageSize=50` | Custom Field „Mention Digest“ = True prüfen | Phraseapi.gs |
| GET | v2 | `/projects/{projectUid}/jobs?workflowLevel={n}` | Jobs je Workflow-Schritt | Phraseapi.gs |
| GET | v1 | `/jobs/{jobUid}/conversations/plains` | Kommentare eines Jobs (@Erwähnungen) | Phraseapi.gs |
| POST | v1 | `/jobs/conversations/searchByProject` | Kommentare eines Projekts in einem Aufruf | Phraseapi.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Google Chat | GET https://chat.googleapis.com/v1/spaces:findDirectMessage?name=users/{id} | 1:1-Space finden | Service Account (OAuth2-Bibliothek, Scope chat.bot), gleicher Bot wie Portal |
| Google Chat | POST https://chat.googleapis.com/v1/{space}/messages | Erwähnung/Digest senden | wie oben |
| Admin Directory | AdminDirectory.Users.get(email) | Chat-User-ID ermitteln | Ausführender Nutzer |
| Google Sheets | SpreadsheetApp.openById(`MENTION_SHEET_ID`), `ACCESS_SHEET_ID` (Tab Notifications des Portals) | Einstellungen, Puffer, Regeln, Log; Chat-IDs | Ausführender Nutzer |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser (Domain); `?project=<uid>` aus dem Portal | Einstellungen, Regeln, Admin |
| Zeit-Trigger | Apps Script | `mentionScanRun_` (5 min), `intervalDigestRun_` (5 min), `dailyDigestRun_`, `weeklyDigestRun_`, `warmProjectCache_` (10 min) |

### Kärcher Translation Add-on (`k-rcher-translation-add-on`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN |
| Aufruf-Helfer | `callApi_(url, method, body)` in `src/Api.gs` (Retry) |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/memsourceTranslateProfiles?pageSize=50&includeProjects=false` | MT-Profile prüfen (Admin) | Api.gs |
| POST | v1 | `/machineTranslations/{profileUid}/translate` | Segmente maschinell übersetzen (Profile Marketing/Technical/General) | Api.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) | Fallback-Übersetzung und Post-Editing (`gemini-3.6-flash`, Thinking „minimal“) | GEMINI_API_KEY |
| Google Sheets | SpreadsheetApp.openById(`ADMIN_USAGE_LOG_SHEET_ID`) | Usage Log | Nutzer des Add-ons |
| Docs/Sheets/Slides/Drive | DocumentApp, SpreadsheetApp, SlidesApp, DriveApp | Inhalte lesen/schreiben, Sicherungskopie | Nutzer des Add-ons |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| Workspace-Add-on-Karten | Docs, Sheets, Slides | `onHomepage`, `onSettings`, Übersetzen-Aktionen |
| `ADMIN_*` | Apps-Script-Editor | Admin- und Testfunktionen |

### Kärcher TermCheck (`term-author-checker`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN (Präfix `ApiToken`/`Bearer` wird entfernt) |
| Aufruf-Helfer | `_phraseFetch_` in `src/Code.gs` |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/termBases?pageNumber=…&pageSize=50` | Termbanken (Liste, Verbindungstest mit pageSize=1) | Code.gs |
| POST | v1 | `/termBases/{termBaseUid}/browse` | Terminologiesuche, Author Check (Termtreffer) | Code.gs, Authorcheck.gs |
| GET | v1 | `/projectTemplates/{templateUid}` | Sprachen der Vorlagen „Terminology check LLM/ALG“ | Code.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) (URL aus `GEMINI_API_URL`) | KI-Suche, Author Check, PDF-Prüfung (`AI_MODEL`, Standard `gemini-3.6-flash`) | GEMINI_API_KEY |
| Google Drive REST | POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart\|resumable&supportsAllDrives=true · GET/DELETE …/drive/v3/files/{id} | Berichte und kommentierte PDFs ablegen, große PDFs | Nutzer |
| Apps Script API | GET https://script.googleapis.com/v1/projects/{scriptId}/content | `exportProjectToTxt` (Quellcode als Text) | Nutzer |
| Google Sheets | SpreadsheetApp.openById(`CUSTOM_RULES_LOG_SHEET_ID`) | Custom Rules Log | Nutzer |
| MailApp | – | Hinweise an Admins | Nutzer |
| Gemini Gems | https://gemini.google.com/gem/1U9keOE3XPTPG3QEq63ZCYZ-5EOTruqgC · …/1bgoe1LSjDPZMId5lf98dBbVQp1KMH2CO | Links: Regel vorbereiten, Regel-Importer | – |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| Workspace-Add-on | Docs, Sheets, Slides, Drive | Terminologiesuche, Author Check, PDF-Prüfung in Drive |
| GET <Web-App-URL> (`doGet`) | Browser (Domain) | Terminologiesuche; `?page=pdfcheck` PDF-Prüffenster aus dem Drive-Add-on |
| `google.script.run.api…` | Sidebars/Web-App | Server-Funktionen (`tests/check.js` prüft, dass alle aufgerufenen existieren) |

### Kärcher Terminology Hub (`terminologie-hub`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | PHRASE_API_TOKEN (Präfix `ApiToken`/`Bearer` wird entfernt) |
| Aufruf-Helfer | `_phraseFetch_` in `src/Terminologyapi.gs`, direkte `UrlFetchApp.fetch/fetchAll` in `src/Termcheckhub.gs` |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/termBases?pageNumber=…&pageSize=50` | Termbanken auflisten, Auto-Erkennung der 3 Haupt-Termbanken | Terminologyapi.gs, Webappentry.gs |
| GET | v1 | `/termBases/{termBaseUid}` | Termbank-Details, Sprachen | Terminologyapi.gs, Termcheckhub.gs |
| POST | v1 | `/termBases/{termBaseUid}/browse` | Begriffe blättern/suchen (auch KI-Grounding, Ontologie) | Terminologyapi.gs |
| POST | v1 | `/termBases/{termBaseUid}/terms` | Begriff anlegen, Batch-Import, Import aus Projekt | Terminologyapi.gs, Termcheckhub.gs |
| PUT | v1 | `/termBases/{termBaseUid}/terms/{termId}` | Begriff ändern | Terminologyapi.gs |
| DELETE | v1 | `/termBases/{termBaseUid}/terms/{termId}` | Begriff löschen | Terminologyapi.gs |
| GET | v1 | `/termBases/{termBaseUid}/export?format=…&charset=UTF-8` | Termbank exportieren (XLSX/TBX/CSV) | Terminologyapi.gs |
| POST | v1 | `/termBases/{termBaseUid}/concepts` | Konzept anlegen (Import) | Termcheckhub.gs |
| GET | v1 | `/termBases/{termBaseUid}/concepts?pageNumber=…` | Konzepte für die tägliche Anreicherung | ConceptEnrichmentHub.gs |
| PUT | v1 | `/termBases/{termBaseUid}/concepts/{conceptId}` | Konzept anreichern (URL karcher.com, Subdomains) | ConceptEnrichmentHub.gs |
| GET | v1 | `/subDomains?name=…` | Subdomain-UID je Kategorie | ConceptEnrichmentHub.gs |
| GET | v1 | `/projectTemplates/{templateUid}` | Sprachen der Übersetzungsvorlagen DE/EN | Webappentry.gs |
| POST | v2 | `/projects/applyTemplate/{templateUid}` | Übersetzungsprojekt für freigegebene Begriffe | Termcheckhub.gs |
| POST | v1 | `/projects/{projectUid}/jobs` | Begriffe als XLIFF hochladen | Termcheckhub.gs |
| PUT | v1 | `/projects/{projectUid}/importSettings` | Import-Einstellungen (xlf) | Termcheckhub.gs |
| GET | v1 | `/projects/{projectUid}` | Projektstatus (Sync fertiger Projekte, `fetchAll`) | Termcheckhub.gs |
| GET | v2 | `/projects/{projectUid}/jobs?workflowLevel=1` | Jobs des Projekts | Termcheckhub.gs |
| PUT | v2 | `/projects/{projectUid}/jobs/{jobUid}/targetFile` | Zieldatei asynchron erzeugen | Termcheckhub.gs |
| GET | v2 | `/projects/{projectUid}/jobs/{jobUid}/downloadTargetFile/{asyncRequestId}` | Zieldatei abholen (Polling) | Termcheckhub.gs |
| GET | v1 | `/projects/{projectUid}/jobs/{jobUid}/segments?beginIndex=0&endIndex=500` | Segmente für Übersetzernotizen | TermSuggestions.gs |
| POST | v1 | `/jobs/{jobUid}/conversations/plains` | Übersetzernotiz (Definition, Kontext) als Kommentar | TermSuggestions.gs |
| GET | v1 | `/glossaries?pageNumber=…` | Glossare | GlossaryHub.gs |
| GET | v1 | `/glossaries/{glossaryUid}` | Glossar-Details | GlossaryHub.gs |
| POST | v1 | `/glossaries/{glossaryUid}/upload?strictLangMatching=false&updateTerms=true` | Begriffe ins Glossar hochladen | GlossaryHub.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Gemini (Apigee-Proxy) | POST https://34-111-99-134.nip.io/gemini/v1beta/models/{model}:generateContent (Header `x-api-key: GEMINI_API_KEY`) (URL aus Setting `GEMINI_API_URL`) | KI-Termvorschlag (`AI_MODEL`), Ontologie/Begriffsnetz | GEMINI_API_KEY |
| Google Sheets | SpreadsheetApp.openById(`TERM_CHECK_SHEET_ID`) | Settings, TermSuggestions_v2, MailQueue, TermCheckProjects, GlossaryUploadLog, AuditLog | Ausführender Nutzer |
| MailApp | – | Benachrichtigungen aus der MailQueue (Trigger `processMailQueue`) | Ausführender Nutzer |
| CDN | cdnjs (xlsx 0.18.5), jsDelivr (mermaid 10.9.1) | Excel-Import/Export, Diagramme im Browser | – |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| GET <Web-App-URL> (`doGet`) | Browser / Google Sites | Terminology-Hub-Oberfläche (`TerminologyHub.html`) |
| `google.script.run.api…` | Oberfläche | Funktionen mit Rollen-/Feature-Prüfung (`_requireAccess_`) |
| Zeit-Trigger | Apps Script | `processMailQueue` (Mail-Versand), `runDailyConceptEnrichment` (täglich) |

### Articulate Rise Patcher (`articulate-rise-patcher`)


#### 1. Phrase TMS (REST)

| | |
|---|---|
| Basis | `https://cloud.memsource.com/web/api2/<version>` |
| Token | – (nutzt die Portal-Funktionen `phraseDownloadTargetFile_`, `getPhraseAuthHeader_`) |
| Aufruf-Helfer | – |

| Methode | Version | Pfad | Zweck | Datei (`src/`) |
|---|---|---|---|---|
| GET | v1 | `/projects/{projectUid}/jobs/{jobUid}/targetFile` | Übersetzte Rise-XLIFF (über `phraseDownloadTargetFile_` des Portals) | Articulatepreview.gs |

Web-Links (keine API): Projekt `https://cloud.memsource.com/web/project2/show/{projectUid}` bzw. `/web/project/show/{projectUid}`, Job `https://cloud.memsource.com/web/job/{jobUid}/translate`.

#### 2. Weitere ausgehende Schnittstellen

| Dienst | Endpunkt | Zweck | Authentifizierung |
|---|---|---|---|
| Firebase Hosting | https://firebasehosting.googleapis.com/v1beta1/sites/{site}/versions → :populateFiles → Upload {hash} → PATCH finalize → POST releases?versionName= | Kursvorschau veröffentlichen (Site `kaercher-course-preview`) | SERVICE_ACCOUNT_JSON (JWT RS256 → oauth2.googleapis.com/token) |
| Google Drive | Drive v3 (erweiterter Dienst), DriveApp | SCORM-Ordner lesen, gepatchte ZIP | Ausführender Nutzer |
| Google Sheets | SpreadsheetApp.openById(`1V6oyZVw7-CPy8Bs5_sGl9Cg886b2T6r7FLGgp1gfBRY`) | Articulate-Registry (Tab `Projects`) | Ausführender Nutzer |

#### 3. Eingehende Einstiege

| Einstieg | Aufrufer | Beschreibung |
|---|---|---|
| Editor-Funktionen / `api*` | Apps-Script-Editor, Portal (Campus) | `patchAndDeployScormFolderToFirebase`, `apiRunArticulatePreview`, `apiGetPreviewProgress` … |
