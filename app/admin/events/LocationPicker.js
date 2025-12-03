"use client";
import { useState } from "react";
import LocationPreview from "./LocationPreview";

export default function LocationPicker() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const place = data[0];
        setLocation({
          name: place.display_name,
          lat: place.lat,
          lng: place.lon,
          country: place.address?.country || "",
        });
      } else {
        setLocation(null);
      }
    } catch (err) {
      console.error("❌ Error fetching location:", err);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter an address..."
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white"
        >
          Find
        </button>
      </form>

      <LocationPreview location={location} />
    </div>
  );
}
