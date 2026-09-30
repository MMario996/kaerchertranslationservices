# Phrase Portal

Content-aware, TMS-backed, secure AI translation for documents

Quelle: https://support.phrase.com/hc/en-us/categories/29979328212380-Phrase-Portal  
Exportiert: 2026-09-30T11:34:22+00:00 · Sprache: en-us · Artikel: 1

## Inhaltsverzeichnis

- [Phrase Portal](#phrase-portal)
  - [Phrase Portal](#phrase-portal)

---

## Phrase Portal

Quelle: https://support.phrase.com/hc/en-us/sections/29979392748188-Phrase-Portal

### Phrase Portal

> Quelle: https://support.phrase.com/hc/en-us/articles/12949538303516-Phrase-Portal  
> Zuletzt aktualisiert: 2026-09-02T08:22:40Z  
> Labels: 2BTr, cadence-dec24

Phrase Portal serves as a customizable MT interface accessible to users across varying levels of localization proficiency to translate documents or texts in a secure organization environment and if configured, send translations for review.

In line with our internal [data storage](https://support.phrase.com/hc/en-us/articles/17019781874076#UUID-99ae6922-df28-38ae-ea89-7f7fac88a538) policy, any customer-input text (e.g. project names, file names, domains) from permanently deleted content does not appear in Phrase Analytics. Permanently deleted content is replaced with Deleted. All numerical values, dates, timestamps, boolean data types from permanently deleted content remain available. This ensures that historical KPIs, trends, and forecasting aggregations remain consistent over time.

Phrase Portal is powered by [Phrase Language AI](https://support.phrase.com/hc/en-us/articles/5709660879516#UUID-b0d64b4f-fa01-f7c3-006a-40e0ee0dedd2), incorporating a range of native MT engines. By leveraging the MT Autosetect feature, it automatically recommends the best possible engine for any given translation.

The quality of MT translations is automatically evaluated by [Phrase QPS](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444) for file translations. If enabled, QPS scoring will be displayed in the translation interface of the portal.

The portal uses organization default Phrase TMS file import settings for the given [file format](https://support.phrase.com/hc/en-us/articles/5709621471516#UUID-f8f148d5-8914-1eb9-f214-b029d41dbe85). As an example, if the general setting for [spreadsheet](https://support.phrase.com/hc/en-us/articles/5709604373532#UUID-a68697a1-3ac9-5b8d-6497-961d901e4c2e) files specifies that hidden content is imported, it will be imported in the portal as well.

#### Portal Configuration

A Portal administrator can create and configure portals tailored to specific departments or projects, by leveraging available resources:

- [MT glossaries](https://support.phrase.com/hc/en-us/articles/5709675486876#UUID-7e625233-8ae7-ac05-e4b6-a82056604355) attached to relevant MT profiles
- MT engine models trained with [Phrase Custom AI](https://support.phrase.com/hc/en-us/articles/7683093364508#UUID-7e94a40d-cd95-9388-1d29-cb05cb65a32f) and configured in [Phrase NextMT](https://support.phrase.com/hc/en-us/articles/6638250705436#UUID-19cbe6e6-24a4-d991-ec7a-0241f4611a4f) can be attached to different portals
- [Translation memories](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75)

  Optionally select TMs for pre-translation. 100 and 101% matches will be applied to the translation and not be translated using MT. Portal pre-translation is not affected by TMS pre-translation settings.
- [Term bases](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503)

  Optionally select TBs for pre-translation when AI Translation Agent is selected as the translation resource.
- [Content groups](https://support.phrase.com/hc/en-us/articles/28818060694812#UUID-7cdd8089-2074-3361-8c9e-cc708632fc05)

  Optionally, select a content group to enhance translation with [rules](https://support.phrase.com/hc/en-us/articles/28818120405788#UUID-fb255362-e30b-7a8f-14ba-9a6a41c9131c) from a style guide.
- Languages and locales that Portal users can select when translating content.

A default portal with predefined settings is already available in the Portals dashboard when accessing Phrase Portal.

###### Create a Portal

It is possible to create a maximum of 21 portals per organization.

To create a new portal, follow these steps:

1. Select Create new portal.

   The Settings page is displayed.
2. In the General section, provide a name and optional description for the new portal.
3. In the Translation method section, select the portal's MT/AI service:

   - [AI Translation Agent](https://support.phrase.com/hc/en-us/articles/29950915921820#UUID-d2f83c62-3868-1bfe-75ae-b32b718706c9)

     Choose the AI Translation Agent to combine MT and post-editing by leveraging generative AI.
   - MT autoselect

     Language AI native engines are available in the portal with MT autoselect feature.
   - MT profile

     Choose one of the available MT profiles from the dropdown list to leverage relevant MT engines and glossaries.

   Optionally, click Add override to use a different MT/AI solution for specific target languages, overriding the portal's default configuration.
4. In the Resources section, select which additional resources should be used for translation:

   - [Translation memories](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) (optional)

     Select up to ten TMs to [pre-translate](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) source content using relevant TM matches before applying machine translation.

     - TM matches will not be overridden by MT.
     - Only 100% and higher TM matches are used for pre-translation.
     - The organization's default pre-translation settings are not applied.
   - [Term bases](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503) (optional)

     Select up to ten term bases to apply terminology during pre-translation. Only available when the AI translation agent is selected as the translation resource.
   - [Content groups](https://support.phrase.com/hc/en-us/articles/28818060694812#UUID-7cdd8089-2074-3361-8c9e-cc708632fc05)

     Select a content group to enhance the translation. Only available when the AI translation agent is selected as the translation resource.
5. Configure language support in the Languages section:

   - By default, All languages supported by Phrase Language AI are available for a new portal.
   - Choose Specific languages to define a set of locales that Portal users can select [when translating content](https://support.phrase.com#UUID-1dfcaabe-eed0-60fb-5495-beba13b3d864_UUID-f5375a68-11ba-1fd8-d0c2-328a23e2bfb6 "Portal Usage"):

     1. Click Select languages to display a dropdown list of all supported languages and locales.
     2. Select the desired languages.

        If MT glossaries or TMs are assigned to the portal:

        - In the Resource section, select languages from any MT glossaries ![Glossaries](https://support.phrase.com/hc/article_attachments/30006134964508) or TMs ![tm_icon_portal.jpeg](https://support.phrase.com/hc/article_attachments/30006135063068) assigned to the portal. Hover over the icon(s) next to a language to see the associated TMs or MT glossaries.
        - Click Select all resource languages to automatically choose all languages linked to the portal's TMs or MT glossaries.
        - In the Other languages section, select any other languages in addition to resource-linked ones.
   - Optionally, enable Default languages to choose which languages are pre-selected when users open this portal. Select source and target languages from the dropdown.
6. In the Access section, select one of the options to configure access permissions to the portal:

   - Specific users

     The portal is accessible to admins and users added to the portal via the [share function](https://support.phrase.com#UUID-1dfcaabe-eed0-60fb-5495-beba13b3d864_bridgehead-idm234400263116 "Share a Portal").
   - Open

     The portal is accessible to all Portal users and admins of the organization.
   - Admins only

     The portal is accessible only to admin users.
7. Optionally, set limits in the Limits section:

   - MTU consumption limits

     1. Click Add limit  to set a usage limit for [machine translation units (MTUs)](https://support.phrase.com/hc/en-us/articles/11530492252444#UUID-3c8ba1b3-290a-5451-ba45-71797af5a755) in the portal:
     2. Select the desired option from the dropdown menu:

        - Monthly: A recurring limit that resets at the beginning of each month.
        - Fixed: A total limit that the portal can consume over time.
     3. Use the slider or input field to define the maximum MTUs allowed for the portal.

        - The slider displays the total [available MTUs](https://support.phrase.com/hc/en-us/articles/13872357395228#UUID-77729fa2-a37d-6ee7-c3a0-cba548b0384d) for the organization.
        - If editing an existing limit, the MTUs consumed so far are also displayed to ensure the new limit exceeds the current usage.

        ### Important

        If a monthly limit is set lower than the MTUs already consumed in the current month, all portal activity will be blocked until the limit resets at the start of the next month.

        MTU limits are enforced after a translation job is completed. This means if a single file or text input exceeds the defined limit, it will still be processed and the full MTU amount will be counted. To avoid overages, monitor usage regularly or split large files.
     4. Click Save to apply the limit.

        - When MTU usage reaches 90% and 100% of the limit, portal admins and users will see a warning in the Portals page and on the specific portal's page.
        - When the portal reaches 100% of its MTU limit, all translation activity will be frozen. To resume translation, edit or delete the limit in the MTU consumption limits section.
   - File size limit

     Set the maximum file size allowed for files uploaded to this portal for translation. The maximum file size is 1,024 MB.

     A lower limit helps prevent large files from quickly consuming your organization's MTUs.
8. In the Quality section:

   - Enable the option QPS for file translations to display QPS scoring of document translations.

     The option can be toggled on or off as required.
   - Enable users to submit translations for review

     - Select which TMS project templates should be used when Portal creates projects for human review. At least one project template must be selected.

       - If a single template is selected:

         - If one project template is selected:

           - If the template has no source/target languages configured, all language pairs are allowed
           - If the template does have languages configured, only those language pairs are allowed
         - For unsupported language pairs, the Send for review button will be disabled for that translation, and users will see an explanation in the user interface.
       - If multiple templates are selected:

         - If several templates are selected, the portal will pick a template that matches the language pairs.
         - If no selected template supports the language pair, the Send for review button is disabled for that translation, with a message explaining that no suitable template was found.

       ### Note

       If a TMS project template that is already selected in the portal is deleted:

       - The deleted template will no longer appear in the TMS project templates list.
       - The portal will ignore that template when creating projects.
       - If at least one other valid template is still selected, the feature will keep working for language pairs covered by the remaining templates.
       - If all selected templates are deleted, Send for review will no longer be available to Portal users and the Quality section will show that a new template must be selected before the feature can be used again.

       Review the Portal configuration any time project templates are removed or renamed in TMS.

       If the Phrase TMS account is still using the legacy Project settings view, the View project templates link in the portal will lead to the Project templates list in Phrase TMS rather than directly to the template creation screen.
9. Click Save.

   The new portal is added to the Portals dashboard.

Portal administrators can edit existing portal settings by clicking on the Settings icon of each portal. Administrator users can also delete a portal by selecting Delete portal from the 3-dots menu at the top of the portal page.

###### Share a Portal

To share a portal only with specific Portal users, follow these steps:

1. In the Portals dashboard, click on the Share icon of a portal with Specific users access permission.

   The sharing window is displayed.
2. Select one or multiple Portal users by using the search box at the top of the window.

   Optionally, use the Users with access section to display a list of users that already have access to the portal.
3. Click Add.

   The portal is shared with the specified users and is displayed in their Portals dashboard.

#### Portal Usage

Portal Administrators can directly access the translation interface of existing portals. If shared by the Portal administrator, Portal users can also access existing portals.

To machine translate documents or text in Phrase Portal, follow these steps:

1. In the Portals dashboard, click on the desired portal.

   The portal's translation interface is displayed.
2. Provide the source content for translation.

   - Enter the text to translate (type or copy/paste). Character limit for text translations is 5,000 characters.
   - Upload a document from local folders in a [supported file format](https://support.phrase.com#UUID-1dfcaabe-eed0-60fb-5495-beba13b3d864_UUID-b4f0b6b3-c99f-a6c0-3189-e18707b4461f "Portal Supported File Formats"). File size limit for file upload is 1 GB.

     For PDF files, click the gear icon ![gear_portal.jpeg](https://support.phrase.com/hc/article_attachments/30006135160220) to select the layout of the translated output in the Layout options window:

     - Adjust layout (Default)

       Recommended for text-heavy PDFs. Spacing and layout are adjusted to fit the new text length, ensuring readability. Formatting may change.
     - Preserve layout

       Recommended for media-heavy PDFs with charts, images, or complex formatting. Original formatting and text height are preserved, and scrollbars are added if needed.
3. If not using the Auto-detect function, select the source and target languages using the Select language dropdown menus.

   Translation of typed text is automatically displayed.
4. For file translations multiple target languages can be selected:

   1. Click Translate once the upload is complete. If enabled, QPS scoring is displayed for each target language.

      - PDF files are converted into Microsoft Word (.docx) format for translation.
   2. Select one or all languages and click Download to download the relevant translation.

      - PDF translated files are downloaded as a .docx file, resembling the original PDF's layout and formatting where possible:

        - Editable PDFs: The output generally mirrors the original layout and structure, including headings, lists, paragraphs, and tables. However, text embedded in images or visual elements cannot be extracted.
        - Scanned PDFs: The output may not match the original PDF layout due to OCR limitations. Scanned PDFs with low image quality or intricate formatting may produce less accurate text extraction, with content organized simply in paragraph form.

Click on Translation history to display and download translations performed in the last 30 days. Translation requests with multiple target languages are grouped into a single row. Click the Translation details ![translation_details_portal.png](https://support.phrase.com/hc/article_attachments/30006145415708) icon to open a side panel showing a detailed breakdown of each target language. The Translated via column shows which MT/AI engine was used for each translation.

Each user only sees their own translation history.

Click through [tutorial](https://phrase.navattic.com/mo1h0qkh) on portal usage.

#### Sending Translations for Review

If submitting translations for review is enabled in the portal configuration and the translation language pair is supported by one of the project templates added to the portal, click Send for review. Project templates must either define both source and target languages or none. If a template has no languages set, any pair will work. Templates where only source or only target is set are treated as invalid and will not be shown.

When sending multiple languages for review, a single project is created in Phrase TMS with one job for each selected language.

Sending output to TMS does not consume [MTU](https://support.phrase.com/hc/en-us/articles/11530492252444#UUID-3c8ba1b3-290a-5451-ba45-71797af5a755)s.

Additional instructions can be provided and will be stored in the Note field of the project in TMS. Email notifications are automatically sent if enabled in the project template.

Older translations can also be sent for review from the Translation history page.

The review status of a translation is also displayed in the Translation history page on the Reviewed translations tab. When the status is Completed, the reviewed translations can be downloaded.

#### Portal User Management

Portal administrators can click Users in the left-hand navigation menu to see and manage all Portal users, their role and which portals they have access to.

Use the dropdown under the Role column of the Users page to change a Portal user's role:

- User role only sees the portals they have access to.
- Admin role can see all portals and users.

To add a single new Portal user, use [Platform Invitations](https://support.phrase.com/hc/en-us/articles/8604196444188#UUID-03c7baf8-1e4d-9d39-2df2-1ecc8d477792): from the Dashboard, go to the Users menu and click Invite users.

To add multiple new Portal users at once, use Add users to upload an .XLSX file with a list of new Portal users in the Import Portal users via file upload window. A sample .XLSX file can be downloaded as a template (entries are imported from the fourth row).

#### Portal Supported File Formats

File translation in Phrase Portal is available for the following file formats:

- .csv
- .docx, .xlsx, .pptx
- .html, .htm
- .idml
- .json
- .md
- .pdf

  - Editable PDFs

    Created from digital files types such as .DOCX or .PPTX. These generally have better text extraction and formatting accuracy.
  - Scanned PDFs

    Created from scanned physical documents and processed via Optical Character Recognition (OCR) for text extraction. Due to OCR limitations, layout and formatting may differ from the original.

  ### Tip

  For optimal results and if available, use the original file format (e.g., .DOCX, .PPTX) instead of the PDF version.

  **PDF Limitations**

  - Password-protected PDFs cannot be uploaded for translation.
  - Translated text may be longer than the original resulting in additional pages, layout shifts, or segment misalignment. PDFs with hard line breaks may also create unfavorable text segmentation.
  - Tables and charts may lose alignment, borders, and structure, especially in complex layouts.
  - In scanned PDFs, content may occasionally be missed or incorrectly formatted. Checkboxes and form elements may also not convert accurately.
  - Fonts, bold text, and headers may not be consistent in output.
  - Two-column layouts in PDFs, especially scanned ones, may result in paragraph misalignment.
  - The OCR process is applied only to fully rasterized pages, where the entire page is an image. If a PDF page already contains text, the text within images on that page may not be extracted.
- .sdlxliff
- .srt
- .txt
- .vtt
- .xlf, .xliff
- .xml

#### MT Usage

Portal administrators can monitor MTUs consumption and translated character usage of all existing portals and Language AI via API. Click MT Usage from the left-side navigation menu to see usage statistics in the MT usage dashboard.

##### Note

AI Translation Agent consumes [AI Units (AIUs)](https://support.phrase.com/hc/en-us/articles/14032731809052#UUID-cc9cfa45-5b73-500c-edfc-a3b77c44713f) instead of MTUs. AI Translation Agent usage does not appear in the MT usage dashboard.

The MT usage dashboard shows an overview of MTU consumption and the total number of characters translated over the last 12 calendar months.

The dashboard is refreshed twice daily:

- 12:00am and 12:00pm UTC for the EU instance
- 07:00am and 19:00pm UTC for the US instance

This displays the time of the last data refresh completion. The displayed timestamp may not include data generated up to 3 hours prior due to transactions may not be captured in time when the data refresh process is triggered.

Data is also displayed by portal through the following charts:

- MTUs by Portal Over Time

  Offers a breakdown of MTU usage by each portal over time to highlight consumption trends across different portals.
- Total MTUs and Translated Characters by Portal

  Compares the total number of MTUs and translated characters per portal.

Use the filters at the top of the page to refine and update the data on the dashboard by:

- Date

  Specify the date of consumption by selecting a time range within the last 12 calendar months.
- Phrase product

  Switch between Phrase Portal and Phrase Language AI via API to see consumption data for the specific product. This filter is single-selection only, allowing users to focus on one entity at a time.
- Portal name

  This filter is available only when displaying data from Phrase Portal. Users can select one or multiple portals for comparison.

---
