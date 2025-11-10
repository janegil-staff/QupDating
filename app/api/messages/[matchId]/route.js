import connectDB from "@/lib/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const messages = await Message.find({ matchId: params.matchId })
    .populate("sender", "name")
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ messages });
}
