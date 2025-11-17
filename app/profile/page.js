"use client";
import ProgressBar from "@/components/ProgressBar";
import { calculateCompletion } from "@/lib/calculateCompletion";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditProfile() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    gender: "",
    birthdate: "",
    bio: "",
    images: [],
    profileImage: "",
    appearance: "",
    height: "",
    bodyType: "",
    hasChildren: "",
    wantsChildren: "",
    smoking: "",
    location: "",
    lookingFor: "",
    religion: "",
    education: "",
    occupation: "",
    willingToRelocate: "",
    tags: "",
    relationshipStatus: "",
    lookingFor: "",
    drinking: "",
  });
  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    bio: "",
    appearance: "",
    height: "",
    bodyType: "",
    hasChildren: "",
    wantsChildren: "",
    smoking: "",
    drinking: "",
    relationshipStatus: "",
    willingToRelocate: "",
    education: "",
    religion: "",
    occupation: "",
    location: "",
    lookingFor: "",
    tags: "",
    profileImage: "",
    images: [],
  });
  console.log(profile);

  useEffect(() => {
    if (!loading && profile) {
      const birthdate = new Date(profile.birthdate);
      setForm({
        name: profile.name || "",
        gender: profile.gender || "",
        birthDay: birthdate.getDate().toString(),
        birthMonth: (birthdate.getMonth() + 1).toString(),
        birthYear: birthdate.getFullYear().toString(),
        bio: profile.bio || "",
        appearance: profile.appearance || "",
        height: profile.height?.toString() || "",
        bodyType: profile.bodyType || "",
        hasChildren: profile.hasChildren?.toString() || "",
        wantsChildren: profile.wantsChildren?.toString() || "",
        smoking: profile.smoking || "",
        drinking: profile.drinking || "",
        relationshipStatus: profile.relationshipStatus || "",
        willingToRelocate: profile.willingToRelocate?.toString() || "",
        education: profile.education || "",
        religion: profile.religion || "",
        occupation: profile.occupation || "",
        location: profile.location || "",
        lookingFor: profile.lookingFor || "",
        tags: Array.isArray(profile.tags) ? profile.tags.join(" ") : "",
        profileImage: profile.profileImage || "",
        images: profile.images || [],
      });
    }
  }, [loading, profile]);

  useEffect(() => {
    if (profile?.birthdate) {
      const bd = new Date(profile.birthdate);
      setForm((prev) => ({
        ...prev,
        birthdate: bd.toISOString(),
        birthDay: bd.getDate().toString(),
        birthMonth: (bd.getMonth() + 1).toString(),
        birthYear: bd.getFullYear().toString(),
        // …other fields
      }));
    }
  }, [profile.birthdate]);

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
        setLoadImage(false);
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
    setLoadImage(true);
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
    } finally {
      setLoadImage(false);
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

  async function handleSaveForImages() {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          gender: form.gender,
          birthdate: form.birthdate,
          bio: form.bio,
          images: form.images,
          profileImage: form.profileImage,
          appearance: form.appearance,
          height: form.height,
          bodyType: form.bodyType,
          hasChildren: form.hasChildren,
          wantsChildren: form.wantsChildren,
          smoking: form.smoking,
          location: form.location,
          lookingFor: form.lookingFor,
          religion: form.religion,
          education: form.education,
          occupation: form.occupation,
          willingToRelocate: form.willingToRelocate,
          tags: form.tags,
          relationshipStatus: form.relationshipStatus,
          lookingFor: form.lookingFor,
          drinking: form.drinking,
        }),
      });
      console.log(res);
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
      const bd = new Date(
        `${birthYear}-${birthMonth}-${birthDay}`
      ).toISOString();
      updatedForm.birthdate = bd;

      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthdate: bd }), // ✅ bd is defined here
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

  async function handleSave() {
    const bd = new Date(
      `${form.birthYear}-${form.birthMonth}-${form.birthDay}`
    ).toISOString();

    const payload = {
      ...form,
      birthdate: bd, // ✅ always included
      height: parseInt(form.height) || null,
      hasChildren: form.hasChildren === "true",
      wantsChildren: form.wantsChildren === "true",
      willingToRelocate: form.willingToRelocate === "true",
      tags: form.tags?.split(" ").filter(Boolean),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Profil oppdatert ✅");
      } else {
        toast.error("Kunne ikke lagre endringer ❌");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Serverfeil ❌");
    }
  }

  if (!profile) return <p className="text-red-400">Ingen profil funnet ❌</p>;
  if (loading) return <p className="text-white">Loading...</p>;
  const completion = calculateCompletion(profile);
  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <div className="w-full bg-neutral-900 text-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">Din Profil</h2>

        <div className="flex justify-between">
          <dic>
            <button
              onClick={() => setShowModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Last opp bilde
            </button>
          </dic>

          <div>
            <button
              onClick={() => redirect(`/profile/${profile._id}`)}
              className="bg-green-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Se din profil
            </button>
          </div>
        </div>
        {/* 🔥 Progress bar right after completion calculation */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-pink-500">
            Profilfullføring
          </h3>
          <ProgressBar value={completion} />
          <p className="text-sm text-gray-400 mt-2">{completion}% fullført</p>
        </div>
        {/* Name */}
        <label className="block mb-1 text-sm text-gray-400">Name</label>
        <input
          type="text"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
        />
        {/* Birthdate */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">
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
        <div>
          <label className="block mb-1 text-sm text-gray-400">Kjønn</label>
          <select
            name="gender"
            value={form.gender || ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="">Velg kjønn</option>
            <option value="male">Mann</option>
            <option value="female">Kvinne</option>
            <option value="other">Annet</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">Høyde (cm)</label>
          <input
            type="number"
            name="height"
            value={form.height || ""}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Merk deg selv med hashtags
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags || []}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="#CatLover #fjelltur #pizza"
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">Om deg</label>
          <textarea
            name="bio"
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Smoking */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Røyker?</label>
            <select
              name="smoking"
              value={form.smoking || ""}
              onChange={(e) => setForm({ ...form, smoking: e.target.value })}
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="Yes">Ja</option>
              <option value="No">Nei</option>
              <option value="Occasionally">Av og til</option>
            </select>
          </div>

          {/* Drinking */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Drikker?</label>
            <select
              name="drinking"
              value={form.drinking || ""}
              onChange={(e) => setForm({ ...form, drinking: e.target.value })}
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="None">Aldri</option>
              <option value="Light / social drinker">Lett / sosialt</option>
              <option value="Heavy">Ofte</option>
            </select>
          </div>

          {/* Has Children */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Har barn?
            </label>
            <select
              name="hasChildren"
              value={form.hasChildren || ""}
              onChange={(e) =>
                setForm({ ...form, hasChildren: e.target.value })
              }
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="true">Ja</option>
              <option value="false">Nei</option>
            </select>
          </div>

          {/* Wants Children */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Vil ha barn?
            </label>
            <select
              name="wantsChildren"
              value={form.wantsChildren || ""}
              onChange={(e) =>
                setForm({ ...form, wantsChildren: e.target.value })
              }
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="true">Ja</option>
              <option value="false">Nei</option>
            </select>
          </div>
        </div>

        {/* Willing to Relocate */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Villig til å flytte?
          </label>
          <select
            name="willingToRelocate"
            value={form.willingToRelocate || ""}
            onChange={(e) =>
              setForm({ ...form, willingToRelocate: e.target.value })
            }
            className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="">Velg</option>
            <option value="true">Ja</option>
            <option value="false">Nei</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {/* Appearance */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Utseende</label>
            <select
              name="appearance"
              value={form.appearance || ""}
              onChange={(e) => setForm({ ...form, appearance: e.target.value })}
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="Average">Gjennomsnittlig</option>
              <option value="Athletic">Atletisk</option>
              <option value="Slim">Slank</option>
              <option value="Curvy">Kurvet</option>
              <option value="Muscular">Muskuløs</option>
              <option value="Other">Annet</option>
            </select>
          </div>

          {/* Body Type */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Kroppstype
            </label>
            <select
              name="bodyType"
              value={form.bodyType || ""}
              onChange={(e) => setForm({ ...form, bodyType: e.target.value })}
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="Slim">Slank</option>
              <option value="Average">Gjennomsnittlig</option>
              <option value="Athletic">Atletisk</option>
              <option value="Curvy">Kurvet</option>
              <option value="Muscular">Muskuløs</option>
              <option value="Plus-size">Stor</option>
              <option value="Other">Annet</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {/* Relationship Status */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">
              Sivilstatus
            </label>
            <select
              name="relationshipStatus"
              value={form.relationshipStatus || ""}
              onChange={(e) =>
                setForm({ ...form, relationshipStatus: e.target.value })
              }
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="Single">Singel</option>
              <option value="In a relationship">I et forhold</option>
              <option value="Married">Gift</option>
              <option value="Divorced">Skilt</option>
              <option value="Widowed">Enke/Enkemann</option>
              <option value="It's complicated">Det er komplisert</option>
            </select>
          </div>

          {/* Religion */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Religion</label>
            <select
              name="religion"
              value={form.religion || ""}
              onChange={(e) => setForm({ ...form, religion: e.target.value })}
              className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
            >
              <option value="">Velg</option>
              <option value="Christianity">Kristendom</option>
              <option value="Islam">Islam</option>
              <option value="Judaism">Jødedom</option>
              <option value="Hinduism">Hinduisme</option>
              <option value="Buddhism">Buddhisme</option>
              <option value="Spiritual">Spirituell</option>
              <option value="Agnostic">Agnostisk</option>
              <option value="Atheist">Ateist</option>
              <option value="Other">Annet</option>
            </select>
          </div>
        </div>

        {/* Education */}
        <input
          type="text"
          name="education"
          value={form.education || ""}
          onChange={(e) => setForm({ ...form, education: e.target.value })}
          placeholder="Utdanning"
          className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
        />

        {/* Occupation */}
        <input
          type="text"
          name="occupation"
          value={form.occupation || ""}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          placeholder="Yrke"
          className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
        />
        {/* Location */}
        <input
          type="text"
          name="location"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Sted"
          className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
        />

        {/* Looking For */}
        <textarea
          name="lookingFor"
          value={form.lookingFor || ""}
          onChange={(e) => setForm({ ...form, lookingFor: e.target.value })}
          rows={3}
          placeholder="Hva ser du etter?"
          className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2 resize-none"
        />

        {/* Submit */}
        <button
          type="submit"
          onClick={handleSave}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold mb-6 py-2 px-4 rounded-lg transition"
        >
          Oppdater Profil
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-white text-center">
              Last opp profilbilde
            </h2>

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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />
                  {loadImage ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                        ></path>
                      </svg>
                      <span>Laster opp…</span>
                    </>
                  ) : (
                    <>＋ Add Photo</>
                  )}
                </label>
              )}
            </div>
            <div className="text-center">
              <button
                onClick={handleSaveForImages}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold TEXT-C"
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full text-sm text-gray-400 hover:text-white mt-2"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
