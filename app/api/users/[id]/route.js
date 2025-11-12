import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const user = await User.findById(id).populate("matches").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
