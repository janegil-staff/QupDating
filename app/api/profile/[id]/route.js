import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req, context) {
  await connectDB();

  try {
    const rawParams = await context.params;
    const id =
      typeof rawParams.id === "object" ? rawParams.id.id : rawParams.id;

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const targetUser = await User.findById(id).lean();
    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let isLiked = false;
    let isMatch = false;

    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).lean();
      if (currentUser?.likes) {
        isLiked = currentUser.likes
          .map((likeId) => likeId.toString())
          .includes(targetUser._id.toString());
      }

      if (targetUser?.likes) {
        const targetLikesCurrent = targetUser.likes
          .map((likeId) => likeId.toString())
          .includes(currentUser._id.toString());

        if (isLiked && targetLikesCurrent) {
          isMatch = true;
        }
      }
    }

    return Response.json({
      ...targetUser,
      isLiked,
      isMatch,
    });
  } catch (err) {
    console.error("❌ Like route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
