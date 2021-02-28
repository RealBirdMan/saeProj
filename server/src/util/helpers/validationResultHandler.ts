import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { HttpError } from "./../../models/HttpError";

export const validationResultHandler: RequestHandler = (
  req: any,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }
};
