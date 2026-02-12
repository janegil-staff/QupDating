import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    const totalUsers = await User.countDocuments({ isVerified: true });
    const linkedinVerified = await User.countDocuments({
      "linkedin.isVerified": true,
    });
    const verifiedPercent =
      totalUsers > 0 ? Math.round((linkedinVerified / totalUsers) * 100) : 0;

    return NextResponse.json({
      totalUsers,
      linkedinVerified,
      verifiedPercent,
    });
  } catch (err) {
    return NextResponse.json({
      totalUsers: 0,
      linkedinVerified: 0,
      verifiedPercent: 0,
    });
  }
}
