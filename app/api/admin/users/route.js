import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 50;

  await connectDB();
  const users = await User.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments();

  return NextResponse.json({
    users,
    total,
    hasMore: page * limit < total,
  });
}


// PATCH ban/unban user
export async function PATCH(req) {
  try {
    const { userId, isBanned } = await req.json();
    await connectDB();

    await User.updateOne({ _id: userId }, { isBanned });
    return NextResponse.json({
      message: `User ${isBanned ? "banned" : "unbanned"} successfully`,
    });
  } catch (err) {
    console.error("Admin PATCH user error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
