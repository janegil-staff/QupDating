"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      setMessage("Server error, please try again later");
      return;
    }

    if (res.ok) {
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000); // ✅ navigate after 2s
    } else {
      setMessage(data.error);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-pink-500 mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded"
        >
          Reset Password
        </button>
        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </form>
    </div>
  );
}
