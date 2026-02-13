// app/api/mobile/google/login/route.js
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { accessToken } = await req.json();

    if (!accessToken) {
      return Response.json(
        { error: "Missing Google access token" },
        { status: 400 }
      );
    }

    // ── Fetch Google profile using access token ──
    const googleRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );

    if (!googleRes.ok) {
      return Response.json(
        { error: "Invalid Google access token" },
        { status: 401 }
      );
    }

    const googleUser = await googleRes.json();
    // googleUser = { sub, email, name, picture, ... }

    if (!googleUser.email) {
      return Response.json(
        { error: "Could not retrieve email from Google" },
        { status: 401 }
      );
    }

    // ── Check if user exists by Google ID ──
    let user = await User.findOne({ "google.googleId": googleUser.sub });

    // ── Or check by email ──
    if (!user) {
      user = await User.findOne({ email: googleUser.email });
    }

    // ── Existing user → login ──
    if (user) {
      if (user.isBanned) {
        return Response.json(
          { error: "Your account has been banned" },
          { status: 403 }
        );
      }

      // Link Google if not already linked
      if (!user.google?.googleId) {
        user.google = {
          googleId: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          isVerified: true,
          verifiedAt: new Date(),
        };
      }

      user.lastSeen = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return Response.json({
        action: "login",
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      });
    }

    // ── New user → send to registration ──
    return Response.json({
      action: "register",
      googleId: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name || "",
      picture: googleUser.picture || "",
    });
  } catch (err) {
    console.error("Google login error:", err);
    return Response.json(
      { error: "Google sign-in failed" },
      { status: 500 }
    );
  }
}
