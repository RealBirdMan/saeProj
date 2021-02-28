"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProfile = void 0;
const express_validator_1 = require("express-validator");
const validateProfile = () => [
    express_validator_1.check("companyName").isString().notEmpty(),
    express_validator_1.check("street").isString().notEmpty(),
    express_validator_1.check("postal").isString().notEmpty().isLength({ min: 5, max: 5 }),
    express_validator_1.check("city").isString().notEmpty(),
    express_validator_1.check("tel").isString().notEmpty(),
    express_validator_1.check("taxNumber").isString().notEmpty(),
    express_validator_1.check("taxId").isString(),
    express_validator_1.check("firstName").isString().notEmpty(),
    express_validator_1.check("lastName").isString().notEmpty(),
    express_validator_1.check("iban").isString().notEmpty().isLength({ min: 27, max: 27 }),
    express_validator_1.check("bic").isString().notEmpty(),
    express_validator_1.check("defaultText").isString().notEmpty().isLength({ min: 50, max: 250 }),
];
exports.validateProfile = validateProfile;
