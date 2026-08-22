const Interview = require("../Models/interviews")

const { GoogleGenAI } = require("@google/genai")
const ai = new GoogleGenAI({});

//  function to convert mongodb data to Geminidata format. 
const dbdatatoGemini = (history) => {

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

// function to generate data for geminiai
const genGeminidata = async (sessionid) => {

    // const defaulttext = await defaultAI()
    // const defaulttext = `act as an interviewer and conduct a 30-minute technical interview focused on DSA and React. 
    //     Start with introduction.Ask one question at a time and wait for my response before proceeding. You may ask follow- up or counter - questions based on my answers.
    //     Do not ask multiple questions at once.Do not provide explanations unless I ask for them.`
    const allqna = await Interview.findOne({ sessionid: sessionid })



    const history = dbdatatoGemini(allqna.history)


    return history;
}

// sending data to geminiAI
const ansforai = async (sessionid) => {

    const { systemInstruction, contents } = await genGeminidata(sessionid);

    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        systemInstruction,
        contents

    })

    return (res.text)
}

// result for feedback

const airesult = async (sessionid) => {

    const {systemInstruction, contents} = await genGeminidata(sessionid)
  
    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [...contents,
        {
            parts: [{
                text: `You were the interviewer who took my interview. Now, My interview is done so you have to give me the detail feedback.
            I have provided history which contain all the chats happened between user and you, please give me feedback in details. Give me data in json form. 
            It should contain following value pair: confidence,skills,english,overall score, strength, area to improve.`
            }]
        }
        ]

    })
    
console.log(res.text)
    return (res.text)
}

module.exports = {
    dbdatatoGemini,
    genGeminidata,
    ansforai,
    airesult
} 