// app/chat/[matchId]/page.js
"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/lib/useSocket"; // custom hook for Socket.IO

export default function ChatPage({ params }) {
  const { matchId } = params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Fetch existing messages when the page loads
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/messages/${matchId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
    fetchMessages();
  }, [matchId]);

  // Connect to socket and listen for new messages
  const { send } = useSocket({
    matchId,
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
  });

  // Send a new message
  async function sendMessage() {
    if (!text.trim()) return;

    const payload = {
      matchId,
      text,
      // In production, include senderEmail or userId from session
      senderEmail: "me@example.com",
    };

    send(payload, (ack) => {
      if (ack?.ok) {
        setText("");
      } else {
        console.error("Socket send failed:", ack?.error);
      }
    });
  }

  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg._id ?? `${msg.createdAt}-${msg.text}`} className="mb-2">
              <span className="font-bold">{msg.sender?.name ?? "Unknown"}: </span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input + Send button */}
        <div className="flex">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 rounded bg-gray-700 text-white"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
