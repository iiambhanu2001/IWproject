import { useNavigate } from "react-router-dom";

function InterviewHome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-[#F7F9F7] text-[#1F2A24] px-6">

      <div className="max-w-lg w-full bg-white border border-[#E6ECE6] rounded-2xl p-10 shadow-sm space-y-6">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Interviewer Console
          </h1>

          <p className="text-sm text-[#5C6B63]">
            Start or manage an interview session. Select a candidate and begin evaluation.
          </p>
        </div>

        <div className="border-t border-[#E6ECE6] pt-4 space-y-2 text-xs text-[#7A8A80]">
          <p>• Select a candidate from the list</p>
          <p>• Conduct structured interview session</p>
          <p>• Assign score and feedback</p>
        </div>

        <button
          onClick={() => navigate("/candidate")}
          className="w-full px-6 py-3 rounded-xl bg-[#1F2A24] text-white hover:bg-black transition"
        >
          Take Interview
        </button>

      </div>
    </div>
  );
}

export default InterviewHome;