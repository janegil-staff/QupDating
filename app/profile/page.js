"use client";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    images: [],
    profileImage: "", // ✅ new field
  });

  const [loading, setLoading] = useState(true);

  // Fetch current profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleDelete(img) {
    try {
      const res = await fetch("/api/profile/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: img.public_id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      // Update local state after success
      setProfile((prev) => ({
        ...prev,
        images: prev.images.filter((i) => i.public_id !== img.public_id),
      }));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete image ❌");
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const files = Array.from(e.target.files);
    const total = profile.images.length + files.length;

    if (total > 6) {
      alert("Du kan kun laste opp 6 bilder.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();

      setProfile((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          { url: data.url, public_id: data.public_id },
        ],
      }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Could not upload image ❌");
    }
  }
  async function handleSetProfileImage(imageUrl) {
    try {
      const res = await fetch("/api/users/profile-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to update profile image");

      setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
    } catch (err) {
      console.error("Error setting profile image:", err);
      alert("Kunne ikke oppdatere profilbildet ❌");
    }
  }

  async function handleSave() {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          bio: profile.bio,
          images: profile.images,
          profileImage: profile.profileImage,
        }),
      });

      if (res.ok) {
        alert("Profile updated ✅");
      } else {
        alert("Error saving profile ❌");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving profile ❌");
    }
  }

  if (loading) return <p className="text-white">Loading...</p>;
  
  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-6">
        <a
          href={`/profile/${profile._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 float-right rounded-full font-semibold ml-4"
        >
          Preview Public Profile
        </a>
        <br />
        <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>

        {/* Name */}
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        {/* Age */}
        <label className="block mb-2">Age</label>
        <input
          type="number"
          name="age"
          value={profile.age}
         onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          min={18}
          max={99}
          required
          className="bg-gray-800 text-white p-2 rounded-md w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        {/* Gender */}
        <label className="block my-2">Gender</label>
        <select
          name="gender"
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          className="bg-gray-800 text-white p-2 rounded-md w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="male">👨 Mann</option>
          <option value="female">👩 Kvinne</option>
          <option value="other">❓ Annet</option>
        </select>

        {/* Bio */}
        <label className="block my-2">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        {/* Gallery */}
        <label className="block mb-2">Photos</label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {profile.images?.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img.url}
                alt="profile"
                className={`w-full h-32 object-cover rounded border-4 ${
                  profile.profileImage === img.url
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              />
              <button
                className="absolute top-1 right-1 bg-red-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDelete(img)}
              >
                ✖
              </button>
              <button
                className="absolute bottom-1 left-1 bg-blue-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleSetProfileImage(img.url)}
              >
                Bruk som profilbilde
              </button>
            </div>
          ))}

          {profile.images.length < 6 && (
            <label className="flex items-center justify-center w-full h-32 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition">
              <span className="text-gray-300 font-bold text-lg">
                ＋ Add Photo
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
