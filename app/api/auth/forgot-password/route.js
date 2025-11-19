import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "No account found with that email" }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Update only reset fields (skip full validation)
    await User.updateOne(
      { _id: user._id },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour
      }
    );

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    // Send email
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset",
        text: `Reset your password here: ${resetUrl}`,
      },
      (err, info) => {
        if (err) {
          console.error("Email error:", err);
        } else {
          console.log("Email sent:", info);
        }
      }
    );

    return NextResponse.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
