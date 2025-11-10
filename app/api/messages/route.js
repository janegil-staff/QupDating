import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Message from "@/models/Message";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    await connectDB();
    const currentUser = await User.findOne({ email: session.user.email });

    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name images");

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      content: msg.content,
      sender: msg.sender._id.toString(),
      senderName: msg.sender.name,
      senderImage: msg.sender.images?.[0]?.url || null,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (err) {
    console.error("Message fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const { receiverId, content } = await req.json();

    await connectDB();
    const sender = await User.findOne({ email: session.user.email });

    const message = await Message.create({
      sender: sender._id,
      receiver: receiverId,
      content,
    });

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error("Message send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
