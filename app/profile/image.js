export default function ProfileImagePage() {
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Last opp bilde</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="bg-neutral-800 border border-gray-700 rounded-lg px-4 py-2"
      />

      {preview && (
        <img src={preview} alt="Preview" className="mt-4 rounded-lg max-w-xs" />
      )}

      <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg">
        Lagre bilde
      </button>
    </div>
  );
}
