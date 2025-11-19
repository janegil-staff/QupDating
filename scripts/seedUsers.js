import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

async function seed() {
  await connectDB();

  const users = [
    {
      email: "anna@norway.com",
      password: "hashedpassword",
      name: "Anna",
      gender: "female",
      location: { lat: 60.39, lng: 5.32, name: "Bergen, Norway", country: "Norway" },
      searchScope: "Nearby",
    },
    {
      email: "erik@sweden.com",
      password: "hashedpassword",
      name: "Erik",
      gender: "male",
      location: { lat: 59.33, lng: 18.06, name: "Stockholm, Sweden", country: "Sweden" },
      searchScope: "National",
    },
    {
      email: "lucy@usa.com",
      password: "hashedpassword",
      name: "Lucy",
      gender: "female",
      location: { lat: 40.71, lng: -74.00, name: "New York, USA", country: "USA" },
      searchScope: "Worldwide",
    },
  ];

  await User.insertMany(users);
  console.log("Seeded test users ✅");
  process.exit();
}

seed();
