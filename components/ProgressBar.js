"use client";
import { useState } from "react";

export default function ProfileLocation({ handleLocationSelected, location }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchPlaces = async (q) => {
    if (!q) return;
    setQuery(q);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          q
        )}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Location search error:", err);
    }
  };

  const selectPlace = (place) => {
    const country = place.address?.country || ""; // ✅ extract country
    const loc = {
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      country, // ✅ save country
    };
    handleLocationSelected(loc);
    setResults([]);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => searchPlaces(e.target.value)}
        placeholder="Search location..."
        className="mt-1 block w-full border rounded px-3 py-2"
      />

      {results.length > 0 && (
        <ul className="mt-2 bg-gray-800 rounded shadow">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => selectPlace(place)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-700"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {location?.name && (
        <p className="mt-2 text-sm text-gray-400">
          Selected: {location.name}{" "}
          {location.country && `(${location.country})`}
        </p>
      )}
    </div>
  );
}
