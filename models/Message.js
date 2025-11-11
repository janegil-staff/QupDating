import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  roomId: String,
  content: String,
  sender: String,
  senderName: String,
  senderImage: String,
  createdAt: String,
});

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
