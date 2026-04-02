const { readBody, saveQuizSessionSubmission, sendJson } = require("../../../server");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const payload = await readBody(req);
    sendJson(
      res,
      200,
      await saveQuizSessionSubmission(1, payload.questionIds || [], payload.answers || {}, payload.sessionMeta || {})
    );
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
};
