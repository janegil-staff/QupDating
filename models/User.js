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
    birthdate: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      lowercase: true,
      required: true,
    },
    occupation: { type: String },

    // ⭐ NEW PROFESSIONAL FIELDS (REQUIRED FOR APPLE)
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    industry: { 
      type: String, 
      required: true,
      enum: [
        'Technology',
        'Finance',
        'Healthcare',
        'Education',
        'Marketing',
        'Sales',
        'Engineering',
        'Law',
        'Consulting',
        'Real Estate',
        'Media',
        'Other',
        ''
      ]
    },
    educationLevel: { 
      type: String, 
      required: true,
      enum: [
        'High School',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'MBA',
        'PhD',
        'Professional Degree (MD, JD, etc)',
        ''
      ]
    },

    // Appearance
    appearance: {
      type: String,
      enum: ["normal", "pretty", "cute", "handsome", "stylish", "unique", ""],
      lowercase: true,
    },
    height: { type: Number },
    bodyType: {
      type: String,
      enum: ["slim", "average", "athletic", "curvy", "muscular", ""],
      lowercase: true,
    },

    // Lifestyle
    hasChildren: { type: Boolean },
    wantsChildren: { type: Boolean },
    smoking: {
      type: String,
      enum: ["yes", "no", "occasionally", ""],
      lowercase: true,
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
    willingToRelocate: { type: Boolean },
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
    bio: { type: String },
    lookingFor: { type: String },
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
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
