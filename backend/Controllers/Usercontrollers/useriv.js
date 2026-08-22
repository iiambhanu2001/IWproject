const Interview = require("../../Models/interviews");
const { nanoid } = require("nanoid");

// startusersession
const startusersession = async (req, res) => {
    const allinterviews = await Interview.find({ userid: req.user.userid });

    const alreadystarted = allinterviews.some(
        (item) => item.status === "onhold" || item.status === "active",
    );

    if (alreadystarted) {
        return res
            .status(201)
            .json({
                message: "Oops! One session is already active. Pls complete it first!!",
            });
    }
    console.log(alreadystarted);
    const ivmode=req.query.ivmode
    console.log(ivmode)
    const newsession = new Interview({
        sessionid: nanoid(),
        mode: "professional",
        history: [],
        status: "waiting",
        userid: req.user.userid,
        username: req.user.name,
        useremail: req.user.email,
        lastseenAt: new Date(),
        ivmode:ivmode,
    });

    await newsession.save();

    return res.status(201).json({
        message: "success",
        newsession: newsession,
    });
};

const checkinglastseen = async (req, res) => {
    const currenthis = await Interview.findOne({
        sessionid: req.params.sessionid,
    });
    if (!currenthis) return res.status(404).json("Session not found");
    if (currenthis.status === "completed")
        return res.status(404).json("Session not found");
    console.log(currenthis.lastseenAt);
};

// functiontogetsessions
const getallwaitingsessions = async (req, res) => {
    const sessions = await Interview.find({ status: "waiting" });

    for (const item of sessions) {
        if (Date.now() - item.createdAt.getTime() > 5 * 60 * 1000) {
            item.status = "expired";
            await item.save();
        }
    }

    const validsessions = await Interview.find({ status: "waiting" });

    console.log(validsessions);
    res.json(sessions);
};

//send question to server by interviewer

const sendquetoserbyIW = async (req, res) => {
    const io = req.app.get("io");

    const sessionid = req.params.sessionid;
    const currenthis = await Interview.findOne({
        sessionid: req.params.sessionid,
    });

    if (!currenthis || currenthis.status === "completed") {
        return res.status(404).json("Session not found");
    }


    const iwque = req.body.content;

    await currenthis.updateOne({
        interviewerid: req.user.userid,
        interviewername: req.user.name,
        status: "active",
    });
    await currenthis.save();
    if (currenthis?.interviewerid !== req.user.userid)
        return res.status(404).json("hug what you doing?");

    currenthis.history.push({
        role: "interviewer",
        typeofcontent: "Question",
        content: iwque,
    });
    await currenthis.save();

    io.to(sessionid).emit("new-question", {
        sessionid,
        role: "interviewer",
        content: iwque,
    });

 
    res.status(201).json(currenthis.history);
};

// Get each session

const getasession = async (req, res) => {
    const currenthis = await Interview.findOne({
        sessionid: req.params.sessionid,
    });

    const FIVE_MIN = 5 * 60 * 1000;

    const isOnHold = Date.now() - currenthis.lastseenAt.getTime() > FIVE_MIN;

    const computedStatus =
        currenthis.status === "completed"
            ? "completed"
            : isOnHold
                ? "onhold"
                : "active";

    res.status(203).json({
        message: "session fetched successfully",
        currenthis,
        computedStatus,
    });
};

const sendanswerfromuser = async (req, res) => {

    const io = req.app.get("io");
    const sessionid = req.params.sessionid
    const currenthis = await Interview.findOne({
        sessionid: req.params.sessionid,
    });

    if (!currenthis) return res.status(404).json("Session not found");
    if (currenthis.status === "completed")
        return res.status(404).json("Session not found");

    currenthis.lastseenAt = new Date();

    const userans = req.body.content;
    currenthis.history.push({
        role: "interviewee",
        typeofcontent: "answer",
        content: userans,
    });
    await currenthis.save();


    io.to(sessionid).emit("new-answer", {
        sessionid,
        content: userans,
        role: "interviewee"
    })

    return res
        .status(201)
        .json("Human mode interview is on : " + currenthis.history);
};

const postfeedback = async (req, res) => {
    const sessionid = req.params.sessionid;
    const sessiondata = await Interview.findOne({ sessionid: sessionid });

    await sessiondata.updateOne({
        status: "completed",
    });
    console.log(sessiondata.status);
    await sessiondata.updateOne({
        overallscore: req.body.overallscore,
    });
    sessiondata.history.push({
        role: "interviewer",
        typeofcontent: "feedback",
        content: req.body.content,
        ratings: {
            confidence: req.body.confidence,
            answerStructure: req.body.structure,
            communication: req.body.language,
            technicalSkill: req.body.skill,
        },
    });

    await sessiondata.save();

    res.status(201).json({
        message: "Feedback recived!! ",
    });
};

const resultbyiv = async (req, res) => {
    const sessionid = req.params.sessionid;
    const result = await Interview.findOne(
        {
            sessionid,
            "history.typeofcontent": "feedback",
        },
        {
            history: {
                $elemMatch: {
                    typeofcontent: "feedback",
                },
            },
        },
    );

    res.json(result);
};

const fetchallsessiondata = async (req, res) => {
    const userdata = await Interview.find({ userid: req.user.userid });
    const interviewerData = await Interview.find({
        interviewerid: req.user.userid,
    });

    res.status(201).json({
        userdata,
        interviewerData,
    });
};

module.exports = {
    startusersession,
    getallwaitingsessions,
    sendquetoserbyIW,
    getasession,
    sendanswerfromuser,
    postfeedback,
    resultbyiv,
    fetchallsessiondata,
    checkinglastseen,
};
