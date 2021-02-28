"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBill = void 0;
const express_validator_1 = require("express-validator");
const validateBill = () => [
    express_validator_1.check("companies").isString().notEmpty(),
    express_validator_1.check("jobs.*.type").isString().notEmpty(),
    express_validator_1.check("jobs.*.amount").isString().notEmpty(),
    express_validator_1.check("jobs.*.price").isString().notEmpty(),
    express_validator_1.check("jobs.*.name").isString().notEmpty(),
];
exports.validateBill = validateBill;
