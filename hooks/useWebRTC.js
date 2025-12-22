// app/hooks/useWebRTC.js
"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] },
    // Strongly recommended: add your TURN (or managed provider) for reliability
    // { urls: "turns:turn.yourdomain.com:443", username: "USER", credential: "PASS" },
  ],
};

export function useWebRTC(roomId) {
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());
  const [status, setStatus] = useState("idle"); // idle | ready | connecting | connected

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SIGNALING_URL || "https://qup.dating", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    pcRef.current = new RTCPeerConnection(ICE_SERVERS);

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { roomId, type: "ice-candidate", payload: e.candidate });
      }
    };

    pcRef.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) => remoteStreamRef.current.addTrack(t));
    };

    socket.emit("join", roomId);

    socket.on("peer-joined", async () => {
      if (!localStreamRef.current) return; // only offer when ready
      const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pcRef.current.setLocalDescription(offer);
      socket.emit("signal", { roomId, type: "offer", payload: pcRef.current.localDescription });
      setStatus("connecting");
    });

    socket.on("signal", async ({ type, payload }) => {
      try {
        if (type === "offer") {
          await pcRef.current.setRemoteDescription(payload);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          socket.emit("signal", { roomId, type: "answer", payload: pcRef.current.localDescription });
          setStatus("connecting");
        } else if (type === "answer") {
          await pcRef.current.setRemoteDescription(payload);
        } else if (type === "ice-candidate") {
          await pcRef.current.addIceCandidate(payload);
        }
      } catch (err) {
        console.error("Signal handling error:", err);
      }
    });

    socket.on("peer-left", () => {
      // Optional: clear remote stream
      remoteStreamRef.current = new MediaStream();
      setStatus("ready");
    });

    setStatus("ready");

    return () => {
      socket.emit("leave", roomId);
      socket.disconnect();
      pcRef.current?.close();
    };
  }, [roomId]);

  const startLocal = async (constraints = { video: true, audio: true }) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStreamRef.current = stream;
    stream.getTracks().forEach((track) => pcRef.current.addTrack(track, stream));
    setStatus("ready");
    return stream;
  };

  const endLocal = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setStatus("idle");
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
  };

  return {
    status,
    startLocal,
    endLocal,
    toggleAudio,
    toggleVideo,
    localStream: localStreamRef,
    remoteStream: remoteStreamRef,
  };
}
