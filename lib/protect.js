// lib/protect.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function protect() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  return session;
}
