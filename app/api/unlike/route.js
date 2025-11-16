import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDB();

  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return Response.json(
        { error: "Invalid target user ID" },
        { status: 400 }
      );
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Remove like
    currentUser.likes = currentUser.likes.filter(
      (id) => id.toString() !== targetUserId
    );

    // Check mutual like status
    const targetLikesCurrent = targetUser.likes
      .map((id) => id.toString())
      .includes(currentUserId.toString());

    const currentLikesTarget = currentUser.likes
      .map((id) => id.toString())
      .includes(targetUserId.toString());

    const stillMatched = targetLikesCurrent && currentLikesTarget;

    // Remove match if mutual like is broken
    if (!stillMatched) {
      currentUser.matches = currentUser.matches.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.matches = targetUser.matches.filter(
        (id) => id.toString() !== currentUserId
      );
    }

    await currentUser.save();
    await targetUser.save();

    console.log("💔 Match removed:", !stillMatched);

    return Response.json({ success: true, unmatched: !stillMatched });
  } catch (err) {
    console.error("❌ Unlike route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
