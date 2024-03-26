const connection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Create an answer
async function postAnswer(req, res) {
  const { userId, questionId, answer } = req.body;
  if (!questionId || !userId || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }
  //insert data into answers table
  try {
    await connection.query(
      "INSERT INTO Answers (userId,questionId,answer) VALUES (?,?,?)",
      [userId, questionId, answer]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", msg: "Answer posted", answer });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// TODO:Get all answers By QuestionId
async function getAllAnswersByQuestionId(req, res) {
  // const questionId = req.query.questionId;

  const questionId = req.headers["questionId"];
  try {
    const [answers] = await connection.query(
      `SELECT Users.username, Answers.answer
    FROM Answers
    JOIN Users ON Answers.userId = Users.userId
    WHERE Answers.questionId = ? ORDER BY Answers.date DESC
    `,
      [questionId]
    );
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "all answers retrieved successfully",
      answers,
      questionId,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// For Dashboard Implementation

//Get All Answers
async function getAllAnswers(req, res) {
  try {
    const [answers] = await connection.query(
      `SELECT Users.username, Answers.answer, Questions.title, Answers.date, Users.userId, Answers.answerId, Questions.questionId,Users.firstName, Users.lastName, Users.email
       FROM Answers
       JOIN Users ON Answers.userId = Users.userId
       JOIN Questions ON Answers.questionId = Questions.questionId
      `
    );
    return res.status(StatusCodes.OK).json({
      status: "success",
      msg: "All answers retrieved successfully",
      answers,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

// Update an answer
async function updateAnswer(req, res) {
  const answerId = req.params.answerId;
  const { answer } = req.body;

  if (!answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "fail", msg: "Please provide all required fields" });
  }

  try {
    await connection.query("UPDATE Answers SET answer = ? WHERE answerId = ?", [
      answer,
      answerId,
    ]);
    return res
      .status(StatusCodes.CREATED)
      .json({ status: "success", msg: "Answer updated", answer });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Something went wrong, try again later", error: error });
  }
}

async function deleteAnswer(req, res) {
  const answerId = req.params.answerId;
  try {
    const result = await connection.query(
      "DELETE FROM Answers WHERE answerId = ?",
      [answerId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "fail", msg: "Answer not found", answerId });
    }

    return res
      .status(StatusCodes.OK)
      .json({ status: "success", msg: "Answer deleted", answerId });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "fail", msg: "Internal server error", err: error });
  }
}

module.exports = {
  postAnswer,
  getAllAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
  getAllAnswers,
};
