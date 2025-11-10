"use client";
import { useState } from "react";

export default function ImageCarousel({ images, setOpen }) {
  const [current, setCurrent] = useState(0);

  function next() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  function prev() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div>
     

      {/* Modal Carousel */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setOpen(false)}
          >
            ✖
          </button>

          <button
            className="absolute left-4 text-white text-3xl"
            onClick={prev}
          >
            ⬅
          </button>

          <img
            src={images[current].url}
            alt="current"
            className="max-h-[80vh] max-w-[90vw] rounded shadow-lg"
          />

          <button
            className="absolute right-4 text-white text-3xl"
            onClick={next}
          >
            ➡
          </button>
        </div>
      )}
    </div>
  );
}
