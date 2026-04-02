require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const root = __dirname;
const port = process.env.PORT || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const quizTemplates = [
  { id: "q1", abilityIndex: 0, type: "text", question: "3x + 5 = 17，x 等于多少？", answer: "4" },
  { id: "q2", abilityIndex: 2, type: "text", question: "一个数加上 8 后再乘 2 等于 26，这个数是多少？", answer: "5" },
  { id: "q3", abilityIndex: 1, type: "choice", question: "主旨句最主要的作用是什么？", choices: ["列举细节", "说明段落中心", "解释词性", "表示顺序"], answer: "说明段落中心" },
  { id: "q4", abilityIndex: 4, type: "choice", question: "一道题做错后最好的下一步是什么？", choices: ["直接跳过", "只看答案", "找错因再做一遍", "等老师再讲"], answer: "找错因再做一遍" }
];

const quizExplanations = {
  q1: {
    assetType: "video",
    assetLabel: "老师讲解视频 03:20",
    summary: "先把常数项移到右边，再把系数消掉，最后检查答案是否满足原式。",
    steps: [
      { line: "第 1 行", title: "移项", detail: "把等式左边的 +5 移到右边，变成 17 - 5，所以得到 3x = 12。" },
      { line: "第 2 行", title: "化简", detail: "17 - 5 等于 12，这一步只是把右边算出来，方便下一步求 x。" },
      { line: "第 3 行", title: "求未知数", detail: "两边同时除以 3，得到 x = 4。最后代回原式检查：3×4+5=17。" }
    ],
    followUp: "看懂后再做一题同类型的移项题，重点练“先移项再除系数”的顺序。"
  },
  q2: {
    assetType: "text",
    assetLabel: "老师图文讲解",
    summary: "先把题意翻成式子，再按运算顺序倒推，避免一上来就乱列式。",
    steps: [
      { line: "第 1 行", title: "设未知数", detail: "设这个数是 x。" },
      { line: "第 2 行", title: "翻译题意", detail: "“加上 8 后再乘 2 等于 26” 可以写成 2(x+8)=26。" },
      { line: "第 3 行", title: "解方程", detail: "先两边除以 2 得到 x+8=13，再减去 8，得到 x=5。" }
    ],
    followUp: "如果总把“先加后乘”写反，可以先在纸上画一个运算顺序箭头再列式。"
  },
  q3: {
    assetType: "image",
    assetLabel: "主旨句判断示意图",
    summary: "主旨句的作用是概括整段的中心意思，不是罗列细节。",
    steps: [
      { line: "第 1 行", title: "先看整段", detail: "先判断段落到底在围绕哪个核心意思展开。" },
      { line: "第 2 行", title: "排除细节选项", detail: "如果某个选项只提到例子或单个信息点，它通常不是主旨。" },
      { line: "第 3 行", title: "选最能概括全段的选项", detail: "能覆盖整段核心意思的那个选项，才更接近主旨句的作用。" }
    ],
    followUp: "下次做阅读时，先用一句自己的话概括段落中心，再去看选项。"
  },
  q4: {
    assetType: "text",
    assetLabel: "错题复盘模板",
    summary: "做错后最有效的下一步不是跳过，而是找出错因并再做一题同类题。",
    steps: [
      { line: "第 1 行", title: "标记错因", detail: "先弄清楚是概念没懂、审题失误，还是步骤粗心。" },
      { line: "第 2 行", title: "回看标准解法", detail: "对照老师给的解题步骤，找到自己从哪一步开始偏掉。" },
      { line: "第 3 行", title: "立即再做一题", detail: "做一题同类题，确认你是真的理解了，而不是只看懂答案。" }
    ],
    followUp: "把这道题加入错题本时，最好同时写一句“我为什么会错”。"
  }
};

function enrichQuizTemplate(question) {
  return {
    ...question,
    explanation: question.explanation || quizExplanations[question.id] || null
  };
}

