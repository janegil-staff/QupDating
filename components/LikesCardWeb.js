"use client";

import { useRouter } from "next/navigation";
import { X, RefreshCw } from "lucide-react";

export default function LikesCardWeb({
  user,
  showRemoveLike,
  showRestore,
  onRemoveLike,
  onRestore,
}) {
  const router = useRouter();

  const handleRemoveLike = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch("/api/web/like/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: user._id }),
      });

      const data = await res.json();
      console.log("WEB remove like response:", data);

      if (res.ok) onRemoveLike?.(user._id);
    } catch (err) {
      console.error("WEB remove like error:", err);
    }
  };

  const handleRestore = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch("/api/web/dislike/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: user._id }),
      });

      const data = await res.json();
      console.log("WEB restore dislike response:", data);

      if (res.ok) onRestore?.(user._id);
    } catch (err) {
      console.error("WEB restore dislike error:", err);
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-xl p-4 shadow-md">
      {showRestore && (
        <button
          onClick={handleRestore}
          className="absolute top-3 right-3 bg-green-600 p-2 rounded-full"
        >
          <RefreshCw size={18} className="text-white" />
        </button>
      )}

      {showRemoveLike && (
        <button
          onClick={handleRemoveLike}
          className="absolute top-3 right-3 bg-red-600 p-2 rounded-full"
        >
          <X size={18} className="text-white" />
        </button>
      )}

      <div
        onClick={() => router.push(`/profile/${user._id}`)}
        className="cursor-pointer"
      >
        <img
          src={user.profileImage || "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png"}
          className="w-full h-60 object-cover rounded-lg mb-3"
        />
        <h3 className="text-white text-xl font-bold">{user.name}</h3>
        {user.bio && <p className="text-gray-300 mt-1">{user.bio}</p>}
      </div>
    </div>
  );
}
