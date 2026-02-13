import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * Verify Google access token by calling Google's userinfo endpoint.
 * Returns the user's Google profile data.
 */
async function verifyGoogleToken(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Invalid Google access token");
  }

  return res.json();
  // Returns: { sub, name, given_name, family_name, picture, email, email_verified }
}

export async function POST(req) {
  try {
    await connectDB();

    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Google access token" },
        { status: 400 }
      );
    }

    // 1. Verify the token with Google and get profile data
    let googleProfile;
    try {
      googleProfile = await verifyGoogleToken(accessToken);
    } catch (err) {
      console.error("Google token verification failed:", err);
      return NextResponse.json(
        { error: "Invalid Google token" },
        { status: 401 }
      );
    }

    const googleId = googleProfile.sub;
    const googleEmail = googleProfile.email?.toLowerCase().trim();
    const googleName = googleProfile.name || "";
    const googlePicture = googleProfile.picture || "";

    if (!googleEmail) {
      return NextResponse.json(
        { error: "No email associated with this Google account" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists (by Google ID or email)
    let existingUser = await User.findOne({
      $or: [
        { "google.googleId": googleId },
        { email: googleEmail },
      ],
    });

    if (existingUser) {
      // ── EXISTING USER → LOG IN ──
      if (existingUser.isBanned) {
        return NextResponse.json(
          { error: "Your account has been banned" },
          { status: 403 }
        );
      }

      // Update Google data if not already stored
      if (!existingUser.google?.googleId) {
        existingUser.google = {
          googleId,
          email: googleEmail,
          name: googleName,
          picture: googlePicture,
          isVerified: true,
          verifiedAt: new Date(),
        };
        await existingUser.save();
      }

      const token = jwt.sign(
        { id: existingUser._id.toString(), email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        action: "login",
        token,
        user: {
          _id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      // ── NEW USER → SEND TO REGISTRATION ──
      return NextResponse.json({
        action: "register",
        googleId,
        name: googleName,
        email: googleEmail,
        picture: googlePicture,
      });
    }
  } catch (err) {
    console.error("Google login error:", err);
    return NextResponse.json(
      { error: "Google login failed", details: err.message },
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
