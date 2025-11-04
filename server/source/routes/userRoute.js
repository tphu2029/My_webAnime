import e from "express";
import {
  authMe,
  toggleFavorite,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";

const router = e.Router();

// lay thong tin
router.get("/me", authMe);

// them/xoa muc yeu thich
router.put("/favorites", toggleFavorite);

router.put("/profile", updateProfile); // Để cập nhật thông tin
router.put("/password", updatePassword); // Để đổi mật khẩu
export default router;
