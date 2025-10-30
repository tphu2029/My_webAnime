import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    ("Bearer TOKEN");

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Verify token (dùng await, không dùng callback)
    // Nếu token lỗi, nó sẽ tự động nhảy xuống khối catch
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword"
    );

    if (!user) {
      // Token hợp lệ nhưng user không còn tồn tại (ví dụ: đã bị xóa)
      return res.status(404).json({ message: "User not found." });
    }

    // Gắn user vào request và cho đi tiếp
    req.user = user;
    next();
  } catch (error) {
    console.error("protectedRoute error:", error.message);

    // Xử lý các lỗi JWT cụ thể
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      // Nếu token hết hạn hoặc không hợp lệ
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // Các lỗi khác
    return res.status(500).json({ message: "Internal server error." });
  }
};
