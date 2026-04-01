const newsFeed = [
  { title: "4 月模试周开始报名", body: "本周五前完成报名的学生，将自动分配到本月能力诊断批次。", meta: "塾 News · 今天 09:00" },
  { title: "保護者面談模板已更新", body: "系统新增“学习进度 + 风险提示”版本，老师可直接复制给家长。", meta: "塾 News · 今天 11:20" },
  { title: "周三自习室席位紧张", body: "建议优先把高风险学生排入 18:30 前时段。", meta: "运营提醒 · 今天 14:10" }
];

const students = [
  {
    id: 1,
    name: "佐藤 美咲",
    grade: "中学2年",
    group: "A23",
    goal: "7月模试偏差值 58 -> 64",
    score: 82,
    attendance: 91,
    progress: [55, 63, 60, 74, 81],
    risk: "中风险",
    summary: "应用题审题速度偏慢，但基础计算稳定。",
    parentNote: "建议本周重点做限时审题训练。",
    teacherFeedback: "这周状态回升，建议继续针对读题与时间控制做训练。",
    quizHistory: [
      { date: "2026-03-08", name: "一次函数基础", score: 78, note: "计算没问题，文字转式偏慢" },
      { date: "2026-03-15", name: "英语长文主旨", score: 70, note: "主旨提取失分明显" },
      { date: "2026-03-29", name: "应用题短测", score: 84, note: "步骤拆解后有改善" }
    ],
    homework: [
      { date: "2026-03-19", title: "一次函数作业", status: "已提交", score: 80 },
      { date: "2026-03-24", title: "读解训练", status: "已提交", score: 74 },
      { date: "2026-03-31", title: "应用题复盘", status: "待批改", score: null }
    ],
    teacherMessages: [
      { from: "teacher", title: "山田老师", body: "今天你的计算部分很稳定，下次我们重点练审题速度。", time: "昨天 18:40" },
      { from: "student", title: "佐藤 美咲", body: "我觉得应用题一长就容易慌，能不能给我更短一点的训练？", time: "昨天 20:15" }
    ],
    aiMessages: [
      { from: "ai", title: "AI 学习助手", body: "你最近最大的进步是步骤更清楚了。接下来先把每道题的条件圈出来再动笔。", time: "今天 08:20" }
    ],
    abilities: [
      { label: "计算", value: 84 },
      { label: "读解", value: 63 },
      { label: "逻辑", value: 79 },
      { label: "稳定性", value: 72 },
      { label: "自走力", value: 68 }
    ]
  },
  {
    id: 2,
    name: "高桥 翔太",
    grade: "高校1年",
    group: "A23",
    goal: "英语读解进入班级前 20%",
    score: 74,
    attendance: 76,
    progress: [72, 67, 60, 58, 54],
    risk: "高风险",
    summary: "到课波动明显，词汇与长文表现都在下滑。",
    parentNote: "建议尽快安排保護者面談。",
    teacherFeedback: "需要调整上课时段，并建立每日复习打卡。",
    quizHistory: [
      { date: "2026-03-10", name: "英语词汇短测", score: 68, note: "复习频率不足" },
      { date: "2026-03-20", name: "长文速读训练", score: 61, note: "速度与正确率都偏低" },
      { date: "2026-03-27", name: "语法巩固", score: 66, note: "基础点混淆较多" }
    ],
    homework: [
      { date: "2026-03-18", title: "英语词汇卡", status: "未提交", score: null },
      { date: "2026-03-26", title: "长文速读", status: "已提交", score: 61 },
      { date: "2026-03-31", title: "语法整理", status: "已提交", score: 66 }
    ],
    teacherMessages: [
      { from: "teacher", title: "山田老师", body: "这周你的单词复习频率不够，我们需要一起把节奏找回来。", time: "昨天 19:10" }
    ],
    aiMessages: [
      { from: "ai", title: "AI 学习助手", body: "建议今天先做 10 分钟词汇复习，再做一篇短长文，不要一次刷太多。", time: "今天 07:50" }
    ],
    abilities: [
      { label: "词汇", value: 58 },
      { label: "读解", value: 72 },
      { label: "输出", value: 61 },
      { label: "稳定性", value: 49 },
      { label: "自走力", value: 52 }
    ]
  },
  {
    id: 3,
    name: "田中 遥",
    grade: "小学6年",
    group: "B11",
    goal: "私立中学受验双科强化",
    score: 89,
    attendance: 96,
    progress: [70, 75, 80, 84, 89],
    risk: "低风险",
    summary: "整体稳定，适合增加更高阶题型。",
    parentNote: "可逐步引入受验学校题型。",
    teacherFeedback: "适合进入进阶班候补名单。",
    quizHistory: [
      { date: "2026-03-09", name: "图形思维", score: 88, note: "解法灵活" },
      { date: "2026-03-16", name: "国語读解", score: 90, note: "主旨判断很稳" },
      { date: "2026-03-30", name: "受验模拟", score: 89, note: "可增加难度" }
    ],
    homework: [
      { date: "2026-03-17", title: "图形练习", status: "已提交", score: 87 },
      { date: "2026-03-25", title: "读解精练", status: "已提交", score: 91 },
      { date: "2026-03-31", title: "受验短测", status: "已提交", score: 89 }
    ],
    teacherMessages: [
      { from: "teacher", title: "山田老师", body: "你最近提问越来越主动了，我们下周开始试一部分更难的题。", time: "昨天 17:30" }
    ],
    aiMessages: [
      { from: "ai", title: "AI 学习助手", body: "你目前最适合做的是挑战题，而不是重复基础题。", time: "今天 08:00" }
    ],
    abilities: [
      { label: "读解", value: 87 },
      { label: "计算", value: 85 },
      { label: "逻辑", value: 90 },
      { label: "稳定性", value: 92 },
      { label: "自走力", value: 88 }
    ]
  }
];

const quizTemplates = [
  { id: "q1", abilityIndex: 0, type: "text", question: "3x + 5 = 17，x 等于多少？", answer: "4" },
  { id: "q2", abilityIndex: 2, type: "text", question: "一个数加上 8 后再乘 2 等于 26，这个数是多少？", answer: "5" },
  { id: "q3", abilityIndex: 1, type: "choice", question: "主旨句最主要的作用是什么？", choices: ["列举细节", "说明段落中心", "解释词性", "表示顺序"], answer: "说明段落中心" },
  { id: "q4", abilityIndex: 4, type: "choice", question: "一道题做错后最好的下一步是什么？", choices: ["直接跳过", "只看答案", "找错因再做一遍", "等老师再讲"], answer: "找错因再做一遍" }
];

