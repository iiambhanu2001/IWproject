import { useAudio } from "../Context/Webrtc/audio.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";
import { useEffect } from "react";

import { socket } from "../socket.io.js";

export default function Interviewervideo() {
  const navigate = useNavigate();
  const { sessionid } = useParams();
  const { startMic,remoteVideoRef } =
    useAudio();
  const { Humanquemode, sessionData } = useSessiondata();

  useEffect(() => {
    if (!sessionid) return;

    async function fetchque() {
      await Humanquemode(sessionid);
    }

    fetchque();
  }, [sessionid, Humanquemode]);


 useEffect(() => {
    if (!sessionid) return;

    socket.emit("join-session", sessionid);

    const handleBothConnected = async () => {
      console.log("Both users connected");

      const peer = await startMic(sessionid, { video: true });

      const offer = await peer.createOffer();

      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        sessionid,
        offer,
      });
    };

    socket.on("both-connected", handleBothConnected);

    return () => {
      socket.off("both-connected", handleBothConnected);
    };
  }, [sessionid]);


if (!sessionid) {
    return (
      <div className="min-h-screen bg-[#0B0F0D] flex items-center justify-center px-4 text-white">

        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center shadow-xl max-w-md w-full backdrop-blur-md">

          <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-5">
            <div className="w-3 h-3 rounded-full bg-[#4E9B7A] animate-pulse"></div>
          </div>

          <h1 className="text-2xl font-bold">
            Waiting for Candidate
          </h1>

          <p className="text-sm text-gray-400 mt-3 leading-6">
            Interview session will start automatically once the candidate joins.
          </p>

        </div>
      </div>
    );
  }

  if (sessionData?.status === "completed") {
    return (
      <div className="min-h-screen bg-[#0B0F0D] flex items-center justify-center px-4 text-white">

        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl text-center shadow-xl max-w-md w-full backdrop-blur-md">

          <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-5">
            <svg
              className="w-7 h-7 text-[#4E9B7A]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold">
            Interview Completed
          </h1>

          <p className="text-sm text-gray-400 mt-3">
            This video interview session has ended successfully.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#4E9B7A] text-white font-medium hover:scale-[1.02] transition"
          >
            Start New Interview
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F0D] flex flex-col text-white">

      {/* TOP BAR */}
      <div className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md">

        <div>
          <h1 className="text-lg font-semibold">
            Interviewer Console (Video)
          </h1>
          <p className="text-xs text-gray-400">
            Session ID: {sessionid}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-gray-300">
            Live Connection
          </span>
        </div>

      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-5xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 text-center backdrop-blur-md">

          {/* VIDEO FRAME (candidate stream placeholder) */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-lg">

            {/* Remote stream */}
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
              Candidate Feed
            </div>

          </div>

          {/* STATUS TEXT */}
          <h2 className="mt-6 text-2xl font-semibold">
            Watching Candidate
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Listening and observing real-time video interview stream
          </p>

          {/* SIMPLE VISUALIZER (optional aesthetic) */}
          <div className="mt-6 flex items-end justify-center gap-1 h-10">
            <span className="w-1.5 h-4 bg-[#4E9B7A] animate-pulse rounded"></span>
            <span className="w-1.5 h-8 bg-[#4E9B7A] animate-pulse rounded"></span>
            <span className="w-1.5 h-5 bg-[#4E9B7A] animate-pulse rounded"></span>
            <span className="w-1.5 h-9 bg-[#4E9B7A] animate-pulse rounded"></span>
            <span className="w-1.5 h-6 bg-[#4E9B7A] animate-pulse rounded"></span>
          </div>

          {/* STATUS CARD */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 text-left">

            <p className="text-sm font-medium text-[#4E9B7A]">
              🎥 WebRTC Video Stream Active
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Peer-to-peer video connection is stable
            </p>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">

            <button
              onClick={() => navigate(`/interview/feedback/${sessionid}`)}
              className="px-6 py-3 rounded-2xl bg-red-500 text-white font-medium hover:scale-[1.03] transition"
            >
              End Interview
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-white/10 text-white font-medium hover:bg-white/20 transition"
            >
              Exit Console
            </button>

          </div>

        </div>
      </div>
    </div>
  );
  
}


