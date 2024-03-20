const colors = require("colors");
const {
  createUserTable,
  createQuestionTable,
  createAnswerTable,
} = require("../models/models");

const createTables = () => {
  try {
    createUserTable();
    createQuestionTable();
    createAnswerTable();
    console.log("All tables created successfully!!".rainbow);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createTables };
