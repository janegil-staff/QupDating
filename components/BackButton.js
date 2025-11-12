"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "← Tilbake" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-block text-sm text-gray-300 hover:text-white bg-gray-800 px-4 py-2 rounded-lg shadow transition"
    >
      {label}
    </button>
  );
}
