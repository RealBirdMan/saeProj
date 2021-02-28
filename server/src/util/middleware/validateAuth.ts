import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import jwt from "jsonwebtoken";

import { Jwt_Secret } from "../../config/config";
import { HttpError } from "../../models/HttpError";

export const validateAuth = () => [
  check("email").isString().notEmpty().isEmail(),
  check("password").isString().notEmpty().isLength({ min: 6 }),
];

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Auth Failed");
    }
    const decodedToken = jwt.verify(token, Jwt_Secret) as { userId: string };
    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    return next(
      new HttpError(
        "Authentifizierung fehlgeschlagen, bitte erneut einloggen",
        403
      )
    );
  }
};
