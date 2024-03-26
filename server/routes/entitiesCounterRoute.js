const express = require("express");
const router = express.Router();
const { countAllEntities } = require("../controller/entitiesCounterController");

router.get("/count", countAllEntities);

module.exports = router;
