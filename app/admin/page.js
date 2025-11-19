"use client";

import Card from "@/components/Card";
import { FaUsers, FaFlag, FaCalendarAlt, FaChartBar } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-pink-500 mb-8">
          Admin Dashboard
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Users"
            icon={<FaUsers />}
            description="Manage accounts, ban/unban, reset passwords."
            href="/admin/users"
          />
          <Card
            title="Reports"
            icon={<FaFlag />}
            description="Handle reported content and moderation tasks."
            href="/admin/reports"
          />
          <Card
            title="Events"
            icon={<FaCalendarAlt />}
            description="Manage QupDating events, RSVPs, and approvals."
            href="/admin/events"
          />
          <Card
            title="Analytics"
            icon={<FaChartBar />}
            description="Track growth, engagement, and system health."
            href="/admin/analytics"
          />
        </div>

        {/* Content Area */}
        <div className="mt-10 bg-neutral-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-pink-500 mb-4">Overview</h2>
          <p className="text-gray-300">
            Select a module above to view detailed data and actions.
          </p>
        </div>
      </div>
    </div>
  );
}
