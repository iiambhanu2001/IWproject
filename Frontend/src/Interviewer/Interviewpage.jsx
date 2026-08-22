import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";
import { useNavigate } from "react-router-dom";
import ActionModal from "../components/ActionModal.jsx";
import { socket } from "../socket.io.js";

function InterviewPage() {
  const { sessionid } = useParams();

  const [inputQuestion, setInputQuestion] = useState("");
  const [humanquestion, setHumanquestions] = useState([]);

  const { Humanquemode, sessionData } = useSessiondata();

  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionid) return;

    socket.emit("join-session", sessionid);
  }, [sessionid]);

  useEffect(() => {
    if (!sessionid) return;

    async function fetchque() {
      const question = await Humanquemode(sessionid);

      setHumanquestions(question?.currenthis?.history || []);
    }

    fetchque();
  }, [sessionid, Humanquemode]);

  useEffect(() => {
    if (!sessionid) return;

    const handleNewQuestion = (data) => {
      setHumanquestions((prev) => {
        const exists = prev.some((item) => item.content === data.content);

        if (exists) return prev;

        return [...prev, data];
      });
    };

    socket.on("new-question", handleNewQuestion);

    return () => {
      socket.off("new-question", handleNewQuestion);
    };
  }, [sessionid]);

  // SEND QUESTION (interviewer)
  async function sendquestion() {
    try {
      await fetch(`https://iwproject1.onrender.com/api/sendque/session/${sessionid}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          content: inputQuestion,
        }),
        credentials: "include",
      });

      setInputQuestion("");
    } catch (err) {
      console.error(err);
    }
  }

  //End session

  if (!sessionid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f7fbf9] to-[#edf5f1] flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5EF] flex items-center justify-center mb-5">
            <div className="w-5 h-5 rounded-full bg-[#4E9B7A] animate-pulse"></div>
          </div>

          <h1 className="text-2xl font-bold text-[#1F2A24]">
            Waiting for Candidate
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-6">
            Interview session will start automatically once the candidate joins.
          </p>
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
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f8fbf9] to-[#edf5f1] text-[#1F2A24] flex">
      {/* LEFT - INTERVIEW FLOW */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-xl flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Interview Console
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Real-time interview session
            </p>
          </div>

          <div className="bg-[#F6FAF8] px-5 py-3 rounded-2xl border border-gray-200 text-right">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Session ID
            </p>

            <p className="text-sm font-semibold text-[#4E9B7A] mt-1">
              {sessionid}
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
          {humanquestion.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl px-10 py-12 text-center shadow-sm">
                <p className="text-gray-400 text-sm">
                  Waiting for conversation to start...
                </p>
              </div>
            </div>
          )}

          {humanquestion.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role === "interviewer" ? "justify-start" : "justify-end"
              }`}
            >
              <div className="max-w-2xl space-y-2">
                {/* LABEL */}
                <p
                  className={`text-xs font-medium tracking-wide ${
                    item.role === "interviewer"
                      ? "text-gray-500"
                      : "text-[#4E9B7A] text-right"
                  }`}
                >
                  {item.role === "interviewer"
                    ? "Interviewer Question"
                    : "Candidate Answer"}
                </p>

                {/* MESSAGE CARD */}
                <div
                  className={`p-5 rounded-3xl shadow-sm border ${
                    item.role === "interviewer"
                      ? "bg-white border-gray-200"
                      : "bg-gradient-to-r from-[#4E9B7A] to-[#5eaf8a] text-white border-transparent"
                  }`}
                >
                  <p className="text-sm leading-7">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="border-t border-gray-200 bg-white/90 backdrop-blur-xl p-5">
          <div className="flex gap-4 max-w-5xl mx-auto">
            <input
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask interview question..."
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 bg-[#F9FCFA] focus:outline-none focus:ring-4 focus:ring-[#4E9B7A]/20 focus:border-[#4E9B7A] text-sm shadow-sm"
            />

            <button
              onClick={sendquestion}
              className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              Ask
            </button>

            <ActionModal
              triggerText="End Session"
              title="End Interview Session?"
              description="This will stop the current interview and move you to feedback."
              confirmText="End Session"
              type="danger"
              onConfirm={() => navigate(`/interview/feedback/${sessionid}`)}
            >
              <div className="bg-[#FFF5F5] border border-red-100 rounded-xl p-4 text-sm text-left">
                <ul className="space-y-2 text-gray-600">
                  <li>Session will be closed immediately</li>
                  <li>You will be redirected to feedback page</li>
                  <li>Make sure you are ready to end the interview</li>
                </ul>
              </div>
            </ActionModal>
          </div>
        </div>
      </div>

      {/* RIGHT - SIDEBAR */}
      <div className="w-[340px] border-l border-gray-200 bg-white/90 backdrop-blur-xl p-6 space-y-6 shadow-lg">
        <div>
          <h2 className="font-bold text-2xl">Session Panel</h2>

          <p className="text-sm text-gray-500 mt-1">
            Interview metadata overview
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#eef7f2] to-[#f8fbf9] border border-[#dcebe3] shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Status
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

              <p className="text-sm font-semibold text-[#4E9B7A]">
                Active Interview
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#eef7f2] to-[#f8fbf9] border border-[#dcebe3] shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Candidate Name
            </p>

            <p className="text-base font-semibold text-[#1F2A24] mt-3">
              {sessionData?.username || "Candidate"}
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#eef7f2] to-[#f8fbf9] border border-[#dcebe3] shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Flow
            </p>

            <p className="text-sm mt-3 text-[#2f3d36]">
              Question → Answer → Feedback
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#eef7f2] to-[#f8fbf9] border border-[#dcebe3] shadow-sm">
            <p className="text-xs uppercase tracking-wide text-gray-400">Tip</p>

            <p className="text-sm mt-3 leading-6 text-[#2f3d36]">
              Ask one question at a time for best interview quality and response
              clarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
