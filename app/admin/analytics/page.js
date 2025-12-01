"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("API request failed");
        const json = await res.json();
        console.log(json);
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  if (error) return <p className="p-6 text-red-400">Error: {error}</p>;
  if (!data) return <p className="p-6 text-white">Loading analytics...</p>;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded">
          Users: {data?.users?.total ?? "N/A"}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          Active: {data?.users?.active ?? "N/A"}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          Events: {data?.events?.total ?? "N/A"}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          Messages: {data?.messages?.total ?? "N/A"}
        </div>
      </div>

      {/* Chart Example */}
      {data?.users?.signups?.length ? (
        <div className="bg-gray-800 p-6 rounded">
          <Line
            data={{
              labels: data.users.signups.map((d) => d.date),
              datasets: [
                {
                  label: "New Signups",
                  data: data.users.signups.map((d) => d.count),
                  borderColor: "#4ade80",
                  backgroundColor: "rgba(74,222,128,0.3)",
                },
              ],
            }}
          />
        </div>
      ) : (
        <p className="text-gray-400">No signup data available</p>
      )}
    </div>
  );
}
