import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    console.log(id);
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optional: remove sensitive fields
    delete user.password;
    delete user.__v;

    return NextResponse.json({ user });
  } catch (err) {
    console.error("❌ Profile fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
