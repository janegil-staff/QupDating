import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Event from "@/models/Event";
import { connectDB } from "@/lib/db";

export async function GET(req, context) {
  const { params } = await context;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await connectDB();
  const event = await Event.findById(params.id);
  return NextResponse.json(event);
}
export async function PUT(req, context) {
  try {
    await connectDB();
    const body = await req.json();

    const { id } = await context.params; // ✅ unwrap

    const updated = await Event.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Failed to update event:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  const { id } = await params; // unwrap params properly
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const deleted = await Event.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
