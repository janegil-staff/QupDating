import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail"; // 🔹 You'll need to implement this
import verifyEmailTemplate from "@/lib/emailTemplates/verifyEmail";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const rawEmail = formData.get("email");
    const password = formData.get("password");
    const birthDay = parseInt(formData.get("birthDay"));
    const birthMonth = parseInt(formData.get("birthMonth"));
    const birthYear = parseInt(formData.get("birthYear"));
    const gender = formData.get("gender");
    const imagesRaw = formData.get("images");

    const email = rawEmail.toLowerCase().trim(); // ✅ normalize
    const birthdate = new Date(birthYear, birthMonth, birthDay);
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    // 🔹 Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      birthdate,
      gender,
      images,
      profileImage:
        images.length > 0 ? images[0].url : "/images/placeholder.png",
      isVerified: false,
      verifyToken,
      verifyExpires,
    });

    // 🔹 Send verification email
    const verifyUrl = `https://qup.dating/verify?token=${verifyToken}`;

    const html = verifyEmailTemplate({ name, verifyUrl });
    try {
      await sendEmail({
        to: email,
        subject: "Verify your QupDate profile",
        html,
      });
    } catch (err) {
      console.warn("Email send failed:", err.message);
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
