import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profile/edit");
  }
  
  return (
    <div className="p-6 mx-auto  bg-neutral-950 text-white">
      <Suspense fallback={null}>
        <LoginClient />
      </Suspense>
    </div>
  );
}
