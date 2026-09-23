/**
 * ChatCommands.gs
 * Google Chat "App Commands" (Slash Commands) fuer Translation-Services.
 * Wird von doPost() (Upload.gs) bei event.type === "APP_COMMAND" aufgerufen.
 *
 * HINWEIS zum Routing: Die Befehlsliste (/AssignLinguist, /ChangeDueDate, ...)
 * ist extern in der Google Chat API Konfiguration (Cloud Console) hinterlegt,
 * NICHT im appsscript.json-Manifest ("chat": {} ist hier leer) - die
 * numerische appCommandId ist von hier aus also nicht bekannt. Geroutet wird
 * daher ueber den Befehlsnamen, den der Nutzer tatsaechlich eingetippt hat
 * (event.message.text / event.message.argumentText), nicht ueber
 * appCommandMetadata.appCommandId.
 *
 * Alle mutierenden Befehle pruefen Admin/Owner/Shared-Zugriff genauso wie die
 * entsprechenden Portal-Aktionen (Queue-Sheet: Owner/SharedWith) und nutzen
 * dafuer denselben Autorisierungscode - dafuer haben apiUpdateDueDate(),
 * apiCancelProject() und apiAddJobNote() einen optionalen callerOverride-
 * Parameter bekommen (Session.getActiveUser() liefert bei einem von Chat
 * ausgeloesten doPost() KEINE nutzbare Identitaet, siehe getUserContext_).
 */

var APP_COMMAND_HANDLERS_ = {
  "projectstatus":     cmdProjectStatus_,
  "jobstats":          cmdJobStats_,
  "changeduedate":     cmdChangeDueDate_,
  "changeprojectname": cmdChangeProjectName_,
  "closeproject":      cmdCloseProject_,
  "assignlinguist":    cmdAssignLinguist_,
  "changerevisor":     cmdChangeRevisor_,
  "notifyvendor":      cmdNotifyVendor_,
  "quotestatus":       cmdQuoteStatus_,
  "termsearch":        cmdTermSearch_
};

function onAppCommand(e) {
  try {
    var ctx       = rememberChatUserFromEvent_(e);
    var userEmail = normalizeEmail_(ctx.userEmail || (e.user && e.user.email) || "");
    if (!userEmail) {
      return { text: "⚠️ I couldn't determine your email. Please open the bot directly in Google Chat." };
    }

    var raw     = String((e.message && e.message.text) || "").trim();
    var argText = (e.message && typeof e.message.argumentText === "string") ? e.message.argumentText.trim() : "";

    var m       = raw.match(/^\/?(\S+)/);
    var cmdName = m ? m[1].toLowerCase() : "";
    var args    = argText || raw.replace(/^\/?\S+\s*/, "").trim();

    console.log("• App Command: /" + cmdName + " | args: \"" + args + "\" | user: " + userEmail);

    var handler = APP_COMMAND_HANDLERS_[cmdName];
    if (!handler) {
      return { text: _appCommandHelpText_() };
    }

    var replyText = handler(args, userEmail);
    return { text: replyText };

  } catch (err) {
    console.error("onAppCommand error:", err.message);
    return { text: "⚠️ Something went wrong: " + err.message };
  }
}

function _appCommandHelpText_() {
  return "Available commands:\n" +
    Object.keys(APP_COMMAND_HANDLERS_).map(function(c) { return "• /" + c; }).join("\n") +
    "\n\nUse the Project UID (\"Phrase ID\" in My Projects) to identify a project.";
}

// ============================================================================
// Shared helpers
// ============================================================================

/** Splits "a b c d" into n parts, the last one keeping the remaining text verbatim. */
function _cmdParseArgs_(text, n) {
  var parts = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length <= n) return parts;
  var head = parts.slice(0, n - 1);
  head.push(parts.slice(n - 1).join(" "));
  return head;
}

function _cmdFindQueueRow_(projectUid) {
  if (!projectUid) return null;
  var sh   = getQueueSheet_();
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][2] || "").trim() === String(projectUid).trim()) {
      return {
        rowIdx:      i,
        owner:       String(data[i][1]  || "").toLowerCase().trim(),
        sharedWith:  String(data[i][17] || "").toLowerCase(),
        projectName: String(data[i][11] || data[i][4] || projectUid).trim(),
        status:      String(data[i][7]  || "").trim()
      };
    }
  }
  return null;
}

