const express = require("express");
const router = express.Router();

// authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// userController
const {
  createQuestion,
  getAllQuestions,
} = require("../controller/questionController");

// question route
router.post("", createQuestion);
router.get("", getAllQuestions);

module.exports = router;
