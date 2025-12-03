"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/admin/users`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Toggle ban/unban
  const toggleBan = async (id, isBanned) => {
    const res = await fetch(`/api/admin/users/${id}/ban`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: !Boolean(isBanned) }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBanned: !Boolean(isBanned) } : u
        )
      );
    }
  };

  // Change role via dropdown
  const changeRole = async (id, newRole) => {
    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">User Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400 mb-4"
      />

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-yellow-400 font-bold">{user.name}</p>
            <p className="text-gray-300 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm">Role: {user.role}</p>
            <p className={Boolean(user.isBanned) ? "text-red-400" : "text-green-400"}>
              {Boolean(user.isBanned) ? "Banned" : "Active"}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link
                href={`/admin/users/${user._id}`}
                className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
              >
                View
              </Link>
              <select
                value={user.role}
                onChange={(e) => changeRole(user._id, e.target.value)}
                className="px-2 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-400"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              <button
                onClick={() => toggleBan(user._id, user.isBanned)}
                className={`px-2 py-1 rounded ${
                  Boolean(user.isBanned)
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {Boolean(user.isBanned) ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2 break-words max-w-[200px]">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {Boolean(user.isBanned) ? (
                    <span className="text-red-400">Banned</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Link
                    href={`/profile/${user._id}`}
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
                  >
                    View
                  </Link>
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user._id, e.target.value)}
                    className="px-2 py-1 rounded bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                  <button
                    onClick={() => toggleBan(user._id, user.isBanned)}
                    className={`px-2 py-1 rounded ${
                      Boolean(user.isBanned)
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : "bg-red-600 text-white hover:bg-red-500"
                    }`}
                  >
                    {Boolean(user.isBanned) ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
