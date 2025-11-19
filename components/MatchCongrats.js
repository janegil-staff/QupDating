"use client";

import { useEffect } from "react";

export default function MatchCongrats({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-pink-600 via-red-500 to-yellow-400 text-white p-10 rounded-2xl shadow-2xl animate-bounce">
        <h1 className="text-4xl font-extrabold mb-4 text-center">🎉 Congratulations! 🎉</h1>
        <p className="text-lg text-center">You’ve got a new match!</p>
      </div>
    </div>
  );
}
