const { getQuizSessionQuestionsFromDb, readBody, sendJson } = require("../../server");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const payload = await readBody(req);
    sendJson(res, 200, {
      questions: await getQuizSessionQuestionsFromDb(payload.subjectId, payload.topicId, payload.levelId, payload.count || 5)
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
};
