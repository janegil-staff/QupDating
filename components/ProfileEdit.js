"use client";

import { useState } from "react";

export default function EditProfileCategorized({ form, setForm, handleSave }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 space-y-8">
      <h1 className="text-3xl font-bold text-pink-500 text-center mb-6">
        Edit Your Profile
      </h1>

      {/* Basics */}
      <section className="bg-neutral-900 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-pink-400">👤 Basics</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Gender</option>
            <option value="male">♂ Male</option>
            <option value="female">♀ Female</option>
            <option value="other">⚧ Other</option>
          </select>
        </div>
      </section>

      {/* Lifestyle */}
      <section className="bg-neutral-900 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-pink-400">🌱 Lifestyle</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={form.smoking}
            onChange={(e) => setForm({ ...form, smoking: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Smoking?</option>
            <option value="Yes">🚬 Yes</option>
            <option value="No">❌ No</option>
            <option value="Occasionally">😏 Occasionally</option>
          </select>
          <select
            value={form.drinking}
            onChange={(e) => setForm({ ...form, drinking: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Drinking?</option>
            <option value="None">🚱 Never</option>
            <option value="Light / social drinker">🍷 Social</option>
            <option value="Heavy">🍺 Often</option>
          </select>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-neutral-900 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-pink-400">✨ Appearance</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Height (cm)"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          />
          <select
            value={form.bodyType}
            onChange={(e) => setForm({ ...form, bodyType: e.target.value })}
            className="bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Body Type</option>
            <option value="Slim">Slim</option>
            <option value="Athletic">Athletic</option>
            <option value="Curvy">Curvy</option>
            <option value="Muscular">Muscular</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </section>

      {/* Bio & Tags */}
      <section className="bg-neutral-900 rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-pink-400">💬 About You</h2>
        <textarea
          placeholder="Write something expressive..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full bg-neutral-800 rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="text"
          placeholder="#Hiking #Pizza #CatLover"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full bg-neutral-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-500"
        />
      </section>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-lg text-lg transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
