import  { useEffect, useState } from "react";
// import Humanquemode from "./humanquemode.js";
import { useNavigate, useParams } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";

import ActionModal from "../components/ActionModal.jsx";

import { socket } from "../socket.io.js";

function Humaniw() {
  const [userhummodans, setuserhummodans] = useState("");
  const { sessionid } = useParams();
 
  const {
    Humanquemode,
    sessionData,
    setsessionData,
  
  } = useSessiondata();

  const navigate = useNavigate();

  async function startusersession() {
    const res = await fetch("https://iwproject.onrender.com/api/startinterview?ivmode=text", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  }

  async function createsession() {
    const data = await startusersession();

    if (data.message === "success") {
      navigate(`/startinterview/session/${data.newsession.sessionid}`);
    }

    if (
      data.message ===
      "Oops! One session is already active. Pls complete it first!!"
    ) {
      alert("You already have an active session. Please rejoin it first.");
      return;
    }
  }

  // polling session
  useEffect(() => {
    if (!sessionid) return;

    async function fetchque() {
      await Humanquemode(sessionid);
    }
    fetchque();
  }, [sessionid, sessionData]);

  useEffect(() => {
    if (!sessionid) return;

    socket.emit("join-session", sessionid);
  }, [sessionid, socket]);

  useEffect(() => {
    if (!sessionid) return;
    const handleNewQuestion = (data) => {
      setsessionData((prev) => ({
        ...prev,
        currenthis: {
          ...prev.currenthis,
          history: [...prev.currenthis.history, data],
        },
      }));
    };

    socket.on("new-answer", handleNewQuestion);

    return () => {
      socket.off("new-answer", handleNewQuestion);
    };
  }, [sessionid, socket]);


  async function sendanstoserver() {
    const res = await fetch(
      `https://iwproject.onrender.com/api/startinterview/session/${sessionid}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ content: userhummodans }),
        credentials: "include",
      },
    );

    const data = await res.json();
    
   
    setuserhummodans("");
    return data;
  }

  if (!sessionid) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F6FAF8] flex items-center justify-center px-6 relative">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#DFF3EA] blur-[140px] opacity-40 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] bg-[#E8F1FF] blur-[150px] opacity-40 rounded-full pointer-events-none" />

        <div className="max-w-xl text-center space-y-5 bg-white border border-[#E5ECE8] p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-semibold">Human Interview Session</h1>

          <p className="text-sm text-[#5C6B63] leading-relaxed">
            You will receive interview questions one by one. Answer thoughtfully
            — your responses are recorded for feedback and improvement.
          </p>

          <p className="text-xs text-[#7A8A80]">
            Tip: Take your time before answering. Think like a real interview.
          </p>

          <div className="flex justify-center">
            <ActionModal
              triggerText="Start Interview"
              title="Start AI Interview?"
              description="Your interview will begin immediately."
              confirmText="Start"
              type="default"
              onConfirm={createsession}
            >
              <div className="bg-[#F7F9F7] p-4 rounded-xl text-sm">
                <ul className="space-y-3 text-sm text-[#55635B]">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    The interview will begin immediately after confirmation.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Answer naturally and professionally, as in a real interview.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Avoid refreshing, closing, or leaving the page during the
                    session.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#4A8FA3]" />
                    Your interview feedback and performance report will be
                    available after the Interviewer ends the interview.
                  </li>
                </ul>
              </div>
            </ActionModal>
          </div>
        </div>
      </div>
    );
  }

  if (sessionData?.currenthis?.status === "completed") {
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
            onClick={() => navigate(`/interview/session/result/${sessionid}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200 mr-2"
          >
            See your result
          </button>

          <button
            onClick={() => navigate("/humaniw")}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAF8] text-[#1F2A24] flex flex-col relative">
      {sessionData?.computedStatus === "onhold" && (
        <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl shadow z-50">
          On hold — pls check your connection.
        </div>
      )}

      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-md flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Human Interview Session
          </h1>
          <p className="text-xs text-[#7A8A80]">Live interview in progress</p>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">Candidate</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {sessionData?.currenthis?.username || "Candidate"}
            </p>
          </div>

          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">Interviewer</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {sessionData?.currenthis?.interviewername || "Interviewer"}
            </p>
          </div>
        </div>
      </div>

      {/* STATUS BAR (ENHANCED ONLY VISUAL) */}
      <div
        className={`px-6 py-2 border-b text-xs ${
          sessionData?.currenthis?.status === "onhold"
            ? "bg-yellow-50 text-yellow-700"
            : "bg-[#EAF5EF] text-[#4E9B7A]"
        }`}
      >
        {sessionData?.currenthis?.status === "onhold"
          ? "● On hold Interview Session"
          : "● Active Interview Session"}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full space-y-6">
        {Array.isArray(sessionData?.currenthis?.history) &&
        sessionData.currenthis.history?.length === 0 ? (
          <div className="text-center mt-24 text-gray-500 animate-pulse">
            Connecting to interviewer...
          </div>
        ) : (
          sessionData.currenthis?.history?.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                {item.role === "interviewer"
                  ? "Interviewer Question"
                  : "Candidate Answer"}
              </div>

              <div
                className={`p-4 rounded-2xl border shadow-sm ${
                  item.role === "interviewer" ? "bg-white" : "bg-[#EAF5EF]"
                }`}
              >
                <p className="text-sm leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="border-t bg-white/80 backdrop-blur-md p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={userhummodans}
            onChange={(e) => setuserhummodans(e.target.value)}
            placeholder="Type candidate’s answer..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#DDEAE3] focus:outline-none focus:ring-2 focus:ring-[#4E9B9E]"
          />

          <button
            onClick={sendanstoserver}
            className="px-5 py-3 rounded-xl bg-[#4E9B7A] text-white hover:bg-[#3f8063] transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Humaniw;
