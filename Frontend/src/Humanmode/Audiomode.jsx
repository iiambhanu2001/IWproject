import { socket } from "../socket.io.js";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActionModal from "../components/ActionModal.jsx";
import { useAudio } from "../Context/Webrtc/audio.jsx";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";

function Audiomode() {
  const { sessionid } = useParams();

  const { Humanquemode, sessionData } = useSessiondata();
  const { startMic, remoteAudioRef, handlericecandidate } = useAudio();
  const navigate = useNavigate();

  async function startusersession() {
    const res = await fetch(
      "/api/api/startinterview?ivmode=audio",
      {
        method: "GET",
        credentials: "include",
      },
    );
    return await res.json();
  }
  useEffect(() => {
    if (!sessionid) return;

    async function fetchque() {
      await Humanquemode(sessionid);
    }

    fetchque();
  }, [sessionid, Humanquemode]);

  async function createsession() {
    const data = await startusersession();

    if (data.message === "success") {
      navigate(
        `/startinterview/audiomode/session/${data.newsession.sessionid}`,
      );
    }

    if (
      data.message ===
      "Oops! One session is already active. Pls complete it first!!"
    ) {
      alert("You already have an active session. Please rejoin it first.");
      return;
    }
  }

  useEffect(() => {
    socket.on("ice-candidate", handlericecandidate);
    return () => socket.off("ice-candidate", handlericecandidate);
  }, []);

  useEffect(() => {
    if (!sessionid) return;

    const acceptoffer = async ({ offer }) => {
      console.log("OFFER RECEIVED");

      const peer = await startMic(sessionid);

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", { sessionid, answer });
    };

    socket.on("offer", acceptoffer);

    return () => {
      socket.off("offer", acceptoffer);
    };
  }, [sessionid]);

  useEffect(() => {
    if (!sessionid) return;

    socket.emit("join-session", sessionid);
  }, [sessionid]);
  /* ===================== UI ===================== */

  if (!sessionid) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-[#F6FAF8] flex items-center justify-center px-6 relative">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#DFF3EA] blur-[140px] opacity-40 rounded-full pointer-events-none" />
        <div className="absolute bottom-[-140px] right-[-120px] w-[420px] h-[420px] bg-[#E8F1FF] blur-[150px] opacity-40 rounded-full pointer-events-none" />

        <div className="max-w-xl text-center space-y-5 bg-white border border-[#E5ECE8] p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-semibold">Human Interview Session</h1>

          <p className="text-sm text-[#5C6B63] leading-relaxed">
            Audio-based interview session. You will hear questions and respond
            verbally.
          </p>

          <p className="text-xs text-[#7A8A80]">
            Tip: Keep your microphone enabled and stay in a quiet environment.
          </p>

          <div className="flex justify-center">
            <ActionModal
              triggerText="Start Interview"
              title="Start Audio Interview?"
              description="Your audio session will begin immediately."
              confirmText="Start"
              type="default"
              onConfirm={createsession}
            >
              <div className="bg-[#F7F9F7] p-4 rounded-xl text-sm">
                <ul className="space-y-3 text-sm text-[#55635B]">
                  <li>Speak clearly and naturally like a real interview.</li>
                  <li>Do not refresh or leave during the session.</li>
                  <li>Ensure microphone permission is allowed.</li>
                  <li>Feedback will be shown after completion.</li>
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
      <div className="min-h-screen bg-[#F6FAF8] flex items-center justify-center px-4">
        <div className="bg-white border border-[#E5ECE8] p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#1F2A24]">
            Interview Completed
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            This audio session has ended successfully.
          </p>

          <button
            onClick={() => navigate(`/interview/session/result/${sessionid}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#4E9B7A] text-white"
          >
            See Result
          </button>

          <button
            onClick={() => navigate("/humaniw")}
            className="mt-4 px-6 py-3 rounded-2xl bg-[#3f8063] text-white"
          >
            New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex flex-col text-[#1F2A24]">
      {/* HEADER (same as text mode) */}
      <div className="px-6 py-4 border-b bg-white/80 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            Human Interview Session (Audio)
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

      {/* STATUS BAR */}
      <div className="px-6 py-2 border-b bg-[#EAF5EF] text-[#4E9B7A] text-xs">
        ● Active Audio Interview Session
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-3xl mx-auto w-full space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Audio Interview in Progress</h2>
          <p className="text-sm text-gray-500">
            Listen carefully and respond verbally through your microphone.
          </p>
        </div>

        {/* AUDIO VISUAL (subtle) */}
        <div className="flex items-end gap-1 h-10">
          <span className="w-1.5 h-4 bg-[#4E9B7A] animate-pulse rounded"></span>
          <span className="w-1.5 h-8 bg-[#4E9B7A] animate-pulse rounded"></span>
          <span className="w-1.5 h-5 bg-[#4E9B7A] animate-pulse rounded"></span>
          <span className="w-1.5 h-9 bg-[#4E9B7A] animate-pulse rounded"></span>
        </div>

        {/* AUDIO */}
        <audio
          ref={remoteAudioRef}
          autoPlay
          controls
          className="w-full max-w-md"
        />

        <p className="text-xs text-gray-500 text-center">
          Tip: The interviewer may stay silent while listening to your response.
        </p>
      </div>
    </div>
  );
}

export default Audiomode;
