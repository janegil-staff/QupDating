import { NextResponse } from "next/server";
import crypto from "crypto";
import { getLinkedInLoginAuthUrl } from "@/lib/linkedin";

export async function GET() {
  try {
    const nonce = crypto.randomBytes(16).toString("hex");
    const state = `login_${nonce}`;
    const url = getLinkedInLoginAuthUrl(state);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("LinkedIn login auth-url error:", err);
    return NextResponse.json(
      { error: "Failed to generate LinkedIn URL" },
      { status: 500 }
    );
  }
}
