// app/api/mobile/apple/register/route.js
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const {
      appleUserId,
      email,
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

    if (!appleUserId) {
      return Response.json(
        { error: "Missing Apple user ID" },
        { status: 400 }
      );
    }

    // ── Check for duplicate ──
    const query = [{ "apple.appleUserId": appleUserId }];
    if (email) query.push({ email });

    const existing = await User.findOne({ $or: query });

    if (existing) {
      return Response.json({ error: "duplicate" }, { status: 409 });
    }

    // ── Create user ──
    const user = await User.create({
      name: name || "User",
      email: email || `apple_${appleUserId}@privaterelay.appleid.com`,
      gender,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      occupation,
      company,
      industry,
      education,
      bio,
      images: images || [],
      profileImage: images?.length > 0 ? images[0].url : "",
      apple: {
        appleUserId,
        email: email || "",
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
    console.error("Apple register error:", err);
    return Response.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
