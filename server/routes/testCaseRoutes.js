const express = require("express");
const router = express.Router();
const {
  createTestCase,
  getTestCasesByProblem,
} = require("../controllers/testCaseController");

router.post("/", createTestCase);
router.get("/:problemId", getTestCasesByProblem);

module.exports = router;
