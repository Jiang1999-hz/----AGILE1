const state = {
  role: null,
  view: "news",
  selectedCourseId: null,
  selectedLessonId: null,
  studentOverview: null,
  learningRecords: null,
  quizCatalog: null,
  quizFlow: {
    subjectId: null,
    topicId: null,
    levelId: null,
    questions: [],
    review: null,
    reviewSource: null,
    submittedAnswers: {},
    selectedQuestionId: null,
    explainDraft: "",
    explainMessages: [],
    aiThreads: {},
    aiErrorByQuestion: {},
    aiStreamingQuestionId: null
  },
  wrongBookFilters: {
    subjectId: "all",
    questionType: "all",
    frequency: "all",
    knowledgePointId: "all",
    includeMastered: false,
    sortBy: "recent"
  },
  loading: false,
  toast: null,
  homeworkDrafts: {},
  seenHomeworkIds: {},
  scheduleDemo: {
    items: [
      {
        id: "schedule-1",
        studentId: "1",
        title: "1v1 数学辅导",
        date: "2026-04-05",
        time: "19:00-20:00",
        location: "在线 Zoom",
        notes: "围绕最近一次函数错题讲解做复盘。",
        status: "pending_student",
        createdBy: "teacher",
        cancelReason: ""
      }
    ],
    draft: {
      title: "1v1 跟进辅导",
      date: "2026-04-08",
      time: "18:30-19:30",
      location: "线上会议室",
      notes: "根据最近练习结果补强薄弱点。"
    }
  }
};

const navByRole = {
  student: [
    { id: "news", label: "塾 News" },
    { id: "student-inbox", label: "Checklist" },
    { id: "student-calendar", label: "课程日历" },
    { id: "student-quiz", label: "在线做题" },
    { id: "student-wrongbook", label: "错题本" },
    { id: "student-progress", label: "我的学习情况" },
    { id: "student-teacher", label: "和老师沟通" },
    { id: "student-ai", label: "和 AI 沟通" }
  ],
  teacher: [
    { id: "news", label: "塾 News" },
    { id: "teacher-db", label: "学生数据库" },
    { id: "teacher-student", label: "学生详情" },
    { id: "teacher-schedule", label: "排课管理" },
    { id: "teacher-ai", label: "教学助手" }
  ],
  admin: [
    { id: "news", label: "塾 News" },
    { id: "admin-dashboard", label: "经营概览" },
    { id: "admin-settings", label: "系统设置" }
  ]
};

const pageTitles = {
  news: "塾 News",
  "student-inbox": "Checklist",
  "student-calendar": "课程日历",
  "student-quiz": "在线做题",
  "student-wrongbook": "错题本",
  "student-progress": "我的学习情况",
  "student-teacher": "和老师沟通",
  "student-ai": "和 AI 沟通",
  "teacher-db": "学生数据库",
  "teacher-student": "学生详情",
  "teacher-schedule": "排课管理",
  "teacher-ai": "教学助手",
  "admin-dashboard": "经营概览",
  "admin-settings": "系统设置"
};

const demoAccounts = {
  student: { name: "学生 Demo", roleLabel: "学生", defaultView: "news" },
  teacher: { name: "老师 Demo", roleLabel: "老师", defaultView: "news" },
  admin: { name: "Admin Demo", roleLabel: "管理员", defaultView: "news" }
};

const studentChatMessages = [
  { from: "teacher", title: "老师", time: "刚刚", body: "今天做题后，先看老师标准讲解，再问不懂的地方。" },
  { from: "student", title: "我", time: "刚刚", body: "明白，我先把错题复盘一下。" }
];

const aiChatMessages = [
  { from: "ai", title: "AI 助手", time: "刚刚", body: "我会围绕当前题目的标准讲解来回答，不会直接跳开讲别的。" }
];

const loginScreen = document.getElementById("login-screen");
const appShell = document.getElementById("app-shell");
const navEl = document.getElementById("sidebar-nav");
const contentEl = document.getElementById("app-content");

function selectedStudent() {
  return state.studentOverview?.student || null;
}

function courses() {
  return state.studentOverview?.courses || [];
}

function lessons() {
  return state.studentOverview?.lessons || [];
}

function selectedCourse() {
  return courses().find((item) => item.id === state.selectedCourseId) || courses()[0] || null;
}

function selectedLesson() {
  const course = selectedCourse();
  if (!course) return null;
  const courseLessons = lessons().filter((lesson) => course.lessonIds.includes(lesson.id));
  return courseLessons.find((item) => item.id === state.selectedLessonId) || courseLessons[0] || null;
}

