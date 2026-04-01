const quizTemplates = [
  {
    id: "q1",
    subject: "数学",
    abilityIndex: 0,
    question: "计算: 3x + 5 = 17, x 等于多少？",
    type: "text",
    answer: "4",
    explanation: "基础方程计算。"
  },
  {
    id: "q2",
    subject: "数学",
    abilityIndex: 2,
    question: "逻辑: 一个数加上 8 后再乘 2 等于 26，这个数是多少？",
    type: "text",
    answer: "5",
    explanation: "需要先逆向思考。"
  },
  {
    id: "q3",
    subject: "英语",
    abilityIndex: 1,
    question: "阅读: 下面哪一项最接近主旨句的作用？",
    type: "choice",
    choices: ["列举细节", "说明段落中心", "解释单词词性", "表示时间顺序"],
    answer: "说明段落中心",
    explanation: "考察主旨提取能力。"
  },
  {
    id: "q4",
    subject: "学习习惯",
    abilityIndex: 4,
    question: "如果一道题第一次做错了，最好的下一步是什么？",
    type: "choice",
    choices: ["马上跳过", "只看答案不复盘", "找出错因并再做一遍", "等老师下次再讲"],
    answer: "找出错因并再做一遍",
    explanation: "考察自主学习意识。"
  }
];

const students = [
  {
    id: 1,
    name: "佐藤 美咲",
    grade: "中学2年",
    goal: "目标: 7月模试偏差值从 58 提升到 64",
    score: 82,
    attendance: 91,
    risk: "中风险",
    summary: "计算基础稳定，但应用题审题速度偏慢。最近到课恢复后，数学正确率有所反弹。",
    parentNote: "建议和家长强调，她的主要问题不是不会，而是做题处理速度慢，需要限时训练。",
    insights: [
      "数学应用题审题速度低于同年级均值 18%。",
      "函数图像题在步骤拆解后正确率提升明显，适合结构化讲解。",
      "英语长文主旨提取存在失分，建议加入短时速读训练。"
    ],
    tasks: [
      "下节课前推送 6 题一次函数补强题。",
      "安排 10 分钟审题示范。",
      "生成本月家长进步摘要。"
    ],
    abilities: [
      { label: "计算", value: 84 },
      { label: "读解", value: 63 },
      { label: "逻辑", value: 79 },
      { label: "稳定性", value: 72 },
      { label: "自走力", value: 68 }
    ],
    progress: [55, 63, 60, 74, 81],
    quizCompleted: false,
    quizScore: null
  },
  {
    id: 2,
    name: "高桥 翔太",
    grade: "高校1年",
    goal: "目标: 定期测试英语读解进入前 20%",
    score: 74,
    attendance: 76,
    risk: "高风险",
    summary: "到课开始波动，英语单词和做题节奏都在下滑，需要尽快做干预。",
    parentNote: "建议尽快联系家长确认作息和课外安排，防止长期缺课导致退塾。",
    insights: [
      "最近 3 次词汇测试连续下降，遗忘管理几乎为空白。",
      "晚间最后一节课专注度低，建议改到周末白天。",
      "如果两周内不干预，续费风险会继续上升。"
    ],
    tasks: [
      "本周安排保護者面談。",
      "把英语训练切换为短时高频模式。",
      "生成每日 10 词复习卡。"
    ],
    abilities: [
      { label: "词汇", value: 58 },
      { label: "读解", value: 72 },
      { label: "输出", value: 61 },
      { label: "稳定性", value: 49 },
      { label: "自走力", value: 52 }
    ],
    progress: [72, 67, 60, 58, 54],
    quizCompleted: false,
    quizScore: null
  },
  {
    id: 3,
    name: "田中 遥",
    grade: "小学6年",
    goal: "目标: 私立中学受验，国语与算数双强化",
    score: 89,
    attendance: 96,
    risk: "低风险",
    summary: "整体稳定，抽象题接受度高，可以逐步导入更高阶题型。",
    parentNote: "适合在家增加阅读类素材，维持好奇心比单纯刷题更重要。",
    insights: [
      "国语读解与算数图形题同时领先同级均值。",
      "自主提问频率高，是高成长潜力信号。",
      "可提前导入受验学校题型，提高家长感知价值。"
    ],
    tasks: [
      "推荐进入进阶班候补名单。",
      "生成 2 周挑战任务卡。",
      "准备一份受验路线建议单页。"
    ],
    abilities: [
      { label: "读解", value: 87 },
      { label: "计算", value: 85 },
      { label: "逻辑", value: 90 },
      { label: "稳定性", value: 92 },
      { label: "自走力", value: 88 }
    ],
    progress: [70, 75, 80, 84, 89],
    quizCompleted: false,
    quizScore: null
  }
];

