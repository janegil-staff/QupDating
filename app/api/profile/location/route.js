// app/api/profile/location/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await req.json();
    const { coords, locationName } = body;

    if (!coords || !locationName) {
      return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          location: {
            name: locationName,
            lat: Number(coords.lat),
            lng: Number(coords.lng),
          },
        },
      },
      { new: true }
    );

    return new Response(JSON.stringify({ success: true, user: updatedUser }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
