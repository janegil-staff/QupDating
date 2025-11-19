"use client"
import { useState, useRef } from "react";

export default function ImageUploader({ onImagesChange }) {
  const [images, setImages] = useState([]);
  const dropRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const allImages = [...images, ...newImages];
    setImages(allImages);
    onImagesChange(allImages); // ✅ pass to parent
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDelete = (index) => {
    const updated = images.filter((_, i) => i !== index);
    URL.revokeObjectURL(images[index].preview);
    setImages(updated);
    onImagesChange(updated); // ✅ update parent
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">Upload images</label>

      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full p-4 border-2 border-dashed border-pink-500 rounded bg-neutral-900 text-center text-gray-400 cursor-pointer"
      >
       Pull and drop images here, or use the button under
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="w-full text-sm text-gray-300 file:bg-pink-600 file:text-white file:px-4 file:py-2 file:rounded file:border-none file:cursor-pointer"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.preview}
                alt={`preview-${i}`}
                className="rounded object-cover w-full h-24 border border-neutral-700"
              />
              <button
                onClick={() => handleDelete(i)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
