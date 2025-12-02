// components/admin/AdminStats.js
"use client";

import { useEffect, useState } from "react";

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setData)
      .catch(setError);
  }, []);

  if (error) return <div className="text-red-500">Failed to load stats</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex flex-row flex-wrap justify-between gap-6 w-full">
      <StatCard label="Active Users" value={data.activeUsers} />
      <StatCard label="New Signups" value={data.newSignups} />
      <StatCard label="Matches Today" value={data.matchesToday} />
      <StatCard label="Messages Today" value={data.messagesToday} />
      <StatCard label="Verified Users" value={data.verifiedUsers} />
      <StatCard label="Banned Users" value={data.bannedUsers} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="flex-1 min-w-[250px] bg-gray-800 p-8 rounded-xl shadow-lg text-center flex flex-col justify-center items-center">
      <div className="text-lg text-gray-400">{label}</div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  );
}
