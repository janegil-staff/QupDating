import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const userId = id;

    // Find user first so we can access images
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete messages (adjust field names to your schema!)
    await Message.deleteMany({ sender: userId });
    await Message.deleteMany({ receiver: userId });

    // Delete images from Cloudinary
    if (user.images?.length > 0) {
      for (const img of user.images) {
        if (img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error(
              "❌ Failed to delete Cloudinary image:",
              img.public_id,
              err
            );
          }
        }
      }
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "User, messages, and images deleted",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
