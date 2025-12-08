import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return Response.json({ error: "Not authenticated" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).lean();

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({
      user,
    });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req) {
  const { email, password } = await req.json();

  await connectDB();
  const user = await User.findOne({ email });

  if (!user)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  // ✅ Sign JWT with user id + email
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
