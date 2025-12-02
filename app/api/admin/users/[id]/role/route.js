import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req, context) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id } = await context.params;

    const { role } = await req.json();
    console.log(role);
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