const copilotReplies = {
  explain: {
    user: "这位学生总是看不懂一次函数应用题，我该怎么更容易地解释？",
    ai: "先不要直接讲公式，按“情境 -> 变量 -> 图像 -> 代入”四步来讲。比如用手机套餐或补习班收费做例子，学生会更容易理解。"
  },
  worksheet: {
    user: "帮我给这位学生生成一组补强题。",
    ai: "建议分层生成：2 题基础、1 题读题训练、1 题应用题、1 题带半步提示的迁移题，方便老师观察卡点。"
  },
  homework: {
    user: "请帮我写一段发给家长的课后反馈。",
    ai: "今天主要练习了应用题审题和列式。学生在条件整理上还有些慢，但在提示后能独立完成后半段解题，建议本周做 10 分钟限时训练。"
  }
};

const panels = [...document.querySelectorAll(".panels")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const studentListEl = document.getElementById("student-list");
const chatWindowEl = document.getElementById("chat-window");
const quizFormEl = document.getElementById("quiz-form");
const quizFeedbackEl = document.getElementById("quiz-feedback");

let currentIndex = 0;

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getQuizCompletionRate() {
  return Math.round((students.filter((student) => student.quizCompleted).length / students.length) * 100);
}

function calculateRisk(student) {
  if (student.attendance < 80 || student.score < 75) return "高风险";
  if (student.attendance < 90 || student.score < 85) return "中风险";
  return "低风险";
}

function updateTopMetrics() {
  document.getElementById("attendance-rate").textContent = `${average(students.map((student) => student.attendance))}%`;
  document.getElementById("diagnostic-score").textContent = average(students.map((student) => student.score));
  document.getElementById("quiz-completion").textContent = `${getQuizCompletionRate()}%`;
  document.getElementById("ops-quiz-rate").textContent = `${getQuizCompletionRate()}%`;
  document.getElementById("risk-count").textContent = students.filter((student) => student.risk !== "低风险").length;
}

function renderStudentList() {
  studentListEl.innerHTML = "";

  students.forEach((student, index) => {
    const item = document.createElement("button");
    item.className = `student-item${index === currentIndex ? " active" : ""}`;
    item.type = "button";
    item.innerHTML = `
      <div class="student-top">
        <div>
          <strong>${student.name}</strong>
          <small>${student.grade}</small>
        </div>
        <strong>${student.score}</strong>
      </div>
      <div class="student-bottom">
        <span>${student.risk}</span>
        <div class="bar"><i style="width:${student.attendance}%"></i></div>
        <small>${student.quizCompleted ? `已做题 ${student.quizScore}分` : `${student.attendance}% 到课`}</small>
      </div>
    `;
    item.addEventListener("click", () => {
      currentIndex = index;
      refreshAll();
    });
    studentListEl.appendChild(item);
  });
}

function polarPoint(cx, cy, radius, angle) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
}

function renderRadar(abilities) {
  const svg = document.getElementById("radar-chart");
  const center = 160;
  const layers = 4;
  const radius = 112;
  const step = (Math.PI * 2) / abilities.length;
  let markup = "";

  for (let layer = 1; layer <= layers; layer += 1) {
    const points = abilities.map((_, index) => {
      const angle = -Math.PI / 2 + step * index;
      const point = polarPoint(center, center, (radius / layers) * layer, angle);
      return `${point.x},${point.y}`;
    }).join(" ");
    markup += `<polygon points="${points}" fill="none" stroke="rgba(25,143,137,0.16)" stroke-width="1"></polygon>`;
  }

  abilities.forEach((ability, index) => {
    const angle = -Math.PI / 2 + step * index;
    const outer = polarPoint(center, center, radius, angle);
    const label = polarPoint(center, center, radius + 26, angle);
    markup += `<line x1="${center}" y1="${center}" x2="${outer.x}" y2="${outer.y}" stroke="rgba(31,41,51,0.12)"></line>`;
    markup += `<text x="${label.x}" y="${label.y}" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-size="12">${ability.label}</text>`;
  });

  const dataPoints = abilities.map((ability, index) => {
    const angle = -Math.PI / 2 + step * index;
    const point = polarPoint(center, center, radius * (ability.value / 100), angle);
    return `${point.x},${point.y}`;
  }).join(" ");

  markup += `<polygon points="${dataPoints}" fill="rgba(212,106,76,0.22)" stroke="#d46a4c" stroke-width="3"></polygon>`;

  abilities.forEach((ability, index) => {
    const angle = -Math.PI / 2 + step * index;
    const point = polarPoint(center, center, radius * (ability.value / 100), angle);
    markup += `<circle cx="${point.x}" cy="${point.y}" r="5" fill="#198f89" stroke="white" stroke-width="2"></circle>`;
  });

  svg.innerHTML = markup;
}

