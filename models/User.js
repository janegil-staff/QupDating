import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: ["male", "female", "other"] },
  bio: String,
  images: [{ url: String, public_id: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
