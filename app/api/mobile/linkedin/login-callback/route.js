import { NextResponse } from "next/server";
import { exchangeCodeForToken, getLinkedInProfile } from "@/lib/linkedin";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `qupdating://linkedin-login-callback?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        "qupdating://linkedin-login-callback?error=no_code"
      );
    }

    // Exchange code for token (isLogin = true)
    const accessToken = await exchangeCodeForToken(code, true);
    const linkedinProfile = await getLinkedInProfile(accessToken);

    await connectDB();

    // Check if user exists by LinkedIn ID
    let user = await User.findOne({ "linkedin.linkedinId": linkedinProfile.sub });

    // If not found by LinkedIn ID, try by email
    if (!user && linkedinProfile.email) {
      user = await User.findOne({ email: linkedinProfile.email.toLowerCase() });

      // Link LinkedIn to existing email account
      if (user) {
        user.linkedin = {
          isVerified: true,
          verifiedAt: new Date(),
          linkedinId: linkedinProfile.sub,
          profileData: {
            name: linkedinProfile.name,
            email: linkedinProfile.email,
            picture: linkedinProfile.picture,
            givenName: linkedinProfile.given_name,
            familyName: linkedinProfile.family_name,
          },
        };
        await user.save();
      }
    }

    if (user) {
      // Existing user — log them in
      if (user.isBanned) {
        return NextResponse.redirect(
          "qupdating://linkedin-login-callback?error=banned"
        );
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return NextResponse.redirect(
        `qupdating://linkedin-login-callback?action=login&token=${token}&userId=${user._id}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`
      );
    }

    // New user — redirect with LinkedIn data for registration
    const linkedinData = encodeURIComponent(
      JSON.stringify({
        linkedinId: linkedinProfile.sub,
        name: linkedinProfile.name,
        email: linkedinProfile.email,
        picture: linkedinProfile.picture,
        givenName: linkedinProfile.given_name,
        familyName: linkedinProfile.family_name,
      })
    );

    return NextResponse.redirect(
      `qupdating://linkedin-login-callback?action=register&linkedinData=${linkedinData}`
    );
  } catch (err) {
    console.error("LinkedIn login callback error:", err);
    return NextResponse.redirect(
      `qupdating://linkedin-login-callback?error=${encodeURIComponent(err.message)}`
    );
  }
}
