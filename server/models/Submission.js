const mongoose = require("mongoose")

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
    index: true
  },

  code: {
    type: String,
    required: true
  },

  language: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "accepted",
      "wrong-answer",
      "runtime-error",
      "time-limit-exceeded",
      "compile-error"
    ],
    required: true
  },

  mistakeTypes: [{
    type: String,
    enum: [
      "syntax",
      "logic",
      "runtime",
      "performance",
      "edge-case",
      "validation",
      "authentication",
      "authorization",
      "configuration",
      "dependency",
      "state-management",
      "api-integration",
      "database-query",
      "security"
    ]
  }]

}, { timestamps: true })

module.exports = mongoose.model("Submission", submissionSchema)