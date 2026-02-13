// app/api/mobile/apple/login/route.js
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

// Apple's JWKS endpoint
const appleJwks = jwksClient({
  jwksUri: "https://appleid.apple.com/auth/keys",
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getAppleSigningKey(kid) {
  return new Promise((resolve, reject) => {
    appleJwks.getSigningKey(kid, (err, key) => {
      if (err) return reject(err);
      resolve(key.getPublicKey());
    });
  });
}

async function verifyAppleToken(identityToken) {
  const decoded = jwt.decode(identityToken, { complete: true });
  if (!decoded || !decoded.header) {
    throw new Error("Unable to decode Apple identity token");
  }

  const signingKey = await getAppleSigningKey(decoded.header.kid);

  return new Promise((resolve, reject) => {
    jwt.verify(
      identityToken,
      signingKey,
      {
        algorithms: ["RS256"],
        issuer: "https://appleid.apple.com",
        // audience: process.env.APPLE_BUNDLE_ID, // Uncomment if you want strict audience check
      },
      (err, payload) => {
        if (err) return reject(err);
        resolve(payload);
      }
    );
  });
}

export async function POST(req) {
  try {
    await connectDB();
    const { identityToken, authorizationCode, fullName, email, user: appleUserId } =
      await req.json();

    if (!identityToken) {
      return Response.json(
        { error: "Missing Apple identity token" },
        { status: 400 }
      );
    }

    // ── Verify the identity token with Apple ──
    let applePayload;
    try {
      applePayload = await verifyAppleToken(identityToken);
    } catch (err) {
      console.error("Apple token verification failed:", err);
      return Response.json(
        { error: "Invalid Apple identity token" },
        { status: 401 }
      );
    }

    const verifiedAppleUserId = applePayload.sub;
    const verifiedEmail = applePayload.email || email;

    // Build name from fullName (Apple only sends this on first sign-in)
    let userName = "";
    if (fullName) {
      const parts = [fullName.givenName, fullName.familyName].filter(Boolean);
      if (parts.length > 0) {
        userName = parts.join(" ");
      }
    }

    // ── Check if user exists by Apple ID ──
    let user = await User.findOne({
      "apple.appleUserId": verifiedAppleUserId,
    });

    // ── Or check by email ──
    if (!user && verifiedEmail) {
      user = await User.findOne({ email: verifiedEmail });
    }

    // ── Existing user → login ──
    if (user) {
      if (user.isBanned) {
        return Response.json(
          { error: "Your account has been banned" },
          { status: 403 }
        );
      }

      // Link Apple if not already linked
      if (!user.apple?.appleUserId) {
        user.apple = {
          appleUserId: verifiedAppleUserId,
          email: verifiedEmail || user.email,
          isVerified: true,
          verifiedAt: new Date(),
        };
      }

      // Update name if Apple sent it and user doesn't have a real one
      if (userName && (!user.name || user.name === "User")) {
        user.name = userName;
      }

      user.lastSeen = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return Response.json({
        action: "login",
        token,
        user: {
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
      });
    }

    // ── New user → send to registration ──
    return Response.json({
      action: "register",
      appleUserId: verifiedAppleUserId,
      email: verifiedEmail || "",
      name: userName,
    });
  } catch (err) {
    console.error("Apple login error:", err);
    return Response.json(
      { error: "Apple sign-in failed" },
      { status: 500 }
    );
  }
}
