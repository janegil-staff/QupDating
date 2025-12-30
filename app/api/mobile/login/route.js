import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  console.log("SIGNING WITH:", process.env.JWT_SECRET);
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  if (user.isBanned) {
    throw new Error("Your account has been banned");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  // ✅ Ensure secret exists
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return Response.json({
    token,
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  });
}
