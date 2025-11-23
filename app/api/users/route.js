// app/api/users/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  // fetch all users except current user
  const users = await User.find({ _id: { $ne: session.user.id } }).select("name bio profileImage");
  return new Response(JSON.stringify(users), { status: 200, headers: { "Content-Type": "application/json" } });
}
