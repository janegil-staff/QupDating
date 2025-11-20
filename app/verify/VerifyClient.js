"use client";

import VerifiedRedirect from "@/components/VerifiedRedirect";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) return setStatus("missing");

    fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => (res.ok ? setStatus("success") : setStatus("error")))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="text-white">
      {status === "loading" && <p>Verifying your profile…</p>}
      {status === "success" && <p>✅ Your profile is now verified!</p>}
      {status === "success" && <VerifiedRedirect />}
      {status === "error" && <p>❌ Invalid or expired token.</p>}
      {status === "missing" && <p>⚠️ No token provided.</p>}
    </div>
  );
}
