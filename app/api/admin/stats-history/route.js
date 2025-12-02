import User from "@/models/User";
import Match from "@/models/Match";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const daysBack = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  // Signups grouped by day
  const signups = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Matches grouped by day
  const matches = await Match.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return Response.json({ signups, matches });
}
