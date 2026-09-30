# API, Authentifizierung und Integrationen

Dieses Dokument beschreibt **alle Server-Endpunkte** des Portals, wie sie aufgerufen werden,
wer sie aufrufen darf und mit welchen externen Diensten sie sprechen.

> Es gibt **keine REST-API** für den Browser. Die Oberfläche ruft Server-Funktionen per
> `google.script.run` auf (RPC über Apps Script). Die einzigen HTTP-Einstiege sind `doGet`
> (Seite ausliefern) und `doPost` (Google-Chat-Events), siehe unten.

---

## 1. Aufrufmodell

```js
google.script.run
  .withSuccessHandler(res => { /* Rückgabewert der Server-Funktion */ })
  .withFailureHandler(err => { /* bei throw auf dem Server: err.message */ })
  .apiShareProject(projectUid, "kollegin@karcher.com");
```

- Jede **globale Funktion ohne abschließendes `_`** ist vom Browser aufrufbar. Konvention:
  Endpunkte heißen `api…`, interne Helfer enden auf `_`.
- Parameter und Rückgaben müssen serialisierbar sein (Strings, Zahlen, Booleans, Arrays,
  einfache Objekte). `Date` wird als Wert übertragen, aber das Portal nutzt fast überall
  ISO-Strings. Funktionen, Blobs, `undefined` in Arrays gehen nicht.
- Dateien werden als **Base64** übertragen (Upload: `{source:"pc", base64, fileName, mimeType}`,
  Download: `{fileName, mimeType, base64}`) oder als Drive-ID.
- Laufzeitgrenze 6 min. Lange Vorgänge melden Fortschritt über den Script-Cache, den der
  Browser parallel abfragt (z. B. `apiGetPreviewProgress(sessionId)`).

### Antwortkonventionen (uneinheitlich – beim Aufrufen beachten)

| Muster | Beispiel | Fehlerfall |
|---|---|---|
| `{ success: true, … }` | die meisten neueren Endpunkte | `{ success: false, error: "…" }` |
| `{ ok: true, … }` | Drive-Browser, Articulate-Registry, `apiDownloadTargetFile` | `{ ok: false, error: "…" }` |
| Rohdaten | `apiGetWhitelist()` → `{ emails: [] }`, `apiGetConfig()` | – |
| `throw new Error("Not authorized…")` | viele Admin-Endpunkte | landet im `withFailureHandler` |
| `{ authorized: false }` | `apiHealthCheck`, `apiRunSelfTests` | – |

`apiCreateProjectAndUpload` mischt beides: Vorabfehler `{ ok:false, error }`, danach
`{ success:true|false, … }`. Clients sollten `res.success || res.ok` prüfen.
Neue Endpunkte: bitte `{ success, error }` verwenden.

---

## 2. Authentifizierung der Nutzer

### Identität

- Die Web-App ist mit `access: DOMAIN` bereitgestellt: nur angemeldete Konten der
  Kärcher-Workspace-Domain erreichen sie (Google-SSO, kein eigenes Login).
- Server-seitig: `getUserEmail_()` = `Session.getActiveUser().getEmail()` in Kleinbuchstaben.
  Das ist die **einzige** Identität; es gibt keine Sessions, Cookies oder Tokens der App.
- In **Chat-Events und Triggern** ist diese E-Mail leer. Chat-Befehle geben die E-Mail aus dem
  Event als `callerOverride` weiter (`apiUpdateDueDate`, `apiCancelProject`,
  `apiUpdateProjectName`, `apiAddJobNote`).

### Rollen

| Rolle | Quelle | Wirkung |
|---|---|---|
| **Admin** | Script Property `ADMIN_EMAILS` | alles; sieht alle Projekte; darf Nutzer simulieren |
| **Admin-Light** | Sheet `Whitelist_AdminLight`, Spalte Subtabs | nur die freigegebenen Bereiche: `users`, `templates`, `pivot`, `tests`, `dashboard` (Dashboard über alle Projekte) |
| **General** | Sheet `Whitelist` | Reiter „General Projects“ |
| **Exklusive Bereiche** | `Whitelist_Marketing`, `_KeC`, `_Documentation`, `_Woma`, `_CC`, `_Articulate` | nur der jeweilige Spezialreiter (`isExclusive`), kein „General Projects“ |
| **Kein Eintrag** | – | kann die Seite öffnen, sieht aber keine Projektbereiche; Upload wird abgelehnt |

