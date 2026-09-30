# Phrase Orchestrator

Create seamless workflow automations

Quelle: https://support.phrase.com/hc/en-us/categories/7681583605276-Phrase-Orchestrator  
Exportiert: 2026-09-30T11:34:22+00:00 · Sprache: en-us · Artikel: 27

## Inhaltsverzeichnis

- [Orchestrator](#orchestrator)
  - [Phrase Orchestrator Overview](#phrase-orchestrator-overview)
  - [Create a Workflow](#create-a-workflow)
  - [Configure a Workflow](#configure-a-workflow)
  - [Sharing Workflows](#sharing-workflows)
  - [Next-Gen Workflow Engine (Orchestrator)](#next-gen-workflow-engine-orchestrator)
  - [Revisions](#revisions)
  - [Executions](#executions)
  - [Arrays](#arrays)
  - [Looping](#looping)
  - [Dynamic Date/Time Calculation](#dynamic-datetime-calculation)
  - [Authenticating Actions](#authenticating-actions)
  - [Event Payload Examples (TMS)](#event-payload-examples-tms)
  - [Event Payload Examples (Strings)](#event-payload-examples-strings)
  - [File Support](#file-support)
  - [Workflow Templates](#workflow-templates)
  - [Scheduled Triggers](#scheduled-triggers)
  - [Webhooks (Orchestrator)](#webhooks-orchestrator)
  - [Retries and Error Handling](#retries-and-error-handling)
  - [Action Upgrades and Validation](#action-upgrades-and-validation)
  - [Slack (Orchestrator)](#slack-orchestrator)
  - [Phrase Data (Orchestrator)](#phrase-data-orchestrator)
  - [Variables (Orchestrator)](#variables-orchestrator)
  - [Action Bundles](#action-bundles)
  - [Auto Adapt (Orchestrator)](#auto-adapt-orchestrator)
  - [MT Optimize](#mt-optimize)
  - [Welocalize OPAL (Orchestrator)](#welocalize-opal-orchestrator)
  - [TAUS EPIC (Orchestrator)](#taus-epic-orchestrator)

---

## Orchestrator

Quelle: https://support.phrase.com/hc/en-us/sections/7681654656412-Orchestrator

### Phrase Orchestrator Overview

> Quelle: https://support.phrase.com/hc/en-us/articles/7681638082716-Phrase-Orchestrator-Overview  
> Zuletzt aktualisiert: 2026-08-04T06:19:33Z  
> Labels: Orchestrator, 2BTr

Phrase Orchestrator is an expanding set of tools for designing custom localization workflows and infrastructure-as-a-service for the Phrase product platform.

[Phrase QPS](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444) is supported as an action to [create workflows](https://support.phrase.com/hc/en-us/articles/7681638101532#UUID-2a7a8150-7b14-0f4f-110c-f8042fd3316f "Create a Workflow") that automatically route content to post-editing or [LQA](https://support.phrase.com/hc/en-us/articles/27529737766044#UUID-8c8a9e28-99dd-f432-f780-331192127c69) tasks, based on QPS scoring.

**Core functionalities:**

- *Workflow editor* as a visual tool for designing custom workflows.

  A simple drag and drop interface is provided with trigger and action blocks that can be arranged in linear or split workflows.

  Placing a block below a previous block creates a linear relationship.

  Placing another block on the previous block creates split (parallel) relationship.

  A connector dot at the bottom of each block can be used to draw a relationship to a following block.

  `jq` is used for configuration. The `jq` action supports both text and file inputs and can export to a file to be consumed in subsequent actions. For more information on `jq`, see the [manual](https://stedolan.github.io/jq/manual/) and [playground](https://jqplay.org/). AI chatbots can be very effective at generating and verifying `jq`.
- *Management experience* for:

  - Managing (CRUD) workflows
  - Publishing/Unpublishing workflow revisions
  - Monitoring workflow executions
  - Managing workflow revisions

Total number of published workflows and executed actions is limited by purchased [plan](https://phrase.com/pricing/?tab=add-ons#phrase-orchestrator-details).

##### Note

Unless sharing is enabled for a workflow, each user sees only workflows they created. To view the total number of published workflows in the organization, refer to the Usage tab in the Dashboard.

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/Pqp5MBTT0TA?feature=shared)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

The `phrase_login` action as presented in the webinar has been changed to `Fetch access tokens`.

#### Accessing Phrase Orchestrator

Phrase Orchestrator is available for Phrase Strings and/or TMS customers to trial and use in the Phrase Platform.

Owner and Admin roles in Phrase IDM have access to Orchestrator by default. To grant a [Member](https://support.phrase.com/hc/en-us/articles/5793349215900#UUID-09f99b48-09c7-b144-42bb-a1bfd2e7d452) access to Orchestrator, either:

1. Change the user’s role to Admin or Owner at <https://eu.phrase.com/idm-ui/users>, or
2. Contact Phrase Technical Support to enable Orchestrator access for that Member if a role change is not possible or not desired.

To sign into the Phrase Platform, these options are available:

- Sign in with username and password.
- Customers who log in directly to Strings and TMS logins will need to login through the Phrase Platform to access Orchestrator.
- Customers who use SSO:

  - If SSO is not enforced, Phrase Platform can be accessed with a username/password.
  - If SSO (Phrase Strings only) is enforced, contact your customer success manager for assistance.
- Customers who use Social logins can [request a reset](https://support.phrase.com/document/preview/7928#UUID-bddb003f-dc32-06ed-f92f-75c473c51ee7) of their password that will give them Phrase Platform access.

---

### Create a Workflow

> Quelle: https://support.phrase.com/hc/en-us/articles/7681638101532-Create-a-Workflow  
> Zuletzt aktualisiert: 2026-06-26T06:24:07Z  
> Labels: Orchestrator, 2BTr

This is a sample use case for creating a workflow and covers most aspects of the procedure.

[Workflow templates](https://support.phrase.com/hc/en-us/articles/10403607849628#UUID-39869ec3-740b-4ad3-6bd2-cd626f3ce9fa "Workflow Templates") give more examples of different kinds of workflows.

To create a Strings workflow in Orchestrator that creates a job when a file is uploaded to a project and contains the keys affected by the upload, follow these steps:

1. (Optional) Create a working folder.

   1. From the Create menu, select Folder.

      The New folder window opens.
   2. Provide a name for the folder and click Save.

      The folder is listed on the Workflows page.
   3. Click the folder name to open it.
2. Create a workflow.

   1. From the Create menu, select Workflow.

      The New Workflow window opens.

      Optionally attach an existing .JSON file to automatically create a workflow. The description will be taken from the file.
   2. Provide a Name and Description for the new workflow.
   3. Click Save.

      The new workflow is listed on the Workflows page.

   ### Note

   A library of common [templates](https://support.phrase.com/hc/en-us/articles/10403607849628#UUID-39869ec3-740b-4ad3-6bd2-cd626f3ce9fa "Workflow Templates") is also available for creating workflows.
3. Define a workflow.

   1. Click on the workflow name to open it.

      The workflow opens in the Editor tab.
   2. Provide an event that the workflow should be listening for.

      For this sample procedure, the `![history-orange.svg](https://support.phrase.com/hc/article_attachments/30682499019548)uploads:create` event will be used and is the event that occurs once a file has been uploaded and processed in a Strings project.

      From the Events tab on the Workflow blocks window, search for the word *uploads*.

      Listed events are both TMS and Strings webhooks.
   3. Drag and drop the `![history-orange.svg](https://support.phrase.com/hc/article_attachments/30682499019548)uploads:create` block on to the first workflow step.

      The step is created and details are presented in the Overview tab on the right of the window.

      The name of the block can be changed to something in normal language that describes what the block does.
   4. Provide an action to the workflow. For this sample procedure the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Fetch access tokens` action will be used for authentication (it fetches access tokens during runtime).

      From the Actions tab on the Workflow blocks window, search for *phrase*.

      A list of events is presented in the tab.
   5. Drag and drop the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682484801180)Fetch access tokens` action block below the `![history-orange.svg](https://support.phrase.com/hc/article_attachments/30682499019548)uploads:create` trigger to connect them.
   6. After authentication, a function can be provided. For this sample procedure, locales from a Strings project will be listed.

      From the Actions tab on the Workflow blocks window, search for *list locales*.

      A list of events is presented in the tab.
   7. Drag and drop the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682484801180)List locales` action block below the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682484801180)Fetch access tokens` action to connect them.
   8. The list of locales will need to be filtered for the purposes of the example. The `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action will be used for this.

      From the Actions tab on the Workflow blocks window, search for *Transform JSON with jq*.
   9. Drag and drop the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action block below the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682484801180)List locales` action to connect them.
   10. A job can now be created with the results of the workflow. For the purposes of the example, a Strings job will be created.

       From the Actions tab on the Workflow blocks window, search for *create a job*.
   11. Drag and drop the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action block below the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action to connect them.
   12. Every action can have conditions defined with logical AND and OR statements to create more outputs. For the purposes of the example, two target locales will result from the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action.

       Drag and drop the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action block below the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action to connect them.

       Drag and drop another `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action block onto the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action to add another branch.

       These actions will run in parallel.
   13. Dependent on the conditions set in the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action, a locale will be created based on the result of the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action.

       Drag and drop a `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Add a target locale to a job` action block below each `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682499038620)Transform JSON with jq` action to connect them.
   14. Once a job locale is created, the job can be started.

       Drag and drop the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Start a job` action block below a `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action to connect them. From the second `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Create a job` action, drag the connector dot to the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682484836252)Start a job` action.

---

### Configure a Workflow

> Quelle: https://support.phrase.com/hc/en-us/articles/7681638124828-Configure-a-Workflow  
> Zuletzt aktualisiert: 2026-06-26T06:24:08Z  
> Labels: Orchestrator, 2BTr

To continue with the sample workflow, it will need to be configured.

Block configuration can be accessed by either clicking Edit parameters on the Configure tab, or right-clicking the block and selecting Edit parameters to open the Edit parameters window. Once a block has parameters, the Add parameters button switches to Edit parameters.

To configure the blocks for the example, follow these steps:

1. Open the Edit parameters window for the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)List locales` action.
2. The Access token and Project fields will require dynamic values that are resolved at runtime.

   1. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Access token field and select the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Fetch access tokens` action.

      The link turns green and the field can be edited.
   2. The syntax for accessing the properties of a referenced trigger or action is:

      ```
      {{$.path.to.value}}
      ```

      With the output for `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Fetch access tokens` being:

      ```
      { "tokens": {"strings_token": "STRINGS_TOKEN", "tms_token": "TMS_TOKEN"} }
      ```

      making the expression required for the Access token field `{{$.tokens.strings_token}}`.
   3. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Project field and select the `![history-orange.svg](https://support.phrase.com/hc/article_attachments/30682485032476)uploads:create` trigger.

      The link turns green and the field can be edited.
   4. The output of the `![history-orange.svg](https://support.phrase.com/hc/article_attachments/30682485032476)uploads:create` trigger resembles:

      ```
      {
        "branch": {
          "name": "my_branch"
        },
        "event": "uploads:create",
        "message": "user-1 initialized file upload file.yml in project name_1672734591_11 within branch my_branch\n",
        "project": {
          "created_at": "2023-01-03 08:29:51 UTC",
          "id": "abcdabcdabcdabcd-11",
          "main_format": "yml",
          "name": "name_1672734591_10",
          "point_of_contact": null,
          "project_image_url": null,
          "slug": "name_1672734591_10",
          "updated_at": "2023-01-03 08:29:51 UTC"
        },
        "upload": {
          "created_at": "2023-01-03 08:29:48 UTC",
          "filename": "file.yml",
          "format": "yml",
          "id": "upload-1",
          "state": "initialized",
          "summary": {},
          "tag": null,
          "updated_at": "2023-01-03 08:29:48 UTC"
        },
        "user": {
          "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
          "id": "9c365b9a6f77c247c3de959f6152b231",
          "name": "Joe Sixpack",
          "username": "user-1"
        }
      }
      ```

      making the expression required for the Project field `{{$.project.id}}`.
   5. Click Save.

      The Edit parameters windows closes and the parameters for the action are saved
3. The project's default locale is required to create a job by passing the ID to the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682499314588)Create Job` action. The `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Transform JSON with jq` action takes a JSON input, applies the filter specified and then outputs JSON again

   1. From the Actions tab on the Workflow blocks window, search for *phrase-jq*.

      Drag and drop the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Transform JSON with jq` action block below the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)list locales` action to connect them.
   2. Open the Edit parameters window for the `Transform JSON with jq` action.
   3. Select JSON from the Input Type dropdown field.
   4. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Input field and select the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)list locales` action.

      The link turns green and the field can be edited.
   5. The Input field takes the JSON input. A special fixed expression (`@` instead of `$`) ensures that the entire output of the referenced action gets passed into the field.

      Enter the expression `{{@.outputs.result}}` in the Input field.
   6. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Jq field and select the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)list locales` action.

      The link turns green and the field can be edited.
   7. A filter of the list of locales that returns a new list containing all elements where the `default` property is `true` is required.

      There can only be one default locale per project and the list has one identifiable and required element. That element is directly accessed with the `.[0]` array syntax.

      Enter the expression `map(select(.default))|.[0]` in the Jq field.
   8. Click Save.

      The Edit parameters windows closes and the parameters for the action are saved
4. The `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682499314588)Create a job` action can now be configured and will use patterns from previous blocks.

   1. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Access token field and select the `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Fetch access tokens` action.

      The link turns green and the field can be edited.

      Enter the expression `{{$.tokens.strings_token}}`.
   2. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Project field and select the `![language-orange.svg](https://support.phrase.com/hc/article_attachments/30682485086364)uploads:create` trigger.

      The link turns green and the field can be edited.

      Enter the expression `{{$.project.id}}`.
   3. Click the link icon ![Linking Icon](https://support.phrase.com/hc/article_attachments/30682453274396) for the Source locale field and select the `Transform JSON with jq` action.

      The link turns green and the field can be edited.

      Enter the expression `{{@.outputs.result}}`.
   4. The due date can be [calculated with sprig or Expr functions](https://support.phrase.com/hc/en-us/articles/7922073227292#UUID-dc95ef27-2b97-b7ed-1aca-d5c64e6d13e8 "Dynamic Date/Time Calculation"), but for purposes of this example a hardcoded date understood by the API will be used.

      In the Due date field, enter *2023-12-31T12:00:00Z*.
   5. Click Save.

      The configuration is saved and details can be viewed in the Configure tab.
5. Every action can have one or more conditions combined with logical `AND` and `OR`. These conditions are evaluated in runtime and the action and its children will only execute if the condition evaluates to true.

   To reflect this in the example, while having the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682499314588)Create a job` action selected, click Edit conditions from the Conditions tab or right-click the block and select Edit conditions.

   The Edit conditionals window opens.

   1. Following patterns from previous blocks, link the variable field to the `![language-orange.svg](https://support.phrase.com/hc/article_attachments/30682485086364)uploads:create` trigger and enter the expression `{{$.upload.tag}}`.
   2. Select NOT from the first dropdown list to invert the statement.
   3. Select IsNull from the compare dropdown list.
   4. Click Save.

      The condition is presented on the Conditions tab.

   The workflow will stop at this point if the upload does not contain a tag (meaning that there were no new/updated keys/translations).
6. Target locales are now required for the job. For the purposes of the example, two locales will be created; one for Spanish (es-ES) and one for German (de-DE). Locales will be added to the two `![circle-blue.svg](https://support.phrase.com/hc/article_attachments/30682485007260)Transform JSON with jq` actions in the Edit parameters window as in step 3.

   1. In the Input field of both actions, enter the expression `{{@.outputs.result}}`, link to the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)List locales` action and save the parameter.
   2. In the Jg field of one action, enter the expression `map(select(.name == "es-ES"))|.[0]` and link to the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)List locales` action.

      Save the parameter.
   3. In the second action, enter the expression `map(select(.name == "de-DE"))|.[0]` and link to the `![language-blue.svg](https://support.phrase.com/hc/article_attachments/30682464765084)List locales` action.

      Save the parameter.
7. The locales will now be applied to job creation.

   Configure the two `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682499314588)Add a target locale to a job` actions with the same patterns previously defined.
8. The job can now be started.

   Configure the `![work-blue.svg](https://support.phrase.com/hc/article_attachments/30682499314588)Start a job` action with the same patterns as previously defined.

---

### Sharing Workflows

> Quelle: https://support.phrase.com/hc/en-us/articles/17247812795932-Sharing-Workflows  
> Zuletzt aktualisiert: 2026-06-26T06:24:09Z  
> Labels: Orchestrator, 2BTr, cadence-dec24

Workflows can be shared across an organization.

Shared workflows are visible to other users with [access](https://support.phrase.com/hc/en-us/articles/7681638082716#UUID-854884a1-a259-24f2-8a2b-18395b4ccfd5_UUID-4a2e69a8-10c3-6b66-be3c-d36c05fbd645 "Accessing Phrase Orchestrator") to Orchestrator. Those users can:

- Edit, publish and unpublish the workflow.
- View execution logs of the workflow.
- [Export](https://support.phrase.com/hc/en-us/articles/7778580163868#UUID-aca8608d-d831-8947-bd15-9bf7701d9e28 "Revisions") shared workflows and execution logs.

They will not be able to:

- Delete the workflow.
- Change the shared status of the workflow.
- Rename the workflow.

To share a workflow, follow these steps:

1. Open the workflow to be shared in the editor.
2. Click the share button ![share_workflow.png](https://support.phrase.com/hc/article_attachments/30682485163804) on the top right.

   The Share window opens.
3. Click the slide button ![slide_button.png](https://support.phrase.com/hc/article_attachments/30682453561372).

   The button turns blue indicating the workflow is shared.

   ![Share/Unshare WF Location](https://support.phrase.com/hc/article_attachments/30682453608348)
4. Close the window.

A shared workflow is indicated by the share button being displayed in blue.

![Shared WF Icon Location](https://support.phrase.com/hc/article_attachments/30682499583004)

To stop sharing, click the button again to open the Share window and click the slide button.

---

### Next-Gen Workflow Engine (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/28592652437276-Next-Gen-Workflow-Engine-Orchestrator  
> Zuletzt aktualisiert: 2026-09-23T06:22:46Z

Phrase Orchestrator has a next-gen workflow engine. This article covers the differences between the next-gen engine and the legacy engine.

#### Differences from the Legacy Engine

##### Access Token Field and Fetch Access Token Action

**Workflows created before migration to the next-gen engine**

The Access Token field remains visible in action parameters and references the existing Fetch Access Token action. No changes are required, but the configuration can be updated.

The Access Token field and Fetch Access Token action remaining visible on a pre-migration workflow does not mean that workflow is still running on the legacy engine. This field/action is kept only for backward compatibility. A workflow is only on the legacy engine if it was explicitly rolled back within the limited rollback window described below.

**Workflows created on the next-gen engine**

Neither the Access Token field nor the Fetch Access Token action is visible. The platform handles authentication automatically.

The same applies to the **Collect file path from loop** and **Collect output from loop** actions.

##### Send HTTP Request

The next-gen engine supports both **Send HTTP Request v1** and **Send HTTP Request v2**. The legacy engine only supports v1.

Rolling back to the legacy engine after updating a workflow to use Send HTTP Request v2 requires manually replacing those actions with Send HTTP Request v1.

##### Rolling Back to the Legacy Engine

Rollback is only available for workflows that existed before migration to the next-gen engine. Workflows created on the next-gen engine cannot be rolled back.

##### Note

Rollback is available for a limited period. To revert, contact your Customer Success Manager or [Phrase Support](https://support.phrase.com/document/preview/11383#UUID-3526b7e0-a380-0e1f-a34c-a23be70a69a1) as soon as possible.

#### What Has Not Changed

- Workflow structure, logic, and editor experience are unchanged.
- All trigger types (webhooks, scheduled, job events) work as before.

---

### Revisions

> Quelle: https://support.phrase.com/hc/en-us/articles/7778580163868-Revisions  
> Zuletzt aktualisiert: 2026-09-23T06:22:47Z  
> Labels: Orchestrator, 2BTr

When a workflow is created a first revision of the workflow is saved and can be viewed on the Revisions tab.

Revisions of a workflow can be published (and unpublished) from the ![ellipses.png](https://support.phrase.com/hc/article_attachments/30682453694620) menu and when published, a new revision is created. Once a workflow has been published, it can be accessed as a selectable workflow in TMS or Strings.

Revisions can also be renamed from the ![ellipses.png](https://support.phrase.com/hc/article_attachments/30682453694620) menu to make them easier to manage.

Every revision can be exported from the ![ellipses.png](https://support.phrase.com/hc/article_attachments/30682453694620) menu in .JSON format. The exported .JSON file can be used to create a new workflow (via Create/Workflow/Attach file), but cannot be imported into an existing workflow's draft revision. To bring a published revision's configuration into a new draft on the same workflow, rebuild it manually in the editor.

##### Note

Existing .JSON files exported **before October 16, 2023** are obsolete and cannot be uploaded to create new workflows. Re-download the revision to use the latest version of the exported .JSON file.

If a revision is indicating an execution, that execution can be viewed on the Executions tab.

Publishing a revision is subject to organization's subscription limit. If the organization has reached the number of published workflows included in its purchased plan, it is not possible to publish additional revisions. When attempting to publish, the revision stays a draft and the workflow's deployed revision does not change.

To free capacity, unpublish or delete a published workflow that is no longer needed and then publish again. To check current usage, see the number of published workflows on the Usage tab in the Dashboard. To raise the limit, add capacity or upgrade the plan.

##### Backup Revisions

In case of unpublished workflows including an action subjected to API changes, a backup of the workflow’s previous revision is automatically created.

The backup revision is saved and can be viewed on the Revisions tab to ensure users can revert changes, if needed.

---

### Executions

> Quelle: https://support.phrase.com/hc/en-us/articles/7778580178332-Executions  
> Zuletzt aktualisiert: 2026-06-26T06:24:10Z  
> Labels: Orchestrator, 2BTr

If a workflow is executed, a record is kept and can be viewed on the Executions tab.

Every execution has an ID that is presented in the table with revision numbers, status, start time and duration. Clicking on an execution provides the details of the execution at the task level.

#### Monitoring Executions

Workflow executions can be monitored to check their progress or investigate possible issues.

Select Executions in the left-hand menu to display the Executions page presenting a table with detailed information about each execution:

- Execution ID: A unique identifier for each execution.
- Status: Indicates whether the execution succeeded or encountered issues.
- Workflow ID: Identifies the associated workflow.
- Workflow Name: Specifies the name of the workflow.
- Revision ID: Provides a version identifier for the workflow.
- Revision Name: Specifies the name of the workflow version.
- Duration: Displays the elapsed time for the execution.
- Started At: Shows the date and time when the execution started.

###### Search for Executions

Enter a term in the search field at the top of the page to filter the table and get a list of executions containing the specified keywords. The search is applied across all available columns in the table.

To refine search results and apply the search only to specific columns, specify the column name before the search term separated by a colon. For instance, typing `workflow_name: tabbed` will exclusively search for revisions of the workflow with the name containing *tabbed*.

###### Filter Executions by Status or Date

The Executions page provides a range of status filters that can be selected in the Filter ![Filter](https://support.phrase.com/hc/article_attachments/30682469914652) dropdown menu:

- Succeeded: Executions that have successfully completed their tasks.
- Running: Executions that are currently in progress.
- Failed: Executions that faced issues during their execution.

Multiple statuses can be selected at the same time. The filters can also be used in combination with the search query to fine-tune the results and focus only on executions in a particular status.

Use the Filter by execution date section in the Filter ![Filter](https://support.phrase.com/hc/article_attachments/30682469914652) dropdown menu to display only executions from a specific time range.

---

### Arrays

> Quelle: https://support.phrase.com/hc/en-us/articles/8309712174620-Arrays  
> Zuletzt aktualisiert: 2026-09-23T06:22:48Z  
> Labels: 2BTr

Arrays are a commonly used data structure in Orchestrator workflows and can be sourced from triggers or actions.

Arrays are a powerful tool in Orchestrator workflows, and understanding how to extract values from arrays is valuable. Whether working with triggers, actions, or variables, being able to reference specific values in arrays helps build more efficient and effective workflows.

##### Working with Arrays in Triggers

When using triggers, configure them by filtering on specific array values.

Assuming that the trigger has the following data:

```
{
  "locales": [
    {"name": "de"},
    {"name": "en"},
    {"name": "fr"}
  ]
}
```

If a trigger payload contains an array of locale names, create a trigger filter to only trigger the workflow when the first locale name is *de*. To achieve this, use the String Equals comparator and enter `{{ $.data.locales.0.name }}` for the value. The index in the array is separated by dots.

##### Working with Arrays in Actions

If an action returns an array and requires the dynamic use a specific value from that array in the next action, reference the value using the appropriate index.

As an example, an action returns the same data as in the trigger example. To extract the first locale name from the array, enter `{{ $.locales[0].name }}`. The index in the array is separated by square brackets. There is also no data in the path.

---

### Looping

> Quelle: https://support.phrase.com/hc/en-us/articles/9272593244572-Looping  
> Zuletzt aktualisiert: 2026-06-26T06:24:12Z  
> Labels: 2BTr

Loops can be implemented within a workflow to repeat a set of tasks based on defined conditions.

Loop configuration is accessed in either the Advanced tab of a block configuration, or by right-clicking a block and selecting Edit loop.

Loop settings require a list of things to operate on:

- Plain, single values, which are then usable in task parameters such as `{{ @item }}`.
- A .JSON object where each element in the object can be addressed by its key such as `{{ @item.key }}`.

**Accessing the aggregate results of a loop**

The output of all iterations can be accessed as a .JSON array once a loop is completed. The output of each iteration must be a valid .JSON file.

There are four loop types that can be defined and are selected in the loop\_with field:

- withSequence
- withItems
- withComplexItems
- withParam

#### withSequence

The `withSequence` loop enables an iteration over a sequence of numbers or the generation of a range of values within a workflow.

It can be used for repeating a set of steps a specific number of times or performing operations based on a range of values.

To create a sample `withSequence` loop, follow these steps:

1. Select an empty block and open the Loop configuration.
2. Click Edit loop.

   loop\_with configuration options are presented.
3. From the loop\_with field, select withSequence.
4. Enter the number of loop iterations to the Count field.
5. Optionally, enter a value the loop should start from and/or end with.
6. Click Save loop.
7. From the Parameters configuration, click Edit parameters.

   Configuration options are presented.
8. In the Message field, enter `{{ @item }}` and click Save parameters.

   This value will be converted at runtime.

For example, if count is set to 3 and the start value is 2, the results of this loop will be:

- `loop list => ["2", "3", "4"]`
- `{{ @item }} => 2` or `3` or `4`, based on the iteration

#### withItems

The `withItems` loop enables iteration over a list of items.

It can be used when needing to perform operations based on a list of items.

To create a sample `withItems` loop, follow these steps:

1. Select an empty block and open the Loop configuration.
2. Click Edit loop.

   loop\_with configuration options are presented.
3. From the loop\_with field, select withItems
4. Enter `en` in the variable field and click +Item (another variable field is created).
5. Enter `de` in the second variable field and create a third field.
6. Enter `fr` in the third variable field and create a fourth field.
7. Enter `us` in the fourth variable field.
8. Click Save loop.
9. From the Parameters configuration, click Edit parameters.

   Configuration options are presented.
10. In the Message field, enter `{{ @item }}` and click Save parameters.

    This value will be converted at runtime.

The results of this loop will be an iteration over a list of language codes:

- `loop list => ["en", "de", "fr", "ua"]`
- `{{ @item }} => en` or `de .. ua`

#### withComplexItems

The `withComplexItems` loop enables iterating over a list of objects.

It can be used when needing to perform operations based on a list of complex items.

To create a sample `withComplexItems` loop, follow these steps:

1. Select an empty block and open the Loop configuration.
2. Click Edit loop.

   loop\_with configuration options are presented.
3. From the loop\_with field, select withComplexItems
4. Click +Key:value to add a second key.
5. For Object 1, enter the following:

   - Key: Value1

     - key (optional): name
     - (optional): Project 1
   - Key: Value2

     - key (optional): id
     - (optional): 11
6. Click +Object to add a second object and +Key:value for a second key.
7. For Object 2, enter the following:

   - Key: Value1

     - key (optional): name
     - (optional): Project 2
   - Key: Value2

     - key (optional): id
     - (optional): 22

   Settings sample:

   |  |
   | --- |
   | Loop with Complex Items Example |
8. From the Parameters configuration, click Edit parameters.

   Configuration options are presented.
9. In the Message field, enter `{{ @item.name }}` and click Save parameters. This value will be converted at runtime.

The results of this loop will be an iteration over a list of projects:

- `loop list` =>

  ```
  [
    {
      "name": "Project 1",
      "id": 11
    },
    {
      "name": "Project 2",
      "id": 22
    }
  ]
  ```
- `{{ @item }}` =>

  ```
  {
    "name": "Project 1",
    "id": 11
  }
  ```
- `{{ @item.name }}` => `Project 1`
- `{{ @item.id }}` => `11`

#### withParam

The `withParam` loop enables iteration over a dynamic list which is output from any previous task or trigger.

This loop is just used as a reference in the parameter field.

Example:

Outputs of task (`Strings: Publish a release`):

```
{
  "created_at": "2015-01-28T09:52:53Z",
  "environments": ["development", "production"],
  "id": "abcd1234cdef1234abcd1234cdef1234",
  "locales": [
    {
      "code": "en-GB",
      "id": "abcd1234cdef1234abcd1234cdef1234",
      "name": "English"
    },
    {
      "id": "abcd5678cdef5678abcd5678cdef5678",
      "name": "German",
      "code": "de_DE"
    }
  ],
  "platforms": ["android"],
  "project": {
    "created_at": "2015-01-28T09:52:53Z",
    "id": "abcd1234cdef1234abcd1234cdef1234",
    "main_format": "xml",
    "name": "My Android Project",
    "updated_at": "2015-01-28T09:52:53Z"
  },
  "updated_at": "2015-01-28T09:52:53Z",
  "version": 1
}
```

If loop settings withParam is set with `{{ $.locales }}`, then:

- `loop list` =>

  ```
  [
    {
      "code": "en-GB",
      "id": "abcd1234cdef1234abcd1234cdef1234",
      "name": "English"
    },
    {
      "id": "abcd5678cdef5678abcd5678cdef5678",
      "name": "German",
      "code": "de_DE"
    }
  ]
  ```
- First `{{ @item }}` =>

  ```
  {
    "code": "en-GB",
    "id": "abcd1234cdef1234abcd1234cdef1234",
    "name": "English"
  }
  ```
- `{{ @item.code }}` => `en-GB`
- `{{ @item.name }}` => `English`

Or if `{{ $.environments }}` is referenced, then:

- `loop list` => `["development", "production"]`
- `{{ @item }}` => `development` or `production`

---

### Dynamic Date/Time Calculation

> Quelle: https://support.phrase.com/hc/en-us/articles/7922073227292-Dynamic-Date-Time-Calculation  
> Zuletzt aktualisiert: 2024-08-30T12:57:13Z  
> Labels: Orchestrator, 2BTr

Workflows may require a date that is fetched at the runtime rather than hard-coded. This can be provided with *sprig* functions or *Expr*.

*Sprig* documentation references:

- [Functions documentation](http://masterminds.github.io/sprig/)

  - [Date function](http://masterminds.github.io/sprig/date.html)
- [Functions reference](https://coveooss.github.io/gotemplate/docs/functions_reference/)

  - [Date function](https://coveooss.github.io/gotemplate/docs/functions_reference/sprig-date/)
- [Date formatting in GO](https://www.pauladamsmith.com/blog/2011/05/go_time.html)

*Expr* documentation references:

- [Functions documentation](https://expr-lang.org/docs/language-definition)

  - [Date function](https://expr-lang.org/docs/language-definition#date-functions)

##### Caution

Syntax used in the documentation at [masterminds](http://masterminds.github.io/sprig/date.html) differs from what is used in Orchestrator. E.g., `now | date "2006-01-02"` becomes `{{sprig.date("2006-01-02", sprig.now())}}`

##### Use cases

**Getting the current time/date**

- To just get the date at the time of the particular workflow execution, in any parameter field, enter:

  - Sprig: `{{sprig.now()}}`
  - Expr: `{{ now() }}`
- At runtime, the date is returned in this format:

  `"2023-02-24 11:33:01.819987888 +0000 UTC m=+77750.651866821"`

**Formatting a date**

- To format a date, use:

  - Sprig: `sprig.date(“FORMAT_STRING”, “DATE”)`
  - Expr: `DATE.Format("FORMAT_STRING"`

  Provide a string with the format required for the date referencing this standard date: **Mon Jan 2 15:04:05 MST 2006  (MST is GMT-0700)**
- Examples:

  - Sprig: `{{sprig.date("02.01.2006 - 15:04", sprig.now())}}` results in `“24.02.2023 - 11:36”` (at time of writing).
  - Expr: `{{ now().Format("02.01.2006 - 15:04") }}`

  To provide the date in the format required by TMS API:

  - Sprig: *("2019-08-24T14:15:22Z")* invoke `{{sprig.date("2006-01-02T15:04:05Z", sprig.now())}}`
  - Expr: `{{ now().Format("2006-01-02T15:04:05Z") }}`

**Modifying a date**

- To perform a calculation based the example

  - Sprig: `sprig.now()`, use `sprig.dateModify(“MODIFY_VALUE”, “DATE”)`.
  - Expr: `DATE.Add(duration("MODIFY_VALUE"))`
- Example:

  - Sprig: `{{sprig.dateModify("24h", sprig.now())}}`
  - Expr: `{{ now().Add(duration(“24h”)) }}`

  (run on Feb 24th, 12:43) results in `"2023-02-25 11:43:48.073101611 +0000 UTC m=+164796.904980545"` - 24 hours after initial date.
- Combinations can be used.

  To get the time and date of the execution, plus 24 hours, formatted for TMS API, pass this expression to the given field:

  - Sprig: `{{sprig.date("2006-01-02T15:04:05Z", sprig.dateModify("24h", sprig.now()))}}`
  - Expr: `{{ now().Add(duration("24.h")).Format("2006-01-02T15:04:05Z") }}`

  Resulting in `"2023-02-25T11:50:50Z"` (when run on Feb 24th, 11:50 hrs).
- The value by which the date should be modified can be given in hours, with `“-”` if the value should be subtracted. Fractions such as `“-1.5h”` can also be used.

---

### Authenticating Actions

> Quelle: https://support.phrase.com/hc/en-us/articles/7922047247260-Authenticating-Actions  
> Zuletzt aktualisiert: 2026-06-26T06:24:13Z  
> Labels: 2BTr

In order to authenticate a workflow, add the Fetch access tokens action as the first action in the workflow. This ensures all subsequent actions can access its output.

All subsequent actions requiring authentication will refer to the Fetch access tokens action. Link their access token field to Fetch access token and use the expressions below:

For TMS actions, use the expression: `{{$.tokens.tms_token}}`

For Strings actions, use the expression: `{{$.tokens.strings_token}}`

The Fetch access tokens action does not require any configuration.

---

### Event Payload Examples (TMS)

> Quelle: https://support.phrase.com/hc/en-us/articles/7806315978268-Event-Payload-Examples-TMS  
> Zuletzt aktualisiert: 2026-09-23T06:22:51Z  
> Labels: 2BTr

#### Analysis created

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "analyse": {
    "analyseLanguageParts": [
      {
        "data": {
          "all": {
            "characters": 1330.0,
            "editingTime": 0.0,
            "normalizedPages": 0.9333333333333333,
            "percent": 100.0,
            "segments": 1.0,
            "words": 351.0
          },
          "available": true,
          "estimate": false,
          "machineTranslationMatches": {
            "match0": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            }
          },
          "nonTranslatablesMatches": {
            "match0": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            }
          },
          "repetitions": {
            "characters": 0.0,
            "editingTime": 0.0,
            "normalizedPages": 0.0,
            "percent": 0.0,
            "segments": 0.0,
            "words": 0.0
          },
          "transMemoryMatches": {
            "match0": {
              "characters": 1330.0,
              "editingTime": 0.0,
              "normalizedPages": 0.9333333333333333,
              "percent": 100.0,
              "segments": 1.0,
              "words": 351.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match101": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            }
          }
        },
        "discountedData": {
          "all": {
            "characters": 1330.0,
            "editingTime": 0.0,
            "normalizedPages": 0.9333333333333332,
            "percent": 100.0,
            "segments": 1.0,
            "words": 351.0
          },
          "available": true,
          "estimate": false,
          "machineTranslationMatches": {
            "match0": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            }
          },
          "nonTranslatablesMatches": {
            "match0": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 100.0,
              "segments": 0.0,
              "words": 0.0
            }
          },
          "repetitions": {
            "characters": 0.0,
            "editingTime": 0.0,
            "normalizedPages": 0.0,
            "percent": 0.0,
            "segments": 0.0,
            "words": 0.0
          },
          "transMemoryMatches": {
            "match0": {
              "characters": 1330.0,
              "editingTime": 0.0,
              "normalizedPages": 0.9333333333333332,
              "percent": 100.0,
              "segments": 1.0,
              "words": 351.0
            },
            "match100": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match101": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match50": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match75": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match85": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            },
            "match95": {
              "characters": 0.0,
              "editingTime": 0.0,
              "normalizedPages": 0.0,
              "percent": 0.0,
              "segments": 0.0,
              "words": 0.0
            }
          }
        },
        "id": "85889",
        "jobs": [
          {
            "filename": "test-memsource (9th copy).docx",
            "innerId": "1",
            "uid": "VFUcgnRYYSW29t8uZkBx03"
          }
        ],
        "sourceLang": "ab",
        "targetLang": "ace_latn",
        "transMemories": []
      }
    ],
    "canChangeNetRateScheme": true,
    "createdBy": {
      "email": "test@example.com",
      "firstName": "QA",
      "id": "68",
      "lastName": "Memsource",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "qa_memsource"
    },
    "dateCreated": "2023-01-03T13:23:27Z",
    "id": "77612",
    "importStatus": { "errorMessage": null, "status": "OK" },
    "innerId": 1,
    "name": "Analysis #1-ab-ace_latn",
    "netRateScheme": {
      "createdBy": {
        "email": "test@example.com",
        "firstName": "Marie",
        "id": "742",
        "lastName": "Foltynova ADMIN EDITED",
        "role": "ADMIN",
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "userName": "marie.foltynova"
      },
      "dateCreated": "2018-07-12T07:32:30Z",
      "id": "232",
      "name": "My Net Rate Scheme (Translation, Revision)",
      "uid": "gWtLZtD7WyEr5htr46RTy0"
    },
    "outdated": false,
    "project": {
      "name": "83172 - test checkboxes",
      "uid": "0UG2BmQoZHTVfyhMi11SHq"
    },
    "provider": {
      "active": true,
      "email": "test@example.com",
      "firstName": "Marie",
      "id": "742",
      "lastName": "Foltynova ADMIN EDITED",
      "type": "USER",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "marie.foltynova"
    },
    "pureWarnings": [
      "Language pair ab -> ace-latn is not supported for MT QE. Processed without MT QE."
    ],
    "settings": {
      "allowAutomaticPostAnalysis": true,
      "analyzeByLanguage": true,
      "analyzeByProvider": false,
      "countSourceUnits": true,
      "includeConfirmedSegments": true,
      "includeFuzzyRepetitions": true,
      "includeLockedSegments": true,
      "includeMachineTranslationMatches": true,
      "includeNonTranslatables": true,
      "includeNumbers": true,
      "includeTransMemory": true,
      "namingPattern": "Analysis #{innerId}-{sourceLang}-{targetLang}",
      "type": "PreAnalyse"
    },
    "type": "PreAnalyse",
    "uid": "5Bu0Om29MPNf4yN7G9Lxz0"
  },
  "event": "ANALYSIS_CREATED",
  "timestamp": 1672752210,
  "createdByUid": "tms-uid"
}
```

#### Continuous job updated

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "CONTINUOUS_JOB_UPDATED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": [],
      "workUnit": {
        "id": 162634,
        "work": {
          "id": "c072906e-abc6-44b2-9328-795b81eaf362",
          "order": 36343,
          "status": "InPreparation",
          "sourceLang": "en",
          "targetLangs": ["cs"]
        },
        "file": {
          "uid": "sPVbyRUqwD9cft8jAn5634",
          "name": "strings (1).xml",
          "type": "text/xml",
          "size": 0
        },
        "supported": true
      }
    }
  ],
  "timestamp": 1672444818,
  "createdByUid": "tms-uid"
}
```

#### Job assigned

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobParts": [
    {
      "id": 6226418,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "strings (1).xml",
      "targetLang": "cs",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": -1,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-06-06T11:23:21Z",
      "project": {
        "id": 2158605,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": [],
      "workUnit": {
        "id": 162634,
        "work": {
          "id": "c072906e-abc6-44b2-9328-795b81eaf362",
          "order": 36343,
          "status": "InPreparation",
          "sourceLang": "en",
          "targetLangs": ["cs"]
        },
        "file": {
          "uid": "sPVbyRUqwD9cft8jAn5634",
          "name": "strings (1).xml",
          "type": "text/xml",
          "size": 0
        },
        "supported": true
      }
    }
  ],
  "event": "JOB_ASSIGNED",
  "timestamp": 1672327200,
  "createdByUid": "tms-uid"
}
```

#### Job Auto LQA finished

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobParts": [
    {
      "id": 6226418,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "strings (1).xml",
      "targetLang": "cs",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": -1,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-06-06T11:23:21Z",
      "project": {
        "id": 2158605,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": [],
      "workUnit": {
        "id": 162634,
        "work": {
          "id": "c072906e-abc6-44b2-9328-795b81eaf362",
          "order": 36343,
          "status": "InPreparation",
          "sourceLang": "en",
          "targetLangs": ["cs"]
        },
        "file": {
          "uid": "sPVbyRUqwD9cft8jAn5634",
          "name": "strings (1).xml",
          "type": "text/xml",
          "size": 0
        },
        "supported": true
      }
    }
  ],
  "event": "JOB_AUTO_LQA_FINISHED",
  "timestamp": 1672327200,
  "createdByUid": "tms-uid"
}
```

#### Job created

A "Job created" event fires once per job part, at the time the job part is created. Job parts for every workflow step in the project are created at job import time, not as the job later progresses into each step.

To trigger a workflow when a job reaches a specific workflow step, use a "Job status changed" trigger filtered on that step instead.

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "event": "JOB_CREATED",
  "timestamp": 1672444818,
  "createdByUid": "tms-uid"
}
```

#### Job deleted

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "JOB_DELETED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "timestamp": 1673364001,
  "createdByUid": "tms-uid"
}
```

#### Job due date changed

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "JOB_DUE_DATE_CHANGED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "timestamp": 1673364001,
  "createdByUid": "tms-uid"
}
```

#### Job exported

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "JOB_EXPORTED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "timestamp": 1673364001,
  "createdByUid": "tms-uid"
}
```

#### Job status changed

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "JOB_STATUS_CHANGED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": [{"linguist": {
            "uid": "kCEQMMNXK78qatbOSS0625",
            "firstName": "Ling",
            "lastName": "1111",
            "role": "LINGUIST",
            "deleted": false,
            "dateCreated": "2023-04-25T07:40:06Z",
            "terminologist": false,
            "timezone": "Europe/London",
            "active": true,
            "id": 5,
            "userName": "ling1",
            "email": "dsadas@dasd.com"
         }},
         {"vendor": {
            "vendorToken": "3-rm8k6-gzg4d",
            "sourceLocales": [],
            "workflowSteps": [],
            "approved": true,
            "clients": [],
            "targetLocales": [],
            "name": "Vendor Org",
            "subDomains": [],
            "domains": [],
            "id": 2,
            "netRateScheme": null,
            "priceList": null
         }}]
    }
  ],
  "timestamp": 1673364001,
  "createdByUid": "tms-uid"
}
```

#### Job target updated

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobPart": {
    "id": 9276311,
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "internalId": "1",
    "task": "T0I4kUcjLcv0E1t73_dc1",
    "fileName": "ICU-books.json",
    "targetLang": "cs",
    "workflowLevel": 1,
    "status": "NEW",
    "wordsCount": 8,
    "beginIndex": 0,
    "endIndex": 0,
    "isParentJobSplit": false,
    "dateDue": "2022-12-31T00:00:12Z",
    "dateCreated": "2023-01-09T11:26:56Z",
    "project": {
      "id": 3331069,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "lastWorkflowLevel": 1
    },
    "assignedTo": [],
    "confirmedUpdatedSegmentCount": 0,
    "unconfirmedUpdatedSegmentCount": 0,
    "duplicateContextKeysInDocument": [],
    "duplicateContextKeysInJob": []
  },
  "event": "JOB_TARGET_UPDATED",
  "timestamp": 1673263644,
  "createdByUid": "tms-uid"
}
```

#### Job unexported

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobUid": "KdUQ7rcc5UWs3ZjNXjGnQ1",
  "error": "An internal error occurred. Please contact Phrase technical support.",
  "event": "JOB_UNEXPORTED",
  "timestamp": 1672329301,
  "createdByUid": "tms-uid"
}
```

#### Job updated

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "JOB_UPDATED",
  "jobParts": [
    {
      "id": 9197148,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "1",
      "task": "7PmqAbAlm1o7TXRN0_dc1",
      "fileName": "Liliana",
      "targetLang": "de_de",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 0,
      "beginIndex": 0,
      "endIndex": -1,
      "isParentJobSplit": false,
      "dateDue": "2022-12-31T00:00:12Z",
      "dateCreated": "2022-12-31T00:00:12Z",
      "project": {
        "id": 3299156,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "timestamp": 1673364001,
  "createdByUid": "tms-uid"
}
```

#### Pre-translation finished

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "jobParts": [
    {
      "id": 9216243,
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "internalId": "2",
      "task": "4JBsAbAlm1o4xxSN0_dc1",
      "fileName": "middle.properties",
      "targetLang": "cs",
      "workflowLevel": 1,
      "status": "NEW",
      "wordsCount": 6,
      "beginIndex": 0,
      "endIndex": 5,
      "isParentJobSplit": false,
      "dateDue": "2023-01-03T13:41:27Z",
      "dateCreated": "2023-01-03T13:41:27Z",
      "project": {
        "id": 3307196,
        "uid": "sPVbyRUqwD9cft8jAn5634",
        "lastWorkflowLevel": 1
      },
      "assignedTo": []
    }
  ],
  "event": "PRE_TRANSLATION_FINISHED",
  "timestamp": 1672753291,
  "createdByUid": "tms-uid"
}
```

#### Project created

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": "2023-02-09T01:00:00.000",
    "domain": {
      "name": "Domain 1",
      "id": "380",
      "uid": "EgfdHoXGYL8V4FBYpzfQ50"
    },
    "subDomain": {
      "name": "Sub Domain 1",
      "id": "358",
      "uid": "6sQcdSNoB9HN4N0QA4NEa4"
    },
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": "Note",
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",

    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "event": "PROJECT_CREATED",
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

#### Project deleted

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_DELETED",
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": "2023-02-09T01:00:00.000",
    "domain": {
      "name": "Domain 1",
      "id": "380",
      "uid": "EgfdHoXGYL8V4FBYpzfQ50"
    },
    "subDomain": {
      "name": "Sub Domain 1",
      "id": "358",
      "uid": "6sQcdSNoB9HN4N0QA4NEa4"
    },
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": "Note",
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",

    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

#### Project due date changed

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_DUE_DATE_CHANGED",
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": "2023-02-09T01:00:00.000",
    "domain": {
      "name": "Domain 1",
      "id": "380",
      "uid": "EgfdHoXGYL8V4FBYpzfQ50"
    },
    "subDomain": {
      "name": "Sub Domain 1",
      "id": "358",
      "uid": "6sQcdSNoB9HN4N0QA4NEa4"
    },
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": "Note",
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",

    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

#### Project metadata updated

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_METADATA_UPDATED",
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": "2023-02-09T01:00:00.000",
    "domain": {
      "name": "Domain 1",
      "id": "380",
      "uid": "EgfdHoXGYL8V4FBYpzfQ50"
    },
    "subDomain": {
      "name": "Sub Domain 1",
      "id": "358",
      "uid": "6sQcdSNoB9HN4N0QA4NEa4"
    },
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": "Note",
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",

    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

#### Project status changed

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_STATUS_CHANGED",
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": "2023-02-09T01:00:00.000",
    "domain": {
      "name": "Domain 1",
      "id": "380",
      "uid": "EgfdHoXGYL8V4FBYpzfQ50"
    },
    "subDomain": {
      "name": "Sub Domain 1",
      "id": "358",
      "uid": "6sQcdSNoB9HN4N0QA4NEa4"
    },
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": "Note",
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",

    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

#### Project template created

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "projectTemplate": {
    "assignedTo": [],
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "dateCreated": "2023-01-16T11:51:33Z",
    "dateModified": "2023-01-16T11:51:33Z",
    "dateTimeModified": "2023-01-16T11:51:33Z",
    "domain": null,
    "dynamicTitle": null,
    "id": "45636",
    "importSettings": null,
    "modifiedBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "name": "N Test ICU",
    "note": null,
    "notifyProviders": null,
    "owner": null,
    "sourceLang": "en",
    "subDomain": null,
    "targetLangs": ["cs"],
    "templateName": "Test ICU",
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "useDynamicTitle": false,
    "vendor": null,
    "workflowSettings": [],
    "workflowSteps": []
  },
  "event": "PROJECT_TEMPLATE_CREATED",
  "timestamp": 1673869894,
  "createdByUid": "tms-uid"
}
```

#### Project template deleted

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_TEMPLATE_DELETED",
  "projectTemplate": {
    "assignedTo": [],
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "dateCreated": "2023-01-16T11:51:33Z",
    "dateModified": "2023-01-16T11:51:33Z",
    "dateTimeModified": "2023-01-16T11:51:33Z",
    "domain": null,
    "dynamicTitle": null,
    "id": "45636",
    "importSettings": null,
    "modifiedBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "name": "N Test ICU",
    "note": null,
    "notifyProviders": null,
    "owner": null,
    "sourceLang": "en",
    "subDomain": null,
    "targetLangs": ["cs"],
    "templateName": "Test ICU",
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "useDynamicTitle": false,
    "vendor": null,
    "workflowSettings": [],
    "workflowSteps": []
  },
  "timestamp": 1673364002,
  "createdByUid": "tms-uid"
}
```

#### Project template updated

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "PROJECT_TEMPLATE_UPDATED",
  "projectTemplate": {
    "assignedTo": [],
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "dateCreated": "2023-01-16T11:51:33Z",
    "dateModified": "2023-01-16T11:51:33Z",
    "dateTimeModified": "2023-01-16T11:51:33Z",
    "domain": null,
    "dynamicTitle": null,
    "id": "45636",
    "importSettings": null,
    "modifiedBy": {
      "email": "test@example.com",
      "firstName": "Nela",
      "id": "101728",
      "lastName": "Kurfürstová",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "nela.kurfurstova"
    },
    "name": "N Test ICU",
    "note": null,
    "notifyProviders": null,
    "owner": null,
    "sourceLang": "en",
    "subDomain": null,
    "targetLangs": ["cs"],
    "templateName": "Test ICU",
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "useDynamicTitle": false,
    "vendor": null,
    "workflowSettings": [],
    "workflowSteps": []
  },
  "timestamp": 1673364003,
  "createdByUid": "tms-uid"
}
```

#### Shared project assigned

```
{
  "_meta": {
    "organization_id": "idm-uid",
    "tms": { "organization_id": "tms-uid" }
  },
  "event": "SHARED_PROJECT_ASSIGNED",
  "project": {
    "accessSettings": { "id": "3605477" },
    "analyseSettings": { "id": "3688861" },
    "client": {
      "id": "126638",
      "uid": "BszhKKGoiTbMbZtdpbzg43",
      "name": "client 1"
    },
    "costCenter": {
      "name": "Cost center 1",
      "id": "55",
      "uid": "esJXisUK1glc2awVe7c10a"
    },
    "businessUnit": {
      "name": "Business unit 1",
      "id": "7453",
      "uid": "qaYnEWC3NZXv89ePmBXRK0"
    },
    "createdBy": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "dateCreated": "2023-01-19T11:33:42Z",
    "dateDue": null,
    "domain": null,
    "financialSettings": { "id": "3608962" },
    "id": "3391401",
    "internalId": 224221,
    "isPublishedOnJobBoard": false,
    "mtSettingsPerLanguageList": [
      {
        "machineTranslateSettings": {
          "id": "47910",
          "name": "Phrase Language AI",
          "type": "MEMSOURCE_TRANSLATE_SETTINGS",
          "uid": "qpkc3YFdhQHabBsbBpHkH2"
        },
        "targetLang": null
      }
    ],
    "name": "editorJobQa-Project-01-19-2023-11-33-42",
    "note": null,
    "owner": {
      "email": "test@example.com",
      "firstName": "Admin",
      "id": "180564",
      "lastName": "of the Caprese Buyer organisation",
      "role": "ADMIN",
      "uid": "sPVbyRUqwD9cft8jAn5634",
      "userName": "ci-admin.cypress"
    },
    "progress": { "finishedCount": 0, "overdueCount": 0, "totalCount": 0 },
    "purchaseOrder": "purchaseOrder",
    "qualityAssuranceSettings": { "id": "3612780" },
    "references": [],
    "shared": false,
    "sourceLang": "en_us",
    "status": "NEW",
    "subDomain": null,
    "targetLangs": ["cs_cz"],
    "uid": "sPVbyRUqwD9cft8jAn5634",
    "userRole": null,
    "workflowSteps": [
      {
        "abbreviation": "ws1",
        "id": 1864685,
        "name": "default wf step 1 (lqaEnabled)",
        "workflowLevel": 1,
        "workflowStep": {
          "id": "13770",
          "lqaEnabled": true,
          "name": "default wf step 1 (lqaEnabled)",
          "order": 1,
          "uid": "PZSSNKOW0hRicilWGWRMK2"
        }
      },
      {
        "abbreviation": "ws2",
        "id": 1864686,
        "name": "default wf step 2 (lqaDisabled)",
        "workflowLevel": 2,
        "workflowStep": {
          "id": "9503",
          "lqaEnabled": false,
          "name": "default wf step 2 (lqaDisabled)",
          "order": 2,
          "uid": "ft7xG2d7ZYXi6Vyw4NS1y2"
        }
      }
    ]
  },
  "timestamp": 1674128023,
  "createdByUid": "tms-uid"
}
```

---

### Event Payload Examples (Strings)

> Quelle: https://support.phrase.com/hc/en-us/articles/7806267423772-Event-Payload-Examples-Strings  
> Zuletzt aktualisiert: 2025-03-03T11:45:11Z  
> Labels: 2BTr

#### Branches create

```
{
  "branch": {
    "base_project_id": "abcdabcdabcdabcd-11",
    "branch_project_id": null,
    "created_at": "2023-01-03 08:29:51 UTC",
    "created_by": {
      "gravatar_uid": "b6d1c95c02264c7122cc715616687365",
      "id": "6b391b7edfcdc449497a56ec45be4fab",
      "name": "Peter Griffin",
      "username": "user1672734591_6"
    },
    "merged_at": null,
    "merged_by": null,
    "name": "my_branch",
    "state": "initialized",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "event": "branches:create",
  "message": "rick-ross created branch my_branch in project name_1672734591_11\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Branches merge

```
{
  "branch": {
    "base_project_id": "abcdabcdabcdabcd-11",
    "branch_project_id": null,
    "created_at": "2023-01-03 08:29:51 UTC",
    "created_by": {
      "gravatar_uid": "b6d1c95c02264c7122cc715616687365",
      "id": "6b391b7edfcdc449497a56ec45be4fab",
      "name": "Peter Griffin",
      "username": "user1672734591_6"
    },
    "merged_at": null,
    "merged_by": null,
    "name": "my_branch",
    "state": "initialized",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "event": "branches:merge",
  "message": "rick-ross merged branch my_branch in project name_1672734591_11\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Comments create

```
{
  "branch": {
    "name": "my_branch"
  },
  "comment": {
    "created_at": "2023-01-03 08:29:49 UTC",
    "id": "74158babbe3e33bef15e4b689f14a585",
    "mentioned_users": [],
    "message": "Comment 1",
    "updated_at": "2023-01-03 08:29:49 UTC",
    "user": {
      "gravatar_uid": "1f1a992c26209e156c1f6f6cf51bf386",
      "id": "0a2a97e5e9a370524882d59f9804a233",
      "name": "Peter Griffin",
      "username": "user1672734589_2"
    }
  },
  "event": "comments:create",
  "message": "  rick-ross commented on job \"Job 1\" in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs complete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:complete",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-2",
    "name": "Job 2",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross marked job Job 2 in project name_1672734591_11 within branch my_branch as completed\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:create",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-2",
    "name": "Job 2",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross created job Job 2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs locale complete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:locale:complete",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-3",
    "name": "Job 3",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "locale": {
    "code": "de-DE",
    "created_at": "2023-01-03 08:29:50 UTC",
    "default": false,
    "fallback_locale": null,
    "id": "529fa169b27c61eb430762aba2316c96",
    "main": false,
    "name": "en-3",
    "plural_forms": [
      "zero",
      "one",
      "other"
    ],
    "rtl": false,
    "source_locale": null,
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross marked locale en-3 of job Job 3 in project name_1672734591_11 within branch my_branch as completed\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs locale reopened

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:locale:reopened",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-3",
    "name": "Job 3",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "locale": {
    "code": "de-DE",
    "created_at": "2023-01-03 08:29:50 UTC",
    "default": false,
    "fallback_locale": null,
    "id": "529fa169b27c61eb430762aba2316c96",
    "main": false,
    "name": "en-3",
    "plural_forms": [
      "zero",
      "one",
      "other"
    ],
    "rtl": false,
    "source_locale": null,
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross reopened locale en-3 of job Job 3 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs reopened

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:reopened",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-2",
    "name": "Job 2",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross reopened job Job 2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs start

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:start",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-2",
    "name": "Job 2",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross started job Job 2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Jobs update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "jobs:update",
  "job": {
    "briefing": "Please translate everything!",
    "created_at": "2023-01-03 08:29:50 UTC",
    "due_date": "2023-01-04 08:29:50 UTC",
    "id": "abcd-2",
    "name": "Job 2",
    "state": "draft",
    "ticket_url": "",
    "updated_at": "2023-01-03 08:29:50 UTC"
  },
  "message": "rick-ross updated job Job 2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Keys batch delete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "keys:batch_delete",
  "message": "rick-ross deleted  keys in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Keys create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "keys:create",
  "key": {
    "created_at": "2023-01-03 08:29:48 UTC",
    "description": null,
    "id": "50dd5b1f9a03054614190d41148b1c7d",
    "max_characters_allowed": 0,
    "name": "index.key1",
    "name_hash": "500644bd75d103ea94ea2cb5d962a0d4",
    "plural": false,
    "tags": [],
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross created key index.key1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Keys delete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "keys:delete",
  "key": {
    "created_at": "2023-01-03 08:29:48 UTC",
    "description": null,
    "id": "50dd5b1f9a03054614190d41148b1c7d",
    "max_characters_allowed": 0,
    "name": "index.key1",
    "name_hash": "500644bd75d103ea94ea2cb5d962a0d4",
    "plural": false,
    "tags": [],
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross deleted key index.key1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Keys update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "keys:update",
  "key": {
    "created_at": "2023-01-03 08:29:48 UTC",
    "description": null,
    "id": "50dd5b1f9a03054614190d41148b1c7d",
    "max_characters_allowed": 0,
    "name": "index.key1",
    "name_hash": "500644bd75d103ea94ea2cb5d962a0d4",
    "plural": false,
    "tags": [],
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross updated key index.key1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Locales create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "locales:create",
  "locale": {
    "code": "de-DE",
    "created_at": "2023-01-03 08:29:48 UTC",
    "default": false,
    "fallback_locale": null,
    "id": "dd5fa5758ef33129e71ae380ad297ec4",
    "main": false,
    "name": "en-1",
    "plural_forms": [
      "zero",
      "one",
      "other"
    ],
    "rtl": false,
    "source_locale": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross created locale en-1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Locales delete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "locales:delete",
  "locale": {
    "code": "de-DE",
    "created_at": "2023-01-03 08:29:48 UTC",
    "default": false,
    "fallback_locale": null,
    "id": "dd5fa5758ef33129e71ae380ad297ec4",
    "main": false,
    "name": "en-1",
    "plural_forms": [
      "zero",
      "one",
      "other"
    ],
    "rtl": false,
    "source_locale": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross deleted locale en-1 from project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Locales update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "locales:update",
  "locale": {
    "code": "de-DE",
    "created_at": "2023-01-03 08:29:48 UTC",
    "default": false,
    "fallback_locale": null,
    "id": "dd5fa5758ef33129e71ae380ad297ec4",
    "main": false,
    "name": "en-1",
    "plural_forms": [
      "zero",
      "one",
      "other"
    ],
    "rtl": false,
    "source_locale": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "message": "rick-ross updated locale en-1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Project update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "project:update",
  "message": "rick-ross updated project testproject\n",
  "project": {
    "account": {
      "company": "Pawtucket Brewery",
      "company_logo_url": null,
      "created_at": "2023-01-03 08:29:48 UTC",
      "id": "abcdef1",
      "name": "Family Guy",
      "slug": "family-guy",
      "updated_at": "2023-01-03 08:29:48 UTC"
    },
    "created_at": "2023-01-03 08:29:48 UTC",
    "id": "abcdabcdabcdabcd-1",
    "main_format": "yml",
    "name": "testproject",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "testproject",
    "space": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Screenshots create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "screenshots:create",
  "message": "rick-ross created screenshot screenshot_1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "screenshot": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "description": "screenshot_1",
    "id": "screenshot_1",
    "markers_count": 0,
    "name": "screenshot_1",
    "screenshot_url": "http://www.example.com/uploads/screenshots/screenshot_1/screenshot-5c7d34d88bd318c4.jpg",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Screenshots delete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "screenshots:delete",
  "message": "rick-ross deleted a screenshot in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "screenshot": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "description": "screenshot_1",
    "id": "screenshot_1",
    "markers_count": 0,
    "name": "screenshot_1",
    "screenshot_url": "http://www.example.com/uploads/screenshots/screenshot_1/screenshot-5c7d34d88bd318c4.jpg",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Screenshots update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "screenshots:update",
  "message": "rick-ross updated screenshot screenshot_1 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "screenshot": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "description": "screenshot_1",
    "id": "screenshot_1",
    "markers_count": 0,
    "name": "screenshot_1",
    "screenshot_url": "http://www.example.com/uploads/screenshots/screenshot_1/screenshot-5c7d34d88bd318c4.jpg",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations batch delete

```
{
  "event": "translations:batch_delete",
  "message": "10 Translations deleted in project Translation Project within branch new-feature-1",
  "deleted_translations_count": 10,
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  }
}
```

#### Translations batch review

```
{
  "event": "translations:batch_review",
  "message": "1 translations reviewed in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translations": [
    {
      "id": "89252e4570e73c051fce446c8c55670d",
      "content": "Header title",
      "unverified": false,
      "excluded": false,
      "plural_suffix": "",
      "created_at": "2025-02-07T16:18:13Z",
      "updated_at": "2025-02-07T16:18:13Z",
      "placeholders": [],
      "state": "translated",
      "key": {
        "id": "fe5b97045d80f91dd950b695d5ebe607",
        "name": "application.modal.header",
        "plural": false,
        "data_type": "string",
        "tags": [
          "web"
        ]
      },
      "locale": {
        "id": "7d8614f35033cebada71d4471fd87518",
        "name": "en",
        "code": "en"
      }
    }
  ]
}
```

#### Translations batch verify

```
{
  "event": "translations:batch_verify",
  "message": "1 translations verified in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translations": [
    {
      "id": "89252e4570e73c051fce446c8c55670d",
      "content": "Header title",
      "unverified": false,
      "excluded": false,
      "plural_suffix": "",
      "created_at": "2025-02-07T16:18:13Z",
      "updated_at": "2025-02-07T16:18:13Z",
      "placeholders": [],
      "state": "translated",
      "key": {
        "id": "fe5b97045d80f91dd950b695d5ebe607",
        "name": "application.modal.header",
        "plural": false,
        "data_type": "string",
        "tags": [
          "web"
        ]
      },
      "locale": {
        "id": "7d8614f35033cebada71d4471fd87518",
        "name": "en",
        "code": "en"
      }
    }
  ]
}
```

#### Translations batch unverify

```
{
  "event": "translations:batch_unverify",
  "message": "1 translations unverified in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translations": [
    {
      "id": "89252e4570e73c051fce446c8c55670d",
      "content": "Header title",
      "unverified": false,
      "excluded": false,
      "plural_suffix": "",
      "created_at": "2025-02-07T16:18:13Z",
      "updated_at": "2025-02-07T16:18:13Z",
      "placeholders": [],
      "state": "translated",
      "key": {
        "id": "fe5b97045d80f91dd950b695d5ebe607",
        "name": "application.modal.header",
        "plural": false,
        "data_type": "string",
        "tags": [
          "web"
        ]
      },
      "locale": {
        "id": "7d8614f35033cebada71d4471fd87518",
        "name": "en",
        "code": "en"
      }
    }
  ]
}
```

#### Translations batch unreview

```
{
  "event": "translations:batch_unreview",
  "message": "1 translations unreviewed in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translations": [
    {
      "id": "89252e4570e73c051fce446c8c55670d",
      "content": "Header title",
      "unverified": false,
      "excluded": false,
      "plural_suffix": "",
      "created_at": "2025-02-07T16:18:13Z",
      "updated_at": "2025-02-07T16:18:13Z",
      "placeholders": [],
      "state": "translated",
      "key": {
        "id": "fe5b97045d80f91dd950b695d5ebe607",
        "name": "application.modal.header",
        "plural": false,
        "data_type": "string",
        "tags": [
          "web"
        ]
      },
      "locale": {
        "id": "7d8614f35033cebada71d4471fd87518",
        "name": "en",
        "code": "en"
      }
    }
  ]
}
```

#### Translations create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "translations:create",
  "message": "rick-ross created translation for key index.key2 in locale en-2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "translation": {
    "content": "My Translation",
    "created_at": "2023-01-03 08:29:49 UTC",
    "excluded": false,
    "id": "08b7f89628bfd2de87c740c720b38d8e",
    "key": {
      "data_type": "string",
      "description": null,
      "id": "66584e5236c2290dcfb6f98ef06f1f7a",
      "name": "index.key2",
      "plural": false,
      "tags": []
    },
    "locale": {
      "code": "de-DE",
      "id": "65611593fe0f4fdc350814e4c5ad253f",
      "name": "en-2"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "translated",
    "unverified": false,
    "updated_at": "2023-01-03 08:29:49 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations delete

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "translations:delete",
  "message": "Translation deleted for key \"index.key2\" in locale en-2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "translation": {
    "content": "My Translation",
    "created_at": "2023-01-03 08:29:49 UTC",
    "excluded": false,
    "id": "08b7f89628bfd2de87c740c720b38d8e",
    "key": {
      "data_type": "string",
      "description": null,
      "id": "66584e5236c2290dcfb6f98ef06f1f7a",
      "name": "index.key2",
      "plural": false,
      "tags": []
    },
    "locale": {
      "code": "de-DE",
      "id": "65611593fe0f4fdc350814e4c5ad253f",
      "name": "en-2"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "translated",
    "unverified": false,
    "updated_at": "2023-01-03 08:29:49 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations deliver

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "translations:deliver",
  "message": "Translation delivered for key \"index.key2\" in locale en-2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "translation": {
    "content": "My Translation",
    "created_at": "2023-01-03 08:29:49 UTC",
    "excluded": false,
    "id": "08b7f89628bfd2de87c740c720b38d8e",
    "key": {
      "data_type": "string",
      "description": null,
      "id": "66584e5236c2290dcfb6f98ef06f1f7a",
      "name": "index.key2",
      "plural": false,
      "tags": []
    },
    "locale": {
      "code": "de-DE",
      "id": "65611593fe0f4fdc350814e4c5ad253f",
      "name": "en-2"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "translated",
    "unverified": false,
    "updated_at": "2023-01-03 08:29:49 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations review

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "translations:review",
  "message": "rick-ross reviewed translation for key index.key2 in locale en-2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "translation": {
    "content": "My Translation",
    "created_at": "2023-01-03 08:29:49 UTC",
    "excluded": false,
    "id": "08b7f89628bfd2de87c740c720b38d8e",
    "key": {
      "data_type": "string",
      "description": null,
      "id": "66584e5236c2290dcfb6f98ef06f1f7a",
      "name": "index.key2",
      "plural": false,
      "tags": []
    },
    "locale": {
      "code": "de-DE",
      "id": "65611593fe0f4fdc350814e4c5ad253f",
      "name": "en-2"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "translated",
    "unverified": false,
    "updated_at": "2023-01-03 08:29:49 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations unverify

```
{
  "event": "translations:unverify",
  "message": "john.smith unverified translation for key application.modal.header in locale en in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translation": {
    "id": "89252e4570e73c051fce446c8c55670d",
    "content": "Header title",
    "unverified": false,
    "excluded": false,
    "plural_suffix": "",
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "placeholders": [],
    "state": "translated",
    "key": {
      "id": "fe5b97045d80f91dd950b695d5ebe607",
      "name": "application.modal.header",
      "plural": false,
      "data_type": "string",
      "tags": [
        "web"
      ],
      "description": "Title for modal headers"
    },
    "locale": {
      "id": "7d8614f35033cebada71d4471fd87518",
      "name": "en",
      "code": "en"
    }
  }
}
```

#### Translations unreview

```
{
  "event": "translations:unreview",
  "message": "john.smith unreviewed translation for key application.modal.header in locale en in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translation": {
    "id": "89252e4570e73c051fce446c8c55670d",
    "content": "Header title",
    "unverified": false,
    "excluded": false,
    "plural_suffix": "",
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "placeholders": [],
    "state": "translated",
    "key": {
      "id": "fe5b97045d80f91dd950b695d5ebe607",
      "name": "application.modal.header",
      "plural": false,
      "data_type": "string",
      "tags": [
        "web"
      ],
      "description": "Title for modal headers"
    },
    "locale": {
      "id": "7d8614f35033cebada71d4471fd87518",
      "name": "en",
      "code": "en"
    }
  }
}
```

#### Translations update

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "translations:update",
  "message": "rick-ross updated translation for key index.key2 in locale en-2 in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "translation": {
    "content": "My Translation",
    "created_at": "2023-01-03 08:29:49 UTC",
    "excluded": false,
    "id": "08b7f89628bfd2de87c740c720b38d8e",
    "key": {
      "data_type": "string",
      "description": null,
      "id": "66584e5236c2290dcfb6f98ef06f1f7a",
      "name": "index.key2",
      "plural": false,
      "tags": []
    },
    "locale": {
      "code": "de-DE",
      "id": "65611593fe0f4fdc350814e4c5ad253f",
      "name": "en-2"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "translated",
    "unverified": false,
    "updated_at": "2023-01-03 08:29:49 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Translations verify

```
{
  "event": "translations:verify",
  "message": "john.smith verified translation for key application.modal.header in locale en in project Translation Project within branch new-feature-1",
  "user": {
    "id": "24b9a53ad72e198ca332fba91bb95f57",
    "username": "john.smith",
    "name": "John Smith",
    "gravatar_uid": "1bc5edb4799fd8eec67c66122f47eb73"
  },
  "project": {
    "id": "b2abd3bd2c23ff0ac546e0a2d9aa0be1",
    "name": "Translation Project",
    "slug": "translation-project",
    "main_format": "yml",
    "project_image_url": null,
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "point_of_contact": null
  },
  "branch": {
    "name": "new-feature-1"
  },
  "translation": {
    "id": "89252e4570e73c051fce446c8c55670d",
    "content": "Header title",
    "unverified": false,
    "excluded": false,
    "plural_suffix": "",
    "created_at": "2025-02-07 16:18:13 UTC",
    "updated_at": "2025-02-07 16:18:13 UTC",
    "placeholders": [],
    "state": "translated",
    "key": {
      "id": "fe5b97045d80f91dd950b695d5ebe607",
      "name": "application.modal.header",
      "plural": false,
      "data_type": "string",
      "tags": [
        "web"
      ],
      "description": "Title for modal headers"
    },
    "locale": {
      "id": "7d8614f35033cebada71d4471fd87518",
      "name": "en",
      "code": "en"
    }
  }
}
```

#### Uploads create

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "uploads:create",
  "message": "rick-ross uploaded file file.yml in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "upload": {
    "created_at": "2023-01-03 08:29:48 UTC",
    "filename": "file.yml",
    "format": "yml",
    "id": "upload-1",
    "state": "initialized",
    "summary": {},
    "tag": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

#### Uploads processing

```
{
  "branch": {
    "name": "my_branch"
  },
  "event": "uploads:processing",
  "message": "rick-ross initialized file upload file.yml in project name_1672734591_11 within branch my_branch\n",
  "project": {
    "created_at": "2023-01-03 08:29:51 UTC",
    "id": "abcdabcdabcdabcd-11",
    "main_format": "yml",
    "name": "name_1672734591_10",
    "point_of_contact": null,
    "project_image_url": null,
    "slug": "name_1672734591_10",
    "updated_at": "2023-01-03 08:29:51 UTC"
  },
  "upload": {
    "created_at": "2023-01-03 08:29:48 UTC",
    "filename": "file.yml",
    "format": "yml",
    "id": "upload-1",
    "state": "initialized",
    "summary": {},
    "tag": null,
    "updated_at": "2023-01-03 08:29:48 UTC"
  },
  "user": {
    "gravatar_uid": "29a2d1baa67d4ea524cf0f247f7bbb94",
    "id": "9c365b9a6f77c247c3de959f6152b231",
    "name": "Peter Griffin",
    "username": "rick-ross"
  }
}
```

---

### File Support

> Quelle: https://support.phrase.com/hc/en-us/articles/10403621420188-File-Support  
> Zuletzt aktualisiert: 2026-06-26T06:24:16Z  
> Labels: 2BTr

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/caX24op7SSY?feature=shared)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

All supported actions save their results in a file that can be used by subsequent actions. Only files output from previous actions can be used (uploading of files is not supported).

All file formats returned by supported APIs can be used.

Use `{{ @raw }}` or `{{ @file.path }}` for referencing in subsequent actions.

##### Supported actions

- **Strings**

  - Create a new screenshot
  - Upload a new file
- **TMS**

  - Create job
  - Create segmentation rule
  - Download preview file
  - Download prepared file
  - Upload term base
  - Import TMX
  - Update source
  - Update target
  - Upload bilingual file
  - Upload a file to a subfolder of the selected connector
  - Upload handover file

##### Use case

The following workflow gets triggered when a locale inside a Phrase Strings job is marked completed. It downloads the locale as `.json` and imports it into a different project. This allows having a separate project, for example as a backup or an over-the-air specific one.

![File Upload Example](https://support.phrase.com/hc/article_attachments/30682516684316)

The locale’s `.json` export has a highly variable size. For smaller projects, it may only be a few lines, whereas for larger projects it can grow in length very quickly. By using the `{{ @file.path }}` reference, the export can be referenced without concerns for file size limitations.

---

### Workflow Templates

> Quelle: https://support.phrase.com/hc/en-us/articles/10403607849628-Workflow-Templates  
> Zuletzt aktualisiert: 2026-07-28T06:20:13Z  
> Labels: 2BTr

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/as3YQNZdFyY?feature=shared)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

A library of common templates is available for [building workflows](https://support.phrase.com/hc/en-us/articles/7681638101532#UUID-2a7a8150-7b14-0f4f-110c-f8042fd3316f "Create a Workflow"). Click Template Library in the left-hand menu to open the library.

Templates are presented in the library with short description and can be both searched and sorted by provider.

To use a template for a workflow, follow these steps:

1. Click Preview for the selected template.

   The preview opens with the template displayed as a workflow.
2. Click Import template.

   The template is opened in a new workflow with pre-populated values. Values and parameters can be modified as required.

   An imported template becomes a regular workflow once published. It follows the same action-version behavior as a manually built workflow, so its actions may need re-validating if a version becomes outdated.

#### Configure Workflow Templates

To ensure optimal workflow performance, there are a series of preliminary steps to complete before configuring a workflow template. If prompted to retrieve a value during these steps, save it in a temporary notepad file for future reference when configuring the workflow.

The following examples of configuration assume the relevant template has been imported and is ready to publish.

##### TMS Template: Review QA flagged content

###### Preliminary steps

1. Create a new [project](https://support.phrase.com/hc/en-us/articles/10825044285340#UUID-3ec95012-fe40-e725-1b2e-67b8d303676d) in TMS with the following conditions:

   - The name of the project contains `ORCH-TEST`.
   - [Pre-translation](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) uses MT.
   - Pre-translation happens automatically or is manually triggered after a job is created.
2. Ensure there is a [project template](https://support.phrase.com/hc/en-us/articles/5709647439772#UUID-94346683-ae2a-16b5-7e16-94a554612687) that can assign users to jobs in the created project. If not, save the newly created project as a template, and set up assignment rules in the Providers section of the template.
3. Open the project template by selecting it from the project template list, then copy its UID from the URL and save it in a notepad.
4. Open TMS in a Chrome browser and navigate to the Email templates page by selecting Settings/Administration/Email templates. Select the desired email template and press **F12** to enable Chrome's Inspect mode.
5. Select Network from Chrome's Inspect panel and click Save in the TMS email template.

   Two headers are displayed on the Inspect panel. Click the top one, copy the UID at the end of the Request URL field and save this value in a notepad.

   ![Network UID Example](https://support.phrase.com/hc/article_attachments/30682480682524)
6. Go to <https://cloud.memsource.com/web/docs/api#operation/runQaForJobPartsV3> and expand settings in the REQUEST BODY SCHEMA.

   All possible values for [QA checks](https://support.phrase.com/hc/en-us/articles/5709703799324#UUID-83632035-0d65-f957-b0dd-ad00704f8d25) are displayed under warningTypes. Make note of the desired QA checks.
7. Create a JSON based on this example:

   ```
   {"templateUid":"1xIwBX5Zj2TGnWpbxKCnB2", 
   "emailUid":"CKJtAh2ihgW7dVqCi4B1G7", 
   "QAchecks": ["NonConformingTerm","ForbiddenTerm"]}
   ```

   - `templateUID` is the UID identified in step 3.
   - `emailUID` is the UID identified in step 5.
   - `QAchecks` uses the QA checks identified in step 6.

###### Using the template

1. In the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), open the parameters of the Configuration values action. Replace the template's JSON with the JSON from preliminary step 7.
2. Publish the workflow.
3. Go back to the TMS project and import a new job.

   ### Note

   If the job is not pre-translated automatically, pre-translate it manually.

   The Orchestrator workflow is triggered. After [execution](https://support.phrase.com/hc/en-us/articles/7778580178332#UUID-8130cceb-dd15-816b-3472-e2bfa5860712 "Executions"), the job in the first workflow step is either completed or assigned according to the project template settings.

##### TMS Template: Adapt for locale variants

###### Preliminary steps

1. Create a new [project](https://support.phrase.com/hc/en-us/articles/10825044285340#UUID-3ec95012-fe40-e725-1b2e-67b8d303676d) in TMS with the following conditions:

   - The name of the project contains `ORCH-TEST`.
   - Target language is set to these locales: deAT, deDE, esAR, esES, esMX.
   - [Pre-translation](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) does not happen automatically.
2. Create two [translation memories](https://support.phrase.com/hc/en-us/articles/9386879736604#UUID-2ac08b2e-0881-5ab4-07d1-2ea0e3fcfc95) (TM):

   - TM1 with all the language locales: deAT, deDE, esAR, esES, esMX
   - TM2 with only the main locales: DE and ES
3. From the Translation memories table of the project, click Select to configure both TMs as follows:

   - Main locales (DE and ES)

     Select both TMs with WRITE mode enabled. [Define priority order](https://support.phrase.com/hc/en-us/articles/5709739807260#UUID-474bfced-f444-b60b-864f-6b3763e23425) by setting TM1 as primary.

     ![TM Write Option Location](https://support.phrase.com/hc/article_attachments/30682516799260)
   - Other language locales

     Select both TMs and enable the WRITE mode only for TM1. Define priority order by setting TM1 as primary and adding a 2% penalty to TM2.

     ![TM Set Penalty Location](https://support.phrase.com/hc/article_attachments/30682454055580)

   TM configuration is displayed in the Translation memories table:

   ![TM Configuration in Table](https://support.phrase.com/hc/article_attachments/30682480728092)

###### Using the template

1. Open the template in the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow") and note these settings:

   - The trigger is filtered for the target language code. To further customize the workflow, change the target language filters on the trigger.
   - The Language inheritance action has a hard-coded JSON that defines language behavior. For customization, edit this JSON as required.

     ```
     [
         {
             "source": "de_de",
             "target": [
                 "de_at"
             ]
         },
         {
             "source": "es_es",
             "target": [
                 "es_mx",
                 "es_ar"
             ]
         }
     ]
     ```
   - The workflow filters jobs in the different language locales based on the file name of the completed job. Therefore, this workflow is reliable only if file names are unique. For non-unique file names, a more complex workflow may be needed.
2. Publish the workflow.
3. Go back to the TMS project, and [import a new job](https://support.phrase.com/document/preview/4557#UUID-86543056-6056-5c1b-8666-45bc5d78c2c8) for all target languages.
4. Translate DE-DE or ES-ES jobs and complete them.

   The Orchestrator workflow is triggered. After execution:

   - Jobs in the corresponding language locales are pre-translated.
   - Any segments already stored in TM1 will be 101 or 100% matches.
   - Any segments with new or modified content will be 99% matches inserted from TM2.

##### TMS Template: Auto Adapt

###### Preliminary steps

1. Create a new [project](https://support.phrase.com/hc/en-us/articles/10825044285340#UUID-3ec95012-fe40-e725-1b2e-67b8d303676d) in TMS with the following conditions:

   - Two workflow steps
   - The first workflow step is a dedicated pre-translation step used to capture the original results coming from available resources before [Auto Adapt](https://support.phrase.com/hc/en-us/articles/18807673145372#UUID-3c54e0d6-7905-5124-8eb4-5978debc5e3f "Auto Adapt (Orchestrator)") is applied.
2. Optionally automate the completion of jobs in this step in the pre-translation settings of the project.

###### Using the template

1. Copy the UID of the project from its URL and insert it into the Condition of the workflow trigger.

   - The UID can be found at the end of the URL in a browser.

     Example: https://cloud.phrase.com/web/project2/show/*KY6gfZXv4Gqw7B0m1U8br6*
   - Edit the condition by clicking the blue bar on top of the trigger and replacing the PROJECT\_UID placeholder with the copied UID.
2. Publish the workflow.
3. Either manually or automatically set a job in the first workflow step to *Completed* after pre-translation.

   The Orchestrator workflow is triggered. It will identify a job in the second workflow step, perform Auto Adapt on that job, and set it to *Completed* when finished.

##### TMS Template: MT Optimize

###### Preliminary steps

1. Create a new [project](https://support.phrase.com/hc/en-us/articles/10825044285340#UUID-3ec95012-fe40-e725-1b2e-67b8d303676d) in TMS with the following conditions:

   - Two workflow steps
   - The first workflow step is a dedicated pre-translation step used to capture the original results coming from available resources before optimization of [MT](https://support.phrase.com/hc/en-us/articles/5709692009884#UUID-5ee4d7fd-b6eb-a722-73da-3fdcb23390b0) output is applied.
2. Optionally automate the completion of jobs in this step in the pre-translation settings of the project.

###### Using the template

1. Copy the UID of the project from its URL and insert it into the Condition of the workflow trigger.

   - The UID can be found at the end of the URL in a browser.

     Example: https://cloud.phrase.com/web/project2/show/*KY6gfZXv4Gqw7B0m1U8br6*
   - Edit the condition by clicking the blue bar on top of the trigger and replacing the PROJECT\_UID placeholder with the copied UID.
2. Publish the workflow.
3. Either manually or automatically set a job in the first workflow step to *Completed* after pre-translation.

   The Orchestrator workflow is triggered. It will identify a job in the second workflow step, perform the Optimization of MT output on that job, and set it to *Completed* when finished.

##### TMS Template: QPS based segment routing

###### Preliminary steps

1. Create a new [project](https://support.phrase.com/hc/en-us/articles/10825044285340#UUID-3ec95012-fe40-e725-1b2e-67b8d303676d) in TMS with the following conditions:

   - The name of the project contains `ORCH-TEST-QPS`.
   - The project has a minimum of 2 workflow steps.
   - [Pre-translation](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) uses MT.
   - Pre-translation happens automatically or is manually triggered after a job is created.
   - Pre-translation is set to complete the job, so that the Orchestrator workflow is triggered automatically after the import.
2. Ensure there is a [project template](https://support.phrase.com/hc/en-us/articles/5709647439772#UUID-94346683-ae2a-16b5-7e16-94a554612687) that can assign users to jobs in the created project. If not, save the newly created project as a template, and set up assignment rules in the Providers section of the template.
3. Open the project template by selecting it from the project template list, then copy its UID from the URL and save it in a notepad.
4. Open TMS in a Chrome browser and navigate to the Email templates page by selecting Settings/Administration/Email templates. Select the desired email template and press **F12** to enable Chrome's Inspect mode.
5. Select Network from Chrome's Inspect panel and click Save in the TMS email template.

   Two headers are displayed on the Inspect panel. Click the top one, copy the UID at the end of the Request URL field and save this value in a notepad.

   ![Network UID Example](https://support.phrase.com/hc/article_attachments/30682480682524)
6. Go to <https://cloud.memsource.com/web/docs/api#operation/runQaForJobPartsV3> and expand settings in the REQUEST BODY SCHEMA.

   All possible values for [QA checks](https://support.phrase.com/hc/en-us/articles/5709703799324#UUID-83632035-0d65-f957-b0dd-ad00704f8d25) are displayed under warningTypes. Make note of the desired QA checks.
7. Create a JSON based on this example:

   ```
   {"templateUid":"1xIwBX5Zj2TGnWpbxKCnB2", 
   "emailUid":"CKJtAh2ihgW7dVqCi4B1G7", 
   "QAchecks": ["NonConformingTerm","ForbiddenTerm"]}
   ```

   - `templateUID` is the UID identified in step 3.
   - `emailUID` is the UID identified in step 5.
   - `QAchecks` uses the QA checks identified in step 6.

###### Using the template

1. In the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), open the parameters of the Configuration values action. Replace the template's JSON with the JSON from preliminary step 7.
2. Publish the workflow.
3. Go back to the TMS project and import a new job.

   ### Note

   If the job is not pre-translated and completed automatically, pre-translate and complete it manually.

   The Orchestrator workflow is triggered. After [execution](https://support.phrase.com/hc/en-us/articles/7778580178332#UUID-8130cceb-dd15-816b-3472-e2bfa5860712 "Executions"):

   - Eligible segments are locked and confirmed.
   - In the second workflow step, the job in the second workflow step enters [EMAILED status](https://support.phrase.com/hc/en-us/articles/10825557816092#UUID-31d37245-0c81-4869-f9f6-31b5cd66d2af) and is assigned based on the project template settings.

##### TMS Template: Asana Auto-create / Auto-complete

###### Use case

1. When a new translation project is created in Phrase, automatically create a task in Asana with the Phrase TMS project details.
2. Send a notification or update the task in Asana to notify the project manager when a translation project is marked as complete in Phrase TMS.

###### Auto-create a task

###### Preliminary Steps

1. [Generate](https://developers.asana.com/docs/personal-access-token) a token in Asana then securely store it as a [variable](https://support.phrase.com/hc/en-us/articles/15711755060252#UUID-c322be48-e44d-2ac3-94a3-ed3a8ccaf7b2 "Variables (Orchestrator)") in Orchestrator.

   An authentication token in order to exchange data between Orchestrator and an Asana account is required.
2. Find the workspace UID in Asana:

   1. Select the the profile icon to [display the organization details](https://help.asana.com/s/article/how-to-access-the-admin-console?language=en_US#gl-access-console:~:text=your%20tech%20stack.-,Access%20the%20organization%20admin%20console,-To%20access%20the) in a new tab of the browser.

      The URL shows something like *https://app.asana.com/admin/111111111111111/overview*.
   2. Copy the UID (`111111111111111`) from the URL and save it in a notepad.
3. Find the project UID in Asana:

   1. Navigate to the desired project where tasks will be automatically created.

      The URL shows something like *https://app.asana.com/0/2222222222222222/3333333333333333*.
   2. From the project URL, copy the UID (`2222222222222222`) , then save it in a notepad.
4. In Phrase TMS, configure a [custom field](https://support.phrase.com/hc/en-us/articles/10825060868380#UUID-7a87e704-94b0-59d4-b89c-625c8e4c1fb2) to store an Asana Task ID.
5. In Settings/Project Metadata/Custom Fields, select the row that contains the Asana Task ID custom field.
6. Right-click on the row and select Inspect.

   This will open the browser's developer console.
7. In the console, find the value that starts with `td data-testing`. Look above it for the first `tr class` value that looks like `row-icyz98tQWPbp3ZRd3q9mg3`.
8. Copy only the ID (e.g., `icyz98tQWPbp3ZRd3q9mg3`) and save it a notepad.

###### Using the Template

A populated custom field for `asana_id` is required for this workflow to execute.

1. In the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), open the parameters of the [Send HTTP Request](https://support.phrase.com/hc/en-us/articles/15475270132380#UUID-fc3c29a2-5b46-a06d-04bc-0a3c4c15b48d "Webhooks (Orchestrator)") action.

   1. Under the headers parameter, there is a name/value pair for Authorization. Use the Field Picker to replace the content in value with the Asana variable as defined in preliminary steps.

      The output format should be `Bearer {{ @<variable name> }}`.
2. In the Data parameter, replace the placeholder values with the Asana project ID and workspace ID identified in the preliminary steps.
3. Open the parameters for the Update TMS project with Asana details action.

   - Under customFields, replace the uid with the custom field ID placeholder identified in the preliminary steps.
4. Publish the workflow.
5. In TMS, complete the project.

   The Orchestrator workflow is triggered to automatically create a task in Asana.

###### Auto-complete a TMS project

###### Preliminary Steps

This template works in conjunction with the Auto-create template.

###### Using the Template

1. In the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), open the parameters of the [Send HTTP Request](https://support.phrase.com/hc/en-us/articles/15475270132380#UUID-fc3c29a2-5b46-a06d-04bc-0a3c4c15b48d "Webhooks (Orchestrator)") action.

   1. Under the headers parameter, there is a name/value pair for Authorization. Use the Field Picker to replace the content in value with the Asana variable as defined in preliminary steps.

      The output format should be `Bearer {{ @<variable name> }}`.
2. Publish the workflow.

##### Strings Template: Key level language adaptation

###### Description

This workflow monitors for a translation being saved and set to *Reviewed* state within the editor. Once a translation is set to *Reviewed*, the workflow automatically checks if the translation needs to be copied to any of the other locales. E.g. when the translation for French is completed and set to *Reviewed*, the same translation is copied into the Canadian French locale. The copied translation is set to the *Unverified* state. If there is a translation for the adapted locale, it is overwritten.

This workflow allows the configuration of language inheritance rules using a JSON object similar to this example:

```
[
    {
        "source": "de",
        "target": [
            "de-at",
            "de-ch"
        ]
    },
    {
        "source": "fr",
        "target": [
            "fr-ca",
            "fr-ch"
        ]
    }
]
```

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger filter.

   1. Select the trigger.
   2. From the Filters tab, click Edit filter.
   3. Replace <Project ID> with the project ID of the workflow.

      - The project ID can be copied from Strings by looking up the project in the project list and clicking the ID button.
   4. Optionally click the + Item button and add another project ID to apply the template to more than one project. To run the workflow with all projects, remove the filter.
   5. Click Save filters.
3. Create a .JSON file in a text editor based on the example.

   - Ensure the language names are exactly the same as in the project. To check language names, view them in the the Languages tab.
4. Edit the parameters of the Configuration values action.

   1. Open the Configuration values action.
   2. From the Parameters tab, click Edit parameters.
   3. Use the .JSON from step 3 for the input field.
   4. Click Save parameters.
5. From the project, edit a translation and save it as Reviewed.

The workflow is triggered and the copied, unreviewed translations for the locales adapted from the completed language are displayed.

##### Strings Template: Automatic job completion

###### Description

This workflow monitors for a job target locale being completed. Once a job target locale is completed, the workflow automatically checks if all job target locales are completed, and if so, the whole job is completed. If any locales are incomplete, the job is not set to complete.

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger filter.

   1. Select the trigger.
   2. From the Filters tab, click Edit filter.
   3. Replace <Project ID> with the project ID of the workflow.

      - The project ID can be copied from Strings by looking up the project in the project list and clicking the ID button.
   4. Optionally click the + Item button and add another project ID to apply the template to more than one project. To run the workflow with all projects, remove the filter.
   5. Click Save filters.
3. Publish the workflow.
4. In the project, open and existing job or start a new one.
5. Mark on the job target locales as *Completed*.

Within a couple minutes, the execution starts.

##### Strings Template: Send content to GitHub

###### Preliminary steps

1. Create a [project](https://support.phrase.com/hc/en-us/articles/5784094677404#UUID-67ae68da-d206-0281-f708-35cfdfb52252) in Strings. Make a note of the ProjectUID.
2. [Configure a GitHub sync](https://support.phrase.com/hc/en-us/articles/5784125562012#UUID-cf2204a1-f43a-ab57-3c14-1276e105332d) for this project as well as in GitHub (i.e. create and test the configuration YAML file).
3. Manually test content import and export from GitHub within the UI.

###### Using the template

1. Open the template trigger in the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), and replace the projectID placeholder in the filter with the ProjectUID from preliminary step 1.
2. Create a [job](https://support.phrase.com/hc/en-us/articles/5784100517788#UUID-92182692-6284-4968-7e2d-56d1a1dee812) in the Strings project and start it.
3. Perform translations in the job and complete it.

   The Orchestrator workflow is triggered to export the content into the GitHub repository.

##### Strings Template: Export to online repository upon job completion

###### Description

This workflow monitors for Strings job completion within Strings projects. When a job is completed, the workflow automatically looks up the repository sync ID for the project and triggers the export according to the configuration file located in the root of the repository.

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger filter.

   1. Select the trigger.
   2. From the Filters tab, click Edit filter.
   3. Replace <Project ID> with the project ID of the workflow.

      - The project ID can be copied from Strings by looking up the project in the project list and clicking the ID button.
   4. Optionally click the + Item button and add another project ID to apply the template to more than one project. To run the workflow with all projects, remove the filter.
   5. Click Save filters.
3. Provide the account ID.

   1. Select the action bundle.
   2. From the Parameters tab, click Edit parameters.
   3. Replace <accountID> with the Strings organization account ID.

      - The account ID can be copied from the Account & billing tab by navigating to the clicking user settings in the top-right corner and selecting Organization from the Settings menu.
   4. Click Save parameters.
4. Publish the workflow.

The workflow will be triggered with the next job completion.

##### Strings Template: Job creation after file upload

###### Description

After a new upload, the workflow creates a new job with target languages defined either via the use of a Job template, or by identifying the source language of the project (the default locale) and using the remainder of project languages as the job’s target locales.

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger filter.

   1. Select the trigger.
   2. From the Filters tab, click Edit filter.
   3. Replace <Project ID> with the project ID of the workflow.
   4. Click Save filters.
3. Replace or remove the <Job template ID> placeholder in the Create job from list of keys or tags field.
4. Publish the workflow.
5. In the corresponding Strings project, make a new upload and ensure the Skip upload tags option is not selected.

The action will be executed within a few minutes.

##### Strings Template: Job level language pivoting workflow

###### Description

Monitors job completion for a predefined locale in a project. Once the locale is completed, the workflow checks all remaining locales in the project and creates a job with the pivot language as a source and remaining locales as the target.

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger filter.

   1. Select the trigger.
   2. From the Filters tab, click Edit filter.
   3. Replace <Locale name> with the name of the locale to execute the workflow for.
   4. Replace <Project ID> with the project ID of the workflow.

      - The project ID can be copied from Strings by looking up the project in the project list and clicking the ID button.
   5. Click Save filters.
3. Publish the workflow.

In the corresponding Strings project, open an existing job or start a new one. Mark one of the jobs whose locale matches the <Locale name> as *Completed* to trigger the workflow.

##### Strings Template: Scheduled export to online repository

###### Description

This workflow is triggered based on a pre-defined time schedule. When the workflow runs, it automatically looks up the repository sync IDs for the listed projects and triggers exports according to the configuration file located in the root of the repository.

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger schedule.

   1. Select the trigger.
   2. From the Schedule tab, click Edit schedule.
   3. Select the required cadence.
   4. Click Save schedule.
3. Provide the account ID.

   1. Select the action bundle.
   2. From the Parameters tab, click Edit parameters.
   3. Replace <accountID> with the Strings organization account ID.

      - The account ID can be copied from the Account & billing tab by navigating to the clicking user settings in the top-right corner and selecting Organization from the Settings menu.
   4. Click Save parameters.
4. Publish the workflow.
5. In the Strings project, open an existing job or start a new one and mark the job as *Completed* to trigger the workflow

##### Strings Template: Scheduled job creation

###### Description

This workflow runs on a schedule. The workflow automatically identifies the keys that have an unverified translation in any of the locales, creates a job from those keys and starts it. This workflow configures the project ID to monitor for new keys and the job template ID to use for job creation.

The JSON to add to this action needs to follow this syntax example:

```
{
"projectId":"f6dfee6466384379606b6158a410cd46", "jobTemplateId":"ea47c725dfdb894df2dea5902b1f0894"
}
```

###### Usage

To use the template, follow these steps:

1. Create a new workflow based on the template.
2. Edit the workflow trigger schedule.

   1. Select the trigger.
   2. From the Schedule tab, click Edit schedule.
   3. Select the required cadence.
   4. Click Save schedule.
3. Create a .JSON file in a text editor based on the example.

   - The project ID can be copied from Strings by looking up the project in the project list and clicking the ID button.
   - The job template ID can be copied from the URL when the job template is opened.
4. Edit the parameters of the Configuration values action.

   1. Open the Configuration values action.
   2. From the Parameters tab, click Edit parameters.
   3. Use the .JSON from step 3 for the input field.
   4. Click Save parameters.
5. Publish the workflow.

When the schedule triggers the workflow, a new job is created and started in the jobs list. If there are no unverified keys in the project, the workflow stops and a new job is not added.

---

### Scheduled Triggers

> Quelle: https://support.phrase.com/hc/en-us/articles/10496108530716-Scheduled-Triggers  
> Zuletzt aktualisiert: 2024-12-04T09:34:23Z  
> Labels: 2BTr

[Eingebettetes Video/Inhalt](https://www.youtube.com/embed/5KnSbbL0zlI?feature=shared)

##### Note

Due to continuous improvements, the user interface may not be exactly the same as presented in the video.

Scheduled triggers allow workflows to be run at a predetermined time or interval. Automated scheduling ensures workflows run at the same time for every instance, making it easier to monitor, debug, and manage. Custom cron expressions can be used to create specific timing for workflow execution.

The Schedule trigger is found in Actions tab on the Workflow blocks window.

##### Cron Expressions

A cron expression is a string of fields separated by spaces, representing a schedule in time-based syntax. The string is formatted as \*, representing minute, hour, day of the month, month, and day of the week, respectively.

Basic syntax:

- **Minute:** The minute field can be any number from 0 to 59.
- **Hour:** The hour field can be any number from 0 to 23.
- **Day of the Month:** This field can be any number between 1 and 31, depending on the month.
- **Month:** This field can be a number from 1 (January) to 12 (December).
- **Day of the Week:** This ranges from 0 (Sunday) to 7 (also Sunday).

More complex syntax and testing of expressions can be found at [Cron Guru](https://crontab.guru/).

---

### Webhooks (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/15475270132380-Webhooks-Orchestrator  
> Zuletzt aktualisiert: 2026-06-26T06:24:18Z  
> Labels: 2BTr

Webhooks notify external services such as chat clients or other external APIs of events. A webhook can set a URL when a specific event takes place.

Phrase Orchestrator provides a service that monitors and processes notifications from third-party systems. This service enables users to connect their workflows with a wide variety of external systems that support HTTP requests.

#### Incoming Webhooks

Users can create a new trigger for incoming webhooks from external events with the system automatically generating a unique webhook URL with API key for the third-party webhook setup. The generated webhook URL is unique and directly associated with the user's account and workflow, meaning each webhook is only tied to one workflow.

##### Configure incoming webhook

To configure an incoming webhook, follow these steps:

1. Drag and drop a Webhook trigger into a workflow.

   ![Webhook Example](https://support.phrase.com/hc/article_attachments/30682470346268)

   The trigger appears in the workflow.
2. Click on the trigger to open the Overview tab.
3. Select the Webhook tab.

   1. Copy the Webhook URL.

      ![Webhook URL Location](https://support.phrase.com/hc/article_attachments/30682516971420)

      This URL should be considered a secret and not shared. If accidentally shared, click Regenerate to create a new one and invalidate the existing one.
   2. To send a payload with data to use inside the workflows, provide the schema of that payload.

      1. To provide a schema, click Edit webhook.
      2. Select an Input Type:

         [JSON Schemas](https://json-schema.org/learn/getting-started-step-by-step) are a standard for defining JSON payloads. If an existing service that uses them, or an external service to connect to Orchestrator provides one, copy it as-is.

         ![Webhook Input Type](https://support.phrase.com/hc/article_attachments/30682470389020)

         - JSON

           Provide a sample JSON payload for a simpler setup, allowing testing of the webhook without defining exact rules.
         - JSON Schema

           Precisely define the structure, data types and validation rules for the JSON data.
      3. Click Save payload schema.

         A preview of the expected data structure for the webhook trigger is displayed.
   3. If required, open the Filters tab to add filters to the trigger.

To trigger a workflow once it has been published, send a POST request to the webhook URL. For workflows that do not have a configured schema, the body must be empty. If a configured schema is applied, the payload must match the schema.

#### Outgoing Webhooks

Users can set up workflows that not only receive data but also send updates to external systems automatically. The outgoing webhook action allows users to automatically trigger specific actions in external systems.

Webhooks in other services can be triggered through the Send HTTP Request action.

##### Configure an outgoing webhook

To configure an outgoing webhook, follow these steps:

1. Drag and drop a Send HTTP Request action to the workflow.
2. Click on the action to open the configuration.
3. Select the Parameters tab and provide the required settings.
4. Click Save parameters.

---

### Retries and Error Handling

> Quelle: https://support.phrase.com/hc/en-us/articles/11593221068572-Retries-and-Error-Handling  
> Zuletzt aktualisiert: 2025-09-16T05:54:18Z  
> Labels: ar_tms

Retries can be configured per action. Retries can be useful when working with actions that depend on asynchronous work and are therefore an alternative to Waiting in a workflow. Retries allow the repetition of an action execution in the event of an error.

A maximum of 10 retries can be configured.

Retries are set in the Advanced tab of an action configuration.

To set a retry policy, follow these steps:

1. From the Advanced tab of an action, click Edit retry settings.

   The Retry policy options are presented.
2. Select a policy type from the dropdown menu:

   - Never
   - On 5xx errors only (server side)
   - Every time
3. Provide a Retry count (the maximum number of attempts before retries are ceased).
4. Click Save retry settings.

   The policy is applied to the action and can be changed or removed by clicking Edit retry settings or Reset to default.

A Retry executions button is available on the [executions](https://support.phrase.com/hc/en-us/articles/7778580178332#UUID-8130cceb-dd15-816b-3472-e2bfa5860712 "Executions") page.

---

### Action Upgrades and Validation

> Quelle: https://support.phrase.com/hc/en-us/articles/13146462452124-Action-Upgrades-and-Validation  
> Zuletzt aktualisiert: 2024-12-04T09:34:26Z  
> Labels: 2BTr

The workflow editor provides instant feedback on [action configuration](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow") to ensure that every action within the workflow meets the necessary requirements.

The validation icon next to an action in the editor indicates the action’s status:

- Green icon

  The action is valid and fully configured. Only workflows with all actions marked green are eligible for publication.
- Grey icon

  The action requires configuration.
- Yellow icon

  An existing field was removed in the action. Inspect the parameters to confirm it.
- Red icon

  The action contains validation errors needing resolution.

##### Automatic Action Upgrades

In case of API changes, relevant actions in Orchestrator are automatically upgraded to remain in sync with the latest API specifications.

Upgrades to actions can range from transitions that require no user intervention to scenarios that involve manual adjustments:

- Unused actions

  Actions that are not used in a workflow are automatically upgraded to align with the latest API specifications.
- Actions in unpublished workflows

  - Minor API changes (e.g. addition of an optional field)

    The action is automatically upgraded and a backup of the workflow’s previous [revision](https://support.phrase.com/hc/en-us/articles/7778580163868#UUID-aca8608d-d831-8947-bd15-9bf7701d9e28 "Revisions") is created.
  - Major API changes (e.g. introduction of a required field)

    The action is automatically upgraded, but the new specifications require manual configuration to ensure that the workflow remains functional. This type of upgraded action is highlighted with a red icon.

    A backup of the workflow’s previous revision is also available.
- Actions in published workflows

  In case of API changes that could disrupt workflow execution, users receive an email notification allowing them to make the necessary adjustments and avoid potential execution failures.

---

### Slack (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/13167569112860-Slack-Orchestrator  
> Zuletzt aktualisiert: 2025-09-22T10:11:27Z  
> Labels: Orchestrator, 2BTr

The integration for Slack enables the setup of actions within Orchestrator workflows to publish messages in public Slack channels.

**Use Cases**

- Check for orphan projects to trigger a Slack notification to project owners about any inactive projects.
- Check for vendors' response to send a Slack alert regarding the delay in job status change.
- Check for new project status to send a Slack notification to the project owner, if action is required on their side.
- Check for projects that are approaching deadline to alert project owners via Slack.

##### Integration for Slack Setup

To set up the integration, follow these steps:

1. Select Integrations from the navigation sidebar to access the Integrations page.
2. Click Add Integration.

   The Add new integration window is displayed.
3. Select Slack to proceed to the Slack authorization page.
4. On the Slack installation page, input the workspace URL, log into Slack, and authorize the requested permissions.

   Upon successful installation, users are redirected to the Integrations page.
5. In the Slack application, open the channel(s) that would receive Slack notifications.
6. Enter **/add apps to this channel** and add the Phrase Orchestrator app to the channel.

Once Slack has been connected, the following options are available under the Actions column of the Integrations page:

- Reconnect Integration: Allows the reconnection of the Slack account if the token has been revoked.
- Delete Integration: Enables the disconnection of the Slack account. This action is useful for switching accounts or discontinuing the Slack integration.

##### Configure the Send Slack Message action

To incorporate a Send Slack Message action into an Orchestrator workflow, follow these steps:

1. From the Editor tab of a workflow page, enter `Slack` in the Actions search field.
2. Select the Send Slack Message action and add it to the workflow through drag-and-drop.
3. Click on the action tile in the workflow and select Edit parameters from the Parameters tab on the right side.
4. Select a public channel from the dropdown menu to receive Slack notifications.

   If a new channel has been created recently, refresh the page to update the list of channels. Make sure the Phrase Orchestrator app is added to the chosen channel to successfully receive notifications.
5. Define the message by incorporating text, variables, and formatting.

   For formatting guidance, refer to the [Slack formatting documentation](https://slack.com/intl/en-gb/help/articles/202288908-Format-your-messages).
6. Click Save parameters to confirm the settings.

See our [privacy policy](https://phrase.com/privacy/) for information on how data is shared.

---

### Phrase Data (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/22646379858716-Phrase-Data-Orchestrator  
> Zuletzt aktualisiert: 2026-06-26T06:24:21Z

Only organizations with Phrase Data in their subscription will be able to use this feature.

##### Use cases

- Query Phrase Data for Phrase TMS projects or jobs that satisfy certain conditions to facilitate sampling workflows or finding jobs that may need a special nudge.
- Trigger statistics based actions, e.g. when enough words are translated to a certain target language.

##### Pre-requisites

To enable Phrase Orchestrator to connect securely to Phrase Data, follow these steps:

1. Locate the Phrase Data account identifier.

   The Snowflake [account identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier) is used to configure the integration in Orchestrator. It can be found in the web UI when logging in to the Phrase Data instance.

   1. Sign in to Phrase Data
   2. Look at the URL in the browser and it should have this format: `https://<account_identifier>.snowflakecomputing.com`

      Example:

      If the URL is `https://mz18723.eu-west-1.snowflakecomputing.com`, the account identifier is mz18723.eu-west-1.
   3. Copy the account identifier for later configuration with the Phrase Data integration in Phrase Orchestrator.
2. Generate an RSA key pair.

   A private/public [key pair is required to authenticate](https://docs.snowflake.com/en/user-guide/key-pair-auth#configuring-key-pair-authentication) with Phrase Data.

   1. On the workstation or server, run the following commands:

      ```
      # Generate private key (unencrypted, recommended for compatibility)
      openssl genrsa -out rsa_key.p8 2048

      # Generate the corresponding public key
      openssl rsa -in rsa_key.p8 -pubout -out rsa_key.pub
      ```
   2. The private key (`rsa_key.p8`) should remain securely stored on your side and never shared.
   3. The public key (`rsa_key.pub`) should be shared with Phrase. Keep this noted for later use.

      The public key is a text file that should look similar to this example:

      `-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwW2GmHZJ0m6aZq1v8fFz4SKjWl4TjA9mfx0MIfLtj4D4xBLv9jD1Iu3hT7sKn4D3gEVQPoB6MtiEhpx7F7QhvO7FQ8q2rJt3xEwVZ2Kohmz6FZ7P/0dYbGqAfd7nPtum6GLeA+E+Tf9X91GnGl6xKp0MeDqB4oZn3mC8Xt9jR0A9TmFfqpy1mJQFzF0oKhRUgD9lY7sLX6XU0otf6jNerOnqM6JtWvA5Bp2q5nfh7VfJjKZ5Zm7YnxGRF9NfXqJx6woL7JBoqLZTz4TRl7pCoj5bnLWJah8UhwB6vD3mW+OsoSgj6H1L5PRwP0hNsy7m4d9JZ+Y8rYFRmgSGxjM40QIDAQAB-----END PUBLIC KEY-----`
3. Share the public key with Phrase.

   1. Send the public key file (`rsa_key.pub`) to Phrase securely (do not send the private key) via email or a dedicated Slack channel.

      Send an email address where Phrase can send the name of the service user after it is set it up.

      Contact Technical Support or your Solutions Architects for further details on contact addresses.
   2. Phrase will register the public key in Phrase Data for the dedicated service user. An email is sent out to the provided address which will contain a dedicated username.
   3. Phrase will activate the access to the integration in Phrase Orchestrator.

#### Configure the Phrase Data integration in Phrase Orchestrator

To set up the integration, follow these steps:

1. Click Integrations from the navigation sidebar.

   The Integrations page opens.
2. Click Add Integration.

   The Add new integration window is displayed.
3. Click Phrase Data.

   The account window is displayed.
4. Provide:

   - Account identifier

     Use the account identifier from step 1 in the pre-requisites section
   - Username

     Use the Phrase Data username from step 3 in the pre-requisites section
   - Private Key (PEM)

     Use the content of the private key from step 2 in the pre-requisites section
5. Click Save.

   The new integration is displayed on the Integrations page.

#### Add a Workflow Action to query Phrase Data in Phrase Orchestrator

To query Phrase Data from a Phrase Orchestrator workflow, follow these steps:

1. From the Editor tab of a workflow page, enter Send HTTP Request in the Actions search field.

   Rename it to Execute SQL Statement or similar.
2. Click on the action tile in the workflow and select Edit parameters from the Parameters tab on the right side.
3. Input these values:

   - **URL**:

     `https://<account ID>.snowflakecomputing.com/api/v2/statements`
   - **Action:**

     POST
   - **Data:**

     ```
     {     
     "statement": "<SQL statement>",     
     "warehouse": "MEMSOURCE"   
     }
     ```

     The name of the warehouse is not the same for all instances. In more recent setups it is named `PHRASE`.

     Alter the <SQL statement> variable to a meaningful query. For example:

     ```
     {
     "statement": "SELECT TOP 10 * FROM memsource.org_154.BUYER_V2",
     "warehouse": "MEMSOURCE"
     }
     ```

     The name of the database is not the same for all instances. To reference the tables in the FROM clause, use the correct database name (more recent customers have it named PHRASE), and provide the correct schema name in the format of `org_<number>`.
   - **Header:**

     Name: `Authorization`

     Value: `Bearer {{ @var.snowflake_token }}`

     Use Field Picker to retrieve the Bearer value.
4. Click Save parameters to confirm the settings.

---

### Variables (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/15711755060252-Variables-Orchestrator  
> Zuletzt aktualisiert: 2026-06-26T06:24:21Z  
> Labels: 2BTr

Users can create and store variables in Orchestrator to use secure and repeatable data within workflows.

Variables are created and managed in the Variables page that is accessible by selecting Variables in the left-hand navigation menu. Existing variables can be [integrated into workflows](https://support.phrase.com#UUID-c322be48-e44d-2ac3-94a3-ed3a8ccaf7b2_UUID-e9e85e63-72de-7da3-153b-de3844750d64 "Set up Variables in Workflows") when configuring Parameters or Conditions for triggers or actions.

#### Create Variables

To create a new variable, follow these steps:

1. In the Variables page, click on + Create at the top right.

   The Add new variable window is displayed.
2. Provide the Name and Value of the variable in the relevant fields.

   ### Note

   Replace any spaces in the Name field with underscore `_` character.
3. Optionally, select Mark variable as sensitive.

   Sensitive variables are encrypted, and their values cannot be retrieved during editing; they can only be overwritten. Use this option for sensitive data like API keys.
4. Click Save.

   The new variable is listed in the Variables page.

#### Set up Variables in Workflows

To set up a variable for triggers or actions when [configuring a workflow](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"), follow these steps:

1. In the workflow Editor, select the desired trigger or action.
2. In the right-side panel, locate the required field in the Parameters or Conditions tabs.

   Only fields that support a JSON path are configurable with variables.
3. Click on the field picker ![Field Picker Icon](https://support.phrase.com/hc/article_attachments/30682486012060) and select Variables from the Available reference sources menu.
4. Select the desired variable from the Available properties menu and click Apply.

#### Edit Variables

Users can only edit or delete their own variables in the Variables page.

To edit an existing variable, select Edit next to the corresponding variable and adjust its name or value as required.

To delete an existing variable, select Delete next to the corresponding variable.

##### Note

It is not possible to delete a variable while a workflow is [published](https://support.phrase.com/hc/en-us/articles/7778580163868#UUID-aca8608d-d831-8947-bd15-9bf7701d9e28 "Revisions").

---

### Action Bundles

> Quelle: https://support.phrase.com/hc/en-us/articles/15994644295324-Action-Bundles  
> Zuletzt aktualisiert: 2026-07-28T06:20:17Z  
> Labels: 2BTr, cadence-dec24

Action bundles are groupings of pre-existing actions within the Orchestrator that reflect specific business process steps. They are designed to allow non-technical users, such as Localization Managers and Project Managers, to [create workflows](https://support.phrase.com/hc/en-us/articles/7681638101532#UUID-2a7a8150-7b14-0f4f-110c-f8042fd3316f "Create a Workflow") without requiring an in-depth understanding of the Phrase API stack.

Action bundles are [configured](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow") like a standard action, requiring parameters for execution.

Since they contain multiple actions, action bundles consume more [Executed Workflow Actions](https://support.phrase.com/hc/en-us/articles/13872357395228#UUID-77729fa2-a37d-6ee7-c3a0-cba548b0384d). This is indicated by a numeric value in the top-right hand corner of the action in the workflow editor.

Users can find and use existing action bundles in the Actions tab of the editor, but cannot create new ones ([contact the support team](https://support.phrase.com/hc/en-us/requests/new) to request a new bundle). When searching for actions, enable the Prioritize Action Bundles option to show action bundles first in the list. A bold blue icon indicates the difference between a regular action and a bundle.

#### Using an action bundle

To use an action bundle, follow these steps:

1. Drag a selected action bundle onto a workflow.

   The action bundle appears in the workflow.
2. Click on the action bundle and select the parameters tab.
3. Click Edit parameters.

   Required parameters for the action bundle are displayed.
4. Provide required parameters and click Save parameters.

   Parameters are saved to the action bundle and displayed.
5. Click Edit parameters again if changes are required.

#### Available bundles

##### Add or update a translation

Description:

This action bundle is the equivalent of clicking into a translation field in the Strings editor and typing a translation into the field (overwriting anything that pre-existed).

Input parameters:

- `Project ID`

  The Strings project ID to get the locales of.
- `Locale ID`

  The Locale ID to identify the language version to be added.
- `Key ID`

  The Key ID to identify the key to edit.
- `Translated String`

  The string to add to the selected translation.

Output:

```
{
  "projectId": "f6dfee6466384379606b6158a410cd46",
  "translation": {
    "content": "Highlights of Phrase NextMT",
    "created_at": "2024-11-21T15:13:46Z",
    "excluded": false,
    "id": "91ad609cbd7d57e17cbf24432ba3d661",
    "key": {
      "data_type": "string",
      "id": "c7e7924dbb16527eaa0d892a8f0fd0fd",
      "name": "key3",
      "plural": false,
      "tags": [
        "35-2024",
        "upload-20240830_150155",
        "job-4C4F8EE9"
      ]
    },
    "locale": {
      "code": "en-CA",
      "id": "086fe5acddd58c52a5f8b5d9ec4c5a21",
      "name": "en-ca"
    },
    "placeholders": [],
    "plural_suffix": "",
    "state": "unverified",
    "unverified": true,
    "updated_at": "2024-11-21T15:18:09Z"
  }
}
```

##### Assign and notify provider

Input parameters:

- `Access token`

  For authentication.
- `Email template UID`
- `list_of_job_uids`

  - `list`
- `Project template UID`
- `Project UID`

  An array including project ID(s) entered manually or referenced from the trigger.

Output:

```
{
  "jobs": [
    {
      "uid": "string"
    }
  ],
  "emailTemplate": {
    "id": "string"
  },
  "cc": [
    "string"
  ],
  "bcc": [
    "string"
  ]
}
```

##### Check if all target locales of a Strings job are completed

Description:

This action bundle checks if all Strings job target locales are completed. If so, it returns *true*, if not it returns *false*.

Input parameters:

- `Access token`

  For authentication.
- `Project ID`

  For listing all job target locales from within a specific project.
- `Job ID`

  For listing all job target locales.

Output:

```
true 
OR
false
```

##### Export content from Strings projects to online repository

Description:

This action bundle takes the project ID(s), and based on those and the output of listing repository syncs, identifies the repository syncs IDs the export is subsequently triggered for in a loop. The outcome of the action bundle is the list of repository syncs for which the export was triggered.

Input parameters:

- `Access token`

  For authentication.
- `Project IDs`

  An array including project ID(s) entered manually or referenced from the trigger.
- `Strings account ID`

  Strings ORG ID required for listing the repository syncs.

Output:

```
[
  {
    "auto_import": false,
    "created_at": "2024-11-22T12:24:38Z",
    "id": "6315b3fd21d7735d0735f1d496b3832f",
    "status": "running",
    "type": "export"
  },
  {
    "auto_import": false,
    "created_at": "2024-11-22T12:24:39Z",
    "id": "928298761a94a979e1eb6c01948b2041",
    "status": "running",
    "type": "export"
  }
]
```

##### Fetch job UIDs for target languages

Input parameters:

- `Access Token`

  For authentication.
- `File name`
- `loop_variable`
- `list`
- `Project UID`

Output:

```
[ 
{ "uid": "string" }
…
 ]
```

##### Get job UID list

Input parameters:

- `input_array`
- `UID Path`

Output:

```
[
  { "uid": "string" },
  { "uid": "string" }
.
.
]
```

##### Get locales of a project

Description:

This action bundle hides the paging need for [List Locales API endpoint](https://developers.phrase.com/api/#get-/projects/-project_id-/locales). It also adds the project ID to the payload to enable more robust looping.

Input parameters:

- `Project ID`

  The Strings project ID to get the locales of.
- `Strings access token`

Output:

```
{
  "locales": [
    {
      "code": "en",
      "default": true,
      "id": "77e27f1d896629b0641063652572c038",
      "name": "en"
    },
    {
      "code": "fr",
      "default": false,
      "id": "2e8fb31c39957bb557bb96c0228960bf",
      "name": "fr"
    }
  ],
  "projectId": "f6dfee6466384379606b6158a410cd46"
}
```

##### Identify jobs for target locales

Input parameters:

- `Access token`

  For authentication.
- `File name`
- `Project UID`
- `Target locales`

Output:

```
[
  { "uid": "string" },
  { "uid": "string" }
.
.
]
```

##### List translations by locale

Description:

This action bundle hides the paging need for [List translations by locale API endpoint](https://developers.phrase.com/api/#get-/projects/-project_id-/locales/-locale_id-/translations). It also adds the project ID to the payload to enable more robust looping.

Input parameters:

- `Project ID`

  The Strings project ID to get the translations of.
- `Locale ID`

  The Strings locale ID within the project to get the translations of.
- `q`

  The [Strings query](https://developers.phrase.com/api/#overview--usage-examples).
- `Sort`
- `Strings access token`

Output:

```
{
  "projectId": "f6dfee6466384379606b6158a410cd46",
  "translations": [
    {
      "content": "This is new translation - six",
      "created_at": "2024-11-21T14:34:06Z",
      "excluded": false,
      "id": "0dbb663df544008df7e47176f8ec0444",
      "key": {
        "data_type": "string",
        "id": "15798c1dcc05e2d955d2de1959778347",
        "name": "key1",
        "plural": false,
        "tags": []         
      },
      "locale": {
        "code": "en-CA",
        "id": "086fe5acddd58c52a5f8b5d9ec4c5a21",
        "name": "en-ca"
      },
      "placeholders": [],
      "plural_suffix": "",
      "state": "unverified",
      "unverified": true,
      "updated_at": "2024-11-21T14:55:48Z"
    }
  ]
}
```

##### Lock Segments

Input parameters:

- `Access token`

  For authentication.
- `Job UID`
- `Project UID`
- `Segment IDs`

Output:

```
{
  "jobs": [
    {
      "uid": "string",
      "status": "ACCEPTED",
      "providers": [
        {
          "type": "string",
          "id": "string",
          "uid": "string"
        }
      ],
      "targetLang": "string",
      "workflowLevel": 0,
      "workflowStep": {
        "name": "string",
        "id": "string",
        "uid": "string",
        "order": 0,
        "lqaEnabled": true
      },
      "filename": "string",
      "dateDue": "2019-08-24T14:15:22Z",
      "dateCreated": "2019-08-24T14:15:22Z",
      "updateSourceDate": "2019-08-24T14:15:22Z",
      "imported": true,
      "jobAssignedEmailTemplate": {},
      "notificationIntervalInMinutes": 0,
      "continuous": true,
      "sourceFileUid": "string"
    }
  ],
  "project": {
    "name": "string",
    "uid": "string"
  }
}
```

##### Map job to workflow steps

Input parameters:

- `Access token`

  For authentication.
- `Job UID`
- `Project UID`
- `Workflow level number`

Output:

```
{
  "taskId": "string",
  "workflowLevel": "string",
  "resourcePath": "string",
  "project": {
    "uid": "string"
  },
  "job": {
    "uid": "string"
  }
}
```

##### Prepare segments v3

Input parameters:

- `Access token`

  For authentication.
- `Job UID`
- `Project UID`

Output:

```
[
  {
    "segmentId": "string",        // Value from ."@id"
    "origin": "string",           // Value from ."@m:trans-origin"
    "score": number,              // Numeric value from ."@m:score"
    "length": number,             // Length of the .source string
    "source": "string",           // Value of .source
    "target": "string"            // Value of .target
  },
  ...
]
```

##### Run QA on a single job v3

Input parameters:

- `Access token`

  For authentication.
- `Job UID`
- `Project UID`
- `warning types`

Output:

```
{
  "projectUid": "project123",
  "jobUid": "job456",
  "segmentIds": ["string"],
  "warnings": [
    {
      "segmentId": "string",
      "warnings": [
        {
          "id": "string",
          "ignored": true,
          "type": "string",
          "repetitionGroupId": "string"
        }
      ],
      "ignoredChecks": ["string"]
    }
  ]
}
```

##### Subtract lists

Input parameters:

- `Exclusion list`
- `Source list`

Output:

```
[1, 3, 5]
```

#### Action Bundles Troubleshooting

| Issue | Cause(s) | Solution |
| --- | --- | --- |
| An action bundle displays a Cancelled status with the error "ActionBundle is cancelled because the last task did not execute". | One of the internal actions inside the bundle did not complete successfully, which prevents the bundle's final step from running. | Check the individual task statuses within the bundle to identify which internal action failed, then resolve that action's error before re-running the workflow.  Clicking Retry executions on the Executions page re-runs the whole execution as-is and does not resolve this error on its own, since the underlying action inside the bundle is still failing. |

---

### Auto Adapt (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/18807673145372-Auto-Adapt-Orchestrator  
> Zuletzt aktualisiert: 2026-09-29T06:22:46Z  
> Labels: 2BTr, AI, edited_at

Auto Adapt is a Phrase-developed generative AI capability.

Auto Adapt uses Generative AI to improve and transform a translated document. Auto Adapt is often the right tool for transcreation workflows, adapting already-translated content to match brand voice, tone, and target audience rather than producing a literal translation. It restores fluency and consistency, improves grammar and ensures that brand terminology is used accurately. Customers can transform target text to meet their brand voice and audience requirements by specifying the formality level to apply to a document, and by inputting [content requirements](https://support.phrase.com#UUID-3c54e0d6-7905-5124-8eb4-5978debc5e3f_UUID-a10b5573-fbc2-4972-3e1e-384acc512d97 "Content Requirements for Auto Adapt").

Auto Adapt retrieves source and target text, the project [term base](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503), formality requirements and content requirements, and transforms content at speed. When a term base is assigned to the project, Auto Adapt respects *preferred* and *forbidden* terms defined in the term base to guide the generated output. Other term base information is not currently used by Auto Adapt.

Auto Adapt is available as an action in Orchestrator and is configurable via the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"). The Auto Adapt with Human Review [workflow template](https://support.phrase.com/hc/en-us/articles/10403607849628#UUID-39869ec3-740b-4ad3-6bd2-cd626f3ce9fa "Workflow Templates") provides an example of one possible use case.

The Auto Adapt action consumes [AI Units (AIUs)](https://support.phrase.com/hc/en-us/articles/14032731809052#UUID-cc9cfa45-5b73-500c-edfc-a3b77c44713f) on capacity-based plans, and credits on credit-based plans.

To ensure timely processing, the recommended input limit is 5,000 words.

Due to very large file sizes, [.IDML](https://support.phrase.com/hc/en-us/articles/5709612714140#UUID-597144a5-689f-8d02-6cbd-25c84d93471a) (Adobe InDesign) files are not supported.

#### Use cases

- Creative adaptation and generation of content

  Auto Adapt transforms existing content to produce new content. This makes it useful for generating variants of text, such as for new audiences.

  - Transform product copy to suit a new audience segment.
  - Change product descriptions to appeal to buyers in a new market.
  - Make subtitles and in-game text consistent in gaming and media content.
  - Create targeted SEO and marketing copy for each locale and segment.
  - Tailor training materials to the reading level of audience.
  - Refine internal communications to meet the needs of multinational teams.
  - Use inclusive and age-appropriate language for online copy.
  - Correct use of domain terminology for regulated industries.
  - Proofread and fix website content.
  - Improve source content for localization.
  - Convert content between locale variants (e.g., British to American English).

    ### Tip

    On capacity-based plans, [Phrase Next GenMT](https://support.phrase.com/hc/en-us/articles/14299433827996#UUID-0818c20e-733b-2a4c-701e-699937ba1184) may be a lower-cost alternative to Auto Adapt for locale-variant conversion only, without broader stylistic rewriting, as it consumes [machine translation units (MTUs)](https://support.phrase.com/hc/en-us/articles/11530492252444#UUID-3c8ba1b3-290a-5451-ba45-71797af5a755) instead of AIUs.

Since Auto Adapt transforms content creatively, the target content processed by Auto Adapt departs from being purely a translation of the source content. While [Phrase QPS](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444) captures some changes, it may not fully assess the effectiveness and quality of adapted content.

#### Exclude locked segments

When [configuring](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow") Auto Adapt in an Orchestrator workflow, users can control whether locked segments are included in AI processing.

In the Parameters section of the Auto Adapt action, set Include locked segments as AI context to:

- Yes (default)

  Locked segments are included as context and consume AIUs/credits. Including locked segments provides more context and can improve output quality.
- No

  Locked segments are excluded and do not consume AIUs/credits. Excluding locked segments may lower output quality.

  This option is useful for jobs with a high proportion of locked segments that do not need to be considered during optimization.

Existing workflows must be republished for the change to take effect.

#### Language support

Although Auto Adapt may support many language combinations, the following recommended languages meet Phrase's high-quality standards:

- English
- French
- Italian
- Spanish
- Portuguese
- German
- Dutch
- Swedish
- Danish
- Norwegian Bokmål
- Norwegian Nynorsk
- Finnish
- Hungarian
- Estonian
- Czech
- Russian
- Polish
- Bulgarian
- Greek
- Latvian
- Chinese Simplified
- Chinese Traditional
- Japanese
- Korean
- Thai
- Vietnamese
- Indonesian
- Arabic
- Turkish
- Hindi

#### Content Requirements for Auto Adapt

Content requirements are one of several configurable parameters that customize [Auto Adapt](https://support.phrase.com#UUID-3c54e0d6-7905-5124-8eb4-5978debc5e3f "Auto Adapt (Orchestrator)").

Auto Adapt takes the content requirements provided and uses them in its interaction with generative AI models. Specifically, the exact contents of the field are interpolated into the mechanisms used to interact with the different models, rendering the input text as a list; each sentence of the content requirements is an item in the list.

When setting up content requirements for the Auto Adapt action, the maximum length is 4,000 characters.

For best results, Auto Adapt looks for three key pieces of information:

- Brand voice
- Intent or purpose of the content to be processed
- Target audience

##### Best practices

- Be concise and specific

  Use as few words as needed to communicate the content requirement. Avoid vague instructions like *make it sound better*, as they do not translate well into model behaviors. Using one sentence per requirement is recommended.
- Avoid references to [Translation Memories (TMs)](https://support.phrase.com/hc/en-us/articles/5709688865692#UUID-c58dd835-39ea-1a94-02d1-9f2517fd6d75) or other external resources

  Auto Adapt does not integrate with TMs. Instead, provide explicit behavioral examples where needed.
- Avoid redefining model roles

  Auto Adapt is already optimized to act as *an expert reviewer of [language] to [language]*. Requesting that the model take on a different role is not recommended.
- Avoid requesting built-in capabilities

  Auto Adapt optimizes for fluency, terminology, consistency, and tag handling natively. There is no need to duplicate these requests.

##### Example Output Scenarios

Neutral input text:

Our new product has several innovative features designed to improve user experience. It is easy to set up and can significantly enhance productivity in everyday tasks.

- Scenario: Clarity is key

  - Content requirements:

    Focus on clear, concise, and direct language. Avoid jargon and overly complex sentences. Prioritize readability and simplicity, using plain language wherever possible. Maintain a logical flow and ensure that the message is easily understandable for a broad audience.
  - Auto Adapt output:

    Our new product offers innovative features that make it easier to use. Setting it up is simple, and it helps boost productivity in everyday tasks.
- Scenario: Technical precision for technical product documentation

  - Content requirements:

    Adopt a formal and precise tone, suitable for technical or scientific documentation. Prioritize accuracy, ensuring that terminology and explanations are consistent with industry standards. Avoid ambiguity by using specific and well-defined terms. Use clear structure to present information logically and thoroughly.
  - Auto Adapt output:

    The new product incorporates advanced features aimed at optimizing user experience. Its straightforward setup process and functionality enhancements significantly improve task efficiency.
- Scenario: The friendly yet professional touch

  - Content requirements:

    Use a warm and professional tone that builds trust and rapport. Balance friendliness with clarity, ensuring that the message remains informative and approachable. Avoid overly casual language while maintaining a personable style. Keep sentences structured yet inviting, emphasizing a customer-centric perspective.
  - Auto Adapt output:

    Discover our new product, designed to make your life easier with innovative features. Simple to set up and use, it helps you get more done every day.
- Scenario: Informal and witty

  - Content requirements:

    Adopt a conversational and light-hearted tone, incorporating humor and playful expressions when appropriate. Use casual, engaging language to make the content relatable and enjoyable. Prioritize creativity and originality while keeping the message clear and contextually appropriate for social media or blogs.
  - Auto Adapt output:

    Say hello to our awesome new gadget! It’s packed with cool features that make life way easier—setup’s a breeze, and it seriously ups your productivity game.
- Scenario: For a young audience

  - Content requirements:

    Use a dynamic and lively tone that resonates with younger audiences (teens and young adults). Incorporate contemporary slang and cultural references where appropriate, while maintaining clarity. Keep the style informal, upbeat, and engaging. Prioritize relatability while avoiding condescension or overly formal language.
  - Auto Adapt output:

    Check out our new product—it’s packed with awesome features to make life easier. Super easy to set up, and it’ll totally level up your day-to-day hustle.

##### Template Library

Auto Adapt’s prompt architecture interprets Content Requirements as a controlled style instruction, so the patterns that work best are:

- Imperative form (e.g. “Refine the translation to ensure…”).
- Clear audience and intent markers (“for HR managers”, “marketing copy”).
- Consistent single focus per clause, avoiding meta-instructions like “first do X then Y.”
- Concrete quality signals (fluency, clarity, tone, terminology).

###### Use Case Examples

| Use Case | Source text | Pre-translation (Automated translation) | Content Requirements | Result |
| --- | --- | --- | --- | --- |
| **character limitation** | In this particular moment, I find myself compelled, with an almost uncontrollable urge, to explain in a somewhat excessively detailed and unnecessarily elaborate manner, that this sentence has been purposefully made overly verbose. | En este momento en particular, me veo obligado, con un impulso casi incontrolable, a explicar de una manera un tanto excesivamente detallada e innecesariamente elaborada, que esta oración se ha hecho deliberadamente demasiado verbosa. | It is absolutely vital that the translations for each segment do not exceed the maximum character limitation, which is 40. If the translations in any given segment have more than 40 characters, you must edit the translation so that it contains 40 characters (at the most) while also keeping the same general meaning. | En este momento debo explicar que esta frase es demasiado larga. |
| **time zone conversion** | We are available from 8 AM EST to 11 PM EST | Estamos disponibles desde las 8 a. m. EST hasta las 11 p.m. EST. | Adjust machine translations to convert time and date information from EST to the correct local timezone for each target language, ensuring accurate localization. Instructions: 1. Identify time and date: Detect all time, date and timezone references in the source text. 2. Convert to target timezone: Apply the following rules per locale: - es\_MX: convert EST to PST. PST is 3 hours behind EST. Format: PST. | Estamos disponibles desde las 5 a. m. PST hasta las 8 p. m. PST. |
| **regional adaptation** | As part of these reforms, citizens will have to pay extra postage with a special designated color for any delivery made outside a 500 kilometer range. | As part of these reforms, citizens will have to pay extra postage with a special designated color for any delivery made outside a 500 kilometer range. | Fix any errors in the document, ensure consistency, fix tag and formatting issues. Please implement British English spelling. This includes, but is not limited to changing "z" to "s (example: nationalize --&gt; nationalise), adding "u" in certain words (example: color -&gt; colour). This list is not exhaustive, so please make any other changes necessary. | As part of these reforms, citizens will have to pay extra postage with a special designated colour for any delivery made outside a 500 kilometre range. |

#### Auto Adapt in the CAT web editor

When opening a job that has been processed by Auto Adapt, the [CAT web editor](https://support.phrase.com/hc/en-us/articles/5709683890204#UUID-b7f5d899-ec2b-4352-a151-d45f6cfb5cd8) displays the Job auto adapted notification toast.

Auto Adapt post-editing can result in the following output:

- Edited target

  The segment text was modified by Auto Adapt. This is indicated by the Auto Adapt indication in the score/origin column of the [CAT pane](https://support.phrase.com/hc/en-us/articles/5709683926812#UUID-fb5d0457-58e7-963b-d4dd-4a069f25139c) and the Auto adapted tooltip.

Auto Adapt does not have its own category in analysis and does not change the category a segment belongs to. A segment retains whatever TM match or MT match category it had before Auto Adapt processed it.

---

### MT Optimize

> Quelle: https://support.phrase.com/hc/en-us/articles/20397396468508-MT-Optimize  
> Zuletzt aktualisiert: 2026-09-29T06:22:47Z  
> Labels: 2BTr, AI, edited_at

MT Optimize is a Phrase-developed generative AI capability.

MT Optimize uses Generative AI to improve and transform a translated document. It restores fluency and consistency, improves grammar and ensures that brand terminology is used accurately. Customers can transform target text to meet their brand voice and audience requirements by specifying the formality level to apply to a document.

MT Optimize retrieves source and target text, the project [term base](https://support.phrase.com/hc/en-us/articles/5709733372188#UUID-ca45e09b-442e-336f-3257-2983bccd0503), formality requirements and content requirements and transforms content at speed. When a term base is assigned to the project, MT Optimize respects *preferred* and *forbidden* terms defined in the term base to guide the generated output. Other term base information is not currently used by MT Optimize.

MT Optimize is available as an action in Orchestrator and is configurable via the Orchestrator [workflow editor](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow"). MT Optimize with the Human Review [workflow template](https://support.phrase.com/hc/en-us/articles/10403607849628#UUID-39869ec3-740b-4ad3-6bd2-cd626f3ce9fa "Workflow Templates") provides an example of one possible use case.

The MT Optimize action consumes [AI Units](https://support.phrase.com/hc/en-us/articles/14032731809052#UUID-cc9cfa45-5b73-500c-edfc-a3b77c44713f) (AIUs) on capacity-based plans, and credits on credit-based plans.

Due to very large file sizes, [.IDML](https://support.phrase.com/hc/en-us/articles/5709612714140#UUID-597144a5-689f-8d02-6cbd-25c84d93471a) (Adobe InDesign) files are not supported.

#### Use cases

- Automating post-editing

  MT Optimize refines translations to produce fluent, consistent text that adheres to brand terminology and uses the right register for a given audience, across every segment of a document. It works across multiple segments at once, using context to ensure consistency. MT Optimize allows customers to reduce post-editing cost by boosting the translation quality of machine translation (MT).

#### Exclude locked segments

When [configuring](https://support.phrase.com/hc/en-us/articles/7681638124828#UUID-b6e84407-3181-9fc5-1cd1-1c95e28f84c6 "Configure a Workflow") MT Optimize in an Orchestrator workflow, users can control whether locked segments are included in AI processing.

In the Parameters section of the MT Optimize action, set Include locked segments as AI context to:

- Yes (default)

  Locked segments are included as context and consume AIUs/credits. Including locked segments provides more context and can improve output quality.
- No

  Locked segments are excluded and do not consume AIUs/credits. Excluding locked segments may lower output quality.

  This option is useful for jobs with a high proportion of locked segments that do not need to be considered during optimization.

Existing workflows must be republished for the change to take effect.

#### Interaction with translation quality metrics

- [Phrase Quality Performance Score (QPS)](https://support.phrase.com/hc/en-us/articles/5709672289180#UUID-054981cd-9a0e-32bf-79b7-cd6167ebf444)

  Phrase QPS is an effective but not perfect measure of the impact of MT Optimize. It captures the overall improvement in translation quality that MT Optimize provides, with the following limitations:

  - MT Optimize restores consistency between segments, while Phrase QPS evaluates translations at the individual segment level.
  - MT Optimize uses a term base to fix errors in terminology adherence. Phrase QPS is unaware of terminology.
  - MT Optimize can adjust formality level to meet use case specifications, whereas Phrase QPS is unaware of specific style needs, if they are not encoded in the source text itself.
- Reference-based metrics

  Reference-based metrics such as BLEU, COMET and ChrF3 can evaluate the output of MT Optimize to a certain extent, by comparing it to one or more reference translations to capture lexical and semantic improvements.

  These metrics can detect the segment-level linguistic changes and improvements in accuracy made by MT Optimize, but only when the optimized translation more closely matches the reference. Where the reference does not reflect document-level consistency, terminology adherence or formality level, BLEU, COMET and ChrF will not pick up on the optimization of these factors.

#### Language support

Although MT Optimize may support many language combinations, the following recommended languages meet Phrase's high-quality standards:

- English
- French
- Italian
- Spanish
- Portuguese
- German
- Dutch
- Swedish
- Danish
- Norwegian Bokmål
- Norwegian Nynorsk
- Finnish
- Hungarian
- Estonian
- Czech
- Russian
- Polish
- Bulgarian
- Greek
- Latvian
- Chinese Simplified
- Chinese Traditional
- Japanese
- Korean
- Thai
- Vietnamese
- Indonesian
- Arabic
- Turkish
- Hindi

#### MT Optimize in the CAT web editor

When opening a job that has been processed by MT Optimize, the [CAT web editor](https://support.phrase.com/hc/en-us/articles/5709683890204#UUID-b7f5d899-ec2b-4352-a151-d45f6cfb5cd8) displays the MT optimized notification toast.

MT Optimize post-editing can result in the following outputs:

- Edited target

  The segment text was modified by MT Optimize. This is indicated by the MT Optimize indication and the MT optimized tooltip in the score/origin column of the [CAT pane](https://support.phrase.com/hc/en-us/articles/5709683926812#UUID-fb5d0457-58e7-963b-d4dd-4a069f25139c).
- Estimated target

  The segment quality was estimated by MT Optimize and the new score is presented in the score/origin column of the CAT pane with the MT optimized indication.

---

### Welocalize OPAL (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/25099450686492-Welocalize-OPAL-Orchestrator  
> Zuletzt aktualisiert: 2026-08-21T06:20:46Z  
> Labels: Orchestrator, 2BTr

Welocalize’s OPAL Platform is a patented agentic system which is trained for an individual enterprise and includes machine translation and LLMs to translate, assess quality and auto-edit multilingual content. This approach enables OPAL to produce very high-quality multilingual content and dramatically increases the speed and efficiency of delivery.

The integration uses two Phrase Orchestrator workflows to automate an OPAL-driven editing stage inside a Phrase project. When content enters the process, it triggers edits within OPAL and reports back into the workflow which then uploads the content back to the project.

OPAL editions are only available in the [CAT web editor](https://support.phrase.com/hc/en-us/articles/5709683890204#UUID-b7f5d899-ec2b-4352-a151-d45f6cfb5cd8) and not the desktop editor.

The workflows can only be published and executed with the next-gen Phrase Orchestrator Workflow Engine.

- Workflow A: Trigger AI processing

  - Initiates on job event (i.e. when a job completes MT pre-translation), creates the OPAL project and transfers the required information to OPAL.
  - Initiates on job event (i.e. when a job completes the last workflow step of the project) and feeds the final content back to OPAL to improve the AI based process.
- Workflow B: Retrieve AI results

  - Receives OPAL callback when edits are complete and continues downstream processing to ensure OPAL edits are displayed in the Phrase CAT web editor interface.

#### Pre-requisites

- The Phrase TMS project has a workflow that includes a first workflow step to inject raw machine translation. This step is usually automatically completed after the [pre-translation](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) is finished.

  The pre-translations options ensure that the first step in the workflow (signalling MT injection) is auto-completed. If this step is not complete, OPAL will not execute.
- There is a dedicated second workflow step for OPAL editing and locking. This workflow step will be auto-completed by the integration workflows.
- A completed human editing step.
- A job level text custom field created in Settings to hold the OPAL project ID as a reference value.

##### Required variables

These values must be defined in Orchestrator workspace before implementing the workflows:

| Variable | Purpose |
| --- | --- |
| `opal_custom_field_id` | Points to the job level custom field in Phrase TMS storing Opal project ID metadata |
| `opal_api_endpoint_url` | Base URL for calling the Opal edit API |
| `opal_api_token` | API token used to authenticate calls into Opal |
| `opal_callback_url` | The webhook/trigger URL that Opal will call when edits finish |
| `opal_content_group_name` | The Opal Content Group name sent to OPAL when the project is created. Each *Part 1* workflow carries its own value. |

#### Populate Variables

Create these [variables](https://support.phrase.com/hc/en-us/articles/15711755060252#UUID-c322be48-e44d-2ac3-94a3-ed3a8ccaf7b2 "Variables (Orchestrator)") using sensible naming and match exactly:

- `opal_custom_field_id`
- `opal_api_endpoint_url`
- `opal_api_token` - For security reasons, this should be marked as secret
- `opal_callback_url`
- `opal_content_group_name` - The Opal Content Group name for the projects this workflow serves. Set one value per *Part 1* workflow.

#### Install the Workflows

Import Workflow B

1. From the Workflow page, click Create and select Workflow via Templates.

   The template selection page opens.
2. Click on the OPAL (pt. 2): Retrieve AI results template and click Use template.

   The workflow is displayed.
3. Click Publish and confirm the publication.
4. Open the workflow and copy the Trigger URL.

   This URL is the webhook that Opal will call after editing.
5. Set this URL for the `opal_callback_url` variable.

Import Workflow A with variables defined and callback set:

1. From the Workflow page, click Create and select Workflow via Templates.

   The template selection page opens.
2. Click on the [PART 1] AI-driven Post-Editing and Quality Estimation template and click Use template.

   The workflow is displayed.
3. Edit the ingest filter on the trigger (the top box of the action) to ensure only projects intended to run through Opal will trigger the workflow.

   E.g. add `{{ $.metadata.project.name }} match OPAL_PILOT`.
4. Ensure that filter `{{ $.jobParts[0].status }}` equals `COMPLETED_BY_LINGUIST` remains unchanged.
5. Click Publish and confirm the publication.

#### Running Multiple Opal Content Groups

##### Note

*Opal Content Group* is a Welocalize concept and differs from the Phrase Platform [Content Groups](https://support.phrase.com/hc/en-us/articles/28818060694812#UUID-7cdd8089-2074-3361-8c9e-cc708632fc05) feature. The two are separate and should not be linked or conflated.

Use one *Part 1* workflow per Opal Content Group. Variables are shared across the workspace, so each additional workflow needs its own distinctly named value for `opal_content_group_name`.

To run an additional Opal Content Group, follow these steps:

1. Give the value its own name, either by using a uniquely named variable (e.g. `opal_content_group_name_2`) or by hardcoding the Opal Content Group name directly in the create-project action.
2. Set the trigger ingest filter so only the intended projects trigger that workflow.

Each additional Opal Content Group means an additional published workflow, which counts against the workspace's published-workflow capacity. Adjust the allowance if needed.

#### OPAL in the CAT web editor

When opening a job that has been processed by OPAL, the CAT web editor displays the Job edited by OPAL notification toast.

OPAL post-editing can result in the following outputs:

- Edited target

  The segment text was modified by OPAL. This is indicated by the OPAL-specific edit icon and the Edited by OPAL tooltip in the origin column.
- Locked segment

  The segment was either edited or intentionally left unchanged by OPAL, and then locked. This is indicated by the OPAL-specific edit icon and the Locked by OPAL tooltip.

Users can review changes between workflow steps (such as the pre-translation step, OPAL processing step, and post-OPAL human editing step) in the [translation changes](https://support.phrase.com/hc/en-us/articles/5709700120476#UUID-c995498b-b422-3cf9-f93c-432ac1c5ffb4) pane of the CAT web editor or by [exporting workflow changes](https://support.phrase.com/hc/en-us/articles/5709684292764#UUID-cb765ac5-e6ca-3abf-6f3b-ffc2d07154b9) from the project page.

---

### TAUS EPIC (Orchestrator)

> Quelle: https://support.phrase.com/hc/en-us/articles/26196662264732-TAUS-EPIC-Orchestrator  
> Zuletzt aktualisiert: 2026-03-20T14:50:31Z  
> Labels: Orchestrator, 2BTr

TAUS EPIC is an API for quality estimation and automated post-editing. It provides a continuous quality control loop for machine translation output (predicting translation quality and automatically improving segments where needed) helping organizations scale multilingual content workflows while maintaining control over quality, cost, and risk.

The integration uses two Phrase Orchestrator workflows to automate an EPIC-driven editing stage inside a Phrase TMS project. When content enters the process, it triggers edits within EPIC and reports back into the workflow, ensuring the updated content is available in the project.

EPIC edits are only available in the [CAT web editor](https://support.phrase.com/hc/en-us/articles/5709683890204#UUID-b7f5d899-ec2b-4352-a151-d45f6cfb5cd8) and not the desktop editor.

The workflows can only be published and executed with the next-gen Phrase Orchestrator Workflow Engine.

- Workflow A: Trigger AI processing

  - Initiates on job event (i.e. when a job completes MT pre-translation), and sends content to EPIC for processing.
- Workflow B: Retrieve AI results

  - Receives EPIC callback when edits are complete and continues downstream processing to ensure EPIC edits are displayed in the Phrase CAT web editor interface.

#### Pre-requisites

- The Phrase TMS project has a workflow that includes a first workflow step to inject raw machine translation. This step is usually automatically completed after the [pre-translation](https://support.phrase.com/hc/en-us/articles/5709717749788#UUID-a982e5f9-9aa2-434f-116c-17b822d35343) is finished.
- There is a dedicated second workflow step for EPIC editing and locking.
- A human editing step follows as the next step in the workflow.
- A [webhook](https://api.taus.net/2.0/estimate-batch/documentation#section/Webhooks) must be registered in TAUS EPIC to enable callback communication. Webhook configuration is available in the TAUS EPIC interface when logged in.

##### Required variables

These values must be defined in Orchestrator workspace before implementing the workflows:

| Variable | Purpose |
| --- | --- |
| `epic_api_token` | API token used to authenticate calls into EPIC |
| `workflow_2_trigger_url` | The webhook/trigger URL that EPIC will call when edits finish  Note The `workflow_2_trigger_url` is not known in advance. It must be copied from Workflow B after it is published.  Example trigger URL: https://eu.phrase.com/orchestrator/webhooks/12c8a2ec-3f6d-478a-b254-428cd5158543 |

##### Populate variables

Create these variables using sensible naming and match exactly:

- `epic_api_token`

  For security reasons, this variable should be marked as secret. To retrieve the token, visit the [TAUS account](https://www.taus.net/user/sign-in?redirect=/user/epic-api/keys).

#### Install the Workflows

Import Workflow B:

1. From the Workflow page, click Create and select Workflow via Templates.

   The template selection page opens.
2. Click on the Retrieve AI results template and click Use template.

   The workflow is displayed.
3. Click Publish and confirm the publication.
4. Open the workflow and copy the Trigger URL.

   This URL is the webhook that EPIC will call after editing.
5. Set this URL for the `workflow_2_trigger_url` variable.
6. [Register the webhook](https://www.taus.net/user/epic-api/webhooks) in TAUS EPIC by adding Trigger URL as a webhook endpoint.

Import Workflow A:

##### Note

Ensure all variables are already defined, otherwise the workflow will present a publishing error. Variables can be added after import if needed.

1. From the Workflow page, click Create and select Workflow via Templates.

   The template selection page opens.
2. Click on the Trigger AI processing template and click Use template.

   The workflow is displayed.
3. Copy the UID of the project from its URL.

   The UID can be found at the end of the URL in a browser. Example: https://cloud.phrase.com/web/project2/show/`KY6gfZXv4Gqw7B0m1U8br6`
4. Edit the condition of the workflow trigger by clicking the blue bar at the top of the trigger and replacing the PROJECT\_UID placeholder with the copied UID.
5. Click Publish and confirm the publication.

#### EPIC in the CAT web editor

When opening a job that has been processed by EPIC, the CAT web editor displays the Job edited by EPIC notification toast.

EPIC post-editing can result in the following outputs:

- Edited target

  The segment text was modified by EPIC. This is indicated by the EPIC-specific edit icon and the Edited by EPIC tooltip in the origin column.
- Estimated target

  If quality estimation is applied, a score is displayed above the EPIC icon and in the tooltip.

Users can review changes between workflow steps (such as the pre-translation step, EPIC processing step, and post-EPIC human editing step) in the [translation changes](https://support.phrase.com/hc/en-us/articles/5709700120476#UUID-c995498b-b422-3cf9-f93c-432ac1c5ffb4) pane of the CAT web editor or by [exporting workflow changes](https://support.phrase.com/hc/en-us/articles/5709684292764#UUID-cb765ac5-e6ca-3abf-6f3b-ffc2d07154b9) from the project page.

---
