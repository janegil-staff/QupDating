"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifiedRedirect() {
  const router = useRouter();

  useEffect(() => {
    toast.success("✅ Your profile is now verified!");
    const timer = setTimeout(() => {
      router.push("/login?verified=true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="text-center text-white py-10 space-y-4">
      <h1 className="text-2xl font-bold text-pink-400">Verification complete</h1>
      <p className="text-sm text-gray-300">Redirecting to login so your session can refresh…</p>
    </div>
  );
}