function buildQuizReview(answers, sourceQuestions) {
  const questions = sourceQuestions.map((question) => {
    const rawAnswer = String(answers[question.id] || "").trim();
    const normalizedRaw = rawAnswer.replace(/\s+/g, "").toLowerCase();
    const normalizedAnswer = String(question.answer || "").trim().replace(/\s+/g, "").toLowerCase();
    const correct = normalizedRaw === normalizedAnswer;
    return {
      id: question.id,
      question: question.question,
      type: question.type,
      studentAnswer: rawAnswer || "未作答",
      correctAnswer: question.answer,
      correct,
      explanation: question.explanation || quizExplanations[question.id] || null
    };
  });

  return {
    correctCount: questions.filter((item) => item.correct).length,
    wrongCount: questions.filter((item) => !item.correct).length,
    questions,
    wrongQuestions: questions.filter((item) => !item.correct)
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

let cachedQuestionBank = null;

function loadQuestionBankFromFile() {
  try {
    const raw = fs.readFileSync(path.join(root, "data", "question-bank.json"), "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.questions) && parsed.questions.length) {
      return parsed;
    }
  } catch (error) {
  }

  return {
    questions: quizTemplates.map((question) => ({
      ...question,
      explanation: quizExplanations[question.id] || null
    }))
  };
}

function getQuestionBank() {
  if (!cachedQuestionBank) {
    cachedQuestionBank = loadQuestionBankFromFile();
  }
  return cachedQuestionBank;
}

function getQuizQuestions() {
  return getQuestionBank().questions || [];
}

function normalizeQuestionRecord(record) {
  return {
    id: record.id,
    abilityIndex: record.abilityIndex,
    type: record.type,
    question: record.prompt,
    choices: (record.choices || [])
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((choice) => choice.label),
    answer: record.answer,
    explanation: record.explanation ? {
      assetType: record.explanation.assetType,
      assetLabel: record.explanation.assetLabel,
      assetUrl: record.explanation.assetUrl,
      summary: record.explanation.summary,
      followUp: record.explanation.followUp,
      steps: (record.explanation.steps || [])
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((step) => ({
          line: step.lineLabel,
          title: step.title,
          detail: step.detail
        }))
    } : null
  };
}

async function getQuizQuestionsFromDb() {
  const questionRecords = await prisma.question.findMany({
    where: { active: true },
    include: {
      choices: true,
      explanation: {
        include: {
          steps: true
        }
      }
    },
    orderBy: { id: "asc" }
  });

  if (!questionRecords.length) {
    return getQuizQuestions();
  }

  return questionRecords.map(normalizeQuestionRecord);
}

async function getQuizCatalogFromDb() {
  const subjects = await prisma.questionSubject.findMany({
    include: {
      topics: true,
      questions: {
        where: { active: true },
        select: { levelId: true }
      }
    },
    orderBy: { id: "asc" }
  });

  if (!subjects.length) {
    const fallbackCatalog = (() => {
      const localCatalog = path.join(root, "data", "quiz-catalog.json");
      try {
        return JSON.parse(fs.readFileSync(localCatalog, "utf8"));
      } catch (error) {
        return { subjects: [], levels: [] };
      }
    })();
    return fallbackCatalog;
  }

  const levelMeta = {
    basic: { id: "basic", label: "初级", description: "先把基础概念和典型题型做稳。" },
    intermediate: { id: "intermediate", label: "中级", description: "加入变化题和多一步判断。" },
    advanced: { id: "advanced", label: "高级", description: "接近考试实战，强调综合与速度。" }
  };

  const usedLevels = new Set();

  return {
    levels: Object.values(levelMeta),
    subjects: subjects.map((subject) => {
      subject.questions.forEach((item) => usedLevels.add(item.levelId));
      return {
        id: subject.id,
        label: subject.label,
        shortLabel: subject.shortLabel,
        accent: subject.accent,
        description: subject.description,
        mapTitle: subject.mapTitle,
        topics: subject.topics
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((topic) => ({
            id: topic.id,
            label: topic.label,
            summary: topic.summary,
            keywords: Array.isArray(topic.keywords) ? topic.keywords : topic.keywords
          }))
      };
    })
  };
}

async function getQuizSessionQuestionsFromDb(subjectId, topicId, levelId, count) {
  const questionRecords = await prisma.question.findMany({
    where: {
      active: true,
      subjectId,
      topicId,
      levelId
    },
    include: {
      choices: true,
      explanation: {
        include: {
          steps: true
        }
      }
    }
  });

  const normalized = questionRecords.map(normalizeQuestionRecord);
  const featured = normalized.filter((item) => item.id.startsWith("eju-"));
  const others = normalized.filter((item) => !item.id.startsWith("eju-"));
  const shuffled = others
    .map((item) => ({ sortKey: Math.random(), item }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((entry) => entry.item);

  return [...featured, ...shuffled].slice(0, count || 5);
}

function transformStudent(student) {
  return {
    id: student.id,
    name: student.name,
    grade: student.grade,
    group: student.groupName,
    goal: student.goal,
    score: student.score,
    attendance: student.attendance,
    progress: student.quizSubmissions.slice(-5).map((item) => item.score),
    risk: student.risk,
    summary: student.summary,
    parentNote: student.parentNote,
    teacherFeedback: student.teacherFeedback,
    quizHistory: student.quizSubmissions
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((item) => ({ date: item.dateLabel, name: item.name, score: item.score, note: item.note })),
    homework: student.homeworks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => ({
        id: item.id,
        lessonId: item.lessonId,
        date: item.dateLabel,
        title: item.title,
        status: item.status,
        score: item.score,
        content: item.content || "",
        teacherNote: item.teacherNote || ""
      })),
    teacherMessages: student.messages
      .filter((item) => item.channel === "teacher")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((item) => ({ from: item.fromRole, title: item.title, body: item.body, time: item.timeLabel })),
    aiMessages: student.messages
      .filter((item) => item.channel === "ai")
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((item) => ({ from: item.fromRole, title: item.title, body: item.body, time: item.timeLabel })),
    abilities: student.abilities.map((item) => ({ label: item.label, value: item.value }))
  };
}

function transformCourses(courses) {
  return courses.map((course) => ({
    id: course.id,
    studentIds: course.enrollments.map((item) => item.studentId),
    title: course.title,
    subject: course.subject,
    totalLessons: course.totalLessons,
    completedLessons: course.completedLessons,
    nextLesson: course.nextLessonAt,
    schedule: course.schedule,
    teacher: course.teacherName,
    milestones: [],
    lessonIds: course.lessons.map((lesson) => lesson.id)
  }));
}

function transformLessons(lessons, studentId) {
  return lessons.map((lesson) => {
    const currentHomework = lesson.homeworks && lesson.homeworks[0] ? lesson.homeworks[0] : null;
    const derivedHomeworkStatus = lesson.requiresHomework === false
      ? "无作业"
      : currentHomework
      ? currentHomework.status === "已批改"
        ? "已完成"
        : "已提交"
      : "待开始";
    return {
      id: lesson.id,
      date: lesson.dateLabel,
      weekday: lesson.weekday,
      time: lesson.timeLabel,
      title: lesson.title,
      studentIds: [studentId],
      ppt: lesson.ppt,
      notes: lesson.notes,
      highlights: lesson.highlights,
      mistakes: lesson.mistakes,
      completion: lesson.completion,
      understanding: lesson.understanding,
      requiresHomework: lesson.requiresHomework !== false,
      homeworkStatus: derivedHomeworkStatus,
      wrongCount: lesson.wrongCount,
      metrics: lesson.metrics,
      homeworkContent: currentHomework ? (currentHomework.content || "") : "",
      homeworkId: currentHomework ? currentHomework.id : null
    };
  });
}

async function buildStudentOverview(studentId) {
  const quizQuestions = await getQuizQuestionsFromDb();
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      abilities: true,
      quizSubmissions: true,
      homeworks: true,
      messages: true,
      enrollments: {
        include: {
          course: {
            include: {
              lessons: {
                include: {
                  homeworks: {
                    where: { studentId }
                  }
                }
              },
              enrollments: true
            }
          }
        }
      }
    }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const courses = student.enrollments.map((item) => item.course);
  const lessons = courses.flatMap((course) => course.lessons);

  return {
    student: transformStudent(student),
    courses: transformCourses(courses),
    lessons: transformLessons(lessons, student.id),
    quizTemplates: quizQuestions.map(enrichQuizTemplate)
  };
}

async function buildLearningRecords(studentId) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      quizSubmissions: true,
      homeworks: true
    }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return {
    quizHistory: student.quizSubmissions
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((item) => ({ date: item.dateLabel, name: item.name, score: item.score, note: item.note })),
    homework: student.homeworks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((item) => ({
        id: item.id,
        lessonId: item.lessonId,
        date: item.dateLabel,
        title: item.title,
        status: item.status,
        score: item.score,
        content: item.content || "",
        teacherNote: item.teacherNote || ""
      })),
    progress: student.quizSubmissions.slice(-5).map((item) => item.score)
  };
}

