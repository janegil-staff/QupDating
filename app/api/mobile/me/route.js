import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    // 1. Auth check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Connect DB
    await connectDB();

    // 3. Parse body
    const body = await req.json();

    // 4. Build update object
    const updateData = {};
    if (body.profileImage) {
      updateData.profileImage = body.profileImage;
    }

    // If images provided, append instead of overwrite
    if (body.images && Array.isArray(body.images)) {
      await User.findByIdAndUpdate(
        decoded.id,
        { $push: { images: { $each: body.images } } }, // ✅ append new images
        { new: true }
      );
    }

    // 5. Update other fields if needed
    Object.keys(body).forEach((key) => {
      if (key !== "images" && key !== "profileImage") {
        updateData[key] = body[key];
      }
    });

    // 6. Apply other updates
    const user = await User.findByIdAndUpdate(decoded.id, updateData, {
      new: true,
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Could not update user", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader)
    return Response.json({ error: "Not authenticated" }, { status: 401 });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await User.findById(decoded.id).lean();

    if (!user)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({
      user,
    });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req) {
  const { email, password } = await req.json();

  await connectDB();
  const user = await User.findOne({ email });

  if (!user)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return Response.json({ error: "Invalid credentials" }, { status: 401 });

  // ✅ Sign JWT with user id + email
  const token = jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return Response.json({
    token,
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  });
}

export async function PATCH(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return Response.json({ error: "Not authenticated" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const body = await req.json();

    const user = await User.findByIdAndUpdate(decoded.id, body, {
      new: true,
    }).lean();
    return Response.json(user);
  } catch {
    return Response.json({ error: "Couldnt patch user" }, { status: 401 });
  }
}
