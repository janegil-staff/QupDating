import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
