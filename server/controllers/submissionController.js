const mongoose = require("mongoose");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");

// create submission
const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language, status, mistakeTypes } = req.body;

    if (!problemId || !code || !language || !status) {
      return res.status(400).json({
        success: false,
        message: "problemId, code, language and status are required.",
      });
    }

    // Verify the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      code,
      language: language.toLowerCase(),
      status,
      mistakeTypes: mistakeTypes || [],
    });

    // Populate problem details in the response
    await submission.populate("problem", "title domain difficulty");

    res.status(201).json({
      success: true,
      message: "Submission recorded.",
      data: submission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all submission of a user
const getMySubmissions = async (req, res) => {
  try {
    const { status, problemId, page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (problemId) filter.problem = problemId;

    const skip =
      (Math.max(parseInt(page), 1) - 1) * Math.min(parseInt(limit), 50);
    const take = Math.min(parseInt(limit), 50);

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .populate("problem", "title domain difficulty")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Submission.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: submissions,
      meta: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get submission by id
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("problem", "title domain difficulty tags")
      .populate("user", "name email");

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found." });
    }

    // Ownership check
    if (submission.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update mistake types
const updateMistakeTypes = async (req, res) => {
  try {
    const { mistakeTypes } = req.body;

    if (!Array.isArray(mistakeTypes)) {
      return res
        .status(400)
        .json({ success: false, message: "mistakeTypes must be an array." });
    }

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found." });
    }

    if (submission.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    submission.mistakeTypes = mistakeTypes;
    await submission.save();

    res.json({
      success: true,
      message: "Mistake types updated.",
      data: submission,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get submission for a problem
const getSubmissionsForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip =
      (Math.max(parseInt(page), 1) - 1) * Math.min(parseInt(limit), 50);
    const take = Math.min(parseInt(limit), 50);

    const [submissions, total] = await Promise.all([
      Submission.find({ problem: problemId })
        .populate("user", "name codingLevel")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Submission.countDocuments({ problem: problemId }),
    ]);

    res.json({
      success: true,
      data: submissions,
      meta: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
  updateMistakeTypes,
  getSubmissionsForProblem,
};
