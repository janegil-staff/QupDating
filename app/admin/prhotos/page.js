export default function PhotosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Photo Moderation</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Add dynamic photos later */}
        <div className="bg-gray-200 h-40 rounded-lg"></div>
        <div className="bg-gray-200 h-40 rounded-lg"></div>
        <div className="bg-gray-200 h-40 rounded-lg"></div>
      </div>
    </div>
  );
}
