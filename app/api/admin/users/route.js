import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
