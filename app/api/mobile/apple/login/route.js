import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Apple's public keys endpoint for token verification
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";

/**
 * Verify Apple's identityToken (a JWT signed by Apple).
 * We fetch Apple's public keys and verify the token against them.
 */
async function verifyAppleToken(identityToken) {
  const jose = await import("jose");

  // Fetch Apple's public key set
  const JWKS = jose.createRemoteJWKSet(new URL(APPLE_KEYS_URL));

  // Verify and decode the token
  const { payload } = await jose.jwtVerify(identityToken, JWKS, {
    issuer: "https://appleid.apple.com",
    audience: process.env.APPLE_BUNDLE_ID, // e.g. "com.yourapp.qup"
  });

  return payload;
}

export async function POST(req) {
  try {
    await connectDB();

    const { identityToken, fullName, email, user: appleUserId } =
      await req.json();

    if (!identityToken || !appleUserId) {
      return NextResponse.json(
        { error: "Missing Apple credentials" },
        { status: 400 }
      );
    }

    // 1. Verify the identity token with Apple
    let applePayload;
    try {
      applePayload = await verifyAppleToken(identityToken);
    } catch (err) {
      console.error("Apple token verification failed:", err);
      return NextResponse.json(
        { error: "Invalid Apple token" },
        { status: 401 }
      );
    }

    const appleEmail = applePayload.email || email;
    const appleSub = applePayload.sub; // Apple's unique user identifier

    // 2. Check if user already exists (by Apple ID or email)
    let existingUser = await User.findOne({
      $or: [
        { "apple.appleUserId": appleSub },
        ...(appleEmail ? [{ email: appleEmail.toLowerCase().trim() }] : []),
      ],
    });

    if (existingUser) {
      // ── EXISTING USER → LOG IN ──
      if (existingUser.isBanned) {
        return NextResponse.json(
          { error: "Your account has been banned" },
          { status: 403 }
        );
      }

      // Update Apple data if not already stored
      if (!existingUser.apple?.appleUserId) {
        existingUser.apple = {
          appleUserId: appleSub,
          email: appleEmail,
          isVerified: true,
          verifiedAt: new Date(),
        };
        await existingUser.save();
      }

      const token = jwt.sign(
        { id: existingUser._id.toString(), email: existingUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.json({
        action: "login",
        token,
        user: {
          _id: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      // ── NEW USER → SEND TO REGISTRATION ──
      const appleName =
        fullName?.givenName && fullName?.familyName
          ? `${fullName.givenName} ${fullName.familyName}`
          : "";

      return NextResponse.json({
        action: "register",
        appleUserId: appleSub,
        name: appleName,
        email: appleEmail || "",
      });
    }
  } catch (err) {
    console.error("Apple login error:", err);
    return NextResponse.json(
      { error: "Apple login failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
