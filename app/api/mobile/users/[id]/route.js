import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
// Prisma or your DB client

export async function GET(req, { params }) {
  const { id } = params;
  connectDB();
  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  // Fetch user with expoPushToken
  const user = await User.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      profileImage: true,
      expoPushToken: true, // ← important
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
