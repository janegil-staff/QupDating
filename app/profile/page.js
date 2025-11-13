"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    birthdate: "",
    bio: "",
    images: [],
    profileImage: "", // ✅ new field
  });
  const [form, setForm] = useState({
    birthDay: "",
    birthMonth: "",
    birthYear: "",
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
          birthdate: profile.birthdate,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated ✅");
      } else {
        toast.error("Error saving profile ❌");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving profile ❌");
    }
  }

  useEffect(() => {
    const birthdate = new Date(profile.birthdate); // from backend
    setForm((prev) => ({
      ...prev,
      birthDay: birthdate.getDate().toString(),
      birthMonth: (birthdate.getMonth() + 1).toString(),
      birthYear: birthdate.getFullYear().toString(),
    }));
  }, [profile.birthdate]);

  async function handleChange(e) {
  const { name, value } = e.target;

  // Update form state first
  const updatedForm = {
    ...form,
    [name]: value,
  };
  setForm(updatedForm);

  // Then construct the date from updated values
  const { birthYear, birthMonth, birthDay } = updatedForm;
  if (birthYear && birthMonth && birthDay) {
    const bd = new Date(`${birthYear}-${birthMonth}-${birthDay}`);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthdate: bd }),
      });

      if (res.ok) {
        toast.success("Profile updated ✅");
      } else {
        toast.error("Error saving profile ❌");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving profile ❌");
    }
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

        {/* Birthdate */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Fødselsdato
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Day */}
            <select
              name="birthDay"
              onChange={handleChange}
              value={form.birthDay}
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Dag</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="birthMonth"
              value={form.birthMonth}
              onChange={handleChange}
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">Måned</option>
              {[
                "Januar",
                "Februar",
                "Mars",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Desember",
              ].map((month, i) => (
                <option key={i + 1} value={i + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              name="birthYear"
              value={form.birthYear}
              onChange={handleChange} // ✅ controlled value
              required
              className="bg-neutral-800 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              <option value="">År</option>
              {[...Array(82)].map((_, i) => {
                const year = new Date().getFullYear() - i - 18;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

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
