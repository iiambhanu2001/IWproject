import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";

function Feedback() {
  const navigate = useNavigate();
  const { sessionid } = useParams();

  console.log(sessionid);
  const { endsessionfeedback } = useSessiondata();

  const [confidence, setConfidence] = useState(4);
  const [structure, setStructure] = useState(4);
  const [language, setLanguage] = useState(4);
  const [skill, setSkill] = useState(4);
  const [overallscore,setoverallscore]=useState(4)

  const [feedback, setFeedback] = useState("");

  async function submitFeedback() {
    try {
      const data = await endsessionfeedback(
        { content: feedback, confidence, structure, language, skill ,overallscore },
        sessionid,
      );
      console.log(data);
      navigate("/");
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Interview Feedback</h1>

        {/* Ratings */}
        <div className="space-y-5">
          <div>
            <label>Confidence Level</label>
            <input
              type="range"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label>Answer Structure</label>
            <input
              type="range"
              min="1"
              max="10"
              value={structure}
              onChange={(e) => setStructure(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label>Language & Communication</label>
            <input
              type="range"
              min="1"
              max="10"
              value={language}
              onChange={(e) => setLanguage(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label>Technical Skill</label>
            <input
              type="range"
              min="1"
              max="10"
              value={skill}
              onChange={(e) => setSkill(Number(e.target.value))}
              className="w-full"
            />
          </div>

           <div>
            <label>Your Score</label>
            <input
              type="range"
              min="1"
              max="10"
              value={overallscore}
              onChange={(e) => setoverallscore(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Written Feedback */}

          <div>
            <label className="block mb-2">Overall Feedback</label>

            <textarea
              rows={6}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write interview feedback..."
              className="w-full border rounded-xl p-4"
            />
          </div>

          <button
            onClick={submitFeedback}
            className="w-full py-3 rounded-xl bg-[#4E9B7A] text-white"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
