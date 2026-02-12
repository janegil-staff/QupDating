import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id).populate(
      "matches",
      "name profileImage bio isVerified linkedin"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ⭐ FIX: Build a normal array, not responses
    const results = await Promise.all(
      user.matches.map(async (match) => {
        const unreadCount = await Message.countDocuments({
          sender: match._id,
          receiver: user._id,
          read: false,
        });

        return {
          ...match.toObject(),
          unreadCount,
        };
      })
    );

    return NextResponse.json({ matches: results });
  } catch (err) {
    console.error("Matches error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
