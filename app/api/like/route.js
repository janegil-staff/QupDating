// app/api/like/route.js
import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { toUserId } = await req.json();

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(toUserId);

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add to likes
    if (!currentUser.likes.includes(toUserId)) {
      currentUser.likes.push(toUserId);
    }

    // Check for mutual like
    if (targetUser.likes.includes(currentUser._id)) {
      // Add to matches for both
      if (!currentUser.matches.includes(toUserId)) {
        currentUser.matches.push(toUserId);
      }
      if (!targetUser.matches.includes(currentUser._id)) {
        targetUser.matches.push(currentUser._id);
      }
      await targetUser.save();
    }

    await currentUser.save();

    return NextResponse.json({
      success: true,
      liked: toUserId,
      match: targetUser.likes.includes(currentUser._id),
    });
  } catch (err) {
    console.error("Like route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
