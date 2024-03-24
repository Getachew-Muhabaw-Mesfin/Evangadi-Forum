const connection = require("../db/dbConfig");

async function postAnswer(req, res) {
  const { userId, questionId, answer } = req.body;
  if (!questionId || !userId || !answer) {
    return res.status(400).json({ msg: "please provide all required fields" });
  }
  //insert data into answers table
  try {
    await connection.query(
      "INSERT INTO answers (userId,questionId,answer) VALUES (?,?,?)",
      [userId, questionId, answer]
    );
    return res.status(201).json({ msg: "Answer posted" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later............." });
  }
}
async function getAllAnswers(req, res) {
  // const questionId = req.query.questionId;

  const questionId = req.headers["questionId"];
  try {
    const [answers] = await connection.query(
      `SELECT users.username, answers.answer
    FROM answers
    JOIN users ON answers.userId = users.userId
    WHERE answers.questionId = ? ORDER BY answers.date DESC
    `,
      [questionId]
    );
    return res
      .status(200)
      .json({ msg: "all answer retrieved successfully", answers, questionId});
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later" });
  }
}

// For Dashboard Implementation

async function updateAnswer(req, res) {
  const { answerId, answer } = req.body;
  if (!answerId || !answer) {
    return res.status(400).json({ msg: "please provide all required fields" });
  }
  try {
    await connection.query(
      "UPDATE answers SET answer = ? WHERE answerId = ?",
      [answer, answerId]
    );
    return res.status(201).json({ msg: "Answer updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later" });
  }
}

async function deleteAnswer(req, res) {
  const answerId = req.params.answerId;
  try {
    await connection.query("DELETE FROM answers WHERE answerId = ?", [answerId]);
    return res.status(200).json({ msg: "Answer deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "something went wrong, try again later" });
  }
}
  

module.exports = { postAnswer, getAllAnswers, updateAnswer, deleteAnswer};
