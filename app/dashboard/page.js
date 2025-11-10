"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/profile", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-white">Loading session...</p>;
  }

  if (!session) {
    return (
      <p className="text-white">You must be logged in to view the dashboard.</p>
    );
  }

  if (!profile) {
    return <p className="text-white">Loading profile...</p>;
  }

  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>
      <p className="mb-2">Age: {profile.age}</p>
      <p className="mb-2">Gender: {profile.gender}</p>
      <p className="mb-4">Bio: {profile.bio}</p>

      <h2 className="text-xl font-semibold mb-2">Your Photos</h2>
      <div className="grid grid-cols-3 gap-2">
        {profile.images?.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt="profile"
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}
