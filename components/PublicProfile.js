"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ToggleLikeButton from "./LikeButton";
import ImageCarousel from "./ImageCarousel";

export default function PublicProfile(profileId) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await fetch(`/api/profile/${profileId.userId}`);
        const profileData = await profileRes.json();

        const userRes = await fetch("/api/me");
        const userData = await userRes.json();

        setIsMatch(profileData.isMatch);
        setProfile(profileData); // includes isLiked
        setLoggedInUser(userData); // current user
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        setError("Kunne ikke laste profil.");
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchData();
  }, [profileId]);

  if (loading)
    return <p className="text-center text-gray-400 mt-20">Laster profil…</p>;
  if (error) return <p className="text-center text-red-400 mt-20">{error}</p>;
  if (!profile || !loggedInUser)
    return <p className="text-center text-red-400 mt-20">Ingen data funnet.</p>;

  const age = profile.birthdate
    ? new Date().getFullYear() - new Date(profile.birthdate).getFullYear()
    : null;

  const isOwnProfile = session?.user?.id === profile._id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto bg-neutral-900 rounded-xl shadow-xl p-6 space-y-6 relative">
        {/* Like Button */}
        {!isOwnProfile && (
          <div className="float-right">
            <ToggleLikeButton
              currentUser={loggedInUser}
              targetUser={profile}
              initialLiked={profile.isLiked}
            />
          </div>
        )}
        {isMatch && (
          <div className="float-right">
            <a
              href={`/chat/${profile._id}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
             text-white font-medium px-5 py-2 shadow-md transition-transform 
             transform hover:scale-105 mx-6 px-6 py-2 rounded-full font-semibold"
            >
              💬 Send Message
            </a>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.profileImage || "/default-avatar.png"}
            alt="Profile photo"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-600 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-pink-400 italic">
              {profile.relationshipStatus || "Undefined status"}
            </p>
            <p className="text-gray-400">
              {age} years • {profile.gender}
            </p>
            <p className="text-sm text-gray-500">{profile.location.name}</p>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-neutral-800 p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-pink-500">About Me</h2>
            <p className="mt-2 text-gray-300 whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Gallery */}
        {profile.images?.length > 0 && (
          <div className="w-full bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-2">Photos</h2>
            <div className="w-full grid grid-cols-3 gap-4">
              {profile.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt="Gallery photo"
                  className="w-full h-24 sm:h-40 md:h-56 lg:h-72 object-cover rounded cursor-pointer"
                  onClick={() => {
                    setIndex(i);
                    setOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
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
          <Detail label="Religion" value={profile.religion} />
          <Detail label="Occupation" value={profile.occupation} />
          <Detail label="Education" value={profile.education} />
          <Detail label="Appearance" value={profile.appearance} />
          <Detail label="Body Type" value={profile.bodyType} />
          <Detail
            label="Height"
            value={profile.height ? `${profile.height} cm` : ""}
          />
          <Detail
            label="Has Children"
            value={profile.hasChildren ? "Yes" : "No"}
          />
          <Detail
            label="Wants Children"
            value={profile.wantsChildren ? "Yes" : "No"}
          />
          <Detail label="Smoking" value={profile.smoking} />
          <Detail label="Drinking" value={profile.drinking} />
          <Detail
            label="Willing to Relocate"
            value={profile.willingToRelocate ? "Yes" : "No"}
          />
        </div>

        {/* Looking For */}
        <div>
          <h2 className="text-xl font-semibold text-pink-500">
            What I'm Looking For
          </h2>
          <p className="mt-2 text-gray-300">
            {profile.lookingFor || "Not specified yet."}
          </p>
        </div>

        {/* Tags */}
        {profile.tags?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-pink-500">My Hashtags</h2>
            <div className="flex flex-wrap gap-2 mt-2 mb-10">
              {profile.tags.map((tag, i) => (
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
