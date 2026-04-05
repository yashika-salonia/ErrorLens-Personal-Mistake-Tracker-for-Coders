const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
  updateMistakeTypes,
  getSubmissionsForProblem,
} = require("../controllers/submissionController");

// All submission routes require auth
router.use(auth);

// POST -> /api/submissions → create new submission
router.post("/", createSubmission);

// GET -> /api/submissions/me?status=&problemId=    → my submission history
router.get("/me", getMySubmissions);

// GET -> /api/submissions/problem/:problemId       → all submissions for a problem
router.get("/problem/:problemId", getSubmissionsForProblem);

// GET -> /api/submissions/:id                      → single submission (owner only)
router.get("/:id", getSubmissionById);

// PUT -> /api/submissions/:id/mistakes             → update mistake tags
router.put("/:id/mistakes", updateMistakeTypes);

module.exports = router;
