(function mountAdminExperience() {
  function renderAdminDashboard() {
    return `
      <section class="metric-grid">
        <article class="metric-card">
          <span>题库方向</span>
          <strong>Admin 录入</strong>
          <small>老师不再维护题库</small>
        </article>
        <article class="metric-card">
          <span>当前重点</span>
          <strong>学生做题流</strong>
          <small>先把练习与讲解闭环打磨好</small>
        </article>
        <article class="metric-card">
          <span>演示状态</span>
          <strong>可继续迭代</strong>
          <small>适合继续往 admin 工具补功能</small>
        </article>
      </section>
    `;
  }

  function renderAdminSettings() {
    return `
      <section class="panel">
        <h3>系统设置</h3>
        <p class="profile-meta">后续可以在这里做题库录入、角色配置、素材管理等。</p>
      </section>
    `;
  }

  window.AdminExperience = {
    renderAdminDashboard,
    renderAdminSettings
  };
})();