async function saveQuizSubmission(studentId, answers) {
  const quizQuestions = await getQuizQuestionsFromDb();
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      abilities: true,
      quizSubmissions: true
    }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const review = buildQuizReview(answers, quizQuestions);

  let correct = 0;
  const weakLabels = [];

  for (const question of quizQuestions) {
    const raw = String(answers[question.id] || "").trim().replace(/\s+/g, "").toLowerCase();
    const answer = String(question.answer || "").trim().replace(/\s+/g, "").toLowerCase();
    if (raw === answer) {
      correct += 1;
    } else {
      const ability = student.abilities.find((item, index) => index === question.abilityIndex);
      if (ability) {
        weakLabels.push(ability.label);
        await prisma.studentAbility.update({
          where: { id: ability.id },
          data: { value: Math.max(40, ability.value - 5) }
        });
      }
    }
  }

  const score = Math.round((correct / Math.max(1, quizQuestions.length)) * 100);
  const uniqueWeakLabels = [...new Set(weakLabels)];
  const note = uniqueWeakLabels.length ? `主要薄弱点: ${uniqueWeakLabels.join("、")}` : "整体稳定，可增加难度";
  const nextScore = Math.round(student.score * 0.75 + score * 0.25);
  const nextRisk = nextScore < 75 || student.attendance < 80 ? "高风险" : nextScore < 85 ? "中风险" : "低风险";
  const nextSummary = uniqueWeakLabels.length
    ? `刚完成在线做题，系统识别出 ${uniqueWeakLabels.join("、")} 需要补强。`
    : "刚完成在线做题，整体稳定，适合进入更高阶训练。";
  const nextTeacherFeedback = uniqueWeakLabels.length
    ? `建议下节课优先复盘 ${uniqueWeakLabels.join("、")} 相关题型，再安排短练。`
    : "建议提高题目难度，并观察迁移题表现。";
  const nextParentNote = uniqueWeakLabels.length
    ? `本次在线做题 ${score} 分，主要卡点在 ${uniqueWeakLabels.join("、")}，建议先针对性补强。`
    : `本次在线做题 ${score} 分，基础表现稳定，可逐步增加难度。`;

  await prisma.quizSubmission.create({
    data: {
      studentId,
      name: "在线练习",
      score,
      note,
      dateLabel: "2026-04-01"
    }
  });

  await prisma.homework.create({
    data: {
      studentId,
      title: "在线练习",
      status: "已提交",
      score,
      dateLabel: "2026-04-01"
    }
  });

  await prisma.message.create({
    data: {
      studentId,
      channel: "teacher",
      fromRole: "teacher",
      title: "系统通知",
      body: `已收到你的在线做题结果：${score} 分。老师会根据结果调整下次辅导。`,
      timeLabel: "刚刚"
    }
  });

  await prisma.student.update({
    where: { id: studentId },
    data: {
      score: nextScore,
      risk: nextRisk,
      summary: nextSummary,
      teacherFeedback: nextTeacherFeedback,
      parentNote: nextParentNote
    }
  });

  return {
    ok: true,
    score,
    note,
    review,
    overview: await buildStudentOverview(studentId)
  };
}

