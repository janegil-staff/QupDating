import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // unwrap params
    const { userId } = await req.json();

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const alreadyAttending = event.attendees.includes(userId);

    if (alreadyAttending) {
      // remove RSVP
      event.attendees = event.attendees.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      // add RSVP
      event.attendees.push(userId);
    }

    await event.save();
    // return updated event with attendees populated
    return NextResponse.json(await event.populate("attendees", "name email"));
  } catch (err) {
    console.error("❌ RSVP failed:", err);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}

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
