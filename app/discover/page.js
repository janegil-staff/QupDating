"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getAgeFromDate } from "@/lib/getAgeFromDate";
export default function DiscoverPage() {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/discover${cursor ? `?cursor=${cursor}` : ""}`
      );
      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => {
          const all = [...prev, ...data.users];
          const unique = Array.from(
            new Map(all.map((u) => [u._id, u])).values()
          );
          return unique;
        });

        console.log(data);
        setCursor(data.nextCursor || null);
        setHasMore(data.users.length >= 20 ? true : false);
      } else {
        toast.error(data.error || "Kunne ikke hente brukere");
      }
    } catch {
       setHasMore(false);
      toast.error("Serverfeil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // initial load
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchUsers();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleLike = async (targetUserId) => {
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: targetUserId }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Like feilet");
      return;
    }

    toast.success(data.match ? "🎉 Det er en match!" : "👍 Likt bruker");
    setUsers((prev) => prev.filter((u) => u._id !== targetUserId));
  };

  const handleDislike = async (userId) => {
    const res = await fetch("/api/dislike", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: userId }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error || "Dislike feilet");
      return;
    }

    toast.success("👎 Bruker mislikt");
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Oppdag nye profiler</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-gray-900 p-4 rounded-xl shadow flex flex-col items-center"
          >
            <Link href={`/profile/${user._id}`} className="w-full">
              <img
                src={user.profileImage || "/placeholder.jpg"}
                alt={user.name}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
              />
            </Link>
            <h2 className="mt-2 text-lg font-semibold">
              {user.name}, {getAgeFromDate(user.birthdate)}
            </h2>
            <p className="text-sm text-gray-400 text-center">{user.bio}</p>

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

      <div
        ref={loaderRef}
        className="h-10 flex justify-center items-center mt-10"
      >
     {loading && hasMore && (
        <p className="text-gray-400">Laster inn flere profiler…</p>
      )}

      {!hasMore && (
        <p className="text-gray-500">Ingen flere profiler å vise</p>
      )}
      </div>
    </div>
  );
}
