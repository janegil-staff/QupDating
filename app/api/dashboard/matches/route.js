import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Match from "@/models/Match";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    if (!user || !user.matches?.length) {
      return NextResponse.json({ matches: [] }, { status: 200 });
    }

    const matchDocs = await Match.find({ _id: { $in: user.matches } });
    return NextResponse.json({ matches: matchDocs }, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to fetch matches:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
