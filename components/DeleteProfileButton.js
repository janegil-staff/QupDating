"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteProfileButton({ userId }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirmDelete() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user/${userId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to delete profile");


      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Delete Profile
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-pink-500">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your profile? This action cannot be undone.
            </p>

            {error && <p className="text-red-400 mb-4">Error: {error}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
