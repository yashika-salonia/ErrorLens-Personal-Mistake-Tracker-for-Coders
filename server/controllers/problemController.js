const Problem = require('../models/Problem')

// create problem
exports.createProblem=async(req, res)=>{
    try{
        const problem=await Problem.create(req.body)
        res.status(201).json(problem)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// get all problems
exports.getProblems=async(req, res)=>{
    try{
        const problems=await Problem.find()
        res.json(problems)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// get problem by id
exports.getProblemById=async(req, res)=>{
    try{
        const prob=await Problem.findById(req.params.id)
        if(!prob){
            return res.status(404).json({message: 'Problem not found'})
        }
        res.json(prob)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}