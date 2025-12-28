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
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const { targetUserId } = await req.json();
    if (!targetUserId) {
      return Response.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        $pull: { likes: targetUserId },
        $addToSet: { dislikes: targetUserId }
      },
      { new: true }
    );
    console.log("updated user", updatedUser);
    return Response.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Mobile dislike error:", err);
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
