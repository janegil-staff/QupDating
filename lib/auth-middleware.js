import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not found in environment variables');
}

/**
 * Verify JWT token from Authorization header
 * @param {Request} request - Next.js request object
 * @returns {Promise<Object>} - { success, user, error, status }
 */
export async function verifyAuth(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'No authentication token provided',
        status: 401
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return {
          success: false,
          error: 'Token expired',
          code: 'TOKEN_EXPIRED',
          status: 401
        };
      }

      if (err.name === 'JsonWebTokenError') {
        return {
          success: false,
          error: 'Invalid token',
          code: 'INVALID_TOKEN',
          status: 401
        };
      }

      throw err;
    }

    // The decoded token should have userId or id field
    const userId = decoded.userId || decoded.id || decoded.sub;

    console.log('🔍 Decoded token:', decoded);
    console.log('🔍 Extracted userId:', userId);

    if (!userId) {
      return {
        success: false,
        error: 'Invalid token payload',
        code: 'INVALID_PAYLOAD',
        status: 401
      };
    }

    // Connect to database
    await connectDB();

    // Get user from database
    console.log('🔍 Looking up user with ID:', userId);
    const user = await User.findById(userId).select('-password');
    console.log('🔍 User found:', user ? 'YES' : 'NO');

    if (!user) {
      // Try alternative lookup methods
      console.log('⚠️  User not found by _id, checking if User model/collection exists...');
      const userCount = await User.countDocuments();
      console.log('📊 Total users in collection:', userCount);
      
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        status: 401
      };
    }

    // Check if user is active
    if (user.status === 'suspended' || user.status === 'banned') {
      return {
        success: false,
        error: 'Account suspended',
        code: 'ACCOUNT_SUSPENDED',
        status: 403
      };
    }

    // Return user info
    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

  } catch (error) {
    console.error('❌ Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      message: error.message,
      status: 500
    };
  }
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object with _id
 * @returns {string} - JWT token
 */
export function generateToken(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { 
      userId: user._id,
      id: user._id,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
