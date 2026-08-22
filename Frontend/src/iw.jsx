import { useNavigate } from "react-router-dom";

function Iw() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#1F2A24] flex flex-col relative overflow-hidden">

    
      <div className="absolute top-[-140px] left-[-120px] w-[450px] h-[450px] bg-[#CFEDE2] blur-[150px] opacity-40 rounded-full" />
      <div className="absolute bottom-[-160px] right-[-140px] w-[500px] h-[500px] bg-[#DCEFFD] blur-[160px] opacity-40 rounded-full" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-[#FFE7C7] blur-[140px] opacity-30 rounded-full" />



  
      <div className="relative z-10 text-center px-6 py-14 max-w-3xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-[#1F2A24]">
          Practice. Get feedback. Improve. Repeat.
        </h1>

        <p className="mt-4 text-[#4A5A52] text-lg">
          Built to give you a complete interview practice environment so you can
          improve with structure, clarity, and consistency.
        </p>

      </div>

      {/* MODE SECTION */}
      <div className="relative z-10 flex justify-center px-6">

        <div className="w-full max-w-3xl space-y-4">

          <div className="text-center mb-6">

            <h2 className="text-2xl font-semibold text-[#1F2A24]">
              Choose your interview mode
            </h2>

            <p className="text-[#5A6A61] text-sm mt-2">
              No distractions. Just practice.
            </p>

          </div>

          <div className="grid gap-4">

            {/* AI */}
            <button
              onClick={() => navigate("/aiiw")}
              className="text-left p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="text-[#4A8FA3] font-semibold text-lg">
                AI Interview
              </div>
              <div className="text-[#5A6A61] text-sm mt-1">
                Instant mock interview with AI feedback loop
              </div>
              <div className="text-xs text-[#8A9A92] mt-2">
                → start in under 10 seconds
              </div>
            </button>

            <button
              onClick={() => navigate("/ivmode")}
              className="text-left p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="text-[#4E9B7A] font-semibold text-lg">
                Human Interview
              </div>
              <div className="text-[#5A6A61] text-sm mt-1">
                Practice with real interviewers
              </div>
              <div className="text-xs text-[#8A9A92] mt-2">
                → scheduled / live sessions
              </div>
            </button>

            {/* INTERVIEWER */}
            <button
              onClick={() => navigate("/Adminsendque")}
              className="text-left p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className="text-[#E3A857] font-semibold text-lg">
                Become Interviewer
              </div>
              <div className="text-[#5A6A61] text-sm mt-1">
                Create questions & conduct interviews
              </div>
              <div className="text-xs text-[#8A9A92] mt-2">
                → earn / contribute / mentor
              </div>
            </button>

          </div>

        </div>
      </div>

      {/* FLOW */}
      <div className="relative z-10 px-6 max-w-5xl mx-auto mt-14">

        <h2 className="text-center text-xl font-semibold mb-8 text-[#1F2A24]">
          How the system works
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
            <div className="text-[#4A8FA3] font-semibold text-sm">Step 1</div>
            <div className="mt-2 font-medium">Take Interview</div>
            <p className="text-[#5A6A61] text-sm mt-2">
              AI or human interviewer conducts a real interview session.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
            <div className="text-[#4E9B7A] font-semibold text-sm">Step 2</div>
            <div className="mt-2 font-medium">Get Feedback</div>
            <p className="text-[#5A6A61] text-sm mt-2">
              You receive structured feedback on answers and communication.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
            <div className="text-[#E3A857] font-semibold text-sm">Step 3</div>
            <div className="mt-2 font-medium">Track Progress</div>
            <p className="text-[#5A6A61] text-sm mt-2">
              Every session is saved in your dashboard.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E6ECE6] shadow-sm">
            <div className="text-[#6B8FA3] font-semibold text-sm">Step 4</div>
            <div className="mt-2 font-medium">Improve</div>
            <p className="text-[#5A6A61] text-sm mt-2">
              Follow suggestions and improve after every attempt.
            </p>
          </div>

        </div>
      </div>

      {/* DASHBOARD */}
      <div className="relative z-10 text-center mt-16 px-6">

        <h2 className="text-xl font-semibold text-[#1F2A24]">
          Your Dashboard tracks everything
        </h2>

        <p className="text-[#5A6A61] mt-2 max-w-xl mx-auto text-sm">
          Each interview is stored with feedback so you can see your improvement over time.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 px-6 py-3 rounded-full bg-[#4E9B7A] text-white hover:bg-[#3f8063] transition shadow-sm"
        >
          Go to Dashboard
        </button>

      </div>

  
      <div className="relative z-10 text-center mt-20 pb-16 px-6">

        <h2 className="text-2xl font-semibold text-[#1F2A24]">
          Start your improvement journey today
        </h2>

        <button
          onClick={() => navigate("http://https://iwproject.onrender.com/auth/login")}
          className="mt-5 text-[#4E9B7A] hover:underline"
        >
          Get Started →
        </button>

      </div>

    </div>
  );
}

export default Iw;