"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LikesCard from "@/components/LikesCard";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState("likedMe");
  const [likedMe, setLikedMe] = useState([]);
  const [iLiked, setILiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchLikes = async () => {
      console.log(session);
      try {
        const res = await fetch("/api/likes");

        const data = await res.json();
        console.log(data);
        setLikedMe(data.likedMeUsers || []);
        setILiked(data.likedUsers || []);
      } catch (err) {
        console.error("Likes fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  const renderList = (data) => {
    if (!data.length)
      return (
        <p className="text-gray-400 text-center mt-10">No users here yet.</p>
      );

    return (
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-6
        "
      >
        {data.map((user) => (
          <LikesCard key={user._id} user={user} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex bg-neutral-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("likedMe")}
            className={`flex-1 py-2 rounded-md text-center font-semibold ${
              activeTab === "likedMe"
                ? "bg-pink-600 text-white"
                : "text-gray-400"
            }`}
          >
            Liked You
          </button>

          <button
            onClick={() => setActiveTab("iLiked")}
            className={`flex-1 py-2 rounded-md text-center font-semibold ${
              activeTab === "iLiked"
                ? "bg-pink-600 text-white"
                : "text-gray-400"
            }`}
          >
            You Liked
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading…</p>
        ) : activeTab === "likedMe" ? (
          renderList(likedMe)
        ) : (
          renderList(iLiked)
        )}
      </div>
    </div>
  );
}
