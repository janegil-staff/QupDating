import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Match from "@/models/Match";
import Message from "@/models/Message";
import Event from "@/models/Event";
import Report from "@/models/Report";

export async function GET() {
  try {
    await connectDB();

    const activeUsers = await User.countDocuments({
      lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const newSignups = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const matchesToday = await Match.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const messagesToday = await Message.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });

    const eventsCreated = await Event.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const rsvpsToday = await Event.aggregate([
      { $unwind: "$attendees" },
      {
        $match: {
          "attendees.createdAt": {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      },
      { $count: "count" },
    ]);

    const reportsFiled = await Report.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    // Example engagement metric
    const avgMessagesPerUser = await Message.aggregate([
      { $group: { _id: "$sender", count: { $sum: 1 } } },
      { $group: { _id: null, avg: { $avg: "$count" } } },
    ]);

    const profileCompletion = await User.aggregate([
      {
        $group: {
          _id: null,
          avgCompletion: { $avg: "$profileCompletionPercent" },
        },
      },
    ]);

    // New signups in last 7 days
    const newSignups7d = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Of those, how many logged in again
    const returningUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      lastLogin: { $gte: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }, // adjust window
    });

    const retentionRate =
      newSignups7d > 0 ? Math.round((returningUsers / newSignups7d) * 100) : 0;

    const avgCompletion = profileCompletion[0]?.avgCompletion || 0;
    console.log(rsvpsToday);
    return NextResponse.json({
      success: true,
      stats: {
        activeUsers,
        newSignups,
        matchesToday,
        messagesToday,
        verifiedUsers,
        bannedUsers,
        eventsCreated,
        rsvpsToday: rsvpsToday[0]?.count || 0,
        reportsFiled,
        retentionRate,
        avgMessagesPerUser: avgMessagesPerUser[0]?.avg || 0,
        profileCompletion: profileCompletion[0]?.avgCompletion || 0,
        systemHealth: "OK", // you can wire this to monitoring
      },
    });
  } catch (err) {
    console.error("❌ Failed to load stats:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load stats" },
      { status: 500 }
    );
  }
}
