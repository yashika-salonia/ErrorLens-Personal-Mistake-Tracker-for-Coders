const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createTestCase,
  getTestCasesForProblem,
  getAllTestCasesForProblem,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
} = require("../controllers/testCaseController");

router.use(auth);

// POST -> /api/test-cases → create test case
router.post("/", createTestCase);

// GET -> /api/test-cases/problem/:problemId → visible test cases only
router.get("/problem/:problemId", getTestCasesForProblem);

// GET -> /api/test-cases/problem/:problemId/all → all including hidden (admin)
router.get("/problem/:problemId/all", getAllTestCasesForProblem);

// GET -> /api/test-cases/:id → single test case
router.get("/:id", getTestCaseById);

// PUT -> /api/test-cases/:id → update test case
router.put("/:id", updateTestCase);

// DELETE -> /api/test-cases/:id → delete test case
router.delete("/:id", deleteTestCase);

module.exports = router;
