"use client";

import { useEffect, useState, useRef } from "react";
import ProfileLocation from "@/components/ProfileLocation";
import toast from "react-hot-toast";
import ImageUploadGrid from "@/components/ImageUploadGrid";
import AgeRangeSlider from "@/components/AgeRangeSlider";

const STEPS = [
  "Basic Info",
  "Appearance",
  "Lifestyle",
  "Personal",
  "Location",
  "Photos & Review",
];

export default function EditProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(Array(6).fill(false));

  const [preferredAgeMin, setPreferredAgeMin] = useState(25);
  const [preferredAgeMax, setPreferredAgeMax] = useState(40);

  const handleAgeChange = ([min, max]) => {
    setPreferredAgeMin(min);
    setPreferredAgeMax(max);
  };

  const emptyForm = {
    name: "",
    birthdate: "",
    gender: "",
    occupation: "",
    appearance: "",
    height: "",
    bodyType: "",
    hasChildren: null,
    wantsChildren: null,
    smoking: "",
    drinking: "",
    relationshipStatus: "",
    willingToRelocate: null,
    education: "",
    religion: "",
    tags: "",
    location: { name: "", lat: null, lng: null },
    bio: "",
    lookingFor: "",
    images: [],
    profileImage: "",
    searchScope: "Worldwide",
    preferredAgeMin: 18,
    preferredAgeMax: 99,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        const user = data.user || data;
        if (cancelled) return;
        setForm({
          name: user.name || "",
          birthdate: user.birthdate
            ? new Date(user.birthdate).toISOString().slice(0, 10)
            : "",
          gender: user.gender || "",
          occupation: user.occupation || "",
          appearance: user.appearance || "",
          height: user.height != null ? String(user.height) : "",
          bodyType: user.bodyType || "",
          hasChildren: user.hasChildren ?? null,
          wantsChildren: user.wantsChildren ?? null,
          smoking: user.smoking || "",
          drinking: user.drinking || "",
          relationshipStatus: user.relationshipStatus || "",
          willingToRelocate: user.willingToRelocate ?? null,
          searchScope: user.searchScope || "Worldwide",
          education: user.education || "",
          religion: user.religion || "",
          tags: Array.isArray(user.tags)
            ? user.tags.join(" ")
            : user.tags || "",
          location: user.location || { name: "", lat: null, lng: null },
          bio: user.bio || "",
          lookingFor: user.lookingFor || "",
          images: Array.isArray(user.images)
            ? user.images.map((i) => ({ url: i.url, public_id: i.public_id }))
            : [],
          profileImage:
            user.profileImage ||
            (Array.isArray(user.images) && user.images[0]
              ? user.images[0].url
              : ""),
          preferredAgeMin: user.preferredAgeMin || 25,
          preferredAgeMax: user.preferredAgeMax || 40,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const setField = (key, value) => {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const setNested = (key, k, v) => {
    setForm((s) => ({ ...s, [key]: { ...(s[key] || {}), [k]: v } }));
  };

  const next = () => {
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const mapped = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setForm((s) => ({ ...s, images: [...(s.images || []), ...mapped] }));
  };
  const setAsProfile = (idx) => {
    const img = form.images[idx];
    if (img) setField("profileImage", img.url);
  };
  const removeImage = (idx) =>
    setForm((s) => ({ ...s, images: s.images.filter((_, i) => i !== idx) }));

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        tags: (form.tags || "").split(/[,\s]+/).filter(Boolean),
        height: form.height ? parseInt(form.height, 10) : undefined,
        location: {
          name: form.location?.name,
          lat: form.location?.lat,
          lng: form.location?.lng,
          country: form.location?.country, // ✅ include country
        },
        searchScope: form.searchScope || "Worldwide",
        preferredAgeMin: form.preferredAgeMin || 18,
        preferredAgeMax: form.preferredAgeMax || 99,
      };

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Profile saved");
    } catch (e) {
      console.error(e);
      setErrors((e) => ({ ...e, submit: "Failed to save profile" }));
    } finally {
      setSaving(false);
    }
  };
  const prev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };
  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);
    onLocationSelected({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
  };

  function handleLocationSelected(loc) {
    let l = {
      lat: loc.coords.lat,
      lng: loc.coords.lng,
      name: loc.locationName,
      country: loc.country,
    };

    setForm((prev) => ({
      ...prev,
      location: l, // { name, lat, lng }
    }));
  }
  async function handleUpload(e, index) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading((prev) => {
      const copy = [...prev];
      copy[index] = true; // start spinner
      return copy;
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setForm((prev) => {
          const newImages = [...prev.images];
          newImages[index] = { url: data.url, public_id: data.public_id };
          return { ...prev, images: newImages };
        });
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (err) {
      console.error("Error uploading:", err);
    } finally {
      setUploading((prev) => {
        const copy = [...prev];
        copy[index] = false; // stop spinner
        return copy;
      });
    }
  }
  function handleLocationSelected(loc) {
    setForm((prev) => ({
      ...prev,
      location: {
        lat: loc.lat,
        lng: loc.lng,
        name: loc.name,
        country: loc.country, // ✅ keep country
      },
    }));
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-10 px-4 text-gray-100">
      <div className="max-w-4xl mx-auto  bg-neutral-900 rounded-2xl shadow p-8">
        <div className="mb-6 w-full">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{STEPS[step]}</h2>
            <span className="text-sm text-gray-500">
              {Math.round(((step + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-600"
              style={{
                width: `${Math.round(((step + 1) / STEPS.length) * 100)}%`,
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading profile…
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === STEPS.length - 1) save();
              else next();
            }}
            className="space-y-6"
          >
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Birthdate
                  </label>
                  <input
                    type="date"
                    value={form.birthdate}
                    onChange={(e) => setField("birthdate", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                    className="mt-1 pt-3 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Occupation
                  </label>
                  <input
                    value={form.occupation}
                    onChange={(e) => setField("occupation", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={form.height}
                    onChange={(e) => setField("height", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Appearance
                  </label>
                  <select
                    value={form.appearance}
                    onChange={(e) => setField("appearance", e.target.value)}
                    className="mt-1 pt-3 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="normal">Normal</option>
                    <option value="pretty">Pretty</option>
                    <option value="cute">Cute</option>
                    <option value="handsome">Handsome</option>
                    <option value="stylish">Stylish</option>
                    <option value="unique">Unique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Body Type
                  </label>
                  <select
                    value={form.bodyType}
                    onChange={(e) => setField("bodyType", e.target.value)}
                    className="mt-1 pt-3 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="slim">Slim</option>
                    <option value="average">Average</option>
                    <option value="athletic">Athletic</option>
                    <option value="curvy">Curvy</option>
                    <option value="muscular">Muscular</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Smoking
                  </label>
                  <select
                    value={form.smoking}
                    onChange={(e) => setField("smoking", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="occasionally">Occasionally</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Drinking
                  </label>
                  <select
                    value={form.drinking}
                    onChange={(e) => setField("drinking", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="None">None</option>
                    <option value="light / social drinker">
                      Light / social
                    </option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Relationship Status
                  </label>
                  <select
                    value={form.relationshipStatus}
                    onChange={(e) =>
                      setField("relationshipStatus", e.target.value)
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="single">Single</option>
                    <option value="in a relationship">In a relationship</option>
                    <option value="married">Married</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Has Children
                  </label>
                  <select
                    value={String(form.hasChildren ?? "")}
                    onChange={(e) =>
                      setField("hasChildren", e.target.value === "true")
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Wants Children
                  </label>
                  <select
                    value={String(form.wantsChildren ?? "")}
                    onChange={(e) =>
                      setField("wantsChildren", e.target.value === "true")
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Willing to Relocate
                  </label>
                  <select
                    value={String(form.willingToRelocate ?? "")}
                    onChange={(e) =>
                      setField("willingToRelocate", e.target.value === "true")
                    }
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Education
                  </label>
                  <input
                    value={form.education}
                    onChange={(e) => setField("education", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Religion
                  </label>
                  <select
                    value={form.religion}
                    onChange={(e) => setField("religion", e.target.value)}
                    className="mt-1 pt-3 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="hinduism">Hinduism</option>
                    <option value="buddhism">Buddhism</option>
                    <option value="judaism">Judaism</option>
                    <option value="sikhism">Sikhism</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="agnostic">Agnostic</option>
                    <option value="atheist">Atheist</option>
                    <option value="none">Prefer not to say</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tags
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => setField("tags", e.target.value)}
                    placeholder="#Hiking #Coffee"
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setField("bio", e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Looking for
                  </label>
                  <select
                    value={form.lookingFor}
                    onChange={(e) => setField("lookingFor", e.target.value)}
                    className="mt-1 block w-full border rounded px-3 py-2"
                  >
                    <option value="">Choose...</option>
                    <option value="friendship">Friendship</option>
                    <option value="relationship">Relationship</option>
                    <option value="dating">Dating</option>
                    <option value="marriage">Marriage</option>
                    <option value="casual">Casual</option>
                    <option value="networking">Networking</option>
                    <option value="activity Partner">Activity Partner</option>
                    <option value="open to see where it goes">
                      Open to see where it goes
                    </option>
                  </select>
                </div>

                <div>
                  <AgeRangeSlider
                    min={18}
                    max={99}
                    value={[form.preferredAgeMin, form.preferredAgeMax]}
                    onChange={([min, max]) =>
                      setForm((prev) => ({
                        ...prev,
                        preferredAgeMin: min,
                        preferredAgeMax: max,
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Location Name
                  </label>

                  <ProfileLocation
                    handleLocationSelected={handleLocationSelected}
                    location={form.location}
                  />
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setField("searchScope", "Nearby")}
                    className={`px-4 py-2 rounded ${
                      form.searchScope === "Nearby"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    🏠 Nearby
                  </button>

                  <button
                    type="button"
                    onClick={() => setField("searchScope", "Worldwide")}
                    className={`px-4 py-2 rounded ${
                      form.searchScope === "Worldwide"
                        ? "bg-pink-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    🌍 Worldwide
                  </button>
                </div>
              </>
            )}

            {step === 5 && (
              <div>
                <ImageUploadGrid
                  images={form.images}
                  setImages={(imgs) => setForm({ ...form, images: imgs })}
                  removeImage={removeImage}
                  profileImage={form.profileImage}
                  setProfileImage={(url) =>
                    setForm({ ...form, profileImage: url })
                  }
                />
              </div>
            )}

            {errors.global && (
              <div className="text-red-500 text-sm">{errors.global}</div>
            )}
            {errors.submit && (
              <div className="text-red-500 text-sm">{errors.submit}</div>
            )}

            <div className="flex items-center justify-between mt-6">
              <div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={prev}
                    className="mr-2 px-4 py-2 text-gray-700 rounded bg-gray-200"
                  >
                    Back
                  </button>
                )}
              </div>
              <div>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="px-5 py-2 rounded bg-pink-600 text-white"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded bg-green-600 text-white"
                  >
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
