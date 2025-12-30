import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch users I liked
    const user = await User.findById(userId)
      .populate("likes", "name profileImage bio isVerified");

    // Fetch users who liked me
    const likedMeUsers = await User.find(
      { likes: userId },
      "name profileImage bio isVerified"
    );

    return NextResponse.json({
      likedMeUsers,
      likedUsers: user.likes,
    });
  } catch (err) {
    console.error("WEB likes error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
