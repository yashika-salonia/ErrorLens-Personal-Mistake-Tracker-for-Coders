const express = require("express");
const router = express.Router();
const {
  createSubmission,
  getUserSubmissions,
  getSubmissionStats,
} = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSubmission);
router.get("/", protect, getUserSubmissions);
router.get("/stats", protect, getSubmissionStats);

module.exports = router;
