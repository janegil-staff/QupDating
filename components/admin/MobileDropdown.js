"use client";
import { useState } from "react";
import Link from "next/link";

export default function MobileDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded bg-gray-800 text-yellow-400 shadow"
      >
        ☰ Menu
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
          <Link
            href="/admin/users"
            className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            Users
          </Link>
          <Link
            href="/admin/events"
            className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            Events
          </Link>
          <Link
            href="/admin/settings"
            className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </div>
      )}
    </div>
  );
}
