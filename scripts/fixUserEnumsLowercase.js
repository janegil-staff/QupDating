// scripts/fixUserEnumsLowercase.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../models/User.js"; // adjust path if needed

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not set in environment variables");
  process.exit(1);
}

// Fields to lowercase
const fieldsToLowercase = [
  "smoking",
  "drinking",
  "exercise",
  "diet",
  "relationshipStatus",
  "religion",
  "searchScope",
  "gender",
  "role",
  "lookingFor",
  "bodyType",
  "appearance"
];

async function fixEnumsLowercase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      let changed = false;

      for (const field of fieldsToLowercase) {
        if (user[field] && typeof user[field] === "string") {
          const lower = user[field].toLowerCase();
          if (user[field] !== lower) {
            console.log(
              `Lowercasing ${field} for ${user.email}: "${user[field]}" -> "${lower}"`
            );
            user[field] = lower;
            changed = true;
          }
        }
      }

      if (changed) {
        await user.save({ validateBeforeSave: false });
      }
    }

    console.log("✅ All enum fields converted to lowercase!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing enums:", err);
    process.exit(1);
  }
}

fixEnumsLowercase();
