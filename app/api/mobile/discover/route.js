import { NextResponse } from "next/server";
import User from "@/models/User";
import { getMobileUser } from "@/lib/getMobileUser";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    const currentUser = await getMobileUser(req);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = 20;

    const oppositeGender = currentUser.gender === "male" ? "female" : "male";
    const now = new Date();
    const query = {
      _id: { $ne: currentUser._id },
      isBanned: false,
      gender: oppositeGender,
      $nor: [
        { _id: { $in: currentUser.likes } },
        { _id: { $in: currentUser.dislikes } },
        { _id: { $in: currentUser.matches } },
      ],
      $expr: {
        $and: [
          {
            $gte: [
              {
                $divide: [
                  { $subtract: [now, "$birthdate"] },
                  1000 * 60 * 60 * 24 * 365,
                ],
              },
              currentUser.preferredAgeMin || 18,
            ],
          },
          {
            $lte: [
              {
                $divide: [
                  { $subtract: [now, "$birthdate"] },
                  1000 * 60 * 60 * 24 * 365,
                ],
              },
              currentUser.preferredAgeMax || 99,
            ],
          },
        ],
      },
    };

    // ✅ Apply searchScope filter
    if (currentUser.searchScope === "Nearby") {
      query["location.country"] = currentUser.location.country;
    } else if (currentUser.searchScope === "National") {
      query["location.country"] = currentUser.location.country;
      // could expand to include region/state later
    } else if (currentUser.searchScope === "Worldwide") {
      // no restriction
    }

    const users = await User.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .select("_id name birthdate bio profileImage isVerified")
      .lean();

    const nextCursor =
      users.length > 0 ? users[users.length - 1]._id.toString() : null;

    return NextResponse.json({
      users,
      nextCursor,
    });
  } catch (err) {
    console.error("Discover fetch failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
