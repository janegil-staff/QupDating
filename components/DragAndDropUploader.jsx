"use client";
import { useState } from "react";

export default function ImageUploader({ onUpload }) {
  const [previews, setPreviews] = useState([]);

  async function handleFiles(files) {
    const uploaded = [];
    for (const file of files) {
      // Show preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, localUrl]);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: reader.result }),
        });
        const data = await res.json();
        if (data.url) {
          uploaded.push(data.url);
          onUpload(uploaded); // pass Cloudinary URLs back to parent
        }
      };
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      className="border-2 border-dashed border-gray-500 p-6 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p>Drag & drop images here, or click to select</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer text-blue-400">
        Browse
      </label>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {previews.map((src, i) => (
          <img key={i} src={src} alt="preview" className="w-full h-auto rounded" />
        ))}
      </div>
    </div>
  );
}
