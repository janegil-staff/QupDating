import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: false }, // e.g. "Bergen, Vestland, Norway"
  lat: { type: Number, required: false },
  lng: { type: Number, required: false },
  country: { type: String, required: false }, // ✅ new field
});

// Avoid recompiling model in dev
export default mongoose.models.Location || mongoose.model("Location", locationSchema);
