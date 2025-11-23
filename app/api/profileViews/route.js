import { connectDB } from "@/lib/db";
import ProfileView from "@/models/ProfileView";

export async function POST(req) {
  await connectDB();
  const { viewerId, viewedUserId } = await req.json();

  try {
    await ProfileView.updateOne(
      { viewer: viewerId, viewedUser: viewedUserId },
      { $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error creating profile view:", err);
    return Response.json({ error: "Failed to create profile view" }, { status: 500 });
  }
}
