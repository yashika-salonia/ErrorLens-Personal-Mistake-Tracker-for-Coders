const Submission = require('../models/Submission')

// create submission
exports.createSubmission=async(req, res)=>{
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
exports.getUserSubmissions=async (req, res)=>{
    try{
        const submissions=await Submission.find({user: req.user.id})
        .populate('problem', 'title')

        res.json(submissions)
    } catch(e){
        res.status(500).json({message: e.message})
    }
}

// Analytics: get submission stats for a user
exports.getSubmissionStats=async (req, res)=>{
    try{
        const userId=req.user.id
        
        const totalSubmissions=await Submission.countDocuments({user:userId})

        const acceptCnt=await Submission.countDocuments({
            user: userId,
            status: "accepted"
        })

        const mistkaeStats=await Submission.aggregate([
            {$match: {user: userId}},
            {$unwind: "$mistkaeTypes"},
            {
                $group: {
                    _id: "$mistakeTypes",
                    count: {$sum:1}
                }
            }
        ])
    } catch(e){
        res.status(500).json({message: e.message})
    }
}