window.formatScheduleDateLabelRule = function formatScheduleDateLabelRule(date) {
  if (!date) return "待定日期";
  const [year, month, day] = date.split("-").map(Number);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(year, month - 1, day).getDay()];
  return `${month}/${String(day).padStart(2, "0")} ${weekday}`;
};

window.canStudentCancelScheduleRule = function canStudentCancelScheduleRule(schedule) {
  if (!schedule || schedule.status !== "已确认") return false;
  const today = new Date();
  const lessonDate = new Date(`${schedule.date}T00:00:00`);
  const deadline = new Date(lessonDate);
  deadline.setDate(deadline.getDate() - 1);
  return today <= deadline;
};
