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
      .map((item) => ({ date: item.dateLabel, title: item.title, status: item.status, score: item.score })),
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
  return lessons.map((lesson) => ({
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
    homeworkStatus: lesson.homeworks && lesson.homeworks[0] ? lesson.homeworks[0].status : lesson.homeworkStatus,
    wrongCount: lesson.wrongCount,
    metrics: lesson.metrics,
    homeworkContent: lesson.homeworks && lesson.homeworks[0] ? (lesson.homeworks[0].content || "") : "",
    homeworkId: lesson.homeworks && lesson.homeworks[0] ? lesson.homeworks[0].id : null
  }));
}

async function buildStudentOverview(studentId) {
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
    quizTemplates
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
      .map((item) => ({ date: item.dateLabel, title: item.title, status: item.status, score: item.score })),
    progress: student.quizSubmissions.slice(-5).map((item) => item.score)
  };
}

async function saveQuizSubmission(studentId, answers) {
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

  for (const question of quizTemplates) {
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

  const score = Math.round((correct / quizTemplates.length) * 100);
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
    overview: await buildStudentOverview(studentId)
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

  await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      homeworkStatus: "已提交"
    }
  });

  return {
    ok: true,
    overview: await buildStudentOverview(studentId),
    learningRecords: await buildLearningRecords(studentId)
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

  if (req.method === "POST" && pathname === "/api/student/1/quiz-submissions") {
    const payload = await readBody(req);
    sendJson(res, 200, await saveQuizSubmission(1, payload.answers || {}));
    return true;
  }

  if (req.method === "POST" && pathname.startsWith("/api/student/1/lessons/") && pathname.endsWith("/homework")) {
    const lessonId = pathname.split("/")[5];
    const payload = await readBody(req);
    sendJson(res, 200, await submitLessonHomework(1, lessonId, payload.content));
    return true;
  }

  return false;
}

const server = http.createServer(async (req, res) => {
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
});

server.listen(port, () => {
  console.log(`Juku AI S1 running at http://localhost:${port}`);
});
