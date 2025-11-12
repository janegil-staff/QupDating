import { NextResponse } from "next/server";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const oppositeGender = currentUser.gender === "male" ? "female" : "male";

    const query = {
      _id: {
        $ne: currentUser._id,
        ...(cursor && { $lt: new mongoose.Types.ObjectId(cursor) }), // ✅ use $lt for descending
      },
      gender: oppositeGender,
      $nor: [
        { _id: { $in: currentUser.likes } },
        { _id: { $in: currentUser.dislikes } },
        { _id: { $in: currentUser.matches } },
      ],
    };

    const users = await User.find(query)
      .sort({ _id: -1 }) // ✅ sort newest first by _id
      .limit(20)
      .lean();

    const nextCursor =
      users.length > 0 ? users[users.length - 1]._id.toString() : null;

    return NextResponse.json({ users, nextCursor });
  } catch (err) {
    console.error("Discover route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
