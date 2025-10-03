import { body, param } from "express-validator";
import validatorMiddleWare from "./validator.middleWare";
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ParamsDictionary,
} from "express-serve-static-core";
import User from "../../models/userModel";
export const signUpValidator: RequestHandler[] = [
  body("name")
    .isLength({ min: 6, max: 32 })
    .withMessage("a name must be of length 6 ,above or 32"),
  body("email")
    .isEmail()
    .withMessage("invalid email format")
    .notEmpty()
    .withMessage("email is required")
    .custom(async (val: string, { req }) => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error("email is already exist");
      }
      return true;
    }),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage("a password must be of length 6 ,above or 32")
    .custom((val: string, { req }) => {
      if (req.body.passwordConfirm !== val) {
        throw new Error("password and confirm password must be the same");
      }
      return true;
    }),
  body("passwordConfirm")
    .isLength({ min: 6, max: 32 })
    .withMessage("a passwordConfirm must be of length 6 ,above or 32"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("invalid phone number format"),
  validatorMiddleWare,
];

export const logInValidator: RequestHandler[] = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
  validatorMiddleWare,
];

export const forgetPasswordValidator: RequestHandler[] = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email has incorrect format"),
  validatorMiddleWare,
];

export const resetPasswordValidator: RequestHandler[] = [
  param("passwordResetToken")
    .notEmpty()
    .withMessage("passwordResetToken is required"),
  body("newPassword")
    .isLength({ min: 6, max: 32 })
    .withMessage("a password must be of length 6 ,above or 32")
    .custom((val: string, { req }) => {
      if (req.body.newPasswordConfirm !== val) {
        throw new Error("newPassword and newPasswordConfirm must be the same");
      }
      return true;
    }),
  body("newPasswordConfirm")
    .isLength({ min: 6, max: 32 })
    .withMessage("a newPasswordConfirm must be of length 6 ,above or 32"),
  validatorMiddleWare,
];
