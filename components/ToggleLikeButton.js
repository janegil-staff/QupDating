"use client";

import { useState } from "react";
import MatchCongrats from "./MatchCongrats";

export default function LikeButton({ profileId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const handleToggleLike = async () => {
    if (loading) return; // prevent double taps
    setLoading(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profileId }),
        credentials: "include", // 👈 ensures cookies/session are sent on iPhone
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      if (data.success) {
        setLiked(data.action === "liked");
      }
    } catch (err) {
      console.error("❌ Like toggle error:", err);
      alert("Kunne ikke oppdatere like. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded transition cursor-pointer ${
          liked
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-pink-500 hover:bg-pink-600 text-white"
        }`}
      >
        {liked ? "Remove like" : "Like"}
        <span className="text-xl">{liked ? "💔" : "❤️"}</span>
      </button>
      {showCongrats && <MatchCongrats onClose={() => setShowCongrats(false)} />}
    </>
  );
}
