import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions); // ✅ App Router style
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  return NextResponse.json({ user });
}

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI);
}

export async function POST(req) {
  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    // Parse request body
    const body = await req.json();
    const { name, age, gender, bio, images } = body;

    // Update user profile
    await User.updateOne(
      { email: session.user.email },
      { name, age, gender, bio, images }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Profile update error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { name, age, gender, bio, images, profileImage } = body;

  await User.findByIdAndUpdate(userId, {
    name,
    age,
    gender,
    bio,
    images,
    profileImage,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
