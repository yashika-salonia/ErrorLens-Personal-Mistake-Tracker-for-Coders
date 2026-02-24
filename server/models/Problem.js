const mongoose = require("mongoose")

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },

  domain: {
    type: String,
    enum: [
      "frontend",
      "backend",
      "database",
      "devops",
      "system-design",
      "dsa",
      "mobile",
      "security",
      "ai-ml"
    ],
    required: true,
    index: true
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
    index: true
  },

  tags: [{
    type: String,
    index: true
  }],

  expectedTimeComplexity: String

}, { timestamps: true })

module.exports = mongoose.model("Problem", problemSchema)