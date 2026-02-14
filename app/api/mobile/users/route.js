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

  // 5. Fetch reported and blocked users
  const reports = await Report.find({ reporter: currentUser._id });
  const reportedIds = reports.map((r) => r.reportedUser.toString());

  const reportedByOthers = await Report.find({ reportedUser: currentUser._id });
  const reportedByIds = reportedByOthers.map((r) => r.reporter.toString());

  const blocks = await Blocked.find({ blocker: currentUser._id });
  const blockedIds = blocks.map((b) => b.blockedUser.toString());

  const blockedBy = await Blocked.find({ blockedUser: currentUser._id });
  const blockedByIds = blockedBy.map((b) => b.blocker.toString());

  // 6. Combine all excluded IDs
  const excludedIds = [
    ...(currentUser.likes || []),
    ...(currentUser.dislikes || []),
    ...(currentUser.matches || []),
    ...reportedIds,
    ...reportedByIds,
    ...blockedIds,
    ...blockedByIds,
  ].map((id) => id.toString());

  // 7. Calculate age range as date range
  const now = new Date();

  const maxBirthdate = new Date();
  maxBirthdate.setFullYear(now.getFullYear() - (currentUser.preferredAgeMin || 18));

  const minBirthdate = new Date();
  minBirthdate.setFullYear(now.getFullYear() - (currentUser.preferredAgeMax || 99));

  // 8. Build query
  const query = {
    _id: { $ne: currentUser._id, $nin: excludedIds },
    gender: oppositeGender,
    birthdate: { $gte: minBirthdate, $lte: maxBirthdate },
  };

  // 9. Apply search scope
  if (currentUser.searchScope === "nearby" && currentUser.location?.country) {
    query["location.city"] = currentUser.location.city;
    query["location.country"] = currentUser.location.country;
  } else if (currentUser.searchScope === "national" && currentUser.location?.country) {
    query["location.country"] = currentUser.location.country;
  }

  // 10. Fetch users
  const users = await User.find(query)
    .sort({ _id: -1 })
    .select(
      "name bio profileImage images birthdate gender location occupation education isVerified linkedin apple google height appearance bodyType tags",
    );

  console.log("Current user gender:", currentUser.gender);
  console.log("Query oppositeGender:", oppositeGender);
  console.log("Query:", JSON.stringify(query, null, 2));
  console.log("Users found:", users.length);

  return Response.json(users, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}