import React, { useEffect } from "react";
import { useSessiondata } from "../Context/Interviewuserscontext";
import { useNavigate } from "react-router-dom";

function Dashboardiw() {
  const { allsessionsData, sessionbyuserIds } = useSessiondata();
  const navigate = useNavigate();

  useEffect(() => {
    sessionbyuserIds();
  }, []);

  const sessions = allsessionsData?.interviewerData || [];

  return (
    <div className="min-h-screen bg-[#F6FAF8] px-6 py-10">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-[#1F2A24]">
          Interviewer Dashboard
        </h1>
        <p className="text-sm text-[#708178] mt-2">
          Select a candidate session to review interview and feedback.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {sessions.map((item) => (

          <div
            key={item._id}
            className="bg-white border border-[#E4ECE7] rounded-3xl shadow-sm hover:shadow-md transition overflow-hidden"
          >

            {/* TOP */}
            <div className="p-6">

              <h2 className="text-lg font-semibold text-[#1F2A24]">
                {item.username}
              </h2>

              <p className="text-sm text-[#708178]">
                Candidate Interview Session
              </p>

              {/* INFO */}
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                  <span className="text-[#708178]">Mode</span>
                  <span className="text-[#1F2A24] capitalize">
                    {item.mode}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#708178]">Date</span>
                  <span className="text-[#1F2A24]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#708178]">Session</span>
                  <span className="text-[#1F2A24] truncate max-w-[140px]">
                    {item.sessionid}
                  </span>
                </div>

              </div>

              {/* FEEDBACK PREVIEW */}
              <div className="mt-4 p-3 bg-[#F6FAF8] rounded-xl">
                <p className="text-xs text-[#708178]">Feedback Summary</p>
                <p className="text-sm text-[#1F2A24]">
                  {item?.feedback?.summary || "No feedback available yet"}
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 p-4 bg-[#F6FAF8] border-t border-[#E4ECE7]">

              <button
                onClick={() =>
                  navigate(`/reviewsession/${item.sessionid}`)
                }
                className="flex-1 py-2 rounded-xl bg-[#4E9B7A] text-white text-sm hover:bg-[#3D8465] transition"
              >
                Open Interview
              </button>

              <button
                onClick={() =>
                  navigate(`/interview/session/result/${item.sessionid}`)
                }
                className="flex-1 py-2 rounded-xl border border-[#DDE7E2] text-sm hover:bg-[#F1F6F3] transition"
              >
                View Report
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboardiw;