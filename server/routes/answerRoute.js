const express = require("express");
const router = express.Router();
const {
  postAnswer,
  getAllAnswers,
  getAllAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
} = require("../controller/answerController");

router.post("", postAnswer);
router.get("", getAllAnswersByQuestionId);
router.get("/all", getAllAnswers);
router.patch("/:answerId", updateAnswer);
router.delete("/:answerId", deleteAnswer);

module.exports = router;
