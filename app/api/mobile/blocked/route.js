import Blocked from "@/models/Blocked";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUSerFromRequest";

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
