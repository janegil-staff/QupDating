import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import { verifyAuth } from '@/lib/auth-middleware';

/**
 * POST /api/mobile/chat/[userId]/read
 * Mark all messages from specified user as read
 */
export async function POST(request, { params }) {
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

    // Update all unread messages from otherUser to currentUser
    const result = await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false
      },
      {
        $set: { 
          read: true, 
          readAt: new Date() 
        }
      }
    );

    console.log(`✅ Marked ${result.modifiedCount} messages as read`);

    return NextResponse.json({
      success: true,
      markedAsRead: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to mark messages as read',
        message: error.message
      },
      { status: 500 }
    );
  }
}
