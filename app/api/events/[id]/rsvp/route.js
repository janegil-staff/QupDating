import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId } = await req.json();

    const event = await Event.findById(id);
    if (!event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const already = event.attendees.includes(userId);
    if (already) {
      event.attendees = event.attendees.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      event.attendees.push(userId);
    }

    await event.save();
    return NextResponse.json(await event.populate("attendees"));
  } catch (err) {
    console.error("❌ RSVP failed:", err);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 }); // upcoming first
    return NextResponse.json(events);
  } catch (err) {
    console.error("❌ Failed to fetch events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