`apiCheckAccess()` entscheidet über den Zugang zu Aktionen:
Admin → erlaubt; **Wartung aktiv** → gesperrt (`reason: "maintenance"`); dann der Reihe nach
General, Marketing, KeC, Doc, WOMA, CC, Articulate → erlaubt (`reason: "<x>_whitelisted"`);
sonst `not_whitelisted`.

### Sichtbarkeit von Vorlagen (Templates)

`templateMatchesUser_` (Config.gs), **fail-closed**: Eine Vorlage ist nur sichtbar, wenn
**Client, Domain, Subdomain und Business Unit** der Vorlage jeweils in den Werten des Nutzers
(`FetchTMS_USERS-Prod`) vorkommen. Ein leeres Feld – an der Vorlage oder beim Nutzer – bedeutet
„nicht sichtbar“. Admins sehen alle. Der Admin-Debugger (`apiDebugUserTemplates`) erklärt pro
Vorlage den Grund und schlägt die Zuordnung vor, die die meisten Vorlagen freischalten würde.

### Sichtbarkeit von Projekten

`apiGetMyProjects`: Admin sieht alle Zeilen der Queue; sonst eigene (Spalte B), mit dem Nutzer
geteilte (Spalte R) und – für WOMA-Nutzer – alle Projekte anderer WOMA-Nutzer.
Ändern (Frist, Name, Notiz, Abbrechen, Teilen) darf: Admin oder Eigentümer; Notizen und Frist
auch Geteilte (`noteCallerMayEdit_`).

### Simulation (Impersonation)

`apiGetConfig(impersonateEmail, uiLang)`: Nur Admins; liefert die Config (Vorlagen, Reiter,
Rollen) **so, wie der andere Nutzer sie sähe**. Andere Endpunkte werden dadurch **nicht**
umgestellt – sie laufen weiter als der Admin. Einstellungen (`apiGetUserPrefs`) sind nie
simuliert.

### Berechtigungsmuster für neue Endpunkte

```js
function apiDoSomethingAdmin(arg) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller)) return { success: false, error: "Not authorized. Admin only." };
  // ...
}

function apiDoSomethingForLight(arg) {
  const caller = getUserEmail_();
  if (!isAdmin_(caller) && !isAdminLightWithAccess_(caller, "templates")) {
    return { success: false, error: "Not authorized." };
  }
}

function apiDoSomethingWithProject(projectUid) {
  const access = apiCheckAccess();              // Whitelist + Wartung
  if (!access.allowed) return { success: false, error: "Not authorized." };
  const row = noteFindQueueRow_(projectUid);    // Eigentümer/Geteilt prüfen
  if (!row || !noteCallerMayEdit_(row, getUserEmail_())) return { success: false, error: "Not authorized." };
}
```

Wichtige Aktionen zusätzlich mit `logAuditEvent_(caller, "AKTION", "Details")` protokollieren.

---

## 3. Endpunkt-Katalog

**Legende „Recht“:**
`offen` = jeder Domain-Nutzer · `angemeldet` = prüft nur, dass eine E-Mail vorhanden ist ·
`Zugang` = `apiCheckAccess()` (Whitelist, nicht in Wartung) · `Eigentümer` = Admin, Eigentümer
(ggf. Geteilte) des Projekts · `Admin` · `Light:x` = Admin oder Admin-Light mit Bereich x ·
`Campus` = Admin oder Articulate-Whitelist · `Pivot` = `canManagePivot_` (Admin/Light:pivot).
Einträge mit ⚠️ sind in `AUFFAELLIGKEITEN.md` erklärt.

### 3.1 Start, Konfiguration, nachgeladene Oberfläche

