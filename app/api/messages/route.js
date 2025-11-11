import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
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

  try {
    const message = await Message.create({
      roomId,
      content,
      sender,
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
  await connectDB(); // ✅ ensure await
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
