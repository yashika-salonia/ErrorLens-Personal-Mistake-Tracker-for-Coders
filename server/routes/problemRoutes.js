const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

// GET /api/problems?domain=&difficulty=&tag=&search=&page=&limit=
router.get("/", auth, getAllProblems);

// GET /api/problems/:id
router.get("/:id", auth, getProblemById);

// POST /api/problems
router.post("/", auth, createProblem);

// PUT /api/problems/:id
router.put("/:id", auth, updateProblem);

// DELETE /api/problems/:id
router.delete("/:id", auth, deleteProblem);

module.exports = router;
