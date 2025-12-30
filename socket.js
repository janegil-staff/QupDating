// socket.js (or wherever you initialize your socket)
import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://qupdating.onrender.com";
export const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: false,
});
