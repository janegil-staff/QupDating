"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/verify?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          toast.success("Email verified!");
          setTimeout(() => router.push("/"), 3000); // redirect after 3s
        } else {
          setStatus("error");
          toast.error(data.error || "Verification failed");
        }
      } catch {
        setStatus("error");
        toast.error("Server error");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center w-full max-w-md">
        {status === "loading" && (
          <>
            <h1 className="text-xl font-bold mb-4">Verifying your email…</h1>
            <p className="text-gray-400">
              Please wait while we confirm your profile.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-xl font-bold mb-4 text-green-400">
              ✔ Verified!
            </h1>
            <p className="text-gray-300">
              Your profile is now verified. Redirecting to home…
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold mb-4 text-red-400">
              ❌ Verification failed
            </h1>
            <p className="text-gray-300">The link may be expired or invalid.</p>
          </>
        )}
      </div>
    </div>
  );
}
