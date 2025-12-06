// app/api/users/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { withCORS, corsOptions } from "@/lib/cors";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const oppositeGender = currentUser.gender === "male" ? "female" : "male";

  const now = new Date();

  const query = {
    _id: {
      $ne: currentUser._id,
    },
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
    .select("name bio profileImage");

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function OPTIONS() {
  return corsOptions();
}