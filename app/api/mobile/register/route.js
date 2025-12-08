import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User";
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
    const occupation = formData.get("occupation");
    const education = formData.get("education");
    const religion = formData.get("religion");
    const bodyType = formData.get("bodyType");
    const appearance = formData.get("appearance");
    const smoking = formData.get("smoking");
    const drinking = formData.get("drinking");
    const hasChildren = formData.get("hasChildren");
    const wantsChildren = formData.get("wantsChildren");
    const relationshipStatus = formData.get("relationshipStatus");
    const willingToRelocate = formData.get("willingToRelocate");
    const bio = formData.get("bio");
    const lookingFor = formData.get("lookingFor");
    const location = JSON.parse(formData.get("location"));
    const profileImage = formData.get("profileImage");
    const preferredAge = formData.get("preferredAge");

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    // 🔹 Generate verification tssoken
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
    });
    console.log("USER -->", user);
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
      { message: "User registered" },
      { user },
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
    console.error("Error parsing formData:", err);
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
