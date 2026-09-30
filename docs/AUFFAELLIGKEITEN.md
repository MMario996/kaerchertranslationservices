# Auffälligkeiten aus der Code-Analyse

Beim Erstellen der Dokumentation aufgefallen. **Nicht behoben** – diese Liste ist eine
Arbeitsgrundlage. Einträge mit „prüfen“ sind aus dem Code abgeleitet, aber nicht in der
laufenden App nachgestellt.

Schweregrad: 🔴 hoch · 🟠 mittel · 🟡 niedrig

## Sicherheit / Berechtigungen

| # | | Fund | Wirkung | Vorschlag |
|---|---|---|---|---|
| S1 | 🔴 | **Downloads prüfen nur die Whitelist, nicht den Projektbesitz.** `apiUserDownloadFromPhrase`, `apiDownloadAllJobsAsZip`, `apiDownloadTargetFile`, `apiGetFilesForDriveExport` (und damit `apiSmartDownload`, `apiSaveProjectToDrive`) rufen nur `apiCheckAccess()` auf. | Jede freigeschaltete Person kann mit einer bekannten Phrase-Projekt-UID die Übersetzungen fremder Projekte laden. | Queue-Zeile suchen und `noteCallerMayView_` (Admin/Eigentümer/Geteilt/Team) prüfen; für Doku-Projekte die Doku-Queue. |
| S2 | 🔴 | **Drive-Zugriff läuft als Deploy-Konto.** `apiBrowseDrive` blättert „My Drive“ und geteilte Ablagen **des Deploy-Kontos**; Uploads mit `source: "drive"/"drivelink"` lesen per `DriveApp.getFileById` ebenfalls als Deploy-Konto. | Freigeschaltete Nutzer sehen Ordner-/Dateinamen des Deploy-Kontos und können jede Datei, die dieses Konto lesen darf, nach Phrase übertragen und die Übersetzung herunterladen. (prüfen) | Drive-Auswahl über den Nutzer-OAuth-Token (wie „Save to Drive“) bzw. Google Picker mit Nutzer-Token; serverseitig prüfen, dass der Nutzer die Datei selbst lesen darf. |
| S3 | 🟠 | **Articulate-Registry und Preview ohne Prüfung:** `apiListArticulateProjects`, `apiCreateArticulateProject`, `apiDeleteArticulateProject`, `apiGenerateArticulatePreview`, `apiGenerateArticulatePreviewById`, `apiValidateArticulateInputs`, `apiFindCourseMetadataIds`. Die `…FromUi`-Varianten prüfen korrekt. | Jeder Domain-Nutzer kann per `google.script.run` Registry-Einträge löschen/anlegen und Firebase-Deploys auslösen. | Kernfunktionen mit `_` am Ende privat machen oder Campus-Prüfung einbauen. |
| S4 | 🟠 | **`doPost` prüft die Herkunft nicht.** Das Event-JSON (inkl. `user.email`) wird ungeprüft übernommen; `APP_COMMAND` ruft mutierende Befehle mit dieser E-Mail als `callerOverride` auf. | Wer die Web-App-URL per POST erreicht (bei `access: DOMAIN` jeder Domain-Nutzer), kann Befehle im Namen anderer ausführen. (prüfen) | Chat-App über die Apps-Script-Verbindung (`onAppCommand`) statt HTTP betreiben oder das Bearer-Token von Google Chat verifizieren. |
| S5 | 🟠 | **`apiGetJobNotes` ohne Prüfung.** | Notizen/Konversationen beliebiger Phrase-Jobs lesbar. | `noteCallerMayView_` wie bei `apiGetProjectNote`. |
| S6 | 🟡 | **`apiGetTemplates` liefert alle Vorlagen ungefiltert** (umgeht die fail-closed-Regel). | Informationsabfluss (Vorlagennamen, Zuordnungen). | Wie `getConfig_` filtern oder nur für Admins. |
| S7 | 🟡 | **Whitelists offen lesbar:** `apiGetWhitelist`, `apiGetMarketingWhitelist`, `…KeC…`, `…Doc…`, `…Woma…`, `…Cc…`, `…Articulate…`. | Jeder Domain-Nutzer sieht alle freigeschalteten E-Mails. | Lesen nur für Admins; intern die `is…User_`-Helfer nutzen. |
| S8 | 🟡 | **`apiGetAdminContent` / `apiGetPivotAdminContent` ohne Prüfung.** | Admin-HTML/JS für alle abrufbar (Endpunkte dahinter sind geschützt). | Admin/Light prüfen. |
| S9 | 🟡 | **Feste Standard-Sheet-IDs** in `Config.gs` und ein Gemini-Proxy mit IP-basiertem Hostnamen in `Chatbot.gs`. | Umgebungswechsel fehleranfällig; Proxy-Vertrauen unklar. | IDs nur aus Script Properties; Proxy-URL als Property. |

