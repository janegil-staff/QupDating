// middleware/mobileAuth.js
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function mobileAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
