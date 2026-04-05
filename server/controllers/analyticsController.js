const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const User = require("../models/User");
const {
  getStartDate,
  accuracyExpr,
  resolvePersonality,
} = require("./analyticsHelpers");

// Reusable $lookup: joins submissions.problem → problems collection
const PROBLEM_LOOKUP = {
  $lookup: {
    from: "problems",
    localField: "problem",
    foreignField: "_id",
    as: "problemData",
  },
};

// dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [summary] = await Submission.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
          uniqueProblems: { $addToSet: "$problem" },
        },
      },
      {
        $project: {
          _id: 0,
          totalSubmissions: 1,
          accepted: 1,
          uniqueProblemsAttempted: { $size: "$uniqueProblems" },
          acceptanceRate: accuracyExpr("accepted", "totalSubmissions"),
        },
      },
    ]);

    res.json({
      success: true,
      data: summary ?? {
        totalSubmissions: 0,
        accepted: 0,
        uniqueProblemsAttempted: 0,
        acceptanceRate: 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// submission status breakdown
const getStatusBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Submission.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// mistake type frequency
const getMistakeTypeFrequency = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Submission.aggregate([
      {
        $match: {
          user: userId,
          mistakeTypes: { $exists: true, $not: { $size: 0 } },
        },
      },
      { $unwind: "$mistakeTypes" },
      { $group: { _id: "$mistakeTypes", count: { $sum: 1 } } },
      { $project: { _id: 0, mistakeType: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// performance by domain
const getDomainPerformance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Submission.aggregate([
      { $match: { user: userId } },
      PROBLEM_LOOKUP,
      { $unwind: "$problemData" },
      {
        $group: {
          _id: "$problemData.domain",
          totalAttempts: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          domain: "$_id",
          totalAttempts: 1,
          accepted: 1,
          accuracy: accuracyExpr("accepted", "totalAttempts"),
        },
      },
      { $sort: { accuracy: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  performance by difficulty
const getDifficultyPerformance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Submission.aggregate([
      { $match: { user: userId } },
      PROBLEM_LOOKUP,
      { $unwind: "$problemData" },
      {
        $group: {
          _id: "$problemData.difficulty",
          totalAttempts: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: "$_id",
          totalAttempts: 1,
          accepted: 1,
          accuracy: accuracyExpr("accepted", "totalAttempts"),
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "easy"] }, then: 1 },
                { case: { $eq: ["$_id", "medium"] }, then: 2 },
                { case: { $eq: ["$_id", "hard"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { sortOrder: 1 } },
      { $project: { sortOrder: 0 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// submission trend
const getSubmissionTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const range = ["week", "month", "year"].includes(req.query.range)
      ? req.query.range
      : "month";
    const since = getStartDate(range);

    const data = await Submission.aggregate([
      { $match: { user: userId, createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          submissions: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          submissions: 1,
          accepted: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({ success: true, range, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// top recurring mistakes
const getRecurringMistakes = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 20);

    const data = await Submission.aggregate([
      { $match: { user: userId, status: { $ne: "accepted" } } },
      { $group: { _id: "$problem", failCount: { $sum: 1 } } },
      PROBLEM_LOOKUP,
      { $unwind: "$problemData" },
      {
        $project: {
          _id: 0,
          problem: {
            id: "$problemData._id",
            title: "$problemData.title",
            domain: "$problemData.domain",
            difficulty: "$problemData.difficulty",
          },
          failCount: 1,
        },
      },
      { $sort: { failCount: -1 } },
      { $limit: limit },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// language stats
const getLanguageStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Submission.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$language",
          totalAttempts: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          language: "$_id",
          totalAttempts: 1,
          accepted: 1,
          accuracy: accuracyExpr("accepted", "totalAttempts"),
        },
      },
      { $sort: { totalAttempts: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// mistake personality
const getMistakePersonality = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const topMistakes = await Submission.aggregate([
      {
        $match: {
          user: userId,
          mistakeTypes: { $exists: true, $not: { $size: 0 } },
        },
      },
      { $unwind: "$mistakeTypes" },
      { $group: { _id: "$mistakeTypes", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      { $project: { _id: 0, mistakeType: "$_id", count: 1 } },
    ]);

    if (!topMistakes.length) {
      return res.json({
        success: true,
        data: {
          personality: "Not enough data yet",
          topMistakes: [],
          tip: "Submit more solutions to unlock your Mistake Personality.",
        },
      });
    }

    const topTypes = topMistakes.map((m) => m.mistakeType);
    const { label, tip } = resolvePersonality(topTypes[0]);

    await User.findByIdAndUpdate(userId, { mistakePersonality: label });

    res.json({
      success: true,
      data: { personality: label, topMistakes: topTypes, tip },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// admin overview
const getAdminOverview = async (req, res) => {
  try {
    const [submissionAgg, totalProblems, totalUsers] = await Promise.all([
      Submission.aggregate([
        {
          $group: {
            _id: null,
            totalSubmissions: { $sum: 1 },
            totalAccepted: {
              $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
            },
            uniqueUsers: { $addToSet: "$user" },
          },
        },
        {
          $project: {
            _id: 0,
            totalSubmissions: 1,
            totalAccepted: 1,
            totalActiveUsers: { $size: "$uniqueUsers" },
            platformAcceptanceRate: accuracyExpr(
              "totalAccepted",
              "totalSubmissions",
            ),
          },
        },
      ]),
      Problem.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        ...(submissionAgg[0] ?? {
          totalSubmissions: 0,
          totalAccepted: 0,
          totalActiveUsers: 0,
          platformAcceptanceRate: 0,
        }),
        totalProblems,
        totalRegisteredUsers: totalUsers,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
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
};
