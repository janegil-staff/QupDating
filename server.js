// server.js
import http from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // JOIN ROOM (used for both chat + WebRTC)
    socket.on("join", (roomId) => {
      console.log(`Socket ${socket.id} joining room:`, roomId);
      socket.join(roomId);
    });

    // LEAVE ROOM
    socket.on("leave", (roomId) => {
      console.log(`Socket ${socket.id} leaving room:`, roomId);
      socket.leave(roomId);
    });

    // WEBRTC SIGNALING (your existing logic)
    socket.on("signal", ({ roomId, type, payload }) => {
      console.log("WebRTC signal:", type, "to room:", roomId);
      socket.to(roomId).emit("signal", {
        from: socket.id,
        type,
        payload,
      });
    });

    // REAL-TIME CHAT (NEW)
    socket.on("send-message", ({ roomId, message }) => {
      console.log("Chat message to room:", roomId, message);
      io.to(roomId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () =>
    console.log(`🚀 Server ready on https://qup.dating`)
  );
});