## Namenskonflikte (gleicher globaler Funktionsname)

Apps Script hat einen gemeinsamen globalen Namensraum. Bei doppelten Namen gewinnt die zuletzt
geladene Datei – das hängt von der Dateireihenfolge im Projekt ab und ist nicht offensichtlich.

| # | | Funktion | Fundstellen | Problem |
|---|---|---|---|---|
| N1 | 🟠 | `apiSetMaintenance` | `Code.gs` `(payload)` (schreibt Sheet) · `Apialiases.gs` `(start, end, msg)` (schreibt Properties) | verschiedene Signaturen und Speicherorte |
| N2 | 🟠 | `apiDownloadTargetFile` | `DownloadTargetFile.gs` (`{ok, fileName, mimeType, base64}`) · `DownloadZip.gs` (mit Campus-Nachbearbeitung) | unterschiedliche Rückgaben |
| N3 | 🟡 | `onMessage` | `Chatbot.gs` (Gemini) · `Upload.gs` (fester Hinweistext) | welcher Bot antwortet, ist zufällig |
| N4 | 🟡 | `apiGetMarketingWhitelist`, `apiAddMarketingWhitelist`, `apiRemoveMarketingWhitelist`, `isMarketingUser_` | `AdminMarketing.gs` · `WebApp.gs` / `Config.gs` | doppelte Pflege |
| N5 | 🟡 | `apiGetKecWhitelist`, `apiAddKecWhitelist`, `apiRemoveKecWhitelist` | `Apialiases.gs` · `KecWhitelistAliases.gs` | doppelte Aliase |
| N6 | 🟡 | `phraseApiUrlV3_` | `ProjectsApi.gs` · `Upload.gs` | identisch, aber redundant |

## Fehler / Inkonsistenzen

| # | | Fund | Wirkung | Vorschlag |
|---|---|---|---|---|
| F1 | 🟠 | `apiSaveDocExportEligibilitySettings` prüft `access.isAdmin`, aber `apiCheckAccess()` liefert kein `isAdmin`. | Speichern schlägt **immer** mit „Not authorized“ fehl. | `isAdmin_(getUserEmail_())` verwenden. |
| F2 | 🟠 | **Zwei Quellen für den Wartungsmodus:** `apiCheckAccess` liest das Sheet `Maintenance`; Banner/Config (`getMaintenanceConfig_`) lesen zuerst die Properties `MAINT_*`. Die Konsole ruft `apiSetMaintenance(start, end, msg)` auf (N1): gewinnt die `Apialiases.gs`-Version, landen die Werte nur in den Properties; gewinnt die `Code.gs`-Version, wird `start` als `payload` gelesen und die Wartung **abgeschaltet** statt eingeschaltet. | Wartung über die Konsole zeigt den Banner, sperrt Aktionen aber nicht – oder wird gar nicht gesetzt. (prüfen) | Eine Quelle festlegen, `apiSetMaintenance` in `Code.gs` umbenennen. |
| F3 | 🟠 | `apiGetConfig` prüft keinen Zugang; `JsCore` zeigt „Zugriff verweigert“ nur bei `config.authorized === false`, das nie gesetzt wird. | Nicht freigeschaltete Nutzer sehen eine leere App statt der Zugangsseite; der Fehler kommt erst beim Einreichen. | In `getConfig_` `apiCheckAccess()` auswerten und `authorized:false` liefern (Admins ausgenommen). |
| F4 | 🟡 | `apiCreateProjectAndUpload` antwortet mal `{ ok:false }`, mal `{ success }`. | Aufrufer müssen beides prüfen. | Einheitlich `{ success, error }`. |
| F5 | 🟡 | `readQueueRows_` liest `jobMapping` per Kopfzeile „JobMapping“, sonst **Spalte U** – dort stehen die Chat-Threads der Geteilten (JSON-Objekt). | Ohne Kopfzeile wird ein Objekt als Mapping geparst. | Eigene Spalte, Fallback-Index entfernen. |
| F6 | 🟡 | Dateiname `Articualtepreview.gs` (Tippfehler), gemischte Sprachen (DE/EN) in Meldungen, Fragezeichen statt Sonderzeichen in einigen Kommentaren/Logs (Kodierung). | Lesbarkeit. | Bei Gelegenheit bereinigen. |
