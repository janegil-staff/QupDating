import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema({
  viewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  viewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure uniqueness: one record per viewer/viewedUser pair
profileViewSchema.index({ viewer: 1, viewedUser: 1 }, { unique: true });

export default mongoose.models.ProfileView ||
  mongoose.model("ProfileView", profileViewSchema);