async function saveQuizSessionSubmission(studentId, questionIds, answers, sessionMeta) {
  const quizQuestions = await prisma.question.findMany({
    where: {
      id: { in: questionIds || [] },
      active: true
    },
    include: {
      choices: true,
      explanation: {
        include: {
          steps: true
        }
      }
    }
  });

  const normalizedQuestions = quizQuestions.map(normalizeQuestionRecord);
  const review = buildQuizReview(answers, normalizedQuestions);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      abilities: true,
      quizSubmissions: true
    }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  let correct = 0;
  const weakLabels = [];

  for (const question of normalizedQuestions) {
    const raw = String(answers[question.id] || "").trim().replace(/\s+/g, "").toLowerCase();
    const answer = String(question.answer || "").trim().replace(/\s+/g, "").toLowerCase();
    if (raw === answer) {
      correct += 1;
    } else {
      const ability = student.abilities.find((item, index) => index === question.abilityIndex);
      if (ability) {
        weakLabels.push(ability.label);
        await prisma.studentAbility.update({
          where: { id: ability.id },
          data: { value: Math.max(40, ability.value - 3) }
        });
      }
    }
  }

  const score = Math.round((correct / Math.max(1, normalizedQuestions.length)) * 100);
  const uniqueWeakLabels = [...new Set(weakLabels)];
  const label = [sessionMeta?.subjectLabel, sessionMeta?.topicLabel, sessionMeta?.levelLabel].filter(Boolean).join(" · ") || "在线练习";
  const note = uniqueWeakLabels.length ? `主要薄弱点 ${uniqueWeakLabels.join(" / ")}` : `${label} 表现稳定`;
  const nextScore = Math.round(student.score * 0.75 + score * 0.25);
  const nextRisk = nextScore < 75 || student.attendance < 80 ? "楂橀闄?" : nextScore < 85 ? "涓闄?" : "浣庨闄?";

  await prisma.quizSubmission.create({
    data: {
      studentId,
      name: label,
      score,
      note,
      dateLabel: "2026-04-02"
    }
  });

  await prisma.student.update({
    where: { id: studentId },
    data: {
      score: nextScore,
      risk: nextRisk,
      summary: uniqueWeakLabels.length ? `刚完成 ${label} 练习，当前主要卡点集中在 ${uniqueWeakLabels.join(" / ")}。` : `刚完成 ${label} 练习，整体表现稳定。`,
      teacherFeedback: uniqueWeakLabels.length ? `建议下次课优先复盘 ${label} 的错题步骤。` : `可以继续推进到更高难度的 ${label} 题型。`,
      parentNote: uniqueWeakLabels.length ? `本轮 ${label} 练习中出现了 ${review.wrongCount} 道错题，建议先看老师标准讲解再追问。` : `本轮 ${label} 练习表现较稳，可以继续挑战下一组题。`
    }
  });

  return {
    ok: true,
    score,
    review,
    overview: await buildStudentOverview(studentId),
    learningRecords: await buildLearningRecords(studentId)
  };
}

