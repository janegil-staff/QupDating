import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyJWT } from "@/lib/auth"; // your JWT/session verification helper

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const payload = await verifyJWT(token);
      if (payload?.userId) {
        await connectDB();
        await User.findByIdAndUpdate(payload.userId, {
          $set: { lastSeen: new Date() },
        });
      }
    } catch (err) {
      console.error("❌ Middleware auth error:", err);
    }
  }

  return NextResponse.next();
}

// Apply only to API routes (adjust as needed)
export const config = {
  matcher: ["/api/:path*"],
};
