import { connectDB } from "@/lib/db";
import User from "@/models/User";

function calculateAge(birthdate) {
  const today = new Date();
  const dob = new Date(birthdate);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  await connectDB();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  const user = await User.findOne({ email }).lean();
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Inject correct age
  const age = calculateAge(user.birthdate);

  return Response.json(
    {
      ...user,
      age, // override or add correct age
    },
    { status: 200 },
  );
}
