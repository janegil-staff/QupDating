import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return Response.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    // Add like (no validation)
    await User.findByIdAndUpdate(
      decoded.id,
      { $addToSet: { likes: targetUserId } },
      { runValidators: false }
    );

    // Check if THEY liked YOU
    const targetUser = await User.findById(targetUserId);

    const theyLikedMe = targetUser.likes.includes(decoded.id);

    if (theyLikedMe) {
      // Create match for both users
      await User.findByIdAndUpdate(
        decoded.id,
        { $addToSet: { matches: targetUserId } },
        { runValidators: false }
      );

      await User.findByIdAndUpdate(
        targetUserId,
        { $addToSet: { matches: decoded.id } },
        { runValidators: false }
      );

      return Response.json({ match: true });
    }

    return Response.json({ match: false });
  } catch (err) {
    console.error("Like route error:", err);
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
