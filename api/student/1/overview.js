const { buildStudentOverview, sendJson } = require("../../../server");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    sendJson(res, 200, await buildStudentOverview(1));
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
};
