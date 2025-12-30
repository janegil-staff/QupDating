import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // People I liked
    const me = await User.findById(decoded.id).populate(
      "likes",
      "_id name profileImage birthdate bio isVerified"
    );

    // People who liked me
    const likedMeUsers = await User.find({
      likes: decoded.id,
    }).select("_id name profileImage birthdate bio isVerified");

    return NextResponse.json({
      likedUsers: me.likes || [],
      likedMeUsers,
    });
  } catch (err) {
    console.error("GET /mobile/likes error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
