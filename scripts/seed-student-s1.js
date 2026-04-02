require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const storePath = path.join(__dirname, "..", "data", "student-s1.json");

function readStore() {
  return JSON.parse(fs.readFileSync(storePath, "utf8"));
}

async function main() {
  const store = readStore();
  const { student, courses, lessons } = store;

  await prisma.message.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.quizSubmission.deleteMany();
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
