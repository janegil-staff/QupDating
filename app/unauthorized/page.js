export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">🚫 Access Denied</h1>
      <p className="mt-2 text-gray-400">You do not have permission to view this page.</p>
    </div>
  );
}
