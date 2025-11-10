import User from "@/models/User";
import mongoose from "mongoose";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI);
}

export async function GET(req, context ) {
  const { id } = await context.params;
  const user = await User.findById(id).lean();
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }
  return new Response(JSON.stringify({ user }), { status: 200 });
}