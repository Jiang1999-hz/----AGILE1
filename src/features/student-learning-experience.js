(function mountStudentLearningExperience() {
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function splitAnswerParts(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function renderLabeledAnswer(blankLabels, value) {
    const labels = Array.isArray(blankLabels) ? blankLabels : [];
    if (!labels.length) {
      return `<strong>${escapeHtml(value || "未作答")}</strong>`;
    }

    const parts = splitAnswerParts(value);
    return `
      <div class="quiz-answer-badges">
        ${labels.map((label, index) => `
          <div class="quiz-answer-badge">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(parts[index] || "-")}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function subjectLabel(ctx, subjectId) {
    return ctx.quizCatalog?.subjects?.find((item) => item.id === subjectId)?.label || subjectId || "未知科目";
  }

  function questionTypeLabel(type) {
    if (type === "choice") return "选择题";
    if (type === "text") return "填空题";
    return type || "未知题型";
  }

  function formatDateLabel(value) {
    if (!value) return "刚刚";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function summarizePrompt(html) {
    return String(html || "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function filterWrongBookItems(state) {
    const filters = state.wrongBookFilters || {};
    const filtered = (state.learningRecords?.wrongBook || []).filter((item) => {
      if (!filters.includeMastered && item.isMastered) return false;
      if (filters.subjectId && filters.subjectId !== "all" && item.subjectId !== filters.subjectId) return false;
      if (filters.questionType && filters.questionType !== "all" && item.questionType !== filters.questionType) return false;
      if (filters.knowledgePointId && filters.knowledgePointId !== "all") {
        const ids = [item.primaryKnowledgePointId].concat(item.secondaryKnowledgePointIds || []).filter(Boolean);
        if (!ids.includes(filters.knowledgePointId)) return false;
      }
      if (filters.frequency === "high" && item.wrongCount < 3) return false;
      if (filters.frequency === "medium" && (item.wrongCount < 2 || item.wrongCount >= 3)) return false;
      if (filters.frequency === "once" && item.wrongCount !== 1) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      if (filters.sortBy === "frequency") {
        if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
        return new Date(b.lastWrongAt) - new Date(a.lastWrongAt);
      }
      if (filters.sortBy === "mastery") {
        if (a.isMastered !== b.isMastered) return Number(a.isMastered) - Number(b.isMastered);
        return new Date(b.lastWrongAt) - new Date(a.lastWrongAt);
      }
      return new Date(b.lastWrongAt) - new Date(a.lastWrongAt);
    });
  }

  function wrongBookFilterOptions(state) {
    const items = state.learningRecords?.wrongBook || [];
    const subjects = [...new Set(items.map((item) => item.subjectId).filter(Boolean))];
    const types = [...new Set(items.map((item) => item.questionType).filter(Boolean))];
    const points = new Map();
    items.forEach((item) => {
      if (item.primaryKnowledgePointId && item.primaryKnowledgePointLabel) {
        points.set(item.primaryKnowledgePointId, item.primaryKnowledgePointLabel);
      }
      (item.secondaryKnowledgePointIds || []).forEach((id, index) => {
        const label = item.secondaryKnowledgePointLabels?.[index];
        if (id && label) points.set(id, label);
      });
    });
    return { subjects, types, points: [...points.entries()] };
  }

  function renderCalendar(ctx) {
    const course = ctx.selectedCourse();
    const currentLesson = ctx.selectedLesson();
    const courseLessons = course ? ctx.lessons().filter((item) => course.lessonIds.includes(item.id)) : [];
    const lessonHomework = currentLesson ? ctx.getLessonHomework(currentLesson.id) : null;

    return `
      <section class="course-flow-layout">
        <article class="panel">
          <div class="panel-head"><div><p class="eyebrow">Programs</p><h3>我的课程</h3></div></div>
          <div class="course-program-list">
            ${ctx.courses().map((item) => `<button class="course-program-card ${course?.id === item.id ? "active" : ""}" data-course-id="${item.id}" type="button"><div class="panel-head"><div><p class="eyebrow">${item.subject}</p><h4>${item.title}</h4></div><span class="tag">${item.completedLessons}/${item.totalLessons}</span></div><div class="course-progress-bar"><i style="width:${ctx.courseProgress(item)}%"></i></div><div class="course-meta-list"><div class="section-row"><strong>进度</strong><span>${ctx.courseProgress(item)}%</span></div><div class="section-row"><strong>下节课</strong><span>${item.nextLesson}</span></div></div></button>`).join("")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head"><div><p class="eyebrow">Lessons</p><h3>${course?.title || "课程日历"}</h3></div></div>
          <div class="calendar-board">
            ${courseLessons.map((item) => `<button class="lesson-card ${currentLesson?.id === item.id ? "active" : ""}" data-lesson-id="${item.id}" type="button"><span>${item.weekday}</span><strong>${item.date}</strong><p>${item.title}</p><small>${item.time}</small></button>`).join("")}
          </div>
        </article>
        <article class="panel">
          ${currentLesson ? `
            <div class="panel-head"><div><p class="eyebrow">Lesson Detail</p><h3>${currentLesson.title}</h3></div><span class="tag">${currentLesson.date} ${currentLesson.time}</span></div>
            <div class="profile-section">
              <div class="section-row"><strong>PPT</strong><span>${currentLesson.ppt}</span></div>
              <div class="section-row"><strong>课堂笔记</strong><span>${currentLesson.notes}</span></div>
            </div>
            <div class="todo-list" style="margin-top:16px;">
              <div class="todo-item"><strong>重难点</strong><p>${currentLesson.highlights.join(" / ")}</p></div>
              <div class="todo-item"><strong>易错点</strong><p>${currentLesson.mistakes.join(" / ")}</p></div>
              ${lessonHomework?.teacherNote ? `<div class="todo-item"><strong>老师点评</strong><p>${lessonHomework.teacherNote}</p></div>` : ""}
            </div>
            ${currentLesson.requiresHomework ? `
              <div class="feedback-box" style="margin-top:16px;">
                <p class="eyebrow">Homework Submission</p>
                <textarea class="feedback-input" id="lesson-homework-input" data-lesson-homework-input="${currentLesson.id}" placeholder="填写本节课课后作业">${ctx.state.homeworkDrafts[currentLesson.id] ?? lessonHomework?.content ?? ""}</textarea>
                <div class="feedback-toolbar" style="margin-top:12px;">
                  <button class="primary-btn" data-submit-homework="${currentLesson.id}" type="button">${ctx.state.loading ? "提交中..." : "提交课后作业"}</button>
                </div>
              </div>
            ` : `<div class="todo-item" style="margin-top:16px;"><strong>无作业</strong><p>这节课没有布置课后作业。</p></div>`}
          ` : `<h3>请选择一节课</h3>`}
        </article>
      </section>
    `;
  }

  function renderProgress(ctx) {
    const student = ctx.selectedStudent();
    const records = ctx.state.learningRecords || { homework: [], quizHistory: [], progress: [] };

    return `
      <section class="student-dashboard">
        <article class="panel"><p class="eyebrow">Summary</p><h3>${student?.goal || ""}</h3><p class="profile-meta">${student?.summary || ""}</p></article>
        <article class="panel"><p class="eyebrow">Progress</p><h3>最近进度</h3><div class="sparkline">${records.progress.map((value) => `<i style="height:${Math.max(18, value * 0.8)}px"></i>`).join("")}</div></article>
        <article class="panel"><p class="eyebrow">Parent Summary</p><h3>家长摘要</h3><p class="profile-meta">${student?.parentNote || ""}</p></article>
      </section>
      <section class="grid-2" style="margin-top:18px;">
        <article class="panel"><p class="eyebrow">Homework</p><h3>作业记录</h3><div class="todo-list">${records.homework.map((item) => `<div class="todo-item"><strong>${item.title}</strong><p>${item.status} / ${item.score ?? "待评分"} / ${item.teacherNote || "暂无点评"}</p></div>`).join("")}</div></article>
        <article class="panel"><p class="eyebrow">Quiz History</p><h3>做题记录</h3><div class="todo-list">${records.quizHistory.slice().reverse().map((item) => `<div class="todo-item"><strong>${item.name}</strong><p>${item.date} / ${item.score}</p></div>`).join("")}</div></article>
      </section>
    `;
  }

  function renderWrongBook(ctx) {
    const filters = ctx.state.wrongBookFilters || {};
    const items = filterWrongBookItems(ctx.state);
    const allItems = ctx.state.learningRecords?.wrongBook || [];
    const options = wrongBookFilterOptions(ctx.state);
    const activeCount = allItems.filter((item) => !item.isMastered).length;
    const masteredCount = allItems.filter((item) => item.isMastered).length;

    return `
      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Wrong Book</p>
            <h3>错题本</h3>
          </div>
          <div class="lesson-stats">
            <span class="tag">待复盘 ${activeCount}</span>
            <span class="tag">已掌握 ${masteredCount}</span>
          </div>
        </div>
        <p class="profile-meta">先按条件筛选，再从下面的一行行题目简述里挑要复盘的题。点进去后直接进入单题复盘，不在这里把整题全部摊开。</p>
        <div class="wrongbook-filter-grid">
          <label class="wrongbook-filter-field">
            <span>科目</span>
            <select data-wrongbook-filter="subjectId">
              <option value="all">全部</option>
              ${options.subjects.map((id) => `<option value="${escapeHtml(id)}" ${filters.subjectId === id ? "selected" : ""}>${escapeHtml(id)}</option>`).join("")}
            </select>
          </label>
          <label class="wrongbook-filter-field">
            <span>题型</span>
            <select data-wrongbook-filter="questionType">
              <option value="all">全部</option>
              ${options.types.map((id) => `<option value="${escapeHtml(id)}" ${filters.questionType === id ? "selected" : ""}>${escapeHtml(id)}</option>`).join("")}
            </select>
          </label>
          <label class="wrongbook-filter-field">
            <span>错误频次</span>
            <select data-wrongbook-filter="frequency">
              <option value="all" ${filters.frequency === "all" ? "selected" : ""}>全部</option>
              <option value="high" ${filters.frequency === "high" ? "selected" : ""}>3 次及以上</option>
              <option value="medium" ${filters.frequency === "medium" ? "selected" : ""}>2 次</option>
              <option value="once" ${filters.frequency === "once" ? "selected" : ""}>1 次</option>
            </select>
          </label>
          <label class="wrongbook-filter-field">
            <span>排序</span>
            <select data-wrongbook-filter="sortBy">
              <option value="recent" ${filters.sortBy === "recent" ? "selected" : ""}>最近做错</option>
              <option value="frequency" ${filters.sortBy === "frequency" ? "selected" : ""}>错误次数最多</option>
              <option value="mastery" ${filters.sortBy === "mastery" ? "selected" : ""}>先看未掌握</option>
            </select>
          </label>
          <label class="wrongbook-filter-field">
            <span>知识点</span>
            <select data-wrongbook-filter="knowledgePointId">
              <option value="all">全部</option>
              ${options.points.map(([id, label]) => `<option value="${escapeHtml(id)}" ${filters.knowledgePointId === id ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
            </select>
          </label>
          <label class="wrongbook-filter-check">
            <input type="checkbox" data-wrongbook-toggle="includeMastered" ${filters.includeMastered ? "checked" : ""}>
            <span>显示已掌握</span>
          </label>
        </div>
      </section>
      <section class="wrongbook-list-shell" style="margin-top:18px;">
        ${items.length ? items.map((item) => `
          <article class="panel wrongbook-card wrongbook-row ${item.isMastered ? "is-mastered" : ""}">
            <div class="wrongbook-row-main">
              <div class="wrongbook-row-topline">
                <div>
                  <p class="eyebrow">${escapeHtml(item.questionId)}</p>
                  <h4>${escapeHtml(item.primaryKnowledgePointLabel || "未分类知识点")}</h4>
                </div>
                <div class="lesson-stats">
                  <span class="tag">错 ${item.wrongCount} 次</span>
                  <span class="tag">${questionTypeLabel(item.questionType)}</span>
                  ${item.isMastered ? `<span class="tag">已掌握</span>` : ""}
                </div>
              </div>
              <p class="wrongbook-row-summary">${escapeHtml(summarizePrompt(item.prompt).slice(0, 120) || "这道题的题干摘要暂时不可用。")}${summarizePrompt(item.prompt).length > 120 ? "..." : ""}</p>
              <div class="wrongbook-row-meta">
                <span>科目：${escapeHtml(subjectLabel(ctx, item.subjectId))}</span>
                <span>最近做错：${escapeHtml(formatDateLabel(item.lastWrongAt))}</span>
                <span>辅助知识点：${escapeHtml((item.secondaryKnowledgePointLabels || []).join(" / ") || "无")}</span>
              </div>
            </div>
            <div class="wrongbook-row-actions">
              <button class="primary-btn" data-wrongbook-open-quiz="${escapeHtml(item.questionId)}" type="button">进入单题复盘</button>
              ${!item.isMastered ? `<button class="ghost-btn" data-wrongbook-mastered="${escapeHtml(item.questionId)}" type="button">标记已掌握</button>` : ""}
            </div>
          </article>
        `).join("") : `<section class="panel"><h3>当前筛选条件下没有错题</h3><p class="profile-meta">继续做题后，答错的题会自动收录到这里。</p></section>`}
      </section>
    `;
  }

  function bind(ctx) {
    ctx.contentEl.querySelectorAll("[data-open-homework]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.view = "student-calendar";
        ctx.state.selectedLessonId = button.dataset.openHomework;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-course-id]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.selectedCourseId = button.dataset.courseId;
        ctx.state.selectedLessonId = ctx.selectedCourse()?.lessonIds?.[0] || null;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-lesson-id]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.selectedLessonId = button.dataset.lessonId;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-lesson-homework-input]").forEach((input) => {
      input.addEventListener("input", () => {
        ctx.state.homeworkDrafts[input.dataset.lessonHomeworkInput] = input.value;
      });
    });

    ctx.contentEl.querySelectorAll("[data-submit-homework]").forEach((button) => {
      button.addEventListener("click", () => ctx.submitHomework(button.dataset.submitHomework));
    });

    ctx.contentEl.querySelectorAll("[data-wrongbook-filter]").forEach((input) => {
      input.addEventListener("change", () => {
        ctx.state.wrongBookFilters[input.dataset.wrongbookFilter] = input.value;
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-wrongbook-toggle]").forEach((input) => {
      input.addEventListener("change", () => {
        ctx.state.wrongBookFilters[input.dataset.wrongbookToggle] = Boolean(input.checked);
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-wrongbook-mastered]").forEach((button) => {
      button.addEventListener("click", () => ctx.markWrongBookMastered?.(button.dataset.wrongbookMastered));
    });

    ctx.contentEl.querySelectorAll("[data-wrongbook-open-quiz]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.openWrongBookReview?.(button.dataset.wrongbookOpenQuiz);
      });
    });
  }

  window.StudentLearningExperience = {
    renderCalendar,
    renderWrongBook,
    renderProgress,
    bind
  };
})();