| Funktion | Recht | Zweck / Rückgabe |
|---|---|---|
| `apiGetConfig(impersonateEmail?, uiLang?)` | offen (Simulation: Admin) | Start-Config: `templates` (gefiltert), `languages`, `sizeLimitMb`, `kbUrl`, `currentUser`, `effectiveUser`, `isImpersonating`, `isAdmin`, `effectiveIsAdmin`, `isMarketing`, `isKeC`, `isDoc`, `isArticulate`, `isWoma`, `isCc`, `isGeneral`, `isExclusive`, `maintenance`, `adminLightSubtabs`, `userPrefs`, `announcements`, `i18nLang`, `i18nDict`, `i18nEn` |
| `apiGetContext()` | offen | `{ email, isAdmin, maintenance }` |
| `apiCheckAccess()` | offen | `{ allowed, reason, maintenance? }` |
| `apiGetMaintenance()` / `apiGetMaintenanceConfig` (intern) | offen | Wartungsstatus |
| `apiGetI18nDict(lang)` | offen | App-Wörterbuch einer Sprache |
| `apiGetAdminI18n(lang)` | Admin oder irgendein Light-Recht | Admin-Wörterbuch |
| `apiGetHomeUi()` | offen | `{ css, js }` der Startseite (`HomeUi.html`) |
| `apiGetPrefsUi()` | offen | Markup des Einstellungsdialogs |
| `apiGetDarkThemeCss()` | offen | CSS des dunklen Modus |
| `apiGetGuideContent()` | offen | HTML von Anleitung/FAQ |
| `apiGetLazyScript(name)` | offen, Allowlist `["JsCampus"]` | Skripttext zum Nachladen |
| `apiGetAdminContent()` | offen ⚠️ | `{ html, js }` der Admin-Konsole |
| `apiGetPivotAdminContent()` | offen ⚠️ | `{ html, js }` Pivot-Admin |
| `apiGetTranslateUiContent()` | Admin | `{ html, js }` Translate UI |
| `apiGetGermanHolidays(years)` | offen | Feiertage (für Fristprüfung im Browser) |

### 3.2 Projekt anlegen

| Funktion | Recht | Zweck |
|---|---|---|
| `apiCreateProjectAndUpload(payload)` | Zugang | Legt Phrase-Projekt(e) aus Vorlage an, lädt Dateien als Jobs und Referenzen hoch, schreibt Queue-Zeile(n), schickt Chat-Nachricht, informiert Watcher |
| `apiHandleUpload(payload)` | Zugang | Kompatibilitäts-Wrapper: normalisiert alte Feldnamen, ruft obige Funktion |
| `apiUploadToExistingProject(payload)` | Zugang | KeC: Dateien an bestehendes Phrase-Projekt |
| `apiGetEligibleKeCProjects()` | angemeldet | KeC-Projekte (Status NEW, passende Client/Domain/BU-IDs) |
| `apiDebugSingleKeCProject(projectUid)` | angemeldet | Diagnose, warum ein Projekt (nicht) als KeC gilt |
| `apiGetKecEligibilitySettings()` / `apiSaveKecEligibilitySettings(clientId, domainId, businessUnitId)` | Admin | KeC-Kriterien |
| `apiGetPivotChildLanguageOptions(parentTemplateUid)` | angemeldet | Zielsprachen für Pivot-Übersetzungsschritt |
| `apiSavePreset(presetData)` / `apiLoadPresets()` / `apiDeletePreset(presetId)` | angemeldet (eigene) | Formular-Vorlagen |
| `apiSavePresetSheet`, `apiGetUserPresets` | – | Aliase (Apialiases.gs) |
| `apiGetTemplates()` | offen ⚠️ | alle Vorlagen aus dem Sheet (ungefiltert) |
| `apiBrowseDrive(folderId)` | Zugang ⚠️ | Drive-Ordner blättern (`home`, `root`, `::shared-drives-root::`, Ordner-ID) |

**Payload `apiCreateProjectAndUpload`:**

```jsonc
{
  "portalType": "request|marketing|woma|cc|kec|articulate",  // woma/cc setzen den echten Eigentümer
  "templateUid": "…",            // oder targetUidMap
  "templateName": "…",
  "targetUidMap": { "de_de": "<templateUid>", "fr_fr": "<templateUid>" }, // Sprache → Vorlage; je Vorlage ein Projekt
  "projectName": "…",            // Pflicht
  "sourceLang": "en",            // Pflicht
  "targetLangs": ["de_de", "fr_fr"], // Pflicht (oder targetLang)
  "dueDate": "2026-10-15T00:00:00.000Z",
  "note": "…",
  "campusReviewType": "…",       // Pflicht bei portalType "articulate"
  "pivotTargetLangs": ["…"],     // nur Pivot-Vorlagen: Sprachen des Folgeprojekts
  "mainFiles": [                 // Pflicht, .pdf und .doc sind gesperrt
    { "source": "pc", "fileName": "a.docx", "mimeType": "…", "base64": "…" },
    { "source": "drive", "fileId": "…" },
    { "source": "drivelink", "fileId": "…" }
  ],
  "refFiles": [ /* wie mainFiles */ ],
  "refDriveIds": ["…"]
}
```

Antwort: `{ success, timedOut, projectUid, allProjectUids, jobUids, jobMapping, mainResults,
refResults, createdProjects, errors }`.
Ablauf pro Vorlagen-Gruppe: `POST v2/projects/applyTemplate/{templateUid}` → je Hauptdatei
`POST v1/projects/{uid}/jobs` → je Referenz `POST v2/projects/{uid}/references` → Custom Field
„Project Creator“ setzen → Queue-Zeile → Chat.

