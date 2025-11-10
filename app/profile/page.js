import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ProfilePage from "./ProfilePage";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div className="text-white p-6">Du må logge inn for å se profilen din.</div>;
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  return <ProfilePage user={JSON.parse(JSON.stringify(user))} />;
}
