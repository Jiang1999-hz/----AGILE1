window.createInitialState = function createInitialState() {
  return {
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
    teacherReviewDrafts: {},
    teacherReviewSavingId: null,
    teacherLessonPolicySavingId: null,
    teacherScheduleDraft: {
      title: "1v1 个别指導",
      date: "2026-04-10",
      time: "19:30-20:30",
      location: "线上 Zoom"
    },
    scheduleCancelDrafts: {},
    selectedScheduleId: "schedule-1",
    studentSeenReviews: {},
    studentLearningRecords: null
  };
};
