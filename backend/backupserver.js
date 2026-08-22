const app = require("./app")

var cookieParser = require('cookie-parser')

const { nanoid } = require('nanoid')
require('dotenv').config()


const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")


const Interview = require("./Models/interviews.js")

const User = require("./Models/userschema.js")

// app.use(cors({
//     origin: "http://localhost:5173", // NOT *
//     credentials: true,
// }))

app.use(cookieParser())

const bcrypt = require('bcrypt');


// interview in AI mode
const { GoogleGenAI } = require("@google/genai")
const ai = new GoogleGenAI({});

const PORT = 3000;

const airmodeoutes =require("./Routes/Aimoderoutes/aimoderoutes.js")
const userroutes=require("./Routes/Userroutes/userroutes.js")

const authroutes=require("./Routes/Authroutes/auth.js")

// simpleroutes
app.use('/api/ai',airmodeoutes)
app.use('/api',userroutes)


// auth routes
app.use('/auth',authroutes)
/// middelware to test and verfiy jwt


function verfiyjwtmw(req, res, next) {
    const token = req.cookies?.token
    if (!token) return res.status(401).json("Access Denied")
    try {
        const veriftcookietoken = jwt.verify(token, process.env.SECRET)

        req.user = veriftcookietoken
        next()
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            error: err?.message
        })
    }

}

// const history = [];

// converting->Dateabase(userDefindData) -> Gemini acceptable_Data

// geminiformat:
//     {
//   "systemInstruction": {
//     "parts": [
//       {
//         "text": "You are a helpful coding assistant."
//       }
//     ]
//   },
//   "contents": [
//     {
//       "role": "user",
//       "parts": [{ "text": "Write Python code" }]
//     }
//   ]
// }


async function defaultAI() {

    //call this function the moment user click on start AI mode.

    const defaultmsg = new Interview({
        role: "interviewer",
        typeofcontent: "Instruction provided by System to AI!!",

        content: `act as an interviewer and conduct a 30-minute technical interview focused on DSA and React. 
        Start with introduction.Ask one question at a time and wait for my response before proceeding. You may ask follow- up or counter - questions based on my answers.
        Do not ask multiple questions at once.Do not provide explanations unless I ask for them.`
    })
    return defaultmsg

}


function dbdatatoGemini(history) {



    return {
        systemInstruction: {
            parts: [{
                text: "act as an interviewer and conduct a technical interview on DSA and React..."
            }]
        },

        contents:

            history

                .map(item => ({
                    role: item.role === "ai" ? "model" : "user",
                    parts: [{ text: item.content }]
                }))

    };


}

// function to send data to geminiAI

async function genGeminidata(sessionid) {

    // const defaulttext = await defaultAI()
    // const defaulttext = `act as an interviewer and conduct a 30-minute technical interview focused on DSA and React. 
    //     Start with introduction.Ask one question at a time and wait for my response before proceeding. You may ask follow- up or counter - questions based on my answers.
    //     Do not ask multiple questions at once.Do not provide explanations unless I ask for them.`
    const allqna = await Interview.findOne({ sessionid: sessionid })



    const history = dbdatatoGemini(allqna.history)


    return history;
}

async function ansforai(sessionid) {


  
    const { systemInstruction, contents } = await genGeminidata(sessionid);



    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        systemInstruction,
        contents

    })

    return (res.text)
}


async function airesult() {

    const history = await genGeminidata(sessionid)

    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [...history,
        {
            parts: [{
                text: `You were the interviewer who took my interview. Now, My interview is done so you have to give me the detail feedback.
            I have provided history which contain all the chats happened between user and you, please give me feedback in details.`
            }]
        }
        ]

    })

    return (res.text)
}



//   User click on AI  mode to start interview

// Interview.startSession

app.get('/iwquestion', async (req, res) => {



    const newsession = new Interview({
        sessionid: nanoid(),
        history: [{
            role: "user",
            typeofcontent: "Instruction provided by System to AI!!",

            content: `act as an interviewer and conduct a 30-minute technical interview focused on DSA and React. 
        Start with introduction.Ask one question at a time and wait for my response before proceeding. You may ask follow- up or counter - questions based on my answers.
        Do not ask multiple questions at once.Do not provide explanations unless I ask for them.`
        }],
        mode: "computer",
    })


    await newsession.save()
    res.status(201).json(newsession)
})

app.get("/", (req, res) => {  //user will click start IW and he will recive questions.
    console.log(req.cookies)
    res.status(201).json("hi")
})
app.get("/iwquestion/:sessionid", verfiyjwtmw, async (req, res) => {  //user will click start IW and he will recive questions. 

    const session = await Interview.findOne({ sessionid: req.params.sessionid });

    if (!session) return res.status(404).json("Session not found");

    const questionbank = await ansforai(req.params.sessionid);


    session.history.push({
        role: "ai",
        content: questionbank
    })

    await session.save()

    res.status(201).json(session.history)
})


