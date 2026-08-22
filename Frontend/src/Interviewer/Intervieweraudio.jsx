import { useAudio } from "../Context/Webrtc/audio.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useSessiondata } from "../Context/Interviewuserscontext.jsx";
import { useEffect } from "react";

import { socket } from "../socket.io.js";
export default function Intervieweraudio() {
  const navigate = useNavigate();
  const { sessionid } = useParams();
  const { startMic,  remoteAudioRef } =
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

      const peer = await startMic(sessionid);

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

  // useEffect(() => {
  //   socket.on("answer", handleans);
  //   console.log(remoteAudioRef);
  //   return () => {
  //     socket.off("answer", handleans);
  //   };
  // }, []);

  // useEffect(() => {
  //   socket.on("ice-candidate", handlericecandidate);

  //   return () => {
  //     socket.off("ice-candidate", handlericecandidate);
  //   };
  // }, []);

  if (!sessionid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f7fbf9] to-[#edf5f1] flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5EF] flex items-center justify-center mb-5">
            <div className="w-5 h-5 rounded-full bg-[#4E9B7A] animate-pulse"></div>
          </div>

          <h1 className="text-2xl font-bold text-[#1F2A24]">
            Waiting for Candidate
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-6">
            Interview session will start automatically once the candidate joins.
          </p>
        </div>
      </div>
    );
  }
  if (sessionData?.status === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f7fbf9] to-[#edf5f1] flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 p-10 rounded-3xl text-center shadow-xl max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5EF] flex items-center justify-center mb-5">
            <svg
              className="w-8 h-8 text-[#4E9B7A]"
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

          <h1 className="text-2xl font-bold text-[#1F2A24]">
            Interview Completed
          </h1>

          <p className="text-sm text-gray-500 mt-3 leading-6">
            This interview session has ended successfully.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4E9B7A] to-[#3f8063] text-white font-medium shadow-md hover:scale-[1.02] transition-all duration-200"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef7f2] via-[#f7fbf9] to-[#edf5f1] flex flex-col">
      {/* TOP BAR */}
      <div className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white/60 backdrop-blur-xl">
        <div>
          <h1 className="text-lg font-semibold text-[#1F2A24]">
            Interviewer Console
          </h1>
          <p className="text-xs text-gray-500">Session ID: {sessionid}</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-green-700">
            Live Connection
          </span>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-10 text-center">
          {/* AVATAR */}
          <div className="relative mx-auto w-fit">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4E9B7A] to-[#3f8063] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              C
            </div>

            {/* pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20"></span>
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-2xl font-semibold text-[#1F2A24]">
            Candidate is Speaking
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Listening to real-time audio stream
          </p>

          {/* AUDIO VISUALIZER */}
          <div className="mt-8 flex items-end justify-center gap-1 h-10">
            <span className="w-1.5 h-4 bg-green-500 animate-pulse rounded"></span>
            <span className="w-1.5 h-8 bg-green-400 animate-pulse rounded"></span>
            <span className="w-1.5 h-5 bg-green-500 animate-pulse rounded"></span>
            <span className="w-1.5 h-9 bg-green-400 animate-pulse rounded"></span>
            <span className="w-1.5 h-6 bg-green-500 animate-pulse rounded"></span>
          </div>

          {/* AUDIO */}
          <audio
            ref={remoteAudioRef}
            autoPlay
            controls
            className="mt-6 w-full max-w-md mx-auto"
          />

          {/* STATUS CARD */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-4 text-left">
            <p className="text-sm font-medium text-green-700">
              🎧 WebRTC Stream Active
            </p>
            <p className="text-xs text-green-600 mt-1">
              Peer-to-peer audio connection is stable
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/interview/feedback/${sessionid}`)}
              className="px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg transition-all duration-200 hover:scale-[1.03]"
            >
              End Interview
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
            >
              Exit Console
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
