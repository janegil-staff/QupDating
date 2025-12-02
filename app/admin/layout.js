import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
