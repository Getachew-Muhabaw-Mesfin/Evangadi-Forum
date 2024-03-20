

const dbConnection = require('../db/dbConfig')

async function createQuestion(req, res) {
  const { questionId, userId, title, description, tag } = req.body;
  if (!questionId || !userId || !title || !description || !tag) {
    return res.status(400).json({ msg: "please provide all required fields" })
  }

  try {
    await dbConnection.query("INSERT INTO questions (questionId,userId,title,description,tag) VALUES (?,?,?,?,?)", [questionId, userId, title, description, tag])
    return res.status(201).json({ msg: "question posted redirected to home" })

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ msg: "something went wrong, try again later" })
  }

}
async function getAllQuestions(req, res) {

  try {

    const [questions] = await dbConnection.query(`
      SELECT q.questionId, q.userId, q.title, q.description, u.username
      FROM questions q
      JOIN users u ON q.userId = u.userId
      ORDER BY q.id DESC
  `);


    return res.status(200).json({ msg: "all question retrieved successful", questions })

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ msg: "something went wrong, try again later" })
  }

}


module.exports = { createQuestion, getAllQuestions };