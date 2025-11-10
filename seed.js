
import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

import User from "./models/User.js";
import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect("mongodb+srv://janstovr:fooBar83@cluster0.3dwqjjw.mongodb.net/qup-dating?appName=Cluster0", {
      dbName: "qup-dating",
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}


async function seedUsers() {
  await connectDB();

  const res = await fetch("https://randomuser.me/api/?results=50&inc=name,gender,email,picture,dob");
  const data = await res.json();
 
  const users = data.results.map((u) => ({
    name: `${u.name.first} ${u.name.last}`,
    email: u.email,
    password: "abc123",
    age: u.dob.age,
    gender: u.gender,
    bio: "This is a sample bio for testing.",
    images: [{ url: u.picture.large, public_id: null }],
  }));
 console.log(users);
  await User.insertMany(users);
  console.log("Seeded 50 users ✅");
}

seedUsers();
