// scripts/seedSettings.js
import mongoose from "mongoose";
import Settings from "../models/Settings.js";   // adjust relative path
import { connectDB } from "../lib/db.js";           // your DB connection helper

const defaultSettings = {
  security: { twoFA: false, emailVerification: false, sessionTimeout: 30 },
  users: { defaultRole: "user" },
  moderation: { autoBan: false },
  appearance: { theme: "dark", accentColor: "pink" },
  notifications: { emailEnabled: true, pushEnabled: false },
  integrations: { apiKey: "" },
  privacy: { gdprEnabled: true },
};

async function seed() {
  try {
    await connectDB();

    // Clear existing settings if you want a fresh start
    await Settings.deleteMany({});

    // Insert defaults
    const settings = await Settings.create(defaultSettings);

    console.log("✅ Seeded settings:", settings);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed settings:", err);
    process.exit(1);
  }
}

seed();
