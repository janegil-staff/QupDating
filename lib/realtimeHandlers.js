// lib/realtimeHandlers.js
import Message from "@/models/Message";
import User from "@/models/User";

// Save and shape message payload
export async function persistMessage({ matchId, senderEmail, text }) {
  const sender = await User.findOne({ email: senderEmail }).lean();
  const msg = await Message.create({
    matchId,
    sender: sender._id,
    text,
  });
  return {
    _id: msg._id.toString(),
    matchId,
    text,
    createdAt: msg.createdAt,
    sender: { _id: sender._id.toString(), name: sender.name },
  };
}
