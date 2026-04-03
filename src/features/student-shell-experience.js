(function mountStudentShellExperience() {
  function renderNews() {
    return `
      <section class="metric-grid">
        <article class="metric-card"><span>当前方向</span><strong>学生做题 + AI 讲解</strong><small>先把学生主线做扎实</small></article>
        <article class="metric-card"><span>当前阶段</span><strong>Agile S1</strong><small>数据库驱动练习流</small></article>
        <article class="metric-card"><span>产品目标</span><strong>小私塾提效</strong><small>短练习、即时反馈、老师标准讲解</small></article>
      </section>
      <section class="news-grid">
        <article class="news-card"><p class="eyebrow">News</p><h3>本周演示重点</h3><p>学生从题库选择学科、知识点、难度，完成 5 题练习后进入错题讲解。</p></article>
        <article class="news-card"><p class="eyebrow">News</p><h3>老师讲解优先</h3><p>AI 不替代标准讲解，只在学生看不懂某一步时负责追问解释。</p></article>
        <article class="news-card"><p class="eyebrow">News</p><h3>新增排课闭环</h3><p>老师可以发起 1v1 排课，学生可以在 Checklist 中确认或取消。</p></article>
      </section>
    `;
  }

  function renderChecklist(ctx) {
    const homeworkUnread = (ctx.state.learningRecords?.homework || []).filter((item) => item.teacherNote && !ctx.state.seenHomeworkIds[item.id]);
    const scheduleUnread = (ctx.state.scheduleDemo?.items || []).filter((item) => item.studentId === "1" && item.status === "pending_student");

    if (!homeworkUnread.length && !scheduleUnread.length) {
      return `<section class="panel"><p class="eyebrow">Checklist</p><h3>当前没有未确认事项</h3></section>`;
    }

    return `
      <section class="panel">
        <p class="eyebrow">Checklist</p>
        <h3>待处理事项</h3>
        <div class="todo-list">
          ${scheduleUnread.map((item) => `
            <div class="todo-item">
              <strong>${item.title}</strong>
              <p>${item.date} ${item.time} / ${item.location}</p>
              <p>${item.notes || "老师发起了一节待确认的 1v1 课程。"}</p>
              <div class="feedback-toolbar" style="margin-top:12px;">
                <button class="primary-btn" data-schedule-confirm="${item.id}" type="button">确认时间</button>
                <button class="ghost-btn" data-schedule-cancel="${item.id}" data-cancel-role="student" type="button">取消并填写原因</button>
              </div>
            </div>
          `).join("")}
          ${homeworkUnread.map((item) => `<button class="todo-item checklist-link" data-open-homework="${item.lessonId}" type="button"><strong>${item.title}</strong><p>${item.teacherNote || "老师已更新作业状态"}</p></button>`).join("")}
        </div>
      </section>
    `;
  }

  function renderMessagePanel(title, messages, placeholder, action) {
    return `<section class="grid-2"><article class="panel"><p class="eyebrow">${title}</p><div class="message-list chat-thread">${messages.map((item) => `<div class="message-card ${item.from}"><div class="message-meta"><strong>${item.title}</strong><span class="small-note">${item.time}</span></div><p class="message-body">${item.body}</p></div>`).join("")}</div><div class="chat-input-shell"><textarea class="prompt-input" rows="4" placeholder="${placeholder}"></textarea><div class="prompt-actions"><button class="primary-btn" data-chat-send="${action}" type="button">发送</button></div></div></article><article class="panel"><p class="eyebrow">提示</p><h3>${action === "teacher" ? "和老师沟通" : "和 AI 沟通"}</h3><p class="profile-meta">${action === "teacher" ? "这部分先保持 demo 交互，不进数据库。" : "AI 会围绕老师标准讲解来回答。"}</p></article></section>`;
  }

  function bind(ctx) {
    ctx.contentEl.querySelectorAll("[data-open-homework]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.view = "student-calendar";
        ctx.state.selectedLessonId = button.dataset.openHomework;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-schedule-confirm]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.confirmSchedule(button.dataset.scheduleConfirm);
      });
    });

    ctx.contentEl.querySelectorAll("[data-schedule-cancel]").forEach((button) => {
      button.addEventListener("click", () => {
        const reason = window.prompt("请输入取消原因");
        if (!reason) return;
        ctx.cancelSchedule(button.dataset.scheduleCancel, button.dataset.cancelRole || "student", reason);
      });
    });

    ctx.contentEl.querySelectorAll("[data-chat-send='ai']").forEach((button) => {
      button.addEventListener("click", () => {
        const input = ctx.contentEl.querySelector(".prompt-input");
        const text = input?.value.trim();
        if (!text) return;
        ctx.state.quizFlow.explainMessages.push({ from: "student", title: "我", time: "刚刚", body: text });
        ctx.state.quizFlow.explainMessages.push({ from: "ai", title: "AI 助手", time: "刚刚", body: `我会围绕这道题的标准讲解回答你：${text}` });
        ctx.renderApp();
      });
    });
  }

  window.StudentShellExperience = {
    renderNews,
    renderChecklist,
    renderMessagePanel,
    bind
  };
})();
