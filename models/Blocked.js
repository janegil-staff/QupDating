import mongoose from "mongoose";

const BlockedSchema = new mongoose.Schema(
  {
    blocker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Force the collection name to be exactly "Blocked"
export default mongoose.models.Blocked ||
  mongoose.model("Blocked", BlockedSchema, "Blocked");
