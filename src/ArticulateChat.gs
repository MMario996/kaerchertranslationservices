/**
 * ArticulateChat.gs
 *
 * Google-Chat-Benachrichtigungen fuer Campus-/Articulate-Preview-Kurse.
 *
 * Nutzt dieselbe Mechanik wie die normalen Projekte:
 *   - sendPrivateMessage_()  -> gibt {name: "spaces/.../messages/..."} zurueck,
 *     das als Thread-ID gespeichert wird
 *   - sendThreadReply_()     -> antwortet IM SELBEN Thread
 * Dadurch landen alle Re-Deploys eines Kurses als Antworten unter der
 * urspruenglichen Nachricht statt als neue Einzelnachrichten.
 *
 * Die Thread-ID steht in der Spalte "Chat Thread" des Registry-Sheets.
 *
 * Die Nachrichtentexte selbst liegen in MessageTemplates.gs unter den
 * Keys MSG_ARTICULATE_SUBMITTED / MSG_ARTICULATE_DEPLOYED und sind
 * darueber auch im Admin-Panel editierbar.
 *
 * Hinweis: {{PORTAL_URL}} wird von fillTemplate_() automatisch ersetzt -
 * es muss hier NICHT als Variable uebergeben werden.
 */

/**
 * Sendet die Einrichtungs-Nachricht mit Anleitung und speichert die
 * Thread-ID in der Registry-Zeile.
 *
 * @param {Object} project        Zeile aus apiListArticulateProjects()
 * @param {Object} validationInfo Rueckgabe von validateArticulateInputs_()
 * @return {string} Thread-ID (leer, wenn nicht gesendet)
 */
/**
 * Sucht die Chat-Thread-ID einer bereits bestehenden "Project Submitted"-
 * Nachricht im Queue-Sheet fuer ein gegebenes Phrase-Projekt. Damit landet
 * die Campus-Setup-Nachricht als ANTWORT im selben Thread wie die normale
 * Projekt-Einreichung, statt einen komplett neuen, separaten Thread zu
 * starten ? vorausgesetzt, dasselbe Phrase-Projekt wurde bereits ueber den
 * normalen Upload-Flow eingereicht (und hat dort eine Thread-ID erhalten).
 */
function findExistingChatThreadForProject_(projectUid) {
  if (!projectUid) return "";
  try {
    var sh = getQueueSheet_();
    var data = sh.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][2] || "").trim() === projectUid) {
        var tid = String(data[i][19] || "").trim();
        if (tid) return tid;
      }
    }
  } catch (e) {
    console.warn("findExistingChatThreadForProject_ fehlgeschlagen: " + e.message);
  }
  return "";
}

/**
 * Baut aus einer URL + Anzeigetext den Google-Chat-Link-Syntax "<url|Text>".
 * Ohne URL wird nur der reine Text zurueckgegeben (kein kaputter Link).
 */
function _chatLink_(url, text) {
  var t = String(text || "").trim();
  if (!url || !t) return t;
  return "<" + url + "|" + t + ">";
}

function sendArticulateSubmittedMessage_(project, validationInfo) {
  var userEmail = project.createdBy || getUserEmail_();
  if (!userEmail) return "";
  if (!getUserChatPreference_(userEmail)) return "";

  // Klickbare Links wo moeglich: Phrase-Projekt, Job-Datei, Drive-Ordner.
  // Kursname/Preview-Pfad bleiben Text ? dafuer existiert bei der
  // Einreichung noch keine Ziel-URL (die kommt erst nach dem ersten Deploy).
  var jobUrl = project.jobUid
    ? "https://cloud.memsource.com/web/job/" + encodeURIComponent(project.jobUid) + "/translate"
    : "";
  var driveFolderUrl = project.driveFolderId
    ? "https://drive.google.com/drive/folders/" + encodeURIComponent(project.driveFolderId)
    : "";

  var projectNameLinked = _chatLink_(project.phraseUrl, (validationInfo && validationInfo.projectName) || "");
  var jobFileLinked      = _chatLink_(jobUrl, (validationInfo && validationInfo.jobFileName) || "");
  var folderLinked       = _chatLink_(driveFolderUrl, (validationInfo && validationInfo.folderName) || "");

  var msg = fillTemplate_(getMessageTemplate_("MSG_ARTICULATE_SUBMITTED", "en"), {
    COURSE_NAME:  project.courseName || "",
    TARGET_LANGS: project.targetLang || "",
    PROJECT_NAME: projectNameLinked,
    JOB_FILE:     jobFileLinked,
    FOLDER_NAME:  folderLinked,
    PREVIEW_PATH: project.firebasePath || "",
    PHRASE_URL:   project.phraseUrl || ""
  });

  // Bestehenden Thread desselben Phrase-Projekts suchen ? falls gefunden,
  // dort antworten statt einen neuen Thread zu starten.
  var threadId = findExistingChatThreadForProject_(project.projectUid);

  try {
    if (threadId) {
      sendThreadReply_(userEmail, threadId, msg);
    } else {
      var res = sendPrivateMessage_(userEmail, msg);
      if (res && res.name) threadId = res.name;
    }
  } catch (e) {
    console.warn("Campus Chat-Nachricht fehlgeschlagen: " + e.message);
    threadId = "";
  }

  if (threadId) {
    try {
      updateArticulateThreadId_(project.rowIndex, threadId);
    } catch (e) {
      console.warn("Thread-ID konnte nicht gespeichert werden: " + e.message);
    }
  }
  return threadId;
}

