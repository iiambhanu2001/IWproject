import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext";

function Result() {
  const { sessionid } = useParams();
  const [feedback, setFeedback] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const { Humanquemode, sessionData, setsessionData } = useSessiondata();

  useEffect(() => {
    const fetchResult = async () => {
      const res = await fetch(
        `/api/api/interview/session/result/${sessionid}`,{
          method:"GET",
          credentials:"include"
        }
      );
      const data = await res.json();
      setFeedback(data?.history || []);
    };

    const fetchSession = async () => {
      const report = await Humanquemode(sessionid);

    };

    fetchResult();
    fetchSession();
  }, [sessionid]);

  // ================= DATE FORMAT =================
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= AVERAGE =================
  const avg = (r = {}) => {
    const v = Object.values(r || {}).filter(Boolean);
    if (!v.length) return 0;
    return Math.round(v.reduce((a, b) => a + b, 0) / v.length);
  };

  const overall = useMemo(() => {
    if (!feedback.length) return 0;
    return Math.round(
      feedback.reduce((a, b) => avg(b.ratings) + a, 0) / feedback.length
    );
  }, [feedback]);

  // ================= SCORE CIRCLE =================
  const ScoreCircle = ({ value }) => {
    const size = 80;
    const stroke = 6;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / 10) * circumference;

    return (
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4E9B7A"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="700"
          fill="#1F2A24"
        >
          {value}
        </text>
      </svg>
    );
  };

  // ================= RATING CARD =================
  const RatingCard = ({ label, value }) => (
    <div className="bg-[#F6FAF8] border rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-[#4E9B7A] mt-1">
        {value ?? "-"} / 10
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6FAF8] px-6 py-8 text-[#1F2A24]">

      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Interview Report
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Session ID: {sessionid}
          </p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-3">
          <ScoreCircle value={overall} />
        </div>

      </div>

      {/* ================= SESSION INFO ================= */}
      <div className="max-w-6xl mx-auto bg-white border rounded-2xl shadow-sm p-6 mb-6">

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-[#4E9B7A]">
              Candidate Details
            </h2>

            <p className="text-sm">
              <span className="text-gray-400">Name:</span>{" "}
              {sessionData?.username || "-"}
            </p>

            <p className="text-sm">
              <span className="text-gray-400">Email:</span>{" "}
              {sessionData?.useremail || "-"}
            </p>

            <p className="text-sm">
              <span className="text-gray-400">Created:</span>{" "}
              {formatDate(sessionData?.createdAt)}
            </p>
          </div>

          {/* RIGHT */}
          <div className="space-y-2 md:text-right">
            <h2 className="text-sm font-semibold text-[#4E9B7A]">
              Interview Details
            </h2>

            <p className="text-sm">
              <span className="text-gray-400">Interviewer:</span>{" "}
              {sessionData?.interviewername || "-"}
            </p>

            <p className="text-sm">
              <span className="text-gray-400">Mode:</span>{" "}
              {sessionData?.mode || "-"}
            </p>
          </div>

        </div>
      </div>

      {/* ================= RATINGS ================= */}
      <div className="max-w-6xl mx-auto mb-6">

        <h2 className="text-sm font-semibold mb-4">
          Performance Ratings
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <RatingCard
            label="Confidence"
            value={feedback[0]?.ratings?.confidence}
          />

          <RatingCard
            label="Structure"
            value={feedback[0]?.ratings?.answerStructure}
          />

          <RatingCard
            label="Communication"
            value={feedback[0]?.ratings?.communication}
          />

          <RatingCard
            label="Technical Skill"
            value={feedback[0]?.ratings?.technicalSkill}
          />

        </div>
      </div>

      {/* ================= FEEDBACK ================= */}
      <div className="max-w-6xl mx-auto bg-white border rounded-2xl shadow-sm p-6">

        <h2 className="text-sm font-semibold mb-4">
          Detailed Feedback
        </h2>

        <div className="space-y-4">

          {feedback.length === 0 ? (
            <p className="text-sm text-gray-500">
              No feedback available
            </p>
          ) : (
            feedback.map((item) => {
              const isOpen = expandedId === item._id;

              return (
                <div
                  key={item._id}
                  className="bg-[#F6FAF8] border rounded-xl p-4"
                >

                  <p
                    className={`text-sm text-gray-700 leading-relaxed ${
                      !isOpen ? "line-clamp-3" : ""
                    }`}
                  >
                    {item.content}
                  </p>

                  {item.content?.length > 120 && (
                    <button
                      onClick={() =>
                        setExpandedId(isOpen ? null : item._id)
                      }
                      className="text-xs mt-2 text-[#4E9B7A] font-medium"
                    >
                      {isOpen ? "Show less" : "View more"}
                    </button>
                  )}

                </div>
              );
            })
          )}

        </div>
      </div>

    </div>
  );
}

export default Result;