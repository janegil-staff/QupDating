// lib/useSocket.js
"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket({ matchId, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function init() {
      // Ping the socket-ready route (optional)
      await fetch("/api/socket").catch(() => {});

      const socket = io("", { path: "/socket.io" }); // same-origin
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join", { matchId });
      });

      socket.on("message", (message) => {
        if (active && onMessage) onMessage(message);
      });
    }

    init();

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [matchId, onMessage]);

  const send = (payload, ack) => {
    socketRef.current?.emit("message", payload, ack);
  };

  return { send };
}
