"use client";
import StatsCards from "@/components/admin/StatsCards";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-400">Loading stats…</p>;
  if (!stats) return <p className="text-red-400">Failed to load stats</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-pink-500 mb-8">Admin Dashboard</h1>
      <StatsCards stats={stats} />
    </div>
  );
}
