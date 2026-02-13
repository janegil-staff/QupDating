// app/api/mobile/google/register/route.js
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const {
      googleId,
      email,
      picture,
      name,
      gender,
      birthdate,
      occupation,
      company,
      industry,
      education,
      bio,
      images,
    } = await req.json();

    if (!googleId || !email) {
      return Response.json(
        { error: "Missing Google ID or email" },
        { status: 400 }
      );
    }

    // ── Check for duplicate ──
    const existing = await User.findOne({
      $or: [{ email }, { "google.googleId": googleId }],
    });

    if (existing) {
      return Response.json({ error: "duplicate" }, { status: 409 });
    }

    // ── Create user ──
    const user = await User.create({
      name,
      email,
      gender,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      occupation,
      company,
      industry,
      education,
      bio,
      images: images || [],
      profileImage: picture || (images?.length > 0 ? images[0].url : ""),
      google: {
        googleId,
        email,
        name,
        picture,
        isVerified: true,
        verifiedAt: new Date(),
      },
      lastSeen: new Date(),
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json({
      token,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Google register error:", err);
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
