const express = require("express");
const {createTables} = require("../controller/creatTablesController");

const router = express.Router();

router.get("/create_tables", createTables);

module.exports = router;
