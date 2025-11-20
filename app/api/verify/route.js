import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({
      verifyToken: token,
      verifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyExpires = undefined;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
