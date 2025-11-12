"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    const checkMatch = async () => {
      try {
        const res = await fetch(`/api/match-status?userId=${profile._id}`);
        const data = await res.json();
        console.log("DATA", data);
        setIsMatched(data.isMatched); // ✅ true or false
      } catch (err) {
        console.error("Failed to check match status:", err);
      }
    };

    if (profile?._id) checkMatch();
  }, [profile]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        } else {
          console.error("Profile fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    if (id) fetchProfile();
  }, [id]);

  if (!profile) {
    return <p className="text-white">Loading profile...</p>;
  }
  const handleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toUserId: profile._id }),
    });

    const data = await res.json();
    if (data.match) {
      toast.success("🎉 It's a Match!");
    } else {
      toast.success("👍 Liked user");
    }
  };

  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <img
          src={profile.images?.[0]?.url}
          alt={profile.name}
          className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-pink-500"
        />
        <h1 className="text-3xl font-bold mt-4">
          {profile.name}, {profile.age}
        </h1>
        <p className="text-gray-400">{profile.gender}</p>

        {/* Interaction Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleLike}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            👍 Like
          </button>
          {isMatched && (
            <Link
              href={`/chat/${profile._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              💬 Send melding
            </Link>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-2">About Me</h2>
        <p className="text-gray-300">{profile.bio}</p>
      </div>

      {/* Gallery Section */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-2">Photos</h2>
        <div className="grid grid-cols-3 gap-2">
          {profile.images?.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt="thumb"
              className="w-full h-32 object-cover rounded cursor-pointer"
              onClick={() => {
                console.log("Clicked thumbnail", i);
                setIndex(i);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      {open && (
        <ImageCarousel
          images={profile.images}
          setOpen={setOpen}
          currentIndex={index}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
