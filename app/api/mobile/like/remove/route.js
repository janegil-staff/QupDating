import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    // Auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { targetId } = await req.json();
    if (!targetId) {
      return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
    }

    const userId = decoded.id;
    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    // 1️⃣ Remove match (both sides)
    await User.findByIdAndUpdate(userId, {
      $pull: { matches: targetObjectId },
    });

    await User.findByIdAndUpdate(targetObjectId, {
      $pull: { matches: userId },
    });

    // 2️⃣ Remove like
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { likes: targetObjectId } }
    );

    console.log("REMOVE LIKE result:", result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REMOVE LIKE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
