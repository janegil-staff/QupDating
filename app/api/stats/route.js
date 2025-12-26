import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your next-auth options
import User from "@/models/User";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db";
import ProfileView from "@/models/ProfileView";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;

    // Fetch stats
    const newMatches = await User.findById(userId).select("matches");

    const newLikes = await User.countDocuments({
      likes: userId,
    });

    const totalMessages = await Message.countDocuments({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const viewsByUser = await ProfileView.aggregate([
      { $match: { viewedUser: new mongoose.Types.ObjectId(userId) } },
      { $count: "count" },
    ]);

    const profileViews = viewsByUser.length > 0 ? viewsByUser[0].count : 0;
 
    return new Response(
      JSON.stringify({
        profileViews,
        newLikes,
        newMatches: Math.ceil(newMatches.matches.length / 2),
        newMessages: totalMessages,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
