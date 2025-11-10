// app/api/like/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";



export async function POST(req) {
    console.log("ENTERING")
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
console.log("PASED SESSIN. SESS", session);
    await connectDB();

    const { toUserId } = await req.json();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
console.log(toUserId);
    // Add to likes
    currentUser.likes.push(toUserId);
    await currentUser.save();

    return NextResponse.json({ success: true, liked: toUserId });
  } catch (err) {
    console.error("Like route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