function renderSparkline(progress) {
  const sparkline = document.getElementById("progress-sparkline");
  sparkline.innerHTML = progress.map((value) => `<i style="height:${Math.max(18, value * 0.72)}px"></i>`).join("");
}

function renderInfoList(elementId, items, className) {
  const element = document.getElementById(elementId);
  element.innerHTML = items.map((item) => `<div class="${className}"><strong>${item}</strong></div>`).join("");
}

function renderStudentProfile() {
  const student = students[currentIndex];
  document.getElementById("student-name").textContent = student.name;
  document.getElementById("student-grade").textContent = student.grade;
  document.getElementById("student-goal").textContent = student.goal;
  document.getElementById("student-summary").textContent = student.summary;
  document.getElementById("student-score").textContent = student.score;
  document.getElementById("parent-note").textContent = student.parentNote;
  document.getElementById("risk-badge").textContent = student.risk;

  renderRadar(student.abilities);
  renderSparkline(student.progress);
  renderInfoList("insight-list", student.insights, "insight-item");
  renderInfoList("task-list", student.tasks, "task-item");
}

function setPanel(panelId) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.panel === panelId);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === panelId);
  });
}

function appendChat(role, title, body) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
  chatWindowEl.appendChild(bubble);
}

function initCopilot() {
  chatWindowEl.innerHTML = "";
  appendChat("user", "老师", "请根据这位学生最近的做题和出勤情况，帮我总结主要问题。");
  appendChat("ai", "AI 助手", "当前最值得关注的是审题速度和稳定性。建议下一节课优先做限时审题训练，并把错题原因整理成家长可理解的语言。");
}

function getQuizSetForStudent(student) {
  return quizTemplates.map((template, index) => ({
    ...template,
    question: `${index + 1}. ${template.question} (${student.name})`
  }));
}

function renderQuiz() {
  const student = students[currentIndex];
  const questions = getQuizSetForStudent(student);
  document.getElementById("quiz-student-name").textContent = student.name;

  quizFormEl.innerHTML = questions.map((question) => {
    if (question.type === "choice") {
      return `
        <div class="quiz-card">
          <p><strong>${question.question}</strong></p>
          <div class="quiz-options">
            ${question.choices.map((choice) => `
              <label class="quiz-option">
                <input type="radio" name="${question.id}" value="${choice}">
                <span>${choice}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }

    return `
      <div class="quiz-card">
        <label>
          <p><strong>${question.question}</strong></p>
          <input class="quiz-input" type="text" name="${question.id}" placeholder="请输入答案">
        </label>
      </div>
    `;
  }).join("");

  if (!student.quizCompleted) {
    document.getElementById("quiz-score").textContent = "-";
    document.getElementById("quiz-score-note").textContent = "提交后会自动生成结果";
    document.getElementById("quiz-result-tag").textContent = "等待提交";
    quizFeedbackEl.innerHTML = "";
  } else {
    renderQuizResult(student.quizScore, student.quizFeedback);
  }
}

function renderQuizResult(score, feedback) {
  document.getElementById("quiz-score").textContent = `${score} / 100`;
  document.getElementById("quiz-score-note").textContent = "这次结果已经同步到学习进度与诊断。";
  document.getElementById("quiz-result-tag").textContent = score >= 80 ? "表现良好" : "需要跟进";
  quizFeedbackEl.innerHTML = feedback.map((item) => `<div class="insight-item"><strong>${item.title}</strong><p>${item.body}</p></div>`).join("");
}

