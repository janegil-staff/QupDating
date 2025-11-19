import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  await connectDB();

  // get the logged-in user from NextAuth
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // find current user and populate matches
    const user = await User.findById(session.user.id)
      .populate("matches", "name profileImage age location bio tags");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ matches: user.matches });
  } catch (err) {
    console.error("Error fetching matches:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
