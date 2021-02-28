import { check } from "express-validator";

export const validateCompany = () => [
  check("companyName").isString().notEmpty(),
  check("companyStreet").isString().notEmpty(),
  check("companyPostal").isString().notEmpty().isLength({ min: 5, max: 5 }),
  check("companyCity").isString().notEmpty(),
];