function unreadHomeworkCount() {
  return (state.learningRecords?.homework || []).filter((item) => item.teacherNote && !state.seenHomeworkIds[item.id]).length;
}

function scheduleItems() {
  return state.scheduleDemo.items || [];
}

function studentScheduleItems() {
  return scheduleItems().filter((item) => item.studentId === "1");
}

function checklistCount() {
  const homeworkCount = unreadHomeworkCount();
  const scheduleCount = studentScheduleItems().filter((item) => item.status === "pending_student").length;
  return homeworkCount + scheduleCount;
}

function getLessonHomework(lessonId) {
  return (state.learningRecords?.homework || []).find((item) => item.lessonId === lessonId) || null;
}

function courseProgress(course) {
  if (!course || !course.totalLessons) return 0;
  return Math.round((course.completedLessons / course.totalLessons) * 100);
}

function showToast(type, message) {
  state.toast = { type, message };
  renderApp();
  setTimeout(() => {
    if (state.toast?.message === message) {
      state.toast = null;
      renderApp();
    }
  }, 2200);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Request failed: ${url}`);
  return response.json();
}

async function loadStudentData() {
  state.loading = true;
  renderApp();
  try {
    const payload = await fetchJson("/api/student/1/bootstrap");
    state.studentOverview = payload.overview;
    state.learningRecords = payload.learningRecords;
    state.quizCatalog = payload.quizCatalog;
    state.selectedCourseId = payload.overview.courses?.[0]?.id || null;
    state.selectedLessonId = payload.overview.courses?.[0]?.lessonIds?.[0] || null;
  } catch (error) {
    showToast("error", "学生数据加载失败");
  } finally {
    state.loading = false;
    renderApp();
  }
}

function quizSubject() {
  return (state.quizCatalog?.subjects || []).find((item) => item.id === state.quizFlow.subjectId) || null;
}

function quizTopic() {
  return quizSubject()?.topics.find((item) => item.id === state.quizFlow.topicId) || null;
}

function quizLevel() {
  return (state.quizCatalog?.levels || []).find((item) => item.id === state.quizFlow.levelId) || null;
}

function resetQuizAiState() {
  state.quizFlow.explainDraft = "";
  state.quizFlow.explainMessages = [];
  state.quizFlow.aiThreads = {};
  state.quizFlow.aiErrorByQuestion = {};
  state.quizFlow.aiStreamingQuestionId = null;
}

function selectedReviewQuestion() {
  return state.quizFlow.review?.questions?.find((item) => item.id === state.quizFlow.selectedQuestionId)
    || state.quizFlow.review?.questions?.[0]
    || null;
}

function resetQuizFlow(from = "subject") {
  if (from === "subject") state.quizFlow.subjectId = null;
  if (from === "subject" || from === "topic") state.quizFlow.topicId = null;
  if (from === "subject" || from === "topic" || from === "level") state.quizFlow.levelId = null;
  state.quizFlow.questions = [];
  state.quizFlow.review = null;
  state.quizFlow.reviewSource = null;
  state.quizFlow.submittedAnswers = {};
  state.quizFlow.selectedQuestionId = null;
  resetQuizAiState();
}

async function startQuizSession() {
  if (!state.quizFlow.subjectId || !state.quizFlow.topicId || !state.quizFlow.levelId) return;
  state.loading = true;
  renderApp();
  try {
    const payload = await fetchJson("/api/quiz/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId: state.quizFlow.subjectId,
        topicId: state.quizFlow.topicId,
        levelId: state.quizFlow.levelId,
        count: 5
      })
    });
    state.quizFlow.questions = payload.questions || [];
    state.quizFlow.review = null;
    state.quizFlow.submittedAnswers = {};
    state.quizFlow.selectedQuestionId = null;
    resetQuizAiState();
  } catch (error) {
    showToast("error", "题目加载失败");
  } finally {
    state.loading = false;
    renderApp();
  }
}

async function submitQuizSession() {
  const answers = {};
  const form = document.getElementById("student-quiz-form");
  if (!form || !state.quizFlow.questions.length) return;
  const formData = new FormData(form);
  state.quizFlow.questions.forEach((question) => {
    if (question.type === "text" && Array.isArray(question.blankLabels) && question.blankLabels.length) {
      const parts = Array.from(form.querySelectorAll(`[data-blank-question="${question.id}"]`))
        .sort((a, b) => Number(a.dataset.blankIndex) - Number(b.dataset.blankIndex))
        .map((input) => input.value.trim());
      answers[question.id] = parts.join(",");
      return;
    }

    answers[question.id] = (formData.get(question.id) || "").toString();
  });

  state.loading = true;
  renderApp();
  try {
    state.quizFlow.submittedAnswers = answers;
    const payload = await fetchJson("/api/student/1/quiz-session-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionIds: state.quizFlow.questions.map((item) => item.id),
        answers,
        sessionMeta: {
          subjectLabel: quizSubject()?.label,
          topicLabel: quizTopic()?.label,
          levelLabel: quizLevel()?.label
        }
      })
    });
    state.studentOverview = payload.overview;
    state.learningRecords = payload.learningRecords;
    state.quizFlow.review = payload.review || null;
    state.quizFlow.reviewSource = "quiz-session";
    state.quizFlow.selectedQuestionId = payload.review?.questions?.[0]?.id || null;
    resetQuizAiState();
    showToast("success", "练习结果已保存");
  } catch (error) {
    showToast("error", "练习结果提交失败");
  } finally {
    state.loading = false;
    renderApp();
  }
}

async function sendQuizFollowUp(userMessage) {
  const text = String(userMessage || "").trim();
  const question = selectedReviewQuestion();
  if (!question || !text) return;

  const questionId = question.id;
  if (state.quizFlow.aiStreamingQuestionId === questionId) return;

  const existingThread = state.quizFlow.aiThreads[questionId] || [];
  const conversation = existingThread.map((item) => ({
    role: item.role,
    content: item.body
  }));

  const nextThread = [
    ...existingThread,
    { role: "user", from: "student", title: "我", time: "刚刚", body: text },
    { role: "assistant", from: "ai", title: "AI 助手", time: "思考中", body: "" }
  ];

  state.quizFlow.aiThreads[questionId] = nextThread;
  state.quizFlow.aiErrorByQuestion[questionId] = "";
  state.quizFlow.aiStreamingQuestionId = questionId;
  renderApp();

  try {
    const response = await fetch("/api/student/1/quiz-followup-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        conversation,
        userMessage: text
      })
    });

    if (!response.ok || !response.body) {
      throw new Error("AI 请求失败");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      const thread = state.quizFlow.aiThreads[questionId];
      if (thread?.length) {
        thread[thread.length - 1].body = assistantText;
        thread[thread.length - 1].time = "刚刚";
        renderApp();
      }
    }

    const finalText = assistantText.trim() || "我这次没有成功生成讲解，你可以换一种问法再试一次。";
    const thread = state.quizFlow.aiThreads[questionId];
    if (thread?.length) {
      thread[thread.length - 1].body = finalText;
      thread[thread.length - 1].time = "刚刚";
    }
  } catch (error) {
    state.quizFlow.aiErrorByQuestion[questionId] = error.message || "AI 服务暂时不可用";
    const thread = state.quizFlow.aiThreads[questionId];
    if (thread?.length && thread[thread.length - 1].role === "assistant" && !thread[thread.length - 1].body) {
      thread.pop();
    }
  } finally {
    state.quizFlow.aiStreamingQuestionId = null;
    renderApp();
  }
}

async function submitHomework(lessonId) {
  const content = (state.homeworkDrafts[lessonId] || "").trim();
  if (!content) {
    showToast("error", "请先填写课后作业内容");
    return;
  }
  state.loading = true;
  renderApp();
  try {
    const payload = await fetchJson(`/api/student/1/lessons/${lessonId}/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    state.studentOverview = payload.overview;
    state.learningRecords = payload.learningRecords;
    state.homeworkDrafts[lessonId] = "";
    showToast("success", "课后作业已提交");
  } catch (error) {
    showToast("error", "课后作业提交失败");
  } finally {
    state.loading = false;
    renderApp();
  }
}

