import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  registerPet,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT protect middleware

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require valid JWT token)
router.get("/profile", protect, getProfile);
router.post("/pets", protect, registerPet);

export default router;
