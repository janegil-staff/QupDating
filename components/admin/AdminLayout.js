import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content area */}
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  );
}
