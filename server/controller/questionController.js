const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Create a question
async function createQuestion(req, res) {
  const { userId, title, description, tag } = req.body;
  if (!userId || !title || !description || !tag) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }

  try {
    await dbConnection.query(
      "INSERT INTO Questions (userId,title,description,tag) VALUES (?,?,?,?)",
      [userId, title, description, tag]
    );
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Question created",
      question: { userId, title, description, tag },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// Get all questions
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`
      SELECT q.questionId, q.userId, q.title, q.description, u.username, q.tag, q.date, u.firstName, u.lastName, u.email
      FROM Questions q
      JOIN Users u ON q.userId = u.userId
      ORDER BY q.date DESC
  `);

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Questions fetched Successfully",
      questions,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// Get Question by QuestionId
async function getQuestionById(req, res) {
  const questionId = req.params.questionId;
  if (!questionId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide questionId" });
  }

  try {
    const [question] = await dbConnection.query(
      `
      SELECT q.questionId, q.userId, q.title, q.description, u.username, q.tag, q.date, u.firstName, u.lastName, u.email
      FROM Questions q
      JOIN Users u ON q.userId = u.userId
      WHERE q.questionId = ?
  `,
      [questionId]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", msg: "Question not found" });
    }

    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "Question fetched Successfully",
      question: question[0],
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}


// For Dashboard Implementation
async function updateQuestion(req, res) {
  const questionId = req.params.questionId;
  const { title, description, tag } = req.body;
  if (!title || !description || !tag) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }

  try {
    await dbConnection.query(
      "UPDATE Questions SET title = ?, description = ?, tag = ? WHERE questionId = ?",
      [title, description, tag, questionId]
    );
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      msg: "Question updated",
      question: { title, description, tag },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// Delete a question
async function deleteQuestion(req, res) {
  const questionId = req.params.questionId;

  try {
    // Check if the question exists before deleting
    const [result] = await dbConnection.query(
      "SELECT * FROM Questions WHERE questionId = ?",
      [questionId]
    );
    if (result.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", msg: "Question not found" });
    }
    await dbConnection.query("DELETE FROM Questions WHERE questionId = ?", [
      questionId,
    ]);

    return res
      .status(StatusCodes.OK)
      .json({ status: "success", msg: "Question deleted", questionId });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}


module.exports = {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  getQuestionById,
  deleteQuestion,
};
