import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req, context) {
  await connectDB();

  try {
    const { params } = context;
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(session.user.id);
    const targetUser = await User.findById(resolvedParams.id);

    if (!currentUser || !targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent liking your own profile
    if (currentUser._id.equals(targetUser._id)) {
      return Response.json(
        { error: "Cannot like your own profile" },
        { status: 400 }
      );
    }

    let action;
    let isMatch = false;

    if (currentUser.likes.includes(targetUser._id)) {
      // Unlike
      await User.findByIdAndUpdate(
        currentUser._id,
        { $pull: { likes: targetUser._id } },
        { new: true, validateModifiedOnly: true }
      );
      action = "unliked";
    } else {
      // Like
      await User.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { likes: targetUser._id } },
        { new: true, validateModifiedOnly: true }
      );
      action = "liked";

      // Check if target also liked current user → match
      if (targetUser.likes.includes(currentUser._id)) {
        isMatch = true;
      }
    }

    return Response.json({
      success: true,
      action,
      match: isMatch,
      liked: action === "liked",
    });
  } catch (err) {
    console.error("❌ Like route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