### 3.3 Meine Projekte, Details, Aktionen

| Funktion | Recht | Zweck |
|---|---|---|
| `apiGetMyProjects()` | angemeldet (gefiltert) | `{ projects: [...], email }` – Felder s. u. |
| `apiListMyProjects()` | angemeldet (gefiltert) | ältere Variante |
| `apiGetProjectsProgress(uids)` | nur eigene UIDs, max. 20 | `{ uid: { done, total } }`, 10 min Cache |
| `apiGetDashboardData()` | angemeldet; alle Projekte nur Admin/Light:dashboard | `{ scope: "all"|"own", generatedAt, rows }` – Filter/Diagramme rechnet der Browser |
| `apiGetTeamProjects()` | angemeldet | Projekte der Team-Mitglieder (nur lesen) |
| `apiSyncProjectStatuses()` | angemeldet (nur eigene; Admin alle) | Status aus Phrase holen, benachrichtigen |
| `apiShareProject(projectUid, email)` | Eigentümer | teilen + Chat + Glocke + Kalender |
| `apiCancelProject(projectUid, callerOverride?)` | Eigentümer | Status `CANCELLED` + Benachrichtigungen |
| `apiUpdateDueDate(projectUid, newDateIso, callerOverride?)` | Eigentümer/Geteilt | Frist in Phrase + Queue + Benachrichtigung |
| `apiUpdateProjectName(projectUid, newName, callerOverride?)` | Eigentümer/Geteilt | Name in Phrase + Queue |
| `apiGetProjectNote(projectUid)` | Eigentümer/Geteilt/Team | `{ note, canEdit }` |
| `apiUpdateProjectNote(projectUid, newNote)` | Eigentümer/Geteilt | Projektnotiz in Phrase (Pivot-Marker bleibt) |
| `apiAddJobNote(projectUid, jobUid, text, callerOverride?)` | Eigentümer/Geteilt | Text an Projektnotiz anhängen |
| `apiGetJobNotes(projectUid, jobUid?)` | ⚠️ keine Prüfung | Phrase-„Conversations“ aller Jobs |
| `apiGetPhraseProjectMetaByName(name)` | – | Phrase-Metadaten per Namen |

Projekt-Objekt (`apiGetMyProjects`): `timestamp`, `uploadDate`, `userEmail`, `owner`,
`isShared`, `phraseUrl`, `projectUid`, `jobUid`, `jobUids[]`, `targetLangs[]`, `projectName`,
`templateName`, `fileName`, `mimeType`, `sourceLang`, `targetLang`, `status`, `dueDate`,
`sharedWith`, `jobMapping[]` (`{jobUid, fileName, targetLang}`), `pivotRole`, `pivotLink`,
`downloadedAt`, `totalWords`, `netWords`, `groupShared`.

### 3.4 Download und Export

| Funktion | Recht | Zweck |
|---|---|---|
| `apiSmartDownload(projectUid, jobUids, projectName, targetLangs, fileName, targetLang, mimeType, jobMapping)` | ⚠️ selbst keine Prüfung (die aufgerufenen prüfen Zugang) | Ermittelt höchsten Workflow-Schritt; 1 Datei → Einzel-Download, sonst ZIP |
| `apiUserDownloadFromPhrase(projectUid, jobUid, fileName, targetLang, mimeType)` | Zugang ⚠️ | Einzeldatei als Base64 |
| `apiDownloadAllJobsAsZip(…)` / Alias `apiDownloadMultipleTargets(…)` | Zugang ⚠️ | ZIP als Base64 |
| `apiDownloadTargetFile(projectUid, jobUid)` | Zugang ⚠️ | doppelt definiert (s. Auffälligkeiten) |
| `apiGetFilesForDriveExport(…)` | Zugang ⚠️ | Dateien für Drive-Export |
| `apiGetDriveSaveConfig()` | offen | `{ clientId, configured }` |
| `apiSaveDriveSaveClientId(clientId, clientSecret)` | Admin | OAuth-Client setzen (setzt alle Nutzer-Tokens zurück) |
| `apiCheckDriveAuthStatus()` | angemeldet | `{ authorized }` für „Save to Drive“ |
| `apiGetDriveAuthUrl()` | angemeldet | URL für die Google-Freigabe |
| `apiSaveProjectToDrive(projectUid, jobUids, projectName, targetLangs, jobMapping, convertToGoogle, options)` | Nutzer-OAuth + Zugang | Upload in „Meine Ablage“ des Nutzers; `options.folderName`, `options.subFolderName`; ohne Token `{ needsAuth: true }` |

