// scripts/seedEvents.js
import mongoose from "mongoose";
import dotenv from "dotenv";; // adjust path if needed
import { connectDB } from "./lib/db.js";
import Event from "./models/Event.js";

dotenv.config();

async function seed() {
  await connectDB();

  const sampleEvents = [
    {
      title: "Bergen Winter Meetup",
      description: "Join us for a cozy winter gathering in Bergen with hot drinks and networking.",
      date: new Date("2025-12-05"),
      location: "Bryggen, Bergen",
      isApproved: true,
    },
    {
      title: "Norwegian Coding Jam",
      description: "A hackathon for local developers to build Viking‑smooth apps together.",
      date: new Date("2025-12-12"),
      location: "Media City Bergen",
      isApproved: true,
    },
    {
      title: "QupDate Launch Party",
      description: "Celebrate the launch of QupDate with music, food, and community vibes.",
      date: new Date("2026-01-15"),
      location: "USF Verftet, Bergen",
      isApproved: true,
    },
  ];

  try {
    await Event.deleteMany(); // clear old events
    await Event.insertMany(sampleEvents);
    console.log("✅ Sample events seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding events:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
