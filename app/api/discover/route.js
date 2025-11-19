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

    // Base query
    const query = {
      _id: {
        $ne: currentUser._id,
        ...(cursor && { $lt: new mongoose.Types.ObjectId(cursor) }),
      },
      gender: oppositeGender,
      $nor: [
        { _id: { $in: currentUser.likes } },
        { _id: { $in: currentUser.dislikes } },
        { _id: { $in: currentUser.matches } },
      ],
    };

    // ✅ Apply searchScope filter
    if (currentUser.searchScope === "Nearby") {
      query["location.country"] = currentUser.location.country;
    } else if (currentUser.searchScope === "National") {
      query["location.country"] = currentUser.location.country;
      // could expand to include region/state later
    } else if (currentUser.searchScope === "Worldwide") {
      // no restriction
    }

    const users = await User.find(query)
      .sort({ _id: -1 })
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
