export default function StatWidget({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
