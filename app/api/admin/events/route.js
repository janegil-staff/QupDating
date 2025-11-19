import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const events = await Event.find({});
  return NextResponse.json(events);
}



export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  await connectDB();

  try {
    const newEvent = await Event.create({
      title: body.title,
      description: body.description,
      date: body.date,
      location: body.location,
      attendees: [],
      createdBy: token.id, // admin creating event
      isApproved: true,    // auto-approved since admin created it
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
