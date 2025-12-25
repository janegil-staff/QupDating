// /api/mobile/like/route.js
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();

  const auth = req.headers.get("authorization");
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  await User.findByIdAndUpdate(decoded.id, {
    $addToSet: { likes: targetUserId },
  });

  return Response.json({ success: true });
}
