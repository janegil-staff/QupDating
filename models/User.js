import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    appearance: { type: String },
    height: { type: Number },
    bodyType: { type: String },
    hasChildren: { type: Boolean },
    wantsChildren: { type: Boolean },
    smoking: { type: String, enum: ["Yes", "No", "Occasionally"] },
    drinking: {
      type: String,
      enum: ["None", "Light / social drinker", "Heavy"],
    },
    relationshipStatus: { type: String },
    willingToRelocate: { type: Boolean },
    education: { type: String },
    religion: { type: String },
    tags: [{ type: String }], // e.g. ["#CatLover", "#traveling"]
    location: { type: String },
    bio: { type: String },
    lookingFor: { type: String },
    images: [{ url: String, public_id: String }],
    profileImage: {
      type: String, // URL of the selected image
      required: true, // fallback if none selected
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);