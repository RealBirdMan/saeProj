import { check } from "express-validator";

export const validateBill = () => [
  check("companies").isString().notEmpty(),
  check("jobs.*.type").isString().notEmpty(),
  check("jobs.*.amount").isString().notEmpty(),
  check("jobs.*.price").isString().notEmpty(),
  check("jobs.*.name").isString().notEmpty(),
];
