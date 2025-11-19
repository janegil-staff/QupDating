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
export async function PUT(req, {params}) {
  const { id } = await params;
  console.log(id);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  console.log(body);
  
  await connectDB();

  const updated = await Event.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}
export async function DELETE(req, { params }) {
  const { id } = await params; // unwrap params properly
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const deleted = await Event.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, id });
}
