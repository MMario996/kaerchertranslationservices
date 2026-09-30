# Phrase Strings

A better localization solution for your product copy

Quelle: https://support.phrase.com/hc/en-us/categories/4930564750748-Phrase-Strings  
Exportiert: 2026-09-30T11:34:22+00:00 · Sprache: en-us · Artikel: 115

## Inhaltsverzeichnis

- [CLI](#cli)
  - [CLI Installation (Strings)](#cli-installation-strings)
  - [Create a CLI Configuration File (Strings)](#create-a-cli-configuration-file-strings)
  - [Modify the CLI Configuration File (Strings)](#modify-the-cli-configuration-file-strings)
  - [Generate API Access Token (Strings)](#generate-api-access-token-strings)
  - [Using the CLI (Strings)](#using-the-cli-strings)
- [Integrations](#integrations)
  - [Contentful (Strings)](#contentful-strings)
  - [Jira (Strings)](#jira-strings)
  - [Sketch (Strings)](#sketch-strings)
  - [WordPress (Strings)](#wordpress-strings)
  - [GitLab (Strings)](#gitlab-strings)
  - [GitHub (Strings)](#github-strings)
  - [Bitbucket (Strings)](#bitbucket-strings)
  - [Webhooks (Strings)](#webhooks-strings)
  - [Slack (Strings)](#slack-strings)
  - [Figma (Strings)](#figma-strings)
  - [Zapier (Strings)](#zapier-strings)
  - [Continuous Integration (Strings)](#continuous-integration-strings)
  - [Generic Platform Integration (Strings)](#generic-platform-integration-strings)
  - [Libraries and Tools (Strings)](#libraries-and-tools-strings)
  - [Advanced TextMaster (Strings)](#advanced-textmaster-strings)
  - [Phrase Strings API](#phrase-strings-api)
  - [Unity (Strings)](#unity-strings)
  - [Import From Crowdin (Strings)](#import-from-crowdin-strings)
- [Supported File Types (Strings)](#supported-file-types-strings)
  - [Supported File Formats (Strings)](#supported-file-formats-strings)
  - [.ARB - Application Resource Bundle (Strings)](#arb---application-resource-bundle-strings)
  - [.CSV (Strings)](#csv-strings)
  - [.CSV - Zendesk Dynamic Content (Strings)](#csv---zendesk-dynamic-content-strings)
  - [.DOCX - Word Processor Documents (Strings)](#docx---word-processor-documents-strings)
  - [.HTML (Strings)](#html-strings)
  - [.INI (Strings)](#ini-strings)
  - [JS EmberJS - Nested JSON (Strings)](#js-emberjs---nested-json-strings)
  - [.JSON - Angular Translate (Strings)](#json---angular-translate-strings)
  - [.JSON - Chrome Messages (Strings)](#json---chrome-messages-strings)
  - [.JSON - go-i18n (Strings)](#json---go-i18n-strings)
  - [.JSON - i18next / i18nextV4 (Strings)](#json---i18next-i18nextv4-strings)
  - [.JSON - i18n-node-2 (Strings)](#json---i18n-node-2-strings)
  - [.JSON - Nested (Strings)](#json---nested-strings)
  - [.JSON - Nested EmberJS (Strings)](#json---nested-emberjs-strings)
  - [.JSON - Nested React-Intl (Strings)](#json---nested-react-intl-strings)
  - [.JSON - Phrase Strings](#json---phrase-strings)
  - [.JSON - React-Intl Simple (Strings)](#json---react-intl-simple-strings)
  - [.JSON - Simple (Strings)](#json---simple-strings)
  - [.MO - Gettext-compiled (Strings)](#mo---gettext-compiled-strings)
  - [.PHP - Array (Strings)](#php---array-strings)
  - [.PHP - Laravel/F3/Kohana Array (Strings)](#php---laravelf3kohana-array-strings)
  - [Play Framework Properties](#play-framework-properties)
  - [.PLIST - Objective-C/Cocoa Property List (Strings)](#plist---objective-ccocoa-property-list-strings)
  - [.PO - gettext files (Strings)](#po---gettext-files-strings)
  - [.POT - Gettext Template Files (Strings)](#pot---gettext-template-files-strings)
  - [.PROPERTIES - Java Properties (Strings)](#properties---java-properties-strings)
  - [.PROPERTIES - Mozilla (Strings)](#properties---mozilla-strings)
  - [.QPH - Qt Phrase Book (Strings)](#qph---qt-phrase-book-strings)
  - [.RESX - Microsoft .NET (Strings)](#resx---microsoft-net-strings)
  - [.RESX - Windows 8 Resource (Strings)](#resx---windows-8-resource-strings)
  - [.RESX - Windows Phone ResX (Strings)](#resx---windows-phone-resx-strings)
  - [.STRINGSDICT - iOS Localizable Stringsdict for Pluralized Translation Keys (Strings)](#stringsdict---ios-localizable-stringsdict-for-pluralized-translation-keys-strings)
  - [.STRINGS - iOS Strings Resources (Strings)](#strings---ios-strings-resources-strings)
  - [.TMX (Strings)](#tmx-strings)
  - [.TS - Qt Translation Source (Strings)](#ts---qt-translation-source-strings)
  - [.TXT (Strings)](#txt-strings)
  - [.XCSTRINGS - Apple Strings Catalog (Strings)](#xcstrings---apple-strings-catalog-strings)
  - [.XLIFF - Symfony (Strings)](#xliff---symfony-strings)
  - [.XLIFF - XML Localization Interchange File Format (Strings)](#xliff---xml-localization-interchange-file-format-strings)
  - [.XLIFF - XML Localization Interchange File Format V2 (Strings)](#xliff---xml-localization-interchange-file-format-v2-strings)
  - [.XLSX - Spreadsheet Excel (Strings)](#xlsx---spreadsheet-excel-strings)
  - [.XML - Android (Strings)](#xml---android-strings)
  - [.XML - Episerver (Strings)](#xml---episerver-strings)
  - [.XML - Java Properties (Strings)](#xml---java-properties-strings)
  - [.YAML - Ruby on Rails (Strings)](#yaml---ruby-on-rails-strings)
  - [.YAML - Symfony (Strings)](#yaml---symfony-strings)
  - [.YAML - Symfony 2 (Strings)](#yaml---symfony-2-strings)
- [Translating](#translating)
  - [Zero-Touch Localization (Strings)](#zero-touch-localization-strings)
  - [Website Translation (Strings)](#website-translation-strings)
  - [Application Translation (Strings)](#application-translation-strings)
  - [Translate AppStore and Google Play Descriptions (Strings)](#translate-appstore-and-google-play-descriptions-strings)
  - [Translating Dynamic Content (Strings)](#translating-dynamic-content-strings)
  - [Plural Forms (Strings)](#plural-forms-strings)
  - [Global Search (Strings)](#global-search-strings)
  - [Ordering Professional Translations (Strings)](#ordering-professional-translations-strings)
  - [Pre-translation (Strings)](#pre-translation-strings)
  - [ICU Message Format (Strings)](#icu-message-format-strings)
  - [Localization Workflow (Strings)](#localization-workflow-strings)
  - [Translate with In-Context Editor (Strings)](#translate-with-in-context-editor-strings)
  - [Comments (Strings)](#comments-strings)
  - [Strings Editor](#strings-editor)
    - [Strings Editor Overview](#strings-editor-overview)
    - [Editor Key List (Strings)](#editor-key-list-strings)
    - [Source and Target Language Pane (Strings)](#source-and-target-language-pane-strings)
    - [Editor Sidebar (Strings)](#editor-sidebar-strings)
    - [Editor Keyboard Shortcuts (Strings)](#editor-keyboard-shortcuts-strings)
    - [Editor Search Query Formatting (Strings)](#editor-search-query-formatting-strings)
- [Translation Management](#translation-management)
  - [Phrase Strings Limits](#phrase-strings-limits)
  - [Spaces (Strings)](#spaces-strings)
  - [Projects (Strings)](#projects-strings)
  - [Jobs (Strings)](#jobs-strings)
  - [Keys (Strings)](#keys-strings)
  - [Linked Keys (Strings)](#linked-keys-strings)
  - [Custom Metadata (Strings)](#custom-metadata-strings)
  - [Review Workflow (Strings)](#review-workflow-strings)
  - [Over the Air (Strings)](#over-the-air-strings)
  - [Languages and Locales (Strings)](#languages-and-locales-strings)
  - [Quality Assurance (Strings)](#quality-assurance-strings)
  - [Notifications (Strings)](#notifications-strings)
  - [Machine Translation (Strings)](#machine-translation-strings)
  - [Localization Files (Strings)](#localization-files-strings)
  - [Uploading and Downloading Localization Files (Strings)](#uploading-and-downloading-localization-files-strings)
  - [Screenshot Management (Strings)](#screenshot-management-strings)
  - [Placeholders (Strings)](#placeholders-strings)
  - [Tags (Strings)](#tags-strings)
  - [Branching (Strings)](#branching-strings)
  - [Deprecation of Legacy Branches in Phrase Strings](#deprecation-of-legacy-branches-in-phrase-strings)
  - [Migrating Content (Strings)](#migrating-content-strings)
  - [Job Templates (Strings)](#job-templates-strings)
  - [Analytics Dashboards (Strings)](#analytics-dashboards-strings)
  - [Keyboard Shortcuts (Strings)](#keyboard-shortcuts-strings)
  - [Cost-Effective Word Management (Strings)](#cost-effective-word-management-strings)

---

## CLI

Quelle: https://support.phrase.com/hc/en-us/sections/5784132012828-CLI

### CLI Installation (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784093863964-CLI-Installation-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:21:10Z  
> Labels: 2BTr, ar_strings

##### Tip

For more detailed information, refer to the [Developer Hub](https://developers.phrase.com/en/developer-tools/strings-cli).

The client can be installed on macOS, Windows and Linux.

#### macOS Installation for Strings

The client can be installed with either Homebrew or Download.

##### Homebrew

To install using Homebrew, install the client using brew:

```
$ brew install phrase-cli
```

Run `brew upgrade phrase-cli` to update Formula or `brew upgrade` to update all packages.

##### Download

To install via Download, follow these steps:

1. Download the latest [release](https://github.com/phrase/phrase-cli/releases).
2. Place the executable in the path, or place it elsewhere and create a symbolic link to it in the path.
3. If required, set the executable flag to make the binary executable:

   ```
   $ cd /path/to/phrase && chmod +x phrase
   ```
4. Run the client:

   ```
   $ phrase
   ```

   If not in the path:

   ```
   $ /path/to/phrase/phrase
   ```

#### Windows

To install the client for Windows, follow these steps:

1. Download the latest [release](https://phrase.com/cli/).
2. Run the installation file.
3. Type `phrase` from the command prompt to start the client.

#### Linux

To install the client for Linux, follow these steps:

1. Download the latest [release](https://github.com/phrase/phrase-cli/releases).
2. Place the executable in the path, or place it elsewhere and create a symbolic link to it in the path.
3. If required, set the executable flag to make the binary executable:

   ```
   $ cd /path/to/phrase && chmod +x phrase
   ```
4. Run the client:

   ```
   $ phrase
   ```

   If not in the path:

   ```
   $ /path/to/phrase/phrase
   ```

[ASDF](https://asdf-vm.com/) can also be used and if already in use, add the Phrase [plugin](https://github.com/phrase/asdf-phrase) and call:

```
asdf install phrase
```

Versions can be controlled using a `.tool-versions` file that defines the tools required for the project and which versions of the tools should be used.

##### Building the client from source

Users of other platforms that have a [Go](https://go.dev/) port can build the client from [source](https://github.com/phrase/phrase-cli).

If using Android Studio or Visual Studio, see IDE plugins for syncing locale files between repositories and Phrase.

---

### Create a CLI Configuration File (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784093898908-Create-a-CLI-Configuration-File-Strings  
> Zuletzt aktualisiert: 2026-07-17T06:36:53Z  
> Labels: 2BTr, ar_strings

**Prerequisites**

- [API access token](https://support.phrase.com/hc/en-us/articles/5808341130268#UUID-1ca967e5-9eb5-a015-b134-e1f1a87a2d71 "Generate API Access Token (Strings)") with `read write` scope
- Strings project ID shown in the API tab of the project settings
- Basic YAML knowledge, including indentation
- Git read and write permissions if the repository will run `phrase push` or `phrase pull` in CI

##### Tip

For more detailed information, refer to the [Developer Hub](https://developers.phrase.com/en/developer-tools/strings-cli).

To automatically create a configuration file, follow these steps:

1. From the command line, type `phrase init` to create a **.phrase.yml** file.

   The configuration wizard starts in the CLI.
2. Provide:

   - Access token

     Paste or hit **Enter** to let **$PHRASE\_ACCESS\_TOKEN** be used
   - Strings Project ID (e.g. `abcdef1234567890abcdef1234567890`)
   - Locale file format (e.g. json, rails\_yaml, ios\_strings)
   - Local path

     Glob or exact path to locale files in the project codebase (e.g. `config/locales/*.json`)

A basic `.phrase.yml` file is created in the current directory.

##### Tip

Supply flags to skip the wizard entirely, for example `phrase init --access_token=$PHRASE_ACCESS_TOKEN --project_id=... --file_format=ios_strings --path='ios/*.strings'`.

If using a manually created or copied configuration file, place it in one of these locations:

- The current working directory (`pwd`) in which the CLI client is called.
- The home directory of the current user (`$HOME` in Unix, `$HomePath` in Windows).
- The path specified in the `PHRASEAPP_CONFIG` environment variable.
- Path to configuration file via the `--config` flag (e.g. `/some/path/to/phrase.yml`).

##### CLI Options Overview

Sample [configuration file](https://support.phrase.com/hc/article_attachments/30682393006236).

**Global Settings**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `phrase.access_token` | string | Yes | Personal [access token](https://support.phrase.com/hc/en-us/articles/5808341130268#UUID-1ca967e5-9eb5-a015-b134-e1f1a87a2d71 "Generate API Access Token (Strings)"). |
| `phrase.project_id` | string | Yes | Public project ID shown in Strings project settings. |
| `phrase.file_format` | string | Yes | Default locale [file format](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc) (API extension). |
| `phrase.locale_mapping` | object | No | Maps Phrase locale IDs to custom names for use in file paths with the `<locale_name>` placeholder. This is useful for platforms with non-standard naming conventions, like Android.  If a locale is not specified in the mapping, its standard Phrase locale name is used by default. |

**Push: Sources**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `push.sources[].file` | path | Yes | Relative path to file(s) to push, e.g. `./path/to/file/<locale_code>.json`. Supports `<locale_name>`, `<locale_code>`, `<tags>`. |
| `push.sources[].project_id` | string |  | Override the global `project_id` for this specific file source. Useful when pushing files to multiple Phrase projects from the same configuration file. |

**Push: Parameters**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file_format` | string | header | Override file format for this source. |
| `locale_id` | string | — | Locale name (e.g. `en-US`) or public locale ID. |
| `tags` | string | — | Comma-separated tags for new keys. |
| `update_translations` | boolean | `false` | Update existing translations with file content. |
| `update_translation_keys` | boolean | `true` | Pass `false` here to prevent new keys from being created and existing keys updated. |
| `update_descriptions` | boolean | `false` | Update key descriptions; empty descriptions overwrite existing. |
| `skip_upload_tags` | boolean | `false` | Upload tags are not created. |
| `skip_unverification` | boolean | `false` | Updated translations are not unverified. |
| `file_encoding` | string | — | File encoding: `UTF-8`, `UTF-16`, `UTF-16BE`, `UTF-16LE`, or `ISO-8859-1`. |
| `locale_mapping` | object | — | (Excel/CSV only) Map locale codes to column names, e.g. `{"en": "C", "de": "D"}` for parsing translations. This is distinct from the top-level `locale_mapping` used for file paths. |
| `autotranslate` | boolean | `false` | Auto-fetch translations for the uploaded language. |
| `mark_reviewed` | boolean | `false` | Mark imported translations as reviewed ([advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1) must be enabled). |

**Push: Format Options**

All available format options are supported in the CLI configuration. See [Sample configuration file](https://support.phrase.com/hc/en-us/article_attachments/26959518969884) for examples.

**Pull: Targets**

| Key | Type | Required | Description |
| --- | --- | --- | --- |
| `pull.targets[].file` | path | Yes | Relative path for pulled locale files, e.g. `./Radio.de/<locale_code>.lproj/Localizable.strings`. |
| `pull.targets[].project_id` | string |  | Override the global `project_id` for this specific pull target. Enable pulling translations from multiple Phrase projects using the same configuration file. |

**Pull: Parameters**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `file_format` | string | — | Must be `strings`. |
| `locale_id` | string | — | Locale name (e.g. `en-US`) or public locale ID. |
| `tags` | string | — | Comma-separated tags to filter which keys to pull. |
| `include_empty_translations` | boolean | `false` | Include keys without any translations. |
| `exclude_empty_zero_forms` | boolean | `false` | Exclude zero-form plurals when empty. |
| `include_translated_keys` | boolean | `true` | Include keys that already have translations. |
| `keep_notranslate_tags` | boolean | `false` | Preserve `[NOTRANSLATE]` tags in output. |
| `encoding` | string | — | File encoding: `UTF-8`, `UTF-16`, `UTF-16BE`, `UTF-16LE`, or `ISO-8859-1`. |
| `include_unverified_translations` | boolean | `true` | If `false`, exclude unverified translations. |
| `use_last_reviewed_version` | boolean | `false` | If `true`, use the last reviewed version (requires advanced review workflow). |
| `fallback_locale_id` | string | — | Fallback locale to use for missing translations. |

**Pull: Format Options**

All available format options are supported in the CLI configuration. See [Sample configuration file](https://support.phrase.com/hc/en-us/article_attachments/26959518969884) for examples.

##### Multiple configurations

In monorepos, place one configuration file in each package and run the CLI from the corresponding subfolder, or point CI jobs to different configuration files with the `--config` option.

##### Git integration

GitLab:

- The `.phrase.yml` configuration file must be present in the repository. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.
- Use [GitLab 9.5](https://about.gitlab.com/install/) or newer to ensure API compatibility.

GitHub:

- The `.phrase.yml` configuration file must be present in the repository. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.
- A [GitHub access token](https://github.com/settings/tokens) for the scope of the repository (`public_repo` if synchronizing with a public repository).
- If SSO is enabled in GitHub, it must also be enabled for the access token.
- The *phrase\_translations* branch cannot be protected.
- Ensure repository settings do not require signed commits.

BitBucket:

- The `.phrase.yml` configuration file must be present in the repository. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.

---

### Modify the CLI Configuration File (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784118494492-Modify-the-CLI-Configuration-File-Strings  
> Zuletzt aktualisiert: 2026-07-17T06:13:43Z  
> Labels: 2BTr, ar_strings

##### Tip

For more detailed information, refer to the [Developer Hub](https://developers.phrase.com/en/developer-tools/strings-cli).

#### Push and Pull

###### Push

```
$ phrase push
```

The `push` command uploads files found in local project directories. Use the `.phrase.yml` file to specify files for upload and set any additional parameters. The `<tag>` placeholder can also be used to download keys into separate files based on their tags.

###### Pull

```
$ phrase pull
```

Similar to the `push` command with the exception globbing cannot be used. When using placeholders, use `<locale_name>` whenever possible. To pull a file with keys that have a specific tag, use the `tags` parameter:

```
phrase:
  pull:
    targets:
    - file: path/to/file/<locale_name>.yml
      params:
        tags:tag_name
```

To use the `<tag>` placeholder, the desired tags must be listed in the `params` section.

###### Parameters

The `push` and `pull` commands can be configured within the `.phrase.yml` file.

All options of the `uploads` API endpoint are supported for the push command.

All options of the `locales download` API endpoint are supported for the pull command.

**Push example:**

```
push:
  sources:
  - file: ./locales/en.json
    params:
      update_translations: true
```

**Pull example:**

```
pull:
  targets:
  - file: "./locales/example.yml"
    params:
      include_unverified_translations: true
```

#### Format Options

Depending on [file format](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc), format options can be applied to the parameter section. Format options can be applied to uploads, downloads or both.

Format examples:

```
params:
  format_options:
    convert_placeholder: true
```

Some file formats allow greater control over the file syntax:

```
phrase:
  pull:
    targets:
    - file: file.xml
      params:
        format_options:
          convert_placeholder: true

  push:
    sources:
    - file: file.csv
      params:
        format_options:
          column_separator: ";"
```

#### Placeholders and Globbing

The following placeholders and globbing operators can be placed in the paths within your file entries:

- <locale\_name>

  The unique locale name.
- <locale\_code>

  The [RFC 5646](https://tools.ietf.org/html/rfc5646)-compliant locale identifier. The locale code does not have to be unique, so multiple locales with different names can exist with the same code.
- <tag>

  Use tags to group keys. Tags can be used to [maintain the original file structure](https://support.phrase.com/hc/en-us/articles/5822143476252#UUID-f503625e-7538-cf98-9f15-5316003a93c2).

###### Globbing

`*` and `**` are globbing operators. A single asterisk `*` skips any folder in a path. The double asterisk `**` is like the standard globbing operator and matches any character for recursive, non-exhaustive matching.

Examples:

```
# a file pattern

./abc/**/*.yml
```

```
# with a few files on your system

./abc/defg/en.yml

./abc/es.yml

./fr.yml
```

```
# selects

./abc/defg/en.yml

./abc/es.yml
```

When using the `pull` command to download files, provide an explicit file pattern such as `./abc/defg/<locale_name>.yml` instead of `./**/*.yml`.

#### Waiting for Uploads

All uploads are processed asynchronously. To wait for uploads, apply the `--wait`  flag. The `push` will wait for each file upload and returns whether it failed or succeeded.

#### Use Cases

###### Upload a file to specified locale

Upload the `en.json` file to the `./locales/` directory with the given `locale_id` (locale must already exist).

`Update_translations` is set to *false*, so only new keys and translations are imported. If set to *true*, the client would also import local changes to existing translations, overwriting any already present content.

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: nested_json

  push:
    sources:
    - file: ./locales/en.json
      params:
        update_translations: false
        locale_id: YOUR_LOCALE_ID # the locale must exist remotely
```

##### Note

It is not possible to delete imported translation entries. If required, update translations to `empty` values via the relevant [API endpoint](https://developers.phrase.com/api/#patch-/projects/-project_id-/translations/-id-).

###### Ruby on Rails: upload specified file type

Upload all files ending with `.yml` located in `./config/locales/`. Ruby on Rails YAML files contain locale information, so there is no need to specify the locale explicitly. `Update_translations` is set to *true*, so all changes to translations will be imported with any existing data being overwritten.

```
phrase:
  push:
    sources:
    - file: ./config/locales/*.yml
      params:
        update_translations: true
        file_format: yml
```

###### Match iOS strings

To match all iOS strings files with files named `Localizable.strings` in `.lproj` folders.

The `<locale_code>` is everything that matches after `/` and before `.lproj` to create and identify locales.

The `update_translations` parameter is omitted and has the same effect as setting it to *false*.

```
phrase:
  push:
    sources:
    - file: "./<locale_code>.lproj/Localizable.strings"
      params:
        file_format: strings
```

###### [Maintain multiple Strings projects for one localization project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252)

Edit the configuration file to limit the scope of projects by splitting the translations into smaller categories.

#### Configuration Examples for Frameworks

Modify the configuration file to suit requirements, then check it into the source control or version control system.

###### Rails

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: "yml"

  push:
    sources:
    - file: "./config/locales/*.yml"

  pull:
    targets:
    - file: "./config/locales/<locale_name>.yml"
```

###### iOS strings

```
phrase:

  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: "strings"

  push:
    sources:
    - file: "./<locale_code>.lproj/Localizable.strings"

  pull:
    targets:
    - file: "./<locale_code>.lproj/Localizable.strings"
    - file: "./<locale_code>.lproj/Localizable.stringsdict"
      params:
        #file_format can be overwritten
        file_format: "stringsdict"
```

###### Android XML

[Android](https://developer.android.com/guide/topics/resources/localization.html) doesn’t use the standard ISO language codes as the file pattern. Specify the required pattern in `.phrase.yml`.

Instead of defining a separate pull target for each locale, use the global `locale_mapping` setting combined with the <locale\_name> placeholder. The CLI will use the custom name from the mapping for the corresponding locale and fall back to the default Phrase locale code for all other languages.

Example:

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: "xml"

  # Map Phrase locales to Android-specific directory names
  locale_mapping:
    en-US: values
    de-DE: values-de-rDE
    fr-FR: values-fr

  push:
    sources:
      # Source file is the default language, mapped to 'values'
      - file: ./app/src/main/res/values/strings.xml
        params:
          locale_id: en-US # Must match the source locale in Phrase

  pull:
    targets:
      # Use <locale_name> placeholder which will be replaced by the mapping
      - file: ./app/src/main/res/<locale_name>/strings.xml
```

###### Explicitly set locales example

Example with English as the default language, a German locale, and a German region locale for Austrian German:

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: xml
  
  pull:
    targets:
    - file: ./app/src/main/res/values/strings.xml
      params:
        file_format: xml
        # Unique locale id for English
        locale_id: LOCALE_ID
    - file: ./app/src/main/res/values-de/strings.xml
      params:
        file_format: xml
        # Unique locale id for German
        locale_id: LOCALE_ID
    - file: ./app/src/main/res/values-de-rAU/strings.xml
      params:
        file_format: xml
        # Unique locale id for Austrian
        locale_id: LOCALE_ID
  push:
    sources:
    - file: ./app/src/main/res/values/strings.xml
      params:
        file_format: xml
        locale_id: LOCALE_ID
    - file: ./app/src/main/res/values-de/strings.xml
      params:
        file_format: xml
        locale_id: LOCALE_ID
    - file: ./app/src/main/res/values-de-rAU/strings.xml
      params:
        file_format: xml
        locale_id: LOCALE_ID
```

###### Multi-platform example

Automatically push and pull translations for multiple targets in one configuration.

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: nested_json

  push:
    sources:
      # Web JSON
      - file: "apps/web/src/assets/i18n/.json"
        params:
          file_format: nested_json
          locale_id: LOCALE_ID
      # Android XML
      - file: "apps/android/app/src/main/res/values-/strings.xml"
        params:
          file_format: android
          locale_id: LOCALE_ID
      # iOS Strings
      - file: "apps/ios/.lproj/Localizable.strings"
        params:
          file_format: strings
          locale_id: LOCALE_ID

  pull:
    targets:
      - file: "apps/web/src/assets/i18n/.json"
        params:
          file_format: nested_json
          locale_id: LOCALE_ID
      - file: "apps/android/app/src/main/res/values-/strings.xml"
        params:
          file_format: android
          locale_id: LOCALE_ID
      - file: "apps/ios/.lproj/Localizable.strings"
        params:
          file_format: strings
          locale_id: LOCALE_ID
```

---

### Generate API Access Token (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5808341130268-Generate-API-Access-Token-Strings  
> Zuletzt aktualisiert: 2026-08-04T06:13:05Z  
> Labels: 2BTr, ar_strings

Access tokens are used to access the API without providing a username and password taking the place of login data. Specific actions can be performed within the API based on granted privileges. There is no limit to how many tokens can be created and are listed on the Access tokens tab. Any [user role](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) can create an access token.

##### Note

Phrase Strings does not currently support OAuth 2.0 client registration. Use a personal API access token as described below, and pass it as a Bearer token if the third-party tool supports static-token authentication instead of a full OAuth flow.

To generate an access token, follow these steps from inside the Strings application:

1. From the user menu (top right), hover over Settings and click on Profile.

   The Profile Settings page opens.
2. Select the Access tokens tab and click Generate token.

   ![access_token_strings.gif](https://support.phrase.com/hc/article_attachments/30682392855196)
3. Provide a Note for the token and the [Scopes](https://developers.phrase.com/api/#tag--Authorizations) of the token.
4. Click Save.

   The token is added to the list and a notification is sent that the token has been created. The token will be presented in plain text and should be copied and stored in a secure location as for security reasons will not be presented again.

To edit a token name, click ![Modify](https://support.phrase.com/hc/article_attachments/30682392866332).

To delete a token, click ![Send to Recycle Bin](https://support.phrase.com/hc/article_attachments/30682313437724). Deleting a token renders it inoperable.

---

### Using the CLI (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5808300599068-Using-the-CLI-Strings  
> Zuletzt aktualisiert: 2026-08-27T07:22:09Z  
> Labels: 2BTr, ar_strings

The Phrase Strings CLI tool helps navigate the [API](https://developers.phrase.com/) to manage projects and translations quickly from the command line instead of from curl requests.

If using the US [data center](https://support.phrase.com/hc/en-us/articles/5748008399388#UUID-c4ad434d-6658-2e9d-6190-53554ba2bdff), pass the host with `phrase init --host https://api.us.app.phrase.com/v2`. If the configuration has already been generated, add this code:

```
phrase:
  host: https://api.us.app.phrase.com/v2
```

##### Tip

For more detailed information, refer to the [Developer Hub](https://developers.phrase.com/en/developer-tools/strings-cli).

#### Basic Usage

Control how the client pushes and pulls files by editing the `.phrase.yml` configuration file.

1. Initialize a project.

   Initialize project by running `phrase init`. This defines preferred locale [file format](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc), source files and more:

   ```
   $ phrase init
   ```
2. Upload locale files.

   Use the `push` subcommand to upload locale files:

   ```
   $ phrase push
   ```
3. Download locale files.

   Use the `pull` subcommand to download the most recent locale files back into a project:

   ```
   $ phrase pull
   ```
4. More subcommands.

   To see a list of all available subcommands, run `phrase` without specifying a subcommand. To see all supported options for a specific subcommand, use the `--help` flag:

   ```
   $ phrase locales list --help
   ```

Sample [configuration file](https://support.phrase.com/hc/article_attachments/30682393136028).

##### Escaping rules and quotes usage

When [passing JSON objects on the command line](https://stackoverflow.com/questions/28939980/passing-json-string-via-command-line/28940252#28940252), escaping rules and quotes usage may vary according to the shell used.

If using a Windows shell, enclose the whole JSON string in double quotes `""`, and escape double quotes within JSON using a backslash `\` character. For example:

```
phrase locales create --project_id PROJECT123 --data "{\"name\":\"French\", \"code\":\"fr\"}" --access_token TOKEN123123
```

#### Access and Authentication

##### Accessing API endpoints

The client can be used to access all API endpoints. For example, to list all projects:

```
$ phrase projects list --access_token ACCESS_TOKEN
```

##### Authentication using Phrase credentials

Specify username with the `--username` flag and the password will be requested:

```
$ phrase projects list --username user@example.com
Password: ********
```

If two-factor authentication is activated for the user or organization, a valid multi factor token must be provided via the `--tfa` flag:

```
$ phrase projects list --username user@example.com --tfa
Password: ********
TFA: ********
```

##### Authentication using Strings access token

Use the `--access_token` flag to specify your access token:

```
$ phrase projects list --access_token ACCESS_TOKEN
```

or use the `PHRASE_ACCESS_TOKEN` environment variable to store your token:

```
export PHRASE_ACCESS_TOKEN="ACCESS_TOKEN"
```

If two-factor authentication is activated, a valid multi factor token must be provided via the `--x_phrase_app_otp` flag:

```
$ phrase projects list --access_token ACCESS_TOKEN --x_phrase_app_otp PASSWORD
```

Token can also be provided in interactive mode with the `--tfa` flag:

```
$ phrase projects list --access_token ACCESS_TOKEN --tfa
TFA: ********
```

The access token is read from the `.phrase.yml` configuration file by default, but behavior can be overridden by using the mentioned flags or env variables and the token provided via the flag or environment variable is used instead. Tokens provided via flags override tokens provided via the environment variable.

When storing the `.phrase.yml` file in a code repository, it is recommended to remove the token first and use alternative methods, such as passing the token through the environment or a command-line flag. Storing secret tokens directly in a repository can be a security issue.

##### Authentication using Platform access token

[Platform API tokens](https://support.phrase.com/hc/en-us/articles/22675071795996#UUID-e68441bf-1d66-9f6a-a2d8-8431abfd8561) are not accepted directly by the Strings CLI. Users must first [exchange them for a short-lived product access token (JWT)](https://developers.phrase.com/en/api/platform/authentication) and then use the returned token through one of the following options:

- Set an environment variable

  ```
  export PHRASE_ACCESS_TOKEN="GENERATED-JWT"
  phrase projects list --access_token "$PHRASE_ACCESS_TOKEN"
  ```
- Pass the token directly

  ```
  phrase projects list --access_token GENERATED-JWT
  ```

#### Push and pull

Use the push and pull commands to [upload](https://developers.phrase.com/api/#post-/projects/-project_id-/uploads) and [download](https://developers.phrase.com/api/#get-/projects/-project_id-/locales/-id-/download) locale files. Instead of command line arguments, push and pull rely on the configuration stored in the `.phrase.yml` configuration file in the project root folder.

If the push has the update\_translations option set to true, the push overwrites the translations. Pull always overwrites translations in the local file.

To automatically delete keys in Phrase Strings when they are removed from a source file, add the `delete_unmentioned_keys: true` parameter to the push section of the .phrase.yml configuration file. This parameter must be placed at the push level, as a sibling of sources, not nested under params. This parameter deletes any key in the Phrase project that is absent from the synced file. Use this only when the source file contains all keys for the project.

Example configuration for uploading and downloading locale files of a typical Rails application:

```
phrase:
  access_token: "ACCESS_TOKEN"
  project_id: "PROJECT_ID"
  file_format: "yml"
  push:
    sources:
      - file: "./config/locales/<locale_name>.yml"
  pull:
    targets:
      - file: "./config/locales/<locale_name>.yml"
```

Use the push command to upload locale files to the project identified by `project_id` matching the `de.yml` and `en.yml` file in the config/locales folder. If there are new keys, these will be added to the localization file:

```
$ phrase push
Uploading config/locales/de.yml
Uploaded config/locales/de.yml successfully.
Uploading config/locales/en.yml
Uploaded config/locales/en.yml successfully.
```

Use the pull command to download locale files from the project identified by `project_id` to their respective file paths. If there are new keys, these will be added to the project:

```
$ phrase pull
Downloaded de to config/locales/de.yml
Downloaded en to config/locales/en.yml
```

##### Rate limit support

The client supports the rate limit for locale downloads. When the rate limit is reached, the client waits until the rate limit has expired and continues downloading locales afterwards. The client displays *rate limit exceeded, download will resume in x seconds*.

##### Upload cleanup

The uploads cleanup command is provided to delete keys that are found in the project but are not contained in the uploaded file. After pushing locale files, deleting all keys that are not contained in a default locale or some other locale may be required:

```
$ phrase uploads cleanup --id <YOUR_UPLOAD_ID>
```

##### Format options

Several formats, such as CSV, support additional format options during upload. Access these options by prefixing the options with `--format_options`:

```
phrase uploads create \
--project_id PROJECT_ID \
--file ./en.csv \
--file_format csv \
--locale_mapping ‘{“en”:3, “de”:2}’ \
--format_options ‘{“key_index”:1}’ \
--access token YOUR_ACCESS_TOKEN
```

##### Translation key prefix

A translation key prefix prevents key collisions across different projects or files and improves traceability of translation keys. The CLI interface supports key prefix handling for both pull and push operations.

- Push parameters:

  - `translation_key_prefix`: The specified prefix is prepended to the translation keys being pushed.

    - Use the `<file_path>` magic placeholder to automatically set the `translation_key_prefix` to the current file path. The path has a maximum length of 255 characters.
- Pull parameters:

  - `translation_key_prefix`: This parameter allows the prefix to be subtracted from the translation key names during the pull operation.

    - Use the `<file_path>` magic placeholder to automatically set the `translation_key_prefix` to the current file path. The path has a maximum length of 255 characters.
  - `filter_by_prefix`: A boolean option that filters translation keys based on the prefix before pulling them.

Example configuration of the `phrase.yml` file:

```
phrase:
  access_token: access_token
  file_format: yml
  push:
    sources:
      -
        file: path/to/your/file.yml
        project_id: project_id
        params:
          locale_id: en
          translation_key_prefix: prefix_
  pull:
    targets:
      -
        file: path/to/your/file.yml
        project_id: project_id
        params:
          translation_key_prefix: prefix_
          filter_by_prefix: true
```

Curl commands example:

```
curl "https://api.phrase.com/v2/projects/:project_id/uploads?translation_key_prefix=prefix_" \
  -u USERNAME_OR_ACCESS_TOKEN \
  -X POST \
  -F file=@/path/to/my/file.format \
  -F file_format=format \
  -F locale_id=locale_id
```

```
curl "https://api.phrase.com/v2/projects/:project_id/locales/:id/download?file_format=file_format&translation_key_prefix=prefix_&filter_by_prefix=true" \
  -u USERNAME_OR_ACCESS_TOKEN
```

#### Proxy

If behind a proxy, specify proxy settings using the `HTTPS_PROXY` environment variable:

```
export HTTPS_PROXY=https://user:password@host:port
```

#### Complex Usage

##### Multiple localization files for one project

Use one file for each locale in a project. If [tools](https://support.phrase.com/hc/en-us/articles/5822548113436#UUID-a498dd24-0e7c-a98e-8cdd-82f9bc0c164f) or framework force the use of multiple files, see [maintaining file structures](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-5987e780-55f5-f730-87b6-071f69103a05) for details on how to set up the project.

##### Multiple projects for one localization project

When working on a large localization project, distribute translations over multiple projects. Configure the CLI to work with [multiple localization files for one localization project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252).

##### Format options

Some [file formats](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc) allow specifying format options for greater control over file syntax. Specify format options in the `.phrase.yml` configuration file::

```
phrase:
  pull:
    targets:
    - file: file.xml
      params:
        format_options:
          convert_placeholder: true

  push:
    sources:
    - file: file.csv
      params:
        format_options:
          column_separator: ";"
```

##### Configuration for Android projects

Android [doesn’t use the standard ISO language codes](https://developer.android.com/guide/topics/resources/localization.html) as the file pattern. Specify the required pattern in `.phrase.yml`.

Instead of defining a separate pull target for each locale, use the global `locale_mapping` setting combined with the `<locale_name>` placeholder. The CLI will use the custom name from the mapping for the corresponding locale and fall back to the default Phrase locale code for all other languages.

Example:

```
phrase:
  access_token: ACCESS_TOKEN
  project_id: PROJECT_ID
  file_format: "xml"

  # Map Phrase locales to Android-specific directory names
  locale_mapping:
    en-US: values
    de-DE: values-de-rDE
    fr-FR: values-fr

  push:
    sources:
      # Source file is the default language, mapped to 'values'
      - file: ./app/src/main/res/values/strings.xml
        params:
          locale_id: en-US # Must match the source locale in Phrase

  pull:
    targets:
      # Use <locale_name> placeholder which will be replaced by the mapping
      - file: ./app/src/main/res/<locale_name>/strings.xml
```

---

## Integrations

Quelle: https://support.phrase.com/hc/en-us/sections/5784101340060-Integrations

### Contentful (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784104970908-Contentful-Strings  
> Zuletzt aktualisiert: 2026-06-11T09:32:49Z  
> Labels: 2BTr, ar_strings

##### Important

This connector has been deprecated.

##### Tip

For information about Contentful integration in Phrase TMS, refer to [Contentful (TMS)](https://support.phrase.com/hc/en-us/articles/5709656617628#UUID-c120e0c5-0b42-84ef-29e0-858e7a52a34e).

The integration allows developers, writers, managers, and marketers to connect to their profile and access translations directly from within Contentful. The integration does not work for multiple environments and does not require enabling localization in Contentful itself.

#### Prerequisites

- A Contentful account.
- The installed [application](https://www.contentful.com/marketplace/app/phrase/).
- To display multiple keys in the preview, an environment that uses nested translation syntax is required. [i18next](https://www.i18next.com/translation-function/nesting) is an example of such a framework. If the framework does not include this feature, a custom pre-formatter may need to be written.

#### Setup the application

To setup the application in Contentful, follow these steps:

1. Click the Content model tab.
2. Select the content model to be used with the application.
3. Click on Sidebar and add the application with the ![Add New](https://support.phrase.com/hc/article_attachments/30682349226140) icon.
4. From the Fields list of the content model, click Settings.
5. From the Appearance tile, select Phrase.
6. Repeat for each field to be used with the application.
7. Click Save.

   The application is now available in the Contentful sidebar for logging in with Phrase credentials.
8. Provide credentials and click Connect with Phrase.
9. Select a Phrase project and a language from the dropdown lists and click Save.

   Phrase content can now be searched for and viewed from with Contentful.

#### Searching for Content

Enter the **/text** command in the Title field to search for texts stored in Phrase and the **/key** command for key names. Results are presented in a dropdown list and are easiest to select with the arrow and enter keys.

Click [Preview](https://www.contentful.com/developers/docs/tutorials/general/content-preview/#preview-content-in-the-online-environment) to see content based on selected keys.

#### Using ICE with Contentful

The [In-Context Editor (ICE)](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-f697cd5c-bd36-da27-4a90-75ff19ae32e4 "In-Context Editor (Strings)") can also be used for the Contentful preview allowing switching the language via the editor and editing translations in-context.

Keys from string or fields received from Contentful must be extracted and translated manually.

To setup the use of the In-context editor, follow these steps:

1. Ensure an environment is available receiving data from Contentful such as an online version of a website or an application still in development for previewing entries.
2. Install and setup the In-Context Editor.
3. Configure the In-context-editor as Contentful preview by placing the URL of the environment in Contentful preview settings.

---

### Jira (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784104988828-Jira-Strings  
> Zuletzt aktualisiert: 2026-07-20T06:20:13Z  
> Labels: 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Jira tickets are created and updated according to the related Strings job. Comments in Strings jobs are also reflected in Jira tickets.

If using custom required fields in Jira tickets, this integration cannot be used to create tickets. Tickets will need to be created in Jira first and then the URL is pasted in the job draft.

Jira URLs are not supported in [job templates](https://support.phrase.com/hc/en-us/articles/7629216795036#UUID-30b94bbf-3b34-4f9b-6fbe-ad716f3d8080).

##### Note

Strings supports only the cloud version of Jira and *Story* issues. Other types of Jira issues require additional mandatory fields that are not supported.

#### Job updates for existing Jira tickets

With the integration in place, fields are available on the Update Job page to enter the URL of existing Jira tickets requiring translation or review.

If there is only one Jira ticket for both translation and review tasks, enter the URL in both input fields. Status updates for this job will now be synced to the corresponding ticket(s).

#### Prerequisites

- Logged in to a Jira account with at least one active project and board.

#### Setup

To setup the integration, follow these steps:

1. From the Integrations page, scroll down to Jira Integration and click Configure.

   The Jira authorization page opens.
2. Click Accept to authorize the creation of issues in the project.

#### Generate Jira Tickets

Generated Jira tickets are based on translation or review jobs. At least one translator or reviewer should be assigned to the job for the ticket to be created.

To generate Jira tickets, follow these steps:

1. From the Integrations page, scroll down to Jira Integration and click Configure.

   The Jira Integration configuration page opens.
2. Select a Jira project from the dropdown list.
3. Add Phrase projects from the dropdown list.
4. Select the type of job event that triggers the creation of Jira tickets.
5. Select the type of job Jira tickets are created for.
6. Click Save.

The link to the Phrase job is added as a comment on the Jira ticket only after the job is started.

---

### Sketch (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784096009116-Sketch-Strings  
> Zuletzt aktualisiert: 2026-07-15T06:15:10Z  
> Labels: 2BTr, ar_strings

##### Important

The Phrase Strings Sketch plugin was deprecated on 15 July 2026.

---

### WordPress (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/28087164777372-WordPress-Strings  
> Zuletzt aktualisiert: 2026-06-11T09:32:51Z  
> Labels: 2BTr, ar_strings

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

##### Tip

For information about WordPress integration in Phrase TMS, refer to [WordPress (TMS)](https://support.phrase.com/hc/en-us/articles/5709657294620#UUID-63aa2730-0d12-1bbd-2955-224b36b30b81).

The plugin allows pushing and pulling of handle headers and content to projects from within WordPress 5.5 or higher and the WordPress Block Editor. The plugin can be used with Polylang and WPML but not Multilingual Press. The plugin provides a warning and confirmation if source content has been changed since the last pull.

The plugin supports localizing posts and pages (post types built in WordPress) but does not support custom post types.

Do not alter HTML tags in imported content as it may cause issues when pulled back into WordPress.

#### Install the Plugin

To install the plugin, follow these steps:

1. Download the [plugin](https://github.com/phrase/phrase-wordpress/releases/latest/download/phrase.zip).
2. From the Plugins tab in WordPress, click Add New.

   The Add Plugins page opens.
3. Click Upload Plugin.
4. Select the downloaded plugin file (*phrase.zip*) and click Install Now.

   WordPress installs the plugin.
5. Click Activate Plugin.

   A Phrase tab is now visible on the left hand menu.
6. Click the Phrase tab and provide an API Access Token with read and write scopes.
7. Click Save Settings.

   The plugin is authenticated with Phrase.

The plugin can now be accessed from the three dot menu in the top right corner of the WordPress application and can be set to be visible in the navigation bar and editing view.

#### Push and Pull Content

To push content, follow these steps:

1. From the plugin menu in WordPress, Select the project the synchronize with from the dropdown menu.
2. Select the language the page is written in from the dropdown menu.
3. Click Push content.

   Page content has been uploaded to Phrase.

Content can now be used to create a job or opened directly in the translation editor.

To pull translations back, select the language to be pulled and click Pull translations. The translated version of the page is now available as a separate page.

Translation progress is presented in the Pages or Posts overviews in WordPress.

---

### GitLab (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784105050012-GitLab-Strings  
> Zuletzt aktualisiert: 2026-08-11T06:14:08Z  
> Labels: 2BTr, ar_strings

##### Tip

For information about GitLab integration in Phrase TMS, refer to [GitLab (TMS)](https://support.phrase.com/hc/en-us/articles/5709668128796#UUID-9080c15e-f184-4520-1c33-257442b37bd2).

#### Prerequisites

- The `.phrase.yml` [configuration](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) file must be present in the root of the branch to be monitored. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.
- Use [GitLab 9.5](https://about.gitlab.com/install/) or newer to ensure API compatibility.

#### Connect Repositories

Once the configuration file is in place, to connect a repository, follow these steps:

1. In the main navigation, click Automations, then Repo Syncs.

   Alternatively, from the Integrations page, scroll down to Repo Sync and click Configure.

   The Repo Syncs page opens. The Repo Syncs list displays only projects the viewing user has access to.
2. Click Add Sync/GitLab.

   The GitLab sync settings window opens.
3. Select a project from the dropdown list.
4. Optionally select Self-hosted instance and provide the GitLab self-hosted API endpoint.
5. Provide a personal [project access token](https://docs.gitlab.com/user/profile/personal_access_tokens/) with an API scope.
6. Select a GitLab repository from the dropdown list.
7. Select a Repository branch from the dropdown list to import (push) and export (pull) from. This is usually the master branch.
8. Click Validate Configuration to ensure access token and configuration file are correct.
9. Optionally select Auto import to import files with every commit to the selected GitLab branch.

   Provide a URL for the [webhook](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html) and the Secret token copied from Strings.
10. Click Save.

    The project is now connected to the selected GitLab repository and added to the list.
11. (Optional) Click the pencil icon to rename the integration.

#### Import and Export Files

To import files:

- From the Repo Syncs page, select a project and click Import ![Sync Import](https://support.phrase.com/hc/article_attachments/30682364004380).

  GitLab data is imported into the selected project.

To export files, follow these steps:

1. From the Repo Syncs page, select a project and click Export ![Sync Export](https://support.phrase.com/hc/article_attachments/30682349332380).

   The Export window is displayed.
2. Provide the target branch in the PR branch field.

   The most recent files in the repository will be exported as a new pull request to the desired branch.
3. Once files are exported, the pull request can be merged or closed in the repository and the branch can be deleted.

##### Note

In case of issues upon importing or exporting, use the [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828) client to test the `.phrase.yml` configuration file locally and check for any error messages.

If required, [contact Phrase Technical Support](https://support.phrase.com/hc/en-us/articles/5784099168284#UUID-e4850ff4-2767-84b5-3d18-4f0f40e3072d) and attach the `.phrase.yml` configuration file to the support request.

#### History

Repo syncs keep a history of the latest imports and exports for each Phrase Strings project.

To view the history:

- From the Repo Syncs page, select a project and click History ![Sync History](https://support.phrase.com/hc/article_attachments/30682378367388).

  The import and export history for the project is presented. Export entries in the history include a link to the corresponding merge request.

---

### GitHub (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784125562012-GitHub-Strings  
> Zuletzt aktualisiert: 2026-09-17T06:16:09Z  
> Labels: 2BTr, ar_strings

##### Tip

For information about GitHub integration in Phrase TMS, refer to [GitHub (TMS)](https://support.phrase.com/hc/en-us/articles/5709656771356#UUID-59be0e6b-918d-2c99-67d5-9ead10cab859).

Phrase Strings integrates with GitHub repositories to synchronize localization files between Phrase and GitHub.

By default, repositories are connected using a GitHub OAuth App. Personal access tokens are also supported and are mainly intended for self-hosted instances or environments where OAuth App installation is not possible.

#### Prerequisites

- The `.phrase.yml` [configuration](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) file must be present in the root of the branch to be monitored. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.
- [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps):

  - The GitHub OAuth App must be installed in the GitHub organization or account that owns the repository.
  - The repository must be included in the OAuth App installation.
  - Permissions to install or authorize GitHub Apps are required in the target organization or account.
  - Supports connecting a Strings account to multiple GitHub organizations. Select which GitHub organization is synced in the integration configuration. There is no hard limit on the number of organizations that can be connected.
- [GitHub access token](https://github.com/settings/tokens):

  - Classic tokens

    Requires the repo scope (`public_repo` if synchronizing with a public repository)
  - Fine-grained tokens

    Requires the following permissions:

    - Contents: Read and write
    - Pull requests: Read and write
  - Ensure repository settings do not require signed commits.
- If SSO is enabled in GitHub, it must also be enabled for the access token.
- The *phrase\_translations* branch cannot be protected.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/vzUp_e1Ps0w)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

#### Connect Repositories

Once the configuration file is in place, to connect a repository, follow these steps:

1. In the main navigation, click Automations, then Repo Syncs.

   Alternatively, from the Integrations page, scroll down to Repo Sync and click Configure.

   The Repo Syncs page opens. The Repo Syncs list displays only projects the viewing user has access to.
2. Click Add Sync/GitHub.

   The GitHub sync settings window opens.
3. Select a project from the dropdown list.
4. Select the authentication method:

   - GitHub App (recommended)

     If the GitHub App is not yet installed, click Authenticate. Authentication is performed once and can be reused for multiple repository syncs.

     If the GitHub App is already installed, click Manage installation to complete the app installation for the target organization or account. Repository access is managed at the organization or account level and is not tied to an individual GitHub user.
   - Personal access token

     Provide a personal [Repo access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with an API scope.

     When using a personal access token, repository access depends on the GitHub user who created the token.
   - Self-hosted instance

     Provide the GitHub self-hosted API endpoint and a personal [Repo access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) with an API scope.

   If the target repository requires verified (signed) commits, the GitHub App authentication method should be used. Commits pushed using a personal access token are not signed, so the sync fails with the following error: "The repository requires verified (signed) commits."
5. If GitHub App is used, select Connected GitHub organization from the dropdown list. The repository list loads based on that selection.
6. Select a GitHub repository from the dropdown list.
7. Select a Repository branch from the dropdown list to import (push) and export (pull) from. This is usually the master branch.
8. Optionally, provide a branch name for the pull request. If left empty, a branch will be created with the default value phrase-translations.
9. Click Validate Configuration to ensure authentication settings and configuration file are correct.
10. Optionally select an Import behavior option to determine when new or updated files are automatically imported in the project.
11. Click Save.

    The project is now connected to the selected GitHub repository and added to the list.
12. (Optional) Click the pencil icon to rename the integration.

#### Import Files

Ensure the push commands are correctly configured within the `.phrase.yml` [configuration](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) file. Push options are the same as for the `uploads` API endpoint.

To import files:

- From the Repo Syncs page, select a project and click Import ![Sync Import](https://support.phrase.com/hc/article_attachments/30682395067676).

  Language files (defined as push source entries in the configuration file) are imported into the project.

  A default locale must be present.

  ### Note

  In case of issues upon importing, use the [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828) client to test the `.phrase.yml` configuration file locally and check for any error messages.

  If required, [contact Phrase Technical Support](https://support.phrase.com/hc/en-us/articles/5784099168284#UUID-e4850ff4-2767-84b5-3d18-4f0f40e3072d) and attach the `.phrase.yml` configuration file to the support request.

#### Export Files

Ensure the pull commands are correctly configured within the `.phrase.yml` [configuration](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) file. Pull options (e.g. `include_empty_translations` parameter) are the same as for the `locales download` API endpoint.

To export files:

1. From the Repo Syncs page, select a project and click Export ![Sync Export](https://support.phrase.com/hc/article_attachments/30682378487836).

   The Export window is displayed.
2. Provide the target branch in the PR branch field.

   The most recent files in the repository will be exported as a new pull request to the desired branch.
3. Once files are exported, the pull request can be merged or closed in the repository and the branch can be deleted.

##### Note

In case of issues upon exporting, use the [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828) client to test the `.phrase.yml` configuration file locally and check for any error messages.

If required, [contact Phrase Technical Support](https://support.phrase.com/hc/en-us/articles/5784099168284#UUID-e4850ff4-2767-84b5-3d18-4f0f40e3072d) and attach the `.phrase.yml` configuration file to the support request.

#### History

Repo syncs keep a history of the latest imports and exports for each Phrase Strings project.

To view the history:

- From the Repo Syncs page, select a project and click History ![Sync History](https://support.phrase.com/hc/article_attachments/30682395129372).

  The import and export history for the project is presented. Export entries in the history include a link to the corresponding merge request.

---

### Bitbucket (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784101504924-Bitbucket-Strings  
> Zuletzt aktualisiert: 2026-08-11T06:14:10Z  
> Labels: 2BTr, ar_strings

##### Tip

For information about Bitbucket integration in Phrase TMS, refer to [Bitbucket Cloud (TMS)](https://support.phrase.com/hc/en-us/articles/5709653950492#UUID-5150c835-7b8a-2f82-bf92-51418bdb7b10).

- Bitbucket Sync is only supported for Bitbucket Cloud. It cannot be used with Bitbucket Server.
- Bitbucket Sync can be used via [API](https://developers.phrase.com/api/#get-/accounts/-account_id-/repo_syncs).

#### **Prerequisites**

- The `.phrase.yml` [configuration](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) file must be present in the root of the branch to be monitored. The file defines which files to import (pull) or export (push) from the repository.
- Read and write access are required for the repository.
- Incorrectly defined configuration files may cause errors. Ensure that the file contains at least one push and one pull target, correct file formats and the correct setting of the `update_translations` parameter.

Sample configuration file:

```
phrase:
    project_id: 1f61b9ecdb7a17a9dd174302419c50cc
    file_format: simple_json
    push:
        sources:
            - file: ./<locale_name>.json
    pull:
        targets:
            - file: ./<locale_name>.json
```

Project ID of a project is found in project settings.

#### Connect Repositories

Once the configuration file is in place, to connect a repository, follow these steps:

1. In the main navigation, click Automations, then Repo Syncs.

   Alternatively, from the Integrations page, scroll down to Repo Sync and click Configure.

   The Repo Syncs page opens. The Repo Syncs list displays only projects the viewing user has access to.
2. Click Add Sync/Bitbucket.

   The Bitbucket Sync activation page opens.
3. Select the Bitbucket account to be connected from the Authorize for workspace dropdown list and click on Grant access.

   The connection between Phrase Strings and the selected Bitbucket account is established. The Bitbucket sync settings window is displayed.

   ### Note

   It is not possible to connect multiple accounts via the Bitbucket integration.
4. Select a project from the dropdown list.
5. Select a Bitbucket repository from the dropdown list.

   If repository ownership is not correct, the repository will not be visible in the dropdown list.
6. Select a Repository branch from the dropdown list to import (push) and export (pull) from. This is usually the master branch.
7. Click Validate Configuration to ensure authentication settings and configuration file are correct.
8. Optionally select Auto import to import files with every commit to the selected Bitbucket branch.
9. Click Save.

   The project is now connected to the selected Bitbucket repository and added to the list.
10. (Optional) Click the pencil icon to rename the integration.

Integrations can be deactivated or removed from the Repo Syncs page.

Optionally, users can remove a Bitbucket integration by revoking the authorization for Phrase Strings in their [Bitbucket personal settings](https://bitbucket.org/account/settings/app-authorizations/).

#### Import from Bitbucket

After activating Bitbucket Sync and connecting a repository, locale files can be imported. This is done in the form of pull requests, so changes can be reviewed, and branch management can be controlled.

To import locale files from Bitbucket, follow these steps:

1. From the Repo Syncs page, select a project and click Import ![Sync Import](https://support.phrase.com/hc/article_attachments/30682378567068).

   Translations are pulled into the project. Keys and current translations are updated.
2. Approve, merge or close the pull request in Bitbucket.

#### Export to Bitbucket

To export locale files to Bitbucket, follow these steps:

1. From the Repo Syncs page, select a project and click Export ![Sync Export](https://support.phrase.com/hc/article_attachments/30682395197340).

   The Export window is displayed.
2. Provide the target branch in the PR branch field.

   The most recent files in the repository will be exported as a new pull request to the desired branch.
3. Once files are exported, the pull request can be merged or closed in the repository and the branch can be deleted.

   Each exported language results in a separate commit within the pull request. Consolidating all exported languages into a single commit is not currently supported for Bitbucket, unlike the GitHub integration.

#### History

Repo syncs keep a history of the latest imports and exports for each Phrase Strings project.

To view the history:

- From the Repo Syncs page, select a project and click History ![Sync History](https://support.phrase.com/hc/article_attachments/30682349638684).

  The import and export history for the project is presented. Export entries in the history include a link to the corresponding merge request.

---

### Webhooks (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784125630620-Webhooks-Strings  
> Zuletzt aktualisiert: 2025-08-25T07:13:17Z  
> Labels: 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Webhooks notify external services such as chat clients or other external APIs of events. A webhook can set a URL when a specific event takes place.

##### Important

File uploads only trigger the `uploads:create` and `uploads:processing` webhook events.

`keys:create`, `keys:update`,  `translations:create` and `translations:update` webhook events are not triggered by file uploads or automated imports via:

- Repo Syncs ([GitHub](https://support.phrase.com/hc/en-us/articles/5784125562012#UUID-9ea1760e-1bd7-cdfd-91b5-bedbda3ace8d "GitHub (Strings)"), [GitLab](https://support.phrase.com/hc/en-us/articles/5784105050012#UUID-4ddf8f90-751d-d7fb-c240-31fafb91fad8 "GitLab (Strings)"), [Bitbucket](https://support.phrase.com/hc/en-us/articles/5784101504924#UUID-0bc4a9ca-74c6-ab77-bb70-bd5ef547d444 "Bitbucket (Strings)") integrations)
- [CLI](https://support.phrase.com/hc/en-us/articles/5808300599068#UUID-9439325a-ecf6-2f99-2c1e-1bf8197c757d) push
- [Figma](https://support.phrase.com/hc/en-us/articles/5819515701916#UUID-aa12089b-60b8-6507-78b2-281c092022bb "Figma (Strings)") plugin

There is a 30-day retention period for webhook history.

#### Webhook response

A webhook endpoint must return an HTTP status code in the 200–299 range within 5 seconds of receiving a callback. Other status codes and request timeouts are considered to be delivery failures. A webhook will be deactivated if delivery fails for more than 10 consecutive events. Callbacks are not repeated.

If receiving a callback, respond within the 5-second request timeout period. To ensure applications don’t accidentally trigger a timeout, defer processing until after the HTTP response has been sent.

#### Webhook request integrity

Each webhook request includes an `X-PhraseApp-Signature` header which is generated using the webhook verification token as a secret along with the data sent in the request. Verify the request origin by computing the HMAC digest of the request body and comparing it to the value in the `X-PhraseApp-Signature` header.

Examples:

**Ruby**

```
def verify_webhook(signatureheader)
  digest = OpenSSL::Digest::Digest.new('sha256')
  hmac = OpenSSL::HMAC.digest(digest, VERIFICATION_TOKEN, request.body)
  hmac = Base64.encode64(hmac).strip
  hmac == signatureheader
end
```

**PHP**

```
function verify_webhook($signatureheader){
  $hmac = hash_hmac('sha256', $requestBody, $verificationToken, true);
  $hmac = trim(base64_encode($hash));
  return $hmac == $signatureheader;
}
```

#### Webhook Events

The structure of each webhook payload is defined in a schema file available at [https://app.phrase.com/webhook\_schemas/](https://app.phrase.com/webhook_schemas/user.json)<event\_underscored\_name>.json where `<event_underscored_name>` corresponds to the name of the webhook event with underscores.

`branches:create` can be accessed via <https://app.phrase.com/webhook_schemas/branches_create.json>

| Event name | Description |
| --- | --- |
| `branches:create` | A branch was created. |
| `branches:merge` | A branch was merged. |
| `comments:create` | A comment on a translation key was added. |
| `custom_metadata_values:batch_update` | A custom metadata field value has been updated in multiple keys. |
| `custom_metadata_values:update` | A custom metadata field value has been updated at the key level. |
| `jobs:complete` | A job was marked as complete. |
| `jobs:create` | A job is created. |
| `jobs:locale:complete` | A locale of a job was marked as completed. |
| `jobs:locale:reopened` | A locale of a job was reopened. |
| `jobs:locale:review:complete` | A locale of a job was reviewed and marked as complete. |
| `jobs:locale:review:reopen` | A locale of a job was reviewed and reopened. |
| `jobs:reopened` | A job was reopened. |
| `jobs:start` | A job was started. |
| `jobs:update` | A job is updated. |
| `keys:batch_delete` | Multiple keys were deleted. |
| `keys:create` | A key was created. |
| `keys:delete` | A key was deleted. |
| `keys:tags:batch_create` | Tags were added to multiple keys. |
| `keys:tags:create` | Tags were added to a key. |
| `keys:update` | A key was renamed or changed. |
| `locales:create` | A new language version was created in a project. |
| `locales:delete` | A language version was deleted. |
| `locales:update` | A language version was changed, renamed or reconfigured. |
| `project:update` | A project was changed or reconfigured. |
| `releases:create` | An OTA release has been created. |
| `releases:delete` | An OTA release has been deleted. |
| `screenshots:create` | A screenshot was created. |
| `screenshots:delete` | A screenshot was deleted. |
| `screenshots:update` | A screenshot was changed or renamed. |
| `translations:batch_delete` | A list of translations has been deleted. |
| `translations:batch_include` | A list of translations has been included. |
| `translations:batch_review` | A list of translations has been reviewed. |
| `translations:batch_unreview` | A list of translations has been unreviewed. |
| `translations:batch_unverify` | A list of translations has been unverified. |
| `translations:batch_verify` | A list of translations has been verified. |
| `translations:create` | A translation of a key in a certain language version was added. |
| `translations:deliver` | A translation of a key in a certain language version was delivered by a language service provider. |
| `translations:exclude` | A translation of a key in a certain language version was excluded. |
| `translations:include` | A translation of a key in a certain language version was included. |
| `translations:review` | A translation of a key in a certain language version was reviewed. |
| `translations:unreview` | A translation of a key in a certain language version was unreviewed. |
| `translations:unverify` | A translation of a key in a certain language version was unverified. |
| `translations:update` | A translation of a key in a certain language version was edited. |
| `translations:verify` | A translation of a key in a certain language version was verified. |
| `uploads:create` | A locale file was successfully processed. |
| `uploads:processing` | A locale file is being processed. |

#### Add a Webhook

To add a webhook, follow these steps:

1. From the Integrations page, scroll down to Webhooks and click Configure.

   The Webhooks page opens.
2. Click Add webhook.

   The Add webhook window opens.
3. Provide webhook details.
4. Optionally Include branches.
5. Click Save. The specified webhook is added the list on the Webhooks page.

A webhook can be deactivated from the More menu of a specific webhook.

#### Test a Webhook

To test a webhook:

- From the Webhooks page, select a webhook and select Send Test-Notification from the More menu.

  A notice is presented indicated the test was successful.

Use a service such as [RequestBin](https://requestbin.com/) to capture the contents of a webhook. RequestBin provides a URL that collects request data for inspection.

#### Using Webhook Data

A POST request is sent to the specified callback URL each time an event of the specified type occurs. The request’s POST payload is a JSON-encoded document with relevant data for the event. The attributes `event`, `message` and `sent_at` will always be included, along with additional attributes relevant to the event such as the *user*, *project* and *branch* the webhook was triggered from.

###### Reponse headers

HTTP requests made to the callback URL will contain several special headers.

- `X-PhraseApp-Event`: The type of event that triggered the webhook.
- `X-PhraseApp-Signature`: The HMAC hex digest of the payload, using the hook's secret as the key.

Example:

```
Content-Type: application/json
X-PhraseApp-Event: translation:create
X-PhraseApp-Signature: abc123

{
  "event": "translations:create",
  "message": "Peter translated page.help.title in fr.",
  "sent_at": "2015-01-29T09:52:53Z"   
  "user": {
    "id": "abcd1234cdef1234abcd1234cdef1234",
    "username": "joe.doe",
    "name": "Joe Doe",
    "email": "joe@phrase.com",
    "position": "Lead Developer",
    "created_at": "2015-01-28T09:52:53Z",
    "updated_at": "2015-01-28T09:52:53Z"
  },
  "project": {
    "id": "abcd1234cdef1234abcd1234cdef1234",
    "name": "My Android Project",
    "main_format": "xml",
    "project_image_url": "http://assets.phrase.com/project.png",
    "account": "account",
    "created_at": "2015-01-28T09:52:53Z",
    "updated_at": "2015-01-28T09:52:53Z"
  },
  "branch": {
  "name": "branch_name"
  },
  "translation": {
    "id": "abcd1234cdef1234abcd1234cdef1234",
    "content": "My translation",
    "unverified": false,
    "excluded": false,
    "plural_suffix": "",
    "key": {
      "id": "abcd1234cdef1234abcd1234cdef1234",
      "name": "home.index.headline",
      "plural": false
    },
    "locale": {
      "id": "abcd1234cdef1234abcd1234cdef1234",
      "name": "de",
      "code": "de-DE"
    },
    "placeholders": [
      "%{count}"
    ],
    "created_at": "2015-01-28T09:52:53Z",
    "updated_at": "2015-01-28T09:52:53Z"
  }
}
```

---

### Slack (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5809166413340-Slack-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:22:42Z  
> Labels: 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

When a dedicated Slack channel is set up, at least one status notification is enabled and notifications are presented in the Slack channel. Clicking on the reply button loads the referenced location.

The following events can trigger status notifications:

- New job started

  Triggers a notification when a new localization job is initiated in Phrase Strings.
- New comments on job

  Triggers a notification when someone adds a new comment to a localization job.
- Due in 1 day

  Triggers a notification when a localization job is approaching its deadline, with one day left to complete it.
- Job completed

  Triggers a notification when a localization job has been completed.

#### Setup the integration

To setup the integrations, follow these steps:

1. From the Integrations page, scroll down to the Slack integration connector and click Configure.

   The Slack integration configuration page opens.
2. Click Add channel.

   The Slack authorization page opens.
3. Select a channel from the dropdown list and click Allow.

   The configuration page for the selected channel opens.
4. Select a frequency for notifications for the available events:

   - Instant: Notifications sent in real-time.
   - Every 4 hours: Notifications sent in a batch.
   - Daily: Notifications sent once daily
   - Never: The specific notification is switched off and notifications are not sent.

Selections are applied immediately and the channel is added to the list on the Slack integration page.

Configurations can be changed from the Slack Integration page and channels can be deleted by selecting Remove channel from the More menu.

---

### Figma (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819515701916-Figma-Strings  
> Zuletzt aktualisiert: 2026-09-01T06:15:31Z  
> Labels: 2BTr, ar_strings

#### Available for

- All paid plans

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

##### Tip

For information about Figma integration in Phrase TMS, refer to [Figma (TMS)](https://support.phrase.com/hc/en-us/articles/5709627523356#UUID-7209878d-22a1-fead-c469-a4207a97114b).

The Figma plugin allows design content to be integrated with Phrase projects, bridging the gap between product design and localization teams. The plugin supports content pushing, pulling translations, and managing keys between Figma and Phrase Strings.

- [Branching](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-1d712385-b029-e295-7ca3-af71d70d59e7) is supported.
- Access to at least one project and one language with Translator user rights is required. Access can be granted by having an [invitation](https://support.phrase.com/document/preview/57801#UUID-86d1fa5d-b590-2cb7-b3fe-2ed77e8be239) sent by an [Administrator or Project manager](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452).
- The plugin will send screenshots of auto-layout frames that are not child elements.
- By default, hidden text layers are not included in the integration. This can be changed in the settings ![Setup_gear.png](https://support.phrase.com/hc/article_attachments/30682364484636) by selecting Include hidden layers or frames in selection.
- By default, selected tags in the plugin are cleared after the push process. This can be changed in the settings ![Setup_gear.png](https://support.phrase.com/hc/article_attachments/30682364484636) by disabling the Clear tags after push option.
- Any changes made to the default settings ![Setup_gear.png](https://support.phrase.com/hc/article_attachments/30682364484636) of the plugin will be saved and remain persistent.

#### Install and Connect the Figma Plugin

To run the plugin, select it from inside Figma's plugin browser or from the [Figma Community](https://www.figma.com/community/plugin/803669834214399971) and click Try it out. The plugin will become available in the Figma Plugins menu.

The connection from Figma to Phrase can be made with Phrase credentials, an [access token](https://support.phrase.com/hc/en-us/articles/5808341130268#UUID-101fb304-22d4-0948-05a2-a58c02dce152) or a single sign-on (SSO).

To sign in with SSO:

1. On the plugin login screen, select Sign in with SSO.
2. Enter the organization ID.
3. Complete the login in the browser tab that opens.

   Return to the plugin, already authenticated.

When the connection is made, selecting a frame loads a preview of the Figma content and keys that users can push to or pull from Phrase Strings.

The Connect keys tab will allow connecting Figma layers to keys already existing in a Strings [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252). If the [naming convention](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) is the same for both the layers and the keys, they can be automatically matched.

The plugin is accessible through dedicated buttons in the Figma sidebar:

- Phrase Strings

  Click to open the plugin.
- View text in Strings

  Displayed in Figma files connected to a Strings project. Click to open the relevant project in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).

#### Push Content

The Push content to Phrase tab allows sending frames or text layers from Figma to Phrase Strings for localization. It is not possible to push content to a protected main branch.

Select the project, [branch](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-1d712385-b029-e295-7ca3-af71d70d59e7) (if being used), and language for the content being pushed. Optionally, enter a custom [tag](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-e647235a-f7a4-26cf-82ce-f172f3330193) to add to the uploaded keys.

Empty or duplicated key names are flagged with a red counter in the Content column. To manage long lists of key names, use the Sort by ![Sort Filter](https://support.phrase.com/hc/article_attachments/30682364529564) dropdown to display Incomplete key names first or Duplicated key names first.

##### Note

The selected sorting option will be remembered for future sessions.

The Push to Phrase button is disabled if key name inputs are empty, contain invalid characters, are not unique if a protected main branch is selected.

Select the Work with key names setting to edit key name inputs and resolve any naming conflicts. If needed, select the desired keys and click Exclude layers at the top of the table to remove those layers from the plugin.

If there are disconnected layers with conflicting key names, select one of the available resolution options to proceed:

- Create key copies in Phrase Strings

  Creates new keys with `-copy` suffix.
- Connect with existing keys

  Links layers to existing Phrase keys.
- Don't push conflicting keys

  Pushes non-conflicting layers only.

When the Upload Figma preview option is enabled:

- Users can optionally select which target languages to include in the Figma preview. If no languages are selected, all languages are included by default.
- The plugin creates one job per root frame (or top-level component) included in the push. Pushing an entire Figma page with many top-level frames will generate a correspondingly large number of jobs. To keep the job count proportional to the actual scope of translation work, select only the specific frames containing new or updated content before pushing.

If layers are successfully pushed to Strings, the Push completed window is displayed with a summary and the following options:

- Create [job](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812)

  Click to open the Create a job page with the pushed keys pre-selected.

  ### Important

  If the Upload Figma preview option is enabled, a job is created automatically in Strings. Once enabled, this cannot be disabled.
- Open in Strings

  Click to view the pushed keys in the Strings Editor.

A yellow warning icon ![Warning](https://support.phrase.com/hc/article_attachments/30682366204060) appears next to keys whose names have been changed in Strings after pushing content. To update key names in the Figma plugin, select Sync key name from the ellipsis ![More Menu](https://support.phrase.com/hc/article_attachments/30682378943132) menu next to the mismatched key name.

###### Push options and actions

Click the View options ![More Menu](https://support.phrase.com/hc/article_attachments/30682395614620) menu to toggle on and off the following push options as required:

- Upload screenshots is enabled by default. It allows attaching a screenshot of the selected layers within the frame:

  - If the Include hidden layers or frames in selection setting is enabled, hidden text layers imported with the Figma plugin will have a marker placed in the top left corner of the screenshot.
  - When the Exclude sections from screenshots setting is enabled, screenshots of Figma sections will not be created.

    It is recommended to keep this option enabled in case of performance issues with the plugin while working inside sections.
  - Enable Capture only the closest screenshot to scope each screenshot to the nearest containing frame, component, instance, or section around a text layer, instead of the outermost top-level ancestor. All text layers inside that container receive markers, including layers outside the current selection.

    This option is off by default. Use it when Exclude sections from screenshots does not sufficiently limit capture to a specific nested frame, resulting in oversized, low-context screenshots.
- Update content in Phrase Strings is enabled by default.
- Update key names in Phrase Strings is enabled by default, unless the Work with key names in Figma setting is disabled.

  Toggling this option off resets all key name inputs.
- Enable Upload Figma preview to export an HTML bundle from the selected keys.

  This option is required to generate [in-context preview](https://support.phrase.com/hc/en-us/articles/5709664002076#UUID-ac361633-18bb-a420-d5c2-4e11bc726b7f) in the TMS CAT editor when working with [jobs synced](https://support.phrase.com/hc/en-us/articles/5709647502620#UUID-776d5a52-a0f8-d5c1-10b7-60bb343ef950) from Strings.

  Users can optionally select which target languages to include in the Figma preview when pushing content. If no languages are selected, all languages are included by default.

  If the preview is generated successfully, a job is created automatically in Strings. Any active [job automation](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) in the Strings project will be skipped to avoid duplicate jobs.

  If the preview exceeds the 10 MB limit, the keys are still pushed to Strings, but no job with a preview is created.

  ### Note

  To work with Figma previews in the Strings editor, use the Add Figma preview action in the [contextual sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29).
- Enable Preserve content formatting & styling to keep rich text formatting (such as lists, line breaks, bold/italic, and links) when pushing content from Figma to Phrase and pulling translations back.

  If enabled, HTML formatting tags are automatically added to preserve inline styling and are supported in the TMS in-context preview when working with [jobs synced](https://support.phrase.com/hc/en-us/articles/5709647502620#UUID-776d5a52-a0f8-d5c1-10b7-60bb343ef950) from Strings. The HTML formatting tags appear in the Strings editor and in exported translations pulled back into Figma.

  Disable this option if rich formatting is unnecessary to avoid manual adjustments.

  The setting applies at the file level and affects all collaborators working in the file. This option is remembered for new files.

For [connected layers](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-0efd4bfc-95a3-8807-8ff0-545c53fe7d90 "Connect or Disconnect Keys"), the following actions are available in the relevant ellipsis ![More Menu](https://support.phrase.com/hc/article_attachments/30682378943132) menu:

- Select View key details to view/edit the key description in Phrase Strings or set a character limit for the key. Any changes saved in the Key details window will appear in the [Strings editor sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29) after refreshing the editor page.

  ### Tip

  Select multiple keys in the  Push content to Phrase tab and use the batch action Set character limit to set a character limit for all selected keys at once.
- Select Open key in editor to navigate to the related key in the Strings editor.
- Select Disconnect content from Phrase Strings to disconnect the layer from an existing key.

###### Manage duplicated content

When pushing content, layers with duplicated content will generate multiple keys in Strings containing exactly the same text. Users can decide how to manage this duplicated content in the Push content to Phrase window:

- Select Proceed without merging if creating multiple keys with duplicated content is intentional.
- To merge some duplicated content into a single key, follow these steps:

  1. Select two or more keys from the list and click ![Merge](https://support.phrase.com/hc/article_attachments/30682366339996) Merge to a key...

     A dropdown with available keys for merging is displayed.
  2. Select the key to merge the duplicated content into.

     The selected key is marked with a blue merge icon ![Merge to a Key](https://support.phrase.com/hc/article_attachments/30682379036188) in the Push content to Phrase window.
  3. Click Proceed, then confirm by selecting Merge and Push in the Merge duplicated content popup.

     The duplicated content is merged into a single key, and all associated layers are connected to that key.
- To merge some or all duplicated content into the first key of the list, follow these steps:

  1. Select multiple or all keys from the list and click ![Merge](https://support.phrase.com/hc/article_attachments/30682366339996) Merge all duplicates into first key.
  2. Click Proceed, then confirm by selecting Merge and Push in the Merge duplicated content popup.

     The duplicated content is merged into a single key, and all associated layers are connected to that key.

  This option is useful for large files with many duplicates, allowing users to merge all duplicates into the first key found in a single action, instead of handling each one individually.

Duplicating a frame or text layer in Figma also duplicates any existing connection to a Phrase Strings key. If the duplicated layer is reused for new, unrelated copy and pushed without disconnecting it first, the push updates the source text of the existing key instead of creating a new one. Updating a key's source text does not clear or refresh the target language translations already stored on that key, so pulling the layer afterward returns the translation associated with the previous content, not the newly pushed copy.

Before pushing content from a duplicated or reused frame or text layer, check the Push content to Phrase tab to confirm whether the layer is already connected to a key. If it is connected and the new copy is unrelated to the previous content, disconnect the layer first so the plugin creates a new key instead of overwriting the existing one.

#### Auto-Exclude Layers

The Auto-exclude layers setting removes text layers from the Push content to Phrase tab based on their name prefix. When enabled, any layer prefixed with `_` or `.` is excluded automatically.

The setting is off by default and applies per file. It is enabled for all named layers in that file until turned off.

Exclusions persist across selections. For components, if the component's layers are prefixed and Auto-exclude layers is enabled, downstream designs using that component inherit the exclusion.

To auto-exclude prefixed layers from Push:

1. In Figma, prefix the text layers to exclude with `_` or `.`. This can also be done in a batch.
2. Open Plugin settings and enable Auto-exclude layers.

#### Configure Key Naming

The Key naming section of the plugin settings ![Setup_gear.png](https://support.phrase.com/hc/article_attachments/30682364484636) allows setting up the naming convention for connected keys.

To customize key names in Figma, follow these steps:

1. Click Enable smart key naming from the Key naming settings.
2. Select Work with key names in Figma.

   ### Note

   If Synchronize text layer names with keys is enabled, key names are automatically generated based on text layer names.
3. In the Key name generation field, enter text to define custom key naming:

   - Optionally, click Available macros to select one of the [supported macros](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_bridgehead-idm4535420661008034289598898645 "Available macros") to generate key names automatically.

     Multiple macros can be selected to compose the key name.
   - It is possible to combine free text and macros in the Key name generation field.

     Click Examples to display and choose one of the predefined examples.
4. If required, select a formatting option from the Formatting convention dropdown to modify text accordingly and remove spaces.

When [pushing content](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-80f7a41e-7755-277a-3e5a-885bb0aea3fe) to Phrase Strings, apply the newly created naming convention to previously connected keys by either:

- Clicking the refresh ![Refresh List](https://support.phrase.com/hc/article_attachments/30682364762908) icon at the bottom of the table.
- Selecting specific keys and clicking Regenerate key names at the top of the table.

###### Available macros

| Macro | Description |
| --- | --- |
| {file\_name} | The name of the Figma file |
| {page} | The Figma page where the key is identified |
| {parent\_section} | The highest level section in the page tree |
| {nearest\_section} | The section closest to the text layer in the page tree |
| {frame} | The frame where the key is identified |
| {parent\_group} | The highest level group in the page tree |
| {nearest\_group} | The group closest to the text layer in the page tree |
| {component} | The name of the Figma component where the key is located. Only source components are considered. |
| {element\_name} | The name of the text layer |
| {element\_content} | The content from the text layer |
| {random} | A randomly generated unique short hash |

#### Connect or Disconnect Keys

When pushing content, users can connect layers to existing keys in Phrase Strings or generate new ones.

Select the Connect keys tab to display an overview of connected and disconnected keys.

Keys that are already connected are identified with a link ![Connected Key](https://support.phrase.com/hc/article_attachments/30682346907932) icon in the Key name column. If necessary, select the project, branch (if being used) and language, or click the search icon to find the desired content.

Select Connect keys to bulk connect all unlinked keys in the tab. To connect or disconnect individual keys, click the relevant icon at the right of the corresponding entry.

##### Note

The option to disconnect individual keys is also available in the [Push content](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-08986c05-0538-da02-c36e-e9dc489562d1 "Push Content") to Phrase tab.

#### New Connect View (Beta)

The new view lists text layers from the current selection with their connection status in a single table, replacing the previous key-based list.

##### Note

Restart the plugin before enabling the beta to ensure the latest version is loaded.

To enable the New connect view:

1. Open the plugin and click the Settings icon.
2. Under Plugin settings, enable Use new connect view (Beta).
3. Open the Connect keys to see the list of connected content.

The previous Connect view remains available. Disable Use new connect view in plugin settings to revert.

To connect a single layer, select it to open a window with two tabs:

- **Suggestions**: displays keys with exact name matches and keys with matching translation content.
- **Search**: search all keys by name or content.

To act on multiple layers, select them to reveal a batch action tray:

- **Connect by key name**: connects layers to keys with exact name matches.
- **Connect by content**: connects layers to keys with matching translation content
- **Disconnect layers**: removes connections from the selected layers.

###### Skip Layers with Multiple Matching Keys

The Skip layers with multiple matching keys toggle controls how Connect by content handles layers whose text matches more than one key.

To enable the toggle:

1. Open the plugin and go to the Connect tab.
2. Click ![More Menu](https://support.phrase.com/hc/article_attachments/30682395614620) in the navigation to open view options.
3. Enable Skip layers with multiple matching keys.

When enabled, any layer matching more than one key is skipped during Connect by content and left unconnected for manual review.

###### Post-Action Summary

After each Connect by content or Connect by key name batch run, a results window displays the outcome:

- Connected count
- Skipped—no match found
- Skipped—multiple matches (displayed when Skip layers with multiple matching keys is on)

Click Show unconnected layers to filter the table to layers that still need attention, or Done to close the results window.

#### Manage Plural Keys

Marking a text layer as a plural key connects it to the plural forms of that key in Phrase Strings. For a plural key, the Content column displays a form-selector dropdown instead of the key's content, listing the forms available for the selected language, for example `one` and `other`. Languages with more complex plural rules, such as Polish, expose up to five forms.

The dropdown appears in both the Push content to Phrase and Pull content to Figma tabs.

To preview a plural form on canvas:

1. In the content table, locate the plural key.
2. Click the form-selector dropdown in the Content column and select the plural form to preview.
3. Phrase Strings pulls the matching translation into the layer to preview on canvas

Pushing a plural key to Phrase Strings follows the same push workflow as any other key and updates only the translation for the selected form.

The selected plural form is remembered per layer, per project, and branch. The selection persists across sessions.

#### Pull Translations

Once the translations are complete, select the Figma layers or frames to pull translations for and click on the Pull content to Figma tab.

Users can select the project, [branch](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-1d712385-b029-e295-7ca3-af71d70d59e7) (if being used), and the languages for the content being pulled. Tags cannot be pulled back to Figma.

To manage long lists of key names, use the Sort by ![Sort Filter](https://support.phrase.com/hc/article_attachments/30682364529564) dropdown to display Incomplete key names first and address any potential issues. If needed, select specific keys and click Exclude layers at the top of the table to remove those layers from the plugin.

##### Note

The selected sorting option will be remembered for future sessions.

Click the View options ![More Menu](https://support.phrase.com/hc/article_attachments/30682395614620) menu to choose how to display pulled content in Figma:

- Create a new page per language

  Selected by default. When pulling for multiple languages, a separate Figma page is created for each selected language including all layers from the page.

  ### Note

  In [Figma Buzz](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-aa830c01-d387-a052-fa04-b83c49793920 "Figma Buzz"), the Create a new row with translated content option is displayed.
- Create a single page with all languages

  Creates a single new page and places the selected translated content side by side into language-specific columns. This option focuses only on the active selection rather than duplicating the entire Figma page.

  Recommended for large files to improve pull performance and reduce unnecessary file size.
- Override text layers with translations

  The selected text layers will be overridden with the translations and updated in the viewport.

  This option is automatically disabled when pulling for multiple languages.
- Display key names instead of content

  Disabled by default. When enabled:

  - Key names are pulled and displayed instead of the translated content.
  - Selecting a language for the pulled content is no longer possible.
- Preview content in selected language

  The setting will be remembered for future sessions.

  - If disabled, the Content column displays the content of the selected layers directly.
  - When enabled, the Content column displays a preview of the content in the selected language for connected layers.

    - For disconnected layers, enable the Connect with existing keys option to show a preview in the selected language. If a key with the same name exists in the pulled data, the content of that key is used as the preview.

  This option is automatically disabled when pulling for multiple languages.
- Connect with existing keys

  Control how disconnected layers are handled when pulling data in Figma. The setting will be remembered for future sessions.

  - When enabled, the system checks if a key with the same name exists in the pulled data.

    If a match is found:

    - Disconnected layers are connected to the matching keys.
    - The layers content is updated with the pulled content from existing keys.
  - If disabled, disconnected layers are not updated, even if matching keys exist in the pulled data.

###### Check Translation Status

The Check translation status feature verifies whether text layers in the current selection already have translations for the selected target languages, before pulling content to Figma. The check runs against all connected keys in the selection.

To check translation status

1. In the Pull content to Figma tab, select the target languages to check.
2. Click Check translation status.

   The Translation status page displays a count of translated, partial, and not translated keys in each language for the current selection.

   Click View details next to a language to open a breakdown of connected keys for that language. Use the All, Translated, and Not translated filters to narrow the list.

If content is successfully pulled to Figma, the Pull completed window is displayed with a summary of the updated layers.

When pulling for multiple languages, the Open key in Editor button opens the key with the project’s default language as the source language.

##### Note

If a font used in the design is not installed locally, the plugin cannot update the affected text layers with the pulled translations. When this happens, a "The font [X] could not be loaded" error is displayed, where [X] is the name of the missing font. Install all fonts flagged in this error message locally, then pull the content again.

#### Figma Buzz

[Figma Buzz](https://www.figma.com/buzz/) is a tool where brand designers and marketing teams can create on-brand visual assets at scale, directly within the Figma ecosystem. It includes a system of templates, a simplified design editor, bulk creation of assets and AI powered editing.

The Phrase Strings plugin for Buzz allows localizing text content directly within Buzz by providing the same capabilities as in the Figma Design integration:

- [Push source text](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-08986c05-0538-da02-c36e-e9dc489562d1 "Push Content") from Buzz designs to Strings
- [Pull translations](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-4d6f906f-e8e7-e658-85f2-0053fec488ee "Pull Translations") back into Buzz
- [Manage keys](https://support.phrase.com#UUID-aa12089b-60b8-6507-78b2-281c092022bb_UUID-0efd4bfc-95a3-8807-8ff0-545c53fe7d90 "Connect or Disconnect Keys") and maintain text consistency across assets

##### Note

Live preview is not supported.

The plugin is available from the Plugins menu in Buzz. Once activated, it can be saved for future use and run on the selected design by opening it in a modal from the Figma Buzz sidebar. Text layers are automatically detected and displayed in the plugin.

Design content can then be pushed to a connected Strings project for translation. After translation, users can pull the localized content back into Buzz, which creates a new row containing the translated version of the design.

Upload Figma preview toggle and target language selection before pushing keys are unavailable in Buzz. When pushing keys from Buzz, all target languages configured in the Strings project are used automatically.

---

### Zapier (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819890138396-Zapier-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:22:44Z  
> Labels: 2BTr, ar_strings

#### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

The Zapier app offers triggers for

- Job created
- Job started
- Job completed

#### Prerequisites

- A Phrase organization.
- A [Zapier](https://zapier.com/how-it-works) account.

Once logged into Zapier, click Make a Zap and choose Phrase in search results. The Zapier will guide through the integration.

---

### Continuous Integration (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822060164508-Continuous-Integration-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:22:45Z  
> Labels: 2BTr, ar_strings

Use the [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828) client to synchronize translations from within a CI environment.

To download strings into a CI environment, follow these steps:

1. Create a `.phrase.yml` configuration file.
2. Add a new bash script or step to the CI.

   - To upload new strings, add this command to script:

     ```
     #!/bin/bash

     # upload new strings to Phrase as configured in the .phrase.yml

     phrase push
     ```

     Ensure `update_translation` or `update_description` parameters are set if intending to not only add new values but also update existing values.
   - To download translated strings into the current workspace, add this command:

     ```
     #!/bin/bash

     # get new strings from phrase as configured in the .phrase.yml

     phrase pull
     ```

     Ensure the correct [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) are included by using [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-e647235a-f7a4-26cf-82ce-f172f3330193), as well as required options for verified and translated entries.
   - Register a [webhook](https://support.phrase.com/hc/en-us/articles/5784125630620#UUID-98133288-ed24-6272-846a-4416407d3d7d "Webhooks (Strings)") to subscribe to the required events.

     Webhooks are available for major events (e.g., a processed upload or completed order). A common workflow is to set up a notification for newly created comments in a [Slack](https://support.phrase.com/hc/en-us/articles/5809166413340#UUID-cf90eabf-54a4-7f4f-1b36-6854718f4fa9 "Slack (Strings)") channel, as well as import scripts for job completions.

     [API](https://developers.phrase.com/api/#overview) can also be used to query the current state of these items as well, depending on update cycles.

#### Branches

Phrase Strings has a [branching](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-1d712385-b029-e295-7ca3-af71d70d59e7) concept for versioning that differs from typical applications of Git branches. Phrase branches can be used alongside Git branches. Check in the branch name in the configuration file for that branch and run CI steps in it.

When adding features, translations are usually added without removing existing ones. Add tags to the working branches and upload them to the main branch to allow tracking of features with share keys but also pulls and tests on certain subsets without confusing translators.

---

### Generic Platform Integration (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822446271900-Generic-Platform-Integration-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:22:46Z  
> Labels: 2BTr, ar_strings

To configure Strings with most technologies and platforms, follow these steps:

1. Download the latest [client](https://phrase.com/cli/) and follow the [setup instructions](https://support.phrase.com/hc/en-us/articles/5784093863964#UUID-137036b8-3f91-fab9-7fcc-9e34312125db).
2. Configure the command-line tool.

   To initialize the project configuration:

   ```
   $ phrase init
   ```

   Complete the configuration steps and ensure the correct locale file format is selected.
3. Upload locale files.

   Upload existing localization files:

   ```
   $ phrase push
   ```

   All existing localization files found in the source path will be uploaded to the project.
4. Download locale files.

   Once translations are complete, download the data back into the project:

   ```
   $ phrase pull
   ```

---

### Libraries and Tools (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822548113436-Libraries-and-Tools-Strings  
> Zuletzt aktualisiert: 2025-10-01T05:12:22Z  
> Labels: 2BTr, ar_strings

Tools and libraries used to integrate into applications.

#### [phrase-cli](https://github.com/phrase/phrase-cli)

The command-line tool is provided as a self-contained binary for macOS, Linux and Windows. It provides command-line functionality for accessing the API, as well as pushing and pulling translation files.

macOS | Linux | Windows | CLI v2 | API | OpenAPI

#### [phrase-ruby](https://github.com/phrase/phrase-ruby)

phrase-ruby is a Ruby gem that provides interaction with the API. It provides a client for accessing Phrase programmatically within applications.

Ruby | Rails | Sinatra | API | OpenAPI

#### [phraseapp-In-Context Editor-ruby](https://github.com/phrase/phraseapp-in-context-editor-ruby)

The phraseapp-In-Context Editor-ruby gem enables the In-Context Editor for Ruby and Rails applications.

Ruby | Rails | i18n | Sinatra | API

#### [phrase-go](https://github.com/phrase/phrase-go)

phrase-go is a library for the Phrase API written in Golang.

Golang | API | OpenAPI

#### [phrase-java](https://github.com/phrase/phrase-java)

phrase-java is a library for the API written in Java.

Java | API | OpenAPI

#### [phrase-js](https://github.com/phrase/phrase-js)

phrase-js is a library for the API written in TypeScript.

TypeScript | API | OpenAPI

#### [phrase-php](https://github.com/phrase/phrase-php)

phrase-php is a  library for the API written in PHP.

PHP | API | OpenAPI

#### [phrase-python](https://github.com/phrase/phrase-python)

phrase-python is a library for the API written in Python.

Python | API | OpenAPI

#### [Android Studio Plug-In](https://github.com/phrase/Phrase-AndroidStudio)

Manage translations in Android Studio projects with the Plug-In for Android Studio.

Android

#### [react-i18next-phraseapp](https://github.com/phrase/react-i18next-phraseapp)

Integrate the In-Context Editor into React applications that use [react-i18next](https://github.com/i18next/react-i18next).

JavaScript | React | i18next | react-i18next

#### [react-intl-phraseapp](https://github.com/phrase/react-intl-phraseapp)

Integrate the In-Context Editor into React applications that use [react-intl](https://github.com/yahoo/react-intl).

JavaScript | React | react-intl

#### [angular-phrase](https://github.com/phrase/angular-phrase)

Enable the Phrase In-Context Editor for apps using [angular-translate](https://github.com/angular-translate/angular-translate).

JavaScript | AngularJS | angular-translate

#### [ngx-translate-phraseapp](https://github.com/phrase/ngx-translate-phraseapp)

Enable the Phrase In-Context Editor for Angular (2+) apps using [ngx-translate](https://github.com/ngx-translate/core).

JavaScript | AngularJS | ngx-translate

#### [django-phrase](https://github.com/phrase/django-phrase)

Connect to the Django application and enable the Phrase In-Context Editor for Python web applications.

Python | Django

#### [phrase-symfony2](https://github.com/phrase/phrase-symfony2)

Connects to Phrase and integrates the In-Context Editor into apps.

PHP | Symfony2

#### [flask-phrase](https://github.com/phrase/Flask-Phrase)

Connect Phrase to Flask applications and enable the In-Context Editor for the Flask app.

Python | Flask

#### [ember-cli-phraseapp](https://github.com/phrase/ember-cli-phraseapp)

Connect EmberJS apps and integrate the In-Context Editor into apps.

JavaScript | EmberJS

#### [Slimkeyfy](https://github.com/phrase/slimkeyfy)

This Ruby gem provides the extraction of plain strings from `.slim` views and Rails controllers to replace them with I18n's t() method.

Ruby | Slim | Rails | i18n

#### [OpenAPI Specification](https://github.com/phrase/openapi)

The OpenAPI specification describes Phrase APIs in a standard, programming language-agnostic way that allows both humans and computers to discover and understand the capabilities of the service. Use to generate custom client libraries for over 20 different programming languages.

OpenAPI | API

---

### Advanced TextMaster (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5932606594716-Advanced-TextMaster-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:16:35Z  
> Labels: Project Manager, 2BTr, ar_strings

Users are able to connect Phrase to a personal TextMaster account to gain more control over the translation process.

##### Important

The Advanced Textmaster integration can not be used for accounts that have migrated their Textmaster accounts to Tempo.

TextMaster orders can be placed through Phrase's native TextMaster integration.

To setup the integration, follow these steps:

1. From the Integrations page, click Configure in the Advanced TextMaster integration box.

   The LSP integration settings tab opens.
2. Provide TextMaster API key and TextMaster API secret.
3. Click Save.

   TextMaster credentials are saved and the account is available when ordering translations.

##### Automate translation orders with API templates

With the Advanced TextMaster integration, templates (called API templates) can be setup within the TextMaster account. Templates can be created for language pairs and default settings are defined for [translation orders](https://support.phrase.com/hc/en-us/articles/5821933165596#UUID-fb3b4bc4-03aa-4235-b122-64d6d8c4b2d0). Once set up, available templates can be selected during the translation order process.

Target and source language pairs require precise language code matches. A template created for `en-US` as the source language will not show up as a template for `en-GB`.

---

### Phrase Strings API

> Quelle: https://support.phrase.com/hc/en-us/articles/6957750608924-Phrase-Strings-API  
> Zuletzt aktualisiert: 2023-06-16T08:29:03Z  
> Labels: 2BTr

Phrase Strings API documentation is maintained at a [dedicated site](https://developers.phrase.com/).

---

### Unity (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/15979838858140-Unity-Strings  
> Zuletzt aktualisiert: 2026-07-29T06:14:50Z

#### Available for

- All paid plans

The Unity plugin is a Unity Localization package that allows Unity developers to manage localization tasks by syncing their source strings and translations with Phrase Strings.

The plugin assumes that the Unity developer uses or plans to use localization through Unity Localization, in particular [String Table Collections](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/StringTables.html). Refer to Unity documentation to [get started with Unity Localization](https://docs.unity3d.com/Packages/com.unity.localization@1.5/manual/QuickStartGuideWithVariants.html).

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/UY_3P5AL_w8)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

#### Set up the Plugin

###### Prerequisites

- Create a set of locales and one or more String Table Collections.
- Connect them with some text objects (and/or start using them programmatically from the Unity scripts).

###### Installation and Configuration

There are several ways to install the plugin:

1. Install from the [Asset Store](https://assetstore.unity.com/).
2. [Install from the package archive](https://docs.unity3d.com/Manual/AssetPackagesImport.html) by importing the local `.unitypackage` file as a custom package.
3. Install from locally checked out source code by either:

   - Checking out the source directly into `YourProject/Packages/com.phrase.plugin` directory.
   - Creating a symbolic link to `unity_plugin` directory into `YourProject/Packages` as `com.phrase.plugin`.

Once installed, add Phrase Provider to the [project’s assets](https://docs.unity3d.com/Packages/com.unity.localization@1.0/manual/QuickStartGuide.html) and complete the configuration:

1. Set up the connection environment and provide the API access token [generated in Phrase](https://support.phrase.com/hc/en-us/articles/5808341130268#UUID-101fb304-22d4-0948-05a2-a58c02dce152).
2. Fetch the available projects and select one from the list.

   The list of locales is fetched automatically.
3. In case of locale mismatch between Unity and Phrase Strings, create any missing locales locally or in Phrase by selecting the relevant option.
4. Select the String Tables to connect and sync with Phrase.
5. Choose which locales should be pulled to Unity and which will be pushed to Phrase. This selection affects both global Pull/Push (on Phrase Provider inspector) and individual String table Push/Pull (on Table extension drawer).

   The settings are global and affect both the Phrase Extension (which only works on connected Collections) and the Phrase Window (which only display keys from connected String Tables).

The initial key list (usually only the source locale) can now be pushed to Phrase Strings. Once translated to target locales, keys are pulled back to Unity through the same Phrase Provider screen.

##### Note

[Push and pull](https://support.phrase.com#UUID-aca04276-391d-e58b-4e4c-b8ba3d1bc0d0_UUID-714101c2-511e-3e46-0186-8b2cda849005 "Use the Plugin") operations are also available from the Phrase extension on a String Table Collection.

#### Use the Plugin

###### Push and Pull

Users can push and pull localization keys from the Phrase Provider screen (and that synchronizes all the connected String Tables with Phrase), and from the Phrase extension drawer on the individual String Tables.

When a String Table is connected with the Phrase Provider, its inspector shows a Phrase drawer, which allows pushing and/or pulling content from the the table. String Tables not connected with Phrase Provider will not have Phrase drawer; the extension will only appear when a String Table Collection is linked.

Users commonly organize translations into multiple String Table Collections. Examples would be based on the game section or the type of the items referred to (e.g. Weapons, Items, Characters etc). In this case, connecting a collection with only some of all existing translation keys in Phrase Strings would be required. Select an options in the Only Keys Matching dropdown to specify the subset of keys that will be pushed/pulled to the particular table:

- Key Prefix

  Only keys with the given prefix in their names are imported (pulled) to the target table. The Unity key names will not contain the prefix itself. When pushed, the whole table is uploaded to Phrase, and prefixes are automatically appended to the key names.
- Tag

  Only keys with matching [tag](https://support.phrase.com/hc/en-us/articles/5822598372252-Tags-Strings) are imported to the target table. When pushed, the tag is assigned to all keys from this table.
- None

  All Phrase keys are imported to the target table when pulled (typically when there is only a single Collection connected with Phrase).

##### Note

Pushing and pulling from the Table extension drawer respects the list of the locales chosen on Phrase Provider inspector. To only synchronize content from a single table collection, do so from the Phrase Extension. To synchronize all connected content, use the Phrase Provider.

Verify that target locales are selected in the Phrase Provider or extension drawer before pushing a String Table. A push made without any target locales selected still creates or updates the job in Phrase Strings, but the job does not propagate through downstream integrations, such as Automated Project Creation syncing to TMS. This failure occurs without any visible error in Unity or in Phrase Strings.

To recover, add the missing target locales to the affected job in Phrase Strings and re-trigger the downstream integration. If the target locales are not configured in the Unity project at all, exporting translations back to Unity does not work until the locales are set up on the Unity side as well.

###### Phrase Window

Select Window/Phrase from the menu to open the Phrase editor window and attach it to the main interface, if needed.

The Phrase window lists keys attached to the text objects from the localization scene, and offers editing their metadata and uploading [screenshots](https://support.phrase.com/hc/en-us/articles/5822309698204-Screenshot-Management-Strings).

It shows all text objects from the selection that are connected to a Phrase-enabled String Table and their associated keys. Users can set key description and maximum character length, which will be synchronized with Phrase the next time the containing String Table is pushed.

##### Note

You can also view and edit the key metadata (such as description and max length) from the String Table Collection editor.

Use the Update screenshot button to export a [screenshot](https://support.phrase.com/hc/en-us/articles/5822309698204-Screenshot-Management-Strings) of the current game view and attach it to all listed Phrase keys.

Click Open in Phrase next to the key name to open the key in the Phrase [Strings editor](https://support.phrase.com/hc/en-us/articles/5822638157340-Strings-Editor-Overview).

---

### Import From Crowdin (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/29513634143644-Import-From-Crowdin-Strings  
> Zuletzt aktualisiert: 2026-08-11T06:14:18Z

Import from Crowdin migrates projects, keys, translations, and glossaries from Crowdin into Phrase Strings in a single automated step.

**Prerequisites:**

- A Crowdin account with access to the projects to migrate.
- A Crowdin personal access token, generated in Crowdin account settings.

##### What Import From Crowdin Migrates

- Projects
- Keys
- Translations
- Glossaries

Phrase Strings recreates the same project structure and content. Each imported project is named `[Original Project Name] (Crowdin import [date-time])`, and glossaries are added to Term Bases as `[Project Name]'s Glossary`.

##### Import Projects From Crowdin

To import projects from Crowdin:

1. In Phrase Strings, navigate to Integrations.
2. Under Import from Crowdin, click Start import.

   The import from Crowdin setup page opens.
3. Enter the personal access token generated in Crowdin account settings in the Crowdin API token field. Click Connect.

   Once connected, a list of Crowdin projects is displayed.
4. Review the list of detected Crowdin projects, along with the key count and language count for each, and select those for import.
5. Select the Import glossaries checkbox to include glossaries in the migration.
6. Click Start import.

   Phrase Strings imports each selected project and shows a progress bar and status for each row, along with the glossary import status. A confirmation message appears when the import finishes.
7. Click Go to Projects to view the imported projects.

---

## Supported File Types (Strings)

Quelle: https://support.phrase.com/hc/en-us/sections/6111343326364-Supported-File-Types-Strings

### Supported File Formats (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/9652464547740-Supported-File-Formats-Strings  
> Zuletzt aktualisiert: 2026-08-21T06:16:45Z  
> Labels: 2BTr

- [.ARB](https://support.phrase.com/hc/en-us/articles/6111361660188#UUID-402c6e85-3673-3e78-38b9-cd1ac57e5f95 ".ARB - Application Resource Bundle (Strings)") - Application Resource Bundle
- [.CSV](https://support.phrase.com/hc/en-us/articles/6111361680540#UUID-90e86731-22ed-7c13-af34-9fe422fa33fb ".CSV (Strings)")
- [.CSV](https://support.phrase.com/hc/en-us/articles/6111343365148#UUID-276b7ec2-41c4-a068-ec16-dcb1c702558f ".CSV - Zendesk Dynamic Content (Strings)") - Zendesk Dynamic Content
- [.DOCX](https://support.phrase.com/hc/en-us/articles/6111330777628#UUID-18ad3529-345c-070f-db5d-0f1fd2da5bba ".DOCX - Word Processor Documents (Strings)") - Word Processor Documents
- [.HTML](https://support.phrase.com/hc/en-us/articles/6111354479388#UUID-985812df-2146-5a7b-90f0-eeac87c98727 ".HTML (Strings)")
- [.INI](https://support.phrase.com/hc/en-us/articles/6111343403804#UUID-a18f9712-a928-21b0-922e-21d76d2030a2 ".INI (Strings)")
- [JS EmberJS](https://support.phrase.com/hc/en-us/articles/6111354511004#UUID-3cf9f3f6-0d0d-845c-d535-7c903c291591 "JS EmberJS - Nested JSON (Strings)") - Nested JSON
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111389972764#UUID-e798e279-d8e7-4e1a-3993-82101813fa75 ".JSON - Angular Translate (Strings)") - Angular Translate
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111354544924#UUID-e151aca2-1ba5-258a-bb59-d97e9beeab45 ".JSON - Chrome Messages (Strings)") - Chrome Messages
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111346177820#UUID-d0be0669-6647-ad3b-7563-209826c8e094 ".JSON - go-i18n (Strings)") - go-i18n
- [.JSON](https://support.phrase.com/hc/en-us/articles/7278275219612#UUID-07056624-3214-7312-5596-2608fb412e18 ".JSON - i18next / i18nextV4 (Strings)") - i18next / i18nextV4
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111390011676#UUID-15dd5c08-f4e2-9246-551e-7e12990489e9 ".JSON - i18n-node-2 (Strings)") - i18n-node-2
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111330881692#UUID-db3aa4ee-7d03-6426-6358-b9f3356bb9c0 ".JSON - Nested (Strings)") - Nested
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111330894748#UUID-b5798739-3cb2-c353-24ca-eac6a60820c4 ".JSON - Nested EmberJS (Strings)") - Nested EmberJS
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111330903324#UUID-c28b609a-623e-fbbf-fbd5-c611c96e6209 ".JSON - Nested React-Intl (Strings)") - Nested React-Intl
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111390065948#UUID-6a800f75-cdbb-22ae-ad93-7c06ebb95851 ".JSON - React-Intl Simple (Strings)") - React-Intl Simple
- [.JSON](https://support.phrase.com/hc/en-us/articles/6111346248860#UUID-9fc166bc-0156-70b4-930d-13faecaf63ca ".JSON - Simple (Strings)") - Simple
- [.MO](https://support.phrase.com/hc/en-us/articles/6111354648476#UUID-c8173877-9bbd-e2a5-d5ae-1bd44604896c ".MO - Gettext-compiled (Strings)") - Gettext-compiled
- [.PHP](https://support.phrase.com/hc/en-us/articles/6111343537820#UUID-be1bc1b4-0da7-3db6-2cc5-4d23488cd0f9 ".PHP - Array (Strings)") - Array
- [.PHP](https://support.phrase.com/hc/en-us/articles/6111390129180#UUID-4c4ff5c8-7620-d53e-ed55-5f17465a0b24 ".PHP - Laravel/F3/Kohana Array (Strings)") - Laravel/F3/Kohana Array
- [Play Framework Properties](https://support.phrase.com/hc/en-us/articles/6111390139164#UUID-5dd6b09c-422c-7d71-a3d9-0d1e1ef64652 "Play Framework Properties")
- [.PLIST](https://support.phrase.com/hc/en-us/articles/6111361881884#UUID-1d56b61e-21a6-9436-9150-6c09caa89dbc ".PLIST - Objective-C/Cocoa Property List (Strings)") - Objective-C/Cocoa Property List
- [.PO](https://support.phrase.com/hc/en-us/articles/6111343649820#UUID-91f7aae4-8bd7-a242-2fd2-bfca9c7c408a ".PO - gettext files (Strings)") - gettext files
- [.POT](https://support.phrase.com/hc/en-us/articles/6111390193820#UUID-e18c41b3-1c25-45f2-6447-fc0de5450ba8 ".POT - Gettext Template Files (Strings)") - Gettext Template Files
- [.PROPERTIES](https://support.phrase.com/hc/en-us/articles/6111361943324#UUID-c3fb7710-b4cb-e379-8824-430757aefc7b ".PROPERTIES - Java Properties (Strings)") - Java Properties
- [.PROPERTIES](https://support.phrase.com/hc/en-us/articles/6111343696924#UUID-293f094e-100e-805c-3c77-7311f45279cc ".PROPERTIES - Mozilla (Strings)") - Mozilla
- [.QPH](https://support.phrase.com/hc/en-us/articles/6111343710876#UUID-97f6bb50-fe02-1e6d-04ce-ac9f7ff3d1b7 ".QPH - Qt Phrase Book (Strings)") - Qt Phrase Book
- [.RESX](https://support.phrase.com/hc/en-us/articles/6111361990044#UUID-ad296b4b-9630-a034-20f1-33fc85831093 ".RESX - Microsoft .NET (Strings)") - Microsoft .NET
- [.RESX](https://support.phrase.com/hc/en-us/articles/6111354836380#UUID-0a0fc5b9-09a9-20b2-7831-9e4973f70eb9 ".RESX - Windows 8 Resource (Strings)") - Windows 8 Resource
- [.RESX](https://support.phrase.com/hc/en-us/articles/6111343767196#UUID-3e2dcb02-1746-5784-f901-c8327744db72 ".RESX - Windows Phone ResX (Strings)") - Windows Phone ResX
- [.STRINGSDICT](https://support.phrase.com/hc/en-us/articles/17856143243036#UUID-90b9e92b-5d2e-29cf-f5e4-daf1f2c55520 ".STRINGSDICT - iOS Localizable Stringsdict for Pluralized Translation Keys (Strings)") - iOS Localizable Stringsdict for Pluralized Translation Keys
- [.STRINGS](https://support.phrase.com/hc/en-us/articles/6111346507676#UUID-3dad91a3-6655-48ae-7d8b-3966bb320096 ".STRINGS - iOS Strings Resources (Strings)") - iOS Strings Resources
- [.TMX](https://support.phrase.com/hc/en-us/articles/6111346531484#UUID-026cee50-73a4-9bc6-29e4-01930015efdb ".TMX (Strings)")
- [.TS](https://support.phrase.com/hc/en-us/articles/6111346553628#UUID-52fbcc3a-fdb5-4562-a4a7-973d7de01966 ".TS - Qt Translation Source (Strings)") - Qt Translation Source
- [.TXT](https://support.phrase.com/hc/en-us/articles/17398149187740#UUID-a27797ea-3107-0139-6da6-1951f7710abd ".TXT (Strings)") - Text
- [.XLIFF](https://support.phrase.com/hc/en-us/articles/6111362119196#UUID-1ea2c354-00a2-add0-944c-ee104f474192 ".XLIFF - Symfony (Strings)") - Symfony
- [.XLIFF](https://support.phrase.com/hc/en-us/articles/6111346587292#UUID-f2eb5307-b694-5ff1-969d-2ef3bef6ce12 ".XLIFF - XML Localization Interchange File Format (Strings)") - XML Localization Interchange File Format
- [.XLIFF](https://support.phrase.com/hc/en-us/articles/6111390440476#UUID-c2304d3c-9604-5fd3-8e1a-ea672adb3c34 ".XLIFF - XML Localization Interchange File Format V2 (Strings)") - XML Localization Interchange File Format V2
- [.XLSX](https://support.phrase.com/hc/en-us/articles/6111362172316#UUID-6092697c-bfdd-ca14-15d1-76d65b70fe0a ".XLSX - Spreadsheet Excel (Strings)") - Spreadsheet Excel
- [.XML](https://support.phrase.com/hc/en-us/articles/6111362189212#UUID-37d4cf48-498b-19a2-f2ab-22f3db949ac7 ".XML - Android (Strings)") - Android
- [.XML](https://support.phrase.com/hc/en-us/articles/6111346657180#UUID-a3e7f3f0-2977-075b-1889-633bd666a5f4 ".XML - Episerver (Strings)") - Episerver
- [.XML](https://support.phrase.com/hc/en-us/articles/6111390496284#UUID-376b17b8-857a-b679-3fef-42315e3c172e ".XML - Java Properties (Strings)") - Java Properties
- [.XCSTRINGS](https://support.phrase.com/hc/en-us/articles/18807352792604#UUID-51c41f4b-3044-e099-3da2-e63116e7d6d0 ".XCSTRINGS - Apple Strings Catalog (Strings)") - Apple Strings Catalog
- [.YAML](https://support.phrase.com/hc/en-us/articles/6111362229660#UUID-8c3ace3d-c1ab-8cbd-1aaa-2242c3359275 ".YAML - Ruby on Rails (Strings)") - Ruby on Rails
- [.YAML](https://support.phrase.com/hc/en-us/articles/6111362240412#UUID-037fd757-e93d-13a9-3bed-5aece6a1d5fb ".YAML - Symfony (Strings)") - Symfony
- [.YAML](https://support.phrase.com/hc/en-us/articles/6111346719388#UUID-dd111950-a2dd-dd7b-e85e-82062bac1ffa ".YAML - Symfony 2 (Strings)") - Symfony 2

---

### .ARB - Application Resource Bundle (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111361660188--ARB-Application-Resource-Bundle-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:41Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .arb |
| **API Extension** | arb |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | No |

[ARB - Application Resource Bundle](https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification) is a file format for localization based on JSON with the resource entries encoded as JSON objects. Each object consists of a resource key with an optional attribute. ARB files are used for the localization of apps built with the Google Mobile App SDK called [Flutter](https://docs.flutter.dev/development/accessibility-and-localization/internationalization).

#### Pluralization and Placeholders

Use the [ICU](https://unicode-org.github.io/icu/userguide/format_parse/messages/) placeholder and pluralization style for compatibility.

Pluralization in .ARB (Application Resource Bundle) files has several important considerations. The count placeholder in plural messages is always of type `int`. When specifying plural categories, use `=0` instead of `zero`, `=1` instead of `one`, and `=2` instead of `two`. Flutter does not support the `offset` in the plural message format.

#### Code Sample

```
{
  "@@locale": "en_US",  "title_bar": "My Cool Home",
  "@title_bar": {
    "type": "text",
    "description": "Page title."
  },  "MSG_OK": "Everything works fine.",  "FOO_123": "Your pending cost is {COST}",
  "@FOO_123": {
    "type": "text",
    "description": "balance statement."
  },
  "selectedRowCountTitle": "{selectedRowCount, plural, =0{No items selected} =1{1 item selected} other{{selectedRowCount} items selected}}",
  "@selectedRowCountTitle": {
    "description": "Message that shows the number of selected rows",
    "placeholders": {
      "selectedRowCount": {
        "type": "int",
        "example": "2"
      }
    }
  }
}
```

---

### .CSV (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111361680540--CSV-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:42Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .csv |
| **API Extension** | csv |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | key\_index  comment\_index  tag\_column  max\_characters\_allowed\_column  column\_separator  quote\_char  header\_content\_row  enable\_pluralization  export\_tags  export\_max\_characters\_allowed  custom\_metadata\_columns  export\_key\_id  key\_id\_column |

CSV (comma-separated values) is a popular file format used primarily for data transfer in various applications and programs. In a CSV file, each line is a data record. Each record consists of a few fields separated by commas. Before import, ensure that the CSV files have three fields for a single line representing source content, translation, and comments (optional).

The `locale_mapping` parameter (of type hashmap) is required to specify which column in the document corresponds to each locale. For examples, see the [configuration file example](https://support.phrase.com#UUID-90e86731-22ed-7c13-af34-9fe422fa33fb_bridgehead-idm465214607189603287575702955 "Configuration example") and the [API documentation](https://developers.phrase.com/api/#post-/projects/-project_id-/uploads) for uploads.

#### Format Options

|  |  |
| --- | --- |
| **Identifier** | key\_index |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing the key names. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | comment\_index |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing description for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | tag\_column |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing a tag for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | max\_characters\_allowed\_column |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing a maximum number of characters for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | column\_separator |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | , |
| **Description** | Char that is used to separate columns. |

|  |  |
| --- | --- |
| **Identifier** | quote\_char |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | " |
| **Description** | Char that is used to quote newlines and column separator. |

|  |  |
| --- | --- |
| **Identifier** | header\_content\_row |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Indicates whether the first row contains only header information and should be skipped. |

|  |  |
| --- | --- |
| **Identifier** | enable\_pluralization |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | true |
| **Description** | Enables detection of pluralized keys. All matching keys will be persisted as pluralized keys. |

|  |  |
| --- | --- |
| **Identifier** | export\_tags |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports tags along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | export\_max\_characters\_allowed |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the Key ID along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | custom\_metadata\_columns |
| **Type** | hash |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | HashMap of [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f) values that need to be imported or exported:  - Key = Name of the custom metadata property, as defined in Phrase Strings. - Value = Column index (*1*, *2*, *3*, etc.) where the property is in the imported file/where the property should be in the exported file. |

|  |  |
| --- | --- |
| **Identifier** | export\_key\_id |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the key character limit along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | key\_id\_column |
| **Type** | integer |
| **Upload** | No |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | Index of the column containing the ID for the key. Column indexes start at 1. |

#### Code sample

```
boolean_key,"--- true
"
empty_string_translation,""
key_with_description,Check it out! This key has a description! (At least in some formats),This is the amazing description for this key!
key_with_line-break,"This translations contains
a line-break."
nested.deeply.key,"Wow, this key is nested even deeper."
nested.key,This key is nested inside a namespace.
null_translation,
pluralized_key.one, "Only one kitten found."
pluralized_key.other,"Wow, you have %s kittens!"
pluralized_key.zero,"You have no kittens."
sample_collection,"---
- first item
- second item
- third item
"
simple_key,Just a simple key with a simple message.
unverified_key,This translation is not yet verified and waits for it. (In some formats we also export this status)
```

#### File structure

A typical .CSV file structure:

```
1 (Key column), 2 (Translation column), 3 (Comment column)
app_title,      My Software Project,    This is the main title
apples.zero,    one apple,              my comment
...
```

#### Configuration example

An example for the push section of a .phrase.yml for .CSV files:

```
push:
    sources:
        - file: "./multi.csv"
          params:
              update_translations: true
              locale_mapping:
                  en: 2
                  de: 3
              format_options:
                  comment_index: 4
                  tag_column: 5
```

#### Plural forms

This format uses named categories to identify the different pluralizations of a key. The following categories are reserved for plural forms:

```
.zero | .one | .two | .few | .many | .other
```

Example names for correctly identified, persisted and marked pluralized keys:

- inbox.messages.notification.one
- inbox.messages.notification.other

Files should follow this structure:

```
1 (Key column), 2 (Translation column), 3 (Comment column)
messages.zero,  No messages received,
messages.one,   One message received,
messages.other,  %s messages received,
```

---

### .CSV - Zendesk Dynamic Content (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343365148--CSV-Zendesk-Dynamic-Content-Strings  
> Zuletzt aktualisiert: 2024-10-08T10:00:45Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .csv |
| **API Extension** | zendesk\_csv |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

Zendesk CSV is a CSV-based file type used to load localized dynamic data for Zendesk applications.

A Zendesk CSV typically has five fields for each line (title, default language, default text, locale-specific text, and variant status). Source and localized strings are placed in field 3 and 4.

Generally, it does not matter if each field is in double-quotes in .CSV files but it is recommended for Zendesk CSV.

##### Code Sample

```
"Title","Default language","Default text","English text","Variant status"
"boolean_key","German","--- true
","--- true
","Current"
"empty_string_translation","German","","","Current"
"key_with_description","German","Hier könnte eine Beschreibung stehen","Here could be a description' (At least in some formats)","Current"
"key_with_line-break","German","Diese Übersetzung hat
einen Zeilenumbruch.","This translations contains
a line-break.","Current"
"nested.deeply.key","German","Wow, dieser Schlüssel ist noch tiefer verschachtelt.","Wow, this key is nested even deeper.","Current"
"nested.key","German","Dieser Schlüssel ist innerhalb eines Namensraumes verschachtelt.","This key is nested inside a namespace.","Current"
"null_translation","German","","","Current"

"sample_collection","German","---
- erstes Item
- zweites Item
","---
- first item
- second item
- third item
","Current"
"simple_key","German","Einfacher Schlüssel, einfache Nachricht.","Simple key, simple message.","Current"
"unverified_key","German","Bitte verifizieren Sie diese Übersetzung","Please verify this translation. (In some formats we also export this status)","Current"
```

---

### .DOCX - Word Processor Documents (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111330777628--DOCX-Word-Processor-Documents-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:43Z  
> Labels: 2BTr, ar_strings

As with all supported formats, the system tries to extract keys and values from the document based on the XML tags that are used in the background. During this process, simple elements of the .DOCX file (headlines, paragraphs, etc.) are detected correctly, but any more complex content is not supported.

|  |  |
| --- | --- |
| **File Extensions** | .docx |
| **API Extension** | docx |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | document\_id |

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | document\_id |
| **Type** | string |
| **Upload** | No |
| **Download** | Yes |
| **Description** | Takes the document ID of the existing .docx documents in within the project the export should be based on. |

---

### .HTML (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111354479388--HTML-Strings  
> Zuletzt aktualisiert: 2026-07-28T06:15:10Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .html |
| **API Extension** | html |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | document\_id |

HTML is used in many contexts. Web development has moved away from static HTML files, but HTML content is still present, e.g. in the form of emails.

As with all supported formats, the system tries to extract keys and values from the document based on the XML tags that are used in the background. During this process, simple elements of the .HTML file (headlines, paragraphs, etc.) are detected correctly, but any more complex content is not supported.

All HTML tags are imported into the editor allowing accurate recognition of paragraphs.

**Example:**

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Phrase Strings Example</title>
</head>
<body>
  <h1 data-i18n="page.title">Welcome to Our App</h1>
  <p data-i18n="page.subtitle">We hope you enjoy your stay.</p>

  <!-- XML-style block used to wrap translatable strings -->
  <translations>
    <string key="user.login.button">Log In</string>
    <string key="user.logout.button">Log Out</string>
    <string key="user.greeting">Hello, {{username}}!</string>
    <string key="form.error.required">This field is required.</string>
    <string key="form.error.email">Please enter a valid email address.</string>
  </translations>

  <!-- More UI content that might be identified as strings -->
  <button data-i18n="user.login.button">Log In</button>
  <button data-i18n="user.logout.button">Log Out</button>

  <!-- Embedded SVG (still XML!) -->
  <svg width="100" height="100">
    <text x="10" y="20" data-i18n="graphic.label">Chart</text>
  </svg>
</body>
</html>
```

- When present on a translatable element, or its parent element for bare text nodes, the `data-i18n` attribute value becomes the segment key. When the attribute is absent or empty, Phrase generates a key from the segment's own text content instead.
- The `<translations>` block with `<string key="...">value</string>` is an identifiable custom XML block.
- Placeholders like `{{username}}` signal dynamic content.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | document\_id |
| **Type** | string |
| **Upload** | No |
| **Download** | Yes |
| **Description** | Takes the document ID of the existing HTML documents within the project the export should be based on. |

---

### .INI (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343403804--INI-Strings  
> Zuletzt aktualisiert: 2024-10-08T10:00:49Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .ini |
| **API Extension** | ini |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

.INI files are widely used in applications on various platforms. Although .INI files do not have a forming convention as stringent as that of other file formats such as .XML and .JSON, most .INI files consist of several key-value pairs separated by a `=`. A built-in filter that helps streamline the translation and localization of INI files.

##### Code Sample

```
boolean_key = --- true\n
empty_string_translation = 
key_with_description = Check it out! This key has a description! (At least in some formats)
null_translation =  
pluralized_key.one = Only one kitten found.
pluralized_key.other = Wow, you have %s kittens!
pluralized_key.zero = You have no kittens.
sample_collection = ---\n- first item\n- second item\n- third item\n
simple_key = Simple key, simple message, so simple.
unverified_key = This translation is not yet verified and waits for it. (In some formats we also export this status)

[key_with_line\-break]
key_with_line-break = This translations contains\na line-break.

[nested]
deeply.key = Wow, this key is nested even deeper.
key = This key is nested inside a namespace.
```

---

### JS EmberJS - Nested JSON (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111354511004-JS-EmberJS-Nested-JSON-Strings  
> Zuletzt aktualisiert: 2025-02-11T06:52:58Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .js |
| **API Extension** | ember\_js |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

[ember-i18n on Github](https://github.com/jamesarosen/ember-i18n)

##### Code Sample

```
export default {
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Wow, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": null,
  "pluralized_key": {
    "one": "Only one pluralization found.",
    "other": "Wow, you have %s pluralizations!",
    "zero": "You have no pluralization."
  },
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
};
```

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Angular Translate (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111389972764--JSON-Angular-Translate-Strings  
> Zuletzt aktualisiert: 2024-10-08T10:00:52Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | angular\_translate |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Angular Translate is a localization/internationalization module designed for AngularJS applications. Angular Translate integrates smoothly with AngularJS and provides developers with flexible options to load localized strings into the App. The standard localization file format for Angular Translate is .JSON. Data in a .JSON file exists as key-value string pairs.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

#### Code Sample

```
{
 "boolean_key": "--- true\n",
 "empty_string_translation": "",
 "key_with_description": "Key description!(in some formats)",
 "key_with_line-break": "This translations contains\na line-break.",
 "nested.deeply.key": "I am nested deeply.",
 "nested.key": "And that key is nested inside a namespace.",
 "null_translation": null,
 "pluralized_key": "You have {itemCount, plural, =0 {no items} =1 {one item} other {# items}}.",
 "sample_collection": "---\n- first item\n- second item\n- third item\n",
 "simple_key": "I am a simple key with a simple message.",
 "unverified_key": "Not yet verified. (In some formats we also export this status)"
}
```

---

### .JSON - Chrome Messages (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111354544924--JSON-Chrome-Messages-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:47Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | No |

Google provides [internationalization support](https://developer.chrome.com/extensions/i18n) for Chrome extensions. Localized strings for Chrome extensions are stored in a .JSON file often named [messages.json](https://developer.chrome.com/extensions/i18n-messages). Chrome JSON files have a slightly different structure than .JSON files used for localization on other platforms. For Chrome JSON, strings that need translation are placed in the sub-key `message` nested under each unit key-value pair. A `description` may also be added to each key-value pair.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

##### Code Sample

```
{
  "boolean_key": {
    "message": "--- true\n"
  },
  "empty_string_translation": {
    "message": ""
  },
  "key_with_description": {
    "message": "Check it! Key has a description! (In some formats)",
    "description": "I'm a very important description for this key!"
  },
  "key_with_line-break": {
    "message": "This translations contains\na line-break."
  },
  "nested.deeply.key": {
    "message": "  I'm nested deeply."
  },
  "nested.key": {
    "message": "This key is nested inside a namespace."
  },
  "null_translation": {
    "message": null
  },
  "sample_collection": {
    "message": "---\n- first item\n- second item\n- third item\n"
  },
  "simple_key": {
    "message": "I am a simple key with a simple message."
  },
  "unverified_key": {
    "message": "Not yet verified waiting for it. (In some formats we also export this status)"
  }
}
```

---

### .JSON - go-i18n (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346177820--JSON-go-i18n-Strings  
> Zuletzt aktualisiert: 2024-10-08T10:00:54Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | go\_i18n |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Go-i18n is an internationalization library designed for [Go](https://go.dev/). Its supported localization file formats include .JSON, .YAML, .TOML, etc. .JSON files used by go-i18n are different from those of other localization and internationalization platforms in that go-18n .JSON often exists as a JSON array consisting of a series JSON objects. Each JSON object represents a string that needs translation identified by keys such as `ID`.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

[go-i18n on GitHub](https://github.com/nicksnyder/go-i18n)

##### Code Sample

```
[
  {
    "id": "boolean_key",
    "translation": "--- true\n"
  },
  {
    "id": "empty_string_translation",
    "translation": ""
  },
  {
    "id": "key_with_description",
    "translation": "Check it out! This key has a description! (At least in some formats)"
  },
  {
    "id": "key_with_line-break",
    "translation": "This translations contains\na line-break."
  },
  {
    "id": "nested.deeply.key",
    "translation": "Wow, this key is nested even deeper."
  },
  {
    "id": "nested.key",
    "translation": "This key is nested inside a namespace."
  },
  {
    "id": "null_translation",
    "translation": null
  },
  {
    "id": "pluralized_key",
    "translation": {
      "one": "Only  pluralization found.",
      "other": "Wow, you have  pluralizations!",
      "zero": "You have no pluralization."
    }
  },
  {
    "id": "sample_collection",
    "translation": "---\n- first item\n- second item\n- third item\n"
  },
  {
    "id": "simple_key",
    "translation": "simple key, simple message, so simple."
  },
  {
    "id": "unverified_key",
    "translation": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
  }
]
```

---

### .JSON - i18next / i18nextV4 (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/7278275219612--JSON-i18next-i18nextV4-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:48Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | i18next / i18next\_4 |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | nesting |

[I18next](https://www.i18next.com/) and I18nextV4 are JavaScript libraries that provide easy-to-use localization and internationalization solutions for various environments based on JavaScript. As one of the oldest l10n/i18n libraries, it supports standard i18n library features such as interpolation and plurals and works well with async requests. With proper configuration, it detects browser language settings to automatically load locale-specific data.

Like other JavaScript l10n/i18n libraries, i18next and i18nextV4 use JSON format to store translations. Strings pending translation are either placed at the value directly or nested inside of another object (e.g. interpolated values). For translation, ensure that all variables are kept intact.

If using i18nextV4, select the i18next 4 (.json) format when uploading.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

Pluralization is handled differently between the two versions. To determine pluralized keys:

- [i18next](https://www.i18next.com/misc/json-format#i18next-json-v3) uses:

  - For languages with complex plural rules such as Russian, `keyname_0`, `keyname_1`, `keyname_2` and `keyname_5` would be used.
  - For languages with simple plural rules such as English, `keyname` and `keyname_plural` would be used.
- [i18nextV4](https://www.i18next.com/translation-function/plurals#languages-with-multiple-plurals) uses `_<plural_suffix>` endings; pluralization with words *one, two, three* or for simple case `keyname_one` and `keyname_other`.

[i18next on GitHub](https://github.com/i18next/i18next)

**Supported:**

- Pluralizations

  - Keys ending in \_0, \_1, \_other etc. will be mapped to the according plural forms.
- Namespaces
- Arrays

**Not supported:**

- *Interval Pluralizations* are persisted as normal key values. There is no support in the UI.
- i18next *[nesting](https://www.i18next.com/translation-function/nesting) / variable replacement* is not directly supported but referencing other keys in translation content is and placeholders can be activated. Cross-referencing keys from within values is not supported. There is no support in the UI.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | nesting |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | When exporting translation files, keys are nested based on dots in the key name. Set to `false` to export translation files in flat JSON format. |

##### Code Sample (i18next\_4)

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Wow, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": "",
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)",
  "pluralized_key_one": "Only one pluralization found.",
  "pluralized_key_other": "Wow, you have %s pluralizations!"
}
```

##### Code Sample(i18next)

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Wow, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": "",
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)",
  "pluralized_key": "Only one pluralization found.",
  "pluralized_key_plural": "Wow, you have %s pluralizations!",
  "pluralized_keyWithCount": "{{count}} pluralization found.",
  "pluralized_keyWithCount_plural": "Wow, you have {{count}} pluralizations!"
}
```

[i18next on GitHub](https://github.com/i18next/i18next)

---

### .JSON - i18n-node-2 (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390011676--JSON-i18n-node-2-Strings  
> Zuletzt aktualisiert: 2024-07-04T07:09:33Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .js |
| **API Extension** | node\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

I18n-node-2 is a library based on Node.js that can work out of the box with Express.js. I18n-node-2 integrates with applications by providing on-the-fly string extraction. Wrapping strings pending translation with the default \_(“…”) method is all that is required. While running, i18n-node-2 automatically generates multiple JSON files depending on predefined locales.

I18n-node-2 uses the auto-generated JSON format to store translatable data. Prior to translation, run a sanity check of the files. With i18n-node-2 supporting plural forms, ensure that all variables remain unchanged during translation.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

[i18n-node-2 on GitHub](https://github.com/jeresig/i18n-node-2)

##### Code Sample

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested.deeply.key": "I'm a deeply nested key.",
  "nested.key": "This key is nested inside a namespace.",
  "null_translation": null,
  "pluralized_key": {
    "one": "Only one pluralization found.",
    "other": "Wow, you have %s pluralizations!",
    "zero": "You have no pluralization."
  },
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "simple key, simple message, so simple.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
}
```

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Nested (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111330881692--JSON-Nested-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:17:30Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | nested\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | enable\_pluralization, preserve\_data\_types |

Nested JSON is a .JSON file with a large portion of values being other .JSON objects. Compared with Simple JSON, Nested JSON provides higher clarity by decoupling objects into different layers, making it easier to maintain. [Keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) are stored by separating levels with a dot `.`. During [export](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-5987e780-55f5-f730-87b6-071f69103a05), all keys are again split and rendered in the original nested .JSON structure.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | enable\_pluralization |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | true |
| **Description** | Enables detection of pluralized keys. All matching keys will be persisted as pluralized keys. |

|  |  |
| --- | --- |
| **Identifier** | preserve\_data\_types |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | False |
| **Description** | When enabled, keys typed as Number or Boolean in the key's Meta section are exported as real JSON numbers or booleans instead of quoted strings. When disabled (default), all key values are exported as strings regardless of declared type. |

##### Code Sample

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Wow, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": null,
  "pluralized_key": {
    "one": "Only one pluralization found.",
    "other": "Wow, you have %s pluralizations!",
    "zero": "You have no pluralization."
  },
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
}
```

#### Plural forms

This format uses named categories to identify the different pluralizations of a key. The following categories are reserved for plural forms:

```
.zero | .one | .two | .few | .many | .other
```

Example names for correctly identified, persisted and marked pluralized keys:

- inbox.messages.notification.one
- inbox.messages.notification.other

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Nested EmberJS (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111330894748--JSON-Nested-EmberJS-Strings  
> Zuletzt aktualisiert: 2024-10-08T10:00:59Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .js |
| **API Extension** | ember\_js |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

AI chatbots can be very effective at generating a list of keys from a .JSON file.

[ember-i18n on Github](https://github.com/jamesarosen/ember-i18n)

##### Code Sample

```
export default {
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Wow, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": null,
  "pluralized_key": "{count, plural, =0 {You have no pluralization.} one {Only one pluralization found.} other {Wow, you have # pluralizations!}}",,
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
};
```

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Nested React-Intl (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111330903324--JSON-Nested-React-Intl-Strings  
> Zuletzt aktualisiert: 2024-07-04T07:09:37Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | react\_nested\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

React Intl uses .js files to save localized data. Place strings into a .JSON file and reference it in the source code.

Depending on app configurations, .JSON files may become complex with multiple nested .JSON objects. Nested .JSON files are processed by separating key levels with a dot `.`. During export, all keys are again split and rendered as a nested .JSON structure.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

##### Code Sample

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it! This key has a description! (At least in some formats it does)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested": {
    "deeply": {
      "key": "Hey, this key is nested even deeper."
    },
    "key": "This key is nested inside a namespace."
  },
  "null_translation": null,
  "pluralized_key": {
    "one": "Only one pluralization found.",
    "other": "Wow, you have %s pluralizations!",
    "zero": "You have no pluralization."
  },
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "A simple key with a simple message.",
  "unverified_key": "Translation is not yet verified and waits for it. (In some formats we also export this status)"
}
```

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Phrase Strings

> Quelle: https://support.phrase.com/hc/en-us/articles/20038313421468--JSON-Phrase-Strings  
> Zuletzt aktualisiert: 2026-08-04T06:14:52Z

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | strings\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **State support** | Yes |
| **Metadata support** | Yes |
| **Format options** | ignore\_translation\_state  export\_translation\_state  export\_description  export\_tags  export\_system\_tags  export\_max\_characters\_allowed  custom\_metadata\_columns  export\_use\_ordinal\_rules |

Phrase Strings JSON format provides a structured way to store and manage translations, incorporating metadata, state tracking, and workflow integration for improved functionality.

This format includes metadata such as localization details, [character limits](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109), descriptions, [plural form](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-46fb5ff5-b818-e993-4ecc-bbd777eea828) type, and [translation states](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1). The state support feature allows better tracking of translation progress and integration with automated workflows.

#### Field Definitions

###### Key Object

The key object contains metadata and settings for each translation key.

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Yes | String | Unique identifier for the key. |
| `description` | No | String | A brief explanation of the key’s purpose. |
| `plural` | No | Boolean | Specifies if the key supports pluralization. |
| `use_ordinal_rules` | No | Boolean | Indicates whether key plural forms are ordinal. Defaults to `false` if omitted.  Used during import and export. |
| `max_characters_allowed` | No | Integer/Null | Maximum number of characters allowed. `null` means no limit. |
| `tags` | No | Array | Categorization [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-e647235a-f7a4-26cf-82ce-f172f3330193) for filtering and organization. |
| `metadata` | No | Object | Stores additional metadata as key-value pairs.  It can be added or updated but not removed. To remove metadata, set its value to an empty string. |

###### Translations Object

The translations object contains localized translations for a given key.

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `locale` | Yes | String | The name or identifier of the [locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8) as configured in Project/Languages. This value determines the match during import. If it doesn't exactly match an existing language name, the translation will not be imported. |
| `locale_code` | No | String | The locale’s language code (e.g., en-US, fr-FR). |
| `content` | Yes | String/Object | The translated content. If pluralized, an object mapping plural forms based on the key’s `use_ordinal_rules` setting. |
| `state` | No | String | The state of the translation. Supported translation states:  - untranslated - unverified - translated - reviewed |

#### Format Options

|  |  |
| --- | --- |
| **Identifier** | ignore\_translation\_state |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | If true, ignores state values in imported translations, meaning that the uploaded file will not overwrite existing translation states. |

|  |  |
| --- | --- |
| **Identifier** | export\_translation\_state |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | Includes state values in exported translations; if set to false, state information will be omitted from the exported file. |

|  |  |
| --- | --- |
| **Identifier** | export\_system\_tags |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | If true, exports system tags along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | export\_tags |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | If true, exports tags along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | export\_description |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | Exports key description. |

|  |  |
| --- | --- |
| **Identifier** | export\_max\_characters\_allowed |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | Exports the key character limit along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | custom\_metadata\_columns |
| **Type** | hash |
| **Upload** | No |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | HashMap of [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f) values that need to be imported or exported:  - Key = Name of the custom metadata property, as defined in Phrase Strings. - Value = Column index (*1*, *2*, *3*, etc.) where the property is in the imported file/where the property should be in the exported file. |

|  |  |
| --- | --- |
| **Identifier** | export\_use\_ordinal\_rules |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | If true, the `use_ordinal_rules` field is displayed in the downloaded file.  If [downloading files via the UI](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-5987e780-55f5-f730-87b6-071f69103a05), use the corresponding option Add plural type for each key. |

#### Code Sample

```
{
  "welcome_message": {
    "key": {
      "description": "Message displayed on the welcome screen",
      "plural": false,
      "max_characters_allowed": 100,
      "tags": ["UI", "greeting"],
      "metadata": {
        "created_by": "admin",
        "created_at": "2024-06-20T12:34:56Z"
      }
    },
    "translations": [
      {
        "locale": "English (United States)",
        "locale_code": "en-US",
        "content": "Welcome to our application!",
        "state": "reviewed"
      },
      {
        "locale": "French (France)",
        "locale_code": "fr-FR",
        "content": "Bienvenue dans notre application !",
        "state": "translated"
      }
    ]
  }
}
```

#### Plural forms

This format uses named categories to identify the different pluralizations of a key. The following categories are reserved for plural forms:

```
.zero | .one | .two | .few | .many | .other
```

Example names for correctly identified, persisted and marked pluralized keys:

- inbox.messages.notification.one
- inbox.messages.notification.other

Plural form usage is configured through the `use_ordinal_rules` field. If `use_ordinal_rules` is false or unset, cardinal pluralization rules will apply.

##### Example Input

```
{
  "rank": {
    "use_ordinal_rules": true,
    "values": {
      "one": "1st place",
      "two": "2nd place",
      "few": "3rd place",
      "other": "%dth place"
    }
  }
```

---

### .JSON - React-Intl Simple (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390065948--JSON-React-Intl-Simple-Strings  
> Zuletzt aktualisiert: 2024-07-04T07:09:38Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | react\_simple\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes, with default [message extraction](https://formatjs.io/docs/getting-started/message-extraction/). |

[React-Intl](https://github.com/yahoo/react-intl) is a JavaScript library designed to simplify internationalization (i18n) and (localization) primarily for applications developed in React. By default, React-Intl uses .js files to store its localized content. Localized content is decoupled into a standardized .JSON file (React-Intl Simple JSON) to be referenced in source code.

If using nested messages, use the React-Intl Nested JSON format. This is deprecated in React Intl v2.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

##### Code Sample

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested.deeply.key": "I'm a deeply nested key.",
  "nested.key": "This key is nested inside a namespace.",
  "null_translation": null,
  "pluralized_key.one": "Only one kitten found.",
  "pluralized_key.other": "Wow, you have %s kittens!",
  "pluralized_key.zero": "You have no kittens.",
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Simple key, simple message, so simple.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
}
```

##### Using React Intl

Translations normally reside in a .js file:

```
module.exports = {
    "locales": ["en-US"],
    "messages": {
        "hello" : "World",
        other_hello : 'Other World',
    },
    "formats": {}
};
```

Move messages into a separate locale file, e.g. en-US.json:

```
{
    "hello" : "World",
    other_hello : 'Other World',
}
```

Ensure messages have [valid .JSON syntax](http://www.json.org/):

```
{
    "hello" : "World",
    "other_hello" : "Other World"
}
```

Include the messages with a require statement:

```
module.exports = {
    "locales": ["en-US"],
    "messages": require('./en-US.json'),
    "formats": {}
};
```

React-Intl Simple JSON format can now be used to upload/download React Intl locale files.

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .JSON - Simple (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346248860--JSON-Simple-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:17:34Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .json |
| **API Extension** | simple\_json |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | enable\_pluralization, preserve\_data\_types |

.JSON (JavaScript Object Notation) was originally designed only for JavaScript, but became a standard exchange file format in parallel with .XML, .YAML, .Properties, etc. .JSON consists of key-value pairs wrapped in curly brackets. A value can either be a string, a number, or an object (one or more key-value pairs wrapped in curly brackets). Simple JSON is a .JSON file with most values being plain strings excepting for plural forms purposes. In this case, strings placed as values will be translated.

AI chatbots can be very effective at generating a list of keys from a .JSON file.

#### Format Options

|  |  |
| --- | --- |
| **Identifier** | enable\_pluralization |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | true |
| **Description** | Enables detection of pluralized keys. All matching keys will be persisted as pluralized keys. |

|  |  |
| --- | --- |
| **Identifier** | preserve\_data\_types |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | False |
| **Description** | When enabled, keys typed as Number or Boolean in the key's Meta section are exported as real JSON numbers or booleans instead of quoted strings. When disabled (default), all key values are exported as strings regardless of declared type. |

#### Code Sample

```
{
  "boolean_key": "--- true\n",
  "empty_string_translation": "",
  "key_with_description": "Check it out! This key has a description! (At least in some formats)",
  "key_with_line-break": "This translations contains\na line-break.",
  "nested.deeply.key": "Wow, this key is nested even deeper.",
  "nested.key": "This key is nested inside a namespace.",
  "null_translation": null,
  "pluralized_key": {
    "one": "Only one pluralization found.",
    "other": "Wow, you have %s pluralizations!",
    "zero": "You have no pluralization."
  },
  "sample_collection": [
    "first item",
    "second item",
    "third item"
  ],
  "simple_key": "Just a simple key with a simple message.",
  "unverified_key": "This translation is not yet verified and waits for it. (In some formats we also export this status)"
}
```

#### Plural forms

This format uses named categories to identify the different pluralizations of a key. The following categories are reserved for plural forms:

```
.zero | .one | .two | .few | .many | .other
```

Example names for correctly identified, persisted and marked pluralized keys:

- inbox.messages.notification.one
- inbox.messages.notification.other

#### Plurals for JSON files

The most common format of plural key messages on various libraries:

```
"messages": {
    "one": "One message received.",
    "other": "%s messages received.",
    "zero": "No messages received."
}
```

---

### .MO - Gettext-compiled (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111354648476--MO-Gettext-compiled-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:55Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .mo |
| **API Extension** | gettext\_mo |
| **Import** | No |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | No |

[GNU gettext](https://www.gnu.org/software/gettext/) is a standard library for streamlining localization and internationalization. It extracts strings from source code, creates editable localization formats, and integrates the translated content back into the software.

With correct configuration, gettext generates either a POT (portable object template) or a PO (portable object), both of which contain strings extracted from the source code. These two files can be opened with a text editor. After the translation is done, gettext converts the PO into a MO file (machine object file) that is only readable to the computer.

---

### .PHP - Array (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343537820--PHP-Array-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:24:12Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .php |
| **API Extension** | php\_array |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

An array is an ordered list or collection of items. The items of the array can be basically any type in PHP: a number, a string, an object, another array, etc. We often use strings as values in our locale message arrays. PHP arrays come in two major kinds:

- Indexed — these arrays are ordered implicitly, e.g. ['*red*', '*green*', '*blue*']
- Associative — these arrays contain pairs of keys (which can be integers or strings), and associated values, e.g. ['first\_name' => 'Adam', 'last\_name' => 'McMan', 'age' => 22]

The value of an array element can be set during initialization or using the variable name of the array itself.

```
<?php

// during initialization

$my_array = ['foo' => 'bar'];

// using variable name 

$my_second_array['key'] = 'value'
```

This method of setting values can be mixed and matched.

##### Working with Arrays

When pulling from the command line, message files will be sent in the following format using an associative, named array.

```
<?php

$lang['key'] = 'translated message';

$lang['another_key'] = 'Another translated message';
```

Ensure app is set up to work with this kind of format. Don’t return an anonymous array in message files and use the name `$lang` for the messages array.

##### Code Sample

```
<?php

$lang['boolean_key'] = '--- true
';
$lang['empty_string_translation'] = '';
$lang['key_with_description'] = 'Check it out! This key has a description! (At least in some formats)';
$lang['key_with_line-break'] = 'This translations contains
a line-break.';
$lang['nested.deeply.key'] = 'Wow, this key is nested even deeper.';
$lang['nested.key'] = 'This key is nested inside a namespace.';
$lang['null_translation'] = '';
$lang['sample_collection'] = '---
- first item
- second item
- third item
';
$lang['simple_key'] = 'Just a simple key with a simple message.';
$lang['unverified_key'] = 'This translation is not yet verified and waits for it. (In some formats we also export this status)';
```

---

### .PHP - Laravel/F3/Kohana Array (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390129180--PHP-Laravel-F3-Kohana-Array-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:24:13Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .php |
| **API Extension** | laravel |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Laravel uses plain PHP arrays for its locale message files. An array is an ordered list or collection of items. The items of the array can be of any type in PHP: a number, a string, an object, another array, etc. Strings are often used as values in locale message arrays. Laravel uses associative arrays containing key-value pairs; it also has one anonymous array per message file with the file returning the array.

##### Plurals in Laravel Arrays

Use caution when working with plurals. The editor recognizes simple plural syntax, e.g. “Zero things|One thing|Many things” but will not recognize complex plural syntax with count and range specifiers. For complex plurals, use newlines in plural strings to help translators.

**Example**:

```
<?php

return [

    "hello" => "Welcome to my new site",

];
```

##### Code Sample

```
<?php

return [

    "hello" => "Welcome to my new site",

    // Supported in Phrase web editor ??

    "Simple_plural" => "Zero things|One thing|Many things",

        // Not supported in Phrase web editor ??, try to use new

    // lines to help translators.

    "complex_plural" => "

        {0} Zero things

        |{1} One thing

        |[2,*] Multiple things

    ",

];
```

---

### Play Framework Properties

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390139164-Play-Framework-Properties  
> Zuletzt aktualisiert: 2025-10-16T06:06:57Z  
> Labels: 2BTr

|  |  |
| --- | --- |
| **File Extensions** | .de, .fr, .en,... |
| **API Extension** | play\_properties |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | escape\_single\_quotes |

Play Framework is a widely-used, web development framework based on Scala. Play Framework supports localization and internationalization. The standard localization file format is Play Framework Properties file. These can be imported and exported using Phrase. The Play Framework Properties file shares the same file structure with the [Java Properties file](https://support.phrase.com/hc/en-us/articles/6111361943324--PROPERTIES-Java-Properties-Strings) (i.e., key-value string pairs connected with a `=`). Their difference is mainly in the file extensions. While a Java Properties file often ends with `.properties`, a Play Framework Properties File typically follows a locale-based convention (e.g., *messages.en/messages.de*).

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | escape\_single\_quotes |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | true |
| **Description** | Escape single quotes with another single quote (e.g. *I'm* to *I''m*). |

##### Code Sample

```
boolean_key = --- true\n
empty_string_translation = 
# This is the amazing description for this key!
key_with_description = Check it out! This key has a description! (At least in some formats)
key_with_line-break = This translations contains\na line-break.
nested.deeply.key = Wow, this key is nested even deeper.
nested.key = This key is nested inside a namespace.
null_translation = 
pluralized_key.one = Only one pluralization found.
pluralized_key.other = Wow, you have %s pluralizations!
pluralized_key.zero = You have no pluralization.
sample_collection = ---\n- first item\n- second item\n- third item\n
simple_key = Just a simple key with a simple message.
unverified_key = This translation is not yet verified and waits for it. (In some formats we also export this status)
```

---

### .PLIST - Objective-C/Cocoa Property List (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111361881884--PLIST-Objective-C-Cocoa-Property-List-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:24:15Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .plist |
| **API Extension** | plist |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>boolean_key</key>
    <string>--- true
</string>
  </dict>
  <dict>
    <key>empty_string_translation</key>
    <string/>
  </dict>
  <dict>
    <key>key_with_description</key>
    <string>This key has a description! (At least in some formats)</string>
  </dict>
  <dict>
    <key>key_with_line-break</key>
    <string>This translations contains
a line-break.</string>
  </dict>
  <dict>
    <key>nested.deeply.key</key>
    <string>I'm a deeply nested key.</string>
  </dict>
  <dict>
    <key>nested.key</key>
    <string>This key is nested inside a namespace.</string>
  </dict>
  <dict>
    <key>null_translation</key>
    <string/>
  </dict>
  <dict>
    <key>pluralized_key.one</key>
    <string>Only one kitten found.</string>
  </dict>
  <dict>
    <key>pluralized_key.other</key>
    <string>Hey, you have %s kittens!</string>
  </dict>
  <dict>
    <key>pluralized_key.zero</key>
    <string>You have no kittens.</string>
  </dict>
  <dict>
    <key>sample_collection</key>
    <string>---
- first item
- second item
- third item
</string>
  </dict>
  <dict>
    <key>simple_key</key>
    <string>Just a simple key with a simple message.</string>
  </dict>
  <dict>
    <key>unverified_key</key>
    <string>This translation is not yet verified and waits for it. (In some formats we also export this status)</string>
  </dict>
</plist>
```

---

### .PO - gettext files (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343649820--PO-gettext-files-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:58Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .po |
| **API Extension** | gettext |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | - msgid\_as\_default - is\_bilingual\_file |

.PO (Portable Object) is the standard file format for localization with GNU [gettext](https://www.gnu.org/software/gettext/), an open-source GNU library designed to simplify the localization process. With GNU gettext, localizable strings are extracted from source code into a PO file for translation. A .PO file is a series of key-value pairs. The key `msgid` is where the source string is placed while the value `msgstr` is where the translation goes.

gettext extracts strings from source code into a .POT (portable object template). Based on defined locales, gettext then converts the .POT file into a locale-specific .PO files for upload to a CAT tool for translation. After translation, gettext converts the translated .PO files into .MO files (machine object files) eventually used for localization.

.PO files are identical to .POT files excepting .POT files are generally used by gettext to generate locale-specific .PO files. Translating a .POT file directly and renaming it according to the later intended locale does not generate problems. Phrase supports the translation of:

- .PO files
- Bilingual .PO files
- [.POT files](https://support.phrase.com/hc/en-us/articles/6111390193820#UUID-e18c41b3-1c25-45f2-6447-fc0de5450ba8 ".POT - Gettext Template Files (Strings)")
- Machine-readable .MO files

`msgctxt` will be used as key prefix, combined with `msgid` and separated by `||`.

##### Format options

|  |  |
| --- | --- |
| **Identifier** | msgid\_as\_default |
| **Type** | Boolean |
| **Upload** | true |
| **Download** | false |
| **Default** | false |
| **Description** | Takes the translation content from `msgid` value instead from `msgstr` |

|  |  |
| --- | --- |
| **Identifier** | is\_bilingual\_file |
| **Type** | Boolean |
| **Upload** | true |
| **Download** | false |
| **Default** | false |
| **Description** | Both source and target translations will be imported from the uploaded file: source content will be picked up from `msgid` value, target from the value of the `msgstr` |

##### Code Sample

```
msgid ""
msgstr ""
"Language: English\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"
"X-Generator: PhraseApp (phraseapp.com)\n"

msgid "boolean_key"
msgstr "--- true\n"

msgid "empty_string_translation"
msgstr ""

# This is the amazing description for this key!
msgid "key_with_description"
msgstr "Check it out! This key has a description! (At least in some formats)"

msgid "key_with_line-break"
msgstr "This translations contains\na line-break."

msgid "nested.deeply.key"
msgstr "Wow, this key is nested even deeper."

msgid "nested.key"
msgstr "This key is nested inside a namespace."

msgid "null_translation"
msgstr ""

msgid "pluralized_key"
msgid_plural ""
msgstr[0] "Only one pluralization found."
msgstr[1] "Wow, you have %s pluralizations!"

msgid "sample_collection"
msgstr "---\n- first item\n- second item\n- third item\n"

msgid "simple_key"
msgstr "simple key, simple message, so simple.2"

#, fuzzy
msgid "unverified_key"
msgstr "I need verification, please verify me! (In some formats we also export this status)"
```

**Typical gettext entry:**

```
# description (Optional)
msgid "key-name"
msgstr "My Translation"
```

##### gettext Header

The header of a gettext file may contain a locale name and data for plural forms that is extracted during import:

```
msgid ""
msgstr ""
"Language: en\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"
"X-Generator: PhraseApp (phraseapp.com)\n"
```

##### Descriptions

Comments in a gettext file are added as key descriptions during import:

```
# This is my description
msgid "app_title"
msgstr "My Software Project"
```

##### Context

gettext uses the `msgctxt` notation to distinguish different contexts for the same `msgid`. Every key name must be unique so `msgctxt` is added as the first part of the key name, separated by two pipe symbols `||`:

```
msgctxt "menu"
msgid "Open"
msgstr "I'am a translation"

msgctxt "forum"
msgid "Open"
msgstr "I'am some other translation"
```

To add the `msgctxt` to a new key, prepend it to the key name:

```
my_context||my_key_name
```

Resulting gettext output:

```
...
msgctxt "my_context"
msgid "my_key_name"
...
```

##### Plural forms

gettext supports plural forms for a translation:

```
msgid "new_messages"
msgid_plural ""
msgstr[0] "You have a new message"
msgstr[1] "You have %{count} new messages"
```

##### Fuzzy

The fuzzy keyword is used for translation verification. Fuzzy automatically invokes the unverification process within Phrase.

```
#, fuzzy
msgid "app_title"
msgstr "My Software Project"
```

---

### .POT - Gettext Template Files (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390193820--POT-Gettext-Template-Files-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:06:59Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .pot |
| **API Extension** | gettext\_template |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | msgid\_as\_default |

POT (portable object template), is a format generated by GNU [gettext](https://www.gnu.org/software/gettext/) to streamline software localization and internationalization. While source strings are placed after `msgid`, their translations are placed after `msgtr`.

POT files may also be PO files. These two files are mostly identical excepting PO files are generated by calling `msginit` in CMD. It is possible to perform the translation on a POT file first and then rename it to a PO. The final localized format should be a machine-readable `.mo` file generated from the PO file. The `.mo` file can be generated by calling `msgfmt` in CMD.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | msgid\_as\_default |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Use the key name (msgid) as translation |

##### Code Sample

```
msgid ""
msgstr ""
"Language: English\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\n"
"X-Generator: PhraseApp (phraseapp.com)\n"

msgid "boolean_key"
msgstr ""

msgid "empty_string_translation"
msgstr ""

#I'm a very important description for this key!
msgid "key_with_description"
msgstr ""

msgid "key_with_line-break"
msgstr ""

msgid "nested.deeply.key"
msgstr ""

msgid "nested.key"
msgstr ""

msgid "null_translation"
msgstr ""

msgid "pluralized_key"
msgid_plural ""
msgstr[0] ""
msgstr[1] ""

msgid "sample_collection"
msgstr ""

msgid "simple_key"
msgstr ""

#, fuzzy
msgid "unverified_key"
msgstr ""
```

---

### .PROPERTIES - Java Properties (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111361943324--PROPERTIES-Java-Properties-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:00Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .properties |
| **API Extension** | properties |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | escape\_single\_quotes  omit\_separator\_space  crlf\_line\_terminators  `escape_meta_chars` |

Java Properties are standard config/localization files typically used by Java. This file format contains key-value pairs connected by a `=` sign. Apart from this, it does not have any other cascading element. `Values` in the file will always be parsed as a String type.

Duplicate keys (the file contains two or more identical keys) should not be problematic, but values loaded later in the process will overwrite previous data. When preparing a file for translation, check for duplicate keys by putting the properties files into a Java IDE (e.g. Eclipse, IntelliJ) to identify them.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | escape\_single\_quotes |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | true |
| **Description** | Escape single quotes with another single quote (e.g. I'm -> I''m ). |

|  |  |
| --- | --- |
| **Identifier** | omit\_separator\_space |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Skip the space before and after the separator sign (= ). |

|  |  |
| --- | --- |
| **Identifier** | crlf\_line\_terminators |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Use CRLF (Windows) line terminator chars. |

|  |  |
| --- | --- |
| **Identifier** | escape\_meta\_chars |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | Escape meta characters (`:=!#`) using a backslash |

##### Code Sample

```
boolean_key = --- true\n
empty_string_translation = 
# This is the amazing description for this key!
key_with_description = Check it out\! This key has a description\! (At least in some formats)
key_with_line-break = This translations contains\na line-break.
nested.deeply.key = Wow, this key is nested even deeper.
nested.key = This key is nested inside a namespace.
null_translation = 
pluralized_key.one = Only one pluralization found.
pluralized_key.other = Wow, you have %s pluralizations\!
pluralized_key.zero = You have no pluralization.
sample_collection = ---\n- first item\n- second item\n- third item\n
simple_key = Just a simple key with a simple message.
unverified_key = This translation is not yet verified and waits for it. (In some formats we also export this status)
```

---

### .PROPERTIES - Mozilla (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343696924--PROPERTIES-Mozilla-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:00Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .properties |
| **API Extension** | mozilla\_properties |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | escape\_single\_quotes: true, omit\_separator\_space: false, crlf\_line\_terminators: false, escape\_meta\_chars: true |

Mozilla Localization uses .properties files. Syntax and requirements for these properties are mostly identical with standard [Java properties](https://support.phrase.com/hc/en-us/articles/6111361943324--PROPERTIES-Java-Properties-Strings) files.

Perform a sanity check prior to translation including removing duplicate keys (especially for larger files) and using correct line breaks (any line break in text strings should be preceded with a `\n`, otherwise it will be ignored by the parser).

##### Code Sample

```
boolean_key = --- true\n
empty_string_translation = 
# This is the amazing description for this key!
key_with_description = Check it out\! This key has a description\! (At least in some formats)
key_with_line-break = This translations contains\na line-break.
nested.deeply.key = I'm a deeply nested key.
nested.key = This key is nested inside a namespace.
null_translation = 
pluralized_key.one = Only one kitten found.
pluralized_key.other = Wow, you have %s kittens\!
pluralized_key.zero = You have no kitten.
sample_collection = ---\n- first item\n- second item\n- third item\n
simple_key = Simple key, simple message, so simple.
unverified_key = This translation is not yet verified and waits for it. (In some formats we also export this status)
```

---

### .QPH - Qt Phrase Book (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343710876--QPH-Qt-Phrase-Book-Strings  
> Zuletzt aktualisiert: 2024-11-11T13:21:28Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .qph |
| **API Extension** | qph |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

Qt Phrase Book is an XML-based file format used by Qt Linguists to populate pre-translated content. Its unit element is `<phrase>` with a nesting `<source>` and a `<target>` element.

Qt Phrase Book (.QPH) is different from [Qt Translation Source](https://support.phrase.com/hc/en-us/articles/6111346553628--TS-Qt-Translation-Source-Strings) (.TS) in that .QPH is a glossary, while .TS is an exchange file format. .TS is used by Qt applications to load localized content into the software, while .QPH serves as a termbase in Qt Linguist.

##### Code Sample

```
<!DOCTYPE QPH>
<QPH language="en-GB">
  <phrase>
    <source>boolean_key</source>
    <target>--- true
</target>
  </phrase>
  <phrase>
    <source>empty_string_translation</source>
    <target/>
  </phrase>
  <phrase>
    <source>key_with_description</source>
    <target>I'm a very important description for this key! (At least in some formats)</target>
  </phrase>
  <phrase>
    <source>key_with_line-break</source>
    <target>This translations contains
a line-break.</target>
  </phrase>
  <phrase>
    <source>nested.deeply.key</source>
    <target>Wow, this key is nested even deeper.</target>
  </phrase>
  <phrase>
    <source>nested.key</source>
    <target>This key is nested inside a namespace.</target>
  </phrase>
  <phrase>
    <source>null_translation</source>
    <target/>
  </phrase>
  <phrase>
    <source>pluralized_key_one</source>
    <target>Only one kitten found.</target>
  </phrase>
  <phrase>
    <source>pluralized_key_other</source>
    <target>Wow, you have %s kittens!</target>
  </phrase>
  <phrase>
    <source>pluralized_key_zero</source>
    <target>You have no kittens.</target>
  </phrase>
  <phrase>
    <source>sample_collection</source>
    <target>---
- first item
- second item
- third item
</target>
  </phrase>
  <phrase>
    <source>simple_key</source>
    <target>Simple key, simple message, so simple.</target>
  </phrase>
  <phrase>
    <source>unverified_key</source>
    <target>This translation is not yet verified and waits for it. (In some formats we also export this status)</target>
  </phrase>
</QPH>
```

---

### .RESX - Microsoft .NET (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111361990044--RESX-Microsoft-NET-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:39Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .resx, .resw |
| **API Extension** | resx |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | No |

.NET is an open-source software development framework for mainly Microsoft Windows. Localization for apps developed using the .NET framework work primarily with resources files (.resx).

.resx files are XML-based with the root element being `<root>`. Localizable strings are typically embedded in `<value>` elements nested under `<data>`. `<value>` elements may also be found in `<resheader>` but these are usually metadata not intended for translation.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <xsd:schema xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" id="root">
    <xsd:element name="data">
      <xsd:complexType>
        <xsd:sequence>
          <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="2"/>
        </xsd:sequence>
        <xsd:attribute name="name" type="xsd:string"/>
        <xsd:attribute name="type" type="xsd:string"/>
        <xsd:attribute name="mimetype" type="xsd:string"/>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="boolean_key">
    <value>--- true
</value>
  </data>
  <data name="empty_string_translation">
    <value/>
  </data>
  <data name="key_with_description">
    <value>Now that's a decsription! (For some formats at least)</value>
    <comment>This is the superb description for this key!</comment>
  </data>
  <data name="key_with_line-break">
    <value>This translations contains
a line-break.</value>
  </data>
  <data name="nested.deeply.key">
    <value>I'm a deeply nested key.</value>
  </data>
  <data name="nested.key">
    <value>This key is nested inside a namespace.</value>
  </data>
  <data name="null_translation">
    <value/>
  </data>
  <data name="pluralized_key">
    <value>This could be pluralized.</value>
  </data>
  <data name="sample_collection">
    <value>---
- first item
- second item
- third item
</value>
  </data>
  <data name="simple_key">
    <value>simple key, simple message, everything so simple.</value>
  </data>
  <data name="unverified_key">
    <value>This translation is not yet verified and is waiting for it. (In some formats we export this status as well)</value>
  </data>
</root>
```

---

### .RESX - Windows 8 Resource (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111354836380--RESX-Windows-8-Resource-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:40Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .resx, .resw |
| **API Extension** | windows8\_resource |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |

An XML-based file format used primarily by Windows applications. Compared with other file formats, such as .XLIFF and .TS, it is not designed specifically for localization or translation and is not usually bi-lingual or multi-lingual. When used for localization, strings pending translation are stored in the `<value>` element nested under `<data>`. `<value>` elements under other tags are not supposed to be changed or filtered for translation.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <xsd:schema xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" id="root">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace"/>
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded"/>
        <xsd:element name="data">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="2"/>
            </xsd:sequence>
            <xsd:attribute name="name" type="xsd:string"/>
            <xsd:attribute name="type" type="xsd:string"/>
            <xsd:attribute name="mimetype" type="xsd:string"/>
          </xsd:complexType>
        </xsd:element>
        <xsd:element name="resheader">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1"/>
            </xsd:sequence>
            <xsd:attribute name="name" type="xsd:string" use="required"/>
          </xsd:complexType>
        </xsd:element>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="boolean_key">
    <value>--- true
</value>
  </data>
  <data name="empty_string_translation">
    <value/>
  </data>
  <data name="key_with_description">
    <value>This key has a description! (At least in some formats)</value>
    <comment>I'm an important description for that key!</comment>
  </data>
  <data name="key_with_line-break">
    <value>This translations contains
a line-break.</value>
  </data>
  <data name="nested.deeply.key">
    <value>I'm a deeply nested key.</value>
  </data>
  <data name="nested.key">
    <value>This key is nested inside a namespace.</value>
  </data>
  <data name="null_translation">
    <value/>
  </data>
  <data name="pluralized_key">
    <value>You have no pluralization.</value>
  </data>
  <data name="sample_collection">
    <value>---
- first item
- second item
- third item
</value>
  </data>
  <data name="simple_key">
    <value>Simple key, simple message.</value>
  </data>
  <data name="unverified_key">
    <value>Not yet verified translation waiting for it. (In some formats we also export this status)</value>
  </data>
</root>
```

---

### .RESX - Windows Phone ResX (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111343767196--RESX-Windows-Phone-ResX-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:03Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .resx, .resw |
| **API Extension** | resx\_windowsphone |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |

Windows Phone is a mobile operating system developed by Microsoft. Similar to other Microsoft platforms (e.g. .NET), Windows Phone supports localization and internationalization through its variation of .resx files.

Windows Phone ResX files are XML-based. Translatable data are placed in the `<value>` elements nested under `<data>`. `<value>` elements may also exist in the `<resheader>` elements. These `<value>` elements contain metadata associated with the app and should not be treated as translatable strings. Phrase has a ready-for-use filter to help you manage Windows Phone ResXs.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <xsd:schema xmlns="" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" id="root">
    <xsd:import namespace="http://www.w3.org/XML/1998/namespace"/>
    <xsd:element name="root" msdata:IsDataSet="true">
      <xsd:complexType>
        <xsd:choice maxOccurs="unbounded"/>
        <xsd:element name="data">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="2"/>
            </xsd:sequence>
            <xsd:attribute name="name" type="xsd:string"/>
            <xsd:attribute name="type" type="xsd:string"/>
            <xsd:attribute name="mimetype" type="xsd:string"/>
          </xsd:complexType>
        </xsd:element>
        <xsd:element name="resheader">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="value" type="xsd:string" minOccurs="0" msdata:Ordinal="1"/>
            </xsd:sequence>
            <xsd:attribute name="name" type="xsd:string" use="required"/>
          </xsd:complexType>
        </xsd:element>
      </xsd:complexType>
    </xsd:element>
  </xsd:schema>
  <resheader name="resmimetype">
    <value>text/microsoft-resx</value>
  </resheader>
  <resheader name="version">
    <value>2.0</value>
  </resheader>
  <resheader name="reader">
    <value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <resheader name="writer">
    <value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value>
  </resheader>
  <data name="boolean_key">
    <value>--- true
</value>
  </data>
  <data name="empty_string_translation">
    <value/>
  </data>
  <data name="key_with_description">
    <value>This key has a description! (At least in some formats)</value>
    <comment>I'm an important description for this key!</comment>
  </data>
  <data name="key_with_line-break">
    <value>This translations contains
a line-break.</value>
  </data>
  <data name="nested.deeply.key">
    <value>I'm a deeply nested key.</value>
  </data>
  <data name="nested.key">
    <value>This key is nested inside a namespace.</value>
  </data>
  <data name="null_translation">
    <value/>
  </data>
  <data name="pluralized_key">
    <value>You have no pluralization.</value>
  </data>
  <data name="sample_collection">
    <value>---
- first item
- second item
- third item
</value>
  </data>
  <data name="simple_key">
    <value>Simple key, simple message.</value>
  </data>
  <data name="unverified_key">
    <value>This translation is not yet verified and is waiting for it. (In some formats we also export this status)</value>
  </data>
</root>
```

---

### .STRINGSDICT - iOS Localizable Stringsdict for Pluralized Translation Keys (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/17856143243036--STRINGSDICT-iOS-Localizable-Stringsdict-for-Pluralized-Translation-Keys-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:04Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .stringsdict |
| **API Extension** | stringsdict |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | convert\_placeholder |

OS Localizable Stringsdict is an XML-based exchange file format used to define language plural rules. It is used when providing several translations for a string in a language with different plural forms (e.g., Arabic). The root element of a Stringsdict file is `<plist>` that holds one or more `<dict>` elements. Each dict element represents a key that will be referenced in the source code.

iOS Stringsdict should only be used to provide alternate translations for languages that have different plural rules. Otherwise, use the standard localization file format for iOS and OS X is the iOS Strings Resource file format.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | convert\_placeholder |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Placeholder will be converted to match format specific requirements. Example: `$s`→`$@` |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
  <dict>
    <key>pluralized_key</key>
    <dict>
      <key>NSStringLocalizedFormatKey</key>
      <string>%#@localized_format_key@</string>
      <key>localized_format_key</key>
      <dict>
        <key>NSStringFormatSpecTypeKey</key>
        <string>NSStringPluralRuleType</string>
        <key>NSStringFormatValueTypeKey</key>
        <string>d</string>
        <key>one</key>
        <string>Only one pluralization found.</string>
        <key>other</key>
        <string>Wow, you have %s pluralizations!</string>
        <key>zero</key>
        <string>You have no pluralization.</string>
      </dict>
    </dict>
  </dict>
</plist>
```

---

### .STRINGS - iOS Strings Resources (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346507676--STRINGS-iOS-Strings-Resources-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:05Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .strings |
| **API Extension** | strings |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | convert\_placeholder, include\_pluralized\_keys, multiline\_comments |

[Strings Resource](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/LoadingResources/Strings/Strings.html) files are standard localization files used for iOS and OS X applications. A Strings Resource file consists of key-value pairs connected by an `=` sign. It is similar to a Java Properties file, excepting that both keys and values are wrapped in double-quotes and that each key-value pair ends with a semicolon.

If generating Strings Resource files using a 3rd party tool (e.g., genstrings), it is possible that to have files with duplicate key strings. Duplicate keys are not normally problematic, but removing them before initiating the translation process is recommended.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | convert\_placeholder |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Placeholder will be converted to match format specific requirements. Example: `$s`→`$@`, `%s`→`%@` |

|  |  |
| --- | --- |
| **Identifier** | include\_pluralized\_keys |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | true |
| **Description** | Also include pluralized keys in the locale file. |

|  |  |
| --- | --- |
| **Identifier** | multiline\_comments |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | When enabled, multiline comments are rendered within the .strings file. |

##### Code Sample

```
"boolean_key" = "--- true\n";
"empty_string_translation" = "";
/* This is the amazing description for this key! */
"key_with_description" = "Check it out! This key has a description! (At least in some formats)";
"key_with_line-break" = "This translations contains\na line-break.";
"nested.deeply.key" = "Wow, this key is nested even deeper.";
"nested.key" = "This key is nested inside a namespace.";
"null_translation" = "";
"pluralized_key.one" = "Only one pluralization found.";
"pluralized_key.other" = "Wow, you have %s pluralizations!";
"pluralized_key.zero" = "You have no pluralization.";
"sample_collection" = "---\n- first item\n- second item\n- third item\n";
"simple_key" = "Just a simple key with a simple message.";
"unverified_key" = "This translation is not yet verified and waits for it. (In some formats we also export this status)";
```

##### Plurals for iOS Localizable Strings

For plural values, add the following postfix operators:

```
"messages.zero" = "No messages received";
"messages.one" = "One message received";
"messages.other" = "%s messages received";
```

---

### .TMX (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346531484--TMX-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:46Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .tmx |
| **API Extension** | tmx |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |

[TMX (Translation Memory Exchange)](https://en.wikipedia.org/wiki/Translation_Memory_eXchange) is an XML-based file used by CAT tools for the storage, update, and exchange of translated paired strings. Although different CAT tools may vary in their default file formats for Translation Memory, generally they all support TMX files. CAT tool specific Translation Memory Files can be converted to a TMX, or external TMXs can be imported to expand a TM database. TMX is the industry-standard file format for Translation Memory Management.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<tmx version="1.4">
  <header creationtool="phraseapp.com" datatype="PlainText" segtype="paragraph" adminlang="en-US" srclang="de-DE" creationdate="2018-06-11 05:09:06 UTC" o-encoding="utf8"/>
  <body>
    <tu tuid="boolean_key" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>--- true
</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>--- true
</seg>
      </tuv>
    </tu>
    <tu tuid="empty_string_translation" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg/>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg/>
      </tuv>
    </tu>
    <tu tuid="key_with_description" datatype="Text">
      <note>This is the proper description for that key!</note>
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Dieser Key hat eine Beschreibung!</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>This key has a description!</seg>
      </tuv>
    </tu>
    <tu tuid="key_with_line-break" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Diese Übersetzung hat
einen Zeilenumbruch.</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>This translations contains
a line-break.</seg>
      </tuv>
    </tu>
    <tu tuid="nested.deeply.key" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Ich bin ein tief verschachtelter Key</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>I'm a deeply nested key.</seg>
      </tuv>
    </tu>
    <tu tuid="nested.key" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Dieser Key ist innerhalb eines Namensraumes verschachtelt.</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>This key is nested inside a namespace.</seg>
      </tuv>
    </tu>
    <tu tuid="null_translation" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg/>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg/>
      </tuv>
    </tu>
    <tu tuid="pluralized_key_one" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Es wurde nur ein Hund gefunden.</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>Only one dog was found.</seg>
      </tuv>
    </tu>
    <tu tuid="pluralized_key_other" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Hey, du hast %s Hunde!</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>Hey, you have %s dogs!</seg>
      </tuv>
    </tu>
    <tu tuid="pluralized_key_zero" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Du hast keine Hunde.</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>You have no dogs.</seg>
      </tuv>
    </tu>
    <tu tuid="sample_collection" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>---
- erstes Item
- zweites Item
</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>---
- first item
- second item
- third item
</seg>
      </tuv>
    </tu>
    <tu tuid="simple_key" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Einfacher Key, einfache Nachricht./seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>Simple key, simple message.</seg>
      </tuv>
    </tu>
    <tu tuid="unverified_key" datatype="Text">
      <prop type="x-Project">Project</prop>
      <tuv xml:lang="de-DE">
        <seg>Diese Übersetzung ist noch nicht bestätigt aber wartet drauf!</seg>
      </tuv>
      <tuv xml:lang="en-GB">
        <seg>This translation is not yet verified but is waiting for it. (At least in some formats we also export this status)</seg>
      </tuv>
    </tu>
  </body>
</tmx>
```

---

### .TS - Qt Translation Source (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346553628--TS-Qt-Translation-Source-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:47Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .ts |
| **API Extension** | ts |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |

An XML-based standard localization file format for QT applications. Translations are typically placed in the `<translation>` tag. Each `<translation>` tag may have different `type` properties including *unfinished*, *vanished*, *obsolete*, etc.  Ensure `type=’unfinished’` is added to tags where strings are to be translated.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<TS version="2.0" language="en-GB">
  <context>
    <message>
      <source>boolean_key</source>
      <translation>--- true
</translation>
    </message>
    <message>
      <source>empty_string_translation</source>
      <translation/>
    </message>
    <message>
      <source>key_with_description</source>
      <translation>This key has a description! (At least in some formats)</translation>
    </message>
    <message>
      <source>key_with_line-break</source>
      <translation>This translations contains
a line-break.</translation>
    </message>
    <message>
      <source>nested.deeply.key</source>
      <translation>I'm a deeply nested key.</translation>
    </message>
    <message>
      <source>nested.key</source>
      <translation>See, this key is nested inside a namespace.</translation>
    </message>
    <message>
      <source>null_translation</source>
      <translation/>
    </message>
    <message numerus="yes">
      <source>pluralized_key</source>
      <translation>
        <numerusform>Only one pluralization found.</numerusform>
        <numerusform>Hey, you have %s pluralizations!</numerusform>
        <numerusform>You have no pluralization.</numerusform>
      </translation>
    </message>
    <message>
      <source>sample_collection</source>
      <translation>---
- first item
- second item
- third item
</translation>
    </message>
    <message>
      <source>simple_key</source>
      <translation>Simple key, simple message, so simple.</translation>
    </message>
    <message>
      <source>unverified_key</source>
      <translation>This translation is not yet verified and waits for it. (In some formats we also export this status)</translation>
    </message>
  </context>
</TS>
```

---

### .TXT (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/17398149187740--TXT-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:07Z

|  |  |
| --- | --- |
| **File Extensions** | .txt, .tsv |
| **API Extension** | .txt, .tsv |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | key\_index  comment\_index  tag\_column  max\_characters\_allowed\_column  column\_separator  quote\_char  header\_content\_row  enable\_pluralization  export\_tags  export\_max\_characters\_allowed  custom\_metadata\_columns |

TXT stores plain text information without any embedded formatting options such as bold, italics, or images.

The `locale_mapping` parameter (of type hashmap) is required to specify which column in the document corresponds to each locale. For examples, see the [configuration file example](https://support.phrase.com#UUID-a27797ea-3107-0139-6da6-1951f7710abd_bridgehead-idm234676618542768 "Configuration example") and the [API documentation](https://developers.phrase.com/api/#post-/projects/-project_id-/uploads) for uploads.

#### Format Options

|  |  |
| --- | --- |
| **Identifier** | key\_index |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing the key names. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | comment\_index |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing description for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | tag\_column |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing a tag for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | max\_characters\_allowed\_column |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing a maximum number of characters for the key. Column indexes start at 1. |

|  |  |
| --- | --- |
| **Identifier** | column\_separator |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | \t |
| **Description** | Char that is used to separate columns. |

|  |  |
| --- | --- |
| **Identifier** | quote\_char |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | " |
| **Description** | Char that is used to quote newlines and column separator. |

|  |  |
| --- | --- |
| **Identifier** | header\_content\_row |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Indicates whether the first row contains only header information and should be skipped. |

|  |  |
| --- | --- |
| **Identifier** | enable\_pluralization |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | true |
| **Description** | Enables detection of pluralized keys. All matching keys will be persisted as pluralized keys. |

|  |  |
| --- | --- |
| **Identifier** | export\_tags |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports tags along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | export\_max\_characters\_allowed |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the key character limit along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | custom\_metadata\_columns |
| **Type** | hash |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | HashMap of [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f) values that need to be imported or exported:  - Key = Name of the custom metadata property, as defined in Phrase Strings. - Value = Column index (*1*, *2*, *3*, etc.) where the property is in the imported file/where the property should be in the exported file. |

##### Code sample

```
boolean_key    "--- true
"
empty_string_translation    ""
key_with_description    Check it out! This key has a description! (At least in some formats),This is the amazing description for this key!
key_with_line-break    "This translations contains
a line-break."
nested.deeply.key    "Wow, this key is nested even deeper."
nested.key    This key is nested inside a namespace.
null_translation    
pluralized_key.one    "Only one kitten found."
pluralized_key.other    "Wow, you have %s kittens!"
pluralized_key.zero    "You have no kittens."
sample_collection    "---
- first item
- second item
- third item
"
simple_key    Just a simple key with a simple message.
unverified_key    This translation is not yet verified and waits for it. (In some formats we also export this status)
```

##### File structure

A typical .TXT file structure:

```
1 (Key column)    2 (Translation column)    3 (Comment column)
app_title    My Software Project    This is the main title
apples.zero    one apple    my comment
...
```

##### Configuration example

An example for the push section of a .phrase.yml for .CSV files:

```
push:
    sources:
        - file: "./multi.txt"
          params:
              update_translations: true
              locale_mapping:
                  en: 2
                  de: 3
              format_options:
                  comment_index: 4
                  tag_column: 5
```

#### Plural forms

This format uses named categories to identify the different pluralizations of a key. The following categories are reserved for plural forms:

```
.zero | .one | .two | .few | .many | .other
```

Example names for correctly identified, persisted and marked pluralized keys:

- inbox.messages.notification.one
- inbox.messages.notification.other

Files should follwo this structure:

```
1 (Key column)    2 (Translation column)    3 (Comment column)
messages.zero    No messages received,
messages.one    One message received,
messages.other    %s messages received,
```

---

### .XCSTRINGS - Apple Strings Catalog (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/18807352792604--XCSTRINGS-Apple-Strings-Catalog-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:17:48Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xcstrings |
| **API Extension** | strings\_catalog |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | convert\_placeholder  default\_extraction\_state  locale\_code\_mapping |

[Apple Strings Catalog](https://developer.apple.com/documentation/xcode/localizing-and-varying-text-with-a-string-catalog) (.xcstrings) is a localization format introduced in Xcode 15. It enhances the way developers manage localized strings by supporting structured formats for handling pluralization, device-specific variations, and more. This format is becoming the recommended approach for managing localizations in iOS and macOS application.

The `comment`, `extractionState` and `shouldTranslate` metadata fields are imported and exported in the required order to ensure compatibility with Xcode.

Phrase also maps Xcode translation states to the closest Strings equivalents during import and converts them back to Xcode-compatible values on export. If no specific mapping applies, *translated* is used as the default export value. If required, use the Ignore translation state on import option to skip state mapping.

##### Code Sample

```
{
  "sourceLanguage": "en",
  "strings": {
    "Sync Warning": {
      "comment": "Sync function unavailable message",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Cloud Sync must be enabled to use this feature."
          }
        },
        "fr": {
          "stringUnit": {
            "state": "translated",
            "value": "La synchronisation cloud doit être activée pour utiliser cette fonction."
          }
        }
      }
    },
    "Chosen Collections": {
      "comment": "View title indicating selected photo collections",
      "localizations": {
        "fr": {
          "variations": {
            "plural": {
              "one": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%ld collection sélectionnée"
                }
              },
              "other": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%ld collections sélectionnées"
                }
              }
            }
          }
        },
        "en": {
          "variations": {
            "plural": {
              "one": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%ld Collection Selected"
                }
              },
              "other": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%ld Collections Selected"
                }
              }
            }
          }
        }
      }
    },
    "Settings Hub": {
      "localizations": {
        "es": {
          "stringUnit": {
            "state": "translated",
            "value": "Centro de configuración"
          }
        }
      }
    }
  },
  "version": "1.0"
}
```

When using the [Phrase CLI](https://support.phrase.com/hc/en-us/articles/5808300599068#UUID-9439325a-ecf6-2f99-2c1e-1bf8197c757d), file exports follow the structure defined in the `.phrase.yml` configuration file. To ensure multiple languages are exported into a single .XCSTRINGS file during pull operations:

- Specify only one file target in the CLI configuration file.
- Use the `locale_ids` parameter to list all the language locales included in the export.

**Example `.phrase.yml` configuration**

```
pull:
  targets:
    - file: ./i18n-test/Localizable.xcstrings
      params:
        locale_id: en # Main language for the download
        locale_ids: # Additional languages to include
          - de
          - es
          - fr 
        file_format: strings_catalog
```

##### Device variations

Apple Strings Catalog supports device variations, which allow different translation contents for the same key depending on the Apple device being used.

To handle device variations in Phrase Strings, separate keys are created for each device using the separator `|==|`. When importing .XCSTRINGS files, the device type is added to the base key name using this separator.

**Example**

The key named `%lld Product(s) Ordered` for the `applewatch` device is imported as a plural key named `%lld Product(s) Ordered|==|device.applewatch` into Phrase Strings.

During export, Phrase Strings detects the device variant using the separator and restores its original nested structure for Apple’s localization format.

```
{
  "sourceLanguage": "en",
  "strings": {
    "%lld Product(s) Ordered": {
      "comment": "Indicates the number of products ordered, with device-specific variations",
      "localizations": {
        "en": {
          "variations": {
            "device": {
              "applewatch": {
                "variations": {
                  "plural": {
                    "one": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Product ordered (Apple Watch)"
                      }
                    },
                    "other": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Products ordered (Apple Watch)"
                      }
                    }
                  }
                }
              },
              "ipad": {
                "variations": {
                  "plural": {
                    "one": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Product ordered (iPad)"
                      }
                    },
                    "other": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Products ordered (iPad)"
                      }
                    }
                  }
                }
              },
              "iphone": {
                "variations": {
                  "plural": {
                    "one": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Product ordered (iPhone)"
                      }
                    },
                    "other": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Products ordered (iPhone)"
                      }
                    }
                  }
                }
              },
              "mac": {
                "variations": {
                  "plural": {
                    "one": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Product ordered (Mac)"
                      }
                    },
                    "other": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%lld Products ordered (Mac)"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "fr": {
          "variations": {
            "plural": {
              "few": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%lld produit(s) commandé(s)"
                }
              },
              "many": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%lld produits commandés"
                }
              },
              "one": {
                "stringUnit": {
                  "state": "translated",
                  "value": "%lld produit commandé"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

##### String substitutions

Apple Strings Catalog supports string substitutions that provide flexible placeholders for dynamic content.

To handle string substitutions in Phrase Strings, separate keys are created using the separator `|==|`. When importing .XCSTRINGS files, the substitution is added to the base key name using this separator.

Phrase Strings also supports creating substitution strings directly in the project. When substitution structures are created manually, a base key and a corresponding substitution key must be defined to ensure the correct nested format is generated during export.

Substitutions always require a specific key naming format: `keyName|==|substitution.[specifier]`.

**Example: Importing substitution structures from existing .XCSTRINGS files**

The key named `birdSightingAlert` for the `BIRDS` substitution is imported as a plural key named `birdSightingAlert|==|substitution.BIRDS` into Phrase Strings.

During export, Phrase Strings detects the substitution using the separator and restores its original nested structure for Apple’s localization format.

```
"birdSightingAlert": {
  "comment": "Alert message indicating the number of birds spotted",
  "localizations": {
    "en": {
      "stringUnit": {
        "state": "new",
        "value": "You spotted %#@BIRDS@!"
      },
      "substitutions": {
        "BIRDS": {
          "formatSpecifier": "BIRDS",
          "variations": {
            "plural": {
              "one": {
                "stringUnit": {
                  "state": "new",
                  "value": "a bird"
                }
              },
              "other": {
                "stringUnit": {
                  "state": "new",
                  "value": "several birds"
                }
              },
              "zero": {
                "stringUnit": {
                  "state": "new",
                  "value": "no birds"
                }
              }
            }
          }
        }
      }
    }
  }
```

**Example: Creating substitution strings from scratch**

- Base key

  A base key named `keyName` represents the top-level format string that contains the substitution placeholder `%#@format@`.

  When exported, this key is written as the primary `stringUnit` for the entry:

  ```
  "keyName": {
    "localizations": {
      "en": {
        "stringUnit": {
          "state": "translated",
          "value": "%#@format@"
        }
      }
    }
  }
  ```
- Substitution key

  A substitution string is defined as separate key using the substitution naming format: `keyName|==|substitution.li`.

  This key contains the substitution text, typically with plural variations. During export, Phrase Strings detects the substitution using the `|==|substitution.` separator and restores the corresponding nested structure under the base key:

  ```
  {
    "sourceLanguage": "en",
    "strings": {
      "keyName": {
        "localizations": {
          "en": {
            "stringUnit": {
              "state": "translated",
              "value": "%#@format@"
            },
            "substitutions": {
              "li": {
                "formatSpecifier": "li",
                "variations": {
                  "plural": {
                    "one": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%@ day"
                      }
                    },
                    "other": {
                      "stringUnit": {
                        "state": "translated",
                        "value": "%@ days"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "version": "1.0"
  }
  ```

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | convert\_placeholder |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Placeholder will be converted to match format specific requirements. Example: `$s`→`$@`, `%s`→`%@` |

|  |  |
| --- | --- |
| **Identifier** | default\_extraction\_state |
| **Type** | string |
| **Upload** | No |
| **Download** | Yes |
| **Default** | null |
| **Description** | Defines the `extractionState` value written to keys in the exported file when no extraction state is already defined on the key. If a key already contains an `extractionState`, its value is preserved during export.  Supported in:  - UI downloads - API - [CLI](https://support.phrase.com/hc/en-us/articles/5784093898908#UUID-ce83ec89-da16-9036-a3ac-6341009136fd) (via `.phrase.yml` configuration) and Repo Sync |

|  |  |
| --- | --- |
| **Identifier** | locale\_code\_mapping |
| **Type** | object |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | {} |
| **Description** | Maps Phrase locale codes to the locale codes written into the .XCSTRINGS file. Each key is the Phrase locale code; each value is the code written to the file, for example:   ``` {   "en": "en-GB",   "fr": "fr-FR" } ```   On download, Phrase rewrites the `sourceLanguage` field and any `localizations` key that matches a mapping key to the mapped value. Codes without a mapping remain unchanged.  On upload, Phrase applies the same mapping in reverse and converts file locale codes back to the corresponding Phrase locale codes, including `sourceLanguage`.  This option affects only the locale codes read from and written to the .XCSTRINGS file itself. Filename-based locale mapping, used for example in Git integration file-naming patterns, is a separate setting that maps file paths rather than the codes inside .XCSTRINGS. |

##### Migrating from iOS Strings (.strings) to Strings Catalog (.xcstrings)

The legacy iOS Strings format (.strings) treats a literal backslash-n sequence (`\n`) in translation content as equivalent to a real line break. As a result, translations created or edited while using the .strings format can contain the literal text `\n` instead of an actual line break character.

Strings Catalog (.xcstrings) is a JSON-based format. When content containing a literal `\n` sequence is exported to .xcstrings, the JSON encoding escapes that literal text as `\\n` in the file. This behavior is not a double-escaping error. It reflects the literal `\n` text already present in the translation content, exported using correct JSON escaping.

To resolve this after migrating from .strings to .xcstrings, replace the literal `\n` sequences in the affected content with real line breaks:

1. Export the content as usual.
2. Open the exported file in a text editor.
3. Replace all instances of the literal `\n` sequence with a real line break.
4. Re-import the file.

In-app search and replace does not support inserting a real line break, so this replacement must be performed in an external text editor before re-importing the file.

---

### .XLIFF - Symfony (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111362119196--XLIFF-Symfony-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:08Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xlf, .xliff |
| **API Extension** | symfony\_xliff |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | enclose\_in\_cdata  include\_translation\_state |

Symfony is a high-performance PHP framework composed of various predefined PHP components. Localization for applications built with Symfony can take place with file formats such as .XLIFF, .YAML, and PHP Arrays.

The difference between a Symfony .XLIFF and a standard [.XLIFF](https://en.wikipedia.org/wiki/XLIFF) lies in how they locate what each `<trans-unit>` represents. While standard .XLIFFs (and also most .XLIFF variations supported by other frameworks) use the `id` attribute, Symfony .XLIFF uses the attribute `resname` as the identifier.

To ensure that strings are uploaded to the correct [locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8), the `target-language` attribute in the file header of a Symfony .XLIFF needs to match the locale name configured in the relevant project.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | enclose\_in\_cdata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Encloses translations containing html tags in CDATA. If disabled, unsupported HTML entities are replaced with their decoded values. For example:  - `&pound;` is replaced with *£*. - `&trade;` is replaced with *™*. |

|  |  |
| --- | --- |
| **Identifier** | include\_translation\_state |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Include state of translations in the target locale. Every `<target>` tag will get a `state` attribute, which can be one of: `new`, `signed-off`, `translated` |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="global" datatype="plaintext" source-language="de-DE" target-language="en-GB">
    <body>
      <trans-unit id="boolean_key" resname="boolean_key">
        <source xml:lang="de-DE">--- true
</source>
        <target xml:lang="en-GB">--- true
</target>
      </trans-unit>
      <trans-unit id="empty_string_translation" resname="empty_string_translation">
        <source xml:lang="de-DE"/>
        <target xml:lang="en-GB"/>
      </trans-unit>
      <trans-unit id="key_with_description" resname="key_with_description">
        <source xml:lang="de-DE">Schau dir das mal an! Dieser Schlüssel hat eine Beschreibung!</source>
        <target xml:lang="en-GB">Check it out! This key has a description! (At least in some formats)</target>
        <note>I'm a very important description for this key!</note>
      </trans-unit>
      <trans-unit id="key_with_line-break" resname="key_with_line-break">
        <source xml:lang="de-DE">Diese Übersetzung hat
einen Zeilenumbruch.</source>
        <target xml:lang="en-GB">This translations contains
a line-break.</target>
      </trans-unit>
      <trans-unit id="nested.deeply.key" resname="nested.deeply.key">
        <source xml:lang="de-DE">Ich bin ein tief verschachtelter Schlüssel</source>
        <target xml:lang="en-GB">I'm a deeply nested key.</target>
      </trans-unit>
      <trans-unit id="nested.key" resname="nested.key">
        <source xml:lang="de-DE">Dieser Schlüssel ist innerhalb eines Namensraumes verschachtelt.</source>
        <target xml:lang="en-GB">This key is nested inside a namespace.</target>
      </trans-unit>
      <trans-unit id="null_translation" resname="null_translation">
        <source xml:lang="de-DE"/>
        <target xml:lang="en-GB"/>
      </trans-unit>
      <trans-unit id="sample_collection" resname="sample_collection">
        <source xml:lang="de-DE">---
- erstes Item
- zweites Item
</source>
        <target xml:lang="en-GB">---
- first item
- second item
- third item
</target>
      </trans-unit>
      <trans-unit id="simple_key" resname="simple_key">
        <source xml:lang="de-DE">Nur ein einfacher Schlüssel mit einer einfachen Nachricht.</source>
        <target xml:lang="en-GB">Just a simple key with a simple message.</target>
      </trans-unit>
      <trans-unit id="unverified_key" resname="unverified_key">
        <source xml:lang="de-DE">Diese Übersetzung ist noch nicht bestätigt und wartet drauf!</source>
        <target xml:lang="en-GB">This translation is not yet verified and waits for it. (In some formats we also export this status)</target>
      </trans-unit>
    </body>
  </file>
</xliff>
```

---

### .XLIFF - XML Localization Interchange File Format (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346587292--XLIFF-XML-Localization-Interchange-File-Format-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:09Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xlf, .xliff |
| **API Extension** | xlf |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | enclose\_in\_cdata  include\_translation\_state  indent\_size  indent\_style  ignore\_source\_translations  ignore\_target\_translations  export\_key\_id\_as\_resname  export\_key\_name\_hash\_as\_extradata  override\_file\_language  strip\_placeholder\_delimiters  delimit\_placeholders |

The most-widely used file format in the translation industry. It can be seen as the mirror of the source file that breaks down source content into various segments stored in tags (e.g. `<trans-unit>`, `<seg-source>`).

[XLIFF](https://en.wikipedia.org/wiki/XLIFF) is XML based and subject to basic XML conventions such as validity and being well-formed. Always complete a sanity check prior to translation by changing the file extension from .xliff (.xlf) to .xml and opening it in a web browser. If the file is valid, a well-organized document structure is presented and if not, it will be either unrenderable or with an error message.

XLIFF was updated with XLIFF 2.0. It is similar to the more widely-used XLIFF but is a different file format usually incompatible with XLIFF.

[Xcode](https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/LocalizingYourApp/LocalizingYourApp.html) can package localizable strings into the industry standard XLIFF format to be sent for localization with Phrase.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | enclose\_in\_cdata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Encloses translations containing html tags in CDATA. If disabled, unsupported HTML entities are replaced with their decoded values. For example:  - `&pound;` is replaced with *£*. - `&trade;` is replaced with *™*. |

|  |  |
| --- | --- |
| **Identifier** | include\_translation\_state |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Include state of translations in the target locale. Every `<target>` tag will get a `state` attribute, which can be one of: `new`, `signed-off`, `translated` |

|  |  |
| --- | --- |
| **Identifier** | indent\_size |
| **Type** | integer |
| **Upload** | No |
| **Download** | Yes |
| **Default** | 4 |
| **Description** | Specifies number of indentation characters |

|  |  |
| --- | --- |
| **Identifier** | indent\_style |
| **Type** | string |
| **Upload** | No |
| **Download** | Yes |
| **Default** | space |
| **Description** | Specifies indentation character. Allowed values are `space`  and `tab`. |

|  |  |
| --- | --- |
| **Identifier** | ignore\_source\_translations |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Ignores the source translations in the file during the upload (to avoid accidental source language updates) |

|  |  |
| --- | --- |
| **Identifier** | ignore\_target\_translations |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Ignores the target translations in the file during the upload (to avoid accidental source language updates) |

|  |  |
| --- | --- |
| **Identifier** | export\_key\_id\_as\_resname |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the Key ID as the *resname* attribute. |

|  |  |
| --- | --- |
| **Identifier** | export\_key\_name\_hash\_as\_extradata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the Key Name hash as the *extradata* attribute. |

|  |  |
| --- | --- |
| **Identifier** | override\_file\_language |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | This file format typically contains language information in the file itself. Use this option to override the language with one you specify. |

|  |  |
| --- | --- |
| **Identifier** | strip\_placeholder\_delimiters |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Removes `<ph>` tags from translations |

|  |  |
| --- | --- |
| **Identifier** | delimit\_placeholders |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Wrap translation placeholders in `<ph>` tags. Must have defined valid placeholder styles in project settings. |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:1.2" version="1.2">
  <file original="global" datatype="plaintext" source-language="de-DE" target-language="en-GB">
    <body>
      <trans-unit id="boolean_key">
        <source xml:lang="de-DE">--- true
</source>
        <target xml:lang="en-GB">--- true
</target>
      </trans-unit>
      <trans-unit id="empty_string_translation">
        <source xml:lang="de-DE"/>
        <target xml:lang="en-GB"/>
      </trans-unit>
      <trans-unit id="key_with_description">
        <source xml:lang="de-DE">Schau dir das mal an! Dieser Schlüssel hat eine Beschreibung!</source>
        <target xml:lang="en-GB">Check it out! This key has a description! (At least in some formats)</target>
        <note>This is the amazing description for this key!</note>
      </trans-unit>
      <trans-unit id="key_with_line-break">
        <source xml:lang="de-DE">Diese Übersetzung hat
einen Zeilenumbruch.</source>
        <target xml:lang="en-GB">This translations contains
a line-break.</target>
      </trans-unit>
      <trans-unit id="nested.deeply.key">
        <source xml:lang="de-DE">Ich bin ein tief verschachtelter Schlüssel.</source>
        <target xml:lang="en-GB">I'm a deeply nested key.</target>
      </trans-unit>
      <trans-unit id="nested.key">
        <source xml:lang="de-DE">Dieser Schlüssel ist innerhalb eines Namensraumes verschachtelt.</source>
        <target xml:lang="en-GB">This key is nested inside a namespace.</target>
      </trans-unit>
      <trans-unit id="null_translation">
        <source xml:lang="de-DE"/>
        <target xml:lang="en-GB"/>
      </trans-unit>
      <trans-unit id="sample_collection">
        <source xml:lang="de-DE">---
- erstes Item
- zweites Item
</source>
        <target xml:lang="en-GB">---
- first item
- second item
- third item
</target>
      </trans-unit>
      <trans-unit id="simple_key">
        <source xml:lang="de-DE">Einfacher Schlüssel, einfache Nachricht, so einfach</source>
        <target xml:lang="en-GB">Simple key, simple message, so simple.</target>
      </trans-unit>
      <trans-unit id="unverified_key">
        <source xml:lang="de-DE">Diese Übersetzung ist noch nicht bestätigt und wartet drauf!</source>
        <target xml:lang="en-GB">This translation is not yet verified and waits for it. (In some formats we also export this status)</target>
      </trans-unit>
    </body>
  </file>
</xliff>
```

##### Plural forms

Pluralized keys are exported using the following syntax:

```
<trans-unit id="plural_key">
  <source xml:lang="en">{"one":"one chair","other":"{nrOfChairs} chairs","zero":"no chairs"}</source>
  <target xml:lang="de">{"one":"ein Stuhl","other":"{nrOfChairs} Stühle","zero":"keine Stühle"}</target>
</trans-unit>
```

---

### .XLIFF - XML Localization Interchange File Format V2 (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390440476--XLIFF-XML-Localization-Interchange-File-Format-V2-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:10Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xlf, .xliff |
| **API Extension** | xliff\_2 |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Plural forms support** | No |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | ignore\_source\_translations, ignore\_target\_translations, override\_file\_language, enclose\_in\_cdata, include\_translation\_state |

[XLIFF](https://en.wikipedia.org/wiki/XLIFF) 2.0 is an update on the more commonly used XLIFF 1.2.

It is an XML-based variation that uses tags such as `<source>`, `<target>` to store original and translated texts for a given source file. In addition, it extracts non-translatable data including variables, codes, and comments and saves them in customized elements.

Compared with XLIFF 1.2, XLIFF 2.0 has the advantage of simplicity coming from a better organized DOM structure and the application of modularity.

XLIFF 2.0 has a different DOM structure than XLIFF 1.2. The two formats are usually incompatible.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | ignore\_source\_translations |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Ignores the source translations in the file during the upload (to avoid accidental source language updates) |

|  |  |
| --- | --- |
| **Identifier** | ignore\_target\_translations |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Ignores the target translations in the file during the upload (to avoid accidental target language updates) |

|  |  |
| --- | --- |
| **Identifier** | override\_file\_language |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | This file format typically contains language information in the file itself. Use this option to override the language with one you specify. |

|  |  |
| --- | --- |
| **Identifier** | enclose\_in\_cdata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Encloses translations containing html tags in CDATA. If disabled, unsupported HTML entities are replaced with their decoded values. For example:  - `&pound;` is replaced with *£*. - `&trade;` is replaced with *™*. |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="2.0" xmlns="urn:oasis:names:tc:xliff:document:2.0" srcLang="en" trgLang="de">
  <file original="ng.template" id="ngi18n">
    <unit id="key_name">
      <notes>
        <note category="meaning">header</note>
        <note category="location">app/app.component.ts:2</note>
      </notes>
      <segment>
        <source>Hello</source>
        <target>Hallo</target>
      </segment>
    </unit>
  </file>
</xliff>
```

##### Plural forms

Pluralized keys will be exported using the following syntax:

```
<unit id="plural_key">
  <segment>
    <source>{"one":"a plural","other":"some plurals"}</source>
    <target>{"one":"ein Plural","other":"einige Plurale"}</target>
  </segment>
</unit>
```

---

### .XLSX - Spreadsheet Excel (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111362172316--XLSX-Spreadsheet-Excel-Strings  
> Zuletzt aktualisiert: 2025-10-16T06:07:11Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xlsx |
| **API Extension** | xlsx |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | key\_name\_column  comment\_column  tag\_column  first\_content\_row  enable\_pluralization  export\_tags  export\_max\_characters\_allowed  custom\_metadata\_columns  translation\_columns |

.XLSX is a widely-used file format for localization. Though the layout of an .XLSX file may differ based on specific settings, it generally follows the one-column-per-language convention. To translate .XLSX, provide at least the key name column and one translation column. By default, content is assumed to start in the first row. Along with the keys and translation, meta-information like comments, tags and the maximum characters allowed for the translations can be imported.

If a file is uploaded with multiple sheets or tabs, only the first sheet will be detected. Save sheets or tabs to individual files if the content is required for localization

The `locale_mapping` parameter (of type hashmap) is required to specify which column in the document corresponds to each locale. For examples, see the configuration file example and the [API documentation](https://developers.phrase.com/api/#post-/projects/-project_id-/uploads) for uploads.

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | key\_name\_column |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Column that contains the key name/identification. |

|  |  |
| --- | --- |
| **Identifier** | comment\_column |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Column that contains comment/description for a key. |

|  |  |
| --- | --- |
| **Identifier** | tag\_column |
| **Type** | string |
| **Upload** | Yes |
| **Download** | No |
| **Default** | [empty] |
| **Description** | Index of the column containing a tag for the key. |

|  |  |
| --- | --- |
| **Identifier** | first\_content\_row |
| **Type** | integer |
| **Upload** | Yes |
| **Download** | No |
| **Default** | 1 |
| **Description** | Index of first row to contain translation content. |

|  |  |
| --- | --- |
| **Identifier** | enable\_pluralization |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | true |
| **Description** | Enables detection of pluralized keys. All matching keys will be persisted as pluralized keys. |

|  |  |
| --- | --- |
| **Identifier** | export\_tags |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports tags along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | export\_max\_characters\_allowed |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Exports the key character limit along with keys and translations. |

|  |  |
| --- | --- |
| **Identifier** | custom\_metadata\_columns |
| **Type** | hash |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | A hashmap of [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f) values that need to be imported or exported:  - Key = Name of the custom metadata property, as defined in Phrase Strings. - Value = Column identifier (*A*, *B*, *C*, etc.) where the property is in the imported file/where the property should be in the exported file. |

|  |  |
| --- | --- |
| **Identifier** | translation\_columns |
| **Type** | hash |
| **Upload** | Yes |
| **Download** | Yes |
| **Default** | [empty] |
| **Description** | - Language id/Name  = Column of the custom metadata property, as defined in Phrase Strings. - Value = Column identifier (*A*, *B*, *C*, etc.) where the property is in the imported file/where the property should be in the exported file. |

##### Structure example

| key\_name | en\_US | de-DE\* | comment\* | tags\* | max\_characters\* |
| --- | --- | --- | --- | --- | --- |
| app\_title | My Project | Mein Projekt | This is the main title | app, title | 30 |
| greeting | Hi 'User'! | Hallo 'User'! | Be polite |  |  |

\*optional columns

The spreadsheet file needs at least the key column and one language in order to be uploaded. Apart from additional languages, the following columns can be added to add meta information:

- **comment**: to add a description to the key
- **tags**: to add tags to individual keys in the file
- **max\_characters**: to set a character limit for a key through the upload

##### Configuration example

An example for the push section in a .phraseapp.yml for XLSX files.

```
push:
    sources:
        - file: "./en.xlsx"
          params:
              file_format: xlsx
              update_translations: true
              format_options:
                  key_name_column: A
                  comment_column: C
                  first_content_row: 2
                  tag_column: D
              locale_mapping:
                  en: B
```

---

### .XML - Android (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111362189212--XML-Android-Strings  
> Zuletzt aktualisiert: 2026-03-20T08:39:23Z  
> Labels: 2BTr, strings, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xml |
| **API Extension** | xml |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | Yes |
| **Format options**  These options that can be specified when a file is uploaded and/or downloaded. Depending on the upload/download method (API, CLI, Repo sync etc.), they can be specified in query parameters `Upload`, `Download` or in the `phrase.yml` configuration file. | convert\_placeholder  escape\_linebreaks  unescape\_linebreaks  enclose\_in\_cdata  indent\_size  indent\_style  unescape\_tags  include\_tools\_ignore  include\_tools\_locale\_definition  escape\_android\_chars  unescape\_android\_chars |

Android XML is an Android-specific XML variation that can be used to load translated content into Android Apps. Its root element is a `<resources>` with numerous `<string>` elements nested under it that store strings pending translation. You may use Android Studio to generate these resource files and use Phrase to manage the translation.

Android Studio uses the property `translatable` to indicate whether the content needs to be translated. In Phrase, this property is ignored. There is no need to push these strings to Phrase. If a string should not be translated, define it in a separate resource file with all non-translatable strings (eg. `donottranslate.xml`).

##### Format Options

|  |  |
| --- | --- |
| **Identifier** | convert\_placeholder |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Placeholder will be converted to match format specific requirements. Example: `$s' =&gt; '$@` |

|  |  |
| --- | --- |
| **Identifier** | escape\_linebreaks |
| **Type** | Boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | All line breaks will be escaped as `\n` |

|  |  |
| --- | --- |
| **Identifier** | unescape\_linebreaks |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | All `\n` will be imported as true newlines |

|  |  |
| --- | --- |
| **Identifier** | enclose\_in\_cdata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Encloses translations containing HTML tags in CDATA |

|  |  |
| --- | --- |
| **Identifier** | indent\_size |
| **Type** | integer |
| **Upload** | No |
| **Download** | Yes |
| **Default** | 4 |
| **Description** | Specifies number of indentation characters |

|  |  |
| --- | --- |
| **Identifier** | indent\_style |
| **Type** | string |
| **Upload** | No |
| **Download** | Yes |
| **Default** | space |
| **Description** | Specifies indentation character. Allowed values are `space`  and `tab`. |

|  |  |
| --- | --- |
| **Identifier** | unescape\_tags |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | All `&lt;` characters will be unescaped to `<` and all `&gt;` characters will be unescaped to `>` for tags. |

|  |  |
| --- | --- |
| **Identifier** | include\_tools\_locale\_definition |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Include `tools:locale` [attribute](https://developer.android.com/studio/write/tool-attributes#toolslocale) in resulting XML. |

|  |  |
| --- | --- |
| **Identifier** | include\_tools\_ignore |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Include the `tools:ignore` [attribute](https://developer.android.com/studio/write/tool-attributes#toolsignore) in the resulting XML.  When disabled (default), the `tools:ignore` attribute is omitted from exported files. This helps keep resource files clean and avoids including development-specific lint suppression attributes. |

|  |  |
| --- | --- |
| **Identifier** | preserve\_cdata |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | If the translation content already contains CDATA tag, this switch prevents the content from being additionally escaped. |

|  |  |
| --- | --- |
| **Identifier** | escape\_android\_chars |
| **Type** | boolean |
| **Upload** | No |
| **Download** | Yes |
| **Default** | false |
| **Description** | Escapes `@`, `?` and `Tab` [Android special characters](https://developer.android.com/guide/topics/resources/string-resource#escaping_quotes) with a backslash prefix. |

|  |  |
| --- | --- |
| **Identifier** | unescape\_android\_chars |
| **Type** | boolean |
| **Upload** | Yes |
| **Download** | No |
| **Default** | false |
| **Description** | Unescapes `\@`, `\?`, `\t` and `\uXXXX` (Unicode character with code XXXX). |

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<resources>
    <string name="boolean_key">--- true
</string>
    <string name="empty_string_translation"/>
    <!-- This is the beautiful description for this key! -->
    <string name="key_with_description">Check it out! This key has a description! (At least in some formats)</string>
    <string name="key_with_line-break">This translations contains
a line-break.</string>
    <string name="nested.deeply.key">Hey, this key is nested even deeper.</string>
    <string name="nested.key">This key is nested inside a namespace.</string>
    <string name="null_translation"/>
    <plurals name="pluralized_key">
        <item quantity="one">Only one plural forms found.</item>
        <item quantity="other">Hey, you have %s pluralizations!</item>        
    </plurals>
    <string-array name="sample_collection">
        <item>first item</item>
        <item>second item</item>
        <item>third item</item>
    </string-array>
    <string name="simple_key">Just a  key with a message.</string>
    <string name="unverified_key">This translation is not yet verified and waits for it. (In some formats we also export this status)</string>
</resources>
```

##### Plurals for Android XML files

For plural values assign a special <plurals> tag like this:

```
<plurals name="messages">
        <item quantity="one">One message received.</item>
        <item quantity="other">%s messages received.</item>        
</plurals>
```

---

### .XML - Episerver (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346657180--XML-Episerver-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:54Z  
> Labels: 2BTr, strings, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xml |
| **API Extension** | episerver |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |

Episerver is a content management service provider. Episerver XML is its standard localization file format that is used to load translated/localized strings. The localized XMLs are typically saved in the `lang` folder under the web root directory. With a predefined localization provider, strings loaded from the .XML override default UI texts.

Each Episerver XML has at least one locale nested in the `<languages>` tag so Episerver XML may be multilingual.

##### Code Sample

```
<?xml version="1.0" encoding="UTF-8"?>
<languages>
  <language name="English" id="English">
    <boolean_key>--- true
</boolean_key>
    <empty_string_translation/>
    <key_with_line-break>This translations contains
a line-break.</key_with_line-break>
    <nested>
      <deeply>
        <key>I'm a deeply nested key.</key>
      </deeply>
      <key>This key is nested inside a namespace.</key>
    </nested>
    <null_translation/>
    <pluralized_key>
      <one>Only one pluralization found.</one>
      <other>Wow, you have %s pluralizations!</other>
      <zero>You have no pluralization.</zero>
    </pluralized_key>
    <simple_key>simple key, simple message, so simple.</simple_key>
    <unverified_key>This translation is not yet verified and waits for it. (In some formats we also export this status)</unverified_key>
  </language>
</languages>
```

---

### .XML - Java Properties (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111390496284--XML-Java-Properties-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:55Z  
> Labels: 2BTr, strings, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .xml |
| **API Extension** | properties\_xml |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | No |
| **Description support** | Yes |

Java Properties XML is the XML equivalent of the Java Properties file. The keys of a Java Properties file exist as an attribute to the entry element in the XML while the values are inline text strings nested inside of the entry tags. Compared with the standard Java Properties files, the XML type provides higher flexibility in that you can add more attributes to the entry element. For example, you can decide that only keys with a `class='translatable'` attribute are picked up for translation.

##### Code Sample

```
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <entry key="boolean_key">--- true
</entry>
  <entry key="empty_string_translation"/>
  <entry key="key_with_description">Check it out! This key has a description! (At least in some formats)</entry>
  <entry key="key_with_line-break">This translations contains
a line-break.</entry>
  <entry key="nested.deeply.key">Wow, this key is nested even deeper.</entry>
  <entry key="nested.key">This key is nested inside a namespace.</entry>
  <entry key="null_translation"/>
  <entry one="Only one pluralization found." other="Wow, you have %s pluralizations!" zero="You have no pluralization." key="pluralized_key"/>
  <entry key="sample_collection">---
- first item
- second item
- third item
</entry>
  <entry key="simple_key">Simple key, simple message, so simple.</entry>
  <entry key="unverified_key">This translation is not yet verified and waits for it. (In some formats we also export this status)</entry>
</properties>
```

---

### .YAML - Ruby on Rails (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111362229660--YAML-Ruby-on-Rails-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:56Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .yml, .yaml |
| **API Extension** | yml |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Ruby on Rails is an open-source framework designed to simplify the development of web applications using the Ruby programming language. Ruby on Rails has a built-in module for localization that uses .YAML as the standard file format (along with RB).

Prior to translation, perform a sanity check of the .YAML file ensuring it complies with all .YAML conventions, such as indentation-based data nesting.

If a file contains keys in the array format, the editor displays the translation as a string. Ensure translators do not change the syntax as there is no content validation for that key type. The key type can be changed to Array in the key settings to automatically exclude it from translation orders.

[Rails i18n Guide](http://guides.rubyonrails.org/i18n.html)

##### Code Sample

```
---
English:
  boolean_key: true
  empty_string_translation: ''
  key_with_description: Check it out! This key has a description! (At least in some
    formats)
  key_with_line-break: |-
    This translations contains
    a line-break.
  nested:
    deeply:
      key: Wow, this key is nested even deeper.
    key: This key is nested inside a namespace.
  null_translation: 
  pluralized_key:
    one: Only one pluralization found.
    other: Wow, you have %s pluralizations!
    zero: You have no pluralization.
  sample_collection:
  - first item
  - second item
  - third item
  simple_key: Just a simple key with a simple message.
  unverified_key: This translation is not yet verified and waits for it. (In some
    formats we also export this status)
```

---

### .YAML - Symfony (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111362240412--YAML-Symfony-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:58Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .yml, .yaml |
| **API Extension** | yml\_symfony |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Symfony is a high-performance PHP framework composed of various predefined PHP components. Localization for applications built with Symfony can take place with file formats, such as .XLIFF, .YAML, and PHP Arrays. The Symfony development team recommends the use of .YAML for small localization projects and .XLIFF for larger or more complex ones. Compared with the XML-based .XLIFF, .YAML is more human-readable, with data nesting achieved using indentation rather than explicit tags.Per .YAML convention, while preparing .YAML for translation, ensure indentation is correct using regular spaces and not TABs.

##### Plurals

Plural forms rules for the  Symfony i18n framework follow the [ICU message](https://support.phrase.com/hc/en-us/articles/5822319545116#UUID-4e2555a8-9099-f503-d74d-09eaa1e74816) format. Before ICU message formats can be used in a project, it must be enabled by selecting "Enable ICU Message format support" in the Advanced tab in the Project settings window.

Once enabled, use the *select* functions syntax to pass multiple parameters adding the *plural* rule:

```
file:translations/messages+intl-icu.en.yaml

key: >-

  {files, plural,

     =0 {No messages received}

     one {One message received}

     =other {# messages received}

  }
```

Add multiple rules for different numbers:

```
=0
=1
=2
=n
```

The YAML document is reconstructed and all plural forms are placed under the appropriate key.

##### Code Sample

```
---
boolean_key: true
empty_string_translation: ''
key_with_description: Check it out! This key has a description! (At least in some formats)
key_with_line-break: |-
  This translations contains
  a line-break.
nested:
  deeply:
    key: Wow, this key is nested even deeper.
  key: This key is nested inside a namespace.
null_translation: 
pluralized_key:
  one: Only one pluralization found.
  other: Wow, you have %s pluralizations!
  zero: You have no pluralization.
sample_collection:
- first item
- second item
- third item
simple_key: Just a simple key with a simple message.
unverified_key: This translation is not yet verified and waits for it. (In some formats we also export this status)
```

---

### .YAML - Symfony 2 (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6111346719388--YAML-Symfony-2-Strings  
> Zuletzt aktualisiert: 2024-12-02T10:44:59Z  
> Labels: 2BTr, ar_strings

|  |  |
| --- | --- |
| **File Extensions** | .yml, .yaml |
| **API Extension** | yml\_symfony2 |
| **Import** | Yes |
| **Export** | Yes |
| **Plural forms support** | Yes |
| **Description support** | No |

Symfony 2 is an update of the MVC-based, PHP web development framework, Symfony. It shares similarities with its predecessor but is also a complete re-write that provides features not supported in Symfony.

In Symfony 2, .YAML function primarily as config files but they are also the recommended file format with localization. Use flat and simple .YAML instead of .YAML with complex hierarchical order, which the Symfony 2 parser may not be able to interpret.

#### Code Sample

```
--- 
boolean_key: true
empty_string_translation: ""
key_with_description: Check it out! This key has a description! (At least in some formats)
key_with_line-break: |-
    This translations contains
    a line-break.
nested: 
  deeply: 
    key: "Wow, this key is nested even deeper."
  key: This key is nested inside a namespace.
null_translation: ~
pluralized_key: 
  one: Only one pluralization found.
  other: "Wow, you have %s pluralizations!"
  zero: You have no pluralization.
sample_collection: 
  - first item
  - second item
  - third item
simple_key: Just a simple key with a simple message.
unverified_key: This translation is not yet verified and waits for it. (In some formats we also export this status)
```

---

## Translating

Quelle: https://support.phrase.com/hc/en-us/sections/5804111406748-Translating

### Zero-Touch Localization (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/29265012652956-Zero-Touch-Localization-Strings  
> Zuletzt aktualisiert: 2026-09-17T16:21:47Z

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Zero-touch localization automates the full localization pipeline for a connected code repository. It detects new or changed strings, creates and routes a translation job, translates the content, and pushes the translated strings back to the repository, without any manual steps in between.

###### How It Works

Zero-touch localization connects three existing Strings features into a single automated pipeline:

1. **Repo Sync** watches the connected repository. When a pull request adds or changes strings, Repo Sync imports the new and updated keys into the project.
2. [Automated Job Creation](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) (AJC) creates a translation job for the imported keys, using a connected [job template](https://support.phrase.com/hc/en-us/articles/7629216795036#UUID-30b94bbf-3b34-4f9b-6fbe-ad716f3d8080).
3. The job template's [pre-translation](https://support.phrase.com/hc/en-us/articles/5822187934364#UUID-93350abc-3aa2-c6b4-8863-254eec574c48 "Pre-translation (Strings)") setting translates the keys using machine translation (or translation memory matches, if configured).
4. Once the job is complete, Repo Sync exports the translated strings back to the same pull request.

Each stage runs on the settings and integrations already configured for the project. Zero-touch localization does not introduce a separate translation engine or job type. It coordinates the existing ones automatically.

##### Important

Zero-touch localization only works with a Repo Sync connection to a [GitHub](https://support.phrase.com/hc/en-us/articles/5784125562012#UUID-cf2204a1-f43a-ab57-3c14-1276e105332d) repository, set up through the GitHub App. Repo Sync connections made with a personal access token, and Repo Sync connections to GitLab or Bitbucket, are not supported for zero-touch localization.

###### The Zero-Touch Tab

Zero-touch localization is managed from a dedicated Zero-touch tab in the project view. The tab reflects one of three states for the project:

- **Enable zero-touch localization**: Zero-touch localization has not been enabled for the project.
- **Active**: Enabled, with a healthy Repo Sync and Job Automation, and all required project settings in place.
- **Error**: Enabled, but something the pipeline depends on is missing or broken.

###### Permissions

Enabling, fixing, or turning off zero-touch localization requires permission to manage project settings:

- Strings [Owners](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) and Administrators can manage zero-touch localization in every project.
- Project Managers can manage zero-touch localization only in projects to which they are assigned.
- Developers, Designers, Translators, and Guests cannot manage zero-touch localization.

###### Enable Zero-Touch Localization

To enable zero-touch localization for a project, follow these steps:

1. Open the project and go to the Zero-touch tab.
2. Click Enable zero-touch localization.

   The Enable zero-touch localization window opens listing the project settings that zero-touch localization will affect. Review the affected settings first to make sure the changes do not disrupt another workflow. All pre-selected settings must be enabled for zero-touch localization to work.
3. Click Enable to proceed.

   The Zero-touch tab for the project opens, showing the full configuration.
4. If a project already has a qualifying Repo Sync and Job Automation set up outside the Zero-touch tab, they are detected automatically. Skip the next two steps. Otherwise, continue with the next steps to set them up.
5. Set up a Repo Sync by clicking the Configure repo sync button.

   The GitHub sync window opens. The connection type is pre-selected as [Github app](https://support.phrase.com/hc/en-us/articles/5784125562012#UUID-cf2204a1-f43a-ab57-3c14-1276e105332d) and Automatic import is set to From open pull requests. These options must remain as is to enable zero-touch localization.
6. Set up a [Job Automation](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) by clicking the Create job automation button.

   The Add automation window opens. The Include branches option is selected and the Trigger is set to Upload Batch. These options must remain as is to enable zero-touch localization.
7. Once both Repo Sync and Job Automation are correctly configured, the Zero-touch tab shows the project's status as *active*, denoted by a green checkmark.

###### Errors and Fixes

An error appears on the Zero-touch tab when a required project setting was changed outside the tab. It also appears when the connected Repo Sync or Job Automation was deleted, paused, or is otherwise unhealthy. The tab identifies which part is affected:

- For a project setting that was turned off elsewhere, use the fix action shown in the tab to turn it back on.
- For a missing or broken Repo Sync or Job Automation, follow the link shown in the tab to create a replacement.

Details about the error are displayed on the integration's own page. Once the underlying issue is resolved, the project returns to the active state automatically.

###### Turn Off Zero-Touch Localization

To turn off zero-touch localization for a project, follow these steps:

1. Open the project and go to the Zero-touch tab.
2. Toggle the configuration off.

Turning it off pauses the connected Repo Sync and Job Automation. The Zero-touch tab then shows the project as not configured. General project settings that zero-touch localization uses are not changed.

###### Limits

Zero-touch localization project limits depend on the plan:

- Business and Enterprise plans support zero-touch localization on an unlimited number of projects.
- Team, Professional, and Software UI/UX plans support zero-touch localization on up to two projects.

---

### Website Translation (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5808612203036-Website-Translation-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:30:39Z  
> Labels: 2BTr, ar_strings

#### Play Framework for Strings

[Play Framework](https://www.playframework.com/documentation/2.0/ScalaI18N) is a High Velocity Web Framework for Java and Scala.

##### Prepare the Application

Ensure localization files are correctly formatted and Play Properties use UTF-8 encoding.

To prepare the application, follow these steps:

1. Add required languages to be accepted into the `application.conf` with with priority being set by descending locale order (*en* being the most important, *de* second, etc.):

   ```
   application.langs="en,de,fr"
   ```
2. Add *messages.en*, *messages.de* and *messages.fr* files to the `conf/` folder.

**Example:**

```
# My Software Project (description)
project.name=Some Name
title1=AwesomeApp

# You can never have enough titles!
more_titles=Another Title
```

#### Rails for Ruby i18n in Strings

To use Rails for Ruby i18n, follow these steps:

1. Download the latest [client](https://phrase.com/cli/) and follow the [setup instructions](https://support.phrase.com/hc/en-us/articles/5784093863964#UUID-137036b8-3f91-fab9-7fcc-9e34312125db).
2. To initialize the project configuration, [follow the instructions](https://support.phrase.com/hc/en-us/articles/5808300599068#UUID-9439325a-ecf6-2f99-2c1e-1bf8197c757d):

   ```
   $ phrase init
   ```

   Follow the steps to configure sources and targets for the project. Select `.yml` as the locale file format.
3. If existing localization files are stored in the default location at `./config/locales`, upload data with the push command:

   ```
   $ phrase push
   ```

   All existing localization files found in the source path are uploaded to the project. Existing translations are now in Phrase and new languages or keys can be added.
4. Download completed translations back into the project with the pull command:

   ```
   $ phrase pull
   ```

Optional:

- **Add a custom locale download directory to the i18n load path**

  If downloading localization files to a folder other than `./config/locales`, configure the i18n load path of the application so that new localization files are accessible.

  Open the `application.rb` or `development/staging/production.rb` and add the configuration (assuming localization files are downloaded to `./custom/locales`.):

  ```
  config.i18n.load_path += Dir[Rails.root.join('custom', 'locales', '**', '*.yml').to_s]group :staging, :development do
    gem 'phraseapp-ruby'
  end
  ```

  After restarting the application, newly downloaded files are visible.
- **Install the phraseapp-ruby gem**

  If writing a custom workflow using the API, use the phraseapp-ruby gem.

  Add the phraseapp-ruby gem to your application by adding it to the Gemfile:

  ```
  group :staging, :development do
    gem 'phraseapp-ruby'
  end
  ```

  Install it using the bundle command:

  ```
  $ bundle install
  ```

#### Ruby Motion in Strings

[RubyMotion](http://www.rubymotion.com/) is a toolchain for iOS, OS X and Android development that creates iPhone, iPad, Mac and Android apps in Ruby.

The [phraseapp-rubymotion](https://github.com/phrase/phraseapp-rubymotion) gem connects the RubyMotion application to benefit from [internationalization workflows (iOS)](https://developer.apple.com/internationalization/) projects.

##### Install the Gem

To install the gem, follow these steps:

1. Add the phraseapp-rubymotion gem to your project using bundler:

   ```
   gem 'phraseapp-rubymotion'
   ```

   or manually:

   ```
   $ gem install phraseapp-rubymotion
   ```
2. Require the gem in the Rakefile.

##### Initialize the Project

Add the Access Token and Project ID to the application Rakefile:

```
Motion::Project::App.setup do |app|
  app.name = "Test Application"
  app.development do
    app.phraseapp do
      app.phraseapp.enabled = true
      app.phraseapp.access_token = "YOUR_ACCESS_TOKEN"
      app.phraseapp.project_id = "YOUR_PROJECT_ID"
    end
  end
end
```

Project ID of a project is found in project settings.

##### Usage

Using the phraseapp-rubymotion gem provides the automatic sending of new translations via API without having to write them into a Localizable.strings file or uploading them.

###### Localizing strings

Localize all strings by extending them with their localized counterparts. Call the `#__ method` on each string that is implemented by phraseapp-rubymotion:

```
"Hello World"
```

becomes:

```
"Hello World".__
```

or when using a fallback translation:

```
"Hello World".__("My fallback translation")
```

Generic key names can also be used:

```
"HOME_WELCOME_BUTTON_LABEL".__
```

###### API communication

Build and run the app (in the simulator). When in development mode, phraseapp-rubymotion automatically sends all localized strings and are seen as newly created keys. If localization files are correctly placed, translation are also transmitted.

When translations are completed, bundle them with the app. All translations can be fetched from the API and stored in the RubyMotion project by using the command line client.

To fetch translations, follow these steps:

1. [Install](https://support.phrase.com/hc/en-us/articles/5784093863964#UUID-137036b8-3f91-fab9-7fcc-9e34312125db) the command line client (CLI).
2. Configure the CLI for the project:

   ```
   $ phrase init
   ```

   Complete the required steps to configure sources and targets for the project. Select strings as the locale file format.
3. Download local files.

   Once the translation is complete, download the data back into the project with the pull command:

   ```
   $ phrase pull
   ```

   To upload all existing local files to a project:

   ```
   $ phrase push
   ```

---

### Application Translation (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819405423772-Application-Translation-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:30:40Z  
> Labels: 2BTr, ar_strings

#### Android Studio

Android Studio is the official IDE for Android application development and the plugin creates the connection to the IDE.

1. Set up a project.

   1. Create a project and select Android Strings (.xml) as the Main format.
   2. Select Android as the Main technology.
   3. Click Save.

      Project is created.
2. Download, install and configure the plugin for [Android Studio](http://developer.android.com/tools/studio/index.html).

   See the plugin [Github page](https://github.com/phrase/phrase-intellij) for more installation and configuration information.
3. Upload and download locale files.

   Locale files can be pulled and pushed in the tool window of Android Studio.
4. Add a new language.

   Languages are added by adding a new locale to the project. Pull translated locales with the plugin. If there is a locale file for an additional language, import those translations using file upload from the Uploads tab on the project page.

#### iOS

1. Set up a project.

   1. Create a project and select iOS Localizable Strings (.strings) as the Main format.
   2. Select iOS as the Main technology.
   3. Click Save.

      Project is created.
2. Download, install and configure the plugin for iOS.

   Initialize the project configuration in the CLI and create a configuration with:

   ```
   $ phrase init
   ```

   Ensure an iOS compatible [format](https://support.phrase.com/hc/en-us/sections/6111343326364) such as .XLIFF is selected for the language file format.
3. Upload and download locale files.

   Locale files can be pulled and pushed and pulled in the CLI:

   ```
   $ phrase push
   ```

   ```
   $ phrase pull
   ```

   If integrating string management into a build workflow, add a new `run script` build phase into the target settings of the project. In this phase, execute `phrase pull` to get all new translations. The new build phase must be placed before the resources get bundled.
4. Add a new language.

   Languages are added by adding a new locale to the project. The language name should be chosen according to the [iOS language name constant convention](https://developer.apple.com/library/ios/documentation/MacOSX/Conceptual/BPInternational/LanguageandLocaleIDs/LanguageandLocaleIDs.html) Translated languages can be downloaded again using `phrase pull` with the CLI client. If there is a locale file for an additional language, import those translations using file upload from the Uploads tab on the project page.

#### Windows Phone (Visual Studio)

Visual Studio is the official IDE for Windows application development and the plugin makes the connection to the IDE.

1. Set up a project.

   1. Create a project and select Windows 8 Resource (.resw) as the Main format.
   2. Select Android as the Main technology.
   3. Click Save.

      Project is created.
2. Download, install and configure the plugin for Visual Studio.

   1. The Phrase plugin can be found in the Visual Studio Gallery. Downloading the plugin will install it.
   2. Configure the CLI client path by providing the full path (e.g., `C:\path\to\phraseapp.exe`) in the PhraseApp options.
   3. Using the [CLI tool](https://support.phrase.com/hc/en-us/articles/5808300599068#UUID-9439325a-ecf6-2f99-2c1e-1bf8197c757d), generate a `.phraseapp.yml` file to be placed in the root director.
3. Upload and download locale files.

   In the Tools menu, commands are presented that trigger actions according to the configuration file. The output of both operations is sent to the Output tool window.
4. Add a new language.

   Add new languages by either creating a new locale file in the Windows Phone application and uploading the files using the plugin or by adding a new locale to the [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252).

---

### Translate AppStore and Google Play Descriptions (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819664809884-Translate-AppStore-and-Google-Play-Descriptions-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:30:41Z  
> Labels: Project Manager, 2BTr, ar_strings

To create a project for AppStore and Google Play descriptions, follow these steps:

1. Create a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252).
2. Select CSV or Excel XLSX as the Main format.
3. Select Apple AppStore Description or Google Play Description as the Main technology.
4. Click Save.

   The project is created and includes the keys for the selected store type.
5. Add required [locales](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8) to the project.

When a project is created for store description, all necessary keys are created including the settings for the required max. length.

After the description for the apps is translated, download them as Excel or .CSV files from copy them into iTunes Connect / Google Play Developer Console.

#### Create a Mobile App Project and Store Description in One Step

To create a mobile app project and store description, follow these steps:

1. Create a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252).
2. Provide the Name of the mobile app project.
3. Select Main format (iOS Localizable Strings or Android XML)
4. Select iOS or Android as the Main technology.
5. Select Create an additional project for the store description.
6. Click Save.

   A project for the mobile app and a separate project for the store description are created.

#### Apple AppStore Descriptions

| Key | Max. length | Description |
| --- | --- | --- |
| name | 255 | The name of the app as it appears on the App Store. |
| description | 4000 | A description of the app, detailing features and functionality. It is used for the Apple Watch app. |
| keywords | 100 | One or more keywords that describe the app. Keywords make App Store search results more accurate. Separate keywords with a comma. |
| version\_info | 4000 | Describe what's new in this version of the app, such as new features, improvements, and bug fixes. |
| marketing\_url | 255 | An URL with marketing information about the app. This URL will be visible on the App Store. |

#### Google Play Descriptions

| Key | Max. length | Description |
| --- | --- | --- |
| title | 30 | The title of the app as it will appear on the Google Play store. |
| full\_description | 255 | A description of the app, detailing features and functionality. |
| short\_description | 80 | A short description of the app. |
| recent\_changes | 500 | Describe what's new in this version of the app, such as new features, improvements, and bug fixes. |
| website | 255 | The user-visible website for this app. |
| promo\_video | 255 | The URL for a promotion video on youtube. |

---

### Translating Dynamic Content (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819660332572-Translating-Dynamic-Content-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:30:42Z  
> Labels: Project Manager, 2BTr, ar_strings

Use Phrase to translate dynamic segments, e.g. blog posts or product information typically stored in a database.

#### Setup

**Projects**

Keep translations of dynamic content in a separate project, next to the project already in use for handling static translations. Depending on quantity of dynamic content, create separate projects for different content types, e.g. *My Project* - Blog Posts and *My Project* - Products.

**Key structure**

Since all content is organized as keys and values, decide on a key structure for the dynamic content. Include the unique identifier from a database in the key name:

- products.10.name
- products.10.description
- products.10.summary
- products.11.name
- products.11.description
- products.11.summary
- etc.

Depending on quantity and nature of the dynamic content, use [tagging](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-e647235a-f7a4-26cf-82ce-f172f3330193) to further improve the key structure.

#### Sync process

If sync dynamic content translations frequently, write a script that handles uploading and downloading the content and can be run when necessary, e.g. once per day or triggered by a [webhook](https://support.phrase.com/hc/en-us/articles/5784125630620#UUID-27f6a836-3420-6087-e990-9ecbf6f85e68) event.

**Uploading content**

For a quick initial upload it is sufficient to render keys and source content in a simple .CSV or .JSON file and upload them directly using the [push command](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-d83eaf9c-9f90-7a62-b722-c920fec6fbdb) or using the [upload endpoint](https://developers.phrase.com/api/#tag--Uploads).

To provide more context data such as screenshots and descriptions, create key entries directly using the [keys endpoint](https://developers.phrase.com/api/#keys) and attaching [translation entries](https://developers.phrase.com/api/#translations) afterwards.

**Updating content**

Work solely in Phrase on the translated versions of original content and only modify source content directly in the database. This removes versioning conflicts that can occur if modifying content directly in a database.

**Retrieving translations**

For simple use cases, download the translations for dynamic content using the [pull command](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-d83eaf9c-9f90-7a62-b722-c920fec6fbdb) or directly with the [download endpoint](https://developers.phrase.com/api/#locales). Specify whatever format works best, but use an easy to parse format such as .CSV or .JSON.

For more advanced setups, access all translation entries directly using the [API](https://developers.phrase.com/api/#translations).

After retrieving translations for each locale, store the content for each key and locale in the database.

---

### Plural Forms (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5819838743964-Plural-Forms-Strings  
> Zuletzt aktualisiert: 2026-08-25T06:18:00Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

Each language has its own grammatical forms for singular and plural phrases.

Example:

- English has two forms: *one* and *other*, as in *1 file* and *2 file**s***.
- Other languages may have one or even several forms: *one*, *few*, and *other*.

This presents a challenge for localization.

The translation of plural-sensitive strings is supported, including both cardinal and ordinal plural forms. These strings must be translated using the plural forms based on the plural rules of the target language. These plural forms must be defined in the source file.

Example:

- The English string *There are %d% items left*, where *%d%* represents any number except 1.
- In Czech, this needs to to be translated in two ways.

  The first for numbers 2, 3 or 4 (i.e. *few*) and the second for numbers 0, 5 and more (i.e. *other*).

[PO (gettext)](https://support.phrase.com/hc/en-us/articles/6111343649820#UUID-3c1972bb-e3c0-5834-4b52-3827f67d8c95) files commonly use plural forms as well as [ICU messages](https://support.phrase.com/hc/en-us/articles/5822319545116#UUID-c9eb2b85-8ec3-fef0-aae0-38dbf0454445 "ICU Message Format (Strings)").

For more information about plural rules, see [CLDR plural rules](https://cldr.unicode.org/index/cldr-spec/plural-rules).

##### Handling plural forms

Many localization file formats are supported and handle plural values in different ways. The most common ways are presented for each [format](https://support.phrase.com/hc/en-us/sections/6111343326364).

The number of plural forms is automatically handled according to [Unicode rules](https://cldr.unicode.org/index/cldr-spec/plural-rules). This means that some languages have up to 6 forms, while others have only a few. When adding a [locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8) to a project and providing the ISO code, the correct plural categories for that language are automatically displayed in the [Strings editor](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)") for translation. On export, plural keys are converted into the correct syntax for the target platform.

Plural forms are handled in the Plural forms tab of the [Project settings](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252) window. In the Unicode CLDR Version dropdown, select *LEGACY* or a *numbered Unicode CLDR plural rule version*.

*LEGACY* uses Phrase's original plural category mapping. The numbered *CLDR* versions (e.g. CLDR48) follow the official Unicode CLDR plural rules for that release. For most languages the category set is identical either way. For a few languages, including Spanish, Italian, Portuguese, and French, *CLDR48* adds a `many` category that *LEGACY* does not have.

Switching versions never deletes or changes existing translations:

- If the new version adds a category for one of the project languages, that category starts empty and needs new translations.
- If a category the project previously used is not part of the new version's set for that language, its existing translation stays stored but is no longer shown in the editor.

![plural_forms_tab.gif](https://support.phrase.com/hc/article_attachments/30682373373212)

[Keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) can be set as pluralized by enabling plural forms when creating or editing a key. To enable plural forms on a per-key basis in the Keys tab of a project, follow these steps:

1. In the project page, select More/Keys.

   The Keys tab is displayed.
2. Click the cog wheel ![Modify](https://support.phrase.com/hc/article_attachments/30682405167516) icon of the desired key.

   The Edit key window is displayed.
3. Click on the Plural forms tab and select Enable plural forms for this key.

   The Plural form type dropdown is displayed.
4. Choose between Cardinal and Ordinal plural type.

   ### Important

   Changing the plural type clears existing translations.
5. Click Save.

Ensure a Plural key name is provided if required by the used format (e.g., when using [gettext](https://support.phrase.com/hc/en-us/sections/6111343326364)).

Plural form type is also displayed and editable in the Meta section of the [editor sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1 "Editor Sidebar (Strings)") for each key.

---

### Global Search (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5821163151260-Global-Search-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:19:11Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

Use global search to find specific keys, translations, jobs or projects across the organization.

Click ![Search](https://support.phrase.com/hc/article_attachments/30682436165404) in the upper toolbar to open the [search window](https://support.phrase.com#UUID-e7eb7b3c-ba1f-d6d1-91ff-016465de5719_UUID-4c804bfa-4eeb-53ec-a6b4-fcc64a074b8d "Search window"). Type the search keyword in the search box at the top of the window and press **Enter** to display search results.

![Search Modal](https://support.phrase.com/hc/article_attachments/30682357106844)

#### Search window

The 10 best matches are presented in the search window with the highlighted search term. All matches are presented in a dedicated [search page](https://support.phrase.com#UUID-e7eb7b3c-ba1f-d6d1-91ff-016465de5719_UUID-25ac21f0-3a80-0fb1-d71f-e962273b86d1 "Search page") by clicking Show all or Open search page at the bottom of the search window.

Search results presented in the search window can be filtered through the options available at the top of the search window. Select Keys, Jobs or Projects to only display results related to keys, jobs or projects.

By default, search is applied across all available languages. The search can be narrowed to a specific language by clicking All languages at the top right of the search window: select the desired language by scrolling the dropdown list or directly search for a language using the dedicated search box.

Search results provide:

- Key matches:

  - Key name with status icon.
  - Translation content for that key.
  - Name of the project the key is located in.

    Clicking on the project name opens the project overview.
  - Name of the project branch, if applicable.

    Clicking on the branch name opens the project overview with the pre-selected branch.
  - Language the translation was found in.

    Clicking on the language opens the key in the editor with the selected language pair.

  Clicking on the search result opens the key in the editor.
- Job matches:

  - Job name with status icon (*draft*, *in progress*, *completed*).
  - Job statistics.
- Project matches:

  - Project title.
  - Project statistics.

#### Search page

The search page displays search results in full-screen mode.

![Search Page](https://support.phrase.com/hc/article_attachments/30682373574940)

Use additional sorting and filtering options at the top right of the page to:

- Sort search results alphabetically (ascending or descending order) or by last added and last updated items.
- Filter search results by project through the All projects dropdown list.

Keys search results can be further refined to display only keys with [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f). To filter global search results by custom metadata, follow these steps:

1. Click on the Advanced search ![Edit Filter Settings](https://support.phrase.com/hc/article_attachments/30682436256668) icon at the top of the keys search results.

   The Advanced search window is displayed.
2. Select the desired custom metadata property from the dropdown list.

   The query operator is automatically displayed based on the selected property.
3. Specify the value for the custom metadata according to the property type:

   - Text or String

     Type the text or the string to be matched. Include the value in quotation marks `""` for exact match.
   - Boolean

     Specify the desired value by selecting the relevant option.
   - Single-select

     Select the desired value from the dropdown field.
   - Multi-select

     Select one or multiple values from the dropdown field.
   - Link

     Type or paste the text of the link to be matched.
   - Number

     Type the number to be matched.
   - Date

     Specify the date or the time range to be matched by selecting the start and end dates from the calendars.
4. If required, click + Add filter to add multiple query options. Then, click the search icon ![Search](https://support.phrase.com/hc/article_attachments/30682436165404).

   Custom metadata filter(s) are applied to the keys search results.

To remove custom metadata filters individually, click the Remove ![Remove Key](https://support.phrase.com/hc/article_attachments/30682436289564) icon next to the added property in the Advanced search window.

##### Note

Refresh the search page to remove the first custom metadata filter.

---

### Ordering Professional Translations (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5821933165596-Ordering-Professional-Translations-Strings  
> Zuletzt aktualisiert: 2025-10-28T10:02:44Z  
> Labels: Administration, Project Manager, 2BTr, ar_strings

When managing translations, they can be provided internally via [jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) or professional translations can be ordered from Phrase translation partners. Pricing for ordered translations is displayed before placing the order, translation progress is tracked and when complete, notifications are sent. Turnaround time is dependent on size of translation, commonality of languages and quality of provided contextual information. Most translations are provided within 24 hours.

##### Important

Some LSP's do not support hosting user data and orders in US data centers. It is possible that data can leave the US when using Textmaster or other 3rd party translators.

Gengo will maintain data within the specified data center.

- Only [Administrators or Project managers](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) have the permission to order translations.
- Content to be translated must be in the default locale.
- Only keys with the date type `string` can be submitted. If a key has a different data type (`boolean`, `array`, etc.) it will not be recognized.
- The integration can not be used for source copy review (e.g. proofreading). Source language must be finalized before submission.
- If including unverified strings when sending an order, the existing translation string in the target language is not transmitted in the process and the source string for the key is re-translated.
- External translators do not access Phrase in the process and don't have access to translation resources stored in an organization. This includes [term bases](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503), [translation memory](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) and the [In-context editor](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-d83eaf9c-9f90-7a62-b722-c920fec6fbdb).
- If strings contain technical content such as [placeholders](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-2c4b8f4a-6b7f-08ce-8f19-ba810c7eb1a0), HTML tags or [ICU](https://support.phrase.com/hc/en-us/articles/5822319545116#UUID-c9eb2b85-8ec3-fef0-aae0-38dbf0454445 "ICU Message Format (Strings)"), ensure instructions on how to handle this content is provided in a briefing or style guide.
- If branding and control over the translation process are important, use Advanced Textmaster integration.
- In case of complaints or quality issues, clients using TextMaster or Gengo via Phrase (basic integration) should contact [Phrase Support](https://support.phrase.com/hc/en-us/requests/new) directly.

#### Information available to translators

Add as much meta information to an order as possible. The more information provided, the better the quality of the translation and the sooner it is returned.

This information is provided to translators when an order is confirmed:

- Description of the key.
- Screenshot attached to the key.
- Source translation for the key.
- Content of the style guide you attached to an order.
- Custom messaging entered during the order process.
- Max. number of characters allowed (configurable in translation key settings).

#### Mark untranslatables

Text within a translation order may not require translation (such as code blocks or comments for the translator). To prevent text from being modified and indicate to the translator that it does not need to be translated, wrap text within no-translate tags `[NOTRANSLATE]`like this`[/NOTRANSLATE]`.

Ensure no-translate tags are closed and avoid large areas of excluded text. Non-translate tags cannot be nested and must be written in all uppercase letters to be detected correctly.

No-translate tags are removed when downloaded.

**Example:**

String to be translated by professional translators:

```
Hello [NOTRANSLATE]username[/NOTRANSLATE]! Thanks for stopping by!
```

Received translation:

```
Hallo [NOTRANSLATE]username[/NOTRANSLATE]! Danke, dass du vorbeischaust!
```

#### Mark placeholders as untranslatable for translators

Translations may include [placeholders](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-2c4b8f4a-6b7f-08ce-8f19-ba810c7eb1a0) to be translated in an order. To prevent placeholders from being modified and indicate to the translator that it does not need to be translated, choose the appropriate placeholder formats in project settings. This ensures that all recognized placeholders matching the selected format are automatically marked as untranslatable and placeholders validation can be provided in the delivered translations.

Placeholders in the translation order preview are marked with the characters `[[[` at the start and characters `]]]` at the end of placeholders.

#### Make an Order

To make an order from Gengo or [TextMaster](https://support.phrase.com/hc/en-us/articles/5932606594716#UUID-bc342001-1556-f16a-63df-c25430211b27), follow these steps:

1. Open the Orders tab from any project.
2. Click Order translations now.

   The Choose a Provider page opens.
3. Select a provider and click Continue.

   The Order translations page opens.
4. Provide Order details and select required Options.

   - Mark as unverified when delivered

     This option applies only to newly added translations, that is empty strings ordered for translation from scratch.
5. Click Calculate price.

   A price is presented in the Summary.
6. Click Continue and if no style guide is prepared, confirm again.
7. The Order summary is presented and if correct, Confirm & Pay for the order.

#### Re-ordering

To re-order translations for keys, unverify all translations for the keys in the desired locale that should be included in the translation order. Select the include unverified translations option when creating the new order. Translations provided will be new translations of the source language string and existing, unverified translations will not be made available to translators in the process.

Related translations in the project will be replaced with the content of the ordered translations delivered by the translation service provider. To review changes between an old translation and the delivered translation, compare the different versions in the editor.

---

### Pre-translation (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822187934364-Pre-translation-Strings  
> Zuletzt aktualisiert: 2026-08-19T06:17:48Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Pre-translation automatically translates new [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109), [languages](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8), or [files](https://support.phrase.com/hc/en-us/articles/5822143476252#UUID-f503625e-7538-cf98-9f15-5316003a93c2) into multiple languages upon upload using [translation memories](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) and [machine translation](https://support.phrase.com/hc/en-us/articles/5821202515996#UUID-3f860272-82b6-b342-44a0-a97106ae0685). Use of and results of pre-translation can be viewed in the [analytics dashboards](https://support.phrase.com/hc/en-us/articles/7780103449884#UUID-1bbb2c57-382c-ba13-9c6a-182e6b34193a) and filtering can be used to view pre-translations in the [editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-d34f67de-e42e-0934-3db6-1aeadf931367 "Strings Editor Overview").

By default, pre-translation only translates empty translations and skips keys that already have a target translation. At the project level, pre-translation can be configured to overwrite unverified translations when the source text changes.

[API](https://developers.phrase.com/api/#overview) or the [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828) can also be used to trigger automatic translations. Use this push parameter when using the CLI:

```
params:
  autotranslate: true
```

#### Enable pre-translation to auto-translate content

To automatically pre-translate keys using machine translation (MT) and/or translation memory (TM), follow these steps:

1. [Configure MT](https://support.phrase.com/hc/en-us/articles/5821202515996#UUID-3f860272-82b6-b342-44a0-a97106ae0685) for a project (if using MT).
2. From the Project settings window, select the Pre-translation tab.
3. Select Enable pre-translation.

   Pre-translation options are presented. If options are not selected, pre-translation will not function.
4. Select the events that trigger pre-translation:

   - Translate new uploads automatically: pre-translates new keys when a file is uploaded to the project.
   - Translate new keys automatically: pre-translates a key when it is added manually.
   - Translate new languages automatically: pre-translates content when a new language is added to the project.

   If none of these options is selected, pre-translation does not run automatically on new content.
5. Select one or both of the following options based on required [workflow](https://support.phrase.com#UUID-93350abc-3aa2-c6b4-8863-254eec574c48_UUID-066c00f6-e325-cda9-f3f8-d016f7435687 "Pre-translation Workflows"):

   - Use machine translation to pre-translate content using MT.
   - Use translation memory to pre-translate content using existing TM matches.
6. Optionally, select Mark as unverified.

   Marks keys with new translations as unverified for easier review.
7. Optionally, select Overwrite translations when source text changes to replaces existing translations with machine translation. This cannot be undone.
8. Click Save.

   Pre-translation is enabled for the project based on the selected sources.

When translation memory and machine translation are both enabled for pre-translation, pre-translation checks translation memory first. If translation memory returns a match, pre-translation uses that match and skips machine translation for the key. Machine translation applies only to keys where translation memory returns no match.

Translation state does not affect this behavior. An unverified translation is a valid translation memory match, and pre-translation can reuse it. If the project shares its translation memory with the organization, matches can also come from other projects with translation memory sharing enabled.

Pre-translation requires an exact (100%) match from translation memory. Fuzzy matches are not applied, though they still appear as suggestions in the editor.

#### Pre-translation Workflows

- **Pre-translating newly added keys**

  When adding a new key from within the editor, enter the default translation of the source language for that key.

  By default, pre-translation does not override existing translations. Enable the Overwrite translations when source text changes option in the Project settings to replace unverified target translations during pre-translation:

  - The Overwrite translations when source text changes option requires a [main language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8) defined in the project.
  - Overwriting occurs only when the main language source text changes.
  - Any setting that prevents or [skips unverification](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1) also prevents overwriting.

  Pre-translation can be deactivated for individual keys when the key is added.
- **Pre-translating newly added languages**

  When a new language is added to a project, pre-translation can be used to provide initial translations for the new language. After the language is saved to the project, the progress overview indicates that keys in the new language are translated and set to unverified. Larger projects may take a few moments before being reflected in the progress overview. Pre-translation can only be applied to one language at a time.

  Pre-translation can be deactivated for individual languages when the language is added.
- **Pre-translating newly uploaded language files**

  When pre-translation is enabled, new keys in uploaded files are automatically translated into all languages in a project.

  By default, existing target translations are not overwritten. Enable the Overwrite translations when source text changes option in the Project settings to replace unverified target translations during pre-translation:

  - The Overwrite translations when source text changes option requires a [main language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8) defined in the project.
  - Overwriting occurs only when the main language source text changes.
  - Any setting that prevents or [skips unverification](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1) also prevents overwriting.

  Pre-translation can be deactivated for individual files when the file is added.
- **Pre-translating to auto-translate through the editor (batch-action)**

  To use pre-translation to auto-translate one or multiple keys after adding them to a project, follow these steps:

  1. From the editor, filter the list of keys with a search query.
  2. Select one or more target languages from the middle of the editor.
  3. Select one or multiple keys.
  4. Click Pre-translate.

     Pre-translation is run on the selected keys.

  Missing translations are filled in for selected keys and can also be applied to all keys with the select-all search box at the top of the key list. If configured in the Project settings, unverified translations can be overwritten when source text changes.
- **Post-editing [workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1)**

  Translations generated by pre-translation are set to be unverified by default. Post-edit the translations to achieve desired translation quality. Verified translations are not overwritten by pre-translation.

#### Excluding content from pre-translation

To skip certain parts of a string (e.g. a brand name):

- Wrap or replace the element to be ignored with a [placeholder](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-2c4b8f4a-6b7f-08ce-8f19-ba810c7eb1a0).
- Wrap the parts to be skipped in `[NOTRANSLATE]...[/NOTRANSLATE]` tags. Tags can be later removed during [download](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-5987e780-55f5-f730-87b6-071f69103a05).

---

### ICU Message Format (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822319545116-ICU-Message-Format-Strings  
> Zuletzt aktualisiert: 2026-08-28T06:25:18Z  
> Labels: Project Manager, 2BTr, ar_strings

ICU (International Components for Unicode) is a set of libraries providing globalization support for the internationalization of software systems.

Translations with [ICU message format](https://unicode-org.github.io/icu/userguide/format_parse/messages/) syntax are supported.

AI chatbots can be very effective at verifying ICU rules.

Enable ICU Message format in the Advanced tab of the Project settings window.

ICU message format provides:

- **Syntax highlighting**

  When opened in the translation editor, the different parts of a message are highlighted and displayed along with relevant meta-information such as format type. Individual arguments and formats directly into your target can be applied to the translation to avoid errors introduced by typos. Click on a placeholder in the list of extracted placeholders or directly onto the part of the source content to be used in the target translation.
- **Syntax validation**

  Correctness of the syntax is validated while translating. This can prevent broken ICU messages in localization files.
- **Preview**

  ICU message format syntax can be complex and how the translation will look with actual arguments can be previewed. Click on the preview button [in the Strings editor](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)") and assign real-world attributes to the ICU message to see if the translation syntax is correct and all possible cases are supported as expected.

  Test values can be assigned for the attributes of a translation in the preview panel. How the string looks is displayed and can be double-checked to ensure that the translation works as expected.

When a key containing an ICU plural message is sent from Strings to TMS through Job Sync with Parse ICU messages enabled, TMS expands the plural categories to match the full CLDR plural rule set for the target locale. This can add categories that are not present in the Strings source. When the job exports back to Strings, the ICU message retains this expanded category structure rather than reverting to the original source category count.

---

### Localization Workflow (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5821111943708-Localization-Workflow-Strings  
> Zuletzt aktualisiert: 2026-07-17T06:17:03Z  
> Labels: Project Manager, 2BTr, ar_strings

If new to localizing strings for a project, this would be a typical and recommended workflow:

1. Add new source translations and keys using one of these methods:

   - Use [key management](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) to add new keys to a project, along with a default translation.
   - Add keys via file upload ([CLI](https://support.phrase.com/hc/en-us/sections/5784132012828)).
   - Add keys via [API](https://developers.phrase.com/api/#keys).
2. Once new source translations or keys are added to a project, translators start working in order to translate the content into supported languages.

   - [Invite](https://support.phrase.com/document/preview/57801#UUID-86d1fa5d-b590-2cb7-b3fe-2ed77e8be239) internal team members to work on a project.
   - [Order professional translations](https://support.phrase.com/hc/en-us/articles/5821933165596#UUID-17fbdf6e-b1e7-1ce2-9cce-92f982261d6c "Ordering Professional Translations (Strings)") from external providers.
3. Download translations.

   - Download the translations from the application in the required format.
   - Download files via API or CLI.
4. Merge conflicts

   No attempt to resolve merge conflicts is made but the most recent version of a translation is what is downloaded from a project. Avoid translating keys locally (outside of Phrase) to avoid merge conflicts and to ensure team members are accessing the most recent translations.
5. Release new translations with the application.

   There is no need to have a connection to Phrase in a production environment. Calling APIs in production to retrieve localization data is not recommended.

   Treat received localization files like any other file in a code repository or project:

   1. Check them into version control.
   2. Run tests against the application (if available).
   3. Deploy and release the software normally.

If more complex and customized workflows are required, these can be constructed with [Phrase Orchestrator](https://support.phrase.com/hc/en-us/articles/7681638082716#UUID-1cda7cbd-1aa9-d555-499b-36042949842f).

---

### Translate with In-Context Editor (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/8822012741660-Translate-with-In-Context-Editor-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:19:15Z  
> Labels: 2BTr, ar_strings

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Context View

Context view is an add-on for the [In-Context editor](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-d83eaf9c-9f90-7a62-b722-c920fec6fbdb). It is automatically available within the In-Context editor (ICE) if subscribed to the correct plan.

Context view collects information about which keys are rendered on which URLs in a web application and stores this information. Links to the website are generated from displayed keys and provided in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-d34f67de-e42e-0934-3db6-1aeadf931367 "Strings Editor Overview"), so that translators are always aware of context.

##### Set up Context view

To set up Context view, follow these steps:

1. Prepare a staging environment that uses the In-context editor.
2. Add the URL for the staging environment to the In-context editor URL field in the In-context editor tab in the Project settings window.
3. If the application or website uses anchor or location hash-based routing, select Enable support for routing via anchor.
4. Click Save.

   The URL is added to the project settings.
5. Browse the website with the installed In-context editor.

When working in the translation editor, translators can click Open In-Context Editor in the key details to locate the keys on the website and translate using the In-Context editor.

By default, ICE is displayed next to the relevant website in vertical layout. Select the arrow button at the top right of the website to hide ![Hide ICE](https://support.phrase.com/hc/article_attachments/30682373705500) or show ![Show ICE](https://support.phrase.com/hc/article_attachments/30682405454876) ICE as required.

##### Note

For projects with a large number of keys, the In-Context editor will load 100 keys per page.

##### Editing Key Translations

Translators can interact with keys found on the website through the following buttons:

- Pencil icon ![Edit Key in Project](https://support.phrase.com/hc/article_attachments/30682373752604)

  Displayed next to keys already existing in the project.

  Click to select the desired key from the dropdown list and edit the translation in the In-Context editor.
- Plus icon ![plus_ice.png](https://support.phrase.com/hc/article_attachments/30682387096604)

  Displayed next to keys that do not exist in the project.

  Click to select the desired key from the dropdown list and add it to the project.

To display the key list in ICE, click on the search icon ![Search](https://support.phrase.com/hc/article_attachments/30682387132828):

- By default, the key list is filtered to show only the keys available for in-context editing on the current website page.
- If required, select the blue icon ![Display Keys in Project](https://support.phrase.com/hc/article_attachments/30682405562268) at the top of the key list to display all the keys in the current project.
- The total count of available keys is shown at the top of the key list:

  - Number of keys integrated with ICE and added to the current project.
  - Number of missing keys that are not yet integrated with ICE in the current project.

Selecting a key from the key list automatically scrolls to the key location on the website, if visible.

Once selected, keys can be translated or edited through existing functionalities provided in Strings translation editor:

- [Viewing options](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)"):

  - Vertical and horizontal view
  - Single key view
  - Single language or Multilingual view

    Based on the target language currently selected in the ICE key card, the key translation is automatically displayed and updated on the website page.

    ### Note

    Selecting empty translations in the ICE key card displays the relevant key name on the website page.
  - Dark mode
  - Reorder sidebar
- [Key list and search options](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-4d99c5d9-baab-9885-24ec-578550c2f22e "Editor Key List (Strings)"):

  - Multilingual search
  - Search by job context
  - Batch actions
- [Contextual sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1 "Editor Sidebar (Strings)"):

  - Suggestions
  - Comments
  - Changes
  - Jobs

#### Old In-Context Editor

Context view is an add-on for the In-Context editor. It provides links back to your app, so translators are always aware of context. It is automatically available within the In-Context editor if subscribed to the correct plan.

Context view collects information about which keys are rendered on which URLs in a web application and stores this information. Links to the website are generated from displayed keys. Translators can click a link next to a key to go directly to its location on the site and use the In-Context editor to edit the translation on the page.

##### Set up Context view

To set up Context view, follow these steps:

1. Prepare a staging environment that uses the In-context editor.
2. Add the URL for the staging environment to the In-context editor URL field in the In-context editor tab in the Project settings window.
3. If the application or website uses anchor or location hash-based routing, select Enable support for routing via anchor.
4. Click Save.

   The URL is added to the project settings.
5. Browse the website with the installed In-context editor.

---

### Comments (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/10235050685084-Comments-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:19:16Z  
> Labels: 2BTr

Users can add comments and create conversation threads about a key or specific language pairs of a key in the Activity section of the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-d34f67de-e42e-0934-3db6-1aeadf931367 "Strings Editor Overview"). Collaboration through comments is also supported for jobs in the [job context sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1 "Editor Sidebar (Strings)"), allowing cooperation between all users assigned to a job.

By selecting the Comments tab in the [Activity](https://support.phrase.com/document/preview/71378#UUID-6d3d6abc-f959-a71a-7fb2-a2e82aa3312b) section, users can perform the following actions:

- Add and reply to comments, also by mentioning other users.
- Display, search, filter and sort comments.
- Add and remove reactions by hovering over the desired comment and selecting the emoji icon.

  ### Note

  The emoji icon is also directly displayed under parent comments.

  Available reactions:

  - Thumbs up
  - Fire
  - Eyes
  - Raised hands
  - Green heart
  - Green checkmark
- Edit or delete comments.
- Resolve and unresolve comments.

##### Note

Threads, language selection, resolving comments and filtering/sorting options are not supported in job comments.

#### Add and Reply to Comments

To add a comment or start a conversation about a key or a job, follow these steps:

1. Click on the Comments tab in the Activity section of the key context sidebar or job context sidebar.
2. Enter comment in text field. If required, click the *languages* dropdown at the bottom left to attach only specific language pairs to the comment.

   ### Note

   By default, all languages in the project are selected.
3. Optionally, type or select **@** to add a mention in the comment.

   Use mentions to ensure users receive [notifications](https://support.phrase.com/hc/en-us/articles/5821056541340#UUID-98d7e39b-454b-7b0b-21a3-37a657f9469f) and an e-mail. Replying to a comment notification in e-mail adds the new comment to the project.
4. Click Comment.

To reply to existing comments about a key, hover over the desired comment in the Comments tab and select the Reply to comment ![Reply to Comment](https://support.phrase.com/hc/article_attachments/30682407828892) button. Multiple replies to the same parent comment are grouped in a thread.

#### Edit or Delete Comments

Hover over a comment and select the 3-dot menu ![More Menu](https://support.phrase.com/hc/article_attachments/30682436610332) to display editing and deletion options.

Users can edit and delete only their own comments about a key or a job.

Adding or removing attached languages is not enabled when editing comments.

#### Resolve comments

Once comments in a conversation have been addressed, hover over the parent comment and click Resolve comment ![Resolve Comment](https://support.phrase.com/hc/article_attachments/30682424338460) to mark the conversation as resolved.

Resolving comments can be reverted by clicking Undo in the confirmation message or by selecting Unresolve comment after hovering over the comment.

Resolved comments disappear from the list, unless the option to [show resolved comments](https://support.phrase.com#UUID-0036c12b-a2e9-59bf-2724-caf83c35b52e_UUID-3d7f9cc1-1709-f64c-d2c8-6946a43f925a "Search and Filter Comments") has been enabled through the Sort/Filter ![Sort Filter](https://support.phrase.com/hc/article_attachments/30682387318556) button. The user who resolved a comment will see a green checkmark next to the relevant comment. All resolved comments stay in the chronological order.

##### Note

Users can resolve only their own comments. Other users will still display resolved comments as regular comments.

#### Search and Filter Comments

Use available options and buttons at the top of the Comments tab to filter comments by text, languages or resolved status.

By default, comments are sorted by newest first. Click the Sort/Filter ![Sort Filter](https://support.phrase.com/hc/article_attachments/30682387318556) button at the top right to display oldest comments first.

###### Search by text

To search for specific comments by text, follow these steps:

1. Enter the desired text in the search field at the top of the comment list.

   Relevant search results are displayed with highlighted search keyword.
2. Click on the desired search result to open the relevant comment or thread.

###### Filter by language

To filter comments by language, click the All languages dropdown at the top right and select the desired language pairs. If more than 2 languages are selected, all comments matching at least one of the selected languages are displayed.

##### Note

Only languages that are part of the project/branch are displayed through the All languages dropdown.

###### Filter by resolved status

To show or hide resolved comments in the list, click the Sort/Filter ![Sort Filter](https://support.phrase.com/hc/article_attachments/30682387318556) button at the top right and toggle Show resolved comments as required.

---

### Strings Editor

Quelle: https://support.phrase.com/hc/en-us/sections/11155523728540-Strings-Editor

#### Strings Editor Overview

> Quelle: https://support.phrase.com/hc/en-us/articles/5822638157340-Strings-Editor-Overview  
> Zuletzt aktualisiert: 2026-06-26T06:19:16Z  
> Labels: Linguist, 2BTr, ar_strings

The Strings editor is the workspace where translators can translate and review string-based content for software, websites, and apps. It is designed for continuous localization workflows, providing in-context editing, quality checks, and streamlined collaboration for agile teams.

The editor provides meta information for translated strings, [key](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) management and search functionality. It is split up into three functional areas within the browser window:

![Strings Editor](https://support.phrase.com/hc/article_attachments/30682405773340)

1. [Search and key list pane](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-4d99c5d9-baab-9885-24ec-578550c2f22e "Editor Key List (Strings)")

   Filter and search for keys, apply batch actions, and manage key selections.
2. [Source and target language pane](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)")

   View and edit translations alongside source strings.
3. [Sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1 "Editor Sidebar (Strings)")

   Access [QA issues](https://support.phrase.com/hc/en-us/articles/5820046486684#UUID-203e5b75-e673-267b-18e5-c77c53dea127), [comments](https://support.phrase.com/hc/en-us/articles/10235050685084#UUID-0036c12b-a2e9-59bf-2724-caf83c35b52e "Comments (Strings)"), [screenshots](https://support.phrase.com/hc/en-us/articles/5822309698204#UUID-fe8ea981-c144-f5b6-90f6-45c84304c3d8), and key metadata for context and quality control.

There are two methods to open the translation editor:

1. From the main Projects page, hover over the desired [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252) card and select Editor.
2. From the Languages tab of the current project page, click on the name of the desired [language locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-ecfff114-7e61-c99d-f630-6f7ceca104f8).

A [series of videos](https://www.youtube.com/playlist?list=PLocQIdQCOZfSV5kdlUh1SbwPGHoAKESSx) has been prepared to demonstrate the editor:

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/gRYCUD63hKQ)

###### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

##### Troubleshooting

- When opening the editor, keys and translations do not display.

  This issue may be related to the browser cache. To resolve it, try the following recommendations:

  - Use the most recent version of the browser.
  - [Perform a hard refresh](https://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache).
  - Use the browser's incognito mode, or delete the cache/cookies and try accessing again.
  - Disable any recently added VPN or browser extensions.

---

#### Editor Key List (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11155504491932-Editor-Key-List-Strings  
> Zuletzt aktualisiert: 2026-08-04T06:16:35Z  
> Labels: 2BTr, ar_strings, cadence-dec24

The left-side section of the translation editor is used to find keys that require translation or review through different search modes and filtering tools. This section also allows creating new keys manually in the current project by selecting the Add key button at the bottom.

By default, a preview of the source content is displayed under each key in the list. To hide the source preview in the key list, toggle Show source text preview from the View dropdown menu at the top right of the [source and target language pane](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)").

##### Search bar

Use the search bar at the top to find translation keys and associated content using a query language.

Follow the [query formatting rules](https://support.phrase.com/hc/en-us/articles/17148496405788#UUID-43391ca3-bca4-c90d-daa4-75f813149815 "Editor Search Query Formatting (Strings)") to create queries across multiple search entities and view the desired subset of keys.

Available search entities:

- Content

  Search by content applies to both source and target languages.
- Key name
- Tag
- Custom metadata
- Upload
- Notification

###### Save and Reuse Queries

It is possible to save queries specific to the current project.

To save and apply search queries, follow these steps:

1. Enter the query in the search bar.
2. Click the bookmark ![Bookmark](https://support.phrase.com/hc/article_attachments/30682424594716) icon.

   The Save search window is displayed.

   ![Save Query Notification](https://support.phrase.com/hc/article_attachments/30682405975580)

   ### Note

   Currently in
3. Name the query and click Save.

   The query is saved for the current project.
4. Press the **ArrowDown** key in the search bar.

   A list of saved queries is displayed.
5. Select the desired query from the list to apply it.

   ### Note

   If needed, select Delete from the three-dot menu ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682387595164) next to a saved query to remove it from the list.

   ![Delete Query](https://support.phrase.com/hc/article_attachments/30682406030364)

###### Query Builder

###### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

###### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Click on the Open query builder button ![Open Advanced Search](https://support.phrase.com/hc/article_attachments/30682437052188) next to the search bar to toggle the query builder and display additional options and fields above the key list.

The query builder provides a user-friendly interface for creating advanced search queries by using multiple search fields for different search entities.

Available search entities:

- Content
- Key name
- Tags
- [Custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f)

Case sensitivity is always enabled for custom metadata fields, starts with and ends with operators, and wildcard queries.

To find the desired subset of keys through the query builder, follow these steps:

###### Tip

Toggle on and off the Case sensitive option from the three-dot ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682387595164) menu to apply case sensitivity to all text fields as required.

![Case Sensitive Option Toggle](https://support.phrase.com/hc/article_attachments/30682437073948)

1. In the Content or Key name search fields, enter the desired keyword(s) and select one of the available query operators from the dropdown menu next to the respective field.

   To add multiple content or key name filters, click + Add Filter at the bottom.

   ![Query Builder Operators](https://support.phrase.com/hc/article_attachments/30682419943324)
2. Optionally, click on the Tags dropdown menu and select one or multiple tags to find only keys associated with those tags.
3. If required, click + Add Filter at the bottom to filter keys by any custom metadata properties assigned to the current project.

   1. Select one or multiple properties among those available in the dropdown list.
   2. Specify the value for each custom metadata according to the property type:

      - Text or String

        Type the text or the string to be matched. Select Exact match if required.
      - Boolean

        Specify the desired value by selecting the relevant checkbox.
      - Single-select

        Select the desired value from the dropdown field.
      - Multi-select

        Select one or multiple values from the dropdown field.
      - Link

        Type the text of the link to be matched.
      - Number

        Type the number to be matched.
      - Date

        Specify the date or the time range to be matched by selecting the start and end dates from the calendars.

###### Search and Replace (Beta)

###### Note

Search and Replace is available as an early beta. To request access, contact [support](https://support.phrase.com/hc/en-us/articles/5784099168284-Phrase-Technical-Support-Policy#contacting-support-0-2) or your customer success manager.

Search and Replace scans translation content across all keys in the current project and applies a replacement in a single batch action.

Search is case-insensitive by default. Case sensitivity follows the setting in the advanced search options.

To use Search and Replace:

1. Enter the term to be replaced in the Search field.

   The > icon appears.
2. Click the > icon to expand the Replace with field and enter the replacement term.

   A real-time preview of all affected translations is displayed across the key list before the replacement is applied.
3. Click Replace in the batch action bar at the bottom of the screen. A confirmation window with replacement counts opens.
4. Click Replace translations to apply replacements.

##### Sorting and filtering tools

Under the search bar, there is a drop-down menu to sort the key list. Use the available options to order keys and search results by best match, alphabetically by key name, by last update, or by creation date (newest or oldest key first).

At the top of the key list, filtering options are displayed by clicking the filter button ![Filter Keylist](https://support.phrase.com/hc/article_attachments/30682419976476). Click on the Expand all sections button ![Expand Filters](https://support.phrase.com/hc/article_attachments/30682387731356) at the top of the filter window to expand all available filters at once, or use the search field to search for filters by name. Select one or multiple options to filter keys and search results based on their translation or verification status, excluded state, [plural forms](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-4d5427c1-a8ac-386d-58c9-ad55ce179c95 "Plural Forms (Strings)") or [pre-translation](https://support.phrase.com/hc/en-us/articles/5822187934364#UUID-93350abc-3aa2-c6b4-8863-254eec574c48 "Pre-translation (Strings)") state.

Filters are applied to the selected target language(s). For keys displaying only source language, filters are applied on the source key view.

##### Batch actions

###### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

At the top of the listed keys and next to each key there are checkboxes for multiple keys selection. Upon selection, the editor shows a new popup at the bottom of the screen allowing to perform a batch action on the selected keys.

Batch actions can be applied to selected keys both in single target language view and in multilingual view. Batch actions are also enabled for keys with only source language view.

###### Note

When target languages are selected, batch actions are applied to the target languages.

Batch actions are:

- Update status

  Show a dropdown with options to mark selected keys according to their verification (flagged/unflagged) or exclusion status.

  If the [advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1) has been enabled in the project settings, additional options are displayed to mark selected keys according to their review status.
- Delete keys

  Delete the whole selected keys, not just their translations.
- Attach screenshot

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Upload one or more screenshots to attach to the selected keys. The uploaded screenshots are displayed as [key reference](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context") in the contextual sidebar.
- Add Figma preview

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Add new Figma links as a [key reference](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context") in the contextual sidebar for the selected keys.
- Add to job

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Click on Add to job and choose a job from the list, or select Add job to create a new job based on the selection.
- Add/remove tags

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Enter the desired tags and add them to or remove them from the selected keys.
- Edit custom metadata

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Select the desired [custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f) property among the ones assigned to the project. Then, add or edit relevant values to display in the Custom Metadata section of the [key contextual sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context"). Select Update to apply the changes.
- Character limit

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  - Set character limit for the selected keys by typing the desired value in the Character limit window. Press **Enter** to apply it.

    Any existing character limit for the selected keys is replaced by the new value.
  - Remove any existing character limit for the selected keys by clicking Remove set character limit in the Character limit window.
- Pre-translate

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Run pre-translation on selected keys to fill out any missing translations in the current target language. Pre-translation only translates empty translations and skip over keys that have already been translated.
- Clear target translations (displayed in target language view)

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Discard any changes in the target language and revert to the previous content. The translation status is set to untranslated.
- Clear source translations (displayed in source language view)

  Select the ![More Menu](https://support.phrase.com/hc/article_attachments/30682406177692) button to display this batch action.

  Discard any changes in the source language and revert to the previous content. The source translation status is set to untranslated.
- Link to parent key

  Opens a window to create a new link where the child keys are preselected.

---

#### Source and Target Language Pane (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11155517930268-Source-and-Target-Language-Pane-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:19:19Z  
> Labels: 2BTr, ar_strings

The middle section of the translation editor is where translation and review of the selected keys are performed.

By default, keys are listed in cards including the source language text to be translated and/or verified, as well as the target language text field. Use the drop-down menu at the top left to select both source and target languages for the translation among the available project languages.

###### Note

If no target language is selected, the source key view is displayed.

[Linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-19c54730-f40d-b447-9944-91f06f10dbb6) are marked with relevant icons and labels at the top of the key card:

- ![Repetition_heavy.png](https://support.phrase.com/hc/article_attachments/30682406396444) Parent key

  Click on the key card to display existing child keys in the sidebar and edit the link.
- ![Repetition_light.png](https://support.phrase.com/hc/article_attachments/30682437355292) Child key

  Hover over the label to preview the parent key. Click on the key card to edit the link in the sidebar.

##### Key Card View Options

Click on View at the top right to display several viewing options related to the key card:

- Single key view

  If enabled, displays a full-height key card. Use the arrow buttons ![Close List](https://support.phrase.com/hc/article_attachments/30682420251676) and ![Open List](https://support.phrase.com/hc/article_attachments/30682425147932) in the footer at the bottom left to move between keys from the single key view.
- Show non-printable characters

  By default, non-breaking spaces ![Non-breaking Space](https://support.phrase.com/hc/article_attachments/30682388013340) and line breaks ![Line Break](https://support.phrase.com/hc/article_attachments/30682406545820) are displayed in the translation text once the translation is saved. Select this option to toggle the visualization of such characters.
- Show QPS

  By default, the [QPS (Quality Performance Score)](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444) is displayed in the key card after [saving the translation](https://support.phrase.com#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c_UUID-1c53fef7-3658-cee6-a0c2-5e5b1cf10022 "Translation Actions"). Select this option to toggle the visualization of such score.
- Card layout

  By default, key cards are displayed with vertical card layout. Select this option to switch to horizontal card layout.

  ### Note

  The card layout option is disabled for keys displaying only the source language.

##### Translation Actions

The source and target language card provides these actions on the translations through a series of buttons and options:

- Copy source to target

  Select the target language field of the card to display this button ![Copy Source](https://support.phrase.com/hc/article_attachments/30682425228828).

  Copy the content from the source language into the target language field.
- Copy key name

  Hover the mouse on the key name at the top of the card to show this button ![Copy Key](https://support.phrase.com/hc/article_attachments/30682420370332).

  Copy the key name to clipboard.
- Set character limit

  Select the source or target language field to display this button in the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682420392732) dropdown.

  Set the maximum number of characters a translation can contain. After typing a number in the popup, press **Enter** to apply the character limit.

  The character count is displayed at the bottom when editing translations for the key.
- Exclude translation

  Select the source language or target language field of the card to display this option in the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682420392732) dropdown.

  Click on it if the selected key does not require a translation in the target language.

  The card’s status label is updated, and text changes can no longer be saved.
- Saving options

  Click on the Save button at the bottom right to save a translation.

  If [QPS visualization](https://support.phrase.com#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c_UUID-a3f16504-54ec-8b86-1b58-da29b7a12251 "Key Card View Options") is enabled, the [QPS (Quality Performance Score)](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444) appears above the translated text for both human and MT translations:

  - Any translation that is scored as 100 is highlighted in green.
  - Any translation that is scored as 99 or below is highlighted in orange.
  - No score is displayed in case of untranslated keys or unsupported languages.
- Verifying options

  To verify or unverify a translation, use the flag icon at the bottom of each card.

  If unverified, the status label of the card is updated accordingly and provides the option to verify the translation.

  MT provider logo is also displayed to indicate strings that are [machine translated](https://support.phrase.com/hc/en-us/articles/5821202515996#UUID-3f860272-82b6-b342-44a0-a97106ae0685).
- Changes visualization

  By default, any changes applied to an unverified translation are automatically displayed in the source text when selecting the translation field.

  To toggle changes visualization, click ![Display/Hide Changes](https://support.phrase.com/hc/article_attachments/30682406675868) to hide or show changes as required.
- Reviewing options

  If the [Advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-979569d7-5e76-730d-3006-ac905c86daa1) has been selected in the current project settings, the status label of the card is updated accordingly and an additional button is available at the bottom of the card.

  MT provider logo is also displayed to indicate strings that are [machine translated](https://support.phrase.com/hc/en-us/articles/5821202515996#UUID-3f860272-82b6-b342-44a0-a97106ae0685).

  To complete the review and update the key status, hover over the target text and click on Review. Alternatively, click on the translation field to apply any changes to the source or target language text, then click Save and review ![Save and Review](https://support.phrase.com/hc/article_attachments/30682406699420) at the bottom of the card.
- Mark as minor change

  Select the target language field of the card to display this option in the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682420392732) dropdown.

  Enable it to make small changes (e.g. adding missing punctuation) that does not update the verification status of the translation.
- Discard

  Discard any changes in the text and revert to the previous content.
- [ICU message](https://support.phrase.com/hc/en-us/articles/5822319545116#UUID-c9eb2b85-8ec3-fef0-aae0-38dbf0454445 "ICU Message Format (Strings)") preview

  In case of keys including translations with ICU MessageFormat syntax, select the source language field of the card to display the Open ICU message preview ![ICU Preview](https://support.phrase.com/hc/article_attachments/30682408928412) option in the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682420392732) dropdown. Select this option to see the ICU message preview in the contextual sidebar.

  The preview lists all variables and attributes of the selected translation and is updated according to text typed in the relevant fields. Styled ICU message fields are also supported.

  The preview shows an error state when selecting a translation with broken ICU message.
- Export translations ![Sync Import](https://support.phrase.com/hc/article_attachments/30682437683868)

  Click this button at the top right of the pane to navigate to the Languages tab of the project, and download the translations of the desired language(s).

To display additional actions for editing or managing the translations, click on the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682420392732) button at the top right of the pane. Upon selection of the target language field, these options are available:

- Save & next

  Select this option to save the current key translation and proceed directly to the next target language field.
- Clear translation

  Select this option to discard any changes in the target language pane and revert to the previous content.

##### Multilingual view

When working with projects with multiple target languages, multilingual view allows the display and editing of different language translations in a single key card.

Use the drop-down menu at the top left to select multiple or all target languages from the available project languages. The list of target languages can also be filtered out by using the search box at the top.

As languages are selected, the language selector will update with information about how many target languages have been selected. Click Apply or anywhere outside of the drop-down menu to display the selected languages in the key card.

Selecting more than two languages automatically enables the key multilingual view which provides a summary of the current status of all selected translations at the top right of each key card.

Selected languages in the multilingual view are remembered when switching to other branches.

All translations displayed for each key card in the multilingual view are editable with relevant options according to their status. Batch actions are available when selecting multiple keys.

---

#### Editor Sidebar (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11155533567388-Editor-Sidebar-Strings  
> Zuletzt aktualisiert: 2026-08-04T06:16:37Z  
> Labels: 2BTr, ar_strings

The sidebar on the right of the editor shows useful information that provide context and helpful tools when translating. Options and sections available in the sidebar are based on the item type currently selected in the editor: project, key card or source/target language field.

Sections displayed in the contextual sidebar can be hidden or rearranged according to user needs. To customize sections visualization, follow these steps:

1. Click on View at the top of the [source and target language pane](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c "Source and Target Language Pane (Strings)") and select Reorder sidebar from the dropdown.

   The Sidebar settings panel is displayed with a list of available sections.
2. Use the handles on the left of the desired sections to drag and reorder them in the list.

   Relevant changes are instantly applied to the contextual sidebar on the right. Reordering is saved and replicated in all projects the user has access to.
3. Click the toggle on the right of the desired sections to hide or show them in the contextual sidebar.

   Relevant changes are instantly applied to the contextual sidebar on the right.

###### Note

Some sections (e.g. [Terms](https://support.phrase.com#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context"), [Suggestions](https://support.phrase.com#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context"), and [Quality Assurance](https://support.phrase.com#UUID-92517239-f862-71e4-20ec-2974dba795d1_UUID-28536a57-d9cc-192f-1d5d-31191f79226f "Key and translation context")) might not be visible in the sidebar if no content exists. As soon as there is content to display, they will appear in the order set through Sidebar settings.

##### Project context

When opening the editor, the sidebar includes a project overview. Click ![Copy URL](https://support.phrase.com/hc/article_attachments/30682437928476) to copy the project URL.

###### Job context

If [jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) exist in the project, a job list is displayed with status information. To view job details, hover over a job and select View job context. The sidebar will display information about the keys included in that job.

###### Note

Only assigned jobs are listed in the contextual sidebar.

From the job context view:

- Use options under the Mark as dropdown menu at the top right to edit the job or translation status.
- Select Add ticket link to add a Jira link to the job context.

  ### Note

  This option is displayed only if there are no Jira links already added.
- Select the Comments tab in the Activity section to add [comments](https://support.phrase.com/hc/en-us/articles/10235050685084#UUID-0036c12b-a2e9-59bf-2724-caf83c35b52e "Comments (Strings)") about a job.

  The Comments tab also enables to search for comments, add reactions, edit or delete comments.

##### Key and translation context

After selecting a card, the key details are displayed in the sidebar with interaction menus. Available menu names are displayed at the top of the sidebar and clicking on the menu name will jump to the selected menu.

At the top of the key sidebar, click on the icon ![Copy URL](https://support.phrase.com/hc/article_attachments/30682437928476) to copy the key URL or click on the gear icon to edit some of the [key attributes](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109). Use the description field to review or add a new description for the selected key.

Below the key name and description, the menus are presented:

- Format annotations

  Show format-specific metadata carried over from the source file, such as .XLIFF notes, .ARB placeholders, or Qt context, along with the file format name.
- References

  Show a preview of any existing reference files attached to the project.

  - **[Screenshots](https://support.phrase.com/hc/en-us/articles/5822309698204#UUID-fe8ea981-c144-f5b6-90f6-45c84304c3d8)**:

    To add new screenshots as a key reference, select Add screenshot from the ![Add New Template](https://support.phrase.com/hc/article_attachments/30682409218460) menu at the top right. Select the gear icon at the top to access the screenshot management page of the project.
  - **Figma URLs**:

    To add new [Figma](https://support.phrase.com/hc/en-us/articles/5819515701916#UUID-c9c6bc21-3921-38e5-4339-93578f6782d7) links as a key reference, select Add Figma preview from the ![Add New Template](https://support.phrase.com/hc/article_attachments/30682409218460) menu at the top right. Once the link is added, a Figma preview is generated with real-time information about filename and latest changes at the bottom left. The Figma preview supports scrolling and zooming through the attached file.

    Hover over the preview and select available options under the More ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682407074460) menu to open a bigger in-app preview of the Figma link, open the file in Figma, edit the link or detach it from the key. Detaching a Figma URL does not delete the link. The link is only detached from the key.

    ### Note

    Not supported in jobs imported to Phrase TMS via [Job Sync](https://support.phrase.com/hc/en-us/articles/5709647502620#UUID-776d5a52-a0f8-d5c1-10b7-60bb343ef950).
  - **Figma preview**

    Click Figma preview under References to open the Figma bundle in a new tab, with the In-Context Editor (ICE) loaded over the design frame. Click any text element to edit it inline. The translation renders directly in the original design context. Session authentication carries over automatically, so no separate sign-in is required in the new tab.

    It applies to keys with a Figma bundle attached from a push made with Upload Figma preview enabled.
- [Quality assurance](https://support.phrase.com/hc/en-us/articles/5820046486684#UUID-203e5b75-e673-267b-18e5-c77c53dea127)

  List all QA issues which have been found in the selected translation with relevant information.
- [Terms](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503)

  Display matches from the attached term bases and apply the correct translation for the desired terms in the editor.
- Suggestions

  View hits from the built-in [translation memory](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) or any [machine translation](https://support.phrase.com/hc/en-us/articles/5821202515996#UUID-3f860272-82b6-b342-44a0-a97106ae0685) matches and apply them directly from the sidebar.

  MT provider logo is displayed in the key card to indicate strings that are machine translated.
- Tags

  - Enter text to search for any tags applied to the key or create new tags. If there are no matching tags, press **Enter** to add the newly created tag. Click the x on the tag to remove it.
  - System tags are displayed by default. Click View options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682407074460) and toggle off Show system tags to hide them.
  - Clicking on a tag will automatically insert the tag into simple and advanced search fields to filter the [key list](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-4d99c5d9-baab-9885-24ec-578550c2f22e "Editor Key List (Strings)"). Tags already applied to search are disabled from clicking.
- All languages preview

  Preview all the languages of the selected key and relevant translations with status information.

  By default, the first 3 lines of text are displayed for each translation. Any truncated translations can be expanded by clicking on the relevant language.

  Hover on a language and click ![Open in Editor](https://support.phrase.com/hc/article_attachments/30682409275548) to open it in the editor through [multilingual view](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-0134527a-6cc6-3bd6-f42d-bd8eb2fbf68c_UUID-bfce6eac-9aa3-6911-d4b9-c09d2108b545 "Multilingual view").
- [Jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812)

  View jobs where the key is included and add the key to existing jobs.

  Hover on a job in the list to display the following options:

  - Open in the editor ![open_job_in_editor.jpeg](https://support.phrase.com/hc/article_attachments/30682438020508): Refine key list by applying job tag and update keys displayed in the editor.
  - Open job overview page ![Job Overview](https://support.phrase.com/hc/article_attachments/30682438047004): Display job overview in the relevant project page.
  - Remove key from this job ![Remove Key](https://support.phrase.com/hc/article_attachments/30682420815004): Remove the selected key from the job. This option is not available for locked keys.
- Meta

  View additional metadata about the current key, including:

  - Type

    Indicates the type of the current key (e.g., String, Array, Boolean, Markdown, Number). To allow translators to modify keys of all types, select the Enable translators to edit translations of all types in advanced project settings.
  - [Plural forms](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-4d5427c1-a8ac-386d-58c9-ad55ce179c95 "Plural Forms (Strings)")

    Allows to view and edit the plural form type (cardinal or ordinal) for the given key directly in the editor.

    ### Important

    Changing the plural type clears existing translations.
- Activity

  - Comments tab

    Select this tab to communicate directly with team members on keys and languages in the project by adding [comments](https://support.phrase.com/hc/en-us/articles/10235050685084#UUID-0036c12b-a2e9-59bf-2724-caf83c35b52e "Comments (Strings)").

    The Comments tab also enables to search and filter comments, add reactions, edit, resolve or delete comments and comment threads.
  - Changes tab

    Change history of a translation.

    To restore a previous version of the translated text, hover over the desired change displayed in the history and click on the ![Restore Previous Version](https://support.phrase.com/hc/article_attachments/30682425835676) icon.
- [Custom metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f)

  If custom metadata properties have been assigned to the project, expand this section to display available properties and add or edit relevant values for each key. Any changes are automatically saved.

  To add or edit custom metadata values of multiple keys at once, use [batch actions](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-4d99c5d9-baab-9885-24ec-578550c2f22e_UUID-1c5f6fcd-a4c6-3b7d-bc8e-e02fd0129e5c "Batch actions").
- [Linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-19c54730-f40d-b447-9944-91f06f10dbb6)

  If linked keys are available in the project, expand this section to display relevant information. Users with required permissions can edit or delete existing links using options in the ![pencil_icon.jpeg](https://support.phrase.com/hc/article_attachments/30682407267996) edit menu:

  - Parent key

    - Link child keys

      Opens a window to edit child keys linked to the parent key.
    - Delete all key links

      Opens a window to unlink all child keys and remove the linked key from the Linked keys page.
  - Child keys

    - Link to another parent

      Opens a window to create a new link by selecting a different parent for the child key.
    - Delete parent link

      Opens a window to unlink the child key from its parent.

  Users with required permissions can also create new linked keys. Click on a key that is not part of an existing link to display the following options:

  - Set as parent key

    Opens a window to create a new link where the parent key is preselected. Selecting child keys already linked to another parent key will override the previous link.
  - Link to parent key

    Opens a window to create a new link where the child key is preselected.

To display additional actions for editing or managing keys, click on the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682438222620) button at the top right of the pane. Upon selection of the key card, these options are available:

- Duplicate key

  Create a copy of the selected key inside the current project.
- Copy key name

  Copy the key name to clipboard.
- Copy link to key

  To get and copy the link to the page currently viewed in the editor.
- Copy key ID

  To copy the key ID to clipboard.
- Delete key

  To delete the selected key, not just its translation.

---

#### Editor Keyboard Shortcuts (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11155549900572-Editor-Keyboard-Shortcuts-Strings  
> Zuletzt aktualisiert: 2026-06-26T06:19:20Z  
> Labels: 2BTr, ar_strings

A set of keyboard shortcuts is available in the Strings editor. Click on Keyboard shortcuts ![Keyboard](https://support.phrase.com/hc/article_attachments/30682426053404) at the top of the editor to open an overview window.

###### Note

A separate set of [keyboard shortcuts](https://support.phrase.com/hc/en-us/articles/11456238064540#UUID-06b9cf5b-f35a-9599-e6a9-61030a29890e) is available to navigate within the Strings application.

Some shortcuts are not available in editing mode.

| Action | Shortcut |
| --- | --- |
| **Saving progress** | |
| Save and next | **Ctrl+Enter** |
| Save | **Ctrl+S** |
| **Managing translations** | |
| Copy source to target | **Ctrl+Shift+O** |
| Review translation | **Ctrl+Shift+R** |
| Mark as ready for review (only available for batch actions) | **Ctrl+Shift+P** |
| Verify translation | **Ctrl+Shift+V** |
| Unverify translation | **Ctrl+Shift+U** |
| Exclude translation (only available for batch actions) | **Ctrl+Shift+E** |
| Include translations (only available for batch actions) | **Ctrl+Shift+I** |
| **Navigation** | |
| Select next key | **ArrowDown** |
| Select previous key | **ArrowUp** |
| Deselect translation or key | **Esc** |
| Edit first target translation of selected key | **Enter** |
| **Searching and filtering** | |
| Open Search | **/** |
| Open Filters | **Shift+F** |
| **Working with keys** | |
| Copy link to key | **Ctrl+L** |
| Add new key | **Ctrl+J** |
| Delete key | **Ctrl+BackSpace** |
| Add to job | **Ctrl+K** |
| Add tags | **Ctrl+B** |
| **Sidebar commands** | |
| View term base | **Ctrl+ArrowUp+G** |
| View translation suggestions (TM) | **Ctrl+ArrowUp+M** |
| View all languages section | **Ctrl+ArrowUp+A** |
| View changes section | **Ctrl+ArrowUp+H** |

---

#### Editor Search Query Formatting (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/17148496405788-Editor-Search-Query-Formatting-Strings  
> Zuletzt aktualisiert: 2025-09-19T11:20:22Z  
> Labels: cadence-dec24

In the Strings editor, users can search for the following entities:

- Content
- [Key](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-36627f11-f180-6aef-5000-581c1517e109) name
- [Tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-e647235a-f7a4-26cf-82ce-f172f3330193)
- [Custom Metadata](https://support.phrase.com/hc/en-us/articles/11405341129628#UUID-21afd27c-d84f-5b2a-405b-ab7523497e2f)
- Uploads
- [Notifications](https://support.phrase.com/hc/en-us/articles/5821056541340#UUID-98d7e39b-454b-7b0b-21a3-37a657f9469f)

Search functionality is available in the [editor key list](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-4d99c5d9-baab-9885-24ec-578550c2f22e "Editor Key List (Strings)") with two methods:

- Search is performed using query language to enable more technical users to create complex queries in a single field.
- Alternatively, the query builder enables to build a complex query by selecting search entities and applicable operators.

  ### Note

  Search by uploads and notifications is not supported in the query builder.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/MzO1TmRy1Ck)

##### Content Search

Content search allows a general search within key content without using a specific keyword.

- Wildcards are supported only at the end of the search term.
- Wildcard queries require a minimum of 3 characters.

| Search Rule | Command | Description |
| --- | --- | --- |
| Contains | content:hello  content:"Hello\*"  content:["Hello\*"] | Finds keys containing "Hello" |
| Does not contain | -content:hello  -content:"Hello\*"  -content:["Hello\*"] | Finds keys not containing "Hello" |
| List | content:[hello,work] | Finds keys content with either hello OR work |
| Equal (case sensitive) | content:"Hello world" | Finds key exactly matching "Hello world" |
| Not equal (case sensitive) | -content:"Hello world" | Finds keys not exactly matching "Hello world" |
| Empty | content:  content:""  content:[""]  -content:"\*" | Finds keys with no content |
| Not empty | -content:  -content:""  -content:[""]  content:["\*"] | Finds keys with any content |
| Starts with (wildcard, case sensitive) | content:"Hello\*"  content:["Hello\*"] | Finds keys starting with “Hello” |
| Multiple filters with AND or OR | content:"lo wo\*" content:["Hello\*","World\*"] | Separate keywords are treated as having AND between them |
| Search for multiple content | content:"Hello\*" content:"World\*" | Separate keywords are treated as having AND between them |
| Advanced filters (contains "X" AND doesn't contain "Y") | content:"Hello\*" -content:["World\*"] | Separate keywords are treated as having AND between them |

##### Key Name Search

Search by key allows to find keys based on their names.

- The same commands and search rules available for content search apply to key search.
- Wildcards are supported only at the end of the search term.
- Wildcard queries require a minimum of 3 characters.

###### Important

The table below provides a selection of example commands. For a comprehensive list, refer to [content search](https://support.phrase.com#UUID-43391ca3-bca4-c90d-daa4-75f813149815_UUID-df6be53d-2b9b-076a-8864-96b90a1ab5c4 "Content Search").

| Search Rule | Command | Description |
| --- | --- | --- |
| Contains | key:hello | Finds key names containing "Hello" |
| Does not contain | -key:hello | Finds key names not containing "Hello" |
| Empty | key:"" | Finds keys without name |
| Not empty | -key: | Finds keys with any name |
| Starts with (wildcard, case sensitive) | key:"Hello\*" | Finds keys with name starting with “Hello” |

##### Tag Search

Search by tag allows finding keys based on the name of their associated tags.

Exclusions and queries with AND operator are not supported.

| Search Rule | Command | Description |
| --- | --- | --- |
| Contains | tag:tag1 | Finds keys having tag1 |
| OR operator | tag:tag1 tag:random-tag  tag:[tag1,tag2] tag:random-tag | Finds keys having either tag1 or random-tag  Finds keys having either tag1 or tag2 or random-tag |

##### Custom Metadata Search

Custom metadata search allows searching by custom metadata properties and values.

- Numbers, Date and Boolean types work only as exact matches.
- Excluding key custom metadata values is not supported.
- Custom metadata property with multiple words in the name must be put in quotation marks "". Example: `custom_metadata:"Copy status":Approved`
- Wildcards are supported only at the end of the search term.
- Wildcard queries require a minimum of 3 characters.

| Search Rule | Command | Description |
| --- | --- | --- |
| Contains | custom\_metadata:Scene:Intro  custom\_metadata:Scene=Intro | Finds keys with custom metadata Scene whose value contain "Intro" |
| Equal (case sensitive) | custom\_metadata:Scene:”Intro” | Finds key with custom metadata value exactly matching "Intro" |
| Empty | custom\_metadata:Scene:””  custom\_metadata:Scene:null | Finds keys having custom metadata Scene with no value |
| Starts with (wildcard, case sensitive) | custom\_metadata:Scene:Int\* | Finds keys with custom metadata Scene starting with “Int” |
| Multiple filters with AND or OR | custom\_metadata:Scene:"credits" custom\_metadata:Scene:["intro","ending"] | Separate keywords are treated as having AND between them |
| Search for multiple content | custom\_metadata:Scene:[intro,"credits"] | Finds keys having custom metadata Scene with values either `intro` or `credits` |
| Advanced filters (contains "X" AND doesn't contain "Y") | custom\_metadata:Scene:"intro" custom\_metadata:Scene:"credits" | Separate keywords are treated as having AND between them |
| Date values search | custom\_metadata:date\_cmname>DD-MM-YYYY  custom\_metadata:date\_cmname>=MM/DD/YYYY  custom\_metadata:date\_cmname<DD-MM-YYYY  custom\_metadata:date\_cmname<=DD-MM-YYYY |  |
| Boolean values search | custom\_metadata:bool\_cmname=t  custom\_metadata:bool\_cmname=1  custom\_metadata:bool\_cmname=true  custom\_metadata:bool\_cmname=yes |  |

##### Upload Search

Search by upload allows finding keys by upload IDs (e.g. 1dc43701212191febc38d45a011d9bb3).

Upload search works only as an exact match. Exclusions are not supported.

| Search Rule | Command | Description |
| --- | --- | --- |
| Equal | upload:"someUploadID" | Finds keys with upload ID exactly matching |
| List | upload:["UploadID2","UploadID3"] | Finds keys with either UploadID2 OR UploadID3 |
| Multiple filters with AND or OR | upload:"UploadID1" upload:["UploadID2","UploadID3"] | Separate keywords are treated as having AND between them |
| Search for multiple uploads | upload:"someUploadID" upload:"otherUploadID" | Separate keywords are treated as having AND between them |

##### Notification Search

Notification search allows finding keys by searching for a specific notification code.

Only exact matches are supported.

| Search Rule | Command | Description |
| --- | --- | --- |
| Equal | notification:"someNotificationCode" | Finds keys exactly matching the notification code |

##### General Search Rules

The main format for queries is `search_entity:search term`.

Not all commands apply to every search entity.

In the query builder, the *Contains (in)* and *Does not contain (not in)* operators use the **|** (pipe symbol) as a divider between multiple search terms.

| Search Rule | Command | Description |
| --- | --- | --- |
| Contains | search\_entity:term | Finds partial matches |
| Does not contain | -search\_entity:term | Excludes partial matches |
| List - Contains | search\_entity:[term1,term2,term3] | Lists search with inner OR operator |
| List - Doesn't contain | -search\_entity:[term1,term2,term3] | Excludes terms as list with inner OR operator |
| Equals | search\_entity:"term" | Finds exact search matches |
| Empty | search\_entity:"" | Searches for empty values |
| Not empty | -search\_entity:"" | Find keys with values |
| AND | space | Combines queries with AND operator |
| Starts with | search\_entity:term\* | Finds all keys where the respective entity starts with "term".  The search term must be at least 3 characters long. |

---

## Translation Management

Quelle: https://support.phrase.com/hc/en-us/sections/5784132729244-Translation-Management

### Phrase Strings Limits

> Quelle: https://support.phrase.com/hc/en-us/articles/8548271212188-Phrase-Strings-Limits  
> Zuletzt aktualisiert: 2026-07-23T06:17:45Z  
> Labels: 2BTr, File size

#### File Size Upload Limits

- Maximum import size for one translation file during upload: 200MB

  - Gzip archive (.gz): 200MB (compressed size)
- Maximum screenshot size: 10MB
- In projects with more than 10,000 keys, unmentioned keys will not be calculated in further uploads.

#### Content Size Limits

- Max characters per translation: theoretical limit is 4,294,967,295 characters
- Max characters per key name: 65,535 characters
- Max characters per translation key description field: 65,535 characters
- The maximum number of keys allowed in a job is 10,000

#### Job Automation Limits

- Automations per project:

  - 1 upload automation
  - 1 scheduled automation
- Max. number of keys per project: 500,000
- Max. number of keys per job automation: 10,000

  - Jobs exceeding the limit will be split into multiple jobs.
- Max. upload size: 100,000 keys
- Max. number of tags per automation: 50

#### API Limits

**Rate Limit**

4 parallel requests per user.

Limits for the maximum number of requests per user every 5 minutes:

| Plan | Limit |
| --- | --- |
| Starter | 100 |
| Freelancer (LSP) | N/A |
| Team/Professional (LSP) | 500 |
| Business/Business (LSP) | 1000 |
| Enterprise/Enterprise (LSP) | Custom |

**Async Requests**

Certain time-consuming actions in Phrase run asynchronously. These include creating new [branches](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)"), [uploading files](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9 "Uploading and Downloading Localization Files (Strings)"), downloading locales asynchronously, and similar operations.

The API responses for these resources usually contain a `state` or `status` field, which can be used to track the progress of the request and determine when the action has been completed.

#### Search Limits

- Results are limited to 10,000 results if full text or state filtered search is used.
- A maximum of 65,536 keys can be returned when searching for tags, custom metadata, notifications, or uploads.
- The maximum number of allowed keys in an array for search is 1,024.
- A minimum of 3 characters is required for wildcard searches.
- A maximum of 5 search values is allowed per IN and OR queries.
- For both search and query builder, a single query can include a maximum of:

  - 3 tag entities
  - 3 content entities
  - 3 key entities
  - 3 custom metadata entities
  - 3 upload entities
  - 3 notification entities
- A maximum of 3 fields for each search entity can be added in the query builder.

#### Over-the-Air (OTA) Limits

- Requests for native SDK and Web

  | Plan | Limit |
  | --- | --- |
  | Starter | 500,000 |
  | Freelancer (LSP) | N/A |
  | Team/Professional (LSP) | 2,500,000 |
  | Business/Business (LSP) | 25,000,000 |
  | Enterprise/Enterprise (LSP) | Custom |
- MAU for mobile

  | Plan | Limit |
  | --- | --- |
  | Starter | 10,000 |
  | Freelancer (LSP) | N/A |
  | Team/Professional (LSP) | 50,000 |
  | Business/Business (LSP) | 500,000 |
  | Enterprise/Enterprise (LSP) | Custom |

#### Machine Translation Limits

- Machine-translated characters

  | Plan | Limit |
  | --- | --- |
  | Starter | 10,000 |
  | Freelancer (LSP) | N/A |
  | Team/Professional (LSP) | 1,000,000 |
  | Business/Business (LSP) | 1,000,000 |
  | Enterprise/Enterprise (LSP) | Custom |

#### Editor Limits

**Search list limitations**

- 10 000 keys are returned by search in pages of 10.
- Basic search: Tag suggestions return 25 first matching based on query after `tag:` (not paginated).
- Advanced search: Tag suggestions return 25 first matching based on query (not paginated).

**Locale selector limitations**

- Shows all locales in the project.

**Workspace limitations**

- All locales can be selected and will be shown in a key card.
- Continuous workspace is scrollable until search results end (10 000 keys).
- Continuous workspace is available when less than 5 target locales are selected.

  - If 5 or more target locales are selected, single key view is forced.

**Project overview context page**

- Shows 5 draft or in progress jobs.

**Job overview context page**

- Shows only 25 first target locales of the job.
- Shows only 25 first assigned to people.
- Shows only 25 first reviewers.

**Key overview context page**

- Shows only 1 MT suggestion.
- Shows only 25 first TM suggestions.
- Shows only 25 first draft or in progress jobs of the key.

**Batch actions**

- Can take some time to process in busy hours.
- Batch actions that select every key are done async while incomplete selections are done sync.

#### Limits for legacy pricing plans

##### Rate Limit

- 4 parallel requests per user.

Limits for the maximum number of requests per user every 5 minutes:

| Plan | Limit |
| --- | --- |
| Basic | 100 |
| Advanced | 1000 |
| Enterprise | Custom |

##### Over-the-Air (OTA) Limits

- Requests for native SDK and Web

  | Plan | Limit |
  | --- | --- |
  | Basic | 50,000 |
  | Advanced | 1,000,000 |
  | Enterprise | Custom |
- MAU for mobile

  | Plan | Limit |
  | --- | --- |
  | Basic | 50,000 |
  | Advanced | 1,000,000 |
  | Enterprise | Custom |

##### Machine Translation Limits

- Machine-translated characters

  | Plan | Limit |
  | --- | --- |
  | Basic | N/A |
  | Advanced | 1,000,000 |
  | Enterprise | Custom |

---

### Spaces (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784094645916-Spaces-Strings  
> Zuletzt aktualisiert: 2026-06-01T12:43:12Z  
> Labels: Project Manager, 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Spaces provide an organizational structure for projects. Spaces can be created for project types, specific people or groups, platforms or anything else that helps with viewing many projects.

The creator of a space is the initial space owner but this can be changed by Administrators from the dropdown list beside the name of an open space. Space owners can add or remove users from a space.

Users and glossaries can also be applied to spaces so that any projects included in that space share those resources.

#### Create a Space

To create a space, follow these steps:

1. Click ![Add New](https://support.phrase.com/hc/article_attachments/30682413309084) at the top of the Spaces column.

   The Create new space window opens.
2. Provide a name for the space.
3. Click Create new space.

   The new space is added to the column.

Projects can be added to or removed from spaces by either drag and drop, clicking on the space name to open the Add projects to the new Space pane or from the More menu. Spaces can be renamed from the More menu.

---

### Projects (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784094677404-Projects-Strings  
> Zuletzt aktualisiert: 2026-06-01T12:43:12Z  
> Labels: Project Manager, 2BTr, ar_strings

Projects are where the main components of a translation project (jobs, translation memories, and term bases) are held together. Before files can be assigned for translation as a job, they must be assigned to and contained within a project.

Assigned projects are listed under the Projects tab on the profile page and can be filtered by space.

Depending on team structure, projects can be defined by product or by platform. Use a single project if all team members require access.

#### Project Page

Opening a project presents it in a project page.

From the project page, all project details can be viewed and edited. All comments, tags, keys and uploads are also presented.

#### Create a Project

To create a project, follow these steps:

1. From the Projects page, click New project.

   The Add project window opens.
2. Provide a name for the project.
3. From the dropdown lists, select a Main format and Main technology from the dropdown lists.
4. Provide a Point of contact from the dropdown list.
5. Click Save.

   The project is added to the profile.

These settings (i.e. the project name, main format, or point of contact) can be changed on the General tab of Project settings accessed from the More menu.

Existing projects can be duplicated by selecting Duplicate project from the More menu on the Projects page. The duplicated project uses the main [file format](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc) of the original. If that format does not support [pluralization](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-46fb5ff5-b818-e993-4ecc-bbd777eea828) by default, pluralization is unavailable. If no main format is defined, the .CSV format is used by default, with pluralization disabled.

#### Define a Project

##### Add Languages

The minimal definition for a project are the source and target languages. These are the original language of texts and the languages it will be translated into and are initially defined in the project setup.

To set up further languages, follow these steps:

1. Hover over a project and click Languages.

   The Languages tab opens.
2. Click Add language. The Add language window opens.
3. From the General tab, provide a language name and language code (locale).
4. From the Advanced tab, select a source language from the dropdown list.
5. From the Review tab, select review options.
6. Click Save.

   Language is added to that project.

More languages can be added by clicking Add language ![Add a Language](https://support.phrase.com/hc/article_attachments/30682424253340) in the Languages tab, and can be edited from the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682413449244) menu by selecting ![Edit](https://support.phrase.com/hc/article_attachments/30682459073948) Edit language.

#### Set Variables

Bits of information and flags can be stored in project variables. Variables are set and can be managed via the Translation center and API. Integrations can use project variables to configure workflows of toggle specified behavior.

Variables are typically accessed in scripts via the API. Like environment variables, the value of a project variable is represented as a string, so type must be specified (e.g. boolean, integer).

Example 1

- A client has different project types (marketing and product). They set the variable `content_type: marketing`.
- The integration script reads the variable to decide how to proceed with that project (e.g., push it through different QA checks).

Example 2

- A client works with Phrase Strings and a CMS. They add the variable `template_id: 8734-ABCD` .
- The integration script reads the variable and fetches the correct template from the CMS when publishing localized content.

Variables can only be set by Administrators and are defined in the Variables tab of the Project settings window.

To set a variable, follow these steps:

1. From a project page, open the Project settings window from the More dropdown list.
2. Open the Variables tab.
3. Provide a name for the variable and a value.

   Ideally, names should be similar to environment variables such as `MY_VAR` and must be unique per project.
4. Click Add variable to add more variables and click the ![Remove Variable](https://support.phrase.com/hc/article_attachments/30682413524252) icon to remove them.
5. Click Save.

   The window closes and variables are saved.

#### Maintain Multiple Strings Projects for one Localization Project

As software projects grow and become more complex it helps to split them into modules to keep things manageable. Limiting the scope of projects by splitting the translations into smaller categories such as *frontend* and *backend* can help with this management.

##### Example maintenance workflow

1. Create Strings projects. As per example, project *Frontend* and project *Backend*.
2. Create source locale files corresponding Strings projects.
3. Create a [configuration file](https://support.phrase.com/hc/en-us/articles/5784118494492#UUID-990abb57-f2cd-21c2-286b-66495afac0fa) that includes the locations of the source locale files in the project and match them to the corresponding Strings projects:

   ```
   phrase:
     access_token: "3d7e6598d955bfcabaf1b9459df5692ac4c28a17793"
     file_format: yml
     push:
       sources:
       # frontend
       - file: ./path/to/locales/frontend/en.yml
         project_id: "5c05692a2a995c0c45c0c3cbfcab1"
         params:
           locale_id: "159d48e76802f789d9b8fb6d368e61bc"

       # backend
       - file: ./path/to/locales/backend/en.yml
         project_id: "0c45c0c3cbfcab15c05692a2a995c"
         params:
           locale_id: "fb6d368e61bc159d48e76802f789d9b8"
     pull:
       targets:
       # frontend
       - file: ./path/to/locales/frontend/<locale_name>.yml
         project_id: "5c05692a2a995c0c45c0c3cbfcab1"

       # backend
       - file: ./path/to/locales/backend/<locale_name>.yml
         project_id: "0c45c0c3cbfcab15c05692a2a995c"
   ```

##### Providing a config via --config flag

By default, the CLI will try to use a file called `.phrase.yml` on the same level at which Phrase is run. To support more complex workflows, use multiple configuration files for different purposes.

To force the CLI to use a configuration file for certain commands, supply the corresponding `.yml` file via the `--config` flag:

```
$ phrase push --config ./path/to/config.yml
```

---

### Jobs (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784100517788-Jobs-Strings  
> Zuletzt aktualisiert: 2026-08-19T06:19:11Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

#### Available for

- All paid plans

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

A job represents a file for translation into a specified target language(s).

If a single file is to be translated from a source into two target languages, it is represented by two jobs:

- **Job 1**

  Translation of the file into English.
- **Job 2**

  Translation of the file into Italian.

In Strings, multiple languages may be contained with one job.

Jobs can be viewed under the Jobs tab on a project page. Clicking on a specific job presents the status of the jobs with options for editing, duplicating, commenting on or deleting the job.

Use the options at the top of the list to search for a job by name, to filter jobs by involved users and status, or to change sorting order.

Translation progress is also presented under the Jobs tab and if complete, an .XLIFF or custom file format of the job can be downloaded.

The number of source words displayed in the job statistics is calculated based on the job’s [default language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)"), not the source language.

#### Job status in the translation workflow

Once a job is [created](https://support.phrase.com#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738_UUID-c70492a3-90b5-c26c-a32e-e3350246b924 "Create a String Management Job"), it progresses through the following statuses as part of the translation workflow:

1. Draft

   A newly created job remains in draft status until it is started from the Jobs tab on a project page.
2. In progress

   A job is in progress once it is started. This status indicates that the translation process for the included keys has started.

   ### Important

   When keys are part of jobs in progress, it is crucial not to modify their content. Changing the content of keys while they are actively being translated can lead to inconsistencies in translations.

   Not all target languages may be included in the translation process. To confirm which languages are part of the job in progress, check the job details.
3. Completed

   The job is marked as completed from the Jobs tab on a project page. This status indicates that the job is still accessible for review and download, but cannot be edited further.

   If additional changes are required, a completed job can be reopened and moved back to the In progress status.

   If the Auto-complete job option is enabled in the Advanced project settings, the job is marked as completed automatically once all defined [workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") steps are finished across all target languages. Automatic completion applies to both manually completed jobs and jobs completed through automated processes (e.g., [pre-translation](https://support.phrase.com/hc/en-us/articles/5822187934364#UUID-55adb404-b991-7320-537c-8162f9fe7c11) or job automations).

#### Create a String Management Job

To create a job, follow these steps:

1. From the Jobs tab of a project, click New job or if using an existing [template](https://support.phrase.com/hc/en-us/articles/7629216795036#UUID-6327676a-0940-1dff-5310-8fb11800ce82 "Job Templates (Strings)"), click Use template from the Templates tab.

   The Create a new job page opens.

   ### Note

   Using organization templates to create a new job may require adding other users and languages manually to the project.
2. Provide a name for the job and select an owner from the dropdown list.
3. Optionally, provide a due date, briefing, and ticket URL.
4. Add [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") or [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-c0b7ebe8-3c26-b066-abfd-a86fab1026b4 "Tags (Strings)").

   ### Note

   Key selection is limited to 10,000 keys at a time. Keys must belong to the same project.

   The key list can be filtered out through the following options:

   - To display only keys without tags, type **-tag:**. This allows to exclude tagged keys from multiple jobs and focus only on those which are relevant for the new job.
   - Type **job:false** to exclude keys that are part of an active job.
   - Type **job:true** to display only keys from jobs that are in progress.
   - Type **created\_at:>=yyyy-mm-dd** to display only keys created since selected date (e.g. `created_at:>=2023-06-01`)
5. Add required languages and assign a translator for each language.

   Use the Users tab in the dropdown to select single users. Use the Teams tab to select a group of users.
6. Optionally, check Save as template and choose to create either a project-based or an organization template.

   Templates can also be created by clicking the ![Add New Template](https://support.phrase.com/hc/article_attachments/30682413589148) button in the Templates dropdown on the Jobs tab of a project or in the main Jobs page.
7. Click Continue.

   New job is presented in the Jobs tab.

#### Automate Job Creation

Automated job creation allows defining rules and triggers to automatically identify translation-ready keys, create jobs and start them without manual input.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/BKjE2J6lsUQ)

Job automations can be set up and managed in the Job automations tab of the Jobs page to help streamline localization workflows and reduce repetitive tasks.

- Keys already included in existing jobs (draft or in progress) are skipped to avoid duplication.
- If a project exceeds the [job automation limits](https://support.phrase.com/hc/en-us/articles/8548271212188#UUID-c823465f-c930-29db-2a5a-899fb000abc7 "Phrase Strings Limits"), the automation creation is blocked, or the automation transitions to the Error status.
- Job automations in [branch projects](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)") are not supported.
- If a file is uploaded to a completed job and no translations have changed, a new job will not be created.
- If using the [Figma](https://support.phrase.com/hc/en-us/articles/5819515701916#UUID-c9c6bc21-3921-38e5-4339-93578f6782d7) plugin with the option Upload Figma preview enabled, active job automations in the same project will be skipped to avoid duplicate jobs.
- For jobs created through automation on accounts with mandatory due dates enabled, the translation due date is set to 7 days and the review due date to 14 days by default.

**Access requirements**

- [Owners and Admins](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) can view and manage automations for all projects.
- Project Managers can view and manage automations for projects they own or are assigned to.
- Developers can view and manage automations for projects they have access to.
- Translators, Designers and Guests do not have access to job automations.

To create a job automation, follow these steps:

1. Click the plus ![ModernMT_Plus.png](https://support.phrase.com/hc/article_attachments/30682444776476) button in the Job automations tab.

   The Add automation window is displayed.
2. Provide a Name and select the target Project.
3. Select the Job owner.

   - The selected job owner will be always assigned as the owner of every job created by the automation, regardless of whether the automation uses a job template.
   - If the job owner is deleted while a batch of jobs is being created, job creation may partially fail and the automation is automatically disabled.
4. Optionally, select a [Job template](https://support.phrase.com/hc/en-us/articles/7629216795036#UUID-6327676a-0940-1dff-5310-8fb11800ce82 "Job Templates (Strings)") to use default settings for the job.

   - Jobs created through automation will inherit the job template configuration and start in the In Progress state.
   - If the job template has a Source language defined, automated jobs use that source locale instead of the project default locale.
   - If no template is applied, jobs are created in Draft state.
5. In the Keys field, select one or multiple statuses to filter keys by:

   - Untranslated
   - Unverified
   - Ready for review
6. Optionally, select Tags to filters keys by.

   - Only custom [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-c0b7ebe8-3c26-b066-abfd-a86fab1026b4 "Tags (Strings)") are supported.
   - There is a limit of 50 tags per automation.
7. Select the Trigger event type for the job automation:

   - Import

     The automation runs each time a file is uploaded to look for matching keys in the imported file.

     The naming convention for created jobs will be `[filename + timestamp]`. For [Figma](https://support.phrase.com/hc/en-us/articles/5819515701916#UUID-c9c6bc21-3921-38e5-4339-93578f6782d7) imports, the naming convention is `[Pagename + TimeStamp]`.
   - Schedule

     Set a frequency and time zone for running a scheduled automation.

     The naming convention for created jobs will be `[project name + timestamp]`.

     - For more precise scheduling, select Custom (cron) in the Create job every field. Enter a standard [Cron](https://en.wikipedia.org/wiki/Cron) expression to define exactly when the automation runs.

       A live preview is displayed below the input so the schedule can be verified before saving.

       ### Note

       Cron expressions used in job automations follow a standard 5-field format: `minute hour day-of-month month day-of-week`.

       Expressions support the asterisk (`*`) for "every", commas (`,`) for lists, hyphens (`-`) for ranges, and slashes (`/`) for step values (e.g., `*/15` for every 15 minutes).
8. If required, select Create jobs only for updated languages.

   When enabled:

   - For existing keys, jobs are created only for target languages where translations have changed since the last run. New keys are treated as updates as a whole.
   - For scheduled automations, the first run uses all project or job-template languages to establish a baseline. Starting with the second run, only updated languages are included.
   - This option can be used with all trigger types.
9. Click Save.

   The job automation is listed in the Job automations tab with Inactive status.
10. Select Start automation from the relevant ellipsis ![More Menu](https://support.phrase.com/hc/article_attachments/30682444793116) menu to activate the job automation.

    The automation is displayed with Active status.

Use the dedicated options in the ellipsis ![More Menu](https://support.phrase.com/hc/article_attachments/30682444793116) menu of existing job automations to edit, start or stop, and delete an automation. Active scheduled automations can be manually triggered anytime by using the option Run automation now.

##### Note

Job creation does not trigger [pre-translation](https://support.phrase.com/hc/en-us/articles/5822187934364#UUID-55adb404-b991-7320-537c-8162f9fe7c11). Pre-translation is configured at a project level and is triggered by new uploads, new keys, or new languages being added to the project.

##### Assign an Automation to Multiple Projects

###### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

A single job automation can be assigned to up to 10 projects simultaneously, reducing repetitive setup across a large project portfolio.

When creating a job automation, select the desired projects in the Add automation window.

The following applies when multiple projects are selected:

- The Job owner list is filtered to users who have access to all selected projects.
- Only organization-wide templates are available in the Job template field.
- Tags are not available.

##### Add Multiple Automations to a Project

###### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

A single project supports up to 5 independent job automation configurations running simultaneously. Each automation has its own trigger, source language, and job template, and all run independently on the same project content.

Automations on the same project do not block each other. The same keys can be picked up by multiple automations. For example, one automation can cover English to French, another English to French, Italian, and German, and a third French to German. All three fire on the same project at the same time.

Each automation excludes keys that are part of ongoing jobs created by that same automation, identified by its automation ID, as well as keys that are part of manually created jobs.

If an automation's settings are updated, the new settings apply from the next run. Jobs already in progress continue to be excluded.

##### Note

The **automation ID** is displayed in the Job automations tab and can be copied from there.

##### Events

###### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

The Events log tracks activity for each job automation and is accessible from the three dots menu of any automation via View events.

The Events table displays the following details for each event:

- State: Success, Failure, or In progress
- Triggered: Upload, Manual, or Scheduled
- Created at
- Jobs: whether a job was created, with a link to the job if applicable
- Project: the project the automation ran on
- Details: list of errors detected, if any

The automation ID is displayed in the automation list and can be copied from there.

Auto-created and manually created jobs can be filtered separately in the Global Jobs list.

#### Set Job Annotations

Job annotations provide a way to attach extra information to individual jobs or job [locales](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)"), such as workflow flags, integration data, or other metadata. Integrations (e.g. [Job Sync](https://support.phrase.com/hc/en-us/articles/5709647502620#UUID-776d5a52-a0f8-d5c1-10b7-60bb343ef950)) can use job annotations to configure workflows or synchronize data with other systems.

Annotations are stored as key–value pairs and can be managed via the job details page or the [API](https://developers.phrase.com/en/api/strings/introduction).

To add job annotations, follow these steps:

1. In the Jobs tab of a project, click on one of the available translation jobs.

   The job details page is displayed.
2. Click Annotations at the top of the page.

   The Manage job annotations window is displayed, with a list of any existing annotations.
3. Click Add job annotation to display the input fields.
4. Enter the Job annotation name and Value.

   Annotation names must be unique.
5. If required, repeat steps 3 and 4 to add multiple annotations to the same job.
6. Click Save to confirm changes.

Existing annotations can be edited or deleted in the Manage job annotations window.

Job language annotations are set up and managed by clicking the corresponding Annotations button next to the desired language at the bottom of the job details page.

---

### Keys (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784119185436-Keys-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:20:50Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

Keys are used to identify translatable text strings within software code. This allows the use of a key (as a code name for a translatable string) to be referenced only once by Phrase instead of for each required translation of the string.

A key can have multiple translations associated with it, each corresponding to a different [language locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") of the project. The function is similar to that of the primary key in relational databases with the translations being an attribute of the key. Keys are stored in resource files and are used to identify source and target languages.

The use of keys allows localization management platforms to present translatable text to translators without having to present code.

Keys do not normally need to be added to a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") as they are ideally created when a resource file is uploaded through the Languages tab of a project page.

To prevent keys from being uploaded or created, use the [blocking key](https://support.phrase.com#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938_UUID-9cbc5d8c-1ded-ff2b-4023-1527abc28d22 "Blocked Keys") functionality. If a blocked key already exists, it cannot be translated in the editor.

To exclude keys from export, use the [exclude keys](https://support.phrase.com#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938_UUID-832a4c49-5a96-b278-053a-14eb716197c4 "Exclusions") functionality. Excluded keys also cannot be translated in the editor.

Keys in a project can be duplicated by selecting More/Duplicate key in the Keys section of a project page or at the top of the [Strings editor pane](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-58dd82f7-8f41-1868-27b3-0190ffad0d29).

Different translation keys with the same values across one or multiple projects can be linked to automate content updates. [Linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-3b57fe95-88d5-b019-e956-f22c96647518 "Linked Keys (Strings)") are used to ensure consistency across projects and eliminate repetitive work on identical content.

Changes to keys can be reverted from the [sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29) activity window in the Strings editor.

##### Note

When working with repositories (GitHub, GitLab, etc.) and deleting keys, the keys must be deleted from both Phrase and the repository to be permanently deleted. This is to prevent the accidental deletion of keys due to errors or accidents in either Phrase or the repository.

#### Key Types

In Strings, keys can be of different types depending on the format of the uploaded file:

- String (default)

  ### Note

  Translators can only edit string keys unless the Enable translators to edit translations of all types option is enabled in advanced [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") settings.
- Array
- Boolean
- Markdown
- Number

The key type is displayed in the Meta section of the [editor sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29).

#### Key Naming

Keys names must be unique within one project.

There are a multiple strategies for naming keys:

- Descriptive

  The original text is identified by function. This may make it harder to identify the text when reading code, but will remain a constant.

  **Example:**

  | Key | German | English |
  | --- | --- | --- |
  | fem\_char | die Frau | woman |
  | male\_char | der Mann | man |
- Source strings (not recommended)

  The original text itself is used as the key which making it easy to identify the use of the text. This is problematic as if the original text changes, it breaks the relationship with the translations.

  **Example:**

  | Key | German | French |
  | --- | --- | --- |
  | Dog | Hund | Chien |
  | Cat | Katze | Chat |

#### Creating Keys

If keys are not uploaded, they can be created manually.

To create a key, follow these steps:

1. From the Keys tab, click Add key.

   The Add key window opens.
2. From the General tab, provide a Name, Description , any available Tags and a Default translation.
3. If required, enable [plural forms](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-46fb5ff5-b818-e993-4ecc-bbd777eea828) from the Plural forms tab and choose the plural form type.
4. Select excluded languages from the Excluded tab if required.
5. Provide technical details in the Advanced tab if required.

   For example, it is possible to set a character limit for translations in the Max. Characters field. If set, the character limit is displayed by an indicator in the [Strings editor](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-58dd82f7-8f41-1868-27b3-0190ffad0d29) when editing the translations of the relevant key.
6. Click Save.

   The key is added to the project and can be viewed on the Keys tab.

Deleting a key from the editor or the Keys tab will delete all associated translations of that key and cannot be reversed.

In projects with more than 10,000 keys, unmentioned keys will not be calculated in further uploads. Unmentioned keys are keys that are not included in the current upload but still exist in the project.

#### Blocked Keys

Blocking prevents whole keys from being added to a project; if the name of a blocked key appears in an uploaded file, that key is omitted and not added to the project.

Blocking is used to omit keys from a project so they are not managed at all.

Typically blocked keys:

- Date and time format strings.
- Keys including configurations.
- Keys causing issues when managed with the Phrase gem.

Manage blocked keys in a separate language file that is not processed or maintained.

##### Problematic keys

These keys can cause problems and if used should be blocked when a project is created.

- `activemodel.errors*`
- `number.format*`
- `number.currency*`
- `number.percentage*`
- `datetime.prompts*`

##### Blocking a Key

To block a key, follow these steps:

1. From a project page, select the Blocked keys tab.
2. Click Add key to the blocked keys list.

   The Add key to the blocked keys list window opens.
3. Provide a name for the key or a [regular expression (regex)](https://support.phrase.com/hc/en-us/articles/5709636670364#UUID-fecec79b-8d0e-daaa-3327-8435094210ec) and click Save.

   The key is added to the list.

   ### Tip

   AI chatbots can be very effective at generating and verifying regex.

   Use tools like [Regex101](https://regex101.com/) to test regex with different inputs.

Keys can be later modified by clicking ![Modify](https://support.phrase.com/hc/article_attachments/30682492544156) or deleted ![Recycle Bin](https://support.phrase.com/hc/article_attachments/30682492572572).

#### Exclusions

Some keys may need to be excluded from certain languages and can be marked as being excluded. These keys are uploaded and exist within a project, but are ignored.

Excluded translations are:

- Excluded from export of the related language.
- Excluded from the related language reports.

  If the content is empty it is not counted as untranslated.
- Visible but not editable in the translation editor.

Excluded translations are omitted from translated/untranslated counts and language reports. As a result, a project or locale can show 0 untranslated strings even when excluded translations are still missing a real translation. This includes blank content or an untranslated copy of the source text. To confirm a project is truly complete, check the Excluded tab or query translations with `excluded:true` via the API, in addition to the untranslated count.

Exclusion options:

- Exclude a single translation in a language within the translation editor.
- Exclude multiple translations in a language within the translation editor.
- Exclude multiple translations by selecting the languages when creating or editing the key.

##### Excluding keys

To exclude a key, follow these steps:

1. From the keys page, click ![Modify](https://support.phrase.com/hc/article_attachments/30682492544156) for the key requiring exclusion.

   The Edit key window opens.
2. Select the Excluded tab.
3. Select languages for exclusion.
4. Click Save.

   The selection is excluded in the specified key.

Keys can also be excluded individually or in bulk from the [editor key list](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-9e47df02-c977-1821-8bf4-7822442257c6) by selecting the key(s) and using the Update status menu.

---

### Linked Keys (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/12949643568412-Linked-Keys-Strings  
> Zuletzt aktualisiert: 2026-09-28T06:27:40Z  
> Labels: 2BTr, edited_at

#### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Key linking allows to establish a link between two or more translation [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") across different projects to prevent repetitive translations and reviews on identical content.

Linking keys with [plural forms](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-46fb5ff5-b818-e993-4ecc-bbd777eea828) is only possible if both the parent and the child keys support plural forms. Changing the plural form configuration of linked keys removes the existing link.

Keys are linked through a parent-child relationship:

- Parent key

  The key that users establish a link to. Whenever the parent key's value changes, any linked child keys are automatically updated based on the parent's content and state.

  Users can edit the content and state of a parent key only in the [Strings editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).
- Child key(s)

  The key that links to its parent and is automatically updated whenever its parent changes.

  Upon link creation and on parent key update, the state of child keys is inherited from the parent key, as per the [translation workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") that has been configured for the child keys:

  - Parent key is *verified*/*translated*/*reviewed*

    Child keys are set to *translated* (basic workflow) or *reviewed* (advanced workflow).
  - Parent key is *unverified*/*ready for review*

    Child keys get *unverified*.

  ### Note

  Parent key translations are distributed to child keys only for languages existing both on the parent and the child keys.

  A child key cannot be updated on its own as long as it is linked to a parent key.

  The child key's word count equals to the parent's key word count. Any character limit set for the child keys is ignored.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/OMPQhpOw_Ok)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

Different [user roles](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) can access linked keys using the [Linked keys](https://support.phrase.com#UUID-3b57fe95-88d5-b019-e956-f22c96647518_UUID-54e81afd-3558-fcfc-edf4-460106076365 "Linked Keys Page") page and the Strings editor based on their specific permissions:

- Owners and administrators have full access to create, edit and delete linked keys. They can also update parent key content in the Strings editor.
- PMs can create, edit and delete only their own linked keys in assigned projects.
- Developers, designers and translators can [display linked keys](https://support.phrase.com/hc/en-us/articles/11155517930268#UUID-58dd82f7-8f41-1868-27b3-0190ffad0d29), their metadata, and update parent key's content in the Strings editor for projects they have access to.
- Guests can only view linked keys of their assigned projects in the Strings editor.

**Use Cases**

- Same product content distributed across different platforms, such as Android, iOS, Web, and Desktop

  Linked keys can help synchronize updates or changes made to content on one platform across all others automatically.
- Content updates managed between different versions

  Using one project as a parent with one or multiple child projects to link the keys with can help maintain changes to all or a subset of keys from one project.
- Same product content distributed across different countries, departments, markets

  By establishing links between parent projects and the projects distributed across different countries, departments or markets, changes are managed from one place to ensure consistent messaging and information.

#### Linked Keys Page

The Linked keys page is accessible by selecting Linked keys from the left-side navigation panel.

Parent and child keys are presented in a table with relevant information:

- The status icon next to a parent key refers to the translation status of the parent's default [locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)").
- Hovering over a key name displays its project and [space](https://support.phrase.com/hc/en-us/articles/5784094645916#UUID-4de81840-0f09-4803-ad34-68891bc7c6fb "Spaces (Strings)").
- Clicking on a linked key opens the View link window to preview the link.

###### Search and Filter Linked Keys

Use the search field at the top of the page to filter the list of parent keys by name or by their source content.

To filter parent keys based on their translation status, click on the Status dropdown menu and select one or multiple states.

To display only keys from specific projects, click on the Parent projects or Child projects dropdown menu and select one or multiple projects to filter the list of parent keys or child keys respectively.

Use the Space filter to display only keys belonging to a certain space. Filtering keys by space overrides any additional search filter applied to the list.

###### Add Linked Keys

Linked keys can only be added by:

- Owners
- Admins
- Project managers (in assigned or own projects)

To add a new linked key, follow these steps:

1. Select + New link at the top right of the Linked keys page.

   The Create new link window is displayed.

   Linked keys can also be created in the [sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29) of the Strings editor.
2. Start typing the parent key name or content and select it from the dropdown list.

   - Only keys from the main [branch](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)") are presented.
   - Existing linked keys cannot be selected. Optionally, enable the Hide existing linked keys option to hide existing parent and child keys from the list.
   - Searching by key content applies to default locale only.
3. Select the child keys using the Link child keys field. Optionally, type the child key name or content to narrow down the list.

   - Only keys from the main [branch](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)") are presented.
   - Existing linked keys cannot be selected. Optionally, enable the Hide existing linked keys option to hide existing parent and child keys from the list.
   - Searching by key content applies to default locale only.
4. Click Save.

   The newly created link is added to the list of linked keys. Parent and child keys are updated accordingly in the Strings editor.

###### Edit and Delete Linked Keys

Existing links can only be edited and removed by:

- Owners
- Admins
- Project managers (on assigned or own projects)

Once created, linked keys can be edited by selecting Edit key links from the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682492612764) menu. In the Edit link window, the parent key is locked and cannot be changed. Use the Link child keys field to add or remove child keys for the selected parent key.

##### Note

Relinking to another parent is available through options in the sidebar of the Strings editor.

To delete a linked key and unlink all child keys from a parent key, follow these steps:

1. Select Delete all key links from the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682492612764) menu.

   The Delete all key links window is displayed.
2. Select the desired option to manage child keys content upon link deletion:

   - Keep content in the child keys

     Existing child keys will get unverified, but their content does not change.
   - Remove content from the child keys

     Existing child keys will get untranslated.
3. Click on Delete link.

   The linked key is removed from the Linked keys page. All child keys are unlinked.

Existing key links are broken by default if the parent key is deleted.

Linked keys can also be edited and deleted in the sidebar of the Strings editor.

Locale matching between parent and child keys is based on locale name, not locale code. If the locale name format differs between the parent and child projects, the translation will not sync even though the locale codes match. Before linking keys across projects, verify that locale names match exactly between the parent and child projects.

#### Import and Export Linked Keys

###### Import parent keys

Linked keys can be added upon [file upload](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9_UUID-bc744888-e799-88ec-b3c8-ffab1757c010 "Uploading Localization Files") in the Languages tab of the project page.

When importing a new file, select the Update translations option. The parent key content will be updated and changes will be distributed to child keys. Child keys inherit the parent key's state as per the [translation workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") that has been configured for the child keys:

- Parent key is *verified*/*translated*/*reviewed*

  Child keys are set to *translated* (basic workflow) or *reviewed* (advanced workflow).
- Parent key is *unverified*/*ready for review*

  Child keys get *unverified*.

Existing child keys in the imported file are ignored.

###### Export linked keys

Linked keys can be exported upon [file download](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9_UUID-6fc451e9-aa7b-4e0c-3a8e-1123cf386339 "Downloading Localization Files") in the Languages tab of the project page.

When exporting one or more language files, child keys content is automatically updated using their parent key's translations.

---

### Custom Metadata (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11405341129628-Custom-Metadata-Strings  
> Zuletzt aktualisiert: 2026-06-01T12:43:16Z  
> Labels: 2BTr

#### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Custom metadata are additional properties with values that users can add to [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") to provide more context and details. Such properties can be carried over upon importing and exporting keys.

Supported types of custom metadata are:

- Text (up to 65,535 characters)
- Short string (up to 255 characters)
- Number
- Multi-select
- Single-select
- Date
- Links
- Boolean

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/nEb5EEk0oDc?feature=shared)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

Existing custom metadata properties are accessible to all users in the [Custom metadata](https://support.phrase.com#UUID-dbe4d85b-297e-cb87-dcf9-43b3b78673f9_UUID-cfebcc2b-fe64-f23c-c12a-10d70f3632af "Custom Metadata Page") page.

When assigned to a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)"), custom metadata properties will be visible for each key in the Strings editor. The Custom metadata section of the [contextual sidebar](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29) allows to add or edit values of the available properties.

##### Note

Custom metadata are not supported in [branched projects](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)").

#### Custom Metadata Page

The Custom metadata page is accessible by selecting Custom metadata from the left-side navigation panel.

Custom metadata properties are presented in a table with relevant information. Click on the desired property to open the Custom property window and display more details about it.

###### Search and Filter Custom Metadata

Use the search field at the top of the page to filter the list of custom metadata by name.

To display only properties assigned to specific projects, click on the All projects dropdown menu and select one or multiple projects to filter the list.

To display only certain types of properties, click on the All types dropdown menu and select one or multiple types to filter the list.

The searching and filtering options in the Custom metadata page can be combined to refine search results.

Users can also search for custom metadata properties through the [Advanced search](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-9e47df02-c977-1821-8bf4-7822442257c6) in the Strings editor and [global search](https://support.phrase.com/hc/en-us/articles/5821163151260#UUID-f7bfec22-5fe6-d797-e64c-f120ec7766d3).

###### Add Custom Metadata

Custom metadata can only be added by:

- Owners
- Admins
- Project managers (on assigned or own projects)

To add a new custom metadata property, follow these steps:

1. Select + New property at the top right of the Custom metadata page.

   The Create new property window is displayed.
2. Provide required information in the relevant fields:

   - Property name must be unique.
   - Select the property type from the Type dropdown.

     - For Single select and Multi select property types, specify values in the Values field and press **Enter**.
   - Description is optional.
   - Select one or multiple projects to assign the new property to from the Assigned projects dropdown.
3. Click Save.

   The newly created property is added to the list of custom metadata.

###### Edit and Delete Custom Metadata

Custom metadata can only be edited and removed by:

- Owners
- Admins
- Project managers (on assigned or own projects)

Once created, custom metadata properties can be edited by selecting Edit from the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682444957852) menu.

To change only assigned projects:

1. Select one or multiple custom metadata from the list, then click Edit assigned projects at the top of the page.

   A dropdown window with available projects is displayed. Previously assigned projects are pre-selected.
2. Search for and select the desired projects in the dropdown, then click Apply Changes.
3. Click Save in the confirmation message.

   The existing project assignment is replaced, and the assigned project list is updated.

##### Note

When a custom metadata property is no longer assigned to a project, the property's values are remembered. If the same custom metadata is reassigned to the project, any existing values will be visible again in the Strings editor.

To delete custom metadata, select one or more properties from the list and click Delete at the top of the page. Once confirmed, deletion of custom metadata is irreversible.

#### Import and Export Custom Metadata

###### Import values

Custom metadata values can be added to keys upon [file upload](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9_UUID-bc744888-e799-88ec-b3c8-ffab1757c010 "Uploading Localization Files") in the project page.

Supported file formats are:

- .XLSX
- .CSV
- [.JSON (Phrase Strings)](https://support.phrase.com/hc/en-us/articles/20038313421468#UUID-51604065-cb91-1b38-5613-8be0d5d2c252)

When importing a new file, the file preview allows specifying which custom metadata is associated with certain key values, according to available properties assigned to the project.

Select the custom metadata property from the Custom metadata section in the file preview to import a key value as custom metadata value.

##### Note

If column names in the .XLSX or .CSV file match custom metadata property names, the corresponding custom metadata are automatically selected in the file preview.

###### Export values

Custom metadata values can be exported with the keys upon [file download](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9_UUID-6fc451e9-aa7b-4e0c-3a8e-1123cf386339 "Downloading Localization Files") in the project page.

Supported file formats are:

- .XLSX
- .CSV
- [.JSON (Phrase Strings)](https://support.phrase.com/hc/en-us/articles/20038313421468#UUID-51604065-cb91-1b38-5613-8be0d5d2c252)

When exporting one or more language files, select the desired custom metadata values using the Custom metadata fields option in the General tab.

To filter exported keys by specific custom metadata values:

1. In the Download window, select the Filter translations tab and click Add filter .
2. Select a custom metadata from the dropdown field and specify the relevant value.
3. Repeat the above steps to add more custom metadata.
4. Click Download to export the keys with the applied filters.

---

### Review Workflow (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5784094755484-Review-Workflow-Strings  
> Zuletzt aktualisiert: 2026-09-18T06:19:20Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

A review workflow for translations ensures translators are notified when source content has changed and requires the revision of existing translations.

By default, unverified translations are not excluded from downloaded language files as it is more important to release/deploy a translation that is not perfect over not releasing a translation at all (and displaying an incomplete translation or a placeholder). A continuous localization approach and improving existing (especially unverified) translations on a regular basis without delaying a release of a product is recommended and supported.

The review workflow is configured per [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") in the Review Workflow tab of the Project settings window. Language-specific review options can also be configured when [adding or editing a language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") of the project.

More complex and customized workflows can be constructed with [Phrase Orchestrator](https://support.phrase.com/hc/en-us/articles/7681638082716#UUID-1cda7cbd-1aa9-d555-499b-36042949842f).

#### Basic Review Workflow

**Untranslated > Translated**

Each [key](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") can be either *verified* (default) or *unverified* with verified meaning translated. Unverified translations are marked and can be selected in the [editor](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-9e47df02-c977-1821-8bf4-7822442257c6). An unverified translation requires either proofreading or revision by a translator.

![Basic Review Workflow](https://support.phrase.com/hc/article_attachments/30682413817628)

1. Untranslated
2. Translated
3. Flagged for review due to a change.

   If the source text changes, users can flag keys as unverified to simulate a review step so they can be easily identified.

   ### Note

   This is a notification mechanism, not a workflow step. For a full review stage, the advanced review workflow is required.

###### Language Review Settings

Allow for source copy reviews such as proofreading in cases where unfinished source copy is added to a project.

A possible use case:

1. Developer uploads a file with keys and unreviewed source copy.
2. Project language settings determine that the source copy is created as *unverified* translations.
3. Source copy is proofread and verified.
4. Source copy can be translated into other languages.

To configure language review settings, follow these steps:

1. Go to the Languages tab of the project.
2. Click More options ![More Menu](https://support.phrase.com/hc/article_attachments/30682413842204) in the relevant language row.
3. Select Edit language.

   The Edit language window is displayed.
4. In the Review tab, enable the following options as needed:

   - Unverify on source changes

     Marks translations as *unverified* when the linked source language changes. A source language must be set for this option to take effect. Only languages explicitly linked to the changed source are affected.
   - Unverify new translations

     Enables the review workflow for the selected language. Newly added translations in this language are automatically marked as *unverified* and require review.
   - Unverify updated translations

     Automatically marks translations as *unverified* whenever an existing translation is modified.

   ### Note

   These settings are applied per language. If enabled only for specific locales, only those locales will have new or updated translations marked as unverified.

#### Advanced Review Workflow

##### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

##### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

**Untranslated > Translated > Reviewed**

The advanced review workflow is activated per [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") in the Review Workflow tab in the Project settings window.

Admin, project manager or developer users are always allowed to mark translations as reviewed. Translator users need to be granted this right separately. Review tasks are set at the [job](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738 "Jobs (Strings)") level and assignees [are notified](https://support.phrase.com/hc/en-us/articles/5821056541340#UUID-9f9028ae-0be6-ff70-3fb0-0c2534ff6651 "Notifications (Strings)") of task status.

Every new key needs to be initially translated by a translator, reviewed (by a user with review rights), and be marked as *reviewed* before being pushed to production.

If a previously reviewed translation is changed, it must be reviewed again.

If there is a change to the [main language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)"), translations in other languages may need to be updated as well. A change to a translation in the main language sets the status of all other languages to *unverified* with the Mark as main language option selected:

- A translator must check if the translation is still correct or needs adjustment.
- If only a minor change is required (e.g. adding in missing punctuation) and other languages are not affected, the Mark as minor change option can be selected from the ![Open Vertical Menu](https://support.phrase.com/hc/article_attachments/30682430172060) dropdown in the [key card](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).

![Advanced Review Workflow](https://support.phrase.com/hc/article_attachments/30682445119388)

1. Untranslated.
2. Ready for review.
3. Approved.
4. Flagged for review due to a change.

To ensure no unfinished or unreviewed copy ends up in downloaded files, an extra download option is provided for only the reviewed keys. This option provides:

- Only reviewed translations in the downloaded file(s).
- If a translation is currently not in *Reviewed* state, the last reviewed version of that translation is downloaded.

When an existing project is switched from Basic to Advanced Review Workflow, translations in the Translated state move to Ready for Review.

The verified/unverified flag operates independently of the review workflow state. Switching between Basic and Advanced Review Workflow does not change this flag: keys that were verified remain verified, and keys that were unverified remain unverified.

#### Automatic unverification

When the source content for a translation changes, translators [are notified](https://support.phrase.com/hc/en-us/articles/5821056541340#UUID-9f9028ae-0be6-ff70-3fb0-0c2534ff6651 "Notifications (Strings)") of the change so they can revise and/or verify the accuracy of the translation.

Automatic unverification is triggered for all changes made to translations of main languages as defined in a project. These are usually the languages of the main customer base (e.g., Spanish for customers located in Spain) and the most important. Languages are marked as a main language within the language settings of a project.

For other languages, automatic unverification on source change can be enabled per language and only applies to languages explicitly linked to the changed source.

Automatic unverification is also applied to translations updated via file upload (e.g., via API) when the update translations option was specified. Translations of main languages that are updated during the process also trigger automatic unverification.

When a translation is marked as unverified, the [fallback language](https://support.phrase.com/hc/en-us/articles/5818281650204-Languages-and-Locales-Strings#fallback-for-unverified-translations-0-3) can be configured to return the fallback locale's translation during download.

#### Manual unverification

Translations can also be unverified manually by using the Unverify or Verify button next to a translation within the editor.

Translation can also be verified and unverified via API.

#### Batch verification

Translations can be verified and unverified [in batch in the editor](https://support.phrase.com/document/preview/71342#UUID-d1371342-6732-44b1-7a43-090b49a55bf2) by selecting the checkbox next to the key names from a search result. Hold down the Shift key to select all keys between a first and second selection. Alternatively, use the Select all search results checkbox at the top to select all keys from a search query. From the list of batch-actions, mark selected translations as Verified or Unverified.

#### Viewing changes

When deciding whether a translation is still accurate, it can be very helpful to see the last changes made to the source translations since the translation in question was previously verified.

A differential can be displayed by clicking the Show changes button next to an unverified translation in the editor.

#### Verify changes

To see which translation was (un)verified by whom, consult the [translation history](https://support.phrase.com/hc/en-us/articles/11155533567388#UUID-3e5ac7d6-2a26-80e7-3555-dd2769217e29) where content updates and a timeline of (un)verification actions is displayed.

#### Skipping automatic unverification

Automatic unverification is prevented by checking the Skip verification option when saving a translation. If specified, updating the translation does not cause all other translations to be marked as unverified.

Skip automatic unverification when correcting small things such as a typo or formatting without changing the actual meaning of the (source) translation.

To skip the unverification process when [uploading a file](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9 "Uploading and Downloading Localization Files (Strings)"), use the `skip_unverification` flag.

---

### Over the Air (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5804059067804-Over-the-Air-Strings  
> Zuletzt aktualisiert: 2026-09-28T06:27:42Z  
> Labels: 2BTr, ar_strings

[Over-the-Air (OTA)](https://en.wikipedia.org/wiki/Over-the-air_update) updates offer a flexible way to deliver translation updates to mobile and web applications without requiring a new release on the App Store, Google Play, or other deployment platforms. This approach supports continuous localization and agile development workflows by reducing delays and manual processes.

The OTA feature in Phrase Strings integrates with iOS, Android, React Native, Flutter, i18next, and Rails platforms. Updates for text labels are instantly pushed to mobile apps.

![OTA User Device Diagram](https://support.phrase.com/hc/article_attachments/30682430268188)

A new release must be created in order for the updated settings to be applied. All content included in a release must be available in Phrase Strings, which streams translations directly to the application. If the content is not present, translations will not be delivered.

For mobile applications, OTA requires integrating the relevant [Software Development Kit (SDK)](https://en.wikipedia.org/wiki/Software_development_kit) into the application to retrieve translations from Phrase Strings at runtime.

##### Tip

For distribution, release, and API reference details, refer to the [Developer Hub](https://developers.phrase.com/en/ota/introduction).

When starting an application implementing the iOS, Android, React Native or Flutter SDK for the first time on a device, a unique and random device identifier is generated. This identifier tracks active users over a given period of time. It is not used for any other form or means of tracking and does not contain any user or device information.

The number of OTA requests and the amount of Monthly Active Users (MAU) are [limited](https://support.phrase.com/hc/en-us/articles/8548271212188#UUID-c823465f-c930-29db-2a5a-899fb000abc7 "Phrase Strings Limits"), depending on selected pricing plan.

MAU is the number of unique devices from which translations are requested. Each device is assigned a random ID. MAU is calculated based on the number of unique IDs assigned in the last 30 days. Every interaction with Phrase servers is considered a request.

#### Data Sent with OTA Requests

The SDK communicates with the OTA service in order to check for updates and includes the following details with each request:

- Device identifier (e.g. "F3AFCB10-80A2-84CB-94C0-27F5EF58876D". Unique for this app and therefore does not allow tracking a specific device.)
- App version (e.g. "1.2.0")
- Last update of the translation file (e.g. "1542187679")
- SDK version (e.g. "1.0.0")
- Locale (e.g. "de-DE")
- File format (e.g. "strings")
- Client (e.g. "ios")
- [Distribution](https://support.phrase.com#UUID-ee55c47a-b2e0-5cea-02a4-1489beed2396_UUID-691b8064-f550-e2b3-605b-90e8a0871804 "OTA Distributions") ID (ID of the distribution)
- Environment secret (to distinguish between development from production)

Domains used by the SDKs:

EU datacenter

- ota.eu.phrase.com
- cdn.eu.phrase.com
- ota.phraseapp.com
- cdn.phraseapp.com

US datacenter

- ota.us.phrase.com
- cdn.us.phrase.com

Phrase OTA SDKs are designed to ensure apps remain functional even if the OTA API is unavailable. In such cases, the SDK falls back to the last successfully fetched translations stored on the device, or to the bundled translations included in the app package. This prevents errors or missing strings for end-users. To guarantee reliable fallback, bundled translations should be kept up to date with every app release.

#### OTA Distributions

Distributions are a configured setup that defines how and where OTA updates are delivered for a specific platform or project.

Target platforms are defined within the distribution:

- iOS
- Android
- Flutter
- i18next
- Rails

Multiple distributions are possible, but ideally there is one distribution per project. If using a distribution for iOS and Android, placeholders for the two formats are automatically converted.

##### Permissions

Managing OTA distributions and releases is scoped by project assignment. Users manage them only on projects they are assigned to.

The Owner, Administrator, Project Manager, Developer, and Designer roles have full access to OTA distributions and releases by default. The Translator role has no access.

Owners and Administrators have access across all projects.

Users need account-level permission to manage distributions before creating one. The new distribution attaches only to projects the user can access.

For more granular control, Enterprise customers can contact the support team about a custom role.

##### Fallbacks

If language fallbacks are set in the language settings of the project the distribution is connected to, strings from the selected language will be displayed if the requested language exists, but the key is not translated.

If a country-specific language (e.g. *en-GB*) is used, but is not part of the release, the system can fall back on a standard version (e.g. *en*) of that language if it exists in the project. If the language requested is not found at all, the default locale of the project can be served instead.

Fallbacks will not work on [linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-3b57fe95-88d5-b019-e956-f22c96647518 "Linked Keys (Strings)").

##### Create a distribution

To create a distribution, follow these steps:

1. From the Over the air (OTA) box on the Integrations page, click Configure or the number of configurations if some already exist.

   The Over the air page opens and displays existing configurations.
2. Click New distribution. The Add distribution windows opens.
3. In the General tab, provide a Name, which Project the distribution is associated with, required Languages, and required Platforms.

   - For Android distributions, click on the Android tab to select the format option that encloses any translation including HTML tags in CDATA, if required.
   - After selecting the project to associate with the distribution, the Scheduling tab becomes available. If required, use this tab to [set up OTA scheduled releases](https://support.phrase.com#UUID-ee55c47a-b2e0-5cea-02a4-1489beed2396_UUID-25a62105-1ebe-fb59-4cdf-1d908135d207 "Schedule OTA releases") in the distribution.
4. In the Fallback languages tab, select distribution specific fallback settings as required. Fallback options are prioritized as displayed in the list.
5. Optionally, click on the Translations tab to select the option to use the latest reviewed version of translations. Enable this option only when working with the [advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)").
6. Click Save.

   Distribution details are displayed with IDs required by the SDKs. Details can be displayed again by clicking the distribution from the Over the air page.

#### OTA Releases

To update translations, create a new release within the distribution. The current state of the project is exported and made available to connected clients.

To create a release, follow these steps:

1. From the Over the air page, click Add release beside the required distribution.

   The New release window opens.
2. Provide a Description, required Platform, Branch, Locales and App versions.

   Locales that are not yet added to the distribution's language list appear unselected and unavailable for selection. Add the required languages to the distribution to make them selectable in future releases.

   If no locales are manually selected when creating a release, all locales configured in the distribution are included in the release by default.

   If necessary, enter tags to include only keys with specific tags in the release. Adding a tag filter to a release includes only the keys carrying that tag. Keys without the tag are excluded from the release entirely, and the connected app falls back to the static translation files bundled locally in its codebase for those keys. Tag filtering works independently of [branching](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)"): if branching is enabled, select the branch and the relevant tag(s); if branching is not enabled, select only the relevant tag(s).
3. Click Save.

   The release is added to the list on the bottom of the distribution details page.

##### Schedule OTA releases

To set up recurring schedules for releasing the distribution, follow these steps:

1. From the Over the air page, click on the cog wheel ![Modify](https://support.phrase.com/hc/article_attachments/30682492920220) icon beside the required distribution.

   The Edit distribution window is displayed.
2. Select the Schedule release tab and click Enable scheduling.

   Release scheduling options are displayed.

   ### Note

   Scheduling options are also available upon [creation of a new distribution](https://support.phrase.com#UUID-ee55c47a-b2e0-5cea-02a4-1489beed2396_bridgehead-idm4661503098563233235078329637 "Create a distribution").
3. From the Create releases every dropdown, choose the release frequency by selecting one of the available options:

   - Day
   - Week

     Select the desired weekdays for the scheduled releases.
4. Provide a time and relevant Time zone.
5. If necessary, select Branch, Tags and Languages for the scheduled releases.

   - The Branch field is displayed only if branching is enabled in the project. Selecting a branch updates the list of locales and languages.
6. Optionally, specify the application versions in the Min version and Max version fields.

   Leave blank to apply the schedule release to all versions of the app.
7. Click Save.

   The distribution is updated with release scheduling information.

Disabling the schedule stops the automatic release of the distribution, but the configured settings are saved.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/BEMsu4q1tRE)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

##### Note

There is no option in the Strings UI to pause or temporarily disable OTA. To stop an app from fetching translations, remove the distribution ID from the app's OTA configuration; restore the ID to resume OTA. As a last resort, delete the distribution and create a new one.

#### OTA Mobile SDK and Web Library Reports

Integrating the appropriate mobile SDK or Web library allows updating of translations with a single click, but also provides metrics to measure usage. The mobile SDK and Web library reports give valuable insight into active app users and their app languages. This set of reports is available for each distribution, and the data is refreshed twice a day.

Reports are provided for number of active users, overall requests, requests per language, requests per platform and for device languages not provided.

Reports for each distribution are accessed via the ![Open Reports](https://support.phrase.com/hc/article_attachments/30682492940956) icon on the Over the air page.

The number of active users shown in these reports reflects a rolling 30-day window based on the current date, not a fixed calendar or billing-cycle period.

#### OTA SDK Integration

Technical documentation for integrating the OTA SDKs is available in the README file of each project repository:

- [Android SDK](https://github.com/phrase/phrase-android)
- [Flutter SDK](https://github.com/phrase/phrase-flutter-sdk)
- [iOS SDK](https://github.com/phrase/ios-sdk)
- [React Native SDK](https://www.npmjs.com/package/react-native-phrase-sdk)
- [i18next SDK](https://github.com/phrase/i18next-phrase-backend)
- [Rails SDK](https://github.com/phrase/phrase-ota-i18n)

---

### Languages and Locales (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5818281650204-Languages-and-Locales-Strings  
> Zuletzt aktualisiert: 2026-09-23T06:20:55Z  
> Labels: 2BTr, ar_strings

Projects consist of at least two languages which are called locales in the context of internationalization. A locale defines a user language and contains language and country related parameters. Many languages can be added to project to reflect all the variants and country regions to supported by the software project.

The Languages tab on the project page provides an overview of all languages added to the project, including the translation status of keys for each language. Clicking a language's translation-status count (e.g. untranslated or unverified) opens the Editor pre-filtered to just those keys for that language. Use the options at the top of the list to search for a specific language or filter by Language type to display only the project's main or default language.

**Default locale**

A default locale is automatically set when the first language is added to the project. The default locale can be changed when adding or editing languages of a project.

By default, the source language for translations is set to the default locale. If required, a different source language can be selected when translating keys in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).

**Main language**

A main language is a language designated as an authoritative source for content changes in a project. When a translation is updated in a main language, translations of the same key in other languages are automatically marked as *unverified*. This indicates that they may need to be [reviewed](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)").

A language can be marked as main by selecting Mark as main language in the Review tab when [adding or editing a language](https://support.phrase.com#UUID-1fd36188-23b2-375a-17de-dad6fe94614d_UUID-db47b5d6-0c28-36e4-9978-d8df109246f8 "Add a Language").

#### Add a Language

To add a language to a project, follow these steps:

1. Click Add language ![Add a Language](https://support.phrase.com/hc/article_attachments/30682492983708)on the Languages tab of any project.

   The Add language window opens.
2. Select a name for the language.

   Be specific with the language name to reduce confusion between variants and avoiding having to rename if variants are later added.
3. Select the language code from the drop-down list.

   - All projects have a default locale with it being English (en) in most cases. If a different default language is required, it can be selected from the dropdown list on the Advanced tab.
   - When translations are requested but not found, a fallback language can be defined on the Advanced tab. This language is used for missing translations in [OTA](https://support.phrase.com/hc/en-us/articles/5804059067804#UUID-ee55c47a-b2e0-5cea-02a4-1489beed2396 "Over the Air (Strings)") distributions.

     Fallbacks will not work on [linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-3b57fe95-88d5-b019-e956-f22c96647518 "Linked Keys (Strings)").
4. Set [review](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") options from the Review tab.
5. Click Save.

   The specified language is added to the project.

Languages can be deleted from the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682430390556) menu beside the selected language in the Languages tab. Deleting a language removes all associated translations for that language from a project. Ensure a backup is prepared before deleting a language. Deleting a language cannot be undone and deleted language cannot be restored.

#### Fallback Language

A fallback language is a locale used when a translation is missing in the target locale. The fallback locale's translation is returned instead of an empty value or the key name.

Fallback language is configured per language.

To configure a fallback language:

1. On the project page, click the Languages tab.

   The Languages tab opens.
2. Click Add language, or open the More options menu beside an existing language and click Edit language to edit it.
3. In the language settings, open the Advanced tab.
4. Select a locale from the dropdown in the Fallback language field.
5. Click Save.

##### Note

For manual downloads, the Include empty translations checkbox must be enabled and the fallback locale selected in the Download dialog.

##### Fallback for Unverified Translations

Fallback resolution can be extended to unverified translations.

When enabled, unverified translations are replaced by the fallback locale's translation on export.

In the [basic review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484-Review-Workflow-Strings#basic-review-workflow-0-0), this applies to *unverified* translations; in the [advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484-Review-Workflow-Strings#advanced-review-workflow-0-3), it applies to translations that are *translated but not reviewed*. When a key in a target locale is unverified and its fallback locale has a translation, Strings returns the fallback content at export time. Existing translations are not overwritten.

To enable fallback for unverified translations:

1. On the project page, click the More tab and select Project settings.

   Project settings window opens.
2. From the Advanced tab, select Use fallback for unverified translations.
3. Click Save.

##### Note

For manual downloads, the Include unverified translations checkbox in the Download dialog must also be enabled.

#### Supported Languages

| Code | Language |
| --- | --- |
| ab | Abkhazian |
| ace | Achinese |
| ach | Acoli |
| ada | Adangme |
| ady | Adyghe |
| aa | Afar |
| aa-DJ | Afar, Djibouti |
| aa-ER | Afar, Eritrea |
| aa-ET | Afar, Ethiopia |
| aa-Ethi | Afar(Ethiopic) |
| afh | Afrihili |
| af | Afrikaans |
| af-NA | Afrikaans, Namibia |
| af-ZA | Afrikaans, South Africa |
| afa | Afro-Asiatic Language |
| ain | Ainu |
| ain-Latn | Ainu(Latin) |
| ak | Akan |
| ak-GH | Akan, Ghana |
| akk | Akkadian |
| sq | Albanian |
| sq-AL | Albanian, Albania |
| sq-ME | Albanian, Montenegro |
| sq-MK | Albanian, North Macedonia |
| sq-KS | Kosovë, Albanian |
| sq-XK | Albanian, Kosovo |
| ale | Aleut |
| alg | Algonquian Language |
| tut | Altaic Language |
| am | Amharic |
| am-ET | Amharic, Ethiopia |
| anp | Angika |
| apa | Apache Language |
| ar | Arabic |
| ar-001 | Arabic, World |
| ar-145 | Arabic, Western Asia |
| ar-DZ | Arabic, Algeria |
| ar-Arab | Arabic(Perso-Arabic) |
| ar-BH | Arabic, Bahrain |
| ar-DB | Arabic, Dubai |
| ar-EG | Arabic, Egypt |
| ar-IQ | Arabic, Iraq |
| ar-IL | Arabic, Israel |
| ar-JO | Arabic, Jordan |
| ar-KW | Arabic, Kuwait |
| ar-LB | Arabic, Lebanon |
| ar-LY | Arabic, Libya |
| ar-mod | Arabic, Modern |
| ar-MA | Arabic, Morocco |
| ar-OM | Arabic, Oman |
| ar-QA | Arabic, Qatar |
| ar-SA | Arabic, Saudi Arabia |
| ar-SD | Arabic, Sudan |
| ar-SY | Arabic, Syria |
| ar-TN | Arabic, Tunisia |
| ar-AE | Arabic, United Arab Emirates |
| ar-YE | Arabic, Yemen |
| an | Aragonese |
| arp | Arapaho |
| arn | Araucanian |
| arw | Arawak |
| hy | Armenian |
| hy-AM | Armenian, Armenia |
| rup | Aromanian |
| rup-Grek | Aromanian(Greek) |
| rup-Latn | Aromanian(Latin) |
| art | Artificial Language |
| as | Assamese |
| as-IN | Assamese, India |
| ast | Asturian |
| ath | Athapascan Language |
| cch | Atsam |
| cch-NG | Atsam, Nigeria |
| aus | Australian Language |
| map | Austronesian Language |
| av | Avaric |
| ae | Avestan |
| awa | Awadhi |
| ay | Aymara |
| az | Azeri |
| az-Arab | Azeri(Perso-Arabic) |
| az-AZ | Azeri, Azerbaijan |
| az-Cyrl-AZ | Azeri, Azerbaijan(Cyrillic) |
| az-Latn-AZ | Azeri, Azerbaijan(Latin) |
| az-Cyrl | Azeri(Cyrillic) |
| az-Latn | Azeri(Latin) |
| az-IR | Azeri, Iran |
| az-Arab-IR | Azeri, Iran(Perso-Arabic) |
| ban | Balinese |
| bat | Baltic Language |
| bal | Baluchi |
| bal-Arab | Baluchi(Perso-Arabic) |
| bm | Bambara |
| bai | Bamileke Language |
| bad | Banda |
| bnt | Bantu |
| bas | Basa |
| ba | Bashkir |
| eu | Basque |
| eu-FR | Basque, France |
| eu-ES | Basque, Spain |
| btk | Batak |
| bej | Beja |
| be | Belarusian |
| be-BY | Belarusian, Belarus |
| be-Cyrl | Belarusian(Cyrillic) |
| be-Latn | Belarusian(Latin) |
| bem | Bemba |
| bn | bengali |
| bn-bd | bengali, bangladesh |
| bn-IN | Bengali, India |
| ber | Berber |
| bho | Bhojpuri |
| bh | Bihari |
| bik | Bikol |
| bin | Bini |
| bi | Bislama |
| byn | Blin |
| byn-ER | Blin, Eritrea |
| zbl | Blissymbols |
| bs | Bosnian |
| bs-Latn-BA | Bosnian, Bosnia and Herzegovina(Latin) |
| bs-BA | Bosnian, Bosnia and Herzegovina |
| bra | Braj |
| br | Breton |
| bug | Buginese |
| bg | Bulgarian |
| bg-BG | Bulgarian, Bulgaria |
| bua | Buriat |
| my | Burmese |
| my-MM | Burmese, Myanmar [Burma] |
| cad | Caddo |
| car | Carib |
| ca | Catalan |
| ca-ES | Catalan, Spain |
| cau | Caucasian Language |
| ceb | Cebuano |
| ceb-PH | Cebuano, Philippines |
| cel | Celtic Language |
| cai | Central American Indian Language |
| km | Khmer |
| km-KH | Khmer, Cambodia |
| cmc | Chamic Language |
| cmc-Arab | Chamic Language(Perso-Arabic) |
| ch | Chamorro |
| ce | Chechen |
| chr | Cherokee |
| chy | Cheyenne |
| cnr | Montenegrin |
| cnr-ME | Montenegrin, Montenegro |
| cnr-RS | Montenegrin, Serbia |
| ny | Nyanja |
| ny-MW | Nyanja, Malawi |
| zh | Chinese |
| zh-CN | Chinese, China |
| zh-Hans-CN | Chinese, China(Simplified Han) |
| zh-HK | Chinese, Hong Kong |
| zh-Hans-HK | Chinese, Hong Kong(Simplified Han) |
| zh-Hant-HK | Chinese, Hong Kong(Traditional Han) |
| zh-MO | Chinese, Macau |
| zh-Hans-MO | Chinese, Macau(Simplified Han) |
| zh-Hant-MO | Chinese, Macau(Traditional Han) |
| zh-Hans | Chinese(Simplified Han) |
| zh-SG | Chinese, Singapore |
| zh-Hans-SG | Chinese, Singapore(Simplified Han) |
| zh-TW | Chinese, Taiwan |
| zh-Hant-TW | Chinese, Taiwan(Traditional Han) |
| zh-Hant | Chinese(Traditional Han) |
| zh-yue | Chinese(Cantonese) |
| chn | Chinook Jargon |
| chp | Chipewyan |
| cho | Choctaw |
| cu | Church Slavic |
| chk | Chuukese |
| cv | Chuvash |
| kw | Cornish |
| kw-GB | Cornish, United Kingdom |
| co | Corsican |
| cr | Cree |
| mus | Creek |
| crp | Creole or Pidgin |
| crh | Crimean Turkish |
| crh-Cyrl | Crimean Turkish(Cyrillic) |
| crh-Latn | Crimean Turkish(Latin) |
| hr | Croatian |
| hr-HR | Croatian, Croatia |
| hr-ME | Croatian, Montenegro |
| cus | Cushitic Language |
| cs | Czech |
| cs-CZ | Czech, Czech Republic |
| cs-SK | Czech, Slovakia |
| dak | Dakota |
| da | Danish |
| da-DK | Danish, Denmark |
| da-FO | Danish, Faroe Islands |
| da-GL | Danish, Greenland |
| da-SE | Danish, Sweden |
| dar | Dargwa |
| day | Dayak |
| del | Delaware |
| din | Dinka |
| dv | Divehi |
| dv-MV | Divehi, Maldives |
| dv-Thaa | Divehi(Thaana) |
| doi | Dogri |
| dgr | Dogrib |
| dra | Dravidian Language |
| dua | Duala |
| nl | Dutch |
| nl-BE | Dutch, Belgium |
| nl-BQ | Dutch, Bonaire |
| nl-NL | Dutch, Netherlands |
| nl-CW | Dutch, Curaçao |
| nl-SR | Dutch, Suriname |
| dyu | Dyula |
| dz | Dzongkha |
| dz-BT | Dzongkha, Bhutan |
| frs | Eastern Frisian |
| efi | Efik |
| eka | Ekajuk |
| en | English |
| en-AR | English, Argentina |
| en-AS | English, American Samoa |
| en-AT | English, Austria |
| en-AE | English, Arabic Emirates |
| en-AU | English, Australia |
| en-AM | English, Armenia |
| en-AZ | English, Azerbaidschan |
| en-BD | English, Bangladesh |
| en-BH | English, Bahrain |
| en-BR | English, Brazil |
| cpe | English-based Creole or Pidgin |
| en-BE | English, Belgium |
| en-BZ | English, Belize |
| en-BQ | English, Bonaire |
| en-BW | English, Botswana |
| en-BN | English, Brunei |
| en-CA | English, Canada |
| en-KY | English, Cayman Islands |
| en-CL | English, Chile |
| en-CN | English, China |
| en-CO | English, Colombia |
| en-HR | English, Croatia |
| en-CZ | English, Czech Republic |
| en-XY | English, default |
| en-Dsrt | English(Deseret) |
| en-db | English, Dubai |
| en-DE | English, Germany |
| en-DK | English, Denmark |
| en-EG | English, Egypt |
| en-EE | English, Estonia |
| en-ET | English, Ethiopia |
| en-FO | English, Faroe Islands |
| en-FI | English, Finland |
| en-FR | English, France |
| en-GE | English, Georgia |
| en-GI | English, Gibraltar |
| en-GH | English, Ghana |
| en-GR | English, Greece |
| en-GL | English, Greenland |
| en-GU | English, Guam |
| en-HK | English, Hong Kong |
| en-ID | English, Indonesia |
| en-IN | English, India |
| en-IE | English, Ireland |
| en-IL | English, Israel |
| en-IS | English, Island |
| en-IT | English, Italy |
| en-JM | English, Jamaica |
| en-JO | English, Jordan |
| en-JP | English, Japanese |
| en-KE | English, Kenia |
| en-KH | English, Cambodia |
| en-KR | English, Korea |
| en-KW | English, Kuwait |
| en-LI | English, Liechtenstein |
| en-LT | English, Lithuania |
| en-LU | English, Luxembourg |
| en-LV | English, Latvia |
| en-MY | English, Malaysia |
| en-MT | English, Malta |
| en-MH | English, Marshall Islands |
| en-MN | English, Mongolia |
| en-MX | English, Mexico |
| en-MA | English, Morocco |
| en-MU | English, Mauritius |
| en-NA | English, Namibia |
| en-NG | English, Nigeria |
| en-NL | English, Netherlands |
| en-NO | English, Norway |
| en-NP | English, Nepal |
| en-NZ | English, New Zealand |
| en-MP | English, Northern Mariana Islands |
| en-OM | English, Oman |
| en-PL | English, Poland |
| en-PK | English, Pakistan |
| en-PH | English, Philippines |
| en-PT | English, Portugal |
| en-QA | English, Qatar |
| en-RO | English, Romania |
| en-RU | English, Russia |
| en-SA | English, Saudi-Arabia |
| en-Shaw | English(Shavian) |
| en-RS | English, Serbia |
| en-SI | English, Slovenia |
| en-SL | English, Sierra Leonean |
| en-SG | English, Singapore |
| en-ZA | English, South Africa |
| en-ES | English, Spain |
| en-SE | English, Sweden |
| en-CH | English, Switzerland |
| en-TN | English, Tunisia |
| en-TW | English, Taiwan |
| en-TH | English, Thailand |
| en-TT | English, Trinidad and Tobago |
| en-TR | English, Turkey |
| en-GB | English, United Kingdom |
| en-UA | English, Ukraine |
| en-US | English, United States |
| en-Dsrt-US | English, United States(Deseret) |
| en-UM | English, U.S. Minor Outlying Islands |
| en-USVI | English, U.S. Virgin Islands |
| en-VN | English, Vietnam |
| en-ZW | English, Zimbabwe |
| en-145 | English, Western Asia |
| en-CY | English, Cypress |
| en-HU | English, Hungary |
| en-SK | English, Slovakia |
| en-BA | English, Bosnia and Herzegovina |
| en-XK | English, Kosovo |
| en-ME | English, Montenegro |
| en-KA | English, Georgia |
| en-KZ | English, Kazakhstan |
| en-KG | English, Kyrgyzstan |
| en-TJ | English, Tajikistan |
| en-TM | English, Turkmenistan |
| en-UZ | English, Uzbekistan |
| en-BG | English, Bulgaria |
| en-MK | English, Macedonia |
| en-MD | English, Moldova Republic of |
| en-AL | English, Albania |
| en-AD | English, Andorra |
| en-IB | English, Balearic Islands |
| en-IC | English, Canaries |
| en-PR | English, Puerto Rico |
| en-DO | English, Dominican Republic |
| en-FJ | English, Fiji Island |
| en-LK | English, Sri Lanka |
| en-SC | English, Seychelles |
| en-SY | English, Syria |
| en-IQ | English, Iraq |
| en-LB | English, Lebanon |
| en-UG | English, Uganda |
| en-VU | English, Vanuatu |
| en-WW | English, Worldwide |
| en-YE | English, Yemen |
| en-ZM | English, Zambia |
| myv | Erzya |
| eo | Esperanto |
| et | Estonian |
| et-EE | Estonian, Estonia |
| et-LV | Estonia, Latvia |
| ee | Ewe |
| ee-GH | Ewe, Ghana |
| ee-TG | Ewe, Togo |
| ewo | Ewondo |
| fan | Fang |
| fat | Fanti |
| fo | Faroese |
| fo-FO | Faroese, Faroe Islands |
| fj | Fijian |
| fil | Filipino |
| fil-PH | Filipino, Philippines |
| fi | Finnish |
| fi-FI | Finnish, Finland |
| fi-SE | Finnish, Sweden |
| fiu | Finno-Ugrian Language |
| fon | Fon |
| fr | French |
| cpf | French-based Creole or Pidgin |
| fr-BE | French, Belgium |
| fr-CA | French, Canada |
| fr-FR | French, France |
| fr-LU | French, Luxembourg |
| fr-DE | French, Germany |
| fr-DJ | French, Djibouti |
| fr-MC | French, Monaco |
| fr-YT | French, Mayotte |
| fr-SN | French, Senegal |
| fr-CH | French, Switzerland |
| fr-HT | French, Haiti |
| fr-MA | French, Morocco |
| fr-MU | French, Mauritius |
| fr-CD | French, Congo |
| fr-CI | French, Cote Ivoire |
| fr-DZ | French, Algiers |
| fr-GB | French, United Kingdom |
| fr-GP | French, Guadeloupe |
| fr-LI | French, Liechtenstein |
| fr-MQ | French, Martinique |
| fr-GF | French, Guiana |
| fr-RE | French, Réunion |
| fr-TN | French, Tunisia |
| fr-NC | French, New Caledonia |
| fr-PF | French, Polynesia Française |
| fr-SC | French, Seychelles |
| fr-VU | French, Vanuatu |
| fur | Friulian |
| fur-IT | Friulian, Italy |
| ff | Fulah |
| ff-Arab | Fulah(Perso-Arabic) |
| ff-Latn | Fulah(Latin) |
| gaa | Ga |
| gd | Scottish Gaelic |
| gaa-GH | Ga, Ghana |
| gl | Galician |
| gl-ES | Galician, Spain |
| lg | Ganda |
| gay | Gayo |
| gba | Gbaya |
| gez | Geez |
| gez-ER | Geez, Eritrea |
| gez-ET | Geez, Ethiopia |
| ka | Georgian |
| ka-GE | Georgian, Georgia |
| de | German |
| de-AT | German, Austria |
| de-BE | German, Belgium |
| de-BG | German, Bulgaria |
| de-DE | German, Germany |
| gem | Germanic Language |
| de-LI | German, Liechtenstein |
| de-LU | German, Luxembourg |
| de-NL | German, Netherlands |
| de-CH | German, Switzerland |
| gil | Gilbertese |
| gon | Gondi |
| gor | Gorontalo |
| grb | Grebo |
| el | Greek |
| el-CY | Greek, Cyprus |
| el-GR | Greek, Greece |
| gn | Guarani |
| gu | Gujarati |
| gu-IN | Gujarati, India |
| gwi | Gwichʼin |
| hai | Haida |
| ht | Haitian |
| ht-HT | Haitian Creole |
| ha | Hausa |
| ha-Arab | Hausa(Perso-Arabic) |
| ha-GH | Hausa, Ghana |
| ha-Latn-GH | Hausa, Ghana(Latin) |
| ha-Latn | Hausa(Latin) |
| ha-NE | Hausa, Niger |
| ha-NG | Hausa, Nigeria |
| ha-Arab-NG | Hausa, Nigeria(Perso-Arabic) |
| ha-Latn-NG | Hausa, Nigeria(Latin) |
| ha-Latn-NE | Hausa, Niger(Latin) |
| ha-SD | Hausa, Sudan |
| ha-Arab-SD | Hausa, Sudan(Perso-Arabic) |
| haw | Hawaiian |
| haw-US | Hawaiian, United States |
| he | Hebrew |
| he-Hebr | Hebrew(Hebrew) |
| he-IL | Hebrew, Israel |
| hz | Herero |
| hil | Hiligaynon |
| him | Himachali |
| hi | Hindi |
| hi-IN | Hindi, India |
| ho | Hiri Motu |
| hit | Hittite |
| hmn | Hmong |
| hu | Hungarian |
| hu-HU | Hungarian, Hungary |
| hup | Hupa |
| iba | Iban |
| is | Icelandic |
| is-IS | Icelandic, Iceland |
| io | Ido |
| ig | Igbo |
| ig-NG | Igbo, Nigeria |
| ijo | Ijo |
| ilo-PH | Ilocano, Philippines |
| ilo | Iloko |
| hil-PH | Ilonggo, Philippines |
| smn | Inari Sami |
| inc | Indic Language |
| ine | Indo-European Language |
| id | Indonesian |
| id-Arab | Indonesian(Perso-Arabic) |
| id-ID | Indonesian, Indonesia |
| id-Arab-ID | Indonesian, Indonesia(Perso-Arabic) |
| inh | Ingush |
| in | Indonesian |
| in-ID | Indonesian, Indonesia |
| ia | Interlingua |
| ie | Interlingue |
| iu | Inuktitut |
| iu-CA | Inuktitut, Canada |
| ik | Inupiaq |
| ira | Iranian Language |
| ga | Irish |
| ga-IE | Irish, Ireland |
| iro | Iroquoian Language |
| it | Italian |
| it-AT | Italian, Austria |
| it-IT | Italian, Italy |
| it-CH | Italian, Switzerland |
| it-LI | Italian, Liechtenstein |
| ja | Japanese |
| ja-JP | Japanese, Japan |
| jv | Javanese |
| jv-Java | Javanese(Javanese) |
| jv-Latn | Javanese(Latin) |
| jrb | Judeo-Arabic |
| jpr | Judeo-Persian |
| kbd | Kabardian |
| kab | Kabyle |
| kac | Kachin |
| kl | Kalaallisut |
| kl-GL | Kalaallisut, Greenland |
| xal | Kalmyk |
| xal-Cyrl | Kalmyk(Cyrillic) |
| xal-Mong | Kalmyk(Mongolian) |
| kam | Kamba |
| kam-KE | Kamba, Kenya |
| kn | Kannada |
| kn-IN | Kannada, India |
| kr | Kanuri |
| krc | Karachay-Balkar |
| kaa | Kara-Kalpak |
| krl | Karelian |
| kar | Karen |
| ks | Kashmiri |
| ks-Arab | Kashmiri(Perso-Arabic) |
| ks-Deva | Kashmiri(Devanagari) |
| ks-Latn | Kashmiri(Latin) |
| csb | Kashubian |
| kaw | Kawi |
| kk | Kazakh |
| kk-Arab | Kazakh(Perso-Arabic) |
| kk-Cyrl | Kazakh(Cyrillic) |
| kk-KZ | Kazakh, Kazakhstan |
| kk-Arab-KZ | Kazakh, Kazakhstan(Perso-Arabic) |
| kk-Cyrl-KZ | Kazakh, Kazakhstan(Cyrillic) |
| kk-Latn-KZ | Kazakh, Kazakhstan(Latin) |
| kk-Latn | Kazakh(Latin) |
| kha | Khasi |
| khi | Khoisan Language |
| kho | Khotanese |
| ki | Kikuyu |
| kmb | Kimbundu |
| rw | Kinyarwanda |
| rw-RW | Kinyarwanda, Rwanda |
| ky-Cyrl | Kirghiz(Cyrillic) |
| ky | Kirghiz |
| ky-Arab | Kirghiz(Perso-Arabic) |
| ky-KG | Kirghiz, Kyrgyzstan |
| ky-Latn | Kirghiz(Latin) |
| tlh | Klingon |
| kv | Komi |
| kg | Kongo |
| kok | Konkani |
| kok-IN | Konkani, India |
| kok-Knda-IN | Konkani, India(Kannada) |
| kok-Latn-IN | Konkani, India(Latin) |
| kok-Mlym-IN | Konkani, India(Malayalam) |
| kok-Knda | Konkani(Kannada) |
| kok-Latn | Konkani(Latin) |
| kok-Mlym | Konkani(Malayalam) |
| ko | Korean |
| ko-KR | Korean, South Korea |
| kfo | Koro |
| kfo-CI | Koro, Ivory Coast |
| kos | Kosraean |
| kpe | Kpelle |
| kpe-GN | Kpelle, Guinea |
| kpe-LR | Kpelle, Liberia |
| kro | Kru |
| kj | Kuanyama |
| kum | Kumyk |
| ku | Kurdish |
| ku-Arab | Kurdish(Perso-Arabic) |
| ku-IR | Kurdish, Iran |
| ku-Arab-IR | Kurdish, Iran(Perso-Arabic) |
| ku-IQ | Kurdish, Iraq |
| ku-Arab-IQ | Kurdish, Iraq(Perso-Arabic) |
| ku-Latn | Kurdish(Latin) |
| ku-SY | Kurdish, Syria |
| ku-Arab-SY | Kurdish, Syria(Perso-Arabic) |
| ku-TR | Kurdish, Turkey |
| ku-Latn-TR | Kurdish, Turkey(Latin) |
| kru | Kurukh |
| kut | Kutenai |
| lad | Ladino |
| lad-Hebr | Ladino(Hebrew) |
| lad-Latn | Ladino(Latin) |
| lah | Lahnda |
| lam | Lamba |
| lo | Lao |
| lo-LA | Lao, Laos |
| la | Latin |
| lv | Latvian |
| lv-LV | Latvian, Latvia |
| lez | Lezghian |
| li | Limburgish |
| ln | Lingala |
| ln-CG | Lingala, Congo [Republic] |
| ln-CD | Lingala, Congo [DRC] |
| lt | Lithuanian |
| lt-LT | Lithuanian, Lithuania |
| jbo | Lojban |
| dsb | Lower Sorbian |
| nds | Low German |
| nds-DE | Low German, Germany |
| loz | Lozi |
| lu | Luba-Katanga |
| lua | Luba-Lulua |
| lui | Luiseno |
| smj | Lule Sami |
| lun | Lunda |
| luo | Luo |
| lus | Lushai |
| lb | Luxembourgish |
| lb-LU | Luxembourgish, Luxemburg |
| mk | Macedonian |
| mk-MK | Macedonian, North Macedonia |
| mad | Madurese |
| mag | Magahi |
| mai | Maithili |
| mak | Makasar |
| mak-Bugi | Makasar(Buginese) |
| mak-Latn | Makasar(Latin) |
| mg | Malagasy |
| ms | Malay |
| ms-Arab-MY | Malay, Malaysia(Arabic) |
| ml | Malayalam |
| ml-Arab | Malayalam(Perso-Arabic) |
| ml-IN | Malayalam, India |
| ml-Arab-IN | Malayalam, India(Perso-Arabic) |
| ml-Mlym-IN | Malayalam, India(Malayalam) |
| ml-Mlym | Malayalam(Malayalam) |
| ms-Arab | Malay(Perso-Arabic) |
| ms-BN | Malay, Brunei |
| ms-Latn-BN | Malay, Brunei(Latin) |
| ms-Latn | Malay(Latin) |
| ms-MY | Malay, Malaysia |
| ms-Latn-MY | Malay, Malaysia(Latin) |
| mt | Maltese |
| mt-MT | Maltese, Malta |
| mnc | Manchu |
| mdr | Mandar |
| man | Mandingo |
| mni | Manipuri |
| mno | Manobo Language |
| gv | Manx |
| gv-GB | Manx, United Kingdom |
| mi | Maori |
| mi-NZ | Maori, New Zealand |
| mr | Marathi |
| mr-IN | Marathi, India |
| chm | Mari |
| mh | Marshallese |
| mwr | Marwari |
| mas | Masai |
| myn | Mayan Language |
| men | Mende |
| mic | Micmac |
| min | Minangkabau |
| mwl | Mirandese |
| moh | Mohawk |
| mdf | Moksha |
| mo | Moldavian |
| mo-MD | Moldavian, Moldova |
| lol | Mongo |
| mn | Mongolian |
| mn-CN | Mongolian, China |
| mn-Mong-CN | Mongolian, China(Mongolian) |
| mn-Cyrl | Mongolian(Cyrillic) |
| mn-MN | Mongolian, Mongolia |
| mn-Cyrl-MN | Mongolian, Mongolia(Cyrillic) |
| mn-Mong | Mongolian(Mongolian) |
| mkh | Mon-Khmer Language |
| mos | Mossi |
| mul | Multiple Languages |
| mun | Munda Language |
| nah | Nahuatl |
| na | Nauru |
| nv | Navajo |
| nd | North Ndebele |
| nr | South Ndebele |
| nr-ZA | South Ndebele, South Africa |
| ng | Ndonga |
| nap | Neapolitan |
| new | Newari |
| ne | Nepali |
| ne-IN | Nepali, India |
| ne-NP | Nepali, Nepal |
| nia | Nias |
| nic | Niger-Kordofanian Language |
| ssa | Nilo-Saharan Language |
| niu | Niuean |
| nqo | N’Ko |
| nog | Nogai |
| zxx | No linguistic content |
| nai | North American Indian Language |
| frr | Northern Frisian |
| se | Northern Sami |
| se-FI | Northern Sami, Finland |
| se-NO | Northern Sami, Norway |
| no | Norwegian Bokmål |
| no-NO | Norwegian, Norway |
| nb | Norwegian Bokmål |
| nb-NO | Norwegian Bokmål, Norway |
| nn | Norwegian Nynorsk |
| nn-NO | Norwegian Nynorsk, Norway |
| nub | Nubian Language |
| nym | Nyamwezi |
| nyn | Nyankole |
| nyo | Nyoro |
| nzi | Nzima |
| oc | Occitan |
| oc-FR | Occitan, France |
| oj | Ojibwa |
| or | Oriya |
| or-IN | Oriya, India |
| om | Oromo |
| om-ET | Oromo, Ethiopia |
| om-KE | Oromo, Kenya |
| osa | Osage |
| os | Ossetic |
| os-Cyrl | Ossetic(Cyrillic) |
| os-Latn | Ossetic(Latin) |
| oto | Otomian Language |
| pal | Pahlavi |
| pau | Palauan |
| pi | Pali |
| pi-Deva | Pali(Devanagari) |
| pi-Sinh | Pali(Sinhala) |
| pi-Thai | Pali(Thai) |
| pam | Pampanga |
| pam-IN | Pampanga, India |
| pag | Pangasinan |
| pa-Arab | Punjabi(Perso-Arabic) |
| pa-Deva | Punjabi(Devanagari) |
| pa-Guru | Punjabi(Gurmukhi) |
| pa-Deva-IN | Punjabi, India(Devanagari) |
| pa-Guru-IN | Punjabi, India(Gurmukhi) |
| pa-Arab-PK | Punjabi, Pakistan(Perso-Arabic) |
| pa-Deva-PK | Punjabi, Pakistan(Devanagari) |
| pap | Papiamento |
| paa | Papuan Language |
| nso | Northern Sotho |
| nso-ZA | Northern Sotho, South Africa |
| fa | Persian |
| fa-AF | Persian, Afghanistan |
| fa-Arab | Persian(Perso-Arabic) |
| fa-Cyrl | Persian(Cyrillic) |
| fa-IR | Persian, Iran |
| phi | Philippine Language |
| pon | Pohnpeian |
| pl | Polish |
| pl-PL | Polish, Poland |
| pt | Portuguese |
| cpp | Portuguese-based Creole or Pidgin |
| pt-AO | Portuguese, Angola |
| pt-BR | Portuguese, Brazil |
| pt-PT | Portuguese, Portugal |
| pt-MZ | Portuguese, Mozambique |
| pra | Prakrit Language |
| pa | Punjabi |
| pa-PK | Punjabi, Pakistan |
| ps | Pushto |
| ps-AF | Pushto, Afghanistan |
| ps-Arab | Pushto(Perso-Arabic) |
| qu | Quechua |
| qu-PE | Quechua, Peru |
| raj | Rajasthani |
| raj-Arab | Rajasthani(Perso-Arabic) |
| raj-Deva | Rajasthani(Devanagari) |
| rap | Rapanui |
| rar | Rarotongan |
| roa | Romance Language |
| ro | Romanian |
| ro-MD | Romanian, Moldova |
| ro-RO | Romanian, Romania |
| rm | Romansh |
| rom | Romany |
| rn | Rundi |
| ru | Russian |
| ru-BY | Russian, Belarus |
| ru-CY | Russian, Cyprus |
| ru-EE | Russian, Estonia |
| ru-MD | Russian, Moldova |
| ru-LV | Russian, Latvia |
| ru-LT | Russian, Lithuania |
| ru-RU | Russian, Russia |
| ru-UA | Russian, Ukraine |
| ru-KZ | Russian, Kazakhstan |
| sal | Salishan Language |
| sam | Samaritan Aramaic |
| sam-Syrc | Samaritan Aramaic(Syriac) |
| smi | Sami Language |
| sm | Samoan |
| sad | Sandawe |
| sg | Sango |
| sa | Sanskrit |
| sa-IN | Sanskrit, India |
| sat | Santali |
| sat-Beng | Santali(Bengali) |
| sat-Deva | Santali(Devanagari) |
| sat-Latn | Santali(Latin) |
| sat-Orya | Santali(Oriya) |
| sc | Sardinian |
| sas | Sasak |
| sco | Scots |
| sel | Selkup |
| sem | Semitic Language |
| sr | Serbian |
| sr-BA | Serbian, Bosnia and Herzegovina |
| sr-Cyrl-BA | Serbian, Bosnia and Herzegovina(Cyrillic) |
| sr-Latn-BA | Serbian, Bosnia and Herzegovina(Latin) |
| sr-Cyrl | Serbian(Cyrillic) |
| sr-Latn | Serbian(Latin) |
| sr-XK | Serbian, Kosovo |
| sr-ME | Serbian, Montenegro |
| sr-Cyrl-ME | Serbian, Montenegro(Cyrillic) |
| sr-Latn-ME | Serbian, Montenegro(Latin) |
| sr-RS | Serbian, Serbia |
| sr-CS | Serbian, Serbia and Montenegro |
| sr-Cyrl-CS | Serbian, Serbia and Montenegro(Cyrillic) |
| sr-Latn-CS | Serbian, Serbia and Montenegro(Latin) |
| sr-Cyrl-RS | Serbian, Serbia(Cyrillic) |
| sr-Latn-RS | Serbian, Serbia(Latin) |
| sh | Serbo-Croatian |
| sh-BA | Serbo-Croatian, Bosnia and Herzegovina |
| sh-ME | Serbo-Croatian, Montenegro |
| sh-CS | Serbo-Croatian, Serbia and Montenegro |
| srr | Serer |
| srr-Arab | Serer(Perso-Arabic) |
| srr-Latn | Serer(Latin) |
| shn | Shan |
| sn | Shona |
| ii | Sichuan Yi |
| ii-CN | Sichuan Yi, China |
| ii-Yiii-CN | Sichuan Yi, China(Yi) |
| ii-Yiii | Sichuan Yi(Yi) |
| scn | Sicilian |
| sid | Sidamo |
| sid-ET | Sidamo, Ethiopia |
| sid-Ethi | Sidamo(Ethiopic) |
| sid-Latn | Sidamo(Latin) |
| sgn | Sign Language |
| bla | Siksika |
| sd | Sindhi |
| sd-Arab | Sindhi(Perso-Arabic) |
| sd-Deva | Sindhi(Devanagari) |
| sd-Guru | Sindhi(Gurmukhi) |
| si | Sinhala |
| si-LK | Sinhala, Sri Lanka |
| sit | Sino-Tibetan Language |
| sio | Siouan Language |
| sms | Skolt Sami |
| den | Slave |
| sla | Slavic Language |
| sk | Slovak |
| sk-SK | Slovak, Slovakia |
| sl | Slovenian |
| sl-SI | Slovenian, Slovenia |
| sog | Sogdien |
| so | Somali |
| so-Arab | Somali(Perso-Arabic) |
| so-DJ | Somali, Djibouti |
| so-ET | Somali, Ethiopia |
| so-KE | Somali, Kenya |
| so-SO | Somali, Somalia |
| son | Songhai |
| snk | Soninke |
| snk-Arab | Soninke(Perso-Arabic) |
| snk-Latn | Soninke(Latin) |
| wen | Sorbian Language |
| st | Southern Sotho |
| st-LS | Southern Sotho, Lesotho |
| st-ZA | Southern Sotho, South Africa |
| sai | South American Indian Language |
| alt | Southern Altai |
| sma | Southern Sami |
| es | Spanish |
| es-001 | Spanish, World |
| es-419 | Spanish, Latin America |
| es-AD | Spanish, Andorra |
| es-AR | Spanish, Argentina |
| es-BO | Spanish, Bolivia |
| es-CL | Spanish, Chile |
| es-CO | Spanish, Colombia |
| es-CR | Spanish, Costa Rica |
| es-DO | Spanish, Dominican Republic |
| es-EC | Spanish, Ecuador |
| es-ES | Spanish, Spain |
| es-GB | Spanish, United Kingdom |
| es-GT | Spanish, Guatemala |
| es-HN | Spanish, Honduras |
| es-IB | Spanish, Balearic Islands |
| es-IC | Spanish, Canary Islands |
| es-MX | Spanish, Mexico |
| es-NI | Spanish, Nicaragua |
| es-PA | Spanish, Panama |
| es-PE | Spanish, Peru |
| es-PT | Spanish, Portugal |
| es-PR | Spanish, Puerto Rico |
| es-PY | Spanish, Paraguay |
| es-SV | Spanish, El Salvador |
| es-US | Spanish, United States |
| es-UY | Spanish, Uruguay |
| es-VE | Spanish, Venezuela |
| srn | Sranan Tongo |
| suk | Sukuma |
| sux | Sumerian |
| su | Sundanese |
| su-Arab | Sundanese(Perso-Arabic) |
| su-Java | Sundanese(Javanese) |
| su-Latn | Sundanese(Latin) |
| sus | Susu |
| sus-Arab | Susu(Perso-Arabic) |
| sus-Latn | Susu(Latin) |
| sw | Swahili |
| sw-KE | Swahili, Kenya |
| sw-TZ | Swahili, Tanzania |
| ss | Swati |
| ss-ZA | Swati, South Africa |
| ss-SZ | Swati, Swaziland |
| sv | Swedish |
| sv-FI | Swedish, Finland |
| sv-SE | Swedish, Sweden |
| gsw | Swiss German |
| gsw-CH | Swiss German, Switzerland |
| syr | Syriac |
| syr-Cyrl | Syriac(Cyrillic) |
| syr-SY | Syriac, Syria |
| syr-Syrc | Syriac(Syriac) |
| syr-Cyrl-SY | Syriac, Syria(Cyrillic) |
| tl | Tagalog |
| tl-PH | Tagalog, Philippines |
| ty | Tahitian |
| tai | Tai Language |
| tg | Tajik |
| tg-Arab | Tajik(Perso-Arabic) |
| tg-Cyrl | Tajik(Cyrillic) |
| tg-Latn | Tajik(Latin) |
| tg-TJ | Tajik, Tajikistan |
| tg-Arab-TJ | Tajik, Tajikistan(Perso-Arabic) |
| tg-Cyrl-TJ | Tajik, Tajikistan(Cyrillic) |
| tg-Latn-TJ | Tajik, Tajikistan(Latin) |
| tmh | Tamashek |
| tmh-Arab | Tamashek(Perso-Arabic) |
| tmh-Latn | Tamashek(Latin) |
| tmh-Tfng | Tamashek(Tifinagh) |
| ta | Tamil |
| ta-IN | Tamil, India |
| tt | Tatar |
| tt-Cyrl | Tatar(Cyrillic) |
| tt-Latn | Tatar(Latin) |
| tt-RU | Tatar, Russia |
| tt-Cyrl-RU | Tatar, Russia(Cyrillic) |
| tt-Latn-RU | Tatar, Russia(Latin) |
| te | Telugu |
| te-IN | Telugu, India |
| ter | Tereno |
| tet | Tetum |
| th | Thai |
| th-TH | Thai, Thailand |
| bo | Tibetan |
| bo-CN | Tibetan, China |
| bo-IN | Tibetan, India |
| tig | Tigre |
| tig-ER | Tigre, Eritrea |
| ti | Tigrinya |
| ti-ER | Tigrinya, Eritrea |
| ti-ET | Tigrinya, Ethiopia |
| tem | Timne |
| tiv | Tiv |
| tli | Tlingit |
| tkl | Tokelau |
| tpi | Tok Pisin |
| tog | Nyasa Tonga |
| tog-TO | Nyasa Tonga, Tonga |
| to | Tonga |
| tsi | Tsimshian |
| tsi-ZA | Tsimshian, South Africa |
| ts | Tsonga |
| tn | Tswana |
| tn-ZA | Tswana, South Africa |
| tum | Tumbuka |
| tup | Tupi Language |
| tr | Turkish |
| tr-TR | Turkish, Turkey |
| tr-CY | Turkish, Cyprus |
| tk | Turkmen |
| tk-Arab | Turkmen(Perso-Arabic) |
| tk-Cyrl | Turkmen(Cyrillic) |
| tk-Latn | Turkmen(Latin) |
| tvl | Tuvalu |
| tyv | Tuvinian |
| tw | Twi |
| kcg | Tyap |
| kcg-NG | Tyap, Nigeria |
| udm | Udmurt |
| udm-Cyrl | Udmurt(Cyrillic) |
| udm-Latn | Udmurt(Latin) |
| uga | Ugaritic |
| ug | Uyghur |
| ug-Arab | Uyghur(Perso-Arabic) |
| ug-CN | Uyghur, China |
| ug-Arab-CN | Uyghur, China(Perso-Arabic) |
| ug-Cyrl-CN | Uyghur, China(Cyrillic) |
| ug-Latn-CN | Uyghur, China(Latin) |
| ug-Cyrl | Uyghur(Cyrillic) |
| ug-Latn | Uyghur(Latin) |
| uk | Ukrainian |
| uk-CZ | Ukrainian, Czech Republic |
| uk-HU | Ukrainian, Hungary |
| uk-SK | Ukrainian, Slovakia |
| uk-PL | Ukrainian, Poland |
| uk-UA | Ukrainian, Ukraine |
| umb | Umbundu |
| mis | Miscellaneous Language |
| und | Unknown Language |
| hsb | Upper Sorbian |
| ur | Urdu |
| ur-Arab | Urdu(Perso-Arabic) |
| ur-IN | Urdu, India |
| ur-PK | Urdu, Pakistan |
| uz | Uzbek |
| uz-AF | Uzbek, Afghanistan |
| uz-Arab-AF | Uzbek, Afghanistan(Perso-Arabic) |
| uz-Arab | Uzbek(Perso-Arabic) |
| uz-Cyrl | Uzbek(Cyrillic) |
| uz-Latn | Uzbek(Latin) |
| uz-UZ | Uzbek, Uzbekistan |
| uz-Cyrl-UZ | Uzbek, Uzbekistan(Cyrillic) |
| uz-Latn-UZ | Uzbek, Uzbekistan(Latin) |
| vai | Vai |
| ve | Venda |
| ve-ZA | Venda, South Africa |
| vi | Vietnamese |
| vi-VN | Vietnamese, Vietnam |
| vo | Volapük |
| vot | Votic |
| wak | Wakashan Language |
| wal | Walamo |
| wal-ET | Walamo, Ethiopia |
| wa | Walloon |
| war | Waray |
| was | Washo |
| cy | Welsh |
| cy-GB | Welsh, United Kingdom |
| fy | Western Frisian |
| wo | Wolof |
| wo-Arab | Wolof(Perso-Arabic) |
| wo-Latn | Wolof(Latin) |
| wo-SN | Wolof, Senegal |
| wo-Arab-SN | Wolof, Senegal(Perso-Arabic) |
| wo-Latn-SN | Wolof, Senegal(Latin) |
| xh | Xhosa |
| xh-ZA | Xhosa, South Africa |
| xog | Lusoga Bantu, Uganda |
| sah | Sakha |
| yao | Yao |
| yap | Yapese |
| yi | Yiddish |
| yi-Hebr | Yiddish(Hebrew) |
| yo | Yoruba |
| yo-NG | Yoruba, Nigeria |
| ypk | Yupik Language |
| znd | Zande |
| zap | Zapotec |
| zza | Zaza |
| zen | Zenaga |
| za | Zhuang |
| zf | Chinese(Traditional) |
| zu | Zulu |
| zu-ZA | Zulu, South Africa |
| zun | Zuni |

#### Language Access

Managers, developers, and designers have access to all languages by default, but a translator's language access can be defined in their [profile](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) or when [invited](https://support.phrase.com/document/preview/70466#UUID-9c9dc360-8c12-1fb7-ec5f-88b6fd64e079) to an organization. Languages assigned through language access apply to all of a translator’s projects simplifying the process of adding a translator. If a project requires more granular access (e.g. multiple languages using the same ISO locale code), translator access can be overwritten at the [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") level.

Assigned languages are presented on the profile of any user listed on the Users page.

To modify translator user rights at the project level, from a project page, click ![Edit Members](https://support.phrase.com/hc/article_attachments/30682430414236) to open the Edit members of this project window and change the rights of the required users.

---

### Quality Assurance (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5820046486684-Quality-Assurance-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:36:12Z  
> Labels: Linguist, Quality Assurance, Project Manager, 2BTr, ar_strings

#### Available for

- All paid plans

#### Available for

- Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

The Quality Assurance (QA) feature allows to improve the overall translation quality by making sure that translators follow the syntax and key specifications.

In case of a violation, notifications are immediately displayed in the Quality assurance tab of the project page. Click on this tab to list all QA issues which have been found for the current project.

Use the drop-down menus at the top left of the issue list to filter QA issues by language locales or specific QA check types. To get more details and context about each listed QA issue, simply click on its name or select Editor on the right side of the list: the translation editor will be open to display relevant key information.

To ignore one of the listed issues, click on Dismiss on the right side of the list. To ignore all listed issues, click on Dismiss all at the top right of the list.

#### Setting up QA checks

There are three QA check features available:

- Length validation:

  This feature prevents translators from surpassing the maximum character limit that is set for a key. If there is a limit set, the amount of characters left for the translation will be shown in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).
- Placeholder usage:

  This feature allows to check if translators are using [placeholders](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-6ae7afb1-7b67-95a6-95b4-8c2e53df157e "Placeholders (Strings)") correctly, or if there are any placeholders not used or used incorrectly.
- Term base usage:

  This feature allows to check if the [terms](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503) defined for the project are being used for translations.

To edit settings for each of the above QA checks, follow these steps:

1. From the Quality assurance tab of the project page, click on Settings at the top left to display the QA settings page.
2. Use the options provided on the right of the page to apply each QA check in either moderate mode, or in strict mode:

   - When the Moderate mode is activated, users will still be able to save translations and violations will be shown in the QA issues list
   - When the Strict mode is activated, users will no longer be able to save translations violating rules through the translation editor, though violations will also be shown in the issues list
3. Use the options provided on the right of the page to specify the project languages to which the QA check should be applied:

   - If All languages is selected, the QA check is applied to all languages in the current project
   - If Selected languages is enabled, the QA check is applied only to the specific locales selected from the relevant drop-down menu
4. Click Save to apply the QA settings

The default settings for all QA checks are Moderate mode and All languages.

---

### Notifications (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5821056541340-Notifications-Strings  
> Zuletzt aktualisiert: 2026-06-01T12:43:21Z  
> Labels: 2BTr, ar_strings

Notifications communicate to team members what goes on within a project. Subscriptions can be made to specific events and generate notifications in the application and optionally by email.

System notifications providing updates about assigned jobs cannot be disabled.

Notifications are managed in the Notifications tab on the User page (click the user profile in the top right corner, select settings ![Settings](https://support.phrase.com/hc/article_attachments/30682430485788) and click profile ![Profile](https://support.phrase.com/hc/article_attachments/30682475304604)). Select events to trigger notifications and which projects to be followed. If necessary, use the search box at the top of the project list to quickly find and select specific projects for notifications. Available projects in the list are sorted alphabetically.

Frequency of email notifications can also be selected from the Send emails... dropdown list.

A link is provided in every in-app notification that will go to the part of the application that the event occurred in. Going to the event marks the notification as being read.

---

### Machine Translation (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5821202515996-Machine-Translation-Strings  
> Zuletzt aktualisiert: 2026-09-28T06:27:45Z  
> Labels: Machine Translation, 2BTr, ar_strings

Machine translation (MT) is typically used in [pre-translation](https://support.phrase.com/hc/en-us/articles/5822187934364#UUID-55adb404-b991-7320-537c-8162f9fe7c11). In Phrase Strings, it is possible to use machine translation through [Phrase Language AI](https://support.phrase.com/hc/en-us/articles/5709660879516#UUID-b0d64b4f-fa01-f7c3-006a-40e0ee0dedd2), the recommended machine translation provider within the Phrase Platform.

If using Phrase Language AI, [MT glossaries](https://support.phrase.com/hc/en-us/articles/5709675486876#UUID-7e625233-8ae7-ac05-e4b6-a82056604355) are supported and can be [populated with term bases](https://support.phrase.com/hc/en-us/articles/10112337656476#UUID-a74735ac-db49-c568-84a6-3dfa2fb9baaf) available in Phrase Strings. Non-translatable tags and [placeholders](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-6ae7afb1-7b67-95a6-95b4-8c2e53df157e "Placeholders (Strings)") are also supported.

##### Note

The configuration of Phrase Language AI engines and MT glossaries is managed in Phrase TMS.

If Phrase Language AI is the default MT provider, pre-translation errors may indicate a language pair that none of the enabled engines support. Check the Phrase Language AI page in Phrase TMS to confirm the enabled engines cover the language pair being translated.

[AI Translation Agent](https://support.phrase.com/hc/en-us/articles/20660272640284#UUID-d2f83c62-3868-1bfe-75ae-b32b718706c9) is also available as a GenAI-powered alternative to standard machine translation. It pre-translates using translation memories, term bases, and any style guide assigned to the project, then reviews and refines its own output before delivering the translation.

##### Note

AI Translation Agent is used only for batch pre-translation in Phrase Strings. The editor's live suggestion sidebar always shows suggestions from Phrase Language AI, even for language pairs configured to use AI Translation Agent.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/3yfjZYlurPo)

Integrations with the following third-party MT engine providers are also available: Google Translate, Amazon Translate, and Microsoft Translator.

Machine translation is always run on the [default locale](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") set for the project. If a different locale has been set up for a specific source language, MT will not be applied to it.

##### Important

DeepL Translate was removed on **June 30, 2026**.

#### Configuration

To configure MT for a project, follow these steps:

1. From a project page, select More/Project settings and click the Advanced tab in the project settings window. Select Enable machine translation and click Save.

   ![project_settings.gif](https://support.phrase.com/hc/article_attachments/30682493182876)

   MT has been enabled for the project.
2. From the user profile dropdown menu, select Settings/Organization.

   The Account page opens.
3. Select the Machine translation tab.

   A table of language pairs is presented and a dropdown list of default providers.

   Remaining MT characters from the monthly allowance shared by all MT providers (other than Phrase Language AI) is also presented.
4. Select a Default Service for all language pairs.

   - Phrase Language AI

     Consumes [Machine Translation Units (MTUs)](https://support.phrase.com/hc/en-us/articles/11530492252444#UUID-3c8ba1b3-290a-5451-ba45-71797af5a755) from the Phrase [Platform subscription allowance](https://support.phrase.com/hc/en-us/articles/13872357395228#UUID-77729fa2-a37d-6ee7-c3a0-cba548b0384d) on capacity-based plans, and credits from the credit pool on credit-based plans.

     - Choose MT autoselect to automatically find the optimal engine for each translation based on its domain and language pair.
     - Alternatively, select one of the available MT profiles preconfigured in Phrase Language AI.

       The MT profile configuration defines which MT engines and MT glossaries will be applied to the translation process.
   - [AI Translation Agent](https://support.phrase.com/hc/en-us/articles/20660272640284#UUID-d2f83c62-3868-1bfe-75ae-b32b718706c9)

   ### Note

   Language mapping is based on language codes, not language names.

   For example, if a language is labeled English (en) but its code is `en-US`, mapping `en-US` to the target language instead of `en` ensures proper functionality.
5. Optionally, select a preferred MT provider for each individual language pair in the table:

   - If Phrase Language AI is selected, the optimal MT engine for the specific language pair is automatically selected by Phrase Language AI.
   - If Phrase Language AI has been set as Default Service with an MT profile selected, the preferred third-party MT provider will be used as long as it is available in the MT profile.

MT will be available in the [editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa) for specified language pairs in the selected project. MT provider logo is displayed in the key card to indicate strings that are machine translated.

Language pairs can be added or removed from the table if required.

---

### Localization Files (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822143476252-Localization-Files-Strings  
> Zuletzt aktualisiert: 2026-06-15T10:08:57Z  
> Labels: 2BTr, ar_strings

Localization files are text files that can be opened and edited in a text editor such as Notepad or TextEdit or one of the myriad enhanced text editing tools used by programmers. These files generally follow the key-value principle. This means that they contain a list of text snippets (strings) that are associated with unique IDs (keys). Each string is thus a *value* of a key (This simple example is the format of localization files used in Java programming.):

- key1 = value1
- key2 = value2
- ...
- keyN = valueN

#### Creation of localization files

Localization files are plain-text files with a simple structure. They can be manually created but are usually automatically generated by internationalization utilities or scripts that are available for different development environments. The automatic creation of localization files ensures that file structures are valid.

To create a localization file, all pieces of displayable text are replaced with unique IDs in the code files. The text strings are then added to the localization file with their IDs.

#### Use of localization files

Instead of the actual text strings, the code now contains only keys. When the software generates a view for the user, these keys are used to look up the associated strings in the localization file.

If an application is set up to be used in English and Spanish, all English text may be kept in a file called `English.txt` and is the default text location. If a user does not select a language, all text will be pulled from this file to generate any display. If the user selects Spanish, the software is redirected to `Spanish.txt`. Many languages can be used with a system like this.

The advantage is that the choice of language for the display does not affect the code. If the software needs to display a login button, it may require the string associated with the key `login_button` and only needs to know in which file to look to retrieve the appropriate string for the given language.

#### String management

As a key-based translation platform, Phrase supports many different resource file types. After [files are uploaded](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9 "Uploading and Downloading Localization Files (Strings)"), the [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") and their associated string values are extracted. The keys and strings are then presented to the translator in a standardized format. Translators focus on their task without having to worry about the exact format of the localization file. They can inspect the keys, because the key itself can provide crucial context and guide them to correct word choices.

When all strings are translated, files are downloaded. In the process, the needed localization file format are created that match the original source file.

#### Resource [file formats](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc)

Four broad types of resources are supported and are all essentially text based and can be opened and inspected in a text editor.

##### Spreadsheets

.XLSX and .CSV files are supported. These formats are equivalent for localization purposes and contain rows of key-value pairs. The keys are in one row, while the corresponding values are in an adjacent row. Which exact column is used for which purpose depends on the application, and a localizer needs to configure Phrase to interpret the columns correctly. ZenDesk .CSV files have a fixed structure, so this file type does not require further adjustments:

```
"Title","Default language","Default text","English text","Variant status"
"simple_key","German","Einfacher Schlüssel.","Simple key.","Current"
```

##### XML

XML is a format that offers meta information in the form of `<tags>`. The tag structure is used to determine where the keys and their corresponding values are, as shown here from an Android XML file:

```
 <string name="simple_key">Just a  key with a message.</string>
```

Two standard XML translation formats are .TMX and .XLIFF. These do not only hold keys and values in one language but also associate value pairs from a source language with corresponding values from a target language. Such files are typically bilingual, as this translation unit in a Symfony Xliff file shows:

```
<trans-unit id="simple_key" resname="simple_key">
 <source xml:lang="de-DE">Nur ein einfacher Schlüssel mit einer einfachen Nachricht.</source
<target xml:lang="en-GB">Just a simple key with a simple message.</target>
</trans-unit>
```

QT programs use resource files with a structure that is very similar to these standardized formats, but for historical reasons have a different layout.

##### Plain key-value lists

There are resource files that contain just simple listings of keys and values, as this snippet from a Ruby on Rails YAML shows:

```
simple_key: Just a simple key with a simple message.
```

Many different programming languages or platforms use such formats with minor layout differences.

Since these are monolingual files, a localization program needs to maintain parallel versions of such files - one for the source language and others for the target languages.

Gettext produces key-value files containing additional information, such as descriptive comments or plural variants:

```
# This is the amazing description for this key!
msgid "key_with_description"
msgid_plural ""
msgstr[0] "Check it out! This key has a description! (At least in some formats)"
msgstr[1] "Check it out! This key has %s descriptions! (At least in some formats)"
```

There are competing formats with similar functionality and layouts that vary in relatively minor ways.

##### Associative arrays

While other formats require customized code (parsers) to read them, some formats are easier for developers and localizers. Formats based on .JSON (JavaScript) and .PHP arrays can be read and map directly into common code structures (arrays) that are easy to manipulate. Arrays can be complex and different applications generate custom array structures.

For example, go-i18n JSON refers to keys as `id`:

```
{
    "id": "simple_key",
    "translation": "simple key, simple message, so simple."
},
```

Angular uses the keys themselves as keys in its arrays:

```
"simple_key": "I am a simple key with a simple message.".
```

Since there are these minor but crucial differences, widely-used .JSON and .PHP Array structures are supported.

---

### Uploading and Downloading Localization Files (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822143502620-Uploading-and-Downloading-Localization-Files-Strings  
> Zuletzt aktualisiert: 2026-08-21T06:26:49Z  
> Labels: Project Manager, 2BTr, ar_strings

#### Uploading Localization Files

When uploading a file into a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)"), all new resources are extracted from that file and stored in a project. The uploaded file's format does not have to be the initial format set up for the project. If tags are provided for grouping resources, new keys will have those tags applied.

Some formats, such as Gettext, provide additional valuable meta information such as comments, descriptions, or information about plural forms. This information is extracted when and wherever possible and is stored along with assigned resources, allowing all valuable information provided in localization files to be saved for further use.

There are several methods for uploading files:

- In the [application](https://support.phrase.com#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9_UUID-592a7b62-06fe-3120-ab9d-28ed54d4401d "Upload files via user interface"), when creating a new project or by selecting Upload file in a project page
- via [API](https://developers.phrase.com/api/#tag--Uploads)
- via [CLI](https://developers.phrase.com/api/#tag--Uploads)

When uploading via API or CLI, for file formats that include multiple locales in a single file (e.g., Phrase Strings .JSON , .YAML, multilingual .XLSX/.CSV, .XLIFF, .TMX, Genesys JSON), each translation's locale identifier in the file is matched to a project locale by language name, exactly as configured on the project's Languages tab. Locale codes (e.g. "en-US") are not used for this matching unless that exact string is also the locale's configured name. If a translation's locale identifier doesn't match any locale name in the project, its translations will silently fail to import.

##### Upload Options

- Update translations

  By default, only new content is extracted and any existing keys in a localization project are not deleted or updated; no data can be lost by uploading files. If overwriting existing data is required, replace the project resources with content from the localization file by selecting the Update translations option. Existing translations will be overwritten with the content of the uploaded localization file.

  This option is also available in the API.

  ### Note

  To prevent data loss, ensure the latest changes are downloaded from Phrase to the localization file before changing it and uploading it again with the Update translations option.
- Use Translation Key Prefix

  Enter a unique identifier (e.g. the file path) to prepend to the uploaded translation key names. Use a meaningful prefix related to the project or file to keep key names organized.

  For example, an imported key `hello_world` with the prefix `project_` will result in the key `project_hello_world`.

  The translation key prefix ensures that keys are matched against existing ones to avoid collisions across different projects or files.

  This option is also available in the API and CLI interface.
- Create and update translation keys

  Add new keys and overwrite existing ones with the content from the uploaded file.
- Update translation on source match

  Update target translations only if the existing source text in the project’s default language matches the source text in the uploaded multilingual file.
- Update descriptions

  Select this option if updating all descriptions of the keys from the uploaded file is required. Empty descriptions will overwrite existing ones. Descriptions can contain any additional information for translators and help identify individual keys in the [editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).
- Skip upload [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-c0b7ebe8-3c26-b066-abfd-a86fab1026b4 "Tags (Strings)")

  To keep translations organized, add multiple tags to keys with meaningful labels. Select this option to prevents new keys being automatically tagged with an upload-tag.
- Tag keys of new and updated translations

  Select this option to tag new keys and keys with updated translations automatically upon upload. This will help in distinguishing between new, updated, and old translation strings, ensuring that only the relevant keys are processed further.

  This option is also available in the API.
- Encoding

  Specify the encoding (e.g. UTF-8) of file or have it automatically selected (automatically selected encoding may result in incorrect encoding and can be rolled back by undoing the upload).
- Proofreading

  - Skip unverification prevents the need to verify non-main language translations again when updating translations.
  - Mark as reviewed treats all uploaded translations as reviewed. This option is available when [advanced review workflow](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") has been activated. It indicates that the keys are ready to be sent to production.
  - Verify mentioned translations treats all uploaded translations as verified.

##### Upload files via user interface

To upload files in Strings, follow these steps:

1. Before upload, ensure that the file is formatted correctly based on [type](https://support.phrase.com/hc/en-us/sections/6111343326364).
2. From a project, select Upload file from the More menu.

   The Upload file page opens.
3. Click Choose file, select a file from a directory.

   The selected file is added to the File field.
4. Select a Format for the file.

   Suggested formats are presented first based on file type.
5. Select a language for the file content from the dropdown list.

   If this information is not in the file itself, create a new language for the content or use an existing one.
6. Optionally provide tags to be assigned to the new keys and any other options.
7. Click Save.

   Content is imported and converted to keys.

##### Upload Summary

- **Failed upload**

  If a file could not be processed properly, error details are provided to help mitigate the error.
- **Successful upload**

  After the successful processing of a translation file, a summary page is presented giving an overview of the upload with buttons linking to next steps. Click the upload tag to open the file in the editor.
- **Removing keys**

  To prevent accidental deletion of keys when removing keys from a localization file and uploading it again, those keys are not automatically deleted.

  To remove those keys, follow these steps:

  1. Upload the file.
  2. Click Delete and select Delete unmentioned keys.
  3. Confirm the selection.

  Unmentioned keys are keys that are not included in the current upload but still exist in the project. By deleting them, all keys and associated translations that were not included in the uploaded file are removed from the project.

  The limit for deleting unmentioned keys is 100,000 keys. In projects that exceed this limit, the Delete unmentioned keys option is not available.
- **Undo an upload**

  Every upload triggers multiple actions and can modify a lot of data within projects and it is not possible to retract an upload.

  To remove keys that were (wrongly) introduced by an uploaded file, follow these steps:

  1. From the upload summary of the affected upload, click Delete and select Delete created keys.
  2. Confirm the selection.

  All keys and associated translations created by that upload are removed. Translations for keys that existed prior to the upload will not be removed. To remove individual translations, use the version history for each translation.

##### Upload Archive

From any project page, select Uploads from the More menu to access the upload archive.

The upload archive lists all historical uploads in all possible statuses. Click the All statuses dropdown to filter uploads by status (Success, Failed and/or In progress). To locate a specific upload, use the search box at the top to search by name.

Access detailed upload summaries of affected resources by clicking on a listed upload. All successful uploads are also presented in a project’s activity stream.

#### Downloading Localization Files

Language files can be exported from a project at any point and to any supported [file format](https://support.phrase.com/hc/en-us/sections/6111343326364).

Files can be exported from the application, via [API](https://developers.phrase.com/api/#locales_download), or [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828).

Files can be downloaded from the Languages tab of any project by selecting them and clicking Download (multiple files) or the More options ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682430623900)/Download button of a language.

##### Download Options

Download options are presented when downloading a file in the Download window with tabs for General, Advanced and Encoding.

Selecting different File formats present different options. For more details, refer to the relevant article about the [specific file format](https://support.phrase.com/hc/en-us/articles/9652464547740#UUID-6fa5da83-c3cb-34df-6018-2afa1ab242dc).

Optionally, use the File name field in the General tab to specify a custom export file name, or leave it blank to generate a system-defined name.

- Remove translation key prefix

  If a translation key prefix has been added upon file upload, select this option in the Advanced tab to remove the prefix from the names of the exported translation keys:

  1. Enter the prefix to download all keys, and remove the specified prefix where possible.

     ### Important

     This may create duplicate key names if other keys share the same name after the prefix is removed.
  2. If required, select Use translation key prefix as Filter to download only the translation keys containing the specified prefix, and remove the prefix from the downloaded file.

  This option is also available in the API and the CLI interface.

**Set Translation Ordering on Export**

The Translation ordering on export setting sets the collation used to sort translation keys alphabetically when a project is exported. Two options are available:

- **Default** sorts keys using standard character-based alphabetical order.
- **Natural** sorts keys using natural sort order, so numbers within key names are ordered numerically rather than character by character (for example, `key2` before `key10`).

To change this setting, open Project settings from the More menu on a project page. In the Advanced tab, select Default or Natural from the Translation ordering on export dropdown list, then click Save.

#### Use Cases

##### Maintaining File Structures

By default, translatable resources are stored as keys and values instead of keeping the original file structure. This allows for interchangeable [file formats](https://support.phrase.com/hc/en-us/sections/6111343326364) without being locked into one format as well as flexible grouping using [tags](https://support.phrase.com/hc/en-us/articles/5822598372252#UUID-c0b7ebe8-3c26-b066-abfd-a86fab1026b4 "Tags (Strings)").

Some frameworks or setups require multiple source files also requiring additional configuration.

###### Keeping separate files

In general, keep all translations for each language in one file. This makes resource downloads faster and more robust. Translations are kept organized in projects, so separate small files are not required.

If localization files are required to be maintained in separate files, a file-based workflow can be used by tagging the keys upon upload and using the tags as the reference when downloading translated keys back into the original files. Keys can carry multiple tags and be included in multiple files ensuring reuse and consistency. A tag-based workflow is flexible and allows for the re-organization of translation resources without having to be uploaded to projects.

Give keys unique names across all files to ensure a smooth workflow. In a key-value-based approach, a key must have the same values assigned to it in every context. Some frameworks allow the use of non-unique keys over multiple files. Some formats, such as Symfony, support message domains. These domains are detected by the filename. Keys are not automatically scoped by filename-based domains but this can be resolved by using a unique domain prefix for keys within the file.

###### Example CLI configuration

If working with [CLI](https://support.phrase.com/hc/en-us/articles/5784118494492#UUID-990abb57-f2cd-21c2-286b-66495afac0fa) or connecting a project with a repository (e.g. GitHub, GitLab, or Bitbucket), set up a configuration file to manage uploads and downloads.

For the example, a project has several semantically named translation files for the source locale. For example: `accounts.en.yml`, `emails.en.yml` etc. These semantic names are managed through tags.

Configure the `.phrase.yml` to reflect the organization of the files in localization project and link them to tags in the Strings project by including the tag placeholder in the file path:

```
phrase:
  access_token: "3d7e6598d955bfcab104c45c40af1b9459df5692ac4c28a17793"
  project_id: "23485c9c5dfb15d85b32d9c5f3d2hl54"
  file_format: yml
  push:
    sources:
      - file: ./path/to/locales/<tag>.en.yml
        params:
          locale_id: "abcd1234cdef1234abcd1234cdef1234"
  pull:
    targets:
      # accounts
      - file: ./path/to/locales/accounts.<locale_name>.yml
        params:
          tags: accounts
      # emails
      - file: ./path/to/locales/emails.<locale_name>.yml
        params:
          tags: emails
```

##### Important

While supported, for security reasons, it is not recommended to store access tokens within the file.

Setting a `PHRASE_ACCESS_TOKEN` environmental variable is more secure.

Parameter tags can also be used in the push section instead of using the `<tag>`  placeholder.

The configuration creates keys with tags based on the file they came from when running a push or triggering sync from a repository. When running pull or triggering the export to the repository it groups keys into files based on their tags.

##### Localizing a Project for Different Regions, Clients, or Audiences

A product, website, or app is translated into a number of different languages but in some cases, localization is not just the chosen language, but different versions within one language.

Further distinction is required if:

- A product has a different branding in regions where the same language is spoken.
- A product is used by different clients who want to use a white label solution.
- Language variants such as simple, formal or informal are required.

###### Localizing a static product

If a product is fully developed and rarely updated, a separate version of the product can exist within a project.

- *If a single output or a short-term project:*

  Create a [branch](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)"), work exclusively on that branch for the duration of the project, and delete the branch when complete.
- *If a long-term project:*

  Maintain a duplicate of the existing project. This allows the [inviting and working](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) with clients in the same organization by only providing access to their project(s), leaving other projects hidden to them.

###### Localizing a project with continuous updates

If a product is constantly updated with new content (keys), applying those updates to multiple projects and keeping them synchronized is difficult. Use dedicated languages within a project to maintain them.

[Language codes](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") following the ISO standard (e.g. en-US) don't have to be unique, so many versions of the same language can be [created within a project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30_UUID-cb6d5c9b-6200-9d1f-4e56-75d4514cb9db "Define a Project"). Distinguish between regions, clients, or audiences by using a unique language name.

When setup, any newly introduced key in the default locale would show up as untranslated in the other languages and be localized accordingly. If working with a client and their own translator(s), specifically assign them to only be able to edit their language versions by updating the language access in their [user profile](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) or the project user management.

Set up parallel localization processes with [jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738 "Jobs (Strings)") and [review workflows](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") within the same project. This flexibility also extends to uploading and downloading language files or automated processes via [API](https://developers.phrase.com/api/#overview).

---

### Screenshot Management (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822309698204-Screenshot-Management-Strings  
> Zuletzt aktualisiert: 2026-06-01T12:43:25Z  
> Labels: Project Manager, 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Screenshots are an effective way to improve the quality of translation workflows by providing translators with additional context.

Up to 10 files can be uploaded at a time with a file size limit of 10 MB.

Admin or Project managers can upload screenshots to any project and Developers can upload screenshots to their assigned projects.

Screenshots can be downloaded individually or in a batch. Batched screenshots are provided in a .ZIP file.

Screenshots can be added to keys on [branches](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)").

#### Add a Screenshot to a Project

To add a screenshot to a project, follow these steps:

1. From the More menu on a project page, select Screenshots.

   The screenshots tab opens.
2. Click Add screenshot to access file structures, or drag and drop the screenshot into the tab.

   When uploaded, the screenshot image appears in the list.

#### Add Context and Attach Keys to Screenshots

To add names, descriptions and attach keys to screenshots, follow these steps:

1. Click Edit screenshot for a selected image.

   The screenshot is opened in the screenshot editor.
2. Either click on a text string in the image or click Attach key.

   A resizable and moveable selection box opens on the image with a field for the key name.
3. Provide a key name by either:

   - Selecting from the dropdown list of existing keys.
   - Click ![Create Key](https://support.phrase.com/hc/article_attachments/30682430658844) to open the Create a new key window and provide details for a new key. Click Save to add the key.
4. Optionally, click Detect text to use OCR to identify strings in a screenshot.

   Markers are placed on text found in the image. If the highlighted text matches an existing translation string found in one of the keys in the project, that key is selected and attached.
5. Click Update screenshot to confirm the added keys.

   Screenshots are displayed in key details in the editor and multiple screenshots may be associated with a key.

---

### Placeholders (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822510498332-Placeholders-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:36:18Z  
> Labels: Project Manager, 2BTr, ar_strings

Common placeholder formats that can be used in many localization file formats.

When selecting the correct placeholder format for a project:

- Placeholders are highlighted in the [editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa) window and can be checked and validated for their presence in the translation through [quality assurance](https://support.phrase.com/hc/en-us/articles/5820046486684#UUID-c5ced957-c1d5-4a8d-0ff4-b7bc20689fb1 "Quality Assurance (Strings)").
- Placeholders are automatically escaped when [ordering translations](https://support.phrase.com/hc/en-us/articles/5821933165596#UUID-fb3b4bc4-03aa-4235-b122-64d6d8c4b2d0) and will not be modified by an external translator.

#### Enabling placeholder styles in your project

When creating or editing a project, specify the placeholder formats within the Placeholders tab of the [Project settings](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") window. Select all required format styles and see all matching placeholders highlighted immediately when working within the editor and [In-Context Editor](https://support.phrase.com/hc/en-us/articles/5784095916188#UUID-d83eaf9c-9f90-7a62-b722-c920fec6fbdb).

#### Placeholder conversion

Placeholder conversion attempts to reduce translation workload on multi-platform development. Use placeholder conversion if developing on multiple mobile platforms with the intention of sharing translations between platforms and don’t want to maintain a separate project for each platform. When downloading a locale via the application or API, use the convert placeholder format option. This format option can also be activated in the `.phrase.yml` configuration file. Placeholders in translations are converted to match format specific requirements.

Placeholder conversion is only available for the following localization file formats (placeholder conversion is limited to Android XML and iOS strings string format specifiers (cstyle placeholder style)):

- [Android XML](https://support.phrase.com/hc/en-us/sections/6111343326364)
- [iOS Localizable Strings](https://support.phrase.com/hc/en-us/sections/6111343326364)
- [iOS Localizable Stringsdict](https://support.phrase.com/hc/en-us/sections/6111343326364)

#### Available placeholder formats for highlighting:

| Name | Description | Examples |
| --- | --- | --- |
| Rails i18n | Rails i18n style placeholders | %{count}, %{username} |
| i18next Nesting | [i18next Nesting](https://www.i18next.com/translation-function/nesting) style placeholders | $t(key1), $t(common.{{referencedKey}}) |
| Gettext Python | Gettext placeholders (python-format) | %(count)d, %(username)s, %(foo) |
| C-Style | C-Style format with and without positions | %1$s, %2$d, %d, %@, %1%@, %1$#@file@, %#@file@, %1$i, $%1$.2f, %.0f%, %ld, %c, %hi, %lu |
| Python Strings | Python format strings | {}, {1}, {name} |
| .Net C#-Style | .Net C#-Style format | {0,10:C}, {0}, {1:hh} |
| Simple Message Properties | Simple Java Message Properties | {1}, {count}d, "{brackets}" |
| Laravel | Laravel placeholders beginning with a colon | :name, :NAME, :Name |
| Square Brackets | Placeholder with Square Brackets (BB-Code Style) | [u]abc[/u], [PLACEHOLDER] |
| Single Percentage | Placeholder with single enclosing percentage signs | %abc% |
| Double Percentage | Placeholder with Double Percentages | %%abc%% |
| Emoji | Emoji codes | :sob:, :smile: |
| Dollar Style | Placeholders with opening and closing $ signs. | $bc$, $.abc$, $!abc$, $+abc$, $-abc$, $-+.!abc$ |
| NSIS | Placeholders with starting $ and closing/opening (curly)brackets. | ${StdUtils.TrimStr}, $(StdUtils.TrimStr), ${String} |
| Razor Markup | Placeholder to highlight C# Razor expressions without code blocks | @DateTime.Now, @(DateTime.Now - TimeSpan.FromDays(3)) |
| Double Curly | Placeholders with opening and closing double curly braces, e.g. for use with AngularJS. | {{number}}, {{foo.bar}}, {{username}} |
| Android XLIFF placeholders | Placeholders with opening <xliff:g> and closing </xliff:g>? e.g. for use with AndroidXml. | <xliff:g>%1s</xliff:g>,<xliff:g id\_"star">★</xliff:g> |
| OASIS XLIFF placeholders | Placeholders with closed tag &lt;x id="YOUR\_ID"&gt;, e.g. for use with Angular2. | <x id\_"id" example="name"/>, <x id="id"/> |
| Liquid | Liquid style placeholders | {{count}}, {{username}} |

---

### Tags (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5822598372252-Tags-Strings  
> Zuletzt aktualisiert: 2026-06-15T10:09:00Z  
> Labels: Linguist, Project Manager, 2BTr, ar_strings

Tags can be attached to keys with meaningful labels to always keep them well organized. Generally, tags are useful to track which keys belong to a certain feature or section of a project to allow translating and reviewing more efficiently.

#### Adding tags to a project

Allowed characters for tag names are letters, numbers, and the underscore and dash characters. Tag names with spaces or invalid characters will be normalized by removing the spaces or replacing the invalid character with an underscore.

There are several methods to add new tags to existing projects:

###### Tagging keys upon [file upload](https://support.phrase.com/hc/en-us/articles/5822143502620#UUID-11dc2fa3-8014-b566-a19b-ca5987fb82c9 "Uploading and Downloading Localization Files (Strings)")

Provide a single or multiple tags to the relevant field. Tags are automatically added to all additional keys (or updated) in the uploaded file.

If uploading a [.CSV or .XLSX file](https://support.phrase.com/hc/en-us/sections/6111343326364), tags can be assigned to individual keys via a separate column in the file:

1. Click on the Proceed to preview button in the Upload file page.

   The Preview page is displayed.
2. Select the Tags label from the drop-down menu above the relevant column in the preview.
3. Click on Import at the bottom left to finish uploading the tagged keys.

###### Tagging keys manually

1. From the Keys page of the project, click ![Modify](https://support.phrase.com/hc/article_attachments/30682493386268) for the key requiring tagging.

   The Edit key window opens.
2. Type one or multiple keys in the Tags field.
3. Click on Save to apply the changes.

The same procedure can also be performed in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa) through the Edit key feature.

###### Batch tagging keys

1. From the Keys page of the project, select multiple keys.
2. Type a single or multiple tags in the input field at the top of the key list.
3. Click on Add tags.

   All tags are added to the selection of keys.

The same procedure can also be performed in the [translation editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa) through available batch actions.

###### Adding single tags

Single or multiple tags can also be added without yet assigning them to keys. To add tags, click the Add tag button on the Tags page of the project.

###### Repairing tags

To replace an unwanted tag with a new one and ensure all keys are only in the newly created tag, re-upload the file with the correctly specified tag.

In the UI:

- During upload, select Update translations to overwrite existing data with content from a localization file. Ensure the latest changes are downloaded before uploading again.
- To prevent any keys from being automatically tagged with an `upload-tag`, select Skip upload tags.

In the config file:

- Use the `- update_translations` and `- skip_upload_tags` options.

This will add the new tag to the keys and the unwanted tag can then be removed from the upload using the Add/remove tags [batch action](https://support.phrase.com/hc/en-us/articles/11155504491932#UUID-9e47df02-c977-1821-8bf4-7822442257c6).

#### Managing tags

Use the tags page of the project to manage relevant tags. To enter the tags page, select More/Tags tab from the project page.

The tags page allows to search for tags in the list, filter them by specific types (system or custom) and sort them in various ways.

Click on ![Modify](https://support.phrase.com/hc/article_attachments/30682493386268) at the right of the selected tag to edit its name.

Click on ![Send to Recycle Bin](https://support.phrase.com/hc/article_attachments/30682475506972) at the right of the selected tag to delete it. Use the same option at the top of the tag list to delete a selection of tags.

---

### Branching (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/5856411356316-Branching-Strings  
> Zuletzt aktualisiert: 2026-08-04T06:18:01Z  
> Labels: Administration, Project Manager, 2BTr, ar_strings

#### Available for

- Business and Enterprise plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Branching is used in software version control. Copies of project files called branches allow teams to work on parallel versions of the project at the same time while retaining an unedited copy. This eliminates the risk of accidentally overwriting others’ changes to project files.

The main [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") is copied when a new branch is created with changes being made only to that branch. When changes are complete, the branch is merged back into the main project. Multiple branches can be worked on at the same time and, after merging, branches are automatically deleted. Merged branches remain available in the Merged tab for simplified history tracking. Tags from an existing branch are copied to the new branch.

#### Limitations

- All [roles](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) except Translator and Guest have access to the Branches view.
- Merges cannot be reverted and branches cannot be undeleted.
- [Jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738 "Jobs (Strings)") created in a specific branch are not visible in the main project and vice versa. When a branch is merged into the main project, any open jobs in it are lost.
- Reports in the Reports view reflect only the status of the active branch. Merging a branch into the main project updates the main project reports.
- The Activity view contains only activities in the active branch. Activities in branches are not visible in the main project and vice versa. Activities in a branch are lost when merging it into the main project.
- GitHub Sync can only be used on the main project and not on branches.
- [Comments](https://support.phrase.com/hc/en-us/articles/10235050685084#UUID-5d6dacd9-1db4-e0e0-d1d2-b94256707528) made in a branch are not visible in the main project and vice versa.
- [Orders](https://support.phrase.com/hc/en-us/articles/5821933165596#UUID-fb3b4bc4-03aa-4235-b122-64d6d8c4b2d0) created in a branch are not visible in the main project and vice versa. When a branch is merged into the main project, any open orders in it are lost.
- Translators cannot be restricted to specific branches but are given permission to work on specific [locales](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)"). Translators should be instructed on how to work with branches.

#### Enable Branching

Branching is enabled in the Advanced tab of Project settings with the option to protect the main branch from changes.

When enabled, a branch menu ![Branch Menu](https://support.phrase.com/hc/article_attachments/30682445733404) is presented on the project screen where working branches can be selected. To specify a branch in [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828), use the `--branch` parameter:

```
--branch <branch_name>
```

Branches are listed on the Branches tab of a project, where creation and merging information is presented. Branches can also be deleted or merged and jobs created for that branch from the Branches tab.

To list all branches for project via [API](https://developers.phrase.com/api/) or CLI, run:

```
$ phrase branches list --project_id <project_id>

# e.g.
$ phrase branches list --project_id 1d8ae641902624df63ce6fbd64ff9549$ phrase branches list <project_id>
```

To delete a branch via API or CLI, run:

```
$ phrase branches delete --project_id <project_id> --name <branch_name>

# e.g.
$ phrase branches delete --project_id 1d8ae641902624df63ce6fbd64ff9549 --name test-test$ phrase branch delete <project_id> <branch_name>
```

##### Protect Main Branch

Protect main branch restricts edits to the main project, requiring all changes to be made in a branch instead.

When enabled:

- Locales, keys, and translations cannot be added, edited, or deleted directly in the main project. This restriction applies to the locale resource as a whole, including per-locale configuration such as the assigned [machine translation profile](https://support.phrase.com/document/preview/21505#UUID-8139f165-9c79-2540-f81a-e117c38aad03), not only the locale's name or translations.

  To change a per-locale setting on a protected main project, temporarily disable branch protection, make the change, then re-enable protection.
- File uploads and screenshot management are disabled on the main project.
- A branch must be selected before importing files.
- Automations do not run against the main project.

#### Create a Branch

Admin, Project Manager, Designer and Developer roles can create new branches in the Branches tab, via API or in the CLI. Branches can be created from any other branch, not only the main branch. Up to 5 branch levels are supported.

To create a branch from the UI, follow these steps:

1. From a Project page, select the Branches tab.
2. Click Create branch.

   The Create branch window opens.
3. Provide a name for the branch.
4. Select a Base branch from the list of existing branches.
5. Click Create.

   The new branch is added to the list.

To create a branch via API or CPI, run:

```
$ phrase branches create --project_id <project_id> --data <data>
```

To create a branch when pushing translations, run:

```
$ phrase push --branch <branch_name>
```

#### Sync Branches

Syncing ensures the working branch stays aligned with the latest changes from the branch it originated from. This way, translators can work with an updated version of content also in long-term projects.

To sync a branch with its base branch, follow these steps:

1. In the Branches tab, click Sync with base branch next to the desired branch.

   The Sync page is displayed with information about any conflicts and changes to be synced with the base branch.
2. Click on any of the detected changes to review it before syncing.

   A table with details about the selected change is displayed.
3. Select Sync and confirm to apply the changes.

   The changes are added to the base branch and become visible in the translation editor. Information about the last sync is displayed in the Synced column of the Branches tab.

Branch sync can also be performed via API by running this CLI command:

```
$ phrase branches sync \
  --project_id <project_id> \
  --name <branch_name> \
  --data '{"strategy":"use_main"}' \
  --access_token <token>
```

- `use_branch` resolves conflicts by applying changes from the branch and if not specified is the default.
- `use_main` resolves conflicts by rejecting changes from the branch and refers to the base branch. When working with stacked branches, the base branch is not necessarily the actual main project branch.

#### Merge Branches

After completing translation or version-specific work in a branch, any changes can be merged into the base branch. Once all changes are merged up the chain, the top-level branch can be merged into the main branch.

After a successful merge, the merged branch is automatically deleted and appears in the Merged tab for history tracking.

Only changes to the following resources are applied to the base branch during merges:

- Locales
- Keys
- Translations

Changes to other resources, such as Activities, Jobs, and Orders, are not applied.

Branches with active child branches cannot be merged until the child branches are deleted or merged first.

###### Conflicts

A conflict occurs when a resource (translation, key, or locale) has changed in both the current branch and its base branch after the branch was created or last synced. Conflicts can occur at any level of the branch stack, not only when merging into main.

To merge a branch, follow these steps:

1. From the Branches tab of a project, click Merge with base branch next to the desired branch.

   The Merge page opens. Information about translations to be modified during the merge can be accessed by clicking in the cells.
2. If there are conflicts, select a merge strategy:

   - Select Use Base Branch to reject the conflicting changes and preserve existing translations.
   - Select Use ![Branch Menu](https://support.phrase.com/hc/article_attachments/30682445733404) BranchName to replace existing translations with changes from the branch.
3. Click Merge and confirm to apply the changes.

   The branch is merged to the base branch and deleted automatically. To review merged branch history, open the Merged tab in the Branches page.

To merge a branch via API or CPI, run:

```
$ phrase branches merge \
  --project_id <project_id> \
  --name <name> \
  --data '{"strategy":"use_main"}' \
  --access_token <token>
```

- `use_branch` resolves conflicts by applying changes from the branch and if not specified is the default.
- `use_main` resolves conflicts by rejecting changes from the branch. `use_master` is also supported.

The `merge` action also deletes the merged branch automatically.

#### Push and Pull

When using CLI, specify a branch to push or pull from with the `--branch` parameter.

```
$ phrase push --branch <branch_name>
$ phrase pull --branch <branch_name>
```

If the specified branch does not exist in a project, the client creates it.

Use `--use-local-branch-name` to push and pull using the branch name of an active git branch:

```
$ phrase push --use-local-branch-name
$ phrase pull --use-local-branch-name
```

#### API

All API endpoints that take a project argument also support the `--branch` parameter to perform an action on a specific branch of a project:

```
$ phrase upload create <project_id> \

  --branch <branch_name>

  --file /path/to/my/file.json \

  --file-format json \

  --locale-id abcd1234cdef1234abcd1234cdef1234 \

  --tags awesome-feature,needs-proofreading \

  --locale-mapping "{"en": "2"}" \

  --format-options "{"foo": "bar"}"
```

---

### Deprecation of Legacy Branches in Phrase Strings

> Quelle: https://support.phrase.com/hc/en-us/articles/27213763618844-Deprecation-of-Legacy-Branches-in-Phrase-Strings  
> Zuletzt aktualisiert: 2026-09-28T06:27:50Z  
> Labels: 2BTr

The legacy [branching](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)") feature is being retired, and all existing legacy branches will be either migrated to the current experience or permanently deleted.

The deprecation exclusively affects customer projects that contain active legacy branches. Projects without any legacy branches are not impacted, and no action is necessary.

Legacy branches are identifiable by a visual tag (`v1`) in both the branches table and the [Strings editor](https://support.phrase.com/hc/en-us/articles/5822638157340#UUID-52f5cddb-2b75-2ffe-3f95-87cc2b002bfa).

##### Deprecation timeline

**June 1, 2026:**

- Empty legacy branches that have not been updated in the past 90 days will be permanently deleted.
- The majority of active legacy branches will undergo an [automatic migration](https://support.phrase.com#UUID-a02b462b-207f-c6bd-f760-09cf3f3f9b03_N1776938389875 "Automatic migration") to the new format.

**After June 1, 2026:**

- For a small number of branches that cannot be migrated automatically, the assigned Customer Success representative will contact customers directly to coordinate a [guided migration](https://support.phrase.com#UUID-a02b462b-207f-c6bd-f760-09cf3f3f9b03_N1776938401837 "Guided migration").

##### Migration paths

There are two distinct paths for transitioning branches from legacy to new branching, determined by the technical characteristics of the branch.

###### Automatic migration

Most legacy branches are eligible for automatic migration. This is a backend process that converts the branch to new branching while preserving all data, branch IDs, and existing integrations. This path requires no customer action and causes no disruption to workflows.

###### Guided migration

A small subset of branches requires a guided migration process led by a Customer Success representative. This path is necessary for branches with technical complexities that prevent automatic conversion.

If a branch requires guided migration, certain data cannot be transferred. Review the implications below carefully before the migration date:

- **New Branch ID:** The migrated branch will receive a new, unique ID. All API references, CLI configurations, and other integrations pointing to the old branch ID will need to be updated manually.
- **Data Attribution:** All migrated data will be attributed to the user account that originally created the branch, regardless of which user performed the work.
- ### Important

  **Data Not Migrated:** The following items will not be present in the migrated new branch:

  - Screenshots created within the branch.
  - Comments created within the branch.
  - Specific metadata, such as format annotations or pre-translation flags.
  - Changes made to excluded translations.

If a branch is affected, Phrase will share detailed information about the implications and coordinate a migration date. Phrase will manage the technical aspects of the migration, and no action will be required from the user.

---

### Migrating Content (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/6359431580700-Migrating-Content-Strings  
> Zuletzt aktualisiert: 2026-07-17T06:18:41Z  
> Labels: 2BTr, ar_strings

#### Content Pre-migration

Before migrating content from another tool to Phrase Strings, follow these steps in the previous tool:

1. Clean the content.

   If there are unused and archived [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)") that are no longer needed, consider removing them so that content is clean before migration. Also check for duplicate keys and merge or link them (if the other solution allows it) before the migration.
2. Merge branches.

   If working with [branches](https://support.phrase.com/hc/en-us/articles/5856411356316#UUID-9af9d77b-d8c7-10b5-5f63-679e90dd589f "Branching (Strings)"), complete the pending merges so that the project contains all the latest translations, keys and [locales](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)"). This ensures that no work is lost and the migration is easier to manage. Branching and work with branches can be enabled again in Phrase Strings after the migration.
3. Download latest translations.

   Ensure the latest translations for the projects are downloaded so that no work is lost. If possible, complete the translations for tasks that are close to being finished, so it is clear where to start after migration.
4. Download TMs and TBs.

   Download existing [translation memories](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) and [term bases](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503) (glossaries) so that they can be used in Phrase Strings.

#### Prepare Phrase Strings for Migrating Content

Before migrating content from another tool into Phrase Strings, follow these steps:

1. Define [plural forms](https://support.phrase.com/hc/en-us/articles/5819838743964#UUID-46fb5ff5-b818-e993-4ecc-bbd777eea828).

   Define plural forms in the source file for the target languages that require it. This ensures that plural form-sensitive strings are translated using the plural forms based on the plural rules of the target language.
2. Set [placeholders](https://support.phrase.com/hc/en-us/articles/5822510498332#UUID-6ae7afb1-7b67-95a6-95b4-8c2e53df157e "Placeholders (Strings)").

   Ensure the correct placeholder format is selected for incoming projects. Placeholder formats for a project are specified within the Placeholders tab when creating or editing a project. Select all the required format styles.
3. Upload existing TMs and TBs.

   Upload translation memories and term bases (glossary) to Phrase Strings to be used in migrated and new projects.

#### Screenshot Migration

If [screenshots](https://support.phrase.com/hc/en-us/articles/5822309698204#UUID-6deabff7-bc7d-2c5c-848e-72d9f02dd895 "Screenshot Management (Strings)") require migration, directly upload them from the Phrase Strings UI up to ten at a time. If they are on a platform such as [Figma](https://support.phrase.com/hc/en-us/articles/5819515701916#UUID-c9c6bc21-3921-38e5-4339-93578f6782d7) or [Sketch](https://support.phrase.com/hc/en-us/articles/5784096009116#UUID-f914412a-6e27-0276-483a-79da35d552a2), complete the integration with the platforms and push the screenshots (and the content) from there.

#### User Migration

To migrate existing users, send invitations to all of them from Phrase Strings.

To invite all users with the correct roles, languages, project access and teams, follow these steps:

1. Define user/collaborators along with their roles, teams, languages and projects.
2. Create a list of emails addresses along with roles, languages, projects and teams.
3. [Invite](https://support.phrase.com/document/preview/70466#UUID-9c9dc360-8c12-1fb7-ec5f-88b6fd64e079) the list of users to the organization, all at once.

As soon as invited users complete their profile, they will be able to start collaborating in Phrase Strings with the defined roles and responsibilities.

#### Content Migration

If only migrating several projects using files or using the CLI, follow the tool-specific instructions below.

If integrating Phrase Strings with a platform such as GitHub, GitLab, Bitbucket, WordPress, Contentful, Figma, Sketch or others, refer to the [specific integration documentation](https://support.phrase.com/hc/en-us/sections/5784101340060) and migrate later.

If required, [solution architects](https://phrase.com/products/success-plans/) can help with migration and automation and advise on designing the best localization workflow for specific needs.

##### Migrate from Lokalise

To migrate content from Lokalise, follow these steps:

1. Download the content.

   1. Log in to the Lokalise account.
   2. From the Projects menu, click on the project to be migrated.
   3. From the Download tab, select required [file format](https://support.phrase.com/hc/en-us/sections/6111343326364).
   4. Select the required languages from the Languages section.
   5. In the Content to Export section, select All.
   6. Click Build and Download.

   Content is downloaded as `yourprojectname.zip` and includes the source language and all selected languages.
2. Apply localization workflow to the content.

   This content can now be uploaded to a project and a [localization](https://support.phrase.com/hc/en-us/articles/5821111943708#UUID-c996379d-71b3-7d52-8b14-47f8dc6673d1) and [review](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") workflow can be applied. Content can also be uploaded to Phrase Strings using the Phrase [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828).

##### Migrate from POEditor

POEditor only allows the download of one language at a time from a project.

To migrate content from POEditor, follow these steps:

1. Download the content.

   1. Log in to the POEditor account.
   2. Select the project for migration.
   3. From the Languages tab, select the language.
   4. From the Export tab, select the file format.
   5. Click Export.

   Translations for the selected language are downloaded in the specified file format.
2. Apply localization workflow to the content.

   This content can now be uploaded to a project and a [localization](https://support.phrase.com/hc/en-us/articles/5821111943708#UUID-c996379d-71b3-7d52-8b14-47f8dc6673d1) and [review](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") workflow can be applied. Content can also be uploaded to Phrase Strings using the Phrase [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828).

##### Migrate from Weblate

To migrate content from Weblate, follow these steps:

1. Download the content.

   1. Log in to the Weblate account.
   2. Select the project for migration.
   3. Download files.

      - To download all files, click Files and select Download translation files as a zip file.
      - To download all files within a component of the project, select the required component, click Files and select Download translation files as a zip file.
      - To download translations for a language, select the required language, click Files and select Customize download and then the file format from the Quick downloads section. If the file is not visible, select the required format from the Customize download section and click Download.
2. Apply localization workflow to the content.

   This content can now be uploaded to a project and a [localization](https://support.phrase.com/hc/en-us/articles/5821111943708#UUID-c996379d-71b3-7d52-8b14-47f8dc6673d1) and [review](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)") workflow can be applied. Content can also be uploaded to Phrase Strings using the Phrase [CLI](https://support.phrase.com/hc/en-us/sections/5784132012828).

---

### Job Templates (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/7629216795036-Job-Templates-Strings  
> Zuletzt aktualisiert: 2026-09-24T06:21:05Z  
> Labels: 2BTr, ar_strings

#### Available for

- Team, Professional, Business, Enterprise and Software UI/UX plans

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

#### Available for

- Advanced and Enterprise plan (Legacy)

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

Job templates help automate and streamline job creation process and increase work efficiency on translation [jobs](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738 "Jobs (Strings)").

There are two types of templates:

- Project-based job templates:

  They are applicable only to a single [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") and can be turned into organization job-templates.
- Organization job templates:

  They are applicable to any project within the organization, but cannot be turned into project-based templates.

#### Job template permissions based on [user roles](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452)

| User role | Project-based template | Organization template |
| --- | --- | --- |
| *Administrator* | - Add - Use - View - Edit - Delete - Duplicate - Create as organization template | - Add - Use - View - Edit - Delete - Duplicate |
| *Project manager* | - Add - Use - View - Edit - Delete - Duplicate - Create as organization template | - Add - Use - View - Edit (if owner) - Delete (if owner) - Duplicate |
| *Developer* | - Use - View | - Use - View |
| *Designer* | - Use - View | - Use - View |

#### Templates Page

All available job templates are listed under the Templates tab of the main Jobs page. Both project-based and organization job templates are displayed through the main Jobs page, according to user access rights. The ![Organization Template](https://support.phrase.com/hc/article_attachments/30682430873628) icon is used to distinguish organization templates from the project-based templates.

The Templates page can also be accessed from the Jobs tab of a project, where it displays all project-based templates from that particular project and organization job templates which are available to all projects.

To display only project-based or organization templates, select the relevant option from the filter dropdown at the top of the templates list. Templates can also be searched for in the templates list or through the Templates dropdown menu at the top right of the page.

Use the buttons at the right of each template to view, edit, duplicate, or delete it. Click on [Use template](https://support.phrase.com#UUID-6327676a-0940-1dff-5310-8fb11800ce82_UUID-ad71d8a0-c953-c9e1-3555-6b9de4107681 "Using Job Templates") to create a new job based on the desired template.

The same options are also provided under the Templates dropdown menu at the top right of the page: click on ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682493568540)next to the desired template to display actions for viewing, editing and using templates.

#### Creating Job Templates

Both project-based and organization job templates can be created through the Templates dropdown menu. If the template is added from the main Jobs page, an organization job template is created. Adding a job template from the Jobs tab of a project creates a new project-based template.

If opening the Templates dropdown menu from the [Create new job page](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-189da3c4-26fb-f6fa-ed51-a8fa1d998738_UUID-c70492a3-90b5-c26c-a32e-e3350246b924 "Create a String Management Job"), both project-based and organization template types can be added as new templates.

To create a job template, follow these steps:

1. Open the Templates dropdown menu and select ![Add New Template](https://support.phrase.com/hc/article_attachments/30682430951324).

   The Create a new template page opens.
2. Provide a name for the template and select an owner from the dropdown list. The selected user becomes the owner of every job created from the template. To make the job creator the owner of each job instead, select Default to job creator.
3. Optionally, provide a Description.
4. Optionally, select a Source language.

   If selected, the template will use a source language other than the project default locale.
5. Add required languages and assign translators or reviewers for each language.

   Use the Users tab in the dropdown to select single users. Use the Teams tab to select a group of users.
6. Click Continue.

   New template is saved and displayed in the Templates page.

Existing project-based templates can also be converted to organization job templates by selecting Create as organization template from the More ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682493568540) menu of the desired template. Converting project-based templates to organization templates creates a copy of the existing template.

#### Using Job Templates

Project-based job templates can be applied only to the specific project, while organization job templates can be reused across all projects of an organization.

To use an existing job template, follow these steps:

- From the main Jobs page:

  1. Select Use template next to the desired template.

     - If selecting a project-based template, the Create a new job page is displayed in the relevant project.
     - If selecting an organization job-template, a popup is displayed to list available projects where the job template can be used.
  2. (For organization job templates) Choose the project where the template will be used.
  3. Optionally, edit the job template in the Update template page.
  4. Click on Continue to view the job template.
- From the Jobs tab of a project:

  1. Select Use template next to the desired template.
  2. Optionally, edit the job template in the Update template page.

     ### Note

     If using an organization job template, users and languages that are applicable to the project are automatically added. In case of additional users and languages included in the template, an alert is displayed. The additional entities need to be added manually by a user with appropriate project permissions.
  3. Click on Continue to view the job template.

Job templates can also be selected when creating a new job. Open the Templates dropdown menu at the top right and select Use from the More ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682493568540) menu of the desired template: fields of the job creation form are automatically populated with relevant data from the job template.

---

### Analytics Dashboards (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/7780103449884-Analytics-Dashboards-Strings  
> Zuletzt aktualisiert: 2026-07-17T06:18:43Z  
> Labels: 2BTr, ar_strings

#### Available for

- All paid plans

Analytics dashboards provide aggregated insights into translation activities across all projects of the [organization](https://support.phrase.com/document/preview/57801#UUID-86d1fa5d-b590-2cb7-b3fe-2ed77e8be239).

In line with our internal [data storage](https://support.phrase.com/hc/en-us/articles/17019781874076#UUID-99ae6922-df28-38ae-ea89-7f7fac88a538) policy, any customer-input text (e.g. project names, file names, domains) from permanently deleted content does not appear in Phrase Analytics. Permanently deleted content is replaced with Deleted. All numerical values, dates, timestamps, boolean data types from permanently deleted content remain available. This ensures that historical KPIs, trends, and forecasting aggregations remain consistent over time.

Select Phrase Analytics on the left-side navigation panel to access the Phrase Analytics page, which features four main tabs with different visualizations for detailed reporting and statistics: [Volume](https://support.phrase.com#UUID-bb1b2bd5-091a-020a-11db-5ed8bfa57d1b_UUID-40c1668b-a38e-9f3e-f678-53a2f1875881 "Volume Tab"), [Languages](https://support.phrase.com#UUID-bb1b2bd5-091a-020a-11db-5ed8bfa57d1b_UUID-0f4a973c-96bc-1e20-a1ea-67e70957b497 "Languages Tab"), [Users](https://support.phrase.com#UUID-bb1b2bd5-091a-020a-11db-5ed8bfa57d1b_UUID-ab24f2c0-9337-7d1b-2710-b871e2d24dc8 "Users Tab") and MT Usage.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/uwRjnPLGvro)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

Access rights are as follows:

- Full access: Admin and Owner [user roles](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452)

  They can view translation activities of all users in any project.
- Basic access: Project Manager, Developer, Translator and Designer user roles

  They can view translation activities of all users for projects they have access to.
- Guest users do not have access to Phrase Analytics.
- Users assigned to a project can see all languages in that project, regardless of whether they have full or basic access.

Data is not real-time and refreshes once daily:

- EU instance: 1:00 AM UTC
- US instance: 8:00 AM UTC

The analytics dashboards provide specific filtering options to display more granular insights on available data.

Users can also export each visualization to .XSLX, .CSV and other file formats based on the visualization type. To export data, hover over the desired visualization and click the three dots ![Open More Menu](https://support.phrase.com/hc/article_attachments/30682414738076) icon in the right corner.

##### Note

It is not possible to download all views together.

**Metrics Definition**

- [Key](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)")

  Container for the translations, with its own name and value. A key can have multiple translations, as the [default language](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") can be translated into one or many other languages.
- Translation

  Any text added to the target languages. The translation consists of single or multiple words.
- Word

  A unit of translation. To calculate certain metrics, both words from the default/source language and target languages are used.

More information about metrics and their definitions is [available to customers](https://support.phrase.com/hc/en-us/articles/14424623821212#UUID-8bf8221a-e1b2-8776-987d-92349733353d "Analytics Dashboards Metrics (Strings)").

#### Volume Tab

The Volume tab offers a summary of aggregated statistics, displayed month-on-month. It includes data from all projects, such as languages, keys, translations, and words. Missing translations, Unverified translations and Managed words metrics also show monthly trends by comparing the metric value in the current month to the value of the past month.

- The *Date* filter does not apply to these statistics.
- The Managed words by month visualization shows the evolution of managed words over months, starting from June 2024.
- The Translation Sources line chart displays information about pre-translation sources (MT, TM or users) used in the project. The date indicates when words or keys were translated or reviewed.
- Overall volume visualizations show:

  - A list of all projects with their respective managed words and keys.
  - Visualizations featuring the top 5 projects by managed words and keys, highlighting the most used spaces.
- The Missing translations metric was called *Untranslated keys* in the legacy Strings analytics.

#### Languages Tab

The Languages tab provides an overview for each language within a project. The pivot table shows the statuses for keys and words, helping track progress and remaining workload.

Graphical visuals display keys by state (in % format) across each of the [review workflows](https://support.phrase.com/hc/en-us/articles/5784094755484#UUID-627bd0e1-13d8-1fbb-bbfb-81cd40cc2785 "Review Workflow (Strings)").

Users can apply various filters to focus on specific content.

Main differences with legacy Strings analytics:

- Reviewed keys are now excluded from the Ready for review keys metric.
- The Untranslated words metric was called *Words not translated* in the legacy Strings analytics.

#### Users Tab

##### Available for

- Enterprise plan

Get in touch with [Sales](https://phrase.com/demo/) for licensing questions.

The Users tab shows user performance within each of their assigned projects, which can be further filtered by language.

The pivot table highlights the contribution of the users, on keys and words.

#### MT Usage Tab

The MT usage tab presents insights on MT units and translated character consumption across Strings and other Phrase products that leverage [Phrase Language AI](https://support.phrase.com/hc/en-us/articles/5709660879516#UUID-b0d64b4f-fa01-f7c3-006a-40e0ee0dedd2). It is the same dashboard supported in Phrase TMS, and provides an overview of MTU consumption across products, by language, engine, project, etc.

Upon access, it is defaulted to Phrase Strings but users can also see consumption across all/specific Phrase products by adjusting the Phrase product dashboard filter.

- MT units consumed within Phrase Strings are tracked by project, locale pair, and user starting from 11th September 2025.

---

### Keyboard Shortcuts (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/11456238064540-Keyboard-Shortcuts-Strings  
> Zuletzt aktualisiert: 2025-08-14T13:36:25Z

A set of keyboard shortcuts is available in Phrase Strings to navigate within the application. Click on Keyboard shortcuts in the left-side navigation panel to open an overview window.

##### Note

The Strings editor offers a separate set of [editor keyboard shortcuts](https://support.phrase.com/hc/en-us/articles/11155549900572#UUID-153db70c-bba4-bcda-26f4-c7371b761bf8).

| Action | Shortcut |
| --- | --- |
| **Navigation** | |
| Go to project overview | **g** > **p** |
| Go to dashboard | **g** > **d** |
| Go to languages | **g** > **l** |
| Go to uploads | **g** > **u** |
| Go to tags | **g** > **t** |
| Go to keys | **g** > **k** |
| Go to orders | **g** > **o** |
| Go to activities | **g** > **a** |
| Go to analytics | **g** > **r** |
| Go to jobs | **g** > **j** |
| Go to branches | **g** > **b** |
| **Extra** | |
| Open shortcut help | **?** |
| Open new entry dialog | **n** |
| Open project settings | **Shift** + **p** |
| Close modal window | **Esc** |
| **Pagination** | |
| Go to next page | **Shift** + **ArrowRight** |
| Go to previous page | **Shift** + **ArrowLeft** |

---

### Cost-Effective Word Management (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/13381554813596-Cost-Effective-Word-Management-Strings  
> Zuletzt aktualisiert: 2026-08-19T06:19:27Z  
> Labels: Administration, 2BTr

Managing translation resources efficiently and optimizing the usage of managed words ensures cost-effectiveness.

Platform [owners and administrators](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) can monitor capacity usage in the Subscription overview tab of the Organization settings page.

The number of Strings managed words is calculated as follows:

`A x B` = Strings managed words

*Where*:

- `A` is the total number of words in the source [languages](https://support.phrase.com/hc/en-us/articles/5818281650204#UUID-1fd36188-23b2-375a-17de-dad6fe94614d "Languages and Locales (Strings)") stored in Strings [projects](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-2cd05a2c-7866-f4f1-424d-d1bffa941a30 "Projects (Strings)") at any point in time including locked [keys](https://support.phrase.com/hc/en-us/articles/5784119185436#UUID-caa9906b-72b7-dfac-c14b-a0fbd36c2938 "Keys (Strings)").

  - If the source language is a character-based language (e.g. Japanese, Korean, Simplified or Traditional Chinese), `A` is the total number of characters stored in Strings projects divided by two.
- `B` is the total number of languages configured in Strings projects including source languages.

**Example**

A customer has 1,000 keys. The keys contain 5,000 source language words `(A)` and are being translated into 5 languages from a single source language `(B)`. Therefore, the total amount of managed words equals:

5,000 words `(A)` x [(5 target languages + 1 source language `(B)`] = 30,000 managed words

- Legacy branches do not count towards the total number of managed words. Upon merging changes to the main branch, additional words may be added to the project and increase the number of managed words.

  ### Important

  Starting April 2026, legacy branches older than 30 days will begin to count towards Strings managed words.
- New branching (as of December 10, 2025)

  - For new customers, branches unmerged for more than 30 days count toward managed words. Merged branches never count, regardless of whether they have been deleted. When merged, only new or updated content counts.

    The 30-day period is measured from the branch's creation date, not from the date it was last updated. The Branches tab in the UI displays Synced, Updated, and Creator columns, but does not display the branch creation date. Retrieve the creation date using the `created_at` field returned by the API endpoint `GET /projects/{project_id}/branches`, or via the CLI command `phrase branches list --project_id <project_id>`.
  - For existing customers, branches created will not count until April 2026, even if unmerged for more than 30 days.
- [Linked keys](https://support.phrase.com/hc/en-us/articles/12949643568412#UUID-3b57fe95-88d5-b019-e956-f22c96647518 "Linked Keys (Strings)") do not count towards the total number of managed words. Only the content of existing keys (parent keys) is counted, while child keys are not.
- Use of [Job Sync](https://support.phrase.com/hc/en-us/articles/5709647502620#UUID-776d5a52-a0f8-d5c1-10b7-60bb343ef950) (adding languages) will impact total number of managed words.

#### Best Practices for Strings Word Management

To optimize the usage of managed words in Strings, the following strategies are recommended:

- *Regular scheduled strings audits to optimize content*

  Regularly review and eliminate unused or obsolete strings, languages and projects from accounts to maintain a lean and relevant word count.
- *Team education and training*

  Concise and clear content creation directly impacts the manageability and volume of source texts. Educating creators about the impact of word count on costs leads to more mindful content creation with a focus on brevity and relevance.
- *Remove and avoid duplications*

  Ensure the content management system or processes do not inadvertently duplicate strings across projects or departments.
- *Maximize strings reuse*

  Leverage existing strings across various projects to avoid unnecessary translations. Consistency in phraseology significantly reduces word count. If there are multiple keys with similar or duplicate content, consolidate them into single keys.

---
