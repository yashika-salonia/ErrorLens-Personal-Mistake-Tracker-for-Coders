const TestCase=require('../models/Testcase')

// create test case
exports.createTestCase=async (req, res)=>{
    try{
        const testCase=await TestCase.create(req.body)
        res.status(201).json(testCase)
    } catch(e){
        res.status(500).json({message: error.message})
    }
}

// get test cases for a problem
exports.getTestCasesByProblem=async (req, res)=>{
    try{
        const testCases=await TestCase.find({
            problem: req.params.problemId
        })
        res.json(testCases)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}