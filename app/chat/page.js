"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ChatPage({ roomId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket = io({ path: "/api/socket" });

    socket.emit("joinChat", roomId);

    socket.on("chatHistory", (msgs) => setMessages(msgs));
    socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socket.disconnect();
  }, [roomId]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await fetch(`/api/mobile/messages/${otherUserId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    socket.emit("send-message", { roomId, message: data.message });
  };
  
  return (
    <main className="bg-gray-900 text-white min-h-screen flex flex-col">
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-3 rounded-2xl ${
              msg.senderId === currentUser._id
                ? "bg-pink-600 text-white self-end"
                : "bg-gray-700 text-gray-200 self-start"
            }`}
          >
            <p>{msg.text}</p>
            <span className="block text-xs text-gray-400 mt-1">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </section>

      <footer className="p-4 bg-gray-800 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Skriv en melding..."
          className="flex-1 bg-gray-700 rounded-full px-4 py-2 text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full"
        >
          Send
        </button>
      </footer>
    </main>
  );
}
