import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const toUserId = searchParams.get("userId");

  if (!session?.user?.id || !toUserId) {
    return NextResponse.json({ isMatched: false });
  }

  const currentUserId = new mongoose.Types.ObjectId(session.user.id);
  const targetUserId = new mongoose.Types.ObjectId(toUserId);

  const [currentUser, targetUser] = await Promise.all([
    User.findById(currentUserId).select("matches"),
    User.findById(targetUserId).select("matches"),
  ]);

  const isMatched =
    currentUser?.matches?.includes(toUserId) &&
    targetUser?.matches?.includes(session.user.id);

  return NextResponse.json({ isMatched: !!isMatched });
}