async function submitLessonHomework(studentId, lessonId, content) {
  const trimmedContent = String(content || "").trim();
  if (!trimmedContent) {
    throw new Error("Homework content is required");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      homeworks: {
        where: { studentId }
      }
    }
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.homeworks[0]) {
    await prisma.homework.update({
      where: { id: lesson.homeworks[0].id },
      data: {
        status: "已提交",
        content: trimmedContent,
        dateLabel: "2026-04-01"
      }
    });
  } else {
    await prisma.homework.create({
      data: {
        studentId,
        lessonId,
        title: `${lesson.title} 课后作业`,
        status: "已提交",
        score: null,
        content: trimmedContent,
        dateLabel: "2026-04-01"
      }
    });
  }

  return {
    ok: true,
    overview: await buildStudentOverview(studentId),
    learningRecords: await buildLearningRecords(studentId)
  };
}

async function reviewHomework(studentId, homeworkId, score, teacherNote) {
  const numericScore = Number(score);
  if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
    throw new Error("Homework score must be between 0 and 100");
  }

  const homework = await prisma.homework.findFirst({
    where: { id: homeworkId, studentId }
  });

  if (!homework) {
    throw new Error("Homework not found");
  }

  await prisma.homework.update({
    where: { id: homeworkId },
    data: {
      score: Math.round(numericScore),
      status: "已批改",
      teacherNote: String(teacherNote || "").trim()
    }
  });

  return {
    ok: true,
    overview: await buildStudentOverview(studentId),
    learningRecords: await buildLearningRecords(studentId)
  };
}