„Zugang ⚠️“: Diese Endpunkte prüfen nur die Whitelist, **nicht**, ob das Projekt dem Aufrufer
gehört.

### 3.5 Dokumentation

| Funktion | Recht | Zweck |
|---|---|---|
| `apiGetDocImportTemplateLangs(templateUid)` | Zugang | Sprachen einer Doku-Vorlage |
| `apiGetDocImportFolderHistory(folderId)` | Zugang | Wurde der Ordner schon importiert? |
| `apiUploadDocXmlBatch(payload)` | Zugang | `{ templateUid, templateName, sourceLang, projectName, iaNumber, dueDate, note, files:[{targetLang, fileId, fileName}] }` |
| `apiGetDocQueueProjects()` / `apiGetDocProjectsForHistory()` | Zugang | Doku-Projekte (Format wie Meine Projekte) |
| `apiArchiveDocQueueProject(projectUid, projectName)` | Zugang ⚠️ | Zeilen ins Archiv verschieben |
| `apiGetDocBoardData()` | Zugang | Board |
| `apiGetDocDriveTree(projectName)` / `apiGetDocDriveTreeById(folderId)` / `apiSearchDocDriveFolders(query)` | Zugang | Ordner unter dem Doku-Root |
| `apiGetDocDriveRootSettings()` / `apiSaveDocDriveRootSettings(idOrUrl)` | Admin | Doku-Root |
| `apiGetDocExportStatus(projectName)` | Zugang | Live-Status |
| `apiExportDocProjectToDrive(uid, name, jobs)` / `apiExportSingleJobToDrive(uid, name, job)` | Zugang | Fertige Übersetzungen in den Drive-Ordner |
| `apiGetDocExportEligibilitySettings()` | Zugang | Kriterien |
| `apiSaveDocExportEligibilitySettings(clientId, domainId, subDomainId, businessUnitId)` | ⚠️ immer abgelehnt (Bug) | Kriterien speichern |
| `apiGetDocExportEligibleProjects()` | Zugang | passende Phrase-Projekte inkl. Jobs |

### 3.6 Campus / Articulate (Rise-Kurse)

| Funktion | Recht | Zweck |
|---|---|---|
| `apiListArticulateProjectsForUi()` | angemeldet (Nicht-Admins: eigene) | Kursliste |
| `apiCreateArticulateProjectFromUi(payload)` / `apiBatchCreateArticulateProjectsFromUi(payloads)` | Campus | Kurs registrieren (mit Validierung) |
| `apiDeleteArticulateProjectFromUi(id)` | Campus | Kurs entfernen |
| `apiRunArticulatePreview(id, sessionId)` | Campus | Vorschau erzeugen (Phrase-XLIFF → Rise patchen → Firebase Hosting) |
| `apiGetPreviewProgress(sessionId)` | offen | `{ percent, message }` zum Pollen |
| `apiArtPickerListProjects()` / `apiArtPickerListJobs(projectUid)` | Campus | Auswahl-Listen |
| `apiValidateArticulateInputs(payload)` | offen | nur prüfen |
| `apiListArticulateProjects()`, `apiCreateArticulateProject(p)`, `apiDeleteArticulateProject(id)`, `apiGenerateArticulatePreview(params)`, `apiGenerateArticulatePreviewById(id, sessionId, jobUid?)` | ⚠️ offen | Registry-/Preview-Kern ohne Prüfung |
| `apiFindCourseMetadataIds()` | ⚠️ offen | Hilfsfunktion (Phrase-IDs für Campus) |
| `apiGetArticulateWhitelist()` / `apiAdd…` / `apiRemove…` | lesen offen / ändern Admin | Whitelist |

### 3.7 Persönliches

| Funktion | Recht | Zweck |
|---|---|---|
| `apiGetUserPrefs()` / `apiSaveUserPrefs(patch)` | eigene | Einstellungen (Schlüssel s. `UI-UX.md`) |
| `apiGetTeamSettings()` | eigene | Team-Einstellung + Vorschau |
| `apiGetNotifications()` / `apiMarkNotificationsRead()` | eigene | Glocke |
| `apiGetChatPreference()` / `apiSetChatPreference(enabled)` | eigene | Chat-Benachrichtigungen an/aus |
| `apiGetCalendarSyncStatus()` | eigene | `{ configured, authorized, enabled, includeDone, calendarId, lastSync, lastResult }` |
| `apiGetCalendarAuthUrl(lang)` | eigene | Freigabe-URL |
| `apiSetCalendarSyncOptions({ enabled, includeDone, lang })` | eigene | ein-/ausschalten, synchronisiert sofort |
| `apiCalendarSyncNow()` | eigene | jetzt abgleichen |
| `apiDisconnectCalendar(deleteCalendar)` | eigene | Token widerrufen, optional App-Kalender löschen |

