"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const HttpError_1 = require("../../models/HttpError");
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const userInterface_1 = require("../../util/interface/userInterface");
const validationResultHandler_1 = require("./../../util/helpers/validationResultHandler");
/*=========================================================================================================
Register Controller
===========================================================================================================*/
const register = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await UserModel_1.default.findOne({ email });
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    if (existingUser)
        return next(new HttpError_1.HttpError("Dieser Benutzer existiert bereits", 422));
    let hashedPassword;
    try {
        hashedPassword = await bcryptjs_1.default.hash(password, 12);
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    const newUser = new UserModel_1.default({
        email,
        password: hashedPassword,
        status: userInterface_1.Status.inactive,
        profile: null,
    });
    let token;
    try {
        await newUser.save();
        token = await jsonwebtoken_1.default.sign({ userId: newUser.id, status: newUser.status }, config_1.Jwt_Secret, {
            expiresIn: "3h",
        });
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    res.status(201).json({
        message: "User successfully created",
        userId: newUser.id,
        status: newUser.status,
        token: token,
    });
};
exports.register = register;
/*=========================================================================================================
Login Controller
===========================================================================================================*/
const login = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    const { email, password } = req.body;
    let isValidPassword;
    let existingUser;
    let token;
    try {
        existingUser = await UserModel_1.default.findOne({ email });
        if (existingUser) {
            isValidPassword = await bcryptjs_1.default.compare(password, existingUser.password);
            token = await jsonwebtoken_1.default.sign({ userId: existingUser.id, status: existingUser.status }, config_1.Jwt_Secret, {
                expiresIn: "3h",
            });
        }
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    if (!existingUser || !isValidPassword)
        return next(new HttpError_1.HttpError("Falsches Passwort oder Email Adresse", 401));
    res.status(201).json({
        message: "succesfully login",
        userId: existingUser.id,
        status: existingUser.status,
        token: token,
    });
};
exports.login = login;