/**
 * Antwortet im bestehenden Thread, sobald eine neue Preview-Version
 * veroeffentlicht wurde. Faellt auf eine neue Nachricht zurueck, falls
 * noch keine Thread-ID existiert (z.B. bei Alt-Eintraegen, die vor
 * Einfuehrung der Thread-Spalte angelegt wurden).
 *
 * @param {Object} project Zeile aus apiListArticulateProjects()
 * @param {Object} result  Rueckgabe von apiGenerateArticulatePreview()
 */
function sendArticulateDeployedReply_(project, result) {
  var userEmail = project.createdBy || getUserEmail_();
  if (!userEmail) return;
  if (!getUserChatPreference_(userEmail)) return;

  var msg = fillTemplate_(getMessageTemplate_("MSG_ARTICULATE_DEPLOYED", "en"), {
    COURSE_NAME:  project.courseName || "",
    TARGET_LANGS: project.targetLang || "",
    SEGMENTS:     String(result.applied || 0),
    FILE_COUNT:   String(result.uploadedFileCount || 0) + "/" +
                  String(result.totalFileCount || 0),
    SKIPPED:      String(result.skippedFiles || 0),
    LIVE_URL:     result.liveUrl || "",
    TIMESTAMP:    Utilities.formatDate(
                    new Date(), Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm")
  });

  // Thread-ID ermitteln: zuerst die in der Registry gespeicherte nehmen.
  // Fehlt sie (z.B. bei Alt-Eintraegen oder falls sie beim Anlegen aus
  // irgendeinem Grund nicht geschrieben wurde), zur Sicherheit nochmal
  // ueber die Queue nach einem bestehenden Thread fuer dasselbe Phrase-
  // Projekt suchen ? genau derselbe Mechanismus wie beim Anlegen.
  var threadId = project.chatThread || findExistingChatThreadForProject_(project.projectUid);
  var isNewThread = false;

  try {
    if (threadId) {
      sendThreadReply_(userEmail, threadId, msg);
    } else {
      var res = sendPrivateMessage_(userEmail, msg);
      if (res && res.name) { threadId = res.name; isNewThread = true; }
    }
  } catch (e) {
    console.warn("Campus Deploy-Benachrichtigung fehlgeschlagen: " + e.message);
    return;
  }

  // Falls die Registry noch keinen (oder einen anderen) Thread kannte,
  // jetzt nachtragen ? damit kuenftige Deploys ihn direkt finden.
  if (threadId && threadId !== project.chatThread) {
    try {
      updateArticulateThreadId_(project.rowIndex, threadId);
    } catch (e) {
      console.warn("Thread-ID konnte nicht nachgetragen werden: " + e.message);
    }
  }
}

function updateArticulateDeployMsgId_(rowIndex, msgName) {
  var sh = openArticulateSheet_();
  var idx = articulateHeaderIndex_(sh);
  var col = idx["deploy msg"];
  if (col == null) return;
  sh.getRange(rowIndex, col + 1).setValue(msgName);
}

/**
 * Schreibt die Thread-ID in die Registry-Zeile.
 * Tut nichts, falls die Spalte "Chat Thread" (noch) nicht existiert.
 */
function updateArticulateThreadId_(rowIndex, threadId) {
  var sh = openArticulateSheet_();
  var idx = articulateHeaderIndex_(sh);
  var col = idx["chat thread"];
  if (col == null) {
    console.warn("Spalte 'Chat Thread' fehlt im Registry-Sheet - " +
                 "Thread-ID wird nicht gespeichert.");
    return;
  }
  sh.getRange(rowIndex, col + 1).setValue(threadId);
}
