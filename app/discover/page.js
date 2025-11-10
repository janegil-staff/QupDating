"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DiscoverPage() {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/discover${cursor ? `?cursor=${cursor}` : ""}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        setCursor(data.nextCursor);
      } else {
        toast.error(data.error || "Failed to load users");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // initial load
  }, []);

  const handleLike = async (targetUserId) => {
    console.log(targetUserId);

    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: targetUserId }), // ✅ correct
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
    setUsers((prev) => prev.filter((u) => u._id !== targetUserId));
  };

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
  const uniqueUsers = Array.from(
    new Map(users.map((u) => [u._id, u])).values()
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Discover</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueUsers.map((user) => (
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
      {cursor && (
        <div className="mt-6 text-center">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
