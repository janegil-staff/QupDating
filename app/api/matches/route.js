import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

// GET /api/matches?userId=123
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const scope = currentUser.searchScope || "Worldwide";
    const location = currentUser.location;

    let query = {};

    if (scope === "Nearby") {
      // Entire country filter (requires storing country in profile)
      query["location.country"] = location.country;
    } else if (scope === "Regional") {
      // Radius ~200km
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          },
          $maxDistance: 200000, // 200 km
        },
      };
    } else if (scope === "National") {
      // Same country filter
      query["location.country"] = location.country;
    } else if (scope === "Worldwide") {
      // No location filter → all users
    }

    // Exclude self
    query._id = { $ne: currentUser._id };

    const matches = await User.find(query).limit(50); // limit for performance
    return NextResponse.json({ matches });
  } catch (err) {
    console.error("Match query error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
