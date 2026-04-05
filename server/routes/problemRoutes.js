const express=require('express')
const router=express.Router()
const {
  createProblem,
  getProblems,
  getProblemById,
} = require("../controllers/problemController");

router.post('/',createProblem)
router.get("/", getProblems);
router.get("/:id", getProblemById);


module.exports = router