function _cmdHasAccess_(row, userEmail) {
  if (!row) return false;
  if (isAdmin_(userEmail)) return true;
  if (row.owner === userEmail) return true;
  var shared = row.sharedWith.split(/[,;]+/).map(function(s) { return s.trim(); });
  return shared.indexOf(userEmail) !== -1;
}

function _cmdPhraseProjectUrl_(projectUid) {
  return "https://cloud.memsource.com/web/project/show/" + encodeURIComponent(projectUid);
}

/** Resolves a Phrase user by email and assigns them to a job. Throws on failure. */
function _cmdAssignProviderToJob_(projectUid, jobUid, providerEmail) {
  var phraseUser = phraseGetUserByEmail_(providerEmail);
  if (!phraseUser || !phraseUser.id) {
    throw new Error("No Phrase user found for " + providerEmail + ".");
  }
  var url = phraseApiUrlV1_(
    "/projects/" + encodeURIComponent(projectUid) + "/jobs/" + encodeURIComponent(jobUid) + "/providers"
  );
  phraseFetchJson_(url, {
    method:      "put",
    contentType: "application/json",
    headers:     { Authorization: getPhraseAuthHeader_() },
    payload:     JSON.stringify({ providers: [{ id: phraseUser.id }] })
  });
  return phraseUser;
}

// ============================================================================
// /ProjectStatus <projectUid>
// ============================================================================
function cmdProjectStatus_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 1);
  var projectUid = parts[0];
  if (!projectUid) return "Usage: /ProjectStatus <Project UID>";

  var row = _cmdFindQueueRow_(projectUid);
  if (!row || !_cmdHasAccess_(row, userEmail)) return "⚠️ Project not found or no access.";

  try {
    var url = phraseApiUrlV1_("/projects/" + encodeURIComponent(projectUid));
    var p = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var due = p.dateDue ? new Date(p.dateDue).toLocaleDateString("en-GB") : "-";
    return "📊 *" + (p.name || row.projectName) + "*\n" +
      "• Status: " + (p.status || row.status || "?") + "\n" +
      "• Due: " + due + "\n" +
      "🌐 " + _cmdPhraseProjectUrl_(projectUid);
  } catch (e) {
    return "⚠️ Couldn't fetch project status: " + e.message;
  }
}

// ============================================================================
// /JobStats <projectUid> <jobUid>
// ============================================================================
function cmdJobStats_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 2);
  var projectUid = parts[0], jobUid = parts[1];
  if (!projectUid || !jobUid) return "Usage: /JobStats <Project UID> <Job UID>";

  var row = _cmdFindQueueRow_(projectUid);
  if (!row || !_cmdHasAccess_(row, userEmail)) return "⚠️ Project not found or no access.";

  try {
    var url = phraseApiUrlV2_(
      "/projects/" + encodeURIComponent(projectUid) + "/jobs/" + encodeURIComponent(jobUid)
    );
    var j = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var providerEntry = j.providers && j.providers[0];
    var provider = providerEntry && providerEntry.provider &&
      (providerEntry.provider.email || providerEntry.provider.userName);
    return "🧩 *Job " + jobUid + "*\n" +
      "• Target language: " + (j.targetLang || "-") + "\n" +
      "• Workflow step: " + (j.workflowStep && j.workflowStep.name || (j.workflowLevel != null ? String(j.workflowLevel) : "-")) + "\n" +
      "• Status: " + (j.status || "-") + "\n" +
      "• Word count: " + (j.wordsCount != null ? j.wordsCount : "-") + "\n" +
      "• Assigned to: " + (provider || "not assigned");
  } catch (e) {
    return "⚠️ Couldn't fetch job stats: " + e.message;
  }
}

