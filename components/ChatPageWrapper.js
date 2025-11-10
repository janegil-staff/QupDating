import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isMatched } from "@/lib/checkMatch";
import { redirect } from "next/navigation";

export default async function ChatPageWrapper({ params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const matched = await isMatched(session.user.email, params.userId);
  if (!matched) {
    redirect("/discover");
  }

  return <ClientChat userId={params.userId} />;
}
