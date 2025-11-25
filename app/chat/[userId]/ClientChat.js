"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import EmojiPicker from "emoji-picker-react";
import { getAgeFromDate } from "@/lib/getAgeFromDate";
import VerifiedBadge from "@/components/VerifiedBadge";

const socket = io({ path: "/api/socket" });

export default function ChatPage({ userId }) {
  const { data: session } = useSession();
  const sessionUserId = session?.user?.id;

  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [user, setUser] = useState();
  const [open, setOpen] = useState();
  const [index, setIndex] = useState();
  const typingTimeout = useRef(null);
  const endRef = useRef(null);
  const pickerRef = useRef(null);

  const [selectedImages, setSelectedImages] = useState([]);

  const roomId =
    sessionUserId && selectedUserId
      ? [sessionUserId, selectedUserId].sort().join("-")
      : null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  useEffect(() => {
    async function fetchUser() {
      if (!selectedUserId) return;
      const res = await fetch(`/api/profile/${selectedUserId}`);
      if (res.ok) setUser(await res.json());
    }
    fetchUser();
  }, [selectedUserId]);

  useEffect(() => {
    async function fetchMatches() {
      if (!sessionUserId) return;
      try {
        const res = await fetch("/api/matches");
        if (res.ok) setMatches((await res.json()).matches || []);
        else setMatches(session?.user?.matches || []);
      } catch {
        toast.error("Kunne ikke hente matcher");
        setMatches(session?.user?.matches || []);
      } finally {
        setMatchesLoading(false);
      }
    }
    fetchMatches();
  }, [sessionUserId]);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    socket.emit("join", roomId);

    socket.on("connect", () => console.log("🔌 Socket connected:", socket.id));
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
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "auto" });
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
    if (!input.trim() && selectedImages.length === 0) return;
    setUploadingImages(true);
    let uploadedImages = [];

    if (selectedImages.length > 0) {
      const formData = new FormData();
      selectedImages.forEach((img) => formData.append("images", img.file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.images) {
        toast.error("Bildeopplasting feilet");
        return;
      }

      uploadedImages = data.images;
    }

    const msg = {
      _id: Date.now().toString(),
      content: input.trim() || null,
      images: uploadedImages,
      sender: sessionUserId,
      receiver: selectedUserId,
      createdAt: new Date().toISOString(),
      roomId,
    };

    socket.emit("message", msg);

    setMessages((prev) => [...prev, msg]);

  
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    setInput("");
    setSelectedImages([]);
    setUploadingImages(false);
  };

 
  const handleImageChange = (e) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages(filesArray);
    e.target.value = ""; 
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white pb-6">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <h2 className="p-4 font-bold text-pink-500">Your matches</h2>
        {typing && (
          <p className="text-sm text-gray-400 mb-2 text-center">
            User is typing…
          </p>
        )}
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
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 custom-scroll">
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
                  {msg.content && <div>{msg.content}</div>}
                  {msg.images?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {msg.images.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt="uploaded"
                          className="max-w-[200px] rounded-md"
                        />
                      ))}
                    </div>
                  )}

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

        {/* Image Preview */}
        {selectedImages.length > 0 && (
          <div className="flex gap-2 p-2 overflow-x-auto bg-gray-800 border-t border-gray-700">
            {selectedImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.preview}
                  alt="preview"
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadingImages && (
          <div className="w-full flex items-center justify-center py-2 bg-gray-800 border-t border-gray-700">
            <div className="loader border-4 border-gray-600 border-t-green-500 rounded-full w-6 h-6 animate-spin"></div>
            <span className="ml-3 text-sm text-gray-300">
              Uploading images…
            </span>
          </div>
        )}
        {/* Input Bar */}
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
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={handleImageChange}
            multiple
          />
          <label htmlFor="imageUpload" className="cursor-pointer text-xl">
            📷
          </label>

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
        </form>

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-[5rem] left-3 z-[9999]"
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

          <a
            href={`/profile/${user._id}`}
            className="block text-center bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm font-medium transition"
          >
            Visit Profile
          </a>
        </aside>
      )}
    </div>
  );
}