### 3.8 Admin

| Bereich | Funktionen | Recht |
|---|---|---|
| Zugriffe | `apiGetAccessMatrix()`, `apiSetAccessBulk(emails, areaIds, grant)` | Admin |
| Whitelists | `apiGet/Add/RemoveWhitelist`, `…MarketingWhitelist`, `…KeCWhitelist` (+ Alias `…Kec…`), `…DocWhitelist`, `…WomaWhitelist`, `…CcWhitelist`, `…ArticulateWhitelist` | lesen offen ⚠️ / ändern Admin |
| Admins | `apiGetAdmins()`, `apiAddAdmin(email)`, `apiRemoveAdmin(email)` | Admin |
| Admin-Light | `apiGetAdminLightUsers()`, `apiAddAdminLightUser(email, subtabs)`, `apiRemoveAdminLightUser(email)` | Admin |
| Wartung | `apiSaveMaintenanceConfig(startIso, endIso, msg)`, `apiClearMaintenanceConfig()`, `apiSetMaintenance(…)` ⚠️, `apiClearMaintenance()` | Admin |
| System | `apiSaveAdminSettings(sizeLimitMb)` / `apiSetFileSizeLimit(mb)`, `apiGetAdminDashboardData()`, `apiGetAdminDashboardDataExtended()`, `apiGetRecentLogs()`, `apiGetDashboardStats()` | Admin |
| Script Properties | `apiGetAllScriptProperties()`, `apiSetScriptProperty(k, v)` / `apiUpdateScriptProperty`, `apiAddScriptProperty(k, v)`, `apiDeleteScriptProperty(k)`, `apiRevealScriptProperty(k)` (nie für sensible Keys) | Admin |
| Sync | `apiTriggerManualSync(type, mode)` mit `type` = `templates`/`users`/`notifications`/`chatmappings`, `mode` = `full`/`add_only`; `apiSyncNotifications()`, `apiResolveChatMappings()`, `apiToggleAutoSync(enable)`, `apiGetAutoSyncStatus()` (offen) | Admin |
| User Manager | `apiGetUsersForManager()`, `apiUpdateUserField(username, field, value, syncToPhrase)` | Light:users |
| Template Manager | `apiGetTemplatesForManager()`, `apiSetTemplateActive(templateUid, active)` | Light:templates |
| Debugger | `apiDebugListUsers()`, `apiDebugUserTemplates(email)`, `apiDebugPivotFindChild(name)` | Admin |
| Pivot | `apiGetPivotTemplateLinks()`, `apiAdd/RemovePivotTemplateLink(parent, child)`, `apiGetPivotLanguageMap()`, `apiGetPivotFieldOptionValues()`, `apiSet/RemovePivotLanguageMapping(…)` | Light:pivot |
| Pivot (Batch) | `apiPivotListTemplates(force)`, `apiAdd/RemovePivotTemplateLinksBatch(pairs)`, `apiRefreshPivotLinkDetails()`, `apiSetPivotLanguageMappingsBatch(entries)` | Pivot |
| Kommunikation | `apiAdminListAnnouncements()`, `apiAdminSaveAnnouncement(a)`, `apiAdminSetAnnouncementActive(id, active)`, `apiAdminDeleteAnnouncement(id)`, `apiAdminSendAnnouncementChat(id)`, `apiGetMessageTemplates()`, `apiSaveMessageTemplate(key, de, en)`, `apiResetMessageTemplate(key)`, `apiTestChatBot(email)`, `apiGetWatcherConfig()`, `apiSaveWatcherConfig(arr)` | Admin |
| Protokolle | `apiGetAuditLog(limit)`, `apiPurgeOldAuditEntries(days)` | Admin |
| Diagnose | `apiHealthCheck()` / `apiRunHealthCheck()`, `apiRunSelfTests()` (Light:tests) | Admin |
| Translate UI | `apiPsGetConfig()`, `apiPsSaveConfig(project, region, token)`, `apiPsCheck()`, `apiPsPush({dicts, langs, overwrite})`, `apiPsPull({dicts, langs})`, `apiPsCoverage()`, `apiPsClearOverrides()`, `apiPsSetNightly(enabled)` | Admin |

