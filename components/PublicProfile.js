"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ToggleLikeButton from "./LikeButton";
import ImageCarousel from "./ImageCarousel";
import VerifyBanner from "./VerifyBanner";

export default function PublicProfile(profileId) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await fetch("/api/me");
        const user = await res.json();
        console.log("USER --->", user);
        setIsVerified(user?.isVerified || false);
      } catch (err) {
        console.error("Failed to fetch verification status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6 mb-10">
      <div className="max-w-4xl mx-auto bg-neutral-900 rounded-xl shadow-xl p-6 space-y-6 relative">
        {isOwnProfile && !isVerified && (
          <VerifyBanner user={session.user} />
        )}

        <div className="flex justify-end">
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
              Message
            </a>
          </div>
        )}
        </div>
        {/* Like Button */}


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
            <p className="text-sm text-gray-500">{profile.location?.name}</p>
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
            <div className="w-full grid grid-cols-3  md:grid-cols-6 gap-4">
              {profile.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt="Gallery photo"
                  className="w-full h-16 sm:h-40 md:h-32 lg:h-42 object-cover rounded cursor-pointer"
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

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SimpleSection
            title="Appearance"
            items={[
              { label: "Appearance", value: profile.appearance },
              { label: "Body Type", value: profile.bodyType },
              {
                label: "Height",
                value: profile.height ? `${profile.height} cm` : null,
              },
            ]}
          />

          <SimpleSection
            title="Lifestyle"
            items={[
              { label: "Smoking", value: profile.smoking },
              { label: "Drinking", value: profile.drinking },
              {
                label: "Has Children",
                value: profile.hasChildren ? "Yes" : "No",
              },
              {
                label: "Wants Children",
                value: profile.wantsChildren ? "Yes" : "No",
              },
              {
                label: "Willing to Relocate",
                value: profile.willingToRelocate ? "Yes" : "No",
              },
            ]}
          />

          <SimpleSection
            title="Personal Info"
            items={[
              { label: "Religion", value: profile.religion },
              { label: "Occupation", value: profile.occupation },
              { label: "Education", value: profile.education },
              {
                label: "Relationship Status",
                value: profile.relationshipStatus,
              },
            ]}
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

function SimpleSection({ title, items }) {
  const valid = items.filter((i) => i.value);
  if (valid.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="space-y-2">
        {valid.map((item, i) => (
          <SimpleRow key={i} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

function SimpleRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] text-sm text-gray-300">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
