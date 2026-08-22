
const mongoose = require("mongoose")

const histdataSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            // required: true,
            // enum: ["interviewee", "ai", "interviewer","system"],
        },

        typeofcontent: {
            type: String,
            // required: true,
            // enum: ["question", "answer", "feedback", "message"],
        },

        content: {
            type: String,
            // required: true,
        },

        ratings: {
            confidence: {
                type: Number,
                default: null,
            },
            answerStructure: {
                type: Number,
                default: null,
            }, communication
                : {
                type: Number,
                default: null,
            }, technicalSkill: {
                type: Number,
                default: null,
            },

        }
    },
    { timestamps: true }
);

const iwsessionSchema = new mongoose.Schema(
    {
        sessionid: {
            type: String,
            // required: true,
            // unique: true,
            // index: true,
        },

        userid: {
            type: String,
            // required: true,
            index: true,
        },

        username: {
            type: String,
            // required: true,
        },
        useremail: {
            type: String,
        },

        interviewerid: {
            type: String,
            default: null,
        },

        interviewername: {
            type: String,
            default: null,
        },

        mode: {
            type: String,
            // required: true,
            enum: ["computer", "professional"],
        },
        ivmode:{
            type:String,
            enum:["text","video","audio"],
            default:"text",
        },

        interviewtype: {
            type: String,
            // required: true,
        },
        status: {
            type: String,
            // enum: ["waiting", "active", "completed"],
            default: "waiting",
        },
        overallscore: {
            type: Number,
            default: null,
        },
        lastseenAt: {
            type: Date,
            default: Date.now,
        },

        history: [histdataSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("IWSession", iwsessionSchema);