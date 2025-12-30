"use client";

import Link from "next/link";

export default function LikesCard({ user }) {
  return (
    <Link
      href={`/profile/${user._id}`}
      className="block bg-neutral-800 rounded-xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
    >
      <img
        src={user.profileImage}
        alt={user.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">{user.name}</h3>
          {user.isVerified && (
            <span className="text-pink-400 text-lg">✔️</span>
          )}
        </div>

        {user.bio && (
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {user.bio}
          </p>
        )}

        <p className="text-pink-500 font-semibold mt-3">View Profile →</p>
      </div>
    </Link>
  );
}
