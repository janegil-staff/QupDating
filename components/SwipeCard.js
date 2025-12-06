// components/SwipeCard.jsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function SwipeCard({ card, draggable, onSwipe }) {
  const router = useRouter();

  let dragged = false;

  const handleDragEnd = (event, info) => {
    dragged = Math.abs(info.offset.x) > 10;
    if (info.offset.x > 100) onSwipe("right", card);
    else if (info.offset.x < -100) onSwipe("left", card);
  };

  const handleClick = () => {
    if (!dragged) router.push(`/profile/${card._id}`);
    dragged = false;
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      drag={draggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onClick={handleClick} // 👈 separate click handler
    >
      <img
        src={card.profileImage}
        alt={card.name}
        className="w-full h-full object-cover rounded-xl cursor-pointer select-none"
        draggable={false}
      />
    </motion.div>
  );
}
