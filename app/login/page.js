// /app/login/page.js
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <div className="p-6 mx-auto  bg-neutral-950 text-white">
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>

    </div>
  );
}
