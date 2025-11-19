"use client";

export default function LocationPreview({ location }) {
  if (!location) {
    return (
      <p className="text-gray-400 text-sm italic">No location selected yet.</p>
    );
  }

  return (
    <div className="bg-neutral-900 p-4 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold text-pink-500 mb-2">
        Selected Location
      </h3>
      <p className="text-gray-200">{location.name}</p>
      <p className="text-gray-400 text-sm">
        Latitude: {location.lat}, Longitude: {location.lng}
      </p>
      {location.country && (
        <p className="text-gray-400 text-sm mt-1">Country: {location.country}</p>
      )}
    </div>
  );
}
