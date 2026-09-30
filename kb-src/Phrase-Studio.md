# Phrase Studio

Make spoken content global, searchable, and  ready to localize

Quelle: https://support.phrase.com/hc/en-us/categories/21177128067228-Phrase-Studio  
Exportiert: 2026-09-30T11:34:22+00:00 · Sprache: en-us · Artikel: 8

## Inhaltsverzeichnis

- [Phrase Studio](#phrase-studio)
  - [Audio Transcription (Studio)](#audio-transcription-studio)
  - [Translating Subtitles (Studio)](#translating-subtitles-studio)
  - [Dubbing (Studio)](#dubbing-studio)
  - [Project Collaboration and Review (Studio)](#project-collaboration-and-review-studio)
  - [Supported Languages (Studio)](#supported-languages-studio)
  - [Video Localization Hours](#video-localization-hours)
  - [Supported File Formats (Studio)](#supported-file-formats-studio)
  - [Keyboard Shortcuts (Studio)](#keyboard-shortcuts-studio)

---

## Phrase Studio

AI-powered transcripts, subtitles and dubbing for video content

Quelle: https://support.phrase.com/hc/en-us/sections/21177164651804-Phrase-Studio

### Audio Transcription (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/21177186715420-Audio-Transcription-Studio  
> Zuletzt aktualisiert: 2026-09-18T06:21:23Z  
> Labels: 2BTr, Studio

Audio transcription takes audio as input and uses Automated Speech Recognition and Automated Speaker Identification to generate text output.

Monolingual term bases can be created in the Settings page to improve AI transcription accuracy for specialized or difficult terms. To reduce false matches, keep term lists limited to specialized or difficult terms that are unlikely to be confused with common words or numbers, avoid adding short or generic terms, and review transcription output for misapplied terms before finalizing.

Term bases are automatically shared with all users of the same organization in read-only mode.

Phrase Studio consumes [Video Localization Hours](https://support.phrase.com/hc/en-us/articles/22916939527196#UUID-449384e1-953d-4552-19a6-8e154fe305f9 "Video Localization Hours").

###### Use cases

- A 45-minute customer interview recorded as an [MP4](https://en.wikipedia.org/wiki/MP4_file_format) file.

  A text transcript is generating with speaker identification which can be used to create a case study and pull quotes for a website.

To create an audio transcription project, follow these steps:

1. From Phrase Studio, click New Project.

   The Create new project page opens.
2. Either drag a file onto the upload field or click Upload file to locate a file on your system.

   The uploaded file is displayed.
3. Optionally, specify the number of Speakers in the uploaded file.

   - To set the number of speakers manually, open the dropdown and select a value from 1 to 5. If the file includes more than five speakers, use the default Auto-detect option.
4. Provide a name for the project and set the project visibility as required:

   - New projects are public by default. Public projects are visible to all users in the organization who have access to Studio.
   - Deselect Public project to create a private project that is visible only to the project owner. A private project can still be shared with selected users if needed.
5. Manually select the Source Language or enable Auto-detect source language for automatic detection.
6. If required, under Localization Options, enable Translate subtitles and select language(s) for the file to be translated into.

   - The [translation engine](https://support.phrase.com/hc/en-us/articles/25452529474460#UUID-968e216f-eec3-70be-4439-5ee6edd9d1ca "Translating Subtitles (Studio)") is configurable.
   - If Dub into target languages is selected, the file will be transcribed, translated and [dubbed](https://support.phrase.com/hc/en-us/articles/25452519326876#UUID-2e00b0e9-5b89-98fb-879f-03d439588308 "Dubbing (Studio)") immediately without the opportunity to check the translation beforehand.
7. Select a [Subtitle profile](https://support.phrase.com/hc/en-us/articles/25452529474460#UUID-968e216f-eec3-70be-4439-5ee6edd9d1ca "Translating Subtitles (Studio)") to determine subtitle display rules.

   Enable Use different subtitle profiles for specific languages to select a profile for each language.
8. Optionally, enable Apply pronunciation rules to improve text-to-speech accuracy to select existing [pronunciations](https://support.phrase.com/hc/en-us/articles/25452519326876#UUID-2e00b0e9-5b89-98fb-879f-03d439588308 "Dubbing (Studio)") and related pairs for dubbing workflows.
9. If required, configure additional options:

   - Open the Subtitles section to import existing subtitle files in [SRT or VTT format](https://support.phrase.com/hc/en-us/articles/23847234754972#UUID-9e921122-1462-4500-fd7f-d381ea862ded "Supported File Formats (Studio)") for both source and target languages.

     The system will skip automatic audio transcription with speaker identification and align the existing subtitles with the video. Users need to create and assign speakers manually since SRT/VTT files do not include speaker information.
   - Open the Automated translation section to override the account-level settings and select the preferred Translation engine at the project level.

     - If Phrase Language AI is selected, the MT Profile and Translation Memory dropdown menus are displayed.

       - Select one of the available MT profiles and, optionally, a TM.
     - If AI Translation Agent is selected, the Translation Memory dropdown menu is displayed.

       - Select one of the available TMs.
   - Open the Resources section to select an existing term base or add terms that will be used to detect and match similar-sounding words during transcription.
   - Open the AI-generated summaries and insights section to select the desired summaries and insights that will be generated for the uploaded recording, and the relevant AI models.
10. Click Create project.

    The file is uploaded and is displayed on the My Recordings page.

Click on the recording name to open it in the editor and view it in the Transcribe and Translation tabs. Both texts can be edited if required.

Click Download to select the transcription and the translations for download to your system. It is also possible to download audio-only tracks in MP3 format.

#### AI Summaries

Extracts structured and meaningful insights such as summaries, sentiment, quality flags, or safety issues from subtitles using AI models.

Insights created in the Settings page are automatically shared with all users of the same organization in read-only mode.

###### Use cases

- Summarize customer support calls or identify potentially unsafe or low-quality communication. Phrase Studio returns a summary and flags sections for review.

#### Speaker Identification

Detects and labels different speakers in an audio file for clearer transcripts and subtitles.

Automatic speaker identification is not available for projects with imported subtitle files.

###### Use cases

- A podcast with multiple participants is processed and each speaker is automatically tagged (e.g., "Speaker 1", "Speaker 2").

Click Manage Speakers under the Transcribe menu to edit the speaker name or add other speakers.

Use the Combined/Speakers toggle at the bottom of the editor to switch between a single waveform and individual waveforms for each speaker. When multiple speakers are detected, segments can be dragged within a row to reflect overlapping speech, or moved to another row to change the assigned speaker.

---

### Translating Subtitles (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/25452529474460-Translating-Subtitles-Studio  
> Zuletzt aktualisiert: 2026-09-28T06:29:14Z  
> Labels: 2BTr, Studio, edited_at

After a file has been [transcribed](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)"), if it wasn't translated on import, more translations can be added.

The [translation engine](https://support.phrase.com#UUID-968e216f-eec3-70be-4439-5ee6edd9d1ca_UUID-5774b836-3863-cd08-826e-f4d2ff8025f0 "Configure Translation Engines") is configurable. Supported translation engines include:

- Predefined OpenAI translation models
- [Phrase Language AI](https://support.phrase.com/hc/en-us/articles/5709660879516#UUID-b0d64b4f-fa01-f7c3-006a-40e0ee0dedd2) (PLAI)

  This integration leverages MT profiles with relevant [MT glossaries](https://support.phrase.com/hc/en-us/articles/5709675486876#UUID-7e625233-8ae7-ac05-e4b6-a82056604355) already configured in Phrase TMS.

  When selecting PLAI as the translation engine, it is also possible to specify a [translation memory (TM)](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) created in TMS. Studio currently reuses only 100% and 101% TM matches; fuzzy matches are not applied.

  Using PLAI in Studio consumes [machine translation units (MTUs)](https://support.phrase.com/hc/en-us/articles/11530492252444#UUID-3c8ba1b3-290a-5451-ba45-71797af5a755) on capacity-based plans, and credits on credit-based plans.
- [AI Translation Agent](https://support.phrase.com/hc/en-us/articles/20660272640284#UUID-d2f83c62-3868-1bfe-75ae-b32b718706c9) (AITA)

  When selecting AITA as the translation engine, it is also possible to specify a translation memory (TM) created in TMS. The integration leverages the TMs for retrieval-augmented generation (RAG).

  Using AITA in Studio consumes [AI Units (AIUs)](https://support.phrase.com/hc/en-us/articles/14032731809052#UUID-cc9cfa45-5b73-500c-edfc-a3b77c44713f) on capacity-based plans, and credits on credit-based plans.

To add a translation, follow these steps:

1. Next to the file name, select the next part of the workflow from the dropdown. Following Transcribe, select Translate.
2. Click Add Translation.

   The Add Translation window opens.
3. Select required languages from the dropdown list. Multiple languages can be selected.

   The Include previously translated languages option will present current translations with any newly selected ones and re-translate the whole selection.
4. Optionally, click Upload Subtitles to import existing subtitle files in [SRT or VTT format](https://support.phrase.com/hc/en-us/articles/23847234754972#UUID-9e921122-1462-4500-fd7f-d381ea862ded "Supported File Formats (Studio)") for the selected languages.

   ### Note

   Uploaded subtitles overwrite any existing translations for the selected languages.
5. If managing the translation in Phrase TMS is required, enable Send to TMS for translation and select a TMS [project template](https://support.phrase.com/hc/en-us/articles/5709647439772#UUID-94346683-ae2a-16b5-7e16-94a554612687).

   - An existing TMS project template that is accessible to the account is required.
6. Select a [Subtitle profile](https://support.phrase.com#UUID-968e216f-eec3-70be-4439-5ee6edd9d1ca_UUID-e9cb3e34-e358-31a2-8f6c-4a3816fbd05b "Subtitle Profiles") to determine subtitle display rules.

   Enable Use different subtitle profiles for specific languages to select a profile for each language.
7. Click Start Translation.

   The window closes. In the Translate tab, open the language dropdown to see the translation status for each language.

   - If Send to TMS for translation has been enabled:

     - A new TMS [project](https://support.phrase.com/hc/en-us/articles/5709748435484#UUID-30234837-9796-c6f2-1a21-a623b67ac6cc) with one [job](https://support.phrase.com/hc/en-us/articles/5709686763420#UUID-f360116d-841e-01a6-c030-b509327fa289) per each target language is created.
     - Provider assignment defined in a TMS project template is not applied automatically to jobs created through Send to TMS for translation. To assign the providers defined in the template, use Tools > Assign providers from template in Phrase TMS, or call the corresponding Phrase TMS API endpoint.
     - In the Translate tab, open the language dropdown to see the TMS [status](https://support.phrase.com/hc/en-us/articles/10825557816092#UUID-31d37245-0c81-4869-f9f6-31b5cd66d2af) (NEW, ACCEPTED, COMPLETED) for each language's joband an Open in TMS action to access the TMS project and perform translations.
     - When the latest [workflow](https://support.phrase.com/hc/en-us/articles/5709717879324#UUID-3d4fec12-4a9f-ace5-cd20-a1575786a6b7) TMS job status is COMPLETED, translated subtitles are automatically parsed and displayed in Studio for that language.

       ### Tip

       If imported subtitles display garbled characters, ensure the TMS export uses UTF-8 encoding.
     - Use Sync to TMS to sync source and translation changes made in Studio back to TMS to override the latest version.

       Edits made in Studio after a TMS job has already been created, such as merging segments or changing capitalization, are not automatically reflected in the TMS job. Use Sync to TMS to push these changes. The Sync to TMS option is only available once the TMS translation for that language has reached the COMPLETED status; before that point, the option is not available.

Translated versions can be selected for viewing beside the original in the editor and edited if required.

Click Download to download translations as .docx files or subtitle formats.

#### Configure Translation Engines

Translation engines can be configured at the account level or overridden at the project level:

- Account-level settings define the default translation engine for all projects.
- Project-level settings, when configured, override account defaults for the selected project.

###### Account-Level Configuration

To configure the translation engine, follow these steps:

1. Select Settings from the left-hand navigation menu.

   The Settings page is displayed.
2. In the Preferences tab, select the Translation engine from the Automated translation section.

   - If Phrase Language AI is selected, the MT Profile and Translation Memory dropdown menus are displayed.

     - Select one of the available MT profiles and, optionally, a TM.
   - If AI Translation Agent is selected, the Translation Memory dropdown menu is displayed.

     - Select one of the available TMs.
3. Click Save.

###### Project-Level Configuration

When [creating a new project](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)"), the translation engine can be configured during setup by expanding the Automated translation section. The selected engine is saved as a project-level preference.

Project owners can update the translation engine for an existing project in the editor. To update the translation engine for a project, follow these steps:

1. In the project header, click the three dots ![More Menu](https://support.phrase.com/hc/article_attachments/30682456361372) menu.

   The project options menu is displayed.
2. Select Settings.

   The Settings window is displayed.
3. Select a different Translation engine, if required.

   - If Phrase Language AI is selected, the MT Profile and Translation Memory dropdown menus are displayed.

     - Select one of the available MT profiles and, optionally, a TM.
   - If AI Translation Agent is selected, the Translation Memory dropdown menu is displayed.

     - Select one of the available TMs.
4. Click Save.

#### Subtitle Profiles

Subtitle profiles control how subtitles are segmented and styled in video projects. Users can create custom profiles in the Subtitle Profiles tab of the Settings page and assign them globally or to each project language when [creating a new project](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)").

For existing projects, subtitle profiles can also be selected when adding a new translation in the Translate tab of the editor.

Subtitle profiles are automatically shared with all users of the same organization in read-only mode.

To create a new subtitle profile, follow these steps:

1. Click Create New Subtitle Profile.

   The Create Subtitle Profile window is displayed.
2. Enter a name and an optional description.
3. Configure segmentation rules related to duration, pacing, and character constraints.

   These settings control how subtitle segments are constructed and ensure readability, timing accuracy, and a consistent viewer experience.
4. Choose whether to make the profile Active and/or Display Speaker Names in the subtitles preview.
5. Use the options in the styling section at the bottom right to configure how subtitles appear in the final video.

   Any changes are reflected in the video preview panel to confirm the formatting before applying it to a project.
6. Click Save.

   The custom subtitle profile is added to the list.

Existing subtitle profiles can be edited and deleted by selecting Edit in the Subtitle Profiles tab.

The subtitle styling from the active profile for each language is also rendered into the downloaded video.

###### Instant Quality Assurance (QA)

Instant QA validates subtitles against the rules defined in the active subtitle profile. When subtitles are generated or edited, Studio runs an automatic check and flags any segments that fall outside the configured settings.

Subtitle blocks with detected issues display a red exclamation mark indicator in the editor. Hover over the indicator and click View details to see issue details.

The Segment issues counter shows how many segments currently contain QA issues. Click Highlight issues next to the counter to quickly spot segments with issues in the editor, and navigate between them using the arrow controls. The counter updates in real time as issues are introduced or resolved.

---

### Dubbing (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/25452519326876-Dubbing-Studio  
> Zuletzt aktualisiert: 2026-06-26T06:24:58Z  
> Labels: 2BTr, Studio

Dubbing replaces the original audio in a file with a new version in a different language, while preserving the voice characteristics and emotional tone of the original speakers.

Correct [speaker assignment](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)") is required for dubbing workflows. If using imported subtitle files to skip automatic audio transcription, ensure all speakers are assigned before proceeding to dubbing.

###### Use cases

- A media company wants to distribute an originally English-language documentary in Spain and Japan. The platform's AI identifies each speaker, transcribes and translates the dialogue and then generates new audio tracks in Spanish and Japanese. The generated voices retain the qualities of the original speakers, creating an authentic viewing experience for the new audiences.

To create dubbing for a file, follow these steps:

1. From the editor, click the arrow under the Dubbing tab and select Add Dubbing.

   The Add Dubbing window opens.
2. Select the required translated language(s) from the dropdown list.

   ### Note

   If a regional language variant (e.g., French (Canada), or Portuguese (Brazil)) is selected, the system automatically falls back to the corresponding base language for dubbing.

   The regional language selection is still preserved in the project and metadata.
3. Optionally, enable Apply pronunciation rules to improve text-to-speech accuracy to select existing [pronunciations](https://support.phrase.com#UUID-2e00b0e9-5b89-98fb-879f-03d439588308 "Dubbing (Studio)") and related pairs for dubbing workflows.
4. Click Add Dubbing.

   The windows closes and the Dubbing tab indicates when the dubbing is finished.

Click Dub Changes to update the dubbing with any changes made to the text.

Click Manage Voices to select a different voice for the dubbing. For each language, up to 7 recommended voices are automatically suggested based on gender and age matching.

#### Audio and dubbing controls

Audio controls help make dubbing more expressive and accurate by tagging key vocal nuances that add paralinguistic information. Right-click on a segment to Add Audio Controls in the desired position by selecting one or more of the available options.

##### Note

Audio controls may not work with all languages or voice models. Testing with the selected voice is recommended to confirm compatibility.

Audio adjustments or redubs after testing do not consume [additional minutes](https://support.phrase.com/hc/en-us/articles/22916939527196#UUID-449384e1-953d-4552-19a6-8e154fe305f9 "Video Localization Hours").

When a project includes multiple speakers, dubbing settings can be adjusted for each speaker track and for individual segments in the Dubbing tab.

- Speaker track controls

  - Volume

    Click the volume icon ![volume.jpeg](https://support.phrase.com/hc/article_attachments/30682482549788) next to the desired speaker name in the waveform to adjust the volume slider. The adjustment applies to all segments spoken by that speaker.
- Segment controls

  - Volume
  - Stability

    Controls how consistent and predictable the generated voice sounds.
  - Similarity

    Controls how closely the generated voice matches the selected voice profile.

  Select a segment in the timeline to open the Segment Settings panel and adjust dubbing settings as required. Click Save Now at the top right of the Dubbing tab to save the changes.

  Re-dubbing is required after adjusting Stability or Similarity. Click Dub changes to apply the updated settings.

###### Adjust dubbing speed

By default, dubbing is generated at 1× speed, meaning the system determines the most natural speaking pace based on the amount of text in the segment.

The current speed is displayed as a label on each speech bubble in the timeline.

There are two methods to adjust dubbing speed, if required:

1. Extend or shorten the speech bubbles on the waveform:

   **Example**

   If dubbed audio extends beyond the intended scene at 1× speed, drag the end time of the speech bubble. Dubbing will speed up slightly to fit within the segment and the speed label will be updated accordingly.
2. Edit the text and re-dub:

   **Example**

   If audio significantly overflows at 1× speed, the segment may contain too much text. Rewrite the text and dub changes.

#### Pronunciations

Pronunciations control how specific words or phrases are spoken in dubbed audio. They ensure consistent pronunciation of brand names, technical terms, acronyms, and foreign words.

It is possible to define custom pronunciation pairs and apply them to dubbing workflows during [project creation](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)").

For existing projects, pronunciations can also be selected when adding a new dubbing language in the Dubbing tab of the editor.

Pronunciations are automatically shared with all users of the same organization in read-only mode.

**Prerequisites**

- The project's [target language](https://support.phrase.com/hc/en-us/articles/21484803751836#UUID-eec28115-2fba-5d94-fe6c-0ae812865c30 "Supported Languages (Studio)") supports dubbing.
- A dubbing language has been added to the project.

To create a pronunciation, follow these steps:

1. In the Settings page, select the Pronunciations tab.
2. Click Create new pronunciation.

   The Create Pronunciation window is displayed.
3. Enter a Pronunciation Name and optional Description.
4. Select Active to make the pronunciation available for project selection.
5. Click Save.

   The pronunciation is listed in the Pronunciations tab.

Each pronunciation can include multiple pairs for a single language. To add a pronunciation pair, follow these steps:

1. Select an existing pronunciation and click Create New Pair.
2. Provide the original Source word or phrase.
3. Define the desired pronunciation in the Target field.

   Use phonetic spelling, syllable breaks, or approximate sounds.
4. Select the relevant language.
5. Optionally, click Preview to listen and adjust as required.
6. Click Save.

   The new pair is added to the selected pronunciation.

Existing pronunciations and related pairs can be updated or deleted by selecting Edit next to a pronunciation or a pair.

Re-run dubbing after updating pronunciation pairs; previously rendered audio will not change automatically.

**Pronunciation Examples**

- Brand names

  - Apple: ap-pul
  - Microsoft: mai-kroh-soft
- Technical terms

  - GIF: jif
  - SQL: ess-cue-el
- Foreign words

  - Croissant: krwa-san
  - Sao Paulo: sow-pow-loo

#### Voice Cloning

Voice cloning generates a synthetic voice based on recordings of a real speaker. The cloned voice can then be used in AI dubbing, allowing translated audio to preserve the tone and vocal characteristics of the original speaker.

The cloning process uses selected speech ranges from uploaded audio or video samples to train the voice model. After samples are processed, a preview can be generated before the voice is saved.

Voice clones are created and managed in the My voices tab of the Settings page. Once created, the voice becomes available for use in dubbing workflows.

**Voice sample requirements**

- Total selected range duration must be between 15 and 180 seconds
- Maximum uploaded file duration: 5 minutes
- Maximum sample files: 3
- Maximum file size: 30 MB per file
- Maximum sample ranges: 50
- If voice samples contain multiple speakers, ranges must be used to isolate samples from a single speaker.

To create a voice clone, follow these steps:

1. In the My voices tab of the Settings page, click Create new voice.

   The Create your voice section is displayed.
2. Upload samples to generate the voice clone.

   Uploaded media appears in a waveform player where ranges can be marked.
3. Use the timeline to define ranges containing the speaker’s voice, then click Done.

   Selected ranges are confirmed. Additional files can be uploaded and processed the same way by clicking Add ranges.

   ### Note

   Only the selected ranges are used to generate the voice clone.
4. Select the consent checkbox and Confirm.
5. Click Next.

   The Voice details step is displayed.
6. Enter a voice Name. Optionally, provide voice Description, Gender and Labels to categorize it.
7. Click Next.

   The Preview step is displayed. The first preview is generated automatically.
8. Select a Preview language and provide Preview text.
9. Click Preview voice.

   The audio sample is generated. This typically takes several seconds.
10. Click Save.

    The new voice is added to the My voices list.

Existing voice clones can be previewed or removed from the My voices tab.

---

### Project Collaboration and Review (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/25452549792796-Project-Collaboration-and-Review-Studio  
> Zuletzt aktualisiert: 2026-06-08T11:31:27Z  
> Labels: 2BTr, Studio

The project owner can share private projects with other users from the same organization who have previously accessed the Studio application.

Users with access can view shared and public projects by enabling Team projects in the My Recordings page.

Multiple users can collaborate simultaneously on the same project. Each active user is displayed with an icon in the editor, and any changes made by one user are instantly visible to others. Clicking a collaborator’s icon takes directly to the segment they are currently editing.

To share a private project, follow these steps:

1. In the project page, click on the three dots ![More Menu](https://support.phrase.com/hc/article_attachments/30682488065948) icon and select Share.

   The Share Project window is displayed.
2. Search for users without access by name or email, or scroll the list to find them.
3. Click Share next to the desired user(s).

   Selected user(s) are added to the Users with Access list.
4. Click Save Changes to confirm.

   The project is shared with the selected user(s).

If required, click Revoke in the Share Project window to remove access for a specific user.

#### Segment Reviews

[Transcription](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)"), [translation](https://support.phrase.com/hc/en-us/articles/25452529474460#UUID-968e216f-eec3-70be-4439-5ee6edd9d1ca "Translating Subtitles (Studio)"), and [dubbing](https://support.phrase.com/hc/en-us/articles/25452519326876#UUID-2e00b0e9-5b89-98fb-879f-03d439588308 "Dubbing (Studio)") segments are not reviewed by default. Unreviewed segments display a gray empty circle indicator ![grey_circle.jpeg](https://support.phrase.com/hc/article_attachments/30682488083228) in the editor.

Users with access to a project can mark individual subtitle segments as reviewed to track review status across languages, identify which content has been checked by a human reviewer, and understand overall project completion.

For each tab and target language selected in the editor, the review progress percentage reflects how many segments have been marked as reviewed.

The project's review progress percentage(s) shown in the My recordings page represents the average review progress across all languages. On hover, a breakdown by language is displayed.

To mark a segment as reviewed, follow these steps:

1. In the editor, hover over a segment in the desired tab and taregt language to display the action toolbar.
2. Select Mark as reviewed ![green_checkmark.jpeg](https://support.phrase.com/hc/article_attachments/30682472648860).

   The segment displays a green reviewed indicator ![green_checkmark.jpeg](https://support.phrase.com/hc/article_attachments/30682472648860) and the review progress percentage is updated.
3. Click Save now to apply the changes.

If needed, hover over the green reviewed indicator and click View details to see who reviewed the segment and when.

When a reviewed segment is updated automatically through re-transcription, re-translation, or a user change (e.g., editing the text), its status changes to Not yet reviewed. When a user manually marks a segment as unreviewed, the status changes to Unreviewed by [username], along with a timestamp.

---

### Supported Languages (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/21484803751836-Supported-Languages-Studio  
> Zuletzt aktualisiert: 2026-07-15T06:21:50Z  
> Labels: 2BTr, Studio

Regional variants are available for translation languages, although they may fall back to the corresponding base language for dubbing according to the dubbing providers text to speech voice library.

| Language Name | Language Code | Automatic Transcription | Automated Translation Engine Support | Automated Dubbing Engine Support (Target Language) | AI Generated Summaries & Insights | AI Chat |
| --- | --- | --- | --- | --- | --- | --- |
| Afrikaans | af, af-za | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Albanian | sq | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Amharic | am, am-et | Yes | Phrase Language AI, GPT-5 Mini | Azure TTS | Yes | Yes |
| Arabic | ar, ar-sa, ar-ae | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Armenian | hy | Yes | Phrase Language AI | Azure TTS, ElevenLabs v3 |  |  |
| Assamese | as | Yes |  | Azure TTS, ElevenLabs v3 |  |  |
| Azerbaijani | az | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Bashkir | ba | Yes |  |  |  |  |
| Basque | eu | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Belarusian | be | Yes |  | ElevenLabs v3 |  |  |
| Bengali | bn | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Bosnian | bs | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Breton | br | Yes |  |  |  |  |
| Bulgarian | bg | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Burmese | my | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Cantonese | yue | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Catalan | ca | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Cebuano | ceb | Yes | GPT-5 Mini, GPT-4o Mini | ElevenLabs v3 | Yes | Yes |
| Chichewa | ny | Yes | GPT-5 Mini, GPT-4o Mini | ElevenLabs v3 | Yes | Yes |
| Chinese | zh, zh-hk, zh-cn, zh-tw | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Croatian | hr | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Czech | cs | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Danish | da | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Dutch | nl | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| English | en, en-au, en-ca, en-gb, en-in, en-us, en-za | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Estonian | et | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Faroese | fo | Yes |  |  |  |  |
| Finnish | fi | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| French | fr, fr-ca | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Galician | gl | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Georgian | ka | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| German | de | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Greek | el | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Gujarati | gu | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Haitian Creole | ht | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Hausa | ha | Yes | GPT-5 Mini, GPT-4o Mini | ElevenLabs v3 | Yes | Yes |
| Hawaiian | haw | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Hebrew | he | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Hindi | hi | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Hungarian | hu | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Icelandic | is | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Igbo | ig | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Indonesian | id | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Irish | ga | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Italian | it | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Japanese | ja | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Javanese | jw | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Kannada | kn | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Kazakh | kk | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Khmer | km | Yes | Phrase Language AI | Azure TTS |  |  |
| Korean | ko | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Kyrgyz | ky | Yes |  | ElevenLabs v3 |  |  |
| Lao | lo | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Latin | la | Yes |  |  |  |  |
| Latvian | lv | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Lingala | ln | Yes |  | ElevenLabs v3 |  |  |
| Lithuanian | lt | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Luxembourgish | lb | Yes | GPT-5 Mini, GPT-4o Mini | ElevenLabs v3 | Yes | Yes |
| Macedonian | mk | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Malagasy | mg | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Malay | ms | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Malayalam | ml | Yes |  | Azure TTS, ElevenLabs v3 |  |  |
| Maltese | mt | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Maori | mi | Yes | Phrase Language AI |  |  |  |
| Marathi | mr | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Mongolian | mn | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Nepali | ne | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Norwegian | no | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Occitan | oc | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Pashto | ps | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Persian | fa | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Polish | pl | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Portuguese | pt, pt-br | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Punjabi | pa | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Romanian | ro | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Russian | ru | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Sanskrit | sa | Yes |  |  |  |  |
| Serbian | sr | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Shona | sn | Yes |  |  |  |  |
| Sindhi | sd | Yes | GPT-5 Mini, GPT-4o Mini | ElevenLabs v3 | Yes | Yes |
| Sinhala | si | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Slovak | sk | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Slovenian | sl | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Somali | so | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Spanish | es, es-ar, es-es, es-mx, es-419 | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Sundanese | su | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Swahili | sw | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Swedish | sv | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Tagalog | tl | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Filipino | fil | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Tajik | tg | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Tamil | ta | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Tatar | tt | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Telugu | te | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Thai | th | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Tibetan | bo | Yes | Phrase Language AI |  |  |  |
| Turkish | tr | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Turkmen | tk | Yes |  |  |  |  |
| Ukrainian | uk | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3, ElevenLabs v2 | Yes | Yes |
| Urdu | ur | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Uzbek | uz | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |
| Vietnamese | vi | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Welsh | cy | Yes | GPT-5 Mini, GPT-4o Mini | Azure TTS, ElevenLabs v3 | Yes | Yes |
| Yiddish | yi | Yes | GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Yoruba | yo | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini |  | Yes | Yes |
| Zulu | zu | Yes | Phrase Language AI, GPT-5 Mini, GPT-4o Mini | Azure TTS | Yes | Yes |

---

### Video Localization Hours

> Quelle: https://support.phrase.com/hc/en-us/articles/22916939527196-Video-Localization-Hours  
> Zuletzt aktualisiert: 2025-10-13T10:06:33Z  
> Labels: 2BTr, Studio

Video localization hours are calculated by minutes of the source video/audio multiplied by number of languages:

Video localization hours = Minutes of source video/audio × number of languages

Content length is always rounded up to the next full minute. For example, a video lasting 1:41 minutes (101 seconds) is rounded up to 2 minutes.

- The source language counts as one language.
- Hours are deducted the same way regardless of whether subtitling, dubbing, or both are used.
- Consumption is visible in the Subscription overview tab of the Phrase Platform dashboard.

Every [pricing plan](https://phrase.com/pricing/), except for Freelancer and legacy plans, includes 1 hour of video localization per year (prorated) as part of the subscription. Included hours are added to any Phrase Studio add-on purchase and are shared across all users in the organization.

##### Note

The Phrase Studio Enterprise add-on cannot be purchased via self-service. Please contact the assigned account manager for more information.

After purchasing a Studio add-on, more capacity can be [added in-product](https://support.phrase.com/hc/en-us/articles/13872357395228#UUID-77729fa2-a37d-6ee7-c3a0-cba548b0384d) when needed.

---

### Supported File Formats (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/23847234754972-Supported-File-Formats-Studio  
> Zuletzt aktualisiert: 2026-07-22T06:20:27Z  
> Labels: 2BTr, Studio

##### Video/Audio formats

- .MP3
- .WAV
- .M4A
- .MP4
- .MOV

##### Subtitle formats

- .VTT

  The following cue settings are supported on [import](https://support.phrase.com/hc/en-us/articles/21177186715420#UUID-3e590005-a59e-4fc0-e197-88d85e8921e6 "Audio Transcription (Studio)"):

  - `region:<id>` (if defined in the file)
  - `vertical:lr|rl`
  - `line:<number>` or `line:<percent>` (0–100), optional `start|center|end`
  - `position:<percent>` (0–100), optional `line-left|line-right|center|auto`
  - `size:<percent>` (0–100)
  - `align:start|center|end|left|right`

  `align:middle` is not supported. Replace it with `align:center` to avoid import failure.
- .SRT

##### Media Upload Limits

- **Maximum file size:** 20 GB
- **Maximum duration:** 180 minutes (3 hours) per file
- **Maximum files per upload:** 50

---

### Keyboard Shortcuts (Studio)

> Quelle: https://support.phrase.com/hc/en-us/articles/24953031838748-Keyboard-Shortcuts-Studio  
> Zuletzt aktualisiert: 2026-06-08T11:31:30Z  
> Labels: 2BTr, Studio

Phrase Studio includes default keyboard shortcuts for common playback and subtitle-editing actions. All shortcuts can be customized from the Settings page to suit individual workflows.

| Action | Shortcut |
| --- | --- |
| **Playback controls** | |
| Play/Pause video | **Space** |
| Increase playback speed | **Shift+ArrowUp** |
| Decrease playback speed | **Shift+ArrowDown** |
| Jump 1 second backward | **ArrowLeft** |
| Jump 1 second forward | **ArrowRight** |
| Show/hide subtitles | **C** |
| **Segment editing** | |
| Add new segment | **Cmd/Ctrl+Alt+A** |
| Delete current segment | **Cmd/Ctrl+Alt+C** |
| Split segment at cursor | **Cmd/Ctrl+Alt+S** |
| Merge with previous segment | **Cmd/Ctrl+Alt+P** |
| Merge with next segment | **Cmd/Ctrl+Alt+N** |
| Toggle segment review status | **Cmd/Ctrl+Alt+R** |
| Save changes | **Cmd/Ctrl+S** |
| Open Find & Replace | **Cmd/Ctrl+F** |

#### Customize Shortcuts

Some key combinations may be reserved by the operating system or browser and cannot be used to create custom shortcuts.

Shortcut configurations are stored per user account and are not shared across an organization.

To customize a shortcut, follow these steps:

1. From the Settings menu, select the Keyboard Shortcuts tab.

   The Keyboard Shortcuts are displayed.
2. Select the action to adjust and press the desired key combination.

   The new shortcut is saved automatically.
3. If needed, select Reset to Default ![reset.jpeg](https://support.phrase.com/hc/article_attachments/30682519343644) to restore the original shortcut.

Selecting Reset all to defaults at the bottom of the tab restores all shortcuts to their default values.

---