app.post("/iwanswer/:sessionid", verfiyjwtmw, async (req, res) => {
    const session = await Interview.findOne({ sessionid: req.params.sessionid });
    if (session.status === "completed") return res.status(404).json("Session not found");
    if (!session) return res.status(404).json("Session not found");


    const answer = req.body.parts[0].text;
    console.log("req" + req.body.parts[0])
    console.log("answer" + answer)
    session.history.push({
        role: "interviewer",
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
})

app.get('/feedback', verfiyjwtmw, async (req, res) => {
    const result = await airesult()

    res.status(201).json(result)
})


// Interview On Human Mode

app.get("/startinterview", verfiyjwtmw, async (req, res) => {  //user start interview -> interviewer send question


    console.log(req.user)
    const newsession = new Interview({
        sessionid: nanoid(),
        mode: "professional",
        history: [],
        status: "waiting",
        userid: req.user.userid,
        username: req.user.name,
        useremail: req.user.email


    })

    await newsession.save()

    console.log("session" + newsession)
    res.status(201).json(newsession)
})

// interviewer fetch using this(0)

app.get("/sessions/", verfiyjwtmw, async (req, res) => {  //user start interview -> interviewer send question
    const sessions = await Interview.find({ status: "waiting" })
    res.json(sessions)



})


// interviewer join this and send que

app.post("/sendque/session/:sessionid", verfiyjwtmw, async (req, res) => {


    const currenthis = await Interview.findOne({ sessionid: req.params.sessionid })

    if (!currenthis) return res.status(404).json("Session not found");
    if (currenthis.status === "completed") return res.status(404).json("Session not found");

    //interview send questions.

    const iwque = req.body.content;
    // const qustions = {
    //     sender: "interviewer",
    //     iwque: iwque
    // }
    await currenthis.updateOne({
        interviewerid: req.user.userid,
        interviewername: req.user.name,
        status: "active"
    })

    if (currenthis?.interviewerid !== req.user.userid) return res.status(404).json("hug what you doing?");

    currenthis.history.push({
        role: "interviewer",
        typeofcontent: "Question",
        content: iwque
    })

    await currenthis.save()

    res.status(201).json(currenthis.history)
})

// all detail related to sesion 
app.get("/session/:sessionid", verfiyjwtmw, async (req, res) => {
    const currenthis = await Interview.findOne({ sessionid: req.params.sessionid })

    if (!currenthis) return res.status(404).json("Session not found");

    res.status(200).json(currenthis)

})



app.post("/startinterview/session/:sessionid", verfiyjwtmw, async (req, res) => {
    // join as user and send asnwer
    const currenthis = await Interview.findOne({ sessionid: req.params.sessionid })

    if (!currenthis) return res.status(404).json("Session not found");
    if (currenthis.status === "completed") return res.status(404).json("Session not found");



    // const iwans = req.body.iwans
    // const answer = {
    //     sender: "interviewee",
    //     iwans: iwans
    // }
    const userans = req.body.content
    currenthis.history.push({
        role: "interviewee",
        typeofcontent: "answer",
        content: userans,
    })
    await currenthis.save()


    // session.push(answer)
    // console.log(`session ${session}`)
    // session.push[{

    //     text: [{
    //         answer
    //     }]
    // }]

    res.status(201).json("Human mode interview is on : " + currenthis.history)
})
app.post("/interview/feedback/:sessionid", async (req, res) => {
    const sessionid = req.params.sessionid;
    const sessiondata = await Interview.findOne({ sessionid: sessionid })

    console.log(sessiondata)

    await sessiondata.updateOne({
        status: "completed"
    })
    console.log(sessiondata.status)
    sessiondata.history.push({
        role: "interviewer",
        typeofcontent: "feedback",
        content: req.body.content,
        ratings: {
            confidence: req.body.confidence,
            answerStructure: req.body.structure,
            communication: req.body.language,
            technicalSkill: req.body.skill,
        }
    })

    await sessiondata.save();

    res.status(201).json({
        message: "Feedback recived!! "
    })

})

app.get("/interview/session/result/:sessionid", async (req, res) => {
    const sessionid=req.params.sessionid
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
    
    res.json(result)
})


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`)
})




// auth

async function hashpass(password) {
    const saltRounds = 10;

    const hashedpass = await bcrypt.hash(password, saltRounds)
    return hashedpass;

}

async function veryifypass(userconfirmpass, hashedpass) {

    return isMatch = await bcrypt.compare(userconfirmpass, hashedpass);

}

app.post("/getstarted", async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const profession = req.body.profession
    const password = req.body.password
    const cpassword = req.body.cpassword
    const role = req.body.role


    const hashedpassword = await hashpass(password)



    const ismatched = await veryifypass(cpassword, hashedpassword)

    if (ismatched) {
        res.status(200).json("Login successful");
    } else {
        res.status(401).json("Invalid credentials");
    }
    const newuser = new User({
        role,
        name,
        email,
        profession,
        password: hashedpassword,

    })

    await newuser.save();

})

app.get("/getuserinfo", verfiyjwtmw, async (req, res) => {
    console.log(req.user)
    res.status(201).json({
        userinfo: req.user,
        message: "Re-Verification"

    })
})

app.post("/login", async (req, res) => {

    const email = req.body.email
    const verifyemail = await User.findOne({ email: email })

    console.log(verifyemail)

    if (verifyemail) {

        const password = req.body.password


        const payload = { userid: verifyemail._id, role: verifyemail.role, name: verifyemail.name, email: verifyemail.email }

        const ismatched = await veryifypass(password, verifyemail.password)



        if (ismatched) {

            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' })

            res.cookie('token', token, {
                httpOnly: true,
                samesite: "lax",
                secure: false

            })

            return res.status(201).json({
                token,
                role: verifyemail.role,
                message: "login sucessufll"
            })


        }
        else
            res.status(401).json("Please enter the correct details!!!!")
    }
    else {
        res.status(404).json("No records found !!!")
    }
})

app.get("/logout", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    res.status(201).json({
        message: "Logout succesful"
    })

})

app.get("/users", (req, res) => {

})



async function connecttoDb() {
    try {
        await mongoose.connect(process.env.uri)
        console.log("connection successful")
    }
    catch (err) {
        console.log("not connected", err)
    }
}

connecttoDb();