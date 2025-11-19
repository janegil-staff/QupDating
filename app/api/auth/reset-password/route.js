import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    await connectDB();
    console.log("Incoming token:", token);

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("Matched user:", user);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
