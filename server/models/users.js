const connection = require("../db/dbConfig");
const colors = require("colors");

const userModel = async () => {
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

exports.userModel = userModel;
