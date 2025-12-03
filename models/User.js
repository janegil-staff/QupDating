import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: false }, // e.g. "Bergen, Vestland, Norway"
  lat: { type: Number, required: false },
  lng: { type: Number, required: false },
  country: { type: String, required: false }, // ✅ new field
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ ensures DB-level uniqueness
      lowercase: true, // normalize
      trim: true,
    },
    birthdate: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    occupation: { type: String },
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
    location: locationSchema,
    searchScope: {
      type: String,
      enum: ["Nearby", "Regional", "National", "Worldwide"],
      default: "Worldwide",
    },
    bio: { type: String },
    lookingFor: { type: String },
    images: [{ url: String, public_id: String }],
    profileImage: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "banned"],
      default: "user",
    },
    lastSeen: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyExpires: { type: Date },
    preferredAgeMin: { type: Number, default: 18 },
    preferredAgeMax: { type: Number, default: 99 },
    profileCompletionPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
