import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req, context) {
  await connectDB();

  try {
    const rawParams = await context.params;
    const id = typeof rawParams.id === "object" ? rawParams.id.id : rawParams.id;

    console.log("Final ID:", id);

    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const targetUser = await User.findById(id).lean();
    if (!targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    let isLiked = false;

    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).lean();
      if (currentUser?.likes) {
        isLiked = currentUser.likes
          .map((likeId) => likeId.toString())
          .includes(targetUser._id.toString());
      }
    }

    return Response.json({
      ...targetUser,
      isLiked,
    });
  } catch (err) {
    console.error("❌ Like route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}