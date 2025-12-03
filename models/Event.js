import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: false }, // e.g. "Bergen, Vestland, Norway"
  lat: { type: Number, required: false },
  lng: { type: Number, required: false },
  country: { type: String, required: false }, // ✅ new field
});

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: locationSchema,
    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isApproved: {
      type: Boolean,
      default: false, // admins can approve events before they go public
    },
  },
  { timestamps: true }
);

// Avoid recompiling model in dev
export default mongoose.models.Event || mongoose.model("Event", EventSchema);
