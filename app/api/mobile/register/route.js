import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User";
import verifyEmailTemplate from "@/lib/emailTemplates/verifyEmail";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      email: rawEmail,
      password,
      birthDay,
      birthMonth,
      birthYear,
      gender,
      images = [],
      occupation,
      education,
      religion,
      bodyType,
      appearance,
      smoking,
      drinking,
      hasChildren,
      wantsChildren,
      relationshipStatus,
      willingToRelocate,
      bio,
      lookingFor,
      location,
      profileImage,
      preferredAge,
    } = body;

    const email = rawEmail.toLowerCase().trim();
    const birthdate = new Date(birthYear, birthMonth - 1, birthDay);
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already registered" }, { status: 400 });
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
      profileImage: profileImage || (images.length > 0 ? images[0].url : "/images/placeholder.png"),
      isVerified: false,
      verifyToken,
      verifyExpires,
      occupation,
      education,
      religion,
      bodyType,
      appearance,
      smoking,
      drinking,
      hasChildren,
      wantsChildren,
      relationshipStatus,
      willingToRelocate,
      bio,
      lookingFor,
      location,
      preferredAge,
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

    return NextResponse.json(
      { message: "User registered", user },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error("Error parsing JSON:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
