import { check } from "express-validator";

export const validateProfile = () => [
  check("companyName").isString().notEmpty(),
  check("street").isString().notEmpty(),
  check("postal").isString().notEmpty().isLength({ min: 5, max: 5 }),
  check("city").isString().notEmpty(),
  check("tel").isString().notEmpty(),
  check("taxNumber").isString().notEmpty(),
  check("taxId").isString(),
  check("firstName").isString().notEmpty(),
  check("lastName").isString().notEmpty(),
  check("iban").isString().notEmpty().isLength({ min: 27, max: 27 }),
  check("bic").isString().notEmpty(),
  check("defaultText").isString().notEmpty().isLength({ min: 50, max: 250 }),
];
