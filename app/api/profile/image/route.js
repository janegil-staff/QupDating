import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { public_id } = await req.json();
  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  await connectDB();

  await cloudinary.uploader.destroy(public_id);

  await User.updateOne(
    { email: session.user.email },
    { $pull: { images: { public_id } } }
  );

  return NextResponse.json({ success: true });
}
