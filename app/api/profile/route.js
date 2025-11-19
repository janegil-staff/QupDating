import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function PUT(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Incoming profile payload:", body);
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          ...body,
          location: {
            name: body.location?.name,
            lat: body.location?.lat,
            lng: body.location?.lng,
            country: body.location?.country, // ✅ save country
          },
        },
      },
      { new: true }
    );

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
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
