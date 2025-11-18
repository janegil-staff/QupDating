function LocationMarker({ onChange }) {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange({ lat, lng, name: `${lat.toFixed(3)}, ${lng.toFixed(3)}` });
    },
  });
  return position ? (
    <Marker
      position={position}
      icon={L.icon({ iconUrl: "/images/cursor-icon.png", iconSize: [32, 32] })}
    />
  ) : null;
}
