// app/api/auth/google/verify/route.js
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

const GOOGLE_CLIENT_IDS = [
  process.env.GOOGLE_WEB_CLIENT_ID,
  process.env.GOOGLE_IOS_CLIENT_ID,
  process.env.GOOGLE_ANDROID_CLIENT_ID,
  process.env.GOOGLE_EXPO_CLIENT_ID,
].filter(Boolean);

const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client();

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, idToken } = body;

    if (!accessToken && !idToken) {
      return NextResponse.json(
        { message: "Missing access token or ID token" },
        { status: 400 }
      );
    }

    let googleUser;

    // ── Strategy 1: Verify ID Token (preferred) ──────
    if (idToken) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_IDS,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new Error("Invalid token payload");
        }
        googleUser = {
          sub: payload.sub,
          email: payload.email,
          name: payload.name || "",
          picture: payload.picture,
        };
      } catch (err) {
        return NextResponse.json(
          { message: "Invalid Google ID token" },
          { status: 401 }
        );
      }
    }
    // ── Strategy 2: Use Access Token to fetch profile ─
    else {
      try {
        const res = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
        );
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        googleUser = {
          sub: data.sub,
          email: data.email,
          name: data.name || "",
          picture: data.picture,
        };
      } catch (err) {
        return NextResponse.json(
          { message: "Invalid Google access token" },
          { status: 401 }
        );
      }
    }

    // ── Find or create user in MongoDB ────────────────
    await connectDB();

    // First try to find by googleId
    let user = await User.findOne({ "google.googleId": googleUser.sub });

    if (!user) {
      // Check if a user with this email already exists
      user = await User.findOne({ email: googleUser.email });

      if (user) {
        // Link Google to existing account
        user.google = {
          googleId: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          isVerified: true,
          verifiedAt: new Date(),
        };
        if (!user.profileImage && googleUser.picture) {
          user.profileImage = googleUser.picture;
        }
        user.lastSeen = new Date();
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: googleUser.name || "User",
          email: googleUser.email,
          profileImage: googleUser.picture || "",
          google: {
            googleId: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            isVerified: true,
            verifiedAt: new Date(),
          },
          lastSeen: new Date(),
        });
      }
    } else {
      // Returning user — update Google profile data & lastSeen
      user.google.name = googleUser.name || user.google.name;
      user.google.picture = googleUser.picture || user.google.picture;
      user.google.email = googleUser.email;
      user.lastSeen = new Date();
      await user.save();
    }

    // ── Issue JWT ──────────────────────────────────────
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        provider: "google",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        provider: "google",
      },
      token,
      message: "Google authentication successful",
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
