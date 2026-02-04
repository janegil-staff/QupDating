import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blocked from "@/models/Blocked";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    // Extract token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Load current user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse body
    const { blockedUser } = await req.json();
    if (!blockedUser) {
      return NextResponse.json(
        { error: "Missing blockedUser" },
        { status: 400 }
      );
    }

    // Prevent duplicate blocks
    const alreadyBlocked = await Blocked.findOne({
      blocker: currentUser._id,
      blockedUser,
    });

    if (!alreadyBlocked) {
      await Blocked.create({
        blocker: currentUser._id,
        blockedUser,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Block User API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
