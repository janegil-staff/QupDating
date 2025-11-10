import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/connectDB";
import Message from "@/models/Message";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { matchId, text } = await req.json();
  if (!matchId || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();
  const sender = await User.findOne({ email: session.user.email });

  const message = await Message.create({
    matchId,
    sender: sender._id,
    text,
  });

  return NextResponse.json({ success: true, message });
}
