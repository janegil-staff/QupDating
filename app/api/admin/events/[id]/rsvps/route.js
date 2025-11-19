import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params; // 👈 unwrap params properly

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const event = await Event.findById(id).populate("attendees");

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(event.attendees || []);
}
