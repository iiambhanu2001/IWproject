const Interview = require("../../Models/interviews.js")
const { nanoid } = require('nanoid')
const { dbdatatoGemini,
    genGeminidata,
    ansforai,
    airesult } = require("../../Services/aimode.dbdatatoGemini.js")

const startivwithai = async (req, res) => {
    const allinterviews = await Interview.find({ userid: req.user.userid })

    const alreadystarted = allinterviews.some((
        item => item.status === "onhold" || item.status === "active"))

    if (alreadystarted) {
        return res.status(201).json({ message: "Oops! One session is already active. Pls complete it first!!" })
    }
    const newsession = new Interview({
        sessionid: nanoid(),
        userid: req.user.userid,
        username: req.user.username,
        useremail: req.user.useremail,
        interviewerid: 9999999999,
        interviewername: "Umang",
        status: "active",
        history: [{
            role: "system",
            typeofcontent: "Instruction provided by System to AI!!",

            content: `act as an interviewer and conduct a 30-minute technical interview focused on DSA and React. 
            Start with introduction.Ask one question at a time and wait for my response before proceeding. You may ask follow- up or counter - questions based on my answers.
            Do not ask multiple questions at once.Do not provide explanations unless I ask for them.`
        }],
        mode: "computer",
    })


    await newsession.save()
    res.status(201).json(newsession)
}

const startSession = async (req, res) => {
    const session = await Interview.findOne({ sessionid: req.params.sessionid });

    if (!session) return res.status(404).json("Session not found");
    if (session.status === "completed") return res.status(204).json("Session is completed")
    const alreadystarted = session.history.some((
        role => role.role === "ai"))

    if (alreadystarted) return res.status(200).json(session.history)

    const questionbank = await ansforai(req.params.sessionid);



    session.history.push({
        role: "ai",
        content: questionbank
    })

    await session.save()

    res.status(201).json(session.history)
}

const sendinganswertoai = async (req, res) => {
    const session = await Interview.findOne({ sessionid: req.params.sessionid });
    if (session.status === "completed") return res.status(404).json("Session not found");
    if (!session) return res.status(404).json("Session not found");


    const answer = req.body.parts[0].text;

    session.history.push({
        role: "user",
        content: answer
    })


    await session.save()

    const aians = await ansforai(req.params.sessionid);

    console.log(aians)
    session.history.push({
        role: "ai",
        content: aians,
    })

    await session.save()
    res.status(201).json(session.history)
}

const resultai = async (req, res) => {
    const session = await Interview.findOne({ sessionid: req.params.sessionid });
    console.log(session)
    const sessionid = req.params.sessionid;

    if (!session) return res.status(404).json("Session not found");



    const feedbackexist = session.history.some((
        item => item.typeofcontent === "feedback"
    ))

    console.log(feedbackexist)

    if (session.status === "gen_feedback") {
        return res.status(429).json({
            message: "Feedback is already generating please wait!!"
        })
    }

    if (feedbackexist) {
        return res.status(201).json({ message: "Feedback already exist" })
    }

    try {
        session.status = "gen_feedback"
        await session.save();
        const result = await airesult(req.params.sessionid)

        console.log(result)

        session.history.push({
            role: "ai",
            typeofcontent: "feedback",
            content: result
        })

        session.status = "completed"
        await session.save();
        return res.status(201).json({
            message: "success"
        })
    }
    catch (err) {

        session.status = "active"
        await session.save();
        return res.status(504).json({
            message: "feedback not generated. Try again!!"
        })
    }

}

const fetchfeedback = async (req, res) => {

    const sessionid = req.params.sessionid;
    const session = await Interview.findOne({ sessionid: sessionid });
    if (!session) return res.status(404).json("Session not found");

    const result = await Interview.findOne(
        {
            sessionid,
            "history.typeofcontent": "feedback"
        },
        {
            history: {
                $elemMatch: {
                    typeofcontent: "feedback"
                }
            }
        }
    )
    console.log("result 137ai.js", result)

    res.status(201).json(result)
}


module.exports = {
    startivwithai, startSession, sendinganswertoai, resultai, fetchfeedback
}