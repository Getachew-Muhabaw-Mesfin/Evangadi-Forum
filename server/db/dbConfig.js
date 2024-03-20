require("dotenv").config();
const mysql2 = require("mysql2/promise");
const colors = require("colors");

const connection = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// You don't need to call connection.connect() with the pool

connection
  .query("SELECT 1 + 1 AS solution")
  .then(([rows, fields]) => {
    console.log("Database is connected successfully! : ".underline.blue);
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });

module.exports = connection;
