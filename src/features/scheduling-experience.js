(function mountSchedulingExperience() {
  function statusLabel(status) {
    switch (status) {
      case "pending_student": return "待学生确认";
      case "confirmed": return "已确认";
      case "cancelled_by_student": return "学生已取消";
      case "cancelled_by_teacher": return "老师已取消";
      default: return status || "待处理";
    }
  }

  function renderTeacherSchedule(ctx) {
    const draft = ctx.state.scheduleDemo?.draft || {};
    const items = ctx.scheduleItems();

    return `
      <section class="grid-2">
        <article class="panel">
          <p class="eyebrow">Create Schedule</p>
          <h3>发起 1v1 排课</h3>
          <div class="homework-entry">
            <label class="review-field">
              <span>课程标题</span>
              <input class="feedback-input" data-schedule-draft="title" value="${draft.title || ""}">
            </label>
            <div class="review-grid">
              <label class="review-field">
                <span>日期</span>
                <input class="feedback-input" data-schedule-draft="date" value="${draft.date || ""}">
              </label>
              <label class="review-field">
                <span>时间</span>
                <input class="feedback-input" data-schedule-draft="time" value="${draft.time || ""}">
              </label>
            </div>
            <label class="review-field">
              <span>上课方式</span>
              <input class="feedback-input" data-schedule-draft="location" value="${draft.location || ""}">
            </label>
            <label class="review-field">
              <span>备注</span>
              <textarea class="feedback-input" data-schedule-draft="notes">${draft.notes || ""}</textarea>
            </label>
            <div class="feedback-toolbar">
              <button class="primary-btn" data-create-schedule type="button">发给学生确认</button>
            </div>
          </div>
        </article>
        <article class="panel">
          <p class="eyebrow">Schedule Queue</p>
          <h3>排课事项</h3>
          <div class="todo-list">
            ${items.map((item) => `
              <div class="todo-item">
                <strong>${item.title}</strong>
                <p>${item.date} ${item.time} / ${item.location}</p>
                <p>${statusLabel(item.status)}</p>
                ${item.cancelReason ? `<p>取消原因：${item.cancelReason}</p>` : ""}
                <div class="feedback-toolbar" style="margin-top:12px;">
                  ${item.status === "pending_student" || item.status === "confirmed" ? `<button class="ghost-btn" data-schedule-cancel="${item.id}" data-cancel-role="teacher" type="button">老师取消</button>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </article>
      </section>
    `;
  }

  function bind(ctx) {
    ctx.contentEl.querySelectorAll("[data-schedule-draft]").forEach((input) => {
      input.addEventListener("input", () => {
        ctx.updateScheduleDraft(input.dataset.scheduleDraft, input.value);
      });
    });

    ctx.contentEl.querySelectorAll("[data-create-schedule]").forEach((button) => {
      button.addEventListener("click", () => {
        ctx.createSchedule();
      });
    });

    ctx.contentEl.querySelectorAll("[data-schedule-cancel]").forEach((button) => {
      button.addEventListener("click", () => {
        const reason = window.prompt("请输入取消原因");
        if (!reason) return;
        ctx.cancelSchedule(button.dataset.scheduleCancel, button.dataset.cancelRole || "teacher", reason);
      });
    });
  }

  window.SchedulingExperience = {
    renderTeacherSchedule,
    bind
  };
})();
