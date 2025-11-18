"use client";

import { useEffect, useState } from "react";

import LocationPreview from "@/components/LocationPreview";
import LocationAutocomplete from "./LocationAutoComplete";
//import LocationPicker from "./LocationPicker.";
import toast from "react-hot-toast";

export default function ProfileLocation({handleLocationSelected, location}) {

  
  const [isSaving, setIsSaving] = useState(false);
console.log("LOOCATION",location)

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

      toast.error("Error saving location. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="block mb-1 text-sm text-gray-400">Location</label>

      {/* Map picker */}
      {/*<LocationPicker onLocationSelected={handleLocationSelected} /> */}

      {/* Autocomplete input */}
      <LocationAutocomplete onLocationSelected={handleLocationSelected} />

      {/* Preview */}
      <LocationPreview location={location} />
    </div>
  );
}
