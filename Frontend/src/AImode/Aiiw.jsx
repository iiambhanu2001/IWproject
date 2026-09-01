import React, { useEffect, useState } from "react";
import Aiquemode from "./Aiquemode.js";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext/Authcontext.jsx";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";
import ActionModal from "../components/ActionModal.jsx";

function Aiiw() {
  const [Aiques, setAiques] = useState([]);
  const [userres, setuserres] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { Humanquemode, sessionData, setsessionData } = useSessiondata();

  const { sessionid } = useParams();

  useEffect(() => {
    if (!sessionid) return;

    async function fetchque() {
      const question = await Aiquemode(sessionid);

      setAiques(question);
      console.log(question);
    }

    fetchque();
    Humanquemode(sessionid);
    console.log(Aiques);
  }, [sessionid]);

  async function aimodesendans() {
    const res = await fetch(
      `/api/api/ai/iwanswer/${sessionid}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify({
          parts: [{ text: userres }],
        }),
        credentials: "include",
      },
    );

    const data = await res.json();
    setAiques(data);
    setuserres("");
  }

  // start session

  async function questionfromai() {
    const res = await fetch("/api/api/ai/iwquestion", {
      method: "GET",
      credentials: "include",
    });
    const sessionid = await res.json();

    navigate(`/aiiw/session/${sessionid.sessionid}`);
    return sessionid.sessionid;
  }

  async function submitfeedback() {
    try {
      const res = await fetch(
        `/api/api/ai/feedback/${sessionid}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      console.log(data)

      if (data.message==="success") {
        navigate(`/result/${sessionid}`);
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  /* ================= INTRO SCREEN ================= */

  if (sessionid === null || sessionid === undefined) {
    return (
      <div className="min-h-screen bg-[#F7F9F7] flex items-center justify-center px-6 relative overflow-hidden">
        {/* soft background */}
        <div className="absolute top-[-140px] left-[-120px] w-[450px] h-[450px] bg-[#DFF3EA] blur-[150px] opacity-40 rounded-full" />
        <div className="absolute bottom-[-160px] right-[-140px] w-[500px] h-[500px] bg-[#E8F1FF] blur-[160px] opacity-40 rounded-full" />

        <div className="max-w-xl text-center space-y-5 bg-white border border-[#E6ECE6] p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-semibold text-[#1F2A24]">
            AI Interview Session
          </h1>

          <p className="text-sm text-[#5A6A61] leading-relaxed">
            You will go through an AI-driven interview. Answer naturally — the
            system will respond and guide your improvement.
          </p>

          <p className="text-xs text-[#7A8A80]">
            Tip: Treat this like a real interview, not a chat.
          </p>

          <div className="flex justify-center">
            <ActionModal
              triggerText="Start Interview"
              title="Start AI Interview?"
              description="Your interview will begin immediately."
              confirmText="Start"
              type="default"
              onConfirm={questionfromai}
            >
              <div className="bg-[#F7F9F7] p-4 rounded-xl text-sm">
                <ul className="space-y-3 text-sm text-[#55635B]">
     
                  <li className="flex items-start gap-3">

                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    The interview will begin immediately after
                    confirmation.
                  </li>
                  <li className="flex items-start gap-3">
              
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Answer naturally and professionally, as in a real
                    interview.
                  </li>
                  <li className="flex items-start gap-3">
        
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Avoid refreshing, closing, or leaving the page during the
                    session.
                  </li>
                  <li className="flex items-start gap-3">
                  
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Your interview feedback and performance report will be
                    available after submission.
                  </li>
                </ul>
              </div>
            </ActionModal>
          </div>
          {/* <button
              onClick={() => questionfromai()}
              className="px-6 py-3 rounded-xl bg-[#4A8FA3] text-white hover:bg-[#3c7688] transition"
            >
              Start Interview
            </button> */}
        </div>
      </div>
    );
  }

  if (sessionData?.status === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f7fbf9] to-[#edf5f1] flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5EF] flex items-center justify-center mb-5">
            <svg
              className="w-8 h-8 text-[#4E9B7A]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-[#1F2A24]">
            Interview Completed
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-6">
            This interview session has ended successfully.
          </p>
          <button
            onClick={() => navigate(`/result/${sessionid}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200 mr-2"
          >
            See your result
          </button>
          <button
            onClick={() => navigate("/aiiw")}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }
  if (sessionData?.history.length === 1){
    return(
      <h1>Waitfor for interviewer to jin....</h1>
    )
  }
  /* ================= INTERVIEW UI ================= */
  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#1F2A24] flex flex-col relative overflow-x-hidden">
      {/* background ambiance */}
      <div className="absolute top-[-140px] left-[-120px] w-[450px] h-[450px] bg-[#DFF3EA] blur-[150px] opacity-40 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-160px] right-[-140px] w-[500px] h-[500px] bg-[#E8F1FF] blur-[160px] opacity-40 rounded-full pointer-events-none" />

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-[#E6ECE6] bg-white/70 backdrop-blur-md">
        <h1 className="text-lg font-semibold">AI Interview Session</h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-6 py-10 max-w-3xl mx-auto w-full space-y-6">
        {Aiques.map((item, index) => (
          <div key={index} className="space-y-4">
            {item.role === "ai" ? (
              <>
                <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
                  <p className="text-xs text-[#6A7A72] mb-2">AI Question </p>
                  <h1 className="text-lg font-semibold leading-relaxed">
                    {item.content}
                  </h1>
                </div>
              </>
            ) : item.role === "system" ? (
              <>
                <h1>Your Interview is started. Best of luck</h1>
              </>
            ) : (
              <>
                <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
                  <p className="text-xs text-[#6A7A72] mb-2">AI Answers</p>
                  <h1 className="text-lg font-semibold leading-relaxed">
                    {item.content}
                  </h1>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="sticky bottom-0 px-6 py-4 bg-white/80 backdrop-blur-md border-t border-[#E6ECE6]">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={userres}
            onChange={(e) => setuserres(e.target.value)}
            placeholder="Write your answer thoughtfully..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#E6ECE6] focus:outline-none focus:ring-2 focus:ring-[#4A8FA3]"
          />

          <button
            onClick={aimodesendans}
            className="px-5 py-3 rounded-xl bg-[#4A8FA3] text-white hover:bg-[#3c7688] transition"
          >
            Send
          </button>
          <ActionModal
            triggerText="Submit"
            title="Submit Interview?"
            description="Once submitted, you cannot continue."
            confirmText="Submit"
            type="danger"
            onConfirm={submitfeedback}
          >
            <div className="bg-[#FFF5F5] p-4 rounded-xl text-sm">
              <ul className="space-y-2">
                <li>Answers will be finalized</li>
                <li>AI feedback will be generated</li>
                <li>You can view results later</li>
              </ul>
            </div>
          </ActionModal>
        </div>
      </div>
    </div>
  );
}

export default Aiiw;


