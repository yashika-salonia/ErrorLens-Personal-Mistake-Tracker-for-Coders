const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getDashboardSummary,
  getStatusBreakdown,
  getMistakeTypeFrequency,
  getDomainPerformance,
  getDifficultyPerformance,
  getSubmissionTrend,
  getRecurringMistakes,
  getLanguageStats,
  getMistakePersonality,
  getAdminOverview,
} = require("../controllers/analyticsController");

router.use(auth);

// Personal analytics
router.get("/summary", getDashboardSummary); // overall card
router.get("/status-breakdown", getStatusBreakdown); // pie chart
router.get("/mistake-types", getMistakeTypeFrequency); // bar chart
router.get("/domain-performance", getDomainPerformance); // per domain
router.get("/difficulty-performance", getDifficultyPerformance); // easy/med/hard
router.get("/trend", getSubmissionTrend); // ?range=week|month|year
router.get("/recurring-mistakes", getRecurringMistakes); // ?limit=5
router.get("/language-stats", getLanguageStats); // per language
router.get("/mistake-personality", getMistakePersonality); // personality profile

// Admin
router.get("/admin/overview", getAdminOverview);

module.exports = router;
