const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "professional"],
        default: "student",
    },
    codingLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
    },
    mistakePersonality: {
        type: String,
    },
},
{
    timestamps: true
}
)


// password hashing -> before saving password to database, HASH it !!
userSchema.pre("save", async function(next) {
    if(!this.isModified("password"))
        return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// password hiding -> password not sent to frontend as not required there
// function that runs automatically when a document is converted to JSON. Before sending response, Mongoose converts document to JSON.
userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

// entered pwd compared to hashed pwd
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)