import { socket } from "../socket.io.js";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActionModal from "../components/ActionModal.jsx";
import { useAudio } from "../Context/Webrtc/audio.jsx";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";

function Videomode() {
  const { sessionid } = useParams();

  const { Humanquemode, sessionData } = useSessiondata();
  const { startMic, remoteVideoRef, handlericecandidate } = useAudio();
  const navigate = useNavigate();

  async function startusersession() {
    const res = await fetch(
      "/api/api/startinterview?ivmode=video",
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
        `/startinterview/videomode/session/${data.newsession.sessionid}`,
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

      const peer = await startMic(sessionid, { video: true });

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

 if (!sessionid) {
    return (
      <div className="min-h-screen bg-[#0B0F0D] flex items-center justify-center px-6 relative">

        <div className="max-w-xl text-center space-y-5 bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg backdrop-blur-md text-white">

          <h1 className="text-2xl font-semibold">
            Human Interview Session (Video)
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            Video-based interview session. You will see the interviewer and respond via camera and microphone.
          </p>

          <p className="text-xs text-gray-400">
            Tip: Keep good lighting and stable internet connection.
          </p>

          <div className="flex justify-center">
            <ActionModal
              triggerText="Start Interview"
              title="Start Video Interview?"
              description="Your video session will begin immediately."
              confirmText="Start"
              type="default"
              onConfirm={createsession}
            >
              <div className="bg-white/5 p-4 rounded-xl text-sm text-gray-300">
                <ul className="space-y-3">
                  <li>Maintain eye contact with the camera.</li>
                  <li>Do not refresh or leave during session.</li>
                  <li>Ensure camera & microphone permissions are allowed.</li>
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
      <div className="min-h-screen bg-[#0B0F0D] flex items-center justify-center px-4 text-white">

        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center shadow-xl max-w-md w-full backdrop-blur-md">

          <h1 className="text-2xl font-bold">
            Interview Completed
          </h1>

          <p className="text-sm text-gray-400 mt-3">
            This video session has ended successfully.
          </p>

          <button
            onClick={() => navigate(`/interview/session/result/${sessionid}`)}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#4E9B7A] text-white"
          >
            See Result
          </button>

          <button
            onClick={() => navigate("/humaniw")}
            className="mt-4 px-6 py-3 rounded-2xl bg-white/10 text-white"
          >
            New Interview
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F0D] flex flex-col text-white">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center">

        <div>
          <h1 className="text-lg font-semibold">
            Human Interview Session (Video)
          </h1>
          <p className="text-xs text-gray-400">
            Live video interview in progress
          </p>
        </div>

        <div className="flex gap-3">

          <div className="px-4 py-2 border border-white/10 rounded-xl bg-white/5">
            <p className="text-[10px] text-gray-400">Candidate</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {sessionData?.currenthis?.username || "Candidate"}
            </p>
          </div>

          <div className="px-4 py-2 border border-white/10 rounded-xl bg-white/5">
            <p className="text-[10px] text-gray-400">Interviewer</p>
            <p className="text-sm font-medium text-[#4E9B7A]">
              {sessionData?.currenthis?.interviewername || "Interviewer"}
            </p>
          </div>

        </div>
      </div>

      {/* STATUS BAR */}
      <div className="px-6 py-2 border-b border-white/10 bg-[#0f1a14] text-[#4E9B7A] text-xs">
        ● Active Video Interview Session
      </div>

      {/* MAIN VIDEO AREA */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-5xl mx-auto w-full space-y-6">

        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">
            Video Interview in Progress
          </h2>

          <p className="text-sm text-gray-400">
            Speak naturally while maintaining eye contact with camera.
          </p>
        </div>

        {/* VIDEO FRAME */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* LIVE badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs">LIVE</span>
          </div>

          {/* label */}
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-lg text-xs text-gray-300">
            Remote Interviewer
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Tip: Ensure stable lighting and avoid background noise for best experience.
        </p>

      </div>
    </div>
);
}

export default Videomode;