const lessonCalendar = [
  {
    id: "lesson-1",
    date: "4/02",
    weekday: "Wed",
    time: "18:30-20:00",
    title: "一次函数基础",
    studentIds: [1],
    ppt: "一次函数入门 12 页",
    notes: "讲了 y=ax+b 的含义、图像斜率、截距，并做了 4 道基础题。",
    highlights: ["固定量和变化量的区分", "把文字条件转成函数式", "看图像判断增减"],
    mistakes: ["把 b 看成斜率", "文字题列式漏掉初始值"],
    completion: 86,
    understanding: 78,
    homeworkStatus: "已提交",
    wrongCount: 2,
    metrics: [62, 74, 81, 86]
  },
  {
    id: "lesson-2",
    date: "4/04",
    weekday: "Fri",
    time: "19:00-20:30",
    title: "英语长文主旨训练",
    studentIds: [2],
    ppt: "长文阅读技巧 9 页",
    notes: "训练首段主旨提取和段落结构判断，重点在速度与信息筛选。",
    highlights: ["首段抓主题", "排除细节干扰项", "限时阅读节奏"],
    mistakes: ["细节项误认为主旨", "读得太慢导致后面没时间"],
    completion: 71,
    understanding: 65,
    homeworkStatus: "待提交",
    wrongCount: 4,
    metrics: [58, 61, 68, 71]
  },
  {
    id: "lesson-3",
    date: "4/05",
    weekday: "Sat",
    time: "10:00-11:30",
    title: "图形思维进阶",
    studentIds: [3],
    ppt: "图形与面积关系 11 页",
    notes: "结合受验题练习图形拆分和面积转化。",
    highlights: ["拆分复杂图形", "找辅助线", "用等积变形简化计算"],
    mistakes: ["辅助线添加过多", "面积公式使用顺序混乱"],
    completion: 92,
    understanding: 89,
    homeworkStatus: "已完成",
    wrongCount: 1,
    metrics: [76, 83, 88, 92]
  },
  {
    id: "lesson-4",
    date: "4/08",
    weekday: "Tue",
    time: "18:30-20:00",
    title: "应用题错题复盘",
    studentIds: [1, 2],
    ppt: "错题复盘模板 7 页",
    notes: "围绕最近在线做题结果，拆解错因并做针对性练习。",
    highlights: ["错题按类型归类", "先讲错因再讲解法", "老师给出复盘模板"],
    mistakes: ["只改答案不复盘", "没有记录错因关键词"],
    completion: 80,
    understanding: 73,
    homeworkStatus: "进行中",
    wrongCount: 3,
    metrics: [59, 67, 75, 80]
  }
];

const coursePrograms = [
  {
    id: "course-waseda",
    studentIds: [1, 2],
    title: "早稻田大学入试备考课程",
    subject: "综合备考",
    totalLessons: 16,
    completedLessons: 6,
    nextLesson: "4/08 18:30",
    schedule: "每周二 / 周五",
    teacher: "山田老师",
    milestones: ["基础梳理", "阅读强化", "志望校题型训练", "模拟面试"],
    lessonIds: ["lesson-1", "lesson-2", "lesson-4"]
  },
  {
    id: "course-japanese",
    studentIds: [1, 3],
    title: "日语精读课程",
    subject: "日语",
    totalLessons: 12,
    completedLessons: 8,
    nextLesson: "4/10 19:00",
    schedule: "每周三",
    teacher: "佐佐木老师",
    milestones: ["文法", "长文精读", "表达训练"],
    lessonIds: ["lesson-2"]
  },
  {
    id: "course-english",
    studentIds: [1, 2],
    title: "英语读解强化课程",
    subject: "英语",
    totalLessons: 10,
    completedLessons: 5,
    nextLesson: "4/12 18:00",
    schedule: "每周六",
    teacher: "桥本老师",
    milestones: ["词汇基础", "主旨提取", "限时训练"],
    lessonIds: ["lesson-2", "lesson-4"]
  }
];

const accounts = {
  student: { name: "佐藤 美咲", roleLabel: "学生", defaultView: "news" },
  teacher: { name: "山田老师", roleLabel: "老师", defaultView: "news" },
  admin: { name: "塾长 Admin", roleLabel: "管理员", defaultView: "news" }
};

const roleMenus = {
  student: [
    { id: "news", label: "塾 News" },
    { id: "student-calendar", label: "课程日历" },
    { id: "student-quiz", label: "在线做题" },
    { id: "student-progress", label: "我的学习情况" },
    { id: "student-teacher", label: "和老师沟通" },
    { id: "student-ai", label: "和 AI 沟通" }
  ],
  teacher: [
    { id: "news", label: "塾 News" },
    { id: "teacher-calendar", label: "课程日历" },
    { id: "teacher-db", label: "学生数据库" },
    { id: "teacher-student", label: "学生详情与反馈" },
    { id: "teacher-ai", label: "教学助手" }
  ],
  admin: [
    { id: "news", label: "塾 News" },
    { id: "admin-dashboard", label: "经营概览" },
    { id: "admin-classes", label: "班级与老师" },
    { id: "admin-billing", label: "缴费与预警" },
    { id: "admin-settings", label: "系统配置" }
  ]
};

const state = {
  role: null,
  view: null,
  selectedStudentId: 1,
  teacherFilter: "all",
  selectedLessonId: "lesson-1",
  selectedCourseId: "course-waseda",
  studentApiLoading: false,
  studentApiError: "",
  studentApiSuccess: "",
  lessonHomeworkDrafts: {},
  studentLearningRecords: null
};

const loginScreen = document.getElementById("login-screen");
const appShell = document.getElementById("app-shell");
const navEl = document.getElementById("sidebar-nav");
const contentEl = document.getElementById("app-content");
let studentToastTimer = null;

async function fetchStudentOverview() {
  const response = await fetch("/api/student/1/overview");
  if (!response.ok) throw new Error("Failed to load student overview");
  return response.json();
}

async function fetchStudentLearningRecords() {
  const response = await fetch("/api/student/1/learning-records");
  if (!response.ok) throw new Error("Failed to load learning records");
  return response.json();
}

function replaceCollection(target, items) {
  target.splice(0, target.length, ...items);
}

function syncStudentApiData(payload) {
  if (!payload) return;
  const studentIndex = students.findIndex((student) => student.id === payload.student.id);
  if (studentIndex >= 0) {
    students.splice(studentIndex, 1, payload.student);
  } else {
    students.push(payload.student);
  }
  replaceCollection(coursePrograms, payload.courses);
  replaceCollection(lessonCalendar, payload.lessons);
  replaceCollection(quizTemplates, payload.quizTemplates);
  state.selectedStudentId = payload.student.id;
  if (!coursePrograms.find((course) => course.id === state.selectedCourseId)) {
    state.selectedCourseId = coursePrograms[0]?.id || state.selectedCourseId;
  }
  const selectedCourse = getSelectedCourse();
  if (selectedCourse && !selectedCourse.lessonIds.includes(state.selectedLessonId)) {
    state.selectedLessonId = selectedCourse.lessonIds[0];
  }
  state.studentLearningRecords = {
    quizHistory: payload.student.quizHistory,
    homework: payload.student.homework,
    progress: payload.student.progress
  };
}

async function loadStudentS1Data() {
  state.studentApiLoading = true;
  state.studentApiError = "";
  state.studentApiSuccess = "";
  renderApp();
  try {
    const [payload, records] = await Promise.all([
      fetchStudentOverview(),
      fetchStudentLearningRecords()
    ]);
    syncStudentApiData(payload);
    state.studentLearningRecords = records;
  } catch (error) {
    state.studentApiError = "学生端真实数据加载失败，当前显示的是本地演示数据。";
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

function getSelectedStudent() {
  return students.find((student) => student.id === state.selectedStudentId) || students[0];
}

function getSelectedLesson() {
  return lessonCalendar.find((lesson) => lesson.id === state.selectedLessonId) || lessonCalendar[0];
}

function getSelectedCourse() {
  return coursePrograms.find((course) => course.id === state.selectedCourseId) || coursePrograms[0];
}

function getStudentCourses(studentId) {
  return coursePrograms.filter((course) => course.studentIds.includes(studentId));
}

function getLessonStatus(lesson) {
  if (lesson.homeworkStatus === "已完成" || lesson.homeworkStatus === "已提交") return "已完成";
  if (lesson.homeworkStatus === "进行中") return "进行中";
  return "待开始";
}

function courseProgress(course) {
  return Math.round((course.completedLessons / course.totalLessons) * 100);
}

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function completionRate() {
  return Math.round((students.filter((student) => student.quizHistory.length >= 4).length / students.length) * 100);
}

function getRiskClass(risk) {
  if (risk === "高风险") return "risk-high";
  if (risk === "中风险") return "risk-medium";
  return "risk-low";
}

function getRowRiskDot(risk) {
  if (risk === "高风险") return "dot-high";
  if (risk === "中风险") return "dot-medium";
  return "dot-low";
}

function bar(value) {
  return `<div class="progress-bar"><i style="width:${value}%"></i></div>`;
}

function tinySpark(values) {
  return `<div class="tiny-spark">${values.map((value) => `<i style="height:${Math.max(8, value * 0.24)}px"></i>`).join("")}</div>`;
}

function latestQuiz(student) {
  return student.quizHistory[student.quizHistory.length - 1];
}

function latestHomework(student) {
  return student.homework[0];
}

function quizDelta(student) {
  if (student.quizHistory.length < 2) return 0;
  const latest = student.quizHistory[student.quizHistory.length - 1].score;
  const previous = student.quizHistory[student.quizHistory.length - 2].score;
  return latest - previous;
}

function riskCount(level) {
  return students.filter((student) => student.risk === level).length;
}

function renderNav() {
  navEl.innerHTML = roleMenus[state.role].map((item) => `
    <button class="nav-link ${state.view === item.id ? "active" : ""}" data-view="${item.id}" type="button">${item.label}</button>
  `).join("");
  navEl.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      renderApp();
    });
  });
}

