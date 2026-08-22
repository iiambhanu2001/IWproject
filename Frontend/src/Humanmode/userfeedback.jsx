import React from "react";
import { useLocation } from "react-router-dom";

function Feedback() {
  const location = useLocation();

  const feedback = location.state?.feedback;

  if (!feedback) {
    return <div>No feedback found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6FAF8] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">

        <h1 className="text-3xl font-bold mb-2">
          Interview Feedback
        </h1>

        <p className="text-gray-500 mb-8">
          Performance summary and improvement areas
        </p>

        {/* SCORE CARDS */}
        <div className="grid grid-cols-2 gap-5 mb-8">

          <div className="p-5 border rounded-xl">
            <p className="text-gray-500 text-sm">
              Confidence Level
            </p>

            <h2 className="text-3xl font-bold text-[#4E9B7A]">
              {feedback.confidence}/10
            </h2>
          </div>

          <div className="p-5 border rounded-xl">
            <p className="text-gray-500 text-sm">
              Answer Structure
            </p>

            <h2 className="text-3xl font-bold text-[#4E9B7A]">
              {feedback.structure}/10
            </h2>
          </div>

          <div className="p-5 border rounded-xl">
            <p className="text-gray-500 text-sm">
              Communication
            </p>

            <h2 className="text-3xl font-bold text-[#4E9B7A]">
              {feedback.language}/10
            </h2>
          </div>

          <div className="p-5 border rounded-xl">
            <p className="text-gray-500 text-sm">
              Technical Skill
            </p>

            <h2 className="text-3xl font-bold text-[#4E9B7A]">
              {feedback.skill}/10
            </h2>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            Overall Feedback
          </h2>

          <div className="p-5 border rounded-xl bg-[#F6FAF8]">
            <p className="text-gray-700 leading-7">
              {feedback.summary}
            </p>
          </div>
        </div>

        {/* IMPROVEMENTS */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Areas to Improve
          </h2>

          <ul className="space-y-3">
            {feedback.improvements?.map((item, index) => (
              <li
                key={index}
                className="p-4 border rounded-xl bg-red-50"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Feedback;