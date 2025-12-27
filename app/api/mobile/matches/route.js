import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    await connectDB(); // 🔥 ensure DB is connected

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 🔥 Load the logged‑in user
    const user = await User.findById(decoded.id).populate(
      "matches",
      "name profileImage bio isVerified"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      matches: user.matches || [],
    });
  } catch (err) {
    console.error("Matches error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
