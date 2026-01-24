"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SwipeCard({ card, draggable, onSwipe }) {
  const router = useRouter();

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 120) onSwipe("right", card);
    else if (info.offset.x < -120) onSwipe("left", card);
  };

  return (
    <motion.div
      className="absolute w-full h-full rounded-xl overflow-hidden shadow-xl bg-gray-800"
      drag={draggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ touchAction: "pan-y" }} // 👈 prevents click interference
    >
      {/* IMAGE */}
      <img
        src={card.profileImage || "https://res.cloudinary.com/dbcdsonhz/image/upload/v1769110864/dating-app/empty-profile-image_dlwotm.png"}
        alt={card.name}
        className="w-full h-full object-cover pointer-events-none select-none"
        draggable={false}
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* USER INFO */}
      <div className="absolute bottom-20 left-4 right-4 text-white">
        <h3 className="text-xl font-bold">{card.name}</h3>
        {card.bio && (
          <p className="text-sm text-gray-300 line-clamp-2">
            {card.bio}
          </p>
        )}
      </div>

      {/* VIEW PROFILE BUTTON */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🚨 VERY IMPORTANT
            router.push(`/profile/${card._id}`);
          }}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg"
        >
          View profile
        </button>
      </div>
    </motion.div>
  );
}
