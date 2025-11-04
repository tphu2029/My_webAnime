import e from "express";
import { authMe, toggleFavorite } from "../controllers/userController.js";

const router = e.Router();

// lay thong tin
router.get("/me", authMe);

// them/xoa
router.put("/favorites", toggleFavorite);

export default router;
