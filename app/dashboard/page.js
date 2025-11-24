"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Heart, Users, MessageCircle } from "lucide-react";
import SwipeCard from "@/components/SwipeCard";
import ProfileCompletion from "@/components/ProfileCompletion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    profileViews: 0,
    newLikes: 0,
    newMatches: 0,
    newMessages: 0,
  });
  const [cards, setCards] = useState([]);
  const [swipedCards, setSwipedCards] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();

        setUser(data); // assuming your API returns { user: {...} }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchCards() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setCards(data);
      } catch (error) {
        console.error(error);
        setCards([]);
      }
    }
    fetchCards();
  }, []);

  const handleSwipe = async (direction, card) => {
    if (direction === "right") {
      console.log(`Liked user: ${card.name} (${card._id})`);
      // Call your API to register a like
      try {
        await fetch("/api/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId: card._id }),
        });
      } catch (err) {
        console.error("Failed to like user:", err);
      }
    } else if (direction === "left") {
      console.log(`Passed user: ${card.name} (${card._id})`);
      // Optional: register pass
      try {
        await fetch("/api/dislike", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId: card._id }),
        });
      } catch (err) {
        console.error("Failed to pass user:", err);
      }
    }

    // Remove the swiped card from the UI
    setCards((prev) => prev.filter((c) => c._id !== card._id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">Welcome back 👋</h1>
        <p className="text-gray-400">Here’s what’s happening on your profile</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 w-full max-w-4xl">
        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-lg flex flex-col items-start">
          <Flame className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{stats.profileViews}</p>
          <span className="text-sm text-white/80">Profile Views</span>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg flex flex-col items-start">
          <Heart className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{stats.newLikes}</p>
          <span className="text-sm text-white/80">New Likes</span>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 shadow-lg flex flex-col items-start">
          <Users className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{stats.newMatches}</p>
          <span className="text-sm text-white/80">New Matches</span>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 shadow-lg flex flex-col items-start">
          <MessageCircle className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{stats.newMessages}</p>
          <span className="text-sm text-white/80">New Messages</span>
        </div>
      </div>

      {/* Swipeable Cards */}
      <section className="relative w-full max-w-sm h-[500px] mb-8">
        <AnimatePresence>
          {(Array.isArray(cards) ? cards : []).map((card, index) => {
            const isTop = index === cards.length - 1;
            return (
              <SwipeCard
                key={card._id}
                card={card}
                draggable={isTop}
                onSwipe={handleSwipe}
              />
            );
          })}
          {cards.length === 0 && (
            <div className="absolute w-full h-full flex items-center justify-center text-gray-400 text-center p-4">
              No more profiles to swipe.
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Profile Completion */}
      <ProfileCompletion user={user} />

      {/* Suggestions */}
      <div className="bg-gray-800 rounded-2xl p-5 shadow-xl mb-8 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-3">Suggestions</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center gap-2">
            <span className="text-pink-500">•</span> Add more photos to get 3×
            more matches
          </li>
          <li className="flex items-center gap-2">
            <span className="text-pink-500">•</span> Write a short bio to
            improve your profile
          </li>
          <li className="flex items-center gap-2">
            <span className="text-pink-500">•</span> Enable location for better
            matches
          </li>
        </ul>
      </div>
    </div>
  );
}
