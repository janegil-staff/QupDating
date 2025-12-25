import User from "@/models/User";
import Message from "@/models/Message";
import ProfileView from "@/models/ProfileView";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    const userId = decoded.id;

    const user = await User.findById(userId).select("matches");

    const newLikes = await User.countDocuments({ likes: userId });

    const totalMessages = await Message.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const viewsByUser = await ProfileView.aggregate([
      { $match: { viewedUser: new mongoose.Types.ObjectId(userId) } },
      { $count: "count" },
    ]);

    const profileViews = viewsByUser[0]?.count || 0;

    return new Response(
      JSON.stringify({
        profileViews,
        newLikes,
        newMatches: user.matches.length,
        newMessages: totalMessages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
    });
  }
}
