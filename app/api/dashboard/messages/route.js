import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
  }

  try {
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch messages:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
