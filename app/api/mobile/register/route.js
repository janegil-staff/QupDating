import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User";
import verifyEmailTemplate from "@/lib/emailTemplates/verifyEmail";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, gender, birthdate, images } = body;

    const trimmedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    const existingUser = await User.findOne({ trimmedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "duplicate",
          message:
            "An account with this email already exists. Try logging in instead.",
        },
        { status: 409 },
      );
    }

    // 🔹 Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = Date.now() + 1000 * 60 * 60 * 24; // 24h

    const user = await User.create({
      name: name || "",
      email: trimmedEmail || "",
      password: hashedPassword,
      gender: gender || null,
      birthdate: birthdate || null,
      verifyToken,
      verifyExpires,
      images: Array.isArray(images) ? images : [],
      profileImage:
        Array.isArray(images) && images.length > 0 ? images[0].url : "",
    });

    // 🔹 Send verification email
    /*
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
      */
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return NextResponse.json(
      { message: "User registered successfully", user, token },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error in register route:", err);
    return NextResponse.json(
      { error: "duplicate", details: err.message },
      { status: 500 },
    );
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
    },
  );
}
