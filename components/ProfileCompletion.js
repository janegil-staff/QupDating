"use client";

import { useEffect, useState } from "react";

export default function ProfileCompletion({ user }) {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    if (!user) return;

    let score = 0;

    // Images (max 6)
    if (user.images?.length > 0) {
      score += Math.min(user.images.length, 6) * 5; // 6 images max → 30%
    }

    if (user.bio) score += 15;
    if (user.education) score += 5;
    if (user.occupation) score += 5;
    if (user.religion) score += 5;
    if (user.height) score += 5;
    if (user.bodyType) score += 5;
    if (user.smoking) score += 5;
    if (user.drinking) score += 5;
    if (user.hasChildren !== undefined) score += 5;
    if (user.wantsChildren !== undefined) score += 5;
    if (user.relationshipStatus) score += 5;

    // Ensure max 100%
    setCompletion(Math.min(score, 100));
  }, [user]);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-xl mb-8 w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-3">Profile Completion</h2>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-600 to-purple-500 rounded-full"
          style={{ width: `${completion}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 mt-2">{completion}% completed</p>
    </div>
  );
}
