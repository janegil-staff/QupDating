"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [localImages, setLocalImages] = useState([]);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload images first
    const formData = new FormData();
    localImages.forEach((img) => formData.append("images", img.file));

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { images } = await uploadRes.json();

    // Submit registration
    const form = new FormData(e.target);
    form.append("images", JSON.stringify(images));

    const res = await fetch("/api/register", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log("Registered:", data);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-neutral-900 p-6 rounded-xl shadow-xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-pink-500 text-center">
          Opprett profil
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Navn"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="email"
          name="email"
          placeholder="E-post"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Passord"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="number"
          name="age"
          placeholder="Alder"
          required
          min="18"
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <select
          name="gender"
          required
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">Velg kjønn</option>
          <option value="male">Mann</option>
          <option value="female">Kvinne</option>
          <option value="other">Annet</option>
        </select>

        <ImageUploader onImagesChange={setLocalImages} />

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Registrer deg
        </button>
      </form>
    </div>
  );
}
