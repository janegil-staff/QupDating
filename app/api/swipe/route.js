import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const { swipedUserId, direction } = await req.json();

    if (!swipedUserId || !direction) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    const currentUser = await User.findById(userId);
    const swipedUser = await User.findById(swipedUserId);

    if (!currentUser || !swipedUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Right swipe logic
    if (direction === "right") {
      // Add swiped user to likes if not already liked
      if (!currentUser.likes.includes(swipedUserId)) {
        currentUser.likes.push(swipedUserId);
      }

      // Check for mutual like → match
      if (swipedUser.likes.includes(userId)) {
        // Add each other to matches
        if (!currentUser.matches.includes(swipedUserId))
          currentUser.matches.push(swipedUserId);
        if (!swipedUser.matches.includes(userId))
          swipedUser.matches.push(userId);
        await swipedUser.save();
      }
    }

    // Save current user
    await currentUser.save();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
