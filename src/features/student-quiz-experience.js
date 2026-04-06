(function mountStudentQuizExperience() {
  function escapeAttr(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function splitAnswerParts(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function hasBlankLabels(question) {
    return question.type === "text" && Array.isArray(question.blankLabels) && question.blankLabels.length > 0;
  }

  function enhanceQuestionHtml(questionHtml) {
    return String(questionHtml || "")
      .replace(/<p>\s*<\/p>/g, "")
      .replace(/\?\s+\?/g, "……");
  }

  function renderQuestionBody(question) {
    const html = enhanceQuestionHtml(question.question);
    return `
      <div class="quiz-question-frame">
        <div class="quiz-question-copy">${html}</div>
      </div>
    `;
  }

  function answerState(ctx, questionId) {
    const reviewItem = ctx.state.quizFlow.review?.questions?.find((item) => item.id === questionId);
    if (!reviewItem) return "";
    return reviewItem.correct ? "quiz-card-correct" : "quiz-card-wrong";
  }

  function submittedAnswer(ctx, questionId) {
    return ctx.state.quizFlow.submittedAnswers?.[questionId] || "";
  }

  function renderLabeledAnswer(question, value) {
    if (!hasBlankLabels(question)) {
      return `<strong>${String(value || "未作答")}</strong>`;
    }

    const labels = question.blankLabels;
    const parts = splitAnswerParts(value);
    return `
      <div class="quiz-answer-badges">
        ${labels.map((label, index) => `
          <div class="quiz-answer-badge">
            <span>${label}</span>
            <strong>${parts[index] || "—"}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function explanationSummary(question) {
    return question?.explanation?.summary || "标准解答还没有补充到这道题，稍后会补成更像老师讲义的版本。";
  }

  function explanationSteps(question) {
    return question?.explanation?.steps || [];
  }

  function selectedQuestionFromReview(ctx) {
    return ctx.state.quizFlow.review?.questions?.find((item) => item.id === ctx.state.quizFlow.selectedQuestionId)
      || ctx.state.quizFlow.review?.questions?.[0]
      || null;
  }

  function aiThreadForQuestion(ctx, questionId) {
    if (!questionId) return [];
    return ctx.state.quizFlow.aiThreads?.[questionId] || [];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function convertInlineMath(text) {
    return text
      .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
      .replace(/\\left/g, "")
      .replace(/\\right/g, "")
      .replace(/\\quad/g, " ")
      .replace(/\\,/g, " ")
      .replace(/\\!/g, "")
      .replace(/\\;/g, " ")
      .replace(/\\:/g, " ")
      .replace(/\\ /g, " ")
      .replace(/\\([\^\-\+\=\(\)\[\]\{\}])/g, "$1")
      .replace(/\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g, '∑<sub>$1</sub><sup>$2</sup>')
      .replace(/\\sum_\{([^{}]+)\}\^([A-Za-z0-9+\-]+)/g, '∑<sub>$1</sub><sup>$2</sup>')
      .replace(/\\sum/g, "∑")
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\leq/g, "≤")
      .replace(/\\geq/g, "≥")
      .replace(/\\neq/g, "≠")
      .replace(/\\pm/g, "±")
      .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="ai-inline-fraction"><span class="ai-inline-fraction-top">$1</span><span class="ai-inline-fraction-bottom">$2</span></span>')
      .replace(/([A-Za-z0-9)\]])\^([A-Za-z0-9+\-]+)/g, '$1<sup>$2</sup>')
      .replace(/([A-Za-z])_\{([^{}]+)\}/g, '$1<sub>$2</sub>')
      .replace(/([A-Za-z])_([A-Za-z0-9+\-]+)/g, '$1<sub>$2</sub>')
      .replace(/\{([^{}]+)\}/g, '$1');
  }

  function looksLikeFormulaLine(line) {
    const plain = line.replace(/<[^>]+>/g, "").trim();
    if (!plain) return false;
    if (plain.length > 72) return false;
    if (/[，。！？；：]/.test(plain)) return false;
    const formulaCharCount = (plain.match(/[=+\-×÷^<>≤≥∑√()]/g) || []).length;
    const letterCount = (plain.match(/[A-Za-z]/g) || []).length;
    const digitCount = (plain.match(/\d/g) || []).length;
    return formulaCharCount >= 1 && (letterCount + digitCount) >= 3;
  }

  function renderAiMessageBody(text) {
    const safeText = escapeHtml(text || "");
    const normalized = convertInlineMath(safeText);
    const blocks = normalized.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

    return blocks.map((block) => {
      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.length) return "";

      if (lines.every((line) => looksLikeFormulaLine(line))) {
        return `
          <div class="ai-formula-card">
            ${lines.map((line) => `<div class="ai-formula-line">${line}</div>`).join("")}
          </div>
        `;
      }

      if (lines.every((line) => /^[•\-]/.test(line))) {
        return `
          <ul class="ai-message-list">
            ${lines.map((line) => `<li>${line.replace(/^[•\-]\s*/, "")}</li>`).join("")}
          </ul>
        `;
      }

      return lines.map((line) => {
        if (looksLikeFormulaLine(line)) {
          return `<div class="ai-formula-card"><div class="ai-formula-line">${line}</div></div>`;
        }
        return `<p class="ai-message-paragraph">${line}</p>`;
      }).join("");
    }).join("");
  }

  function renderAnswerInput(ctx, item) {
    if (item.type === "choice") {
      return `
        <div class="quiz-options">
          ${item.choices.map((choice) => `
            <label class="quiz-option">
              <input type="radio" name="${item.id}" value="${escapeAttr(choice)}" ${submittedAnswer(ctx, item.id) === choice ? "checked" : ""}>
              <span>${choice}</span>
            </label>
          `).join("")}
        </div>
      `;
    }

    if (hasBlankLabels(item)) {
      const currentParts = splitAnswerParts(submittedAnswer(ctx, item.id));
      return `
        <div class="quiz-blank-row">
          ${item.blankLabels.map((label, index) => `
            <label class="quiz-blank-field">
              <span class="quiz-blank-label">${label}</span>
              <input
                class="quiz-blank-input"
                type="text"
                inputmode="decimal"
                data-blank-question="${item.id}"
                data-blank-index="${index}"
                value="${escapeAttr(currentParts[index] || "")}"
                placeholder="${label}"
              >
            </label>
          `).join("")}
        </div>
      `;
    }

    return `
      <div style="margin-top:12px;">
        <input class="quiz-input" type="text" name="${item.id}" value="${escapeAttr(submittedAnswer(ctx, item.id))}" placeholder="请输入答案">
      </div>
    `;
  }

  function renderPracticeStage(ctx) {
    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Practice Session</p>
            <h3>${ctx.quizSubject()?.label || ""} / ${ctx.quizTopic()?.label || ""} / ${ctx.quizLevel()?.label || ""}</h3>
          </div>
          <span class="tag">5 题</span>
        </div>
        <form class="quiz-form" id="student-quiz-form">
          ${ctx.state.quizFlow.questions.map((item, index) => `
            <div class="quiz-card ${answerState(ctx, item.id)}">
              <div class="quiz-question-head">${index + 1}.</div>
              ${renderQuestionBody(item)}
              ${renderAnswerInput(ctx, item)}
            </div>
          `).join("")}
        </form>
        <div class="quiz-actions">
          <button class="primary-btn" id="submit-student-quiz" type="button">${ctx.state.loading ? "提交中..." : "提交作答"}</button>
          <button class="ghost-btn" data-quiz-back="level" type="button">返回难度</button>
        </div>
      </section>
    `;
  }

  function renderResultNavigator(ctx) {
    const questions = ctx.state.quizFlow.review?.questions || [];
    return `
      <div class="quiz-result-nav">
        ${questions.map((item, index) => `
          <button class="quiz-result-tab ${item.correct ? "is-correct" : "is-wrong"} ${ctx.state.quizFlow.selectedQuestionId === item.id ? "is-active" : ""}" data-review-question="${item.id}" type="button">${index + 1}</button>
        `).join("")}
      </div>
    `;
  }

  function renderQuestionDetail(ctx) {
    const selectedQuestion = ctx.state.quizFlow.review?.questions?.find((item) => item.id === ctx.state.quizFlow.selectedQuestionId)
      || ctx.state.quizFlow.review?.questions?.[0]
      || null;

    if (!selectedQuestion) {
      return `
        <div class="quiz-review-card">
          <p class="profile-meta">先完成这一组题目，提交后这里会显示每一道题的详细信息。</p>
        </div>
      `;
    }

    const steps = explanationSteps(selectedQuestion);

    return `
      <div class="quiz-review-card">
        <div class="quiz-review-head">
          <div>
            <p class="eyebrow">Question</p>
            <h3>${selectedQuestion.correct ? "这题答对了" : "这题需要复盘"}</h3>
          </div>
          <span class="quiz-status-pill ${selectedQuestion.correct ? "is-correct" : "is-wrong"}">${selectedQuestion.correct ? "正确" : "错误"}</span>
        </div>

        <div class="quiz-review-block">
          <p class="eyebrow">题目</p>
          ${renderQuestionBody(selectedQuestion)}
        </div>

        <div class="quiz-answer-grid">
          <div class="answer-strip answer-strip-student">
            <span>你的答案</span>
            ${renderLabeledAnswer(selectedQuestion, selectedQuestion.studentAnswer)}
          </div>
          <div class="answer-strip answer-strip-correct">
            <span>标准答案</span>
            ${renderLabeledAnswer(selectedQuestion, selectedQuestion.correctAnswer)}
          </div>
        </div>

        <div class="quiz-review-block">
          <p class="eyebrow">老师标准解答</p>
          <div class="quiz-explanation-card">
            <p>${explanationSummary(selectedQuestion)}</p>
            ${steps.length ? `
              <div class="quiz-step-list">
                ${steps.map((step) => `
                  <div class="quiz-step-card">
                    <strong>${step.line || "步骤"}${step.title ? ` · ${step.title}` : ""}</strong>
                    <p>${step.detail || ""}</p>
                  </div>
                `).join("")}
              </div>
            ` : `<p class="profile-meta">这道题的分步讲解还在补写，先保留摘要版。</p>`}
          </div>
        </div>
      </div>
    `;
  }

  function renderAiPanel(ctx) {
    const selectedQuestion = selectedQuestionFromReview(ctx);
    const questionId = selectedQuestion?.id || "";
    const messages = aiThreadForQuestion(ctx, questionId);
    const isStreaming = ctx.state.quizFlow.aiStreamingQuestionId === questionId;
    const errorMessage = questionId ? ctx.state.quizFlow.aiErrorByQuestion?.[questionId] : "";

    return `
      <section class="panel quiz-ai-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">AI Tutor</p>
            <h3>讲题对话框</h3>
          </div>
          <span class="tag">${selectedQuestion ? selectedQuestion.id : "未选题"}</span>
        </div>

        <div class="quiz-chat-shell">
          <div class="quiz-chat-thread">
            <div class="quiz-bubble-row ai">
              <div class="message-card ai">
                <div class="message-meta"><strong>AI 助手</strong><span class="small-note">开场</span></div>
                <p class="message-body">我会只围绕你当前点开的这道题来解释，不会突然跳到别的题。</p>
              </div>
            </div>
            <div class="quiz-bubble-row ai">
              <div class="message-card ai">
                <div class="message-meta"><strong>AI 助手</strong><span class="small-note">建议</span></div>
                <p class="message-body">你可以直接问“这一步为什么这样做”“能不能更简单一点”或者“先解释这个知识点”。</p>
              </div>
            </div>
            ${messages.map((item) => `
              <div class="quiz-bubble-row ${item.from === "student" ? "student" : "ai"}">
                <div class="message-card ${item.from}">
                  <div class="message-meta"><strong>${item.title}</strong><span class="small-note">${item.time}</span></div>
                  <div class="message-body">${renderAiMessageBody(item.body || (item.from === "ai" ? "..." : ""))}</div>
                </div>
              </div>
            `).join("")}
            ${errorMessage ? `
              <div class="quiz-bubble-row ai">
                <div class="message-card ai quiz-ai-error-card">
                  <div class="message-meta"><strong>AI 助手</strong><span class="small-note">错误</span></div>
                  <div class="message-body">${renderAiMessageBody(errorMessage)}</div>
                </div>
              </div>
            ` : ""}
          </div>

          <div class="quiz-chat-suggestions">
            <button class="chip-btn" data-ai-prompt="这一步为什么这么做？" type="button" ${selectedQuestion ? "" : "disabled"}>这一步为什么这么做？</button>
            <button class="chip-btn" data-ai-prompt="能不能更简单一点？" type="button" ${selectedQuestion ? "" : "disabled"}>能不能更简单一点？</button>
            <button class="chip-btn" data-ai-prompt="先解释这个知识点" type="button" ${selectedQuestion ? "" : "disabled"}>先解释这个知识点</button>
            <button class="chip-btn" data-ai-prompt="如果能画图就更好了" type="button" ${selectedQuestion ? "" : "disabled"}>如果能画图就更好了</button>
          </div>

          <div class="quiz-chat-input-dock">
            <textarea class="prompt-input" id="quiz-ai-input" rows="4" placeholder="${selectedQuestion ? "输入你想继续追问的问题" : "先在左边点开一道题，再来追问"}" ${selectedQuestion ? "" : "disabled"}></textarea>
            <div class="prompt-actions">
              <button class="primary-btn" id="send-quiz-ai-message" type="button" ${(selectedQuestion && !isStreaming) ? "" : "disabled"}>${isStreaming ? "讲解中..." : "发送提问"}</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderGuideStage() {
    return `
      <section class="panel">
        <p class="eyebrow">Guide</p>
        <h3>提交后查看结果</h3>
        <p class="profile-meta">做完 5 道题并提交后，结果页会切换成复盘模式。左边是 1 到 5 的题号按钮和单题详情，右边是 AI 讲题对话框。</p>
      </section>
    `;
  }

  function renderResultStage(ctx) {
    const total = ctx.state.quizFlow.review?.questions?.length || 0;
    const correctCount = ctx.state.quizFlow.review?.correctCount || 0;
    const wrongCount = ctx.state.quizFlow.review?.wrongCount || 0;
    const score = total ? Math.round((correctCount / total) * 100) : 0;

    return `
      <section class="quiz-stage-shell quiz-stage-review">
        <section class="quiz-main-column">
          <section class="panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Result Overview</p>
                <h3>本次得分 ${score}</h3>
              </div>
              <span class="tag">${correctCount} 对 / ${wrongCount} 错</span>
            </div>

            <p class="profile-meta">先点题号看单题详情。绿色表示答对，红色表示需要复盘，这样会比把 5 道题全部摊开更清楚。</p>

            ${renderResultNavigator(ctx)}
            ${renderQuestionDetail(ctx)}

            <div class="quiz-actions">
              <button class="ghost-btn" data-quiz-back="level" type="button">换一组题再练</button>
            </div>
          </section>
        </section>

        <aside class="quiz-side-column">
          ${renderAiPanel(ctx)}
        </aside>
      </section>
    `;
  }

  function render(ctx) {
    const catalog = ctx.state.quizCatalog || { subjects: [], levels: [] };

    if (!ctx.state.quizFlow.subjectId) {
      return `
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Practice Library</p>
              <h3>先选择学科题库</h3>
            </div>
          </div>
          <div class="quiz-subject-grid">
            ${catalog.subjects.map((item) => `
              <button class="quiz-subject-card ${item.accent || ""}" data-quiz-subject="${item.id}" type="button">
                <strong>${item.label}</strong>
                <p>${item.description || ""}</p>
              </button>
            `).join("")}
          </div>
        </section>
      `;
    }

    if (!ctx.state.quizFlow.topicId) {
      return `
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Knowledge Map</p>
              <h3>${ctx.quizSubject()?.label || ""}</h3>
            </div>
          </div>
          <div class="knowledge-node-grid">
            ${ctx.quizSubject()?.topics.map((item) => `
              <button class="knowledge-node" data-quiz-topic="${item.id}" type="button">
                <strong>${item.label}</strong>
                <p>${item.summary || ""}</p>
              </button>
            `).join("") || ""}
          </div>
          <div class="feedback-toolbar" style="margin-top:12px;">
            <button class="ghost-btn" data-quiz-back="subject" type="button">返回学科</button>
          </div>
        </section>
      `;
    }

    if (!ctx.state.quizFlow.levelId || !ctx.state.quizFlow.questions.length) {
      return `
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="eyebrow">Difficulty</p>
              <h3>${ctx.quizSubject()?.label || ""} / ${ctx.quizTopic()?.label || ""}</h3>
            </div>
          </div>
          <div class="quiz-level-grid">
            ${catalog.levels.map((item) => `
              <button class="quiz-level-card ${ctx.state.quizFlow.levelId === item.id ? "active" : ""}" data-quiz-level="${item.id}" type="button">
                <strong>${item.label}</strong>
                <p>${item.description || ""}</p>
              </button>
            `).join("")}
          </div>
          <div class="feedback-toolbar" style="margin-top:12px;">
            <button class="ghost-btn" data-quiz-back="topic" type="button">返回知识点</button>
            <button class="primary-btn" id="start-quiz-session-btn" type="button">开始 5 题练习</button>
          </div>
        </section>
      `;
    }

    if (!ctx.state.quizFlow.review) {
      return `
        <section class="quiz-stage-shell quiz-stage-compact">
          <section class="quiz-main-column">
            ${renderPracticeStage(ctx)}
          </section>
          <aside class="quiz-side-column">
            ${renderGuideStage()}
          </aside>
        </section>
      `;
    }

    return renderResultStage(ctx);
  }

  function bind(ctx) {
    ctx.contentEl.querySelectorAll("[data-quiz-subject]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.resetQuizFlow("subject");
        ctx.state.quizFlow.subjectId = button.dataset.quizSubject;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-quiz-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.resetQuizFlow("topic");
        ctx.state.quizFlow.topicId = button.dataset.quizTopic;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-quiz-level]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.resetQuizFlow("level");
        ctx.state.quizFlow.levelId = button.dataset.quizLevel;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-quiz-back]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.resetQuizFlow(button.dataset.quizBack);
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-review-question]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.quizFlow.selectedQuestionId = button.dataset.reviewQuestion;
        ctx.renderApp();
      });
    });

    const startQuizButton = document.getElementById("start-quiz-session-btn");
    if (startQuizButton) startQuizButton.addEventListener("click", ctx.startQuizSession);

    const submitQuizButton = document.getElementById("submit-student-quiz");
    if (submitQuizButton) submitQuizButton.addEventListener("click", ctx.submitQuizSession);

    ctx.contentEl.querySelectorAll("[data-ai-prompt]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.sendQuizFollowUp(button.dataset.aiPrompt);
      });
    });

    const sendAiButton = document.getElementById("send-quiz-ai-message");
    const aiInput = document.getElementById("quiz-ai-input");
    if (sendAiButton && aiInput) {
      const sendCurrentMessage = () => {
        const text = aiInput.value.trim();
        if (!text) return;
        aiInput.value = "";
        ctx.sendQuizFollowUp(text);
      };

      sendAiButton.addEventListener("click", sendCurrentMessage);
      aiInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendCurrentMessage();
        }
      });
    }

    const chatThread = ctx.contentEl.querySelector(".quiz-chat-thread");
    if (chatThread) {
      requestAnimationFrame(() => {
        chatThread.scrollTop = chatThread.scrollHeight;
      });
    }
  }

  window.StudentQuizExperience = {
    render,
    bind
  };
})();
