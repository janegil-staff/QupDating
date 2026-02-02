import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

function calculateAge(birthdate) {
  const today = new Date();
  const dob = new Date(birthdate);

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}


export async function PUT(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

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
export async function GET(req) {
  const session = await getServerSession(req, authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();

  // Inject correct age into response
  const age = calculateAge(user.birthdate);

  return NextResponse.json({
    user: {
      ...user,
      age, // override or add correct age
    },
  });
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
