import { Server } from "socket.io";

let io;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      socket.on("join", (roomId) => {
        socket.join(roomId);
      });

      socket.on("message", (msg) => {
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
