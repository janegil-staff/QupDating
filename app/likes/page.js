"use client";

import { useEffect, useState } from "react";
import LikesCardWeb from "@/components/LikesCardWeb";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState("likedMe");
  const [likedMe, setLikedMe] = useState([]);
  const [iLiked, setILiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikes = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const res = await fetch("/api/web/likes");

      const data = await res.json();
      console.log("DATA", data);
      setLikedMe(data.likedMeUsers || []);
      setILiked(data.likedUsers || []);
      setDisliked(data.dislikedUsers || []);
    } catch (err) {
      console.error("Likes fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);

  const renderList = (data) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {data.length === 0 && (
        <p className="text-gray-400 text-center col-span-full mt-10">
          No users here yet.
        </p>
      )}

      {data.map((user) => (
        <LikesCardWeb
          user={user}
          showRemoveLike={activeTab === "iLiked"}
          showRestore={activeTab === "disliked"}
          onRemoveLike={(id) =>
            setILiked((prev) => prev.filter((u) => u._id !== id))
          }
          onRestore={(id) =>
            setDisliked((prev) => prev.filter((u) => u._id !== id))
          }
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-pink-400 text-xl">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-2">
          {["likedMe", "iLiked", "disliked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-md font-semibold transition ${
                activeTab === tab
                  ? "bg-pink-500 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {tab === "likedMe" && "Liked You"}
              {tab === "iLiked" && "You Liked"}
              {tab === "disliked" && "Disliked"}
            </button>
          ))}
        </div>

        {/* List */}
        {activeTab === "likedMe"
          ? renderList(likedMe)
          : activeTab === "iLiked"
          ? renderList(iLiked)
          : renderList(disliked)}
      </div>
    </div>
  );
}
