import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import User from "./models/User";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return;

  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI);
  }

  const user = await User.findOne({ email: token.email });

  // If profile incomplete, redirect to setup
  if (user && (!user.name || user.images.length === 0)) {
    return Response.redirect(new URL("/profile-setup", req.url));
  }
}
