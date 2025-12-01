"use client";

import { useState } from "react";
import MatchCongrats from "./MatchCongrats";

export default function ToggleLikeButton({
  currentUser,
  targetUser,
  profileId,
  initialLiked,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profileId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Like failed");

      if (data.match) setShowCongrats(true);
      setLiked(true);
    } catch (err) {
      console.error("❌ Like error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/dislike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profileId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Dislike failed");

      setLiked(false);
    } catch (err) {
      console.error("❌ Dislike error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {liked ? (
        <button
          type="button"
          onClick={handleDislike}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded transition cursor-pointer bg-gray-700 hover:bg-gray-600 text-white"
        >
          Remove like <span className="text-xl">💔</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLike}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded transition cursor-pointer bg-pink-500 hover:bg-pink-600 text-white"
        >
          Like <span className="text-xl">❤️</span>
        </button>
      )}

      {showCongrats && <MatchCongrats onClose={() => setShowCongrats(false)} />}
    </>
  );
}
