import { getServerSession } from "next-auth";
import Match from "@/models/Match";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Find matches containing this user
  const matches = await Match.find({ users: currentUser._id })
    .populate("users", "name age bio images")
    .lean();

  return NextResponse.json({ matches });
}
