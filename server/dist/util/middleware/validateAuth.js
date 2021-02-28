"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = exports.validateAuth = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const HttpError_1 = require("../../models/HttpError");
const validateAuth = () => [
    express_validator_1.check("email").isString().notEmpty().isEmail(),
    express_validator_1.check("password").isString().notEmpty().isLength({ min: 6 }),
];
exports.validateAuth = validateAuth;
const isAuth = (req, res, next) => {
    var _a;
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new Error("Auth Failed");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.Jwt_Secret);
        req.userData = { userId: decodedToken.userId };
        next();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Authentifizierung fehlgeschlagen, bitte erneut einloggen", 403));
    }
};
exports.isAuth = isAuth;
