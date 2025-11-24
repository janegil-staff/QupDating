import { getServerSession } from "next-auth";
import { isMatched } from "@/lib/checkMatch";
import { redirect } from "next/navigation";
import ClientChat from "./ClientChat";
import { authOptions } from "@/lib/auth";


export default async function ChatPage({ params }) {
  const { userId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const matched = await isMatched(session.user.email, userId);
  if (!matched) {
    redirect("/discover");
  }

  const roomId =
    session.user.id && userId
      ? [session.user.id, userId].sort().join("-")
      : null;

  return <ClientChat userId={userId} />;

}
