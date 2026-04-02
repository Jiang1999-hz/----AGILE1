window.AppViewConfig = {
accounts: {
  student: { name: "佐藤 美咲", roleLabel: "学生", defaultView: "news" },
  teacher: { name: "山田老师", roleLabel: "老师", defaultView: "news" },
  admin: { name: "塾长 Admin", roleLabel: "管理员", defaultView: "news" }
},

roleMenus: {
  student: [
    { id: "news", label: "塾 News" },
    { id: "student-inbox", label: "Checklist" },
    { id: "student-calendar", label: "课程日历" },
    { id: "student-quiz", label: "在线做题" },
    { id: "student-progress", label: "我的学习情况" },
    { id: "student-teacher", label: "和老师沟通" },
    { id: "student-ai", label: "和 AI 沟通" }
  ],
  teacher: [
    { id: "news", label: "塾 News" },
    { id: "teacher-inbox", label: "Checklist" },
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
},

pageTitles: {
  news: "塾 News",
  "student-inbox": "Checklist",
  "student-calendar": "我的课程日历",
  "student-quiz": "学生在线做题",
  "student-progress": "我的学习情况",
  "student-teacher": "和老师沟通",
  "student-ai": "和 AI 沟通",
  "teacher-inbox": "Checklist",
  "teacher-calendar": "老师课程日历",
  "teacher-db": "老师学生数据库",
  "teacher-student": "学生详情与反馈",
  "teacher-ai": "老师教学助手",
  "admin-dashboard": "Admin 经营概览",
  "admin-classes": "班级与老师",
  "admin-billing": "缴费与预警",
  "admin-settings": "系统配置"
}
};
