import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId } = await req.json();
    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { matches: targetObjectId, dislikes: targetObjectId },
    });

    await User.findByIdAndUpdate(targetObjectId, {
      $pull: { matches: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("WEB REMOVE DISLIKE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
