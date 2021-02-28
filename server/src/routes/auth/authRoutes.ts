import { Router } from "express";

import { validateAuth } from "../../util/middleware/validateAuth";
import { login, register } from "../../controllers/auth/authController";

const router = Router();

// @route   POST api/auth/register
// @desc    Register a User
// @access  Public
router.post("/register", validateAuth(), register);

// @route   POST api/auth/login
// @desc    Login a User
// @access  Public
router.post("/login", validateAuth(), login);

export default router;
