// models/News.js
import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 150,
    },
    type: {
      type: String,
      enum: ["tip", "update"],
      default: "update",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model("News", newsSchema);