---

## 4. HTTP-Einstiege

| Einstieg | Aufrufer | Verhalten |
|---|---|---|
| `GET <webapp-url>` | Browser (direkt oder eingebettet in Google Sites) | `Index.html` als Template, `XFrameOptionsMode.ALLOWALL` |
| `GET <webapp-url>?page=kb` (`knowledgebase`, `knowledge-base`, `wissen`) | Browser / Google Sites | eigenständige Knowledge-Base-Seite |
| `GET <webapp-url>?tab=history` | Links aus Chat | öffnet direkt „Meine Projekte“ |
| `POST <webapp-url>` (`doPost`) | Google Chat | Event-JSON; `type` = `ADDED_TO_SPACE` → Begrüßung, `MESSAGE` → Hinweistext, `APP_COMMAND` → Slash-Command. Antwort JSON. ⚠️ keine Prüfung, dass die Anfrage von Google Chat stammt |
| `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback` | Google OAuth | Callback für Drive-Export (`driveSaveOAuthCallback_`) und Kalender (`calendarOAuthCallback_`) |

Zusätzlich registriert (Chat-API-Konfiguration, Verbindung „Apps Script“):
`onAddedToSpace`, `onMessage`, `onRemovedFromSpace`, `onAppCommand`.

### Slash-Commands (`ChatCommands.gs`)

Routing über `appCommandId` (Fallback: getippter Name). Projekte werden über die Phrase-UID
angesprochen; mutierende Befehle prüfen Eigentümer/Geteilt/Admin wie das Portal.

| ID | Befehl | Zweck |
|---|---|---|
| 1 | `/changeprojectname` | Projekt umbenennen |
| 2 | `/changeduedate` | Frist ändern |
| 3 | `/changerevisor` | Revisor ändern |
| 4 | `/projectstatus` | Status abfragen |
| 5 | `/assignlinguist` | Linguist zuweisen |
| 6 | `/closeproject` | Projekt abschließen/abbrechen |
| 7 | `/termsearch` | Termbase durchsuchen (`TERMBASE_UID`) |
| 8 | `/quotestatus` | Angebotsstatus |
| 9 | `/notifyvendor` | Dienstleister benachrichtigen |
| 10 | `/jobstats` | Job-Statistik |

---

## 5. Externe Dienste und ihre Authentifizierung

| Dienst | Auth-Verfahren | Zugangsdaten | Scope / Rechte |
|---|---|---|---|
| **Phrase TMS** | statischer API-Token, `Authorization: Bearer <token>` | `PHRASE_API_TOKEN` | Rechte des technischen Phrase-Nutzers (bleibt Projekt-Eigentümer; echter Einreicher geht ins Custom Field „Project Creator“) |
| **Phrase Strings** | a) klassischer Token (64 Hex): `Authorization: token <t>`; b) Plattform-Token: OAuth 2.0 Token Exchange (RFC 8693) an `https://{eu|us}.phrase.com/idm/oauth/token` → JWT (~4 h, im Script-Cache) als `Bearer`; c) JWT direkt | `PHRASE_STRINGS_TOKEN`, `_PROJECT`, `_REGION` | read+write auf das Strings-Projekt |
| **Google Chat** | Service Account, JWT-Bearer über OAuth2-Bibliothek (`OAuth2.createService("TranslationChatBot_v3")`) | `CHAT_CLIENT_EMAIL`, `CHAT_PRIVATE_KEY` | `https://www.googleapis.com/auth/chat.bot` |
| **Drive „Save to Drive“** | 3-legged OAuth pro Nutzer (Authorization Code, offline), Token in **User Properties** | `DRIVE_SAVE_OAUTH_CLIENT_ID/SECRET` | `drive.file` (nur selbst angelegte Dateien) |
| **Google Calendar** | 3-legged OAuth pro Nutzer, gleicher Client; Token in **Script Properties** (Service `Cal_<hash>`), E-Mail signiert im State | wie Drive | `calendar.app.created` (nur eigener App-Kalender) |
| **Firebase Hosting** | Service Account: selbst signiertes JWT (RS256) → `oauth2.googleapis.com/token`, Access-Token 50 min gecacht | `SERVICE_ACCOUNT_JSON` | `firebase.hosting`, `cloud-platform` |
| **Gemini** | API-Key über einen Apigee-Proxy (Basis-URL in `Chatbot.gs`) | `GEMINI_API_KEY` | Modell `gemini-2.0-flash`, max. 5 Tool-Runden, Tools nur lesend |
| **Google Workspace intern** | Apps-Script-Scopes des Deploy-Kontos (`appsscript.json`) | – | Drive, Sheets, Admin Directory (Nutzer), People API (Verzeichnissuche), Cloud Identity Groups (lesen), Contacts (lesen), externe Requests, Trigger |

