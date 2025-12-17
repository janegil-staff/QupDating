// scripts/fixUserEnums.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js"; // adjust path if needed

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in environment variables");
  process.exit(1);
}

const enumFields = {
  smoking: { allowed: ["Yes", "No", "Occasionally"], default: "No" },
  drinking: { allowed: ["None", "Light / social drinker", "Heavy"], default: "None" },
  exercise: { allowed: ["Never", "Sometimes", "Regularly", "Daily"], default: "Never" },
  diet: { allowed: ["Vegetarian", "Vegan", "Omnivore", "Other"], default: "Omnivore" },
  relationshipStatus: { allowed: ["Single", "In a relationship", "Married", "Divorced"], default: "Single" },
  religion: { allowed: ["Christian", "Muslim", "Jewish", "Buddhist", "Ateist", "Other"], default: "Other" },
  searchScope: { allowed: ["Nearby", "Regional", "National", "Worldwide"], default: "Worldwide" },
  gender: { allowed: ["male", "female", "other"], default: "other" },
  role: { allowed: ["user", "moderator", "admin", "banned"], default: "user" },
};

async function fixEnums() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      let changed = false;

      for (const [field, { allowed, default: def }] of Object.entries(enumFields)) {
        let val = user[field];

        if (!val || typeof val !== "string") {
          // set default if missing
          user[field] = def;
          changed = true;
          console.log(`Setting missing field ${field} for ${user.email} -> "${def}"`);
          continue;
        }

        // normalize to match allowed values
        const match = allowed.find(v => v.toLowerCase() === val.toLowerCase());
        if (match && val !== match) {
          console.log(`Fixing ${field} for ${user.email}: "${val}" -> "${match}"`);
          user[field] = match;
          changed = true;
        }

        // If value doesn't match any allowed value, set default
        if (!match) {
          console.log(`Invalid value for ${field} for ${user.email}: "${val}". Setting default "${def}"`);
          user[field] = def;
          changed = true;
        }
      }

      if (changed) {
        await user.save({ validateBeforeSave: false });
      }
    }

    console.log("✅ All enum fields normalized!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing enums:", err);
    process.exit(1);
  }
}

fixEnums();
