import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

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
