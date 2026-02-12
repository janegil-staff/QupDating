import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String }, // e.g. "bergen, vestland, norway"
  lat: { type: Number },
  lng: { type: Number },
  country: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    birthdate: {
      type: Date,
      default: () => new Date(new Date().getFullYear() - 20, 0, 1),
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      lowercase: true,
      required: true,
      default: "male",
    },
    occupation: { type: String },
    company: { type: String },
    industry: {
      type: String,
      enum: [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Marketing",
        "Sales",
        "Engineering",
        "Law",
        "Consulting",
        "Real Estate",
        "Media",
        "Other",
        "",
      ],
    },
    education: {
      type: String,
      enum: [
        "High School",
        "Bachelor's Degree",
        "Master's Degree",
        "MBA",
        "PhD",
        "Professional Degree (MD, JD, etc)",
        "",
      ],
    },
    linkedin: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      linkedinId: { type: String, index: true },
      profileData: {
        name: { type: String },
        email: { type: String },
        picture: { type: String },
        givenName: { type: String },
        familyName: { type: String },
      },
    },
    // Appearance
    appearance: {
      type: String,
      enum: ["normal", "pretty", "cute", "handsome", "stylish", "unique", ""],
      lowercase: true,
      default: "normal",
    },
    height: { type: Number },
    bodyType: {
      type: String,
      enum: ["slim", "average", "athletic", "curvy", "muscular", ""],
      lowercase: true,
      default: "average",
    },

    // Lifestyle
    hasChildren: { type: Boolean, default: false },
    wantsChildren: { type: Boolean, default: false },
    smoking: {
      type: String,
      enum: ["yes", "no", "occasionally", ""],
      lowercase: true,
      default: "no",
    },
    drinking: {
      type: String,
      enum: ["none", "light / social drinker", "heavy", ""],
      lowercase: true,
    },
    exercise: {
      type: String,
      enum: ["never", "sometimes", "regularly", "daily", ""],
      lowercase: true,
    },
    diet: {
      type: String,
      enum: ["vegetarian", "vegan", "omnivore", "other", ""],
      lowercase: true,
    },

    // Details
    relationshipStatus: {
      type: String,
      enum: ["single", "in a relationship", "married", "divorced", ""],
      lowercase: true,
    },
    willingToRelocate: { type: Boolean, default: false },
    education: { type: String },
    religion: {
      type: String,
      enum: [
        "christian",
        "muslim",
        "jewish",
        "buddhist",
        "ateist",
        "other",
        "agnostic",
        "none",
        "",
      ],
      lowercase: true,
    },

    // Other profile fields
    tags: [{ type: String }],
    location: locationSchema,
    searchScope: {
      type: String,
      enum: ["nearby", "regional", "national", "worldwide", ""],
      lowercase: true,
      default: "worldwide",
    },
    bio: { type: String, default: "" },
    lookingFor: { type: String, default: "relationship" },
    images: [{ url: String, public_id: String }],
    profileImage: { type: String },

    // Social connections
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Admin fields
    role: {
      type: String,
      enum: ["user", "moderator", "admin", "banned", ""],
      lowercase: true,
      default: "user",
    },
    lastSeen: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false }, // ⭐ Used for professional verification badge
    verifyToken: { type: String },
    verifyExpires: { type: Date },

    // Preferences
    preferredAgeMin: { type: Number, default: 18 },
    preferredAgeMax: { type: Number, default: 99 },
    profileCompletionPercent: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
