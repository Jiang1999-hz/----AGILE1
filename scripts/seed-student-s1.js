require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const storePath = path.join(__dirname, "..", "data", "student-s1.json");
const questionBankPath = path.join(__dirname, "..", "data", "question-bank.json");
const quizCatalogPath = path.join(__dirname, "..", "data", "quiz-catalog.json");

function readStore() {
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
}

function readQuestionBank() {
  return JSON.parse(fs.readFileSync(questionBankPath, "utf8"));
}

function readQuizCatalog() {
  return JSON.parse(fs.readFileSync(quizCatalogPath, "utf8"));
}

function buildExplanation(subject, topic, level, index, answer) {
  return {
    assetType: index % 3 === 0 ? "video" : index % 3 === 1 ? "image" : "text",
    assetLabel: `${subject.label} · ${topic.label} · ${level.label} 讲解`,
    assetUrl: `demo://quiz/${subject.id}/${topic.id}/${level.id}/${index}`,
    summary: `老师会先用标准方法讲清 ${topic.label} 这个知识点，再让学生围绕具体步骤提问。`,
    steps: [
      { line: "第 1 行", title: "定位知识点", detail: `先确认这题属于 ${topic.label}，避免一开始就用错方法。` },
      { line: "第 2 行", title: "按标准流程拆解", detail: `按照老师事先准备的 ${level.label} 解题流程，一步一步往下做。` },
      { line: "第 3 行", title: "回看答案与错因", detail: `标准答案是 ${answer}。如果出错，要记录是概念问题还是步骤问题。` }
    ],
    followUp: "看完后可以继续追问“第 2 行是什么意思”或者“为什么这里要这样判断”。"
  };
}

function buildGeneratedQuestion(subject, topic, level, index) {
  const prefix = `${subject.label} · ${topic.label} · ${level.label}`;

  if (subject.id.startsWith("math")) {
    const base = level.id === "basic" ? 2 : level.id === "intermediate" ? 4 : 6;
    const x = base + index;
    const answer = String(x);
    return {
      id: `${subject.id}-${topic.id}-${level.id}-${index}`,
      subjectId: subject.id,
      topicId: topic.id,
      levelId: level.id,
      abilityIndex: 0,
      type: "text",
      question: `${prefix} 第 ${index + 1} 题：若 x + ${base + 1} = ${x + base + 1}，求 x。`,
      answer,
      explanation: buildExplanation(subject, topic, level, index, answer),
      choices: []
    };
  }

  const choiceSets = {
    japanese: {
      reading: ["概括段落中心", "列举细节", "解释单词", "说明顺序"],
      grammar: ["根据句子关系选助词", "跳过助词", "只看最后一个词", "只看标点"],
      vocab: ["结合语境判断词义", "死记单个中文义", "忽略上下文", "随机选择"]
    },
    english: {
      reading: ["Find the main idea", "Memorize one sentence only", "Ignore the title", "Translate every word"],
      grammar: ["Check tense and sentence structure", "Only look at the last word", "Guess by length", "Skip the subject"],
      vocab: ["Use context to infer meaning", "Choose the shortest option", "Ignore collocation", "Match by pronunciation"]
    },
    science: {
      physics: ["先判断受力或条件关系", "直接背答案", "只看数字大小", "跳过图示"],
      chemistry: ["先判断物质和反应类型", "先猜结论", "忽略实验现象", "只看颜色"],
      biology: ["先看结构与功能对应", "只记一个名词", "忽略过程顺序", "只看图大小"]
    },
    humanities: {
      history: ["先抓背景再看影响", "只记年份", "忽略材料立场", "只选最长选项"],
      geography: ["先看图表信息再判断", "只背地名", "忽略气候条件", "跳过比例尺"],
      civics: ["先分清观点和依据", "只看态度词", "忽略制度背景", "按直觉选择"]
    }
  };

  const choices = (choiceSets[subject.id] && choiceSets[subject.id][topic.id]) || ["先定位核心信息", "直接猜", "跳过条件", "只看表面词"];
  const answer = choices[0];
  return {
    id: `${subject.id}-${topic.id}-${level.id}-${index}`,
    subjectId: subject.id,
    topicId: topic.id,
    levelId: level.id,
    abilityIndex: 0,
    type: "choice",
    question: `${prefix} 第 ${index + 1} 题：这类题最合理的第一步是什么？`,
    choices,
    answer,
    explanation: buildExplanation(subject, topic, level, index, answer)
  };
}

function buildGeneratedQuestionBank(catalog) {
  const generated = [];
  for (const subject of catalog.subjects) {
    for (const topic of subject.topics) {
      for (const level of catalog.levels) {
        for (let index = 0; index < 8; index += 1) {
          generated.push(buildGeneratedQuestion(subject, topic, level, index));
        }
      }
    }
  }
  return generated;
}

