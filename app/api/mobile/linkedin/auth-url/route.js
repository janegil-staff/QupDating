import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getMobileUser } from "@/lib/getMobileUser";
import { getLinkedInAuthUrl } from "@/lib/linkedin";
import crypto from "crypto";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.linkedin?.isVerified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    const state = Buffer.from(
      JSON.stringify({
        userId: user._id.toString(),
        nonce: crypto.randomBytes(16).toString("hex"),
      })
    ).toString("base64url");

    const url = getLinkedInAuthUrl(state);

    return NextResponse.json({ url, state });
  } catch (err) {
    console.error("LinkedIn auth-url error:", err);
    return NextResponse.json(
      { error: "Failed to generate LinkedIn auth URL" },
      { status: 500 }
    );
  }
}