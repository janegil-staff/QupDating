import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  return (

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {/* Active Users */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-400 text-sm uppercase">Active Users</h3>
          <p className="text-4xl font-bold mt-2 text-white">1,284</p>
        </div>

        {/* New Signups */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-400 text-sm uppercase">New Signups</h3>
          <p className="text-4xl font-bold mt-2 text-white">92</p>
        </div>

        {/* Matches Today */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
          <h3 className="text-gray-400 text-sm uppercase">Matches Today</h3>
          <p className="text-4xl font-bold mt-2 text-white">321</p>
        </div>
      </div>
   
  );
}
