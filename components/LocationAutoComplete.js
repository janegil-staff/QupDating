"use client";
import { useState } from "react";

export default function LocationAutocomplete({ onLocationSelected }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(value)}`
    );
    const data = await res.json();
    setResults(data);
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);
    onLocationSelected({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name,
      country: place.address?.country || "", // ✅ include country
    });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Type a city or address..."
        className="w-full px-4 py-2 rounded-sm bg-white text-gray-700 border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-neutral-900 border border-gray-700 rounded-lg mt-2 w-full max-h-60 overflow-y-auto">
          {results.map((place, i) => (
            <li
              key={i}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 cursor-pointer hover:bg-neutral-800 text-gray-300"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
