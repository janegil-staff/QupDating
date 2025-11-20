"use client";

import Link from "next/link";


export default function VerifiedRedirect() {

  return (
    <div className="text-center text-white py-10 space-y-4">
      <h1 className="text-2xl font-bold text-pink-400">
        Verification complete
      </h1>
      <Link href="/profile">Back to profile</Link>
    </div>
  );
}
