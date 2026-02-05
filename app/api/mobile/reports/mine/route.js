import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getMobileUser } from "@/lib/authMobile";

export async function GET(req) {
  try {
    await connectDB();

    const user = await getMobileUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await Report.find({ reporter: user._id })
      .select("reportedUser reason status createdAt");

    return NextResponse.json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    return NextResponse.json(
      { error: "Failed to load reports" },
      { status: 500 }
    );
  }
}