async function main() {
  const store = readStore();
  const questionBank = readQuestionBank();
  const quizCatalog = readQuizCatalog();
  const generatedQuestionBank = buildGeneratedQuestionBank(quizCatalog);
  const { student, courses, lessons } = store;

  await prisma.message.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.questionExplanationStep.deleteMany();
  await prisma.questionExplanation.deleteMany();
  await prisma.questionChoice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionTopic.deleteMany();
  await prisma.questionSubject.deleteMany();
  await prisma.studentAbility.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.studentCourse.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();

  const createdStudent = await prisma.student.create({
    data: {
      id: student.id,
      name: student.name,
      grade: student.grade,
      groupName: student.group,
      goal: student.goal,
      score: student.score,
      attendance: student.attendance,
      risk: student.risk,
      summary: student.summary,
      parentNote: student.parentNote,
      teacherFeedback: student.teacherFeedback
    }
  });

  await prisma.studentAbility.createMany({
    data: student.abilities.map((ability) => ({
      studentId: createdStudent.id,
      label: ability.label,
      value: ability.value
    }))
  });

  await prisma.quizSubmission.createMany({
    data: student.quizHistory.map((item) => ({
      studentId: createdStudent.id,
      name: item.name,
      score: item.score,
      note: item.note,
      dateLabel: item.date
    }))
  });

  await prisma.message.createMany({
    data: [
      ...student.teacherMessages.map((item) => ({
        studentId: createdStudent.id,
        channel: "teacher",
        fromRole: item.from,
        title: item.title,
        body: item.body,
        timeLabel: item.time
      })),
      ...student.aiMessages.map((item) => ({
        studentId: createdStudent.id,
        channel: "ai",
        fromRole: item.from,
        title: item.title,
        body: item.body,
        timeLabel: item.time
      }))
    ]
  });

  for (const course of courses) {
    await prisma.course.create({
      data: {
        id: course.id,
        title: course.title,
        subject: course.subject,
        totalLessons: course.totalLessons,
        completedLessons: course.completedLessons,
        nextLessonAt: course.nextLesson,
        schedule: course.schedule,
        teacherName: course.teacher
      }
    });

    await prisma.studentCourse.create({
      data: {
        studentId: createdStudent.id,
        courseId: course.id
      }
    });
  }

  for (const lesson of lessons) {
    const course = courses.find((item) => item.lessonIds.includes(lesson.id));
    if (!course) continue;

    await prisma.lesson.create({
      data: {
        id: lesson.id,
        courseId: course.id,
        dateLabel: lesson.date,
        weekday: lesson.weekday,
        timeLabel: lesson.time,
        title: lesson.title,
        ppt: lesson.ppt,
        notes: lesson.notes,
        completion: lesson.completion,
        understanding: lesson.understanding,
        homeworkStatus: lesson.homeworkStatus,
        requiresHomework: lesson.requiresHomework !== false,
        wrongCount: lesson.wrongCount,
        metrics: lesson.metrics,
        highlights: lesson.highlights,
        mistakes: lesson.mistakes
      }
    });
  }

  for (const item of student.homework) {
    await prisma.homework.create({
      data: {
        studentId: createdStudent.id,
        lessonId: item.title.includes("一次函数") ? "lesson-1" : null,
        title: item.title,
        status: item.status,
        score: item.score,
        content: null,
        dateLabel: item.date
      }
    });
  }

  for (const subject of quizCatalog.subjects) {
    await prisma.questionSubject.create({
      data: {
        id: subject.id,
        label: subject.label,
        shortLabel: subject.shortLabel,
        accent: subject.accent,
        description: subject.description,
        mapTitle: subject.mapTitle
      }
    });

    for (const topic of subject.topics) {
      await prisma.questionTopic.create({
        data: {
          id: topic.id,
          subjectId: subject.id,
          label: topic.label,
          summary: topic.summary,
          keywords: topic.keywords
        }
      });
    }
  }

  const allQuestions = [
    ...generatedQuestionBank,
    ...questionBank.questions.map((question) => ({
      ...question,
      subjectId: question.subjectId || "math1",
      topicId: question.topicId || "equation",
      levelId: question.levelId || "basic"
    }))
  ];

  for (const question of allQuestions) {
    await prisma.question.create({
      data: {
        id: question.id,
        subjectId: question.subjectId,
        topicId: question.topicId,
        levelId: question.levelId,
        abilityIndex: question.abilityIndex,
        type: question.type,
        prompt: question.question,
        answer: question.answer,
        blankLabels: question.blankLabels || undefined,
        choices: {
          create: (question.choices || []).map((choice, index) => ({
            label: choice,
            sortOrder: index
          }))
        },
        explanation: question.explanation ? {
          create: {
            assetType: question.explanation.assetType,
            assetLabel: question.explanation.assetLabel,
            assetUrl: question.explanation.assetUrl || null,
            summary: question.explanation.summary,
            followUp: question.explanation.followUp || null,
            steps: {
              create: (question.explanation.steps || []).map((step, index) => ({
                lineLabel: step.line,
                title: step.title,
                detail: step.detail,
                sortOrder: index
              }))
            }
          }
        } : undefined
      }
    });
  }

  console.log("Student S1 seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
