"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import EmojiPicker from "emoji-picker-react";
import { getAgeFromDate } from "@/lib/getAgeFromDate";
import { redirect } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import VerifiedBadge from "@/components/VerifiedBadge";

const socket = io({ path: "/api/socket" });

export default function ChatPage({ userId }) {
  const { data: session } = useSession();
  const sessionUserId = session?.user?.id;

  // 👇 selected user state (initially from prop)
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState();
  const [open, setOpen] = useState();
  const [currentIndex, setCurrentIndex] = useState();
  const [index, setIndex] = useState();
  const typingTimeout = useRef(null);
  const endRef = useRef(null);

  // 👇 roomId depends on selectedUserId
  const roomId =
    sessionUserId && selectedUserId
      ? [sessionUserId, selectedUserId].sort().join("-")
      : null;

  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  // Fetch selected user profile
  useEffect(() => {
    async function fetchUser() {
      if (!selectedUserId) return;
      const res = await fetch(`/api/profile/${selectedUserId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    }
    fetchUser();
  }, [selectedUserId]);

  // fetch current user's matches once session is available
  useEffect(() => {
    async function fetchMatches() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches || []);
        } else {
          // fallback: use session user matches if available
          setMatches(session?.user?.matches || []);
        }
      } catch {
        toast.error("Kunne ikke hente matcher");
        setMatches(session?.user?.matches || []);
      } finally {
        setMatchesLoading(false);
      }
    }
    fetchMatches();
  }, [session?.user?.id]);

  // Socket setup
  useEffect(() => {
    if (!roomId) return;

    socket.connect();
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

  // Fetch messages for selected room
  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => toast.error("Failed to load messages"));
  }, [roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "auto" });
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

    const msg = {
      _id: Date.now().toString(),
      content: input,
      sender: sessionUserId,
      senderName: session?.user?.name || "You",
      senderImage: session?.user?.image || "/default-avatar.png",
      createdAt: new Date().toISOString(),
      roomId,
    };

    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
    } catch {
      toast.error("Failed to save message");
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Left Sidebar */}

      <aside className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 font-bold text-pink-500">Your matches</h2>

        {matchesLoading ? (
          <div className="p-3 text-sm text-gray-400">Loading matcher…</div>
        ) : (
          <ul>
            {matches?.map((match) =>
              match._id !== session?.user?.id ? (
                <li
                  key={match._id}
                  onClick={() => setSelectedUserId(match._id)}
                  className={`p-3 hover:bg-gray-700 cursor-pointer ${
                    match._id === selectedUserId ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={match.profileImage || "/default-avatar.png"}
                      alt={match.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{match.name}</span>
                  </div>
                </li>
              ) : null
            )}
            {(!matches || matches.length === 0) && (
              <li className="p-3 text-sm text-gray-400">Ingen matcher ennå.</li>
            )}
          </ul>
        )}
      </aside>
      {/* Chat Section */}
      <div className="flex-1 flex flex-col border-r border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
          <img
            src={user?.profileImage || "/default-avatar.png"}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <h2 className="text-sm font-semibold">{user?.name || "Chat"}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 custom-scroll mb-30">
          {typing && (
            <p className="text-sm text-gray-400 mb-2">User is typing…</p>
          )}
          {messages.map((msg) => {
            const isSender =
              msg.sender === sessionUserId || msg.sender?._id === sessionUserId;

            return (
              <div
                key={msg._id}
                className={`flex items-end gap-2 ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                {!isSender && (
                  <img
                    src={user?.profileImage || "/default-avatar.png"}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div
                  className={`p-2 rounded-lg max-w-[70%] text-sm ${
                    isSender
                      ? "bg-green-700 text-white text-right"
                      : "bg-gray-700 text-white text-left"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString("no-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {isSender && (
                  <img
                    src={session?.user?.profileImage || "/default-avatar.png"}
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="fixed bottom-16 mx-auto md:static w-full px-3 py-2 bg-gray-800 flex items-center gap-2 z-50"
        >
          <button
            type="button"
            onClick={() => setShowPicker((prev) => !prev)}
            className="text-xl hover:scale-110 transition"
          >
            😀
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Write a message…"
            className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
          >
            Send
          </button>

          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute bottom-full left-0 mb-2 z-50"
            >
              <EmojiPicker
                theme="dark"
                onEmojiClick={(emojiData) => {
                  setInput((prev) => prev + emojiData.emoji);
                  setShowPicker(false);
                }}
              />
            </div>
          )}
        </form>
      </div>
      {/* Right Sidebar */}
      {user && (
        <aside className="hidden lg:block w-80 bg-gray-800 p-6 space-y-4 overflow-y-auto">
          {user.isVerified && (
            <div className="text-center">
              <VerifiedBadge />
            </div>
          )}

          <img
            src={user.profileImage || "/default-avatar.png"}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-green-600"
          />

          <h3 className="text-lg font-bold text-center">{user.name}</h3>

          <p className="text-gray-400 text-center text-sm">
            {getAgeFromDate(user.birthdate)} år • {user.location?.name}
          </p>

          <p className="text-gray-300 mt-1 text-sm text-center">
            {user.bio || "No bio yet."}
          </p>

          {user.tags?.length > 0 && (
            <div>
              <h4 className="text-green-500 font-semibold text-sm mb-1">
                Hashtags
              </h4>
              <div className="flex flex-wrap gap-1">
                {user.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-green-700 text-white px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {user.images?.length > 0 && (
            <div className="max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-2">Photos</h2>
              <div className="w-full grid grid-cols-3 gap-2">
                {user.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt="thumb"
                    className="w-full h-32 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setIndex(i);
                      setOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {open && (
            <ImageCarousel
              images={user.images}
              setOpen={setOpen}
              currentIndex={index}
              onClose={() => setOpen(false)}
            />
          )}

          <div>
            <div className="pt-4">
              <button
                onClick={() => redirect(`/profile/${user._id}`)}
                className="w-full bg-green-600 hover:bg-green-700 
               text-white font-semibold py-2 px-4 rounded-md 
               transition-colors"
              >
                View {user.name}'s Profile
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
