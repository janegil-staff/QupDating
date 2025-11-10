"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io({
  path: "/api/socket",
});

export default function ClientChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);

  // Fetch message history
  useEffect(() => {
    fetch(`/api/messages?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages))
      .catch(() => toast.error("Failed to load messages"));
  }, [userId]);

  // Socket setup
  useEffect(() => {
    socket.connect();
    socket.emit("join", userId);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle input change + typing emit
  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { roomId: userId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: userId });
    }, 1000);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: userId, content: input }),
    });
    const data = await res.json();
    if (res.ok) {
      socket.emit("message", { ...data.message, roomId: userId });
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } else {
      toast.error(data.error || "Failed to send");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div
        ref={scrollRef}
        className="bg-gray-900 rounded p-4 h-[500px] overflow-y-auto mb-4 flex flex-col"
      >
        {typing && (
          <p className="text-sm text-gray-400 mb-2">User is typing…</p>
        )}
        {messages.map((msg) => {
          const isSender = msg.sender === userId;
          return (
            <div
              key={msg._id}
              className={`flex items-end mb-4 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={msg.senderImage || "/placeholder.jpg"}
                  alt="Sender avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg shadow ${
                  isSender
                    ? "bg-green-700 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <p className="text-xs text-gray-300 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString("no-NO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
