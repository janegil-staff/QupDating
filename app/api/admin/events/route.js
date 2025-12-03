import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();
    // Fetch all events, sorted by date
    const events = await Event.find().sort({ date: 1 });
    return NextResponse.json(events);
  } catch (err) {
    console.error("❌ Failed to fetch events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    // Validate required fields
    if (
      !body.title ||
      !body.date ||
      !body.location?.lat ||
      !body.location?.lng
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title: body.title,
      description: body.description,
      date: body.date,
      location: {
        lat: body.location.lat,
        lng: body.location.lng,
        name: body.location.name,
        country: body.location.country,
      },
      createdBy: body.userId,
    });

    return NextResponse.json(event);
  } catch (err) {
    console.error("❌ Failed to create event:", err);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
