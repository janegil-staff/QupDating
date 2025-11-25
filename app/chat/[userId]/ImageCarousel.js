"use client";
import { useState, useEffect } from "react";

export default function ImageCarousel({
  images = [],
  currentIndex = 0,
  setOpen,
  onClose,
}) {
  const [index, setIndex] = useState(currentIndex);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        if (onClose) onClose();
        else if (setOpen) setOpen(false);
      }
      if (e.key === "ArrowLeft") {
        prevImage();
      }
      if (e.key === "ArrowRight") {
        nextImage();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  const prevImage = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      {/* Close button */}
      <button
        onClick={() => {
          if (onClose) onClose();
          else if (setOpen) setOpen(false);
        }}
        className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-400"
      >
        ✕
      </button>

      {/* Image */}
      <img
        src={images[index]?.url}
        alt={`carousel-${index}`}
        className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
      />

      {/* Navigation arrows */}
      <button
        onClick={prevImage}
        className="absolute left-6 text-white text-4xl hover:text-green-400"
      >
        ‹
      </button>
      <button
        onClick={nextImage}
        className="absolute right-6 text-white text-4xl hover:text-green-400"
      >
        ›
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 text-gray-300 text-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
