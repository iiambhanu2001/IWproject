import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";

function Archivechats() {
  const { sessionid } = useParams();
  const navigate = useNavigate();

  const { Humanquemode } = useSessiondata();
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      const data = await Humanquemode(sessionid);
      setSession(data.currenthis);
    }

    fetchSession();
    console.log(session)
  }, [sessionid]);

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex flex-col">
      {/* ================= TOP HEADER ================= */}
      <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-md flex items-center justify-between">
        {/* LEFT */}
        <div>
          <h1 className="text-lg font-semibold text-[#1F2A24]">
            Archived Interview
          </h1>

          <p className="text-xs text-[#7A8A80]">
            Read-only conversation history
          </p>
        </div>

        {/* RIGHT - INFO CARDS */}
        <div className="flex gap-3 flex-wrap justify-end">
          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">Interviewer</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {session?.interviewername || "N/A"}
            </p>
          </div>

          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">Interviewer ID</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {session?.interviewerid || "N/A"}
            </p>
          </div>

          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">User ID</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {session?.userid || "N/A"}
            </p>
          </div>

          <div className="px-4 py-2 border rounded-xl bg-[#F6FAF8]">
            <p className="text-[10px] text-gray-500">Email</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {session?.useremail || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= STATUS BAR ================= */}
      <div className="px-6 py-2 bg-yellow-100 text-yellow-800 text-xs text-center">
        This session is finished. Conversation is read-only.
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-3xl mx-auto w-full space-y-4">
        {session?.history?.length ? (
          session.history.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="text-[11px] text-gray-500 uppercase">
                {item.role}
              </div>

              <div
                className={`p-4 rounded-2xl border ${
                  item.role === "interviewer" ? "bg-white" : "bg-[#EAF5EF]"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No conversation found</div>
        )}
      </div>

      {/* ================= FOOTER ACTIONS ================= */}
  
        <div className="border-t bg-white p-4 flex flex-col gap-3 max-w-3xl mx-auto w-full">
          <button
            onClick={() => {
              if (session.mode === "computer") {
                navigate(`/result/${session.sessionid}`);
              } else {
                navigate(`/interview/session/result/${session.sessionid}`);
              }
            }}
            className="w-full py-3 bg-[#4E9B7A] text-white rounded-xl"
          >
            View Result
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 border rounded-xl text-gray-700"
          >
            Back to Dashboard
          </button>
        </div>
  
    </div>
  );
}

export default Archivechats;
