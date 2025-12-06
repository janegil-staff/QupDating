"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function VerifyBanner({ user }) {
  const [loading, setLoading] = useState(false);

  if (user.isVerified) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Verification email sent!");
      } else {
        toast.error(data.error || "Resend failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-900 text-yellow-100 p-4 rounded-lg shadow-md text-sm flex items-center justify-between">
      <div>
        Your profile isn’t verified yet.  
        <span className="text-yellow-300 font-semibold ml-1">Verify to earn a badge and boost trust.</span>
        <span> (check in your spam folder)</span>
      </div>
      <button
        onClick={handleResend}
        disabled={loading}
        className="ml-4 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-xs font-medium"
      >
        {loading ? "Sending…" : "Resend link"}
      </button>
    </div>
  );
}
