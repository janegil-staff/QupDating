import { Server } from "socket.io";

let io;

export default function socketHandler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      // Join room
      socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log(`🛏️ Joined room: ${roomId}`);
      });

      socket.on("receive-message", (msg) => {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      });

      // Typing indicator
      socket.on("typing", ({ roomId }) => {
        io.to(roomId).emit("typing");
      });

      socket.on("stopTyping", ({ roomId }) => {
        io.to(roomId).emit("stopTyping");
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
