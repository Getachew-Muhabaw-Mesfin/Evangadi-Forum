const express = require("express");
const router = express.Router();
const {
  calculateLeaderboardRank,
} = require("../controller/userRankController");

// Route to calculate leaderboard ranks
router.get("", calculateLeaderboardRank);

module.exports = router;
