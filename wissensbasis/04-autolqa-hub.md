# AutoLQA Hub (Repo `autolqa-hub`)

> Kurz: Web-App für KI-gestützte Qualitätsprüfung (Language Quality Assessment, LQA) von Phrase-Projekten nach dem **DQF-MQM**-Modell. Gemini bewertet die Segmente eines Projekts mit Termbase- und TM-Kontext, vergibt Fehler mit Kategorie, Schweregrad und Strafpunkten, berechnet einen Score und schreibt die Befunde auf Wunsch als Segment-Kommentare oder als offizielles LQA-Assessment nach Phrase zurück.

---

## 1. Steckbrief

| Eigenschaft | Wert |
|---|---|
| Typ | Web-App, `executeAs: USER_DEPLOYING`, **`access: MYSELF`** – nur der Eigentümer kann sie öffnen |
| Einstieg | `doGet` → `Index.html` (Titel „AutoLQA Hub“) |
| Datenbank | Google Sheet „AutoLQA Hub - Database“, ID in Script Property `DB_SHEET_ID`; fehlt sie, wird das Sheet automatisch angelegt. Link in der App über „Datenbank öffnen“ (`getDatabaseUrl()`) |
| KI | Gemini über Apigee-Proxy; Standardmodell `gemini-2.5-pro` (Setting `primaryModel`) |
| Script Properties | `PHRASE_API_TOKEN`, `GEMINI_API_KEY`, `DB_SHEET_ID` |
| Tests/Deploy | keine; Commits „Sync: Update …“ aus dem Apps-Script-Editor |

> ⚠️ Laut AutoFix-Code ist `gemini-2.5-pro` über den Kärcher-Proxy nicht mehr verfügbar (404). Falls AutoLQA-Läufe mit 404 scheitern, in den Einstellungen `primaryModel` auf `gemini-3.6-flash` setzen.

## 2. Ablauf

```mermaid
flowchart TD
  A[Projekt wählen<br/>Profil, Content-Typ, Sprache, Segmentlimit] --> B[Projekt + Jobs aus Phrase]
  B --> C[RAG-Memory: je 5 bestätigte und<br/>abgelehnte Issues des Profils]
  C --> D[Segmente je Job laden<br/>Seitengröße 200]
  D --> E[Kontext anreichern:<br/>TM-Treffer v3, Termbase-Treffer]
  E --> F[Prompt: Brand Context + MQM-Matrix<br/>+ Severity + Styleguide + Memory]
  F --> G[Gemini in Batches à 30 Segmenten]
  G --> H{Double Pass aktiv, nur 1 Batch<br/>und Score ≥ Schwelle oder 0 Fehler?}
  H -- ja --> I[Strict Review Second Pass]
  H -- nein --> J[Report: Score, bestanden, Issues]
  I --> J
  J --> K[(Reports / Issues / Run History)]
  J --> L[Review in der App:<br/>Issues bestätigen / ablehnen]
  L --> M[Sync nach Phrase:<br/>Segment-Kommentare oder LQA-Assessment]
```

- **Referenzdatei:** Optional lässt sich ein Styleguide/Referenzdokument hochladen; es geht als Datei mit an Gemini. Dazu freie „Styleguide Notes“.
- **Report-Modus:** kombiniert (ein Report) oder je Sprache (`per_language`, ein Report je Zielsprache).
- **Content-Typen** (Brand Context): `universal` immer + `marketing`, `techdoc` oder `ui`. Die Kärcher-Regeln (Umlaut in „Kärcher“, Produktnamen wie „K 5“, „HD 6/13“ unverändert, Termbase ist Ground Truth, bei Confidence < 70 nicht melden) stehen als Standardtexte in `Settings.gs` und sind in der App editierbar.
- **Root Cause:** „Pre-translation“ (Fehler im Quelltext) oder „Production“ (Übersetzungsfehler).
- **Fortschritt:** im Script-Cache unter einer Task-ID, die Oberfläche fragt `getTaskProgress(taskId)` ab.

## 3. Datenbank-Tabs

| Tab | Spalten |
|---|---|
| `Settings` | Key, Value (siehe unten) |
| `Profiles` | ID, Name, JSON Data (komplettes MQM-Profil) |
| `Reports` | ReportID (`REP-<timestamp>[-<lang>]`), Date, ProjectID, ProjectName, Profile, Score, Passed, TotalSegs, TotalWords, Errors, Summary |
| `Issues` | ReportID, IssueID (Segment-ID), Category, Subcategory, Severity, Penalty, Confidence, Status (pending/approved/rejected), Source, Target, Suggestion, Explanation, RootCause |
| `Audit Log` | Timestamp, Action, Details |
| `Run History` | Timestamp, ReportID, Model, Duration_ms, Passes, IssuesFound |
| `LQA Export` | formatierter Export aller Reports und Issues (`exportReportsToSheet`) |

