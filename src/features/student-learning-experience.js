(function mountStudentLearningExperience() {
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
  }

  window.StudentLearningExperience = {
    renderCalendar,
    renderProgress,
    bind
  };
})();
