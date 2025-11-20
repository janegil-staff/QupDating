import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <Suspense fallback={<p>Loading verification screen…</p>}>
        <VerifyClient />
      </Suspense>
    </div>
  );
}
