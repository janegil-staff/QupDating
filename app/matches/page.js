"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (res.ok) {
        setMatches(data.matches);
      } else {
        toast.error(data.error || "Failed to load matches");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Matches</h1>
      {matches.length === 0 ? (
        <p className="text-gray-400">No matches yet. Keep swiping!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matches.map((user) => (
            <div key={user._id} className="bg-gray-800 p-4 rounded shadow">
              <Link href={`/profile/${user._id}`}>
                <img
                  src={user.images?.[0]?.url || "/placeholder.jpg"}
                  alt={user.name}
                  className="w-full h-64 object-cover rounded cursor-pointer hover:opacity-90 transition"
                />
              </Link>
              <h2 className="mt-2 text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.bio}</p>
              <Link
                href={`/chat/${user._id}`}
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Start Chat
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
