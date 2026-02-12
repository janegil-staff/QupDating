export const runtime = "nodejs";

import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import Blocked from "@/models/Blocked";
import Report from "@/models/Report";

export async function GET(req) {
  await connectDB();

  // 1. Extract and sanitize token
  const rawAuth = req.headers.get("authorization") || "";
  const token = rawAuth.replace("Bearer", "").trim();

  if (!token) {
    return Response.json({ error: "Missing token" }, { status: 401 });
  }

  // 2. Verify JWT
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  // 3. Load current user
  const currentUser = await User.findById(decoded.id).lean();
  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // 4. Determine opposite gender
  const oppositeGender = currentUser.gender === "male" ? "female" : "male";

  const now = new Date();
  // Fetch reported users
  const reports = await Report.find({ reporter: currentUser._id });
  const reportedIds = reports.map((r) => r.reportedUser.toString());

  // Users who reported the current user
  const reportedByOthers = await Report.find({ reportedUser: currentUser._id });
  const reportedByIds = reportedByOthers.map((r) => r.reporter.toString());

  // Users the current user has blocked
  const blocks = await Blocked.find({ blocker: currentUser._id });
  const blockedIds = blocks.map((b) => b.blockedUser.toString());

  // Users who blocked the current user
  const blockedBy = await Blocked.find({ blockedUser: currentUser._id });
  const blockedByIds = blockedBy.map((b) => b.blocker.toString());

  // 5. Build query
  const query = {
    _id: { $ne: currentUser._id },
    gender: oppositeGender,
    $nor: [
      { _id: { $in: currentUser.likes } },
      { _id: { $in: currentUser.dislikes } },
      { _id: { $in: currentUser.matches } },
      { _id: { $in: reportedIds } },
      { _id: { $in: reportedByIds } },
      { _id: { $in: blockedIds } },
      { _id: { $in: blockedByIds } },
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

  // 6. Apply search scope
  if (currentUser.searchScope === "nearby") {
    query["location.country"] = currentUser.location.country;
  } else if (currentUser.searchScope === "national") {
    query["location.country"] = currentUser.location.country;
  }

  // 7. Fetch users
  const users = await User.find(query)
    .sort({ _id: -1 })
    .select("name bio profileImage isVerified linkedin");

  return Response.json(users, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
