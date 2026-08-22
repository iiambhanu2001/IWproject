import { createContext, useContext } from "react";
import { useRef,useEffect } from "react";
import { socket } from "../../socket.io";

const Audiomodecontext = createContext();

export function Audioprovider({ children }) {
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pendingCandidates = useRef([]);

  const startMic = async (sessionid, options) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: options?.video || false,
      });

      localStreamRef.current = stream;

      const peer = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        const stream = event.streams[0];

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.play().catch(() => {});
        }

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch(() => {});
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            sessionid,
            candidate: event.candidate,
          });
        }
      };
      peerRef.current = peer;
      return peer;
    } catch (err) {
      console.log(err);
    }
  };

  const handleans = async ({ answer }) => {
    await peerRef.current.setRemoteDescription(
      new RTCSessionDescription(answer),
    );

    console.log("REMOTE DESCRIPTION SET", pendingCandidates.current.length);

    for (const candidate of pendingCandidates.current) {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }

    pendingCandidates.current = [];
  };

  const handlericecandidate = async ({ candidate }) => {
    if (!peerRef.current) return;

    if (!peerRef.current.remoteDescription) {
      console.log("QUEUE ICE");

      pendingCandidates.current.push(candidate);
      return;
    }

    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

useEffect(() => {
  const onAnswer = handleans;
  const onIce = handlericecandidate;

  socket.on("answer", onAnswer);
  socket.on("ice-candidate", onIce);

  return () => {
    socket.off("answer", onAnswer);
    socket.off("ice-candidate", onIce);
  };
}, [handleans, handlericecandidate]);

  return (
    <Audiomodecontext.Provider
      value={{
        startMic,
        remoteVideoRef,
        handleans,
        handlericecandidate,
        remoteAudioRef,
      }}
    >
      {children}
    </Audiomodecontext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => useContext(Audiomodecontext);
