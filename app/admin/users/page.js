"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=50`);
      const data = await res.json();

      setUsers((prev) => [...prev, ...(data.users || [])]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleBan = async (userId, isBanned) => {
    try {
      await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isBanned: !isBanned }),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBanned: !isBanned } : u
        )
      );
    } catch (err) {
      console.error("Error banning user:", err);
    }
  };

  return (
    <div
      className="overflow-y-auto h-[80vh] p-4 bg-gray-900 text-white"
      onScroll={handleScroll}
    >
      <h2 className="text-xl font-bold mb-4">User Management</h2>

      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        ← Back to Admin Dashboard
      </button>

      <table className="table-auto border-separate border-spacing-y-2 w-full text-left">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Birthdate</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user) => (
              <tr key={user._id} className="bg-gray-700">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {user.birthdate
                    ? new Date(user.birthdate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {user.isBanned ? "Banned" : "Active"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleBan(user._id, user.isBanned)}
                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    {user.isBanned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more users</p>}
    </div>
  );
}
