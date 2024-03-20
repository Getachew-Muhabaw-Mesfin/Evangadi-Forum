const connection = require("../db/dbConfig");
const colors = require("colors");

const createUserTable = async () => {
  const userQuery = `
    CREATE TABLE IF NOT EXISTS Users (
       userId INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
  `;

  try {
    const [rows, fields] = await connection.execute(userQuery);
    console.log("Users table created successfully!!".rainbow);
  } catch (err) {
    console.error(err);
  }
};

const createQuestionTable = async () => {
  const questionQuery = `
    CREATE TABLE IF NOT EXISTS Questions (
        questionId INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        tag VARCHAR(255) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(userId)
    )
  `;

  try {
    const [rows, fields] = await connection.execute(questionQuery);
    console.log("Questions table created successfully!!".rainbow);
  } catch (err) {
    console.error(err);
  }
};

const createAnswerTable = async () => {
  const answerQuery = `
    CREATE TABLE IF NOT EXISTS Answers (
        answerId INT PRIMARY KEY AUTO_INCREMENT,
        userId INT,
        questionId INT,
        answer TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(userId),
        FOREIGN KEY (questionId) REFERENCES Questions(questionId)
    )
  `;

  try {
    const [rows, fields] = await connection.execute(answerQuery);
    console.log("Answers table created successfully!!".rainbow);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createUserTable, createQuestionTable, createAnswerTable };