## 4. Einstellungen (Tab `Settings`)

| Key | Standard | Bedeutung |
|---|---|---|
| `primaryModel` | `gemini-2.5-pro` | Gemini-Modell |
| `tempPass1` / `tempPass2` | 0.1 / 0.05 | Temperature erster / zweiter Durchgang |
| `maxTokens` | 32768 | Ausgabe-Limit |
| `doublePassEnabled`, `doublePassThreshold` | true, 100 | strenger zweiter Durchgang („Strict Review“), wenn der Lauf nur einen Batch hatte und Score ≥ Schwelle oder keine Fehler |
| `phraseMaxSegments` | 30 | Standard-Segmentlimit |
| `defaultProjectCount` | 50 | Projekte in der Liste |
| `tmThreshold` | 0.7 | TM-Mindesttreffer |
| `tbLookupLimit`, `tbMinWordLength`, `tbMaxNgram` | 15, 3, 3 | Termbase-Suche |
| `lqaDefaultProfile` | `mqm_core_standard` | Standardprofil |
| `commentPrefix` | `[AutoLQA]` | Präfix für Phrase-Kommentare |
| `roiHourlyRate`, `roiWordsPerHour` | 50, 2500 | ROI-Berechnung in Analytics |
| `brandContextUniversal/Marketing/Techdoc/Ui` | Kärcher-Texte | Brand Context je Content-Typ |
| `uiTheme`, `uiLang`, `uiDefaultView` | light, de, projects | Oberfläche |

Werte, die mit `= + - @ * #` beginnen, werden mit Apostroph gespeichert, damit Sheets sie nicht als Formel liest.

## 5. Standard-MQM-Profil „MQM Core Standard“

| Kategorie | Subkategorien (Gewicht) |
|---|---|
| ACCURACY | Accuracy, Mistranslation, Omission, Improper exact TM match (1.0) |
| FLUENCY | Fluency, Grammar, Spelling (1.0) |
| TERMINOLOGY | Inconsistent with termbase, Terminology (1.5) |
| STYLE | Style, Unidiomatic (1.0) |

Strafpunkte: Neutral 0, Minor 1, Major 5, Critical 10. Bestehensgrenze 99,0 %. Profile sind im Reiter „Profiles“ editierbar, zurücksetzbar.

## 6. Oberfläche

| Reiter | Inhalt |
|---|---|
| Projects | aktive Phrase-Projekte, „Start AutoLQA“ |
| Reports | Reports, LQA-Review (Issues bestätigen/ablehnen, Sammelaktionen), „Sync to Phrase TMS LQA“, Export |
| Analytics | Auswertungen, ROI |
| Profiles | MQM Profile Editor |
| Settings | alle Einstellungen, Brand Context, Datenbank neu anlegen |

## 7. Phrase-Endpunkte

| Aufruf | Zweck |
|---|---|
| `GET v1/projects`, `v1/projects/{uid}`, `/jobs` | Projekte und Jobs |
| `GET v1/projects/{uid}/jobs/{job}/segments` | Segmente |
| `POST v3/projects/{uid}/jobs/{job}/transMemories/search` | TM-Kontext |
| `POST v2/projects/{uid}/jobs/{job}/termBases/searchInTextByJob` | Termbase-Treffer |
| `GET v1/termBases` | Termbanken |
| `POST v1/projects/{uid}/jobs/{job}/segments/{id}/comments` | Befund als Kommentar |
| `v1/lqa/assessments/…`, `v1/projects/{uid}/jobs/{job}/conversations/lqa` | offizielles LQA-Assessment |

## 8. Dateien

| Datei | Inhalt |
|---|---|
| `Code.gs` | Phrase, Gemini, Prompt, Batches, Ablauf, Sync |
| `Database.gs` | Sheet, Reports, Issues, Export, RAG-Memory, Profile |
| `Settings.gs` | Standard-Einstellungen, Brand-Context-Texte, Reparaturfunktionen |
| `PromptBulk.gs` | `fixBrandContextInSheet()` – einmalige Reparatur |
| `Index.html` | Oberfläche |

Hilfsfunktionen im Editor: `recreateDatabase`, `repairSettingsSheet`, `migrateBrandContextSettings`, `forceMaxTokensUpdate`, `resetKaercherPrompts`.
