import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
 
  await connectDB();
  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(user, { status: 200 });
}
