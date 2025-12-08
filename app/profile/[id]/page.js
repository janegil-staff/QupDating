// app/profile/[id]/page.js
import DeleteProfileButton from "@/components/DeleteProfileButton";
import PublicProfile from "@/components/PublicProfile";
import TrackProfileView from "@/components/TrackProfileView";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function ProfilePage({ params }) {
  await connectDB();
  const {id} = await params;

  const user = await User.findById(id).lean();

  return (
    <>
      <TrackProfileView viewedUserId={user._id.toString()} />
      <PublicProfile userId={user._id.toString()} />      
    </>
  );
}
