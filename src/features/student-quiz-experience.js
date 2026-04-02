(function mountStudentQuizExperience() {
  function renderQuestionBody(questionHtml) {
    return `<div class="quiz-question-copy">${questionHtml}</div>`;
  }

  function answerState(ctx, questionId) {
    const reviewItem = ctx.state.quizFlow.review?.questions?.find((item) => item.id === questionId);
    if (!reviewItem) return "";
    return reviewItem.correct ? "quiz-card-correct" : "quiz-card-wrong";
  }

  function submittedAnswer(ctx, questionId) {
    return ctx.state.quizFlow.submittedAnswers?.[questionId] || "";
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
          ${ctx.state.quizFlow.questions.map((item, index) => item.type === "choice"
            ? `<div class="quiz-card ${answerState(ctx, item.id)}" data-question-card="${item.id}"><div class="quiz-question-head">${index + 1}.</div>${renderQuestionBody(item.question)}<div class="quiz-options">${item.choices.map((choice) => `<label class="quiz-option"><input type="radio" name="${item.id}" value="${choice}" ${submittedAnswer(ctx, item.id) === choice ? "checked" : ""}><span>${choice}</span></label>`).join("")}</div></div>`
            : `<div class="quiz-card ${answerState(ctx, item.id)}" data-question-card="${item.id}"><div class="quiz-question-head">${index + 1}.</div>${renderQuestionBody(item.question)}<div style="margin-top:12px;"><input class="quiz-input" type="text" name="${item.id}" value="${submittedAnswer(ctx, item.id)}" placeholder="请输入答案"></div></div>`).join("")}
        </form>
        <div class="quiz-actions">
          <button class="primary-btn" id="submit-student-quiz" type="button">${ctx.state.loading ? "提交中..." : "提交作答"}</button>
          <button class="ghost-btn" data-quiz-back="level" type="button">返回难度</button>
        </div>
      </section>
    `;
  }

  function renderSidePanel(ctx) {
    const selectedWrongQuestion = ctx.state.quizFlow.review?.wrongQuestions?.find((item) => item.id === ctx.state.quizFlow.selectedQuestionId) || ctx.state.quizFlow.review?.wrongQuestions?.[0] || null;

    if (!ctx.state.quizFlow.review) {
      return `
        <section class="panel">
          <p class="eyebrow">Guide</p>
          <h3>提交后查看结果</h3>
          <p class="profile-meta">答对的题会变成淡绿色，答错的题会变成淡红色。点击错题后，右侧会显示老师标准讲解和 AI 追问框。</p>
        </section>
      `;
    }

    return `
      <section class="panel">
        <p class="eyebrow">Result</p>
        <h3>本次得分 ${Math.round((ctx.state.quizFlow.review.correctCount / Math.max(1, ctx.state.quizFlow.review.questions.length)) * 100)}</h3>
        <p class="profile-meta">共 ${ctx.state.quizFlow.review.questions.length} 题，答错 ${ctx.state.quizFlow.review.wrongCount} 题。</p>

        ${selectedWrongQuestion ? `
          <div class="quiz-side-section">
            <p class="eyebrow">Selected Wrong Question</p>
            <div class="todo-item active-review-item">
              ${renderQuestionBody(selectedWrongQuestion.question)}
              <p>你的答案：${selectedWrongQuestion.studentAnswer}</p>
              <p>正确答案：${selectedWrongQuestion.correctAnswer}</p>
            </div>
          </div>

          <div class="quiz-side-section">
            <p class="eyebrow">Teacher Explanation</p>
            ${selectedWrongQuestion.explanation ? `
              <div class="todo-list">
                <div class="todo-item">
                  <strong>${selectedWrongQuestion.explanation.assetLabel || "标准讲解"}</strong>
                  <p>${selectedWrongQuestion.explanation.summary || "这道题有老师提前准备好的讲解。"}</p>
                </div>
                ${(selectedWrongQuestion.explanation.steps || []).map((step) => `
                  <div class="todo-item">
                    <strong>${step.line || "步骤"} / ${step.title || ""}</strong>
                    <p>${step.detail || ""}</p>
                  </div>
                `).join("")}
              </div>
            ` : `<p class="profile-meta">这道题暂时还没有配置标准讲解。</p>`}
          </div>

          <div class="quiz-side-section">
            <p class="eyebrow">AI Follow-up</p>
            <div class="message-list chat-thread">
              <div class="message-card ai">
                <div class="message-meta"><strong>AI 助手</strong><span class="small-note">提示</span></div>
                <p class="message-body">你可以问“第 2 步是什么意思”“为什么这里要通分”这类问题。</p>
              </div>
              ${ctx.state.quizFlow.explainMessages.map((item) => `
                <div class="message-card ${item.from}">
                  <div class="message-meta"><strong>${item.title}</strong><span class="small-note">${item.time}</span></div>
                  <p class="message-body">${item.body}</p>
                </div>
              `).join("")}
            </div>
            <div class="chat-input-shell">
              <textarea class="prompt-input" id="quiz-explain-input" rows="4" placeholder="例如：第 2 步为什么可以直接套公式？">${ctx.state.quizFlow.explainDraft}</textarea>
              <div class="prompt-actions">
                <button class="primary-btn" id="send-quiz-explain-btn" type="button">发送追问</button>
              </div>
            </div>
          </div>
        ` : `
          <div class="quiz-side-section">
            <p class="profile-meta">这次全部答对了，可以直接去下一组练习。</p>
          </div>
        `}
      </section>
    `;
  }

  function render(ctx) {
    const catalog = ctx.state.quizCatalog || { subjects: [], levels: [] };

    if (!ctx.state.quizFlow.subjectId) {
      return `<section class="panel"><div class="panel-head"><div><p class="eyebrow">Practice Library</p><h3>先选择学科题库</h3></div></div><div class="quiz-subject-grid">${catalog.subjects.map((item) => `<button class="quiz-subject-card ${item.accent || ""}" data-quiz-subject="${item.id}" type="button"><strong>${item.label}</strong><p>${item.description || ""}</p></button>`).join("")}</div></section>`;
    }

    if (!ctx.state.quizFlow.topicId) {
      return `<section class="panel"><div class="panel-head"><div><p class="eyebrow">Knowledge Map</p><h3>${ctx.quizSubject()?.label || ""}</h3></div></div><div class="knowledge-node-grid">${ctx.quizSubject()?.topics.map((item) => `<button class="knowledge-node" data-quiz-topic="${item.id}" type="button"><strong>${item.label}</strong><p>${item.summary || ""}</p></button>`).join("") || ""}</div><div class="feedback-toolbar" style="margin-top:12px;"><button class="ghost-btn" data-quiz-back="subject" type="button">返回学科</button></div></section>`;
    }

    if (!ctx.state.quizFlow.levelId || !ctx.state.quizFlow.questions.length) {
      return `<section class="panel"><div class="panel-head"><div><p class="eyebrow">Difficulty</p><h3>${ctx.quizSubject()?.label || ""} / ${ctx.quizTopic()?.label || ""}</h3></div></div><div class="quiz-level-grid">${catalog.levels.map((item) => `<button class="quiz-level-card ${ctx.state.quizFlow.levelId === item.id ? "active" : ""}" data-quiz-level="${item.id}" type="button"><strong>${item.label}</strong><p>${item.description || ""}</p></button>`).join("")}</div><div class="feedback-toolbar" style="margin-top:12px;"><button class="ghost-btn" data-quiz-back="topic" type="button">返回知识点</button><button class="primary-btn" id="start-quiz-session-btn" type="button">开始 5 题练习</button></div></section>`;
    }

    return `
      <section class="quiz-stage-shell quiz-stage-compact">
        <section class="quiz-main-column">
          ${renderPracticeStage(ctx)}
        </section>
        <aside class="quiz-side-column">
          ${renderSidePanel(ctx)}
        </aside>
      </section>
    `;
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

    ctx.contentEl.querySelectorAll("[data-question-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const questionId = card.dataset.questionCard;
        const reviewItem = ctx.state.quizFlow.review?.questions?.find((item) => item.id === questionId);
        if (!reviewItem || reviewItem.correct) return;
        ctx.state.quizFlow.selectedQuestionId = questionId;
        ctx.state.quizFlow.explainDraft = "";
        ctx.state.quizFlow.explainMessages = [];
        ctx.renderApp();
      });
    });

    const startQuizButton = document.getElementById("start-quiz-session-btn");
    if (startQuizButton) startQuizButton.addEventListener("click", ctx.startQuizSession);

    const submitQuizButton = document.getElementById("submit-student-quiz");
    if (submitQuizButton) submitQuizButton.addEventListener("click", ctx.submitQuizSession);

    const explainInput = document.getElementById("quiz-explain-input");
    if (explainInput) {
      explainInput.addEventListener("input", () => {
        ctx.state.quizFlow.explainDraft = explainInput.value;
      });
    }

    const sendExplainButton = document.getElementById("send-quiz-explain-btn");
    if (sendExplainButton) {
      sendExplainButton.addEventListener("click", () => {
        const text = (ctx.state.quizFlow.explainDraft || "").trim();
        const selectedWrongQuestion = ctx.state.quizFlow.review?.wrongQuestions?.find((item) => item.id === ctx.state.quizFlow.selectedQuestionId) || ctx.state.quizFlow.review?.wrongQuestions?.[0];
        if (!text || !selectedWrongQuestion) return;

        const firstStep = selectedWrongQuestion.explanation?.steps?.[0];
        const reply = firstStep
          ? `我先围绕老师讲解回答你。这道题可以先看「${firstStep.title || firstStep.line}」这一步：${firstStep.detail}`
          : "我会围绕这道题已有的老师标准讲解来回答你。你可以继续追问具体是哪一步没看懂。";

        ctx.state.quizFlow.explainMessages.push({ from: "student", title: "我", time: "刚刚", body: text });
        ctx.state.quizFlow.explainMessages.push({ from: "ai", title: "AI 助手", time: "刚刚", body: reply });
        ctx.state.quizFlow.explainDraft = "";
        ctx.renderApp();
      });
    }
  }

  window.StudentQuizExperience = {
    render,
    bind
  };
})();
