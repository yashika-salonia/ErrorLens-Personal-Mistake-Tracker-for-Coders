const Problem = require("../models/Problem");

// create problem
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      domain,
      difficulty,
      tags,
      expectedTimeComplexity,
    } = req.body;

    if (!title || !description || !domain || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "title, description, domain and difficulty are required.",
      });
    }

    const existing = await Problem.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists.",
      });
    }

    const problem = await Problem.create({
      title,
      description,
      domain,
      difficulty,
      tags: tags || [],
      expectedTimeComplexity: expectedTimeComplexity || "",
    });

    res
      .status(201)
      .json({ success: true, message: "Problem created.", data: problem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all problems
const getAllProblems = async (req, res) => {
  try {
    const { domain, difficulty, tag, search, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = { $in: [tag] };
    if (search) filter.title = { $regex: search, $options: "i" };

    const skip =
      (Math.max(parseInt(page), 1) - 1) * Math.min(parseInt(limit), 50);
    const take = Math.min(parseInt(limit), 50);

    const [problems, total] = await Promise.all([
      Problem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take),
      Problem.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: problems,
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

// get problem by id
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    }
    res.json({ success: true, data: problem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update problem
const updateProblem = async (req, res) => {
  try {
    const ALLOWED = [
      "title",
      "description",
      "domain",
      "difficulty",
      "tags",
      "expectedTimeComplexity",
    ];
    const updates = {};

    ALLOWED.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    }

    res.json({ success: true, message: "Problem updated.", data: problem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete problem
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    }
    res.json({ success: true, message: "Problem deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