// ============================================================================
// /ChangeDueDate <projectUid> <YYYY-MM-DD>
// ============================================================================
function cmdChangeDueDate_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 2);
  var projectUid = parts[0], newDate = parts[1];
  if (!projectUid || !newDate) return "Usage: /ChangeDueDate <Project UID> <YYYY-MM-DD>";

  var res = apiUpdateDueDate(projectUid, newDate, userEmail);
  if (!res.success) return "⚠️ " + res.error;
  var warn = res.phraseWarning ? "\n⚠️ Note: " + res.phraseWarning : "";
  return "✅ Due date updated to " + res.formattedDate + "." + warn;
}

// ============================================================================
// /ChangeProjectName <projectUid> <new name>
// ============================================================================
function cmdChangeProjectName_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 2);
  var projectUid = parts[0], newName = parts[1];
  if (!projectUid || !newName) return "Usage: /ChangeProjectName <Project UID> <new name>";

  var res = apiUpdateProjectName(projectUid, newName, userEmail);
  if (!res.success) return "⚠️ " + res.error;
  var warn = res.phraseWarning ? "\n⚠️ Note: " + res.phraseWarning : "";
  return "✅ Renamed \"" + res.oldName + "\" → \"" + res.newName + "\"." + warn;
}

// ============================================================================
// /CloseProject <projectUid>
// ============================================================================
function cmdCloseProject_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 1);
  var projectUid = parts[0];
  if (!projectUid) return "Usage: /CloseProject <Project UID>";

  var res = apiCancelProject(projectUid, userEmail);
  if (!res.success) return "⚠️ " + res.error;
  return "✅ Project closed.";
}

// ============================================================================
// /AssignLinguist <projectUid> <jobUid> <linguist email>
// ============================================================================
function cmdAssignLinguist_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 3);
  var projectUid = parts[0], jobUid = parts[1], linguistEmail = parts[2];
  if (!projectUid || !jobUid || !linguistEmail) {
    return "Usage: /AssignLinguist <Project UID> <Job UID> <linguist email>";
  }

  var row = _cmdFindQueueRow_(projectUid);
  if (!row || !_cmdHasAccess_(row, userEmail)) return "⚠️ Project not found or no access.";

  try {
    var u = _cmdAssignProviderToJob_(projectUid, jobUid, linguistEmail);
    logAuditEvent_(userEmail, "CHAT_ASSIGN_LINGUIST",
      "Assigned " + linguistEmail + " to job " + jobUid + " (" + projectUid + ")");
    return "✅ " + (u.userName || linguistEmail) + " has been assigned to job " + jobUid + ".";
  } catch (e) {
    return "⚠️ Assignment failed: " + e.message;
  }
}

// ============================================================================
// /ChangeRevisor <projectUid> <targetLang> <revisor email>
// ============================================================================
function cmdChangeRevisor_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 3);
  var projectUid = parts[0], targetLang = parts[1], revisorEmail = parts[2];
  if (!projectUid || !targetLang || !revisorEmail) {
    return "Usage: /ChangeRevisor <Project UID> <target language, e.g. de_de> <revisor email>";
  }

  var row = _cmdFindQueueRow_(projectUid);
  if (!row || !_cmdHasAccess_(row, userEmail)) return "⚠️ Project not found or no access.";

  try {
    var url = phraseApiUrlV1_(
      "/projects/" + encodeURIComponent(projectUid) + "/jobs?targetLang=" +
      encodeURIComponent(targetLang) + "&pageSize=50"
    );
    var res  = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var jobs = (res && res.content) ? res.content : (Array.isArray(res) ? res : []);

    var revJobs = jobs.filter(function(j) {
      var stepName = ((j.workflowStep && j.workflowStep.name) || "").toLowerCase();
      return stepName.indexOf("rev") !== -1 || (j.workflowLevel && j.workflowLevel > 1);
    }).sort(function(a, b) { return (b.workflowLevel || 0) - (a.workflowLevel || 0); });

    var revJob = revJobs[0];
    if (!revJob) {
      return "⚠️ No revision workflow step found for " + targetLang +
        " (this project may not have a revision step).";
    }

    var u = _cmdAssignProviderToJob_(projectUid, revJob.uid, revisorEmail);
    logAuditEvent_(userEmail, "CHAT_CHANGE_REVISOR",
      "Set revisor " + revisorEmail + " for " + targetLang + " (" + projectUid + ")");
    return "✅ " + (u.userName || revisorEmail) + " is now the revisor for " + targetLang +
      " (job " + revJob.uid + ").";
  } catch (e) {
    return "⚠️ Failed to change revisor: " + e.message;
  }
}

