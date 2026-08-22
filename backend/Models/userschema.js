const mongoose = require("mongoose")



const userschema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["interviewer", "interviewee"],
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    profession: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true

    },
    password: {
        type: String,
        required: true,
        trim: true,


    },



}, { timestamps: true })

const User = mongoose.model("interview_user", userschema)

module.exports = User

