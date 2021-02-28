import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Jwt_Secret } from "../../config/config";
import { HttpError } from "../../models/HttpError";
import User from "../../models/UserModel";
import { Status } from "../../util/interface/userInterface";
import { validationResultHandler } from "./../../util/helpers/validationResultHandler";

/*=========================================================================================================
Register Controller
===========================================================================================================*/
export const register: RequestHandler = async (req, res, next) => {
  validationResultHandler(req, res, next);

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError(err, 500));
  }
  if (existingUser)
    return next(new HttpError("Dieser Benutzer existiert bereits", 422));

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  const newUser = new User({
    email,
    password: hashedPassword,
    status: Status.inactive,
    profile: null,
  });

  let token;
  try {
    await newUser.save();
    token = await jwt.sign(
      { userId: newUser.id, status: newUser.status },
      Jwt_Secret,
      {
        expiresIn: "3h",
      }
    );
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  res.status(201).json({
    message: "User successfully created",
    userId: newUser.id,
    status: newUser.status,
    token: token,
  });
};

/*=========================================================================================================
Login Controller
===========================================================================================================*/
export const login: RequestHandler = async (req, res, next) => {
  validationResultHandler(req, res, next);

  const { email, password } = req.body;

  let isValidPassword;
  let existingUser;
  let token;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
      token = await jwt.sign(
        { userId: existingUser.id, status: existingUser.status },
        Jwt_Secret,
        {
          expiresIn: "3h",
        }
      );
    }
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  if (!existingUser || !isValidPassword)
    return next(new HttpError("Falsches Passwort oder Email Adresse", 401));

  res.status(201).json({
    message: "succesfully login",
    userId: existingUser.id,
    status: existingUser.status,
    token: token,
  });
};
