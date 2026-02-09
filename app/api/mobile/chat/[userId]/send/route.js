import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth-middleware";

/**
 * POST /api/mobile/chat/[userId]/send
 * Send a message to specified user
 */
export async function POST(request, context) {
  try {
    // Next.js 15+ - params might be a promise
    const params = await Promise.resolve(context.params);

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status },
      );
    }

    const currentUserId = authResult.user.id;
    const { userId: otherUserId } = params;

    // Parse request body
    const body = await request.json();
    const { content, images = [] } = body;

    // Validate input
    if (!content && (!images || images.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: "Message must contain either text or images",
        },
        { status: 400 },
      );
    }

    // Connect to database
    await connectDB();

    // Validate receiver exists
    const receiver = await User.findById(otherUserId);
    if (!receiver) {
      return NextResponse.json(
        { success: false, error: "Recipient not found" },
        { status: 404 },
      );
    }

    // Transform images: convert URL strings to objects if needed
    const imageObjects = images.map((img) => {
      // If already an object with url, keep it
      if (typeof img === "object" && img.url) {
        return img;
      }
      // If it's a string URL, convert to object
      if (typeof img === "string") {
        return {
          url: img,
          public_id: "", // Empty since we don't have it from mobile
        };
      }
      return img;
    });

    // Create new message
    const message = new Message({
      sender: currentUserId,
      receiver: otherUserId,
      content: content || "",
      images: imageObjects,
      read: false,
      createdAt: new Date(),
    });

    await message.save();

    // Populate sender/receiver info before returning
    await message.populate("sender", "name profilePhoto");
    await message.populate("receiver", "name profilePhoto");

    console.log(`✅ Message sent from ${currentUserId} to ${otherUserId}`);

    // TODO: Send push notification to receiver
    // TODO: Emit real-time event (if using Socket.io or similar)

    return NextResponse.json(
      {
        success: true,
        message: message,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
