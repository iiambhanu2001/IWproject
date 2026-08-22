import React, { useEffect } from "react";
import { useSessiondata } from "../Context/Interviewuserscontext";
import { useNavigate } from "react-router-dom";

function Dashboardhum() {
  const { allsessionsData, sessionbyuserIds } = useSessiondata();
  const navigate = useNavigate();

  useEffect(() => {
    sessionbyuserIds();
  }, []);

  return (
    <div className="min-h-screen bg-[#F6FAF8] px-6 py-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-[#1F2A24] tracking-tight">
          Interview Dashboard
        </h1>
        <p className="text-sm text-[#708178] mt-3">
          Track interview sessions, results, and performance.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {allsessionsData?.userdata?.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-[#E4ECE7] rounded-3xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="flex">
              {/* ================= LEFT CONTENT ================= */}
              <div className="p-6 flex-1">
                {/* NAME */}
                <h2 className="text-lg md:text-xl font-semibold text-[#1F2A24]">
                  {item.username}
                </h2>

                <p className="text-sm text-[#708178] mb-5">
                  Candidate Interview Session
                </p>

                {/* INFO */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#708178]">Interviewer</span>
                    <span className="text-[#1F2A24] font-medium">
                      {item.interviewername}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#708178]">Mode</span>
                    <span className="text-[#1F2A24] capitalize">
                      {item.mode}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#708178]">Created</span>
                    <span className="text-[#1F2A24]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (item.mode === "computer") {
                        navigate(`/result/${item.sessionid}`);
                      } else {
                        navigate(`/interview/session/result/${item.sessionid}`);
                      }
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Result
                  </button>

                  <button
                    onClick={() => navigate(`/reviewsession/${item.sessionid}`)}
                    onClick={() => {
                      if (item.status === "active") {
                        if (item.mode === "computer") {
                          navigate(`/aiiw/session/${item.sessionid}`);
                        } else {
                          navigate("/humaniw");
                        }
                      } else {
                        if (item.mode === "computer") {
                          navigate(`/reviewsession/${item.sessionid}`);
                        } else
                          navigate(
                            `/reviewsession/${item.sessionid}`,
                          );
                      }
                    }}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Open
                  </button>
                </div>
              </div>

              {/* ================= RIGHT PANEL (METRICS) ================= */}
              <div className="w-28 bg-[#F6FAF8] border-l border-[#E4ECE7] flex flex-col items-center justify-center gap-5 p-5">
                {/* STATUS DOT */}
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                    item.status === "completed"
                      ? "bg-[#E8F7EF] text-[#2F8F5B]"
                      : "bg-[#FFF4E5] text-[#C27A1D]"
                  }`}
                >
                  {item.status}
                </div>

                {/* SCORE BIG */}
                <div className="text-center">
                  <p className="text-[10px] text-[#708178] uppercase tracking-wider">
                    Score
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-[#4E9B7A]">
                    {item?.overallscore ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboardhum;