// ============================================================================
// /NotifyVendor <projectUid> <jobUid> [message]
// ============================================================================
function cmdNotifyVendor_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 3);
  var projectUid = parts[0], jobUid = parts[1], message = parts[2];
  if (!projectUid || !jobUid) return "Usage: /NotifyVendor <Project UID> <Job UID> [message]";

  var noteText = message || "Reminder: please check this job in Phrase TMS.";
  var res = apiAddJobNote(projectUid, jobUid, noteText, userEmail);
  if (!res.success) return "⚠️ " + res.error;
  return "✅ Reminder note sent on job " + jobUid + ".";
}

// ============================================================================
// /QuoteStatus <projectUid>
//
// BEST EFFORT: this codebase has no prior Quotes integration to build on, so
// this uses Phrase's documented Quotes endpoint without an in-repo precedent.
// If your Phrase org doesn't use the Quotes module, this will just error out
// loudly (safe) rather than silently return wrong data.
// ============================================================================
function cmdQuoteStatus_(args, userEmail) {
  var parts = _cmdParseArgs_(args, 1);
  var projectUid = parts[0];
  if (!projectUid) return "Usage: /QuoteStatus <Project UID>";

  var row = _cmdFindQueueRow_(projectUid);
  if (!row || !_cmdHasAccess_(row, userEmail)) return "⚠️ Project not found or no access.";

  try {
    var url = phraseApiUrlV2_("/projects/" + encodeURIComponent(projectUid) + "/quotes");
    var res = phraseFetchJson_(url, { method: "get", headers: { Authorization: getPhraseAuthHeader_() } });
    var quotes = (res && res.content) ? res.content : (Array.isArray(res) ? res : []);
    if (!quotes.length) return "No quote found for this project in Phrase.";
    var lines = quotes.map(function(q) {
      return "• " + (q.name || q.uid) + ": " + (q.status || "?") +
        (q.totalPrice != null ? " (" + q.totalPrice + " " + (q.currency || "") + ")" : "");
    });
    return "💰 *Quotes for " + row.projectName + "*\n" + lines.join("\n");
  } catch (e) {
    return "⚠️ Couldn't fetch quote status (Quotes module may not be active for this project): " + e.message;
  }
}

// ============================================================================
// /TermSearch <term>
//
// BEST EFFORT: needs a Phrase termbase UID configured as the script property
// TERMBASE_UID (no termbase was already wired up anywhere in this codebase).
// ============================================================================
function cmdTermSearch_(args, userEmail) {
  var term = String(args || "").trim();
  if (!term) return "Usage: /TermSearch <term>";

  var tbUid = String(PropertiesService.getScriptProperties().getProperty("TERMBASE_UID") || "").trim();
  if (!tbUid) {
    return "⚠️ No termbase configured. An admin needs to set the script property " +
      "TERMBASE_UID to the Phrase termbase UID to search.";
  }

  try {
    var url = phraseApiUrlV1_("/termBases/" + encodeURIComponent(tbUid) + "/searchTerm");
    var res = phraseFetchJson_(url, {
      method:      "post",
      contentType: "application/json",
      headers:     { Authorization: getPhraseAuthHeader_() },
      payload:     JSON.stringify({ query: term })
    });
    var hits = Array.isArray(res) ? res : ((res && res.content) || []);
    if (!hits.length) return "No results for \"" + term + "\".";
    var lines = hits.slice(0, 8).map(function(h) {
      var langs = (h.langs || []).map(function(l) {
        var terms = (l.terms || []).map(function(t) { return t.text; }).join(", ");
        return (l.lang || "?") + ": " + terms;
      });
      return "• " + langs.join(" → ");
    });
    return "📖 *Results for \"" + term + "\"*\n" + lines.join("\n");
  } catch (e) {
    return "⚠️ Search failed: " + e.message;
  }
}
