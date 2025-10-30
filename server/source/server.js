import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cookieParser());

// public route
app.use("/api/auth", authRoute);

// private route
app.use(protectedRoute);
app.use("/api/user", userRoute);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
