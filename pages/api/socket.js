import { Server } from "socket.io";

let io = null;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
      },
    });

    console.log("🔧 Socket.io server initialized");

    io.on("connection", (socket) => {
      console.log("🔌 Socket connected:", socket.id);

      // -------------------------
      // JOIN ROOM
      // -------------------------
      socket.on("join", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        socket.currentRoom = roomId; // Track active room
        console.log(`🛏️ ${socket.id} joined ${roomId}`);
      });

      // -------------------------
      // LEAVE ROOM
      // -------------------------
      socket.on("leave", (roomId) => {
        if (!roomId) return;
        socket.leave(roomId);
        console.log(`🚪 ${socket.id} left ${roomId}`);
      });

      // -------------------------
      // INCOMING MESSAGE
      // -------------------------
      socket.on("message", (msg) => {
        if (!msg.roomId) {
          console.log("❌ message missing roomId");
          return;
        }

        console.log(`📨 New message → room: ${msg.roomId}`);
        io.to(msg.roomId).emit("message", msg);
      });

      // -------------------------
      // TYPING
      // -------------------------
      socket.on("typing", (roomId) => {
        if (!roomId) return;
        io.to(roomId).emit("typing");
      });

      socket.on("stopTyping", (roomId) => {
        if (!roomId) return;
        io.to(roomId).emit("stopTyping");
      });

      // -------------------------
      // DISCONNECT
      // -------------------------
      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
