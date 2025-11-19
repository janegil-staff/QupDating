"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data = {};
      try {
        data = await res.json(); // only works if body is valid JSON
      } catch {
        // fallback if server crashed
        throw new Error("Server error, please try again later");
      }

      if (!res.ok) throw new Error(data.error || "Failed to send reset link");
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-pink-500 mb-4">
          Forgot Password
        </h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </form>
    </div>
  );
}
