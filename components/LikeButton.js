"use client";
import { useState, useEffect } from "react";

export default function ToggleLikeButton({ currentUser, targetUser }) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Recompute whenever props change
  useEffect(() => {
    if (currentUser?.likes && targetUser?._id) {
      const liked = currentUser.likes.some(
        like =>
          (like._id?.toString?.() || like.toString()) ===
          targetUser._id.toString()
      );
      setIsLiked(liked);
    }
  }, [currentUser, targetUser]);

  
  const handleToggleLike = async () => {
    setLoading(true);

    console.log("TARGET USER", targetUser?._id);
    try {
      const endpoint = isLiked ? "/api/unlike" : `/api/like/${targetUser?._id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: targetUser?._id }),
      });

      const result = await res.json();
      if (result.success) {
        setIsLiked(!isLiked);
        console.log(isLiked ? "💔 Unliked" : "❤️ Liked");
      } else {
        console.warn("⚠️ Toggle failed:", result.error);
      }
    } catch (err) {
      console.error("❌ Toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`px-6 py-2 rounded-full font-semibold transition ${
        isLiked
          ? "bg-gray-700 text-pink-400 hover:bg-gray-600"
          : "bg-pink-600 text-white hover:bg-pink-700"
      }`}
    >
      {loading ? "..." : isLiked ? "💔 unlike" : "💖 Like profil"}
    </button>
  );
}
