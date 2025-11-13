"use client";

import { useState } from "react";

export default function LikeButton({ profileId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
  const res = await fetch("/api/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toUserId: profileId }),
  });

  const data = await res.json();
  if (data.success) {
    setLiked(data.action === "liked");

    // Optional: re-fetch match status or isLiked from backend
  }
};

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded transition ${
        liked
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : "bg-pink-500 hover:bg-pink-600 text-white"
      }`}
    >
      {liked ? "Fjern like" : "Lik"}
      <span className="text-xl">{liked ? "💔" : "❤️"}</span>
    </button>
  );
}
