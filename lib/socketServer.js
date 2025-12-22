import { Server } from "socket.io";
import { persistMessage } from "./realtimeHandlers.js";
let io;

export function getIO(server) {
  if (io) return io;
  io = new Server(server, {
    path: "/socket.io",
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ matchId }) => socket.join(matchId));
    
    socket.on("receive-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });
  });
  return io;
}
