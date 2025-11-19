import Link from "next/link";

function Card({ title, icon, description, href }) {
  return (
    <Link href={href}>
      <div className="bg-neutral-800 p-6 rounded-xl shadow-md border border-gray-700 hover:border-pink-500 transition cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-pink-500 text-2xl">{icon}</div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </Link>
  );
}

export default Card;