"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth = void 0;
const express_validator_1 = require("express-validator");
const validateAuth = () => [
    express_validator_1.check("email").isString().notEmpty().isEmail(),
    express_validator_1.check("password").isString().notEmpty().isLength({ min: 6 }),
];
exports.validateAuth = validateAuth;
