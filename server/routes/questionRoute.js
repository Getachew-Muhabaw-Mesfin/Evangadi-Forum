const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
} = require("../controller/questionController");

// question route
router.post("", createQuestion);
router.get("", getAllQuestions);

router.patch("/:questionId", updateQuestion);
router.delete("/:questionId", deleteQuestion);
router.get("/:questionId", getQuestionById);

module.exports = router;
