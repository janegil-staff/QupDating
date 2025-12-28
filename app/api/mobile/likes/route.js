import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    // Read Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    
    // Decode JWT (same secret as NextAuth)
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user + liked users
    const me = await User.findById(decoded.id).populate(
      "likes",
      "_id name profileImage birthdate bio isVerified"
    );

    return NextResponse.json({
      users: me.likes || [],
    });
  } catch (err) {
    console.error("GET /mobile/likes error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
