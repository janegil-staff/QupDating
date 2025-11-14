"use client";
import { useEffect, useState } from "react";
import ImageCarousel from "./ImageCarousel";

export default function PublicProfile({ userId }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${userId}`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        setError("Fant ikke profilen.");
      }
    }
    fetchProfile();
  }, [userId]);

  if (error) return <p className="text-center text-red-400 mt-20">{error}</p>;
  if (!profile)
    return (
      <p className="text-center text-gray-400 mt-20">
        Laster inn romantisk profil…
      </p>
    );

  const {
    name,
    email,
    birthdate,
    gender,
    images,
    profileImage,
    relationshipStatus,
    religion,
    occupation,
    location,
    education,
    appearance,
    bodyType,
    height,
    hasChildren,
    wantsChildren,
    smoking,
    drinking,
    willingToRelocate,
    lookingFor,
    tags,
  } = profile;

  const age = birthdate
    ? new Date().getFullYear() - new Date(birthdate).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-neutral-900 rounded-xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profileImage}
            alt="Profilbilde"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-600 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-pink-400 italic">
              {relationshipStatus || "Udefinert status"}
            </p>
            <p className="text-gray-400">
              {age} år • {gender}
            </p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>

        {/* Gallery */}
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

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="Religion" value={religion} />
          <Detail label="Yrke" value={occupation} />
          <Detail label="Utdanning" value={education} />
          <Detail label="Utseende" value={appearance} />
          <Detail label="Kroppstype" value={bodyType} />
          <Detail label="Høyde" value={height ? `${height} cm` : ""} />
          <Detail label="Har barn" value={hasChildren ? "Ja" : "Nei"} />
          <Detail label="Vil ha barn" value={wantsChildren ? "Ja" : "Nei"} />
          <Detail label="Røyker" value={smoking} />
          <Detail label="Drikker" value={drinking} />
          <Detail
            label="Villig til å flytte"
            value={willingToRelocate ? "Ja" : "Nei"}
          />
        </div>

        {/* Looking For */}
        <div>
          <h2 className="text-xl font-semibold text-pink-500">
            Hva jeg ser etter
          </h2>
          <p className="mt-2 text-gray-300">
            {lookingFor || "Ikke spesifisert ennå."}
          </p>
        </div>

        {/* Tags */}
        {tags?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-pink-500">
              Mine hashtags
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-pink-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <div className="bg-neutral-800 p-4 rounded-lg shadow-sm border border-gray-700">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
