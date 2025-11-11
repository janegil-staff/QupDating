import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log("🛏️ Joined room:", roomId);
      });

      socket.on("message", (msg) => {
        console.log("📨 Relaying to room:", msg.roomId);
        io.to(msg.roomId).emit("message", msg);
      });

      socket.on("typing", ({ roomId }) => {
        io.to(roomId).emit("typing");
      });

      socket.on("stopTyping", ({ roomId }) => {
        io.to(roomId).emit("stopTyping");
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
