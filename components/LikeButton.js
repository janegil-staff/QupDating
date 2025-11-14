"use client";
import { useState } from "react";

export default function ToggleLikeButton({
  profileId,
  isOwnProfile,
  isLiked: initialLiked,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [match, setMatch] = useState(false); // 👈 track match state
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/like/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      console.log(data);
      setLiked(data.liked);
      setMatch(data.match);
    } catch (err) {
      console.error("❌ Like toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isOwnProfile) return null;

  const handleChat = () => {
    // 👇 redirect to chat page for this profile
    window.location.href = `/chat/${profileId}`;
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded-full font-semibold transition ${
          liked ? "bg-pink-600 text-white" : "bg-gray-700 text-gray-300"
        }`}
      >
        {liked ? "💔 Fjern like" : "💖 Lik profil"}
      </button>
      {match && (
        <button
          onClick={handleChat}
          className="px-4 py-2 rounded-full font-semibold bg-green-600 text-white transition"
        >
          💬 Start chat
        </button>
      )}
    </div>
  );
}
