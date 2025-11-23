"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function TrackProfileView({ viewedUserId }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/profileViews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        viewerId: session.user.id,
        viewedUserId,
      }),
    }).catch((err) => console.error("Error tracking profile view:", err));
  }, [session, viewedUserId]);

  return null;
}
