"use client";
import { useState } from "react";

// Drag-and-drop uploader component
function ImageUploader({ onUpload }) {
  const [previews, setPreviews] = useState([]);

  async function handleFiles(files) {
    const uploaded = [];
    for (const file of files) {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviews((prev) => [...prev, localUrl]);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: reader.result }),
          });
          const data = await res.json();
          if (data.url) {
            uploaded.push(data.url);
            onUpload((prev) => [...prev, data.url]); // append Cloudinary URL
          }
        } catch (err) {
          console.error("Upload failed", err);
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
      className="border-2 border-dashed border-gray-500 p-6 text-center rounded"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p className="mb-2">Drag & drop images here, or click to select</p>
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
          <img
            key={i}
            src={src}
            alt="preview"
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    images: [],
  });

  async function handleSubmit() {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    window.location.href = "/dashboard";
  }

  return (
    <div className="dark bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded shadow">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 1: Basic Info</h2>
            <input
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Age"
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
            <select
              className="w-full p-2 rounded bg-gray-700"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 2: Bio</h2>
            <textarea
              className="w-full p-2 rounded bg-gray-700"
              placeholder="Write a short bio..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
            <button
              onClick={() => setStep(3)}
              className="w-full bg-blue-500 py-2 rounded"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 3: Upload Images</h2>
            <ImageUploader
              onUpload={(urls) =>
                setFormData((prev) => ({ ...prev, images: urls }))
              }
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 py-2 rounded"
            >
              Finish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
