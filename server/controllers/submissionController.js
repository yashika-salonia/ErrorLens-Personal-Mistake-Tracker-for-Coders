const Submission = require('../models/Submission')

// create submission
const createSubmission=async(req, res)=>{
    try{
        const submission = await Submission.create({
            ...req.body,
            user: req.user.id
        })

        res.status(201).json(submission)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// get all submission of a user
const getUserSubmissions=async (req, res)=>{
    try{
        const submissions=await Submission.find({user: req.user.id})
        .populate('problem', 'title')

        res.json(submissions)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// Analytics: get submission stats for a user
const getSubmissionStats=async (req, res)=>{
    try{
        const userId=req.user.id
        
        const totalSubmissions=await Submission.countDocuments({user:userId})

        const acceptCnt=await Submission.countDocuments({
            user: userId,
            status: "accepted"
        })

        const mistakeStats=await Submission.aggregate([
            {$match: {user: userId}},
            {$unwind: "$mistakeTypes"},
            {
                $group: {
                    _id: "$mistakeTypes",
                    count: {$sum:1}
                }
            }
        ])

        res.json({
            totalSubmissions,
            acceptCnt,
            mistakeStats
        })
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

module.exports = {
    createSubmission,
    getUserSubmissions,
    getSubmissionStats,
}