import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "./db";


export async function getUserFromRequest(req) {
  await connectDB();

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
