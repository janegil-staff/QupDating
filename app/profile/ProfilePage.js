"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
        setBio(data.user.bio || "");
      } catch (err) {
        setError("Du må logge inn for å se profilen din.");
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="text-white p-6">{error}</div>;
  if (!user) return <div className="text-white p-6">Laster profil...</div>;

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold text-pink-500">Din profil</h1>
      <p><strong>Navn:</strong> {user.name}</p>
      <p><strong>Alder:</strong> {user.age}</p>
      <p><strong>Kjønn:</strong> {user.gender}</p>
      <p><strong>Bio:</strong> {bio}</p>
    </div>
  );
}
