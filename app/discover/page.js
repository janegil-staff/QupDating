"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function DiscoverPage() {
  const [users, setUsers] = useState([]);

  // Load users from your backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/discover");
        if (!res.ok) throw new Error("Failed to load users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Discover fetch error:", err);
      }
    }
    fetchUsers();
  }, []);

  // Like handler
  async function handleLike(userId) {
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err || "Like failed");
        return;
      }

      const data = await res.json();

      if (data.match) {
        toast.success("🎉 It's a Match!");
      } else {
        toast.success("👍 Liked user");
      }

      // Remove liked user from grid
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Like error:", err);
    }
  }

  // Dislike handler
  async function handleDislike(userId) {
    try {
      const res = await fetch("/api/dislike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: userId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Dislike failed:", err);
        return;
      }

      const data = await res.json();
      toast.success("👎 Disliked user");

      // Remove disliked user from grid
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Dislike error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-800 p-4 rounded shadow flex flex-col items-center"
          >
            <Link href={`/profile/${user._id}`} className="w-full">
              <img
                src={user.images?.[0]?.url || "/placeholder.jpg"}
                alt={user.name}
                className="w-full h-64 object-cover rounded cursor-pointer hover:opacity-90 transition"
              />
            </Link>
            <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.bio}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleLike(user._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                👍 Like
              </button>
              <button
                onClick={() => handleDislike(user._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                👎 Dislike
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