async function markWrongBookMastered(questionId) {
  if (!questionId) return;
  state.loading = true;
  renderApp();
  try {
    const payload = await fetchJson(`/api/student/1/wrongbook/${encodeURIComponent(questionId)}/mastered`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    state.studentOverview = payload.overview;
    state.learningRecords = payload.learningRecords;
    showToast("success", "已标记为掌握");
  } catch (error) {
    showToast("error", "错题本更新失败");
  } finally {
    state.loading = false;
    renderApp();
  }
}

function openWrongBookReview(questionId) {
  const item = (state.learningRecords?.wrongBook || []).find((entry) => entry.questionId === questionId);
  if (!item) {
    showToast("error", "没找到这道错题");
    return;
  }

  state.quizFlow.questions = [];
  state.quizFlow.review = {
    correctCount: 0,
    wrongCount: 1,
    questions: [
      {
        id: item.questionId,
        question: item.prompt,
        type: item.questionType,
        blankLabels: item.blankLabels || [],
        studentAnswer: item.lastStudentAnswer || "",
        correctAnswer: item.answer || "",
        correct: false,
        explanation: item.explanation || null
      }
    ]
  };
  state.quizFlow.reviewSource = "wrongbook";
  state.quizFlow.submittedAnswers = {
    [item.questionId]: item.lastStudentAnswer || ""
  };
  state.quizFlow.selectedQuestionId = item.questionId;
  resetQuizAiState();
  state.view = "student-quiz";
  renderApp();
}

function leaveQuizReview() {
  if (state.quizFlow.reviewSource === "wrongbook") {
    resetQuizAiState();
    state.quizFlow.review = null;
    state.quizFlow.reviewSource = null;
    state.quizFlow.selectedQuestionId = null;
    state.view = "student-wrongbook";
    renderApp();
    return;
  }

  resetQuizFlow("level");
  renderApp();
}

function renderToast() {
  if (!state.toast) return "";
  const cls = state.toast.type === "error" ? "student-toast-error" : "student-toast-success";
  return `<div class="student-toast-wrap"><div class="student-toast ${cls}"><p>${state.toast.message}</p></div></div>`;
}

function renderNav() {
  const items = navByRole[state.role] || [];
  navEl.innerHTML = items.map((item) => `<button class="nav-item ${state.view === item.id ? "active" : ""}" data-view="${item.id}" type="button">${item.label}</button>`).join("");
}

function renderHeader() {
  const account = demoAccounts[state.role];
  const checklist = checklistCount();
  document.getElementById("account-name").textContent = account.name;
  document.getElementById("account-role").textContent = account.roleLabel;
  document.getElementById("page-title").textContent = pageTitles[state.view] || "Juku AI Cloud";
  document.getElementById("role-badge").textContent = checklist ? `${account.roleLabel} / ${checklist} 条待看` : account.roleLabel;
  document.getElementById("open-checklist-btn").style.display = state.role === "student" ? "inline-flex" : "none";
  document.getElementById("open-checklist-btn").textContent = checklist ? `Checklist ${checklist}` : "Checklist";
}

function studentShellExperience() {
  return window.StudentShellExperience || {};
}

function studentLearningExperience() {
  return window.StudentLearningExperience || {};
}

function studentQuizExperience() {
  return window.StudentQuizExperience || {};
}

function teacherExperience() {
  return window.TeacherExperience || {};
}

function adminExperience() {
  return window.AdminExperience || {};
}

function schedulingExperience() {
  return window.SchedulingExperience || {};
}

function updateScheduleDraft(field, value) {
  state.scheduleDemo.draft[field] = value;
}

function createSchedule() {
  const draft = state.scheduleDemo.draft;
  if (!draft.title || !draft.date || !draft.time) {
    showToast("error", "请先填写完整的排课信息");
    return;
  }

  state.scheduleDemo.items.unshift({
    id: `schedule-${Date.now()}`,
    studentId: "1",
    title: draft.title,
    date: draft.date,
    time: draft.time,
    location: draft.location || "线上",
    notes: draft.notes || "",
    status: "pending_student",
    createdBy: "teacher",
    cancelReason: ""
  });

  state.view = "teacher-schedule";
  showToast("success", "排课已发给学生确认");
  renderApp();
}

function confirmSchedule(scheduleId) {
  const item = scheduleItems().find((entry) => entry.id === scheduleId);
  if (!item) return;
  item.status = "confirmed";
  item.cancelReason = "";
  showToast("success", "你已确认这节 1v1 课程");
  renderApp();
}

function cancelSchedule(scheduleId, by, reason) {
  const item = scheduleItems().find((entry) => entry.id === scheduleId);
  if (!item) return;
  item.status = by === "student" ? "cancelled_by_student" : "cancelled_by_teacher";
  item.cancelReason = reason || "";
  showToast("success", by === "student" ? "你已取消这节课程" : "老师已取消这节课程");
  renderApp();
}

function renderCurrentView() {
  switch (state.view) {
    case "student-inbox": return studentShellExperience().renderChecklist?.({ state }) || `<section class="panel"><h3>Student shell module not loaded</h3></section>`;
    case "student-calendar": return studentLearningExperience().renderCalendar?.({ state, courses, lessons, selectedCourse, selectedLesson, getLessonHomework, courseProgress }) || `<section class="panel"><h3>Student learning module not loaded</h3></section>`;
    case "student-quiz": return studentQuizExperience().render?.({ state, quizSubject, quizTopic, quizLevel }) || `<section class="panel"><h3>Student quiz module not loaded</h3></section>`;
    case "student-wrongbook": return studentLearningExperience().renderWrongBook?.({ state }) || `<section class="panel"><h3>Student learning module not loaded</h3></section>`;
    case "student-progress": return studentLearningExperience().renderProgress?.({ state, selectedStudent }) || `<section class="panel"><h3>Student learning module not loaded</h3></section>`;
    case "student-teacher": return studentShellExperience().renderMessagePanel?.("Teacher Chat", studentChatMessages, "输入想问老师的话", "teacher") || `<section class="panel"><h3>Student shell module not loaded</h3></section>`;
    case "student-ai": return studentShellExperience().renderMessagePanel?.("AI Chat", aiChatMessages.concat(state.quizFlow.explainMessages), "例如：第 2 步为什么这样做？", "ai") || `<section class="panel"><h3>Student shell module not loaded</h3></section>`;
    case "teacher-db": return teacherExperience().renderTeacherDb?.({ state, selectedStudent, scheduleItems }) || `<section class="panel"><h3>Teacher module not loaded</h3></section>`;
    case "teacher-student": return teacherExperience().renderTeacherStudent?.({ state, selectedStudent, scheduleItems }) || `<section class="panel"><h3>Teacher module not loaded</h3></section>`;
    case "teacher-schedule": return schedulingExperience().renderTeacherSchedule?.({ state, selectedStudent, scheduleItems }) || `<section class="panel"><h3>Scheduling module not loaded</h3></section>`;
    case "teacher-ai": return teacherExperience().renderTeacherAi?.({ state, selectedStudent }) || `<section class="panel"><h3>Teacher module not loaded</h3></section>`;
    case "admin-dashboard": return adminExperience().renderAdminDashboard?.() || `<section class="panel"><h3>Admin module not loaded</h3></section>`;
    case "admin-settings": return adminExperience().renderAdminSettings?.() || `<section class="panel"><h3>Admin module not loaded</h3></section>`;
    default: return studentShellExperience().renderNews?.() || `<section class="panel"><h3>Student shell module not loaded</h3></section>`;
  }
}

function renderApp() {
  if (!state.role) return;
  renderNav();
  renderHeader();
  contentEl.innerHTML = `${renderToast()}${state.loading ? `<section class="panel"><h3>加载中...</h3></section>` : renderCurrentView()}`;
  bindEvents();
}

function bindEvents() {
  navEl.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      if (state.view === "student-inbox") {
        (state.learningRecords?.homework || []).forEach((item) => {
          if (item.teacherNote) state.seenHomeworkIds[item.id] = true;
        });
      }
      renderApp();
    });
  });
  studentLearningExperience().bind?.({
    state,
    contentEl,
    selectedCourse,
    submitHomework,
    renderApp,
    markWrongBookMastered,
    openWrongBookReview,
    quizCatalog: state.quizCatalog
  });
  studentQuizExperience().bind?.({
    state,
    contentEl,
    quizSubject,
    quizTopic,
    quizLevel,
    resetQuizFlow,
    leaveQuizReview,
    startQuizSession,
    submitQuizSession,
    sendQuizFollowUp,
    renderApp
  });
  studentShellExperience().bind?.({
    state,
    contentEl,
    renderApp,
    confirmSchedule,
    cancelSchedule
  });
  teacherExperience().bind?.({
    state,
    contentEl,
    renderApp
  });
  schedulingExperience().bind?.({
    state,
    contentEl,
    renderApp,
    updateScheduleDraft,
    createSchedule,
    confirmSchedule,
    cancelSchedule
  });
}

async function loginAs(role) {
  state.role = role;
  state.view = demoAccounts[role].defaultView;
  loginScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  if (!state.studentOverview) {
    await loadStudentData();
  } else {
    renderApp();
  }
}

function logout() {
  state.role = null;
  loginScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
}

document.querySelectorAll(".login-btn").forEach((button) => {
  button.addEventListener("click", () => loginAs(button.dataset.role));
});

document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("open-checklist-btn").addEventListener("click", () => {
  state.view = "student-inbox";
  renderApp();
});
document.getElementById("quick-switch-student").addEventListener("click", () => loginAs("student"));
document.getElementById("quick-switch-teacher").addEventListener("click", () => loginAs("teacher"));
document.getElementById("quick-switch-admin").addEventListener("click", () => loginAs("admin"));

