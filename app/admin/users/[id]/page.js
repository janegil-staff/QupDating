import AdminLayout from "@/components/admin/AdminLayout";

async function getUser(id) {

  const res = await fetch(`/api/admin/users/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export default async function UserDetailPage({ params }) {
  const { id } = await params; // ✅ await params
  let user;

  try {
    const data = await getUser(id);
    user = data.user;
  } catch (err) {
    return (
      <AdminLayout>
        <h1 className="text-2xl font-bold text-red-500 mb-6">Error</h1>
        <p className="bg-gray-800 p-6 rounded-lg shadow">
          Could not load user details. {err.message}
        </p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">User Detail</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.isBanned ? "Banned" : "Active"}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Risk Level:</strong> {user.riskLevel || "Low"}</p>
        <p><strong>Last Seen:</strong> {user.lastSeen ? new Date(user.lastSeen).toLocaleString() : "Never"}</p>
      </div>
    </AdminLayout>
  );
}
