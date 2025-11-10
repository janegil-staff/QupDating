// app/api/discover/route.js
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email }).lean();
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Defensive defaults
    const likedIds = currentUser.likes || [];
    const dislikedIds = currentUser.dislikes || [];

    // Opposite gender filter
    let oppositeGender;
    if (currentUser.gender === "male") oppositeGender = "female";
    else if (currentUser.gender === "female") oppositeGender = "male";
    else oppositeGender = { $ne: currentUser.gender };

    const users = await User.find({
      _id: { $ne: currentUser._id, $nin: [...likedIds, ...dislikedIds] },
      gender: oppositeGender,
    })
      .select("name age bio images gender")
      .sort({ createdAt: -1 }) 
      .lean();

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Discover error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
