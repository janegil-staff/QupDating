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

    const excludeIds = [
      currentUser._id,
      ...currentUser.likes,
      ...currentUser.dislikes,
      ...currentUser.matches,
    ];

    const query = {
      _id: { $nin: excludeIds },
      isBanned: false,
      gender: oppositeGender,
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

    const scope = (currentUser.searchScope || "").toLowerCase();

    if (scope === "nearby" || scope === "national") {
      query["location.country"] = {
        $exists: true,
        $ne: "",
        $ne: null,
        $eq: currentUser.location.country,
      };
    }

    const users = await User.find(query)
      .sort({ _id: -1 })
      .select("_id name birthdate bio profileImage isVerified location")
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
