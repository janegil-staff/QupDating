import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const user = await User.findById(session.user.id).lean();
  return Response.json(user);
}
