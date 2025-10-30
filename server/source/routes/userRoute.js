import e from "express";
import { authMe } from "../controllers/userController.js";

const router = e.Router();

router.get("/me", authMe);
export default router;
