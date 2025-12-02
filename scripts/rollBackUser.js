import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // adjust path if needed

dotenv.config();

async function connectDB() {
  await mongoose.connect("mongodb+srv://janstovr:fooBar83@cluster0.3dwqjjw.mongodb.net/qup-dating?appName=Cluster0");
}

// --- CHECK ---
async function checkUsers() {
  const countLastSeenNever = await User.countDocuments({ lastSeen: "Never" });
  const countLastSeenNull = await User.countDocuments({ lastSeen: null });
  const countMissingProfileImage = await User.countDocuments({
    $or: [{ profileImage: { $exists: false } }, { profileImage: "" }],
  });
  const countDefaultProfileImage = await User.countDocuments({
    profileImage: "/images/default-profile.png",
  });
  const countEmptyGender = await User.countDocuments({ gender: "" });

  console.log("🔎 Safety Check:");
  console.log(`- Users with lastSeen = "Never": ${countLastSeenNever}`);
  console.log(`- Users with lastSeen = null: ${countLastSeenNull}`);
  console.log(`- Users missing profileImage: ${countMissingProfileImage}`);
  console.log(`- Users with default profileImage: ${countDefaultProfileImage}`);
  console.log(`- Users with empty gender: ${countEmptyGender}`);
}

// --- MIGRATE ---
async function migrateUsers() {
  const res1 = await User.updateMany(
    { lastSeen: "Never" },
    { $set: { lastSeen: null } }
  );
  console.log(`✅ Updated ${res1.modifiedCount} users with lastSeen = "Never" → null`);

  const res2 = await User.updateMany(
    { $or: [{ profileImage: { $exists: false } }, { profileImage: "" }] },
    { $set: { profileImage: "/images/default-profile.png" } }
  );
  console.log(`✅ Updated ${res2.modifiedCount} users missing profileImage`);

  const res3 = await User.updateMany(
    { gender: "" },
    { $unset: { gender: "" } }
  );
  console.log(`✅ Cleaned ${res3.modifiedCount} users with empty gender`);
}

// --- ROLLBACK ---
async function rollbackUsers() {
  // Rollback to null instead of "Never" (since schema is Date)
  const res1 = await User.updateMany(
    { lastSeen: { $type: "string" } },
    { $set: { lastSeen: null } }
  );
  console.log(`🔄 Reset ${res1.modifiedCount} users with string lastSeen back to null`);

  const res2 = await User.updateMany(
    { profileImage: "/images/default-profile.png" },
    { $set: { profileImage: "" } }
  );
  console.log(`🔄 Cleared ${res2.modifiedCount} users with default profileImage`);

  const res3 = await User.updateMany(
    { gender: { $exists: false } },
    { $set: { gender: "" } }
  );
  console.log(`🔄 Restored ${res3.modifiedCount} users with empty gender`);
}

// --- MAIN ---
async function run() {
  await connectDB();

  const mode = process.argv[2]; // e.g. "check", "migrate", "rollback"
  if (!mode) {
    console.error("❌ Please provide a mode: check | migrate | rollback");
    process.exit(1);
  }

  if (mode === "check") await checkUsers();
  else if (mode === "migrate") await migrateUsers();
  else if (mode === "rollback") await rollbackUsers();
  else console.error("❌ Unknown mode. Use: check | migrate | rollback");

  await mongoose.disconnect();
  console.log("🎉 Done!");
}

run();
