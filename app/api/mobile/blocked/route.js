import Blocked from "@/models/Blocked";
import { getUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const blocked = await Blocked.find({ blocker: user._id })
    .populate("blockedUser", "_id name profileImage")
    .lean();

  return Response.json({
    blocked: blocked.map((b) => b.blockedUser),
  });
}
