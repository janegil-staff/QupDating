"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Toggle button in top-right (mobile only) */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded bg-gray-800 text-yellow-400"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-64 bg-gray-900 text-gray-100 shadow-lg transform transition-transform duration-300 z-40
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-800" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-800" onClick={() => setOpen(false)}>
            Users
          </Link>
          <Link href="/admin/events" className="block px-3 py-2 rounded hover:bg-gray-800" onClick={() => setOpen(false)}>
            Events
          </Link>
          <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-800" onClick={() => setOpen(false)}>
            Settings
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
        />
      )}
    </>
  );
}
