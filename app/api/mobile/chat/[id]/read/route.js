import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

export async function POST(req, { params }) {

  try {
    await connectDB();
    const p = await params;
    const otherUserId = await p.id;

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.id;

    // ⭐ Mark unread messages as read
    const updated = await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      { $set: { read: true } },
    );
    return NextResponse.json({
      success: true,
      updated: updated.modifiedCount,
    });
  } catch (err) {
    console.error("Clear badge error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
