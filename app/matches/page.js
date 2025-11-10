"use client";
import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function fetchMatches() {
      const res = await fetch("/api/matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches);
      }
    }
    fetchMatches();
  }, []);

  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>

      {matches.length === 0 && <p>No matches yet. Keep exploring!</p>}

      <div className="grid gap-4 w-full max-w-2xl">
        {matches.map((match) => {
          // Show the other user (not yourself)
          const otherUser = match.users.find(
            (u) => u._id !== match.currentUserId
          );
          return (
            <div
              key={match._id}
              className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center"
            >
              <img
                src={otherUser.images?.[0]?.url}
                alt={otherUser.name}
                className="w-20 h-20 object-cover rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  {otherUser.name}, {otherUser.age}
                </h2>
                <p className="text-gray-300">{otherUser.bio}</p>
              </div>
              <button className="ml-auto bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                💬 Chat
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
