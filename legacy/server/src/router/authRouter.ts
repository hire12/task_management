import express, { Request, Response } from "express";
import { registerUser, logoutUser } from "../controller/authController";
import {loginUser} from '../controller/authController'

import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();


// Register a new user
router.post("/register", registerUser);

// Login user

router.post("/login", loginUser);


// Logout user (protected route)
router.post("/logout", authenticate, logoutUser);

export default router;
