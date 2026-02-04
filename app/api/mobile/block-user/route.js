import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blocked from "@/models/Blocked";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Extract token
    const rawAuth = req.headers.get("authorization") || "";
    const token = rawAuth.replace("Bearer", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 3. Load current user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Parse body
    const body = await req.json();
    const { blockedUser } = body;

    if (!blockedUser) {
      return NextResponse.json(
        { error: "Missing blockedUser" },
        { status: 400 },
      );
    }

    // 5. Prevent duplicates
    const exists = await Blocked.findOne({
      blocker: currentUser._id,
      blockedUser,
    });

    if (!exists) {
      await Blocked.create({
        blocker: currentUser._id,
        blockedUser,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Block user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
