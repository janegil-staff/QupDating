import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const age = parseInt(formData.get("age"));
    const gender = formData.get("gender");
    const imagesRaw = formData.get("images");

    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    console.log("Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      images, // ✅ full array of { url, public_id }
    });
    console.log("User created:", user);
    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
