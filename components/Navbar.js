"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/matches", label: "Matches", icon: "💖" },
    { href: "/discover", label: "Discover", icon: "🔍" },
    { href: "/profile/edit", label: "Edit", icon: "✏️" },
    ...(session?.user?.id
      ? [{ href: `/profile/${session.user.id}`, label: "Profile", icon: "👤" }]
      : []),
  ];

  const pathname = usePathname();

  if (status !== "authenticated") return null;

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* 🖥️ Desktop Top Navbar */}
      <nav className="hidden sm:flex bg-neutral-950 text-white px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <Link href="/dashboard" className="text-xl font-bold text-pink-500">
            QupDate
          </Link>

          <div className="flex gap-6 text-sm">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-pink-400 ${
                  isActive(href) ? "text-pink-500" : "text-gray-300"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-300">Hi, {session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 text-white sm:hidden z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                isActive(href) ? "text-pink-500" : "text-gray-400"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex flex-col items-center text-xs text-gray-400 hover:text-red-500"
          >
            <span className="text-lg">🚪</span>
            <span>Log out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
