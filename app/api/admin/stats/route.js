import User from "@/models/User";
import Match from "@/models/Match";
import Message from "@/models/Message";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeUsers = await User.countDocuments({ updatedAt: { $gte: today } });
  const newSignups = await User.countDocuments({ createdAt: { $gte: today } });
  const matchesToday = await Match.countDocuments({ createdAt: { $gte: today } });
  const messagesToday = await Message.countDocuments({ createdAt: { $gte: today } });

  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const unverifiedUsers = await User.countDocuments({ isVerified: false });
  const bannedUsers = await User.countDocuments({ isBanned: true });

  return Response.json({
    activeUsers,
    newSignups,
    matchesToday,
    messagesToday,
    verifiedUsers,
    unverifiedUsers,
    bannedUsers,
  });
}
