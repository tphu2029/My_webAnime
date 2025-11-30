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

    // Verify token
    // Nếu token lỗi, nó sẽ tự động nhảy xuống khối catch
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword"
    );

    if (!user) {
      // Token hợp lệ nhưng user không còn tồn tại
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

// Middleware để kiểm tra quyền admin
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // Nếu là admin thì cho qua
    next();
  } else {
    // Nếu không phải admin
    return res
      .status(403)
      .json({ message: "Access denied. Admin rights required." });
  }
};
