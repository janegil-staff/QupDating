import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterPage from "./RegisterPage";

export default async function Register() {
  const session = await getServerSession(authOptions);

  // If user is logged in, redirect them away from register
  if (session) {
    redirect("/profile/edit"); // or wherever you want them to land
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
      <RegisterPage />
    </div>
  );
}
