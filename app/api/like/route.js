import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { toUserId } = await req.json();
    if (!toUserId) {
      return NextResponse.json({ error: "Missing target user ID" }, { status: 400 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(toUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Init arrays to avoid undefined
    currentUser.likes ??= [];
    currentUser.matches ??= [];
    targetUser.likes ??= [];
    targetUser.matches ??= [];

    const currentUserId = new mongoose.Types.ObjectId(currentUser._id);
    const targetUserId = new mongoose.Types.ObjectId(toUserId);

    // ✅ Add to likes if not already there
    if (!currentUser.likes.some((id) => id.equals(targetUserId))) {
      currentUser.likes.push(targetUserId);
    }

    await currentUser.save();

    // ✅ Refetch target user (get most recent state)
    const freshTargetUser = await User.findById(toUserId);

    const mutualLike = freshTargetUser.likes.some((id) => id.equals(currentUserId));
    let isMatch = false;

    if (mutualLike) {
      isMatch = true;

      // ✅ Ensure both users have each other in matches
      if (!currentUser.matches.some((id) => id.equals(targetUserId))) {
        currentUser.matches.push(targetUserId);
      }

      if (!freshTargetUser.matches.some((id) => id.equals(currentUserId))) {
        freshTargetUser.matches.push(currentUserId);
      }

      // ✅ Save both after a match
      await freshTargetUser.save();
      await currentUser.save();
    } else {
      // ✅ Still save currentUser (like-only case)
      await currentUser.save();
    }

    // 🧩 Clean logging
    console.log("✅ Like registered:", currentUser.name, "→", targetUser.name);
    console.log("🤝 Match status:", isMatch);
    console.log("❤️ CurrentUser.likes:", currentUser.likes.map((id) => id.toString()));
    console.log("❤️ TargetUser.likes:", freshTargetUser.likes.map((id) => id.toString()));
    console.log("🧩 CurrentUser.matches:", currentUser.matches.map((id) => id.toString()));
    console.log("🧩 TargetUser.matches:", freshTargetUser.matches.map((id) => id.toString()));

    return NextResponse.json({
      success: true,
      liked: toUserId,
      match: isMatch,
    });
  } catch (err) {
    console.error("❌ Like route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