### Phrase TMS – verwendete Endpunkte

Basis: `PHRASE_API_BASE_URL` + `/api2/v1|v2|v3`. Alle JSON-Aufrufe über
`phraseFetchJson_` mit **429-Retry** (max. 3, `Retry-After` oder 2 s · 2ⁿ); Fehler werfen
`Phrase API Error (<code>) @ <url>: <message>`.

| Methode + Pfad | Verwendung |
|---|---|
| `POST v2/projects/applyTemplate/{templateUid}` | Projekt aus Vorlage (`name`, `note`, `sourceLang`, `dateDue`, `targetLangs`) |
| `POST v1/projects/{uid}/jobs` | Hauptdatei als Job; Header `Memsource: {"targetLangs":[…],"useProjectFileImportSettings":true,"due":…}`, `Content-Disposition: filename*=UTF-8''…`, Body = Bytes |
| `POST v2/projects/{uid}/references` | Referenzdatei (multipart) |
| `GET v1/projects/{uid}` / `PATCH v1/projects/{uid}` | Status lesen; Name, Frist, Notiz ändern |
| `GET v2/projects/{uid}/quotes` | `/quotestatus` |
| `GET v1/projects?name=…`, `?statuses=NEW` | Suche, KeC |
| `GET v2/projects/{uid}/jobs` | Jobs, Fortschritt, Download-Auswahl (höchster Workflow-Schritt) |
| `GET v1/projects/{uid}/jobs/{jobUid}/targetFile` | Download (`phraseDownloadTargetFile_`) |
| `GET/PUT v1/projects/{uid}/customFields…` | „Project Creator“, „Pivot languages“ u. a. |
| `GET v1/projectTemplates…`, `GET v1/projectTemplates/{uid}` | Vorlagen-Sync, Sprachen |
| `GET v1/users?email=…`, `GET v1/users?pageNumber=…`, `GET v1/users/{uid}` | Nutzer-Sync |
| `GET v1/clients|domains|subDomains|businessUnits…` | Eligibility-IDs |
| `POST v1/termBases/{uid}/searchTerm` | `/termsearch` |
| `GET v1/jobs/{jobUid}/conversations/plains` | Job-Notizen (`apiGetJobNotes`) |

Web-Links (keine API): `…/web/project/show/{uid}`, `…/web/job/{jobUid}/translate`.

### Google Chat – verwendete Endpunkte

- `GET https://chat.googleapis.com/v1/spaces:findDirectMessage?name=users/{id}` – 1:1-Space
  finden. 404 = Nutzer hat den Bot nie geöffnet → Fallback auf zuletzt bekannten Space mit
  @-Erwähnung.
- `POST …/v1/{space}/messages` – Nachricht; mit
  `?messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD` + `thread.name` als Antwort.
- `PATCH …/v1/{message}?updateMask=text` – Nachricht ändern.
- Chat-User-ID (`users/…`): aus Chat-Events gemerkt (Sheet `Notifications`, Spalte C), sonst
  Admin Directory `Users.get(email).id`.
- Nachrichtentexte: `Message_Templates` mit Platzhaltern wie `{{PROJECT_NAME}}`,
  `{{PHRASE_URL}}` (Keys u. a. `MSG_PROJECT_SUBMITTED`, `MSG_PIVOT_PROJECT_SUBMITTED`,
  `MSG_WELCOME`, `MSG_COMPLETED`, `MSG_SHARED`, `MSG_SHARE_CONFIRM`, `MSG_CANCELLED`).

### Einmalige Einrichtung OAuth (Drive + Kalender)

1. GCP-Projekt des Apps-Script-Projekts → OAuth-Client-ID Typ „Webanwendung“.
2. Redirect-URI: `https://script.google.com/macros/d/{SCRIPT_ID}/usercallback`
   (keine JavaScript-Origins – `*.googleusercontent.com` ist dort nicht erlaubt, deshalb kein
   Browser-Flow mit Google Identity Services).
3. Calendar API aktivieren, Scope `calendar.app.created` am Zustimmungsbildschirm.
4. Client-ID/-Secret in Admin → Console → „Google Drive Export“ eintragen.