function renderNewsView() {
  return `
    <section class="metric-grid">
      <article class="metric-card"><span>本周到课率</span><strong>${average(students.map((student) => student.attendance))}%</strong><small>所有角色共用的塾概览入口</small></article>
      <article class="metric-card"><span>平均诊断分</span><strong>${average(students.map((student) => student.score))}</strong><small>帮助理解教学整体质量</small></article>
      <article class="metric-card"><span>在线做题活跃度</span><strong>${completionRate()}%</strong><small>学生是否进入学习闭环</small></article>
    </section>
    <section class="news-grid">
      ${newsFeed.map((item) => `<article class="news-card"><p class="eyebrow">Juku News</p><h3>${item.title}</h3><p>${item.body}</p><p class="news-meta">${item.meta}</p></article>`).join("")}
    </section>
  `;
}

function renderStudentLoading() {
  if (!state.studentApiLoading && !state.studentApiError && !state.studentApiSuccess) return "";
  const statusClass = state.studentApiLoading ? "student-status-loading" : state.studentApiError ? "student-status-error" : "student-status-success";
  const heading = state.studentApiLoading
    ? "正在加载学生真实数据..."
    : state.studentApiError
      ? "本次操作没有保存成功"
      : "已经保存到数据库";
  const message = state.studentApiLoading
    ? "正在从本地后端读取课程、课次和学习记录。"
    : state.studentApiError || state.studentApiSuccess;
  return `
    <section class="panel student-status-banner ${statusClass}" style="margin-bottom:18px;">
      <p class="eyebrow">Student S1</p>
      <h3>${heading}</h3>
      <p class="profile-meta">${message}</p>
    </section>
  `;
}

function lessonCard(lesson, active) {
  const status = getLessonStatus(lesson);
  return `
    <button class="lesson-card ${active ? "active" : ""}" data-lesson-id="${lesson.id}" type="button">
      <span>${lesson.weekday}</span>
      <strong>${lesson.date}</strong>
      <p>${lesson.title}</p>
      <span class="lesson-status lesson-status-${status === "已完成" ? "done" : status === "进行中" ? "active" : "pending"}">${status}</span>
      <small>${lesson.time}</small>
    </button>
  `;
}

function renderLessonDetail(lesson) {
  const studentNames = lesson.studentIds.map((id) => students.find((student) => student.id === id)?.name).filter(Boolean).join(" / ");
  return `
    <article class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Lesson Detail</p>
          <h3>${lesson.title}</h3>
        </div>
        <span class="tag">${lesson.date} ${lesson.time}</span>
      </div>
      <div class="profile-section">
        <div class="section-row"><strong>学生</strong><span>${studentNames}</span></div>
        <div class="section-row"><strong>PPT</strong><span>${lesson.ppt}</span></div>
        <div class="section-row"><strong>课堂笔记</strong><span>${lesson.notes}</span></div>
      </div>
      <div class="lesson-stats">
        <div class="inline-stat"><span>完成度</span><strong>${lesson.completion}%</strong></div>
        <div class="inline-stat"><span>理解度</span><strong>${lesson.understanding}%</strong></div>
        <div class="inline-stat"><span>课后作业</span><strong>${lesson.homeworkStatus}</strong></div>
        <div class="inline-stat"><span>错题数</span><strong>${lesson.wrongCount}</strong></div>
      </div>
      <div class="lesson-chart-card">
        <p class="eyebrow">Lesson Performance</p>
        <h4>本节课表现趋势</h4>
        <div class="lesson-chart">
          ${lesson.metrics.map((value) => `<i style="height:${Math.max(18, value * 0.9)}px"></i>`).join("")}
        </div>
      </div>
      <div class="grid-2">
        <div class="todo-item">
          <strong>重难点</strong>
          <p>${lesson.highlights.join(" / ")}</p>
        </div>
        <div class="todo-item">
          <strong>易错点</strong>
          <p>${lesson.mistakes.join(" / ")}</p>
        </div>
      </div>
      <div class="todo-list" style="margin-top:16px;">
        <div class="todo-item"><strong>课堂资料汇总</strong><p>PPT、课堂笔记、重难点、错题、完成度都沉淀在本节课页面里，方便学生、老师和家长回看。</p></div>
      </div>
      ${state.role === "student" ? `
        <div class="feedback-box" style="margin-top:16px;">
          <p class="eyebrow">Homework Submission</p>
          <h4>提交本节课课后作业</h4>
          <textarea class="feedback-input" id="lesson-homework-input" placeholder="例如：我这节课复盘了 y=ax+b 的题型，并把两道错题重新做了一遍。">${state.lessonHomeworkDrafts[lesson.id] ?? lesson.homeworkContent ?? ""}</textarea>
          <div class="feedback-toolbar" style="margin-top:12px;">
            <button class="primary-btn" id="submit-lesson-homework-btn" data-lesson-id="${lesson.id}" type="button" ${state.studentApiLoading ? "disabled" : ""}>${state.studentApiLoading ? "提交中..." : "提交课后作业"}</button>
          </div>
        </div>
      ` : ""}
    </article>
  `;
}

function renderStudentCalendarView() {
  const student = getSelectedStudent();
  const courses = getStudentCourses(student.id);
  const selectedCourse = courses.find((course) => course.id === state.selectedCourseId) || courses[0];
  const lessons = selectedCourse ? lessonCalendar.filter((lesson) => selectedCourse.lessonIds.includes(lesson.id)) : [];
  const selectedLesson = lessons.find((lesson) => lesson.id === state.selectedLessonId) || lessons[0];
  return `
    ${renderStudentLoading()}
    <section class="course-flow-layout">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Programs</p>
            <h3>${student.name} 的所有课程</h3>
          </div>
          <span class="tag">${courses.length} 门课程</span>
        </div>
        <div class="course-program-list">
          ${courses.map((course) => `
            <button class="course-program-card ${selectedCourse && course.id === selectedCourse.id ? "active" : ""}" data-course-id="${course.id}" type="button">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">${course.subject}</p>
                  <h4>${course.title}</h4>
                </div>
                <span class="tag">${course.completedLessons}/${course.totalLessons}</span>
              </div>
              <div class="course-progress-bar"><i style="width:${courseProgress(course)}%"></i></div>
              <div class="course-meta-list">
                <div class="section-row"><strong>进度</strong><span>${courseProgress(course)}%</span></div>
                <div class="section-row"><strong>时间</strong><span>${course.schedule}</span></div>
                <div class="section-row"><strong>下节课</strong><span>${course.nextLesson}</span></div>
                <div class="section-row"><strong>老师</strong><span>${course.teacher}</span></div>
              </div>
            </button>
          `).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Course Calendar</p>
            <h3>${selectedCourse ? selectedCourse.title : "课程日历"}</h3>
          </div>
          <span class="tag">共 ${selectedCourse ? selectedCourse.totalLessons : 0} 节</span>
        </div>
        <div class="calendar-board">
          ${lessons.map((lesson) => lessonCard(lesson, selectedLesson && lesson.id === selectedLesson.id)).join("")}
        </div>
      </article>
      ${selectedLesson ? renderLessonDetail(selectedLesson) : `<article class="panel"><h3>暂无课程详情</h3></article>`}
    </section>
  `;
}

