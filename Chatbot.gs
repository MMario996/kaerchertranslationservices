/**
 * ChatBot.gs
 * Gemini-powered Google Chat Bot f?r Translation Services ? mit Function Calling.
 *
 * Gemini entscheidet selbst, welche Tools (Phrase-Abfragen) es aufruft.
 * Tools sind in ChatBotTools.js definiert (alle READ-ONLY, mit Zugriffsschutz).
 *
 * ASYNC-MODUS (B1): doPost ruft handleChatMessageAsync_ auf.
 *   1. Sofort "? Einen Moment..." als Bot-Nachricht senden
 *   2. Gemini Function-Calling Loop (10-30s)
 *   3. Finale Antwort als separate Bot-Nachricht senden
 *   Damit wird das Google-Chat 30s-Inline-Timeout umgangen.
 *
 * onMessage(e) bleibt f?r Editor-Tests (gibt Text zur?ck statt zu senden).
 *
 * Script Property: GEMINI_API_KEY
 * Apigee-Proxy Basis-URL in GEMINI_API_BASE_.
 */

var GEMINI_MODEL_     = "gemini-2.0-flash";
var GEMINI_API_BASE_  = "https://34-111-99-134.nip.io/gemini/v1beta/models/";
var MAX_TOOL_ROUNDS_  = 5;   // Hard-Limit gegen Endlosschleifen

// ??? ASYNC Handler (wird von doPost bei type=MESSAGE aufgerufen) ??????????????

function handleChatMessageAsync_(e) {
  const user        = e.user || (e.message && e.message.sender) || {};
  const userEmail   = String(user.email || "").trim().toLowerCase();
  const messageText = String((e.message && e.message.text) || "").trim();
  const displayName = String(user.displayName || "").trim() || (userEmail ? userEmail.split("@")[0] : "");

  // Leere Nachricht ? Hilfe-Text direkt senden
  if (!messageText) {
    _botSafeSend_(userEmail, _botHelpText_());
    return;
  }

  if (!userEmail) {
    _botSafeSend_(userEmail, "?? Ich konnte deine E-Mail nicht ermitteln. Bitte ?ffne den Bot direkt in Google Chat.");
    return;
  }

  // 1. Sofort-Feedback senden
  _botSafeSend_(userEmail, "? Einen Moment, ich schaue das f?r dich nach...");

  // 2. Gemini-Loop (dauert 10-30s)
  let answer;
  try {
    answer = runGeminiConversation_(messageText, displayName, userEmail);
  } catch (err) {
    console.error("ChatBot async error:", err.message);
    answer = "?? Ich konnte deine Anfrage leider nicht verarbeiten.\n\nFehler: " + err.message +
             "\n\n? Nutze das Portal f?r alle Aktionen: " + PORTAL_URL_;
  }

  // 3. Finale Antwort senden
  _botSafeSend_(userEmail, answer);
}

// Sendet eine Bot-Nachricht, schluckt Fehler (damit doPost nie crasht)
function _botSafeSend_(userEmail, text) {
  if (!userEmail || !text) return;
  try {
    sendPrivateMessage_(userEmail, text);
  } catch (e) {
    console.warn("_botSafeSend_ failed for " + userEmail + ": " + e.message);
  }
}

function _botHelpText_() {
  return [
    "? Hallo! Ich bin der Translation-Services Bot.",
    "",
    "Stell mir Fragen zu deinen Projekten, z.B.:",
    "? *Was ist der Status von Projekt X?*",
    "? *Welche Jobs sind in Projekt X noch offen?*",
    "? *Kann ich Projekt X schon herunterladen?*",
    "? *Welche Projekte laufen diese Woche ab?*",
    "? *Wie viele W?rter hat Projekt X?*",
    "? *Wie funktioniert das Tool?*"
  ].join("\n");
}

// ??? onMessage (NUR f?r Editor-Tests ? gibt Text zur?ck) ?????????????????????

