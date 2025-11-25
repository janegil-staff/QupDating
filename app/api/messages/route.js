import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const {
    roomId,
    content,
    sender,
    receiver,
    images,
    senderName,
    senderImage,
    createdAt,
    _id,
  } = body;

  if (!roomId || !sender || !_id) {
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
      receiver,
      sender: senderId,
      images,
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

  let messages = await Message.find(query)
    .sort({ _id: -1 }) // fetch newest first
    .limit(20)
    .populate("sender")
    .lean();

  const nextCursor =
    messages.length === 20
      ? messages[messages.length - 1]._id.toString()
      : null;

  // reverse so UI sees oldest → newest
  messages = messages.reverse();

  return NextResponse.json({
    messages,
    nextCursor,
    hasMore: messages.length === 20,
  });
}
