"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCompany = void 0;
const express_validator_1 = require("express-validator");
const validateCompany = () => [
    express_validator_1.check("companyName").isString().notEmpty(),
    express_validator_1.check("companyStreet").isString().notEmpty(),
    express_validator_1.check("companyPostal").isString().notEmpty().isLength({ min: 5, max: 5 }),
    express_validator_1.check("companyCity").isString().notEmpty(),
];
exports.validateCompany = validateCompany;
