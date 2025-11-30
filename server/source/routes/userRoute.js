import e from "express";
// Import các controller functions
import {
  authMe,
  toggleFavorite,
  updatePassword,
  updateProfile,
  getAllUsers,
} from "../controllers/userController.js";

import {
  protectedRoute,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

// Tạo router instance
const router = e.Router();

// Route GET /user/me - Lấy thông tin user hiện tại
router.get("/me", authMe);

// Route PUT /user/favorites - Thêm/xóa phim khỏi danh sách yêu thích
router.put("/favorites", toggleFavorite);

// Route PUT /user/profile - Cập nhật thông tin profile (displayName, phone, bio)
router.put("/profile", updateProfile);

// Route PUT /user/password - Đổi mật khẩu
router.put("/password", updatePassword);

// Route GET /user/list - Lấy danh sách tất cả user (chỉ admin mới được phép)
router.get("/list", protectedRoute, authorizeAdmin, getAllUsers);
export default router;
