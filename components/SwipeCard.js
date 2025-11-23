"use client";

import { motion, PanInfo, AnimatePresence } from "framer-motion";

export default function SwipeCard({ card, onSwipe }) {
  return (
    <motion.div
      className="absolute w-full h-full rounded-2xl bg-gray-800 shadow-xl p-4 flex flex-col justify-end cursor-grab"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={(e, info) => {
        const offset = info.offset.x;
        if (offset > 100) {
          onSwipe("right", card);
        } else if (offset < -100) {
          onSwipe("left", card);
        }
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="flex-1 mb-2">
        <img
          src={card.profileImage || "/default-avatar.png"}
          alt={card.name}
          className="w-full h-72 object-cover rounded-xl pointer-events-none"
        />
      </div>
      <div className="text-white">
        <h3 className="text-xl font-bold">{card.name}</h3>
        <p className="text-gray-400 text-sm">{card.bio}</p>
      </div>
    </motion.div>
  );
}
