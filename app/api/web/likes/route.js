import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const me = await User.findById(session.user.id)
      .populate("likes", "_id name profileImage birthdate bio isVerified")
      .populate("dislikes", "_id name profileImage birthdate bio isVerified");

    if (!me) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedMeUsers = await User.find({
      likes: session.user.id,
    }).select("_id name profileImage birthdate bio isVerified");

    return NextResponse.json({
      likedUsers: me.likes || [],
      likedMeUsers,
      dislikedUsers: me.dislikes || [],
    });
  } catch (err) {
    console.error("WEB LIKES ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
