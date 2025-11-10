import { Server } from "socket.io";

let io;

export default function socketHandler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      // Join room
      socket.on("join", (roomId) => {
        socket.join(roomId);
        console.log(`🛏️ Joined room: ${roomId}`);
      });

      // Typing indicator
      socket.on("typing", ({ roomId }) => {
        socket.to(roomId).emit("typing");
      });

      socket.on("stopTyping", ({ roomId }) => {
        socket.to(roomId).emit("stopTyping");
      });

      // Message relay
      socket.on("message", (msg) => {
        io.to(msg.roomId).emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
