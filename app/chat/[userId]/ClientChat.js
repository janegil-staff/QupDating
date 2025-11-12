"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const socket = io({ path: "/api/socket" });

export default function ClientChat({ userId }) {
  const { data: session } = useSession();
  const sessionUserId = session?.user?.id;
  const roomId =
    sessionUserId && userId ? [sessionUserId, userId].sort().join("-") : null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    console.log("✅ Connecting to socket with roomId:", roomId);
    socket.emit("join", roomId);

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));
    return () => {
      socket.off("message");
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => toast.error("Failed to load messages"));
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (roomId) socket.emit("typing", { roomId });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (roomId) socket.emit("stopTyping", { roomId });
    }, 1000);
  };
  const sendMessage = async () => {
    if (!input.trim() || !roomId || !sessionUserId) return;

    const tempMessage = {
      _id: Date.now().toString(),
      content: input,
      sender: sessionUserId,
      senderName: "You",
      senderImage: null,
      createdAt: new Date().toISOString(),
      roomId,
    };

    // ✅ Emit to socket for instant delivery
    socket.emit("message", tempMessage);

    // ✅ Update local UI immediately
    setMessages((prev = []) => [...prev, tempMessage]);
    setInput("");

    // ✅ Persist full message to DB
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempMessage), // ✅ send full message
      });
    } catch {
      toast.error("Failed to save message");
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
          const isSender =
            msg.sender === sessionUserId || msg.sender?._id === sessionUserId;

          return (
            <div
              key={msg._id}
              className={`flex items-end mb-4 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={msg.sender.images?.[0]?.url || "/images/placeholder.png"}
                  alt={msg.sender.name || "Bruker"}
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
              {isSender && (
                <img
                  src={msg.sender.images?.[0]?.url || "/images/placeholder.png"}
                  alt="Du"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2 bg-gray-800 rounded px-3 py-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          placeholder="Skriv en melding…"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
