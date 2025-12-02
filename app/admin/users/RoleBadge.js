export function RoleBadge({ role }) {
  const colors = {
    user: "bg-gray-600 text-white",
    moderator: "bg-blue-600 text-white",
    admin: "bg-yellow-500 text-black",
    banned: "bg-red-600 text-white",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[role]}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}
