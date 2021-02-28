"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateAuth_1 = require("../../util/middleware/validateAuth");
const authController_1 = require("../../controllers/auth/authController");
const router = express_1.Router();
// @route   POST api/auth/register
// @desc    Register a User
// @access  Public
router.post("/register", validateAuth_1.validateAuth(), authController_1.register);
// @route   POST api/auth/login
// @desc    Login a User
// @access  Public
router.post("/login", validateAuth_1.validateAuth(), authController_1.login);
exports.default = router;
