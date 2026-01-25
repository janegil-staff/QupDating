import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  connectDB();
  const user = searchParams.get("user");
  const receiver = searchParams.get("receiver");

  if (!user || !receiver) {
    return NextResponse.json(
      { error: "Missing user or receiver" },
      { status: 400 },
    );
  }
  console.log("user, rec". user, receiver);
  await Message.updateMany(
    { sender: user, receiver, read: false },
    { $set: { read: true } },
  );

  const messages = await Message.findMany({
    where: {
      OR: [
        { senderId: user, receiverId: receiver },
        { senderId: receiver, receiverId: user },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ messages });
}
