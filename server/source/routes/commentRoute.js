import express from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route - Ai cũng có thể xem bình luận
router.get("/:mediaType/:mediaId", getComments);

// Private routes - Phải đăng nhập mới được bình luận hoặc xóa
router.post("/", protectedRoute, createComment);
router.delete("/:id", protectedRoute, deleteComment);

export default router;