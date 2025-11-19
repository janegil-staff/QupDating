"use client";

import LocationPreview from "@/components/LocationPreview";
import LocationAutocomplete from "./LocationAutoComplete";

export default function ProfileLocation({ handleLocationSelected, location }) {
  return (
    <div className="space-y-6">
      <label className="block mb-1 text-sm text-gray-400">Location</label>
      <LocationAutocomplete onLocationSelected={handleLocationSelected} />
      <LocationPreview location={location} />
    </div>
  );
}
