import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  // ✅ Issue JWT
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
