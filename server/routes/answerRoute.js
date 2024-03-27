const express = require("express");
const router = express.Router();
const {
  postAnswer,
  getAllAnswers,
  getAllAnswersByQuestionId,
  updateAnswer,
  deleteAnswer,
  getSingleAnswer,
} = require("../controller/answerController");

router.post("", postAnswer);
router.get("", getAllAnswersByQuestionId);
router.get("/all", getAllAnswers);
router.get("/:answerId", getSingleAnswer);
router.patch("/:answerId", updateAnswer);
router.delete("/:answerId", deleteAnswer);

module.exports = router;
