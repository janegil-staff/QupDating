// /api/mobile/dislike/route.js
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    // 1. Read Authorization header
    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
 
    // 2. Parse body
    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return Response.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    // 3. Update user: add to "dislikedUsers"
    await User.findByIdAndUpdate(
      decoded.id,
      { $addToSet: { dislikes: targetUserId } },
      { new: true }
    );
   
    return Response.json({ success: true });
  } catch (err) {
    console.error("Mobile dislike error:", err);
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
