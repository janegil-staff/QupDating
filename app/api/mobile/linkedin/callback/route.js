// app/api/mobile/linkedin/callback/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { exchangeCodeForToken, getLinkedInProfile } from "@/lib/linkedin";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Deep link back to the mobile app
    const appRedirect = "qupdating://linkedin-callback";

    // User denied permission
    if (error) {
      return NextResponse.redirect(`${appRedirect}?error=denied`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${appRedirect}?error=missing_params`);
    }

    // Decode state to get userId
    let userId;
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
      userId = decoded.userId;
    } catch {
      return NextResponse.redirect(`${appRedirect}?error=invalid_state`);
    }

    if (!userId) {
      return NextResponse.redirect(`${appRedirect}?error=invalid_state`);
    }

    await connectDB();

    // Exchange authorization code for access token
    const tokenData = await exchangeCodeForToken(code);

    // Fetch LinkedIn profile using access token
    const profile = await getLinkedInProfile(tokenData.access_token);

    // Prevent same LinkedIn account being used on multiple Qup accounts
    const existingUser = await User.findOne({
      "linkedin.linkedinId": profile.sub,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return NextResponse.redirect(`${appRedirect}?error=already_linked`);
    }

    // Update user with LinkedIn verification data
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "linkedin.isVerified": true,
        "linkedin.verifiedAt": new Date(),
        "linkedin.linkedinId": profile.sub,
        "linkedin.profileData": {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          givenName: profile.given_name,
          familyName: profile.family_name,
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.redirect(`${appRedirect}?error=user_not_found`);
    }

    return NextResponse.redirect(`${appRedirect}?success=true`);
  } catch (err) {
    console.error("LinkedIn callback error:", err);
    return NextResponse.redirect("qupdating://linkedin-callback?error=server_error");
  }
}
