const connection = require("../db/dbConfig");

const calculateLeaderboardRank = async (req, res) => {
  try {
    // Query to calculate points for each user
    const query = `
      SELECT u.userId, 
             u.username,
             u.firstName,
              u.lastName,
              u.email,
             COUNT(DISTINCT q.questionId) AS numberOfQuestionsAsked,
             COUNT(DISTINCT a.answerId) AS numberOfAnswersProvided,
             COUNT(DISTINCT q.questionId) * 10 AS questionPoints,
             COUNT(DISTINCT a.answerId) * 20 AS answerPoints,
             (COUNT(DISTINCT q.questionId) * 10) + (COUNT(DISTINCT a.answerId) * 20) AS totalPoints
      FROM Users u
      LEFT JOIN Questions q ON u.userId = q.userId
      LEFT JOIN Answers a ON u.userId = a.userId
      GROUP BY u.userId, u.username
      ORDER BY totalPoints DESC;
    `;

    // Execute the query
    const [rows, fields] = await connection.execute(query);

    // Prepare the ranked leaderboard data
    const leaderboard = rows.map((row, index) => {
      return {
        rank: index + 1,
        userId: row.userId,
        username: row.username,
        numberOfQuestionsAsked: row.numberOfQuestionsAsked,
        numberOfAnswersProvided: row.numberOfAnswersProvided,
        questionPoints: row.questionPoints,
        answerPoints: row.answerPoints,
        totalPoints: row.totalPoints,
      };
    });

    // Send the leaderboard response
    res.status(200).json({
      message: "Leaderboard ranks calculated successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("Error calculating leaderboard ranks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { calculateLeaderboardRank };
