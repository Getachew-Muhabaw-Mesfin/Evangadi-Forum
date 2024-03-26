const connection = require("../db/dbConfig");

async function countAllEntities(req, res) {
  try {
    const [usersCount] = await connection.query(
      "SELECT COUNT(*) AS userCount FROM Users"
    );
    const [questionsCount] = await connection.query(
      "SELECT COUNT(*) AS questionCount FROM Questions"
    );
    const [answersCount] = await connection.query(
      "SELECT COUNT(*) AS answerCount FROM Answers"
    );

    return res.status(200).json({
      usersCount: usersCount[0].userCount,
      questionsCount: questionsCount[0].questionCount,
      answersCount: answersCount[0].answerCount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Something went wrong, try again later" });
  }
}

module.exports = { countAllEntities };
