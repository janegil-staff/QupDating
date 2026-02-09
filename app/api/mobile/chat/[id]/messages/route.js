import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth-middleware';

/**
 * GET /api/mobile/chat/[userId]/messages
 * Fetch all messages between current user and specified user
 */
export async function GET(request, { params }) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const currentUserId = authResult.user.id;
    const { id: otherUserId } = params;

    // Connect to database
    await connectDB();

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 }) // Oldest first
      .populate('sender', 'name profilePhoto')
      .populate('receiver', 'name profilePhoto')
      .lean();

    console.log(`✅ Loaded ${messages.length} messages for user ${otherUserId}`);

    return NextResponse.json({
      success: true,
      messages: messages,
      count: messages.length
    });

  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
        message: error.message
      },
      { status: 500 }
    );
  }
}
