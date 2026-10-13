# Postman-Tests: Kärcher Translation Services

> Automatisch erzeugt von `postman/generate.js` aus dem Code und `postman/config.js`. Nicht von Hand ändern – nach Code-Änderungen `node postman/generate.js` ausführen.

Portal für Übersetzungsprojekte über Phrase TMS: Projekte aus Vorlagen anlegen und Dateien hochladen, Meine Projekte mit Frist/Name/Notiz/Teilen/Abbrechen, Download und Drive-Export, Dokumentation (XML-Import, Board, Drive-Export), Campus/Articulate-Vorschau, Marketing (Consulting, Vorab-Kalkulation, Maximaltemplate), persönliche Einstellungen, Kalender und Vertretung, eine umfangreiche Admin-Konsole und der Google-Chat-Bot mit Slash-Commands.

| Datei | Inhalt |
|---|---|
| [`kaerchertranslationservices.postman_collection.json`](kaerchertranslationservices.postman_collection.json) | Collection: 280 Server-Funktionen (132 lesend, 148 schreibend) plus Verbindungs-, Web-App-, Schnittstellen- und Negativtests |
| [`kaerchertranslationservices.postman_environment.json`](kaerchertranslationservices.postman_environment.json) | Environment mit allen Variablen (IDs, Schalter, Schlüssel) |
| [`config.js`](config.js) | Bereiche, Beispielwerte, Zusatztests – hier wird die Collection angepasst |
| [`generate.js`](generate.js) | Generator (in allen Kärcher-Translation-Repositories gleich) |

## Wie die Tests funktionieren

Die App ist ein Google-Apps-Script-Projekt. Es gibt keine klassische REST-API: Die Oberfläche ruft Server-Funktionen per `google.script.run` auf. Postman kann diese Funktionen trotzdem aufrufen – über die **Apps Script API**:

```http
POST https://script.googleapis.com/v1/scripts/{{scriptId}}:run
Authorization: Bearer <Google-Token>

{ "function": "apiGetContext", "parameters": [], "devMode": false }
```

Die Funktion läuft dann mit **Ihrem** Google-Konto – genau wie beim Klick in der Oberfläche. Admin-Funktionen funktionieren also nur, wenn Ihr Konto Admin ist; mit einem Nicht-Admin-Konto lassen sich umgekehrt die Schutzregeln testen.

Die Antwort sieht so aus:

```jsonc
// Erfolg
{ "done": true, "response": { "@type": "type.googleapis.com/google.apps.script.v1.ExecutionResponse", "result": { /* Rückgabewert der Funktion */ } } }
// Fehler im Skript (HTTP trotzdem 200)
{ "done": true, "error": { "code": 3, "details": [{ "errorMessage": "…", "errorType": "ScriptError", "scriptStackTraceElements": [ … ] }] } }
```

Jede Anfrage prüft automatisch: **HTTP 200**, **kein Skriptfehler**, **kein `success: false` / `ok: false` / `authorized: false`** im Ergebnis und die **Antwortzeit**. Bei Skriptfehlern steht der Stacktrace in der Postman-Konsole. Einige Anfragen prüfen zusätzlich bestimmte Felder und merken sich IDs (z. B. die erste Projekt-UID) für die nächsten Anfragen.

## Ordnerstruktur – was wird wo getestet?

