import e from "express";
import mongoose from "mongoose";

// Schema cho một mục yêu thích (phim/TV show)
const favoriteItemSchema = new mongoose.Schema(
  {
    mediaId: { type: String, required: true }, // ID của phim/TV show từ TMDB API
    mediaType: { type: String, required: true, enum: ["movie", "tv"] }, // Loại media: movie hoặc tv
    posterPath: { type: String, required: true }, // Đường dẫn đến poster image
    title: { type: String, required: true }, // Tiêu đề phim/TV show
  },
  { _id: false } // Không tạo _id riêng cho sub-document này
);

// Schema chính cho User
const userSchema = new mongoose.Schema(
  {
    // Tên đăng nhập (unique, chữ thường, bắt buộc)
    username: {
      type: String,
      required: true,
      trim: true, // Tự động xóa khoảng trắng đầu/cuối
      lowercase: true, // Tự động chuyển thành chữ thường
      unique: true, // Đảm bảo không trùng lặp
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Chỉ chấp nhận 'user' hoặc 'admin'
      default: "user", // Mặc định khi đăng ký là 'user'
    },
    // Mật khẩu đã được hash (bắt buộc)
    hashedPassword: { type: String, required: true },
    // Email (unique, chữ thường, bắt buộc)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Tên hiển thị của người dùng
    displayName: { type: String, required: true, trim: true },
    // URL của avatar (mặc định rỗng)
    avatarUrl: { type: String, default: "" },
    // ID avatar để quản lý (ví dụ: cloud storage ID)
    avatarId: { type: String, default: "" },
    // Tiểu sử người dùng (tối đa 500 ký tự)
    bio: { type: String, maxLength: 500, default: "" },
    // Số điện thoại (không bắt buộc)
    phone: { type: String, spare: true, default: "" },
    // Danh sách phim/TV show yêu thích
    favorites: { type: [favoriteItemSchema], default: [] },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model User từ schema
const User = mongoose.model("User", userSchema);

// Export model để sử dụng ở file khác
export default User;
