const app = require("./app")
require('dotenv').config()

const { GoogleGenAI } = require("@google/genai")



const PORT = 3000

app.get("/", (req, res) => {
    res.send("hi")
})



const ai = new GoogleGenAI({})

async function interviewquestions() {
    const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Assume you are an interviewer and I am a candidate take my interviews for next 30 minute. Topic is DSA/react.Return ONLY a JSON array of questions without explanation"
    });
    console.log(res.text)
}

app.get("/ivquestion", (req, res) => {
    const questions = interviewquestions();

    res.send(questions)
})

app.listen(PORT, () => {
    console.log("server is runing")
})