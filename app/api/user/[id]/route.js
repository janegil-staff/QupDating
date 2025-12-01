import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";

export async function DELETE(req, context) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id } = await context.params;
    const userId = id;
    console.log(userId);
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await Message.deleteMany({ userId });

    return NextResponse.json({
      success: true,
      message: "User profile and all messages deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
