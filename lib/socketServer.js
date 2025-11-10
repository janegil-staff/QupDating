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

    socket.on("message", async (payload, ack) => {
      try {
        const saved = await persistMessage(payload);
        io.to(payload.matchId).emit("message", saved);
        if (ack) ack({ ok: true, message: saved });
      } catch (err) {
        if (ack) ack({ ok: false, error: err.message });
      }
    });
  });
  return io;
}
