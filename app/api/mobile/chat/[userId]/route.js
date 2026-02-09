import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";

export async function GET(req, { params }) {
  await connectDB();

  const otherUserId = params.id; // or params.otherUserId depending on folder name

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
    { $set: { read: true } }
  );


  // ⭐ Fetch full conversation
  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId },
    ],
  }).sort({ createdAt: 1 });

  return NextResponse.json({ messages });
}


export async function POST(req, { params }) {
  await connectDB();
  const { id } = await params;

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const body = await req.json();

  const message = await Message.create({
    sender: decoded.id,
    receiver: id,
    text: body.text,
  });

  // 🔥 Emit real‑time event
  global.io?.to(id).emit("new_message", message);

  return NextResponse.json({ message });
}
