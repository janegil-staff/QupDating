// app/verify/page.jsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  useEffect(() => {
    console.log("STATUS ---->", status);
    if (status === "success") {
      // Redirect after 3 seconds
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {status === "success" ? (
        <>
          <h1 className="text-2xl font-bold">✅ Your profile is verified!</h1>
          <p>You’ll be redirected shortly...</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">❌ Verification failed</h1>
          <p>Please request a new verification email.</p>
        </>
      )}
    </div>
  );
}
