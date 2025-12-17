import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "./db";

export async function getMobileUser(req) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) return null;

    const token = auth.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return null;

    const user = await User.findById(decoded.id);
    return user || null;
  } catch (err) {
    console.error("Mobile auth failed:", err.message);
    return null;
  }
}