function renderTeacherCalendarView() {
  const selectedCourse = getSelectedCourse();
  const lessons = selectedCourse ? lessonCalendar.filter((lesson) => selectedCourse.lessonIds.includes(lesson.id)) : [];
  const selectedLesson = lessons.find((lesson) => lesson.id === state.selectedLessonId) || lessons[0];
  return `
    <section class="course-flow-layout">
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Teacher Programs</p>
            <h3>老师课程模块</h3>
          </div>
          <span class="tag">${coursePrograms.length} 门课程</span>
        </div>
        <div class="course-program-list">
          ${coursePrograms.map((course) => `
            <button class="course-program-card ${selectedCourse && course.id === selectedCourse.id ? "active" : ""}" data-course-id="${course.id}" type="button">
              <div class="panel-head">
                <div>
                  <p class="eyebrow">${course.subject}</p>
                  <h4>${course.title}</h4>
                </div>
                <span class="tag">${course.completedLessons}/${course.totalLessons}</span>
              </div>
              <div class="course-progress-bar"><i style="width:${courseProgress(course)}%"></i></div>
              <div class="course-meta-list">
                <div class="section-row"><strong>学生数</strong><span>${course.studentIds.length}</span></div>
                <div class="section-row"><strong>时间</strong><span>${course.schedule}</span></div>
                <div class="section-row"><strong>下节课</strong><span>${course.nextLesson}</span></div>
              </div>
            </button>
          `).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Course Calendar</p>
            <h3>${selectedCourse ? selectedCourse.title : "课程日历"}</h3>
          </div>
          <span class="tag">按课次查看</span>
        </div>
        <div class="calendar-board">
          ${lessons.map((lesson) => lessonCard(lesson, selectedLesson && lesson.id === selectedLesson.id)).join("")}
        </div>
      </article>
      ${selectedLesson ? renderLessonDetail(selectedLesson) : `<article class="panel"><h3>暂无课程详情</h3></article>`}
    </section>
  `;
}

function renderStudentQuizView() {
  const student = getSelectedStudent();
  const latest = latestQuiz(student);
  const delta = quizDelta(student);
  const weakSummary = latest.note.includes("主要薄弱点") ? latest.note.replace("主要薄弱点: ", "") : "基础稳定";
  return `
    ${renderStudentLoading()}
    <section class="grid-2">
      <article class="panel">
        <div class="panel-head"><div><p class="eyebrow">Online Quiz</p><h3>欢迎，${student.name}</h3></div><span class="tag">${student.grade}</span></div>
        <p class="muted-copy">提交后会更新你的学习进度，老师端也会同步看到这次结果。</p>
        <form class="quiz-form" id="student-quiz-form">
          ${quizTemplates.map((question, index) => question.type === "choice" ? `
            <div class="quiz-card">
              <strong>${index + 1}. ${question.question}</strong>
              <div class="quiz-options">${question.choices.map((choice) => `<label class="quiz-option"><input type="radio" name="${question.id}" value="${choice}"><span>${choice}</span></label>`).join("")}</div>
            </div>
          ` : `
            <div class="quiz-card">
              <strong>${index + 1}. ${question.question}</strong>
              <div style="margin-top:12px;"><input class="quiz-input" type="text" name="${question.id}" placeholder="请输入答案"></div>
            </div>
          `).join("")}
        </form>
        <div class="quiz-actions">
          <button class="primary-btn" id="submit-student-quiz" type="button">提交作答</button>
          <button class="ghost-btn" id="reset-student-quiz" type="button">清空</button>
        </div>
      </article>
      <article class="panel">
        <p class="eyebrow">Latest Result</p>
        <h3>最近一次做题记录</h3>
        <div class="score-box"><span>上次分数</span><strong>${latest.score}</strong></div>
        <div class="quiz-result-grid" style="margin-top:16px;">
          <div class="result-card"><span>与上次相比</span><strong>${delta >= 0 ? `+${delta}` : delta}</strong><p>${delta >= 0 ? "有提升，适合继续追踪" : "有下降，需要尽快复盘"}</p></div>
          <div class="result-card"><span>系统判断</span><strong>${student.risk}</strong><p>${weakSummary}</p></div>
        </div>
        <div class="todo-list" style="margin-top:16px;">
          ${student.quizHistory.slice().reverse().map((item) => `<div class="todo-item"><strong>${item.date} · ${item.name}</strong><p>${item.score} 分 · ${item.note}</p></div>`).join("")}
        </div>
      </article>
    </section>
  `;
}

function renderStudentProgressView() {
  const student = getSelectedStudent();
  const records = state.studentLearningRecords || {
    quizHistory: student.quizHistory,
    homework: student.homework,
    progress: student.progress
  };
  const latestRecord = records.quizHistory[records.quizHistory.length - 1];
  return `
    ${renderStudentLoading()}
    <section class="student-dashboard">
      <article class="panel"><p class="eyebrow">My Summary</p><h3>${student.goal}</h3><p class="profile-meta">${student.summary}</p><div class="score-box" style="margin-top:16px;"><span>当前总评</span><strong>${student.score}</strong></div></article>
      <article class="panel"><p class="eyebrow">Progress</p><h3>最近学习进度</h3><div class="sparkline">${records.progress.map((value) => `<i style="height:${Math.max(18, value * 0.8)}px"></i>`).join("")}</div></article>
      <article class="panel"><p class="eyebrow">Parent Summary</p><h3>本周反馈摘要</h3><p class="profile-meta">${student.parentNote}</p></article>
    </section>
    <section class="grid-2" style="margin-top:18px;">
      <article class="panel radar-box"><p class="eyebrow">Ability Radar</p><h4>能力维度</h4><svg id="radar-chart" viewBox="0 0 320 320"></svg></article>
      <article class="panel"><p class="eyebrow">Homework</p><h3>我的作业记录</h3><div class="homework-list">${records.homework.map((item) => `<div class="homework-row"><div><strong>${item.title}</strong><span class="small-note">${item.date}</span></div><div><strong>${item.status}</strong><span class="small-note">${item.score === null ? "待评分" : `${item.score} 分`}</span></div></div>`).join("")}</div></article>
    </section>
    <section class="grid-2" style="margin-top:18px;">
      <article class="panel"><p class="eyebrow">Learning Records</p><h3>最近测验记录</h3><div class="todo-list">${records.quizHistory.slice().reverse().map((item) => `<div class="todo-item"><strong>${item.date} · ${item.name}</strong><p>${item.score} 分 · ${item.note}</p></div>`).join("")}</div></article>
      <article class="panel"><p class="eyebrow">Latest Snapshot</p><h3>最新一次学习快照</h3><div class="todo-list"><div class="todo-item"><strong>最近一次测验</strong><p>${latestRecord ? `${latestRecord.name} · ${latestRecord.score} 分` : "暂无记录"}</p></div><div class="todo-item"><strong>最近学习节奏</strong><p>${records.progress.join(" / ")}</p></div><div class="todo-item"><strong>数据库状态</strong><p>当前页面优先展示后端 learning-records 接口返回的数据。</p></div></div></article>
    </section>
  `;
}

function renderMessages(messages, promptId, buttonLabel, placeholder) {
  return `
    <div class="chat-shell">
      <div class="chat-header">
        <span class="tag">在线</span>
        <span class="small-note">最近更新：刚刚</span>
      </div>
      <div class="message-list chat-thread">
      ${messages.map((message) => `<div class="message-card ${message.from}"><div class="message-meta"><strong>${message.title}</strong><span class="small-note">${message.time}</span></div><p class="message-body">${message.body}</p></div>`).join("")}
      </div>
    </div>
    </div>
    <div class="chat-input-shell">
      <textarea class="prompt-input" id="${promptId}" rows="4" placeholder="${placeholder}"></textarea>
      <div class="prompt-actions">
        <button class="ghost-btn" type="button">附件</button>
        <button class="primary-btn" type="button" data-action="${buttonLabel}">${buttonLabel}</button>
      </div>
    </div>
  `;
}

