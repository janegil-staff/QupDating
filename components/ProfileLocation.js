"use client";

import { useState } from "react";

import LocationPreview from "@/components/LocationPreview";
import LocationAutocomplete from "./LocationAutoComplete";
import LocationPicker from "./LocationPicker.";
import toast from "react-hot-toast";

export default function ProfileLocation() {
  const [location, setLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationSelected = (loc) => {
    setLocation(loc);
  };

  const handleSaveLocation = async () => {
    if (!location) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/profile/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });

      if (!res.ok) throw new Error("Failed to save location");

      toast.success("Location saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error saving location. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Your Location</h2>

      {/* Map picker */}
      <LocationPicker onLocationSelected={handleLocationSelected} />

      {/* Autocomplete input */}
      <LocationAutocomplete onLocationSelected={handleLocationSelected} />

      {/* Preview */}
      <LocationPreview location={location} />

      {/* Save button */}
      <button
        onClick={handleSaveLocation}
        disabled={!location || isSaving}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Location"}
      </button>
    </div>
  );
}