function onMessage(e) {
  rememberChatUserFromEvent_(e);

  const user        = e.user || (e.message && e.message.sender) || {};
  const userEmail   = String(user.email || "").trim().toLowerCase();
  const messageText = String((e.message && e.message.text) || "").trim();
  const displayName = String(user.displayName || "").trim() || (userEmail ? userEmail.split("@")[0] : "");

  if (!messageText) return { text: _botHelpText_() };
  if (!userEmail)   return { text: "?? Ich konnte deine E-Mail nicht ermitteln." };

  try {
    const answer = runGeminiConversation_(messageText, displayName, userEmail);
    return { text: answer };
  } catch (err) {
    console.error("ChatBot onMessage error:", err.message);
    return {
      text: "?? Ich konnte deine Anfrage leider nicht verarbeiten.\n\nFehler: " + err.message +
            "\n\n? Nutze das Portal f?r alle Aktionen: " + PORTAL_URL_
    };
  }
}

// ??? Gemini Function-Calling Loop ?????????????????????????????????????????????

function runGeminiConversation_(userMessage, displayName, userEmail) {
  const apiKey = String(PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY") || "").trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY nicht gesetzt in Script Properties.");

  const isAdm = isAdmin_(userEmail);
  const url   = GEMINI_API_BASE_ + GEMINI_MODEL_ + ":generateContent?key=" + encodeURIComponent(apiKey);

  const contents = [
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const tools = [{ functionDeclarations: getChatBotToolDeclarations_() }];

  for (let round = 0; round < MAX_TOOL_ROUNDS_; round++) {
    const payload = {
      systemInstruction: {
        parts: [{ text: buildSystemPrompt_(isAdm, displayName, userEmail) }]
      },
      contents: contents,
      tools: tools,
      generationConfig: {
        temperature:     0.2,
        maxOutputTokens: 1024,
        topP:            0.8
      }
    };

    const res = UrlFetchApp.fetch(url, {
      method:             "post",
      contentType:        "application/json",
      payload:            JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const code = res.getResponseCode();
    const body = res.getContentText();
    if (code >= 400) {
      console.error("Gemini API Error (" + code + "):", body);
      throw new Error("Gemini API Fehler (" + code + ")");
    }

    const result    = JSON.parse(body);
    const candidate = result && result.candidates && result.candidates[0];
    const parts     = (candidate && candidate.content && candidate.content.parts) || [];

    const functionCalls = parts.filter(p => p.functionCall).map(p => p.functionCall);

    if (functionCalls.length === 0) {
      const text = parts.filter(p => p.text).map(p => p.text).join("\n").trim();
      if (text) return text;
      return "Ich konnte dazu leider keine Antwort generieren. Bitte formuliere deine Frage anders oder nutze das Portal.";
    }

    contents.push({ role: "model", parts: parts });

    const responseParts = [];
    for (const fc of functionCalls) {
      const toolName = fc.name;
      const args     = fc.args || {};
      console.log("? Gemini Tool-Call: " + toolName + " " + JSON.stringify(args));

      // userEmail SERVERSEITIG (nicht aus Gemini-Args) ? Zugriffsschutz
      const toolResult = executeChatBotTool_(toolName, args, userEmail);

      responseParts.push({
        functionResponse: {
          name: toolName,
          response: { result: toolResult }
        }
      });
    }

    contents.push({ role: "user", parts: responseParts });
  }

  return "Die Anfrage war zu komplex und ich konnte sie nicht vollst?ndig beantworten. " +
         "Bitte stelle eine konkretere Frage oder pr?fe direkt im Portal.";
}

// ??? System Prompt ????????????????????????????????????????????????????????????

function buildSystemPrompt_(isAdmin, displayName, userEmail) {
  return [
    "Du bist der intelligente Assistent des K?rcher Translation Services Portals (basiert auf Phrase TMS).",
    "Dein Name ist 'Translation-Services'.",
    "Du kommunizierst auf Deutsch, au?er der Nutzer schreibt auf Englisch ? dann antwortest du auf Englisch.",
    "",
    "DEINE F?HIGKEITEN (?ber Tools, die du selbst aufrufst):",
    "- Projekte des Nutzers finden (findMyProjects)",
    "- Live-Projektstatus aus Phrase TMS holen (getProjectStatusLive)",
    "- Job-Status pro Sprache/Workflow-Level und Download-Verf?gbarkeit pr?fen (getJobStatuses)",
    "- Analyse-/Wortzahl-Daten holen (getProjectAnalysis)",
    "- Notizen/Kommentare eines Jobs lesen (getJobNotes)",
    "- Referenzdateien auflisten (getProjectReferences)",
    "- Anstehende Deadlines auflisten (getDeadlinesOverview)",
    "",
    "WICHTIGE REGELN F?R TOOL-NUTZUNG:",
    "- Wenn der Nutzer ein Projekt per NAMEN nennt, rufe ZUERST findMyProjects auf, um die projectUid zu bekommen.",
    "- Nutze die projectUid dann f?r die spezifischeren Tools.",
    "- Erfinde NIEMALS projectUids oder jobUids. Hole sie immer ?ber die Tools.",
    "- Wenn ein Tool einen Fehler oder 'kein Zugriff' zur?ckgibt, teile dem Nutzer h?flich mit, dass das Projekt nicht gefunden wurde oder er keinen Zugriff hat.",
    "- Rufe nur die Tools auf, die f?r die Frage n?tig sind.",
    "",
    "ANTWORT-REGELN:",
    "- Antworte pr?zise und kurz. Maximal 10-15 Zeilen.",
    "- Nutze Status-Emojis: UPLOADED=?, ASSIGNED=?, ACCEPTED=?, COMPLETED=?, DELIVERED=?, CANCELLED=?, NEW=?",
    "- Bei spezifischen Projekten gib wenn m?glich den Phrase-Link an.",
    "- 'DELIVERED' oder finales Level 'COMPLETED' bedeutet: Download ist m?glich.",
    "- Du kannst KEINE Aktionen ausf?hren (kein Stornieren, kein Erstellen, kein ?ndern). Verweise daf?r auf das Portal.",
    isAdmin
      ? "- Du hast Admin-Zugriff und kannst ALLE Projekte aller Nutzer einsehen."
      : "- Du siehst nur Projekte, bei denen " + displayName + " Owner ist oder die mit ihm geteilt wurden.",
    "",
    "PORTAL URL: " + PORTAL_URL_,
    "",
    "FAQ-WISSEN (direkt beantworten, ohne Tool):",
    "- Das Tool basiert auf Phrase TMS.",
    "- Dateien hochladen: PC Upload, Google Drive oder Drive Link.",
    "- Hauptdatei-Formate: .docx, .xlsx, .pptx, .idml, .txt, .xml, .html ? KEINE PDFs.",
    "- PDFs nur als Referenzdateien erlaubt.",
    "- Benachrichtigungen kommen via Google Chat vom Bot 'Translation-Services'.",
    "- Projekte teilen: Im Tab 'My Projects' auf das Share-Icon klicken.",
    "- Status-Reihenfolge: NEW ? UPLOADED ? ASSIGNED ? ACCEPTED ? COMPLETED/DELIVERED.",
    "- Bei technischen Problemen: Taskbox Ticket erstellen.",
    "",
    "Aktueller Nutzer: " + displayName + " (" + userEmail + ")"
  ].join("\n");
}

// ??? Test-Funktionen (Editor) ?????????????????????????????????????????????????

function testChatBotGemini() {
  const result = onMessage({
    user: { email: "mario.magliano@karcher.com", displayName: "Mario" },
    message: { text: "Welche Projekte laufen diese Woche ab?" }
  });
  console.log("Bot Antwort:", result.text);
}

function testChatBotToolCall() {
  const result = onMessage({
    user: { email: "mario.magliano@karcher.com", displayName: "Mario" },
    message: { text: "Was ist der Status meines neuesten Projekts und kann ich es herunterladen?" }
  });
  console.log("Bot Antwort:", result.text);
}