function renderStudentTeacherView() {
  const student = getSelectedStudent();
  return `
    ${renderStudentLoading()}
    <section class="grid-2">
      <article class="panel"><p class="eyebrow">Teacher Chat</p><h3>和老师沟通</h3>${renderMessages(student.teacherMessages, "teacher-message-input", "发送给老师", "例如：老师，我想要更多短题训练。")}</article>
      <article class="panel"><p class="eyebrow">Next Advice</p><h3>老师最近给你的反馈</h3><div class="todo-list"><div class="todo-item"><strong>下次上课重点</strong><p>${student.teacherFeedback}</p></div><div class="todo-item"><strong>建议你课前准备</strong><p>先复盘最近一次错题，再做 10 分钟限时练习。</p></div><div class="todo-item"><strong>当前状态</strong><p>${student.risk} · 最近测验 ${latestQuiz(student).score} 分</p></div></div></article>
    </section>
  `;
}

function renderStudentAIView() {
  const student = getSelectedStudent();
  return `
    ${renderStudentLoading()}
    <section class="grid-2">
      <article class="panel"><p class="eyebrow">AI Chat</p><h3>和 AI 沟通</h3>${renderMessages(student.aiMessages, "ai-message-input", "发送给 AI", "例如：请告诉我这周怎么复习最有效。")}</article>
      <article class="panel"><p class="eyebrow">Prompt Suggestions</p><h3>你可以这样问</h3><div class="todo-list"><div class="todo-item"><strong>请解释我最近最弱的知识点</strong><p>适合做题后使用。</p></div><div class="todo-item"><strong>给我一份 15 分钟复习计划</strong><p>适合回家前快速安排。</p></div><div class="todo-item"><strong>把老师的反馈改成我更容易懂的话</strong><p>适合低年龄学生。</p></div></div><div class="profile-section" style="margin-top:16px;"><div class="section-row"><strong>推荐模式</strong><span>短时间复习</span></div><div class="section-row"><strong>建议时长</strong><span>15 分钟</span></div><div class="section-row"><strong>当前重点</strong><span>${student.summary}</span></div></div></article>
    </section>
  `;
}

