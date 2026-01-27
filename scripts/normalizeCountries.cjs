require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const countries = require("i18n-iso-countries");
const { default: User } = require("../models/User");
const { normalizeCountry } = require("../utils/normalizeCountry");

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/no.json"));

const MONGO_URI = process.env.MONGODB_URI;
console.log(MONGO_URI);
async function runMigration() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("Fetching users...");
    const users = await User.find({}, { location: 1 });

    let updatedCount = 0;

    for (const user of users) {
      const raw = user.location?.country;

      if (!raw) continue;

      const iso = normalizeCountry(raw);

      if (!iso) {
        console.log(`⚠️ Could not normalize: ${raw} (user ${user._id})`);
        continue;
      }

      if (iso === raw) continue; // already normalized

      await User.updateOne(
        { _id: user._id },
        { $set: { "location.country": iso } },
      );

      console.log(`✔ Updated ${raw} → ${iso} for user ${user._id}`);
      updatedCount++;
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
