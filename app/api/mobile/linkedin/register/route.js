import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      linkedinId,
      linkedinName,
      linkedinEmail,
      linkedinPicture,
      linkedinGivenName,
      linkedinFamilyName,
      // Required professional fields from form
      name,
      gender,
      birthdate,
      jobTitle,
      company,
      industry,
      educationLevel,
      images,
    } = body;

    if (!linkedinId || !linkedinEmail) {
      return NextResponse.json(
        { error: "LinkedIn data is required" },
        { status: 400 }
      );
    }

    if (!gender || !birthdate || !jobTitle || !company || !industry || !educationLevel) {
      return NextResponse.json(
        { error: "All professional fields are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = linkedinEmail.toLowerCase().trim();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: trimmedEmail },
        { "linkedin.linkedinId": linkedinId },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "duplicate", message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create user without password (LinkedIn-only account)
    // Generate a random password hash so the password field isn't empty
    const randomPassword = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      isVerified: true,
      name: name || linkedinName || "",
      email: trimmedEmail,
      password: randomPassword, // Not usable for login — LinkedIn only
      gender: gender || null,
      birthdate: birthdate || null,
      jobTitle: jobTitle || "",
      company: company || "",
      industry: industry || "",
      educationLevel: educationLevel || "",
      isVerified: true, // Email verified via LinkedIn
      images: Array.isArray(images) ? images : [],
      profileImage: linkedinPicture || (Array.isArray(images) && images.length > 0 ? images[0].url : ""),
      linkedin: {
        isVerified: true,
        verifiedAt: new Date(),
        linkedinId: linkedinId,
        profileData: {
          name: linkedinName,
          email: linkedinEmail,
          picture: linkedinPicture,
          givenName: linkedinGivenName,
          familyName: linkedinFamilyName,
        },
      },
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Account created with LinkedIn",
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("LinkedIn register error:", err);
    return NextResponse.json(
      { error: "Registration failed", details: err.message },
      { status: 500 }
    );
  }
}