function renderTeacherDbView() {
  const filteredStudents = state.teacherFilter === "all" ? students : students.filter((student) => student.risk === state.teacherFilter);
  const selected = getSelectedStudent();
  const selectedLatestQuiz = latestQuiz(selected);
  return `
    <section class="table-card">
      <div class="teacher-workspace-head">
        <div>
          <p class="eyebrow">Teacher Workspace</p>
          <h3>Students</h3>
        </div>
        <div class="workspace-actions">
          <span class="tag">All Classes</span>
          <span class="tag">A23 优先跟进</span>
          <button class="ghost-btn" type="button">Filters</button>
        </div>
      </div>
      <div class="table-toolbar">
        <input class="search-input" value="" placeholder="搜索学生姓名或年级（演示版仅样式）">
        <div class="chip-group">
          <button class="chip-btn ${state.teacherFilter === "all" ? "active" : ""}" data-filter="all" type="button">全部</button>
          <button class="chip-btn ${state.teacherFilter === "高风险" ? "active" : ""}" data-filter="高风险" type="button">高风险</button>
          <button class="chip-btn ${state.teacherFilter === "中风险" ? "active" : ""}" data-filter="中风险" type="button">中风险</button>
          <button class="chip-btn ${state.teacherFilter === "低风险" ? "active" : ""}" data-filter="低风险" type="button">低风险</button>
        </div>
      </div>
      <div class="table-meta-row">
        <span>${filteredStudents.length} 名学生</span>
        <div class="table-meta-actions">
          <span>Sort by 最近测验</span>
          <span>显示 1-${filteredStudents.length}</span>
        </div>
      </div>
      <div class="db-summary-row">
        <div class="mini-stat"><span>学生总数</span><strong>${students.length}</strong></div>
        <div class="mini-stat"><span>高风险</span><strong>${riskCount("高风险")}</strong></div>
        <div class="mini-stat"><span>中风险</span><strong>${riskCount("中风险")}</strong></div>
        <div class="mini-stat"><span>平均到课</span><strong>${average(students.map((student) => student.attendance))}%</strong></div>
      </div>
      <div class="student-database">
        <div class="db-main">
          <div class="db-caption">按学生学习状态快速筛选，点击任意学生可查看详情与最近作业情况。</div>
          <div class="db-header"><span>姓名</span><span>组别</span><span>年级</span><span>进度</span><span>到课</span></div>
          <div class="db-table">
            ${filteredStudents.map((student) => `
              <button class="db-row ${student.id === selected.id ? "active" : ""}" data-student-id="${student.id}" type="button">
                <div class="table-name"><div class="avatar-mini">${student.name.slice(0, 1)}</div><div><strong>${student.name}</strong><span class="small-note"><i class="risk-dot ${getRowRiskDot(student.risk)}"></i>${student.risk} · 最近测验 ${latestQuiz(student).score}</span></div></div>
                <span>${student.group}</span>
                <span>${student.grade}</span>
                ${tinySpark(student.progress)}
                <div>${bar(student.attendance)}<span class="small-note">${student.attendance}%</span></div>
              </button>
            `).join("")}
          </div>
        </div>
        <article class="profile-card profile-sidebar">
          <p class="eyebrow">Student Information</p>
          <div class="profile-hero">
            <div class="avatar">${selected.name.slice(0, 1)}</div>
            <div>
              <h3>${selected.name}</h3>
              <p class="profile-meta">${selected.grade} · ${selected.group}</p>
              <p class="profile-meta">${selected.goal}</p>
              <div class="score-box" style="margin-top:14px;"><span>当前总评</span><strong>${selected.score}</strong></div>
            </div>
          </div>
          <div class="sidebar-top-actions">
            <button class="ghost-btn" type="button">Message</button>
            <button class="ghost-btn" type="button">Report</button>
          </div>
          <div class="profile-badges">
            <span class="risk-tag ${getRiskClass(selected.risk)}">${selected.risk}</span>
            <span class="tag">最近作业 ${latestHomework(selected).status}</span>
            <span class="tag">最近测验 ${selectedLatestQuiz.score} 分</span>
          </div>
          <div class="profile-stats">
            <div class="profile-stat"><span>到课率</span><strong>${selected.attendance}%</strong></div>
            <div class="profile-stat"><span>最近波动</span><strong>${quizDelta(selected) >= 0 ? `+${quizDelta(selected)}` : quizDelta(selected)}</strong></div>
            <div class="profile-stat"><span>本周重点</span><strong>${selectedLatestQuiz.note.includes("主要薄弱点") ? "补弱" : "进阶"}</strong></div>
            <div class="profile-stat"><span>管理老师</span><strong>山田</strong></div>
          </div>
          <div class="profile-section">
            <div class="section-row"><strong>目标</strong><span>${selected.goal}</span></div>
            <div class="section-row"><strong>科目</strong><span>${selected.grade.includes("高") ? "英语 / 数学" : "数学 / 国語 / 英语"}</span></div>
            <div class="section-row"><strong>最近消息</strong><span>${selected.teacherMessages[selected.teacherMessages.length - 1].time}</span></div>
          </div>
          <div class="profile-subpanel">
            <div class="subpanel-item"><span>最近一次作业</span><strong>${latestHomework(selected).title}</strong><p>${latestHomework(selected).status} · ${latestHomework(selected).score === null ? "待评分" : `${latestHomework(selected).score} 分`}</p></div>
            <div class="subpanel-item"><span>最近一次测验</span><strong>${selectedLatestQuiz.name}</strong><p>${selectedLatestQuiz.score} 分 · ${selectedLatestQuiz.note}</p></div>
          </div>
          <div class="todo-list">
            <div class="todo-item"><strong>学习摘要</strong><p>${selected.summary}</p></div>
            <div class="todo-item"><strong>家长沟通建议</strong><p>${selected.parentNote}</p></div>
            <div class="todo-item"><strong>最近一次作业</strong><p>${latestHomework(selected).title} · ${latestHomework(selected).status}</p></div>
            <div class="todo-item"><strong>最近一次测验</strong><p>${selectedLatestQuiz.name} · ${selectedLatestQuiz.score} 分 · ${selectedLatestQuiz.note}</p></div>
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderTeacherStudentView() {
  const student = getSelectedStudent();
  return `
    <section class="teacher-layout">
      <article class="panel">
        <div class="teacher-header"><div><p class="eyebrow">Homework History</p><h3>${student.name} 的每次作业情况</h3></div><span class="risk-tag ${getRiskClass(student.risk)}">${student.risk}</span></div>
        <div class="teacher-inline-stats">
          <div class="inline-stat"><span>当前总评</span><strong>${student.score}</strong></div>
          <div class="inline-stat"><span>到课率</span><strong>${student.attendance}%</strong></div>
          <div class="inline-stat"><span>最近测验</span><strong>${latestQuiz(student).score}</strong></div>
        </div>
        <div class="homework-list">${student.homework.map((item) => `<div class="homework-row"><div><strong>${item.title}</strong><span class="small-note">${item.date}</span></div><div><strong>${item.status}</strong><span class="small-note">${item.score === null ? "待评分" : `${item.score} 分`}</span></div></div>`).join("")}</div>
        <div class="feedback-box"><p class="eyebrow">Write Feedback</p><h4>老师反馈</h4><textarea class="feedback-input" id="teacher-feedback-input">${student.teacherFeedback}</textarea><div class="feedback-toolbar" style="margin-top:12px;"><button class="primary-btn" id="save-feedback-btn" type="button">保存反馈</button><button class="ghost-btn" id="copy-parent-feedback-btn" type="button">生成家长版反馈</button></div></div>
      </article>
      <article class="panel"><p class="eyebrow">Quiz History</p><h3>做题与诊断记录</h3><div class="todo-list">${student.quizHistory.slice().reverse().map((item) => `<div class="todo-item"><strong>${item.date} · ${item.name}</strong><p>${item.score} 分 · ${item.note}</p></div>`).join("")}</div><div class="profile-section" style="margin-top:16px;"><div class="section-row"><strong>老师备注</strong><span>本周适合短练 + 复盘组合</span></div><div class="section-row"><strong>家长反馈状态</strong><span>可发送</span></div><div class="section-row"><strong>下次课准备</strong><span>应用题复盘</span></div></div></article>
    </section>
  `;
}

function renderTeacherAIView() {
  const student = getSelectedStudent();
  return `
    <section class="grid-2">
      <article class="panel"><p class="eyebrow">Teacher AI Copilot</p><h3>教学辅助 Prompt</h3><div class="todo-list"><div class="todo-item"><strong>请基于 ${student.name} 最近三次作业，给我下节课的辅导顺序</strong><p>适合课前准备。</p></div><div class="todo-item"><strong>请把这位学生的情况改写成家长能听懂的一段话</strong><p>适合面谈前使用。</p></div><div class="todo-item"><strong>请生成 5 道针对 ${student.risk} 风险学生的补强题</strong><p>适合课后追练。</p></div></div></article>
      <article class="panel"><p class="eyebrow">AI Draft</p><h3>自动生成示例</h3><div class="message-list"><div class="message-card ai"><div class="message-meta"><strong>AI 教学助手</strong><span class="small-note">刚刚</span></div><p class="message-body">建议先复盘 ${student.name} 最近两次错题，再用 10 分钟做同型短题，最后留 1 道迁移题观察是否真正理解。</p></div></div></article>
    </section>
  `;
}

function renderAdminDashboardView() {
  return `
    <section class="admin-grid">
      <article class="stat-card"><span>总学生数</span><strong>${students.length}</strong><p>演示版样本数据</p></article>
      <article class="stat-card"><span>高风险学生</span><strong>${riskCount("高风险")}</strong><p>建议优先安排面談与时段调整</p></article>
      <article class="stat-card"><span>平均到课率</span><strong>${average(students.map((student) => student.attendance))}%</strong><p>可衡量留存与课堂参与度</p></article>
      <article class="stat-card"><span>在线做题活跃度</span><strong>${completionRate()}%</strong><p>反映学生是否进入学习闭环</p></article>
    </section>
    <section class="grid-2" style="margin-top:18px;">
      <article class="panel"><p class="eyebrow">Admin Todo</p><h3>本周管理动作</h3><div class="todo-list"><div class="todo-item"><strong>安排高风险学生家长面談</strong><p>优先处理出勤下降和做题分数下滑的学生。</p></div><div class="todo-item"><strong>检查周三晚间席位</strong><p>考虑把专注力差的学生调整到更早时段。</p></div><div class="todo-item"><strong>追踪老师反馈提交率</strong><p>保证家长每周都能收到清晰反馈。</p></div></div></article>
      <article class="panel"><p class="eyebrow">Announcements</p><h3>管理员公告</h3><div class="news-grid">${newsFeed.map((item) => `<div class="news-card"><h4>${item.title}</h4><p>${item.body}</p></div>`).join("")}</div></article>
    </section>
    <section class="grid-2" style="margin-top:18px;">
      <article class="panel"><p class="eyebrow">Risk Queue</p><h3>需要优先跟进的学生</h3><div class="todo-list">${students.filter((student) => student.risk !== "低风险").map((student) => `<div class="todo-item"><strong>${student.name} · ${student.risk}</strong><p>${student.summary}</p></div>`).join("")}</div></article>
      <article class="panel"><p class="eyebrow">Service Health</p><h3>本周服务质量观察</h3><div class="ops-grid"><div class="ops-card"><span>反馈提交率</span><strong>86%</strong><p>老师反馈提交较稳定</p></div><div class="ops-card"><span>面談待安排</span><strong>3 件</strong><p>集中在风险学生家庭</p></div><div class="ops-card"><span>待批改作业</span><strong>${students.reduce((sum, student) => sum + student.homework.filter((item) => item.status === "待批改").length, 0)}</strong><p>可提醒老师及时处理</p></div><div class="ops-card"><span>家长满意预估</span><strong>4.4 / 5</strong><p>来自反馈及时性与进度透明度</p></div></div></article>
    </section>
  `;
}

function renderAdminClassesView() {
  return `<section class="grid-2"><article class="panel"><p class="eyebrow">Classes</p><h3>班级与老师配置</h3><div class="todo-list"><div class="todo-item"><strong>A23 班</strong><p>山田老师 · 2 名中高风险学生 · 晚间时段偏满</p></div><div class="todo-item"><strong>B11 班</strong><p>佐佐木老师 · 整体稳定 · 可加进阶课程</p></div><div class="todo-item"><strong>C07 班</strong><p>桥本老师 · 新学期新生较多 · 需增加家长说明</p></div></div></article><article class="panel"><p class="eyebrow">Teacher Capacity</p><h3>老师负载情况</h3><div class="ops-grid"><div class="ops-card"><span>活跃老师</span><strong>4 名</strong><p>其中 2 名负责个别指導</p></div><div class="ops-card"><span>班级数</span><strong>7 个</strong><p>A23 班当前学生预警最多</p></div><div class="ops-card"><span>面談待安排</span><strong>3 件</strong><p>建议优先高风险学生</p></div><div class="ops-card"><span>老师反馈提交率</span><strong>86%</strong><p>可作为服务质量管理指标</p></div></div></article></section>`;
}

function renderAdminBillingView() {
  return `<section class="grid-2"><article class="panel"><p class="eyebrow">Billing</p><h3>缴费与风险</h3><div class="todo-list"><div class="todo-item"><strong>4 月待缴费</strong><p>8 笔，其中 2 笔超过 7 天。</p></div><div class="todo-item"><strong>退塾风险</strong><p>1 名学生因出勤下降和学习停滞被标记。</p></div><div class="todo-item"><strong>续费机会</strong><p>2 名低风险高成长学生适合升级课程。</p></div></div></article><article class="panel"><p class="eyebrow">Charge Table</p><h3>本月重点账务</h3><div class="todo-list"><div class="todo-item"><strong>佐藤 美咲</strong><p>4 月学费正常 · 已确认续费意向</p></div><div class="todo-item"><strong>高桥 翔太</strong><p>待确认 4 月缴费 · 建议结合面談同步跟进</p></div><div class="todo-item"><strong>田中 遥</strong><p>可推荐进阶课程包 · 存在升级机会</p></div></div></article></section>`;
}

function renderAdminSettingsView() {
  return `<section class="grid-2"><article class="panel"><p class="eyebrow">System Settings</p><h3>演示版配置页</h3><div class="todo-list"><div class="todo-item"><strong>角色权限</strong><p>学生 / 老师 / Admin 的页面与操作范围。</p></div><div class="todo-item"><strong>题库管理</strong><p>后续可按学年、学科、难度配置。</p></div><div class="todo-item"><strong>通知配置</strong><p>后续可接 LINE / 邮件 / 家长报告。</p></div></div></article><article class="panel"><p class="eyebrow">Cloud Path</p><h3>后续真实产品方向</h3><div class="todo-list"><div class="todo-item"><strong>数据库接入</strong><p>学生、作业、出勤、缴费统一建模。</p></div><div class="todo-item"><strong>OpenAI 接入</strong><p>让反馈、练习题、总结变成真实动态生成。</p></div><div class="todo-item"><strong>多校区能力</strong><p>支持小型连锁私塾扩展。</p></div></div></article></section>`;
}

function renderView() {
  if (state.view === "news") return renderNewsView();
  if (state.view === "student-calendar") return renderStudentCalendarView();
  if (state.view === "student-quiz") return renderStudentQuizView();
  if (state.view === "student-progress") return renderStudentProgressView();
  if (state.view === "student-teacher") return renderStudentTeacherView();
  if (state.view === "student-ai") return renderStudentAIView();
  if (state.view === "teacher-calendar") return renderTeacherCalendarView();
  if (state.view === "teacher-db") return renderTeacherDbView();
  if (state.view === "teacher-student") return renderTeacherStudentView();
  if (state.view === "teacher-ai") return renderTeacherAIView();
  if (state.view === "admin-dashboard") return renderAdminDashboardView();
  if (state.view === "admin-classes") return renderAdminClassesView();
  if (state.view === "admin-billing") return renderAdminBillingView();
  if (state.view === "admin-settings") return renderAdminSettingsView();
  return renderNewsView();
}

function renderHeader() {
  const titles = {
    news: "塾 News",
    "student-calendar": "我的课程日历",
    "student-quiz": "学生在线做题",
    "student-progress": "我的学习情况",
    "student-teacher": "和老师沟通",
    "student-ai": "和 AI 沟通",
    "teacher-calendar": "老师课程日历",
    "teacher-db": "老师学生数据库",
    "teacher-student": "学生详情与反馈",
    "teacher-ai": "老师教学助手",
    "admin-dashboard": "Admin 经营概览",
    "admin-classes": "班级与老师",
    "admin-billing": "缴费与预警",
    "admin-settings": "系统配置"
  };
  const account = accounts[state.role];
  document.getElementById("account-name").textContent = account.name;
  document.getElementById("account-role").textContent = account.roleLabel;
  document.getElementById("page-title").textContent = titles[state.view] || "塾 News";
  document.getElementById("role-badge").textContent = account.roleLabel;
}

function attachViewEvents() {
  contentEl.querySelectorAll("[data-student-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedStudentId = Number(button.dataset.studentId);
      state.view = "teacher-student";
      renderApp();
    });
  });
  contentEl.querySelectorAll("[data-lesson-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedLessonId = button.dataset.lessonId;
      renderApp();
    });
  });
  contentEl.querySelectorAll("[data-course-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCourseId = button.dataset.courseId;
      const selectedCourse = getSelectedCourse();
      state.selectedLessonId = selectedCourse.lessonIds[0];
      renderApp();
    });
  });
  const submitLessonHomeworkButton = document.getElementById("submit-lesson-homework-btn");
  if (submitLessonHomeworkButton) {
    submitLessonHomeworkButton.addEventListener("click", submitLessonHomework);
  }
  const lessonHomeworkInput = document.getElementById("lesson-homework-input");
  if (lessonHomeworkInput) {
    const persistDraft = () => {
      state.lessonHomeworkDrafts[state.selectedLessonId] = lessonHomeworkInput.value;
    };
    lessonHomeworkInput.addEventListener("input", persistDraft);
    lessonHomeworkInput.addEventListener("change", persistDraft);
    lessonHomeworkInput.addEventListener("compositionend", persistDraft);
  }
  contentEl.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.teacherFilter = button.dataset.filter;
      renderApp();
    });
  });
  const submitQuizButton = document.getElementById("submit-student-quiz");
  if (submitQuizButton) submitQuizButton.addEventListener("click", submitStudentQuiz);
  const resetQuizButton = document.getElementById("reset-student-quiz");
  if (resetQuizButton) resetQuizButton.addEventListener("click", () => document.getElementById("student-quiz-form").reset());
  const saveFeedbackButton = document.getElementById("save-feedback-btn");
  if (saveFeedbackButton) saveFeedbackButton.addEventListener("click", saveTeacherFeedback);
  const copyParentButton = document.getElementById("copy-parent-feedback-btn");
  if (copyParentButton) copyParentButton.addEventListener("click", copyParentFeedback);
  contentEl.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "发送给老师") sendMessage("teacher");
      if (button.dataset.action === "发送给 AI") sendMessage("ai");
    });
  });
  if (state.view === "student-progress") renderRadar(getSelectedStudent().abilities);
}

function renderApp() {
  renderNav();
  renderHeader();
  contentEl.innerHTML = `${renderStudentToast()}${renderView()}`;
  attachViewEvents();
}

function loginAs(role) {
  state.role = role;
  state.view = accounts[role].defaultView;
  loginScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  renderApp();
  if (role === "student") {
    loadStudentS1Data();
  }
}

function logout() {
  loginScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
}

function saveTeacherFeedback() {
  const input = document.getElementById("teacher-feedback-input");
  const student = getSelectedStudent();
  student.teacherFeedback = input.value.trim() || student.teacherFeedback;
  renderApp();
}

function copyParentFeedback() {
  const student = getSelectedStudent();
  student.parentNote = `老师反馈已更新：${student.teacherFeedback}`;
  renderApp();
}

function sendMessage(type) {
  const student = getSelectedStudent();
  const input = document.getElementById(type === "teacher" ? "teacher-message-input" : "ai-message-input");
  const text = input.value.trim();
  if (!text) return;
  if (type === "teacher") {
    student.teacherMessages.push({ from: "student", title: student.name, body: text, time: "刚刚" });
  } else {
    student.aiMessages.push({ from: "student", title: student.name, body: text, time: "刚刚" });
    student.aiMessages.push({ from: "ai", title: "AI 学习助手", body: `建议先把“${text.slice(0, 18)}”拆成 15 分钟的小步骤，再开始做题。`, time: "刚刚" });
  }
  renderApp();
}

async function submitStudentQuiz() {
  const student = getSelectedStudent();
  const formData = new FormData(document.getElementById("student-quiz-form"));
  const answers = {};
  quizTemplates.forEach((question) => {
    answers[question.id] = (formData.get(question.id) || "").toString();
  });

  try {
    state.studentApiLoading = true;
    state.studentApiSuccess = "";
    renderApp();
    const response = await fetch("/api/student/1/quiz-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student.id, answers })
    });
    if (!response.ok) throw new Error("Failed to submit quiz");
    const payload = await response.json();
    syncStudentApiData(payload.overview);
    state.studentLearningRecords = {
      quizHistory: payload.overview.student.quizHistory,
      homework: payload.overview.student.homework,
      progress: payload.overview.student.progress
    };
    state.view = "student-progress";
    state.studentApiError = "";
    state.studentApiSuccess = "做题结果已保存，学习记录和能力画像已经更新。";
  } catch (error) {
    state.studentApiError = "做题结果提交失败，本次没有保存到本地后端。";
    state.studentApiSuccess = "";
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

async function submitLessonHomework(event) {
  const lessonId = event.currentTarget.dataset.lessonId;
  const input = document.getElementById("lesson-homework-input");
  const content = (state.lessonHomeworkDrafts[lessonId] ?? input.value ?? "").trim();
  if (!content) {
    state.studentApiError = "请先填写课后作业内容。";
    state.studentApiSuccess = "";
    renderApp();
    return;
  }

  try {
    state.studentApiLoading = true;
    state.studentApiError = "";
    state.studentApiSuccess = "";
    renderApp();
    const response = await fetch(`/api/student/1/lessons/${lessonId}/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error("Failed to submit homework");
    const payload = await response.json();
    syncStudentApiData(payload.overview);
    state.studentLearningRecords = payload.learningRecords;
    state.lessonHomeworkDrafts[lessonId] = content;
    state.studentApiSuccess = "课后作业已提交并保存到数据库，这节课的状态已经更新。";
  } catch (error) {
    state.studentApiError = "课后作业提交失败，本次没有保存到数据库。";
    state.studentApiSuccess = "";
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

async function loadStudentS1Data() {
  state.studentApiLoading = true;
  state.studentApiError = "";
  state.studentApiSuccess = "";
  renderApp();
  try {
    const [payload, records] = await Promise.all([
      fetchStudentOverview(),
      fetchStudentLearningRecords()
    ]);
    syncStudentApiData(payload);
    state.studentLearningRecords = records;
  } catch (error) {
    showStudentToast("error", "学生端真实数据加载失败，当前显示的是本地演示数据。");
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

function renderStudentLoading() {
  if (!state.studentApiLoading) return "";
  return `
    <section class="panel student-status-banner student-status-loading" style="margin-bottom:18px;">
      <p class="eyebrow">Student S1</p>
      <h3>正在加载学生真实数据...</h3>
      <p class="profile-meta">正在从本地后端读取课程、课次和学习记录。</p>
    </section>
  `;
}

function renderStudentToast() {
  const message = state.studentApiError || state.studentApiSuccess;
  if (!message) return "";
  const typeClass = state.studentApiError ? "student-toast-error" : "student-toast-success";
  const title = state.studentApiError ? "保存失败" : "保存成功";
  return `
    <div class="student-toast-wrap">
      <div class="student-toast ${typeClass}">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
    </div>
  `;
}

function showStudentToast(type, message) {
  if (studentToastTimer) {
    clearTimeout(studentToastTimer);
  }
  state.studentApiError = type === "error" ? message : "";
  state.studentApiSuccess = type === "success" ? message : "";
  renderApp();
  studentToastTimer = setTimeout(() => {
    state.studentApiError = "";
    state.studentApiSuccess = "";
    studentToastTimer = null;
    renderApp();
  }, 2200);
}

async function submitStudentQuiz() {
  const student = getSelectedStudent();
  const formData = new FormData(document.getElementById("student-quiz-form"));
  const answers = {};
  quizTemplates.forEach((question) => {
    answers[question.id] = (formData.get(question.id) || "").toString();
  });

  try {
    state.studentApiLoading = true;
    state.studentApiError = "";
    state.studentApiSuccess = "";
    renderApp();
    const response = await fetch("/api/student/1/quiz-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: student.id, answers })
    });
    if (!response.ok) throw new Error("Failed to submit quiz");
    const payload = await response.json();
    syncStudentApiData(payload.overview);
    state.studentLearningRecords = {
      quizHistory: payload.overview.student.quizHistory,
      homework: payload.overview.student.homework,
      progress: payload.overview.student.progress
    };
    state.view = "student-progress";
    showStudentToast("success", "做题结果已保存，学习记录和能力画像已经更新。");
  } catch (error) {
    showStudentToast("error", "做题结果提交失败，本次没有保存到本地后端。");
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

async function submitLessonHomework(event) {
  const lessonId = event.currentTarget.dataset.lessonId;
  const input = document.getElementById("lesson-homework-input");
  const content = (state.lessonHomeworkDrafts[lessonId] ?? input.value ?? "").trim();
  if (!content) {
    showStudentToast("error", "请先填写课后作业内容。");
    return;
  }

  try {
    state.studentApiLoading = true;
    state.studentApiError = "";
    state.studentApiSuccess = "";
    renderApp();
    const response = await fetch(`/api/student/1/lessons/${lessonId}/homework`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error("Failed to submit homework");
    const payload = await response.json();
    syncStudentApiData(payload.overview);
    state.studentLearningRecords = payload.learningRecords;
    state.lessonHomeworkDrafts[lessonId] = content;
    showStudentToast("success", "课后作业已提交并保存到数据库，这节课的状态已经更新。");
  } catch (error) {
    showStudentToast("error", "课后作业提交失败，本次没有保存到数据库。");
  } finally {
    state.studentApiLoading = false;
    renderApp();
  }
}

function renderRadar(abilities) {
  const svg = document.getElementById("radar-chart");
  if (!svg) return;
  const center = 160;
  const radius = 108;
  const step = (Math.PI * 2) / abilities.length;
  function polarPoint(r, angle) {
    return { x: center + Math.cos(angle) * r, y: center + Math.sin(angle) * r };
  }
  let markup = "";
  for (let layer = 1; layer <= 4; layer += 1) {
    const points = abilities.map((_, index) => {
      const point = polarPoint((radius / 4) * layer, -Math.PI / 2 + step * index);
      return `${point.x},${point.y}`;
    }).join(" ");
    markup += `<polygon points="${points}" fill="none" stroke="rgba(25,143,137,0.16)" stroke-width="1"></polygon>`;
  }
  abilities.forEach((ability, index) => {
    const angle = -Math.PI / 2 + step * index;
    const outer = polarPoint(radius, angle);
    const label = polarPoint(radius + 24, angle);
    markup += `<line x1="${center}" y1="${center}" x2="${outer.x}" y2="${outer.y}" stroke="rgba(31,41,51,0.12)"></line>`;
    markup += `<text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-size="12">${ability.label}</text>`;
  });
  const dataPoints = abilities.map((ability, index) => {
    const point = polarPoint(radius * (ability.value / 100), -Math.PI / 2 + step * index);
    return `${point.x},${point.y}`;
  }).join(" ");
  markup += `<polygon points="${dataPoints}" fill="rgba(213,107,73,0.22)" stroke="#d56b49" stroke-width="3"></polygon>`;
  abilities.forEach((ability, index) => {
    const point = polarPoint(radius * (ability.value / 100), -Math.PI / 2 + step * index);
    markup += `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#198f89" stroke="white" stroke-width="2"></circle>`;
  });
  svg.innerHTML = markup;
}

document.querySelectorAll(".login-btn").forEach((button) => button.addEventListener("click", () => loginAs(button.dataset.role)));
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("quick-switch-student").addEventListener("click", () => loginAs("student"));
document.getElementById("quick-switch-teacher").addEventListener("click", () => loginAs("teacher"));
document.getElementById("quick-switch-admin").addEventListener("click", () => loginAs("admin"));
