import { NextResponse } from "next/server";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  // Only show approved events to public
  const events = await Event.find({ isApproved: true }).populate("attendees");
  return NextResponse.json(events);
}
