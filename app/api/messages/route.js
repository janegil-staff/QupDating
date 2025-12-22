import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  console.log(body);
  const { roomId, content, sender, receiver, images } = body;

  if (!roomId || !sender || !receiver) {
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
      receiver,
      images,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .populate("sender")
      .populate("receiver")
      .lean();
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
