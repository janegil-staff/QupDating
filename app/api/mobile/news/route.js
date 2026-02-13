// app/api/mobile/news/route.js
import { NextResponse } from "next/server";
import News from "@/models/News";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    // Get active news items, sorted by newest first
    const items = await News.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // If no items in DB, return defaults
    if (!items || items.length === 0) {
      return NextResponse.json({
        items: [
          { text: "Welcome to QUP! Complete your profile to get more matches.", type: "update" },
          { text: "Tip: Verified profiles get 3x more matches. Verify now!", type: "tip" },
          { text: "Tip: Write a thoughtful bio — it's your first impression.", type: "tip" },
          { text: "New: Sign in with Apple and Google for faster access.", type: "update" },
          { text: "Tip: Be genuine in your messages — authenticity attracts.", type: "tip" },
        ],
      });
    }

    return NextResponse.json({
      items: items.map((item) => ({
        text: item.text,
        type: item.type || "update",
      })),
    });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({
      items: [
        { text: "Welcome to QUP Dating!", type: "update" },
      ],
    });
  }
}
