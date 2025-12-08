import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user, { status: 200 });
}
