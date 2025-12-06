import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail";
import verifyEmailTemplate from "@/lib/emailTemplates/verifyEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "User already verified" },
        { status: 400 }
      );
    }

    // 🔹 Generate new token
    const token = crypto.randomBytes(32).toString("hex");
    user.verifyToken = token;
    user.verifyExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h
    user.isVerified = true;
    await user.save();

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile/${user._id}`;
    const html = verifyEmailTemplate({ name: user.name, verifyUrl });

    await sendEmail({
      to: user.email,
      subject: "Resend: Verify your QupDate profile",
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
