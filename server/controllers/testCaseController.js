const TestCase = require("../models/Testcase");
const Problem = require("../models/Problem");

// create test case
const createTestCase = async (req, res) => {
  try {
    const { problemId, input, expectedOutput, isHidden } = req.body;

    if (!problemId || !input || !expectedOutput) {
      return res.status(400).json({
        success: false,
        message: "problemId, input and expectedOutput are required.",
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, message: "Problem not found." });
    }

    const testCase = await TestCase.create({
      problem: problemId,
      input,
      expectedOutput,
      isHidden: isHidden ?? false,
    });

    res
      .status(201)
      .json({ success: true, message: "Test case created.", data: testCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get test cases for a problem
const getTestCasesForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Only return hidden cases if the route is later guarded with admin middleware
    const filter = { problem: problemId, isHidden: false };

    const testCases = await TestCase.find(filter).sort({ createdAt: 1 });

    res.json({ success: true, count: testCases.length, data: testCases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get all test cases
const getAllTestCasesForProblem = async (req, res) => {
  try {
    const testCases = await TestCase.find({
      problem: req.params.problemId,
    }).sort({ isHidden: 1, createdAt: 1 });

    res.json({ success: true, count: testCases.length, data: testCases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get single test case by id
const getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id).populate(
      "problem",
      "title",
    );
    if (!testCase) {
      return res
        .status(404)
        .json({ success: false, message: "Test case not found." });
    }
    res.json({ success: true, data: testCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// update test case
const updateTestCase = async (req, res) => {
  try {
    const ALLOWED = ["input", "expectedOutput", "isHidden"];
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

    const testCase = await TestCase.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!testCase) {
      return res
        .status(404)
        .json({ success: false, message: "Test case not found." });
    }

    res.json({ success: true, message: "Test case updated.", data: testCase });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// delete test case
const deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findByIdAndDelete(req.params.id);
    if (!testCase) {
      return res
        .status(404)
        .json({ success: false, message: "Test case not found." });
    }
    res.json({ success: true, message: "Test case deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTestCase,
  getTestCasesForProblem,
  getAllTestCasesForProblem,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
};
