import e from "express";
import mongoose from "mongoose";

const favoriteItemSchema = new mongoose.Schema(
  {
    mediaId: { type: String, required: true },
    mediaType: { type: String, required: true, enum: ["movie", "tv"] },
    posterPath: { type: String, required: true },
    title: { type: String, required: true },
  },
  { _id: false }
);
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    hashedPassword: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" }, // URL to the avatar image
    avatarId: { type: String, default: "" }, // ID for avatar management (e.g., cloud storage ID)
    bio: { type: String, maxLength: 500, default: "" }, // User biography
    phone: { type: String, spare: true, default: "" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
