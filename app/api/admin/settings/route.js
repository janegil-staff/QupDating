// app/api/admin/settings/route.js
import { NextResponse } from "next/server";
import Settings from "@/models/Settings"; // a Mongoose model or Prisma table
import { connectDB } from "@/lib/db";

// PATCH: update settings
export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Upsert settings document (single global settings doc)
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("❌ Failed to save settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}

const defaultSettings = {
  security: { twoFA: false, emailVerification: false, sessionTimeout: 30 },
  users: { defaultRole: "user" },
  moderation: { autoBan: false },
  appearance: { theme: "dark", accentColor: "pink" },
  notifications: { emailEnabled: true, pushEnabled: false },
  integrations: { apiKey: "" },
  privacy: { gdprEnabled: true },
};

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({});
    if (!settings) {
      // create defaults if none exist
      settings = await Settings.create(defaultSettings);
    }
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("❌ Failed to load settings:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Settings.deleteMany({});
    const defaults = await Settings.create(defaultSettings);
    return NextResponse.json({ success: true, settings: defaults });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to reset settings" },
      { status: 500 }
    );
  }
}
