import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  console.log("ENTERING", body);
  const { roomId, content, sender, senderName, senderImage, createdAt, _id } =
    body;

  if (!roomId || !content || !sender || !_id || !createdAt) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
const senderId = mongoose.Types.ObjectId.createFromHexString(sender);
  try {
    const message = await Message.create({
      roomId,
      content,
      sender: senderId,
      senderName,
      senderImage,
      createdAt,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to save message:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  const cursor = searchParams.get("cursor");

  if (!roomId)
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });

  const query = {
    roomId,
    ...(cursor && { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }),
  };

  const messages = await Message.find(query)
    .sort({ _id: 1 })
    .populate("sender")
    .limit(20)
    .lean();

  const nextCursor =
    messages.length === 20
      ? messages[messages.length - 1]._id.toString()
      : null;

  return NextResponse.json({
    messages,
    nextCursor,
    hasMore: messages.length === 20,
  });
}
