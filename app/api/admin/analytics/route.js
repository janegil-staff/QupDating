import { NextResponse } from "next/server";
import User from "@/models/User";
import Event from "@/models/Event";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const users = await User.countDocuments();
    const active = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 86400000) }, // last 24h
    });
    const events = await Event.countDocuments();
    const messages = await Message.countDocuments();

    const signups = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return NextResponse.json({
      users: { total: users, active, signups: signups.map(s => ({ date: s._id, count: s.count })) },
      events: { total: events },
      messages: { total: messages },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