| Ordner | Was wird getestet |
|---|---|
| **00 · Start hier – Verbindung, Token & Bereitstellung prüfen** | Prüft Schritt für Schritt alles, was die übrigen Ordner brauchen – zuerst ausführen. |
| **01 · Web-App öffnen – Seiten laden (doGet / doPost)** | Ruft die Web-App wie ein Browser auf (mit Ihrem Google-Token) und prüft, dass die Seite ohne Fehler ausgeliefert wird. |
| **02 · Start – Konfiguration, Zugang, Wörterbücher, nachgeladene Oberfläche** | Alles, was das Portal beim Start und beim ersten Öffnen eines Bereichs lädt: Start-Config (Vorlagen, Sprachen, Rollen, Wartung, Wörterbuch), Zugangsprüfung, Oberflächenteile, Feiertage, Knowledge-Base-Pakete. |
| **03 · Projekt anlegen – Upload, KeC, Vorlagen, Presets, Drive-Auswahl** | Phrase-Projekt aus Vorlage anlegen und Dateien hochladen (auch KeC: an bestehendes Projekt), Pivot-Zielsprachen, Formular-Vorlagen (Presets), Drive-Ordner blättern. |
| **04 · Meine Projekte – Liste, Fortschritt, Frist, Name, Notizen, Teilen, Abbrechen** | Projekte des Kontos (eigene, geteilte, Team, Vertretung), Fortschritt aus Phrase, Dashboard und alle Aktionen an einem Projekt. |
| **05 · Download & Drive-Export – Einzeldatei, ZIP, „Save to Drive“** | Übersetzte Dateien als Base64 (einzeln oder ZIP) und Speichern in „Meine Ablage“ über die Drive-Freigabe des Nutzers. |
| **06 · Dokumentation – XML-Import, Board, Drive-Ordner, Export** | Der Bereich „Documentation“: XML-Dateien je Sprache aus Drive importieren, Board, Ordnerbaum unter dem Doku-Root, fertige Übersetzungen zurück nach Drive. |
| **07 · Campus / Articulate – Rise-Kurse registrieren und Vorschau erzeugen** | Kurse registrieren (mit Validierung), Vorschau erzeugen (Phrase-XLIFF → Rise patchen → Firebase Hosting) mit Fortschritt, Auswahllisten, Whitelist. |
| **08 · Persönlich – Einstellungen, Glocke, Chat, Kalender, Vertretung** | Einstellungen des eigenen Kontos: Darstellung, Team-Ansicht, Benachrichtigungen, Chat an/aus, Google-Kalender-Abgleich, Urlaubsvertretung. |
| **09 · Marketing – Consulting-Anfragen, Vorab-Kalkulation, Maximaltemplate** | Consulting-Anfragen mit Historie, Vorab-Kalkulation (Jobs hochladen → Analyse → Angebot → Jobs löschen), Kataloge für das Maximaltemplate. |
| **10 · Admin: Zugriffe, Whitelists, Admins & Admin-Light** | Wer darf welchen Bereich nutzen (General, Marketing, KeC, Documentation, WOMA, CC), Admins und Admin-Light mit Unterbereichen. |
| **11 · Admin: Wartung, System, Script Properties, Sandbox** | Wartungsfenster, Dateigrößen-Limit, Admin-Dashboards, Script Properties lesen/ändern (sensible Werte maskiert), Admin-Sandbox. |
| **12 · Admin: Synchronisation – Vorlagen, Nutzer, Benachrichtigungen, Chat-Zuordnung** | Abgleich mit Phrase (Vorlagen, Nutzer), Benachrichtigungen, Zuordnung E-Mail → Chat-User, automatischer Sync. |
| **13 · Admin: User- & Template-Manager, Debugger** | Nutzer-Segmentierung (Client, Domain, Subdomain, Business Unit) und Vorlagen pflegen; Debugger erklärt, warum ein Nutzer welche Vorlage (nicht) sieht. |
| **14 · Admin: Pivot-Übersetzungen – Vorlagen-Verknüpfung & Sprachzuordnung** | Pivot-Vorlagen (z. |
| **15 · Admin: Kommunikation – Ankündigungen, Nachrichtenvorlagen, Chat-Test, Watcher** | Ankündigungen (auch per Chat), Texte der Chat-Nachrichten DE/EN, Testnachricht über den Bot, Watcher für neue Projekte. |
| **16 · Admin: Protokoll, Health-Check & Selbsttests** | Audit-Log (inkl. |
| **17 · Admin: Translate UI – Oberflächentexte über Phrase Strings** | Oberflächentexte nach Phrase Strings schieben und Übersetzungen zurückholen, Abdeckung, nächtlicher Abgleich. |
| **18 · Wartung & Diagnose – Editor-Funktionen und Trigger** | Funktionen, die das Portal nicht aufruft: Einrichtung (Trigger, Sheet-Dokumentation, Header-Reparatur), Chat-Token- und Zuordnungs-Werkzeuge, SCORM/Rise-Patcher und Firebase-Deploy, Debug- und Testfunktionen sowie Zeit-Trigger. |
| **19 · Externe Schnittstelle: Phrase TMS direkt testen** | Ruft die Phrase-Endpunkte, die die App intern benutzt, direkt auf – ohne Apps Script. |
| **20 · Externe Schnittstelle: Gemini-Gateway direkt testen** | Ruft das Gemini-Gateway (`{{geminiBaseUrl}}`) direkt auf – unabhängig von Apps Script. |
| **21 · Datenbank prüfen – Google-Sheets-Struktur** | Liest die Google Sheets, die der App als Datenbank dienen, über die Sheets API und prüft, ob die erwarteten Reiter vorhanden sind. |
| **22 · Externe Schnittstelle: Phrase Strings (Translate UI)** | Phrase Strings verwaltet die Oberflächentexte des Portals (Admin › Translate UI). |
| **23 · Negativtests – Fehlerfälle, Schutz & Berechtigungen** | Prüft, dass falsche oder unberechtigte Aufrufe sauber abgelehnt werden: unbekannte und private Funktionen, fehlender Token, falsche IDs, ungültige Eingaben und app-spezifische Schutzregeln. |

In jedem Funktionsordner:

- **🔍 Lesen – ändert nichts:** gefahrlos, auch gegen die Produktion.
- **✏️ Schreiben & Auslösen – ändert Daten:** ändert Sheets/Properties, sendet Chat/E-Mail, legt Projekte an, startet Läufe oder verbraucht Gemini-Tokens. Läuft nur mit `allowWrites = true`.

Kennzeichen im Namen bzw. in der Beschreibung: ✏️ schreibt/löst aus · ⚠️ kritisch (zusätzlich `allowMaintenance`) · 🔒 Admin (Funktion prüft Admin-Rechte) · ⏰ Zeit-Trigger.

## Einrichtung (einmalig)

**1. Apps Script API einschalten** – im eigenen Konto unter https://script.google.com/home/usersettings „Google Apps Script API“ auf **An**.

**2. Skript mit einem Google-Cloud-Projekt verknüpfen und als API-Executable bereitstellen**

1. Apps-Script-Editor > Projekteinstellungen > *Google Cloud Platform-Projekt* > **Projekt ändern** und die Projektnummer eines Standard-GCP-Projekts eintragen (nicht das automatische Standardprojekt – `scripts.run` braucht ein eigenes).
2. Im GCP-Projekt: **APIs & Dienste > Bibliothek** – „Apps Script API“ aktivieren, „Google Sheets API“ und „Google Drive API“ ebenfalls.
3. **Bereitstellen > Neue Bereitstellung > Typ „API-Executable“**, Zugriff „Jeder in der Domain“ bzw. „Nur ich“. Die bestehende Web-App-Bereitstellung bleibt unverändert.

**3. OAuth-Client anlegen** (im selben GCP-Projekt): **APIs & Dienste > Anmeldedaten > OAuth-Client-ID > Webanwendung**, autorisierte Weiterleitungs-URI `https://oauth.pstmn.io/v1/callback`. Client-ID und -Secret ins Environment (`googleClientId`, `googleClientSecret`). Ist der OAuth-Zustimmungsbildschirm „Intern“, dürfen alle Konten der Domain.

**4. In Postman importieren und Token holen**

1. *Import* → beide JSON-Dateien aus diesem Ordner.
2. Environment „Kärcher Translation Services – Umgebung“ auswählen, mindestens `scriptId` eintragen, für Phrase `phraseToken` (oder Benutzer/Passwort), für Gemini `geminiApiKey`.
3. Collection öffnen > Reiter **Authorization** > **Get New Access Token** > mit dem Google-Konto anmelden > **Use Token**. Der Token gilt 60 Minuten; danach erneut holen. Nach der ersten Apps-Script-Anfrage steht er automatisch auch in `googleAccessToken` (für den Token-Test und Newman); sonst einmal von Hand dort eintragen.
4. Ordner **00 · Start hier** ausführen. Sind alle Tests grün, funktioniert alles Weitere.

**Benötigte Scopes** (Variable `googleScopes` der Collection; der Token muss **alle** Scopes enthalten, die das Skript benutzt, sonst `PERMISSION_DENIED`):

- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/script.external_request`
- `https://www.googleapis.com/auth/script.scriptapp`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/admin.directory.user`
- `https://www.googleapis.com/auth/admin.directory.user.readonly`
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/directory.readonly`
- `https://www.googleapis.com/auth/cloud-identity.groups.readonly`
- `https://www.googleapis.com/auth/contacts.readonly`
- `https://www.googleapis.com/auth/script.projects.readonly`
- `https://www.googleapis.com/auth/drive.readonly`
- `https://www.googleapis.com/auth/spreadsheets.readonly`

Die Web-App läuft „als Bereitsteller“ (USER_DEPLOYING). Über `scripts.run` läuft eine Funktion dagegen **immer mit dem Konto des Tokens** – Sheets, Drive und Admin Directory werden also mit Ihren Rechten gelesen. Für vollständige Tests daher mit dem Konto testen, das die Web-App bereitstellt, oder eines mit gleichen Rechten auf Sheets/Ordner. `admin.directory.user` braucht ein Konto mit Admin-Directory-Rechten; ohne diese schlagen nur die Nutzer-Sync-Funktionen fehl.

## Ausführen

- **Einzeln:** Anfrage öffnen, Parameter im Body prüfen, *Send*. Ergebnis unter *Test Results*, Details in der Postman-Konsole.
- **Ganzer Ordner / ganze Collection:** Rechtsklick > *Run* (Collection Runner). Mit `allowWrites = false` laufen nur lesende Aufrufe; schreibende werden übersprungen.
- **Kommandozeile / CI** mit [Newman](https://www.npmjs.com/package/newman):

```bash
npx newman run postman/kaerchertranslationservices.postman_collection.json \
  -e postman/kaerchertranslationservices.postman_environment.json \
  --env-var scriptId=<SKRIPT-ID> --env-var googleAccessToken=<TOKEN> \
  --env-var allowWrites=false \
  --folder "00 · Start hier – Verbindung, Token & Bereitstellung prüfen"   # optional: nur ein Ordner
```

Ein Token für Newman lässt sich z. B. mit `gcloud auth login --enable-gdrive-access` und eigenem OAuth-Client oder über den Postman-Dialog erzeugen; er muss vom OAuth-Client desselben GCP-Projekts stammen.

### Sicherheitsschalter

Standardmäßig ist alles aus, was Daten ändern kann. Ein Sammellauf über die ganze Collection ist damit gefahrlos.

| Schalter | Standard | Wirkung |
|---|---|---|
| `allowWrites` | `false` | ✏️-Anfragen (Daten ändern, Nachrichten senden, Läufe starten, Gemini-Tokens verbrauchen) werden übersprungen. |
| `allowMaintenance` | `false` | Schreibende Funktionen im Ordner „Wartung & Diagnose“ und als ⚠️ kritisch markierte Aktionen (z. B. Schlüssel löschen, Wartungsfenster setzen, Nachricht an alle) laufen nur, wenn **zusätzlich** dieser Schalter `true` ist. Einzeln ausführen, nie als Sammellauf. |
| `testAsNonAdmin` | `false` | Schaltet die Negativtests „als Nicht-Admin“ frei. Nur setzen, wenn der Token zu einem Konto **ohne** Admin-Rechte gehört – mit Admin-Token würden diese Funktionen wirklich ausgeführt. |

### Empfohlene Reihenfolge

1. `allowWrites = false`: komplette Collection laufen lassen → alle Lese-Funktionen, Seiten, Schnittstellen und Negativtests.
2. Testdaten in die Variablen eintragen (z. B. eine Test-Projekt-UID), `allowWrites = true`, dann **einzelne** Schreib-Ordner gezielt ausführen.
3. Mit einem **Nicht-Admin-Konto** (neuer Token) und `testAsNonAdmin = true` den Ordner **Negativtests** ausführen: Die Tests „als Nicht-Admin“ sind grün, wenn der Schutz greift. Zusätzlich die Lese-Ordner ausführen: 🔒-Anfragen müssen dann rot sein (Berechtigungsfehler) – ein grüner 🔒-Test mit Nicht-Admin-Token wäre eine Sicherheitslücke.

## Variablen

| Variable | Bedeutung |
|---|---|
| `scriptId` | Skript-ID des Apps-Script-Projekts (Editor > Projekteinstellungen > IDs > Skript-ID). |
| `devMode` | `true` = neuesten gespeicherten Code (HEAD) ausführen statt der API-Executable-Version. Nur für Projektinhaber/Bearbeiter. (Standard: `false`) |
| `allowWrites` | Sicherheitsschalter. Nur bei `true` laufen Anfragen, die Daten ändern, Nachrichten senden oder Läufe starten (✏️). (Standard: `false`) |
| `allowMaintenance` | Zweiter Schalter für den Ordner „Wartung & Diagnose“ und ⚠️ kritische Aktionen: laufen nur mit allowWrites = true UND allowMaintenance = true. (Standard: `false`) |
| `testAsNonAdmin` | Nur auf `true` setzen, wenn der aktuelle Token zu einem Konto OHNE Admin-Rechte gehört. Schaltet die Negativtests „als Nicht-Admin“ frei. (Standard: `false`) |
| `googleAccessToken` | Google-OAuth-Token (wird über „Get New Access Token“ der Collection erzeugt und hier eingetragen). Läuft nach 60 Minuten ab. |
| `googleClientId` | OAuth-Client-ID (Typ „Webanwendung“) aus DEMSELBEN Google-Cloud-Projekt, mit dem das Apps-Script-Projekt verknüpft ist. |
| `googleClientSecret` | Client-Secret zur Client-ID. Nicht teilen, nicht committen. |
| `currentUserEmail` | Wird vom Token-Test automatisch gesetzt. |
| `maxResponseMs` | Grenze für die Antwortzeit-Prüfung in Millisekunden. (Standard: `360000`) |
| `phraseBaseUrl` | Basis-URL der Phrase-TMS-API (ohne /v1). (Standard: `https://cloud.memsource.com/web/api2`) |
| `phraseUserName` | Phrase-Benutzername für den Login-Request (optional, alternativ phraseToken direkt setzen). |
| `phrasePassword` | Phrase-Passwort (nur lokal speichern). |
| `phraseToken` | Phrase-API-Token (wird vom Login gesetzt oder direkt eingetragen). |
| `geminiBaseUrl` | Kärcher-Gemini-Gateway (ohne Schrägstrich am Ende). (Standard: `https://34-111-99-134.nip.io/gemini/v1beta/models`) |
| `geminiModel` | Modellname wie in den Einstellungen der App. (Standard: `gemini-3.6-flash`) |
| `geminiApiKey` | Schlüssel für das Gateway (Header x-api-key). Entspricht der Script Property GEMINI_API_KEY (Chat-Bot, Chatbot.gs). |
| `articulateProjectId` | ID eines registrierten Articulate-Kurses (aus apiListArticulateProjectsForUi). Benutzt von: apiGenerateArticulatePreviewById, apiGenerateArticulatePreview, apiRunArticulatePreview |
| `businessUnitId` | Benutzt von: apiSaveKecEligibilitySettings, apiSaveDocExportEligibilitySettings |
| `calcProjectUid` | Benutzt von: apiPrecalcStart |
| `childTemplateUid` | Benutzt von: apiAddPivotTemplateLink, apiRemovePivotTemplateLink |
| `clientId` | Benutzt von: apiSaveKecEligibilitySettings, apiSaveDriveSaveClientId, apiSaveDocExportEligibilitySettings |
| `clientSecret` | Benutzt von: apiSaveDriveSaveClientId |
| `domainId` | Benutzt von: apiSaveKecEligibilitySettings, apiSaveDocExportEligibilitySettings |
| `email` | E-Mail-Adresse. Benutzt von: apiRemoveAdminLightUser, apiAddKecWhitelist, apiRemoveKecWhitelist, apiAddMarketingWhitelist, apiRemoveMarketingWhitelist, apiAddKeCWhitelist, apiRemoveKeCWhitelist, apiAddDocWhitelist … (Standard: `{{testEmail}}`) |
| `emailToAdd` | Benutzt von: apiAddArticulateWhitelist, apiAddCcWhitelist, apiAddWomaWhitelist, apiAddWhitelist, apiAddAdmin (Standard: `{{testEmail}}`) |
| `emailToRemove` | Benutzt von: apiRemoveArticulateWhitelist, apiRemoveCcWhitelist, apiRemoveWomaWhitelist, apiRemoveWhitelist, apiRemoveAdmin (Standard: `{{testEmail}}`) |
| `endIso` | Benutzt von: apiSetMaintenance, apiSaveMaintenanceConfig (Standard: `2026-12-24T20:00:00.000Z`) |
| `exactName` | Benutzt von: apiDebugPivotFindChild |
| `fileId` | Benutzt von: apiUploadDocXmlBatch |
| `folderId` | Drive-Ordner-ID oder home, root, ::shared-drives-root::. Benutzt von: apiBrowseDrive, apiGetDocDriveTreeById, apiGetDocImportFolderHistory (Standard: `home`) |
| `id` | ID eines Datensatzes (Consulting-Anfrage, Ankündigung, Kurs, Kalkulation …). Benutzt von: apiDeleteArticulateProjectFromUi, apiDeleteArticulateProject, apiConsultingGet, apiPrecalcPoll, apiConsultingAssign, apiConsultingUpdate, apiConsultingComment, apiConsultingSubmit … |
| `idOrUrl` | Benutzt von: apiSaveDocDriveRootSettings |
| `jobUid` | UID eines Jobs dieses Projekts (wird von apiGetMyProjects übernommen). Benutzt von: Slash-Command /JobStats (ID 10) – Job-Statistik, Slash-Command /AssignLinguist (ID 5), Slash-Command /NotifyVendor (ID 9), apiGetJobNotes, apiAddJobNote, apiDownloadMultipleTargets, apiSmartDownload, apiUserDownloadFromPhrase … |
| `key` | Schlüssel (Script Property bzw. Nachrichtenvorlage, z. B. MSG_PROJECT_SUBMITTED). Benutzt von: apiSaveMessageTemplate, apiResetMessageTemplate (Standard: `MSG_PROJECT_SUBMITTED`) |
| `kind` | Suchart für das Maximaltemplate: users, vendors, tms, tbs. Benutzt von: apiMaxTplSearch (Standard: `users`) |
| `langCode` | Benutzt von: apiSetPivotLanguageMapping, apiRemovePivotLanguageMapping |
| `mainSpreadsheetId` | Benutzt von: Portal-Datenbank: Kern-Reiter vorhanden?, Portal-Datenbank: Zusatz-Reiter vorhanden? |
| `message` | Benutzt von: apiSetMaintenance, apiSaveMaintenanceConfig (Standard: `Wartung (Postman-Test)`) |
| `mode` | Sync-Modus: full oder add_only. Benutzt von: apiTriggerManualSync (Standard: `add_only`) |
| `newDateIso` | Neue Frist als ISO-Datum. Benutzt von: apiUpdateDueDate (Standard: `2026-12-31T00:00:00.000Z`) |
| `newName` | Neuer Projektname. Benutzt von: apiUpdateProjectName (Standard: `Postman-Test (umbenannt)`) |
| `newNote` | Neue Projektnotiz. Benutzt von: apiUpdateProjectNote (Standard: `Notiz aus Postman`) |
| `noteText` | Text der Job-Notiz. Benutzt von: apiAddJobNote (Standard: `Job-Notiz aus Postman`) |
| `optionValue` | Benutzt von: apiSetPivotLanguageMapping |
| `parentTemplateUid` | Benutzt von: apiGetPivotChildLanguageOptions, apiAddPivotTemplateLink, apiRemovePivotTemplateLink |
| `pathPrefix` | Benutzt von: deployBlobsToFirebaseHosting, patchAndDeployScormToFirebase, patchAndDeployScormFolderToFirebase |
| `presetId` | Benutzt von: apiDeletePreset |
| `projectIdentifier` | Benutzt von: repairSpecificProject |
| `projectName` | Projektname. Benutzt von: apiGetPhraseProjectMetaByName, apiDownloadMultipleTargets, apiSmartDownload, apiDownloadAllJobsAsZip, apiGetFilesForDriveExport, apiSaveProjectToDrive, apiGetDocDriveTree, apiGetDocExportStatus … (Standard: `Postman-Test`) |
| `projectUid` | UID eines Projekts aus „Meine Projekte“ (wird von apiGetMyProjects übernommen). Für Schreibtests ein TEST-Projekt! Benutzt von: Slash-Command /ProjectStatus (ID 4) – Projektstatus, Slash-Command /JobStats (ID 10) – Job-Statistik, Slash-Command /QuoteStatus (ID 8) – Angebot, Slash-Command /ChangeDueDate (ID 2) – Frist ändern, Slash-Command /ChangeProjectName (ID 1) – Projekt umbenennen, Slash-Command /CloseProject (ID 6) – Projekt abschließen, Slash-Command /AssignLinguist (ID 5), Slash-Command /ChangeRevisor (ID 3) … |
| `psBaseUrl` | Benutzt von: Strings-Projekt lesen, Sprachen (Locales) des Strings-Projekts, Schlüssel (Keys) – erste Seite |
| `psProject` | Phrase-Strings-Projekt-ID (Script Property PHRASE_STRINGS_PROJECT). Benutzt von: apiPsSaveConfig, Strings-Projekt lesen, Sprachen (Locales) des Strings-Projekts, Schlüssel (Keys) – erste Seite |
| `psToken` | Phrase-Strings-Token (klassischer 64-Hex-Token). Benutzt von: apiPsSaveConfig, Strings-Projekt lesen, Sprachen (Locales) des Strings-Projekts, Schlüssel (Keys) – erste Seite |
| `query` | Suchbegriff. Benutzt von: apiSearchDocDriveFolders, apiMaxTplSearch (Standard: `Hochdruck`) |
| `runtimeDataJsText` | Benutzt von: testPatchLogicOnly |
| `scormFolderId` | Benutzt von: patchAndDeployScormFolderToFirebase |
| `scormZipFileId` | Benutzt von: patchAndDeployScormToFirebase, generatePatchedScormZip |
| `sessionId` | Frei wählbare ID für Fortschrittsabfragen (Vorschau/Kalkulation). Benutzt von: apiGetPreviewProgress, apiGenerateArticulatePreviewById, apiGenerateArticulatePreview, apiRunArticulatePreview (Standard: `postman-session-1`) |
| `siteId` | Benutzt von: deployBlobsToFirebaseHosting, patchAndDeployScormToFirebase, patchAndDeployScormFolderToFirebase |
| `sourceLang` | Ausgangssprache der Vorlage (wird von apiGetConfig übernommen). Benutzt von: apiCreateProjectAndUpload, apiHandleUpload, apiUploadDocXmlBatch, apiConsultingCreate |
| `startIso` | Benutzt von: apiSetMaintenance, apiSaveMaintenanceConfig (Standard: `2026-12-24T18:00:00.000Z`) |
| `subDomainId` | Benutzt von: apiSaveDocExportEligibilitySettings |
| `targetLang` | Zielsprache, z. B. de_de (wird von apiGetConfig übernommen). Benutzt von: apiUploadToExistingProject, apiSavePreset, apiCreateProjectAndUpload, apiHandleUpload, apiDownloadMultipleTargets, apiSmartDownload, apiUserDownloadFromPhrase, apiDownloadAllJobsAsZip … |
| `templateUid` | UID einer Projektvorlage (wird von apiGetConfig übernommen). Benutzt von: apiSavePresetSheet, apiSavePreset, apiCreateProjectAndUpload, apiHandleUpload, apiGetDocImportTemplateLangs, apiUploadDocXmlBatch, apiMaxTplOptions, apiConsultingCreate … |
| `testEmail` | E-Mail eines Testkontos (Teilen, Whitelists, Admin-Funktionen). Standard: eigenes Konto. Benutzt von: Slash-Command /AssignLinguist (ID 5), Slash-Command /ChangeRevisor (ID 3), apiShareProject, apiSaveDeputySettings, apiSetAccessBulk, apiAddAdminLightUser, apiGetUserDetail, apiDebugUserTemplates … (Standard: `{{currentUserEmail}}`) |
| `type` | Sync-Art: templates, users, notifications, chatmappings. Benutzt von: apiTriggerManualSync (Standard: `templates`) |
| `uiLang` | Oberflächensprache: de, en, fr, es, pt, zh. Benutzt von: apiGetAdminI18n, apiGetI18nDict, apiGetConfig, apiGetCalendarAuthUrl, apiSetCalendarSyncOptions (Standard: `de`) |
| `username` | Phrase-Benutzername. Benutzt von: apiBulkUpdateUserField, apiCopyUserSegmentation, apiUpdateUserField |
| `webAppUrl` | URL der Web-App-Bereitstellung (…/exec). Wird von „Bereitstellungen“ automatisch gesetzt, wenn leer. Benutzt von: Web-App, Portal laden (Startseite), Knowledge Base als eigene Seite (?page=kb), Knowledge Base – Alias ?page=wissen, Unbekannte Seite (?page=gibtesnicht) → Portal, Chat-Bot: Nachricht (MESSAGE) → Hinweis „read-only“, Chat-Bot: zum Space hinzugefügt (ADDED_TO_SPACE) → Begrüßung, Chat-Bot: unbekannter Ereignistyp → leere Antwort {} … |

Objekt-, Listen-, Zahlen- und Ja/Nein-Parameter stehen direkt im Body der jeweiligen Anfrage (mit Beispielwerten); Text-Parameter kommen aus gleichnamigen Variablen, damit zusammengehörige Aufrufe dieselbe ID benutzen.

## Besonderheiten Translation Services

- **Chat-Bot (`doPost`)** steht im Ordner „Web-App“: echte Chat-Ereignisse mit Ihrer E-Mail (`currentUserEmail`) als Absender. Antworten des Slash-Command-Routers kommen als CardService-Objekt; je nach Apps-Script-Version ist die JSON-Antwort dann leer – entscheidend ist HTTP 200 und kein Fehlertext.
- Bekannte Auffälligkeiten (siehe `docs/AUFFAELLIGKEITEN.md`) erscheinen als rote Tests, z. B. `apiSaveDocExportEligibilitySettings` (immer abgelehnt) und doppelt definierte Funktionen (Liste am Ende).
- Zusätzliche Variablen: `psBaseUrl` (`https://api.phrase.com/v2`, US: `https://api.us.app.phrase.com/v2`), `psProject`, `psToken` für Phrase Strings; `clientId`, `domainId`, `businessUnitId` für die Eligibility-Einstellungen; `fileId` für den Doku-Import; `calcProjectUid` für die Vorab-Kalkulation.

## Grenzen

- `scripts.run` hat dieselben Limits wie das Skript (6 Minuten Laufzeit, Kontingente für UrlFetch/Mail). Lange Läufe zeigen dasselbe Verhalten wie in der Oberfläche.
- Rückgabewerte müssen serialisierbar sein. Funktionen, die HTML-Ausgaben, Karten oder Blobs liefern, sind unten als „nicht über die API testbar“ aufgeführt.
- `Session.getActiveUser()` liefert das Konto des Tokens. Funktionen, die ein geöffnetes Dokument oder einen Seitenbereich brauchen (`DocumentApp.getActiveDocument()` usw.), laufen über die API nicht.
- Mit `devMode = false` läuft die Version der API-Executable-Bereitstellung. Nach Code-Änderungen also neue Version bereitstellen oder `devMode = true` (nur Bearbeiter).

## Funktionskatalog

Alle öffentlichen Server-Funktionen (ohne `_` am Ende), wie sie in der Collection stehen.


### 02 · Start – Konfiguration, Zugang, Wörterbücher, nachgeladene Oberfläche

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetAdminI18n(lang)` | 🔍 liest · 🔒 | `AdminI18n.gs:3434` | Admin-Wörterbuch |
| `apiGetContext()` | 🔍 liest · 🔒 | `Code.gs:10` | { email, isAdmin, maintenance } |
| `apiGetMaintenance()` | 🔍 liest | `Code.gs:34` | Wartungsstatus |
| `apiCheckAccess()` | 🔍 liest · 🔒 | `Code.gs:95` | { allowed, reason, maintenance? } |
| `apiGetGermanHolidays(years)` | 🔍 liest | `GermanHolidays.gs:87` | Feiertage (für Fristprüfung im Browser) |
| `apiGetI18nDict(lang)` | 🔍 liest | `I18nDicts.gs:7306` | App-Wörterbuch einer Sprache |
| `apiKbChunk(n)` | 🔍 liest | `KnowledgebaseApi.gs:19` | Knowledge-Base-Paket als JSON-Text { artikelId: html } |
| `apiGetTranslateUiContent()` | 🔍 liest | `PhraseStrings.gs:335` | { html, js } Translate UI |
| `apiGetHomeUi()` | 🔍 liest | `UserPrefs.gs:240` | { css, js } der Startseite (HomeUi.html) |
| `apiGetPrefsUi()` | 🔍 liest | `UserPrefs.gs:249` | Markup des Einstellungsdialogs |
| `apiGetDarkThemeCss()` | 🔍 liest | `UserPrefs.gs:258` | CSS des dunklen Modus |
| `apiGetLazyScript(name)` | 🔍 liest | `WebApp.gs:43` | Skripttext zum Nachladen |
| `apiGetGuideContent()` | 🔍 liest | `WebApp.gs:56` | HTML von Anleitung/FAQ |
| `apiGetConfig(impersonateEmail, uiLang)` | 🔍 liest | `WebApp.gs:67` | Bereich „Rohdaten“ (siehe Dokumentation). |
| `apiGetAdminContent()` | 🔍 liest | `WebApp.gs:86` | { html, js } der Admin-Konsole |
| `apiGetPivotAdminContent()` | 🔍 liest | `WebApp.gs:102` | { html, js } Pivot-Admin |

### 03 · Projekt anlegen – Upload, KeC, Vorlagen, Presets, Drive-Auswahl

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetUserPresets()` | 🔍 liest | `Apialiases.gs:81` | Aliase (Apialiases.gs) |
| `apiSavePresetSheet(presetData)` | ✏️ schreibt | `Apialiases.gs:146` | Aliase (Apialiases.gs) |
| `apiBrowseDrive(folderId)` | 🔍 liest | `DriveHelpers.gs:13` | Drive-Ordner blättern (home, root, ::shared-drives-root::, Ordner-ID) |
| `apiGetKecEligibilitySettings()` | 🔍 liest · 🔒 | `KeCProjects.gs:43` | KeC-Kriterien |
| `apiSaveKecEligibilitySettings(clientId, domainId, businessUnitId)` | ✏️ schreibt · 🔒 | `KeCProjects.gs:55` | KeC-Kriterien |
| `apiGetEligibleKeCProjects()` | 🔍 liest | `KeCProjects.gs:88` | KeC-Projekte (Status NEW, passende Client/Domain/BU-IDs) |
| `apiDebugSingleKeCProject(projectUid)` | 🔍 liest | `KeCProjects.gs:293` | Diagnose, warum ein Projekt (nicht) als KeC gilt |
| `apiUploadToExistingProject(payload)` | ✏️ schreibt | `KeCProjects.gs:407` | KeC: Dateien an bestehendes Phrase-Projekt |
| `apiGetKecUserSettings()` | 🔍 liest | `KecSettings.gs:81` | Persönliche KeC-Einstellungen (Namenszusatz, Spalten für multilinguale Excel-Dateien, Upload-Puffer). |
| `apiSaveKecUserSettings(settings)` | ✏️ schreibt | `KecSettings.gs:91` | Speichert die persönlichen KeC-Einstellungen. |
| `apiGetPivotChildLanguageOptions(parentTemplateUid)` | 🔍 liest | `PivotTemplateLinks.gs:144` | Zielsprachen für Pivot-Übersetzungsschritt |
| `apiSavePreset(presetData)` | ✏️ schreibt | `Presets.gs:28` | Formular-Vorlagen |
| `apiLoadPresets()` | 🔍 liest | `Presets.gs:70` | Formular-Vorlagen |
| `apiDeletePreset(presetId)` | ✏️ schreibt | `Presets.gs:103` | Formular-Vorlagen |
| `apiGetTemplates()` | 🔍 liest | `Sheets.gs:9` | alle Vorlagen aus dem Sheet (ungefiltert) |
| `apiCreateProjectAndUpload(payload)` | ✏️ schreibt | `Upload.gs:30` | Legt Phrase-Projekt(e) aus Vorlage an, lädt Dateien als Jobs und Referenzen hoch, schreibt Queue-Zeile(n), schickt Chat-Nachricht, informiert Watcher |
| `apiHandleUpload(payload)` | ✏️ schreibt | `WebApp.gs:110` | Kompatibilitäts-Wrapper: normalisiert alte Feldnamen, ruft obige Funktion |

### 04 · Meine Projekte – Liste, Fortschritt, Frist, Name, Notizen, Teilen, Abbrechen

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetPhraseProjectMetaByName(projectName)` | 🔍 liest | `DocBoard.gs:102` | Phrase-Metadaten per Namen |
| `apiListMyProjects()` | 🔍 liest · 🔒 | `Sheets.gs:49` | ältere Variante |
| `apiAddJobNote(projectUid, jobUidRaw, noteText, callerOverride)` | ✏️ schreibt | `Upload.gs:426` | Text an Projektnotiz anhängen |
| `apiGetJobNotes(projectUid, jobUidRaw)` | 🔍 liest | `Upload.gs:461` | Phrase-„Conversations“ aller Jobs |
| `apiGetProjectNote(projectUid)` | 🔍 liest | `Upload.gs:510` | { note, canEdit } |
| `apiUpdateProjectNote(projectUid, newNote)` | ✏️ schreibt | `Upload.gs:524` | Projektnotiz in Phrase (Pivot-Marker bleibt) |
| `apiGetTeamProjects()` | 🔍 liest | `UserPrefs.gs:207` | Projekte der Team-Mitglieder (nur lesen) |
| `apiGetMyProjects()` | 🔍 liest | `WebApp.gs:154` | { projects: [...], email } – Felder s. u. |
| `apiGetDashboardData()` | 🔍 liest · 🔒 | `WebApp.gs:245` | "own", generatedAt, rows } – Filter/Diagramme rechnet der Browser |
| `apiShareProject(projectUid, shareWithEmail)` | ✏️ schreibt · 🔒 | `WebApp.gs:343` | teilen + Chat + Glocke + Kalender |
| `apiCancelProject(projectUid, callerOverride)` | ✏️ schreibt · 🔒 | `WebApp.gs:423` | Status CANCELLED + Benachrichtigungen |
| `apiSyncProjectStatuses()` | ✏️ schreibt · 🔒 | `WebApp.gs:493` | Status aus Phrase holen, benachrichtigen |
| `apiUpdateDueDate(projectUid, newDateIso, callerOverride)` | ✏️ schreibt · 🔒 | `WebApp.gs:886` | Frist in Phrase + Queue + Benachrichtigung |
| `apiUpdateProjectName(projectUid, newName, callerOverride)` | ✏️ schreibt · 🔒 | `WebApp.gs:985` | Name in Phrase + Queue |
| `apiGetProjectsProgress(uids)` | 🔍 liest | `WebApp.gs:1271` | { uid: { done, total } }, 10 min Cache |

### 05 · Download & Drive-Export – Einzeldatei, ZIP, „Save to Drive“

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiDownloadMultipleTargets(projectUid, jobUids, projectName, targetLangs, fileName, mimeType, jobMapping)` | 🔍 liest | `Apialiases.gs:89` | ZIP als Base64 |
| `apiSmartDownload(projectUid, jobUids, projectName, targetLangs, fileName, targetLang, mimeType, jobMapping)` | 🔍 liest | `DownloadZip.gs:301` | Ermittelt höchsten Workflow-Schritt; 1 Datei → Einzel-Download, sonst ZIP |
| `apiUserDownloadFromPhrase(projectUid, jobUid, fileName, targetLang, mimeType)` | 🔍 liest | `DownloadZip.gs:365` | Einzeldatei als Base64 |
| `apiDownloadAllJobsAsZip(projectUid, jobUids, projectName, targetLangs, originalFileName, mimeType, jobMapping)` | 🔍 liest | `DownloadZip.gs:413` | ZIP als Base64 |
| `apiGetFilesForDriveExport(projectUid, jobUids, projectName, targetLangs, jobMapping)` | 🔍 liest | `DownloadZip.gs:514` | Dateien für Drive-Export |
| `apiDownloadTargetFile(projectUid, jobUid)` | 🔍 liest | `DownloadZip.gs:609` | Bereich „{ ok: true, … }“ (siehe Dokumentation). |
| `apiGetDriveSaveConfig()` | 🔍 liest | `DriveSaveConfig.gs:51` | { clientId, configured } |
| `apiSaveDriveSaveClientId(clientId, clientSecret)` | ⚠️ kritisch · 🔒 | `DriveSaveConfig.gs:58` | OAuth-Client setzen (setzt alle Nutzer-Tokens zurück) |
| `apiCheckDriveAuthStatus()` | 🔍 liest | `DriveSaveConfig.gs:128` | { authorized } für „Save to Drive“ |
| `apiGetDriveAuthUrl()` | 🔍 liest | `DriveSaveConfig.gs:136` | URL für die Google-Freigabe |
| `apiSaveProjectToDrive(projectUid, jobUids, projectName, targetLangs, jobMapping, convertToGoogle, options)` | ✏️ schreibt | `DriveSaveConfig.gs:159` | Upload in „Meine Ablage“ des Nutzers; options.folderName, options.subFolderName; ohne Token { needsAuth: true } |

### 06 · Dokumentation – XML-Import, Board, Drive-Ordner, Export

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiArchiveDocQueueProject(projectUid, projectName)` | ✏️ schreibt | `DocArchive.gs:8` | Zeilen ins Archiv verschieben |
| `apiGetDocBoardData()` | 🔍 liest | `DocBoard.gs:10` | Board |
| `apiGetDocDriveRootSettings()` | 🔍 liest · 🔒 | `DocDriveConfig.gs:18` | Doku-Root |
| `apiSaveDocDriveRootSettings(idOrUrl)` | ✏️ schreibt · 🔒 | `DocDriveConfig.gs:29` | Doku-Root |
| `apiGetDocDriveTree(projectName)` | 🔍 liest | `DocDriveTree.gs:75` | Ordner unter dem Doku-Root |
| `apiGetDocDriveTreeById(folderId)` | 🔍 liest | `DocDriveTree.gs:92` | Ordner unter dem Doku-Root |
| `apiSearchDocDriveFolders(query)` | 🔍 liest | `DocDriveTree.gs:112` | Ordner unter dem Doku-Root |
| `apiGetDocExportStatus(projectName)` | 🔍 liest | `DocExport.gs:8` | Live-Status |
| `apiExportDocProjectToDrive(projectUid, projectName, jobs)` | ✏️ schreibt | `DocExport.gs:101` | Fertige Übersetzungen in den Drive-Ordner |
| `apiExportSingleJobToDrive(projectUid, projectName, job)` | ✏️ schreibt | `DocExport.gs:153` | Fertige Übersetzungen in den Drive-Ordner |
| `apiGetDocExportEligibilitySettings()` | 🔍 liest | `DocExport.gs:209` | Kriterien |
| `apiSaveDocExportEligibilitySettings(clientId, domainId, subDomainId, businessUnitId)` | ✏️ schreibt | `DocExport.gs:216` | Kriterien speichern |
| `apiGetDocExportEligibleProjects()` | 🔍 liest | `DocExport.gs:235` | passende Phrase-Projekte inkl. Jobs |
| `apiGetDocImportTemplateLangs(templateUid)` | 🔍 liest | `DocImport.gs:18` | Sprachen einer Doku-Vorlage |
| `apiGetDocImportFolderHistory(folderId)` | 🔍 liest | `DocImport.gs:124` | Wurde der Ordner schon importiert? |
| `apiUploadDocXmlBatch(payload)` | ✏️ schreibt | `DocImport.gs:161` | { templateUid, templateName, sourceLang, projectName, iaNumber, dueDate, note, files:[{targetLang, fileId, fileName}] } |
| `apiGetDocQueueProjects()` | 🔍 liest | `DocQueue.gs:12` | Doku-Projekte (Format wie Meine Projekte) |
| `apiGetDocProjectsForHistory()` | 🔍 liest | `DocQueue.gs:100` | Doku-Projekte (Format wie Meine Projekte) |
| `apiGetDocWhitelist()` | 🔍 liest | `WebApp.gs:750` | Whitelist des Bereichs Documentation. |

### 07 · Campus / Articulate – Rise-Kurse registrieren und Vorschau erzeugen

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetPreviewProgress(sessionId)` | 🔍 liest | `Articualtepreview.gs:33` | { percent, message } zum Pollen |
| `apiGenerateArticulatePreviewById(articulateProjectId, sessionId, overrideJobUid)` | ✏️ schreibt | `Articualtepreview.gs:54` | Registry-/Preview-Kern ohne Prüfung |
| `apiGenerateArticulatePreview(params)` | ✏️ schreibt | `Articualtepreview.gs:156` | Registry-/Preview-Kern ohne Prüfung |
| `apiGetArticulateWhitelist()` | 🔍 liest | `Articulateapi.gs:20` | Whitelist |
| `apiAddArticulateWhitelist(emailToAdd)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:37` | Fügt eine E-Mail zur Campus/Articulate-Whitelist hinzu. |
| `apiRemoveArticulateWhitelist(emailToRemove)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:53` | Entfernt eine E-Mail aus der Campus/Articulate-Whitelist. |
| `apiListArticulateProjectsForUi()` | 🔍 liest · 🔒 | `Articulateapi.gs:84` | Kursliste |
| `apiCreateArticulateProjectFromUi(payload)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:265` | Kurs registrieren (mit Validierung) |
| `apiBatchCreateArticulateProjectsFromUi(payloads)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:340` | Kurs registrieren (mit Validierung) |
| `apiValidateArticulateInputs(payload)` | 🔍 liest | `Articulateapi.gs:360` | nur prüfen |
| `apiDeleteArticulateProjectFromUi(id)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:383` | Kurs entfernen |
| `apiRunArticulatePreview(articulateProjectId, sessionId)` | ✏️ schreibt · 🔒 | `Articulateapi.gs:400` | Vorschau erzeugen (Phrase-XLIFF → Rise patchen → Firebase Hosting) |
| `apiArtPickerListProjects()` | 🔍 liest · 🔒 | `Articulateapi.gs:456` | Auswahl-Listen |
| `apiArtPickerListJobs(projectUid)` | 🔍 liest · 🔒 | `Articulateapi.gs:489` | Auswahl-Listen |
| `apiListArticulateProjects()` | 🔍 liest | `Articulateregistry.gs:107` | Registry-/Preview-Kern ohne Prüfung |
| `apiCreateArticulateProject(p)` | ✏️ schreibt | `Articulateregistry.gs:139` | Registry-/Preview-Kern ohne Prüfung |
| `apiDeleteArticulateProject(id)` | ✏️ schreibt | `Articulateregistry.gs:228` | Registry-/Preview-Kern ohne Prüfung |
| `apiFindCourseMetadataIds()` | 🔍 liest | `Help-ListDomainClientBusinessunit.gs:5` | Hilfsfunktion (Phrase-IDs für Campus) |

### 08 · Persönlich – Einstellungen, Glocke, Chat, Kalender, Vertretung

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetCalendarSyncStatus()` | 🔍 liest | `CalendarSync.gs:270` | { configured, authorized, enabled, includeDone, calendarId, lastSync, lastResult } |
| `apiGetCalendarAuthUrl(lang)` | 🔍 liest | `CalendarSync.gs:288` | Freigabe-URL |
| `apiSetCalendarSyncOptions(opts)` | ✏️ schreibt | `CalendarSync.gs:300` | ein-/ausschalten, synchronisiert sofort |
| `apiCalendarSyncNow()` | ✏️ schreibt | `CalendarSync.gs:315` | jetzt abgleichen |
| `apiDisconnectCalendar(deleteCalendar)` | ✏️ schreibt | `CalendarSync.gs:325` | Token widerrufen, optional App-Kalender löschen |
| `apiGetDeputySettings()` | 🔍 liest | `Deputies.gs:143` | Urlaubsvertretung |
| `apiSaveDeputySettings(input)` | ✏️ schreibt | `Deputies.gs:159` | Urlaubsvertretung |
| `apiGetNotifications()` | 🔍 liest | `NotificationCenter.gs:66` | Glocke |
| `apiMarkNotificationsRead()` | ✏️ schreibt | `NotificationCenter.gs:99` | Glocke |
| `apiGetUserPrefs()` | 🔍 liest | `UserPrefs.gs:135` | Einstellungen (Schlüssel s. UI-UX.md) |
| `apiSaveUserPrefs(patch)` | ✏️ schreibt | `UserPrefs.gs:142` | Einstellungen (Schlüssel s. UI-UX.md) |
| `apiGetTeamSettings()` | 🔍 liest | `UserPrefs.gs:189` | Team-Einstellung + Vorschau |
| `apiGetChatPreference()` | 🔍 liest | `WebApp.gs:843` | Chat-Benachrichtigungen an/aus |
| `apiSetChatPreference(enabled)` | ✏️ schreibt | `WebApp.gs:848` | Chat-Benachrichtigungen an/aus |

### 09 · Marketing – Consulting-Anfragen, Vorab-Kalkulation, Maximaltemplate

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiConsultingCreate(payload, comment)` | ✏️ schreibt | `MarketingConsulting.gs:324` | Anfrage statt Projekt: Dateien in Drive, Zeile in Consulting_Requests, Chat an Consultants + Einreicher → { success, id } |
| `apiConsultingList()` | 🔍 liest | `MarketingConsulting.gs:364` | Consultants: alle; sonst eigene (und der Vertretenen) |
| `apiConsultingGet(id)` | 🔍 liest | `MarketingConsulting.gs:390` | Details + Historie; für Consultants zusätzlich templates des Einreichers, canEdit |
| `apiConsultingAssign(id)` | ✏️ schreibt | `MarketingConsulting.gs:416` | übernehmen / Formular ändern (patch.removeFileIds entfernt Dateien) |
| `apiConsultingUpdate(id, patch)` | ✏️ schreibt | `MarketingConsulting.gs:433` | übernehmen / Formular ändern (patch.removeFileIds entfernt Dateien) |
| `apiConsultingComment(id, text)` | ✏️ schreibt | `MarketingConsulting.gs:450` | Kommentar in die Historie, Chat an die andere Seite |
| `apiConsultingSubmit(id, patch)` | ✏️ schreibt · 🔒 | `MarketingConsulting.gs:470` | Projekt im Namen des Einreichers anlegen (createProjectAndUploadAs_, Queue „Created By“) |
| `apiConsultingClose(id, reason)` | ✏️ schreibt | `MarketingConsulting.gs:523` | schließen bzw. zurückziehen |
| `apiPrecalcOptions()` | 🔍 liest | `MarketingPrecalc.gs:235` | Kalkulationsprojekte aus PRECALC_PROJECTS mit Quell-/Zielsprachen |
| `apiPrecalcStart(payload)` | ✏️ schreibt | `MarketingPrecalc.gs:251` | Vorab-Kalkulation im festen Projekt (Jobs hochladen → Analyse → Quote → nur diese Jobs löschen) → { phase, amount, currency, words } |
| `apiPrecalcPoll(id)` | 🔍 liest · 🔒 | `MarketingPrecalc.gs:305` | Vorab-Kalkulation im festen Projekt (Jobs hochladen → Analyse → Quote → nur diese Jobs löschen) → { phase, amount, currency, words } |
| `apiPrecalcCancel(id)` | ✏️ schreibt · 🔒 | `MarketingPrecalc.gs:398` | Vorab-Kalkulation im festen Projekt (Jobs hochladen → Analyse → Quote → nur diese Jobs löschen) → { phase, amount, currency, words } |
| `apiPrecalcHistory()` | ✏️ schreibt | `MarketingPrecalc.gs:409` | letzte Kalkulationen (eigene; Consultants alle) |
| `apiGetPrecalcProjectsConfig()` | 🔍 liest · 🔒 | `MarketingPrecalc.gs:441` | Kalkulationsprojekte pflegen (prüft jede UID in Phrase, schreibt PRECALC_PROJECTS bzw. in der Sandbox PRECALC_PROJECTS_SANDBOX) |
| `apiSavePrecalcProjects(rows)` | ⚠️ kritisch · 🔒 | `MarketingPrecalc.gs:448` | Kalkulationsprojekte pflegen (prüft jede UID in Phrase, schreibt PRECALC_PROJECTS bzw. in der Sandbox PRECALC_PROJECTS_SANDBOX) |
| `apiMaxTplOptions(baseTemplateUid)` | 🔍 liest | `MaxTemplate.gs:263` | Kataloge (Workflow-Schritte, Client/BU/Domain/Subdomain/Cost Center, MT), Standardwerte der Basis-Vorlage, Prompt-Hub |
| `apiMaxTplSearch(kind, query)` | 🔍 liest | `MaxTemplate.gs:285` | users, vendors, tms, tbs nach Namen |

### 10 · Admin: Zugriffe, Whitelists, Admins & Admin-Light

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetAccessMatrix()` | 🔍 liest · 🔒 | `AdminAccess.gs:30` | Bereich „Zugriffe“ (siehe Dokumentation). |
| `apiSetAccessBulk(emails, areaIds, grant)` | ⚠️ kritisch · 🔒 | `AdminAccess.gs:64` | Bereich „Zugriffe“ (siehe Dokumentation). |
| `apiGetCcWhitelist()` | 🔍 liest | `AdminCc.gs:10` | AdminCc.gs Verwaltet die Competence Center (CC) Projects Whitelist ? exklusiver Tab, funktional 1:1 identisch zu "General Projects" (Standard-Template-Set, keine eigene Client/Domain/BU-Filterung). Sheet: … |
| `apiAddCcWhitelist(emailToAdd)` | ✏️ schreibt · 🔒 | `AdminCc.gs:26` | Fügt eine E-Mail zur CC-Whitelist hinzu. |
| `apiRemoveCcWhitelist(emailToRemove)` | ✏️ schreibt · 🔒 | `AdminCc.gs:41` | Entfernt eine E-Mail aus der CC-Whitelist. |
| `apiGetAdminLightUsers()` | 🔍 liest · 🔒 | `AdminLight.gs:40` | Bereich „Admin-Light“ (siehe Dokumentation). |
| `apiAddAdminLightUser(email, subtabs)` | ✏️ schreibt · 🔒 | `AdminLight.gs:61` | Bereich „Admin-Light“ (siehe Dokumentation). |
| `apiRemoveAdminLightUser(email)` | ✏️ schreibt · 🔒 | `AdminLight.gs:95` | Bereich „Admin-Light“ (siehe Dokumentation). |
| `apiGetWomaWhitelist()` | 🔍 liest | `AdminWoma.gs:10` | AdminWoma.gs Verwaltet die WOMA Projects Whitelist ? exklusiver Tab, funktional 1:1 identisch zu "General Projects" (Standard-Template-Set, keine eigene Client/Domain/BU-Filterung). Sheet: "Whitelist_Woma" in … |
| `apiAddWomaWhitelist(emailToAdd)` | ✏️ schreibt · 🔒 | `AdminWoma.gs:26` | Fügt eine E-Mail zur WOMA-Whitelist hinzu. |
| `apiRemoveWomaWhitelist(emailToRemove)` | ✏️ schreibt · 🔒 | `AdminWoma.gs:41` | Entfernt eine E-Mail aus der WOMA-Whitelist. |
| `apiGetAdmins()` | 🔍 liest · 🔒 | `Apialiases.gs:23` | Bereich „Admins“ (siehe Dokumentation). |
| `apiGetWhitelist()` | 🔍 liest | `Code.gs:55` | Bereich „Rohdaten“ (siehe Dokumentation). |
| `apiAddWhitelist(emailToAdd)` | ✏️ schreibt · 🔒 | `Code.gs:67` | Fügt eine E-Mail zur General-Whitelist hinzu. |
| `apiRemoveWhitelist(emailToRemove)` | ✏️ schreibt · 🔒 | `Code.gs:79` | Entfernt eine E-Mail aus der General-Whitelist. |
| `apiGetKecWhitelist()` | 🔍 liest | `KecWhitelistAliases.gs:6` | KecWhitelistAliases.gs Alias-Funktionen: Frontend ruft "Kec" (kleines c), Backend definiert "KeC" (großes C). Diese Wrapper vermeiden Änderungen am bestehenden WebApp.gs. |
| `apiAddKecWhitelist(email)` | ✏️ schreibt | `KecWhitelistAliases.gs:9` | Alias: fügt eine E-Mail zur KeC-Whitelist hinzu. |
| `apiRemoveKecWhitelist(email)` | ✏️ schreibt | `KecWhitelistAliases.gs:12` | Alias: entfernt eine E-Mail aus der KeC-Whitelist. |
| `apiAddAdmin(emailToAdd)` | ⚠️ kritisch · 🔒 | `WebApp.gs:313` | Bereich „Admins“ (siehe Dokumentation). |
| `apiRemoveAdmin(emailToRemove)` | ⚠️ kritisch · 🔒 | `WebApp.gs:328` | Bereich „Admins“ (siehe Dokumentation). |
| `apiAddMarketingWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:602` | MARKETING WHITELIST APIs |
| `apiRemoveMarketingWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:620` | Entfernt eine E-Mail aus der Marketing-Whitelist. |
| `apiGetMarketingWhitelist()` | 🔍 liest | `WebApp.gs:640` | Marketing-Whitelist. |
| `apiAddKeCWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:657` | KEC WHITELIST APIs |
| `apiRemoveKeCWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:675` | Entfernt eine E-Mail aus der KeC-Whitelist. |
| `apiGetKeCWhitelist()` | 🔍 liest | `WebApp.gs:695` | KeC-Whitelist. |
| `apiAddDocWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:712` | DOCUMENTATION WHITELIST APIs |
| `apiRemoveDocWhitelist(email)` | ✏️ schreibt · 🔒 | `WebApp.gs:730` | Entfernt eine E-Mail aus der Documentation-Whitelist. |

### 11 · Admin: Wartung, System, Script Properties, Sandbox

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetAllScriptProperties()` | 🔍 liest · 🔒 | `Adminadvanced.gs:21` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiSetScriptProperty(key, value)` | ✏️ schreibt · 🔒 | `Adminadvanced.gs:53` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiDeleteScriptProperty(key)` | ✏️ schreibt · 🔒 | `Adminadvanced.gs:71` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiRevealScriptProperty(key)` | ✏️ schreibt · 🔒 | `Adminadvanced.gs:89` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiAddScriptProperty(key, value)` | ✏️ schreibt · 🔒 | `Adminadvanced.gs:111` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiGetRecentLogs()` | 🔍 liest · 🔒 | `Apialiases.gs:32` | Bereich „System“ (siehe Dokumentation). |
| `apiSetFileSizeLimit(mb)` | ✏️ schreibt | `Apialiases.gs:61` | Bereich „System“ (siehe Dokumentation). |
| `apiClearMaintenance()` | ✏️ schreibt | `Apialiases.gs:69` | Bereich „Wartung“ (siehe Dokumentation). |
| `apiGetDashboardStats()` | 🔍 liest | `Apialiases.gs:77` | Bereich „System“ (siehe Dokumentation). |
| `apiUpdateScriptProperty(key, value)` | ✏️ schreibt | `Apialiases.gs:85` | Bereich „Script Properties“ (siehe Dokumentation). |
| `apiGetAdminDashboardDataExtended()` | 🔍 liest · 🔒 | `Apialiases.gs:122` | Bereich „System“ (siehe Dokumentation). |
| `apiSetMaintenance(payload)` | ⚠️ kritisch · 🔒 | `Code.gs:37` | Bereich „Wartung“ (siehe Dokumentation). |
| `apiGetSandboxStatus()` | 🔍 liest · 🔒 | `Sandbox.gs:114` | Admin-Sandbox an/aus (nur für den Aufrufer) |
| `apiSetSandboxMode(enabled)` | ✏️ schreibt · 🔒 | `Sandbox.gs:130` | Admin-Sandbox an/aus (nur für den Aufrufer) |
| `apiGetAdminDashboardData()` | 🔍 liest | `WebApp.gs:280` | Bereich „System“ (siehe Dokumentation). |
| `apiSaveAdminSettings(sizeLimitMb)` | ✏️ schreibt · 🔒 | `WebApp.gs:282` | Bereich „System“ (siehe Dokumentation). |
| `apiSaveMaintenanceConfig(startIso, endIso, message)` | ⚠️ kritisch · 🔒 | `WebApp.gs:291` | Bereich „Wartung“ (siehe Dokumentation). |
| `apiClearMaintenanceConfig()` | ✏️ schreibt · 🔒 | `WebApp.gs:302` | Bereich „Wartung“ (siehe Dokumentation). |

### 12 · Admin: Synchronisation – Vorlagen, Nutzer, Benachrichtigungen, Chat-Zuordnung

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiToggleAutoSync(enable)` | ✏️ schreibt · 🔒 | `AutoSync.gs:13` | Bereich „Sync“ (siehe Dokumentation). |
| `apiGetAutoSyncStatus()` | 🔍 liest | `AutoSync.gs:20` | Bereich „Sync“ (siehe Dokumentation). |
| `apiResolveChatMappings()` | ✏️ schreibt · 🔒 | `ChatToken.gs:217` | Bereich „Sync“ (siehe Dokumentation). |
| `apiSyncNotifications()` | ✏️ schreibt · 🔒 | `Sync.gs:273` | Bereich „Sync“ (siehe Dokumentation). |
| `apiTriggerManualSync(type, mode)` | ⚠️ kritisch · 🔒 | `WebApp.gs:470` | Bereich „Sync“ (siehe Dokumentation). |

### 13 · Admin: User- & Template-Manager, Debugger

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiGetUserManagerInsights()` | 🔍 liest · 🔒 | `AdminManagers.gs:172` | Bereich „User Manager (erweitert)“ (siehe Dokumentation). |
| `apiGetUserDetail(email)` | 🔍 liest | `AdminManagers.gs:201` | Bereich „User Manager (erweitert)“ (siehe Dokumentation). |
| `apiBulkUpdateUserField(usernames, field, value, mode)` | ✏️ schreibt | `AdminManagers.gs:234` | Bereich „User Manager (erweitert)“ (siehe Dokumentation). |
| `apiCopyUserSegmentation(fromUsername, toUsernames)` | ✏️ schreibt | `AdminManagers.gs:267` | Bereich „User Manager (erweitert)“ (siehe Dokumentation). |
| `apiGetTemplateManagerInsights()` | 🔍 liest | `AdminManagers.gs:285` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiGetTemplateDetail(uid)` | 🔍 liest | `AdminManagers.gs:323` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiSetTemplateDisplayName(uid, name)` | ✏️ schreibt | `AdminManagers.gs:341` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiBatchSetTemplateActive(uids, active)` | ✏️ schreibt | `AdminManagers.gs:365` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiDebugListUsers()` | 🔍 liest · 🔒 | `Config.gs:489` | Bereich „Debugger“ (siehe Dokumentation). |
| `apiDebugUserTemplates(email)` | 🔍 liest · 🔒 | `Config.gs:506` | Bereich „Debugger“ (siehe Dokumentation). |
| `apiGetTemplatesForManager()` | 🔍 liest · 🔒 | `Sheets.gs:128` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiSetTemplateActive(templateUid, active)` | ✏️ schreibt · 🔒 | `Sheets.gs:178` | Bereich „Template Manager“ (siehe Dokumentation). |
| `apiGetUsersForManager()` | 🔍 liest · 🔒 | `Sheets.gs:251` | Bereich „User Manager“ (siehe Dokumentation). |
| `apiUpdateUserField(username, field, value, syncToPhrase)` | ✏️ schreibt · 🔒 | `Sheets.gs:283` | Bereich „User Manager“ (siehe Dokumentation). |

### 14 · Admin: Pivot-Übersetzungen – Vorlagen-Verknüpfung & Sprachzuordnung

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiPivotListTemplates(forceRefresh)` | 🔍 liest · 🔒 | `PivotAdmin.gs:67` | Bereich „Pivot (Batch)“ (siehe Dokumentation). |
| `apiAddPivotTemplateLinksBatch(pairs)` | ✏️ schreibt · 🔒 | `PivotAdmin.gs:90` | Legt mehrere Verknuepfungen auf einmal an. |
| `apiRemovePivotTemplateLinksBatch(pairs)` | ✏️ schreibt · 🔒 | `PivotAdmin.gs:141` | Entfernt mehrere Verknuepfungen auf einmal. |
| `apiRefreshPivotLinkDetails()` | ✏️ schreibt · 🔒 | `PivotAdmin.gs:172` | Bereich „Pivot (Batch)“ (siehe Dokumentation). |
| `apiSetPivotLanguageMappingsBatch(entries)` | ✏️ schreibt · 🔒 | `PivotAdmin.gs:208` | Bereich „Pivot (Batch)“ (siehe Dokumentation). |
| `apiGetPivotLanguageMap()` | 🔍 liest · 🔒 | `PivotLanguageMap.gs:58` | Bereich „Pivot“ (siehe Dokumentation). |
| `apiGetPivotFieldOptionValues()` | 🔍 liest · 🔒 | `PivotLanguageMap.gs:75` | Bereich „Pivot“ (siehe Dokumentation). |
| `apiSetPivotLanguageMapping(langCode, optionValue)` | ✏️ schreibt · 🔒 | `PivotLanguageMap.gs:94` | Ordnet einem Sprachcode einen Wert des Custom Fields „Pivot languages“ zu. |
| `apiRemovePivotLanguageMapping(langCode)` | ✏️ schreibt · 🔒 | `PivotLanguageMap.gs:120` | Entfernt die Pivot-Sprachzuordnung eines Sprachcodes. |
| `apiDebugPivotFindChild(exactName)` | 🔍 liest · 🔒 | `PivotProjects.gs:501` | Bereich „Debugger“ (siehe Dokumentation). |
| `apiGetPivotTemplateLinks()` | 🔍 liest · 🔒 | `PivotTemplateLinks.gs:61` | Bereich „Pivot“ (siehe Dokumentation). |
| `apiAddPivotTemplateLink(parentTemplateUid, childTemplateUid)` | ✏️ schreibt · 🔒 | `PivotTemplateLinks.gs:71` | Verknüpft eine Eltern-Vorlage mit der Folgevorlage (Pivot). |
| `apiRemovePivotTemplateLink(parentTemplateUid, childTemplateUid)` | ✏️ schreibt · 🔒 | `PivotTemplateLinks.gs:105` | Löst eine Pivot-Verknüpfung. |

### 15 · Admin: Kommunikation – Ankündigungen, Nachrichtenvorlagen, Chat-Test, Watcher

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiAdminListAnnouncements()` | 🔍 liest · 🔒 | `Announcements.gs:99` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiAdminSaveAnnouncement(a)` | ✏️ schreibt · 🔒 | `Announcements.gs:113` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiAdminSetAnnouncementActive(id, active)` | ✏️ schreibt · 🔒 | `Announcements.gs:144` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiAdminDeleteAnnouncement(id)` | ✏️ schreibt · 🔒 | `Announcements.gs:154` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiAdminSendAnnouncementChat(id)` | ⚠️ kritisch · 🔒 | `Announcements.gs:171` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiGetMessageTemplates()` | 🔍 liest · 🔒 | `Messagetemplates.gs:563` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiSaveMessageTemplate(key, textDe, textEn)` | ✏️ schreibt · 🔒 | `Messagetemplates.gs:603` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiResetMessageTemplate(key)` | ✏️ schreibt · 🔒 | `Messagetemplates.gs:633` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiTestChatBot(email)` | ✏️ schreibt · 🔒 | `Upload.gs:990` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiGetWatcherConfig()` | 🔍 liest · 🔒 | `Watchers.gs:122` | Bereich „Kommunikation“ (siehe Dokumentation). |
| `apiSaveWatcherConfig(configArray)` | ⚠️ kritisch · 🔒 | `Watchers.gs:128` | Bereich „Kommunikation“ (siehe Dokumentation). |

### 16 · Admin: Protokoll, Health-Check & Selbsttests

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiRunHealthCheck()` | ✏️ schreibt | `Apialiases.gs:73` | Bereich „Diagnose“ (siehe Dokumentation). |
| `apiGetAuditLog(limit)` | 🔍 liest · 🔒 | `Auditlog.gs:55` | Bereich „Protokoll“ (siehe Dokumentation). |
| `apiPurgeOldAuditEntries(days)` | ⚠️ kritisch · 🔒 | `Auditlog.gs:101` | Bereich „Protokoll“ (siehe Dokumentation). |
| `apiGetUnifiedLog(opts)` | 🔍 liest · 🔒 | `Auditlog.gs:220` | Bereich „Protokoll“ (siehe Dokumentation). |
| `apiRunSelfTests()` | 🔍 liest · 🔒 | `SelfTests.gs:19` | Bereich „{ authorized: false }“ (siehe Dokumentation). |
| `apiHealthCheck()` | 🔍 liest · 🔒 | `WebApp.gs:767` | Bereich „{ authorized: false }“ (siehe Dokumentation). |

### 17 · Admin: Translate UI – Oberflächentexte über Phrase Strings

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `apiPsGetConfig()` | 🔍 liest | `PhraseStrings.gs:227` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsSaveConfig(project, region, token)` | ✏️ schreibt | `PhraseStrings.gs:242` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsCheck()` | 🔍 liest | `PhraseStrings.gs:252` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsPush(opts)` | ⚠️ kritisch | `PhraseStrings.gs:268` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsPull(opts)` | ✏️ schreibt | `PhraseStringsSync.gs:173` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsCoverage()` | 🔍 liest | `PhraseStringsSync.gs:212` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsClearOverrides()` | ⚠️ kritisch | `PhraseStringsSync.gs:234` | Bereich „Translate UI“ (siehe Dokumentation). |
| `apiPsSetNightly(enabled)` | ✏️ schreibt | `PhraseStringsSync.gs:244` | Bereich „Translate UI“ (siehe Dokumentation). |

### 18 · Wartung & Diagnose – Editor-Funktionen und Trigger

| Funktion | Art | Datei | Zweck |
|---|---|---|---|
| `calendarSyncAllTrigger()` | ✏️ schreibt | `CalendarSync.gs:552` | Fristen in die Kalender der Nutzer |
| `testChatBotGemini()` | ✏️ schreibt | `Chatbot.gs:242` | Test-Funktionen (Editor) |
| `testChatBotToolCall()` | ✏️ schreibt | `Chatbot.gs:250` | Editor-Test des Gemini-Chat-Bots mit Tool-Aufruf (fest eingetragener Nutzer). |
| `copyPropsToSheet()` | ✏️ schreibt | `ChatToken.gs:93` | Bulk Resolve: Emails aus Sheet ? Chat IDs via People API |
| `bulkResolveFromSheet()` | ✏️ schreibt | `ChatToken.gs:122` | Löst Chat-User-IDs für alle E-Mails im Reiter Notifications auf. |
| `cleanupChatMappingsFromProperties()` | ✏️ schreibt | `ChatToken.gs:230` | Script Properties bereinigen |
| `debugChatAuth()` | 🔍 liest | `ChatToken.gs:277` | Debug Funktionen |
| `testChatMessage()` | ✏️ schreibt | `ChatToken.gs:302` | Schickt eine Testnachricht über den Chat-Bot (fest eingetragener Empfänger). |
| `DEBUG_checkMapping()` | 🔍 liest | `ChatToken.gs:324` | Debug: prüft die Chat-Zuordnung einer fest eingetragenen E-Mail. |
| `DEBUG_checkMapping2()` | 🔍 liest | `ChatToken.gs:342` | Debug: zweite Variante der Zuordnungsprüfung. |
| `DEBUG_findAxelProp()` | 🔍 liest | `ChatToken.gs:370` | Debug: liest die Chat-Zuordnung einer fest eingetragenen Person. |
| `findIdForEmail()` | 🔍 liest | `ChatToken.gs:376` | Sucht die Verzeichnis-ID einer fest eingetragenen E-Mail über die People API. |
| `DEBUG_checkChatKeyFormat()` | 🔍 liest | `Code.gs:143` | Prüft das Format des privaten Schlüssels des Chat-Service-Kontos (CHAT_PRIVATE_KEY). |
| `DEBUG_repairChatPrivateKeyFormat()` | ✏️ schreibt | `Code.gs:155` | Repariert Zeilenumbrüche/Marker in CHAT_PRIVATE_KEY. |
| `fixCorruptChatToken()` | ✏️ schreibt | `Code.gs:177` | Löscht die gecachten OAuth-Token des Chat-Bots (neue Anmeldung beim nächsten Versand). |
| `debugEnvironment()` | 🔍 liest · 🔒 | `Debug.gs:9` | Debug.gs V4: Alle öffentlich aufrufbaren Debug-Funktionen erfordern Admin-Rechte. Ohne Admin-Check waren diese Funktionen über google.script.run für jeden authentifizierten User aufrufbar. |
| `debugTokenLengthOnly()` | 🔍 liest · 🔒 | `Debug.gs:94` | Gibt die Token-Länge zurück (ohne den Token selbst zu loggen) ? sicher für Logs/Compliance. |
| `debugListScriptPropertyKeys()` | 🔍 liest · 🔒 | `Debug.gs:107` | Listet Script Properties KEYS (nicht Werte!) ? sicher. |
| `debugCheckCommonTypos()` | 🔍 liest · 🔒 | `Debug.gs:120` | Zeigt, ob häufige Vertipper existieren (z.B. PHRASE_API_TOKN). |
| `DEBUG_checkChatPref()` | 🔍 liest | `Debug.gs:142` | Debug: Chat-Einstellung eines Nutzers. |
| `DEBUG_testDeadlineReminder()` | ✏️ schreibt | `Debug.gs:153` | Debug: Fristerinnerung an einen fest eingetragenen Thread senden. |
| `DEBUG_sendCompletionNotification()` | ✏️ schreibt | `Debug.gs:199` | DEBUG: Sendet manuell die Completion-Notification für ein bestehendes Projekt. Einmal ausführen im Apps Script Editor ? Funktion "DEBUG_sendCompletionNotification" ? Run Danach diese Funktion wieder löschen. |
| `forceAuth()` | ✏️ schreibt | `Debug.gs:232` | Löst die Autorisierung für externe Anfragen aus (UrlFetchApp). |
| `DEBUG_testSetProjectOwner()` | ✏️ schreibt · 🔒 | `Debug.gs:236` | Debug: Eigentümerwechsel eines fest eingetragenen Projekts (Admin). |
| `findeUserId()` | ✏️ schreibt | `FindUserID.gs:1` | Sucht die Chat-User-ID einer fest eingetragenen E-Mail (Admin Directory). |
| `deployBlobsToFirebaseHosting(siteId, fileEntries, pathPrefix)` | ✏️ schreibt | `FirebaseHostingDeploy.gs:34` | VOLLSTAENDIGE relative Pfad, z.B. "scormcontent/index.html" |
| `repairQueueDataAlignment()` | ✏️ schreibt | `HeaderRepair.gs:1` | Repariert verschobene Spalten im Queue-Reiter. |
| `repairSpecificProject(projectIdentifier)` | ✏️ schreibt | `HeaderRepair.gs:110` | Alternative: Spezifische Zeile reparieren |
| `debugQueueData()` | 🔍 liest | `HeaderRepair.gs:147` | Debug: Zeige erste 3 Zeilen der Queue |
| `DEBUG_kecScanTrace()` | 🔍 liest | `Kecdebugscan.gs:13` | KeCDebugScan.gs ? TEMPORÄRE Debug-Datei Im Apps Script Editor ausführen: Funktion "DEBUG_kecScanTrace" ? Run Dann Logs (Ausführungsprotokoll) anschauen. Zeigt Schritt für Schritt, wo "Test Mario KeC" … |
| `testKeCFrontend()` | ✏️ schreibt | `KeCProjects.gs:616` | Editor-Test: protokolliert die KeC-Projektliste. |
| `patchAndDeployScormToFirebase(scormZipFileId, patches, siteId, pathPrefix)` | ✏️ schreibt | `Orchestration.gs:18` | mehrere Kurse auf derselben Site nebeneinander existieren |
| `patchAndDeployScormFolderToFirebase(scormFolderId, patches, siteId, pathPrefix, filterOptions)` | ✏️ schreibt | `Orchestration.gs:66` | Wie patchAndDeployScormToFirebase(), aber liest aus einem bereits ENTPACKTEN, nach Drive hochgeladenen Ordner statt aus einer ZIP-Datei. Umgeht damit das ~50MB-Gesamtgroessenlimit von Utilities.unzip() - empfohlener … |
| `generatePatchedScormZip(scormZipFileId, patches, options)` | ✏️ schreibt | `ScormPatcher.gs:74` | Hauptfunktion. Ueberschreiben (fuer stabilen Link ueber mehrere Laeufe) outputFileId angegeben ist |
| `DEBUG_tmplMgr()` | 🔍 liest | `Sheets.gs:218` | Debug: Template-Manager-Daten ins Protokoll. |
| `DEBUG_userMgr()` | 🔍 liest | `Sheets.gs:375` | Debug: User-Manager-Daten ins Protokoll. |
| `setupSheetDocumentation()` | ✏️ schreibt | `SheetSetup.gs:70` | Run this once to insert a README sheet into the Access spreadsheet. Safe to re-run ? it overwrites the sheet if it already exists. |
| `fixQueueHeader()` | ✏️ schreibt | `SheetSetup.gs:172` | Also fix the Queue sheet header to match the 19-column format the code actually writes. Run fixQueueHeader() if your Queue sheet has the old 13-column header. |
| `testPatchDemo()` | ✏️ schreibt | `Test.gs:5` | Manueller Testlauf (ZIP-Download-Variante). Funktioniert nur bei kleinen Kursen (Utilities.unzip()-Limit ~50MB Gesamtinhalt). |
| `testFirebaseDeployDemo()` | ✏️ schreibt | `Test.gs:23` | Manueller Testlauf (Firebase-Hosting-Live-Variante, ZIP-basiert). FUNKTIONIERT NUR bei kleinen Kursen ohne grosse Videos - siehe testFirebaseDeployFromFolderDemo() fuer den robusten Weg. |
| `testFirebaseDeployFromFolderDemo()` | ✏️ schreibt | `Test.gs:54` | Manueller Testlauf (Firebase-Hosting-Live-Variante, ORDNER-basiert). Umgeht das Utilities.unzip()-Groessenlimit - dafuer musst du den SCORM-Export vorher LOKAL entpacken und den entstandenen Ordner (enthaelt … |
| `testPatchLogicOnly(runtimeDataJsText)` | ✏️ schreibt | `Test.gs:101` | Nur die Patch-Logik testen, ohne Drive/ZIP. |
| `testCreateArticulateProject()` | ✏️ schreibt | `Testregistry.gs:14` | SCHRITT 1: Legt einen Projekt-Eintrag im Zuordnungs-Sheet an. Vorher die vier Werte unten ausfuellen. |
| `testListArticulateProjects()` | ✏️ schreibt | `Testregistry.gs:31` | SCHRITT 2: Zeigt alle Eintraege inkl. ihrer IDs. |
| `testGeneratePreviewById()` | ✏️ schreibt | `Testregistry.gs:51` | SCHRITT 3: Kompletter Durchlauf - holt die aktuelle Uebersetzung aus Phrase, patcht den Kurs und deployt ihn live zu Firebase. ID aus Schritt 2 unten eintragen. |
| `testParseXliffFromPhrase()` | ✏️ schreibt | `Testregistry.gs:70` | Nur den XLIFF-Parser gegen einen echten Phrase-Job testen, ohne Deploy. Nuetzlich, um zu pruefen, wie viele Segmente aktuell uebersetzt sind, bevor man einen kompletten Deploy anstoesst. |
| `setupAllTriggers()` | ✏️ schreibt | `Triggers.gs:7` | SetupTriggers.gs Einmalig ausführen im Apps Script Editor ? Funktion "setupAllTriggers" ? Run Setzt alle nötigen Trigger für das Translation Hub Projekt. |
| `listAllTriggers()` | 🔍 liest | `Triggers.gs:56` | Zeigt alle aktuell gesetzten Trigger ? zum überprüfen. Ausführen: Funktion "listAllTriggers" ? Run |
| `removeAllTriggers()` | ✏️ schreibt | `Triggers.gs:76` | Löscht alle Trigger ? zum Zurücksetzen. Ausführen: Funktion "removeAllTriggers" ? Run |
| `testWatcherNotification()` | ✏️ schreibt | `Watchers.gs:159` | Schickt eine Watcher-Testbenachrichtigung (fest eingetragene Werte). |

### Nicht über die API testbar

| Funktion | Datei | Grund |
|---|---|---|
| `onAppCommand(e)` | `ChatCommands.gs:55` | Ereignis-Handler (Add-on/Chat/Editor). Braucht ein echtes Ereignisobjekt bzw. ein geöffnetes Dokument und liefert Karten/UI, die die Apps Script API nicht serialisieren kann. |
| `setChatUserMappingManually()` | `ChatToken.gs:310` | Enthält eine fest eingetragene Person und Chat-ID – nur im Editor anpassen und ausführen. |
| `setChatBotKeys()` | `ChatToken.gs:317` | Setzt CHAT_CLIENT_EMAIL und CHAT_PRIVATE_KEY auf fest eingetragene Werte (Schlüssel leer) – würde den Chat-Bot lahmlegen. Nur im Editor mit eingetragenem Schlüssel ausführen. |
| `onAddedToSpace(e)` | `Upload.gs:866` | Ereignis-Handler (Add-on/Chat/Editor). Braucht ein echtes Ereignisobjekt bzw. ein geöffnetes Dokument und liefert Karten/UI, die die Apps Script API nicht serialisieren kann. |
| `onMessage(e)` | `Upload.gs:913` | Ereignis-Handler (Add-on/Chat/Editor). Braucht ein echtes Ereignisobjekt bzw. ein geöffnetes Dokument und liefert Karten/UI, die die Apps Script API nicht serialisieren kann. |
| `onRemovedFromSpace(e)` | `Upload.gs:934` | Ereignis-Handler (Add-on/Chat/Editor). Braucht ein echtes Ereignisobjekt bzw. ein geöffnetes Dokument und liefert Karten/UI, die die Apps Script API nicht serialisieren kann. |
| `doPost(e)` | `Upload.gs:936` | HTTP-Einstieg bzw. Template-Helfer, wird im Ordner „Web-App“ getestet. |
| `doGet(e)` | `WebApp.gs:4` | HTTP-Einstieg bzw. Template-Helfer, wird im Ordner „Web-App“ getestet. |
| `include(name)` | `WebApp.gs:32` | HTTP-Einstieg bzw. Template-Helfer, wird im Ordner „Web-App“ getestet. |

### Mehrfach definierte Funktionen

Diese Namen sind in mehreren Dateien definiert. Apps Script verwendet die zuletzt geladene Definition; das ist fehleranfällig und sollte bereinigt werden.

- `findIdForEmail`: `ChatToken.gs`, `ChatToken.gs`
- `apiSetMaintenance`: `Apialiases.gs`, `Code.gs`
- `fixCorruptChatToken`: `ChatToken.gs`, `Code.gs`
- `apiDownloadTargetFile`: `DownloadTargetFile.gs`, `DownloadZip.gs`
- `apiGetKecWhitelist`: `Apialiases.gs`, `KecWhitelistAliases.gs`
- `apiAddKecWhitelist`: `Apialiases.gs`, `KecWhitelistAliases.gs`
- `apiRemoveKecWhitelist`: `Apialiases.gs`, `KecWhitelistAliases.gs`
- `onMessage`: `Chatbot.gs`, `Upload.gs`
- `apiAddMarketingWhitelist`: `AdminMarketing.gs`, `WebApp.gs`
- `apiRemoveMarketingWhitelist`: `AdminMarketing.gs`, `WebApp.gs`
- `apiGetMarketingWhitelist`: `AdminMarketing.gs`, `WebApp.gs`

