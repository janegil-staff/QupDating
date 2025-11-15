;

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function PUT(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const update = {
      name: body.name,
      birthdate: body.birthdate,
      gender: body.gender?.toLowerCase(),
      bio: body.bio,
      images: body.images,
      profileImage: body.profileImage,
      appearance: body.appearance,
      height: parseInt(body.height) || null,
      bodyType: body.bodyType,
      hasChildren: body.hasChildren === true || body.hasChildren === "true",
      wantsChildren: body.wantsChildren === true || body.wantsChildren === "true",
      smoking: body.smoking,
      drinking: body.drinking,
      tags: Array.isArray(body.tags) ? body.tags : body.tags?.split(" ").filter(Boolean),
      location: body.location,
      lookingFor: body.lookingFor,
      religion: body.religion,
      education: body.education,
      occupation: body.occupation,
      willingToRelocate: body.willingToRelocate === true || body.willingToRelocate === "true",
      relationshipStatus: body.relationshipStatus,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true }
    );
    console.log(updatedUser);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

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
/*
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { name, age, gender, bio, images, profileImage, birthdate } = body;

  await User.findByIdAndUpdate(userId, {
    name,
    age,
    gender,
    bio,
    images,
    birthdate,
    profileImage,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
*/
