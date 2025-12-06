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
    cors: { origin: process.env.CLIENT_ORIGIN || "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("peer-joined", { id: socket.id });
    });

    socket.on("signal", ({ roomId, type, payload }) => {
      socket.to(roomId).emit("signal", { from: socket.id, type, payload });
    });

    socket.on("leave", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("peer-left", { id: socket.id });
    });

    socket.on("disconnect", () => {
      // Optionally broadcast to rooms the socket was in
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Ready on http://localhost:${port}`));
});
