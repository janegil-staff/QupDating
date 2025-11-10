// models/Like.js
import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Like || mongoose.model("Like", LikeSchema);
