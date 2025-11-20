import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ verifyToken: token });

    if (!user || user.verifyExpires < Date.now()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyExpires = null;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
