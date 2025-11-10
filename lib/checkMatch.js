import {connectDB} from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function isMatched(currentEmail, targetUserId) {
  await connectDB();
  const currentUser = await User.findOne({ email: currentEmail });
  if (!currentUser) return false;

  const targetId = new mongoose.Types.ObjectId(targetUserId);
  return currentUser.matches?.some((id) => id.equals(targetId));
}
