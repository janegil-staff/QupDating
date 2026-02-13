// app/api/auth/apple/verify/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;
const APPLE_BUNDLE_ID = process.env.APPLE_BUNDLE_ID;

// Apple's JWKS endpoint for verifying identity tokens
const appleJwksClient = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getAppleSigningKey(header) {
  return new Promise((resolve, reject) => {
    appleJwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) return reject(err);
      const signingKey = key.getPublicKey();
      resolve(signingKey);
    });
  });
}

async function verifyAppleToken(identityToken) {
  const decoded = jwt.decode(identityToken, { complete: true });
  if (!decoded || !decoded.header) {
    throw new Error("Unable to decode Apple identity token");
  }

  const signingKey = await getAppleSigningKey(decoded.header);

  return new Promise((resolve, reject) => {
    jwt.verify(
      identityToken,
      signingKey,
      {
        algorithms: ["RS256"],
        issuer: "https://appleid.apple.com",
        audience: APPLE_BUNDLE_ID,
      },
      (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      }
    );
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { identityToken, authorizationCode, fullName, email } = body;

    if (!identityToken) {
      return NextResponse.json(
        { message: "Missing Apple identity token" },
        { status: 400 }
      );
    }

    // ── Verify the identity token with Apple ──────────
    let applePayload;
    try {
      applePayload = await verifyAppleToken(identityToken);
    } catch (err) {
      console.error("Apple token verification failed:", err);
      return NextResponse.json(
        { message: "Invalid Apple identity token" },
        { status: 401 }
      );
    }

    const appleUserId = applePayload.sub;
    const userEmail = applePayload.email || email;

    // Build name from the fullName object Apple sends (only on first sign-in)
    let userName = "";
    if (fullName) {
      const parts = [fullName.givenName, fullName.familyName].filter(Boolean);
      if (parts.length > 0) {
        userName = parts.join(" ");
      }
    }

    // ── Find or create user in MongoDB ────────────────
    await connectDB();

    // First try to find by appleUserId
    let user = await User.findOne({ "apple.appleUserId": appleUserId });

    if (!user) {
      // Check if a user with this email already exists
      if (userEmail) {
        user = await User.findOne({ email: userEmail });
      }

      if (user) {
        // Link Apple to existing account
        user.apple = {
          appleUserId,
          email: userEmail || user.email,
          isVerified: true,
          verifiedAt: new Date(),
        };
        // Update name only if Apple sent one and user has a placeholder
        if (userName && (!user.name || user.name === "User")) {
          user.name = userName;
        }
        user.lastSeen = new Date();
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: userName || "User",
          email: userEmail || `apple_${appleUserId}@privaterelay.appleid.com`,
          apple: {
            appleUserId,
            email: userEmail,
            isVerified: true,
            verifiedAt: new Date(),
          },
          lastSeen: new Date(),
        });
      }
    } else {
      // Returning user — update name if Apple sent it and we don't have a real one
      if (userName && (!user.name || user.name === "User")) {
        user.name = userName;
      }
      user.lastSeen = new Date();
      await user.save();
    }

    // ── Issue JWT ──────────────────────────────────────
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        provider: "apple",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        provider: "apple",
      },
      token,
      message: "Apple authentication successful",
    });
  } catch (error) {
    console.error("Apple auth error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
