import { useState } from "react";

function ImageUploadGrid({
  images,
  setImages,
  profileImage,
  setProfileImage,
  removeImage,
}) {
  const [uploading, setUploading] = useState(Array(6).fill(false));

  async function handleUpload(e, index) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        const newImages = [...images];
        newImages[index] = { url: data.url, public_id: data.public_id };
        setImages(newImages);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading((prev) => {
        const copy = [...prev];
        copy[index] = false;
        return copy;
      });
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative w-full h-40 bg-neutral-700 rounded-lg flex items-center justify-center"
        >
          {images[i] ? (
            <div className="relative w-full h-full">
              <img
                src={images[i].url}
                alt={`upload-${i}`}
                className={`w-full h-full object-cover rounded-lg shadow-md border-4 ${
                  profileImage === images[i].url
                    ? "border-green-500"
                    : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => setProfileImage(images[i].url)}
                className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded shadow hover:bg-pink-700"
              >
                Set Profile
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="bg-red-500 text-white text-xs px-2 py-1 rounded absolute bottom-2  right-2"
              >
                Delete
              </button>
            </div>
          ) : (
            <label className="w-full h-full flex items-center justify-center text-gray-300 cursor-pointer hover:bg-pink-600 transition rounded-lg">
              ＋ Add Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, i)}
              />
            </label>
          )}

          {/* Spinner overlay */}
          {uploading[i] && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <svg
                className="animate-spin h-8 w-8 text-pink-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ImageUploadGrid;
