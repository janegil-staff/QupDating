import { getServerSession } from "next-auth";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();
  if (!targetUserId) {
    return NextResponse.json({ error: "Missing toUserId" }, { status: 400 });
  }

  await connectDB();
  const fromUser = await User.findOne({ email: session.user.email });

  // You can store dislikes in a separate array on the user
  await User.updateOne(
    { _id: fromUser._id },
    { $addToSet: { dislikes: targetUserId } }
  );

  return NextResponse.json({ success: true });
}
