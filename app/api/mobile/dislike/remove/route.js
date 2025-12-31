import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req) {
    console.log("ENTERING");
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { targetId } = await req.json();
    if (!targetId) {
      return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
    }

    const userId = decoded.id;
    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    const result = await User.updateOne(
      { _id: userId },
      { $pull: { dislikes: targetObjectId } }
    );

    // For debugging
    console.log("REMOVE DISLIKE result:", result);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Nothing removed (check ids/types)" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("REMOVE DISLIKE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
