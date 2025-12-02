// components/admin/AdminSidebar.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/settings", label: "Settings" },
  ];

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !e.target.closest("#sidebar") && !e.target.closest("#menu-btn")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="relative">
      {/* Toggle button (mobile only, upper right) */}
      <div className="fixed top-4 right-4 lg:hidden z-50">
        <button
          id="menu-btn"
          className="p-2 text-white bg-gray-800 rounded-md"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Overlay backdrop for mobile */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"></div>
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`bg-gray-900 lg:static lg:block fixed top-0 left-0 h-full w-64 p-4 z-50 transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="flex flex-col space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setOpen(false)} // auto-close on mobile
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
