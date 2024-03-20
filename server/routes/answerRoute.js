const express = require("express");
const router = express.Router();
const { postAnswer, getAllAnswers } = require("../controller/answerController");

router.post("", postAnswer);
router.get("", getAllAnswers);

module.exports = router;
