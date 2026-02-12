// app/api/mobile/linkedin/status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getMobileUser } from "@/lib/getMobileUser";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      isLinkedInVerified: user.linkedin?.isVerified || false,
      verifiedAt: user.linkedin?.verifiedAt || null,
      linkedinName: user.linkedin?.profileData?.name || null,
    });
  } catch (err) {
    console.error("LinkedIn status error:", err);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
