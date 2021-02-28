"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationResultHandler = void 0;
const express_validator_1 = require("express-validator");
const HttpError_1 = require("./../../models/HttpError");
const validationResultHandler = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError_1.HttpError("Invalid inputs passed", 422));
    }
};
exports.validationResultHandler = validationResultHandler;
