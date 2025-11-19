import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = await params;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const event = await Event.findById(id);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Toggle RSVP: add if not present, remove if already RSVP’d
  const alreadyRSVP = event.attendees.includes(token.id);
  if (alreadyRSVP) {
    event.attendees = event.attendees.filter((uid) => uid.toString() !== token.id);
  } else {
    event.attendees.push(token.id);
  }

  await event.save();
  return NextResponse.json(await event.populate("attendees"));
}
