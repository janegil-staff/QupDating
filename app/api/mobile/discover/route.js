import { NextResponse } from "next/server";
import User from "@/models/User";
import { getMobileUser } from "@/lib/getMobileUser";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    const user = await getMobileUser(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 20;

    const query = {
      _id: { $ne: user._id },
      isBanned: false,
    };

    if (cursor) {
      query._id = { ...query._id, $lt: cursor };
    }

    const users = await User.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .select("_id name birthdate bio profileImage isVerified")
      .lean();

    return NextResponse.json({
      users,
      nextCursor: users.length ? users[users.length - 1]._id : null,
    });
  } catch (err) {
    console.error("Discover fetch failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
