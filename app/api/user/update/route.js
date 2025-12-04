import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { profileCompletion } from "@/lib/profileCompletion";

export async function PUT(req) {
  await connectDB();
  const { userId, updates } = await req.json();

  const user = await User.findByIdAndUpdate(userId, updates, { new: true });

  user.profileCompletionPercent = profileCompletion(user);
  await user.save();

  return new Response(JSON.stringify(user), { status: 200 });
}
