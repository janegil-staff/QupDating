"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "/images/cursor-icon.png", // put marker icon in public/images
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      setPosition(e.latlng);

      // Reverse geocode using Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
      );
      const data = await res.json();

      const locationName =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.hamlet ||
        data.display_name;

      onSelect({ coords: e.latlng, locationName });
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationPicker({ onLocationSelected }) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[60.39, 5.32]} // Default center (Bergen, Norway)
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onLocationSelected} />
      </MapContainer>
    </div>
  );
}
