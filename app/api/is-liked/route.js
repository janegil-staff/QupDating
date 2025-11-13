import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("target");

    if (!session?.user?.email || !targetId) {
      return Response.json({ isLiked: false, isMutual: false });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(targetId);

    if (!currentUser || !targetUser) {
      return Response.json({ isLiked: false, isMutual: false });
    }

    const currentUserId = currentUser._id.toString();
    const targetUserId = targetUser._id.toString();

    const isLiked = currentUser.likes?.some((id) => id.toString() === targetUserId);
    const isMutual = targetUser.likes?.some((id) => id.toString() === currentUserId);

    return Response.json({ isLiked, isMutual });
  } catch (err) {
    console.error("❌ is-liked route error:", err);
    return Response.json({ isLiked: false, isMutual: false });
  }
}