async function setLessonHomeworkPolicy(lessonId, requiresHomework) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId }
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      requiresHomework: Boolean(requiresHomework)
    }
  });

  return {
    ok: true,
    overview: await buildStudentOverview(1),
    learningRecords: await buildLearningRecords(1)
  };
}

async function handleStudentApi(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/api/student/1/overview") {
    sendJson(res, 200, await buildStudentOverview(1));
    return true;
  }

  if (req.method === "GET" && pathname === "/api/student/1/learning-records") {
    sendJson(res, 200, await buildLearningRecords(1));
    return true;
  }

  if (req.method === "GET" && pathname === "/api/quiz/catalog") {
    sendJson(res, 200, await getQuizCatalogFromDb());
    return true;
  }

  if (req.method === "POST" && pathname === "/api/quiz/session") {
    const payload = await readBody(req);
    sendJson(res, 200, {
      questions: await getQuizSessionQuestionsFromDb(payload.subjectId, payload.topicId, payload.levelId, payload.count || 5)
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/student/1/quiz-submissions") {
    const payload = await readBody(req);
    sendJson(res, 200, await saveQuizSubmission(1, payload.answers || {}));
    return true;
  }

  if (req.method === "POST" && pathname === "/api/student/1/quiz-session-submissions") {
    const payload = await readBody(req);
    sendJson(res, 200, await saveQuizSessionSubmission(1, payload.questionIds || [], payload.answers || {}, payload.sessionMeta || {}));
    return true;
  }

  if (req.method === "POST" && pathname.startsWith("/api/student/1/lessons/") && pathname.endsWith("/homework")) {
    const lessonId = pathname.split("/")[5];
    const payload = await readBody(req);
    sendJson(res, 200, await submitLessonHomework(1, lessonId, payload.content));
    return true;
  }

  if (req.method === "POST" && pathname.startsWith("/api/teacher/students/") && pathname.endsWith("/review")) {
    const parts = pathname.split("/");
    const studentId = Number(parts[4]);
    const homeworkId = Number(parts[6]);
    const payload = await readBody(req);
    sendJson(res, 200, await reviewHomework(studentId, homeworkId, payload.score, payload.teacherNote));
    return true;
  }

  if (req.method === "POST" && pathname.startsWith("/api/teacher/lessons/") && pathname.endsWith("/homework-policy")) {
    const parts = pathname.split("/");
    const lessonId = parts[4];
    const payload = await readBody(req);
    sendJson(res, 200, await setLessonHomeworkPolicy(lessonId, payload.requiresHomework));
    return true;
  }

  return false;
}

async function appHandler(req, res) {
  try {
    if (req.url.startsWith("/api/")) {
      const handled = await handleStudentApi(req, res);
      if (!handled) {
        sendJson(res, 404, { error: "Not found" });
      }
      return;
    }

    const requestPath = req.url === "/" ? "/index.html" : req.url;
    const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, safePath);

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8" });
      res.end(content);
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
}

module.exports = {
  appHandler,
  sendJson,
  readBody,
  buildStudentOverview,
  buildLearningRecords,
  getQuizCatalogFromDb,
  getQuizSessionQuestionsFromDb,
  saveQuizSessionSubmission
};

if (require.main === module) {
  const server = http.createServer(appHandler);
  server.listen(port, () => {
    console.log(`Juku AI S1 running at http://localhost:${port}`);
  });
}
