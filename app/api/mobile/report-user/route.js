import { connectDB } from "@/lib/db";
import Report from "@/models/Report";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { reportedUser, reporter, reason, timestamp } = body;
    
    if (!reportedUser || !reason) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    await Report.create({
      reportedUser,
      reporter,
      reason,
      timestamp: timestamp || Date.now(),
    });

    return new Response(JSON.stringify({ message: "Report submitted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Report error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
