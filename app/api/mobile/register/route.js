import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User";
import verifyEmailTemplate from "@/lib/emailTemplates/verifyEmail";

export async function POST(req) {
  console.log("ENTERING");
  try {
    const body = await req.json();

    const {
      name,
      email,
      password,
      birthdate,
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
    console.log("preffered age --> ": preferredAge);
    const trimmedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    const existingUser = await User.findOne({ trimmedEmail });
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
      email: trimmedEmail,
      password: hashedPassword,
      gender,
      birthdate: birthdate || null,
      images: images || [],
      profileImage:
        profileImage ||
        (images.length > 0 ? images[0].url : "/images/placeholder.png"),
      isVerified: false,
      verifyToken,
      verifyExpires,
      occupation: occupation || null,
      education: education || null,
      religion: religion || null,
      bodyType: bodyType || null,
      appearance: appearance || null,
      smoking: smoking || undefined,
      drinking: drinking || undefined,
      hasChildren: !!hasChildren,
      wantsChildren: !!wantsChildren,
      relationshipStatus: relationshipStatus || null,
      willingToRelocate: !!willingToRelocate,
      bio: bio || null,
      lookingFor: lookingFor || null,
      location: location || null,
     // preferredAge,
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
    console.error("Error in register route:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
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
    }
  );
}
