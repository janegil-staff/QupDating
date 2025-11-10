import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
  bio: String,
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
