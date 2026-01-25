import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    roomId: String,
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName: String,
    senderImage: String,
    images: [{ url: String, public_id: String }],
    read: { type: Boolean, default: false },
  },

  { timestamps: true },
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
