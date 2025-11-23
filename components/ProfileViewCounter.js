"use client";
import { useEffect, useState } from "react";

export default function ProfileViewCounter({ viewerId, viewedUserId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function trackView() {
      try {
        const res = await fetch("/api/profileViews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ viewerId, viewedUserId }),
        });
        const data = await res.json();
        setCount(data.profileViews);
      } catch (err) {
        console.error("Error tracking profile view:", err);
      }
    }
    trackView();
  }, [viewerId, viewedUserId]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
      <p className="text-sm text-gray-400">Profile Views</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}
