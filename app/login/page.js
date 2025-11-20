// /app/login/page.js
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <div className="p-6 max-w-md mx-auto text-white">
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>

    </div>
  );
}
