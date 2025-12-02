// app/admin/page.js
import AdminStats from "@/components/admin/AdminStats";

export default function Dashboard() {
  return (
    <div className="p-4 space-y-6">
      {/* Stats cards: stacked on mobile, grid on desktop */}
      <div className="my-8">
        <AdminStats />
      </div>
    </div>
  );
}
