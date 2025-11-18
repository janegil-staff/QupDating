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
      <p className="text-gray-200">
        {location.locationName ? location.locationName : location.name}
      </p>
      <p className="text-gray-400 text-sm">
        Latitude: {location.coords?.lat ? location.coords?.lat : location.lat},
        Longitude: {location.coords?.lng ? location.coords?.lng : location.lng}
      </p>
    </div>
  );
}
