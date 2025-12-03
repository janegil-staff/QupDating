"use client";
import {
  FaUserCheck,
  FaUserPlus,
  FaHeart,
  FaComments,
  FaShieldAlt,
  FaBan,
  FaRedo,
  FaCalendarAlt,
  FaUsers,
  FaFlag,
  FaChartLine,
  FaIdCard,
  FaServer,
} from "react-icons/fa";

function SkeletonCard() {
  return (
    <div className="bg-neutral-900 p-6 rounded-xl shadow-lg flex items-center gap-4 border border-gray-700 animate-pulse">
      <div className="bg-gray-700 h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="bg-gray-700 h-3 w-24 rounded" />
        <div className="bg-gray-700 h-5 w-16 rounded" />
      </div>
    </div>
  );
}

export default function StatsCards({ stats, loading }) {
  const cards = [
    { label: "Active Users", value: stats?.activeUsers ?? 0, icon: <FaUserCheck /> },
    { label: "New Signups", value: stats?.newSignups ?? 0, icon: <FaUserPlus /> },
    { label: "Matches Today", value: stats?.matchesToday ?? 0, icon: <FaHeart /> },
    { label: "Messages Today", value: stats?.messagesToday ?? 0, icon: <FaComments /> },
    { label: "Verified Users", value: stats?.verifiedUsers ?? 0, icon: <FaShieldAlt /> },
    { label: "Banned Users", value: stats?.bannedUsers ?? 0, icon: <FaBan /> },
    { label: "Retention Rate", value: `${stats?.retentionRate ?? 0}%`, icon: <FaRedo /> },
    { label: "Events Created", value: stats?.eventsCreated ?? 0, icon: <FaCalendarAlt /> },
    { label: "RSVPs Today", value: stats?.rsvpsToday ?? 0, icon: <FaUsers /> },
    { label: "Reports Filed", value: stats?.reportsFiled ?? 0, icon: <FaFlag /> },
    { label: "Avg. Messages/User", value: stats?.avgMessagesPerUser.toFixed(2) ?? 0, icon: <FaChartLine /> },
    { label: "Profile Completion", value: `${stats?.profileCompletion ?? 0}%`, icon: <FaIdCard /> },
    { label: "System Health", value: stats?.systemHealth ?? "OK", icon: <FaServer /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: cards.length }).map((_, idx) => <SkeletonCard key={idx} />)
        : cards.map((card) => (
            <div
              key={card.label}
              className="bg-neutral-900 p-6 rounded-xl shadow-lg flex items-center gap-4 hover:border-pink-500 border border-gray-700 transition"
            >
              <div className="text-pink-500 text-2xl">{card.icon}</div>
              <div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
    </div>
  );
}
