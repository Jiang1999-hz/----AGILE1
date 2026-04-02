(function mountTeacherExperience() {
  function renderTeacherDb(ctx) {
    const student = ctx.selectedStudent();
    const latestHomework = ctx.state.learningRecords?.homework?.[0];
    const pendingSchedules = ctx.scheduleItems().filter((item) => item.status === "pending_student").length;

    return `
      <section class="table-card">
        <div class="teacher-workspace-head">
          <div>
            <p class="eyebrow">Teacher Workspace</p>
            <h3>Students</h3>
          </div>
          <div class="workspace-actions">
            <button class="ghost-btn" data-teacher-open-schedule type="button">查看排课待办</button>
          </div>
        </div>
        <div class="student-table">
          <div class="student-row active">
            <div>
              <strong>${student?.name || "Student 1"}</strong>
              <p>${student?.grade || ""}</p>
            </div>
            <div>
              <strong>${student?.score || "-"}</strong>
              <p>诊断分</p>
            </div>
            <div>
              <strong>${latestHomework?.status || "-"}</strong>
              <p>最近作业</p>
            </div>
            <div>
              <strong>${pendingSchedules}</strong>
              <p>待确认排课</p>
            </div>
            <div class="table-actions">
              <button class="ghost-btn" data-teacher-open-student type="button">查看详情</button>
              <button class="primary-btn" data-teacher-open-schedule type="button">排课</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderTeacherStudent(ctx) {
    const student = ctx.selectedStudent();
    const records = ctx.state.learningRecords || { homework: [] };
    const scheduleSummary = ctx.scheduleItems().slice(0, 3);

    return `
      <section class="grid-2">
        <article class="panel">
          <p class="eyebrow">Student Detail</p>
          <h3>${student?.name || ""}</h3>
          <p class="profile-meta">${student?.summary || ""}</p>
          <div class="todo-list" style="margin-top:16px;">
            ${scheduleSummary.map((item) => `<div class="todo-item"><strong>${item.title}</strong><p>${item.date} ${item.time} / ${item.status}</p></div>`).join("")}
          </div>
          <div class="feedback-toolbar" style="margin-top:12px;">
            <button class="primary-btn" data-teacher-open-schedule type="button">去排课</button>
          </div>
        </article>
        <article class="panel">
          <p class="eyebrow">Homework Feed</p>
          <div class="todo-list">
            ${records.homework.map((item) => `
              <div class="todo-item">
                <strong>${item.title}</strong>
                <p>${item.content || "暂无文字作业内容"}</p>
                <p>${item.teacherNote || "暂无老师点评"}</p>
              </div>
            `).join("")}
          </div>
        </article>
      </section>
    `;
  }

  function renderTeacherAi() {
    return `
      <section class="panel">
        <p class="eyebrow">Teacher AI</p>
        <h3>教学助手</h3>
        <div class="todo-list">
          <div class="todo-item">
            <strong>提示词 1</strong>
            <p>请基于最近 3 次练习结果，给我下一节课的辅导顺序。</p>
          </div>
          <div class="todo-item">
            <strong>提示词 2</strong>
            <p>请把这位学生的情况改写成家长能听懂的一段话。</p>
          </div>
        </div>
      </section>
    `;
  }

  function bind(ctx) {
    ctx.contentEl.querySelectorAll("[data-teacher-open-student]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.view = "teacher-student";
        ctx.renderApp();
      });
    });

    ctx.contentEl.querySelectorAll("[data-teacher-open-schedule]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.state.view = "teacher-schedule";
        ctx.renderApp();
      });
    });
  }

  window.TeacherExperience = {
    renderTeacherDb,
    renderTeacherStudent,
    renderTeacherAi,
    bind
  };
})();
