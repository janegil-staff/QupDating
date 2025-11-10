// models/Match.js
import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);