function updateStudentFromQuiz(student, score, questionResults) {
  student.quizCompleted = true;
  student.quizScore = score;
  student.progress = [...student.progress.slice(1), score];
  student.score = Math.round((student.score * 0.7) + (score * 0.3));

  const wrongAbilities = questionResults
    .filter((result) => !result.correct)
    .map((result) => result.abilityIndex);

  wrongAbilities.forEach((index) => {
    student.abilities[index].value = Math.max(40, student.abilities[index].value - 6);
  });

  if (wrongAbilities.length === 0) {
    student.abilities[3].value = Math.min(95, student.abilities[3].value + 3);
    student.abilities[4].value = Math.min(95, student.abilities[4].value + 2);
  }

  student.risk = calculateRisk(student);

  const weakAreas = questionResults
    .filter((result) => !result.correct)
    .map((result) => result.label);

  if (weakAreas.length === 0) {
    student.summary = `最近在线做题表现稳定，本次得分 ${score} 分，说明基础掌握较好，可以逐步提高题目难度。`;
    student.parentNote = `本次在线练习得分 ${score} 分，学生状态稳定，建议继续保持做题节奏，并开始挑战更高阶题型。`;
    student.insights = [
      "本次做题没有出现明显知识断点。",
      "可以将基础题时间压缩，开始增加迁移题训练。",
      "家长端适合强调“孩子在稳步进步”。"
    ];
    student.tasks = [
      "下节课加入 2 题更高阶题目。",
      "生成一份进步型家长反馈。",
      "记录为本周正向样本。"
    ];
    student.quizFeedback = [
      { title: "自动评分完成", body: "本次答题整体稳定，系统已将结果计入学习进度。" },
      { title: "建议", body: "适合把课堂重点从基础巩固转向中等难度迁移题。" }
    ];
    return;
  }

  student.summary = `最近在线做题得分 ${score} 分，系统识别出主要薄弱点为 ${weakAreas.join("、")}，建议下一次辅导围绕这些点进行针对性讲解。`;
  student.parentNote = `本次在线练习得分 ${score} 分，主要卡点在 ${weakAreas.join("、")}。建议近期先做针对性补强，不必盲目增加题量。`;
  student.insights = [
    `本次做题暴露出 ${weakAreas.join("、")} 的理解不稳定。`,
    "在线做题结果已经自动沉淀到学生画像中。",
    "老师可以直接基于系统结论准备下一次个别辅导。"
  ];
  student.tasks = [
    `优先补强 ${weakAreas[0]} 相关题型。`,
    "生成一份更具体的家长反馈。",
    "安排下一节课前的短测复盘。"
  ];
  student.quizFeedback = [
    { title: "自动评分完成", body: `本次得分 ${score} 分，系统已识别出 ${weakAreas.join("、")} 的薄弱表现。` },
    { title: "下一步建议", body: "建议老师下节课先做错题复盘，再安排 3 到 5 题针对性训练。" }
  ];
}

function scoreQuiz() {
  const student = students[currentIndex];
  const questions = getQuizSetForStudent(student);
  const formData = new FormData(quizFormEl);

  const questionResults = questions.map((question) => {
    const raw = (formData.get(question.id) || "").toString().trim();
    const normalized = raw.replace(/\s+/g, "").toLowerCase();
    const answer = question.answer.replace(/\s+/g, "").toLowerCase();
    const correct = normalized === answer;

    return {
      label: question.explanation,
      abilityIndex: question.abilityIndex,
      correct
    };
  });

  const correctCount = questionResults.filter((result) => result.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  updateStudentFromQuiz(student, score, questionResults);
  renderQuizResult(score, student.quizFeedback);
  refreshAll(false);
  setPanel("diagnosis");
}

function resetQuiz() {
  quizFormEl.reset();
}

function refreshAll(refreshQuiz = true) {
  updateTopMetrics();
  renderStudentList();
  renderStudentProfile();
  if (refreshQuiz) renderQuiz();
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setPanel(link.dataset.panel));
});

document.getElementById("next-student").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % students.length;
  refreshAll();
});

document.getElementById("simulate-ai").addEventListener("click", () => {
  setPanel("copilot");
  appendChat("ai", "AI 生成结果", `已根据 ${students[currentIndex].name} 最近的出勤、进度和做题表现，生成新的个别辅导建议。`);
});

document.getElementById("submit-quiz").addEventListener("click", scoreQuiz);
document.getElementById("reset-quiz").addEventListener("click", resetQuiz);

document.querySelectorAll(".prompt-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = copilotReplies[button.dataset.prompt];
    appendChat("user", "老师", prompt.user);
    appendChat("ai", "AI 助手", prompt.ai);
  });
});

updateTopMetrics();
renderStudentList();
renderStudentProfile();
renderQuiz();
initCopilot();
