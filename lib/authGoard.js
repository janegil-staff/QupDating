import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { session };
}

export async function requireGuest() {
  const session = await getServerSession(authOptions);
  if (session) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }
  return { session: null };
}
