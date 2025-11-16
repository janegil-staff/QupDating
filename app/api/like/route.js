import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { targetUserId } = await req.json();
  if (!targetUserId) {
    return Response.json({ error: "Missing target user ID" }, { status: 400 });
  }

  const currentUser = await User.findById(session.user.id);
  if (!currentUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const alreadyLiked = currentUser.likes.includes(targetUserId);

  if (alreadyLiked) {
    currentUser.likes.pull(targetUserId);
  } else {
    currentUser.likes.push(targetUserId);
  }

  await currentUser.save();

  return Response.json({ success: true, liked: !alreadyLiked });
}

/*
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { toUserId } = await req.json();
    if (!toUserId) {
      return Response.json({ error: "Missing target user ID" }, { status: 400 });
    }

    const currentUser = await User.findOne({ email: session.user.email });
    const targetUser = await User.findById(toUserId);

    if (!currentUser || !targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser._id.equals(targetUser._id)) {
      return Response.json({ error: "Cannot like your own profile" }, { status: 400 });
    }

    currentUser.likes ??= [];
    currentUser.matches ??= [];
    targetUser.likes ??= [];
    targetUser.matches ??= [];

    const currentUserId = currentUser._id;
    const targetUserId = targetUser._id;

    const alreadyLiked = currentUser.likes.some((id) => id.equals(targetUserId));
    let isMatch = false;
    let action = "";

    if (alreadyLiked) {
      // ❌ Unlike
      currentUser.likes = currentUser.likes.filter((id) => !id.equals(targetUserId));
      currentUser.matches = currentUser.matches.filter((id) => !id.equals(targetUserId));
      targetUser.matches = targetUser.matches.filter((id) => !id.equals(currentUserId));
      action = "unliked";
    } else {
      // ❤️ Like
      currentUser.likes.push(targetUserId);
      action = "liked";

      const mutualLike = targetUser.likes.some((id) => id.equals(currentUserId));
      if (mutualLike) {
        isMatch = true;
        if (!currentUser.matches.some((id) => id.equals(targetUserId))) {
          currentUser.matches.push(targetUserId);
        }
        if (!targetUser.matches.some((id) => id.equals(currentUserId))) {
          targetUser.matches.push(currentUserId);
        }
      }
    }

    await currentUser.save();
    await targetUser.save();

    console.log(`🔁 ${action.toUpperCase()}: ${currentUser.name} → ${targetUser.name}`);
    console.log("🤝 Match status:", isMatch);

    return Response.json({
      success: true,
      action,
      match: isMatch,
    });
  } catch (err) {
    console.error("❌ Like route error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
*/
