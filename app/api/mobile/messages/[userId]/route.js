import { NextResponse } from "next/server";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUserId = decoded.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    const formatted = messages.map((msg) => ({
      _id: msg._id.toString(),
      content: msg.content,
      createdAt: msg.createdAt,
      fromSelf: msg.sender.toString() === currentUserId,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { userId } = await params;
    console.log(userId);
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const currentUserId = decoded.id;

    const body = await req.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      content: message.trim(),
      sender: currentUserId,
      receiver: userId,
    });

    return NextResponse.json({
      message: {
        _id: newMessage._id.toString(),
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        fromSelf: true,
      },
    });
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
