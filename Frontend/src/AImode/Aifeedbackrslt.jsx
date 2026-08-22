import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Aifeedbackrslt() {
  const { sessionid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionid) return;

    async function fetchFeedback() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://iwproject.onrender.com/api/ai/feedback/${sessionid}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();
        const fbItem = data.history?.find(
          (item) => item.role === "ai" && item.typeofcontent === "feedback",
        );

        if (!fbItem) {
          setError("Feedback not found.");
          setLoading(false);
          return;
        }

        // Extract JSON from content string
        const jsonMatchStart = fbItem.content.indexOf("```json") + 7;
        if (!jsonMatchStart) {
          setError("Feedback JSON not found.");
          setLoading(false);
          return;
        }
        const jsonEnd = fbItem.content.indexOf("```",jsonMatchStart);
        const jsonstring = fbItem.content.substring(jsonMatchStart, jsonEnd).trim();

        const parsedFeedback = JSON.parse(jsonstring);
        console.log(parsedFeedback)
        setFeedback(parsedFeedback);
      } catch (err) {
        console.log(err);
        setError("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [sessionid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9F7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#4A8FA3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5A6A61]">
            Generating your interview feedback...
          </p>
        </div>
      </div>
    );
  }
if (error) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9F7] px-6">
      <div className="bg-white max-w-md w-full rounded-2xl border border-red-100 shadow-md p-8 text-center">
        
        <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">⚠️</span>
        </div>

        <h1 className="text-2xl font-semibold text-red-500 mb-3">
          Feedback Submission Required
        </h1>

        <p className="text-[#5A6A61] text-sm leading-relaxed mb-4">
          It looks like this session has not been completed yet, so feedback
          cannot be submitted right now.
        </p>

        <div className="bg-[#F7F9F7] border border-gray-200 rounded-xl p-4 text-left text-sm text-[#4B5B52] mb-5">
          <p className="font-medium mb-2">How to finish your session:</p>

          <ol className="list-decimal list-inside space-y-1">
            <li>Go to your Dashboard</li>
            <li>Open the session you want feedback for</li>
            <li>Complete the session properly</li>
            <li>Return here and try again</li>
          </ol>
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-5 break-words">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-3 rounded-xl bg-[#4A8FA3] text-white hover:bg-[#3c7688] transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#F7F9F7] px-6 py-10 relative overflow-hidden">
      <div className="absolute top-[-140px] left-[-120px] w-[450px] h-[450px] bg-[#DFF3EA] blur-[150px] opacity-40 rounded-full" />
      <div className="absolute bottom-[-160px] right-[-140px] w-[500px] h-[500px] bg-[#E8F1FF] blur-[160px] opacity-40 rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="bg-white border border-[#E6ECE6] rounded-3xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm text-[#6A7A72] mb-2">
                AI Interview Feedback
              </p>
              <h1 className="text-3xl font-bold text-[#1F2A24]">
                Your Interview Report
              </h1>
            </div>
            <div className="bg-[#F4FAF7] border border-[#DCEEE5] rounded-2xl px-8 py-5 text-center min-w-[180px]">
              <p className="text-sm text-[#6A7A72] mb-2">Overall Score</p>
              <h1 className="text-5xl font-bold text-[#4A8FA3]">
                {feedback.overall_score}
              </h1>
            </div>
          </div>
        </div>

        {/* PERFORMANCE CARDS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-[#E6ECE6] rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#6A7A72] mb-2">Confidence</p>
            <h2 className="text-3xl font-bold text-[#1F2A24]">
              {feedback.confidence}
            </h2>
          </div>
          <div className="bg-white border border-[#E6ECE6] rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#6A7A72] mb-2">DSA Skills</p>
            <h2 className="text-3xl font-bold text-[#1F2A24]">
              {feedback.skills?.DSA}
            </h2>
          </div>
          <div className="bg-white border border-[#E6ECE6] rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-[#6A7A72] mb-2">React Skills</p>
            <h2 className="text-3xl font-bold text-[#1F2A24]">
              {feedback.skills?.React}
            </h2>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white border border-[#E6ECE6] rounded-2xl p-7 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-5 text-[#1F2A24]">
            Strengths
          </h2>
          <div className="flex items-start gap-3 bg-[#F7FBF8] p-4 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <p className="text-[#435148]">{feedback.strength}</p>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white border border-[#E6ECE6] rounded-2xl p-7 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-5 text-[#1F2A24]">
            Areas to Improve
          </h2>
          <div className="space-y-4">
            {feedback.area_to_improve?.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-[#FFF9F7] p-4 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
                <p className="text-[#435148]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL BUTTONS */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            onClick={() => navigate("/aiiw")}
            className="px-6 py-3 rounded-xl bg-[#4A8FA3] text-white hover:bg-[#3c7688] transition"
          >
            Take Another Interview
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl border border-[#D8E2DC] bg-white hover:bg-[#F7F9F7] transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Aifeedbackrslt;
