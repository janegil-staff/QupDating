import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("FORM DATA", formData);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const birthDay = parseInt(formData.get("birthDay"));
    const birthMonth = parseInt(formData.get("birthMonth"));
    const birthYear = parseInt(formData.get("birthYear"));
    const gender = formData.get("gender");
    const imagesRaw = formData.get("images");

    const birthdate = new Date(birthYear, birthMonth, birthDay);

    const images = imagesRaw ? JSON.parse(imagesRaw) : [];

    const hashedPassword = await bcrypt.hash(password, 10);

    await connectDB();
    console.log(
      "Profile image:",
      images.length > 0 ? images[0].url : "/images/placeholder.png"
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      birthdate,
      gender,
      images,
      profileImage:
        images.length > 0 ? images[0].url : "/images/placeholder.png",
    });

    console.log(
      "Profile image:",
      images.length > 0 ? images[0].url : "/images/placeholder.png"
    );

    console.log("User created:", user);
    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
